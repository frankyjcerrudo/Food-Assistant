// @ts-ignore - resolución de Deno
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PLAY_PRODUCTS, mapSubscriptionV2ToEntitlement } from '../_shared/play.js';
import {
  acknowledgeSubscription,
  fetchSubscriptionV2,
  getPlayAccessToken,
  type GoogleServiceAccount
} from '../_shared/play-auth.ts';

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
  const saRaw = Deno.env.get('GOOGLE_PLAY_SERVICE_ACCOUNT_JSON') || '';
  const packageName = Deno.env.get('GOOGLE_PLAY_PACKAGE') || 'food.sabory.app';

  const authHeader = req.headers.get('Authorization') || '';
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: authData, error: authError } = await userClient.auth.getUser();
  const user = authData?.user;
  if (authError || !user) {
    return json({ ok: false, code: 'AUTH_REQUIRED' }, 401);
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, code: 'INVALID_JSON' }, 400);
  }

  const productId = typeof body?.productId === 'string' ? body.productId.trim() : '';
  const purchaseToken = typeof body?.purchaseToken === 'string' ? body.purchaseToken.trim() : '';

  if (!PLAY_PRODUCTS.includes(productId) || !purchaseToken) {
    return json({ ok: false, code: 'INVALID_PURCHASE_REQUEST' }, 400);
  }

  if (!saRaw || !serviceRoleKey) {
    return json({ ok: false, code: 'BILLING_NOT_CONFIGURED' }, 503);
  }

  let sa: GoogleServiceAccount;
  try {
    sa = JSON.parse(saRaw);
  } catch {
    return json({ ok: false, code: 'BILLING_NOT_CONFIGURED' }, 503);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // Evitar robo o reutilización del mismo token entre cuentas distintas
  const { data: existingTokenRow, error: lookupError } = await adminClient
    .from('entitlements')
    .select('user_id')
    .eq('play_purchase_token', purchaseToken)
    .maybeSingle();

  if (lookupError) {
    console.error('[verify-purchase] token lookup error:', lookupError);
    return json({ ok: false, code: 'DB_ERROR' }, 500);
  }

  if (existingTokenRow && existingTokenRow.user_id !== user.id) {
    return json({ ok: false, code: 'TOKEN_IN_USE' }, 409);
  }

  let sub: any;
  let accessToken: string;
  try {
    accessToken = await getPlayAccessToken(sa);
    sub = await fetchSubscriptionV2(packageName, purchaseToken, accessToken);
  } catch (err: any) {
    console.error('[verify-purchase] Google Play API error:', err?.message || err);
    const status = err?.status === 404 || err?.status === 400 ? 400 : 502;
    return json({ ok: false, code: 'PLAY_VERIFICATION_FAILED' }, status);
  }

  const mapped = mapSubscriptionV2ToEntitlement(sub);
  const resolvedProductId = mapped.play_product_id || productId;

  const { error: upsertError } = await adminClient
    .from('entitlements')
    .upsert({
      user_id: user.id,
      plan: mapped.plan,
      source: 'play',
      status: mapped.status,
      period_end: mapped.period_end,
      is_trial: mapped.is_trial,
      play_product_id: resolvedProductId,
      play_purchase_token: purchaseToken,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (upsertError) {
    console.error('[verify-purchase] entitlements upsert error:', upsertError);
    return json({ ok: false, code: 'DB_ERROR' }, 500);
  }

  if (sub?.acknowledgementState === 'ACKNOWLEDGEMENT_STATE_PENDING') {
    try {
      await acknowledgeSubscription(packageName, resolvedProductId, purchaseToken, accessToken);
    } catch (ackErr: any) {
      console.error('[verify-purchase] acknowledge error:', ackErr?.message || ackErr);
      return json({ ok: false, code: 'ACKNOWLEDGE_FAILED' }, 502);
    }
  }

  return json({
    ok: true,
    plan: mapped.plan,
    status: mapped.status,
    period_end: mapped.period_end,
    is_trial: mapped.is_trial,
    play_product_id: resolvedProductId
  }, 200);
});
