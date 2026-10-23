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
        <div class="modal-content"><p>Detalle Receta</p></div>
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
    document.body.innerHTML += `
      <div id="recipe-modal-body"></div>
      <div id="recipe-detail-normal-actions" style="display: flex;"></div>
      <div id="recipe-detail-review-actions" style="display: none;"></div>
    `;

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
});

