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
});
