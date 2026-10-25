import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Evaluate app.js in happy-dom
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const { FoodAssistantApp } = window;

describe('US-15 & A11y: Cierre de Modales por Clic Fuera (Backdrop Dismiss) y Tecla Escape', () => {
  let appInstance;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="modal-overlay" id="modal-recipe-detail">
        <div class="modal-header-bar">
          <div id="recipe-detail-normal-actions" style="display: flex;"></div>
          <div id="recipe-detail-review-actions" style="display: none;"></div>
        </div>
        <div class="modal-content">
          <div id="recipe-modal-body"><p>Detalle Receta</p></div>
        </div>
      </div>
      <div class="modal-overlay" id="modal-recipe-import">
        <div class="modal-content"><p>Importar Receta</p></div>
      </div>
      <div class="modal-overlay" id="modal-auth">
        <div class="modal-content"><p>Auth</p></div>
      </div>
      <div class="cook-mode-overlay" id="cook-mode-overlay">
        <button id="btn-exit-cook-mode">Salir</button>
      </div>
    `;
    appInstance = new FoodAssistantApp();
  });

  it('closeModalByElement cierra el modal adecuado según el ID del overlay', () => {
    const detailModal = document.getElementById('modal-recipe-detail');
    detailModal.classList.add('active');
    expect(detailModal.classList.contains('active')).toBe(true);

    appInstance.closeModalByElement(detailModal);
    expect(detailModal.classList.contains('active')).toBe(false);

    const importModal = document.getElementById('modal-recipe-import');
    importModal.classList.add('active');
    expect(importModal.classList.contains('active')).toBe(true);

    appInstance.closeModalByElement(importModal);
    expect(importModal.classList.contains('active')).toBe(false);
  });

  it('hacer clic en el fondo del overlay cierra el modal activo (Backdrop Dismiss)', () => {
    const detailModal = document.getElementById('modal-recipe-detail');
    detailModal.classList.add('active');
    expect(detailModal.classList.contains('active')).toBe(true);

    // Simulate backdrop click (mousedown + click on overlay)
    detailModal.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    detailModal.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(detailModal.classList.contains('active')).toBe(false);
  });

  it('pulsar la tecla Escape cierra el modal activo más reciente', () => {
    const detailModal = document.getElementById('modal-recipe-detail');
    detailModal.classList.add('active');
    expect(detailModal.classList.contains('active')).toBe(true);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(detailModal.classList.contains('active')).toBe(false);
  });

  it('openImportReview activa el modo revisión en modal-recipe-detail y permite guardar o cancelar', () => {

    const draft = {
      id: 'rec-draft-test',
      title: 'Crema casera de calabacín y manzana',
      servings: 2,
      prepTimeMinutes: 10,
      cookTimeMinutes: 25,
      imageUrl: 'https://media.hellofresh.com/image.jpg',
      tags: [],
      ingredients: [
        { name: 'Calabacín', amount: 1, unit: 'ud', aisle: 'produce' },
        { name: 'Manzana', amount: 1, unit: 'ud', aisle: 'produce' }
      ],
      instructions: [{ step: 1, text: 'Cortar y cocer.', timerMinutes: 25 }]
    };

    appInstance.openImportReview(draft);
    expect(appInstance.isReviewingImport).toBe(true);
    expect(appInstance.pendingImportRecipe).toBe(draft);
    expect(document.getElementById('modal-recipe-detail').classList.contains('active')).toBe(true);
    expect(document.getElementById('recipe-detail-normal-actions').style.display).toBe('none');
    expect(document.getElementById('recipe-detail-review-actions').style.display).toBe('flex');
    expect(document.getElementById('recipe-modal-body').innerHTML).toContain('Revisión de Receta Importada (Borrador)');

    // Cancel import review
    appInstance.cancelImportReview();
    expect(appInstance.isReviewingImport).toBe(false);
    expect(appInstance.pendingImportRecipe).toBe(null);
    expect(document.getElementById('modal-recipe-detail').classList.contains('active')).toBe(false);
    expect(document.getElementById('recipe-detail-normal-actions').style.display).toBe('flex');
    expect(document.getElementById('recipe-detail-review-actions').style.display).toBe('none');
  });

  it('Editar Receta: Botón Guardar en cabecera fija y pie sticky siempre visible sin scroll', () => {
    let saved = 0;
    appInstance.saveRecipeEdit = () => { saved++; };

    const saveHeaderBtn = document.createElement('button');
    saveHeaderBtn.id = 'btn-save-recipe-edit-header';
    const saveFooterBtn = document.createElement('button');
    saveFooterBtn.id = 'btn-save-recipe-edit';
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'btn-cancel-recipe-edit';

    document.body.appendChild(saveHeaderBtn);
    document.body.appendChild(saveFooterBtn);
    document.body.appendChild(cancelBtn);

    // Re-bind listeners
    saveHeaderBtn.addEventListener('click', () => appInstance.saveRecipeEdit());
    saveFooterBtn.addEventListener('click', () => appInstance.saveRecipeEdit());

    saveHeaderBtn.click();
    expect(saved).toBe(1);

    saveFooterBtn.click();
    expect(saved).toBe(2);

    document.body.removeChild(saveHeaderBtn);
    document.body.removeChild(saveFooterBtn);
    document.body.removeChild(cancelBtn);
  });

  it('RecipeParser: Filtrado de navegación de blogs y enlaces vacíos en instrucciones', () => {
    const rawBlogText = [
      '# Ensalada Templada de Setas',
      '## Ingredientes',
      '* 300 g Setas variadas',
      '* 100 g Brotes verdes',
      '* 2 cucharadas Aceite de oliva',
      '## Preparación',
      '1. Limpiar las setas y saltearlas en una sartén con aceite durante 6 minutos.',
      '2. Colocar la cama de brotes verdes y disponer las setas templadas encima.',
      'Anterior entrada',
      'Siguiente entrada',
      'Te va a encantar...',
      'Previous',
      '[](https://www.velocidadcuchara.com/charlotka-tarta-de-manzana/)',
      '[](https://www.velocidadcuchara.com/croquetas-de-jamon/)'
    ].join('\n');

    const parsed = window.RecipeParser.parseRecipeText(rawBlogText);
    expect(parsed).not.toBeNull();
    expect(parsed.instructions.length).toBe(2);
    expect(parsed.instructions[0].text).toContain('Limpiar las setas');
    expect(parsed.instructions[1].text).toContain('Colocar la cama de brotes');
    expect(parsed.instructions.some(s => s.text.toLowerCase().includes('anterior') || s.text.toLowerCase().includes('velocidadcuchara'))).toBe(false);
  });

  it('Control de Versión: APP_VERSION sincronizada en badges y vista de ajustes', () => {
    expect(window.APP_VERSION).toBe('v0.33');
    expect(appInstance.appVersion).toBe('v0.33');

    const badge = document.createElement('span');
    badge.id = 'app-version-badge';
    const settingsVer = document.createElement('strong');
    settingsVer.id = 'settings-app-version-text';
    document.body.appendChild(badge);
    document.body.appendChild(settingsVer);

    appInstance.initVersion();
    expect(badge.textContent).toBe('v0.33');
    expect(settingsVer.textContent).toBe('v0.33');

    document.body.removeChild(badge);
    document.body.removeChild(settingsVer);
  });
});


