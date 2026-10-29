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

  it('US-17: callGeminiAgent conecta únicamente con gemini-3.8-flash y activa fallback inteligente inmediato ante timeout o demanda alta', async () => {
    state.settings.geminiApiKey = 'AIzaSyTestFallbackKey';
    let callCount = 0;
    const origFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      callCount++;
      expect(url).toContain('models/gemini-3.8-flash:generateContent');
      return {
        ok: false,
        status: 503,
        json: async () => ({
          error: { message: 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.' }
        })
      };
    });

    try {
      const res = await appInstance.callGeminiAgent('Planifica mi semana');
      expect(res.isSimulatedFallback).toBe(true);
      expect(callCount).toBe(1);
      expect(res.toolCalls.length).toBeGreaterThan(0);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('US-17 & BUG-15: formatSafeAiMarkdown limpia códigos internos (rec-...) y formatea cursivas (*plato*) sin dejar asteriscos crudos', () => {
    const raw = '• **Lunes (26 Oct)**: Desayuno: *Porridge cremoso de avena* (*rec-porridge-bowl*) | Merienda: Batido de proteínas (`rec-aafe6e6d-45e5-4328-b41c-b62ec9e3e69a`)';
    const html = formatSafeAiMarkdown(raw);

    expect(html).not.toContain('rec-porridge-bowl');
    expect(html).not.toContain('rec-aafe6e6d');
    expect(html).toContain('<strong>Lunes (26 Oct)</strong>');
    expect(html).toContain('<em>Porridge cremoso de avena</em>');
    expect(html).toContain('Batido de proteínas');
  });

  it('US-17 & BUG-15: set_weekly_plan con completeWeek rellena las 4 comidas de los 7 días incluso con preferencia Alta en Proteínas activa', () => {
    state.saveDietaryPreferences(['Alta en Proteínas']);
    const weekDays = appInstance.getPlannerWeekDates();

    // Simular que Gemini solo envió lunch y dinner para 2 días omitiendo breakfast y snack
    const res = appInstance.executeAiToolCall({
      name: 'set_weekly_plan',
      args: {
        mode: 'replace',
        completeWeek: true,
        days: [
          {
            dateKey: weekDays[0].dateKey,
            dayName: 'Lunes',
            lunch: 'rec-lemon-chicken',
            dinner: 'rec-salmon-bowl'
          }
        ]
      }
    });

    expect(res.daysUpdated).toBe(7);
    weekDays.forEach((wDay) => {
      const dayPlan = state.getDayPlan(wDay.dateKey, wDay.dayName);
      expect(dayPlan.breakfast).toBeTruthy();
      expect(dayPlan.lunch).toBeTruthy();
      expect(dayPlan.snack).toBeTruthy();
      expect(dayPlan.dinner).toBeTruthy();
    });
  });

  it('US-17 & BUG-15: handleAiChatSubmit utiliza functionCallingConfig AUTO y aplica el plan automáticamente si el modelo propone comidas', async () => {
    state.settings.geminiApiKey = 'AIzaSyTestForcePlan';
    const origFetch = globalThis.fetch;
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '• Lunes: Desayuno: Porridge Cremoso de Avena | Almuerzo: Salmón a la Plancha | Merienda: Tostas de Hummus | Cena: Pasta al Pesto'
                }
              ]
            }
          }
        ]
      })
    });
    globalThis.fetch = fetchSpy;

    try {
      const input = document.getElementById('ai-chat-input');
      const history = document.getElementById('chat-history-container');
      input.value = 'Quiero que pongas los platos en el Plan semanal sin dejar comidas vacías';
      await appInstance.handleAiChatSubmit();

      const [, calledOpts] = fetchSpy.mock.calls[0];
      const payloadSent = JSON.parse(calledOpts.body);
      expect(payloadSent.toolConfig?.functionCallingConfig?.mode).toBe('AUTO');

      const weekDays = appInstance.getPlannerWeekDates();
      weekDays.forEach(w => {
        const dp = state.getDayPlan(w.dateKey, w.dayName);
        expect(dp.breakfast).toBeTruthy();
        expect(dp.lunch).toBeTruthy();
        expect(dp.snack).toBeTruthy();
        expect(dp.dinner).toBeTruthy();
      });

      expect(history.textContent).toContain('Ver en Planificador');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('US-17: sugiere crear recetas nuevas cuando faltan desayunos o meriendas para la preferencia dietética activa y no impone foto por defecto', async () => {
    state.saveDietaryPreferences(['Alta en Proteínas']);
    const gaps = appInstance.getDietarySlotGaps();
    expect(gaps.map(g => g.tag)).toContain('Desayuno');

    const input = document.getElementById('ai-chat-input');
    const history = document.getElementById('chat-history-container');
    input.value = 'Planifica mi semana';
    await appInstance.handleAiChatSubmit();

    expect(history.textContent).toContain('Crear');
    expect(history.textContent).toContain('a medida');

    // Verificar que al crear una receta nueva sin imagen no se añade foto de Unsplash por defecto
    const createdRes = appInstance.executeAiToolCall({
      name: 'create_and_save_recipe',
      args: {
        title: 'Tortitas Proteicas de Avena y Claras',
        tags: ['Desayuno', 'Alta en Proteínas'],
        ingredients: [{ name: 'Claras de huevo', amount: 150, unit: 'ml' }],
        instructions: [{ step: 1, text: 'Batir y cocinar en sartén 4 minutos.' }]
      }
    });
    expect(createdRes.recipe.imageUrl).toBe('');
  });
});

describe('Épica 6 (Fase 2): Importador Multimodal IA, Nevera Inteligente y Batch Cooking (US-30, US-34, US-65)', () => {
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
        <input type="text" id="recipes-search-input" value="">
        <div id="recipes-tag-filters"></div>
        <span id="recipes-count-badge"></span>
        <span id="recipes-count-subtitle"></span>
        <button id="btn-toggle-fridge-panel"></button>
        <div id="fridge-reverse-search-panel" style="display: none;">
          <input type="text" id="input-fridge-ingredient" value="">
          <button id="btn-add-fridge-ingredient"></button>
          <button id="btn-clear-fridge-ingredients"></button>
          <div id="fridge-chips-container"></div>
          <button id="btn-ai-invent-from-fridge"></button>
        </div>
        <div id="recipes-cards-grid"></div>
      </div>
      <div id="view-shopping" class="view-panel">
        <p id="shopping-summary-text"></p>
        <div id="shopping-aisles-container"></div>
      </div>
      <dialog id="modal-recipe-import" class="modal-overlay">
        <div id="section-import-url" style="display: block;">
          <input type="url" id="import-url-input">
        </div>
        <div id="section-import-text" style="display: none;">
          <textarea id="import-text-input"></textarea>
        </div>
        <div id="section-import-ai" style="display: none;">
          <input type="file" id="import-image-input">
          <textarea id="import-ai-prompt-input"></textarea>
        </div>
        <div id="import-preview-box" style="display: none;"></div>
        <div id="import-status-indicator" style="display: none;"></div>
        <button id="btn-execute-import"></button>
        <button id="btn-confirm-save-import"></button>
      </dialog>
      <dialog id="modal-recipe-picker" class="modal-overlay">
        <input type="checkbox" id="toggle-picker-cook-double">
        <div id="picker-recipes-list"></div>
      </dialog>
      <dialog id="modal-recipe-detail" class="modal-overlay">
        <div id="recipe-modal-body"></div>
        <div id="recipe-detail-normal-actions"></div>
        <div id="recipe-detail-review-actions"></div>
      </dialog>
    `;
    appInstance = new FoodAssistantApp();
  });

  it('US-30: normalizeAiExtractedRecipe normaliza JSON de Gemini y calcula tags y macros automáticamente', () => {
    const rawAiJson = {
      title: 'Salteado de Tofu con Brócoli y Arroz',
      description: 'Plato vegetal rápido y nutritivo.',
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      servings: 2,
      tags: ['Saludable', 'Vegano'],
      ingredients: [
        { name: 'Tofu firme', amount: 200, unit: 'g' },
        { name: 'Brócoli', amount: 150, unit: 'g' },
        { name: 'Salsa de soja', amount: 2, unit: 'cda' }
      ],
      instructions: [
        { step: 1, text: 'Cortar el tofu en dados y dorar 6 minutos.', timerMinutes: 6 },
        { step: 2, text: 'Añadir el brócoli y cocinar 8 minutos al vapor con salsa de soja.' }
      ]
    };

    const normalized = appInstance.normalizeAiExtractedRecipe(rawAiJson, 'https://instagram.com/p/test');
    expect(normalized.id).toMatch(/^rec-/);
    expect(normalized.title).toBe('Salteado de Tofu con Brócoli y Arroz');
    expect(normalized.ingredients.length).toBe(3);
    expect(normalized.instructions.length).toBe(2);
    expect(normalized.instructions[0].timerMinutes).toBe(6);
    expect(normalized.instructions[1].timerMinutes).toBe(8); // Detectado automáticamente del texto "8 minutos"
    expect(normalized.sourceUrl).toBe('https://instagram.com/p/test');
    expect(normalized.sourceDomain).toBe('instagram.com');
  });

  it('US-30: extractRecipeWithGemini devuelve receta limpia en modo simulado cuando no hay API key', async () => {
    state.settings.geminiApiKey = '';
    const res = await appInstance.extractRecipeWithGemini({ text: 'Bowl alto en proteínas con pollo y arroz' });
    expect(res).toBeTruthy();
    expect(res.title).toContain('Multimodal');
    expect(res.ingredients.length).toBeGreaterThan(0);
    expect(res.instructions.length).toBeGreaterThan(0);
  });

  it('US-30: compressImageToBase64 se recupera con fallback si la lectura directa de FileReader falla', async () => {
    const fakeFile = {
      name: 'receta.jpg',
      type: 'image/jpeg',
      arrayBuffer: async () => new Uint8Array([255, 216, 255, 224, 0, 16, 74, 70, 73, 70]).buffer
    };
    const res = await appInstance.compressImageToBase64(fakeFile);
    expect(res).toBeTruthy();
    expect(res.mimeType).toBe('image/jpeg');
    expect(res.base64Data).toBeTruthy();
  });

  it('US-34: Fridge Reverse Search añade ingredientes, filtra recetas y ordena por mayor coincidencia', () => {
    // Añadimos pechuga de pollo y patata
    appInstance.addFridgeIngredient('pollo');
    appInstance.addFridgeIngredient('patatas');

    expect(appInstance.fridgeIngredients).toEqual(['pollo', 'patatas']);

    // Pollo al limón tiene pollo y patatas
    const lemonChicken = state.recipes.find(r => r.id === 'rec-lemon-chicken');
    const matchChicken = appInstance.getRecipeFridgeMatch(lemonChicken);
    expect(matchChicken.matchCount).toBeGreaterThanOrEqual(1);

    // Salmón a la plancha no tiene ni pollo ni patatas
    const salmonBowl = state.recipes.find(r => r.id === 'rec-salmon-bowl');
    const matchSalmon = appInstance.getRecipeFridgeMatch(salmonBowl);
    expect(matchSalmon.matchCount).toBe(0);

    // Limpiar nevera
    appInstance.clearFridgeIngredients();
    expect(appInstance.fridgeIngredients.length).toBe(0);
  });

  it('US-65: selectRecipeForSlot con cookDouble asigna el plato al slot de hoy y programa sobras para el día siguiente', () => {
    const today = new Date();
    const todayStr = window.toLocalDateKey(today);
    const nextDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const nextStr = window.toLocalDateKey(nextDay);

    appInstance.pickerTarget = { dateStr: todayStr, slotKey: 'dinner', isCustom: false };
    appInstance.selectRecipeForSlot('rec-lemon-chicken', true);

    const todayPlan = state.mealPlan[todayStr];
    const nextDayPlan = state.mealPlan[nextStr];

    expect(todayPlan.dinner).toBe('rec-lemon-chicken');
    // Para cena con cookDouble se programa como almuerzo del día siguiente con badge de sobras
    expect(nextDayPlan.lunch).toBe('rec-lemon-chicken');
    expect(nextDayPlan.leftoverSlots?.lunch).toBe(true);
  });

  it('Fase 1 Refinamiento: "Planifica mi dia de hoy" no activa semana completa de 7 dias', () => {
    expect(appInstance.isWeeklyPlanPrompt('Planifica mi menú semanal de lunes a domingo')).toBe(true);
    expect(appInstance.isWeeklyPlanPrompt('Planifica mi dia de hoy')).toBe(false);
    expect(appInstance.isWeeklyPlanPrompt('Dime qué comer hoy')).toBe(false);
  });

  it('v0.74 Refinamiento: "Planifica mi dia de hoy" invoca set_day_plan y personaliza la respuesta para Franky', () => {
    const res = appInstance.simulateGeminiAgentResponse('Planifica mi dia de hoy');
    expect(res.text).toContain('Franky');
    expect(res.toolCalls.length).toBe(1);
    expect(res.toolCalls[0].name).toBe('set_day_plan');
    expect(res.toolCalls[0].args.breakfast).toBeTruthy();
    expect(res.toolCalls[0].args.lunch).toBeTruthy();
    expect(res.toolCalls[0].args.snack).toBeTruthy();
    expect(res.toolCalls[0].args.dinner).toBeTruthy();
  });

  it('v0.74 Refinamiento: "Añade plátanos y leche a la compra" añade solo los artículos solicitados sin volcar el plan', () => {
    const res = appInstance.simulateGeminiAgentResponse('Añade 3 plátanos y 1 leche a la compra');
    expect(res.toolCalls.length).toBe(1);
    expect(res.toolCalls[0].name).toBe('manage_shopping_list');
    expect(res.toolCalls[0].args.action).toBe('add');
    const items = res.toolCalls[0].args.items;
    expect(items.length).toBe(2);
    expect(items.some(i => /pl[aá]tano/i.test(i.name))).toBe(true);
    expect(items.some(i => /leche/i.test(i.name))).toBe(true);
  });

  it('v0.74 Refinamiento: Batch Cooking organiza tuppers de sobras para martes y jueves', () => {
    const res = appInstance.simulateGeminiAgentResponse('Planifica mi semana en modo Batch Cooking');
    expect(res.text).toContain('Batch Cooking');
    expect(res.text).toContain('🥡 Tupper de sobras');
    expect(res.toolCalls.length).toBe(1);
    expect(res.toolCalls[0].name).toBe('set_weekly_plan');
    const days = res.toolCalls[0].args.days;
    // Martes almuerzo debe ser sobras de la cena del Lunes
    expect(days[1].lunch).toBe(days[0].dinner);
    expect(days[1].isLeftoverLunch).toBe(true);
  });

  it('v0.77: stripRecipeIdsFromText elimina IDs técnicos internos del texto visible para Franky', () => {
    const raw = 'Desayuno: *Porridge Cremoso* (*rec-porridge-bowl*) | Almuerzo: Salmón (`rec-salmon-bowl`) | rec-1792772627564';
    const cleaned = appInstance.stripRecipeIdsFromText(raw);
    expect(cleaned).not.toContain('rec-porridge-bowl');
    expect(cleaned).not.toContain('rec-salmon-bowl');
    expect(cleaned).not.toContain('rec-1792772627564');
    expect(cleaned).toContain('Porridge Cremoso');
    expect(cleaned).toContain('Salmón');
  });

  it('v0.77: callGeminiAgent activa fallback local automático si Gemini devuelve error de alta demanda (503)', async () => {
    state.settings.geminiApiKey = 'AIzaSyTestHighDemand';
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({
        error: {
          code: 503,
          message: 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.'
        }
      })
    });
    const origFetch = globalThis.fetch;
    globalThis.fetch = fetchSpy;

    try {
      const res = await appInstance.callGeminiAgent('Planifica mi semana');
      expect(res.isSimulatedFallback).toBe(true);
      expect(res.toolCalls.length).toBeGreaterThan(0);
      expect(res.toolCalls[0].name).toBe('set_weekly_plan');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('v0.77: handleAiChatSubmit con "Planifica mi dia de hoy" actualiza únicamente hoy sin alterar los demás días', async () => {
    const weekDays = appInstance.getPlannerWeekDates();
    const mondayKey = weekDays[0].dateKey;
    const tuesdayKey = weekDays[1].dateKey;

    // Configurar el martes con una cena fija previa
    state.mealPlan[tuesdayKey] = {
      dayName: 'Martes',
      dateKey: tuesdayKey,
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: 'rec-pesto-pasta'
    };

    const chatInput = document.getElementById('ai-chat-input');
    chatInput.value = 'Planifica mi dia de hoy';

    // Mock callGeminiAgent que erróneamente devuelve set_weekly_plan
    const origCall = appInstance.callGeminiAgent.bind(appInstance);
    appInstance.callGeminiAgent = vi.fn().mockResolvedValue({
      text: 'He actualizado tu día.',
      toolCalls: [
        {
          name: 'set_weekly_plan',
          args: {
            days: weekDays.map(w => ({
              dateKey: w.dateKey,
              dayName: w.dayName,
              breakfast: 'rec-porridge-bowl',
              lunch: 'rec-lemon-chicken',
              snack: 'rec-healthy-snack',
              dinner: 'rec-salmon-bowl'
            }))
          }
        }
      ]
    });

    try {
      await appInstance.handleAiChatSubmit();

      const todayKey = window.toLocalDateKey(new Date());
      const todayData = state.getDayPlan(todayKey);
      expect(todayData.lunch).toBe('rec-lemon-chicken');

      // Si hoy no es martes, el martes debe haber conservado su cena original y no ser sobreescrito
      if (todayKey !== tuesdayKey) {
        expect(state.mealPlan[tuesdayKey].dinner).toBe('rec-pesto-pasta');
      }
    } finally {
      appInstance.callGeminiAgent = origCall;
    }
  });

  it('v0.77: set_weekly_plan garantiza que todos los 7 días tienen sus 4 comidas sin huecos vacíos', () => {
    const weekDays = appInstance.getPlannerWeekDates();
    // Simular que el modelo solo envía almuerzo y cena para el primer día
    const toolRes = appInstance.executeAiToolCall({
      name: 'set_weekly_plan',
      args: {
        mode: 'replace',
        completeWeek: true,
        days: [
          {
            dateKey: weekDays[0].dateKey,
            dayName: weekDays[0].dayName,
            lunch: 'rec-lemon-chicken',
            dinner: 'rec-salmon-bowl'
          }
        ]
      }
    });

    expect(toolRes.tool).toBe('set_weekly_plan');
    weekDays.forEach(w => {
      const dayPlan = state.getDayPlan(w.dateKey, w.dayName);
      expect(dayPlan.breakfast).toBeTruthy();
      expect(dayPlan.lunch).toBeTruthy();
      expect(dayPlan.snack).toBeTruthy();
      expect(dayPlan.dinner).toBeTruthy();
    });
  });

  it('v0.78: Modelos obsoletos como gemini-2.5-flash-lite se migran automáticamente a gemini-3.8-flash y nunca se llaman en fetch', async () => {
    state.settings.geminiModel = 'gemini-2.5-flash-lite';
    state.settings.geminiApiKey = 'test-key';

    const calledEndpoints = [];
    const origFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      calledEndpoints.push(url);
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '{"title": "Receta Test", "ingredients": [{"name": "Pollo", "amount": 100, "unit": "g"}], "instructions": [{"step": 1, "text": "Cocinar"}]}' }] } }]
        })
      };
    });

    try {
      await appInstance.extractRecipeWithGemini({ text: 'Pollo salteado' });
      expect(state.settings.geminiModel).toBe('gemini-3.8-flash');
      expect(calledEndpoints.length).toBeGreaterThan(0);
      calledEndpoints.forEach(ep => {
        expect(ep).not.toContain('gemini-2.5-flash-lite');
        expect(ep).not.toContain('gemini-2.5');
        expect(ep).toContain('gemini-3.8-flash');
      });
    } finally {
      globalThis.fetch = origFetch;
    }
  });
});
