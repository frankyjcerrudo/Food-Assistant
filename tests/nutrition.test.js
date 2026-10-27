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

    it('analyzeAndInferRecipeTags asigna "Alta en Proteínas" con umbral flexible (>= 20g o >= 25% de kcal proteicas, ej. batido)', () => {
      const highProteinRecipe = {
        title: 'Pechuga a la plancha',
        servings: 1,
        nutrition: { calories: 350, protein: 32, carbs: 5, fat: 8 },
        ingredients: [{ name: 'Pechuga de pollo', amount: 200, unit: 'g' }]
      };
      const tags = analyzeAndInferRecipeTags(highProteinRecipe);
      expect(tags).toContain('Alta en Proteínas');

      // Caso real de Franky: batido de 21g de proteína en 30g de polvos (~115 kcal)
      const proteinShakeRecipe = {
        title: 'Batido Proteico Recuperador',
        description: 'Batido post-entreno con proteína en polvo sabor vainilla y agua',
        servings: 1,
        nutrition: { calories: 115, protein: 21, carbs: 2, fat: 1.5 },
        ingredients: [{ name: 'Proteína whey', amount: 30, unit: 'g' }, { name: 'Agua', amount: 250, unit: 'ml' }]
      };
      const shakeTags = analyzeAndInferRecipeTags(proteinShakeRecipe);
      expect(shakeTags).toContain('Alta en Proteínas');

      const lowProteinRecipe = {
        title: 'Ensalada Verde Simple',
        servings: 1,
        nutrition: { calories: 120, protein: 2, carbs: 10, fat: 4 },
        ingredients: [{ name: 'Lechuga', amount: 100, unit: 'g' }]
      };
      const tagsLow = analyzeAndInferRecipeTags(lowProteinRecipe);
      expect(tagsLow).not.toContain('Alta en Proteínas');

      // Comidas estándar con un poco de huevo o legumbres: NO deben marcarse como Alta en Proteínas
      const hummusToast = {
        title: 'Tostas de Hummus',
        servings: 1,
        nutrition: { calories: 290, protein: 11, carbs: 36, fat: 10 },
        ingredients: [{ name: 'Garbanzos en hummus', amount: 60, unit: 'g' }]
      };
      expect(analyzeAndInferRecipeTags(hummusToast)).not.toContain('Alta en Proteínas');

      const eggToast = {
        title: 'Tostadas de Aguacate y Huevo Poché',
        servings: 1,
        nutrition: { calories: 340, protein: 15, carbs: 26, fat: 19 },
        ingredients: [{ name: 'Huevo', amount: 1, unit: 'ud' }, { name: 'Aguacate' }]
      };
      expect(analyzeAndInferRecipeTags(eggToast)).not.toContain('Alta en Proteínas');
    });
  });

  describe('Modal de Detalle de Receta y desglose nutricional individual', () => {
    it('muestra el desglose nutricional en modal-recipe-detail por ración individual de forma independiente a los comensales ajustados', () => {
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
      // Muestra valores por ración individual:
      expect(breakdown.textContent).toContain('400');
      expect(breakdown.textContent).toContain('30');
      expect(breakdown.textContent).toContain('35');
      expect(breakdown.textContent).toContain('14');

      const subtitle = document.getElementById('recipe-nutrition-subtitle');
      expect(subtitle.textContent).toContain('Por ración individual');

      // Incrementamos las raciones a 3 para cocinar o comprar
      app.adjustServings(1);
      expect(app.activeServings).toBe(3);
      const updatedBreakdown = document.getElementById('recipe-nutrition-breakdown');
      // Los macros por ración individual se mantienen fijos para el consumidor:
      expect(updatedBreakdown.textContent).toContain('400');
      expect(updatedBreakdown.textContent).toContain('30');
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

  describe('Catálogo de Recetas con Tabla de Macros (US-01)', () => {
    it('renderRecipesGrid incluye la tabla de valores nutricionales por ración en cada tarjeta', () => {
      state.recipes = [
        {
          id: 'rec-card-macro-test',
          title: 'Bowl Proteico de Atún',
          description: 'Rápido y saludable',
          imageUrl: 'https://example.com/bowl.jpg',
          prepTimeMinutes: 10,
          cookTimeMinutes: 0,
          servings: 1,
          nutrition: { calories: 380, protein: 35, carbs: 20, fat: 12 },
          tags: ['Alta en Proteínas', 'Rápida']
        }
      ];

      app.renderRecipesGrid(state.recipes);

      const grid = document.getElementById('recipes-cards-grid');
      expect(grid).not.toBeNull();
      const card = grid.querySelector('.recipe-card');
      expect(card).not.toBeNull();

      const macrosTable = card.querySelector('.recipe-card-macros');
      expect(macrosTable).not.toBeNull();
      expect(macrosTable.textContent).toContain('380');
      expect(macrosTable.textContent).toContain('35');
      expect(macrosTable.textContent).toContain('20');
      expect(macrosTable.textContent).toContain('12');
      expect(macrosTable.querySelector('.card-macro-cal')).not.toBeNull();
      expect(macrosTable.querySelector('.card-macro-prot')).not.toBeNull();
      expect(macrosTable.querySelector('.card-macro-carbs')).not.toBeNull();
      expect(macrosTable.querySelector('.card-macro-fat')).not.toBeNull();
    });
  });
});
