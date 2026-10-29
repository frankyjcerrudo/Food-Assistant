import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  generateAgentToken, sha256Hex, extractBearerToken, getWeekDays, categorizeAisle,
  dispatchHeadlessAgentAction, handleMcpMessage, buildSpeech, buildOpenApiSpec,
  runNaturalLanguageCommand, toGeminiDeclarations, MCP_TOOLS
} from '../supabase/functions/food-assistant-agent/core.js';

const appCode = fs.readFileSync(path.resolve(process.cwd(), 'app.js'), 'utf-8');
new Function(appCode)();

const USER = 'user-1';
const NOW = new Date(2026, 9, 29, 12, 0, 0); // jueves 2026-10-29

function makeDb(seed = {}) {
  const tables = {
    user_settings: [], recipes: [], meal_plans: [], shopping_items: [],
    ...seed
  };
  return {
    tables,
    async select(t) { return tables[t].map(r => ({ ...r })); },
    async upsert(t, rows) {
      rows.forEach(r => {
        const i = tables[t].findIndex(x => x.id === r.id);
        if (i >= 0) tables[t][i] = { ...tables[t][i], ...r }; else tables[t].push({ ...r });
      });
    },
    async remove(t, ids) { tables[t] = tables[t].filter(r => !ids.includes(r.id)); }
  };
}

const recipes = [
  { id: 'rec-a', title: 'Dorada al horno', ingredients: [{ name: 'Dorada', amount: 300, unit: 'g' }], tags: [], servings: 2 },
  { id: 'rec-b', title: 'Tortitas de avena', ingredients: [{ name: 'Avena', amount: 80, unit: 'g' }], tags: [], servings: 2 }
];

describe('US-69 Token de agente', () => {
  it('genera tokens fa_live_ únicos y su hash SHA-256 es estable', async () => {
    const t1 = generateAgentToken();
    const t2 = generateAgentToken();
    expect(t1).toMatch(/^fa_live_[0-9a-f]{32}$/);
    expect(t1).not.toBe(t2);
    const h = await sha256Hex('abc');
    expect(h).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('extractBearerToken solo acepta tokens fa_live_', () => {
    expect(extractBearerToken('Bearer fa_live_123')).toBe('fa_live_123');
    expect(extractBearerToken('Bearer otro')).toBeNull();
    expect(extractBearerToken('')).toBeNull();
  });

  it('la app genera token, guarda solo el hash y permite revocarlo', async () => {
    localStorage.clear();
    const app = Object.create(window.FoodAssistantApp.prototype);
    window.state.cloudUser = { id: 'u1' };
    window.state.settings = window.state.settings || {};
    app.showToast = () => {};
    app.scheduleSyncWithCloud = () => {};
    app.renderExternalAgentSettings = () => {};
    const token = await app.generateExternalAgentToken();
    expect(token).toMatch(/^fa_live_/);
    expect(window.state.settings.agentTokenHash).toBe(await sha256Hex(token));
    expect(JSON.stringify(window.state.settings)).not.toContain(token);
    expect(window.state.settings.agentEnabled).toBe(true);
    app.revokeExternalAgentToken();
    expect(window.state.settings.agentTokenHash).toBe('');
    expect(window.state.settings.agentEnabled).toBe(false);
  });
});

describe('US-69 Fechas y pasillos', () => {
  it('getWeekDays devuelve Lunes-Domingo de la semana actual', () => {
    const w = getWeekDays(NOW);
    expect(w).toHaveLength(7);
    expect(w[0]).toEqual({ dateKey: '2026-10-26', dayName: 'Lunes' });
    expect(w[6]).toEqual({ dateKey: '2026-11-01', dayName: 'Domingo' });
  });

  it('categorizeAisle reconoce pescado y lácteos', () => {
    expect(categorizeAisle('Dorada')).toBe('meat');
    expect(categorizeAisle('Leche entera')).toBe('dairy');
  });
});

describe('US-69 Herramientas contra Supabase (dispatchHeadlessAgentAction)', () => {
  let db;
  beforeEach(() => { db = makeDb({ recipes: recipes.map(r => ({ ...r })) }); });

  it('manage_shopping_list add añade SOLO los artículos pedidos', async () => {
    const out = await dispatchHeadlessAgentAction(db, USER, 'manage_shopping_list', {
      action: 'add', items: [{ name: 'Leche', amount: 1, unit: 'l' }, { name: 'Aguacates', amount: 2, unit: 'ud' }]
    }, NOW);
    expect(out.ok).toBe(true);
    expect(db.tables.shopping_items).toHaveLength(2);
    expect(db.tables.shopping_items[0].user_id).toBe(USER);
    expect(buildSpeech([out])).toContain('2 artículos');
  });

  it('add suma cantidades en vez de duplicar', async () => {
    await dispatchHeadlessAgentAction(db, USER, 'manage_shopping_list', { action: 'add', items: [{ name: 'Leche', amount: 1, unit: 'l' }] }, NOW);
    await dispatchHeadlessAgentAction(db, USER, 'manage_shopping_list', { action: 'add', items: [{ name: 'leche', amount: 2, unit: 'l' }] }, NOW);
    expect(db.tables.shopping_items).toHaveLength(1);
    expect(db.tables.shopping_items[0].amount).toBe(3);
  });

  it('check y remove actúan por nombre', async () => {
    await dispatchHeadlessAgentAction(db, USER, 'manage_shopping_list', { action: 'add', items: [{ name: 'Pan' }, { name: 'Huevos' }] }, NOW);
    await dispatchHeadlessAgentAction(db, USER, 'manage_shopping_list', { action: 'check', items: [{ name: 'pan' }] }, NOW);
    expect(db.tables.shopping_items.find(i => i.name === 'Pan').is_checked).toBe(true);
    await dispatchHeadlessAgentAction(db, USER, 'manage_shopping_list', { action: 'remove', items: [{ name: 'Huevos' }] }, NOW);
    expect(db.tables.shopping_items.map(i => i.name)).toEqual(['Pan']);
  });

  it('set_weekly_plan solo toca los días indicados (fin de semana) y acepta títulos', async () => {
    const out = await dispatchHeadlessAgentAction(db, USER, 'set_weekly_plan', {
      days: [
        { dateKey: '2026-10-31', lunch: 'rec-a', dinner: 'Tortitas de avena' },
        { dateKey: '2026-11-01', lunch: 'Dorada al horno' }
      ]
    }, NOW);
    expect(out.result.daysUpdated).toBe(2);
    expect(db.tables.meal_plans.map(p => p.plan_date).sort()).toEqual(['2026-10-31', '2026-11-01']);
    expect(db.tables.meal_plans.find(p => p.plan_date === '2026-10-31').dinner_recipe_id).toBe('rec-b');
    expect(db.tables.meal_plans.find(p => p.plan_date === '2026-10-31').day_name).toBe('Sábado');
  });

  it('set_day_plan conserva las comidas no mencionadas y reporta recetas desconocidas', async () => {
    await dispatchHeadlessAgentAction(db, USER, 'set_day_plan', { dateKey: '2026-10-29', lunch: 'rec-a' }, NOW);
    const out = await dispatchHeadlessAgentAction(db, USER, 'set_day_plan', { dateKey: '2026-10-29', dinner: 'rec-b', snack: 'inventada' }, NOW);
    const row = db.tables.meal_plans[0];
    expect(row.lunch_recipe_id).toBe('rec-a');
    expect(row.dinner_recipe_id).toBe('rec-b');
    expect(out.result.skipped.length).toBe(1);
  });

  it('modo merge no sobrescribe huecos ya ocupados', async () => {
    await dispatchHeadlessAgentAction(db, USER, 'set_day_plan', { dateKey: '2026-10-29', lunch: 'rec-a' }, NOW);
    await dispatchHeadlessAgentAction(db, USER, 'set_weekly_plan', { mode: 'merge', days: [{ dateKey: '2026-10-29', lunch: 'rec-b', dinner: 'rec-b' }] }, NOW);
    expect(db.tables.meal_plans[0].lunch_recipe_id).toBe('rec-a');
    expect(db.tables.meal_plans[0].dinner_recipe_id).toBe('rec-b');
  });

  it('create_and_save_recipe valida y guarda con nutrición', async () => {
    const bad = await dispatchHeadlessAgentAction(db, USER, 'create_and_save_recipe', { title: 'X', ingredients: [], instructions: [] }, NOW);
    expect(bad.ok).toBe(false);
    const out = await dispatchHeadlessAgentAction(db, USER, 'create_and_save_recipe', {
      title: 'Lubina al limón',
      ingredients: [{ name: 'Lubina', amount: 300, unit: 'g' }],
      instructions: [{ text: 'Hornear 15 min' }],
      nutrition: { calories: 320, protein: 45, carbs: 2, fat: 14 }
    }, NOW);
    expect(out.ok).toBe(true);
    const saved = db.tables.recipes.find(r => r.title === 'Lubina al limón');
    expect(saved.user_id).toBe(USER);
    expect(saved.nutrition.protein).toBe(45);
    expect(saved.id).toMatch(/^rec-/);
  });

  it('add_from_current_plan vuelca ingredientes solo de la semana actual', async () => {
    await dispatchHeadlessAgentAction(db, USER, 'set_day_plan', { dateKey: '2026-10-29', lunch: 'rec-a' }, NOW);
    await dispatchHeadlessAgentAction(db, USER, 'set_day_plan', { dateKey: '2026-11-10', lunch: 'rec-b' }, NOW);
    await dispatchHeadlessAgentAction(db, USER, 'manage_shopping_list', { action: 'add_from_current_plan' }, NOW);
    expect(db.tables.shopping_items.map(i => i.name)).toEqual(['Dorada']);
  });

  it('get_food_assistant_context devuelve semana de 7 días y compra pendiente', async () => {
    db.tables.user_settings.push({ user_id: USER, dietary_preferences: ['Sin Gluten'], default_servings: 3 });
    const out = await dispatchHeadlessAgentAction(db, USER, 'get_food_assistant_context', {}, NOW);
    expect(out.result.weekPlan).toHaveLength(7);
    expect(out.result.recipes).toHaveLength(2);
    expect(out.result.dietaryPreferences).toEqual(['Sin Gluten']);
    expect(out.result.defaultServings).toBe(3);
  });

  it('herramienta desconocida devuelve error controlado', async () => {
    const out = await dispatchHeadlessAgentAction(db, USER, 'borrar_todo', {}, NOW);
    expect(out.ok).toBe(false);
  });
});

describe('US-69 Servidor MCP, OpenAPI y modo comando', () => {
  it('MCP: initialize, tools/list y tools/call', async () => {
    const db = makeDb({ recipes: recipes.map(r => ({ ...r })) });
    const init = await handleMcpMessage({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }, db, USER, NOW);
    expect(init.result.serverInfo.name).toBe('food-assistant-agent');
    const list = await handleMcpMessage({ jsonrpc: '2.0', id: 2, method: 'tools/list' }, db, USER, NOW);
    expect(list.result.tools.map(t => t.name)).toContain('set_weekly_plan');
    const call = await handleMcpMessage({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'manage_shopping_list', arguments: { action: 'add', items: [{ name: 'Leche' }] } } }, db, USER, NOW);
    expect(call.result.isError).toBe(false);
    expect(db.tables.shopping_items).toHaveLength(1);
    expect(await handleMcpMessage({ jsonrpc: '2.0', method: 'notifications/initialized' }, db, USER, NOW)).toBeNull();
  });

  it('OpenAPI expone una ruta por herramienta', () => {
    const spec = buildOpenApiSpec('https://x/functions/v1/food-assistant-agent');
    expect(Object.keys(spec.paths)).toHaveLength(MCP_TOOLS.length);
    expect(spec.openapi).toBe('3.1.0');
  });

  it('las declaraciones de Gemini usan tipos en mayúsculas y omiten el contexto', () => {
    const decl = toGeminiDeclarations();
    expect(decl.find(d => d.name === 'get_food_assistant_context')).toBeUndefined();
    expect(decl.find(d => d.name === 'set_day_plan').parameters.type).toBe('OBJECT');
  });

  it('runNaturalLanguageCommand ejecuta las functionCalls de Gemini y devuelve speech', async () => {
    const db = makeDb({ recipes: recipes.map(r => ({ ...r })) });
    const replies = [
      { candidates: [{ content: { parts: [{ functionCall: { name: 'manage_shopping_list', args: { action: 'add', items: [{ name: 'Aguacates', amount: 2, unit: 'ud' }] } } }] } }] },
      { candidates: [{ content: { parts: [{ text: 'Listo, he apuntado dos aguacates.' }] } }] }
    ];
    const fetchImpl = async () => ({ ok: true, json: async () => replies.shift() });
    const out = await runNaturalLanguageCommand({ command: 'añade aguacates', db, userId: USER, geminiApiKey: 'k', now: NOW, fetchImpl });
    expect(out.ok).toBe(true);
    expect(out.speech).toBe('Listo, he apuntado dos aguacates.');
    expect(db.tables.shopping_items).toHaveLength(1);
    expect(out.actionsExecuted[0].tool).toBe('manage_shopping_list');
  });

  it('runNaturalLanguageCommand propaga errores de Gemini', async () => {
    const db = makeDb();
    const fetchImpl = async () => ({ ok: false, status: 503, text: async () => 'high demand' });
    await expect(runNaturalLanguageCommand({ command: 'x', db, userId: USER, geminiApiKey: 'k', now: NOW, fetchImpl })).rejects.toThrow('Gemini 503');
  });
});

