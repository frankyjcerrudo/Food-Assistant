export const PLAY_PRODUCTS = ['sabory_pro_monthly', 'sabory_pro_annual'];

/**
 * Mapea una respuesta de Google Play AndroidPublisher `purchases.subscriptionsv2.get`
 * al registro de `public.entitlements`.
 */
export function mapSubscriptionV2ToEntitlement(sub, nowMs = Date.now()) {
  const lineItem = Array.isArray(sub?.lineItems) && sub.lineItems.length > 0
    ? sub.lineItems[0]
    : null;

  const period_end = lineItem?.expiryTime || null;
  const is_trial = lineItem?.offerDetails?.offerId === 'trial-14d';
  const play_product_id = lineItem?.productId || null;
  const state = sub?.subscriptionState || '';

  let plan = 'free';
  let status = 'expired';

  switch (state) {
    case 'SUBSCRIPTION_STATE_ACTIVE':
      plan = 'pro';
      status = 'active';
      break;
    case 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD':
      plan = 'pro';
      status = 'grace';
      break;
    case 'SUBSCRIPTION_STATE_CANCELED': {
      const expiryMs = period_end ? Date.parse(period_end) : NaN;
      if (Number.isFinite(expiryMs) && expiryMs > nowMs) {
        plan = 'pro';
        status = 'canceled';
      } else {
        plan = 'free';
        status = 'expired';
      }
      break;
    }
    case 'SUBSCRIPTION_STATE_ON_HOLD':
    case 'SUBSCRIPTION_STATE_PAUSED':
    case 'SUBSCRIPTION_STATE_PENDING':
      plan = 'free';
      status = 'on_hold';
      break;
    case 'SUBSCRIPTION_STATE_EXPIRED':
    default:
      plan = 'free';
      status = 'expired';
      break;
  }

  return {
    plan,
    status,
    period_end,
    is_trial,
    play_product_id
  };
}

/**
 * Decodifica un mensaje push de Google Cloud Pub/Sub (RTDN de Play Billing).
 * Nunca lanza excepciones ante cuerpos corruptos o inesperados.
 */
export function parseRtdnMessage(body) {
  try {
    const encoded = body?.message?.data;
    if (typeof encoded !== 'string' || !encoded.trim()) {
      return { type: 'unknown' };
    }

    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonText = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonText);

    if (parsed?.subscriptionNotification?.purchaseToken) {
      return {
        type: 'subscription',
        purchaseToken: parsed.subscriptionNotification.purchaseToken,
        subscriptionId: parsed.subscriptionNotification.subscriptionId || null,
        notificationType: parsed.subscriptionNotification.notificationType ?? null
      };
    }

    if (parsed?.testNotification) {
      return {
        type: 'test',
        version: parsed.testNotification.version || null
      };
    }

    return { type: 'unknown' };
  } catch {
    return { type: 'unknown' };
  }
}

/**
 * Construye los claims JWT OAuth 2.0 para la cuenta de servicio de Google Play.
 */
export function buildServiceAccountJwtClaims(sa, nowSec = Math.floor(Date.now() / 1000)) {
  const iat = Math.floor(Number(nowSec) || 0);
  return {
    iss: sa?.client_email || '',
    scope: 'https://www.googleapis.com/auth/androidpublisher',
    aud: 'https://oauth2.googleapis.com/token',
    iat,
    exp: iat + 3600
  };
}
