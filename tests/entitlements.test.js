import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { mapQuotaResult } from '../supabase/functions/ai-proxy/core.js';

const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const { FoodAssistantApp, state } = window;

describe('US-79c: Entitlements, cuotas atómicas, Pro compartido y gate de Modo Familia', () => {
  let appInstance;

  beforeEach(() => {
    localStorage.clear();
    state.cloudUser = { id: 'user-1', email: 'franky@example.com', name: 'Franky' };
    state.aiPlan = {
      plan: 'free',
      source: 'none',
      status: null,
      periodEnd: null,
      isTrial: false,
      viaHousehold: false,
      quotas: {},
      fetchedAt: null
    };
    state.household = null;
    document.body.innerHTML = '';
    appInstance = new FoodAssistantApp();
    appInstance.showToast = vi.fn();
    appInstance.openAuthModal = vi.fn();
    appInstance.render = vi.fn();
    appInstance.renderHouseholdSettings = vi.fn();
    appInstance.renderDietaryPreferencesSettings = vi.fn();
    appInstance.initHouseholdRealtimeSubscription = vi.fn();
    appInstance.pushToCloud = vi.fn().mockResolvedValue(undefined);
    appInstance.pullFromCloud = vi.fn().mockResolvedValue(undefined);
  });

  describe('Verificación estática de esquema SQL y scripts de regalo', () => {
    const schemaSql = fs.readFileSync(path.resolve(process.cwd(), 'replica/schema.sql'), 'utf-8');
    const us79cSql = fs.readFileSync(path.resolve(process.cwd(), 'supabase/sql/us79c.sql'), 'utf-8');
    const giftSql = fs.readFileSync(path.resolve(process.cwd(), 'supabase/sql/grant-pro-gift.sql'), 'utf-8');

    it('define public.entitlements, effective_plan, consume_ai_quota y get_ai_quota_status con permisos seguros', () => {
      for (const sql of [schemaSql, us79cSql]) {
        expect(sql).toMatch(/create table if not exists public\.entitlements/i);
        expect(sql).toMatch(/create or replace function public\.has_own_pro/i);
        expect(sql).toMatch(/create or replace function public\.effective_plan/i);
        expect(sql).toMatch(/create or replace function public\.consume_ai_quota/i);
        expect(sql).toMatch(/create or replace function public\.get_ai_quota_status/i);
        expect(sql).toMatch(/revoke execute on function public\.consume_ai_quota\(uuid, text\) from public, anon, authenticated/i);
        expect(sql).toMatch(/grant execute on function public\.consume_ai_quota\(uuid, text\) to service_role/i);
        expect(sql).toMatch(/grant execute on function public\.get_ai_quota_status\(\) to authenticated/i);
        expect(sql).toMatch(/create policy "Households insert policy"/i);
        expect(sql).toMatch(/create policy "Household members insert policy"/i);
      }
    });

    it('grant-pro-gift.sql usa source admin y period_end null', () => {
      expect(giftSql).toMatch(/insert into public\.entitlements/i);
      expect(giftSql).toMatch(/'admin'/);
      expect(giftSql).toMatch(/period_end\s*=\s*null/i);
    });
  });

  describe('ai-proxy/core.js mapQuotaResult', () => {
    it('devuelve null cuando allowed es true', () => {
      expect(mapQuotaResult({ allowed: true, plan: 'free', feature: 'chat', used: 1, limit: 15, remaining: 14, period: 'day' })).toBeNull();
    });

    it('mapea códigos de rechazo a los códigos HTTP esperados', () => {
      expect(mapQuotaResult({ allowed: false, code: 'PRO_REQUIRED', feature: 'voice', plan: 'free' }).status).toBe(403);
      expect(mapQuotaResult({ allowed: false, code: 'QUOTA_EXCEEDED', feature: 'chat', used: 15, limit: 15, remaining: 0, period: 'day', plan: 'free' }).status).toBe(402);
      expect(mapQuotaResult({ allowed: false, code: 'RATE_LIMITED', feature: 'chat', plan: 'pro' }).status).toBe(429);
      expect(mapQuotaResult({ allowed: false, code: 'INVALID_FEATURE' }).status).toBe(400);
    });
  });

  describe('Cliente: loadAiPlanStatus, isPro, sincronización de cuota y gate Modo Familia', () => {
    it('loadAiPlanStatus carga el plan desde get_ai_quota_status y actualiza isPro()', async () => {
      appInstance.supabaseClient = {
        rpc: vi.fn().mockResolvedValue({
          data: {
            plan: 'pro',
            source: 'admin',
            status: 'active',
            period_end: null,
            is_trial: false,
            via_household: true,
            quotas: { chat: { used: 3, limit: 100, remaining: 97, period: 'day' } }
          },
          error: null
        })
      };

      const loaded = await appInstance.loadAiPlanStatus();
      expect(loaded.plan).toBe('pro');
      expect(loaded.viaHousehold).toBe(true);
      expect(appInstance.isPro()).toBe(true);
      expect(state.aiPlan.quotas.chat.remaining).toBe(97);
    });

    it('loadAiPlanStatus devuelve anonymous si no hay sesión', async () => {
      state.cloudUser = null;
      const loaded = await appInstance.loadAiPlanStatus();
      expect(loaded.plan).toBe('anonymous');
      expect(appInstance.isPro()).toBe(false);
    });

    it('invokeAiProxy actualiza state.aiPlan.quotas cuando el proxy devuelve quota', async () => {
      appInstance.getAiAuthToken = vi.fn().mockResolvedValue('jwt-token');
      appInstance.getAiProxyEndpoint = vi.fn().mockReturnValue('https://example.supabase.co/functions/v1/ai-proxy');
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          model: 'gemini-3.5-flash-lite',
          data: { candidates: [] },
          quota: { feature: 'chat', used: 2, limit: 15, remaining: 13, period: 'day', plan: 'free' }
        })
      });

      const res = await appInstance.invokeAiProxy('chat', { contents: [{ role: 'user', parts: [{ text: 'hola' }] }] });
      expect(res.ok).toBe(true);
      expect(state.aiPlan.quotas.chat).toEqual({ used: 2, limit: 15, remaining: 13, period: 'day' });
    });

    it('createHousehold bloquea usuarios Free sin llamar a Supabase y abre paywall', async () => {
      const insertSpy = vi.fn();
      appInstance.supabaseClient = { from: vi.fn(() => ({ insert: insertSpy })) };

      const res = await appInstance.createHousehold('Casa Cerrudo');
      expect(res.success).toBe(false);
      expect(res.reason).toBe('pro_required');
      expect(insertSpy).not.toHaveBeenCalled();
      expect(appInstance.showToast).toHaveBeenCalled();
    });

    it('joinHouseholdByCode permite a usuarios Free unirse con código a un Hogar activo y maneja 42501 si el anfitrión no tiene Pro', async () => {
      const householdRow = {
        id: 'hh-pro-1',
        name: 'Casa Cerrudo',
        invite_code: 'SAB-4F8K',
        owner_id: 'user-owner-pro',
        created_at: '2026-11-01T10:00:00Z'
      };
      const membersRows = [
        { household_id: 'hh-pro-1', user_id: 'user-owner-pro', role: 'owner', display_name: 'Aroa', email: 'aroa@example.com' },
        { household_id: 'hh-pro-1', user_id: 'user-1', role: 'member', display_name: 'Franky', email: 'franky@example.com' }
      ];

      appInstance.supabaseClient = {
        rpc: vi.fn().mockResolvedValue({ data: { plan: 'pro', via_household: true, quotas: {} }, error: null }),
        from: vi.fn((table) => {
          if (table === 'households') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [householdRow], error: null })
              })
            };
          }
          if (table === 'household_members') {
            return {
              upsert: vi.fn().mockResolvedValue({ data: [], error: null }),
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: membersRows, error: null })
              })
            };
          }
          return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) };
        })
      };

      const resOk = await appInstance.joinHouseholdByCode('SAB-4F8K');
      expect(resOk.success).toBe(true);
      expect(state.household?.id).toBe('hh-pro-1');
      expect(state.household?.role).toBe('member');

      // Caso 2: si el anfitrión ya no tiene Pro vigente, Supabase RLS devuelve 42501 y se abre el paywall
      state.saveHousehold(null);
      appInstance.openPaywall = vi.fn();
      appInstance.supabaseClient = {
        from: vi.fn((table) => {
          if (table === 'households') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [householdRow], error: null })
              })
            };
          }
          if (table === 'household_members') {
            return {
              upsert: vi.fn().mockResolvedValue({ error: { code: '42501', message: 'RLS denied: host is not Pro' } })
            };
          }
          return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) };
        })
      };

      const resDenied = await appInstance.joinHouseholdByCode('SAB-4F8K');
      expect(resDenied.success).toBe(false);
      expect(resDenied.reason).toBe('pro_required');
      expect(appInstance.openPaywall).toHaveBeenCalledWith('family');
    });

    it('renderHouseholdSettings deshabilita Crear Hogar para cuentas Free pero mantiene Unirse habilitado', () => {
      document.body.innerHTML = `
        <div id="card-family-household">
          <span id="household-status-badge"></span>
          <div id="household-paused-banner" style="display:none"></div>
          <div id="household-empty-view">
            <form id="form-create-household" class="household-subcard">
              <span id="create-household-help"></span>
              <input id="input-create-household-name" type="text">
              <button id="btn-create-household" type="submit">Crear Hogar</button>
            </form>
            <form id="form-join-household" class="household-subcard">
              <input id="input-join-household-code" type="text">
              <button id="btn-join-household" type="submit">Unirse</button>
            </form>
          </div>
          <div id="household-active-view" style="display:none"></div>
        </div>
      `;
      delete appInstance.renderHouseholdSettings;

      state.household = null;
      state.aiPlan.plan = 'free';
      appInstance.renderHouseholdSettings();

      expect(document.getElementById('form-create-household').classList.contains('is-pro-locked')).toBe(true);
      expect(document.getElementById('input-create-household-name').disabled).toBe(true);
      expect(document.getElementById('btn-create-household').disabled).toBe(true);
      expect(document.getElementById('create-household-help').getAttribute('data-i18n')).toBe('household.createProOnlyHelp');
      expect(document.getElementById('input-join-household-code').disabled).toBe(false);
      expect(document.getElementById('btn-join-household').disabled).toBe(false);

      state.aiPlan.plan = 'pro';
      appInstance.renderHouseholdSettings();

      expect(document.getElementById('form-create-household').classList.contains('is-pro-locked')).toBe(false);
      expect(document.getElementById('input-create-household-name').disabled).toBe(false);
      expect(document.getElementById('btn-create-household').disabled).toBe(false);
      expect(document.getElementById('create-household-help').getAttribute('data-i18n')).toBe('household.createHelp');
    });

    it('createHousehold permite crear Hogar si el usuario es Pro y maneja 42501 como fallback', async () => {
      state.aiPlan.plan = 'pro';
      appInstance.supabaseClient = {
        rpc: vi.fn().mockResolvedValue({ data: { plan: 'pro', quotas: {} }, error: null }),
        from: vi.fn((table) => {
          if (table === 'households') {
            return { insert: vi.fn().mockResolvedValue({ error: { code: '42501', message: 'RLS denied' } }) };
          }
          return { upsert: vi.fn().mockResolvedValue({ error: null }) };
        })
      };

      const res = await appInstance.createHousehold('Casa Cerrudo');
      expect(res.success).toBe(false);
      expect(res.reason).toBe('pro_required');
    });
  });
});
