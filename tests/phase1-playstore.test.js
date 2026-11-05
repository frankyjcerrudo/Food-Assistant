import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Evaluate app.js in happy-dom
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const {
  FoodAssistantApp,
  state,
  getCanonicalIngredientKey,
  normalizeAndConvertUnit,
  mergeShoppingQuantities,
  mergeOrAddShoppingItem
} = window;

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

// ==========================================================================
// US-33: NORMALIZACIÓN, CONVERSIÓN DE UNIDADES Y VISTAS DE LA LISTA DE LA COMPRA
// ==========================================================================
describe('US-33: Normalización y conversión de unidades en la lista de la compra', () => {
  it('getCanonicalIngredientKey unifica singular/plural, mayúsculas y acentos', () => {
    expect(getCanonicalIngredientKey('Tomates')).toBe(getCanonicalIngredientKey('tomate'));
    expect(getCanonicalIngredientKey('Limones')).toBe(getCanonicalIngredientKey('limón'));
    expect(getCanonicalIngredientKey('Nueces')).toBe(getCanonicalIngredientKey('nuez'));
    expect(getCanonicalIngredientKey('Champiñones')).toBe(getCanonicalIngredientKey('champiñón'));
    expect(getCanonicalIngredientKey('Pechugas de pollo')).toBe(getCanonicalIngredientKey('pechuga de pollo'));
    expect(getCanonicalIngredientKey('')).toBe('');
  });

  it('getCanonicalIngredientKey no confunde ingredientes distintos', () => {
    expect(getCanonicalIngredientKey('Tomate')).not.toBe(getCanonicalIngredientKey('Patata'));
    expect(getCanonicalIngredientKey('Cuscús')).toBe('cuscus');
  });

  it('normalizeAndConvertUnit convierte masa (g ↔ kg)', () => {
    expect(normalizeAndConvertUnit(1500, 'g')).toMatchObject({ amount: 1.5, unit: 'kg', baseAmount: 1500, dimension: 'mass' });
    expect(normalizeAndConvertUnit(0.5, 'kg')).toMatchObject({ amount: 500, unit: 'g', baseAmount: 500, dimension: 'mass' });
    expect(normalizeAndConvertUnit(250, 'gramos')).toMatchObject({ amount: 250, unit: 'g' });
  });

  it('normalizeAndConvertUnit convierte volumen (ml / cl / dl / l)', () => {
    expect(normalizeAndConvertUnit(25, 'cl')).toMatchObject({ amount: 250, unit: 'ml', baseAmount: 250, dimension: 'volume' });
    expect(normalizeAndConvertUnit(1200, 'ml')).toMatchObject({ amount: 1.2, unit: 'l', dimension: 'volume' });
    expect(normalizeAndConvertUnit(2, 'litros')).toMatchObject({ amount: 2, unit: 'l', baseAmount: 2000 });
    expect(normalizeAndConvertUnit(3, 'dl')).toMatchObject({ amount: 300, unit: 'ml' });
  });

  it('normalizeAndConvertUnit reconoce unidades contables y personalizadas', () => {
    expect(normalizeAndConvertUnit(3, 'unidades')).toMatchObject({ dimension: 'count', unit: 'ud' });
    expect(normalizeAndConvertUnit(2, 'cucharadas')).toMatchObject({ dimension: 'custom', unit: 'cda' });
    expect(normalizeAndConvertUnit(null, 'al gusto')).toMatchObject({ amount: null, baseAmount: null });
  });

  it('mergeShoppingQuantities suma unidades compatibles con conversión automática', () => {
    expect(mergeShoppingQuantities(500, 'g', 0.75, 'kg')).toEqual({ compatible: true, amount: 1.25, unit: 'kg' });
    expect(mergeShoppingQuantities(200, 'g', 300, 'g')).toEqual({ compatible: true, amount: 500, unit: 'g' });
    expect(mergeShoppingQuantities(50, 'cl', 500, 'ml')).toEqual({ compatible: true, amount: 1, unit: 'l' });
    expect(mergeShoppingQuantities(2, 'ud', 3, '')).toEqual({ compatible: true, amount: 5, unit: 'ud' });
    expect(mergeShoppingQuantities(1, 'cda', 2, 'cucharadas')).toEqual({ compatible: true, amount: 3, unit: 'cda' });
  });

  it('mergeShoppingQuantities rechaza dimensiones incompatibles (masa vs unidades / masa vs volumen)', () => {
    expect(mergeShoppingQuantities(500, 'g', 3, 'ud').compatible).toBe(false);
    expect(mergeShoppingQuantities(500, 'g', 1, 'l').compatible).toBe(false);
    expect(mergeShoppingQuantities(1, 'lata', 2, 'bote').compatible).toBe(false);
  });

  it('mergeOrAddShoppingItem fusiona plural/singular con conversión y acumula recetas de origen', () => {
    const list = [{ name: 'Tomates', amount: 500, unit: 'g', aisle: 'produce', isChecked: false, recipeOrigin: 'Ensalada' }];
    mergeOrAddShoppingItem(list, { name: 'tomate', amount: 0.75, unit: 'kg', aisle: 'produce', recipeOrigin: 'Gazpacho' });

    expect(list).toHaveLength(1);
    expect(list[0].amount).toBe(1.25);
    expect(list[0].unit).toBe('kg');
    expect(list[0].recipeOrigin).toBe('Ensalada, Gazpacho');
  });

  it('mergeOrAddShoppingItem mantiene líneas separadas para unidades incompatibles', () => {
    const list = [{ name: 'Tomates', amount: 500, unit: 'g', aisle: 'produce', isChecked: false }];
    mergeOrAddShoppingItem(list, { name: 'Tomate', amount: 3, unit: 'ud', aisle: 'produce' });
    expect(list).toHaveLength(2);
    expect(list[1]).toMatchObject({ name: 'Tomate', amount: 3, unit: 'ud' });
  });

  it('mergeOrAddShoppingItem no fusiona con artículos ya marcados como comprados', () => {
    const list = [{ name: 'Leche', amount: 1, unit: 'l', aisle: 'dairy', isChecked: true }];
    mergeOrAddShoppingItem(list, { name: 'Leche', amount: 500, unit: 'ml', aisle: 'dairy' });
    expect(list).toHaveLength(2);
    expect(list[0].amount).toBe(1);
  });

  it('mergeOrAddShoppingItem completa el pasillo si el existente era "other"', () => {
    const list = [{ name: 'Arroz', amount: 200, unit: 'g', aisle: 'other', isChecked: false }];
    mergeOrAddShoppingItem(list, { name: 'arroz', amount: 300, unit: 'g', aisle: 'pantry' });
    expect(list).toHaveLength(1);
    expect(list[0].aisle).toBe('pantry');
    expect(list[0].amount).toBe(500);
  });
});

describe('US-33: Alternancia de vistas Por Pasillos / Por Receta', () => {
  let appInstance;
  let originalList;

  beforeEach(() => {
    localStorage.removeItem('fa_shopping_view_mode');
    document.body.innerHTML = `
      <div id="shopping-view-toggle">
        <button id="btn-shopping-view-aisle" data-action="setShoppingViewMode" data-mode="aisle"></button>
        <button id="btn-shopping-view-recipe" data-action="setShoppingViewMode" data-mode="recipe"></button>
      </div>
      <div id="shopping-summary-text"></div>
      <div id="shopping-aisles-container"></div>
    `;
    appInstance = new FoodAssistantApp();
    originalList = state.shoppingList;
    state.shoppingList = [
      { name: 'Tomate', amount: 1, unit: 'kg', aisle: 'produce', isChecked: false, recipeOrigin: 'Gazpacho, Ensalada' },
      { name: 'Pan', amount: 1, unit: 'ud', aisle: 'bakery', isChecked: false, recipeOrigin: 'Gazpacho' },
      { name: 'Detergente', amount: 1, unit: 'ud', aisle: 'other', isChecked: false }
    ];
  });

  afterEach(() => {
    state.shoppingList = originalList;
    localStorage.removeItem('fa_shopping_view_mode');
  });

  it('por defecto renderiza la vista agrupada por pasillos', () => {
    appInstance.setShoppingViewMode('aisle');
    const container = document.getElementById('shopping-aisles-container');
    expect(container.querySelectorAll('.aisle-card').length).toBe(3);
    expect(container.querySelector('.recipe-shopping-card')).toBeNull();
    expect(document.getElementById('btn-shopping-view-aisle').getAttribute('aria-pressed')).toBe('true');
    expect(document.getElementById('btn-shopping-view-recipe').getAttribute('aria-pressed')).toBe('false');
  });

  it('la vista Por Receta agrupa por receta de origen (un artículo puede aparecer en varias) y persiste la preferencia', () => {
    appInstance.setShoppingViewMode({ mode: 'recipe' });
    const container = document.getElementById('shopping-aisles-container');
    const groups = Array.from(container.querySelectorAll('.recipe-shopping-card')).map(el => el.dataset.recipeGroup);

    expect(groups).toEqual(expect.arrayContaining(['Gazpacho', 'Ensalada', 'Añadido manualmente']));
    const gazpacho = container.querySelector('[data-recipe-group="Gazpacho"]');
    expect(gazpacho.querySelectorAll('.grocery-item-row').length).toBe(2);
    expect(localStorage.getItem('fa_shopping_view_mode')).toBe('recipe');
    expect(document.getElementById('btn-shopping-view-recipe').classList.contains('active')).toBe(true);
  });

  it('valores desconocidos vuelven a la vista por pasillos', () => {
    appInstance.setShoppingViewMode('foo');
    expect(appInstance.shoppingViewMode).toBe('aisle');
  });
});

// ==========================================================================
// US-60: PANTALLA SIEMPRE ENCENDIDA (RECETA ABIERTA + MODO COCINA)
// ==========================================================================
describe('US-60: Screen Wake Lock con receta abierta y en Modo Cocina', () => {
  let appInstance;
  let requestMock;
  let sentinels;

  const createSentinel = () => {
    const listeners = {};
    const sentinel = {
      released: false,
      addEventListener: (evt, cb) => { listeners[evt] = cb; },
      release: vi.fn(async () => {
        sentinel.released = true;
        if (listeners.release) listeners.release();
      })
    };
    return sentinel;
  };

  beforeEach(() => {
    sentinels = [];
    requestMock = vi.fn(async () => {
      const s = createSentinel();
      sentinels.push(s);
      return s;
    });
    Object.defineProperty(navigator, 'wakeLock', {
      configurable: true,
      value: { request: requestMock }
    });

    document.body.innerHTML = `
      <div class="modal-overlay" id="modal-recipe-detail">
        <span id="recipe-wake-lock-badge" class="wake-lock-badge is-hidden"></span>
        <div id="recipe-detail-normal-actions"></div>
        <div id="recipe-detail-review-actions"></div>
        <div id="recipe-modal-body"></div>
      </div>
      <div class="cook-mode-overlay" id="cook-mode-overlay">
        <span id="cook-wake-lock-badge" class="wake-lock-badge is-hidden"></span>
      </div>
    `;
    appInstance = new FoodAssistantApp();
  });

  afterEach(() => {
    delete navigator.wakeLock;
  });

  it('no solicita Wake Lock si no hay receta abierta ni Modo Cocina', async () => {
    const result = await appInstance.requestScreenWakeLock();
    expect(result).toBeNull();
    expect(requestMock).not.toHaveBeenCalled();
  });

  it('solicita "screen" Wake Lock con la ficha de receta abierta y muestra el indicador', async () => {
    appInstance.modalRecipeDetail.classList.add('active');
    await appInstance.requestScreenWakeLock();

    expect(requestMock).toHaveBeenCalledWith('screen');
    expect(appInstance.isWakeLockActive).toBe(true);
    expect(document.getElementById('recipe-wake-lock-badge').classList.contains('is-hidden')).toBe(false);
  });

  it('libera el Wake Lock al cerrar la receta', async () => {
    appInstance.modalRecipeDetail.classList.add('active');
    await appInstance.requestScreenWakeLock();

    appInstance.closeRecipeModal();
    await flushPromises();

    expect(sentinels[0].release).toHaveBeenCalled();
    expect(appInstance.isWakeLockActive).toBe(false);
    expect(document.getElementById('recipe-wake-lock-badge').classList.contains('is-hidden')).toBe(true);
  });

  it('mantiene el mismo Wake Lock al pasar de la receta al Modo Cocina y lo libera al salir', async () => {
    appInstance.modalRecipeDetail.classList.add('active');
    await appInstance.requestScreenWakeLock();

    appInstance.activeRecipe = { id: 'rec-1', title: 'Tortilla', instructions: ['Batir huevos', 'Cuajar'] };
    vi.spyOn(appInstance, 'renderCookStep').mockImplementation(() => {});
    appInstance.startCookMode();
    await flushPromises();

    expect(appInstance.cookModeOverlay.classList.contains('active')).toBe(true);
    expect(sentinels[0].release).not.toHaveBeenCalled();
    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(document.getElementById('cook-wake-lock-badge').classList.contains('is-hidden')).toBe(false);

    appInstance.exitCookMode();
    await flushPromises();
    expect(sentinels[0].release).toHaveBeenCalled();
    expect(appInstance.isWakeLockActive).toBe(false);
  });

  it('readquiere el Wake Lock tras liberarlo el sistema (pestaña oculta → visible)', async () => {
    appInstance.modalRecipeDetail.classList.add('active');
    await appInstance.requestScreenWakeLock();
    // El navegador libera el sentinel automáticamente al ocultar la pestaña
    await sentinels[0].release();
    expect(appInstance.isWakeLockActive).toBe(false);

    await appInstance.requestScreenWakeLock();
    expect(requestMock).toHaveBeenCalledTimes(2);
    expect(appInstance.isWakeLockActive).toBe(true);
  });

  it('libera inmediatamente si la receta se cierra mientras la petición está en vuelo', async () => {
    appInstance.modalRecipeDetail.classList.add('active');
    const pending = appInstance.requestScreenWakeLock();
    appInstance.modalRecipeDetail.classList.remove('active');
    const result = await pending;

    expect(result).toBeNull();
    expect(sentinels[0].release).toHaveBeenCalled();
    expect(appInstance.wakeLockSentinel).toBeFalsy();
  });

  it('degrada con elegancia si la API no está disponible o es rechazada', async () => {
    appInstance.modalRecipeDetail.classList.add('active');
    requestMock.mockRejectedValueOnce(new Error('NotAllowedError'));
    expect(await appInstance.requestScreenWakeLock()).toBeNull();
    expect(appInstance.isWakeLockActive).toBe(false);

    delete navigator.wakeLock;
    expect(await appInstance.requestScreenWakeLock()).toBeNull();
  });
});

// ==========================================================================
// US-70: RECETAS FAVORITAS
// ==========================================================================
describe('US-70: Recetas Favoritas y ponderación en el Asistente IA', () => {
  let appInstance;
  let originalRecipes;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="btn-detail-favorite-recipe" aria-pressed="false"></button>
      <div id="recipes-tag-filters"></div>
      <input id="recipes-search-input" value="">
      <div id="recipes-grid"></div>
    `;
    appInstance = new FoodAssistantApp();
    originalRecipes = state.recipes;
    state.recipes = [
      { id: 'rec-a', title: 'Lentejas', tags: ['Comida'], ingredients: [{ name: 'Lentejas' }], instructions: ['Cocer'], isFavorite: false },
      { id: 'rec-b', title: 'Tortilla', tags: ['Cena'], ingredients: [{ name: 'Huevos' }], instructions: ['Batir'], isFavorite: true },
      { id: 'rec-c', title: 'Gazpacho', tags: ['Comida'], ingredients: [{ name: 'Tomate' }], instructions: ['Triturar'] }
    ];
    vi.spyOn(appInstance, 'scheduleSyncWithCloud').mockImplementation(() => {});
    vi.spyOn(appInstance, 'showToast').mockImplementation(() => {});
  });

  afterEach(() => {
    state.recipes = originalRecipes;
  });

  it('toggleRecipeFavorite alterna isFavorite y persiste la receta', () => {
    const saveSpy = vi.spyOn(state, 'save');
    appInstance.toggleRecipeFavorite('rec-a');
    expect(state.recipes[0].isFavorite).toBe(true);
    expect(saveSpy).toHaveBeenCalledWith('fa_recipes', state.recipes);

    appInstance.toggleRecipeFavorite({ recipeId: 'rec-a' });
    expect(state.recipes[0].isFavorite).toBe(false);
    saveSpy.mockRestore();
  });

  it('toggleActiveRecipeFavorite sincroniza el botón de la ficha (aria-pressed)', () => {
    appInstance.activeRecipe = { ...state.recipes[0] };
    appInstance.toggleActiveRecipeFavorite();

    const btn = document.getElementById('btn-detail-favorite-recipe');
    expect(appInstance.activeRecipe.isFavorite).toBe(true);
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.classList.contains('active')).toBe(true);
  });

  it('el chip "Favoritas" filtra solo recetas marcadas', () => {
    const gridSpy = vi.spyOn(appInstance, 'renderRecipesGrid').mockImplementation(() => {});
    appInstance.selectedRecipeTags = new Set(['Favoritas']);
    appInstance.applyRecipeFilters('');

    const filtered = gridSpy.mock.calls.at(-1)[0];
    expect(filtered.map(r => r.id)).toEqual(['rec-b']);
  });

  it('el chip Favoritas se combina con otras etiquetas (lógica AND)', () => {
    const gridSpy = vi.spyOn(appInstance, 'renderRecipesGrid').mockImplementation(() => {});
    state.recipes[0].isFavorite = true;
    appInstance.selectedRecipeTags = new Set(['Favoritas', 'Comida']);
    appInstance.applyRecipeFilters('');

    const filtered = gridSpy.mock.calls.at(-1)[0];
    expect(filtered.map(r => r.id)).toEqual(['rec-a']);
  });

  it('el chip de filtro se renderiza con su contador y sin desplazar el botón de nevera', () => {
    appInstance.initRecipeTagFilters();
    const container = document.getElementById('recipes-tag-filters');
    const favChip = document.getElementById('btn-filter-favorites');
    expect(favChip).not.toBeNull();
    expect(favChip.textContent).toContain('Favoritas (1)');
    const firstBtn = container.querySelector('button');
    expect(firstBtn.id).toBe('btn-toggle-fridge-panel');
  });

  it('las tarjetas del catálogo incluyen el botón de corazón accesible', () => {
    const html = appInstance.renderSingleRecipeCardHtml(state.recipes[1]);
    expect(html).toContain('recipe-fav-btn');
    expect(html).toContain('aria-pressed="true"');
  });

  it('buildAiSystemInstruction marca las favoritas y añade la regla de ponderación', () => {
    const instruction = appInstance.buildAiSystemInstruction('¿Qué ceno hoy?');
    expect(instruction).toContain('❤️ FAVORITA: Sí');
    expect(instruction).toMatch(/PONDERACIÓN INTELIGENTE DE RECETAS FAVORITAS/);
    const lentejasLine = instruction.split('\n').find(l => l.includes('"Lentejas"'));
    if (lentejasLine) expect(lentejasLine).not.toContain('FAVORITA');
  });
});

// ==========================================================================
// US-68: ONBOARDING WIZARD
// ==========================================================================
describe('US-68: Asistente de Bienvenida (Onboarding Wizard)', () => {
  let appInstance;
  let snapshot;

  const onboardingDom = `
    <dialog class="modal-overlay" id="modal-onboarding">
      <div id="onboarding-step-dots">
        ${[1, 2, 3, 4, 5].map(i => `<span class="onboarding-dot" data-step="${i}"></span>`).join('')}
      </div>
      ${[1, 2, 3, 4, 5].map(i => `<section id="onboarding-step-${i}" class="onboarding-step"></section>`).join('')}
      <p id="onboarding-account-status-text"></p>
      <button id="btn-onboarding-connect-account"></button>
      <div id="onboarding-dietary-chips"></div>
      <input type="checkbox" id="onboarding-goals-enabled">
      <div id="onboarding-goal-presets">
        <button class="onboarding-preset-btn" data-preset="deficit"></button>
        <button class="onboarding-preset-btn" data-preset="balanced"></button>
        <button class="onboarding-preset-btn" data-preset="protein"></button>
      </div>
      <input id="onboarding-goal-calories" type="number">
      <input id="onboarding-goal-protein" type="number">
      <input id="onboarding-goal-carbs" type="number">
      <input id="onboarding-goal-fat" type="number">
      <div id="onboarding-servings-grid">
        ${[1, 2, 3, 4].map(n => `<button class="onboarding-serving-card" data-servings="${n}"></button>`).join('')}
      </div>
      <div id="onboarding-summary-box"></div>
      <button id="btn-onboarding-prev"></button>
      <button id="btn-onboarding-next"></button>
      <button id="btn-onboarding-finish"></button>
    </dialog>
  `;

  beforeEach(() => {
    localStorage.removeItem('fa_onboarding_completed');
    document.body.innerHTML = onboardingDom;
    appInstance = new FoodAssistantApp();
    snapshot = {
      dietaryPreferences: state.dietaryPreferences,
      nutritionGoals: state.nutritionGoals,
      settings: state.settings ? JSON.parse(JSON.stringify(state.settings)) : state.settings,
      defaultServings: state.defaultServings
    };
    state.dietaryPreferences = [];
    vi.spyOn(appInstance, 'render').mockImplementation(() => {});
    vi.spyOn(appInstance, 'scheduleSyncWithCloud').mockImplementation(() => {});
    vi.spyOn(appInstance, 'showToast').mockImplementation(() => {});
    vi.spyOn(appInstance, 'openDialogModal').mockImplementation(el => el.classList.add('active'));
    vi.spyOn(appInstance, 'closeDialogModal').mockImplementation(el => el.classList.remove('active'));
  });

  afterEach(() => {
    Object.assign(state, snapshot);
    localStorage.removeItem('fa_onboarding_completed');
  });

  const isModalOpen = () => document.getElementById('modal-onboarding').classList.contains('active');
  const visibleStep = () => [1, 2, 3, 4, 5].find(i => !document.getElementById(`onboarding-step-${i}`).classList.contains('is-hidden'));

  it('se lanza automáticamente en el primer acceso', () => {
    expect(appInstance.checkAndLaunchOnboarding()).toBe(true);
    expect(isModalOpen()).toBe(true);
    expect(visibleStep()).toBe(1);
    expect(document.getElementById('btn-onboarding-prev').classList.contains('is-hidden')).toBe(true);
  });

  it('no se lanza si el usuario ya completó u omitió la guía', () => {
    localStorage.setItem('fa_onboarding_completed', 'true');
    expect(appInstance.checkAndLaunchOnboarding()).toBe(false);
    expect(isModalOpen()).toBe(false);
  });

  it('navega entre los 5 pasos mostrando el botón final solo en el último', () => {
    appInstance.openOnboardingModal(1);
    for (let i = 2; i <= 5; i++) {
      appInstance.nextOnboardingStep();
      expect(visibleStep()).toBe(i);
    }
    expect(document.getElementById('btn-onboarding-next').classList.contains('is-hidden')).toBe(true);
    expect(document.getElementById('btn-onboarding-finish').classList.contains('is-hidden')).toBe(false);

    appInstance.prevOnboardingStep();
    expect(visibleStep()).toBe(4);
    expect(document.querySelector('.onboarding-dot[data-step="3"]').classList.contains('completed')).toBe(true);
  });

  it('permite seleccionar preferencias dietéticas como chips accesibles', () => {
    appInstance.openOnboardingModal(2);
    const firstChip = document.querySelector('#onboarding-dietary-chips button');
    expect(firstChip).not.toBeNull();
    const tag = firstChip.dataset.tag;

    appInstance.toggleOnboardingDietaryTag({ tag });
    expect(appInstance.onboardingDietary.has(tag)).toBe(true);
    expect(document.querySelector(`#onboarding-dietary-chips button[data-tag="${tag}"]`).getAttribute('aria-pressed')).toBe('true');

    appInstance.toggleOnboardingDietaryTag(tag);
    expect(appInstance.onboardingDietary.has(tag)).toBe(false);
  });

  it('aplica presets de objetivos nutricionales y selecciona porciones', () => {
    appInstance.openOnboardingModal(3);
    appInstance.applyOnboardingGoalPreset({ preset: 'protein' });
    expect(document.getElementById('onboarding-goal-calories').value).toBe('2400');
    expect(document.getElementById('onboarding-goal-protein').value).toBe('180');
    expect(document.querySelector('[data-preset="protein"]').classList.contains('active')).toBe(true);

    appInstance.selectOnboardingServings({ servings: '4' });
    expect(appInstance.onboardingServings).toBe(4);
    expect(document.querySelector('[data-servings="4"]').classList.contains('active')).toBe(true);
    expect(document.querySelector('[data-servings="2"]').classList.contains('active')).toBe(false);
  });

  it('muestra un resumen en el paso 5 y guarda toda la configuración al completar', () => {
    appInstance.openOnboardingModal(1);
    const tag = (window.PREDEFINED_DIETARY_TAGS || [])[0];
    if (tag) appInstance.toggleOnboardingDietaryTag(tag);
    appInstance.applyOnboardingGoalPreset('deficit');
    appInstance.selectOnboardingServings(3);
    appInstance.onboardingStep = 4;
    appInstance.nextOnboardingStep();

    const summary = document.getElementById('onboarding-summary-box').textContent;
    expect(summary).toContain('1700 kcal');
    expect(summary).toContain('3 personas');

    appInstance.nextOnboardingStep(); // en el paso 5 → completa

    expect(localStorage.getItem('fa_onboarding_completed')).toBe('true');
    expect(localStorage.getItem('fa_servings')).toBe('3');
    expect(state.defaultServings).toBe(3);
    expect(state.settings.nutritionGoals).toMatchObject({ enabled: true, calories: 1700, protein: 145, carbs: 150, fat: 55 });
    if (tag) expect(state.dietaryPreferences).toContain(tag);
    expect(isModalOpen()).toBe(false);
    expect(appInstance.scheduleSyncWithCloud).toHaveBeenCalled();
  });

  it('permite desactivar el seguimiento nutricional', () => {
    appInstance.openOnboardingModal(3);
    document.getElementById('onboarding-goals-enabled').checked = false;
    appInstance.completeOnboarding();
    expect(state.settings.nutritionGoals.enabled).toBe(false);
  });

  it('omitir la guía la cierra y no vuelve a lanzarse', () => {
    appInstance.openOnboardingModal(1);
    appInstance.skipOnboarding();
    expect(isModalOpen()).toBe(false);
    expect(localStorage.getItem('fa_onboarding_completed')).toBe('true');
    expect(appInstance.checkAndLaunchOnboarding()).toBe(false);
  });
});

