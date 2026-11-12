import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Evaluate i18n & app.js in happy-dom browser environment
const i18nPath = path.resolve(process.cwd(), 'i18n.js');
const appPath = path.resolve(process.cwd(), 'app.js');
const stylesPath = path.resolve(process.cwd(), 'styles.css');

new Function(fs.readFileSync(i18nPath, 'utf-8'))();
new Function(fs.readFileSync(appPath, 'utf-8'))();

describe('US-31: Colecciones y Libros de Recetas Personalizados (Cookbooks / Carpetas)', () => {
  let appInstance;

  beforeEach(() => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    document.documentElement.innerHTML = fs.readFileSync(htmlPath, 'utf-8');

    // Inicializar estado de pruebas
    state.cookbooks = [
      {
        id: 'cb-cenas-rapidas',
        name: 'Cenas Rápidas',
        icon: 'bolt',
        description: 'Platos rápidos para la cena',
        createdAt: '2026-11-12T00:00:00.000Z'
      },
      {
        id: 'cb-postres',
        name: 'Postres Caseros',
        icon: 'cake',
        description: 'Dulces y repostería',
        createdAt: '2026-11-12T00:00:00.000Z'
      }
    ];

    state.recipes = [
      {
        id: 'rec-1',
        title: 'Tortilla Rápida de Espinacas',
        cookbooks: ['cb-cenas-rapidas'],
        ingredients: [{ name: 'Huevos', amount: 3, unit: 'ud', aisle: 'dairy' }],
        instructions: [{ step: 1, text: 'Batir y cocinar 5 min.' }],
        tags: ['Cena', 'Rápida']
      },
      {
        id: 'rec-2',
        title: 'Tarta de Manzana y Canela',
        cookbooks: ['cb-postres'],
        ingredients: [{ name: 'Manzanas', amount: 2, unit: 'ud', aisle: 'produce' }],
        instructions: [{ step: 1, text: 'Hornear 30 min.' }],
        tags: ['Postre']
      },
      {
        id: 'rec-3',
        title: 'Pollo Asado Clásico',
        cookbooks: ['cb-cenas-rapidas', 'cb-postres'], // En múltiples colecciones
        ingredients: [{ name: 'Pollo', amount: 1, unit: 'kg', aisle: 'meat' }],
        instructions: [{ step: 1, text: 'Hornear 45 min.' }],
        tags: ['Almuerzo']
      },
      {
        id: 'rec-4',
        title: 'Sopa Huérfana',
        cookbooks: [], // Sin asignar a ningún libro
        ingredients: [{ name: 'Caldo', amount: 500, unit: 'ml', aisle: 'pantry' }],
        instructions: [{ step: 1, text: 'Hervir 10 min.' }],
        tags: ['Cena']
      }
    ];

    window.I18n.setPreference('es');
    appInstance = new window.FoodAssistantApp();
  });

  describe('1. Modelo de Datos y Métodos de StateStore', () => {
    it('state.cookbooks contiene la lista inicial de libros', () => {
      expect(Array.isArray(state.cookbooks)).toBe(true);
      expect(state.cookbooks.length).toBe(2);
      expect(state.cookbooks[0].name).toBe('Cenas Rápidas');
    });

    it('addCookbook agrega un nuevo libro con id y datos sanitizados', () => {
      const created = state.addCookbook({
        name: '  Favoritas de Mamá  ',
        icon: 'favorite',
        description: 'Recetas de la familia'
      });

      expect(created).toBeDefined();
      expect(created.id).toMatch(/^cb-/);
      expect(created.name).toBe('Favoritas de Mamá');
      expect(created.icon).toBe('favorite');
      expect(state.cookbooks.some(c => c.id === created.id)).toBe(true);
    });

    it('updateCookbook modifica un libro existente preservando su id', () => {
      const updated = state.updateCookbook('cb-cenas-rapidas', {
        name: 'Cenas Exprés',
        icon: 'timer'
      });

      expect(updated.id).toBe('cb-cenas-rapidas');
      expect(updated.name).toBe('Cenas Exprés');
      expect(updated.icon).toBe('timer');
      expect(state.cookbooks.find(c => c.id === 'cb-cenas-rapidas').name).toBe('Cenas Exprés');
    });

    it('deleteCookbook elimina el libro y lo desenlaza de las recetas sin borrarlas', () => {
      const res = state.deleteCookbook('cb-cenas-rapidas');
      expect(res).toBe(true);
      expect(state.cookbooks.some(c => c.id === 'cb-cenas-rapidas')).toBe(false);

      // rec-1 solo tenía ese libro, ahora queda vacío pero la receta sigue intacta
      const rec1 = state.recipes.find(r => r.id === 'rec-1');
      expect(rec1).toBeDefined();
      expect(rec1.cookbooks.includes('cb-cenas-rapidas')).toBe(false);

      // rec-3 tenía dos libros, solo debe quedar con 'cb-postres'
      const rec3 = state.recipes.find(r => r.id === 'rec-3');
      expect(rec3).toBeDefined();
      expect(rec3.cookbooks).toEqual(['cb-postres']);
    });
  });

  describe('2. UI: Selector de Libros / Strip Horizontal (Estilo ReciMe)', () => {
    it('renderCookbooksStrip renderiza la pestaña "Todas" con el total de recetas y atributos ARIA', () => {
      appInstance.renderCookbooksStrip();
      const strip = document.getElementById('cookbooks-scroll-strip');
      expect(strip).not.toBeNull();
      expect(strip.getAttribute('role')).toBe('tablist');

      const allTab = strip.querySelector('[data-cookbook-id="all"]');
      expect(allTab).not.toBeNull();
      expect(allTab.getAttribute('role')).toBe('tab');
      expect(allTab.getAttribute('aria-selected')).toBe('true');
      expect(allTab.classList.contains('active')).toBe(true);
      expect(allTab.textContent).toContain('4'); // Total 4 recetas
    });

    it('renderiza pestañas para cada libro con su icono, nombre, contador y botón de opciones', () => {
      appInstance.renderCookbooksStrip();
      const strip = document.getElementById('cookbooks-scroll-strip');

      const cenasTab = strip.querySelector('[data-cookbook-id="cb-cenas-rapidas"]');
      expect(cenasTab).not.toBeNull();
      expect(cenasTab.textContent).toContain('Cenas Rápidas');
      expect(cenasTab.textContent).toContain('2'); // rec-1 y rec-3 tienen este libro

      const postresTab = strip.querySelector('[data-cookbook-id="cb-postres"]');
      expect(postresTab).not.toBeNull();
      expect(postresTab.textContent).toContain('Postres Caseros');
      expect(postresTab.textContent).toContain('2'); // rec-2 y rec-3

      const optBtn = cenasTab.querySelector('.cookbook-tab-options-btn');
      expect(optBtn).not.toBeNull();
      expect(optBtn.getAttribute('aria-label')).toBeTruthy();
    });

    it('al pulsar una pestaña de libro, filtra las recetas en 1 toque (applyRecipeFilters)', () => {
      appInstance.renderCookbooksStrip();
      const strip = document.getElementById('cookbooks-scroll-strip');
      const postresTab = strip.querySelector('[data-cookbook-id="cb-postres"]');

      postresTab.click();

      expect(appInstance.selectedCookbookId).toBe('cb-postres');
      const activeTab = strip.querySelector('[data-cookbook-id="cb-postres"]');
      expect(activeTab.getAttribute('aria-selected')).toBe('true');
      expect(activeTab.classList.contains('active')).toBe(true);

      const visible = appInstance.currentRenderedRecipesList;
      expect(visible.length).toBe(2);
      expect(visible.map(r => r.id).sort()).toEqual(['rec-2', 'rec-3']);
    });

    it('muestra un empty state específico y elegante si un libro no tiene recetas aún', () => {
      state.addCookbook({ id: 'cb-vacio', name: 'Libro Vacío', icon: 'auto_stories' });
      appInstance.selectCookbook('cb-vacio');

      const grid = document.getElementById('recipes-cards-grid');
      expect(grid.innerHTML).toContain('No hay recetas en este libro todavía');
    });
  });

  describe('3. Modal Crear / Editar Libros con <dialog> nativo', () => {
    it('openCreateCookbookModal abre el diálogo en modo creación con campos limpios', () => {
      appInstance.openCreateCookbookModal();
      const dialog = document.getElementById('modal-cookbook-dialog');
      const idInput = document.getElementById('input-cookbook-id');
      const nameInput = document.getElementById('input-cookbook-name');
      const deleteBtn = document.getElementById('btn-delete-cookbook-dialog');

      expect(dialog.classList.contains('active')).toBe(true);
      expect(idInput.value).toBe('');
      expect(nameInput.value).toBe('');
      expect(deleteBtn.style.display).toBe('none');
    });

    it('openEditCookbookModal carga los datos del libro y muestra botón de eliminar', () => {
      appInstance.openEditCookbookModal('cb-cenas-rapidas');
      const idInput = document.getElementById('input-cookbook-id');
      const nameInput = document.getElementById('input-cookbook-name');
      const descInput = document.getElementById('input-cookbook-desc');
      const deleteBtn = document.getElementById('btn-delete-cookbook-dialog');

      expect(idInput.value).toBe('cb-cenas-rapidas');
      expect(nameInput.value).toBe('Cenas Rápidas');
      expect(descInput.value).toBe('Platos rápidos para la cena');
      expect(deleteBtn.style.display).toBe('inline-flex');
    });

    it('renderCookbookIconSelector permite elegir el icono temático', () => {
      appInstance.renderCookbookIconSelector('auto_stories');
      const selector = document.getElementById('cookbook-icon-selector');
      const options = selector.querySelectorAll('.cookbook-icon-option');
      expect(options.length).toBeGreaterThan(10);

      const cakeBtn = selector.querySelector('[data-icon="cake"]');
      expect(cakeBtn).not.toBeNull();
      cakeBtn.click();

      expect(cakeBtn.classList.contains('active')).toBe(true);
      expect(document.getElementById('input-cookbook-icon').value).toBe('cake');
    });

    it('handleSaveCookbook valida el nombre y guarda nuevo libro', () => {
      document.getElementById('input-cookbook-id').value = '';
      document.getElementById('input-cookbook-name').value = 'Airfryer Top';
      document.getElementById('input-cookbook-icon').value = 'outdoor_grill';
      document.getElementById('input-cookbook-desc').value = 'Recetas crujientes';

      appInstance.handleSaveCookbook({ preventDefault: vi.fn() });

      expect(state.cookbooks.some(c => c.name === 'Airfryer Top')).toBe(true);
      expect(appInstance.selectedCookbookId).toMatch(/^cb-/);
    });

    it('handleDeleteCurrentCookbook pide confirmación segura y elimina el libro', async () => {
      vi.spyOn(appInstance, 'showConfirmDialog').mockResolvedValue(true);
      document.getElementById('input-cookbook-id').value = 'cb-cenas-rapidas';

      await appInstance.handleDeleteCurrentCookbook();

      expect(state.cookbooks.some(c => c.id === 'cb-cenas-rapidas')).toBe(false);
      expect(appInstance.selectedCookbookId).toBe('all');
    });
  });

  describe('4. Integración en Editor y Detalle de Receta', () => {
    it('renderEditorCookbooksChips muestra chips de selección para todos los libros', () => {
      appInstance.editorSelectedCookbooks = new Set(['cb-cenas-rapidas']);
      appInstance.renderEditorCookbooksChips();

      const container = document.getElementById('editor-cookbooks-chips');
      const chips = container.querySelectorAll('.cookbook-select-chip');
      expect(chips.length).toBe(2);

      const cenasChip = container.querySelector('[data-cookbook-id="cb-cenas-rapidas"]');
      expect(cenasChip.classList.contains('active')).toBe(true);

      const postresChip = container.querySelector('[data-cookbook-id="cb-postres"]');
      expect(postresChip.classList.contains('active')).toBe(false);

      // Alternar selección
      postresChip.click();
      expect(appInstance.editorSelectedCookbooks.has('cb-postres')).toBe(true);
    });

    it('openEditRecipeModal inicializa los libros asociados a la receta', () => {
      appInstance.openEditRecipeModal(state.recipes[0]);
      expect(appInstance.editorSelectedCookbooks.has('cb-cenas-rapidas')).toBe(true);
      expect(appInstance.editorSelectedCookbooks.has('cb-postres')).toBe(false);
    });

    it('saveRecipeEdit persiste la asignación de libros en la receta', () => {
      appInstance.openEditRecipeModal(state.recipes[3]); // Sopa Huérfana
      appInstance.toggleEditorCookbook('cb-cenas-rapidas');
      appInstance.toggleEditorCookbook('cb-postres');

      appInstance.saveRecipeEdit();

      const updated = state.recipes.find(r => r.id === 'rec-4');
      expect(updated.cookbooks).toContain('cb-cenas-rapidas');
      expect(updated.cookbooks).toContain('cb-postres');
    });

    it('renderRecipeModalContent muestra los badges de los libros en la ficha de detalle', () => {
      appInstance.activeRecipe = state.recipes[2]; // Pollo Asado Clásico (pertenece a 2 libros)
      appInstance.activeServings = 2;
      appInstance.renderRecipeModalContent();

      const modalBody = document.getElementById('recipe-modal-body');
      const cookbookChips = modalBody.querySelectorAll('.tag-chip-cookbook');
      expect(cookbookChips.length).toBe(2);
      expect(cookbookChips[0].textContent).toContain('Cenas Rápidas');
      expect(cookbookChips[1].textContent).toContain('Postres Caseros');
    });
  });

  describe('5. Soporte Bilingüe Completo (i18n ES / EN)', () => {
    it('traduce la barra de libros, empty state y modales al cambiar de idioma', () => {
      window.I18n.setPreference('en');
      appInstance.updateLanguageUI('en');

      const strip = document.getElementById('cookbooks-scroll-strip');
      expect(strip.querySelector('[data-cookbook-id="all"]').textContent).toContain('All recipes');

      const titleEl = document.getElementById('cookbook-dialog-title');
      appInstance.openCreateCookbookModal();
      expect(titleEl.textContent).toBe('Create cookbook');

      // Volver a español
      window.I18n.setPreference('es');
      appInstance.updateLanguageUI('es');
      expect(strip.querySelector('[data-cookbook-id="all"]').textContent).toContain('Todas las recetas');
    });
  });

  describe('6. Sistema de Diseño y Micro-interacciones (CSS)', () => {
    it('define estilos para la barra de libros, tabs, contadores y chips en styles.css', () => {
      const css = fs.readFileSync(stylesPath, 'utf-8');
      expect(css).toContain('.cookbooks-bar-container');
      expect(css).toContain('.cookbooks-scroll-strip');
      expect(css).toContain('.cookbook-tab-btn');
      expect(css).toContain('.cookbook-tab-btn:active:not(:disabled)');
      expect(css).toContain('transform: scale(0.97)');
      expect(css).toContain('.tag-chip-cookbook');
      expect(css).toContain('.cookbook-select-chip');
    });
  });
});
