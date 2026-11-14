import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const readFile = (relPath) => fs.readFileSync(path.resolve(process.cwd(), relPath), 'utf-8');
const adminHtmlRaw = readFile('admin.html');
const i18nCode = readFile('i18n.js');

function extractBodyHtml(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const raw = match ? match[1] : html;
  return raw.replace(/<script[\s\S]*?<\/script>/gi, '');
}

function createSampleStats(overrides = {}) {
  return {
    users: { total: 120, dau: 18, wau: 45, mau: 82, new_7d: 9, new_30d: 27 },
    plans: {
      free: 90,
      play_monthly: 10,
      play_annual: 4,
      trial: 5,
      gift: 3,
      admin: 2,
      household_pro: 6,
      on_hold: 1,
      canceled_active: 2
    },
    catalog: {
      total_recipes: 640,
      total_meal_plans: 210,
      total_shopping_items: 850,
      total_households: 18,
      paused_households: 3
    },
    top_domains: [
      { domain: 'directoalpaladar.com', count: 84 },
      { domain: 'recetasgratis.net', count: 42 }
    ],
    ai: {
      today_calls: 37,
      today_ok: 36,
      today_error: 1,
      period_days: 30,
      calls_total: 400,
      calls_ok: 390,
      calls_error: 8,
      calls_reset: 2,
      prompt_tokens: 400000,
      output_tokens: 100000,
      by_feature_model: [
        {
          feature: 'weekly_plan',
          model: 'gemini-3.8-flash',
          calls: 100,
          ok_calls: 96,
          error_calls: 2,
          reset_calls: 2,
          prompt_tokens: 200000,
          output_tokens: 50000
        },
        {
          feature: 'guided_query',
          model: 'gemini-3.5-flash-lite',
          calls: 300,
          ok_calls: 294,
          error_calls: 6,
          reset_calls: 0,
          prompt_tokens: 200000,
          output_tokens: 50000
        }
      ]
    },
    ...overrides
  };
}

function createMockSupabase({ session = null, isAdmin = false, stats = createSampleStats() } = {}) {
  const rpcCalls = [];
  const authListeners = [];

  return {
    rpcCalls,
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { session }, error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn((cb) => {
        authListeners.push(cb);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      emitAuthEvent(event, nextSession) {
        authListeners.forEach((cb) => cb(event, nextSession));
      }
    },
    rpc: vi.fn(async (fnName, params) => {
      rpcCalls.push({ fnName, params });
      if (fnName === 'is_admin') {
        return { data: isAdmin, error: null };
      }
      if (fnName === 'admin_get_dashboard_stats') {
        return { data: stats, error: null };
      }
      return { data: null, error: null };
    })
  };
}

describe('US-87b: Sabory Admin Portal (/admin.html), Auth Guard y Dashboard KPIs', () => {
  let SaboryAdminApp;

  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('lang', 'es');
    window.__SABORY_ADMIN_DISABLE_AUTO_INIT__ = true;
    document.body.innerHTML = extractBodyHtml(adminHtmlRaw);

    new Function(i18nCode)();
    window.I18n.setPreference('es');

    ({ SaboryAdminApp } = await import('../src/admin/admin-app.js'));
  });

  describe('1. Seguridad, Metadatos SEO, Aislamiento SW e i18n', () => {
    it('admin.html declara noindex/nofollow, referrer-policy, SRI en Supabase y no contiene service_role', () => {
      expect(adminHtmlRaw).toContain('<meta name="robots" content="noindex, nofollow">');
      expect(adminHtmlRaw).toContain('<meta name="referrer" content="strict-origin-when-cross-origin">');
      expect(adminHtmlRaw).toMatch(/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@[\d.]+\/dist\/umd\/supabase\.js[\s\S]*integrity="sha384-/);
      expect(adminHtmlRaw).not.toMatch(/service_role/i);
    });

    it('sw.js mantiene admin.html y src/admin fuera de ASSETS_TO_CACHE', () => {
      const swCode = readFile('sw.js');
      expect(swCode).not.toContain('admin.html');
      expect(swCode).not.toContain('admin-app.js');
    });

    it('i18n.js define todas las claves admin.* con paridad exacta entre es y en', () => {
      const esAdminKeys = Object.keys(window.I18n.MESSAGES.es.admin || {}).sort();
      const enAdminKeys = Object.keys(window.I18n.MESSAGES.en.admin || {}).sort();
      expect(esAdminKeys.length).toBeGreaterThan(35);
      expect(esAdminKeys).toEqual(enAdminKeys);
    });
  });

  describe('2. Guard de Acceso Zero-Trust', () => {
    it('sin sesión: muestra el formulario de login, oculta #admin-shell y no consulta is_admin ni stats', async () => {
      const mockSupabase = createMockSupabase({ session: null });
      const adminApp = new SaboryAdminApp({ supabaseClient: mockSupabase });
      await adminApp.init();

      expect(document.getElementById('admin-auth-gate').hidden).toBe(false);
      expect(document.getElementById('admin-login-card').hidden).toBe(false);
      expect(document.getElementById('admin-forbidden-card').hidden).toBe(true);
      expect(document.getElementById('admin-shell').hidden).toBe(true);
      expect(mockSupabase.rpcCalls).toEqual([]);
    });

    it('con sesión normal (is_admin() === false): muestra tarjeta 403 con el email y bloquea el Dashboard', async () => {
      const mockSupabase = createMockSupabase({
        session: { user: { id: 'user-1', email: 'usuario@sabory.food' } },
        isAdmin: false
      });
      const adminApp = new SaboryAdminApp({ supabaseClient: mockSupabase });
      await adminApp.init();

      expect(document.getElementById('admin-auth-gate').hidden).toBe(false);
      expect(document.getElementById('admin-login-card').hidden).toBe(true);
      expect(document.getElementById('admin-forbidden-card').hidden).toBe(false);
      expect(document.getElementById('admin-forbidden-email').textContent).toBe('usuario@sabory.food');
      expect(document.getElementById('admin-shell').hidden).toBe(true);

      const rpcNames = mockSupabase.rpcCalls.map((c) => c.fnName);
      expect(rpcNames).toEqual(['is_admin']);
      expect(rpcNames).not.toContain('admin_get_dashboard_stats');
    });

    it('con sesión de admin (is_admin() === true): desbloquea #admin-shell y carga admin_get_dashboard_stats', async () => {
      const mockSupabase = createMockSupabase({
        session: { user: { id: 'admin-1', email: 'fjcerrudo@gmail.com' } },
        isAdmin: true
      });
      const adminApp = new SaboryAdminApp({ supabaseClient: mockSupabase });
      await adminApp.init();

      expect(document.getElementById('admin-auth-gate').hidden).toBe(true);
      expect(document.getElementById('admin-shell').hidden).toBe(false);
      expect(document.getElementById('admin-active-email').textContent).toBe('fjcerrudo@gmail.com');

      expect(mockSupabase.rpcCalls).toContainEqual({ fnName: 'is_admin', params: undefined });
      expect(mockSupabase.rpcCalls).toContainEqual({
        fnName: 'admin_get_dashboard_stats',
        params: { p_days: 30 }
      });
    });
  });

  describe('3. Renderizado del Dashboard Ejecutivo e Interacciones', () => {
    it('renderiza KPIs de usuarios, MRR/ARR, consumo IA, catálogo, desglose de planes y top dominios', async () => {
      const mockSupabase = createMockSupabase({
        session: { user: { id: 'admin-1', email: 'fjcerrudo@gmail.com' } },
        isAdmin: true,
        stats: createSampleStats()
      });
      const adminApp = new SaboryAdminApp({ supabaseClient: mockSupabase });
      await adminApp.init();

      expect(document.getElementById('kpi-total-users').textContent).toBe('120');
      expect(document.getElementById('kpi-active-users').textContent).toBe('18 / 45 / 82');
      expect(document.getElementById('kpi-pro-users').textContent).toBe('30');
      expect(document.getElementById('kpi-conversion-rate').textContent).toMatch(/11[.,]67%/);
      expect(document.getElementById('kpi-mrr-eur').textContent).toMatch(/38[.,]23\s*€/);
      expect(document.getElementById('kpi-arr-eur').textContent).toMatch(/458[.,]76\s*€/);

      expect(document.getElementById('kpi-ai-calls-today').textContent).toBe('37');
      expect(document.getElementById('kpi-ai-error-rate').textContent).toMatch(/2[.,]00%/);
      expect(document.getElementById('kpi-total-recipes').textContent).toBe('640');
      expect(document.getElementById('kpi-total-meal-plans').textContent).toBe('210');
      expect(document.getElementById('kpi-total-shopping-items').textContent).toBe('850');
      expect(document.getElementById('kpi-households-summary').textContent).toContain('18');
      expect(document.getElementById('kpi-households-summary').textContent).toContain('3');

      const breakdownHtml = document.getElementById('admin-plan-breakdown').innerHTML;
      expect(breakdownHtml).toContain('Sabory Free');
      expect(breakdownHtml).toContain('Google Play Mensual');
      expect(breakdownHtml).toContain('Google Play Anual');
      expect(breakdownHtml).toContain('Regalos / Testers (gift)');
      expect(breakdownHtml).toContain('Pro vía Hogar');

      const domainsHtml = document.getElementById('admin-top-domains').innerHTML;
      expect(domainsHtml).toContain('directoalpaladar.com');
      expect(domainsHtml).toContain('84');
      expect(domainsHtml).toContain('recetasgratis.net');
      expect(domainsHtml).toContain('42');
    });

    it('soporta login por email/password sin recortar espacios de contraseña y logout limpio', async () => {
      const mockSupabase = createMockSupabase({ session: null });
      const adminSession = { user: { id: 'admin-1', email: 'fjcerrudo@gmail.com' } };

      mockSupabase.auth.signInWithPassword.mockImplementationOnce(async () => {
        mockSupabase.auth.getSession.mockResolvedValue({ data: { session: adminSession }, error: null });
        mockSupabase.rpc.mockImplementation(async (fnName, params) => {
          mockSupabase.rpcCalls.push({ fnName, params });
          if (fnName === 'is_admin') return { data: true, error: null };
          if (fnName === 'admin_get_dashboard_stats') return { data: createSampleStats(), error: null };
          return { data: null, error: null };
        });
        return { data: { session: adminSession }, error: null };
      });

      const adminApp = new SaboryAdminApp({ supabaseClient: mockSupabase });
      await adminApp.init();

      document.getElementById('admin-login-email').value = 'fjcerrudo@gmail.com';
      document.getElementById('admin-login-password').value = ' pass con espacios ';
      document.getElementById('admin-login-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await vi.waitFor(() => {
        expect(document.getElementById('admin-shell').hidden).toBe(false);
      });

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'fjcerrudo@gmail.com',
        password: ' pass con espacios '
      });

      document.getElementById('btn-admin-logout').click();
      await vi.waitFor(() => {
        expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
        expect(document.getElementById('admin-shell').hidden).toBe(true);
      });
    });

    it('permite cambiar ventana temporal, vistas, idioma (ES/EN) y tema (light/dark)', async () => {
      const mockSupabase = createMockSupabase({
        session: { user: { id: 'admin-1', email: 'fjcerrudo@gmail.com' } },
        isAdmin: true
      });
      const adminApp = new SaboryAdminApp({ supabaseClient: mockSupabase });
      await adminApp.init();

      const periodSelect = document.getElementById('admin-dashboard-days');
      periodSelect.value = '90';
      periodSelect.dispatchEvent(new Event('change'));
      await vi.waitFor(() => {
        expect(mockSupabase.rpcCalls).toContainEqual({
          fnName: 'admin_get_dashboard_stats',
          params: { p_days: 90 }
        });
      });

      document.getElementById('admin-nav-users').click();
      expect(document.getElementById('admin-view-users').hidden).toBe(false);
      expect(document.getElementById('admin-view-dashboard').hidden).toBe(true);
      expect(document.getElementById('admin-nav-users').classList.contains('active')).toBe(true);

      document.getElementById('btn-admin-lang').click();
      expect(window.I18n.getLanguage()).toBe('en');
      expect(document.getElementById('admin-lang-code').textContent).toBe('EN');
      expect(document.querySelector('#admin-nav-users span:last-child').textContent.trim()).toBe('Users');

      document.getElementById('btn-admin-theme').click();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('fa_theme_mode')).toBe('dark');
    });
  });

  describe('4. Acceso directo desde la App Principal exclusivo para superadmin', () => {
    const indexHtmlRaw = readFile('index.html');
    const appCode = readFile('app.js');

    function mockMainSupabaseWithRole(role) {
      const maybeSingle = vi.fn().mockResolvedValue(
        role ? { data: { role }, error: null } : { data: null, error: null }
      );
      const eq = vi.fn(() => ({ maybeSingle }));
      const select = vi.fn(() => ({ eq }));
      return {
        from: vi.fn((table) => {
          if (table === 'admin_users') return { select };
          return { select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) })) })) };
        }),
        rpc: vi.fn().mockResolvedValue({ data: null, error: null })
      };
    }

    it('index.html declara los accesos directos ocultos por defecto con hidden y enlace a admin.html', () => {
      document.body.innerHTML = extractBodyHtml(indexHtmlRaw);
      ['btn-header-admin', 'btn-settings-open-admin', 'btn-auth-open-admin'].forEach((id) => {
        const el = document.getElementById(id);
        expect(el).not.toBeNull();
        expect(el.hidden).toBe(true);
        expect(el.getAttribute('href')).toBe('admin.html');
      });
    });

    it('mantiene ocultos los accesos para invitados, usuarios normales o rol distinto a superadmin, y los muestra solo con role === superadmin', async () => {
      document.body.innerHTML = extractBodyHtml(indexHtmlRaw);
      new Function(appCode)();
      const app = new window.FoodAssistantApp();
      const ids = ['btn-header-admin', 'btn-settings-open-admin', 'btn-auth-open-admin'];

      // 1. Invitado / sin sesión
      window.state.cloudUser = null;
      app.supabaseClient = mockMainSupabaseWithRole('superadmin');
      expect(await app.checkAdminRoleStatus()).toBe(false);
      ids.forEach((id) => expect(document.getElementById(id).hidden).toBe(true));

      // 2. Usuario normal (sin fila en admin_users)
      window.state.cloudUser = { id: 'user-norm', email: 'pepe@sabory.food' };
      app.supabaseClient = mockMainSupabaseWithRole(null);
      expect(await app.checkAdminRoleStatus()).toBe(false);
      ids.forEach((id) => expect(document.getElementById(id).hidden).toBe(true));

      // 3. Usuario con rol 'admin' (no 'superadmin')
      window.state.cloudUser = { id: 'user-staff', email: 'soporte@sabory.food' };
      app.supabaseClient = mockMainSupabaseWithRole('admin');
      expect(await app.checkAdminRoleStatus()).toBe(false);
      ids.forEach((id) => expect(document.getElementById(id).hidden).toBe(true));

      // 4. Cuenta superadmin autorizada
      window.state.cloudUser = { id: 'user-super', email: 'fjcerrudo@gmail.com' };
      app.supabaseClient = mockMainSupabaseWithRole('superadmin');
      expect(await app.checkAdminRoleStatus()).toBe(true);
      ids.forEach((id) => expect(document.getElementById(id).hidden).toBe(false));

      // 5. Al limpiar sesión / workspace vuelven a ocultarse de inmediato
      app.resetAccountLocalWorkspace();
      expect(window.state.isSuperAdmin).toBe(false);
      ids.forEach((id) => expect(document.getElementById(id).hidden).toBe(true));
    });
  });
});
