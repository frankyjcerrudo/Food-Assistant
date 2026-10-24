import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load and execute app.js in happy-dom environment
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const { FoodAssistantApp, STANDARD_SLOTS } = window;

describe('US-28: Rediseño enfocado de la pantalla "Hoy" (Zero Clutter)', () => {
  let appInstance;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <main class="view-panel active" id="view-today">
        <div class="today-header">
          <div class="today-header-info">
            <div class="today-date-badge">
              <span class="material-symbols-outlined icon-sm">today</span>
              <span id="today-date-text">Hoy</span>
            </div>
            <h2 class="today-title">Comidas de Hoy</h2>
            <p class="today-subtitle" id="today-summary-text">Tus comidas organizadas para el día.</p>
          </div>
          <button class="btn btn-tonal btn-sm today-btn-planner" id="btn-goto-planner" title="Ver planificador semanal">
            <span>Semana</span>
            <span class="material-symbols-outlined icon-sm">arrow_forward</span>
          </button>
        </div>

        <div class="slots-grid" id="today-slots-container"></div>
      </main>
      <section class="view-panel" id="view-planner"></section>
      <section class="view-panel" id="view-shopping"></section>
      <section class="view-panel" id="view-ai"></section>
      <div id="picker-modal-title"></div>
      <div class="modal-overlay" id="modal-picker"></div>
    `;

    appInstance = new FoodAssistantApp();
  });

  it('Verificación Zero Clutter: La plantilla index.html no contiene tarjeta hero ni estadísticas redundantes', () => {
    const indexPath = path.resolve(process.cwd(), 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    // Suprimir bloque hero y estadísticas redundantes
    expect(indexHtml).not.toContain('class="today-hero"');
    expect(indexHtml).not.toContain('class="quick-stats-grid"');
    expect(indexHtml).not.toContain('id="stat-total-recipes"');
    expect(indexHtml).not.toContain('id="stat-planned-meals"');
    expect(indexHtml).not.toContain('id="stat-shopping-items"');

    // Retirar accesos directos redundantes con la barra inferior
    expect(indexHtml).not.toContain('id="btn-quick-shopping"');
    expect(indexHtml).not.toContain('id="btn-quick-ai-plan"');
  });

  it('Cabecera limpia: Muestra fecha formateada y resumen contextual del día', () => {
    appInstance.renderTodayView();

    const dateElem = document.getElementById('today-date-text');
    const summaryElem = document.getElementById('today-summary-text');

    expect(dateElem).not.toBeNull();
    expect(dateElem.textContent).not.toBe('');
    expect(dateElem.textContent).not.toBe('Hoy'); // Formateado con toLocaleDateString en español

    expect(summaryElem).not.toBeNull();
    expect(summaryElem.textContent).toMatch(/comidas planificadas|Listo para cocinar|Ninguna comida asignada/i);
  });

  it('Foco en Comidas Planificadas: Renderiza los slots estándar con opciones claras', () => {
    appInstance.renderTodayView();

    const container = document.getElementById('today-slots-container');
    expect(container).not.toBeNull();

    // Comprobar que los 4 momentos estándar están presentes
    STANDARD_SLOTS.forEach(slot => {
      expect(container.innerHTML).toContain(slot.label);
    });

    // Comprobar que para comidas asignadas existe botón para desasignar plato (clearSlot)
    expect(container.innerHTML).toContain('app.clearSlot');
  });

  it('Añadir otra comida: Botón accesible visible para añadir momentos personalizados', () => {
    appInstance.renderTodayView();

    const container = document.getElementById('today-slots-container');
    const addBtn = container.querySelector('.today-add-slot-btn');

    expect(addBtn).not.toBeNull();
    expect(addBtn.textContent).toContain('Añadir otra comida');
    expect(addBtn.getAttribute('onclick')).toContain('openAddCustomSlotModal');
  });

  it('Renderizado dinámico de momentos extra (customSlots) en la vista de Hoy', () => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (!window.state.mealPlan[todayStr]) {
      window.state.mealPlan[todayStr] = {
        breakfast: null,
        lunch: null,
        snack: null,
        dinner: null,
        customSlots: []
      };
    }

    window.state.mealPlan[todayStr].customSlots = [
      {
        id: 'cslot-today-snack',
        name: 'Post-Entreno Proteico',
        icon: 'fitness_center',
        recipeId: null
      }
    ];

    appInstance.renderTodayView();

    const container = document.getElementById('today-slots-container');
    expect(container.textContent).toContain('Post-Entreno Proteico');
  });

  it('Navegación fluida: El botón de semana lleva directamente al planificador', () => {
    appInstance.initEvents();
    const btnGotoPlanner = document.getElementById('btn-goto-planner');
    expect(btnGotoPlanner).not.toBeNull();

    btnGotoPlanner.click();
    expect(appInstance.activeView).toBe('view-planner');
  });
});
