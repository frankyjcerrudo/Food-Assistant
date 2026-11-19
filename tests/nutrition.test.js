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

    it('estimateRecipeNutrition calcula con precisión pescados magros (dorada al horno con un pelín de aceite y sal) con alta proteína y 0 hidratos', () => {
      const doradaRecipe = {
        title: 'Dorada al horno',
        servings: 1,
        ingredients: [
          { name: 'Dorada', amount: 1, unit: 'ud' },
          { name: 'Aceite de oliva', amount: 1, unit: 'pelín' },
          { name: 'Sal', amount: 1, unit: 'pizca' },
          { name: 'Pimienta negra', amount: 1, unit: 'pizca' }
        ]
      };
      const nut = estimateRecipeNutrition(doradaRecipe);
      // 1 dorada entera limpia (~250g) aporta ~50g de proteína y ~0g de carbohidratos
      expect(nut.protein).toBeGreaterThanOrEqual(40);
      expect(nut.carbs).toBe(0);
      expect(nut.fat).toBeLessThanOrEqual(15);
      expect(nut.calories).toBeGreaterThan(250);
      expect(nut.calories).toBeLessThan(350);
    });

    it('estimateRecipeNutrition reconoce plurales (ej. Doradas, Lubinas) y calcula los macros con precisión', () => {
      const doradasRecipe = {
        title: 'Doradas al horno para dos',
        servings: 2,
        ingredients: [
          { name: 'Doradas', amount: 2, unit: 'ud' },
          { name: 'Aceite de oliva virgen extra', amount: 1, unit: 'chorrito' },
          { name: 'Sal', amount: 1, unit: 'pizca' },
          { name: 'Pimienta', amount: 1, unit: 'pizca' }
        ]
      };
      const nut = estimateRecipeNutrition(doradasRecipe);
      // 2 doradas (~500g) entre 2 raciones = ~250g de dorada limpia por ración -> ~50g proteína, 0g carbohidratos
      expect(nut.protein).toBeGreaterThanOrEqual(40);
      expect(nut.carbs).toBe(0);
      expect(nut.fat).toBeLessThanOrEqual(15);
      expect(nut.calories).toBeGreaterThan(250);
      expect(nut.calories).toBeLessThan(350);
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

      // Caso Franky v0.59: Gnocchis (23g de proteína, 658 kcal) DEBEN ser Alta en Proteínas
      const gnocchisRecipe = {
        title: 'Gnocchis gratinados con chorizo con queso fundido',
        servings: 1,
        nutrition: { calories: 658, protein: 23, carbs: 49, fat: 39 },
        ingredients: [{ name: 'Gnocchis' }, { name: 'Chorizo', aisle: 'meat' }, { name: 'Queso', aisle: 'dairy' }]
      };
      const gnocchiTags = analyzeAndInferRecipeTags(gnocchisRecipe);
      expect(gnocchiTags).toContain('Alta en Proteínas');

      // Caso Franky v0.59: Carrot Cake (31g de proteína pero 1236 kcal, 91g grasa, postre dulce) NO debe ser Alta en Proteínas
      const carrotCakeRecipe = {
        title: 'Carrot Cake',
        description: 'Tarta clásica de zanahoria con cobertura de queso crema y nueces',
        servings: 1,
        nutrition: { calories: 1236, protein: 31, carbs: 74, fat: 91 },
        ingredients: [{ name: 'Zanahorias' }, { name: 'Harina' }, { name: 'Nueces' }, { name: 'Queso crema' }]
      };
      const cakeTags = analyzeAndInferRecipeTags(carrotCakeRecipe);
      expect(cakeTags).not.toContain('Alta en Proteínas');
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

    it('renderTodayView pliega el resumen en Modo Zen sin cifras si el seguimiento está desactivado y muestra chips/ratio bar al activarlo (v0.63)', () => {
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

      // 1. Con seguimiento desactivado (por defecto): barra plegada sin cifras ni calorías
      state.saveNutritionGoals({ enabled: false, calories: 2000, protein: 140, carbs: 200, fat: 65 });
      app.renderTodayView();

      const card = document.getElementById('today-nutrition-card');
      expect(card).not.toBeNull();
      expect(card.classList.contains('is-collapsed-zen')).toBe(true);
      expect(card.textContent).toContain('Seguimiento nutricional desactivado');
      expect(card.textContent).toContain('Configurar / Activar');
      expect(card.textContent).not.toContain('500');
      expect(card.querySelector('.macro-ratio-bar')).toBeNull();

      // 2. Con seguimiento activado: despliega resumen completo con cifras y barra de proporción
      state.saveNutritionGoals({ enabled: true, calories: 2000, protein: 140, carbs: 200, fat: 65 });
      app.renderTodayView();

      expect(card.classList.contains('is-collapsed-zen')).toBe(false);
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

  describe('Catálogo de Recetas con Tabla de Macros condicional y Aviso de Estimación (US-01 / v0.62)', () => {
    it('renderRecipesGrid muestra la tabla de valores nutricionales en la tarjeta solo si está activado el seguimiento de objetivos nutricionales', () => {
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

      // 1. Con seguimiento desactivado: NO debe mostrarse la tabla en la tarjeta de la pestaña Recetas
      state.saveNutritionGoals({ enabled: false, calories: 2000, protein: 140, carbs: 200, fat: 65 });
      app.renderRecipesGrid(state.recipes);

      const grid = document.getElementById('recipes-cards-grid');
      expect(grid).not.toBeNull();
      let card = grid.querySelector('.recipe-card');
      expect(card).not.toBeNull();
      expect(card.querySelector('.recipe-card-macros')).toBeNull();

      // 2. Con seguimiento activado: SÍ debe mostrarse la tabla en la tarjeta
      state.saveNutritionGoals({ enabled: true, calories: 2000, protein: 140, carbs: 200, fat: 65 });
      app.renderRecipesGrid(state.recipes);

      card = grid.querySelector('.recipe-card');
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

    it('v0.62: muestra el aviso informativo de estimación nutricional en detalle de receta, Hoy, Ajustes y modal de objetivos', () => {
      // 1. En Ajustes y Modal de Objetivos (HTML estático)
      const settingsDisclaimer = document.getElementById('settings-nutrition-disclaimer');
      const modalDisclaimer = document.getElementById('modal-nutrition-disclaimer');
      expect(settingsDisclaimer).not.toBeNull();
      expect(settingsDisclaimer.textContent).toContain('estimación orientativa');
      expect(modalDisclaimer).not.toBeNull();
      expect(modalDisclaimer.textContent).toContain('estimación orientativa');

      // 2. En Detalle de Receta
      app.openRecipeDetail(state.recipes[0].id);
      const detailDisclaimer = document.getElementById('recipe-detail-nutrition-disclaimer');
      expect(detailDisclaimer).not.toBeNull();
      expect(detailDisclaimer.textContent).toContain('estimación orientativa');

      // 3. En pestaña Hoy (con seguimiento activo y comida planificada)
      state.saveNutritionGoals({ enabled: true, calories: 2000, protein: 140, carbs: 200, fat: 65 });
      const todayKey = toLocalDateKey();
      state.mealPlan[todayKey] = {
        breakfast: state.recipes[0].id,
        lunch: null,
        snack: null,
        dinner: null,
        customSlots: []
      };
      app.renderTodayView();
      const todayDisclaimer = document.getElementById('today-nutrition-disclaimer');
      expect(todayDisclaimer).not.toBeNull();
      expect(todayDisclaimer.textContent).toContain('estimación aproximada');
    });
  });

  describe('US-03: Objetivos nutricionales diarios del usuario', () => {
    it('StateStore guarda y carga objetivos nutricionales con valores por defecto', () => {
      const defaultGoals = state.settings.nutritionGoals;
      expect(defaultGoals).toBeDefined();
      expect(defaultGoals.calories).toBe(2000);
      expect(defaultGoals.protein).toBe(140);

      state.saveNutritionGoals({
        enabled: true,
        calories: 2200,
        protein: 160,
        carbs: 220,
        fat: 70
      });

      expect(state.settings.nutritionGoals.enabled).toBe(true);
      expect(state.settings.nutritionGoals.calories).toBe(2200);
      expect(state.settings.nutritionGoals.protein).toBe(160);
      expect(state.settings.nutritionGoals.carbs).toBe(220);
      expect(state.settings.nutritionGoals.fat).toBe(70);

      const savedSettings = JSON.parse(localStorage.getItem('fa_settings'));
      expect(savedSettings.nutritionGoals.protein).toBe(160);
    });

    it('renderNutritionGoalsSettings rellena el formulario de Ajustes y saveNutritionGoalsFromSettings persiste los cambios', () => {
      state.saveNutritionGoals({
        enabled: true,
        calories: 2500,
        protein: 175,
        carbs: 240,
        fat: 80
      });

      app.renderNutritionGoalsSettings();

      expect(document.getElementById('toggle-nutrition-goals-enabled').checked).toBe(true);
      expect(document.getElementById('input-goal-calories').value).toBe('2500');
      expect(document.getElementById('input-goal-protein').value).toBe('175');
      expect(document.getElementById('input-goal-carbs').value).toBe('240');
      expect(document.getElementById('input-goal-fat').value).toBe('80');

      document.getElementById('input-goal-calories').value = '2300';
      document.getElementById('input-goal-protein').value = '150';
      app.saveNutritionGoalsFromSettings();

      expect(state.settings.nutritionGoals.calories).toBe(2300);
      expect(state.settings.nutritionGoals.protein).toBe(150);
    });

    it('openNutritionGoalsModal abre el modal rápido y saveNutritionGoalsFromModal actualiza el estado', () => {
      state.saveNutritionGoals({
        enabled: false,
        calories: 1900,
        protein: 130,
        carbs: 180,
        fat: 60
      });

      app.openNutritionGoalsModal();
      const modal = document.getElementById('modal-nutrition-goals');
      expect(modal.classList.contains('active')).toBe(true);
      expect(document.getElementById('input-modal-goal-calories').value).toBe('1900');

      document.getElementById('toggle-modal-goal-enabled').checked = true;
      document.getElementById('input-modal-goal-calories').value = '2100';
      document.getElementById('input-modal-goal-protein').value = '155';
      app.saveNutritionGoalsFromModal();

      expect(modal.classList.contains('active')).toBe(false);
      expect(state.settings.nutritionGoals.enabled).toBe(true);
      expect(state.settings.nutritionGoals.calories).toBe(2100);
      expect(state.settings.nutritionGoals.protein).toBe(155);
    });

    it('renderTodayView muestra botón rápido de objetivos, barras de progreso y badges según cumplimiento', () => {
      state.recipes = [
        {
          id: 'rec-lunch-goals-test',
          title: 'Pollo con Verduras Fit',
          servings: 1,
          nutrition: { calories: 1000, protein: 70, carbs: 100, fat: 30 }
        }
      ];

      const todayKey = toLocalDateKey();
      state.mealPlan = {
        [todayKey]: {
          lunch: { recipeId: 'rec-lunch-goals-test' }
        }
      };

      // Objetivos activados: 2000 kcal, 140g proteina (1000 / 2000 = 50% -> Falta)
      state.saveNutritionGoals({
        enabled: true,
        calories: 2000,
        protein: 140,
        carbs: 200,
        fat: 65
      });

      app.renderTodayView();

      const card = document.getElementById('today-nutrition-card');
      expect(card).not.toBeNull();

      // Botón de objetivos presente en header
      const btnGoals = card.querySelector('#btn-today-quick-goals');
      expect(btnGoals).not.toBeNull();

      // Chips con barras de progreso y badges
      expect(card.querySelectorAll('.goal-progress-track').length).toBe(4);
      expect(card.querySelector('.goal-status-badge')).not.toBeNull();
      expect(card.textContent).toContain('de 2000kcal (50%)');
      expect(card.textContent).toContain('de 140g (50%)');
      expect(card.textContent).toContain('Faltan 1000kcal');
      expect(card.textContent).toContain('Faltan 70g');

      // Alerta de calorías o proteínas por quedar corto
      const banner = card.querySelector('.today-goal-banner');
      expect(banner).not.toBeNull();
      expect(banner.classList.contains('banner-under')).toBe(true);
    });

    it('renderTodayView con objetivos cumplidos muestra badge "En rango" y banner de éxito', () => {
      state.recipes = [
        {
          id: 'rec-full-day',
          title: 'Día Perfecto',
          servings: 1,
          nutrition: { calories: 2000, protein: 140, carbs: 200, fat: 65 }
        }
      ];

      const todayKey = toLocalDateKey();
      state.mealPlan = {
        [todayKey]: {
          lunch: { recipeId: 'rec-full-day' }
        }
      };

      state.saveNutritionGoals({
        enabled: true,
        calories: 2000,
        protein: 140,
        carbs: 200,
        fat: 65
      });

      app.renderTodayView();

      const card = document.getElementById('today-nutrition-card');
      expect(card.textContent).toContain('En rango');
      const banner = card.querySelector('.today-goal-banner.banner-ok');
      expect(banner).not.toBeNull();
      expect(banner.textContent).toContain('Menú equilibrado');
    });

    it('v0.58: detecta descompensación de macronutrientes (grasas excedidas y carbos bajos) aunque calorías y proteínas estén en rango', () => {
      // Caso idéntico al reportado por Franky:
      // Calorías: 2308 (meta 2200, 105% -> en rango)
      // Proteínas: 161g (meta 165g, 98% -> en rango)
      // Carbos: 144g (meta 210g, 69% -> faltan 66g)
      // Grasas: 119g (meta 65g, 184% -> +54g)
      state.recipes = [
        {
          id: 'rec-imbalanced-day',
          title: 'Día con Grasas Altas y Carbos Bajos',
          servings: 1,
          nutrition: { calories: 2308, protein: 161, carbs: 144, fat: 119 }
        }
      ];

      const todayKey = toLocalDateKey();
      state.mealPlan = {
        [todayKey]: {
          lunch: { recipeId: 'rec-imbalanced-day' }
        }
      };

      state.saveNutritionGoals({
        enabled: true,
        calories: 2200,
        protein: 165,
        carbs: 210,
        fat: 65
      });

      app.renderTodayView();

      const card = document.getElementById('today-nutrition-card');
      // No debe mostrar "Menú equilibrado"
      const okBanner = card.querySelector('.today-goal-banner.banner-ok');
      expect(okBanner).toBeNull();

      // Debe mostrar el banner de aviso con la descompensación detectada
      const alertBanner = card.querySelector('.today-goal-banner.banner-over');
      expect(alertBanner).not.toBeNull();
      expect(alertBanner.textContent).toContain('Distribución descompensada');
      expect(alertBanner.textContent).toContain('exceso de 54g de grasas');
      expect(alertBanner.textContent).toContain('faltan 66g de carbos');
    });
  });

  describe('Edición de recetas y recálculo de macronutrientes (v0.60)', () => {
    it('el botón #btn-recalculate-macros existe en el DOM', () => {
      const btn = document.getElementById('btn-recalculate-macros');
      expect(btn).not.toBeNull();
      expect(btn.textContent).toContain('Recalcular');
    });

    it('recalculateEditorNutrition rellena los inputs de macronutrientes con la estimación de los ingredientes actuales', () => {
      // Configurar inputs en el modal
      document.getElementById('edit-recipe-servings').value = '2';
      const container = document.getElementById('edit-ingredients-container');
      container.innerHTML = `
        <div class="edit-ing-row">
          <input class="ing-name" value="Pechuga de pollo">
          <input class="ing-amount" value="400">
          <input class="ing-unit" value="g">
          <select class="ing-aisle"><option value="carniceria">carniceria</option></select>
        </div>
        <div class="edit-ing-row">
          <input class="ing-name" value="Arroz">
          <input class="ing-amount" value="200">
          <input class="ing-unit" value="g">
          <select class="ing-aisle"><option value="despensa">despensa</option></select>
        </div>
      `;

      // Vaciar inputs de macros primero
      document.getElementById('edit-recipe-calories').value = '';
      document.getElementById('edit-recipe-protein').value = '';
      document.getElementById('edit-recipe-carbs').value = '';
      document.getElementById('edit-recipe-fat').value = '';

      app.recalculateEditorNutrition();

      const cal = parseFloat(document.getElementById('edit-recipe-calories').value);
      const pro = parseFloat(document.getElementById('edit-recipe-protein').value);
      const carb = parseFloat(document.getElementById('edit-recipe-carbs').value);
      const fat = parseFloat(document.getElementById('edit-recipe-fat').value);

      expect(cal).toBeGreaterThan(0);
      expect(pro).toBeGreaterThan(0);
      expect(carb).toBeGreaterThan(0);
      expect(fat).toBeGreaterThanOrEqual(0);
    });

    it('saveRecipeEdit recalcula y actualiza la nutrición si el usuario vacía los campos de macros en una receta existente', () => {
      // Receta existente con valores manuales antiguos
      const existing = {
        id: 'rec-test-manual',
        title: 'Pollo con arroz manual',
        servings: 2,
        tags: [],
        ingredients: [
          { id: 'ing-1', name: 'Pechuga de pollo', amount: 400, unit: 'g', aisle: 'carniceria' },
          { id: 'ing-2', name: 'Arroz', amount: 200, unit: 'g', aisle: 'despensa' }
        ],
        instructions: [{ step: 1, text: 'Cocinar' }],
        nutrition: { calories: 999, protein: 99, carbs: 99, fat: 99 }
      };
      state.recipes = [existing];

      // Abrir modal de edición con la receta existente
      app.openEditRecipeModal(existing);

      // Usuario borra los 4 campos para forzar recálculo
      document.getElementById('edit-recipe-calories').value = '';
      document.getElementById('edit-recipe-protein').value = '';
      document.getElementById('edit-recipe-carbs').value = '';
      document.getElementById('edit-recipe-fat').value = '';

      app.saveRecipeEdit();

      const saved = state.recipes.find(r => r.id === 'rec-test-manual');
      expect(saved).toBeDefined();
      // Ya NO debe conservar los 999/99 antiguos, sino los recalculados automáticamente
      expect(saved.nutrition.calories).not.toBe(999);
      expect(saved.nutrition.calories).toBeGreaterThan(300);
      expect(saved.nutrition.protein).not.toBe(99);
      expect(saved.nutrition.protein).toBeGreaterThan(20);
    });

    it('v2.10: al editar porciones, recalcular macros y guardar en una receta previamente abierta, se invalida _cachedNutrition y no se serializa en localStorage', () => {
      const existing = {
        id: 'rec-cache-bug-test',
        title: 'Pollo con arroz para ajustar porciones',
        servings: 8,
        tags: [],
        ingredients: [
          { id: 'ing-1', name: 'Pechuga de pollo', amount: 400, unit: 'g', aisle: 'carniceria' },
          { id: 'ing-2', name: 'Arroz', amount: 200, unit: 'g', aisle: 'despensa' }
        ],
        instructions: [{ step: 1, text: 'Cocinar todo junto' }],
        nutrition: { calories: 165, protein: 14, carbs: 20, fat: 2 }
      };
      state.recipes = [existing];

      // 1. El usuario abre primero el detalle de la receta (puebla _cachedNutrition con 165 kcal)
      app.openRecipeDetail('rec-cache-bug-test');
      expect(getRecipeNutrition(existing).calories).toBe(165);
      expect(document.getElementById('macro-detail-calories').textContent).toContain('165');

      // 2. Abre el editor, corrige las porciones de 8 a 2, pulsa Recalcular y guarda
      app.openEditRecipeModal('rec-cache-bug-test');
      document.getElementById('edit-recipe-servings').value = '2';
      app.recalculateEditorNutrition();

      const recalculatedCal = parseFloat(document.getElementById('edit-recipe-calories').value);
      expect(recalculatedCal).toBeGreaterThan(500);

      app.saveRecipeEdit();

      // 3. Al salir del editor y reabrir el detalle, getRecipeNutrition y el modal muestran los nuevos macros
      const updated = state.recipes.find(r => r.id === 'rec-cache-bug-test');
      expect(updated.servings).toBe(2);
      expect(getRecipeNutrition(updated).calories).toBe(recalculatedCal);
      expect(document.getElementById('macro-detail-calories').textContent).toContain(String(recalculatedCal));

      // 4. _cachedNutrition no debe persistirse en localStorage
      const serialized = JSON.stringify(updated);
      expect(serialized).not.toContain('_cachedNutrition');
      expect(localStorage.getItem('fa_recipes')).not.toContain('_cachedNutrition');

      // 5. Si localStorage tenía un _cachedNutrition obsoleto de versiones anteriores, StateStore lo limpia al arrancar
      const legacyRecipe = {
        ...updated,
        _cachedNutrition: { calories: 165, protein: 14, carbs: 20, fat: 2 }
      };
      localStorage.setItem('fa_recipes', JSON.stringify([legacyRecipe]));
      const reloadedStore = new StateStore();
      const reloaded = reloadedStore.recipes.find(r => r.id === 'rec-cache-bug-test');
      expect(getRecipeNutrition(reloaded).calories).toBe(recalculatedCal);
      expect(localStorage.getItem('fa_recipes')).not.toContain('_cachedNutrition');
    });
  });

  describe('Motor unificado de nutrición v2.28 (fuente única de verdad y recálculo)', () => {
    it('todas las SEED_RECIPES tienen nutritionEngineVersion === 2 y coinciden exactamente con estimateRecipeNutrition', () => {
      expect(SEED_RECIPES.length).toBeGreaterThanOrEqual(8);
      SEED_RECIPES.forEach(seed => {
        expect(seed.nutritionEngineVersion).toBe(window.NUTRITION_ENGINE_VERSION);
        expect(seed.isExplicitNutrition).not.toBe(true);
        const computed = estimateRecipeNutrition(seed);
        expect(seed.nutrition).toEqual(computed);
      });
    });

    it('agua y caldos no inflan calorías y las bebidas proteicas con agua dan macros realistas', () => {
      const onlyWater = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Agua', amount: 500, unit: 'ml', aisle: 'bebidas' }]
      });
      expect(onlyWater).toEqual({ calories: 0, protein: 0, carbs: 0, fat: 0 });

      const broth = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Caldo de verduras', amount: 1000, unit: 'ml', aisle: 'pantry' }]
      });
      expect(broth.calories).toBeLessThanOrEqual(120);

      const shake = estimateRecipeNutrition({
        servings: 1,
        ingredients: [
          { name: 'Proteína whey en polvo', amount: 30, unit: 'g', aisle: 'despensa' },
          { name: 'Agua', amount: 250, unit: 'ml', aisle: 'bebidas' }
        ]
      });
      expect(shake.calories).toBeGreaterThanOrEqual(95);
      expect(shake.calories).toBeLessThanOrEqual(135);
      expect(shake.protein).toBeGreaterThanOrEqual(20);
      expect(shake.protein).toBeLessThanOrEqual(27);
    });

    it('compuestos con sal, especias o aceite conservan sus macros y el atún en aceite usa peso pescado', () => {
      const saltedButter = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Mantequilla con sal', amount: 30, unit: 'g', aisle: 'lacteos' }]
      });
      expect(saltedButter.calories).toBeGreaterThan(180);
      expect(saltedButter.fat).toBeGreaterThan(20);

      const saltedPeanuts = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Cacahuetes con sal', amount: 40, unit: 'g', aisle: 'pantry' }]
      });
      expect(saltedPeanuts.calories).toBeGreaterThan(200);
      expect(saltedPeanuts.protein).toBeGreaterThanOrEqual(7);
      expect(saltedPeanuts.fat).toBeGreaterThan(15);

      const lowSaltSoy = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Salsa de soja baja en sal', amount: 15, unit: 'ml', aisle: 'despensa' }]
      });
      expect(lowSaltSoy.calories).toBeLessThan(25);

      const honeyCinnamon = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Miel pura y canela', amount: 20, unit: 'g', aisle: 'despensa' }]
      });
      expect(honeyCinnamon.calories).toBeGreaterThan(50);
      expect(honeyCinnamon.carbs).toBeGreaterThan(13);

      const cannedTunaInOil = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Atún en aceite de oliva', amount: 1, unit: 'lata', aisle: 'conservas' }]
      });
      expect(cannedTunaInOil.calories).toBeGreaterThanOrEqual(120);
      expect(cannedTunaInOil.protein).toBeGreaterThanOrEqual(14);
      expect(cannedTunaInOil.protein).toBeLessThanOrEqual(24);
    });

    it('precedencia correcta: Lomos de salmón fresco como pescado azul y Tomates cherry como verdura', () => {
      const salmon = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Lomos de salmón fresco', amount: 200, unit: 'g', aisle: 'pescaderia' }]
      });
      expect(salmon.protein).toBeGreaterThanOrEqual(38);
      expect(salmon.fat).toBeGreaterThanOrEqual(20);

      const cherryTomatoes = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Tomates cherry', amount: 200, unit: 'g', aisle: 'verduras' }]
      });
      expect(cherryTomatoes.calories).toBeLessThan(55);
      expect(cherryTomatoes.carbs).toBeLessThan(12);
    });

    it('soporta unidades (lata, bote, puñado, manojo, dl, oz, lb, cazo), inglés y fallback por aisle', () => {
      const unitSamples = [
        { name: 'Garbanzos cocidos', amount: 1, unit: 'lata', aisle: 'legumbres' },
        { name: 'Tomate triturado', amount: 1, unit: 'bote', aisle: 'conservas' },
        { name: 'Nueces peladas', amount: 1, unit: 'puñado', aisle: 'frutos_secos' },
        { name: 'Espinacas frescas', amount: 1, unit: 'manojo', aisle: 'verduras' },
        { name: 'Leche entera', amount: 2, unit: 'dl', aisle: 'lacteos' },
        { name: 'Pechuga de pollo', amount: 4, unit: 'oz', aisle: 'carniceria' },
        { name: 'Ternera picada', amount: 0.5, unit: 'lb', aisle: 'carniceria' },
        { name: 'Proteína whey', amount: 1, unit: 'cazo', aisle: 'despensa' }
      ];
      unitSamples.forEach(ing => {
        const res = estimateRecipeNutrition({ servings: 1, ingredients: [ing] });
        expect(res.calories).toBeGreaterThan(0);
      });

      const enChicken = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Chicken breast', amount: 200, unit: 'g' }]
      });
      expect(enChicken.protein).toBeGreaterThanOrEqual(40);

      const enSalmon = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Salmon', amount: 200, unit: 'g' }]
      });
      expect(enSalmon.fat).toBeGreaterThanOrEqual(20);

      const enOats = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Oats', amount: 60, unit: 'g' }]
      });
      expect(enOats.carbs).toBeGreaterThanOrEqual(30);

      const enOil = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Olive oil', amount: 10, unit: 'ml' }]
      });
      expect(enOil.fat).toBeGreaterThanOrEqual(9);

      const enWater = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Water', amount: 300, unit: 'ml' }]
      });
      expect(enWater.calories).toBe(0);

      const unknownMeat = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Corte especial Xyz', amount: 200, unit: 'g', aisle: 'meat' }]
      });
      const unknownVeg = estimateRecipeNutrition({
        servings: 1,
        ingredients: [{ name: 'Brote especial Xyz', amount: 200, unit: 'g', aisle: 'produce' }]
      });
      expect(unknownMeat.protein).toBeGreaterThan(25);
      expect(unknownVeg.calories).toBeLessThan(unknownMeat.calories);
      expect(unknownVeg.calories).toBeGreaterThan(15);
    });

    it('RecipeParser.parseNutrition convierte kJ a kcal, prioriza kcal en formatos mixtos y rechaza solo-calorías', () => {
      const kjOnly = RecipeParser.parseNutrition({
        calories: '1850 kJ',
        proteinContent: '20 g',
        carbohydrateContent: '30 g',
        fatContent: '10 g'
      });
      expect(kjOnly).toEqual({ calories: 442, protein: 20, carbs: 30, fat: 10 });

      const mixed = RecipeParser.parseNutrition({
        calories: '2100 kJ / 500 kcal',
        proteinContent: '25 g',
        carbohydrateContent: '50 g',
        fatContent: '15 g'
      });
      expect(mixed).toEqual({ calories: 500, protein: 25, carbs: 50, fat: 15 });

      const caloriesOnly = RecipeParser.parseNutrition({
        calories: '450 kcal'
      });
      expect(caloriesOnly).toBeNull();
    });

    it('consistencia unificada: Schema.org, texto, normalizeAiExtractedRecipe, executeAiToolCall y Recalcular devuelven macros idénticos', () => {
      state.recipes = [];

      const schemaRecipe = RecipeParser.parseSchemaRecipe({
        '@type': 'Recipe',
        name: 'Pollo Arroz Consistencia Schema',
        recipeYield: '2 raciones',
        recipeIngredient: [
          '200 g Pechuga de pollo',
          '150 g Arroz',
          '10 ml Aceite de oliva virgen extra',
          '200 ml Agua'
        ],
        recipeInstructions: ['Cocinar el pollo con arroz'],
        nutrition: {
          '@type': 'NutritionInformation',
          calories: '999 kcal',
          proteinContent: '2 g',
          carbohydrateContent: '3 g',
          fatContent: '4 g'
        }
      }, 'https://ejemplo.test/pollo');

      const textRecipe = RecipeParser.parseRecipeText([
        'Pollo Arroz Consistencia Texto',
        'Porciones: 2',
        'Ingredientes:',
        '- 200 g Pechuga de pollo',
        '- 150 g Arroz',
        '- 10 ml Aceite de oliva virgen extra',
        '- 200 ml Agua',
        'Preparación:',
        '1. Cocinar el pollo con arroz.'
      ].join('\n'));

      const aiExtracted = app.normalizeAiExtractedRecipe({
        title: 'Pollo Arroz Consistencia IA',
        servings: 2,
        ingredients: [
          { name: 'Pechuga de pollo', amount: 200, unit: 'g', aisle: 'carniceria' },
          { name: 'Arroz', amount: 150, unit: 'g', aisle: 'despensa' },
          { name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', aisle: 'despensa' },
          { name: 'Agua', amount: 200, unit: 'ml', aisle: 'bebidas' }
        ],
        instructions: ['Cocinar todo'],
        nutrition: { calories: 111, protein: 99, carbs: 1, fat: 1 }
      });

      const toolRes = app.executeAiToolCall({
        name: 'create_and_save_recipe',
        args: {
          title: 'Pollo Arroz Consistencia Tool',
          servings: 2,
          ingredients: [
            { name: 'Pechuga de pollo', amount: 200, unit: 'g', aisle: 'carniceria' },
            { name: 'Arroz', amount: 150, unit: 'g', aisle: 'despensa' },
            { name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', aisle: 'despensa' },
            { name: 'Agua', amount: 200, unit: 'ml', aisle: 'bebidas' }
          ],
          instructions: ['Cocinar todo'],
          nutrition: { calories: 888, protein: 5, carbs: 120, fat: 40 }
        }
      });

      state.recipes.push(schemaRecipe);
      app.openEditRecipeModal(schemaRecipe.id);
      app.recalculateEditorNutrition();
      const editorNutrition = {
        calories: parseFloat(document.getElementById('edit-recipe-calories').value),
        protein: parseFloat(document.getElementById('edit-recipe-protein').value),
        carbs: parseFloat(document.getElementById('edit-recipe-carbs').value),
        fat: parseFloat(document.getElementById('edit-recipe-fat').value)
      };

      expect(schemaRecipe.nutrition).toEqual(editorNutrition);
      expect(textRecipe.nutrition).toEqual(editorNutrition);
      expect(aiExtracted.nutrition).toEqual(editorNutrition);
      expect(toolRes.recipe.nutrition).toEqual(editorNutrition);
      expect(schemaRecipe.nutritionEngineVersion).toBe(2);
      expect(textRecipe.nutritionEngineVersion).toBe(2);
      expect(aiExtracted.nutritionEngineVersion).toBe(2);
      expect(toolRes.recipe.nutritionEngineVersion).toBe(2);
    });

    it('el editor recalcula automáticamente al cambiar porciones o ingredientes sin pulsar Recalcular, y respeta edición manual', () => {
      const baseRecipe = {
        id: 'rec-auto-recalc',
        title: 'Pollo con Arroz Editable',
        servings: 2,
        tags: [],
        ingredients: [
          { id: 'ing-a', name: 'Pechuga de pollo', amount: 300, unit: 'g', aisle: 'carniceria' },
          { id: 'ing-b', name: 'Arroz', amount: 150, unit: 'g', aisle: 'despensa' }
        ],
        instructions: [{ step: 1, text: 'Cocinar todo' }],
        nutrition: estimateRecipeNutrition({
          servings: 2,
          ingredients: [
            { name: 'Pechuga de pollo', amount: 300, unit: 'g', aisle: 'carniceria' },
            { name: 'Arroz', amount: 150, unit: 'g', aisle: 'despensa' }
          ]
        }),
        nutritionEngineVersion: 2,
        isExplicitNutrition: false
      };
      state.recipes = [baseRecipe];

      // 1. Cambiar porciones sin pulsar Recalcular y guardar
      app.openEditRecipeModal('rec-auto-recalc');
      document.getElementById('edit-recipe-servings').value = '4';
      app.saveRecipeEdit();

      let updated = state.recipes.find(r => r.id === 'rec-auto-recalc');
      expect(updated.servings).toBe(4);
      expect(updated.isExplicitNutrition).toBe(false);
      expect(updated.nutritionEngineVersion).toBe(2);
      expect(updated.nutrition).toEqual(estimateRecipeNutrition(updated));
      expect(updated.nutrition.calories).toBeLessThan(baseRecipe.nutrition.calories);

      // 2. Cambiar cantidad de ingrediente sin pulsar Recalcular y guardar
      app.openEditRecipeModal('rec-auto-recalc');
      const amountInputs = document.querySelectorAll('#edit-ingredients-container .ing-amount');
      amountInputs[1].value = '450';
      app.saveRecipeEdit();

      updated = state.recipes.find(r => r.id === 'rec-auto-recalc');
      expect(updated.isExplicitNutrition).toBe(false);
      expect(updated.nutrition).toEqual(estimateRecipeNutrition(updated));
      expect(updated.nutrition.carbs).toBeGreaterThan(40);

      // 3. Editar manualmente las calorías/proteínas y guardar -> respeta edición manual
      app.openEditRecipeModal('rec-auto-recalc');
      document.getElementById('edit-recipe-calories').value = '777';
      document.getElementById('edit-recipe-protein').value = '55.5';
      app.saveRecipeEdit();

      updated = state.recipes.find(r => r.id === 'rec-auto-recalc');
      expect(updated.isExplicitNutrition).toBe(true);
      expect(updated.nutrition.calories).toBe(777);
      expect(updated.nutrition.protein).toBe(55.5);
    });

    it('migrateRecipesNutritionToUnifiedEngine recalcula recetas heredadas, respeta isExplicitNutrition, omite sin ingredientes y es idempotente', () => {
      const legacyTimestamp = '2025-01-01T00:00:00.000Z';
      const expectedForLegacy = estimateRecipeNutrition({
        servings: 1,
        ingredients: [
          { name: 'Proteína whey', amount: 30, unit: 'g', aisle: 'despensa' },
          { name: 'Agua', amount: 250, unit: 'ml', aisle: 'bebidas' }
        ]
      });

      state.recipes = [
        {
          id: 'rec-mig-legacy',
          title: 'Batido Proteico Antiguo',
          servings: 1,
          ingredients: [
            { id: 'i1', name: 'Proteína whey', amount: 30, unit: 'g', aisle: 'despensa' },
            { id: 'i2', name: 'Agua', amount: 250, unit: 'ml', aisle: 'bebidas' }
          ],
          instructions: [{ step: 1, text: 'Mezclar' }],
          nutrition: { calories: 320, protein: 24, carbs: 10, fat: 8 },
          updatedAt: legacyTimestamp
        },
        {
          id: 'rec-mig-explicit',
          title: 'Receta Etiquetada Manual',
          servings: 1,
          ingredients: [{ id: 'i3', name: 'Avena', amount: 50, unit: 'g', aisle: 'despensa' }],
          instructions: [{ step: 1, text: 'Servir' }],
          nutrition: { calories: 777, protein: 44, carbs: 55, fat: 22 },
          isExplicitNutrition: true,
          updatedAt: legacyTimestamp
        },
        {
          id: 'rec-mig-empty',
          title: 'Receta Sin Ingredientes',
          servings: 2,
          ingredients: [],
          instructions: [{ step: 1, text: 'Nota libre' }],
          nutrition: null,
          updatedAt: legacyTimestamp
        }
      ];

      const firstRun = app.migrateRecipesNutritionToUnifiedEngine({ syncCloud: false });
      expect(firstRun.updatedCount).toBe(1);

      const migratedLegacy = state.recipes.find(r => r.id === 'rec-mig-legacy');
      expect(migratedLegacy.nutrition).toEqual(expectedForLegacy);
      expect(migratedLegacy.nutritionEngineVersion).toBe(2);
      expect(migratedLegacy.updatedAt).not.toBe(legacyTimestamp);

      const preservedExplicit = state.recipes.find(r => r.id === 'rec-mig-explicit');
      expect(preservedExplicit.nutrition).toEqual({ calories: 777, protein: 44, carbs: 55, fat: 22 });
      expect(preservedExplicit.isExplicitNutrition).toBe(true);
      expect(preservedExplicit.updatedAt).toBe(legacyTimestamp);

      const skippedEmpty = state.recipes.find(r => r.id === 'rec-mig-empty');
      expect(skippedEmpty.nutrition).toBeNull();
      expect(skippedEmpty.updatedAt).toBe(legacyTimestamp);

      const secondRun = app.migrateRecipesNutritionToUnifiedEngine({ syncCloud: false });
      expect(secondRun).toEqual({ updatedCount: 0, stampedCount: 0 });
    });
  });
});
