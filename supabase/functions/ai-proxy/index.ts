// @ts-ignore - resolución de Deno
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  applySousChefIdentityGuard,
  buildRoutingDecisionRequest,
  DECISION_MODEL,
  evaluateRoutingDecision,
  extractLastUserText,
  extractUsage,
  mapQuotaResult,
  MAX_PAYLOAD_BYTES,
  resolveModelChain,
  sanitizePayload,
  shouldRunRoutingDecision,
  SOUS_CHEF_GUARDRAIL_REPLY_EN,
  SOUS_CHEF_GUARDRAIL_REPLY_ES,
  timeoutForModel,
  validateAiRequest
} from './core.js';

declare const Deno: any;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' }
  });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ ok: false, code: 'METHOD_NOT_ALLOWED' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || '';

  const authHeader = req.headers.get('Authorization') || '';
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: authData, error: authError } = await userClient.auth.getUser();
  const user = authData?.user;
  if (authError || !user) {
    return json({ ok: false, code: 'AUTH_REQUIRED' }, 401);
  }

  let rawText = '';
  try {
    rawText = await req.text();
  } catch {
    return json({ ok: false, code: 'INVALID_PAYLOAD' }, 400);
  }

  const rawBytes = new TextEncoder().encode(rawText).length;
  if (rawBytes > MAX_PAYLOAD_BYTES) {
    return json({ ok: false, code: 'PAYLOAD_TOO_LARGE' }, 413);
  }

  let body: any = null;
  try {
    body = JSON.parse(rawText);
  } catch {
    return json({ ok: false, code: 'INVALID_PAYLOAD' }, 400);
  }

  const validation = validateAiRequest(body, rawBytes);
  if (!validation.ok) {
    return json({ ok: false, code: validation.code }, validation.status);
  }

  if (!geminiApiKey) {
    return json({ ok: false, code: 'UPSTREAM_ERROR', message: 'Missing Gemini API key on server' }, 502);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: quotaRpc, error: quotaErr } = await adminClient.rpc('consume_ai_quota', {
    p_user: user.id,
    p_feature: body.feature
  });
  if (quotaErr) {
    return json({ ok: false, code: 'QUOTA_CHECK_ERROR', message: quotaErr.message }, 502);
  }
  const mappedQuota = mapQuotaResult(quotaRpc);
  if (mappedQuota) {
    return json(mappedQuota.body, mappedQuota.status);
  }

  const plan = quotaRpc.plan === 'pro' ? 'pro' : 'free';
  const usageId: number | null = quotaRpc.usage_id ?? null;
  const quotaInfo = {
    feature: quotaRpc.feature ?? body.feature,
    used: quotaRpc.used ?? null,
    limit: quotaRpc.limit ?? null,
    remaining: quotaRpc.remaining ?? null,
    period: quotaRpc.period ?? null,
    plan
  };

  const cleanPayload = applySousChefIdentityGuard(sanitizePayload(body.payload));
  const isDirectDecision = Boolean(
    cleanPayload.decisions
    && (!Array.isArray(cleanPayload.contents) || cleanPayload.contents.length === 0)
  );

  if (isDirectDecision) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutForModel(DECISION_MODEL));
    let decisionError = 'Decision upstream request failed';
    try {
      const decisionRes = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/decisions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiApiKey
          },
          body: JSON.stringify({
            model: DECISION_MODEL,
            input: cleanPayload.decisions.input,
            questions: cleanPayload.decisions.questions
          }),
          signal: controller.signal
        }
      );

      if (decisionRes.ok) {
        const decisionData = await decisionRes.json();
        const usage = extractUsage(decisionData);

        if (usageId !== null) {
          await adminClient
            .from('ai_usage')
            .update({
              status: 'ok',
              model: DECISION_MODEL,
              prompt_tokens: usage.promptTokens,
              output_tokens: 0
            })
            .eq('id', usageId);
        }

        return json({
          ok: true,
          model: DECISION_MODEL,
          data: decisionData,
          quota: quotaInfo
        });
      }

      const errData = await decisionRes.json().catch(() => ({}));
      decisionError = errData?.error?.message || `HTTP ${decisionRes.status} on ${DECISION_MODEL}`;
    } catch (err: any) {
      decisionError = err?.name === 'AbortError'
        ? `Timeout on ${DECISION_MODEL}`
        : (err?.message || 'Decision fetch error');
    } finally {
      clearTimeout(timer);
    }

    if (usageId !== null) {
      await adminClient
        .from('ai_usage')
        .update({ status: 'error' })
        .eq('id', usageId);
    }

    return json({ ok: false, code: 'UPSTREAM_ERROR', message: decisionError }, 502);
  }

  let models = resolveModelChain(plan);
  let decisionMeta: Record<string, unknown> | null = null;
  let decisionPromptTokens = 0;

  if (shouldRunRoutingDecision(body.feature, cleanPayload)) {
    const lastUserText = extractLastUserText(cleanPayload);
    const decisionController = new AbortController();
    const decisionTimer = setTimeout(() => decisionController.abort(), timeoutForModel(DECISION_MODEL));
    try {
      const decisionRes = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/decisions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiApiKey
          },
          body: JSON.stringify(buildRoutingDecisionRequest(lastUserText, body.feature)),
          signal: decisionController.signal
        }
      );

      if (decisionRes.ok) {
        const decisionJson = await decisionRes.json();
        const decisionUsage = extractUsage(decisionJson);
        decisionPromptTokens = decisionUsage.promptTokens;
        const decisionEval = evaluateRoutingDecision(decisionJson, plan, body.feature);

        if (decisionEval.blockedByGuardrail) {
          const sysText = JSON.stringify(cleanPayload.systemInstruction || '');
          const isEnglish = sysText.includes('STRICTLY SPANISH & ENGLISH ONLY');
          const replyText = isEnglish ? SOUS_CHEF_GUARDRAIL_REPLY_EN : SOUS_CHEF_GUARDRAIL_REPLY_ES;

          if (usageId !== null) {
            await adminClient
              .from('ai_usage')
              .update({
                status: 'ok',
                model: DECISION_MODEL,
                prompt_tokens: decisionPromptTokens,
                output_tokens: 0
              })
              .eq('id', usageId);
          }

          return json({
            ok: true,
            model: DECISION_MODEL,
            decision: decisionEval,
            data: {
              candidates: [
                {
                  content: {
                    role: 'model',
                    parts: [{ text: replyText }]
                  }
                }
              ]
            },
            quota: quotaInfo
          });
        }

        models = decisionEval.models;
        decisionMeta = decisionEval;
      }
    } catch {
      // Fallback transparente a la cadena estándar de modelos si Decisions API falla o excede el timeout
    } finally {
      clearTimeout(decisionTimer);
    }
  }

  let lastError = 'Upstream request failed';

  for (const model of models) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutForModel(model));
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiApiKey
          },
          body: JSON.stringify(cleanPayload),
          signal: controller.signal
        }
      );

      if (response.status === 429 || response.status === 503) {
        lastError = `HTTP ${response.status} on ${model}`;
        continue;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        lastError = errData?.error?.message || `HTTP ${response.status} on ${model}`;
        continue;
      }

      const geminiData = await response.json();
      const usage = extractUsage(geminiData);

      if (usageId !== null) {
        await adminClient
          .from('ai_usage')
          .update({
            status: 'ok',
            model,
            prompt_tokens: usage.promptTokens + decisionPromptTokens,
            output_tokens: usage.outputTokens
          })
          .eq('id', usageId);
      }

      return json({
        ok: true,
        model,
        ...(decisionMeta ? { decision: decisionMeta } : {}),
        data: geminiData,
        quota: quotaInfo
      });
    } catch (err: any) {
      lastError = err?.name === 'AbortError' ? `Timeout on ${model}` : (err?.message || 'Fetch error');
    } finally {
      clearTimeout(timer);
    }
  }

  if (usageId !== null) {
    await adminClient
      .from('ai_usage')
      .update({ status: 'error' })
      .eq('id', usageId);
  }

  return json({ ok: false, code: 'UPSTREAM_ERROR', message: lastError }, 502);
});
