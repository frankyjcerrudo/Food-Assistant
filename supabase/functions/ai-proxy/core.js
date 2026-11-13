export const AI_FEATURES = ['chat', 'voice', 'guided_query', 'weekly_plan', 'import_ai'];
export const MAX_PAYLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_OUTPUT_TOKENS = 8192;
export const MODEL_CHAINS = {
  free: ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'],
  pro: ['gemini-3.8-flash', 'gemini-3.5-flash-lite']
};

const ALLOWED_PAYLOAD_KEYS = ['contents', 'systemInstruction', 'tools', 'toolConfig', 'generationConfig'];

export function resolveModelChain(plan) {
  return MODEL_CHAINS[plan === 'pro' ? 'pro' : 'free'];
}

export function validateAiRequest(body, rawLength = 0) {
  if (rawLength > MAX_PAYLOAD_BYTES) {
    return { ok: false, status: 413, code: 'PAYLOAD_TOO_LARGE' };
  }
  if (!body || typeof body !== 'object' || !AI_FEATURES.includes(body.feature)) {
    return { ok: false, status: 400, code: 'INVALID_FEATURE' };
  }
  const payload = body.payload;
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.contents) || payload.contents.length === 0) {
    return { ok: false, status: 400, code: 'INVALID_PAYLOAD' };
  }
  return { ok: true };
}

export function sanitizePayload(payload = {}) {
  const clean = {};
  for (const key of ALLOWED_PAYLOAD_KEYS) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }
  const rawGenConfig = clean.generationConfig && typeof clean.generationConfig === 'object' ? { ...clean.generationConfig } : {};
  const requestedTokens = Number(rawGenConfig.maxOutputTokens);
  rawGenConfig.maxOutputTokens = requestedTokens > 0
    ? Math.min(requestedTokens, MAX_OUTPUT_TOKENS)
    : MAX_OUTPUT_TOKENS;
  clean.generationConfig = rawGenConfig;
  return clean;
}

export function extractUsage(geminiData) {
  const meta = geminiData?.usageMetadata;
  return {
    promptTokens: Number(meta?.promptTokenCount) || 0,
    outputTokens: Number(meta?.candidatesTokenCount) || 0
  };
}

export function timeoutForModel(model) {
  return model === 'gemini-3.8-flash' ? 16000 : 20000;
}

const QUOTA_ERROR_STATUS = {
  PRO_REQUIRED: 403,
  QUOTA_EXCEEDED: 402,
  RATE_LIMITED: 429,
  INVALID_FEATURE: 400
};

export function mapQuotaResult(rpc) {
  if (rpc?.allowed) return null;
  const code = rpc?.code || 'QUOTA_ERROR';
  const status = QUOTA_ERROR_STATUS[code] ?? 400;
  return {
    status,
    body: {
      ok: false,
      code,
      quota: {
        feature: rpc?.feature ?? null,
        used: rpc?.used ?? null,
        limit: rpc?.limit ?? null,
        remaining: rpc?.remaining ?? null,
        period: rpc?.period ?? null,
        plan: rpc?.plan ?? 'free'
      }
    }
  };
}
