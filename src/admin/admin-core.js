/**
 * Lógica pura de cálculo, validación y formato para Sabory Admin (US-87).
 * Módulo ESM sin dependencias de DOM ni de Supabase para testeo determinista.
 */

export const GEMINI_PRICING_USD = Object.freeze({
  'gemini-3.8-flash': Object.freeze({ inputPer1M: 0.30, outputPer1M: 2.50 }),
  'gemini-3.5-flash-lite': Object.freeze({ inputPer1M: 0.10, outputPer1M: 0.40 }),
  'gemini-3.1-flash-lite': Object.freeze({ inputPer1M: 0.075, outputPer1M: 0.30 }),
  default: Object.freeze({ inputPer1M: 0.15, outputPer1M: 0.60 })
});

export const DEFAULT_EUR_PER_USD = 0.92;

export const DEFAULT_SUBSCRIPTION_PRICES = Object.freeze({
  monthlyEur: 2.99,
  annualEur: 24.99
});

export const VALID_PLANS = Object.freeze(['free', 'pro']);
export const VALID_SOURCES = Object.freeze(['none', 'play', 'gift', 'admin']);
export const VALID_STATUSES = Object.freeze(['active', 'grace', 'on_hold', 'canceled', 'expired']);
export const VALID_QUOTA_FEATURES = Object.freeze(['all', 'weekly_plan', 'guided_query', 'import_ai', 'chat', 'voice']);
export const VALID_HOUSEHOLD_ACTIONS = Object.freeze(['transfer_owner', 'remove_member', 'regenerate_code']);
export const VALID_DELETE_MODES = Object.freeze(['wipe_data', 'delete_account']);

function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function toNonNegativeInt(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return 0;
  return Math.floor(num);
}

/**
 * Estima el coste en USD de una fila o agregado de `ai_usage`.
 * @param {object} row
 * @param {object} [pricing]
 * @returns {number}
 */
export function estimateAiRowCostUsd(row = {}, pricing = GEMINI_PRICING_USD) {
  const model = typeof row?.model === 'string' && row.model.trim() ? row.model.trim() : 'default';
  const rates = pricing[model] || pricing.default || GEMINI_PRICING_USD.default;
  const promptTokens = toNonNegativeInt(row?.prompt_tokens ?? row?.promptTokens);
  const outputTokens = toNonNegativeInt(row?.output_tokens ?? row?.outputTokens);
  const usd = (promptTokens / 1_000_000) * rates.inputPer1M + (outputTokens / 1_000_000) * rates.outputPer1M;
  return roundTo(usd, 6);
}

function createUsageBucket() {
  return {
    calls: 0,
    ok: 0,
    error: 0,
    reset: 0,
    promptTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    costUsd: 0,
    costEur: 0
  };
}

function addToBucket(bucket, stats) {
  bucket.calls += stats.calls;
  bucket.ok += stats.ok;
  bucket.error += stats.error;
  bucket.reset += stats.reset;
  bucket.promptTokens += stats.promptTokens;
  bucket.outputTokens += stats.outputTokens;
  bucket.totalTokens += stats.promptTokens + stats.outputTokens;
  bucket.costUsd = roundTo(bucket.costUsd + stats.costUsd, 6);
  bucket.costEur = roundTo(bucket.costEur + stats.costEur, 6);
}

/**
 * Agrega llamadas, tokens y costes estimados (USD/EUR) por feature y por modelo.
 * Admite tanto filas individuales de `ai_usage` como filas ya agrupadas desde SQL.
 * @param {Array<object>} rows
 * @param {number} [eurPerUsd]
 * @param {object} [pricing]
 */
export function summarizeAiUsage(rows = [], eurPerUsd = DEFAULT_EUR_PER_USD, pricing = GEMINI_PRICING_USD) {
  const list = Array.isArray(rows) ? rows : [];
  const rate = Number.isFinite(Number(eurPerUsd)) && Number(eurPerUsd) > 0 ? Number(eurPerUsd) : DEFAULT_EUR_PER_USD;

  let callsTotal = 0;
  let callsOk = 0;
  let callsError = 0;
  let callsReset = 0;
  let promptTokens = 0;
  let outputTokens = 0;
  let costUsd = 0;
  const byFeature = {};
  const byModel = {};

  for (const row of list) {
    if (!row || typeof row !== 'object') continue;
    const isAggregated = row.calls !== undefined || row.ok_calls !== undefined || row.error_calls !== undefined || row.reset_calls !== undefined;
    const ok = isAggregated ? toNonNegativeInt(row.ok_calls ?? row.ok) : (row.status === 'ok' ? 1 : 0);
    const error = isAggregated ? toNonNegativeInt(row.error_calls ?? row.error) : (row.status === 'error' ? 1 : 0);
    const reset = isAggregated ? toNonNegativeInt(row.reset_calls ?? row.reset) : (row.status === 'reset' ? 1 : 0);
    const calls = isAggregated ? toNonNegativeInt(row.calls ?? (ok + error + reset)) : 1;

    const pTok = toNonNegativeInt(row.prompt_tokens ?? row.promptTokens);
    const oTok = toNonNegativeInt(row.output_tokens ?? row.outputTokens);
    const rowUsd = estimateAiRowCostUsd({ model: row.model, promptTokens: pTok, outputTokens: oTok }, pricing);
    const rowEur = roundTo(rowUsd * rate, 6);

    callsTotal += calls;
    callsOk += ok;
    callsError += error;
    callsReset += reset;
    promptTokens += pTok;
    outputTokens += oTok;
    costUsd = roundTo(costUsd + rowUsd, 6);

    const featureKey = typeof row.feature === 'string' && row.feature.trim() ? row.feature.trim() : 'unknown';
    const modelKey = typeof row.model === 'string' && row.model.trim() ? row.model.trim() : 'unknown';
    const stats = { calls, ok, error, reset, promptTokens: pTok, outputTokens: oTok, costUsd: rowUsd, costEur: rowEur };

    if (!byFeature[featureKey]) byFeature[featureKey] = createUsageBucket();
    addToBucket(byFeature[featureKey], stats);

    if (!byModel[modelKey]) byModel[modelKey] = createUsageBucket();
    addToBucket(byModel[modelKey], stats);
  }

  const costEur = roundTo(costUsd * rate, 6);
  const errorRatePct = callsTotal > 0 ? roundTo((callsError / callsTotal) * 100, 2) : 0;

  return {
    callsTotal,
    callsOk,
    callsError,
    callsReset,
    errorRatePct,
    promptTokens,
    outputTokens,
    totalTokens: promptTokens + outputTokens,
    costUsd,
    costEur,
    byFeature,
    byModel
  };
}

/**
 * Calcula MRR, ARR y tasas de conversión y cobertura Pro a partir del desglose de planes.
 * Solo las suscripciones de pago (`play_monthly`, `play_annual`) generan ingresos recurrentes;
 * `gift`, `admin`, `trial` y `household_pro` suman en `proTotal` pero no en MRR.
 * @param {object} plans
 * @param {number} [totalUsers]
 * @param {object} [prices]
 */
export function computeRevenueMetrics(plans = {}, totalUsers = 0, prices = DEFAULT_SUBSCRIPTION_PRICES) {
  const paidMonthly = toNonNegativeInt(plans?.play_monthly ?? plans?.playMonthly);
  const paidAnnual = toNonNegativeInt(plans?.play_annual ?? plans?.playAnnual);
  const trial = toNonNegativeInt(plans?.trial);
  const gift = toNonNegativeInt(plans?.gift);
  const admin = toNonNegativeInt(plans?.admin);
  const householdPro = toNonNegativeInt(plans?.household_pro ?? plans?.householdPro);

  const paidUsers = paidMonthly + paidAnnual;
  const proTotal = paidUsers + trial + gift + admin + householdPro;

  const hasExplicitFree = plans?.free !== undefined && plans?.free !== null;
  const explicitTotal = toNonNegativeInt(totalUsers);
  const freeTotal = hasExplicitFree
    ? toNonNegativeInt(plans.free)
    : Math.max(0, explicitTotal - proTotal);
  const baseUsers = explicitTotal > 0 ? explicitTotal : (freeTotal + proTotal);

  const monthlyEur = Number(prices?.monthlyEur) > 0 ? Number(prices.monthlyEur) : DEFAULT_SUBSCRIPTION_PRICES.monthlyEur;
  const annualEur = Number(prices?.annualEur) > 0 ? Number(prices.annualEur) : DEFAULT_SUBSCRIPTION_PRICES.annualEur;

  const mrrEur = roundTo((paidMonthly * monthlyEur) + (paidAnnual * (annualEur / 12)), 2);
  const arrEur = roundTo(mrrEur * 12, 2);
  const conversionRatePct = baseUsers > 0 ? roundTo((paidUsers / baseUsers) * 100, 2) : 0;
  const proCoveragePct = baseUsers > 0 ? roundTo((proTotal / baseUsers) * 100, 2) : 0;

  return {
    paidMonthly,
    paidAnnual,
    paidUsers,
    trial,
    gift,
    admin,
    householdPro,
    proTotal,
    freeTotal,
    totalUsers: baseUsers,
    mrrEur,
    arrEur,
    conversionRatePct,
    proCoveragePct
  };
}

/**
 * Valida los parámetros antes de invocar `admin_set_user_entitlement`.
 * @param {object} input
 */
export function validateEntitlementChange(input = {}) {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'INVALID_INPUT' };
  }
  const { plan, source, status = 'active', days = null } = input;
  if (!VALID_PLANS.includes(plan)) {
    return { ok: false, error: 'INVALID_PLAN' };
  }
  if (!VALID_SOURCES.includes(source)) {
    return { ok: false, error: 'INVALID_SOURCE' };
  }
  if (!VALID_STATUSES.includes(status)) {
    return { ok: false, error: 'INVALID_STATUS' };
  }
  if (plan === 'pro' && source === 'none') {
    return { ok: false, error: 'INVALID_PRO_SOURCE' };
  }
  if (days !== null && days !== undefined && days !== '') {
    const numDays = Number(days);
    if (!Number.isInteger(numDays) || numDays < 0) {
      return { ok: false, error: 'INVALID_DAYS' };
    }
    if (plan === 'pro' && numDays === 0) {
      return { ok: false, error: 'INVALID_DAYS' };
    }
  }
  return { ok: true };
}

/**
 * Valida la solicitud de reseteo de cuota IA (`admin_reset_user_ai_quota`).
 * @param {object} input
 */
export function validateQuotaResetRequest(input = {}) {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'INVALID_INPUT' };
  }
  const { userId, feature = 'all' } = input;
  if (typeof userId !== 'string' || !userId.trim()) {
    return { ok: false, error: 'MISSING_USER_ID' };
  }
  if (!VALID_QUOTA_FEATURES.includes(feature)) {
    return { ok: false, error: 'INVALID_FEATURE' };
  }
  return { ok: true };
}

/**
 * Formatea una entrada de `admin_audit_log` en un resumen legible para el historial.
 * @param {object} entry
 * @returns {string}
 */
export function formatAuditSummary(entry = {}) {
  const action = entry?.action || 'unknown';
  const payload = entry?.payload && typeof entry.payload === 'object' ? entry.payload : {};

  switch (action) {
    case 'set_entitlement': {
      const plan = payload.plan || 'free';
      const source = payload.source || 'none';
      const status = payload.status || 'active';
      const daysLabel = payload.days ? ` (${payload.days}d)` : (source === 'admin' && plan === 'pro' ? ' (permanente)' : '');
      const notes = payload.notes ? ` — ${payload.notes}` : '';
      return `Plan actualizado a ${plan.toUpperCase()} [${source}/${status}]${daysLabel}${notes}`;
    }
    case 'reset_ai_quota': {
      const feature = payload.feature || 'all';
      const count = toNonNegativeInt(payload.rows_reset ?? payload.count);
      return `Cuota IA reseteada (${feature}, ${count} registros)`;
    }
    case 'manage_household': {
      const subAction = payload.action || 'update';
      if (subAction === 'transfer_owner') {
        return `Titularidad de hogar transferida (${payload.household_id || 'hogar'})`;
      }
      if (subAction === 'remove_member') {
        return `Miembro desvinculado del hogar (${payload.household_id || 'hogar'})`;
      }
      if (subAction === 'regenerate_code') {
        return `Código de invitación regenerado (${payload.invite_code || 'hogar'})`;
      }
      return `Gestión de hogar: ${subAction}`;
    }
    case 'delete_user_data': {
      const mode = payload.mode || 'wipe_data';
      return mode === 'delete_account'
        ? 'Cuenta y datos eliminados completamente (GDPR)'
        : 'Datos de usuario limpiados en la nube';
    }
    default:
      return `Acción administrativa: ${action}`;
  }
}
