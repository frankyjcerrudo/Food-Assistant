import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load i18n in happy-dom environment
const i18nPath = path.resolve(process.cwd(), 'i18n.js');
const i18nCode = fs.readFileSync(i18nPath, 'utf-8');
new Function(i18nCode)();

const I18n = window.I18n;

describe('US-12: Módulo Core de Internacionalización (i18n.js)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute('lang', 'es');
    I18n.setPreference('auto');
  });

  it('debe inicializarse con preferencia "auto" y soporte UMD en window.I18n', () => {
    expect(I18n).toBeDefined();
    expect(I18n.SUPPORTED_LANGUAGES).toContain('es');
    expect(I18n.SUPPORTED_LANGUAGES).toContain('en');
    expect(['auto', 'es', 'en']).toContain(I18n.getPreference());
  });

  it('detecta español cuando navigator.language es "es-ES"', () => {
    const originalNav = window.navigator;
    Object.defineProperty(window, 'navigator', {
      value: { languages: ['es-ES', 'es'], language: 'es-ES' },
      configurable: true
    });

    expect(I18n.detectSystemLanguage()).toBe('es');

    Object.defineProperty(window, 'navigator', {
      value: originalNav,
      configurable: true
    });
  });

  it('detecta inglés cuando navigator.language es "en-US"', () => {
    const originalNav = window.navigator;
    Object.defineProperty(window, 'navigator', {
      value: { languages: ['en-US', 'en'], language: 'en-US' },
      configurable: true
    });

    expect(I18n.detectSystemLanguage()).toBe('en');

    Object.defineProperty(window, 'navigator', {
      value: originalNav,
      configurable: true
    });
  });

  it('aplica fallback a inglés para idiomas no soportados (ej. alemán "de-DE" o francés "fr-FR")', () => {
    const originalNav = window.navigator;
    Object.defineProperty(window, 'navigator', {
      value: { languages: ['fr-FR', 'fr'], language: 'fr-FR' },
      configurable: true
    });

    expect(I18n.detectSystemLanguage()).toBe('en');

    Object.defineProperty(window, 'navigator', {
      value: originalNav,
      configurable: true
    });
  });

  it('traduce correctamente cadenas básicas en español e inglés', () => {
    I18n.setPreference('es');
    expect(I18n.t('nav.today')).toBe('Hoy');
    expect(I18n.t('nav.recipes')).toBe('Recetas');
    expect(I18n.t('common.save')).toBe('Guardar');

    I18n.setPreference('en');
    expect(I18n.t('nav.today')).toBe('Today');
    expect(I18n.t('nav.recipes')).toBe('Recipes');
    expect(I18n.t('common.save')).toBe('Save');
  });

  it('soporta interpolación de parámetros dinámicos {param}', () => {
    I18n.MESSAGES.es.testKey = 'Hola {name}, tienes {count} recetas';
    I18n.setPreference('es');
    expect(I18n.t('testKey', { name: 'Franky', count: 5 })).toBe('Hola Franky, tienes 5 recetas');
  });

  it('actualiza el atributo <html lang="..."> al cambiar de idioma', () => {
    I18n.setPreference('en');
    expect(document.documentElement.getAttribute('lang')).toBe('en');

    I18n.setPreference('es');
    expect(document.documentElement.getAttribute('lang')).toBe('es');
  });

  it('persiste la preferencia en localStorage con la clave fa_language', () => {
    I18n.setPreference('en');
    expect(localStorage.getItem('fa_language')).toBe('en');

    I18n.setPreference('auto');
    expect(localStorage.getItem('fa_language')).toBe('auto');
  });

  it('aplica traducciones automáticas al DOM con applyTranslations()', () => {
    document.body.innerHTML = `
      <div id="test-container">
        <h1 data-i18n="nav.today">Antiguo</h1>
        <input type="text" data-i18n-placeholder="recipes.searchPlaceholder" placeholder="old">
        <button data-i18n-title="common.save" title="old">
          <span class="material-symbols-outlined">save</span>
          <span data-i18n="common.save">Antiguo</span>
        </button>
      </div>
    `;

    I18n.setPreference('en');
    I18n.applyTranslations(document.getElementById('test-container'));

    expect(document.querySelector('h1').textContent).toBe('Today');
    expect(document.querySelector('input').getAttribute('placeholder')).toBe('Search by dish, ingredient or technique...');
    expect(document.querySelector('button').getAttribute('title')).toBe('Save');
    expect(document.querySelector('button span[data-i18n]').textContent).toBe('Save');
  });

  it('traduce los nombres de pasillos de compra mediante getAisleName()', () => {
    I18n.setPreference('es');
    expect(I18n.getAisleName('produce')).toBe('Frutas y Verduras');
    expect(I18n.getAisleName('dairy')).toBe('Lácteos y Huevos');

    I18n.setPreference('en');
    expect(I18n.getAisleName('produce')).toBe('Produce & Veggies');
    expect(I18n.getAisleName('dairy')).toBe('Dairy & Eggs');
  });

  it('clasifica correctamente ingredientes en inglés hacia sus pasillos correspondientes', () => {
    const appPath = path.resolve(process.cwd(), 'app.js');
    const appCode = fs.readFileSync(appPath, 'utf-8');
    new Function(appCode)();
    const { categorizeIngredientAisle, getAisleLabel } = window;

    expect(categorizeIngredientAisle('Chicken breast')).toBe('meat');
    expect(categorizeIngredientAisle('Fresh salmon fillet')).toBe('meat');
    expect(categorizeIngredientAisle('Cheddar cheese')).toBe('dairy');
    expect(categorizeIngredientAisle('Whole milk')).toBe('dairy');
    expect(categorizeIngredientAisle('Cherry tomatoes')).toBe('produce');
    expect(categorizeIngredientAisle('Fresh spinach')).toBe('produce');
    expect(categorizeIngredientAisle('Extra virgin olive oil')).toBe('spices');
    expect(categorizeIngredientAisle('Spaghetti pasta')).toBe('pantry');
    expect(categorizeIngredientAisle('Sliced bread')).toBe('bakery');
    expect(categorizeIngredientAisle('Vanilla ice cream')).toBe('frozen');
    expect(categorizeIngredientAisle('Orange juice')).toBe('beverages');

    // Test getAisleLabel in both languages
    I18n.setPreference('es');
    expect(getAisleLabel('produce')).toBe('Frutas y Verduras');
    expect(getAisleLabel('meat')).toBe('Carnes y Pescados');

    I18n.setPreference('en');
    expect(getAisleLabel('produce')).toBe('Produce & Veggies');
    expect(getAisleLabel('meat')).toBe('Meat & Seafood');
  });

  it('traduce las vistas principales en index.html al alternar a inglés (Fase 2)', () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    // Strip scripts and stylesheet links to prevent happy-dom network requests
    htmlContent = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<link[\s\S]*?>/gi, '');
    document.body.innerHTML = htmlContent;

    I18n.setPreference('en');
    I18n.applyTranslations(document.body);

    // Today
    expect(document.querySelector('.today-title').textContent).toBe("Today's Menu");
    // Recipes
    expect(document.querySelector('#view-recipes .section-title span[data-i18n]').textContent).toBe("Recipes");
    expect(document.querySelector('#recipes-search-input').getAttribute('placeholder')).toBe("Search by dish, ingredient or technique...");
    // Planner
    expect(document.querySelector('#view-planner .section-title').textContent).toBe("Weekly Planner");
    // Shopping
    expect(document.querySelector('#view-shopping .section-title').textContent).toBe("Shopping List");
    expect(document.querySelector('#input-quick-grocery').getAttribute('placeholder')).toBe("Add item (e.g. Bananas, 1L Milk, Eggs...)");
    // Settings
    expect(document.querySelector('#view-settings .section-title').textContent).toBe("Settings");
    expect(document.querySelector('#card-language-settings [data-i18n="settings.languageTitle"]').textContent).toBe("Language");
  });

  it('traduce modales interactivos: Onboarding, Cook Mode e Importador (Fase 3)', () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    htmlContent = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<link[\s\S]*?>/gi, '');
    document.body.innerHTML = htmlContent;

    I18n.setPreference('en');
    I18n.applyTranslations(document.body);

    // Onboarding Wizard
    expect(document.querySelector('#onboarding-modal-title').textContent).toBe("Welcome to Sabory!");
    expect(document.querySelector('#btn-onboarding-skip').textContent.trim()).toBe("Skip for now");
    expect(document.querySelector('#onboarding-step-2 .onboarding-step-kicker').textContent).toBe("Step 2 of 5 · Food");
    expect(document.querySelector('#onboarding-step-3 .onboarding-step-kicker').textContent).toBe("Step 3 of 5 · Nutrition");
    expect(document.querySelector('#onboarding-step-4 .onboarding-step-kicker').textContent).toBe("Step 4 of 5 · Household");
    expect(document.querySelector('#btn-onboarding-next span[data-i18n]').textContent).toBe("Next");
    expect(document.querySelector('#btn-onboarding-finish span[data-i18n]').textContent).toBe("Start cooking!");

    // Cook Mode Overlay
    expect(document.querySelector('#cook-mode-overlay .cook-mode-header-kicker span[data-i18n="cooking.mode"]').textContent).toBe("Cooking Mode");
    expect(document.querySelector('#btn-exit-cook-mode span[data-i18n]').textContent).toBe("Exit");
    expect(document.querySelector('#btn-timer-start').textContent).toBe("Start");
    expect(document.querySelector('#btn-timer-reset').textContent).toBe("Reset");
    expect(document.querySelector('#btn-cook-prev-step span[data-i18n]').textContent).toBe("Previous");
    expect(document.querySelector('#btn-cook-next-step span[data-i18n]').textContent).toBe("Next");

    // Recipe Importer
    expect(document.querySelector('#modal-recipe-import h3 span[data-i18n]').textContent).toBe("Recipe Importer");
    expect(document.querySelector('#tab-import-url .import-tab-label').textContent).toBe("Link");
    expect(document.querySelector('#tab-import-text .import-tab-label').textContent).toBe("Text");
    expect(document.querySelector('#tab-import-ai .import-tab-label').textContent).toBe("Photo / AI");
    expect(document.querySelector('#btn-execute-import span[data-i18n]').textContent).toBe("Analyze & Import");
  });

  it('resuelve claves de toast y añade directiva de idioma al prompt de IA (Fase 4)', () => {
    const appPath = path.resolve(process.cwd(), 'app.js');
    const appCode = fs.readFileSync(appPath, 'utf-8');
    new Function(appCode)();

    I18n.setPreference('en');
    expect(I18n.t('toasts.recipeSaved')).toBe('Recipe saved successfully');
    expect(I18n.t('toasts.shoppingCleared')).toBe('Purchased items cleared');

    I18n.setPreference('es');
    expect(I18n.t('toasts.recipeSaved')).toBe('Receta guardada con éxito');
    expect(I18n.t('toasts.shoppingCleared')).toBe('Artículos comprados eliminados');

    // Test AI System Instruction language directive
    const appInstance = new window.FoodAssistantApp();
    I18n.setPreference('en');
    const enInstruction = appInstance.buildAiSystemInstruction();
    expect(enInstruction).toContain('10. LANGUAGE: Respond to Franky in fluent English');

    I18n.setPreference('es');
    const esInstruction = appInstance.buildAiSystemInstruction();
    expect(esInstruction).toContain('10. IDIOMA: Responde a Franky en español');
  });

  it('traduce etiquetas de recetas canónicas mediante getTagLabel() (Fase 5 - US-12 Exhaustiva)', () => {
    I18n.setPreference('es');
    expect(I18n.getTagLabel('Alta en Proteínas')).toBe('Alta en Proteínas');
    expect(I18n.getTagLabel('Desayuno')).toBe('Desayuno');
    expect(I18n.getTagLabel('Sin Gluten')).toBe('Sin Gluten');
    expect(I18n.getTagLabel('Robot de Cocina')).toBe('Robot de Cocina');

    I18n.setPreference('en');
    expect(I18n.getTagLabel('Alta en Proteínas')).toBe('High Protein');
    expect(I18n.getTagLabel('Desayuno')).toBe('Breakfast');
    expect(I18n.getTagLabel('Almuerzo')).toBe('Lunch');
    expect(I18n.getTagLabel('Merienda')).toBe('Snack');
    expect(I18n.getTagLabel('Cena')).toBe('Dinner');
    expect(I18n.getTagLabel('Sin Gluten')).toBe('Gluten-Free');
    expect(I18n.getTagLabel('Robot de Cocina')).toBe('Food Processor');
    expect(I18n.getTagLabel('Saludable')).toBe('Healthy');
    expect(I18n.getTagLabel('CustomUserTag')).toBe('CustomUserTag'); // preserves custom user tags
  });

  it('traduce nombres de slots de comida mediante getSlotLabel()', () => {
    I18n.setPreference('es');
    expect(I18n.getSlotLabel('breakfast')).toBe('Desayuno');
    expect(I18n.getSlotLabel('lunch')).toBe('Almuerzo');
    expect(I18n.getSlotLabel('snack')).toBe('Merienda');
    expect(I18n.getSlotLabel('dinner')).toBe('Cena');
    expect(I18n.getSlotLabel('custom_slot', 'Postre')).toBe('Postre');

    I18n.setPreference('en');
    expect(I18n.getSlotLabel('breakfast')).toBe('Breakfast');
    expect(I18n.getSlotLabel('lunch')).toBe('Lunch');
    expect(I18n.getSlotLabel('snack')).toBe('Snack');
    expect(I18n.getSlotLabel('dinner')).toBe('Dinner');
    expect(I18n.getSlotLabel('custom_slot', 'Dessert')).toBe('Dessert');
  });

  it('traduce nombres de días de la semana mediante getDayName()', () => {
    I18n.setPreference('es');
    expect(I18n.getDayName(0)).toBe('Lunes');
    expect(I18n.getDayName(1)).toBe('Martes');
    expect(I18n.getDayName(6)).toBe('Domingo');

    I18n.setPreference('en');
    expect(I18n.getDayName(0)).toBe('Monday');
    expect(I18n.getDayName(1)).toBe('Tuesday');
    expect(I18n.getDayName(6)).toBe('Sunday');
  });

  it('proporciona cadenas para la sección de completados en la lista de compra y desglose nutricional', () => {
    I18n.setPreference('en');
    expect(I18n.t('shopping.completedHeading', { count: 45 })).toBe('Completed (45)');
    expect(I18n.t('shopping.clearCompleted')).toBe('Clear completed');
    expect(I18n.t('common.forPrefix')).toBe('For:');
    expect(I18n.t('nutrition.breakdownTitle')).toBe("Today's Nutritional Breakdown");
    expect(I18n.t('nutrition.configureGoals')).toBe('Configure Goals');

    I18n.setPreference('es');
    expect(I18n.t('shopping.completedHeading', { count: 45 })).toBe('Completados (45)');
    expect(I18n.t('shopping.clearCompleted')).toBe('Limpiar completados');
    expect(I18n.t('common.forPrefix')).toBe('Para:');
    expect(I18n.t('nutrition.breakdownTitle')).toBe('Desglose Nutricional de Hoy');
    expect(I18n.t('nutrition.configureGoals')).toBe('Configurar Objetivos');
  });

  it('proporciona traducciones para el modal de añadir momento de comida y cuenta en la nube (Fase 6)', () => {
    I18n.setPreference('en');
    expect(I18n.t('planner.customSlotTitle')).toBe('Add Meal Slot');
    expect(I18n.t('planner.customSlotCreateBtn')).toBe('Create Meal Slot');
    expect(I18n.t('planner.presetMidMorning')).toBe('🥪 Mid-Morning');
    expect(I18n.t('planner.presetPostWorkout')).toBe('🏋️ Post-Workout');
    expect(I18n.t('settings.connectedSynced')).toBe('Connected & Synced');
    expect(I18n.t('settings.signOut')).toBe('Sign Out');
    expect(I18n.t('settings.deleteAccountAndData')).toBe('Delete my account and data');
    expect(I18n.t('settings.viewPrivacyPolicy')).toBe('View Privacy Policy');

    I18n.setPreference('es');
    expect(I18n.t('planner.customSlotTitle')).toBe('Añadir Momento de Comida');
    expect(I18n.t('planner.customSlotCreateBtn')).toBe('Crear Momento');
    expect(I18n.t('planner.presetMidMorning')).toBe('🥪 Media Mañana');
    expect(I18n.t('planner.presetPostWorkout')).toBe('🏋️ Post-Entreno');
    expect(I18n.t('settings.connectedSynced')).toBe('Conectado y Sincronizado');
    expect(I18n.t('settings.signOut')).toBe('Cerrar Sesión');
    expect(I18n.t('settings.deleteAccountAndData')).toBe('Eliminar mi cuenta y datos');
    expect(I18n.t('settings.viewPrivacyPolicy')).toBe('Consultar Política de Privacidad');
  });

  it('detecta y visualiza distintivos de idioma en recetas (Fase 7 - US-83 Distintivo de Idioma para Comunidad)', () => {
    const appPath = path.resolve(process.cwd(), 'app.js');
    const appCode = fs.readFileSync(appPath, 'utf-8');
    new Function(appCode)();

    const { detectRecipeLanguage, getRecipeLanguage, getRecipeLanguageMeta } = window;
    expect(typeof detectRecipeLanguage).toBe('function');
    expect(typeof getRecipeLanguage).toBe('function');
    expect(typeof getRecipeLanguageMeta).toBe('function');

    // Spanish recipe
    const esRecipe = {
      id: 'rec-es-1',
      title: 'Tostadas con Revuelto de Huevo y Queso Fresco',
      description: 'Deliciosa receta mediterránea para el desayuno con aceite de oliva',
      ingredients: [{ name: 'Huevos' }, { name: 'Queso fresco' }, { name: 'Aceite de oliva virgen extra' }],
      instructions: [{ text: 'Batir los huevos en un bol con sal y cocinar a fuego lento en la sartén.' }]
    };

    // English recipe
    const enRecipe = {
      id: 'rec-en-1',
      title: 'High-Protein Blueberry Oatmeal Bowl',
      description: 'Quick healthy breakfast bowl packed with antioxidants and whey protein',
      ingredients: [{ name: 'Rolled oats' }, { name: 'Blueberries' }, { name: 'Whey protein powder' }, { name: 'Almond milk' }],
      instructions: [{ text: 'Combine oats and milk in a bowl. Heat in microwave and stir in protein powder.' }]
    };

    // Explicit language overrides
    const explicitEn = { id: 'rec-3', title: 'Tortilla española', language: 'en' };
    const explicitEs = { id: 'rec-4', title: 'Pancake bowl', language: 'es' };

    expect(detectRecipeLanguage(esRecipe)).toBe('es');
    expect(detectRecipeLanguage(enRecipe)).toBe('en');
    expect(detectRecipeLanguage(explicitEn)).toBe('en');
    expect(detectRecipeLanguage(explicitEs)).toBe('es');

    expect(getRecipeLanguage(esRecipe)).toBe('es');
    expect(getRecipeLanguage(enRecipe)).toBe('en');

    const metaEs = getRecipeLanguageMeta(esRecipe);
    expect(metaEs.code).toBe('ES');
    expect(metaEs.flag).toContain('flag-es');
    expect(metaEs.flagEmoji).toBe('🇪🇸');
    expect(metaEs.label).toBe('Español');

    const metaEn = getRecipeLanguageMeta(enRecipe);
    expect(metaEn.code).toBe('EN');
    expect(metaEn.flag).toContain('flag-en');
    expect(metaEn.flagEmoji).toBe('🇬🇧');
    expect(metaEn.label).toBe('English');

    // Test card HTML rendering
    const appInstance = new window.FoodAssistantApp();
    const cardHtmlEs = appInstance.renderSingleRecipeCardHtml(esRecipe, false);
    expect(cardHtmlEs).toContain('class="recipe-lang-badge"');
    expect(cardHtmlEs).toContain('flag-es');
    expect(cardHtmlEs).toContain('ES');

    const cardHtmlEn = appInstance.renderSingleRecipeCardHtml(enRecipe, false);
    expect(cardHtmlEn).toContain('class="recipe-lang-badge"');
    expect(cardHtmlEn).toContain('flag-en');
    expect(cardHtmlEn).toContain('EN');
  });

  it('traduce completamente la revisión de recetas importadas y el editor de recetas en ES y EN', () => {
    // English verification
    I18n.setPreference('en');
    expect(I18n.t('import.analyzing')).toBe('Analyzing recipe with AI and extracting ingredients...');
    expect(I18n.t('import.reviewTitle')).toBe('Imported Recipe Review (Draft)');
    expect(I18n.t('import.draftBadge')).toBe('Draft');
    expect(I18n.t('import.sourcePrefix')).toBe('Source');
    expect(I18n.t('import.saveToRecipes')).toBe('Save to Recipes');
    expect(I18n.t('import.editRecipe')).toBe('Edit recipe');
    expect(I18n.t('import.cancelImport')).toBe('Cancel import');

    expect(I18n.t('recipes.editRecipeTitle')).toBe('Edit Recipe');
    expect(I18n.t('recipes.newRecipeTitle')).toBe('New Recipe');
    expect(I18n.t('recipes.titleLabel')).toBe('Recipe Title');
    expect(I18n.t('recipes.photoLabel')).toBe('Dish Photo (Optional)');
    expect(I18n.t('recipes.galleryBtn')).toBe('Gallery');
    expect(I18n.t('recipes.cameraBtn')).toBe('Camera');
    expect(I18n.t('recipes.removePhotoBtn')).toBe('Remove photo');
    expect(I18n.t('recipes.macrosPerServing')).toBe('Macronutrients per serving');
    expect(I18n.t('recipes.recalculateBtn')).toBe('Recalculate');
    expect(I18n.t('recipes.tagsLabel')).toBe('Tags & Dietary Categories');
    expect(I18n.t('recipes.catDietHealth')).toBe('🌱 Diet & Health');
    expect(I18n.t('recipes.catMealTime')).toBe('🍽️ Meal Time');
    expect(I18n.t('recipes.catMethodPractical')).toBe('⚡ Method & Practical');
    expect(I18n.t('recipes.saveRecipeBtn')).toBe('Save Recipe');
    expect(I18n.t('recipes.addIngredientBtn')).toBe('Add Ingredient');
    expect(I18n.t('recipes.instructionsTitle')).toBe('Preparation Steps');
    expect(I18n.t('recipes.addStepBtn')).toBe('Add Step');

    // Spanish verification
    I18n.setPreference('es');
    expect(I18n.t('import.analyzing')).toBe('Analizando receta con IA y extrayendo ingredientes...');
    expect(I18n.t('import.reviewTitle')).toBe('Revisión de Receta Importada (Borrador)');
    expect(I18n.t('import.draftBadge')).toBe('Borrador');
    expect(I18n.t('import.sourcePrefix')).toBe('Fuente');
    expect(I18n.t('import.saveToRecipes')).toBe('Guardar en Recetas');
    expect(I18n.t('import.editRecipe')).toBe('Editar receta');
    expect(I18n.t('import.cancelImport')).toBe('Cancelar importación');
    expect(I18n.t('recipes.editRecipeTitle')).toBe('Editar Receta');
    expect(I18n.t('recipes.newRecipeTitle')).toBe('Nueva Receta');
    expect(I18n.t('recipes.titleLabel')).toBe('Título de la Receta');
  });

  it('traduce las etiquetas de macronutrientes en la tarjeta compacta de recetas y actualiza el selector de idioma con banderas SVG', () => {
    const appPath = path.resolve(process.cwd(), 'app.js');
    const appCode = fs.readFileSync(appPath, 'utf-8');
    new Function(appCode)();

    const recipeWithMacros = {
      id: 'rec-test-macros-i18n',
      title: 'Healthy Chicken Salad',
      description: 'Tasty salad',
      imageUrl: '',
      prepTimeMinutes: 10,
      cookTimeMinutes: 5,
      nutrition: { calories: 350, protein: 32, carbs: 12, fat: 14 }
    };

    const appInstance = new window.FoodAssistantApp();

    // In Spanish
    I18n.setPreference('es');
    const htmlEs = appInstance.renderSingleRecipeCardHtml(recipeWithMacros, true);
    expect(htmlEs).toContain('<span class="card-macro-lbl">Calorías</span>');
    expect(htmlEs).toContain('<span class="card-macro-lbl">Proteínas</span>');
    expect(htmlEs).toContain('<span class="card-macro-lbl">Carbos</span>');
    expect(htmlEs).toContain('<span class="card-macro-lbl">Grasas</span>');

    // In English
    I18n.setPreference('en');
    const htmlEn = appInstance.renderSingleRecipeCardHtml(recipeWithMacros, true);
    expect(htmlEn).toContain('<span class="card-macro-lbl">Calories</span>');
    expect(htmlEn).toContain('<span class="card-macro-lbl">Protein</span>');
    expect(htmlEn).toContain('<span class="card-macro-lbl">Carbs</span>');
    expect(htmlEn).toContain('<span class="card-macro-lbl">Fats</span>');

    // Test custom recipe language selector sync
    const flagEl = document.getElementById('edit-recipe-lang-flag') || (() => {
      const el = document.createElement('span');
      el.id = 'edit-recipe-lang-flag';
      document.body.appendChild(el);
      return el;
    })();
    const labelEl = document.getElementById('edit-recipe-lang-label') || (() => {
      const el = document.createElement('span');
      el.id = 'edit-recipe-lang-label';
      document.body.appendChild(el);
      return el;
    })();
    const selectEl = document.getElementById('edit-recipe-language') || (() => {
      const el = document.createElement('select');
      el.id = 'edit-recipe-language';
      el.innerHTML = '<option value="es">Español</option><option value="en">English</option>';
      document.body.appendChild(el);
      return el;
    })();

    appInstance.syncRecipeEditorLanguageUI('en');
    expect(flagEl.className).toContain('flag-en');
    expect(labelEl.textContent).toBe('English');
    expect(selectEl.value).toBe('en');

    appInstance.syncRecipeEditorLanguageUI('es');
    expect(flagEl.className).toContain('flag-es');
    expect(labelEl.textContent).toBe('Español');
    expect(selectEl.value).toBe('es');
  });

  it('traduce las etiquetas dietéticas en ajustes y onboarding, proveedor de IA, estado del agente y sincronización', () => {
    const appPath = path.resolve(process.cwd(), 'app.js');
    const appCode = fs.readFileSync(appPath, 'utf-8');
    new Function(appCode)();

    const appInstance = new window.FoodAssistantApp();

    // 1. Dietary chips in English
    I18n.setPreference('en');
    const settingsDietaryContainer = document.getElementById('settings-dietary-chips') || (() => {
      const el = document.createElement('div');
      el.id = 'settings-dietary-chips';
      document.body.appendChild(el);
      return el;
    })();

    appInstance.renderDietaryPreferencesSettings();
    expect(settingsDietaryContainer.textContent).toContain('Vegan');
    expect(settingsDietaryContainer.textContent).toContain('Vegetarian');
    expect(settingsDietaryContainer.textContent).toContain('Gluten-Free');
    expect(settingsDietaryContainer.textContent).toContain('Lactose-Free');
    expect(settingsDietaryContainer.textContent).toContain('Low Carb');
    expect(settingsDietaryContainer.textContent).toContain('High Protein');

    // Onboarding chips in English
    const onboardingDietaryContainer = document.getElementById('onboarding-dietary-chips') || (() => {
      const el = document.createElement('div');
      el.id = 'onboarding-dietary-chips';
      document.body.appendChild(el);
      return el;
    })();

    appInstance.renderOnboardingDietaryChips();
    expect(onboardingDietaryContainer.textContent).toContain('Vegan');
    expect(onboardingDietaryContainer.textContent).toContain('Gluten-Free');

    // 2. In Spanish
    I18n.setPreference('es');
    appInstance.renderDietaryPreferencesSettings();
    expect(settingsDietaryContainer.textContent).toContain('Vegano');
    expect(settingsDietaryContainer.textContent).toContain('Sin Gluten');

    appInstance.renderOnboardingDietaryChips();
    expect(onboardingDietaryContainer.textContent).toContain('Vegano');
    expect(onboardingDietaryContainer.textContent).toContain('Sin Gluten');

    // 3. AI Provider translations
    expect(I18n.t('settings.aiOptGemini')).toBe('Google Gemini (Gratuito hasta 1.500 req/día)');
    I18n.setPreference('en');
    expect(I18n.t('settings.aiOptGemini')).toBe('Google Gemini (Free up to 1,500 req/day)');
    expect(I18n.t('settings.syncedAt')).toBe('Synced at');

    // 4. External Agent Guide in English
    const guideEl = document.getElementById('external-agent-guide') || (() => {
      const el = document.createElement('pre');
      el.id = 'external-agent-guide';
      document.body.appendChild(el);
      return el;
    })();
    const statusEl = document.getElementById('external-agent-status') || (() => {
      const el = document.createElement('div');
      el.id = 'external-agent-status';
      document.body.appendChild(el);
      return el;
    })();

    appInstance.renderExternalAgentSettings();
    expect(guideEl.textContent).toContain('# 1) Natural language command');
    expect(guideEl.textContent).toContain('Add milk and avocados to the shopping list');

    I18n.setPreference('es');
    appInstance.renderExternalAgentSettings();
    expect(guideEl.textContent).toContain('# 1) Comando en lenguaje natural');
    expect(guideEl.textContent).toContain('Añade leche y aguacates a la compra');
  });

  it('traduce slots vacíos del planificador y modal selector de recetas (v1.67)', () => {
    const appPath = path.resolve(process.cwd(), 'app.js');
    const appCode = fs.readFileSync(appPath, 'utf-8');
    new Function(appCode)();

    const appInstance = new window.FoodAssistantApp();

    // 1. In English
    I18n.setPreference('en');
    expect(I18n.t('planner.assignDish')).toBe('Assign dish');
    expect(I18n.t('picker.chooseBtn')).toBe('Select');
    expect(I18n.t('picker.recipesAvailable', { count: 832 })).toBe('832 recipes available');
    expect(I18n.t('picker.titleForSlot', { slot: 'BREAKFAST' })).toBe('Select dish for BREAKFAST');

    const emptySlotHtmlEn = appInstance.renderSlotCard('2026-11-09', 'breakfast', 'Breakfast', 'wb_twilight', null);
    expect(emptySlotHtmlEn).toContain('Assign dish');
    expect(emptySlotHtmlEn).not.toContain('Asignar plato');

    // 2. In Spanish
    I18n.setPreference('es');
    expect(I18n.t('planner.assignDish')).toBe('Asignar plato');
    expect(I18n.t('picker.chooseBtn')).toBe('Elegir');
    expect(I18n.t('picker.recipesAvailable', { count: 832 })).toBe('832 recetas disponibles');
    expect(I18n.t('picker.titleForSlot', { slot: 'DESAYUNO' })).toBe('Elegir plato para DESAYUNO');

    const emptySlotHtmlEs = appInstance.renderSlotCard('2026-11-09', 'breakfast', 'Desayuno', 'wb_twilight', null);
    expect(emptySlotHtmlEs).toContain('Asignar plato');
  });

  it('actualiza botón Expandir/Plegar semana respetando el idioma sin flash de español (v1.69)', () => {
    const appPath = path.resolve(process.cwd(), 'app.js');
    const appCode = fs.readFileSync(appPath, 'utf-8');
    new Function(appCode)();

    const appInstance = new window.FoodAssistantApp();
    const btnLabel = document.getElementById('btn-toggle-all-planner-days-label') || (() => {
      const el = document.createElement('span');
      el.id = 'btn-toggle-all-planner-days-label';
      document.body.appendChild(el);
      return el;
    })();

    const mockWeek = [
      { dateKey: '2026-11-09', date: new Date('2026-11-09') },
      { dateKey: '2026-11-10', date: new Date('2026-11-10') }
    ];

    // 1. In English
    I18n.setPreference('en');
    appInstance.plannerExpandedDays = new Set(['2026-11-09']); // Not all expanded
    appInstance.updateToggleAllPlannerButtonLabel(mockWeek);
    expect(btnLabel.textContent).toBe('Expand week');
    expect(btnLabel.getAttribute('data-i18n')).toBe('planner.expandWeek');

    appInstance.plannerExpandedDays = new Set(['2026-11-09', '2026-11-10']); // All expanded
    appInstance.updateToggleAllPlannerButtonLabel(mockWeek);
    expect(btnLabel.textContent).toBe('Collapse week');
    expect(btnLabel.getAttribute('data-i18n')).toBe('planner.collapseWeek');

    // 2. In Spanish
    I18n.setPreference('es');
    appInstance.plannerExpandedDays = new Set(['2026-11-09']);
    appInstance.updateToggleAllPlannerButtonLabel(mockWeek);
    expect(btnLabel.textContent).toBe('Expandir semana');

    appInstance.plannerExpandedDays = new Set(['2026-11-09', '2026-11-10']);
    appInstance.updateToggleAllPlannerButtonLabel(mockWeek);
    expect(btnLabel.textContent).toBe('Plegar semana');
  });

  it('no sobreescribe el perfil de usuario logado al ejecutar applyTranslations o cambiar vista (v1.70)', () => {
    const appPath = path.resolve(process.cwd(), 'app.js');
    const appCode = fs.readFileSync(appPath, 'utf-8');
    new Function(appCode)();

    const appInstance = new window.FoodAssistantApp();

    const pillText = document.getElementById('header-account-text') || (() => {
      const el = document.createElement('span');
      el.id = 'header-account-text';
      document.body.appendChild(el);
      return el;
    })();

    const settingsName = document.getElementById('settings-user-name') || (() => {
      const el = document.createElement('div');
      el.id = 'settings-user-name';
      document.body.appendChild(el);
      return el;
    })();

    const settingsStatus = document.getElementById('settings-user-status') || (() => {
      const el = document.createElement('div');
      el.id = 'settings-user-status';
      document.body.appendChild(el);
      return el;
    })();

    const settingsAuthBtn = document.getElementById('btn-settings-auth-action') || (() => {
      const el = document.createElement('button');
      el.id = 'btn-settings-auth-action';
      document.body.appendChild(el);
      return el;
    })();

    I18n.setPreference('en');

    // 1. Simular usuario autenticado en state
    appInstance.supabaseClient = { auth: {} };
    state.cloudUser = {
      id: 'usr_test_123',
      name: 'Franky J Cerrudo',
      email: 'franky@example.com',
      provider: 'google'
    };

    appInstance.updateUserAccountUI();

    expect(pillText.textContent).toBe('Franky');
    expect(pillText.hasAttribute('data-i18n')).toBe(false);
    expect(settingsName.textContent).toBe('Franky J Cerrudo');
    expect(settingsName.hasAttribute('data-i18n')).toBe(false);
    expect(settingsStatus.textContent).toContain('Supabase (google)');
    expect(settingsStatus.hasAttribute('data-i18n')).toBe(false);
    expect(settingsAuthBtn.getAttribute('data-i18n')).toBe('settings.viewAccount');

    // 2. Ejecutar applyTranslations directamente (como ocurre al refrescar o al re-renderizar)
    I18n.applyTranslations();

    // El usuario debe PERMANECER con sus datos reales y NO revertirse a Sign In / Local Mode
    expect(pillText.textContent).toBe('Franky');
    expect(settingsName.textContent).toBe('Franky J Cerrudo');
    expect(settingsAuthBtn.textContent).toBe('View Account');

    // 3. Simular logout a modo invitado
    state.cloudUser = null;
    appInstance.updateUserAccountUI();

    expect(pillText.getAttribute('data-i18n')).toBe('settings.signIn');
    expect(pillText.textContent).toBe('Sign In');
    expect(settingsName.getAttribute('data-i18n')).toBe('settings.localMode');
    expect(settingsName.textContent).toBe('Local Mode (Guest)');
    expect(settingsAuthBtn.getAttribute('data-i18n')).toBe('settings.signIn');
    expect(settingsAuthBtn.textContent).toBe('Sign In');
  });
});
