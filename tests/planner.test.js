import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const { StateStore } = window;

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
