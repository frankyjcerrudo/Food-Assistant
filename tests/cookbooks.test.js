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
        coverImage: 'auto',
        createdAt: '2026-11-12T00:00:00.000Z'
      },
      {
        id: 'cb-postres',
        name: 'Postres Caseros',
        icon: 'cake',
        description: 'Dulces y repostería',
        coverImage: 'auto',
        createdAt: '2026-11-12T00:00:00.000Z'
      }
    ];

    state.recipes = [
      {
        id: 'rec-1',
        title: 'Tortilla Rápida de Espinacas',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        cookbooks: ['cb-cenas-rapidas'],
        ingredients: [{ name: 'Huevos', amount: 3, unit: 'ud', aisle: 'dairy' }],
        instructions: [{ step: 1, text: 'Batir y cocinar 5 min.' }],
        tags: ['Cena', 'Rápida']
      },
      {
        id: 'rec-2',
        title: 'Tarta de Manzana y Canela',
        imageUrl: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2',
        cookbooks: ['cb-postres'],
        ingredients: [{ name: 'Manzanas', amount: 2, unit: 'ud', aisle: 'produce' }],
        instructions: [{ step: 1, text: 'Hornear 30 min.' }],
        tags: ['Postre']
      },
      {
        id: 'rec-3',
        title: 'Pollo Asado Clásico',
        imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6',
        cookbooks: ['cb-cenas-rapidas', 'cb-postres'], // En múltiples colecciones
        ingredients: [{ name: 'Pollo', amount: 1, unit: 'kg', aisle: 'meat' }],
        instructions: [{ step: 1, text: 'Hornear 45 min.' }],
        tags: ['Almuerzo']
      },
      {
        id: 'rec-4',
        title: 'Sopa Huérfana',
        imageUrl: '',
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

    it('addCookbook agrega un nuevo libro con id, coverImage y datos sanitizados', () => {
      const created = state.addCookbook({
        name: '  Favoritas de Mamá  ',
        icon: 'favorite',
        description: 'Recetas de la familia',
        coverImage: 'auto'
      });

      expect(created).toBeDefined();
      expect(created.id).toMatch(/^cb-/);
      expect(created.name).toBe('Favoritas de Mamá');
      expect(created.icon).toBe('favorite');
      expect(created.coverImage).toBe('auto');
      expect(state.cookbooks.some(c => c.id === created.id)).toBe(true);
    });

    it('updateCookbook modifica un libro existente preservando su id y actualizando portada', () => {
      const updated = state.updateCookbook('cb-cenas-rapidas', {
        name: 'Cenas Exprés',
        icon: 'timer',
        coverImage: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6'
      });

      expect(updated.id).toBe('cb-cenas-rapidas');
      expect(updated.name).toBe('Cenas Exprés');
      expect(updated.icon).toBe('timer');
      expect(updated.coverImage).toBe('https://images.unsplash.com/photo-1598103442097-8b74394b95c6');
      expect(state.cookbooks.find(c => c.id === 'cb-cenas-rapidas').name).toBe('Cenas Exprés');
    });

    it('deleteCookbook elimina el libro y lo desenlaza de las recetas sin borrarlas', () => {
      const res = state.deleteCookbook('cb-cenas-rapidas');
      expect(res).toBe(true);
      expect(state.cookbooks.some(c => c.id === 'cb-cenas-rapidas')).toBe(false);

      const rec1 = state.recipes.find(r => r.id === 'rec-1');
      expect(rec1).toBeDefined();
      expect(rec1.cookbooks.includes('cb-cenas-rapidas')).toBe(false);

      const rec3 = state.recipes.find(r => r.id === 'rec-3');
      expect(rec3).toBeDefined();
      expect(rec3.cookbooks).toEqual(['cb-postres']);
    });
  });

  describe('2. UI: Estantería Compacta y Título Unificado "Libro: [Nombre]"', () => {
    it('renderCookbooksShelf renderiza la cabecera compacta y las tarjetas en el carrusel', () => {
      appInstance.renderCookbooksShelf();
      const carousel = document.getElementById('cookbooks-cards-carousel');
      expect(carousel).not.toBeNull();

      const createCard = carousel.querySelector('#btn-card-create-cookbook');
      expect(createCard).not.toBeNull();
      expect(createCard.textContent).toContain('Crear libro');

      const cards = carousel.querySelectorAll('.cookbook-book-card');
      expect(cards.length).toBe(2);

      const cenasCard = carousel.querySelector('[data-cookbook-id="cb-cenas-rapidas"]');
      expect(cenasCard).not.toBeNull();
      expect(cenasCard.textContent).toContain('Cenas Rápidas');
      expect(cenasCard.textContent).toContain('2 recetas');

      // Portada con imagen de la primera receta
      const coverImg = cenasCard.querySelector('.cookbook-book-cover');
      expect(coverImg).not.toBeNull();
      expect(coverImg.getAttribute('src')).toBe('https://images.unsplash.com/photo-1546069901-ba9599a7e63c');
    });

    it('al pulsar una tarjeta de libro, actualiza la cabecera a "Libro: [Nombre]" y muestra el botón volver', () => {
      appInstance.renderCookbooksShelf();
      const carousel = document.getElementById('cookbooks-cards-carousel');
      const postresCard = carousel.querySelector('[data-cookbook-id="cb-postres"]');

      postresCard.click();

      expect(appInstance.selectedCookbookId).toBe('cb-postres');

      const shelfSection = document.getElementById('cookbooks-shelf-section');
      expect(shelfSection.style.display).toBe('none');

      const titleText = document.getElementById('recipes-section-title-text');
      expect(titleText.textContent).toBe('Libro: Postres Caseros');

      const backBtn = document.getElementById('btn-back-to-all-cookbooks');
      expect(backBtn.hidden).toBe(false);

      const visible = appInstance.currentRenderedRecipesList;
      expect(visible.length).toBe(2);
      expect(visible.map(r => r.id).sort()).toEqual(['rec-2', 'rec-3']);
    });

    it('al pulsar el botón volver en la cabecera, restaura el título "Recetario" y muestra la estantería', () => {
      appInstance.enterCookbook('cb-postres');
      expect(appInstance.selectedCookbookId).toBe('cb-postres');

      const backBtn = document.getElementById('btn-back-to-all-cookbooks');
      expect(backBtn.hidden).toBe(false);
      backBtn.click();

      expect(appInstance.selectedCookbookId).toBe('all');
      const shelfSection = document.getElementById('cookbooks-shelf-section');
      expect(shelfSection.style.display).toBe('flex');
      expect(backBtn.hidden).toBe(true);

      const titleText = document.getElementById('recipes-section-title-text');
      expect(titleText.textContent).toBe('Recetario');

      const visible = appInstance.currentRenderedRecipesList;
      expect(visible.length).toBe(4);
    });

    it('muestra un empty state específico y elegante si un libro no tiene recetas aún', () => {
      state.addCookbook({ id: 'cb-vacio', name: 'Libro Vacío', icon: 'auto_stories' });
      appInstance.enterCookbook('cb-vacio');

      const grid = document.getElementById('recipes-cards-grid');
      expect(grid.innerHTML).toContain('No hay recetas en este libro todavía');
    });
  });

  describe('3. Modal Crear / Editar Libros y Selección de Portada', () => {
    it('openCreateCookbookModal abre el diálogo con opciones de portada por defecto en auto', () => {
      appInstance.openCreateCookbookModal();
      const dialog = document.getElementById('modal-cookbook-dialog');
      const idInput = document.getElementById('input-cookbook-id');
      const nameInput = document.getElementById('input-cookbook-name');
      const coverInput = document.getElementById('input-cookbook-cover-image');
      const deleteBtn = document.getElementById('btn-delete-cookbook-dialog');

      expect(dialog.classList.contains('active')).toBe(true);
      expect(idInput.value).toBe('');
      expect(nameInput.value).toBe('');
      expect(coverInput.value).toBe('auto');
      expect(deleteBtn.style.display).toBe('none');
    });

    it('renderCookbookCoverSelector permite elegir entre automática, icono o miniatura de receta', () => {
      appInstance.renderCookbookCoverSelector('cb-cenas-rapidas', 'auto');
      const selector = document.getElementById('cookbook-cover-selector');
      expect(selector).not.toBeNull();

      // Miniaturas de recetas que tienen foto en este libro (rec-1 y rec-3)
      const thumbs = selector.querySelectorAll('.cookbook-cover-thumb-btn');
      expect(thumbs.length).toBe(2);

      // Al pulsar una miniatura específica, selecciona esa foto
      thumbs[1].click();
      const coverInput = document.getElementById('input-cookbook-cover-image');
      expect(coverInput.value).toBe('https://images.unsplash.com/photo-1598103442097-8b74394b95c6');
      expect(thumbs[1].classList.contains('active')).toBe(true);
    });

    it('handleSaveCookbook valida el nombre y persiste la foto de portada elegida', () => {
      document.getElementById('input-cookbook-id').value = '';
      document.getElementById('input-cookbook-name').value = 'Airfryer Top';
      document.getElementById('input-cookbook-icon').value = 'outdoor_grill';
      document.getElementById('input-cookbook-desc').value = 'Recetas crujientes';
      document.getElementById('input-cookbook-cover-image').value = 'none';

      appInstance.handleSaveCookbook({ preventDefault: vi.fn() });

      const created = state.cookbooks.find(c => c.name === 'Airfryer Top');
      expect(created).toBeDefined();
      expect(created.coverImage).toBe('none');
      expect(appInstance.selectedCookbookId).toBe(created.id);
    });

    it('handleDeleteCurrentCookbook pide confirmación segura y elimina el libro', async () => {
      vi.spyOn(appInstance, 'showConfirmDialog').mockResolvedValue(true);
      document.getElementById('input-cookbook-id').value = 'cb-cenas-rapidas';

      await appInstance.handleDeleteCurrentCookbook();

      expect(state.cookbooks.some(c => c.id === 'cb-cenas-rapidas')).toBe(false);
      expect(appInstance.selectedCookbookId).toBe('all');
    });
  });

  describe('4. Editor Full-Screen, Saturación de Etiquetas y Detalle de Receta', () => {
    it('el modal de edición utiliza el contenedor full-screen expansivo y alinea inputs numéricos', () => {
      const editModal = document.getElementById('modal-recipe-edit');
      const content = editModal.querySelector('.recipe-editor-full-modal');
      expect(content).not.toBeNull();
      const headerBar = content.querySelector('.recipe-editor-header-bar');
      expect(headerBar).not.toBeNull();

      const metaGrid = editModal.querySelector('.recipe-editor-meta-grid');
      expect(metaGrid).not.toBeNull();
      const cookInput = editModal.querySelector('#edit-recipe-cook');
      expect(cookInput).not.toBeNull();
    });

    it('renderRecipeEditorChips controla la saturación de etiquetas limitando la lista inicial', () => {
      state.customTags = ['Extra1', 'Extra2', 'Extra3', 'Extra4', 'Extra5', 'Extra6', 'Extra7', 'Extra8', 'Extra9', 'Extra10'];
      state.recipes[0].tags = ['Extra1', 'Extra2', 'Extra3', 'Extra4', 'Extra5', 'Extra6', 'Extra7', 'Extra8', 'Extra9', 'Extra10'];

      appInstance.editorSelectedTags = new Set();
      appInstance.editorShowAllTags = false;
      appInstance.renderRecipeEditorChips();

      const practicalContainer = document.getElementById('editor-practical-chips');
      const toggleBtn = practicalContainer.querySelector('#btn-toggle-more-tags');
      expect(toggleBtn).not.toBeNull();
      expect(toggleBtn.textContent).toContain('Ver más etiquetas');

      // Al pulsar ver más, expande
      toggleBtn.click();
      expect(appInstance.editorShowAllTags).toBe(true);
      const toggleLessBtn = practicalContainer.querySelector('#btn-toggle-more-tags');
      expect(toggleLessBtn.textContent).toContain('Ver menos etiquetas');
    });

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

  describe('5. Acción Masiva: Añadir Recetas Seleccionadas a Libros (Bulk Action)', () => {
    it('el botón de acción masiva se habilita solo cuando hay recetas seleccionadas', () => {
      appInstance.selectedRecipeIds = new Set();
      appInstance.updateRecipeSelectModeUI();
      const btnBulkAdd = document.getElementById('btn-recipes-bulk-add-to-cookbook');
      expect(btnBulkAdd.disabled).toBe(true);

      appInstance.selectedRecipeIds.add('rec-4');
      appInstance.updateRecipeSelectModeUI();
      expect(btnBulkAdd.disabled).toBe(false);
    });

    it('openBulkAddCookbookModal abre el modal y lista los libros con checkboxes', () => {
      appInstance.selectedRecipeIds = new Set(['rec-4']);
      appInstance.openBulkAddCookbookModal();

      const modal = document.getElementById('modal-bulk-add-cookbook');
      expect(modal.classList.contains('active')).toBe(true);

      const list = document.getElementById('bulk-add-cookbooks-list');
      const checkboxes = list.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBe(2);
    });

    it('handleBulkAddCookbook asigna las recetas seleccionadas a los libros marcados', () => {
      appInstance.selectedRecipeIds = new Set(['rec-4']);
      appInstance.openBulkAddCookbookModal();

      const list = document.getElementById('bulk-add-cookbooks-list');
      const cbCenas = list.querySelector('#bulk-cb-cb-cenas-rapidas');
      cbCenas.checked = true;

      appInstance.handleBulkAddCookbook();

      const rec4 = state.recipes.find(r => r.id === 'rec-4');
      expect(rec4.cookbooks).toContain('cb-cenas-rapidas');
      expect(appInstance.selectedRecipeIds.size).toBe(0);
      expect(appInstance.isRecipeSelectMode).toBe(false);
    });

    it('updateRecipeSelectModeUI muestra el botón "Quitar del libro" solo cuando se navega dentro de un libro', () => {
      const removeBtn = document.getElementById('btn-recipes-bulk-remove-from-cookbook');
      expect(removeBtn).not.toBeNull();

      // En el recetario general ('all'), el botón está oculto
      appInstance.selectedCookbookId = 'all';
      appInstance.updateRecipeSelectModeUI();
      expect(removeBtn.style.display).toBe('none');

      // Dentro de un libro activo, se muestra
      appInstance.selectedCookbookId = 'cb-cenas-rapidas';
      appInstance.updateRecipeSelectModeUI();
      expect(removeBtn.style.display).toBe('inline-flex');
    });

    it('handleBulkRemoveFromCookbook elimina la receta del libro pero la conserva intacta en el recetario general', async () => {
      vi.spyOn(appInstance, 'showConfirmDialog').mockResolvedValue(true);

      appInstance.selectedCookbookId = 'cb-cenas-rapidas';
      const rec = state.recipes[0];
      expect(rec.cookbooks).toContain('cb-cenas-rapidas');

      appInstance.selectedRecipeIds = new Set([rec.id]);
      await appInstance.handleBulkRemoveFromCookbook();

      // La receta ya no está en el libro 'cb-cenas-rapidas'
      expect(rec.cookbooks).not.toContain('cb-cenas-rapidas');
      // La receta SIGUE existiendo en el catálogo general
      expect(state.recipes.some(r => r.id === rec.id)).toBe(true);
      expect(appInstance.selectedRecipeIds.size).toBe(0);
      expect(appInstance.isRecipeSelectMode).toBe(false);
    });
  });

  describe('6. Soporte Bilingüe Completo (i18n ES / EN)', () => {
    it('traduce la estantería, cabecera y modales al cambiar de idioma', () => {
      window.I18n.setPreference('en');
      appInstance.updateLanguageUI('en');

      const shelfTitle = document.querySelector('[data-i18n="cookbooks.shelfTitle"]');
      expect(shelfTitle.textContent).toBe('My Cookbooks');

      const backBtn = document.getElementById('btn-back-to-all-cookbooks');
      expect(backBtn.textContent).toContain('Back to all cookbooks');

      const titleEl = document.getElementById('cookbook-dialog-title');
      appInstance.openCreateCookbookModal();
      expect(titleEl.textContent).toBe('Create cookbook');

      // Volver a español
      window.I18n.setPreference('es');
      appInstance.updateLanguageUI('es');
      expect(shelfTitle.textContent).toBe('Mis Libros de Cocina');
      expect(backBtn.textContent).toContain('Volver a todos los libros');
    });
  });

  describe('7. Sistema de Diseño y Micro-interacciones (CSS)', () => {
    it('define estilos para estantería compacta, selector de portada, editor y bulk en styles.css', () => {
      const css = fs.readFileSync(stylesPath, 'utf-8');
      expect(css).toContain('.cookbooks-shelf-section');
      expect(css).toContain('.cookbooks-shelf-title');
      expect(css).toContain('.cookbooks-cards-carousel');
      expect(css).toContain('.cookbook-book-card');
      expect(css).toContain('.btn-back-cookbook');
      expect(css).toContain('.cookbook-cover-selector');
      expect(css).toContain('.cookbook-cover-thumb-btn');
      expect(css).toContain('.recipe-editor-full-modal');
      expect(css).toContain('.recipe-editor-meta-grid');
      expect(css).toContain('.editor-tags-toggle-btn');
      expect(css).toContain('.bulk-add-cookbooks-list');
    });
  });

  describe('8. Sincronización en la Nube Multi-dispositivo y en Familia (US-31, US-77)', () => {
    it('pushToCloud y pullFromCloud sincronizan libros entre distintos dispositivos de la misma cuenta', async () => {
      state.cloudUser = { id: 'user-franky-1', email: 'franky@test.com', name: 'Franky' };
      state.household = null;
      state.cookbooks = [
        { id: 'cb-batch', name: 'Batch Cooking', icon: 'bolt', description: 'Tuppers', coverImage: 'auto' }
      ];

      const pushedPayloads = {};
      let updatedUserMetadata = null;

      appInstance.supabaseClient = {
        from: vi.fn().mockImplementation((table) => ({
          delete: vi.fn().mockReturnValue({ in: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }) }),
          upsert: vi.fn().mockImplementation(async (payload) => {
            pushedPayloads[table] = payload;
            return { data: payload, error: null };
          }),
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: [], error: null })
            })
          })
        })),
        auth: {
          updateUser: vi.fn().mockImplementation(async ({ data }) => {
            updatedUserMetadata = data;
            return { data: {}, error: null };
          }),
          getUser: vi.fn().mockImplementation(async () => ({
            data: {
              user: {
                id: 'user-franky-1',
                email: 'franky@test.com',
                user_metadata: updatedUserMetadata || { cookbooks: state.cookbooks }
              }
            },
            error: null
          }))
        }
      };

      // 1. Dispositivo 1 sube libros
      await appInstance.pushToCloud(true);
      while (appInstance.isPushingToCloud) {
        await new Promise(r => setTimeout(r, 10));
      }

      // Debe guardarse en user_metadata y en __user_prefs__ de meal_plans
      expect(updatedUserMetadata).toBeDefined();
      expect(updatedUserMetadata.cookbooks).toHaveLength(1);
      expect(updatedUserMetadata.cookbooks[0].name).toBe('Batch Cooking');

      expect(pushedPayloads['meal_plans']).toBeDefined();
      const userPrefsRow = pushedPayloads['meal_plans'].find(r => r.id === '__user_prefs__');
      expect(userPrefsRow).toBeDefined();
      const cbSlot = userPrefsRow.custom_slots.find(s => s.type === 'user_cookbooks');
      expect(cbSlot).toBeDefined();
      expect(cbSlot.cookbooks[0].id).toBe('cb-batch');

      // 2. Dispositivo 2 descarga datos (inicia con catálogo vacío)
      state.cookbooks = [];
      appInstance.supabaseClient.from = vi.fn().mockImplementation((table) => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockImplementation(async () => {
              if (table === 'meal_plans') {
                return { data: [userPrefsRow], error: null };
              }
              return { data: [], error: null };
            })
          })
        })
      }));

      await appInstance.pullFromCloud();
      expect(state.cookbooks.some(c => c.id === 'cb-batch')).toBe(true);
      expect(state.cookbooks.find(c => c.id === 'cb-batch').name).toBe('Batch Cooking');
    });

    it('en Modo Familia, la subida utiliza el id del usuario actual sin violar RLS y se sincroniza con otros miembros', async () => {
      // Franky (miembro, no dueño) crea un libro familiar
      state.cloudUser = { id: 'user-member-2', email: 'member@test.com', name: 'Miembro' };
      state.household = { id: 'hh-family-99', name: 'Familia', ownerId: 'user-owner-1', role: 'member' };
      state.cookbooks = [
        { id: 'cb-familia-asados', name: 'Asados Familiares', icon: 'outdoor_grill', description: 'Barbacoas' }
      ];

      const pushedPayloads = {};
      appInstance.supabaseClient = {
        from: vi.fn().mockImplementation((table) => ({
          delete: vi.fn().mockReturnValue({ in: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }) }),
          upsert: vi.fn().mockImplementation(async (payload) => {
            pushedPayloads[table] = payload;
            return { data: payload, error: null };
          }),
          select: vi.fn().mockReturnValue({
            or: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: [], error: null })
            })
          })
        })),
        auth: {
          updateUser: vi.fn().mockResolvedValue({ data: {}, error: null }),
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-member-2', user_metadata: {} } }, error: null })
        }
      };

      await appInstance.pushToCloud(true);
      while (appInstance.isPushingToCloud) {
        await new Promise(r => setTimeout(r, 10));
      }

      const hhPrefsRow = pushedPayloads['meal_plans'].find(r => r.id === '__household_prefs__');
      expect(hhPrefsRow).toBeDefined();
      // user_id DEBE ser el del usuario autenticado (user-member-2) para cumplir RLS
      expect(hhPrefsRow.user_id).toBe('user-member-2');
      expect(hhPrefsRow.household_id).toBe('hh-family-99');
      const cbSlot = hhPrefsRow.custom_slots.find(s => s.type === 'household_cookbooks');
      expect(cbSlot.cookbooks[0].name).toBe('Asados Familiares');
    });

    it('handleRealtimeCookbooksBroadcast actualiza libros en vivo vía WebSocket', () => {
      state.cookbooks = [{ id: 'cb-1', name: 'Viejo Libro' }];
      appInstance.clientId = 'client-local-1';

      // Mensaje de otro cliente
      appInstance.handleRealtimeCookbooksBroadcast({
        clientId: 'client-remote-2',
        cookbooks: [
          { id: 'cb-1', name: 'Viejo Libro' },
          { id: 'cb-2', name: 'Nuevo Libro en Tiempo Real' }
        ]
      });

      expect(state.cookbooks).toHaveLength(2);
      expect(state.cookbooks.some(c => c.id === 'cb-2')).toBe(true);

      // Mensaje emitido por el propio cliente se ignora
      appInstance.handleRealtimeCookbooksBroadcast({
        clientId: 'client-local-1',
        cookbooks: [{ id: 'cb-ignored', name: 'No debe entrar' }]
      });
      expect(state.cookbooks.some(c => c.id === 'cb-ignored')).toBe(false);
    });
  });
});
