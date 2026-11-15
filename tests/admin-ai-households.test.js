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

function createSampleDashboardStats(days = 30, overrides = {}) {
  const factor = days === 1 ? 0.1 : (days === 7 ? 0.35 : 1);
  return {
    users: { total: 40, new_period: 8, dau: 12, wau: 22, mau: 34 },
    plans: {
      free: 28,
      play_monthly: 4,
      play_annual: 3,
      trial: 1,
      gift: 2,
      admin: 1,
      household_pro: 1,
      on_hold: 0,
      canceled_active: 0
    },
    catalog: {
      total_recipes: 320,
      total_households: 6,
      paused_households: 2,
      total_meal_plans: 110,
      total_shopping_items: 490
    },
    top_domains: [{ domain: 'instagram.com', count: 44 }],
    ai: {
      period_days: days,
      today_calls: 24,
      calls_total: Math.round(400 * factor),
      calls_ok: Math.round(380 * factor),
      calls_error: Math.round(12 * factor),
      calls_reset: Math.round(8 * factor),
      prompt_tokens: Math.round(2_000_000 * factor),
      output_tokens: Math.round(500_000 * factor),
      by_feature_model: [
        {
          feature: 'weekly_plan',
          model: 'gemini-3.8-flash',
          calls: Math.round(160 * factor),
          ok_calls: Math.round(154 * factor),
          error_calls: Math.round(4 * factor),
          reset_calls: Math.round(2 * factor),
          prompt_tokens: Math.round(1_200_000 * factor),
          output_tokens: Math.round(300_000 * factor)
        },
        {
          feature: 'guided_query',
          model: 'gemini-3.5-flash-lite',
          calls: Math.round(240 * factor),
          ok_calls: Math.round(226 * factor),
          error_calls: Math.round(8 * factor),
          reset_calls: Math.round(6 * factor),
          prompt_tokens: Math.round(800_000 * factor),
          output_tokens: Math.round(200_000 * factor)
        }
      ]
    },
    ai_heavy_users: [
      {
        user_id: 'u-heavy-1',
        email: 'heavy@sabory.app',
        display_name: 'Carlos Heavy',
        plan: 'pro',
        calls_today: 175,
        calls_7d: 420,
        tokens_7d: 350000
      }
    ],
    ai_free_capped_users: [
      {
        user_id: 'u-capped-1',
        email: 'capped@sabory.app',
        display_name: 'Elena Free',
        weekly_plan_used: 2,
        guided_query_used: 3,
        import_ai_used: 5
      }
    ],
    ...overrides
  };
}

function createSampleHouseholds(overrides = {}) {
  return {
    total: 2,
    limit: 25,
    offset: 0,
    items: [
      {
        id: 'hh-active',
        name: 'Familia Cerrudo',
        invite_code: 'SAB-ACTIVE',
        owner_id: 'u-owner-1',
        owner_email: 'owner@sabory.app',
        owner_has_pro: true,
        is_paused: false,
        created_at: '2026-06-01T10:00:00Z',
        members_count: 2,
        recipes_count: 28,
        members: [
          { user_id: 'u-owner-1', role: 'owner', display_name: 'Titular Uno', email: 'owner@sabory.app', joined_at: '2026-06-01T10:00:00Z' },
          { user_id: 'u-member-2', role: 'member', display_name: 'Miembro Dos', email: 'member@sabory.app', joined_at: '2026-06-02T10:00:00Z' }
        ]
      },
      {
        id: 'hh-paused',
        name: 'Hogar En Pausa',
        invite_code: 'SAB-PAUSE9',
        owner_id: 'u-owner-2',
        owner_email: 'expired@sabory.app',
        owner_has_pro: false,
        is_paused: true,
        created_at: '2026-07-10T10:00:00Z',
        members_count: 1,
        recipes_count: 9,
        members: [
          { user_id: 'u-owner-2', role: 'owner', display_name: 'Titular Sin Pro', email: 'expired@sabory.app', joined_at: '2026-07-10T10:00:00Z' }
        ]
      }
    ],
    ...overrides
  };
}

function createSampleUserDetail(userId = 'u-heavy-1') {
  return {
    user: {
      id: userId,
      email: userId === 'u-heavy-1' ? 'heavy@sabory.app' : 'capped@sabory.app',
      display_name: userId === 'u-heavy-1' ? 'Carlos Heavy' : 'Elena Free',
      created_at: '2026-02-01T10:00:00Z',
      last_sign_in_at: '2026-11-14T10:00:00Z',
      provider: 'google'
    },
    entitlement: {
      plan: userId === 'u-heavy-1' ? 'pro' : 'free',
      effective_plan: userId === 'u-heavy-1' ? 'pro' : 'free',
      own_pro: userId === 'u-heavy-1',
      via_household: false,
      source: userId === 'u-heavy-1' ? 'gift' : 'none',
      status: 'active',
      period_end: null,
      is_trial: false
    },
    settings: {
      default_servings: 2,
      dietary_preferences: [],
      nutrition_goals: {}
    },
    activity: {
      recipes_count: 10,
      meal_plans_count: 4,
      shopping_items_count: 12,
      ai_calls_30d: 45,
      prompt_tokens_30d: 20000,
      output_tokens_30d: 5000
    },
    quotas: {
      weekly_plan: 2,
      guided_query: 3,
      import_ai: 4,
      chat: 1,
      voice: 0
    },
    household: null,
    audit_log: []
  };
}

async function setupAdminApp({ rpcHandler } = {}) {
  window.__SABORY_ADMIN_DISABLE_AUTO_INIT__ = true;
  document.body.innerHTML = extractBodyHtml(adminHtmlRaw);
  document.documentElement.setAttribute('lang', 'es');
  localStorage.clear();

  window.eval(i18nCode);
  window.I18n.setPreference('es');

  const defaultRpc = async (fnName, params) => {
    if (fnName === 'is_admin') return { data: true, error: null };
    if (fnName === 'admin_get_dashboard_stats') {
      return { data: createSampleDashboardStats(params?.p_days || 30), error: null };
    }
    if (fnName === 'admin_get_user_detail') {
      return { data: createSampleUserDetail(params?.p_user_id), error: null };
    }
    if (fnName === 'admin_reset_user_ai_quota') {
      return {
        data: { ok: true, user_id: params.p_user_id, feature: params.p_feature || 'all', rows_reset: 5 },
        error: null
      };
    }
    if (fnName === 'admin_list_households') {
      return { data: createSampleHouseholds(), error: null };
    }
    if (fnName === 'admin_manage_household') {
      return {
        data: { ok: true, household_id: params.p_household_id, action: params.p_action, invite_code: 'SAB-NEW999' },
        error: null
      };
    }
    if (fnName === 'admin_list_audit_log') {
      return {
        data: {
          total: 2,
          limit: 50,
          offset: 0,
          items: [
            {
              id: 'log-1',
              admin_id: 'admin-1',
              admin_email: 'franky@sabory.app',
              action: 'reset_ai_quota',
              target_user_id: 'u-heavy-1',
              target_email: 'heavy@sabory.app',
              payload: { feature: 'guided_query', rows_reset: 3 },
              created_at: '2026-11-15T10:00:00Z'
            },
            {
              id: 'log-2',
              admin_id: 'admin-1',
              admin_email: 'franky@sabory.app',
              action: 'household_regenerate_code',
              target_user_id: null,
              target_email: null,
              payload: { household_id: 'hh-active' },
              created_at: '2026-11-15T09:00:00Z'
            }
          ]
        },
        error: null
      };
    }
    return { data: null, error: null };
  };

  const rpcMock = vi.fn(async (fnName, params) => {
    if (rpcHandler) {
      return rpcHandler(fnName, params, defaultRpc);
    }
    return defaultRpc(fnName, params);
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

describe('US-87d — Monitor de IA, Reset de Cuotas, Consola de Hogares y Auditoría', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('1. Renderiza KPIs financieros de IA, desglose por feature/modelo y cambia el rango en #admin-ai-range', async () => {
    const { rpcMock } = await setupAdminApp();

    document.getElementById('admin-nav-ai').click();
    expect(document.getElementById('admin-view-ai').hidden).toBe(false);

    // MRR = 4*2.99 + 3*(24.99/12) = 11.96 + 6.2475 = 18.21 €
    // Coste IA 30d:
    // - weekly_plan (gemini-3.8-flash): 1.2M*0.30 + 0.3M*2.50 = 0.36 + 0.75 = 1.11 USD
    // - guided_query (gemini-3.5-flash-lite): 0.8M*0.10 + 0.2M*0.40 = 0.08 + 0.08 = 0.16 USD
    // Total USD = 1.27 * 0.92 = 1.17 EUR; Margen bruto = 18.21 - 1.17 = 17.04 €
    expect(document.getElementById('ai-kpi-cost').textContent).toContain('1,17 €');
    expect(document.getElementById('ai-kpi-tokens').textContent).toMatch(/2\.500\.000|2,500,000/);
    expect(document.getElementById('ai-kpi-calls').textContent).toBe('400');
    expect(document.getElementById('ai-kpi-margin').textContent).toContain('17,04 €');

    const byFeature = document.getElementById('admin-ai-by-feature');
    expect(byFeature.querySelector('[data-ai-bucket="weekly_plan"]')).not.toBeNull();
    expect(byFeature.querySelector('[data-ai-bucket="guided_query"]')).not.toBeNull();

    const byModel = document.getElementById('admin-ai-by-model');
    expect(byModel.querySelector('[data-ai-bucket="gemini-3.8-flash"]')).not.toBeNull();
    expect(byModel.querySelector('[data-ai-bucket="gemini-3.5-flash-lite"]')).not.toBeNull();

    const rangeSelect = document.getElementById('admin-ai-range');
    rangeSelect.value = '7';
    rangeSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_get_dashboard_stats', { p_days: 7 });
      expect(document.getElementById('ai-kpi-calls').textContent).toBe('140');
    });
  });

  it('2. Lista heavy users y usuarios Free al límite, y resetea su cuota en 1 clic', async () => {
    let wasReset = false;
    const { rpcMock } = await setupAdminApp({
      rpcHandler: async (fnName, params, fallback) => {
        if (fnName === 'admin_reset_user_ai_quota') {
          wasReset = true;
          return { data: { ok: true, user_id: params.p_user_id, feature: params.p_feature, rows_reset: 2 }, error: null };
        }
        if (fnName === 'admin_get_dashboard_stats') {
          return {
            data: createSampleDashboardStats(params?.p_days || 30, wasReset ? { ai_free_capped_users: [] } : {}),
            error: null
          };
        }
        return fallback(fnName, params);
      }
    });

    document.getElementById('admin-nav-ai').click();

    const heavyList = document.getElementById('admin-ai-heavy-users');
    const heavyRow = heavyList.querySelector('[data-user-id="u-heavy-1"]');
    expect(heavyRow).not.toBeNull();
    expect(heavyRow.textContent).toContain('Alto consumo');

    const heavySelect = heavyRow.querySelector('[data-quota-feature-select="u-heavy-1"]');
    heavySelect.value = 'weekly_plan';
    heavyRow.querySelector('[data-reset-quota-user="u-heavy-1"]').click();

    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_reset_user_ai_quota', {
        p_user_id: 'u-heavy-1',
        p_feature: 'weekly_plan',
        p_notes: ''
      });
    });

    const cappedList = document.getElementById('admin-ai-free-capped');
    const cappedBtn = cappedList.querySelector('[data-reset-quota-user="u-capped-1"]');
    expect(cappedBtn).not.toBeNull();
    cappedBtn.click();

    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_reset_user_ai_quota', {
        p_user_id: 'u-capped-1',
        p_feature: 'all',
        p_notes: ''
      });
      expect(document.getElementById('admin-ai-free-capped').textContent).toContain('Ningún usuario Free');
    });
  });

  it('3. Permite consultar cuotas hoy y resetear por feature desde el modal 360º del usuario', async () => {
    const { app, rpcMock } = await setupAdminApp();

    await app.openUserDetailModal('u-heavy-1');
    expect(document.getElementById('admin-user-quotas-summary').textContent).toContain('Menú 2');
    expect(document.getElementById('admin-user-quotas-summary').textContent).toContain('Chef IA 3');

    document.getElementById('select-admin-quota-feature').value = 'guided_query';
    document.getElementById('input-admin-entitlement-notes').value = 'Soporte cuota';
    document.getElementById('btn-admin-reset-quota').click();

    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_reset_user_ai_quota', {
        p_user_id: 'u-heavy-1',
        p_feature: 'guided_query',
        p_notes: 'Soporte cuota'
      });
    });
  });

  it('4. Consola de Hogares muestra estado Activo/En Pausa, busca y permite transferir titularidad, expulsar miembro y regenerar código', async () => {
    const householdsState = createSampleHouseholds();
    const { rpcMock } = await setupAdminApp({
      rpcHandler: async (fnName, params, fallback) => {
        if (fnName === 'admin_list_households') {
          const q = String(params?.p_search || '').toLowerCase();
          const filtered = householdsState.items.filter((h) =>
            !q || h.name.toLowerCase().includes(q) || h.invite_code.toLowerCase().includes(q)
          );
          return { data: { total: filtered.length, limit: 25, offset: 0, items: filtered }, error: null };
        }
        if (fnName === 'admin_manage_household') {
          const targetH = householdsState.items.find((h) => h.id === params.p_household_id);
          if (params.p_action === 'regenerate_code') {
            targetH.invite_code = 'SAB-REGEN1';
            return { data: { ok: true, household_id: targetH.id, action: 'regenerate_code', invite_code: 'SAB-REGEN1' }, error: null };
          }
          if (params.p_action === 'transfer_owner') {
            targetH.owner_id = params.p_target_user_id;
            targetH.owner_email = 'member@sabory.app';
            targetH.members = targetH.members.map((m) => ({
              ...m,
              role: m.user_id === params.p_target_user_id ? 'owner' : 'member'
            }));
            return { data: { ok: true, household_id: targetH.id, action: 'transfer_owner' }, error: null };
          }
          if (params.p_action === 'remove_member') {
            targetH.members = targetH.members.filter((m) => m.user_id !== params.p_target_user_id);
            targetH.members_count = targetH.members.length;
            return { data: { ok: true, household_id: targetH.id, action: 'remove_member' }, error: null };
          }
        }
        return fallback(fnName, params);
      }
    });

    document.getElementById('admin-nav-households').click();
    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_list_households', { p_search: '', p_limit: 25, p_offset: 0 });
      expect(document.getElementById('admin-households-list').textContent).toContain('Familia Cerrudo');
      expect(document.getElementById('admin-households-list').textContent).toContain('En Pausa (sin Pro)');
    });

    document.querySelector('[data-manage-household-id="hh-active"]').click();
    await vi.waitFor(() => {
      expect(document.getElementById('modal-admin-household').hasAttribute('open')).toBe(true);
      expect(document.getElementById('admin-household-invite-code').textContent).toBe('SAB-ACTIVE');
    });

    document.getElementById('btn-admin-regen-code').click();
    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_manage_household', {
        p_household_id: 'hh-active',
        p_action: 'regenerate_code',
        p_target_user_id: null
      });
      expect(document.getElementById('admin-household-invite-code').textContent).toBe('SAB-REGEN1');
    });

    document.querySelector('[data-household-action="transfer_owner"][data-target-user-id="u-member-2"]').click();
    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_manage_household', {
        p_household_id: 'hh-active',
        p_action: 'transfer_owner',
        p_target_user_id: 'u-member-2'
      });
      expect(document.querySelector('[data-household-action="remove_member"][data-target-user-id="u-owner-1"]')).not.toBeNull();
    });

    // Ahora el antiguo titular 'u-owner-1' pasó a ser miembro y puede ser expulsado con confirmación
    document.querySelector('[data-household-action="remove_member"][data-target-user-id="u-owner-1"]').click();
    expect(document.getElementById('modal-admin-confirm').hasAttribute('open')).toBe(true);
    document.getElementById('btn-admin-confirm-ok').click();

    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_manage_household', {
        p_household_id: 'hh-active',
        p_action: 'remove_member',
        p_target_user_id: 'u-owner-1'
      });
      expect(document.querySelector('[data-member-id="u-owner-1"]')).toBeNull();
    });

    // Filtro por búsqueda con debounce
    vi.useFakeTimers();
    const searchInput = document.getElementById('admin-households-search');
    searchInput.value = 'PAUSE9';
    searchInput.dispatchEvent(new window.Event('input', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(260);

    expect(rpcMock).toHaveBeenCalledWith('admin_list_households', { p_search: 'PAUSE9', p_limit: 25, p_offset: 0 });
  });

  it('5. Auditoría global carga admin_list_audit_log y permite abrir la ficha del usuario afectado', async () => {
    const { rpcMock } = await setupAdminApp();

    document.getElementById('admin-nav-audit').click();
    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_list_audit_log', { p_limit: 50, p_offset: 0 });
      expect(document.getElementById('admin-audit-count').textContent).toContain('2');
      expect(document.getElementById('admin-audit-list').textContent).toContain('franky@sabory.app');
      expect(document.getElementById('admin-audit-list').textContent).toContain('heavy@sabory.app');
    });

    const openBtn = document.querySelector('#admin-audit-list [data-open-user-id="u-heavy-1"]');
    expect(openBtn).not.toBeNull();
    openBtn.click();

    await vi.waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith('admin_get_user_detail', { p_user_id: 'u-heavy-1' });
      expect(document.getElementById('modal-admin-user').hasAttribute('open')).toBe(true);
    });
  });
});
