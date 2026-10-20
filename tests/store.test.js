import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Evaluate app.js in test environment
const appCode = fs.readFileSync(path.resolve(__dirname, '../app.js'), 'utf-8');
const context = {};
const fn = new Function('window', 'localStorage', 'document', appCode + '; return { StateStore, SEED_RECIPES, STANDARD_SLOTS };');

describe('StateStore & Data Model Normalization', () => {
  let mockStorage = {};
  let localStorageMock;
  let StateStore, SEED_RECIPES, STANDARD_SLOTS;

  beforeEach(() => {
    mockStorage = {};
    localStorageMock = {
      getItem: (k) => mockStorage[k] || null,
      setItem: (k, v) => { mockStorage[k] = String(v); },
      removeItem: (k) => { delete mockStorage[k]; },
      clear: () => { mockStorage = {}; }
    };

    const docMock = {
      addEventListener: () => {},
      documentElement: { setAttribute: () => {} }
    };

    const res = fn({}, localStorageMock, docMock);
    StateStore = res.StateStore;
    SEED_RECIPES = res.SEED_RECIPES;
    STANDARD_SLOTS = res.STANDARD_SLOTS;
  });

  it('debe definir exactamente los 4 momentos de comida estándar', () => {
    expect(STANDARD_SLOTS).toHaveLength(4);
    const keys = STANDARD_SLOTS.map(s => s.key);
    expect(keys).toEqual(['breakfast', 'lunch', 'snack', 'dinner']);
  });

  it('debe inicializar el plan semanal con los 4 slots y customSlots vacío', () => {
    const store = new StateStore();
    const plan = store.mealPlan;
    const dates = Object.keys(plan);

    expect(dates).toHaveLength(7);
    dates.forEach(d => {
      const day = plan[d];
      expect(day).toHaveProperty('breakfast');
      expect(day).toHaveProperty('lunch');
      expect(day).toHaveProperty('snack');
      expect(day).toHaveProperty('dinner');
      expect(Array.isArray(day.customSlots)).toBe(true);
    });
  });

  it('debe normalizar planes antiguos que solo tenían lunch y dinner sin romper', () => {
    // Simula datos antiguos en localStorage
    const legacyPlan = {
      "2026-10-20": {
        dayName: "Martes",
        lunch: "rec-pesto-pasta",
        dinner: "rec-lemon-chicken"
      }
    };
    mockStorage['fa_mealplan'] = JSON.stringify(legacyPlan);

    const store = new StateStore();
    const day = store.mealPlan["2026-10-20"];

    expect(day.lunch).toBe("rec-pesto-pasta");
    expect(day.dinner).toBe("rec-lemon-chicken");
    expect(day.breakfast).toBeNull();
    expect(day.snack).toBeNull();
    expect(day.customSlots).toEqual([]);
  });

  it('debe incluir recetas de desayuno y merienda en SEED_RECIPES', () => {
    const store = new StateStore();
    const breakfast = store.recipes.filter(r => r.tags.includes('Desayuno'));
    const snack = store.recipes.filter(r => r.tags.includes('Merienda'));

    expect(breakfast.length).toBeGreaterThanOrEqual(2);
    expect(snack.length).toBeGreaterThanOrEqual(1);
  });
});
