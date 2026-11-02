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
      expect(swJs).toContain('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
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
    it('busca por ingrediente tolerando tildes y mayúsculas', () => {
      state.recipes = [
        {
          id: 'rec-1',
          title: 'Batido Energético',
          tags: ['Desayuno'],
          ingredients: [{ name: 'Plátano maduro' }]
        },
        {
          id: 'rec-2',
          title: 'Ensalada César',
          tags: ['Cena'],
          ingredients: [{ name: 'Pechuga de pollo' }]
        }
      ];

      // Búsqueda sin tilde ("platano") debe encontrar "Plátano maduro"
      appInstance.filterRecipes('platano');

      const badge = document.getElementById('recipes-count-badge');
      expect(badge.textContent).toContain('1 de 2');
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
});
