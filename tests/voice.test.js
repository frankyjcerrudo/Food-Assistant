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
    it('inicializa los elementos de interfaz del micrófono en la vista de IA y cabecera', () => {
      const micBtn = document.getElementById('btn-mic-ai-chat');
      const headerVoiceBtn = document.getElementById('btn-header-voice');
      const voiceBadge = document.getElementById('voice-listening-indicator');

      expect(micBtn).not.toBeNull();
      expect(headerVoiceBtn).not.toBeNull();
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

  describe('Botón Central Flotante e Invocador Directo Gemini (✦)', () => {
    it('el botón central de Gemini existe en la barra de navegación con icono SVG y label', () => {
      const centralBtn = document.getElementById('btn-central-gemini-invoke');
      expect(centralBtn).not.toBeNull();
      const svg = centralBtn.querySelector('.gemini-sparkle-icon');
      expect(svg).not.toBeNull();
      const label = centralBtn.querySelector('.nav-gemini-label');
      expect(label.textContent).toBe('Gemini');
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

    it('handleGeminiInvokeSubmit ejecuta acción de añadir a la lista de compra y muestra resultado', async () => {
      const input = document.getElementById('gemini-invoke-input');
      input.value = 'Apunta 1kg de arroz a la compra';
      const initialCount = state.shoppingList.length;

      await app.handleGeminiInvokeSubmit(false);

      expect(state.shoppingList.length).toBeGreaterThan(initialCount);
      const resultCard = document.getElementById('gemini-invoke-result');
      expect(resultCard.style.display).toBe('flex');
      expect(resultCard.textContent.toLowerCase()).toContain('arroz');
    });
  });
});
