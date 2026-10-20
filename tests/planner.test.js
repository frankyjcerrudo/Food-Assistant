import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const appCode = fs.readFileSync(path.resolve(__dirname, '../app.js'), 'utf-8');
const fn = new Function('window', 'localStorage', 'document', appCode + '; return { StateStore };');

describe('Planner & Custom Meal Moments', () => {
  let store;
  let mockStorage = {};

  beforeEach(() => {
    mockStorage = {};
    const localStorageMock = {
      getItem: (k) => mockStorage[k] || null,
      setItem: (k, v) => { mockStorage[k] = String(v); },
      removeItem: (k) => { delete mockStorage[k]; },
      clear: () => { mockStorage = {}; }
    };
    const docMock = {
      addEventListener: () => {},
      documentElement: { setAttribute: () => {} }
    };

    const { StateStore } = fn({}, localStorageMock, docMock);
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
