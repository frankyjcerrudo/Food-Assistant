// @ts-ignore - resolución de Deno
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { mapSubscriptionV2ToEntitlement, parseRtdnMessage } from '../_shared/play.js';
import {
  fetchSubscriptionV2,
  getPlayAccessToken,
  type GoogleServiceAccount
} from '../_shared/play-auth.ts';

declare const Deno: any;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ ok: false, code: 'METHOD_NOT_ALLOWED' }, 405);

  const expectedSecret = Deno.env.get('PLAY_RTDN_SECRET') || '';
  const url = new URL(req.url);
  const providedSecret = url.searchParams.get('secret') || '';

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return json({ ok: false, code: 'UNAUTHORIZED' }, 401);
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return json({ ok: true, ignored: true }, 200);
  }

  const rtdn = parseRtdnMessage(body);
  if (rtdn.type === 'test') {
    console.log('[play-webhook] RTDN test notification received:', rtdn.version);
    return json({ ok: true, type: 'test' }, 200);
  }

  if (rtdn.type !== 'subscription' || !rtdn.purchaseToken) {
    return json({ ok: true, ignored: true }, 200);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const saRaw = Deno.env.get('GOOGLE_PLAY_SERVICE_ACCOUNT_JSON') || '';
  const packageName = Deno.env.get('GOOGLE_PLAY_PACKAGE') || 'food.sabory.app';

  if (!supabaseUrl || !serviceRoleKey || !saRaw) {
    console.error('[play-webhook] Missing Supabase or Google Play env vars');
    return json({ ok: false, code: 'BILLING_NOT_CONFIGURED' }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: existingRow, error: lookupError } = await adminClient
    .from('entitlements')
    .select('user_id, play_product_id')
    .eq('play_purchase_token', rtdn.purchaseToken)
    .maybeSingle();

  if (lookupError) {
    console.error('[play-webhook] lookup error:', lookupError);
    return json({ ok: false, code: 'DB_ERROR' }, 500);
  }

  if (!existingRow?.user_id) {
    console.log('[play-webhook] Ignored RTDN for unknown purchaseToken (notificationType:', rtdn.notificationType, ')');
    return json({ ok: true, ignored: true }, 200);
  }

  let sa: GoogleServiceAccount;
  try {
    sa = JSON.parse(saRaw);
  } catch {
    return json({ ok: false, code: 'BILLING_NOT_CONFIGURED' }, 500);
  }

  try {
    const accessToken = await getPlayAccessToken(sa);
    const sub = await fetchSubscriptionV2(packageName, rtdn.purchaseToken, accessToken);
    const mapped = mapSubscriptionV2ToEntitlement(sub);

    const { error: updateError } = await adminClient
      .from('entitlements')
      .update({
        plan: mapped.plan,
        status: mapped.status,
        period_end: mapped.period_end,
        is_trial: mapped.is_trial,
        play_product_id: mapped.play_product_id || existingRow.play_product_id || rtdn.subscriptionId,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', existingRow.user_id);

    if (updateError) {
      console.error('[play-webhook] update error:', updateError);
      return json({ ok: false, code: 'DB_ERROR' }, 500);
    }

    return json({ ok: true, plan: mapped.plan, status: mapped.status }, 200);
  } catch (err: any) {
    console.error('[play-webhook] Google Play API error:', err?.message || err);
    return json({ ok: false, code: 'PLAY_API_ERROR' }, 502);
  }
});
