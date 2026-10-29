// Food Assistant - Edge Function `food-assistant-agent` (US-69, Fase 3)
//
// Despliegue (el token propio fa_live_... sustituye al JWT de Supabase):
//   supabase functions deploy food-assistant-agent --no-verify-jwt
//
// Rutas (relativas a /functions/v1/food-assistant-agent):
//   POST /            o  /command   -> { "command": "..." }  lenguaje natural (Gemini) -> { ok, speech, actionsExecuted }
//   POST /mcp                       -> servidor MCP (JSON-RPC: initialize, tools/list, tools/call)
//   POST /tools/<nombre>            -> ejecuta una herramienta directamente (ChatGPT Actions)
//   GET  /openapi.json              -> especificación OpenAPI 3.1 (pública)
//
// Todas, salvo openapi.json, exigen:  Authorization: Bearer fa_live_...

// @ts-ignore - resolución de Deno
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  buildOpenApiSpec,
  buildSpeech,
  dispatchHeadlessAgentAction,
  extractBearerToken,
  handleMcpMessage,
  MCP_TOOLS,
  runNaturalLanguageCommand,
  sha256Hex
} from './core.js';

declare const Deno: any;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, mcp-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const url = new URL(req.url);
  const route = url.pathname.replace(/^.*\/food-assistant-agent/, '').replace(/\/+$/, '') || '/';
  const baseUrl = `${url.origin}${url.pathname.replace(/\/food-assistant-agent.*$/, '')}/food-assistant-agent`;

  if (req.method === 'GET' && route === '/openapi.json') return json(buildOpenApiSpec(baseUrl));
  if (req.method !== 'POST') return json({ ok: false, error: 'Método no permitido' }, 405);

  // ---- Autenticación por token de agente
  const token = extractBearerToken(req.headers.get('Authorization'));
  if (!token) return json({ ok: false, error: 'Falta el token Bearer fa_live_...' }, 401);

  const admin = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false }
  });

  const hash = await sha256Hex(token);
  const { data: owner } = await admin
    .from('user_settings')
    .select('user_id')
    .eq('agent_token_hash', hash)
    .eq('agent_enabled', true)
    .maybeSingle();
  if (!owner?.user_id) return json({ ok: false, error: 'Token inválido, revocado o acceso externo desactivado' }, 401);
  const userId: string = owner.user_id;

  // ---- Adaptador de datos (siempre acotado al usuario autenticado)
  const db = {
    async select(table: string) {
      const q = admin.from(table).select('*').eq('user_id', userId);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return data || [];
    },
    async upsert(table: string, rows: unknown[]) {
      const { error } = await admin.from(table).upsert(rows, { onConflict: 'user_id,id' });
      if (error) throw new Error(error.message);
    },
    async remove(table: string, ids: string[]) {
      const { error } = await admin.from(table).delete().in('id', ids).eq('user_id', userId);
      if (error) throw new Error(error.message);
    }
  };

  let body: any = {};
  try { body = await req.json(); } catch { /* cuerpo vacío */ }

  try {
    if (route === '/mcp') {
      if (Array.isArray(body)) {
        const out = (await Promise.all(body.map((m) => handleMcpMessage(m, db, userId)))).filter(Boolean);
        return out.length ? json(out) : new Response(null, { status: 202, headers: CORS });
      }
      const out = await handleMcpMessage(body, db, userId);
      return out ? json(out) : new Response(null, { status: 202, headers: CORS });
    }

    const toolMatch = /^\/tools\/([a-z_]+)$/.exec(route);
    if (toolMatch) {
      if (!MCP_TOOLS.some((t: any) => t.name === toolMatch[1])) return json({ ok: false, error: 'Herramienta desconocida' }, 404);
      const out = await dispatchHeadlessAgentAction(db, userId, toolMatch[1], body);
      return json({ ...out, speech: buildSpeech([out]) }, out.ok ? 200 : 400);
    }

    if (route === '/' || route === '/command') {
      const command = String(body.command || '').trim();
      if (!command) return json({ ok: false, error: 'Falta "command"' }, 400);

      let geminiApiKey: string = body.geminiApiKey || Deno.env.get('GEMINI_API_KEY') || '';
      if (!geminiApiKey) {
        const { data: u } = await admin.auth.admin.getUserById(userId);
        geminiApiKey = u?.user?.user_metadata?.gemini_api_key || '';
      }
      if (!geminiApiKey) {
        return json({ ok: false, speech: 'Falta la clave de Gemini en tu cuenta.', error: 'Sin clave Gemini' }, 400);
      }
      const result = await runNaturalLanguageCommand({ command, db, userId, geminiApiKey });
      return json(result, result.ok ? 200 : 207);
    }

    return json({ ok: false, error: 'Ruta no encontrada' }, 404);
  } catch (err) {
    return json({ ok: false, speech: 'Ha ocurrido un error al ejecutar la orden.', error: String((err as Error)?.message || err) }, 500);
  }
});
