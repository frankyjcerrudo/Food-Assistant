import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Evaluate app.js in happy-dom browser environment
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const { FoodAssistantApp, RecipeParser, state, normalizeIngredientText } = window;

describe('Verificación y Cobertura de Bugs Abiertos (v1.06)', () => {
  let appInstance;

  beforeEach(() => {
    localStorage.clear();
    state.cloudUser = null;
    document.body.innerHTML = `
      <div id="recipes-cards-grid"></div>
      <span id="recipes-count-badge"></span>
      <span id="recipes-count-subtitle"></span>
      <input id="recipes-search-input" type="text" />
      <div id="recipes-tag-filters"></div>
      <div id="modal-recipe-detail" class="modal-overlay">
        <div id="recipe-modal-body"></div>
      </div>
      <div id="modal-recipe-import" class="modal-overlay"></div>
      <div id="modal-confirm-dialog" class="modal-overlay">
        <div id="confirm-dialog-title"></div>
        <div id="confirm-dialog-message"></div>
        <button id="btn-confirm-dialog-confirm"></button>
        <button id="btn-confirm-dialog-cancel"></button>
        <button id="btn-confirm-dialog-close"></button>
      </div>
      <div id="modal-shopping-preview" class="modal-overlay">
        <span id="shopping-preview-title"></span>
        <span id="shopping-preview-subtitle"></span>
        <span id="shopping-preview-servings-val"></span>
        <input id="shopping-preview-clear-first" type="checkbox" />
        <div id="shopping-preview-groups-container"></div>
      </div>
      <div id="cook-mode-overlay" class="cook-mode-overlay">
        <div id="cook-recipe-title"></div>
        <div id="cook-step-indicator"></div>
        <div id="cook-step-text"></div>
        <div id="cook-timer-box" style="display:none;">
          <div id="cook-timer-digits"></div>
          <button id="btn-timer-start">Iniciar</button>
          <button id="btn-timer-reset">Reiniciar</button>
        </div>
        <button id="btn-cook-next-step">Siguiente</button>
        <button id="btn-cook-prev-step">Anterior</button>
        <button id="btn-exit-cook-mode">Salir</button>
      </div>
      <div id="modal-auth" class="modal-overlay">
        <div id="auth-tab-buttons">
          <button class="auth-tab active" data-tab="signup">Registro</button>
        </div>
        <input id="auth-email" value="test@example.com" />
        <input id="auth-password" value=" secretpass " />
        <input id="auth-name" value="Franky Test" />
        <div id="auth-error-msg" style="display:none;"></div>
      </div>
    `;

    appInstance = new FoodAssistantApp();
  });

  describe('BUG-06: Service Worker y soporte Offline PWA', () => {
    it('index.html registra ./sw.js al cargar la ventana', () => {
      const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
      expect(indexHtml).toContain("navigator.serviceWorker.register('./sw.js')");
    });

    it('sw.js precachea fuentes de iconos de Material Symbols y SDK de Supabase', () => {
      const swJs = fs.readFileSync(path.resolve(process.cwd(), 'sw.js'), 'utf-8');
      expect(swJs).toContain('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
      expect(swJs).toContain('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/dist/umd/supabase.js');
      expect(swJs).toContain('fonts.gstatic.com');
    });
  });

  describe('BUG-11: Temporizador y robustez del Modo Cocina', () => {
    it('bloquea la entrada al Modo Cocina si la receta no tiene pasos de preparación', () => {
      appInstance.activeRecipe = {
        id: 'rec-no-steps',
        title: 'Receta sin pasos',
        instructions: []
      };

      appInstance.startCookMode();

      const overlay = document.getElementById('cook-mode-overlay');
      expect(overlay.classList.contains('active')).toBe(false);
    });

    it('reinicia timerInterval a null y resetea texto de botón al cambiar de paso o salir', () => {
      appInstance.activeRecipe = {
        id: 'rec-timer',
        title: 'Receta con temporizador',
        instructions: [
          { step: 1, text: 'Hervir agua', timerMinutes: 10 },
          { step: 2, text: 'Añadir pasta', timerMinutes: 8 }
        ]
      };

      appInstance.startCookMode();
      expect(appInstance.timerInterval).toBeNull();

      const startBtn = document.getElementById('btn-timer-start');
      expect(startBtn.textContent).toBe('Iniciar');

      // Iniciar timer
      appInstance.toggleCookTimer();
      expect(appInstance.timerInterval).not.toBeNull();
      expect(startBtn.textContent).toBe('Pausar');

      // Pasar al siguiente paso: debe limpiar el intervalo y restaurar texto
      appInstance.nextCookStep();
      expect(appInstance.timerInterval).toBeNull();
      expect(startBtn.textContent).toBe('Iniciar');

      // Salir de modo cocina
      appInstance.exitCookMode();
      expect(appInstance.timerInterval).toBeNull();
    });
  });

  describe('BUG-12: Escalado de raciones en previsualización de compra', () => {
    it('escala usando group.baseServings y no se dispara desproporcionadamente', () => {
      // Receta con 4 raciones base, cada ración lleva 100g de harina (total 400g)
      const recipe = {
        id: 'rec-escalado',
        title: 'Pastel para 4',
        servings: 4,
        ingredients: [{ name: 'Harina', amount: 400, unit: 'g', aisle: 'pantry' }]
      };
      state.recipes = [recipe];
      state.mealPlan = {
        '2026-11-02': { lunch: 'rec-escalado' }
      };
      state.settings.defaultServings = 2;

      appInstance.openShoppingPreviewForPlan();

      const group = appInstance.shoppingPreviewState.groups[0];
      expect(group.baseServings).toBe(4);
      // Para 2 raciones por defecto: 400 * (2 / 4) = 200g
      expect(group.items[0].amount).toBe(200);

      // Incrementar a 3 raciones (+1): 400 * (3 / 4) = 300g (0.75x, no 1.5x)
      appInstance.stepShoppingPreviewServings(1);
      expect(appInstance.shoppingPreviewState.currentServings).toBe(3);
      expect(group.items[0].amount).toBe(300);
    });
  });

  describe('BUG-13: Tiempo de cocción y parseIsoDuration sin minutos inventados', () => {
    it('parseIsoDuration devuelve 0 o fallback cuando durationStr está vacío o es nulo', () => {
      expect(RecipeParser.parseIsoDuration(null)).toBe(0);
      expect(RecipeParser.parseIsoDuration('')).toBe(0);
      expect(RecipeParser.parseIsoDuration(undefined, 5)).toBe(5);
    });

    it('parseSchemaRecipe resta prepTime de totalTime cuando cookTime falta', () => {
      const schema = {
        name: 'Guiso Tradicional',
        prepTime: 'PT15M',
        totalTime: 'PT45M'
      };

      const recipe = RecipeParser.parseSchemaRecipe(schema);
      expect(recipe.prepTimeMinutes).toBe(15);
      expect(recipe.cookTimeMinutes).toBe(30); // 45 - 15 = 30
    });

    it('parseSchemaRecipe asigna 0 minutos si no se especifica ningún tiempo', () => {
      const schema = {
        name: 'Ensalada Rápida'
      };

      const recipe = RecipeParser.parseSchemaRecipe(schema);
      expect(recipe.prepTimeMinutes).toBe(0);
      expect(recipe.cookTimeMinutes).toBe(0);
    });
  });

  describe('BUG-16: Prevención de recetas duplicadas al importar misma URL', () => {
    it('detecta sourceUrl existente al confirmar guardado y permite abrir la existente', async () => {
      const existingRecipe = {
        id: 'rec-existente',
        title: 'Paella Valenciana Original',
        sourceUrl: 'https://recetas.com/paella-valenciana/',
        tags: ['Arroz'],
        ingredients: [],
        instructions: []
      };
      state.recipes = [existingRecipe];

      const duplicateDraft = {
        id: '',
        title: 'Paella Valenciana Copia',
        sourceUrl: 'https://recetas.com/paella-valenciana',
        tags: [],
        ingredients: []
      };

      appInstance.pendingImportRecipe = duplicateDraft;
      // Simular que el usuario elige "Abrir existente" (true)
      vi.spyOn(appInstance, 'showConfirmDialog').mockResolvedValue(true);
      const openDetailSpy = vi.spyOn(appInstance, 'openRecipeDetail');

      const res = await appInstance.confirmSaveImportRecipe();

      expect(state.recipes.length).toBe(1);
      expect(openDetailSpy).toHaveBeenCalledWith('rec-existente');
      expect(res.id).toBe('rec-existente');
    });

    it('permite guardar una copia si el usuario rechaza abrir la existente', async () => {
      const existingRecipe = {
        id: 'rec-existente',
        title: 'Paella Valenciana Original',
        sourceUrl: 'https://recetas.com/paella-valenciana/',
        tags: ['Arroz'],
        ingredients: [],
        instructions: []
      };
      state.recipes = [existingRecipe];

      const duplicateDraft = {
        id: '',
        title: 'Paella Valenciana Copia',
        sourceUrl: 'https://recetas.com/paella-valenciana',
        tags: [],
        ingredients: []
      };

      appInstance.pendingImportRecipe = duplicateDraft;
      // Simular que el usuario elige "Guardar copia" (false)
      vi.spyOn(appInstance, 'showConfirmDialog').mockResolvedValue(false);

      await appInstance.confirmSaveImportRecipe();

      expect(state.recipes.length).toBe(2);
      expect(state.recipes[0].id).not.toBe('rec-existente');
    });
  });

  describe('BUG-18: Búsqueda combinada con etiquetas y búsqueda de ingredientes con acentos', () => {
    it('busca por ingrediente tolerando tildes y mayúsculas con resultados idénticos con o sin tilde', () => {
      state.recipes = [
        {
          id: 'rec-1',
          title: 'Batido Energético',
          tags: ['Desayuno'],
          ingredients: [{ name: 'Plátano maduro' }]
        },
        {
          id: 'rec-2',
          title: 'Bizcocho de platano',
          tags: ['Postre'],
          ingredients: [{ name: 'Harina' }]
        },
        {
          id: 'rec-3',
          title: 'Pancakes de Avena',
          tags: ['Desayuno'],
          ingredients: ['1 plátano troceado']
        },
        {
          id: 'rec-4',
          title: 'Ensalada César',
          tags: ['Cena'],
          ingredients: [{ name: 'Pechuga de pollo' }]
        }
      ];

      // Búsqueda con tilde ("plátano")
      appInstance.filterRecipes('plátano');
      const badgeWithAccent = document.getElementById('recipes-count-badge').textContent;

      // Búsqueda sin tilde ("platano")
      appInstance.filterRecipes('platano');
      const badgeWithoutAccent = document.getElementById('recipes-count-badge').textContent;

      // Ambas búsquedas deben devolver exactamente los mismos 3 resultados de 4
      expect(badgeWithAccent).toBe('3 de 4');
      expect(badgeWithoutAccent).toBe('3 de 4');
      expect(badgeWithAccent).toBe(badgeWithoutAccent);
    });

    it('lematiza plurales y singulares en español (platanos encuentra plátano y viceversa)', () => {
      state.recipes = [
        {
          id: 'rec-1',
          title: 'Tarta de Plátano',
          ingredients: [{ name: 'Plátano' }]
        },
        {
          id: 'rec-2',
          title: 'Brochetas de frutas',
          ingredients: [{ name: 'Plátanos en rodajas' }]
        },
        {
          id: 'rec-3',
          title: 'Sopa de verduras',
          ingredients: [{ name: 'Zanahoria' }]
        }
      ];

      // Buscar plural "platanos" debe encontrar tanto la receta con singular como la de plural
      appInstance.filterRecipes('platanos');
      expect(document.getElementById('recipes-count-badge').textContent).toBe('2 de 3');

      // Buscar singular "plátano" debe encontrar ambas
      appInstance.filterRecipes('plátano');
      expect(document.getElementById('recipes-count-badge').textContent).toBe('2 de 3');
    });

    it('busca en la descripción de las recetas y soporta multi-términos', () => {
      state.recipes = [
        {
          id: 'rec-1',
          title: 'Tarta casera',
          description: 'Elaborada con auténtico plátano de Canarias y chocolate negro',
          ingredients: [{ name: 'Harina' }]
        },
        {
          id: 'rec-2',
          title: 'Tarta de queso',
          description: 'Clásica tarta horneada',
          ingredients: [{ name: 'Queso crema' }]
        }
      ];

      // Búsqueda multi-palabra que combina palabra del título y palabra de la descripción
      appInstance.filterRecipes('tarta platano');
      expect(document.getElementById('recipes-count-badge').textContent).toBe('1 de 2');
    });

    it('combina filtro de etiqueta y término de búsqueda de forma simultánea', () => {
      state.recipes = [
        {
          id: 'rec-1',
          title: 'Pechuga a la plancha',
          tags: ['Cena', 'Rápida'],
          ingredients: [{ name: 'Pollo' }]
        },
        {
          id: 'rec-2',
          title: 'Pollo al horno dominical',
          tags: ['Almuerzo'],
          ingredients: [{ name: 'Pollo' }]
        }
      ];

      appInstance.selectedRecipeTags.add('Cena');
      appInstance.filterRecipes('pollo');

      const badge = document.getElementById('recipes-count-badge');
      expect(badge.textContent).toContain('1 de 2');
    });

    it('sanea signos de puntuación (comas, puntos, etc.) de modo que "aguacate," y "aguacate" devuelven lo mismo', () => {
      state.recipes = [
        {
          id: 'rec-1',
          title: 'Tostada saludable',
          ingredients: [{ name: 'Aguacate Hass' }]
        },
        {
          id: 'rec-2',
          title: 'Ensalada verde',
          ingredients: [{ name: 'Aguacates maduros' }]
        },
        {
          id: 'rec-3',
          title: 'Tacos de pollo',
          ingredients: [{ name: 'Pollo' }]
        }
      ];

      appInstance.filterRecipes('aguacate,');
      const badgeWithComma = document.getElementById('recipes-count-badge').textContent;

      appInstance.filterRecipes('aguacate');
      const badgeWithoutComma = document.getElementById('recipes-count-badge').textContent;

      expect(badgeWithComma).toBe('2 de 3');
      expect(badgeWithoutComma).toBe('2 de 3');
      expect(badgeWithComma).toBe(badgeWithoutComma);
    });

    it('permite buscar múltiples ingredientes separados por comas o espacios con lógica AND', () => {
      state.recipes = [
        {
          id: 'rec-1',
          title: 'Tartar especial',
          ingredients: [{ name: 'Aguacate' }, { name: 'Salmón' }]
        },
        {
          id: 'rec-2',
          title: 'Guacamole casero',
          ingredients: [{ name: 'Aguacate' }, { name: 'Cebolla' }]
        },
        {
          id: 'rec-3',
          title: 'Salmón a la plancha',
          ingredients: [{ name: 'Salmón' }]
        }
      ];

      appInstance.filterRecipes('aguacate, salmon');
      expect(document.getElementById('recipes-count-badge').textContent).toBe('1 de 3');
    });

    it('US-34 / Nevera: evita falsos positivos por subcadenas (aguacate no debe coincidir con agua ni salmon con sal)', () => {
      const recConAgua = {
        id: 'rec-agua',
        title: 'Caldo ligero',
        ingredients: [{ name: 'Agua' }, { name: 'Sal' }]
      };
      const recConAguacate = {
        id: 'rec-aguacate',
        title: 'Ensalada de aguacate',
        ingredients: [{ name: '1 aguacate maduro' }, { name: 'Aceite de oliva' }]
      };

      appInstance.fridgeIngredients = ['aguacate'];

      const matchAgua = appInstance.getRecipeFridgeMatch(recConAgua);
      const matchAguacate = appInstance.getRecipeFridgeMatch(recConAguacate);

      expect(matchAgua.matchCount).toBe(0);
      expect(matchAguacate.matchCount).toBe(1);
      expect(matchAguacate.matchedNames).toContain('1 aguacate maduro');

      // Prueba con salmón vs sal
      appInstance.fridgeIngredients = ['salmon'];
      const matchSal = appInstance.getRecipeFridgeMatch(recConAgua);
      expect(matchSal.matchCount).toBe(0);

      // Prueba con ingredientes compuestos en la nevera (ej: dientes de ajo coincide con ajo)
      appInstance.fridgeIngredients = ['dientes de ajo'];
      const recConAjo = {
        id: 'rec-ajo',
        title: 'Alioli casero',
        ingredients: [{ name: 'Ajo picado' }]
      };
      const matchAjo = appInstance.getRecipeFridgeMatch(recConAjo);
      expect(matchAjo.matchCount).toBe(1);
    });

    it('v1.10: normaliza diacríticos (plátano vs platano) asegurando resultados idénticos sin importar tildes', () => {
      state.recipes = [
        { id: 'rec-1', title: 'Batido de plátano', ingredients: [{ name: 'Leche' }] },
        { id: 'rec-2', title: 'Pancakes de platano', ingredients: [{ name: 'Harina' }] },
        { id: 'rec-3', title: 'Tostada de aguacate', ingredients: [{ name: 'Aguacate' }] }
      ];

      appInstance.fridgeIngredients = [];
      appInstance.selectedRecipeTags.clear();

      appInstance.filterRecipes('plátano');
      const countConTilde = document.getElementById('recipes-count-badge').textContent;

      appInstance.filterRecipes('platano');
      const countSinTilde = document.getElementById('recipes-count-badge').textContent;

      expect(countConTilde).toBe('2 de 3');
      expect(countSinTilde).toBe('2 de 3');
      expect(countConTilde).toBe(countSinTilde);
    });

    it('v1.10: paridad exacta entre Buscador General y Nevera para cualquier ingrediente (aguacate, plátano)', () => {
      // Recetas con mención en título únicamente, ingredientes objeto, y formato texto crudo
      state.recipes = [
        {
          id: 'rec-1',
          title: 'Tostas de aguacate',
          ingredients: [{ name: 'Pan integral' }, { name: 'Aceite' }] // Mención en título
        },
        {
          id: 'rec-2',
          title: 'Guacamole tradicional',
          ingredients: [{ name: 'Aguacate Hass maduro' }] // Mención en ingrediente objeto
        },
        {
          id: 'rec-3',
          title: 'Bowl proteico de platano',
          ingredients: '1 plátano maduro\n200g yogur griego' // Mención en ingredientes texto crudo
        },
        {
          id: 'rec-4',
          title: 'Ensalada César',
          ingredients: [{ name: 'Pollo' }, { name: 'Lechuga' }]
        }
      ];

      // Test aguacate en buscador general vs nevera
      appInstance.fridgeIngredients = [];
      appInstance.selectedRecipeTags.clear();
      appInstance.filterRecipes('aguacate');
      const searchAguacateCount = document.getElementById('recipes-count-badge').textContent;

      appInstance.filterRecipes('');
      appInstance.fridgeIngredients = ['aguacate'];
      appInstance.applyRecipeFilters();
      const fridgeAguacateCount = document.getElementById('recipes-count-badge').textContent;

      expect(searchAguacateCount).toBe('2 de 4');
      expect(fridgeAguacateCount).toBe('2 de 4');
      expect(searchAguacateCount).toBe(fridgeAguacateCount);

      // Test plátano en buscador general vs nevera
      appInstance.fridgeIngredients = [];
      appInstance.filterRecipes('platano');
      const searchPlatanoCount = document.getElementById('recipes-count-badge').textContent;

      appInstance.filterRecipes('');
      appInstance.fridgeIngredients = ['platano'];
      appInstance.applyRecipeFilters();
      const fridgePlatanoCount = document.getElementById('recipes-count-badge').textContent;

      expect(searchPlatanoCount).toBe('1 de 4');
      expect(fridgePlatanoCount).toBe('1 de 4');
      expect(searchPlatanoCount).toBe(fridgePlatanoCount);
    });
  });

  describe('BUG-19: Gestión de portapapeles sin fallos silenciosos', () => {
    it('maneja el rechazo de navigator.clipboard avisando al usuario sin romper la ejecución', async () => {
      state.shoppingList = [
        { name: 'Huevos', amount: 6, unit: 'ud', isChecked: false, aisle: 'dairy' }
      ];

      // Mock navigator.clipboard fallando
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockRejectedValue(new Error('Permission denied'))
        },
        configurable: true
      });

      const toastSpy = vi.spyOn(appInstance, 'showToast');

      const result = await appInstance.copyShoppingList();
      expect(result).toBe(false);
      expect(toastSpy).toHaveBeenCalledWith(
        expect.stringContaining('No se pudo copiar automáticamente'),
        'warning'
      );
    });
  });

  describe('BUG-20: Autenticación, contraseñas intactas y confirmación de email', () => {
    it('mantiene la contraseña sin recortar con trim()', async () => {
      const passwordInput = document.getElementById('auth-password');
      passwordInput.value = ' mi pass secreto ';

      let capturedPassword = '';
      appInstance.supabaseClient = {
        auth: {
          signUp: vi.fn().mockImplementation(async ({ password }) => {
            capturedPassword = password;
            return { data: { user: { id: 'usr-123', email: 'test@example.com' }, session: { access_token: 'tok' } } };
          })
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      };

      await appInstance.handleAuthSubmit();
      expect(capturedPassword).toBe(' mi pass secreto ');
    });

    it('informa al usuario si el email requiere confirmación (session null) sin conectar la cuenta', async () => {
      state.cloudUser = null;
      appInstance.supabaseClient = {
        auth: {
          signUp: vi.fn().mockResolvedValue({
            data: { user: { id: 'usr-unconfirmed', email: 'pending@example.com' }, session: null },
            error: null
          })
        }
      };

      await appInstance.handleAuthSubmit();

      const errBox = document.getElementById('auth-error-msg');
      expect(errBox.style.display).toBe('block');
      expect(errBox.textContent).toContain('Revisa tu correo para confirmar la cuenta');
      expect(state.cloudUser).toBeNull();
    });
  });

  describe('Optimización de Rendimiento: Cambio de Pestaña y Carga Progresiva (v1.09)', () => {
    it('renderRecipesGrid aplica renderizado progresivo por lotes y añade botón/sentinela si hay más de 36 recetas', () => {
      state.recipes = Array.from({ length: 80 }, (_, i) => ({
        id: `rec-${i}`,
        title: `Receta de prueba ${i}`,
        ingredients: [{ name: 'Pollo' }]
      }));

      appInstance.renderRecipesGrid(state.recipes);

      const grid = document.getElementById('recipes-cards-grid');
      const renderedCards = grid.querySelectorAll('.recipe-card');
      expect(renderedCards.length).toBe(36);

      const sentinel = document.getElementById('recipes-load-more-sentinel');
      expect(sentinel).not.toBeNull();
      expect(sentinel.textContent).toContain('44 restantes');

      // Cargar siguiente lote
      appInstance.loadMoreRecipes();
      const updatedCards = grid.querySelectorAll('.recipe-card');
      expect(updatedCards.length).toBe(72);
      expect(sentinel.textContent).toContain('8 restantes');

      // Cargar último lote
      appInstance.loadMoreRecipes();
      const finalCards = grid.querySelectorAll('.recipe-card');
      expect(finalCards.length).toBe(80);
      expect(document.getElementById('recipes-load-more-sentinel')).toBeNull();
    });

    it('switchView cambia la vista de forma inmediata llamando selectivamente a renderView', () => {
      const renderSpy = vi.spyOn(appInstance, 'renderView');
      appInstance.switchView('view-recipes');

      expect(appInstance.activeView).toBe('view-recipes');
      expect(renderSpy).toHaveBeenCalledWith('view-recipes');
    });
  });
});
