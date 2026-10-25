import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Evaluate app.js in happy-dom environment
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const {
  AISLE_METADATA,
  COMMON_INGREDIENTS,
  normalizeIngredientText,
  categorizeIngredientAisle,
  getIngredientIcon,
  getIngredientSuggestions,
  RecipeParser,
  FoodAssistantApp
} = window;

describe('BUG-14: Clasificación Única de Pasillo con Límites de Palabra y Normalización de Acentos', () => {
  it('resuelve los falsos positivos históricos de palabras compuestas (límites de palabra \\b)', () => {
    // "chocolate" no debe ir a bebidas por coincidir con "te"
    expect(categorizeIngredientAisle('Chocolate')).toBe('pantry');
    expect(categorizeIngredientAisle('Chocolate negro')).toBe('pantry');
    expect(categorizeIngredientAisle('Chocolate con leche')).toBe('pantry');

    // "filete" no debe ir a bebidas por "te"
    expect(categorizeIngredientAisle('Filete de ternera')).toBe('meat');
    expect(categorizeIngredientAisle('Filetes de lomo')).toBe('meat');

    // "salsa" no debe ir a especias por "sal"
    expect(categorizeIngredientAisle('Salsa barbacoa')).toBe('pantry');
    expect(categorizeIngredientAisle('Salsa de soja')).toBe('pantry');
    expect(categorizeIngredientAisle('Salsa de tomate')).toBe('pantry');

    // "panceta" no debe ir a panadería por "pan"
    expect(categorizeIngredientAisle('Panceta ibérica')).toBe('meat');
    expect(categorizeIngredientAisle('Panceta')).toBe('meat');

    // "bajo" no debe ir a frutas/verduras por "ajo"
    expect(categorizeIngredientAisle('Bajo en sal')).not.toBe('produce');

    // "sal" pura y "té" auténtico deben seguir clasificándose en sus pasillos correctos
    expect(categorizeIngredientAisle('Sal fina')).toBe('spices');
    expect(categorizeIngredientAisle('Sal marina')).toBe('spices');
    expect(categorizeIngredientAisle('Té verde')).toBe('beverages');
    expect(categorizeIngredientAisle('Té negro')).toBe('beverages');
  });

  it('normaliza acentos y diacríticos transparentemente (NFD)', () => {
    expect(normalizeIngredientText('Plátano')).toBe('platano');
    expect(normalizeIngredientText('Salmón')).toBe('salmon');
    expect(normalizeIngredientText('Jamón Ibérico')).toBe('jamon iberico');

    expect(categorizeIngredientAisle('Plátano de Canarias')).toBe('produce');
    expect(categorizeIngredientAisle('Platano')).toBe('produce');
    expect(categorizeIngredientAisle('Salmón fresco')).toBe('meat');
    expect(categorizeIngredientAisle('Salmon')).toBe('meat');
    expect(categorizeIngredientAisle('Jamón serrano')).toBe('meat');
    expect(categorizeIngredientAisle('Jamon')).toBe('meat');
  });

  it('unifica RecipeParser y el clasificador manual con resultados 100% consistentes', () => {
    const testCases = [
      'Pechuga de pollo',
      'Leche desnatada',
      'Tomates cherry',
      'Placas de lasaña',
      'Arroz basmati',
      'Curry en polvo',
      'Helado de vainilla',
      'Café molido',
      'Chocolate negro'
    ];

    testCases.forEach(name => {
      const parserAisle = RecipeParser.categorizeAisle(name);
      const unifiedAisle = categorizeIngredientAisle(name);
      expect(parserAisle).toBe(unifiedAisle);
    });
  });
});

describe('US-20: Autocompletado Inteligente de Ingredientes e Iconos Distintivos', () => {
  it('getIngredientSuggestions devuelve sugerencias predictivas priorizando coincidencia de prefijo', () => {
    const resultsPollo = getIngredientSuggestions('po', 5);
    expect(resultsPollo.length).toBeGreaterThan(0);
    expect(resultsPollo.some(item => item.name.toLowerCase().includes('pollo'))).toBe(true);

    // Búsqueda insensible a mayúsculas y acentos
    const resultsPlatano = getIngredientSuggestions('plat', 5);
    expect(resultsPlatano.some(item => item.name.includes('Plátanos'))).toBe(true);

    const resultsTomate = getIngredientSuggestions('tomate', 5);
    expect(resultsTomate.length).toBeGreaterThanOrEqual(2);
    expect(resultsTomate.every(item => item.aisle)).toBe(true);
  });

  it('asigna iconos visuales distintivos por ingrediente específico y por grupo', () => {
    // Frutas
    expect(getIngredientIcon('Manzanas')).toBe('nutrition');
    expect(getIngredientIcon('Fresas')).toBe('nutrition');
    expect(getIngredientIcon('Plátanos')).toBe('nutrition');

    // Aves / Pollo
    expect(getIngredientIcon('Pechuga de pollo')).toBe('kebab_dining');
    expect(getIngredientIcon('Muslos de pollo')).toBe('kebab_dining');

    // Carnes rojas / Cerdo
    expect(getIngredientIcon('Filetes de ternera')).toBe('dinner_dining');
    expect(getIngredientIcon('Hamburguesas')).toBe('dinner_dining');

    // Pescados / Mariscos
    expect(getIngredientIcon('Salmón fresco')).toBe('set_meal');
    expect(getIngredientIcon('Gambas')).toBe('set_meal');

    // Lácteos y huevos
    expect(getIngredientIcon('Huevos')).toBe('egg');
    expect(getIngredientIcon('Leche entera')).toBe('water_drop');
    expect(getIngredientIcon('Queso Parmesano')).toBe('bakery_dining');

    // Panadería
    expect(getIngredientIcon('Pan de barra')).toBe('bakery_dining');

    // Bebidas
    expect(getIngredientIcon('Café')).toBe('local_cafe');
    expect(getIngredientIcon('Vino tinto')).toBe('liquor');

    // Despensa / Dulces
    expect(getIngredientIcon('Chocolate')).toBe('cookie');

    // Especias
    expect(getIngredientIcon('Pimienta negra')).toBe('grain');
    expect(getIngredientIcon('Sal fina')).toBe('grain');

    // Verduras
    expect(getIngredientIcon('Tomates cherry')).toBe('eco');
    expect(getIngredientIcon('Cebolla')).toBe('eco');
  });

  describe('Integración UI: Autocompletado interactivo y renderizado', () => {
    let appInstance;

    beforeEach(() => {
      document.body.innerHTML = `
        <div class="app-container">
          <input type="text" id="input-quick-grocery">
          <div id="quick-grocery-autocomplete" class="autocomplete-dropdown" style="display: none;"></div>
          <button id="btn-add-grocery">Añadir</button>

          <span id="shopping-summary-text"></span>
          <div id="shopping-aisles-container"></div>

          <div id="edit-ingredients-container"></div>
          <button id="btn-add-ingredient-row">Añadir fila</button>
        </div>
      `;

      window.state.shoppingList = [];
      appInstance = new FoodAssistantApp();
    });

    it('attachIngredientAutocomplete despliega sugerencias predictivas al escribir', () => {
      const input = document.getElementById('input-quick-grocery');
      const dropdown = document.getElementById('quick-grocery-autocomplete');

      input.value = 'tom';
      input.dispatchEvent(new Event('input'));

      expect(dropdown.style.display).toBe('flex');
      const items = dropdown.querySelectorAll('.autocomplete-item');
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].textContent).toContain('Tomate');
    });

    it('handleManualAddGrocery clasifica automáticamente el pasillo y soporta cantidades estructuradas', () => {
      const input = document.getElementById('input-quick-grocery');
      
      // Caso 1: Ingrediente simple
      input.value = 'Chocolate negro';
      appInstance.handleManualAddGrocery();

      expect(window.state.shoppingList).toHaveLength(1);
      expect(window.state.shoppingList[0].name).toBe('Chocolate negro');
      expect(window.state.shoppingList[0].aisle).toBe('pantry');

      // Caso 2: Ingrediente con cantidad y unidad ("500g pechuga de pollo")
      input.value = '500 g de pechuga de pollo';
      appInstance.handleManualAddGrocery();

      expect(window.state.shoppingList).toHaveLength(2);
      expect(window.state.shoppingList[1].name).toBe('Pechuga de pollo');
      expect(window.state.shoppingList[1].amount).toBe(500);
      expect(window.state.shoppingList[1].unit).toBe('g');
      expect(window.state.shoppingList[1].aisle).toBe('meat');
    });

    it('renderShoppingList muestra el icono distintivo para cada ingrediente', () => {
      window.state.shoppingList = [
        { id: 'item-1', name: 'Huevos', amount: 6, unit: 'ud', aisle: 'dairy', isChecked: false },
        { id: 'item-2', name: 'Manzanas', amount: 1, unit: 'kg', aisle: 'produce', isChecked: false }
      ];

      appInstance.renderShoppingList();

      const container = document.getElementById('shopping-aisles-container');
      const badges = container.querySelectorAll('.grocery-item-icon-badge');
      expect(badges.length).toBe(2);

      expect(badges[0].innerHTML).toContain('egg');
      expect(badges[1].innerHTML).toContain('nutrition');
    });

    it('addIngredientRow clasifica automáticamente el pasillo en el formulario de recetas al escribir', () => {
      appInstance.addIngredientRow();

      const container = document.getElementById('edit-ingredients-container');
      const row = container.querySelector('.edit-ing-row');
      const nameInput = row.querySelector('.ing-name');
      const aisleSelect = row.querySelector('.ing-aisle');

      nameInput.value = 'Filete de ternera';
      nameInput.dispatchEvent(new Event('input'));

      expect(aisleSelect.value).toBe('meat');

      nameInput.value = 'Leche entera';
      nameInput.dispatchEvent(new Event('input'));

      expect(aisleSelect.value).toBe('dairy');
    });
  });
});
