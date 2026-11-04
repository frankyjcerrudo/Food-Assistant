// Food Assistant - Supabase Edge Function: import-recipe (US-52)
// Proxy seguro para descargar y raspar recetas remotas sin depender de proxies públicos de terceros

declare const Deno: any;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

function isPrivateIp(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true;

  // IPv4 ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16
  const parts = host.split('.').map(Number);
  if (parts.length === 4 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 127) return true;
    if (parts[0] === 0) return true;
  }
  return false;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const reqUrl = new URL(req.url);
  let targetUrl = reqUrl.searchParams.get('url');

  if (!targetUrl && req.method === 'POST') {
    try {
      const body = await req.json();
      targetUrl = body.url;
    } catch {}
  }

  if (!targetUrl || typeof targetUrl !== 'string') {
    return new Response(JSON.stringify({ error: 'Parámetro "url" requerido.' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl.trim());
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Protocolo no permitido');
    }
  } catch {
    return new Response(JSON.stringify({ error: 'URL malformada o protocolo no seguro (solo http/https).' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  // Anti-SSRF check
  if (isPrivateIp(parsed.hostname)) {
    return new Response(JSON.stringify({ error: 'Acceso a direcciones IP locales o privadas denegado (SSRF protegido).' }), {
      status: 403,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const upstreamRes = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 FoodAssistant/1.14',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    });
    clearTimeout(timeout);

    if (!upstreamRes.ok) {
      return new Response(JSON.stringify({ error: `El servidor de la receta devolvió error ${upstreamRes.status}` }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    // Limit download size to 2.5 MB max
    const text = await upstreamRes.text();
    const safeText = text.slice(0, 2621440);

    return new Response(safeText, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'text/html; charset=utf-8',
        'X-Proxy-By': 'FoodAssistant-Supabase-Edge'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Error al conectar con la receta: ' + (err.message || 'Timeout') }), {
      status: 504,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
});

