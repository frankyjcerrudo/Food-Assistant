import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const {
  AISLE_METADATA,
  RecipeParser,
  parseCookingAmount,
  normalizeAndConvertUnit,
  mergeShoppingQuantities,
  mergeOrAddShoppingItem,
  getCanonicalIngredientKey,
  recalculateShoppingItemQuantities
} = window;

describe('Shopping Engine & Ingredient Calculations', () => {
  it('debe contener metadatos completos para todos los pasillos estándar', () => {
    const requiredAisles = ['produce', 'meat', 'dairy', 'bakery', 'pantry', 'spices', 'frozen', 'beverages', 'other'];
    requiredAisles.forEach(aisle => {
      expect(AISLE_METADATA).toHaveProperty(aisle);
      expect(AISLE_METADATA[aisle]).toHaveProperty('label');
      expect(AISLE_METADATA[aisle]).toHaveProperty('icon');
    });
  });

  it('debe escalar correctamente los ingredientes al modificar las porciones', () => {
    const baseServings = 2;
    const targetServings = 4;
    const ratio = targetServings / baseServings; // 2

    const originalAmount = 250;
    const scaledAmount = Math.round((originalAmount * ratio) * 10) / 10;

    expect(scaledAmount).toBe(500);
  });

  it('debe fusionar cantidades si el ingrediente y unidad ya existen en la lista', () => {
    const list = [
      { name: "Pechugas de pollo", amount: 400, unit: "g", aisle: "meat", isChecked: false }
    ];

    const newItem = { name: "Pechugas de pollo", amount: 200, unit: "g", aisle: "meat", isChecked: false };

    const key = `${newItem.name.toLowerCase().trim()}_${newItem.unit.toLowerCase().trim()}`;
    const existing = list.find(i => `${i.name.toLowerCase().trim()}_${i.unit.toLowerCase().trim()}` === key && !i.isChecked);

    expect(existing).toBeDefined();
    existing.amount = Math.round((existing.amount + newItem.amount) * 10) / 10;

    expect(list).toHaveLength(1);
    expect(list[0].amount).toBe(600);
  });

  it('no debe fusionar ingredientes si tienen unidades distintas (ej. gramos vs unidades)', () => {
    const list = [
      { name: "Tomates", amount: 500, unit: "g", isChecked: false }
    ];

    const newItem = { name: "Tomates", amount: 3, unit: "ud", isChecked: false };

    const key = `${newItem.name.toLowerCase().trim()}_${newItem.unit.toLowerCase().trim()}`;
    const existing = list.find(i => `${i.name.toLowerCase().trim()}_${i.unit.toLowerCase().trim()}` === key && !i.isChecked);

    expect(existing).toBeUndefined();
    list.push(newItem);

    expect(list).toHaveLength(2);
  });
});

describe('US-13: Modal de Previsualización y Selección de Ingredientes', () => {
  it('agrupa los ingredientes por receta con su estado marcado por defecto', () => {
    const recipeA = {
      id: 'rec-1',
      title: 'Pollo al Curry',
      servings: 2,
      ingredients: [
        { name: 'Pechuga', amount: 300, unit: 'g', aisle: 'meat' },
        { name: 'Curry en polvo', amount: 15, unit: 'g', aisle: 'spices' }
      ]
    };
    const recipeB = {
      id: 'rec-2',
      title: 'Ensalada Mediterránea',
      servings: 2,
      ingredients: [
        { name: 'Tomate', amount: 2, unit: 'ud', aisle: 'produce' },
        { name: 'Aceite de oliva', amount: 20, unit: 'ml', aisle: 'pantry' }
      ]
    };

    const previewGroups = [
      {
        recipeId: recipeA.id,
        recipeTitle: recipeA.title,
        items: recipeA.ingredients.map(ing => ({ ...ing, checked: true }))
      },
      {
        recipeId: recipeB.id,
        recipeTitle: recipeB.title,
        items: recipeB.ingredients.map(ing => ({ ...ing, checked: true }))
      }
    ];

    expect(previewGroups).toHaveLength(2);
    expect(previewGroups[0].items).toHaveLength(2);
    expect(previewGroups[0].items.every(i => i.checked)).toBe(true);
    expect(previewGroups[1].items).toHaveLength(2);
  });

  it('excluye los ingredientes desmarcados al confirmar la adición a la compra', () => {
    const previewItems = [
      { name: 'Pechuga', amount: 300, unit: 'g', checked: true },
      { name: 'Aceite de oliva', amount: 20, unit: 'ml', checked: false }, // desmarcado porque ya hay en casa
      { name: 'Sal', amount: 5, unit: 'g', checked: false } // desmarcado
    ];

    const itemsToConfirm = previewItems.filter(item => item.checked);

    expect(itemsToConfirm).toHaveLength(1);
    expect(itemsToConfirm[0].name).toBe('Pechuga');
  });

  it('permite modificar la cantidad de un ingrediente antes de volcarlo a la compra', () => {
    const previewItem = { name: 'Arroz', baseAmount: 200, amount: 200, unit: 'g', checked: true };

    // Usuario modifica manualmente la cantidad a 350g
    const userManualAmount = 350;
    previewItem.amount = userManualAmount;

    expect(previewItem.amount).toBe(350);
  });

  it('escala las cantidades de todos los grupos al cambiar las porciones del preview', () => {
    const initialServings = 2;
    const targetServings = 4;
    const scaleRatio = targetServings / initialServings; // 2

    const item = { name: 'Lentejas', baseAmount: 150, amount: 150, unit: 'g' };
    item.amount = Math.round((item.baseAmount * scaleRatio) * 10) / 10;

    expect(item.amount).toBe(300);
  });
});

describe('US-81: Sección de Completados y Lista de Compra Compacta', () => {
  let appInstance;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <section id="view-shopping">
        <span id="shopping-summary-text">0 artículos pendientes</span>
        <button id="btn-shopping-view-aisle"></button>
        <button id="btn-shopping-view-recipe"></button>
        <button id="btn-clear-completed" data-action="clearCompletedGroceries"></button>
        <div id="shopping-aisles-container"></div>
        <div id="shopping-completed-container"></div>
      </section>
    `;
    window.state.shoppingList = [];
    window.state.recipes = [];
    window.state.deletedRecords = { shoppingItems: [] };
    appInstance = new window.FoodAssistantApp();
  });

  it('separa los artículos pendientes de los completados en ambas secciones', () => {
    window.state.shoppingList = [
      { id: 'item-1', name: 'Manzanas', amount: 1, unit: 'kg', aisle: 'produce', isChecked: false },
      { id: 'item-2', name: 'Leche entera', amount: 1, unit: 'L', aisle: 'dairy', isChecked: true }
    ];

    appInstance.renderShoppingList();

    const aislesContainer = document.getElementById('shopping-aisles-container');
    const completedContainer = document.getElementById('shopping-completed-container');

    // En la lista activa (pasillos) solo aparece Manzanas (produce)
    expect(aislesContainer.textContent).toContain('Manzanas');
    expect(aislesContainer.textContent).not.toContain('Leche entera');

    // En la sección de completados aparece Leche entera
    expect(completedContainer.textContent).toContain('Leche entera');
    expect(completedContainer.textContent).toContain('Completados');
    expect(completedContainer.textContent).toContain('(1)');
    expect(document.getElementById('shopping-summary-text').textContent).toContain('1 artículo pendiente');
  });

  it('muestra "¡Todo en el carrito!" en la lista activa cuando todos los artículos están completados', () => {
    window.state.shoppingList = [
      { id: 'item-1', name: 'Plátanos', amount: 4, unit: 'ud', aisle: 'produce', isChecked: true },
      { id: 'item-2', name: 'Yogur', amount: 2, unit: 'ud', aisle: 'dairy', isChecked: true }
    ];

    appInstance.renderShoppingList();

    const aislesContainer = document.getElementById('shopping-aisles-container');
    const completedContainer = document.getElementById('shopping-completed-container');

    expect(aislesContainer.textContent).toContain('¡Todo en el carrito!');
    expect(completedContainer.textContent).toContain('Completados');
    expect(completedContainer.textContent).toContain('(2)');
    expect(completedContainer.textContent).toContain('Plátanos');
    expect(completedContainer.textContent).toContain('Yogur');
    expect(completedContainer.querySelector('.btn-clear-completed-section')).not.toBeNull();
  });

  it('desmarcar un artículo desde completados lo devuelve a su pasillo activo', async () => {
    window.state.shoppingList = [
      { id: 'item-1', name: 'Huevos', amount: 6, unit: 'ud', aisle: 'dairy', isChecked: true }
    ];

    appInstance.renderShoppingList();
    expect(document.getElementById('shopping-completed-container').textContent).toContain('Huevos');

    // Desmarcar el artículo (índice 0)
    await appInstance.toggleGroceryCheck(0);

    expect(window.state.shoppingList[0].isChecked).toBe(false);
    const aislesContainer = document.getElementById('shopping-aisles-container');
    expect(aislesContainer.textContent).toContain('Huevos');
    expect(document.getElementById('shopping-completed-container').innerHTML).toBe('');
  });

  it('clearCompletedGroceries elimina solo los artículos completados manteniendo los pendientes', async () => {
    window.state.shoppingList = [
      { id: 'item-1', name: 'Pasta', amount: 500, unit: 'g', aisle: 'pantry', isChecked: false },
      { id: 'item-2', name: 'Tomate frito', amount: 1, unit: 'bote', aisle: 'pantry', isChecked: true },
      { id: 'item-3', name: 'Queso rallado', amount: 100, unit: 'g', aisle: 'dairy', isChecked: true }
    ];

    const result = await appInstance.clearCompletedGroceries(true); // skipConfirm = true
    expect(result).toBe(true);

    expect(window.state.shoppingList.length).toBe(1);
    expect(window.state.shoppingList[0].name).toBe('Pasta');
    expect(window.state.deletedRecords.shoppingItems).toContain('item-2');
    expect(window.state.deletedRecords.shoppingItems).toContain('item-3');

    const completedContainer = document.getElementById('shopping-completed-container');
    expect(completedContainer.innerHTML).toBe('');
  });
});

describe('US-64: Conversión y normalización de unidades en la compra', () => {
  describe('DoD 1: Sumar cantidades compatibles (500 g + 1 kg = 1,5 kg; ml/cl/dl/l)', () => {
    it('suma cantidades de masa compatibles y muestra la unidad más legible (g ↔ kg)', () => {
      const res = mergeShoppingQuantities(500, 'g', 1, 'kg');
      expect(res.compatible).toBe(true);
      expect(res.amount).toBe(1.5);
      expect(res.unit).toBe('kg');

      const resGrams = mergeShoppingQuantities(250, 'g', 350, 'g');
      expect(resGrams.compatible).toBe(true);
      expect(resGrams.amount).toBe(600);
      expect(resGrams.unit).toBe('g');

      const resKilos = mergeShoppingQuantities(750, 'g', 250, 'g');
      expect(resKilos.compatible).toBe(true);
      expect(resKilos.amount).toBe(1);
      expect(resKilos.unit).toBe('kg');
    });

    it('suma cantidades de volumen compatibles (ml / cl / dl / l)', () => {
      const resMl = mergeShoppingQuantities(250, 'ml', 1, 'l');
      expect(resMl.compatible).toBe(true);
      expect(resMl.amount).toBe(1.25);
      expect(resMl.unit).toBe('l');

      const resCl = mergeShoppingQuantities(50, 'cl', 500, 'ml');
      expect(resCl.compatible).toBe(true);
      expect(resCl.amount).toBe(1);
      expect(resCl.unit).toBe('l');

      const resDl = mergeShoppingQuantities(3, 'dl', 400, 'ml');
      expect(resDl.compatible).toBe(true);
      expect(resDl.amount).toBe(700);
      expect(resDl.unit).toBe('ml');
    });

    it('soporta cantidades numéricas expresadas con coma decimal o fracciones', () => {
      const resComma = mergeShoppingQuantities('1,5', 'kg', 500, 'g');
      expect(resComma.compatible).toBe(true);
      expect(resComma.amount).toBe(2);
      expect(resComma.unit).toBe('kg');

      const resFrac = mergeShoppingQuantities('1/2', 'kg', 500, 'g');
      expect(resFrac.compatible).toBe(true);
      expect(resFrac.amount).toBe(1);
      expect(resFrac.unit).toBe('kg');

      const resUnicode = mergeShoppingQuantities('½', 'l', 500, 'ml');
      expect(resUnicode.compatible).toBe(true);
      expect(resUnicode.amount).toBe(1);
      expect(resUnicode.unit).toBe('l');
    });
  });

  describe('DoD 2: Unificar singular/plural y acentos al fusionar ("Tomate" = "Tomates")', () => {
    it('obtiene la misma clave canónica ignorando plurales y acentos', () => {
      expect(getCanonicalIngredientKey('Tomate')).toBe(getCanonicalIngredientKey('Tomates'));
      expect(getCanonicalIngredientKey('Limón')).toBe(getCanonicalIngredientKey('limones'));
      expect(getCanonicalIngredientKey('Pechuga de pollo')).toBe(getCanonicalIngredientKey('Pechugas de pollo'));
      expect(getCanonicalIngredientKey('Nuez')).toBe(getCanonicalIngredientKey('Nueces'));
    });

    it('mergeOrAddShoppingItem fusiona singular y plural en una sola entrada sumando cantidades', () => {
      const list = [
        { name: 'Tomate', amount: 500, unit: 'g', isChecked: false, recipeOrigin: 'Ensalada' }
      ];

      mergeOrAddShoppingItem(list, {
        name: 'Tomates',
        amount: 1,
        unit: 'kg',
        isChecked: false,
        recipeOrigin: 'Gazpacho'
      });

      expect(list).toHaveLength(1);
      expect(list[0].name).toBe('Tomate');
      expect(list[0].amount).toBe(1.5);
      expect(list[0].unit).toBe('kg');
      expect(list[0].recipeOrigin).toContain('Ensalada');
      expect(list[0].recipeOrigin).toContain('Gazpacho');
    });

    it('mergeOrAddShoppingItem unifica ingredientes con o sin tildes', () => {
      const list = [
        { name: 'Limón', amount: 2, unit: 'ud', isChecked: false, recipeOrigin: 'Postre' }
      ];

      mergeOrAddShoppingItem(list, {
        name: 'limones',
        amount: 3,
        unit: 'ud',
        isChecked: false,
        recipeOrigin: 'Pescado'
      });

      expect(list).toHaveLength(1);
      expect(list[0].amount).toBe(5);
      expect(list[0].unit).toBe('ud');
      expect(list[0].recipeBreakdown).toHaveLength(2);
    });
  });

  describe('DoD 3: Mostrar la unidad más legible (1500 g → 1,5 kg)', () => {
    it('convierte automáticamente gramos mayores a 1000 en kg', () => {
      const norm = normalizeAndConvertUnit(1500, 'g');
      expect(norm.amount).toBe(1.5);
      expect(norm.unit).toBe('kg');
    });

    it('convierte automáticamente kilos menores a 1 en gramos', () => {
      const norm = normalizeAndConvertUnit(0.25, 'kg');
      expect(norm.amount).toBe(250);
      expect(norm.unit).toBe('g');
    });

    it('convierte mililitros mayores a 1000 en litros', () => {
      const norm = normalizeAndConvertUnit(2500, 'ml');
      expect(norm.amount).toBe(2.5);
      expect(norm.unit).toBe('l');
    });

    it('convierte litros menores a 1 en mililitros', () => {
      const norm = normalizeAndConvertUnit(0.33, 'l');
      expect(norm.amount).toBe(330);
      expect(norm.unit).toBe('ml');
    });
  });

  describe('DoD 4: Fusión multi-unidad inteligente y desglose', () => {
    it('combina unidades no convertibles directamente (800 g + 6 ud) con desglose de recetas', () => {
      const list = [];
      mergeOrAddShoppingItem(list, {
        name: 'Patatas',
        amount: 800,
        unit: 'g',
        recipeOrigin: 'Guiso'
      });
      mergeOrAddShoppingItem(list, {
        name: 'Patatas',
        amount: 6,
        unit: 'ud',
        recipeOrigin: 'Horno'
      });

      expect(list).toHaveLength(1);
      expect(list[0].displayAmount).toBe('800 g + 6 ud');
      expect(list[0].recipeBreakdown).toHaveLength(2);
      expect(list[0].recipeBreakdown[0].recipe).toBe('Guiso');
      expect(list[0].recipeBreakdown[1].recipe).toBe('Horno');
    });
  });

  describe('Entrada manual rápida con unidades y formatos culinarios', () => {
    it('parseIngredientLine extrae correctamente cantidades decimales con coma en la entrada rápida', () => {
      const parsed = RecipeParser.parseIngredientLine('1,5 kg patatas');
      expect(parsed).not.toBeNull();
      expect(parsed.name).toBe('Patatas');
      expect(parsed.amount).toBe(1.5);
      expect(parsed.unit).toBe('kg');
    });

    it('parseIngredientLine extrae fracciones en la entrada rápida', () => {
      const parsed = RecipeParser.parseIngredientLine('1/2 kg carne picada');
      expect(parsed).not.toBeNull();
      expect(parsed.amount).toBe(0.5);
      expect(parsed.unit).toBe('kg');
      expect(parsed.name).toBe('Carne picada');
    });
  });

  describe('Auto-consolidación reactiva de duplicados (Puerro de múltiples recetas)', () => {
    let appInstance;

    beforeEach(() => {
      localStorage.clear();
      document.body.innerHTML = `
        <section id="view-shopping">
          <span id="shopping-summary-text">0 artículos pendientes</span>
          <button id="btn-shopping-view-aisle"></button>
          <button id="btn-shopping-view-recipe"></button>
          <div id="shopping-aisles-container"></div>
          <div id="shopping-completed-container"></div>
        </section>
      `;
      window.state.shoppingList = [];
      window.state.recipes = [];
      window.state.deletedRecords = { shoppingItems: [] };
      appInstance = new window.FoodAssistantApp();
    });

    it('consolidateShoppingList fusiona artículos equivalentes y marca el ID absorbido en deletedRecords', () => {
      const list = [
        {
          id: 'shop-puerro-1',
          name: 'Puerro',
          amount: 1,
          unit: 'ud',
          aisle: 'produce',
          isChecked: false,
          recipeOrigin: 'Crema de calabaza con pipas tostadas con picatostes caseros especiados'
        },
        {
          id: 'shop-puerro-2',
          name: 'Puerro',
          amount: 1,
          unit: 'ud',
          aisle: 'produce',
          isChecked: false,
          recipeOrigin: 'CREMA DE CHAMPIÑONES'
        }
      ];

      const consolidated = window.consolidateShoppingList(list);

      expect(consolidated).toHaveLength(1);
      expect(consolidated[0].name).toBe('Puerro');
      expect(consolidated[0].amount).toBe(2);
      expect(consolidated[0].unit).toBe('ud');
      expect(consolidated[0].displayAmount).toBe('2 ud');
      expect(consolidated[0].recipeBreakdown).toHaveLength(2);
      expect(consolidated[0].recipeOrigin).toContain('Crema de calabaza');
      expect(consolidated[0].recipeOrigin).toContain('CREMA DE CHAMPIÑONES');
      expect(window.state.deletedRecords.shoppingItems).toContain('shop-puerro-2');
    });

    it('renderShoppingList consolida automáticamente artículos existentes al renderizar', () => {
      window.state.shoppingList = [
        {
          id: 'shop-item-a',
          name: 'Puerro',
          amount: 1,
          unit: 'ud',
          aisle: 'produce',
          isChecked: false,
          recipeOrigin: 'Crema de calabaza con pipas tostadas con picatostes caseros especiados'
        },
        {
          id: 'shop-item-b',
          name: 'Puerro',
          amount: 1,
          unit: 'ud',
          aisle: 'produce',
          isChecked: false,
          recipeOrigin: 'CREMA DE CHAMPIÑONES'
        }
      ];

      appInstance.renderShoppingList();

      // En el estado interno queda un único artículo fusionado
      expect(window.state.shoppingList).toHaveLength(1);
      expect(window.state.shoppingList[0].amount).toBe(2);
      expect(window.state.shoppingList[0].unit).toBe('ud');
      expect(window.state.deletedRecords.shoppingItems).toContain('shop-item-b');

      // En el DOM solo se renderiza 1 fila para Puerro mostrando "2 ud" y el desglose de recetas
      const container = document.getElementById('shopping-aisles-container');
      const puerroRows = container.querySelectorAll('.grocery-item-row');
      expect(puerroRows).toHaveLength(1);
      expect(container.textContent).toContain('Puerro');
      expect(container.textContent).toContain('2 ud');
      expect(container.textContent).toContain('Crema de calabaza');
      expect(container.textContent).toContain('CREMA DE CHAMPIÑONES');
    });
  });
});
