import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load index.html in happy-dom
const htmlPath = path.resolve(process.cwd(), 'index.html');
const htmlCode = fs.readFileSync(htmlPath, 'utf-8');
document.documentElement.innerHTML = htmlCode;

// Load app.js
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const {
  StateStore,
  FoodAssistantApp,
  getIngredientSuggestions,
  estimateRecipeNutrition,
  state,
  SEED_RECIPES
} = window;

describe('Camino B (US-17 & BUG-26): Asistente de Voz Integrado, Plurales y Fin de Semana', () => {
  let app;

  beforeEach(() => {
    localStorage.clear();
    state.recipes = typeof structuredClone === 'function' ? structuredClone(SEED_RECIPES) : JSON.parse(JSON.stringify(SEED_RECIPES));
    state.mealPlan = state.generateInitialMealPlan();
    app = new FoodAssistantApp();
    window.app = app;
  });

  describe('BUG-26: Lematización de Plurales en Ingredientes', () => {
    it('getIngredientSuggestions sugiere "Dorada" cuando el usuario busca "Doradas"', () => {
      const suggestions = getIngredientSuggestions('Doradas');
      expect(suggestions.length).toBeGreaterThan(0);
      const match = suggestions.find(s => s.name.toLowerCase().includes('dorada'));
      expect(match).toBeDefined();
      expect(match.name).toBe('Dorada');
      expect(match.aisle).toBe('meat');
    });

    it('getIngredientSuggestions sugiere "Patatas" cuando el usuario busca "Patata"', () => {
      const suggestions = getIngredientSuggestions('Patata');
      expect(suggestions.length).toBeGreaterThan(0);
      const match = suggestions.find(s => s.name.toLowerCase().includes('patata'));
      expect(match).toBeDefined();
    });

    it('getIngredientSuggestions sugiere "Huevos" cuando el usuario busca "Huevo"', () => {
      const suggestions = getIngredientSuggestions('Huevo');
      expect(suggestions.length).toBeGreaterThan(0);
      const match = suggestions.find(s => s.name.toLowerCase().includes('huevo'));
      expect(match).toBeDefined();
    });
  });

  describe('Planificación inteligente de Fin de Semana vs Semana Completa', () => {
    it('isWeekendPrompt detecta "fin de semana" y "finde"', () => {
      expect(app.isWeekendPrompt('planifica las comidas del fin de semana')).toBe(true);
      expect(app.isWeekendPrompt('organiza mi finde con pescado')).toBe(true);
      expect(app.isWeekendPrompt('planifica mi semana completa')).toBe(false);
    });

    it('isWeeklyPlanPrompt devuelve false cuando se pide explícitamente el fin de semana', () => {
      expect(app.isWeeklyPlanPrompt('planifica las comidas del fin de semana')).toBe(false);
      expect(app.isWeeklyPlanPrompt('organiza el finde')).toBe(false);
      expect(app.isWeeklyPlanPrompt('organiza mi menú semanal')).toBe(true);
    });

    it('simulateGeminiAgentResponse para fin de semana genera ÚNICAMENTE sábado y domingo', () => {
      const res = app.simulateGeminiAgentResponse('planifica las comidas del fin de semana');
      expect(res.toolCalls).toHaveLength(1);
      const tc = res.toolCalls[0];
      expect(tc.name).toBe('set_weekly_plan');
      expect(tc.args.days).toHaveLength(2);
      const dayNames = tc.args.days.map(d => d.dayName);
      expect(dayNames).toContain('Sábado');
      expect(dayNames).toContain('Domingo');
      expect(dayNames).not.toContain('Lunes');
      expect(res.text).toContain('fin de semana');
    });
  });

  describe('Asistente de Voz (Web Speech Recognition & Synthesis)', () => {
    it('inicializa los elementos de interfaz del micrófono en la vista de IA y botón central', () => {
      const micBtn = document.getElementById('btn-mic-ai-chat');
      const centralBtn = document.getElementById('btn-central-gemini-invoke');
      const voiceBadge = document.getElementById('voice-listening-indicator');

      expect(micBtn).not.toBeNull();
      expect(centralBtn).not.toBeNull();
      expect(voiceBadge).not.toBeNull();
    });

    it('updateVoiceUI actualiza los botones y el badge de escucha', () => {
      const micBtn = document.getElementById('btn-mic-ai-chat');
      const voiceBadge = document.getElementById('voice-listening-indicator');

      app.updateVoiceUI(true);
      expect(micBtn.classList.contains('listening')).toBe(true);
      expect(voiceBadge.style.display).toBe('flex');

      app.updateVoiceUI(false);
      expect(micBtn.classList.contains('listening')).toBe(false);
      expect(voiceBadge.style.display).toBe('none');
    });

    it('speakAiResponse limpia markdown y llama a SpeechSynthesisUtterance si está disponible', () => {
      const speakMock = vi.fn();
      const cancelMock = vi.fn();
      window.speechSynthesis = {
        speak: speakMock,
        cancel: cancelMock
      };
      window.SpeechSynthesisUtterance = class {
        constructor(text) {
          this.text = text;
          this.lang = '';
          this.rate = 1;
        }
      };

      app.speakAiResponse('¡Listo, Franky! He añadido **2 plátanos** a tu lista.');
      expect(cancelMock).toHaveBeenCalled();
      expect(speakMock).toHaveBeenCalled();
    });

    it('v0.88: stopSpeech cancela SpeechSynthesis y actualiza indicadores visuales', () => {
      const cancelMock = vi.fn();
      window.speechSynthesis = { speak: vi.fn(), cancel: cancelMock };

      const headerBtn = document.getElementById('btn-header-stop-tts');
      const ttsBar = document.getElementById('gemini-invoke-tts-bar');

      app.updateTtsPlayingUI(true);
      expect(headerBtn.style.display).toBe('inline-flex');
      expect(ttsBar.style.display).toBe('flex');

      app.stopSpeech();
      expect(cancelMock).toHaveBeenCalled();
      expect(headerBtn.style.display).toBe('none');
      expect(ttsBar.style.display).toBe('none');
    });

    it('v0.88: speakAiResponse locuta de forma concisa y breve (1-2 frases) ante respuestas largas', () => {
      let spokenUtterance = null;
      window.speechSynthesis = {
        speak: vi.fn().mockImplementation((u) => { spokenUtterance = u; }),
        cancel: vi.fn()
      };
      window.SpeechSynthesisUtterance = class {
        constructor(text) {
          this.text = text;
        }
      };

      const longResponse = '¡Hola Franky! He añadido los tomates a tu lista de la compra. Además, he verificado que tienes 3 recetas compatibles en tu despensa. También he preparado un plan con pollo y ensalada para cenar hoy si te apetece.';
      app.speakAiResponse(longResponse);

      expect(spokenUtterance).not.toBeNull();
      // Máximo 2 frases en la locución
      const sentences = spokenUtterance.text.match(/[^.!?]+[.!?]+/g) || [];
      expect(sentences.length).toBeLessThanOrEqual(2);
      expect(spokenUtterance.text).not.toContain('pollo y ensalada');
    });

    it('v0.88: closeGeminiInvokeModal detiene la voz inmediatamente', () => {
      const cancelMock = vi.fn();
      window.speechSynthesis = { speak: vi.fn(), cancel: cancelMock };
      app.closeGeminiInvokeModal();
      expect(cancelMock).toHaveBeenCalled();
    });

    it('v0.88: si state.settings.ttsEnabled === false, speakAiResponse no emite voz', () => {
      const speakMock = vi.fn();
      window.speechSynthesis = { speak: speakMock, cancel: vi.fn() };
      window.state.settings.ttsEnabled = false;

      app.speakAiResponse('¡Hola Franky!');
      expect(speakMock).not.toHaveBeenCalled();

      window.state.settings.ttsEnabled = true;
    });
  });

  describe('PWA Manifest Shortcuts', () => {
    it('manifest.json contiene el atajo nativo para abrir dictando por voz', () => {
      const manifestPath = path.resolve(process.cwd(), 'manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

      expect(Array.isArray(manifest.shortcuts)).toBe(true);
      const voiceShortcut = manifest.shortcuts.find(s => s.url.includes('action=voice'));
      expect(voiceShortcut).toBeDefined();
      expect(voiceShortcut.name).toContain('Hablar al Asistente');
    });
  });

  describe('Botón Central Flotante e Invocador Directo del Asistente (✦)', () => {
    it('el botón central del Asistente existe en la barra de navegación con icono SVG y label', () => {
      const centralBtn = document.getElementById('btn-central-gemini-invoke');
      expect(centralBtn).not.toBeNull();
      const svg = centralBtn.querySelector('.gemini-sparkle-icon');
      expect(svg).not.toBeNull();
      const label = centralBtn.querySelector('.nav-gemini-label');
      expect(label.textContent).toBe('Asistente');
    });

    it('el modal de invocación rápida #modal-gemini-invoke contiene los controles necesarios', () => {
      const modal = document.getElementById('modal-gemini-invoke');
      expect(modal).not.toBeNull();
      expect(document.getElementById('gemini-invoke-input')).not.toBeNull();
      expect(document.getElementById('btn-gemini-invoke-mic')).not.toBeNull();
      expect(document.getElementById('btn-gemini-invoke-send')).not.toBeNull();
      expect(document.getElementById('gemini-invoke-result')).not.toBeNull();
    });

    it('openGeminiInvokeModal abre el modal y prepara el campo de entrada', () => {
      app.openGeminiInvokeModal(false);
      const modal = document.getElementById('modal-gemini-invoke');
      expect(modal.classList.contains('active')).toBe(true);
      app.closeGeminiInvokeModal();
      expect(modal.classList.contains('active')).toBe(false);
    });

    it('handleGeminiInvokeSubmit ejecuta acción de añadir a la lista de compra y muestra resultado completo', async () => {
      const input = document.getElementById('gemini-invoke-input');
      input.value = 'Apunta 1kg de arroz a la compra';
      const initialCount = state.shoppingList.length;

      await app.handleGeminiInvokeSubmit(false);

      expect(state.shoppingList.length).toBeGreaterThan(initialCount);
      const resultCard = document.getElementById('gemini-invoke-result');
      expect(resultCard.style.display).toBe('flex');
      expect(resultCard.textContent.toLowerCase()).toContain('arroz');
    });

    it('callGeminiAgent utiliza mode: AUTO para permitir razonamiento conversacional fluido', async () => {
      state.settings.geminiApiKey = 'AIzaSyTestAutoMode';
      const origFetch = globalThis.fetch;
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [{
            content: { parts: [{ text: 'Para una cena ligera te sugiero salmón a la plancha con verduras.' }] }
          }]
        })
      });
      globalThis.fetch = fetchSpy;
      try {
        const res = await app.callGeminiAgent('¿Qué me sugieres para cenar ligero?');
        expect(res.text).toContain('salmón');
        const [url, opts] = fetchSpy.mock.calls[0];
        const body = JSON.parse(opts.body);
        expect(body.toolConfig.functionCallingConfig.mode).toBe('AUTO');
      } finally {
        globalThis.fetch = origFetch;
      }
    });

    it('v0.89: flujo multi-turno de recomendación y guardado de receta nueva con botón de acción directa', async () => {
      state.settings.geminiApiKey = 'AIzaSyTestCreateRecipeFlow';
      const origFetch = globalThis.fetch;
      const initialRecipesCount = state.recipes.length;

      // Turno 1: el usuario pide recomendaciones y el asistente responde con recetas en texto
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{
                functionCall: {
                  name: 'create_and_save_recipe',
                  args: {
                    title: 'Pollo al Limón con Romero y Quinoa',
                    description: 'Receta recomendada saludable y muy sabrosa.',
                    prepTimeMinutes: 10,
                    cookTimeMinutes: 15,
                    servings: 2,
                    tags: ['Cena', 'Saludable', 'Alta en Proteínas'],
                    ingredients: [
                      { name: 'Pechuga de pollo', amount: 300, unit: 'g' },
                      { name: 'Quinoa cocida', amount: 150, unit: 'g' },
                      { name: 'Zumo de limón', amount: 30, unit: 'ml' }
                    ],
                    instructions: [
                      { step: 1, text: 'Saltea el pollo con el zumo de limón y romero.' },
                      { step: 2, text: 'Sirve caliente sobre la cama de quinoa.' }
                    ],
                    nutrition: { calories: 380, protein: 44, carbs: 28, fat: 10 }
                  }
                }
              }]
            }
          }]
        })
      });
      globalThis.fetch = fetchSpy;

      try {
        const input = document.getElementById('gemini-invoke-input');
        input.value = 'Guarda la receta recomendada en mi catálogo';
        await app.handleGeminiInvokeSubmit(false);

        expect(state.recipes.length).toBe(initialRecipesCount + 1);
        const created = state.recipes[0];
        expect(created.title).toBe('Pollo al Limón con Romero y Quinoa');

        const resultActions = document.getElementById('gemini-invoke-result-actions');
        expect(resultActions.innerHTML).toContain('Pollo al Limón con Romero');
        expect(app.aiChatHistory.length).toBeGreaterThan(0);
      } finally {
        globalThis.fetch = origFetch;
      }
    });
  });
});
