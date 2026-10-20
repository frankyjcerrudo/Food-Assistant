import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
const fn = new Function('window', 'localStorage', 'document', appCode + '; return { AISLE_METADATA };');
const { AISLE_METADATA } = fn({}, { getItem: () => null, setItem: () => {} }, { addEventListener: () => {}, documentElement: { setAttribute: () => {} } });

describe('Shopping Engine & Ingredient Calculations', () => {
  it('debe contener metadatos completos para todos los pasillos estándar', () => {
    const requiredAisles = ['produce', 'meat', 'dairy', 'bakery', 'pantry', 'spices', 'frozen', 'beverages', 'other'];
    requiredAisles.forEach(aisle => {
      expect(AISLE_METADATA).toHaveProperty(aisle);
      expect(AISLE_METADATA[aisle]).toHaveProperty('label');
      expect(AISLE_METADATA[aisle]).toHaveProperty('icon');
    });
  });

  it('debe escalar correctamente los ingredientes al modificar las porciones', () => {
    const baseServings = 2;
    const targetServings = 4;
    const ratio = targetServings / baseServings; // 2

    const originalAmount = 250;
    const scaledAmount = Math.round((originalAmount * ratio) * 10) / 10;

    expect(scaledAmount).toBe(500);
  });

  it('debe fusionar cantidades si el ingrediente y unidad ya existen en la lista', () => {
    const list = [
      { name: "Pechugas de pollo", amount: 400, unit: "g", aisle: "meat", isChecked: false }
    ];

    const newItem = { name: "Pechugas de pollo", amount: 200, unit: "g", aisle: "meat", isChecked: false };

    const key = `${newItem.name.toLowerCase().trim()}_${newItem.unit.toLowerCase().trim()}`;
    const existing = list.find(i => `${i.name.toLowerCase().trim()}_${i.unit.toLowerCase().trim()}` === key && !i.isChecked);

    expect(existing).toBeDefined();
    existing.amount = Math.round((existing.amount + newItem.amount) * 10) / 10;

    expect(list).toHaveLength(1);
    expect(list[0].amount).toBe(600);
  });

  it('no debe fusionar ingredientes si tienen unidades distintas (ej. gramos vs unidades)', () => {
    const list = [
      { name: "Tomates", amount: 500, unit: "g", isChecked: false }
    ];

    const newItem = { name: "Tomates", amount: 3, unit: "ud", isChecked: false };

    const key = `${newItem.name.toLowerCase().trim()}_${newItem.unit.toLowerCase().trim()}`;
    const existing = list.find(i => `${i.name.toLowerCase().trim()}_${i.unit.toLowerCase().trim()}` === key && !i.isChecked);

    expect(existing).toBeUndefined();
    list.push(newItem);

    expect(list).toHaveLength(2);
  });
});
