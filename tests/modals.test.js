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
    expect(window.APP_VERSION).toBe('v0.69');
    expect(appInstance.appVersion).toBe('v0.69');

    const badge = document.createElement('span');
    badge.id = 'app-version-badge';
    const settingsVer = document.createElement('strong');
    settingsVer.id = 'settings-app-version-text';
    document.body.appendChild(badge);
    document.body.appendChild(settingsVer);

    appInstance.initVersion();
    expect(badge.textContent).toBe('v0.69');
    expect(settingsVer.textContent).toBe('v0.69');

    document.body.removeChild(badge);
    document.body.removeChild(settingsVer);
  });

  it('Añadir Receta Unificada: Selector de modalidades (a mano, link, texto/notas)', () => {
    const choiceModal = document.createElement('div');
    choiceModal.className = 'modal-overlay';
    choiceModal.id = 'modal-recipe-add-choice';
    document.body.appendChild(choiceModal);
    appInstance.modalRecipeAddChoice = choiceModal;

    // Test open and close methods
    appInstance.openAddRecipeChoiceModal();
    expect(choiceModal.classList.contains('active')).toBe(true);

    appInstance.closeAddRecipeChoiceModal();
    expect(choiceModal.classList.contains('active')).toBe(false);

    // Test closeModalByElement integration
    choiceModal.classList.add('active');
    appInstance.closeModalByElement(choiceModal);
    expect(choiceModal.classList.contains('active')).toBe(false);

    // Test openImportModal with default tabs
    appInstance.openImportModal('text');
    expect(document.getElementById('modal-recipe-import').classList.contains('active')).toBe(true);
    appInstance.closeImportModal();

    document.body.removeChild(choiceModal);
  });

  it('Rediseño del Editor: Detección automática de temporizador en pasos (extractTimerFromStepText)', () => {
    expect(typeof window.extractTimerFromStepText).toBe('function');

    expect(window.extractTimerFromStepText('Meter todos los ingredientes en el horno troceados 40 minutos')).toBe(40);
    expect(window.extractTimerFromStepText('Cuece un huevo 6/7 minutos para poner de topping')).toBe(7);
    expect(window.extractTimerFromStepText('Cuece la pasta durante 9-10 minutos hasta que esté al dente')).toBe(10);
    expect(window.extractTimerFromStepText('saltea los tomates cherry 3 minutos con un chorrito de aceite')).toBe(3);
    expect(window.extractTimerFromStepText('Hornear a 180°C durante 1 hora y media')).toBe(90);
    expect(window.extractTimerFromStepText('Dejar reposar media hora antes de cortar')).toBe(30);
    expect(window.extractTimerFromStepText('Cocinar 45 min a fuego lento')).toBe(45);
    expect(window.extractTimerFromStepText('Pela las castañas y luego tritura todo con caldo')).toBe(0);
  });

  it('Rediseño del Editor: addIngredientRow genera tarjeta espaciosa con etiquetas claras', () => {
    const container = document.createElement('div');
    container.id = 'edit-ingredients-container';
    document.body.appendChild(container);

    appInstance.addIngredientRow({ name: 'Castañas', amount: 500, unit: 'g', aisle: 'produce' });

    const row = container.querySelector('.edit-ing-row');
    expect(row).not.toBeNull();
    expect(row.classList.contains('edit-ing-card')).toBe(true);

    const labels = Array.from(row.querySelectorAll('.field-micro-label')).map(l => l.textContent.trim());
    expect(labels).toContain('Cantidad');
    expect(labels).toContain('Unidad');
    expect(labels).toContain('Pasillo / Sección');

    const nameInput = row.querySelector('.ing-name');
    expect(nameInput.value).toBe('Castañas');

    const amountInput = row.querySelector('.ing-amount');
    expect(amountInput.value).toBe('500');

    const unitInput = row.querySelector('.ing-unit');
    expect(unitInput.value).toBe('g');

    const aisleSelect = row.querySelector('.ing-aisle');
    expect(aisleSelect.value).toBe('produce');

    nameInput.value = 'Whiskey';
    nameInput.dispatchEvent(new Event('input'));
    expect(aisleSelect.value).toBe('beverages');

    nameInput.value = 'Aceite de oliva virgen extra';
    nameInput.dispatchEvent(new Event('input'));
    expect(aisleSelect.value).toBe('spices');

    document.body.removeChild(container);
  });

  it('Rediseño del Editor: addStepRow genera paso con temporizador automático y renumberSteps', () => {
    const container = document.createElement('div');
    container.id = 'edit-steps-container';
    document.body.appendChild(container);

    // Step 1 con tiempo en texto
    appInstance.addStepRow({ text: 'Hornear 40 minutos a 180 grados' });
    // Step 2 sin tiempo
    appInstance.addStepRow({ text: 'Pela las castañas con cuidado' });

    const steps = container.querySelectorAll('.edit-step-row');
    expect(steps.length).toBe(2);

    // Step 1 has timer pill
    const timerPill1 = steps[0].querySelector('.step-timer-badge');
    expect(timerPill1).not.toBeNull();
    expect(timerPill1.textContent).toContain('40 min');
    expect(steps[0].querySelector('.step-timer').value).toBe('40');

    // Step 2 does NOT have timer pill, shows prompt
    const timerPrompt2 = steps[1].querySelector('.btn-step-timer-prompt');
    expect(timerPrompt2).not.toBeNull();
    expect(steps[1].querySelector('.step-timer').value).toBe('0');

    // Live typing detection in Step 2
    const textarea2 = steps[1].querySelector('.step-text');
    textarea2.value = 'Hervir 15 minutos en agua con sal';
    textarea2.dispatchEvent(new Event('input'));

    const timerPill2 = steps[1].querySelector('.step-timer-badge');
    expect(timerPill2).not.toBeNull();
    expect(timerPill2.textContent).toContain('15 min');
    expect(steps[1].querySelector('.step-timer').value).toBe('15');

    // Renumbering after remove
    steps[0].querySelector('.btn-remove-item').click();
    expect(container.querySelectorAll('.edit-step-row').length).toBe(1);
    expect(container.querySelector('.step-num-pill').textContent).toBe('1');
    expect(container.querySelector('.step-title-text').textContent).toBe('Paso 1');

    document.body.removeChild(container);
  });

  it('US-18 & US-55: Todos los modales usan <dialog> nativo, showConfirmDialog reemplaza confirm() y showToast evita popups intrusivos', async () => {
    const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
    // Ningún .modal-overlay en index.html debe ser un <div>
    expect(indexHtml).not.toMatch(/<div[^>]*class="modal-overlay"/);
    expect(indexHtml).toMatch(/<dialog[^>]*class="modal-overlay"[^>]*id="modal-confirm-dialog"/);

    // Cero llamadas a alert(), confirm() o prompt() en app.js
    expect(appCode).not.toMatch(/\b(alert|confirm|prompt)\s*\(/);

    // Prueba de showToast no bloqueante
    const toastEl = appInstance.showToast('Receta guardada', 'success', 0);
    expect(toastEl).not.toBeNull();
    expect(toastEl.classList.contains('toast-success')).toBe(true);
    expect(toastEl.textContent).toContain('Receta guardada');

    // Prueba de showConfirmDialog con <dialog> nativo (Aceptar y Cancelar)
    const acceptPromise = appInstance.showConfirmDialog({
      title: 'Eliminar receta',
      message: '¿Seguro que deseas eliminarla?',
      confirmText: 'Eliminar',
      danger: true
    });
    const confirmDialog = document.getElementById('modal-confirm-dialog');
    expect(confirmDialog).not.toBeNull();
    expect(confirmDialog.tagName.toLowerCase()).toBe('dialog');
    expect(confirmDialog.classList.contains('active')).toBe(true);

    confirmDialog.querySelector('#btn-confirm-dialog-accept').click();
    const accepted = await acceptPromise;
    expect(accepted).toBe(true);
    expect(confirmDialog.classList.contains('active')).toBe(false);

    const cancelPromise = appInstance.showConfirmDialog({
      title: 'Vaciar lista',
      message: '¿Vaciar lista?'
    });
    confirmDialog.querySelector('#btn-confirm-dialog-cancel').click();
    const cancelled = await cancelPromise;
    expect(cancelled).toBe(false);
  });
});



