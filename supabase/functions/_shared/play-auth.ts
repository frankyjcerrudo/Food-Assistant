// @ts-ignore - resolución de Deno
import { importPKCS8, SignJWT } from 'https://esm.sh/jose@5';
import { buildServiceAccountJwtClaims } from './play.js';

export interface GoogleServiceAccount {
  client_email: string;
  private_key: string;
}

export async function getPlayAccessToken(sa: GoogleServiceAccount): Promise<string> {
  if (!sa?.client_email || !sa?.private_key) {
    throw new Error('INVALID_SERVICE_ACCOUNT');
  }
  const key = await importPKCS8(sa.private_key, 'RS256');
  const claims = buildServiceAccountJwtClaims(sa);
  const assertion = await new SignJWT({ scope: claims.scope })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(claims.iss)
    .setAudience(claims.aud)
    .setIssuedAt(claims.iat)
    .setExpirationTime(claims.exp)
    .sign(key);

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text().catch(() => '');
    throw new Error(`OAUTH_TOKEN_ERROR:${tokenRes.status}:${errText}`);
  }
  const tokenData = await tokenRes.json();
  if (!tokenData?.access_token) {
    throw new Error('OAUTH_NO_ACCESS_TOKEN');
  }
  return tokenData.access_token as string;
}

export async function fetchSubscriptionV2(packageName: string, purchaseToken: string, accessToken: string) {
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    const err = new Error(`ANDROID_PUBLISHER_GET_ERROR:${res.status}:${errText}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return await res.json();
}

export async function acknowledgeSubscription(
  packageName: string,
  productId: string,
  purchaseToken: string,
  accessToken: string
) {
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/subscriptions/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(purchaseToken)}:acknowledge`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  if (!res.ok && res.status !== 204) {
    const errText = await res.text().catch(() => '');
    throw new Error(`ANDROID_PUBLISHER_ACK_ERROR:${res.status}:${errText}`);
  }
}
