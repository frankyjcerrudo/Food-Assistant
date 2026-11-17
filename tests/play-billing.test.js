import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  PLAY_PRODUCTS,
  mapSubscriptionV2ToEntitlement,
  parseRtdnMessage,
  buildServiceAccountJwtClaims
} from '../supabase/functions/_shared/play.js';

const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(fs.readFileSync(path.resolve(process.cwd(), 'i18n.js'), 'utf-8'))();
new Function(appCode)();

const { FoodAssistantApp, state } = window;

describe('US-79e: Google Play Billing (Digital Goods API, verify-purchase y RTDN)', () => {
  describe('Lógica compartida (_shared/play.js)', () => {
    const futureIso = '2099-01-01T00:00:00Z';
    const pastIso = '2020-01-01T00:00:00Z';
    const nowMs = Date.parse('2026-11-17T12:00:00Z');

    it('exporta los dos productos oficiales de Sabory Pro', () => {
      expect(PLAY_PRODUCTS).toEqual(['sabory_pro_monthly', 'sabory_pro_annual']);
    });

    it('mapSubscriptionV2ToEntitlement mapea todos los estados de subscriptionsv2', () => {
      expect(mapSubscriptionV2ToEntitlement({
        subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE',
        lineItems: [{
          productId: 'sabory_pro_monthly',
          expiryTime: futureIso,
          offerDetails: { offerId: 'trial-14d' }
        }]
      }, nowMs)).toEqual({
        plan: 'pro',
        status: 'active',
        period_end: futureIso,
        is_trial: true,
        play_product_id: 'sabory_pro_monthly'
      });

      expect(mapSubscriptionV2ToEntitlement({
        subscriptionState: 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD',
        lineItems: [{ productId: 'sabory_pro_annual', expiryTime: futureIso }]
      }, nowMs)).toMatchObject({ plan: 'pro', status: 'grace', is_trial: false });

      expect(mapSubscriptionV2ToEntitlement({
        subscriptionState: 'SUBSCRIPTION_STATE_CANCELED',
        lineItems: [{ productId: 'sabory_pro_monthly', expiryTime: futureIso }]
      }, nowMs)).toMatchObject({ plan: 'pro', status: 'canceled' });

      expect(mapSubscriptionV2ToEntitlement({
        subscriptionState: 'SUBSCRIPTION_STATE_CANCELED',
        lineItems: [{ productId: 'sabory_pro_monthly', expiryTime: pastIso }]
      }, nowMs)).toMatchObject({ plan: 'free', status: 'expired' });

      expect(mapSubscriptionV2ToEntitlement({
        subscriptionState: 'SUBSCRIPTION_STATE_ON_HOLD',
        lineItems: [{ productId: 'sabory_pro_monthly', expiryTime: futureIso }]
      }, nowMs)).toMatchObject({ plan: 'free', status: 'on_hold' });

      expect(mapSubscriptionV2ToEntitlement({
        subscriptionState: 'SUBSCRIPTION_STATE_PAUSED',
        lineItems: [{ productId: 'sabory_pro_monthly', expiryTime: futureIso }]
      }, nowMs)).toMatchObject({ plan: 'free', status: 'on_hold' });

      expect(mapSubscriptionV2ToEntitlement({
        subscriptionState: 'SUBSCRIPTION_STATE_PENDING',
        lineItems: [{ productId: 'sabory_pro_monthly', expiryTime: futureIso }]
      }, nowMs)).toMatchObject({ plan: 'free', status: 'on_hold' });

      expect(mapSubscriptionV2ToEntitlement({
        subscriptionState: 'SUBSCRIPTION_STATE_EXPIRED',
        lineItems: [{ productId: 'sabory_pro_monthly', expiryTime: pastIso }]
      }, nowMs)).toMatchObject({ plan: 'free', status: 'expired' });
    });

    it('parseRtdnMessage decodifica suscripción, testNotification y tolera body corrupto', () => {
      const subPayload = btoa(JSON.stringify({
        packageName: 'food.sabory.app',
        subscriptionNotification: {
          version: '1.0',
          notificationType: 2,
          purchaseToken: 'tok-abc-123',
          subscriptionId: 'sabory_pro_monthly'
        }
      }));
      expect(parseRtdnMessage({ message: { data: subPayload } })).toEqual({
        type: 'subscription',
        purchaseToken: 'tok-abc-123',
        subscriptionId: 'sabory_pro_monthly',
        notificationType: 2
      });

      const testPayload = btoa(JSON.stringify({ testNotification: { version: '1.0' } }));
      expect(parseRtdnMessage({ message: { data: testPayload } })).toEqual({
        type: 'test',
        version: '1.0'
      });

      expect(parseRtdnMessage({ message: { data: '%%%no-base64%%%' } })).toEqual({ type: 'unknown' });
      expect(parseRtdnMessage(null)).toEqual({ type: 'unknown' });
    });

    it('buildServiceAccountJwtClaims genera claims válidos con exp = iat + 3600', () => {
      const claims = buildServiceAccountJwtClaims({ client_email: 'play@sabory.iam.gserviceaccount.com' }, 1700000000);
      expect(claims).toEqual({
        iss: 'play@sabory.iam.gserviceaccount.com',
        scope: 'https://www.googleapis.com/auth/androidpublisher',
        aud: 'https://oauth2.googleapis.com/token',
        iat: 1700000000,
        exp: 1700003600
      });
    });
  });

  describe('Cliente (app.js): Digital Goods API y PaymentRequest', () => {
    let app;
    let completeSpy;

    beforeEach(() => {
      localStorage.clear();
      localStorage.setItem('fa_sb_url', 'https://demo.supabase.co');
      document.body.innerHTML = `
        <div id="card-plan">
          <span id="plan-badge"></span>
          <p id="plan-detail"></p>
          <div id="plan-quotas"></div>
          <button id="btn-plan-upgrade"></button>
          <button id="btn-plan-manage" style="display:none"></button>
          <button id="btn-plan-restore" style="display:none"></button>
          <button id="btn-plan-login" style="display:none"></button>
        </div>
        <dialog id="modal-paywall">
          <p id="paywall-reason"></p>
          <p id="paywall-web-notice" style="display:none"></p>
          <button id="btn-paywall-monthly"><strong>2,99 €/mes</strong></button>
          <button id="btn-paywall-annual"><strong>24,99 €/año</strong></button>
        </dialog>
      `;
      state.cloudUser = { id: 'user-play-1', email: 'franky@sabory.food', name: 'Franky' };
      state.aiPlan = { plan: 'free', source: 'none', quotas: {} };
      app = new FoodAssistantApp();
      app.showToast = vi.fn();
      app.openAuthModal = vi.fn();
      app.getAiAuthToken = vi.fn().mockResolvedValue('user-jwt-123');
      app.loadAiPlanStatus = vi.fn().mockResolvedValue({ plan: 'pro' });
      app.closePaywall = vi.fn();
      completeSpy = vi.fn().mockResolvedValue(undefined);
    });

    it('purchasePro envía POST a /verify-purchase, llama a complete("success") y recarga el plan', async () => {
      window.getDigitalGoodsService = vi.fn().mockResolvedValue({ getDetails: vi.fn(), listPurchases: vi.fn() });
      window.PaymentRequest = vi.fn().mockImplementation(() => ({
        show: vi.fn().mockResolvedValue({
          details: { purchaseToken: 'play-tok-999' },
          complete: completeSpy
        })
      }));
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ok: true, plan: 'pro', status: 'active' })
      });

      const res = await app.purchasePro('sabory_pro_monthly');
      expect(res.ok).toBe(true);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://demo.supabase.co/functions/v1/verify-purchase',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ Authorization: 'Bearer user-jwt-123' }),
          body: JSON.stringify({ productId: 'sabory_pro_monthly', purchaseToken: 'play-tok-999' })
        })
      );
      expect(completeSpy).toHaveBeenCalledWith('success');
      expect(app.loadAiPlanStatus).toHaveBeenCalled();
      expect(app.closePaywall).toHaveBeenCalled();
    });

    it('purchasePro no hace POST ni muestra error si el usuario cancela (AbortError)', async () => {
      window.getDigitalGoodsService = vi.fn().mockResolvedValue({});
      const abortErr = new Error('User cancelled');
      abortErr.name = 'AbortError';
      window.PaymentRequest = vi.fn().mockImplementation(() => ({
        show: vi.fn().mockRejectedValue(abortErr)
      }));
      globalThis.fetch = vi.fn();

      const res = await app.purchasePro('sabory_pro_monthly');
      expect(res.ok).toBe(false);
      expect(res.reason).toBe('cancelled');
      expect(globalThis.fetch).not.toHaveBeenCalled();
      expect(app.showToast).not.toHaveBeenCalled();
    });

    it('purchasePro llama a complete("fail") si verify-purchase devuelve 409 TOKEN_IN_USE', async () => {
      window.getDigitalGoodsService = vi.fn().mockResolvedValue({});
      window.PaymentRequest = vi.fn().mockImplementation(() => ({
        show: vi.fn().mockResolvedValue({
          details: { purchaseToken: 'play-tok-shared' },
          complete: completeSpy
        })
      }));
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ ok: false, code: 'TOKEN_IN_USE' })
      });

      const res = await app.purchasePro('sabory_pro_annual');
      expect(res.ok).toBe(false);
      expect(res.status).toBe(409);
      expect(completeSpy).toHaveBeenCalledWith('fail');
      expect(app.showToast).toHaveBeenCalled();
    });

    it('restorePlayPurchases verifica cada compra de listPurchases()', async () => {
      window.getDigitalGoodsService = vi.fn().mockResolvedValue({
        listPurchases: vi.fn().mockResolvedValue([
          { itemId: 'sabory_pro_annual', purchaseToken: 'tok-restore-1' }
        ])
      });
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ok: true, plan: 'pro' })
      });

      const res = await app.restorePlayPurchases({ silent: false });
      expect(res.restored).toBe(1);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(app.loadAiPlanStatus).toHaveBeenCalled();
    });

    it('sin getDigitalGoodsService, isPlayBillingAvailable es false y muestra aviso web', async () => {
      delete window.getDigitalGoodsService;
      expect(app.isPlayBillingAvailable()).toBe(false);
      const res = await app.purchasePro('sabory_pro_monthly');
      expect(res.ok).toBe(false);
      expect(res.reason).toBe('not_in_twa');
      expect(document.getElementById('paywall-web-notice').style.display).toBe('block');
    });
  });

  describe('Verificación estática de seguridad en Edge Functions', () => {
    it('play-webhook valida PLAY_RTDN_SECRET y no hay claves privadas hardcodeadas', () => {
      const webhookCode = fs.readFileSync(
        path.resolve(process.cwd(), 'supabase/functions/play-webhook/index.ts'),
        'utf-8'
      );
      const verifyCode = fs.readFileSync(
        path.resolve(process.cwd(), 'supabase/functions/verify-purchase/index.ts'),
        'utf-8'
      );
      const sharedAuthCode = fs.readFileSync(
        path.resolve(process.cwd(), 'supabase/functions/_shared/play-auth.ts'),
        'utf-8'
      );

      expect(webhookCode).toContain('PLAY_RTDN_SECRET');
      expect(webhookCode).toContain('401');
      for (const code of [webhookCode, verifyCode, sharedAuthCode, appCode]) {
        expect(code).not.toContain('BEGIN PRIVATE KEY');
      }
    });
  });
});
