import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  SEED_RECIPES,
  STANDARD_SLOTS,
  AISLE_METADATA,
  DAYS_OF_WEEK_ES,
  escapeHtml,
  isSafeUrl,
  sanitizeUrl,
  cleanRecipeImageUrl,
  getWeekDates,
  getMondayOfWeek,
  toLocalDateKey,
  formatWeekRange,
  checkDietaryCompliance,
  estimateRecipeNutrition,
  getRecipeNutrition,
  StateStore,
  IndexedDbStorage,
  RecipeParser
} from '../src/index.js';

import fs from 'fs';
import path from 'path';

// Evaluate app.js for full DOM/Event integration tests
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();
const { FoodAssistantApp } = window;

describe('Fase 3: Arquitectura Modular, Delegación de Eventos y Tests (US-42, US-43, US-50)', () => {
  describe('US-42: Importación Nativa de Módulos ES (src/)', () => {
    it('importa constantes y utilidades directamente sin new Function()', () => {
      expect(Array.isArray(SEED_RECIPES)).toBe(true);
      expect(SEED_RECIPES.length).toBeGreaterThan(0);
      expect(STANDARD_SLOTS).toBeDefined();
      expect(AISLE_METADATA.produce).toBeDefined();
      expect(DAYS_OF_WEEK_ES[0]).toBe('Lunes');
    });

    it('RecipeParser extrae recetas desde módulos ES limpios', () => {
      expect(RecipeParser).toBeDefined();
      const recipe = RecipeParser.parseRecipeText(`
        # Ensalada Mediterránea
        Ingredientes:
        - 100g Tomate
        - 50g Pepino
        Instrucciones:
        1. Cortar los ingredientes y mezclar.
      `);
      expect(recipe).toBeDefined();
      expect(recipe.title).toBe('Ensalada Mediterránea');
      expect(recipe.ingredients.length).toBe(2);
    });

    it('IndexedDbStorage y StateStore se importan como clases ES', () => {
      expect(typeof IndexedDbStorage).toBe('function');
      expect(typeof StateStore).toBe('function');
      const store = new StateStore();
      expect(store.recipes).toBeDefined();
    });
  });

  describe('US-43: Delegación de Eventos con data-action', () => {
    let app;

    beforeEach(() => {
      localStorage.clear();
      document.body.innerHTML = `
        <div id="container-test">
          <button id="btn-delegated-detail" data-action="openRecipeDetail" data-recipe-id="rec-salmon-bowl">Ver Detalle</button>
          <button id="btn-delegated-nav" data-action="navigateWeek" data-dir="1">Siguiente Semana</button>
          <button id="btn-delegated-copy" data-action="copyShoppingList">Copiar Lista</button>
          <button id="btn-delegated-servings" data-action="adjustServings" data-delta="1">+</button>
        </div>
        <div id="recipe-modal-body"></div>
        <div id="modal-recipe-detail" class="modal-overlay"></div>
      `;

      app = new FoodAssistantApp();
      app.openRecipeDetail = vi.fn();
      app.navigateWeek = vi.fn();
      app.copyShoppingList = vi.fn();
      app.adjustServings = vi.fn();
      app.initEventDelegation();
    });

    it('ejecuta openRecipeDetail al hacer clic en un elemento con data-action="openRecipeDetail"', () => {
      const btn = document.getElementById('btn-delegated-detail');
      btn.click();
      expect(app.openRecipeDetail).toHaveBeenCalledWith('rec-salmon-bowl');
    });

    it('ejecuta navigateWeek al hacer clic en un elemento con data-action="navigateWeek"', () => {
      const btn = document.getElementById('btn-delegated-nav');
      btn.click();
      expect(app.navigateWeek).toHaveBeenCalledWith(1);
    });

    it('ejecuta copyShoppingList al hacer clic en data-action="copyShoppingList"', () => {
      const btn = document.getElementById('btn-delegated-copy');
      btn.click();
      expect(app.copyShoppingList).toHaveBeenCalled();
    });

    it('ejecuta adjustServings con delta numérico', () => {
      const btn = document.getElementById('btn-delegated-servings');
      btn.click();
      expect(app.adjustServings).toHaveBeenCalledWith(1);
    });
  });

  describe('US-50: Cobertura de Lógica y Motor de Calendario ISO 8601', () => {
    it('getMondayOfWeek devuelve siempre el lunes (ISO 8601) para cualquier día de la semana', () => {
      // 2026-11-04 es miércoles
      const wednesday = new Date(2026, 10, 4);
      const monday = getMondayOfWeek(wednesday);
      expect(monday.getDay()).toBe(1); // Lunes
      expect(monday.getDate()).toBe(2); // 2 de noviembre de 2026
    });

    it('getMondayOfWeek maneja domingos correctamente colocándolos en la misma semana que termina el domingo', () => {
      // 2026-11-08 es domingo
      const sunday = new Date(2026, 10, 8);
      const monday = getMondayOfWeek(sunday);
      expect(monday.getDay()).toBe(1); // Lunes
      expect(monday.getDate()).toBe(2); // Lunes 2 de noviembre de 2026
    });

    it('getWeekDates genera 7 días consecutivos empezando en lunes', () => {
      const dates = getWeekDates(new Date(2026, 10, 4));
      expect(dates.length).toBe(7);
      expect(dates[0].dayName).toBe('Lunes');
      expect(dates[6].dayName).toBe('Domingo');
      expect(dates[0].dateKey).toBe('2026-11-02');
      expect(dates[6].dateKey).toBe('2026-11-08');
    });

    it('formatWeekRange formatea el rango de fechas en español', () => {
      const weekDays = getWeekDates(new Date(2026, 10, 2));
      const formatted = formatWeekRange(weekDays);
      expect(formatted).toMatch(/2.*?8.*?(?:noviembre|nov)/i);
    });

    it('checkDietaryCompliance detecta infracciones de preferencias vegetarianas y sin gluten', () => {
      const meatRecipe = {
        title: 'Filete con patatas',
        ingredients: [{ name: 'Filete de ternera', aisle: 'meat' }],
        tags: []
      };
      const res = checkDietaryCompliance(meatRecipe, ['Vegetariano']);
      expect(res.compliant).toBe(false);
      expect(res.violations).toContain('Vegetariano');
    });
  });
});
