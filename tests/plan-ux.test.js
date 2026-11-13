import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const appCode = fs.readFileSync(path.resolve(process.cwd(), 'app.js'), 'utf-8');
new Function(fs.readFileSync(path.resolve(process.cwd(), 'i18n.js'), 'utf-8'))();
new Function(appCode)();

const { FoodAssistantApp, state } = window;

const mkPlan = (over = {}) => ({
  plan: 'free',
  source: 'none',
  status: null,
  periodEnd: null,
  isTrial: false,
  viaHousehold: false,
  quotas: {},
  fetchedAt: null,
  ...over
});

const DOM = `
  <div id="card-plan">
    <span id="plan-badge"></span>
    <p id="plan-detail"></p>
    <div id="plan-quotas"></div>
    <button id="btn-plan-upgrade"></button>
    <button id="btn-plan-manage" style="display:none"></button>
    <button id="btn-plan-login" style="display:none"></button>
  </div>
  <dialog id="modal-paywall">
    <p id="paywall-reason"></p>
    <p id="paywall-web-notice" style="display:none"></p>
    <button id="btn-paywall-monthly"></button>
    <button id="btn-paywall-annual"></button>
  </dialog>
  <div id="household-paused-banner" style="display:none"></div>
  <div id="gemini-invoke-quota" style="display:none"></div>
  <span id="import-ai-quota-badge" style="display:none"></span>
  <input id="gemini-invoke-input">
  <input id="ai-chat-input">
  <div id="chat-history-container"></div>
`;

describe('US-79d: Experiencia Free / Pro', () => {
  let app;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = DOM;
    state.cloudUser = { id: 'u1', email: 'a@b.c', name: 'A' };
    state.aiPlan = mkPlan();
    state.household = null;
    app = new FoodAssistantApp();
    app.showToast = vi.fn();
    app.openAuthModal = vi.fn();
    app.callGeminiAgent = vi.fn().mockResolvedValue({ text: 'ok', toolCalls: [] });
  });

  describe('ensureAiAccess', () => {
    it('anónimo: false y abre el login', () => {
      state.cloudUser = null;
      state.aiPlan = mkPlan({ plan: 'anonymous' });
      expect(app.ensureAiAccess('guided_query')).toBe(false);
      expect(app.openAuthModal).toHaveBeenCalled();
    });

    it('free con remaining 2: true', () => {
      state.aiPlan = mkPlan({ quotas: { guided_query: { used: 1, limit: 3, remaining: 2 } } });
      expect(app.ensureAiAccess('guided_query')).toBe(true);
    });

    it('free con remaining 0: false y paywall quota_guided_query', () => {
      state.aiPlan = mkPlan({ quotas: { guided_query: { used: 3, limit: 3, remaining: 0 } } });
      expect(app.ensureAiAccess('guided_query')).toBe(false);
      expect(document.getElementById('modal-paywall').dataset.reason).toBe('quota_guided_query');
    });

    it('pro: true', () => {
      state.aiPlan = mkPlan({ plan: 'pro' });
      expect(app.ensureAiAccess('guided_query')).toBe(true);
      expect(app.ensureAiAccess('chat')).toBe(true);
    });

    it('chat con free: false y paywall chat; con pro: true', () => {
      expect(app.ensureAiAccess('chat')).toBe(false);
      expect(document.getElementById('modal-paywall').dataset.reason).toBe('chat');
      state.aiPlan = mkPlan({ plan: 'pro' });
      expect(app.ensureAiAccess('chat')).toBe(true);
    });
  });

  describe('Sous Chef', () => {
    it('texto libre con free no llama a callGeminiAgent', async () => {
      document.getElementById('gemini-invoke-input').value = 'hola';
      await app.handleGeminiInvokeSubmit();
      expect(app.callGeminiAgent).not.toHaveBeenCalled();
    });

    it('chip (guided_query) con free y cuota disponible sí llama a callGeminiAgent', async () => {
      state.aiPlan = mkPlan({ quotas: { guided_query: { used: 0, limit: 3, remaining: 3 } } });
      document.getElementById('gemini-invoke-input').value = 'sugerencia de cena';
      await app.handleGeminiInvokeSubmit(false, { feature: 'guided_query' });
      expect(app.callGeminiAgent).toHaveBeenCalled();
    });
  });

  describe('Respuestas del proxy', () => {
    it('402 abre el paywall', () => {
      app.handleAiProxyRejection({ status: 402 }, 'guided_query');
      expect(document.getElementById('modal-paywall').dataset.reason).toBe('quota_guided_query');
    });

    it('429 muestra un toast y no abre el paywall', () => {
      app.handleAiProxyRejection({ status: 429 }, 'chat');
      expect(app.showToast).toHaveBeenCalled();
      expect(document.getElementById('modal-paywall').dataset.reason).toBeUndefined();
    });
  });

  describe('renderPlanCard', () => {
    it('free: badge Free, upgrade visible, manage oculto y 1/3', () => {
      state.aiPlan = mkPlan({ quotas: { guided_query: { used: 1, limit: 3 } } });
      app.renderPlanCard();
      expect(document.getElementById('plan-badge').textContent).toBe('Free');
      expect(document.getElementById('btn-plan-upgrade').style.display).toBe('');
      expect(document.getElementById('btn-plan-manage').style.display).toBe('none');
      expect(document.getElementById('plan-quotas').textContent).toContain('1/3');
    });

    it('pro play: gestionar visible', () => {
      state.aiPlan = mkPlan({ plan: 'pro', source: 'play', periodEnd: '2027-01-01T00:00:00Z' });
      app.renderPlanCard();
      expect(document.getElementById('btn-plan-manage').style.display).toBe('');
      expect(document.getElementById('btn-plan-upgrade').style.display).toBe('none');
    });

    it('pro por hogar: detalle "Incluido por el hogar"', () => {
      state.aiPlan = mkPlan({ plan: 'pro', source: 'none', viaHousehold: true });
      app.renderPlanCard();
      expect(document.getElementById('plan-badge').textContent).toMatch(/Hogar|Household/);
      expect(document.getElementById('plan-detail').textContent).toMatch(/hogar|household/);
    });

    it('pro regalo permanente (admin)', () => {
      state.aiPlan = mkPlan({ plan: 'pro', source: 'admin' });
      app.renderPlanCard();
      expect(document.getElementById('plan-badge').textContent).toMatch(/Regalo|Gift/);
    });
  });

  describe('Paywall y hogar', () => {
    it('sin getDigitalGoodsService, #paywall-web-notice es visible', () => {
      delete window.getDigitalGoodsService;
      app.openPaywall('pro');
      expect(document.getElementById('paywall-web-notice').style.display).toBe('block');
    });

    it('con hogar activo y plan free, el banner de pausa es visible', () => {
      state.household = { id: 'h1', name: 'Casa', members: [], role: 'owner' };
      app.renderHouseholdSettings();
      expect(document.getElementById('household-paused-banner').style.display).toBe('flex');
      state.aiPlan = mkPlan({ plan: 'pro' });
      app.renderHouseholdSettings();
      expect(document.getElementById('household-paused-banner').style.display).toBe('none');
    });
  });

  describe('i18n', () => {
    it('todas las claves plan.* y paywall.* existen en es y en', () => {
      const { es, en } = window.I18n.MESSAGES;
      ['plan', 'paywall'].forEach(block => {
        expect(Object.keys(es[block]).sort()).toEqual(Object.keys(en[block]).sort());
        expect(Object.keys(es[block]).length).toBeGreaterThan(5);
      });
    });
  });
});
