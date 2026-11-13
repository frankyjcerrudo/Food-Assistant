// @ts-ignore - resolución de Deno
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  extractUsage,
  MAX_PAYLOAD_BYTES,
  resolveModelChain,
  sanitizePayload,
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

  // Provisional en US-79a; en US-79c se sustituye por la RPC de cuotas
  const plan = 'pro';
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  let usageId: number | null = null;
  const { data: insertedUsage } = await adminClient
    .from('ai_usage')
    .insert({ user_id: user.id, feature: body.feature, status: 'pending' })
    .select('id')
    .single();
  if (insertedUsage?.id) usageId = insertedUsage.id;

  const cleanPayload = sanitizePayload(body.payload);
  const models = resolveModelChain(plan);
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
            prompt_tokens: usage.promptTokens,
            output_tokens: usage.outputTokens
          })
          .eq('id', usageId);
      }

      return json({
        ok: true,
        model,
        data: geminiData,
        quota: null
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
