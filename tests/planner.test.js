import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const {
  StateStore,
  FoodAssistantApp,
  toLocalDateKey,
  parseLocalDateKey,
  getMondayOfWeek,
  getWeekDates,
  formatWeekRange,
  DAYS_OF_WEEK_ES
} = window;

describe('Planner & Custom Meal Moments', () => {
  let store;

  beforeEach(() => {
    localStorage.clear();
    store = new StateStore();
  });

  it('debe permitir añadir un momento personalizado a un día', () => {
    const dateKey = Object.keys(store.mealPlan)[0];
    const customSlot = {
      id: 'cslot-test-1',
      name: 'Media Mañana',
      icon: 'lunch_dining',
      recipeId: null
    };

    store.mealPlan[dateKey].customSlots.push(customSlot);
    expect(store.mealPlan[dateKey].customSlots).toHaveLength(1);
    expect(store.mealPlan[dateKey].customSlots[0].name).toBe('Media Mañana');
  });

  it('debe permitir asignar una receta a un momento personalizado', () => {
    const dateKey = Object.keys(store.mealPlan)[0];
    const customSlot = {
      id: 'cslot-test-2',
      name: 'Post-Entreno',
      icon: 'fitness_center',
      recipeId: null
    };
    store.mealPlan[dateKey].customSlots.push(customSlot);

    // Asignar receta
    const found = store.mealPlan[dateKey].customSlots.find(c => c.id === 'cslot-test-2');
    found.recipeId = 'rec-smoothie-bowl';

    expect(found.recipeId).toBe('rec-smoothie-bowl');
  });

  it('debe permitir eliminar un momento personalizado sin alterar los demás slots', () => {
    const dateKey = Object.keys(store.mealPlan)[0];
    store.mealPlan[dateKey].customSlots = [
      { id: 'cs-1', name: 'Snack 1', icon: 'nutrition', recipeId: null },
      { id: 'cs-2', name: 'Snack 2', icon: 'bedtime', recipeId: null }
    ];

    // Eliminar cs-1
    store.mealPlan[dateKey].customSlots = store.mealPlan[dateKey].customSlots.filter(c => c.id !== 'cs-1');

    expect(store.mealPlan[dateKey].customSlots).toHaveLength(1);
    expect(store.mealPlan[dateKey].customSlots[0].id).toBe('cs-2');
  });
});

describe('BUG-07: Cálculo de fecha en hora local (toLocalDateKey)', () => {
  it('toLocalDateKey genera siempre la clave YYYY-MM-DD en hora local sin desfase UTC', () => {
    // Probar con fecha fija (24 de Octubre de 2026, 00:30 am local)
    const testDate = new Date(2026, 9, 24, 0, 30, 0); // Mes 9 es octubre (0-indexed)
    const key = toLocalDateKey(testDate);
    expect(key).toBe('2026-10-24');

    // Parseo inverso
    const parsed = parseLocalDateKey(key);
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(9);
    expect(parsed.getDate()).toBe(24);
  });

  it('toLocalDateKey sin argumentos devuelve la fecha de hoy en formato válido YYYY-MM-DD', () => {
    const todayKey = toLocalDateKey();
    expect(todayKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('US-22: Semana estandarizada de Lunes a Domingo (ISO 8601)', () => {
  it('getMondayOfWeek devuelve siempre el Lunes de la semana para cualquier día', () => {
    // 2026-10-19 es Lunes, 2026-10-21 es Miércoles, 2026-10-25 es Domingo
    const monday = new Date(2026, 9, 19);
    const wednesday = new Date(2026, 9, 21);
    const sunday = new Date(2026, 9, 25);

    expect(toLocalDateKey(getMondayOfWeek(monday))).toBe('2026-10-19');
    expect(toLocalDateKey(getMondayOfWeek(wednesday))).toBe('2026-10-19');
    expect(toLocalDateKey(getMondayOfWeek(sunday))).toBe('2026-10-19');
  });

  it('getWeekDates genera los 7 días de la semana arrancando en Lunes y terminando en Domingo', () => {
    const refDate = new Date(2026, 9, 22); // Jueves 22 oct 2026
    const week = getWeekDates(refDate);

    expect(week).toHaveLength(7);
    expect(week[0].dayName).toBe('Lunes');
    expect(week[0].dateKey).toBe('2026-10-19');
    expect(week[0].isWeekend).toBe(false);

    expect(week[4].dayName).toBe('Viernes');
    expect(week[4].dateKey).toBe('2026-10-23');
    expect(week[4].isWeekend).toBe(false);

    expect(week[5].dayName).toBe('Sábado');
    expect(week[5].dateKey).toBe('2026-10-24');
    expect(week[5].isWeekend).toBe(true);

    expect(week[6].dayName).toBe('Domingo');
    expect(week[6].dateKey).toBe('2026-10-25');
    expect(week[6].isWeekend).toBe(true);
  });

  it('formatWeekRange formatea correctamente el intervalo de fechas', () => {
    const refDate = new Date(2026, 9, 22);
    const week = getWeekDates(refDate);
    const formatted = formatWeekRange(week);
    expect(formatted).toBe('19 – 25 oct 2026');
  });
});

describe('US-05 & BUG-08 & BUG-17: Motor de Navegación Semanal y Persistencia Dinámica', () => {
  let appInstance;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <section class="view-panel active" id="view-planner">
        <div class="week-nav-bar" id="planner-week-nav-bar">
          <button id="btn-prev-week" onclick="app.navigateWeek(-1)">Anterior</button>
          <button id="btn-current-week" onclick="app.navigateWeek(0)">Esta semana</button>
          <button id="btn-next-week" onclick="app.navigateWeek(1)">Siguiente</button>
          <span id="planner-week-range-text"></span>
        </div>
        <div id="planner-days-container"></div>
      </section>
      <section class="view-panel" id="view-today">
        <div id="today-date-text"></div>
        <div id="today-summary-text"></div>
        <div id="today-slots-container"></div>
      </section>
    `;
    appInstance = new FoodAssistantApp();
  });

  it('Inicia en semana actual (offset = 0) y renderiza 7 tarjetas de Lunes a Domingo', () => {
    appInstance.renderPlanner();
    expect(appInstance.plannerWeekOffset).toBe(0);

    const container = document.getElementById('planner-days-container');
    const cards = container.querySelectorAll('.day-card');
    expect(cards).toHaveLength(7);

    // 7 tarjetas uniformes de Lunes a Domingo sin diferenciación invasiva de fin de semana
    const weekendCards = container.querySelectorAll('.day-card-weekend');
    expect(weekendCards).toHaveLength(0);
    expect(container.innerHTML).not.toContain('Fin de semana');

    // Cada tarjeta cuenta con su etiqueta de fecha formateada (.day-date-label)
    const dateLabels = container.querySelectorAll('.day-date-label');
    expect(dateLabels).toHaveLength(7);
  });

  it('Navegación fluida: permite avanzar a la semana siguiente (+1) y volver a la actual (0)', () => {
    appInstance.renderPlanner();
    const initialRange = document.getElementById('planner-week-range-text').textContent;

    // Avanzar a la semana siguiente
    appInstance.navigateWeek(1);
    expect(appInstance.plannerWeekOffset).toBe(1);
    const nextRange = document.getElementById('planner-week-range-text').textContent;
    expect(nextRange).not.toBe(initialRange);

    // Retroceder a la semana anterior
    appInstance.navigateWeek(-1);
    expect(appInstance.plannerWeekOffset).toBe(0);
    const backRange = document.getElementById('planner-week-range-text').textContent;
    expect(backRange).toBe(initialRange);
  });

  it('Persistencia y creación bajo demanda (BUG-08 y BUG-17): getDayPlan crea días con dayName en español', () => {
    // Clave futura
    const futureDate = '2026-11-04'; // Miércoles
    const day = window.state.getDayPlan(futureDate);

    expect(day).toBeDefined();
    expect(day.dayName).toBe('Miércoles');
    expect(day.customSlots).toEqual([]);
    expect(day.breakfast).toBeNull();
    expect(day.lunch).toBeNull();
    expect(day.dinner).toBeNull();
  });
});
