import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const htmlCode = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
const i18nCode = fs.readFileSync(path.resolve(process.cwd(), 'i18n.js'), 'utf-8');
const appCode = fs.readFileSync(path.resolve(process.cwd(), 'app.js'), 'utf-8');

describe('US-80: Centro de IA Sous Chef (Vista Propia + Historial + Acciones/Cámara) y Autoplanificador Semanal Inteligente', () => {
  let app;

  beforeEach(() => {
    document.documentElement.innerHTML = htmlCode;
    localStorage.clear();
    localStorage.setItem('fa_sb_url', 'https://test.supabase.co');
    localStorage.setItem('fa_language', 'es');
    new Function(i18nCode)();
    new Function(appCode)();
    if (window.I18n && typeof window.I18n.setLanguage === 'function') {
      window.I18n.setLanguage('es');
    }

    const { FoodAssistantApp, state, SEED_RECIPES } = window;
    state.cloudUser = { id: 'u1', email: 'franky@sabory.app', name: 'Franky' };
    state.aiPlan = {
      plan: 'pro',
      source: 'admin',
      status: 'active',
      periodEnd: null,
      isTrial: false,
      viaHousehold: false,
      quotas: {},
      fetchedAt: null
    };
    state.recipes = JSON.parse(JSON.stringify(SEED_RECIPES));
    state.mealPlan = state.generateInitialMealPlan();
    state.shoppingList = [];
    state.dietaryPreferences = [];
    state.settings = {
      language: 'es',
      defaultServings: 4,
      nutritionGoals: { enabled: true, calories: 2200, protein: 150, carbs: 220, fat: 70 }
    };
    app = new FoodAssistantApp();
    window.app = app;
  });

  it('1. Botón central del dock y cabecera escritorio abren #view-ai sin auto-activar el micrófono y volver restaura la vista previa', () => {
    app.switchView('view-planner');
    expect(app.activeView).toBe('view-planner');

    const toggleSpy = vi.spyOn(app, 'toggleVoiceRecognition');
    document.getElementById('btn-central-gemini-invoke').click();

    expect(app.activeView).toBe('view-ai');
    expect(document.getElementById('view-ai').classList.contains('active')).toBe(true);
    expect(toggleSpy).not.toHaveBeenCalled();

    document.getElementById('btn-close-gemini-invoke').click();
    expect(app.activeView).toBe('view-planner');

    document.getElementById('btn-desktop-gemini-invoke').click();
    expect(app.activeView).toBe('view-ai');
    expect(toggleSpy).not.toHaveBeenCalled();
  });

  it('2. Persistencia local del historial de chat: sobrevive a cambios de vista y recargas hasta pulsar "Nuevo tema"', async () => {
    app.getAiAuthToken = vi.fn().mockResolvedValue('tok');
    const origFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        data: {
          candidates: [{ content: { parts: [{ text: 'Para cenar te recomiendo salmón al horno con espárragos.' }] } }]
        }
      })
    });

    try {
      app.openGeminiInvokeModal(false);
      const input = document.getElementById('gemini-invoke-input');
      input.value = 'Dame una cena ligera';
      await app.handleGeminiInvokeSubmit(false);

      const savedRaw = localStorage.getItem('fa_ai_chat_history');
      expect(savedRaw).toBeTruthy();
      expect(savedRaw).toContain('Dame una cena ligera');
      expect(savedRaw).toContain('salmón al horno');

      // Cambiar de vista y volver NO borra el historial
      app.switchView('view-recipes');
      app.openGeminiInvokeModal(false);
      expect(app.aiChatHistory.length).toBeGreaterThanOrEqual(2);
      expect(document.getElementById('chat-history-container').textContent).toContain('Dame una cena ligera');

      // Simular recarga de la app con nueva instancia de FoodAssistantApp
      const reloadedApp = new window.FoodAssistantApp();
      reloadedApp.switchView('view-ai');
      expect(reloadedApp.aiChatHistory.length).toBeGreaterThanOrEqual(2);
      expect(document.getElementById('chat-history-container').textContent).toContain('salmón al horno');

      // Solo se borra al pulsar "Nuevo tema"
      document.getElementById('btn-gemini-invoke-new-chat').click();
      expect(reloadedApp.aiChatHistory.length).toBe(0);
      expect(JSON.parse(localStorage.getItem('fa_ai_chat_history'))).toEqual([]);
      expect(document.getElementById('ai-chat-empty-state').style.display).not.toBe('none');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('3. Hub de Acciones Rápidas y botón de cámara extraen receta con foto en chat (incluido plan Free con import_ai)', async () => {
    // Plan Free con cuota de import_ai disponible
    window.state.aiPlan = {
      plan: 'free',
      source: 'default',
      status: 'active',
      quotas: {
        chat: { used: 0, limit: 0 },
        voice: { used: 0, limit: 0 },
        guided_query: { used: 0, limit: 3 },
        weekly_plan: { used: 0, limit: 1 },
        import_ai: { used: 0, limit: 3 }
      }
    };
    app.openGeminiInvokeModal(false);

    expect(document.getElementById('btn-ai-hub-autoplan')).not.toBeNull();
    expect(document.getElementById('btn-ai-hub-photo')).not.toBeNull();
    expect(document.getElementById('btn-ai-hub-text')).not.toBeNull();
    expect(document.getElementById('btn-ai-hub-fridge')).not.toBeNull();
    expect(document.getElementById('btn-gemini-invoke-camera')).not.toBeNull();

    app.compressImageToBase64 = vi.fn().mockResolvedValue({
      dataUrl: 'data:image/jpeg;base64,QUJD',
      base64Data: 'QUJD',
      mimeType: 'image/jpeg'
    });
    app.extractRecipeWithGemini = vi.fn().mockResolvedValue({
      title: 'Tostada Proteica de Aguacate',
      description: 'Tostada rápida alta en proteína',
      prepTimeMinutes: 5,
      cookTimeMinutes: 5,
      servings: 2,
      tags: ['Desayuno'],
      ingredients: [
        { name: 'Pan integral', amount: 2, unit: 'ud', aisle: 'bakery' },
        { name: 'Aguacate', amount: 1, unit: 'ud', aisle: 'produce' }
      ],
      instructions: [{ step: 1, text: 'Tostar el pan y añadir el aguacate.', timerMinutes: 3 }],
      nutrition: { calories: 340, protein: 16, carbs: 30, fat: 18 }
    });

    await app.handleAiChatPhotoSelected({ name: 'tostada.jpg', type: 'image/jpeg' });
    expect(app.pendingChatAttachment).not.toBeNull();
    expect(document.getElementById('ai-chat-attachment-preview').style.display).toBe('flex');

    // Enviar con input vacío usando solo la foto adjunta -> consume import_ai en lugar de bloquear con chat Pro
    document.getElementById('gemini-invoke-input').value = '';
    await app.handleGeminiInvokeSubmit(false);

    expect(app.extractRecipeWithGemini).toHaveBeenCalledTimes(1);
    const recipeCard = document.querySelector('#chat-history-container .ai-chat-recipe-card');
    expect(recipeCard).not.toBeNull();
    expect(recipeCard.textContent).toContain('Tostada Proteica de Aguacate');

    // Botón Revisar borrador abre openImportReview
    const reviewSpy = vi.spyOn(app, 'openImportReview');
    recipeCard.querySelector('[data-ai-action="review-chat-recipe"]').click();
    expect(reviewSpy).toHaveBeenCalledTimes(1);

    // Botón Guardar en mis recetas añade la receta al catálogo
    const beforeCount = window.state.recipes.length;
    recipeCard.querySelector('[data-ai-action="save-chat-recipe"]').click();
    expect(window.state.recipes.length).toBe(beforeCount + 1);
    expect(document.querySelector('#chat-history-container .ai-chat-recipe-card').textContent).toContain('Guardada');
  });

  it('4. Planificador muestra botón cabecera #btn-planner-ai-auto y banner sutil proactivo solo cuando la semana está vacía', () => {
    window.state.aiPlan = {
      plan: 'free',
      quotas: { weekly_plan: { used: 0, limit: 1 }, import_ai: { used: 0, limit: 3 }, guided_query: { used: 0, limit: 3 } }
    };

    // Semanas con comidas -> banner oculto
    app.switchView('view-planner');
    app.renderAiQuotaHints();
    expect(document.getElementById('btn-planner-ai-auto')).not.toBeNull();
    expect(document.getElementById('planner-autoplan-quota-badge').textContent).toBe('1/1');

    // Vaciar la semana actual -> banner proactivo visible
    const weekDays = app.getPlannerWeekDates();
    weekDays.forEach(d => {
      window.state.mealPlan[d.dateKey] = {
        dateKey: d.dateKey,
        dayName: d.dayName,
        breakfast: null,
        lunch: null,
        snack: null,
        dinner: null,
        customSlots: []
      };
    });
    app.renderPlanner();
    expect(document.getElementById('planner-empty-ai-banner').style.display).toBe('flex');

    // Al añadir 1 sola comida -> banner se oculta automáticamente
    window.state.mealPlan[weekDays[0].dateKey].lunch = window.state.recipes[0].id;
    app.renderPlanner();
    expect(document.getElementById('planner-empty-ai-banner').style.display).toBe('none');
  });

  it('5. Autoplanificador Inteligente inyecta preferencias/metas/favoritas, respeta alergias y permite swap + Solo huecos vacíos + lista compra en tarjeta de chat', async () => {
    const { state } = window;
    // Dejar Lunes con almuerzo fijado por el usuario y resto de semana vacía
    const weekDays = app.getPlannerWeekDates();
    weekDays.forEach(d => {
      state.mealPlan[d.dateKey] = { dateKey: d.dateKey, dayName: d.dayName, breakfast: null, lunch: null, snack: null, dinner: null };
    });
    const fixedMondayLunchId = 'rec-1'; // Bowl de Quinoa, Pollo a la Plancha y Aguacate
    // Añadir receta vegetariana favorita y receta vegana no-favorita para verificar filtrado y priorización
    state.dietaryPreferences = ['Vegetariano'];
    state.settings.nutritionGoals = { enabled: true, calories: 1950, protein: 120, carbs: 200, fat: 60 };
    state.settings.defaultServings = 4;

    state.recipes = [
      {
        id: 'rec-meat',
        title: 'Pechuga de Pollo Asada',
        servings: 2,
        tags: ['Almuerzo', 'Cena'],
        ingredients: [{ name: 'Pechuga de pollo', amount: 300, unit: 'g', aisle: 'meat' }],
        nutrition: { calories: 420, protein: 45, carbs: 0, fat: 12 },
        isFavorite: true
      },
      {
        id: 'rec-veg-fav',
        title: 'Curry de Garbanzos Favorito',
        servings: 2,
        tags: ['Vegetariano', 'Vegano', 'Almuerzo'],
        ingredients: [{ name: 'Garbanzos', amount: 200, unit: 'g', aisle: 'pantry' }],
        nutrition: { calories: 480, protein: 22, carbs: 58, fat: 16 },
        isFavorite: true
      },
      {
        id: 'rec-veg-alt',
        title: 'Pasta con Calabacín y Pesto',
        servings: 2,
        tags: ['Vegetariano', 'Almuerzo', 'Cena'],
        ingredients: [{ name: 'Pasta integral', amount: 180, unit: 'g', aisle: 'pantry' }],
        nutrition: { calories: 510, protein: 18, carbs: 64, fat: 18 },
        isFavorite: false
      },
      {
        id: 'rec-veg-bk',
        title: 'Porridge de Avena',
        servings: 2,
        tags: ['Vegetariano', 'Desayuno'],
        ingredients: [{ name: 'Avena', amount: 60, unit: 'g', aisle: 'pantry' }],
        nutrition: { calories: 350, protein: 14, carbs: 50, fat: 8 },
        isFavorite: true
      },
      {
        id: 'rec-veg-snk',
        title: 'Yogur con Nueces',
        servings: 2,
        tags: ['Vegetariano', 'Merienda'],
        ingredients: [{ name: 'Yogur griego', amount: 150, unit: 'g', aisle: 'dairy' }],
        nutrition: { calories: 220, protein: 15, carbs: 10, fat: 12 },
        isFavorite: false
      },
      {
        id: 'rec-veg-din',
        title: 'Crema de Calabaza y Tofu',
        servings: 2,
        tags: ['Vegetariano', 'Cena'],
        ingredients: [{ name: 'Calabaza', amount: 300, unit: 'g', aisle: 'produce' }],
        nutrition: { calories: 390, protein: 20, carbs: 40, fat: 14 },
        isFavorite: true
      }
    ];
    state.mealPlan[weekDays[0].dateKey].lunch = fixedMondayLunchId;

    let sentSystemInstruction = '';
    app.getAiAuthToken = vi.fn().mockResolvedValue('tok');
    const origFetch = globalThis.fetch;
    // Simular que Gemini devuelve erróneamente 'rec-meat' en un hueco -> el motor debe filtrarlo automáticamente
    globalThis.fetch = vi.fn().mockImplementation(async (_url, opts) => {
      const body = JSON.parse(opts.body);
      sentSystemInstruction = body?.payload?.systemInstruction?.parts?.[0]?.text || '';
      return {
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          data: {
            candidates: [{
              content: {
                parts: [{
                  functionCall: {
                    name: 'set_weekly_plan',
                    args: {
                      mode: 'replace',
                      days: weekDays.map(d => ({
                        dateKey: d.dateKey,
                        dayName: d.dayName,
                        breakfast: 'rec-veg-bk',
                        lunch: 'rec-meat', // viola Vegetariano!
                        snack: 'rec-veg-snk',
                        dinner: 'rec-veg-din'
                      }))
                    }
                  }
                }]
              }
            }]
          }
        })
      };
    });

    try {
      await app.triggerGeminiAutoPlan();

      // Context injection verified
      expect(sentSystemInstruction).toContain('Vegetariano');
      expect(sentSystemInstruction).toContain('1950 kcal');
      expect(sentSystemInstruction).toContain('FAVORITA');

      // Card rendered inside chat without prematurely overwriting state.mealPlan!
      const autoCard = document.querySelector('#chat-history-container .ai-autoplan-card');
      expect(autoCard).not.toBeNull();
      expect(autoCard.textContent).toContain('favoritas priorizadas');
      expect(autoCard.textContent).toContain('1950 kcal');
      expect(state.mealPlan[weekDays[1].dateKey].lunch).toBeNull();

      // Ningún día propuesto debe contener 'rec-meat' (pollo excluido por preferencia Vegetariano)
      const planMsg = app.aiChatHistory.find(m => m.card?.type === 'weekly_plan_preview');
      expect(planMsg).toBeDefined();
      const proposedLunchDay1 = planMsg.card.data.days[0].slots.lunch;
      expect(proposedLunchDay1).not.toBe('rec-meat');
      expect(proposedLunchDay1).toBe('rec-veg-fav'); // Favorita priorizada!

      // Intercambio de plato (swap 🔄) sobre el almuerzo del martes
      const day2Key = weekDays[1].dateKey;
      const beforeSwap = planMsg.card.data.days[1].slots.lunch;
      app.swapAutoPlanCardSlot(planMsg.id, day2Key, 'lunch');
      const afterSwap = planMsg.card.data.days[1].slots.lunch;
      expect(afterSwap).not.toBe(beforeSwap);
      expect(afterSwap).not.toBe('rec-meat');

      // Verificar modo "Solo huecos vacíos" ('merge') conserva Lunes almuerzo existente + vuelca a compra escalado x2 (4/2)
      app.setAutoPlanCardMode(planMsg.id, 'merge');
      app.toggleAutoPlanCardShopping(planMsg.id, true);
      app.applyAutoPlanFromChatCard(planMsg.id);

      expect(state.mealPlan[weekDays[0].dateKey].lunch).toBe(fixedMondayLunchId); // Conservado en modo merge!
      expect(state.mealPlan[day2Key].lunch).toBe(afterSwap); // Hueco vacío rellenado con el plato swappeado!
      expect(state.shoppingList.length).toBeGreaterThan(0);

      // Calabaza base 300g para 2 raciones -> escalado a defaultServings=4 => 600g por vez!
      const pumpkinItem = state.shoppingList.find(i => i.name.toLowerCase().includes('calabaza'));
      expect(pumpkinItem).toBeDefined();
      expect(pumpkinItem.amount).toBeGreaterThanOrEqual(600);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it('6. Chips rápidos ofrecen Planificar esta semana, Compra de mi menú, prefill seguro sin items inventados y recetas rápidas', () => {
    window.state.aiPlan = {
      plan: 'free',
      quotas: { weekly_plan: { used: 0, limit: 1 }, import_ai: { used: 0, limit: 3 }, guided_query: { used: 0, limit: 3 } }
    };
    app.switchView('view-ai');

    const chips = Array.from(document.querySelectorAll('#gemini-invoke-chips .gemini-chip'));
    expect(chips.length).toBe(7);

    // El chip "Apuntar a la compra" pre-rellena el input SIN auto-enviar ni ensuciar la lista de la compra
    const prefillChip = document.querySelector('#gemini-invoke-chips .gemini-chip[data-prefill]');
    expect(prefillChip).not.toBeNull();
    const initialShoppingLen = window.state.shoppingList.length;
    const submitSpy = vi.spyOn(app, 'handleGeminiInvokeSubmit');
    prefillChip.click();

    const input = document.getElementById('gemini-invoke-input');
    expect(input.value).toBe('Apunta a la compra: ');
    expect(submitSpy).not.toHaveBeenCalled();
    expect(window.state.shoppingList.length).toBe(initialShoppingLen);
    expect(app.aiComposerFeatureOverride).toBe('guided_query');

    // El chip "Planificar esta semana" lanza triggerGeminiAutoPlan() directamente
    const autoplanChip = document.querySelector('#gemini-invoke-chips .gemini-chip[data-chip-action="autoplan"]');
    expect(autoplanChip).not.toBeNull();
    const autoPlanSpy = vi.spyOn(app, 'triggerGeminiAutoPlan').mockResolvedValue();
    autoplanChip.click();
    expect(autoPlanSpy).toHaveBeenCalledTimes(1);
  });

  it('7. Tarjeta de autoplanificador permite cambiar de semana (Próx. semana / flechas) directamente en el chat y aplicarla a esa semana', async () => {
    window.state.aiPlan = {
      plan: 'pro',
      quotas: { weekly_plan: { used: 0, limit: 10 }, import_ai: { used: 0, limit: 10 }, guided_query: { used: 0, limit: 10 } }
    };
    app.getAiAuthToken = vi.fn().mockResolvedValue('tok');
    const origFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        data: {
          candidates: [{ content: { parts: [{ text: 'Menú listo.' }] } }]
        }
      })
    });

    try {
      app.plannerWeekOffset = 0;
      await app.triggerGeminiAutoPlan();

      const planMsg = app.aiChatHistory.find(m => m.card?.type === 'weekly_plan_preview');
      expect(planMsg).toBeDefined();
      expect(planMsg.card.data.weekOffset).toBe(0);

      const nextWeekDays = app.getPlannerWeekDates(1);
      const nextWeekBtn = document.querySelector('[data-ai-action="set-plan-week"][data-week-offset="1"]');
      expect(nextWeekBtn).not.toBeNull();
      nextWeekBtn.click();

      expect(planMsg.card.data.weekOffset).toBe(1);
      expect(planMsg.card.data.days[0].dateKey).toBe(nextWeekDays[0].dateKey);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1); // No consume llamada extra de IA al cambiar semana

      app.applyAutoPlanFromChatCard(planMsg.id);
      expect(app.plannerWeekOffset).toBe(1);
      expect(window.state.mealPlan[nextWeekDays[0].dateKey]?.lunch).toBe(planMsg.card.data.days[0].slots.lunch);
    } finally {
      globalThis.fetch = origFetch;
    }
  });
});
