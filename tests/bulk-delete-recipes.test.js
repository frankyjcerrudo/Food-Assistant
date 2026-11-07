import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Evaluate app.js in happy-dom browser environment
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

describe('US-78: Selección Múltiple, Borrado en Lote y Filtros de Auditoría de Recetas', () => {
  let appInstance;

  beforeEach(() => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    document.documentElement.innerHTML = fs.readFileSync(htmlPath, 'utf-8');

    // Inicializar estado de pruebas con recetas limpias
    state.recipes = [
      {
        id: 'rec-completa-1',
        title: 'Pollo al Horno con Patatas',
        ingredients: [{ name: 'Pechuga de pollo', amount: 500, unit: 'g' }],
        instructions: [{ step: 1, text: 'Hornear a 200°C' }],
        tags: ['Almuerzo', 'Horno']
      },
      {
        id: 'rec-sin-ingredientes-1',
        title: 'Idea de Batido Verde',
        ingredients: [],
        instructions: [{ step: 1, text: 'Mezclar todo en la batidora' }],
        tags: ['Desayuno']
      },
      {
        id: 'rec-sin-pasos-1',
        title: 'Ensalada Rápida de Tomate y Ventresca',
        ingredients: [{ name: 'Tomate', amount: 2, unit: 'ud' }, { name: 'Ventresca', amount: 1, unit: 'lata' }],
        instructions: [],
        tags: ['Cena', 'Rápida']
      },
      {
        id: 'rec-vacia-1',
        title: 'Plato Incompleto',
        ingredients: [],
        instructions: [],
        tags: []
      }
    ];

    state.deletedRecords = { recipes: [], mealPlans: [], shoppingItems: [] };
    appInstance = new window.FoodAssistantApp();
  });

  describe('1. Métodos de Detección de Recetas Incompletas (Auditoría)', () => {
    it('hasNoIngredients detecta recetas sin ingredientes o con lista vacía', () => {
      expect(appInstance.hasNoIngredients(state.recipes[0])).toBe(false);
      expect(appInstance.hasNoIngredients(state.recipes[1])).toBe(true);
      expect(appInstance.hasNoIngredients(state.recipes[3])).toBe(true);
      expect(appInstance.hasNoIngredients({ ingredients: [{ rawText: '   ' }] })).toBe(true);
    });

    it('hasNoInstructions detecta recetas sin pasos ni elaboración', () => {
      expect(appInstance.hasNoInstructions(state.recipes[0])).toBe(false);
      expect(appInstance.hasNoInstructions(state.recipes[2])).toBe(true);
      expect(appInstance.hasNoInstructions(state.recipes[3])).toBe(true);
      expect(appInstance.hasNoInstructions({ instructions: [{ text: '' }] })).toBe(true);
    });
  });

  describe('2. Filtros de Auditoría ("Sin ingredientes" y "Sin pasos")', () => {
    it('filtra correctamente recetas con el chip "Sin ingredientes"', () => {
      appInstance.recipeAuditFilter = 'no-ingredients';
      appInstance.applyRecipeFilters();

      const renderedList = appInstance.currentRenderedRecipesList;
      expect(renderedList).toHaveLength(2);
      expect(renderedList.map(r => r.id)).toEqual(
        expect.arrayContaining(['rec-sin-ingredientes-1', 'rec-vacia-1'])
      );
    });

    it('filtra correctamente recetas con el chip "Sin pasos"', () => {
      appInstance.recipeAuditFilter = 'no-instructions';
      appInstance.applyRecipeFilters();

      const renderedList = appInstance.currentRenderedRecipesList;
      expect(renderedList).toHaveLength(2);
      expect(renderedList.map(r => r.id)).toEqual(
        expect.arrayContaining(['rec-sin-pasos-1', 'rec-vacia-1'])
      );
    });

    it('al seleccionar el chip "Todas", se limpia el filtro de auditoría', () => {
      appInstance.recipeAuditFilter = 'no-ingredients';
      appInstance.initRecipeTagFilters();

      const chipAll = document.querySelector('.m3-filter-chip[data-tag="all"]');
      chipAll.click();

      expect(appInstance.recipeAuditFilter).toBeNull();
      expect(appInstance.currentRenderedRecipesList).toHaveLength(4);
    });
  });

  describe('3. Modo Selección Múltiple (Selection Mode)', () => {
    it('toggleRecipeSelectMode activa y desactiva la barra de herramientas y estado', () => {
      expect(appInstance.isRecipeSelectMode).toBe(false);
      const toolbar = document.getElementById('recipes-bulk-toolbar');
      expect(toolbar.style.display).toBe('none');

      appInstance.toggleRecipeSelectMode(true);
      expect(appInstance.isRecipeSelectMode).toBe(true);
      expect(toolbar.style.display).toBe('flex');

      appInstance.toggleRecipeSelectMode(false);
      expect(appInstance.isRecipeSelectMode).toBe(false);
      expect(toolbar.style.display).toBe('none');
    });

    it('toggleRecipeSelect añade y quita IDs de la selección', () => {
      appInstance.toggleRecipeSelectMode(true);

      appInstance.toggleRecipeSelect('rec-completa-1');
      expect(appInstance.selectedRecipeIds.has('rec-completa-1')).toBe(true);
      expect(appInstance.selectedRecipeIds.size).toBe(1);

      appInstance.toggleRecipeSelect('rec-sin-ingredientes-1');
      expect(appInstance.selectedRecipeIds.size).toBe(2);

      appInstance.toggleRecipeSelect('rec-completa-1');
      expect(appInstance.selectedRecipeIds.has('rec-completa-1')).toBe(false);
      expect(appInstance.selectedRecipeIds.size).toBe(1);
    });

    it('selectVisibleRecipes selecciona todas las recetas visibles en pantalla', () => {
      appInstance.recipeAuditFilter = 'no-ingredients';
      appInstance.applyRecipeFilters();

      appInstance.selectVisibleRecipes();
      expect(appInstance.selectedRecipeIds.size).toBe(2);
      expect(appInstance.selectedRecipeIds.has('rec-sin-ingredientes-1')).toBe(true);
      expect(appInstance.selectedRecipeIds.has('rec-vacia-1')).toBe(true);
    });

    it('deselectAllRecipes vacía la selección', () => {
      appInstance.selectVisibleRecipes();
      expect(appInstance.selectedRecipeIds.size).toBeGreaterThan(0);

      appInstance.deselectAllRecipes();
      expect(appInstance.selectedRecipeIds.size).toBe(0);
    });
  });

  describe('4. Borrado en Lote (Bulk Delete)', () => {
    it('elimina en lote las recetas seleccionadas y registra trackDeletion', async () => {
      // Mock de showConfirmDialog para auto-aceptar
      vi.spyOn(appInstance, 'showConfirmDialog').mockResolvedValue(true);
      vi.spyOn(appInstance, 'pushToCloud').mockResolvedValue();

      appInstance.isRecipeSelectMode = true;
      appInstance.selectedRecipeIds.add('rec-sin-ingredientes-1');
      appInstance.selectedRecipeIds.add('rec-vacia-1');

      const result = await appInstance.deleteSelectedRecipes();
      expect(result).toBe(true);

      // Verificación en catálogo
      expect(state.recipes).toHaveLength(2);
      expect(state.recipes.find(r => r.id === 'rec-sin-ingredientes-1')).toBeUndefined();
      expect(state.recipes.find(r => r.id === 'rec-vacia-1')).toBeUndefined();

      // Verificación en borrados rastreados
      expect(state.deletedRecords.recipes).toContain('rec-sin-ingredientes-1');
      expect(state.deletedRecords.recipes).toContain('rec-vacia-1');

      // Verificación de estado de selección limpio
      expect(appInstance.selectedRecipeIds.size).toBe(0);
      expect(appInstance.isRecipeSelectMode).toBe(false);
    });

    it('si el usuario cancela el diálogo de confirmación, no se borra ninguna receta', async () => {
      vi.spyOn(appInstance, 'showConfirmDialog').mockResolvedValue(false);

      appInstance.isRecipeSelectMode = true;
      appInstance.selectedRecipeIds.add('rec-sin-ingredientes-1');

      const result = await appInstance.deleteSelectedRecipes();
      expect(result).toBe(false);

      expect(state.recipes).toHaveLength(4);
      expect(appInstance.selectedRecipeIds.size).toBe(1);
    });
  });
});

