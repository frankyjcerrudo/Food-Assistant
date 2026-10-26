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
});
