import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const { FoodAssistantApp, state, formatSafeAiMarkdown, AI_TOOLS_DECLARATIONS, SEED_RECIPES } = window;

describe('Épica 5 (Fase 1): Agente IA con Function Calling, Control Total y Seguridad (US-17, BUG-15, US-37, US-39)', () => {
  let appInstance;

  beforeEach(() => {
    localStorage.clear();
    state.recipes = JSON.parse(JSON.stringify(SEED_RECIPES));
    state.mealPlan = state.generateInitialMealPlan();
    state.shoppingList = [];
    state.dietaryPreferences = [];
    state.settings = {
      geminiApiKey: '',
      defaultServings: 2,
      geminiModel: 'gemini-3.8-flash',
      nutritionGoals: { enabled: true, calories: 2100, protein: 150, carbs: 200, fat: 65 }
    };

    document.body.innerHTML = `
      <div id="view-ai" class="view-panel">
        <div id="chat-history-container"></div>
        <input type="text" id="ai-chat-input" value="">
        <button id="btn-send-ai-chat">Enviar</button>
      </div>
      <div id="view-planner" class="view-panel">
        <div id="planner-days-container"></div>
      </div>
      <div id="view-recipes" class="view-panel">
        <div id="recipes-cards-grid"></div>
      </div>
      <div id="view-shopping" class="view-panel">
        <p id="shopping-summary-text"></p>
        <div id="shopping-aisles-container"></div>
      </div>
    `;
    appInstance = new FoodAssistantApp();
  });

  it('US-37: formatSafeAiMarkdown escapa payloads XSS antes de aplicar formato Markdown ligero', () => {
    const malicious = '<img src=x onerror="alert(1)"><script>evil()</script> **Plan Semanal**\n- Lunes: Pollo';
    const safeHtml = formatSafeAiMarkdown(malicious);

    expect(safeHtml).not.toContain('<script>');
    expect(safeHtml).not.toContain('<img');
    expect(safeHtml).toContain('&lt;script&gt;evil()&lt;/script&gt;');
    expect(safeHtml).toContain('<strong>Plan Semanal</strong>');
    expect(safeHtml).toContain('• Lunes: Pollo');
  });

  it('US-39: callGeminiAgent envía la clave en la cabecera x-goog-api-key y nunca en la URL (?key=)', async () => {
    state.settings.geminiApiKey = 'AIzaSyTestSecretKey123';
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'Respuesta segura desde Gemini.' }]
            }
          }
        ]
      })
    });
    const origFetch = globalThis.fetch;
    globalThis.fetch = fetchSpy;

    try {
      const res = await appInstance.callGeminiAgent('Hola Gemini');
      expect(res.text).toBe('Respuesta segura desde Gemini.');
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
      expect(calledUrl).not.toContain('key=');
      expect(calledUrl).toContain('models/gemini-3.8-flash:generateContent');
      expect(calledUrl).not.toContain('AIzaSyTestSecretKey123');
      expect(calledOptions.headers['x-goog-api-key']).toBe('AIzaSyTestSecretKey123');

      const bodyObj = JSON.parse(calledOptions.body);
      expect(Array.isArray(bodyObj.tools)).toBe(true);
      expect(bodyObj.tools[0].functionDeclarations.length).toBe(AI_TOOLS_DECLARATIONS.length);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('US-17: buildAiSystemInstruction incluye automáticamente preferencias dietéticas, metas nutricionales y catálogo de recetas', () => {
    state.saveDietaryPreferences(['Sin Gluten', 'Alta en Proteínas']);
    state.saveNutritionGoals({ enabled: true, calories: 2250, protein: 165, carbs: 190, fat: 70 });

    const sysPrompt = appInstance.buildAiSystemInstruction();
    expect(sysPrompt).toContain('Sin Gluten, Alta en Proteínas');
    expect(sysPrompt).toContain('2250 kcal');
    expect(sysPrompt).toContain('165g Proteínas');
    expect(sysPrompt).toContain('rec-salmon-bowl');
    expect(sysPrompt).toContain('Salmón a la Plancha');
  });

  it('BUG-15 & US-17: executeAiToolCall(set_weekly_plan) asigna exactamente las recetas propuestas por día y slot sin repartir en rotación arbitraria', () => {
    const weekDays = appInstance.getPlannerWeekDates();
    const mondayKey = weekDays[0].dateKey;
    const tuesdayKey = weekDays[1].dateKey;

    const toolRes = appInstance.executeAiToolCall({
      name: 'set_weekly_plan',
      args: {
        mode: 'replace',
        days: [
          {
            dateKey: mondayKey,
            dayName: 'Lunes',
            breakfast: 'rec-porridge-bowl',
            lunch: 'rec-salmon-bowl',
            snack: 'rec-healthy-snack',
            dinner: 'rec-chickpea-salad'
          },
          {
            dateKey: tuesdayKey,
            dayName: 'Martes',
            lunch: 'Pechugas de Pollo al Limón con Patatas Asadas', // También resuelve por título
            dinner: 'rec-pesto-pasta'
          }
        ]
      }
    });

    expect(toolRes.tool).toBe('set_weekly_plan');
    expect(toolRes.daysUpdated).toBe(2);

    expect(state.mealPlan[mondayKey].breakfast).toBe('rec-porridge-bowl');
    expect(state.mealPlan[mondayKey].lunch).toBe('rec-salmon-bowl');
    expect(state.mealPlan[mondayKey].snack).toBe('rec-healthy-snack');
    expect(state.mealPlan[mondayKey].dinner).toBe('rec-chickpea-salad');

    expect(state.mealPlan[tuesdayKey].lunch).toBe('rec-lemon-chicken');
    expect(state.mealPlan[tuesdayKey].dinner).toBe('rec-pesto-pasta');
  });

  it('US-17: executeAiToolCall(create_and_save_recipe) crea una receta nueva con pasillos categorizados, etiquetas inferidas y macros', () => {
    const initialCount = state.recipes.length;
    const res = appInstance.executeAiToolCall({
      name: 'create_and_save_recipe',
      args: {
        id: 'rec-ai-test-bowl',
        title: 'Bowl Keto de Salmón y Aguacate',
        description: 'Cena rápida alta en proteínas y baja en carbohidratos.',
        prepTimeMinutes: 10,
        cookTimeMinutes: 8,
        servings: 2,
        tags: ['Cena'],
        ingredients: [
          { name: 'Salmón fresco', amount: 300, unit: 'gramos' },
          { name: 'Aguacate', amount: 1, unit: 'unidad' }
        ],
        instructions: [
          { step: 1, text: 'Cocina el salmón a la plancha durante 8 minutos.' }
        ]
      }
    });

    expect(res.tool).toBe('create_and_save_recipe');
    expect(res.recipeId).toBe('rec-ai-test-bowl');
    expect(state.recipes.length).toBe(initialCount + 1);

    const created = state.recipes[0];
    expect(created.title).toBe('Bowl Keto de Salmón y Aguacate');
    expect(created.ingredients[0].unit).toBe('g');
    expect(created.instructions[0].timerMinutes).toBe(8);
    expect(created.tags).toContain('Rápida');
    expect(created.nutrition.calories).toBeGreaterThan(0);
  });

  it('US-17: executeAiToolCall(manage_shopping_list) añade, marca como comprados y elimina artículos de la lista de la compra', () => {
    const addRes = appInstance.executeAiToolCall({
      name: 'manage_shopping_list',
      args: {
        action: 'add',
        items: [
          { name: 'Aguacates', amount: 3, unit: 'unidades' },
          { name: 'Leche de avena', amount: 1, unit: 'litro' }
        ]
      }
    });

    expect(addRes.count).toBe(2);
    expect(state.shoppingList.length).toBe(2);
    expect(state.shoppingList[0].unit).toBe('ud');
    expect(state.shoppingList[1].unit).toBe('l');

    const checkRes = appInstance.executeAiToolCall({
      name: 'manage_shopping_list',
      args: {
        action: 'check',
        items: [{ name: 'Aguacate' }]
      }
    });
    expect(checkRes.count).toBe(1);
    expect(state.shoppingList[0].isChecked).toBe(true);

    const removeRes = appInstance.executeAiToolCall({
      name: 'manage_shopping_list',
      args: {
        action: 'remove',
        items: [{ name: 'Leche' }]
      }
    });
    expect(removeRes.count).toBe(1);
    expect(state.shoppingList.length).toBe(1);
  });

  it('US-17 & US-37: handleAiChatSubmit ejecuta toolCalls en vivo y sanea errores con textContent', async () => {
    const input = document.getElementById('ai-chat-input');
    const history = document.getElementById('chat-history-container');

    input.value = 'Añade aguacates y leche a la compra';
    await appInstance.handleAiChatSubmit();

    expect(state.shoppingList.length).toBeGreaterThanOrEqual(2);
    expect(history.textContent).toContain('Aguacates');

    // Simular error con intento de inyección HTML en err.message (US-37)
    state.settings.geminiApiKey = 'bad-key';
    const origFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('<img src=x onerror=alert(1)> Fallo de red'));

    try {
      input.value = 'Hola';
      await appInstance.handleAiChatSubmit();
      const lastBubble = history.lastElementChild;
      expect(lastBubble.querySelector('img')).toBeNull();
      expect(lastBubble.textContent).toContain('<img src=x onerror=alert(1)> Fallo de red');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('US-35 & US-17: saveGeminiKey sincroniza la clave con la nube y pullFromCloud la recupera en otros dispositivos', async () => {
    document.body.innerHTML += '<input id="input-gemini-key" value="AIzaSyMultiDeviceKey999"><div id="gemini-key-status"></div>';
    const syncSpy = vi.spyOn(appInstance, 'scheduleSyncWithCloud');

    appInstance.saveGeminiKey();
    expect(state.settings.geminiApiKey).toBe('AIzaSyMultiDeviceKey999');
    expect(syncSpy).toHaveBeenCalled();

    // Simular otro dispositivo con clave vacía recibiendo user_metadata desde Supabase
    state.settings.geminiApiKey = '';
    state.cloudUser = { id: 'usr-sync-1', email: 'test@example.com' };
    appInstance.supabaseClient = {
      from: () => ({
        select: () => ({
          eq: async () => ({ data: [], error: null })
        })
      }),
      auth: {
        getUser: async () => ({
          data: {
            user: {
              user_metadata: {
                gemini_api_key: 'AIzaSyFromCloudDevice777'
              }
            }
          }
        })
      }
    };

    await appInstance.pullFromCloud();
    expect(state.settings.geminiApiKey).toBe('AIzaSyFromCloudDevice777');
  });

  it('US-17: callGeminiAgent hace fallback automático a gemini-3.6-flash / 3.5-flash-lite cuando 3.8-flash tiene High Demand (503)', async () => {
    state.settings.geminiApiKey = 'AIzaSyTestFallbackKey';
    let callCount = 0;
    const origFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      callCount++;
      if (url.includes('gemini-3.8-flash')) {
        return {
          ok: false,
          status: 503,
          json: async () => ({
            error: { message: 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.' }
          })
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: 'Respuesta desde modelo de respaldo.' }] } }]
        })
      };
    });

    try {
      const res = await appInstance.callGeminiAgent('Planifica mi semana');
      expect(res.text).toBe('Respuesta desde modelo de respaldo.');
      expect(callCount).toBe(2);
    } finally {
      globalThis.fetch = origFetch;
    }
  });
});
