import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

function createSampleUsersResponse(overrides = {}) {
  return {
    total: 4,
    limit: 25,
    offset: 0,
    items: [
      {
        id: 'u-gift',
        email: 'gift@sabory.app',
        display_name: 'Ana Regalo',
        created_at: '2026-01-10T10:00:00Z',
        last_sign_in_at: '2026-11-10T10:00:00Z',
        effective_plan: 'pro',
        own_pro: true,
        via_household: false,
        source: 'gift',
        status: 'active',
        period_end: '2026-12-30T10:00:00Z',
        recipes_count: 12,
        ai_calls_30d: 8
      },
      {
        id: 'u-play',
        email: 'play@sabory.app',
        display_name: 'Luis Play',
        created_at: '2026-02-10T10:00:00Z',
        last_sign_in_at: '2026-11-11T10:00:00Z',
        effective_plan: 'pro',
        own_pro: true,
        via_household: false,
        source: 'play',
        status: 'active',
        period_end: '2026-12-01T10:00:00Z',
        recipes_count: 25,
        ai_calls_30d: 14
      },
      {
        id: 'u-house',
        email: 'house@sabory.app',
        display_name: 'Marta Hogar',
        created_at: '2026-03-10T10:00:00Z',
        last_sign_in_at: '2026-11-12T10:00:00Z',
        effective_plan: 'pro',
        own_pro: false,
        via_household: true,
        source: 'household',
        status: 'active',
        period_end: '2027-01-01T10:00:00Z',
        recipes_count: 5,
        ai_calls_30d: 3
      },
      {
        id: 'u-free',
        email: 'free@sabory.app',
        display_name: 'Carlos Free',
        created_at: '2026-04-10T10:00:00Z',
        last_sign_in_at: null,
        effective_plan: 'free',
        own_pro: false,
        via_household: false,
        source: 'none',
        status: 'active',
        period_end: null,
        recipes_count: 1,
        ai_calls_30d: 0
      }
    ],
    ...overrides
  };
}

function createSampleUserDetail(userId = 'u-gift', overrides = {}) {
  const isPlay = userId === 'u-play';
  return {
    user: {
      id: userId,
      email: isPlay ? 'play@sabory.app' : 'gift@sabory.app',
      display_name: isPlay ? 'Luis Play' : 'Ana Regalo',
      created_at: '2026-01-10T10:00:00Z',
      last_sign_in_at: '2026-11-10T10:00:00Z',
      provider: 'google'
    },
    entitlement: {
      plan: 'pro',
      effective_plan: 'pro',
      own_pro: true,
      via_household: false,
      source: isPlay ? 'play' : 'gift',
      status: 'active',
      period_end: '2026-12-30T10:00:00Z',
      is_trial: false
    },
    settings: {
      default_servings: 4,
      dietary_preferences: ['vegetarian', 'low_carb'],
      nutrition_goals: { kcal: 2100 }
    },
    activity: {
      recipes_count: 12,
      meal_plans_count: 5,
      shopping_items_count: 18,
      ai_calls_30d: 8,
      prompt_tokens_30d: 12000,
      output_tokens_30d: 4000
    },
    household: {
      id: 'h-1',
      name: 'Casa Sabory',
      role: 'owner'
    },
    audit_log: [
      {
        id: 'a-1',
        admin_email: 'franky@sabory.app',
        action: 'grant_pro',
        payload: { plan: 'pro', source: 'gift', days: 30, notes: 'Beta' },
        created_at: '2026-11-01T09:00:00Z'
      }
    ],
    ...overrides
  };
}

async function setupAdminApp({ rpcHandler } = {}) {
  window.__SABORY_ADMIN_DISABLE_AUTO_INIT__ = true;
  document.body.innerHTML = extractBodyHtml(adminHtmlRaw);
  document.documentElement.setAttribute('lang', 'es');
  localStorage.clear();

  window.eval(i18nCode);
  window.I18n.setPreference('es');

  const rpcMock = vi.fn(async (fnName, params) => {
    if (rpcHandler) {
      return rpcHandler(fnName, params);
    }
    if (fnName === 'is_admin') return { data: true, error: null };
    if (fnName === 'admin_get_dashboard_stats') return { data: { users: {}, plans: {}, catalog: {}, ai: {} }, error: null };
    if (fnName === 'admin_list_users') return { data: createSampleUsersResponse(), error: null };
    if (fnName === 'admin_get_user_detail') return { data: createSampleUserDetail(params?.p_user_id), error: null };
    if (fnName === 'admin_set_user_entitlement') {
      return { data: { ok: true, user_id: params.p_user_id, plan: params.p_plan, source: params.p_source }, error: null };
    }
    if (fnName === 'admin_delete_user_data') {
      return { data: { ok: true, user_id: params.p_user_id, mode: params.p_mode }, error: null };
    }
    return { data: null, error: null };
  });

  const supabaseMock = {
    auth: {
      getSession: vi.fn(async () => ({
        data: { session: { user: { id: 'admin-1', email: 'franky@sabory.app' } } },
        error: null
      })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signOut: vi.fn(async () => ({ error: null }))
    },
    rpc: rpcMock
  };

  const { SaboryAdminApp } = await import('../src/admin/admin-app.js');
  const app = new SaboryAdminApp({
    documentRef: document,
    windowRef: window,
    i18n: window.I18n,
    supabaseClient: supabaseMock
  });

  await app.init();
  return { app, rpcMock };
}

describe('US-87c — Directorio de Usuarios, Ficha 360º y Regalos Pro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('1. Al abrir la vista Usuarios llama a admin_list_users, renderiza badges y soporta búsqueda, filtros y paginación', async () => {
    const { app, rpcMock } = await setupAdminApp({
      rpcHandler: async (fnName, params) => {
        if (fnName === 'is_admin') return { data: true, error: null };
        if (fnName === 'admin_get_dashboard_stats') return { data: { users: {}, plans: {}, catalog: {}, ai: {} }, error: null };
        if (fnName === 'admin_list_users') {
          return { data: createSampleUsersResponse({ total: 40 }), error: null };
        }
        return { data: null, error: null };
      }
    });

    app.switchAdminView('users');
    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_list_users', {
        p_search: null,
        p_plan: 'all',
        p_source: 'all',
        p_status: 'all',
        p_limit: 25,
        p_offset: 0
      });
      expect(document.querySelectorAll('.admin-user-card').length).toBe(4);
    });

    const countText = document.getElementById('admin-users-count').textContent;
    expect(countText).toContain('40');
    expect(countText).not.toContain('{from}');
    expect(countText).not.toContain('{to}');

    const listText = document.getElementById('admin-users-list').textContent;
    expect(listText).toContain('Pro · Regalo');
    expect(listText).toContain('Pro · Play');
    expect(listText).toContain('Pro · Hogar');
    expect(listText).toContain('Free');
    expect(listText).toContain('12 recetas');
    expect(listText).toContain('8 IA (30d)');
    expect(listText).not.toContain('{count}');

    // Paginación siguiente
    const nextBtn = document.getElementById('btn-users-next');
    expect(nextBtn.disabled).toBe(false);
    nextBtn.click();

    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_list_users', expect.objectContaining({
        p_offset: 25
      }));
    });

    // Filtro por plan y búsqueda debounced
    vi.useFakeTimers();
    const planSelect = document.getElementById('admin-filter-plan');
    planSelect.value = 'pro';
    planSelect.dispatchEvent(new Event('change'));
    await vi.runAllTimersAsync();

    expect(rpcMock).toHaveBeenCalledWith('admin_list_users', expect.objectContaining({
      p_plan: 'pro',
      p_offset: 0
    }));

    const searchInput = document.getElementById('admin-users-search');
    searchInput.value = 'ana@';
    searchInput.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(260);

    expect(rpcMock).toHaveBeenCalledWith('admin_list_users', expect.objectContaining({
      p_search: 'ana@',
      p_offset: 0
    }));
  });

  it('2. Al abrir ficha de usuario llama a admin_get_user_detail y muestra preferencias, actividad, hogar y auditoría', async () => {
    const { app, rpcMock } = await setupAdminApp();
    app.switchAdminView('users');
    await vi.waitFor(() => {
      expect(document.querySelector('[data-open-user-id="u-gift"]')).toBeTruthy();
    });

    document.querySelector('[data-open-user-id="u-gift"]').click();
    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_get_user_detail', { p_user_id: 'u-gift' });
      expect(document.getElementById('admin-user-modal-email').textContent).toBe('gift@sabory.app');
    });

    expect(document.getElementById('admin-user-modal-email').textContent).toBe('gift@sabory.app');
    expect(document.getElementById('admin-user-servings').textContent).toBe('4');
    expect(document.getElementById('admin-user-dietary').textContent).toContain('vegetarian');
    expect(document.getElementById('admin-user-goals').textContent).toMatch(/2[.,]?100\s*kcal/);
    expect(document.getElementById('admin-user-goals').textContent).not.toContain('{');
    expect(document.getElementById('admin-user-household').textContent).toContain('Casa Sabory');
    expect(document.getElementById('admin-user-play-notice').hidden).toBe(true);
    expect(document.getElementById('admin-user-audit-list').textContent).toContain('grant_pro');

    const badgesText = document.getElementById('admin-user-activity-badges').textContent;
    expect(badgesText).toContain('12 recetas');
    expect(badgesText).toContain('5 planes');
    expect(badgesText).toContain('18 compra');
    expect(badgesText).toContain('8 IA (30d)');
    expect(badgesText).not.toContain('{count}');
    expect(badgesText).not.toContain('{tokens}');
  });

  it('3. Regalo 90 días, Pro permanente y formulario personalizado llaman a admin_set_user_entitlement', async () => {
    const { app, rpcMock } = await setupAdminApp();
    await app.openUserDetailModal('u-gift');

    document.getElementById('btn-admin-gift-90d').click();
    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_set_user_entitlement', {
        p_user_id: 'u-gift',
        p_plan: 'pro',
        p_source: 'gift',
        p_status: 'active',
        p_days: 90,
        p_notes: null
      });
    });

    document.getElementById('btn-admin-grant-permanent').click();
    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_set_user_entitlement', {
        p_user_id: 'u-gift',
        p_plan: 'pro',
        p_source: 'admin',
        p_status: 'active',
        p_days: null,
        p_notes: null
      });
    });

    document.getElementById('input-admin-gift-days').value = '45';
    document.getElementById('input-admin-entitlement-notes').value = 'Premio comunidad';
    document.getElementById('admin-entitlement-form').dispatchEvent(new Event('submit', { cancelable: true }));

    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_set_user_entitlement', {
        p_user_id: 'u-gift',
        p_plan: 'pro',
        p_source: 'gift',
        p_status: 'active',
        p_days: 45,
        p_notes: 'Premio comunidad'
      });
    });
  });

  it('4. Revocar Pro a un usuario de Google Play abre el modal de confirmación antes de ejecutar', async () => {
    const { app, rpcMock } = await setupAdminApp();
    await app.openUserDetailModal('u-play');

    expect(document.getElementById('admin-user-play-notice').hidden).toBe(false);

    document.getElementById('btn-admin-revoke-pro').click();
    expect(rpcMock).not.toHaveBeenCalledWith('admin_set_user_entitlement', expect.anything());
    expect(document.getElementById('modal-admin-confirm').hasAttribute('open')).toBe(true);

    document.getElementById('btn-admin-confirm-ok').click();
    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_set_user_entitlement', {
        p_user_id: 'u-play',
        p_plan: 'free',
        p_source: 'none',
        p_status: 'active',
        p_days: null,
        p_notes: null
      });
    });
  });

  it('5. Limpiar datos (wipe_data) y eliminar cuenta (delete_account) piden confirmación y llaman a admin_delete_user_data', async () => {
    const { app, rpcMock } = await setupAdminApp();
    await app.openUserDetailModal('u-gift');

    document.getElementById('btn-admin-wipe-user-data').click();
    expect(rpcMock).not.toHaveBeenCalledWith('admin_delete_user_data', expect.anything());
    document.getElementById('btn-admin-confirm-ok').click();

    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_delete_user_data', {
        p_user_id: 'u-gift',
        p_mode: 'wipe_data',
        p_notes: null
      });
    });

    document.getElementById('btn-admin-delete-user').click();
    document.getElementById('btn-admin-confirm-ok').click();

    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_delete_user_data', {
        p_user_id: 'u-gift',
        p_mode: 'delete_account',
        p_notes: null
      });
    });
    expect(document.getElementById('modal-admin-user').hasAttribute('open')).toBe(false);
  });

  it('6. Reconcilia automáticamente la distribución de planes vía admin_list_users si el RPC de estadísticas infravalora Free/Hogar', async () => {
    const { rpcMock } = await setupAdminApp({
      rpcHandler: async (fnName) => {
        if (fnName === 'is_admin') return { data: true, error: null };
        if (fnName === 'admin_get_dashboard_stats') {
          return {
            data: {
              users: { total: 3, dau: 1, wau: 2, mau: 3, new_7d: 1, new_30d: 3 },
              plans: {
                free: 0,
                play_monthly: 0,
                play_annual: 0,
                trial: 0,
                gift: 0,
                admin: 1,
                household_pro: 0,
                on_hold: 0,
                canceled_active: 0
              },
              catalog: {},
              ai: {}
            },
            error: null
          };
        }
        if (fnName === 'admin_list_users') {
          return {
            data: {
              total: 3,
              limit: 100,
              offset: 0,
              items: [
                { id: 'u1', email: 'sabory@test.com', effective_plan: 'free', own_pro: false, via_household: false, source: 'none', raw_source: 'none', status: 'active' },
                { id: 'u2', email: 'aroa@test.com', effective_plan: 'pro', own_pro: false, via_household: true, source: 'household', raw_source: 'none', status: 'active' },
                { id: 'u3', email: 'franky@test.com', effective_plan: 'pro', own_pro: true, via_household: false, source: 'admin', raw_source: 'admin', status: 'active' }
              ]
            },
            error: null
          };
        }
        return { data: null, error: null };
      }
    });

    expect(rpcMock).toHaveBeenCalledWith('admin_list_users', expect.objectContaining({ p_limit: 100 }));
    expect(document.getElementById('kpi-pro-users').textContent).toBe('2');
    expect(document.querySelector('[data-plan-key="free"] .admin-bar-count').textContent).toBe('1');
    expect(document.querySelector('[data-plan-key="household_pro"] .admin-bar-count').textContent).toBe('1');
    expect(document.querySelector('[data-plan-key="admin"] .admin-bar-count').textContent).toBe('1');
  });
});
