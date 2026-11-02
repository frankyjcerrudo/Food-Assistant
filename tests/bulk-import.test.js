import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Evaluate app.js in happy-dom browser environment
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const { RecipeParser } = window;

describe('US-67: Importador Masivo de Colecciones y Migración de Recetas (Samsung Food / Whisk / JSON Backup)', () => {
  beforeEach(() => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    document.documentElement.innerHTML = fs.readFileSync(htmlPath, 'utf-8');
  });

  describe('1. Parser Masivo y Detección de Formatos (RecipeParser.parseBulkCollection)', () => {
    it('parseBulkCollection parsea copia de seguridad de Food Assistant con recetas, plan y lista de compra', () => {
      const backupJson = JSON.stringify({
        version: 1,
        exportedAt: '2026-11-01T20:00:00.000Z',
        recipes: [
          {
            id: 'rec-backup-1',
            title: 'Pollo al Curry',
            description: 'Receta casera',
            servings: 4,
            prepTimeMinutes: 15,
            cookTimeMinutes: 25,
            ingredients: [
              { name: 'Pechuga de pollo', amount: 500, unit: 'g', aisle: 'meat' },
              { name: 'Curry en polvo', amount: 1, unit: 'cda', aisle: 'spices' }
            ],
            instructions: [
              { step: 1, text: 'Cortar el pollo en dados.', timerMinutes: 0 },
              { step: 2, text: 'Cocinar 20 minutos con curry.', timerMinutes: 20 }
            ],
            sourceUrl: 'https://ejemplo.com/curry',
            sourceDomain: 'ejemplo.com'
          }
        ],
        mealPlan: { '2026-11-02': { lunch: 'rec-backup-1' } },
        shoppingList: [{ id: 'shop-1', name: 'Curry en polvo', aisle: 'spices' }]
      });

      const { candidates, extraData } = RecipeParser.parseBulkCollection(backupJson);

      expect(candidates).toHaveLength(1);
      expect(candidates[0].title).toBe('Pollo al Curry');
      expect(candidates[0].servings).toBe(4);
      expect(candidates[0].prepTimeMinutes).toBe(15);
      expect(candidates[0].cookTimeMinutes).toBe(25);
      expect(candidates[0].ingredients).toHaveLength(2);
      expect(candidates[0].instructions).toHaveLength(2);
      expect(candidates[0].instructions[1].timerMinutes).toBe(20);
      expect(extraData.hasMealPlan).toBe(true);
      expect(extraData.hasShoppingList).toBe(true);
      expect(extraData.mealPlan['2026-11-02'].lunch).toBe('rec-backup-1');
      expect(extraData.shoppingList[0].name).toBe('Curry en polvo');
    });

    it('parseBulkCollection parsea exportaciones de Samsung Food / Whisk con colecciones temáticas', () => {
      const whiskCollectionExport = {
        collections: [
          {
            name: 'Favoritas de Otoño',
            recipes: [
              {
                recipe: {
                  id: 'whisk-rec-1',
                  name: 'Sopa de Calabaza Asada',
                  description: 'Cremosa y reconfortante',
                  servings: 4,
                  prep_time: 600, // 600s = 10 min
                  cook_time: 1800, // 1800s = 30 min
                  images: [{ url: 'https://images.unsplash.com/pumpkin-soup.jpg' }],
                  source: {
                    name: 'Instagram @chef_maria',
                    url: 'https://www.instagram.com/p/DBCalabaza/'
                  },
                  ingredients: [
                    { name: 'calabaza', quantity: 800, unit: 'g' },
                    { text: '1 cebolla mediana' },
                    { name: 'aceite de oliva', quantity: 2, unit: 'tbsp' }
                  ],
                  instructions: {
                    steps: [
                      { text: 'Asar la calabaza durante 25 minutos al horno.' },
                      { text: 'Triturar con el caldo hasta obtener una textura suave.' }
                    ]
                  }
                }
              }
            ]
          }
        ]
      };

      const { candidates } = RecipeParser.parseBulkCollection(whiskCollectionExport);

      expect(candidates).toHaveLength(1);
      const r = candidates[0];
      expect(r.title).toBe('Sopa de Calabaza Asada');
      expect(r.servings).toBe(4);
      expect(r.prepTimeMinutes).toBe(10);
      expect(r.cookTimeMinutes).toBe(30);
      expect(r.imageUrl).toBe('https://images.unsplash.com/pumpkin-soup.jpg');
      expect(r.sourceUrl).toBe('https://www.instagram.com/p/DBCalabaza/');
      expect(r.sourceDomain).toBe('instagram.com');
      expect(r.tags).toContain('Favoritas de Otoño');

      // Normalización de ingredientes
      expect(r.ingredients).toHaveLength(3);
      expect(r.ingredients[0].name).toBe('Calabaza');
      expect(r.ingredients[0].amount).toBe(800);
      expect(r.ingredients[0].unit).toBe('g');
      expect(r.ingredients[0].aisle).toBe('produce');

      expect(r.ingredients[1].name).toBe('Cebolla mediana');
      expect(r.ingredients[1].amount).toBe(1);
      expect(r.ingredients[1].unit).toBe('ud');
      expect(r.ingredients[1].aisle).toBe('produce');

      expect(r.ingredients[2].unit).toBe('cda');
      expect(r.ingredients[2].aisle).toBe('spices');

      // Pasos y temporizadores
      expect(r.instructions).toHaveLength(2);
      expect(r.instructions[0].step).toBe(1);
      expect(r.instructions[0].text).toContain('Asar la calabaza');
      expect(r.instructions[0].timerMinutes).toBe(25);
    });

    it('parseBulkCollection extrae ingredientes en formato rawText de Samsung Food y divide pasos inline', () => {
      const samsungFoodRawExport = [
        {
          id: 'sf_10701a1064037cd76cfa9a76cc5fee5c2a2',
          title: 'Crema thai',
          ingredients: [
            { rawText: 'Zanahorias' },
            { rawText: 'Batata' },
            { rawText: 'Cebolla' },
            { rawText: 'Jengibre' },
            { rawText: 'Curry' },
            { rawText: 'Cúrcuma' },
            { rawText: 'Leche de coco' }
          ],
          instructions: [
            '1.Cuece los vegetales con el caldo 2.Añade sal, pimienta y aove y tritura\n3.Emplata y decora'
          ]
        }
      ];

      const { candidates } = RecipeParser.parseBulkCollection(samsungFoodRawExport);
      expect(candidates).toHaveLength(1);
      const r = candidates[0];
      expect(r.ingredients).toHaveLength(7);
      expect(r.ingredients[0].name).toBe('Zanahorias');
      expect(r.ingredients[0].aisle).toBe('produce');
      expect(r.ingredients[1].name).toBe('Batata');
      expect(r.ingredients[1].aisle).toBe('produce');
      expect(r.instructions).toHaveLength(3);
      expect(r.instructions[0].text).toBe('Cuece los vegetales con el caldo');
      expect(r.instructions[1].text).toBe('Añade sal, pimienta y aove y tritura');
      expect(r.instructions[2].text).toBe('Emplata y decora');
    });

    it('parseBulkCollection parsea array directo de recetas en formato plano o Schema.org @graph', () => {
      const graphExport = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Recipe',
            name: 'Tortilla Española Clásica',
            recipeYield: '4 raciones',
            prepTime: 'PT15M',
            cookTime: 'PT20M',
            image: 'https://ejemplo.com/tortilla.jpg',
            recipeIngredient: ['4 patatas medianas', '6 huevos camperos', '1 cebolla'],
            recipeInstructions: [
              'Pelar y cortar las patatas.',
              'Pochar a fuego medio 15 minutos.',
              'Cuajar la tortilla en la sartén.'
            ]
          }
        ]
      };

      const { candidates } = RecipeParser.parseBulkCollection(graphExport);

      expect(candidates).toHaveLength(1);
      expect(candidates[0].title).toBe('Tortilla Española Clásica');
      expect(candidates[0].servings).toBe(4);
      expect(candidates[0].prepTimeMinutes).toBe(15);
      expect(candidates[0].cookTimeMinutes).toBe(20);
      expect(candidates[0].ingredients).toHaveLength(3);
      expect(candidates[0].instructions).toHaveLength(3);
    });

    it('parseBulkCollection lanza error descriptivo si el string no es JSON válido', () => {
      expect(() => {
        RecipeParser.parseBulkCollection('{ invalid json string ...');
      }).toThrow(/formato JSON válido/i);
    });
  });

  describe('2. Detección Inteligente de Duplicados y Advertencias (RecipeParser.detectDuplicatesAndWarnings)', () => {
    it('detecta duplicados por título exacto o normalizado (sin importar mayúsculas ni tildes)', () => {
      const existing = [
        {
          id: 'rec-exist-1',
          title: 'Tortilla de Patatas Tradicional',
          sourceUrl: 'https://misrecetas.com/tortilla'
        }
      ];

      const candidates = [
        {
          title: 'tortilla de patatas tradicional', // Igual con minúsculas y sin acentos
          sourceUrl: 'https://otro-sitio.com/algo'
        },
        {
          title: 'Salmón al Horno con Verduras',
          sourceUrl: 'https://blog.com/salmon'
        }
      ];

      RecipeParser.detectDuplicatesAndWarnings(candidates, existing);

      expect(candidates[0].isDuplicate).toBe(true);
      expect(candidates[0].duplicateReason).toBe('Mismo título');
      expect(candidates[0].duplicateOf.id).toBe('rec-exist-1');
      expect(candidates[0].selected).toBe(false); // Duplicada desmarcada por defecto

      expect(candidates[1].isDuplicate).toBe(false);
      expect(candidates[1].selected).toBe(true); // Nueva marcada por defecto
    });

    it('detecta duplicados por URL de origen ignorando protocolos, www y barras finales', () => {
      const existing = [
        {
          id: 'rec-exist-2',
          title: 'Pasta al Pesto Genovés',
          sourceUrl: 'https://www.directoalpaladar.com/recetas/pesto/'
        }
      ];

      const candidates = [
        {
          title: 'Mi versión de Pesto', // Título diferente pero misma URL
          sourceUrl: 'http://directoalpaladar.com/recetas/pesto'
        }
      ];

      RecipeParser.detectDuplicatesAndWarnings(candidates, existing);

      expect(candidates[0].isDuplicate).toBe(true);
      expect(candidates[0].duplicateReason).toBe('Misma URL original');
      expect(candidates[0].duplicateOf.id).toBe('rec-exist-2');
    });

    it('genera advertencias de diagnóstico para recetas sin pasos, pocos ingredientes o sin foto', () => {
      const candidates = [
        {
          title: 'Receta Incompleta',
          ingredients: [{ name: 'Solo Sal', amount: 1, unit: 'pizca' }],
          instructions: [],
          imageUrl: ''
        }
      ];

      RecipeParser.detectDuplicatesAndWarnings(candidates, []);

      expect(candidates[0].warnings).toContain('Sin pasos de preparación');
      expect(candidates[0].warnings).toContain('Pocos ingredientes (1)');
      expect(candidates[0].warnings).toContain('Sin foto');
    });
  });

  describe('3. Normalización y Finalización de Recetas (RecipeParser.finalizeImportRecipe)', () => {
    it('normaliza ingredientes asignando pasillos automáticamente e infiere etiquetas dietéticas', () => {
      const candidate = {
        title: 'Hamburguesas Veganas de Lentejas',
        description: 'Deliciosas y saludables',
        servings: 2,
        imageUrl: 'https://img.com/burger.jpg',
        ingredients: [
          { name: 'Lentejas cocidas', amount: 300, unit: 'g', aisle: 'other' },
          { name: 'Zanahoria rallada', amount: 1, unit: 'ud', aisle: '' }
        ],
        instructions: [{ step: 1, text: 'Mezclar y hornear a 180C durante 20 minutos.', timerMinutes: 20 }],
        tags: []
      };

      const finalized = RecipeParser.finalizeImportRecipe(candidate);

      expect(finalized.ingredients[0].aisle).toBe('pantry');
      expect(finalized.ingredients[1].aisle).toBe('produce');
      expect(finalized.tags).toContain('Vegano');
      expect(finalized.tags).toContain('Vegetariano');
      expect(finalized.nutrition).toBeDefined();
      expect(finalized.nutrition.calories).toBeGreaterThan(0);
    });
  });

  describe('4. Flujo Completo de la App (FoodAssistantApp Bulk Import UI & Lifecycle)', () => {
    it('openBulkImportModal procesa datos, calcula métricas de resumen y abre modal con filtros', () => {
      const app = new window.FoodAssistantApp();
      window.state.recipes = [
        { id: 'rec-1', title: 'Receta Existente', sourceUrl: 'https://web.com/1' }
      ];

      const rawJson = JSON.stringify({
        recipes: [
          { title: 'Receta Existente', ingredients: ['1 tomate', '1 cebolla'], instructions: ['Paso 1'] },
          { title: 'Receta Totalmente Nueva', ingredients: ['2 huevos', '100g queso'], instructions: ['Paso 1'], imageUrl: 'https://foto.com/1' }
        ]
      });

      app.openBulkImportModal(rawJson);

      expect(app.pendingBulkImport).not.toBeNull();
      expect(app.pendingBulkImport.candidates).toHaveLength(2);

      // Verificación de estadísticas en DOM
      const countAll = document.getElementById('count-filter-all');
      const countNew = document.getElementById('count-filter-new');
      const countDup = document.getElementById('count-filter-dup');

      expect(countAll.textContent).toBe('2');
      expect(countNew.textContent).toBe('1');
      expect(countDup.textContent).toBe('1');

      // Modal activo
      const modal = document.getElementById('modal-bulk-import');
      expect(modal.classList.contains('active')).toBe(true);

      // Botón de confirmación muestra cantidad seleccionada
      const btnConfirmText = document.getElementById('btn-confirm-bulk-import-text');
      expect(btnConfirmText.textContent).toContain('Importar 1 de 2 recetas');
    });

    it('setBulkImportSelection permite alternar entre Todas, Solo Nuevas y Ninguna', () => {
      const app = new window.FoodAssistantApp();
      window.state.recipes = [{ id: 'rec-1', title: 'Duplicada', sourceUrl: '' }];

      app.openBulkImportModal(JSON.stringify({
        recipes: [
          { title: 'Duplicada', ingredients: ['1 tomate', '1 cebolla'], instructions: ['Paso 1'] },
          { title: 'Nueva 1', ingredients: ['1 tomate', '1 cebolla'], instructions: ['Paso 1'] },
          { title: 'Nueva 2', ingredients: ['1 tomate', '1 cebolla'], instructions: ['Paso 1'] }
        ]
      }));

      // Inicialmente solo nuevas (2 de 3)
      expect(app.pendingBulkImport.candidates.filter(c => c.selected)).toHaveLength(2);

      // Seleccionar todas
      app.setBulkImportSelection('all');
      expect(app.pendingBulkImport.candidates.filter(c => c.selected)).toHaveLength(3);

      // Deseleccionar todas (ninguna)
      app.setBulkImportSelection('none');
      expect(app.pendingBulkImport.candidates.filter(c => c.selected)).toHaveLength(0);

      const btnConfirm = document.getElementById('btn-confirm-bulk-import');
      expect(btnConfirm.disabled).toBe(true);

      // Solo nuevas
      app.setBulkImportSelection('new');
      expect(app.pendingBulkImport.candidates.filter(c => c.selected)).toHaveLength(2);
      expect(btnConfirm.disabled).toBe(false);
    });

    it('executeBulkImport procesa las recetas seleccionadas, respeta opción de sobrescribir y sincroniza', async () => {
      const app = new window.FoodAssistantApp();
      vi.spyOn(app, 'scheduleSyncWithCloud').mockImplementation(() => {});

      window.state.recipes = [
        { id: 'rec-old-1', title: 'Lasaña Casera', servings: 2, ingredients: [], instructions: [] }
      ];

      app.openBulkImportModal(JSON.stringify({
        recipes: [
          {
            title: 'Lasaña Casera',
            servings: 6,
            ingredients: ['500g carne picada', '1 paquete placas pasta'],
            instructions: ['Montar y hornear 30 minutos.']
          },
          {
            title: 'Guacamole Mexicano',
            servings: 4,
            ingredients: ['2 aguacates', '1 lima', '1 tomate'],
            instructions: ['Chafar aguacates con lima.']
          }
        ]
      }));

      // Marcar duplicada para importar y activar checkbox de sobrescritura
      app.pendingBulkImport.candidates[0].selected = true;
      const overwriteCheck = document.getElementById('check-bulk-overwrite-duplicates');
      overwriteCheck.checked = true;

      await app.executeBulkImport();

      // Debe haber 2 recetas en total: la lasaña actualizada (conservando id) y el guacamole añadido
      expect(window.state.recipes).toHaveLength(2);

      const updatedLasagna = window.state.recipes.find(r => r.title === 'Lasaña Casera');
      expect(updatedLasagna).toBeDefined();
      expect(updatedLasagna.id).toBe('rec-old-1');
      expect(updatedLasagna.servings).toBe(6);
      expect(updatedLasagna.ingredients).toHaveLength(2);

      const newGuacamole = window.state.recipes.find(r => r.title === 'Guacamole Mexicano');
      expect(newGuacamole).toBeDefined();
      expect(newGuacamole.id).not.toBe('rec-old-1');

      // Modal cerrado tras importación
      const modal = document.getElementById('modal-bulk-import');
      expect(modal.classList.contains('active')).toBe(false);

      // Marca de borrador local (_isLocalDraft) asignada para evitar borrado antes de subir a la nube
      expect(newGuacamole._isLocalDraft).toBe(true);
      expect(newGuacamole.updatedAt).toBeDefined();
    });

    it('splitCompositeIngredientLine maneja emojis de forma segura con Unicode flag (/u) sin romper pares sustitutos', () => {
      const rawWithEmojis = [
        {
          id: 'rec-emoji-test',
          title: 'Carpaccio con Vinagreta',
          ingredients: [
            { rawText: '🔹Vinagreta👇👇👇👇👇' },
            { rawText: 'VINAGRETA' },
            { rawText: '🔹50ml Aceite de oliva' }
          ],
          instructions: ['1. Mezclar todo.']
        }
      ];

      const { candidates } = RecipeParser.parseBulkCollection(rawWithEmojis);
      expect(candidates).toHaveLength(1);
      const ingNames = candidates[0].ingredients.map(i => i.name);
      // No debe contener caracteres sustitutos huérfanos (\udc47)
      ingNames.forEach(name => {
        expect(typeof name.isWellFormed === 'function' ? name.isWellFormed() : true).toBe(true);
      });
      expect(ingNames).toContain('Aceite de oliva');
    });
  });
});
