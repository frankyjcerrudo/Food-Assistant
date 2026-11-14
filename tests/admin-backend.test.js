import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  GEMINI_PRICING_USD,
  DEFAULT_EUR_PER_USD,
  estimateAiRowCostUsd,
  summarizeAiUsage,
  computeRevenueMetrics,
  validateEntitlementChange,
  validateQuotaResetRequest,
  formatAuditSummary
} from '../src/admin/admin-core.js';

const ADMIN_RPCS = [
  'admin_get_dashboard_stats',
  'admin_list_users',
  'admin_get_user_detail',
  'admin_set_user_entitlement',
  'admin_reset_user_ai_quota',
  'admin_list_households',
  'admin_manage_household',
  'admin_delete_user_data',
  'admin_list_audit_log'
];

describe('US-87a: Backend Admin Seguro, SQL §12 y admin-core.js', () => {
  describe('Verificación estática de seguridad en SQL', () => {
    const schemaSql = fs.readFileSync(path.resolve(process.cwd(), 'replica/schema.sql'), 'utf-8');
    const us87aSql = fs.readFileSync(path.resolve(process.cwd(), 'supabase/sql/us87a.sql'), 'utf-8');
    const grantAdminSql = fs.readFileSync(path.resolve(process.cwd(), 'supabase/sql/grant-admin-access.sql'), 'utf-8');

    it('crea admin_users y admin_audit_log con RLS habilitado y sin políticas de escritura cliente', () => {
      for (const sql of [schemaSql, us87aSql]) {
        expect(sql).toMatch(/create table if not exists public\.admin_users/i);
        expect(sql).toMatch(/alter table public\.admin_users enable row level security/i);
        expect(sql).toMatch(/create table if not exists public\.admin_audit_log/i);
        expect(sql).toMatch(/alter table public\.admin_audit_log enable row level security/i);

        expect(sql).not.toMatch(/create policy[\s\S]*?on public\.admin_users\s+for\s+(insert|update|delete|all)/i);
        expect(sql).not.toMatch(/create policy[\s\S]*?on public\.admin_audit_log\s+for\s+(insert|update|delete|all)/i);
      }
    });

    it('define public.is_admin() y las 9 RPCs admin_* con security definer, check is_admin() y permisos cerrados a anon/public', () => {
      for (const sql of [schemaSql, us87aSql]) {
        expect(sql).toMatch(/create or replace function public\.is_admin\(\)/i);
        expect(sql).toMatch(/revoke execute on function public\.is_admin\(\) from public, anon/i);
        expect(sql).toMatch(/grant execute on function public\.is_admin\(\) to authenticated/i);

        for (const fnName of ADMIN_RPCS) {
          const fnBlockRegex = new RegExp(
            `create or replace function public\\.${fnName}\\b[\\s\\S]*?\\$\\$;`,
            'i'
          );
          const match = sql.match(fnBlockRegex);
          expect(match, `Falta función ${fnName}`).not.toBeNull();
          expect(match[0]).toMatch(/security definer/i);
          expect(match[0]).toMatch(/if not public\.is_admin\(\) then/i);

          const revokeRegex = new RegExp(
            `revoke execute on function public\\.${fnName}\\([^)]*\\) from public, anon`,
            'i'
          );
          const grantRegex = new RegExp(
            `grant execute on function public\\.${fnName}\\([^)]*\\) to authenticated`,
            'i'
          );
          expect(sql).toMatch(revokeRegex);
          expect(sql).toMatch(grantRegex);
        }
      }
    });

    it('amplía ai_usage_status_check con reset y protege admin_delete_user_data contra autoborrado o borrado de admins', () => {
      for (const sql of [schemaSql, us87aSql]) {
        expect(sql).toMatch(/ai_usage_status_check check \(status in \('pending','ok','error','reset'\)\)/i);
        expect(sql).toMatch(/CANNOT_DELETE_SELF/);
        expect(sql).toMatch(/CANNOT_DELETE_ADMIN/);
      }
      expect(grantAdminSql).toMatch(/insert into public\.admin_users/i);
      expect(grantAdminSql).toMatch(/'superadmin'/);
    });
  });

  describe('estimateAiRowCostUsd y summarizeAiUsage', () => {
    it('calcula el coste exacto en USD para cada modelo oficial y usa fallback default para desconocidos', () => {
      const flash38 = estimateAiRowCostUsd({
        model: 'gemini-3.8-flash',
        prompt_tokens: 1_000_000,
        output_tokens: 1_000_000
      });
      expect(flash38).toBe(GEMINI_PRICING_USD['gemini-3.8-flash'].inputPer1M + GEMINI_PRICING_USD['gemini-3.8-flash'].outputPer1M);

      const lite35 = estimateAiRowCostUsd({
        model: 'gemini-3.5-flash-lite',
        promptTokens: 500_000,
        outputTokens: 250_000
      });
      expect(lite35).toBeCloseTo(0.05 + 0.10, 6);

      const lite31 = estimateAiRowCostUsd({
        model: 'gemini-3.1-flash-lite',
        prompt_tokens: 1_000_000,
        output_tokens: 1_000_000
      });
      expect(lite31).toBeCloseTo(0.375, 6);

      const fallback = estimateAiRowCostUsd({
        model: 'gemini-future-unknown',
        prompt_tokens: 1_000_000,
        output_tokens: 1_000_000
      });
      expect(fallback).toBeCloseTo(GEMINI_PRICING_USD.default.inputPer1M + GEMINI_PRICING_USD.default.outputPer1M, 6);
    });

    it('agrega filas individuales y pre-agregadas en USD/EUR por feature y modelo', () => {
      const rawRows = [
        { feature: 'chat', model: 'gemini-3.8-flash', status: 'ok', prompt_tokens: 200_000, output_tokens: 100_000 },
        { feature: 'chat', model: 'gemini-3.8-flash', status: 'error', prompt_tokens: 50_000, output_tokens: 0 },
        { feature: 'guided_query', model: 'gemini-3.5-flash-lite', status: 'reset', prompt_tokens: 100_000, output_tokens: 50_000 }
      ];

      const summary = summarizeAiUsage(rawRows, 0.90);
      expect(summary.callsTotal).toBe(3);
      expect(summary.callsOk).toBe(1);
      expect(summary.callsError).toBe(1);
      expect(summary.callsReset).toBe(1);
      expect(summary.errorRatePct).toBe(33.33);
      expect(summary.promptTokens).toBe(350_000);
      expect(summary.outputTokens).toBe(150_000);
      expect(summary.totalTokens).toBe(500_000);

      // chat: (250k * 0.30 + 100k * 2.50)/1M = 0.075 + 0.25 = 0.325 USD
      // guided_query: (100k * 0.10 + 50k * 0.40)/1M = 0.01 + 0.02 = 0.03 USD
      expect(summary.costUsd).toBeCloseTo(0.355, 6);
      expect(summary.costEur).toBeCloseTo(0.355 * 0.90, 6);
      expect(summary.byFeature.chat.calls).toBe(2);
      expect(summary.byFeature.guided_query.reset).toBe(1);
      expect(summary.byModel['gemini-3.8-flash'].costUsd).toBeCloseTo(0.325, 6);

      const aggregatedRows = [
        { feature: 'weekly_plan', model: 'gemini-3.8-flash', calls: 10, ok_calls: 9, error_calls: 1, reset_calls: 0, prompt_tokens: 1_000_000, output_tokens: 200_000 }
      ];
      const aggSummary = summarizeAiUsage(aggregatedRows);
      expect(aggSummary.callsTotal).toBe(10);
      expect(aggSummary.callsOk).toBe(9);
      expect(aggSummary.callsError).toBe(1);
      expect(aggSummary.errorRatePct).toBe(10);
      expect(aggSummary.costEur).toBeCloseTo(aggSummary.costUsd * DEFAULT_EUR_PER_USD, 6);
    });
  });

  describe('computeRevenueMetrics', () => {
    it('calcula MRR, ARR y conversión contando solo suscripciones de pago y sin inflar por gift/admin/trial/household', () => {
      const metrics = computeRevenueMetrics({
        free: 80,
        play_monthly: 10,
        play_annual: 12,
        trial: 5,
        gift: 4,
        admin: 2,
        household_pro: 7
      }, 120);

      // 10 * 2.99 + 12 * (24.99 / 12) = 29.90 + 24.99 = 54.89 EUR
      expect(metrics.paidUsers).toBe(22);
      expect(metrics.proTotal).toBe(40);
      expect(metrics.freeTotal).toBe(80);
      expect(metrics.mrrEur).toBe(54.89);
      expect(metrics.arrEur).toBe(658.68);
      expect(metrics.conversionRatePct).toBe(18.33);
      expect(metrics.proCoveragePct).toBe(33.33);
    });

    it('gestiona 0 usuarios sin dividir por cero', () => {
      const empty = computeRevenueMetrics({}, 0);
      expect(empty.mrrEur).toBe(0);
      expect(empty.arrEur).toBe(0);
      expect(empty.conversionRatePct).toBe(0);
    });
  });

  describe('validateEntitlementChange y validateQuotaResetRequest', () => {
    it('valida parámetros correctos y rechaza combinaciones inválidas', () => {
      expect(validateEntitlementChange({ plan: 'pro', source: 'gift', status: 'active', days: 90 })).toEqual({ ok: true });
      expect(validateEntitlementChange({ plan: 'pro', source: 'admin', status: 'active', days: null })).toEqual({ ok: true });
      expect(validateEntitlementChange({ plan: 'free', source: 'none', status: 'expired' })).toEqual({ ok: true });

      expect(validateEntitlementChange({ plan: 'enterprise', source: 'gift' })).toEqual({ ok: false, error: 'INVALID_PLAN' });
      expect(validateEntitlementChange({ plan: 'pro', source: 'stripe' })).toEqual({ ok: false, error: 'INVALID_SOURCE' });
      expect(validateEntitlementChange({ plan: 'pro', source: 'gift', status: 'unknown' })).toEqual({ ok: false, error: 'INVALID_STATUS' });
      expect(validateEntitlementChange({ plan: 'pro', source: 'none' })).toEqual({ ok: false, error: 'INVALID_PRO_SOURCE' });
      expect(validateEntitlementChange({ plan: 'pro', source: 'gift', days: 0 })).toEqual({ ok: false, error: 'INVALID_DAYS' });
      expect(validateEntitlementChange({ plan: 'pro', source: 'gift', days: -5 })).toEqual({ ok: false, error: 'INVALID_DAYS' });

      expect(validateQuotaResetRequest({ userId: 'u-123', feature: 'all' })).toEqual({ ok: true });
      expect(validateQuotaResetRequest({ userId: 'u-123', feature: 'guided_query' })).toEqual({ ok: true });
      expect(validateQuotaResetRequest({ userId: '', feature: 'all' })).toEqual({ ok: false, error: 'MISSING_USER_ID' });
      expect(validateQuotaResetRequest({ userId: 'u-123', feature: 'bad_feature' })).toEqual({ ok: false, error: 'INVALID_FEATURE' });
    });
  });

  describe('formatAuditSummary', () => {
    it('formatea todas las acciones administrativas de forma legible', () => {
      expect(formatAuditSummary({
        action: 'set_entitlement',
        payload: { plan: 'pro', source: 'gift', status: 'active', days: 30, notes: 'Tester Android' }
      })).toContain('PRO [gift/active] (30d) — Tester Android');

      expect(formatAuditSummary({
        action: 'set_entitlement',
        payload: { plan: 'pro', source: 'admin', status: 'active', days: null }
      })).toContain('(permanente)');

      expect(formatAuditSummary({
        action: 'reset_ai_quota',
        payload: { feature: 'guided_query', rows_reset: 3 }
      })).toContain('guided_query, 3 registros');

      expect(formatAuditSummary({
        action: 'manage_household',
        payload: { action: 'transfer_owner', household_id: 'h1' }
      })).toContain('Titularidad de hogar transferida');

      expect(formatAuditSummary({
        action: 'manage_household',
        payload: { action: 'remove_member', household_id: 'h1' }
      })).toContain('Miembro desvinculado');

      expect(formatAuditSummary({
        action: 'manage_household',
        payload: { action: 'regenerate_code', invite_code: 'AB12CD34' }
      })).toContain('AB12CD34');

      expect(formatAuditSummary({
        action: 'delete_user_data',
        payload: { mode: 'delete_account' }
      })).toContain('eliminados completamente');

      expect(formatAuditSummary({
        action: 'delete_user_data',
        payload: { mode: 'wipe_data' }
      })).toContain('limpiados en la nube');
    });
  });
});
