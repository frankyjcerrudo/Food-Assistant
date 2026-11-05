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

  it('US-17: callGeminiAgent conecta con gemini-3.8-flash, conmuta a gemini-3.5-flash-lite ante 503, y si ambos fallan activa fallback inteligente', async () => {
    state.settings.geminiApiKey = 'AIzaSyTestFallbackKey';
    let callCount = 0;
    const calledModels = [];
    const origFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      callCount++;
      calledModels.push(url);
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
      expect(callCount).toBeGreaterThanOrEqual(2);
      expect(calledModels[0]).toContain('gemini-3.8-flash');
      expect(calledModels[1]).toContain('gemini-3.5-flash-lite');
      expect(res.toolCalls.length).toBeGreaterThan(0);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('v0.96: callGeminiAgent se recupera de forma transparente con gemini-3.5-flash-lite cuando gemini-3.8-flash devuelve 503 (alta demanda)', async () => {
    state.settings.geminiApiKey = 'AIzaSyLiveHighDemandKey';
    state.settings.geminiModel = 'gemini-3.8-flash';
    const calledUrls = [];
    const origFetch = globalThis.fetch;

    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      calledUrls.push(url);
      if (url.includes('gemini-3.8-flash')) {
        return {
          ok: false,
          status: 503,
          json: async () => ({
            error: {
              code: 503,
              message: 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.',
              status: 'UNAVAILABLE'
            }
          })
        };
      }
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '¡Hola Franky! Respuesta real desde Gemini 3.5 Flash-Lite con razonamiento activo.' }] } }]
        })
      };
    });

    try {
      const res = await appInstance.callGeminiAgent('Planifica mi semana');
      expect(calledUrls.length).toBe(2);
      expect(calledUrls[0]).toContain('gemini-3.8-flash');
      expect(calledUrls[1]).toContain('gemini-3.5-flash-lite');
      expect(res.isSimulatedFallback).toBeFalsy();
      expect(res.text).toContain('Gemini 3.5 Flash-Lite');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('v0.98: callGeminiAgent conmuta de inmediato a gemini-3.5-flash-lite si gemini-3.8-flash da timeout (AbortError)', async () => {
    state.settings.geminiApiKey = 'AIzaSyTimeoutTestKey';
    state.settings.geminiModel = 'gemini-3.8-flash';
    const calledUrls = [];
    const origFetch = globalThis.fetch;

    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      calledUrls.push(url);
      if (url.includes('gemini-3.8-flash')) {
        const abortErr = new Error('The operation was aborted');
        abortErr.name = 'AbortError';
        throw abortErr;
      }
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '¡Listo Franky! Respuesta recuperada desde Gemini 3.5 Flash-Lite tras timeout de 3.8.' }] } }]
        })
      };
    });

    try {
      const res = await appInstance.callGeminiAgent('Crea un plan semanal');
      expect(calledUrls.length).toBe(2);
      expect(calledUrls[0]).toContain('gemini-3.8-flash');
      expect(calledUrls[1]).toContain('gemini-3.5-flash-lite');
      expect(res.isSimulatedFallback).toBeFalsy();
      expect(res.text).toContain('Gemini 3.5 Flash-Lite');
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

  it('v0.84: callGeminiAgent recupera automáticamente ante error 429 (Quota exceeded limit 20) activando fallback sin romper la UI', async () => {
    state.settings.geminiApiKey = 'AIzaSyQuotaTestKey';
    state.settings.aiProvider = 'gemini';
    const origFetch = globalThis.fetch;
    const quotaErrorMsg = 'Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_requests, limit: 20, model: gemini-3.8-flash, description: Generate content requests per day limit exceeded on Free Tier. Please retry in 14h3m40s.';

    globalThis.fetch = vi.fn().mockImplementation(async () => {
      return {
        ok: false,
        status: 429,
        json: async () => ({
          error: { message: quotaErrorMsg }
        })
      };
    });

    try {
      const res = await appInstance.callGeminiAgent('dime recetas interesantes para Hall');
      expect(res).toBeDefined();
      expect(res.isSimulatedFallback).toBe(true);
      expect(res.text.toLowerCase()).toContain('halloween');
      expect(res.text.toLowerCase()).toContain('calabaza');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('v0.84: simulateGeminiAgentResponse resuelve con éxito consultas de recetas temáticas de Halloween', () => {
    const res = appInstance.simulateGeminiAgentResponse('dime recetas interesantes para Hall');
    expect(res).toBeDefined();
    expect(res.text).toContain('Franky');
    expect(res.text.toLowerCase()).toContain('halloween');
    expect(res.text.toLowerCase()).toContain('pimientos');
    expect(res.text.toLowerCase()).toContain('calabaza');
  });

  it('v0.84: Selector Multi-Proveedor (BYOK) permite configurar OpenAI y Claude en Ajustes', () => {
    state.settings.aiProvider = 'openai';
    state.settings.geminiApiKey = 'sk-proj-test1234';

    const card = document.createElement('div');
    card.id = 'card-ai-settings';
    const select = document.createElement('select');
    select.id = 'select-ai-provider';
    const optGemini = document.createElement('option');
    optGemini.value = 'gemini';
    const optOpenAi = document.createElement('option');
    optOpenAi.value = 'openai';
    const optClaude = document.createElement('option');
    optClaude.value = 'claude';
    select.appendChild(optGemini);
    select.appendChild(optOpenAi);
    select.appendChild(optClaude);

    const input = document.createElement('input');
    input.id = 'input-gemini-key';
    const status = document.createElement('div');
    status.id = 'gemini-key-status';

    document.body.appendChild(card);
    document.body.appendChild(select);
    document.body.appendChild(input);
    document.body.appendChild(status);

    appInstance.renderSettings();

    expect(select.value).toBe('openai');
    expect(input.placeholder).toContain('OpenAI');
    expect(status.textContent).toContain('OpenAI ChatGPT');

    // Cambiar a Claude
    select.value = 'claude';
    select.dispatchEvent(new Event('change'));
    expect(state.settings.aiProvider).toBe('claude');
    expect(input.placeholder).toContain('Claude');

    document.body.removeChild(card);
    document.body.removeChild(select);
    document.body.removeChild(input);
    document.body.removeChild(status);
  });

  it('v0.85: callGeminiAgent usa gemini-2.5-flash con 1.500 peticiones/día cuando está configurado', async () => {
    state.settings.geminiApiKey = 'AIzaSyTestKey25';
    state.settings.geminiModel = 'gemini-2.5-flash';
    state.settings.aiProvider = 'gemini';

    const origFetch = globalThis.fetch;
    let calledUrl = null;
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      calledUrl = url;
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '¡Hola Franky! Respuesta con 1.500 peticiones diarias.' }] } }]
        })
      };
    });

    try {
      const res = await appInstance.callGeminiAgent('Hola');
      expect(calledUrl).toContain('models/gemini-2.5-flash:generateContent');
      expect(res.text).toContain('Respuesta con 1.500 peticiones diarias');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('v0.90: callGeminiAgent en gemini-3.8-flash conmuta a gemini-3.5-flash-lite ante error 429 de cuota (20 req/día)', async () => {
    state.settings.geminiApiKey = 'AIzaSyTestKeyFailover';
    state.settings.geminiModel = 'gemini-3.8-flash';
    state.settings.aiProvider = 'gemini';

    const calledUrls = [];
    const origFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      calledUrls.push(url);
      if (url.includes('gemini-3.8-flash')) {
        return {
          ok: false,
          status: 429,
          json: async () => ({
            error: { message: 'Quota exceeded for metric: limit: 20, model: gemini-3.8-flash' }
          })
        };
      }
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: 'Recuperado con éxito en gemini-3.5-flash-lite.' }] } }]
        })
      };
    });

    try {
      const res = await appInstance.callGeminiAgent('Recetas');
      expect(calledUrls.length).toBe(2);
      expect(calledUrls[0]).toContain('gemini-3.8-flash');
      expect(calledUrls[1]).toContain('gemini-3.5-flash-lite');
      expect(res.text).toContain('Recuperado con éxito en gemini-3.5-flash-lite');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('v0.86: callGeminiAgent conecta con gemini-2.5-pro para cuentas Pro o con facturación', async () => {
    state.settings.geminiApiKey = 'AIzaSyProKey';
    state.settings.geminiModel = 'gemini-2.5-pro';
    state.settings.aiProvider = 'gemini';

    const origFetch = globalThis.fetch;
    let calledUrl = null;
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      calledUrl = url;
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '¡Hola Franky! Respuesta generada por Gemini 2.5 Pro.' }] } }]
        })
      };
    });

    try {
      const res = await appInstance.callGeminiAgent('Asesoramiento nutricional');
      expect(calledUrl).toContain('models/gemini-2.5-pro:generateContent');
      expect(res.text).toContain('Gemini 2.5 Pro');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('v0.90: callGeminiAgent usa gemini-3.8-flash por defecto cuando no hay modelo explícito configurado', async () => {
    state.settings.geminiApiKey = 'AIzaSyLiteDefault';
    delete state.settings.geminiModel;
    state.settings.aiProvider = 'gemini';

    const origFetch = globalThis.fetch;
    let calledUrl = null;
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      calledUrl = url;
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '¡Hola Franky! Respuesta desde Gemini 3.8 Flash.' }] } }]
        })
      };
    });

    try {
      const res = await appInstance.callGeminiAgent('Hola');
      expect(calledUrl).toContain('models/gemini-3.8-flash:generateContent');
      expect(res.text).toContain('Gemini 3.8 Flash');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('v0.87: callGeminiAgent recupera automáticamente si gemini-2.5-flash devuelve error "not available to new users", conmutando a gemini-3.5-flash-lite', async () => {
    state.settings.geminiApiKey = 'AIzaSyNewProjectKey';
    state.settings.geminiModel = 'gemini-2.5-flash';
    state.settings.aiProvider = 'gemini';

    const calledUrls = [];
    const origFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      calledUrls.push(url);
      if (url.includes('gemini-2.5-flash')) {
        return {
          ok: false,
          status: 404,
          json: async () => ({
            error: {
              code: 404,
              message: 'The model models/gemini-2.5-flash is not available to new users. Please use gemini-3.5-flash-lite or gemini-3.8-flash.',
              status: 'NOT_FOUND'
            }
          })
        };
      }
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '¡Hola Franky! Asistente activo con Gemini 3.5 Flash-Lite.' }] } }]
        })
      };
    });

    try {
      const res = await appInstance.callGeminiAgent('Planifica mi semana');
      expect(calledUrls.length).toBe(2);
      expect(calledUrls[0]).toContain('gemini-2.5-flash');
      expect(calledUrls[1]).toContain('gemini-3.5-flash-lite');
      expect(res.text).toContain('Gemini 3.5 Flash-Lite');
      // Verifica que la configuración se actualiza permanentemente
      expect(state.settings.geminiModel).toBe('gemini-3.5-flash-lite');
    } finally {
      globalThis.fetch = origFetch;
    }
  });
  it('v0.90: consultas de ideas para cenar ("dame ideas para cenar hoy") no sobre-planifican el día completo ni tocan desayuno/almuerzo/merienda', async () => {
    state.settings.geminiApiKey = ''; // activar simulador inteligente local
    const todayBefore = state.getDayPlan('2026-11-01', 'Domingo');
    
    const res = await appInstance.callGeminiAgent('dame ideas para cenar hoy');
    expect(res.toolCalls.length).toBe(0); // No debe ejecutar set_day_plan para las 4 comidas
    expect(res.text.toLowerCase()).toContain('cenar');
    expect(res.text).not.toContain('Desayuno:');
    expect(res.text).not.toContain('Merienda:');
  });


  it('v0.95: isWeekendPrompt detecta exclusiones y negaciones ("no incluyas fin de semana") sin confundirlo con plan de finde', () => {
    const promptExclusion = 'Quiero que planifiques mi semana, haciendo un plan equilibrado, variado, y con enfoque en proteínas. No incluyas el fin de semana ni las meriendas';
    expect(appInstance.isWeekendPrompt(promptExclusion)).toBe(false);
    expect(appInstance.isWeeklyPlanPrompt(promptExclusion)).toBe(true);

    const promptWeekendOnly = 'Planifica únicamente mi fin de semana';
    expect(appInstance.isWeekendPrompt(promptWeekendOnly)).toBe(true);
  });

  it('v0.95: buildSimulatedWeeklyPlanArgs respeta exclusiones de fin de semana y meriendas sin duplicar recetas el mismo día', () => {
    const prompt = 'Planifica mi semana sin fin de semana ni meriendas';
    const planArgs = appInstance.buildSimulatedWeeklyPlanArgs('replace', false, prompt);
    expect(planArgs.days.length).toBe(7);

    // Días de lunes a viernes: merienda debe ser null
    const weekdays = planArgs.days.slice(0, 5);
    weekdays.forEach(d => {
      expect(d.snack).toBeNull();
      // Si hay recetas distintas para almuerzo y cena, no deben ser iguales en el mismo día
      if (d.lunch && d.dinner) {
        expect(d.lunch).not.toBe(d.dinner);
      }
    });

    // Días de fin de semana (Sábado y Domingo): comidas en null
    const weekendDays = planArgs.days.slice(5);
    weekendDays.forEach(d => {
      expect(d.breakfast).toBeNull();
      expect(d.lunch).toBeNull();
      expect(d.snack).toBeNull();
      expect(d.dinner).toBeNull();
    });
  });

  it('v0.95: buildAiSystemInstruction exige razonamiento culinario, rotación de fuentes de proteína, variedad estricta y respeto a exclusiones', () => {
    const sysPrompt = appInstance.buildAiSystemInstruction();
    expect(sysPrompt).toContain('RESPETO RIGUROSO A EXCLUSIONES DEL USUARIO');
    expect(sysPrompt).toContain('REGLA ESTRICTA DE VARIEDAD Y ROTACIÓN DE PROTEÍNAS');
    expect(sysPrompt).toContain('NUNCA repitas la misma receta en la misma semana');
    expect(sysPrompt).toContain('NUNCA repitas la misma fuente de proteína principal');
    expect(sysPrompt).toContain('RAZONAMIENTO, TRANSPARENCIA Y PREGUNTAS');
  });
  it('v0.97: create_and_save_recipe no duplica recetas si el título ya existe en el catálogo', () => {
    state.recipes = [
      { id: 'rec-orig-1', title: 'Tortitas Proteicas de Avena', tags: [], ingredients: [], instructions: [] }
    ];

    const res = appInstance.executeAiToolCall({
      name: 'create_and_save_recipe',
      args: {
        title: 'Tortitas Proteicas de Avena',
        ingredients: [{ name: 'Avena', amount: 50, unit: 'g' }]
      }
    });

    expect(res.alreadyExisted).toBe(true);
    expect(res.recipeId).toBe('rec-orig-1');
    expect(state.recipes.length).toBe(1);
  });

  it('v0.97: cleanDuplicateRecipes limpia recetas duplicadas conservando la primera versión', () => {
    state.recipes = [
      { id: 'rec-1', title: 'Pollo al Horno', tags: [] },
      { id: 'rec-2', title: 'Salmón a la plancha', tags: [] },
      { id: 'rec-3', title: 'pollo al horno', tags: [] },
      { id: 'rec-4', title: 'POLLETO', tags: [] }
    ];

    const removed = appInstance.cleanDuplicateRecipes();
    expect(removed).toBe(1);
    expect(state.recipes.length).toBe(3);
    expect(state.recipes.map(r => r.id)).toEqual(['rec-1', 'rec-2', 'rec-4']);
  });

  it('v0.97: set_weekly_plan respeta merienda en null sin forzar recetas fallback si el usuario excluyó meriendas', () => {
    const res = appInstance.executeAiToolCall({
      name: 'set_weekly_plan',
      args: {
        mode: 'replace',
        days: [
          {
            dateKey: '2026-11-02',
            dayName: 'Lunes',
            breakfast: 'rec-1',
            lunch: 'rec-1',
            snack: null,
            dinner: 'rec-2'
          }
        ]
      }
    });

    expect(res.tool).toBe('set_weekly_plan');
    const day = state.getDayPlan('2026-11-02', 'Lunes');
    expect(day.snack).toBeNull();
  });

  it('v1.25: detectPromptCriteria y selectRelevantRecipesForPrompt priorizan preferencias y limitan el catálogo para evitar timeouts', () => {
    const promptWithProtein = "Crea un plan semanal rico en proteinas, equilibrado y saludable. No incluyas fin de semana ni meriendas";
    const criteria = appInstance.detectPromptCriteria(promptWithProtein);
    expect(criteria.length).toBeGreaterThan(0);
    expect(criteria.some(c => c.key === 'protein')).toBe(true);

    // Criterios detectados ante peticiones de gimnasio / entreno / cena
    const gymDinnerPrompt = "elige una buena cena para hoy y para después del gimnasio";
    const gymCriteria = appInstance.detectPromptCriteria(gymDinnerPrompt);
    expect(gymCriteria.some(c => c.key === 'protein')).toBe(true);
    expect(gymCriteria.some(c => c.slot === 'dinner')).toBe(true);

    const emptyCriteria = appInstance.detectPromptCriteria("Organiza mi semana");
    expect(emptyCriteria.length).toBe(0);

    // Con catálogo simulado de 200 recetas
    const fakeCatalog = Array.from({ length: 200 }, (_, i) => ({
      id: `fake-${i}`,
      title: i % 2 === 0 ? `Salmón al horno ${i}` : `Postre dulce ${i}`,
      tags: i % 2 === 0 ? ['Cena', 'Pescado'] : ['Postre'],
      ingredients: i % 2 === 0 ? [{ name: 'salmón' }, { name: 'espárragos' }] : [{ name: 'azúcar' }],
      nutrition: { protein: i % 2 === 0 ? 35 : 2, calories: 300, carbs: 10, fat: 5 },
      isFavorite: i === 0
    }));

    // Con criterios: pre-selecciona subconjunto amplio
    const filtered = appInstance.selectRelevantRecipesForPrompt(fakeCatalog, promptWithProtein);
    expect(filtered.length).toBeLessThanOrEqual(90);
    expect(filtered.length).toBeGreaterThanOrEqual(35);

    // Ante petición de cena tras el gimnasio: acota a ~50 recetas y prioriza cenas altas en proteínas
    const dinnerGymFiltered = appInstance.selectRelevantRecipesForPrompt(fakeCatalog, gymDinnerPrompt);
    expect(dinnerGymFiltered.length).toBeLessThanOrEqual(50);
    expect(dinnerGymFiltered[0].nutrition.protein).toBeGreaterThanOrEqual(25);

    // Sin criterios específicos de prompt: aplica prioridades del usuario y nunca envía las 200 para evitar timeout
    const all = appInstance.selectRelevantRecipesForPrompt(fakeCatalog, "Organiza mi semana");
    expect(all.length).toBeLessThanOrEqual(90);
    expect(all.length).toBeGreaterThanOrEqual(35);
  });

  it('v1.00: resolveRecipeIdForAgent resuelve recetas ignorando preposiciones/conectores y con coincidencia difusa', () => {
    state.recipes = [
      { id: 'rec-shake-myprotein', title: 'Batido proteinas MyProtein' },
      { id: 'rec-tortilla', title: 'Tortilla de patatas con cebolla' }
    ];

    // Con "DE" en el prompt vs sin "DE" en el título
    expect(appInstance.resolveRecipeIdForAgent('Batido de proteinas MyProtein')).toBe('rec-shake-myprotein');
    // Sin "DE" exactamente como el título
    expect(appInstance.resolveRecipeIdForAgent('Batido proteinas MyProtein')).toBe('rec-shake-myprotein');
    // Con artículo "el" y preposición "de"
    expect(appInstance.resolveRecipeIdForAgent('el Batido de proteinas MyProtein')).toBe('rec-shake-myprotein');
    // Coincidencia parcial difusa
    expect(appInstance.resolveRecipeIdForAgent('Tortilla de patatas')).toBe('rec-tortilla');
  });

  it('v1.00: Asignación recurrente en la semana (ej. "pon en todas las metiendas de esta semana el Batido de proteinas MyProtein") genera set_weekly_plan y no lista de compra ni creación de receta', () => {
    state.recipes = [
      { id: 'rec-shake-myprotein', title: 'Batido proteinas MyProtein' },
      { id: 'rec-salmon', title: 'Salmón a la plancha' }
    ];

    const promptWithTypo = 'pon en todas las metiendas de esta semana el Batido de proteinas MyProtein';
    expect(appInstance.isRecurringWeeklySlotPrompt(promptWithTypo)).toBe(true);

    const res = appInstance.simulateGeminiAgentResponse(promptWithTypo);
    expect(res.toolCalls.length).toBe(1);
    expect(res.toolCalls[0].name).toBe('set_weekly_plan');
    expect(res.toolCalls[0].args.days.length).toBe(7);
    expect(res.toolCalls[0].args.days[0].snack).toBe('rec-shake-myprotein');

    // No debe llamar a lista de la compra ni crear receta
    expect(res.toolCalls.some(tc => tc.name === 'manage_shopping_list')).toBe(false);
    expect(res.toolCalls.some(tc => tc.name === 'create_and_save_recipe')).toBe(false);
  });

  it('v1.00: "Añade la receta Batido de proteinas MyProtein a las meriendas de toda la semana" actualiza el planificador sin crear recetas duplicadas', () => {
    state.recipes = [
      { id: 'rec-shake-myprotein', title: 'Batido proteinas MyProtein' }
    ];

    const promptAdd = 'Añade la receta Batido de proteinas MyProtein a las meriendas de toda la semana';
    const res = appInstance.simulateGeminiAgentResponse(promptAdd);
    expect(res.toolCalls.length).toBe(1);
    expect(res.toolCalls[0].name).toBe('set_weekly_plan');
    expect(res.toolCalls[0].args.days[0].snack).toBe('rec-shake-myprotein');
    expect(res.toolCalls.some(tc => tc.name === 'create_and_save_recipe')).toBe(false);

    // Y si se intentara ejecutar create_and_save_recipe con ese título, no crea duplicados
    const createToolRes = appInstance.executeAiToolCall({
      name: 'create_and_save_recipe',
      args: { title: 'Batido de proteinas MyProtein', ingredients: [], instructions: [] }
    });
    expect(createToolRes.alreadyExisted).toBe(true);
    expect(createToolRes.recipeId).toBe('rec-shake-myprotein');
  });

  it('v1.01: Asignar receta que sobrepasa objetivos diarios incluye aviso nutricional cordial y no bloquea la acción', () => {
    state.settings.nutritionGoals = { enabled: true, calories: 1800, protein: 100, carbs: 180, fat: 50 };
    state.recipes = [
      {
        id: 'rec-shake-ultra',
        title: 'Batido proteinas MyProtein',
        nutrition: { calories: 350, protein: 55, carbs: 8, fat: 3 }
      }
    ];

    const prompt = 'Pon Batido proteinas MyProtein a todas las meriendas de la semana';
    const res = appInstance.simulateGeminiAgentResponse(prompt);

    // Debe ejecutar la acción en el planificador (NUNCA bloquear al usuario)
    expect(res.toolCalls.length).toBe(1);
    expect(res.toolCalls[0].name).toBe('set_weekly_plan');
    expect(res.toolCalls[0].args.days[0].snack).toBe('rec-shake-ultra');

    // Debe incluir un aviso nutricional transparente sobre el exceso sin impedir la acción
    expect(res.text).toContain('Nota nutricional');
    expect(res.text).toContain('proteína');
  });

  it('v1.03: callGeminiAgent envía payload estándar limpio sin parámetros inválidos y con timeout ampliado a 25s', async () => {
    state.settings.geminiApiKey = 'AIzaSyStandardPayloadTest';
    state.settings.geminiModel = 'gemini-3.8-flash';
    const origFetch = globalThis.fetch;
    let sentBody = null;

    globalThis.fetch = vi.fn().mockImplementation(async (url, opts) => {
      sentBody = JSON.parse(opts.body);
      return {
        ok: true,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: 'Respuesta inmediata' }] } }]
        })
      };
    });

    try {
      await appInstance.callGeminiAgent('Planifica mi dia de hoy');
      expect(sentBody).not.toBeNull();
      // No debe enviar thinkingConfig que provoque "Request contains an invalid argument" en generateContent
      expect(sentBody.generationConfig?.thinkingConfig).toBeUndefined();
    } finally {
      globalThis.fetch = origFetch;
    }
  });
});
