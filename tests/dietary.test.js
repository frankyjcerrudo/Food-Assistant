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
  PREDEFINED_DIET_STYLES,
  PREDEFINED_ALLERGEN_RESTRICTIONS,
  PREDEFINED_DIETARY_TAGS,
  PREDEFINED_OCCASION_TAGS,
  PREDEFINED_PRACTICAL_TAGS,
  ALL_PREDEFINED_TAGS,
  extractCustomAllergenTerm,
  isCustomAllergenPreference,
  normalizeCustomAllergenPreference,
  isStrictAllergenPreference,
  auditRecipeIngredientsForPreference,
  checkDietaryCompliance,
  analyzeAndInferRecipeTags,
  buildAllergenAuditDecisionsQuestions,
  applyRecipeDecisionsResult,
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
        nutrition: { calories: 380, protein: 16, carbs: 48, fat: 8 },
        ingredients: [{ name: 'Lentejas' }]
      });
      expect(stew).toContain('Almuerzo');
      expect(stew).not.toContain('Alta en Proteínas');

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

    it('BUG-TAGS: saveRecipeEdit respeta las etiquetas elegidas y no vuelve a inyectar etiquetas inferidas eliminadas (ej. Desayuno en tostadas)', () => {
      const toastRecipe = {
        id: 'rec-tostada-test',
        title: 'Tostada con aguacate y jamón',
        tags: ['Desayuno', 'Cena'],
        ingredients: [{ name: 'Pan', amount: 1, unit: 'rebanada' }],
        instructions: [{ step: 1, text: 'Tostar y servir' }]
      };
      state.recipes.push(toastRecipe);

      app.openEditRecipeModal('rec-tostada-test');
      // El usuario quita 'Desayuno' y deja solo 'Cena'
      app.editorSelectedTags = new Set(['Cena']);
      app.saveRecipeEdit();

      const saved = state.recipes.find(r => r.id === 'rec-tostada-test');
      expect(saved.tags).toContain('Cena');
      expect(saved.tags).not.toContain('Desayuno');
      expect(saved.isExplicitTags).toBe(true);

      // Comprobar que sanitizeRecipeProteinTags posterior tampoco la resucita
      app.sanitizeRecipeProteinTags();
      expect(saved.tags).not.toContain('Desayuno');
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

    it('v0.61: al importar receta nueva o al iniciar/volver a la app (PWA), se asignan automáticamente las etiquetas inferidas', () => {
      const parsed = window.RecipeParser.parseRecipeText(
        "Crema de calabaza rápida\nIngredientes:\n- 400g Calabaza\n- 1 Cebolla\nInstrucciones:\n1. Cocer 15 minutos y triturar."
      );
      expect(parsed.tags).toContain('Vegano');
      expect(parsed.tags).toContain('Vegetariano');
      expect(parsed.tags).toContain('Sin Gluten');
      expect(parsed.tags).toContain('Sin Lactosa');
      expect(parsed.tags).toContain('Cena');

      // Simular receta añadida sin etiquetas y apertura/reanudación de la app
      state.recipes = [
        {
          id: 'rec-untagged-startup',
          title: 'Salmón al horno con espárragos',
          prepTimeMinutes: 10,
          cookTimeMinutes: 15,
          servings: 2,
          tags: [],
          ingredients: [
            { name: 'Salmón fresco', amount: 300, unit: 'g', aisle: 'fish' },
            { name: 'Espárragos trigueros', amount: 200, unit: 'g', aisle: 'produce' }
          ],
          instructions: [{ step: 1, text: 'Hornear a 200 grados durante 15 minutos.' }]
        }
      ];

      app.sanitizeRecipeProteinTags();
      const salmon = state.recipes.find(r => r.id === 'rec-untagged-startup');
      expect(salmon.tags).toContain('Horno');
      expect(salmon.tags).toContain('Rápida');
      expect(salmon.tags).toContain('Sin Gluten');
      expect(salmon.tags).toContain('Sin Lactosa');
      expect(salmon.tags).toContain('Alta en Proteínas');
    });
  });

  describe('7. US-91: Perfil Ampliado de Dietas/Alergias y Auditoría de Alérgenos por Ingrediente (gemini-decision-1)', () => {
    it('separa 7 estilos de dieta y 9 alergias estrictas con emojis únicos dentro de PREDEFINED_DIETARY_TAGS', () => {
      expect(PREDEFINED_DIET_STYLES).toHaveLength(7);
      expect(PREDEFINED_ALLERGEN_RESTRICTIONS).toHaveLength(9);
      expect(PREDEFINED_DIETARY_TAGS).toHaveLength(16);
      expect(PREDEFINED_DIETARY_TAGS).toEqual([...PREDEFINED_DIET_STYLES, ...PREDEFINED_ALLERGEN_RESTRICTIONS]);
      expect(isStrictAllergenPreference('Sin Frutos Secos')).toBe(true);
      expect(isStrictAllergenPreference('Bajo en FODMAP')).toBe(true);
      expect(isStrictAllergenPreference('Keto')).toBe(false);

      const emojis = PREDEFINED_DIETARY_TAGS.map(getDietaryTagEmoji);
      expect(emojis.every(e => Boolean(e))).toBe(true);
      expect(new Set(emojis).size).toBe(16);
    });

    it('checkDietaryCompliance audita ingredientes reales y trazas ocultas devolviendo violatingIngredients', () => {
      const pesto = state.recipes.find(r => r.id === 'rec-pesto-pasta');
      const nutAudit = checkDietaryCompliance(pesto, ['Sin Frutos Secos']);
      expect(nutAudit.compliant).toBe(false);
      expect(nutAudit.violations).toContain('Sin Frutos Secos');
      expect(nutAudit.allergenViolations).toContain('Sin Frutos Secos');
      expect(nutAudit.violatingIngredients.some(c => /Piñones/i.test(c.ingredient))).toBe(true);

      const hiddenCases = [
        { pref: 'Sin Marisco', recipe: { title: 'Wok', tags: [], ingredients: [{ name: 'Salsa de ostras' }] }, match: /ostras/i },
        { pref: 'Sin Sésamo', recipe: { title: 'Hummus', tags: [], ingredients: [{ name: 'Tahini' }] }, match: /tahini/i },
        { pref: 'Sin Soja', recipe: { title: 'Bowl', tags: [], ingredients: [{ name: 'Tofu firme' }] }, match: /tofu/i },
        { pref: 'Bajo en FODMAP', recipe: { title: 'Sofrito', tags: [], ingredients: [{ name: 'Cebolla morada' }, { name: 'Ajo' }] }, match: /cebolla|ajo/i },
        { pref: 'Vegetariano', recipe: { title: 'Crema', tags: ['Vegetariano'], ingredients: [{ name: 'Caldo de pollo' }] }, match: /caldo de pollo/i }
      ];

      hiddenCases.forEach(({ pref, recipe, match }) => {
        const res = checkDietaryCompliance(recipe, [pref]);
        expect(res.compliant).toBe(false);
        expect(res.violations).toContain(pref);
        expect(res.violatingIngredients.some(c => match.test(c.ingredient))).toBe(true);
      });
    });

    it('cumple automáticamente restricciones de alérgenos cuando los ingredientes auditados están libres aunque falte el chip manual', () => {
      const cleanRecipe = {
        id: 'rec-clean-untagged',
        title: 'Arroz blanco con zanahoria y aceite',
        tags: [],
        ingredients: [
          { name: 'Arroz basmati', aisle: 'pantry' },
          { name: 'Zanahoria', aisle: 'produce' },
          { name: 'Aceite de oliva', aisle: 'spices' }
        ]
      };
      const res = checkDietaryCompliance(cleanRecipe, ['Sin Gluten', 'Sin Lactosa', 'Sin Frutos Secos', 'Sin Marisco', 'Sin Huevo']);
      expect(res.compliant).toBe(true);
      expect(res.violations).toEqual([]);
      expect(auditRecipeIngredientsForPreference(cleanRecipe, 'Sin Frutos Secos').hasViolation).toBe(false);
    });

    it('applyRecipeDecisionsResult aplica umbral >= 0.90 en preguntas de alérgenos ocultos, invalida etiquetas falsas y registra allergenAudit', () => {
      const questions = buildAllergenAuditDecisionsQuestions();
      expect(Object.keys(questions)).toContain('has_hidden_gluten');
      expect(Object.keys(questions)).toContain('has_nuts_or_traces');
      expect(questions.has_hidden_gluten.type).toBe('noul');

      const falselyTagged = {
        id: 'rec-soy-false-gf',
        title: 'Salteado oriental',
        tags: ['Sin Gluten', 'Vegano'],
        ingredients: [{ name: 'Verduras variadas', aisle: 'produce' }, { name: 'Aderezo especial', aisle: 'spices' }]
      };

      const audited = applyRecipeDecisionsResult(falselyTagged, {
        answers: {
          has_hidden_gluten: { type: 'noul', noul: 0.95, confidence: 0.94 },
          has_nuts_or_traces: { type: 'noul', noul: 0.72, confidence: 0.80 } // debajo de 0.90: no dispara falsa alarma
        }
      });

      expect(audited.tags).not.toContain('Sin Gluten');
      expect(audited.tags).toContain('Vegano');
      expect(audited.allergenAudit.model).toBe('gemini-decision-1');
      expect(audited.allergenAudit.conflicts).toHaveLength(1);
      expect(audited.allergenAudit.conflicts[0].preference).toBe('Sin Gluten');

      const postAuditCheck = checkDietaryCompliance(audited, ['Sin Gluten']);
      expect(postAuditCheck.compliant).toBe(false);
      expect(postAuditCheck.violatingIngredients.some(c => c.isHiddenTrace)).toBe(true);
    });

    it('renderDietaryPreferencesSettings agrupa estilos vs alergias y renderRecipeModalContent muestra banner e ingrediente conflictivo', () => {
      app.renderDietaryPreferencesSettings();
      const settingsContainer = document.getElementById('settings-dietary-chips');
      expect(settingsContainer.querySelectorAll('.dietary-prefs-group')).toHaveLength(2);
      expect(settingsContainer.querySelectorAll('.allergen-chip').length).toBe(9);

      state.saveDietaryPreferences(['Sin Frutos Secos']);
      app.openRecipeDetail('rec-pesto-pasta');
      const banner = document.getElementById('recipe-allergen-alert-banner');
      expect(banner).not.toBeNull();
      expect(banner.textContent).toContain('Piñones');
      expect(banner.textContent).toContain('(Frutos Secos)');
      expect(banner.textContent).not.toContain('(Sin Frutos Secos)');
      expect(document.getElementById('btn-recipe-substitute-allergen')).not.toBeNull();

      const modalBody = document.getElementById('recipe-modal-body');
      expect(modalBody.querySelector('.recipe-ingredient-item.has-allergen-conflict')).not.toBeNull();
      expect(modalBody.querySelector('.ingredient-allergen-pill')).toBeNull();
    });

    it('soporta alérgenos personalizados manuales (normalización, auditoría de ingredientes/pasos y preguntas dinámicas en Decisions API)', () => {
      expect(normalizeCustomAllergenPreference('kiwi')).toBe('Sin Kiwi');
      expect(normalizeCustomAllergenPreference('Sin mostaza')).toBe('Sin Mostaza');
      expect(normalizeCustomAllergenPreference('alergia al melocotón')).toBe('Sin Melocotón');
      expect(normalizeCustomAllergenPreference('lactosa')).toBe('Sin Lactosa');

      expect(isCustomAllergenPreference('Sin Kiwi')).toBe(true);
      expect(isCustomAllergenPreference('Sin Lactosa')).toBe(false);
      expect(isStrictAllergenPreference('Sin Kiwi')).toBe(true);
      expect(extractCustomAllergenTerm('Sin Kiwi')).toBe('kiwi');
      expect(getDietaryTagEmoji('Sin Kiwi')).toBe('');

      const recipeWithKiwi = {
        id: 'rec-custom-kiwi',
        title: 'Bol tropical de frutas',
        tags: [],
        ingredients: [
          { name: 'Plátano maduro', aisle: 'produce' },
          { name: '2 kiwis pelados', aisle: 'produce' }
        ],
        instructions: [{ step: 1, text: 'Cortar en láminas y servir.' }]
      };
      const recipeWithMustardInSteps = {
        id: 'rec-custom-mustard',
        title: 'Ensalada templada',
        tags: [],
        ingredients: [{ name: 'Espinacas frescas', aisle: 'produce' }],
        instructions: [{ step: 1, text: 'Aliñar con una cucharadita de mostaza antigua y aceite.' }]
      };
      const cleanRecipe = {
        id: 'rec-custom-clean',
        title: 'Arroz blanco con calabacín',
        tags: [],
        ingredients: [{ name: 'Arroz blanco', aisle: 'pantry' }, { name: 'Calabacín', aisle: 'produce' }]
      };

      const kiwiCheck = checkDietaryCompliance(recipeWithKiwi, ['Sin Kiwi']);
      expect(kiwiCheck.compliant).toBe(false);
      expect(kiwiCheck.violations).toContain('Sin Kiwi');
      expect(kiwiCheck.allergenViolations).toContain('Sin Kiwi');
      expect(kiwiCheck.violatingIngredients[0].ingredient).toBe('2 kiwis pelados');

      const mustardCheck = checkDietaryCompliance(recipeWithMustardInSteps, ['Sin Mostaza']);
      expect(mustardCheck.compliant).toBe(false);
      expect(mustardCheck.violatingIngredients[0].isHiddenTrace).toBe(true);

      expect(checkDietaryCompliance(cleanRecipe, ['Sin Kiwi', 'Sin Mostaza']).compliant).toBe(true);

      state.saveDietaryPreferences(['Sin Kiwi']);
      const questions = buildAllergenAuditDecisionsQuestions();
      expect(questions.has_custom_allergen_kiwi).toBeDefined();
      expect(questions.has_custom_allergen_kiwi.type).toBe('noul');

      const aiAudited = applyRecipeDecisionsResult(cleanRecipe, {
        answers: {
          has_custom_allergen_kiwi: { type: 'noul', noul: 0.94, confidence: 0.95 }
        }
      });
      expect(aiAudited.allergenAudit.conflicts).toHaveLength(1);
      expect(aiAudited.allergenAudit.conflicts[0].preference).toBe('Sin Kiwi');
    });

    it('permite añadir alérgenos manuales desde Ajustes y Onboarding', () => {
      app.renderDietaryPreferencesSettings();
      const settingsInput = document.getElementById('settings-custom-allergen-input');
      settingsInput.value = 'mostaza';
      app.addCustomAllergenFromSettings();
      expect(state.dietaryPreferences).toContain('Sin Mostaza');

      const settingsContainer = document.getElementById('settings-dietary-chips');
      expect(settingsContainer.querySelectorAll('.allergen-chip')).toHaveLength(10);
      expect(settingsContainer.textContent).toContain('Sin Mostaza');

      app.openOnboardingModal(2);
      const onboardingInput = document.getElementById('onboarding-custom-allergen-input');
      onboardingInput.value = 'kiwi';
      app.addOnboardingCustomAllergen();
      expect(app.onboardingDietary.has('Sin Kiwi')).toBe(true);
      app.closeOnboardingModal();
    });

    it('muestra modal único de novedad de alérgenos solo a usuarios existentes y conserva dietas previas al guardar', () => {
      app.closeOnboardingModal();

      // Usuario nuevo (onboarding no completado): no lanza What's New
      expect(app.checkAndLaunchAllergensWhatsNew()).toBe(false);

      // Usuario existente con estilo de dieta previo y sin haber visto aún la novedad
      localStorage.setItem('fa_onboarding_completed', 'true');
      state.saveDietaryPreferences(['Keto']);

      expect(app.checkAndLaunchAllergensWhatsNew()).toBe(true);
      const whatsNewModal = document.getElementById('modal-allergens-whatsnew');
      expect(whatsNewModal.classList.contains('active') || whatsNewModal.open).toBe(true);

      app.toggleWhatsNewAllergenTag('Sin Frutos Secos');
      const customInput = document.getElementById('whatsnew-custom-allergen-input');
      customInput.value = 'melocotón';
      app.addWhatsNewCustomAllergen();
      app.saveAllergensWhatsNew();

      expect(localStorage.getItem('fa_allergens_whatsnew_v1')).toBe('true');
      expect(state.dietaryPreferences).toEqual(['Keto', 'Sin Frutos Secos', 'Sin Melocotón']);
      expect(app.checkAndLaunchAllergensWhatsNew()).toBe(false);
    });

    it('no muestra alerta de alérgenos ni pasa estilos de dieta como ingredientes en conflicto en requestAllergenSubstitutionWithAi', async () => {
      const lowProteinCleanRecipe = {
        id: 'rec-style-only-check',
        title: 'Crema de verduras suaves',
        tags: ['Sin Pescado', 'Sin Marisco'],
        ingredients: [
          { name: 'Calabacín', aisle: 'produce' },
          { name: 'Patata', aisle: 'produce' }
        ],
        instructions: [{ step: 1, text: 'Cocer y triturar.' }]
      };
      state.recipes.push(lowProteinCleanRecipe);
      state.saveDietaryPreferences(['Alta en Proteínas', 'Sin Marisco', 'Sin Pescado']);

      app.openRecipeDetail('rec-style-only-check');
      expect(document.getElementById('recipe-allergen-alert-banner')).toBeNull();

      let sentPrompt = '';
      app.switchView = () => {};
      app.closeRecipeModal = () => {};
      app.handleGeminiInvokeSubmit = async () => {
        sentPrompt = document.getElementById('gemini-invoke-input').value;
      };
      await app.requestAllergenSubstitutionWithAi('rec-style-only-check');
      expect(sentPrompt).not.toContain('ingredientes en conflicto [Alta en Proteínas]');
    });
  });
});
