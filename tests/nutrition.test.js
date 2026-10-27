import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Setup happy-dom environment
const htmlPath = path.resolve(process.cwd(), 'index.html');
const htmlCode = fs.readFileSync(htmlPath, 'utf-8');
document.documentElement.innerHTML = htmlCode;

const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const {
  StateStore,
  FoodAssistantApp,
  RecipeParser,
  getRecipeNutrition,
  estimateRecipeNutrition,
  analyzeAndInferRecipeTags,
  toLocalDateKey,
  state,
  SEED_RECIPES
} = window;

describe('US-01: Contador de Calorías y Macronutrientes por plato y resumen diario', () => {
  let app;

  beforeEach(() => {
    localStorage.clear();
    state.recipes = typeof structuredClone === 'function' ? structuredClone(SEED_RECIPES) : JSON.parse(JSON.stringify(SEED_RECIPES));
    state.mealPlan = state.generateInitialMealPlan();

    app = new FoodAssistantApp();
    window.app = app;
  });

  describe('Estimación y normalización de nutrición', () => {
    it('getRecipeNutrition devuelve los valores directos si la receta ya tiene nutrition', () => {
      const recipe = {
        title: 'Pollo con Arroz',
        servings: 1,
        nutrition: { calories: 520, protein: 42, carbs: 55, fat: 12 }
      };
      const nut = getRecipeNutrition(recipe);
      expect(nut.calories).toBe(520);
      expect(nut.protein).toBe(42);
      expect(nut.carbs).toBe(55);
      expect(nut.fat).toBe(12);
    });

    it('estimateRecipeNutrition calcula valores aproximados si no hay nutrition explícita', () => {
      const recipe = {
        title: 'Tortilla de Atún',
        servings: 2,
        ingredients: [
          { name: 'Huevos', amount: 4, unit: 'unidades' },
          { name: 'Atún en lata', amount: 150, unit: 'g' },
          { name: 'Aceite de oliva', amount: 15, unit: 'ml' }
        ]
      };
      const estimated = estimateRecipeNutrition(recipe);
      expect(estimated.calories).toBeGreaterThan(200);
      expect(estimated.protein).toBeGreaterThan(15);
      expect(estimated.fat).toBeGreaterThan(5);
    });

    it('RecipeParser.parseNutrition extrae valores numéricos de cadenas con unidades', () => {
      const rawNutrition = {
        calories: '450 kcal',
        proteinContent: '35 grams',
        carbohydrateContent: '40 g',
        fatContent: '12g'
      };
      const parsed = RecipeParser.parseNutrition(rawNutrition);
      expect(parsed).toEqual({
        calories: 450,
        protein: 35,
        carbs: 40,
        fat: 12
      });
    });

    it('analyzeAndInferRecipeTags asigna "Alta en Proteínas" si protein >= 25', () => {
      const highProteinRecipe = {
        title: 'Pechuga a la plancha',
        servings: 1,
        nutrition: { calories: 350, protein: 32, carbs: 5, fat: 8 },
        ingredients: [{ name: 'Pechuga de pollo', amount: 200, unit: 'g' }]
      };
      const tags = analyzeAndInferRecipeTags(highProteinRecipe);
      expect(tags).toContain('Alta en Proteínas');

      const lowProteinRecipe = {
        title: 'Ensalada Verde Simple',
        servings: 1,
        nutrition: { calories: 120, protein: 2, carbs: 10, fat: 4 },
        ingredients: [{ name: 'Lechuga', amount: 100, unit: 'g' }]
      };
      const tagsLow = analyzeAndInferRecipeTags(lowProteinRecipe);
      expect(tagsLow).not.toContain('Alta en Proteínas');
    });
  });

  describe('Modal de Detalle de Receta y escalado interactivo', () => {
    it('muestra el desglose nutricional en modal-recipe-detail y se escala al cambiar raciones', () => {
      const sampleRecipe = {
        id: 'rec-test-macros',
        title: 'Salmón con Quinoa',
        servings: 2,
        nutrition: { calories: 400, protein: 30, carbs: 35, fat: 14 },
        ingredients: [{ name: 'Salmón', amount: 300, unit: 'g' }],
        instructions: [{ step: 1, text: 'Cocinar al horno' }]
      };
      state.recipes.push(sampleRecipe);

      app.openRecipeDetail('rec-test-macros');

      const breakdown = document.getElementById('recipe-nutrition-breakdown');
      expect(breakdown).not.toBeNull();
      // Con 2 raciones activas (el default de la receta):
      // Las calorías por ración son 400, para 2 raciones el total es 800 kcal
      expect(breakdown.textContent).toContain('800');
      expect(breakdown.textContent).toContain('60'); // 30g * 2

      // Incrementamos las raciones a 3
      app.adjustServings(1);
      expect(app.activeServings).toBe(3);
      const updatedBreakdown = document.getElementById('recipe-nutrition-breakdown');
      expect(updatedBreakdown.textContent).toContain('1200'); // 400 * 3
      expect(updatedBreakdown.textContent).toContain('90'); // 30 * 3
    });
  });

  describe('Resumen de Nutrición Diario en Vista Hoy', () => {
    it('calculateTodayNutrition agrega calorías y macronutrientes de los platos asignados hoy', () => {
      const recipeA = {
        id: 'rec-a',
        title: 'Desayuno Proteico',
        servings: 1,
        nutrition: { calories: 350, protein: 25, carbs: 30, fat: 10 }
      };
      const recipeB = {
        id: 'rec-b',
        title: 'Almuerzo Equilibrado',
        servings: 1,
        nutrition: { calories: 600, protein: 40, carbs: 65, fat: 18 }
      };
      state.recipes.push(recipeA, recipeB);

      const fakeTodayPlan = {
        breakfast: { recipeId: 'rec-a' },
        lunch: { recipeId: 'rec-b' },
        snack: null,
        dinner: null
      };

      const dailyTotals = app.calculateTodayNutrition(fakeTodayPlan);
      expect(dailyTotals.calories).toBe(950);
      expect(dailyTotals.protein).toBe(65);
      expect(dailyTotals.carbs).toBe(95);
      expect(dailyTotals.fat).toBe(28);
    });

    it('renderTodayView renderiza la tarjeta de nutrición de hoy con chips y ratio bar', () => {
      const recipe = {
        id: 'rec-lunch-macro',
        title: 'Plato Combinado',
        servings: 1,
        nutrition: { calories: 500, protein: 35, carbs: 50, fat: 15 }
      };
      state.recipes.push(recipe);

      const todayKey = toLocalDateKey();
      state.mealPlan[todayKey] = {
        lunch: { recipeId: 'rec-lunch-macro' }
      };

      app.renderTodayView();

      const card = document.getElementById('today-nutrition-card');
      expect(card).not.toBeNull();
      expect(card.textContent).toContain('500');
      expect(card.textContent).toContain('35g');
      expect(card.textContent).toContain('50g');
      expect(card.textContent).toContain('15g');
      expect(card.querySelector('.macro-ratio-bar')).not.toBeNull();
    });
  });

  describe('Editor de Recetas con Campos Nutricionales', () => {
    it('limpia los campos nutricionales al abrir openCreateRecipeModal', () => {
      document.getElementById('edit-recipe-calories').value = '999';
      document.getElementById('edit-recipe-protein').value = '99';
      document.getElementById('edit-recipe-carbs').value = '99';
      document.getElementById('edit-recipe-fat').value = '99';

      app.openCreateRecipeModal();

      expect(document.getElementById('edit-recipe-calories').value).toBe('');
      expect(document.getElementById('edit-recipe-protein').value).toBe('');
      expect(document.getElementById('edit-recipe-carbs').value).toBe('');
      expect(document.getElementById('edit-recipe-fat').value).toBe('');
    });

    it('rellena los campos nutricionales en openEditRecipeModal y guarda los valores en saveRecipeEdit', () => {
      const recipeToEdit = {
        id: 'rec-edit-nutrition',
        title: 'Crema de Calabaza Fit',
        servings: 2,
        nutrition: { calories: 280, protein: 12, carbs: 34, fat: 8 },
        ingredients: [{ name: 'Calabaza', amount: 500, unit: 'g' }],
        instructions: [{ step: 1, text: 'Hervir y triturar' }]
      };
      state.recipes.push(recipeToEdit);

      app.openEditRecipeModal('rec-edit-nutrition');

      expect(document.getElementById('edit-recipe-calories').value).toBe('280');
      expect(document.getElementById('edit-recipe-protein').value).toBe('12');
      expect(document.getElementById('edit-recipe-carbs').value).toBe('34');
      expect(document.getElementById('edit-recipe-fat').value).toBe('8');

      // Modificamos y guardamos
      document.getElementById('edit-recipe-calories').value = '310';
      document.getElementById('edit-recipe-protein').value = '15';
      app.saveRecipeEdit();

      const updated = state.recipes.find(r => r.id === 'rec-edit-nutrition');
      expect(updated.nutrition.calories).toBe(310);
      expect(updated.nutrition.protein).toBe(15);
      expect(updated.nutrition.carbs).toBe(34);
      expect(updated.nutrition.fat).toBe(8);
    });
  });
});
