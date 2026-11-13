import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve(process.cwd(), 'index.html');
const htmlCode = fs.readFileSync(htmlPath, 'utf-8');

const i18nPath = path.resolve(process.cwd(), 'i18n.js');
const i18nCode = fs.readFileSync(i18nPath, 'utf-8');

const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');

document.documentElement.innerHTML = htmlCode;
new Function(i18nCode)();
new Function(appCode)();

const { StateStore, FoodAssistantApp, state } = window;

describe('US-79b: Limpieza BYOK, app_config y Agente Externo', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('estático en index.html: no existen controles BYOK ni tarjeta de agente externo', () => {
    const forbiddenIds = [
      'select-ai-provider',
      'select-gemini-model',
      'input-gemini-key',
      'btn-save-gemini-key',
      'card-external-agent',
      'external-agent-token'
    ];
    for (const id of forbiddenIds) {
      expect(htmlCode).not.toContain(id);
      expect(document.getElementById(id)).toBeNull();
    }
  });

  it('estático en app.js: no contiene símbolos ni tablas eliminadas de BYOK/agente externo', () => {
    const forbidden = [
      'callOpenAiAgent',
      'callClaudeAgent',
      'getEffectiveGeminiApiKey',
      'sharedGeminiApiKey',
      'app_config',
      'external_agent_tokens',
      'fa_live_',
      'food-assistant-agent'
    ];
    for (const term of forbidden) {
      expect(appCode).not.toContain(term);
    }
  });

  it('la carpeta supabase/functions/food-assistant-agent ha sido eliminada', () => {
    expect(fs.existsSync(path.resolve(process.cwd(), 'supabase/functions/food-assistant-agent'))).toBe(false);
  });

  it('migración local: limpia claves heredadas de fa_settings conservando defaultServings', () => {
    localStorage.setItem('fa_settings', JSON.stringify({
      geminiApiKey: 'AIzaX',
      aiProvider: 'openai',
      geminiModel: 'x',
      defaultGeminiApiKey: 'AIzaY',
      agentTokenHash: 'h',
      defaultServings: 3
    }));

    const store = new StateStore();
    expect(store.settings.geminiApiKey).toBeUndefined();
    expect(store.settings.aiProvider).toBeUndefined();
    expect(store.settings.geminiModel).toBeUndefined();
    expect(store.settings.defaultGeminiApiKey).toBeUndefined();
    expect(store.settings.agentTokenHash).toBeUndefined();
    expect(store.settings.defaultServings).toBe(3);

    const persisted = JSON.parse(localStorage.getItem('fa_settings'));
    expect(persisted.geminiApiKey).toBeUndefined();
    expect(persisted.defaultServings).toBe(3);
  });

  it('pushToCloud no llama a app_config ni envía gemini_api_key, agent_token_hash o sharedGeminiApiKey', async () => {
    state.cloudUser = { id: 'u1', email: 'a@b.c' };
    state.household = { id: 'hh-1', name: 'Casa', role: 'owner' };

    const fromCalls = [];
    const upsertedRows = {};
    const updateUserSpy = vi.fn().mockResolvedValue({ data: { user: state.cloudUser }, error: null });

    const appInstance = new FoodAssistantApp();
    appInstance.supabaseClient = {
      from: vi.fn((table) => {
        fromCalls.push(table);
        return {
          select: () => ({
            eq: async () => ({ data: [], error: null })
          }),
          upsert: vi.fn(async (rows) => {
            upsertedRows[table] = rows;
            return { data: rows, error: null };
          }),
          delete: () => ({
            eq: () => ({
              in: async () => ({ error: null })
            })
          })
        };
      }),
      auth: {
        updateUser: updateUserSpy
      }
    };

    await appInstance.pushToCloud(true);

    expect(fromCalls).not.toContain('app_config');
    if (upsertedRows.user_settings) {
      expect(upsertedRows.user_settings[0].gemini_api_key).toBeUndefined();
      expect(upsertedRows.user_settings[0].agent_token_hash).toBeUndefined();
    }
    if (upsertedRows.meal_plans) {
      const hhPrefRow = upsertedRows.meal_plans.find(r => r.id === '__household_prefs__');
      if (hhPrefRow) {
        const prefSlot = hhPrefRow.custom_slots.find(s => s.type === 'household_prefs');
        expect(prefSlot?.sharedGeminiApiKey).toBeUndefined();
      }
    }
    if (updateUserSpy.mock.calls.length > 0) {
      expect(updateUserSpy.mock.calls[0][0].data.gemini_api_key).toBeUndefined();
    }
  });

  it('i18n: paridad completa de claves entre es y en', () => {
    const flattenKeys = (obj, prefix = '') => {
      const keys = [];
      for (const [k, v] of Object.entries(obj || {})) {
        const full = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          keys.push(...flattenKeys(v, full));
        } else {
          keys.push(full);
        }
      }
      return keys;
    };
    const esKeys = flattenKeys(window.I18n.MESSAGES.es).sort();
    const enKeys = flattenKeys(window.I18n.MESSAGES.en).sort();
    expect(esKeys).toEqual(enKeys);
  });
});
