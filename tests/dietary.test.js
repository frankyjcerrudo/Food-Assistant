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
  PREDEFINED_DIETARY_TAGS,
  PREDEFINED_OCCASION_TAGS,
  PREDEFINED_PRACTICAL_TAGS,
  ALL_PREDEFINED_TAGS,
  checkDietaryCompliance,
  analyzeAndInferRecipeTags,
  getDietaryTagEmoji,
  toLocalDateKey,
  state,
  SEED_RECIPES
} = window;

describe('US-02: Filtros Dietéticos, Selector de Chips & Advertencias Nutricionales', () => {
  let app;

  beforeEach(() => {
    localStorage.clear();

    // Reset state in place so closure state and window.state remain identical
    state.dietaryPreferences = [];
    state.customTags = [];
    state.recipes = typeof structuredClone === 'function' ? structuredClone(SEED_RECIPES) : JSON.parse(JSON.stringify(SEED_RECIPES));
    state.mealPlan = state.generateInitialMealPlan();
    state.shoppingList = [];
    state.save('fa_dietary_preferences', state.dietaryPreferences);
    state.save('fa_custom_tags', state.customTags);
    state.save('fa_recipes', state.recipes);
    state.save('fa_mealplan', state.mealPlan);

    const searchInput = document.getElementById('recipes-search-input');
    if (searchInput) searchInput.value = '';

    app = new FoodAssistantApp();
  });

  describe('1. Modelo de Datos y Categorías Predefinidas', () => {
    it('debe definir las etiquetas dietéticas requeridas en US-02 (Keto, Vegano, Sin Gluten, etc.)', () => {
      expect(PREDEFINED_DIETARY_TAGS).toContain('Keto');
      expect(PREDEFINED_DIETARY_TAGS).toContain('Vegano');
      expect(PREDEFINED_DIETARY_TAGS).toContain('Vegetariano');
      expect(PREDEFINED_DIETARY_TAGS).toContain('Sin Gluten');
      expect(PREDEFINED_DIETARY_TAGS).toContain('Sin Lactosa');
      expect(PREDEFINED_DIETARY_TAGS).toContain('Bajo en Carbos');
    });

    it('v0.48: define Alta en Proteínas y un emoji distinto por etiqueta dietética', () => {
      expect(PREDEFINED_DIETARY_TAGS).toContain('Alta en Proteínas');
      expect(getDietaryTagEmoji('Vegano')).toBe('🌱');
      expect(getDietaryTagEmoji('Vegetariano')).toBe('🥗');
      expect(getDietaryTagEmoji('Alta en Proteínas')).toBe('💪');
      const emojis = PREDEFINED_DIETARY_TAGS.map(getDietaryTagEmoji);
      expect(new Set(emojis).size).toBe(PREDEFINED_DIETARY_TAGS.length);
      expect(getDietaryTagEmoji('Rápida')).toBe('');
    });

    it('v0.48: analyzeAndInferRecipeTags detecta Alta en Proteínas, Almuerzo y Cena', () => {
      const chicken = analyzeAndInferRecipeTags({
        title: 'Pechuga a la plancha',
        ingredients: [{ name: 'Pechuga de pollo' }, { name: 'Sal' }]
      });
      expect(chicken).toContain('Alta en Proteínas');
      expect(chicken).toContain('Cena');

      const shake = analyzeAndInferRecipeTags({
        title: 'Batido de proteínas sabor vainilla',
        nutrition: { calories: 120, protein: 21, carbs: 3, fat: 2 },
        ingredients: [{ name: 'Proteína whey' }, { name: 'Agua' }]
      });
      expect(shake).toContain('Alta en Proteínas');

      const stew = analyzeAndInferRecipeTags({
        title: 'Guiso de lentejas',
        ingredients: [{ name: 'Lentejas' }]
      });
      expect(stew).toContain('Almuerzo');

      const tomato = analyzeAndInferRecipeTags({ title: 'Tomates', ingredients: [{ name: 'Tomates' }] });
      expect(tomato).not.toContain('Alta en Proteínas');
    });

    it('debe definir etiquetas prácticas requeridas (Rápida, Horno, Tupper)', () => {
      expect(PREDEFINED_PRACTICAL_TAGS).toContain('Rápida');
      expect(PREDEFINED_PRACTICAL_TAGS).toContain('Horno');
      expect(PREDEFINED_PRACTICAL_TAGS).toContain('Tupper');
    });

    it('StateStore debe inicializar y persistir preferencias dietéticas y etiquetas personalizadas', () => {
      expect(state.dietaryPreferences).toEqual([]);
      expect(state.customTags).toEqual([]);

      state.saveDietaryPreferences(['Vegano', 'Sin Gluten']);
      expect(state.dietaryPreferences).toEqual(['Vegano', 'Sin Gluten']);

      const reloadedStore = new StateStore();
      expect(reloadedStore.dietaryPreferences).toEqual(['Vegano', 'Sin Gluten']);

      state.addCustomTag('Airfryer Pro');
      expect(state.customTags).toContain('Airfryer Pro');

      // No duplicar ignorando mayúsculas/minúsculas
      state.addCustomTag('airfryer pro');
      expect(state.customTags.filter(t => t.toLowerCase() === 'airfryer pro')).toHaveLength(1);
    });

    it('getAllTags() debe devolver la unión de predefinidas, personalizadas y de recetas', () => {
      state.addCustomTag('Fiesta');
      const allTags = state.getAllTags();

      expect(allTags).toContain('Keto');
      expect(allTags).toContain('Vegano');
      expect(allTags).toContain('Rápida');
      expect(allTags).toContain('Fiesta');
      expect(allTags).toContain('Pasta');
    });
  });

  describe('2. Motor de Cumplimiento Dietético (checkDietaryCompliance)', () => {
    it('es complaciente si no hay preferencias configuradas', () => {
      const recipe = { title: 'Pollo al Limón', tags: ['Pollo', 'Cena'], ingredients: [] };
      const result = checkDietaryCompliance(recipe, []);
      expect(result.compliant).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('detecta cumplimiento cuando la receta tiene la etiqueta dietética', () => {
      const veganRecipe = {
        title: 'Tostas de Hummus',
        tags: ['Vegano', 'Saludable'],
        ingredients: [{ name: 'Hummus', aisle: 'pantry' }]
      };
      const result = checkDietaryCompliance(veganRecipe, ['Vegano']);
      expect(result.compliant).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('detecta infracción cuando falta la etiqueta dietética requerida', () => {
      const chickenRecipe = {
        title: 'Pollo al Limón',
        tags: ['Pollo', 'Cena'],
        ingredients: [{ name: 'Pollo', aisle: 'meat' }]
      };
      const result = checkDietaryCompliance(chickenRecipe, ['Keto', 'Vegano']);
      expect(result.compliant).toBe(false);
      expect(result.violations).toContain('Keto');
      expect(result.violations).toContain('Vegano');
    });

    it('detección inteligente de alérgenos/ingredientes: carne/pescado o lácteos invalidan Vegano', () => {
      // Receta marcada erróneamente como Vegana pero con pechuga de pollo
      const fakeVegan = {
        title: 'Pechuga con verduras',
        tags: ['Vegano'],
        ingredients: [{ name: 'Pechuga de pollo', aisle: 'meat' }]
      };
      const result = checkDietaryCompliance(fakeVegan, ['Vegano']);
      expect(result.compliant).toBe(false);
      expect(result.violations).toContain('Vegano');
    });
  });

  describe('3. Selector Interactivo de Chips en Editor de Recetas', () => {
    it('openCreateRecipeModal inicializa con etiquetas sugeridas por defecto y chips interactivos', () => {
      app.openCreateRecipeModal();
      expect(app.editorSelectedTags.has('Cena')).toBe(true);
      expect(app.editorSelectedTags.has('Saludable')).toBe(true);

      const chipsBox = document.getElementById('editor-selected-tags-container');
      expect(chipsBox.textContent).toContain('Cena');
      expect(chipsBox.textContent).toContain('Saludable');
    });

    it('toggleEditorTag añade y quita etiquetas sincronizando el input oculto', () => {
      app.openCreateRecipeModal();
      app.toggleEditorTag('Sin Gluten');
      expect(app.editorSelectedTags.has('Sin Gluten')).toBe(true);

      const hiddenInput = document.getElementById('edit-recipe-tags');
      expect(hiddenInput.value).toContain('Sin Gluten');

      // Tocar de nuevo la etiqueta la deselecciona
      app.toggleEditorTag('Sin Gluten');
      expect(app.editorSelectedTags.has('Sin Gluten')).toBe(false);
      expect(hiddenInput.value).not.toContain('Sin Gluten');
    });

    it('removeEditorTag elimina la etiqueta seleccionada', () => {
      app.openCreateRecipeModal();
      expect(app.editorSelectedTags.has('Cena')).toBe(true);
      app.removeEditorTag('Cena');
      expect(app.editorSelectedTags.has('Cena')).toBe(false);
    });

    it('permite crear y añadir etiquetas personalizadas sobre la marcha', () => {
      app.openCreateRecipeModal();
      const customInput = document.getElementById('input-new-custom-tag');
      customInput.value = 'Batch Cooking';

      app.handleAddCustomTagFromEditor();

      expect(app.editorSelectedTags.has('Batch Cooking')).toBe(true);
      expect(state.customTags).toContain('Batch Cooking');
      expect(customInput.value).toBe('');
    });

    it('saveRecipeEdit persiste las etiquetas de editorSelectedTags en la receta', () => {
      app.openCreateRecipeModal();
      document.getElementById('edit-recipe-title').value = 'Bowl Keto Especial';
      app.editorSelectedTags.clear();
      app.editorSelectedTags.add('Keto');
      app.editorSelectedTags.add('Rápida');

      app.saveRecipeEdit();

      const created = state.recipes.find(r => r.title === 'Bowl Keto Especial');
      expect(created).toBeDefined();
      expect(created.tags).toEqual(['Keto', 'Rápida']);
    });
  });

  describe('4. Filtro Múltiple Combinado con Buscador en Catálogo', () => {
    it('filtra por múltiples chips de forma combinada (AND logic)', () => {
      app.selectedRecipeTags.clear();
      app.selectedRecipeTags.add('Cena');
      app.selectedRecipeTags.add('Rápida');

      app.applyRecipeFilters();

      const badge = document.getElementById('recipes-count-badge');
      expect(parseInt(badge.textContent, 10)).toBeGreaterThanOrEqual(2);
    });

    it('combina filtros de chips con texto libre en el buscador', () => {
      app.selectedRecipeTags.clear();
      app.selectedRecipeTags.add('Cena');

      const searchInput = document.getElementById('recipes-search-input');
      searchInput.value = 'Pesto';

      app.applyRecipeFilters();

      const badge = document.getElementById('recipes-count-badge');
      expect(badge.textContent).toContain('1 de');
    });

    it('el chip "Todas" resetea la selección múltiple', () => {
      const searchInput = document.getElementById('recipes-search-input');
      if (searchInput) searchInput.value = '';

      app.selectedRecipeTags.add('Keto');
      app.filterRecipesByTag('all');

      expect(app.selectedRecipeTags.size).toBe(0);
      const badge = document.getElementById('recipes-count-badge');
      expect(badge.textContent).toBe(String(state.recipes.length));
    });
  });

  describe('5. Advertencias Automáticas en el Planificador Semanal y Hoy', () => {
    it('muestra aviso en el slot si la receta asignada incumple la dieta activa', () => {
      state.saveDietaryPreferences(['Vegano']);

      const dateKey = Object.keys(state.mealPlan)[0];
      state.mealPlan[dateKey].lunch = 'rec-lemon-chicken';

      app.renderPlanner();

      const container = document.getElementById('planner-days-container');
      expect(container.innerHTML).toContain('dietary-warning-badge');
      expect(container.innerHTML).toContain('No cumple: Vegano');
    });

    it('no muestra aviso si la receta asignada cumple las preferencias dietéticas', () => {
      state.saveDietaryPreferences(['Vegetariano']);

      const dateKey = Object.keys(state.mealPlan)[0];
      state.mealPlan = {
        [dateKey]: {
          dayName: 'Lunes',
          breakfast: null,
          lunch: 'rec-pesto-pasta',
          snack: null,
          dinner: null,
          customSlots: []
        }
      };

      app.renderPlanner();

      const container = document.getElementById('planner-days-container');
      expect(container.innerHTML).not.toContain('No cumple: Vegetariano');
    });

    it('muestra aviso en la vista Hoy si una comida asignada incumple la dieta', () => {
      state.saveDietaryPreferences(['Keto']);

      const todayStr = toLocalDateKey();
      if (!state.mealPlan[todayStr]) {
        state.mealPlan[todayStr] = { breakfast: null, lunch: null, snack: null, dinner: null, customSlots: [] };
      }
      state.mealPlan[todayStr].lunch = 'rec-pesto-pasta';

      app.renderTodayView();

      const todayContainer = document.getElementById('today-slots-container');
      expect(todayContainer.innerHTML).toContain('dietary-warning-badge');
      expect(todayContainer.innerHTML).toContain('No cumple: Keto');
    });

    it('openPickerModal muestra filtro de "Solo aptas para mis dietas" cuando hay preferencias activas', () => {
      state.saveDietaryPreferences(['Vegano']);

      app.openPickerModal('2026-10-26', 'lunch', false);

      const filterBar = document.getElementById('picker-dietary-filter-bar');
      expect(filterBar.style.display).not.toBe('none');

      const pickerList = document.getElementById('picker-recipes-list');
      expect(pickerList.innerHTML).toContain('dietary-warning-badge');
    });
  });

  describe('6. Motor de Auto-Análisis y Asignación Automática de Chips en Ajustes', () => {
    it('analyzeAndInferRecipeTags detecta etiquetas prácticas por tiempo y técnicas', () => {
      const quickOvenRecipe = {
        title: 'Berenjenas Rellenas al Horno',
        prepTimeMinutes: 10,
        cookTimeMinutes: 12,
        instructions: [{ step: 1, text: 'Hornear a 200°C durante 10 minutos hasta gratinar.' }],
        ingredients: [{ name: 'Berenjena', aisle: 'produce' }]
      };

      const tags = analyzeAndInferRecipeTags(quickOvenRecipe);
      expect(tags).toContain('Rápida');
      expect(tags).toContain('Horno');
    });

    it('analyzeAndInferRecipeTags detecta Vegano, Vegetariano, Sin Gluten y Sin Lactosa en recetas 100% vegetales', () => {
      const veganRecipe = {
        title: 'Bowl de Quinoa con Aguacate y Espinacas',
        prepTimeMinutes: 10,
        cookTimeMinutes: 10,
        ingredients: [
          { name: 'Quinoa cocida', aisle: 'pantry' },
          { name: 'Aguacate', aisle: 'produce' },
          { name: 'Espinacas frescas', aisle: 'produce' },
          { name: 'Aceite de oliva virgen extra', aisle: 'spices' }
        ],
        instructions: [{ step: 1, text: 'Mezclar todo en un bol y servir fresco.' }]
      };

      const tags = analyzeAndInferRecipeTags(veganRecipe);
      expect(tags).toContain('Vegano');
      expect(tags).toContain('Vegetariano');
      expect(tags).toContain('Sin Gluten');
      expect(tags).toContain('Sin Lactosa');
      expect(tags).toContain('Rápida');
    });

    it('analyzeAndInferRecipeTags detecta Vegetariano pero no Vegano si contiene lácteos o queso', () => {
      const vegetarianRecipe = {
        title: 'Tortilla de Patatas con Queso Manchego',
        ingredients: [
          { name: 'Patatas', aisle: 'produce' },
          { name: 'Huevos', aisle: 'dairy' },
          { name: 'Queso manchego', aisle: 'dairy' }
        ],
        instructions: [{ step: 1, text: 'Cuajar la tortilla en sartén.' }]
      };

      const tags = analyzeAndInferRecipeTags(vegetarianRecipe);
      expect(tags).toContain('Vegetariano');
      expect(tags).not.toContain('Vegano');
      expect(tags).not.toContain('Sin Lactosa');
    });

    it('analyzeAndInferRecipeTags detecta Airfryer y Desayuno según título y descripción', () => {
      const breakfastRecipe = {
        title: 'Tostada de Avena Crujiente en Airfryer',
        prepTimeMinutes: 5,
        cookTimeMinutes: 8,
        ingredients: [{ name: 'Pan de centeno', aisle: 'bakery' }],
        instructions: [{ step: 1, text: 'Introducir en la cesta de la freidora de aire.' }]
      };

      const tags = analyzeAndInferRecipeTags(breakfastRecipe);
      expect(tags).toContain('Airfryer');
      expect(tags).toContain('Desayuno');
      expect(tags).toContain('Rápida');
    });

    it('autoAnalyzeAndTagAllRecipes actualiza las recetas guardadas y muestra mensaje de éxito en Ajustes', async () => {
      // Simular una receta sin etiquetas previas
      state.recipes = [
        {
          id: 'test-rec-analyze-1',
          title: 'Batido Verde Detox',
          description: 'Merienda saludable',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          tags: [],
          ingredients: [
            { name: 'Espinacas', aisle: 'produce' },
            { name: 'Plátano', aisle: 'produce' },
            { name: 'Bebida de avena sin gluten', aisle: 'dairy' }
          ],
          instructions: [{ step: 1, text: 'Triturar en batidora y servir.' }]
        }
      ];

      const result = await app.autoAnalyzeAndTagAllRecipes();
      expect(result.updatedCount).toBe(1);
      expect(result.totalTagsAdded).toBeGreaterThanOrEqual(3);

      const updatedRecipe = state.recipes.find(r => r.id === 'test-rec-analyze-1');
      expect(updatedRecipe.tags).toContain('Rápida');
      expect(updatedRecipe.tags).toContain('Vegano');
      expect(updatedRecipe.tags).toContain('Vegetariano');
      expect(updatedRecipe.tags).toContain('Merienda');
      expect(updatedRecipe.updatedAt).toBeDefined();

      const msgEl = document.getElementById('auto-tag-result-msg');
      expect(msgEl.style.display).not.toBe('none');
      expect(msgEl.textContent).toContain('¡Análisis completado!');

      // Segunda ejecución sin cambios nuevos
      const secondResult = await app.autoAnalyzeAndTagAllRecipes();
      expect(secondResult.updatedCount).toBe(0);
      expect(msgEl.textContent).toContain('Todas tus recetas ya cuentan con las etiquetas correspondientes');
    });

    it('autoAnalyzeAndTagAllRecipes limpia la etiqueta obsoleta General y asigna etiquetas a receta con solo tomates', async () => {
      state.recipes = [
        {
          id: 'test-rec-tomatoes',
          title: 'Tomates Aliñados',
          description: 'Tomates frescos de huerto',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          tags: ['General'],
          ingredients: [
            { name: 'Tomates', aisle: 'produce' }
          ],
          instructions: [{ step: 1, text: 'Cortar los tomates en rodajas.' }]
        }
      ];

      const result = await app.autoAnalyzeAndTagAllRecipes();
      expect(result.updatedCount).toBe(1);

      const rec = state.recipes.find(r => r.id === 'test-rec-tomatoes');
      expect(rec.tags).not.toContain('General');
      expect(rec.tags).toContain('Vegano');
      expect(rec.tags).toContain('Vegetariano');
      expect(rec.tags).toContain('Sin Gluten');
      expect(rec.tags).toContain('Sin Lactosa');
      expect(rec.tags).toContain('Rápida');
      expect(rec.updatedAt).toBeDefined();
    });
  });
});
