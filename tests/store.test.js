import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Evaluate app.js in happy-dom browser environment
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const { StateStore, SEED_RECIPES, STANDARD_SLOTS } = window;

describe('StateStore & Data Model Normalization', () => {
  beforeEach(() => {
    localStorage.clear();
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
    localStorage.setItem('fa_mealplan', JSON.stringify(legacyPlan));

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

  it('BUG-10: las recetas de ejemplo no reaparecen tras ser borradas y resetDemoData clona por valor', () => {
    const store = new StateStore();
    const initialSeedId = store.recipes[0].id;
    const originalTitle = store.recipes[0].title;

    // Borrado de receta semilla
    store.recipes = store.recipes.filter(r => r.id !== initialSeedId);
    store.save('fa_recipes', store.recipes);
    store.trackDeletion('recipes', initialSeedId);

    // Reinstanciar StateStore (simula recarga de página)
    const reloadedStore = new StateStore();
    expect(reloadedStore.recipes.some(r => r.id === initialSeedId)).toBe(false);

    // resetDemoData clona sin compartir referencia mutante con SEED_RECIPES
    const app = new window.FoodAssistantApp();
    const origConfirm = window.confirm;
    const origAlert = window.alert;
    window.confirm = () => true;
    window.alert = () => {};

    app.resetDemoData();
    window.confirm = origConfirm;
    window.alert = origAlert;

    expect(window.state.recipes.some(r => r.id === initialSeedId)).toBe(true);

    // Modificar una receta en state no altera la constante SEED_RECIPES
    const clonedRecipe = window.state.recipes.find(r => r.id === initialSeedId);
    clonedRecipe.title = 'Título Modificado';

    const originalSeed = SEED_RECIPES.find(r => r.id === initialSeedId);
    expect(originalSeed.title).toBe(originalTitle);
    expect(originalSeed.title).not.toBe('Título Modificado');
  });
});
