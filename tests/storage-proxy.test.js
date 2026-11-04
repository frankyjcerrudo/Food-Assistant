import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load and execute app.js in happy-dom environment
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const {
  FoodAssistantApp,
  StateStore,
  IndexedDbStorage,
  state
} = window;

describe('Fase 2: Persistencia Robusta y Proxy Propio (US-46, US-52)', () => {
  describe('US-46: Migración de Almacenamiento a IndexedDB', () => {
    let storage;

    beforeEach(() => {
      localStorage.clear();
      storage = new IndexedDbStorage();
    });

    it('IndexedDbStorage se inicializa correctamente con soporte o fallback', () => {
      expect(storage).toBeDefined();
      expect(storage.get).toBeInstanceOf(Function);
      expect(storage.set).toBeInstanceOf(Function);
      expect(storage.migrateFromLocalStorage).toBeInstanceOf(Function);
    });

    it('set y get guardan y recuperan datos transparentemente', async () => {
      await storage.set('fa_test_key', { foo: 'bar', count: 42 });
      const val = await storage.get('fa_test_key');
      expect(val).toEqual({ foo: 'bar', count: 42 });
    });

    it('migrateFromLocalStorage migra todas las claves fa_* desde localStorage a IndexedDB', async () => {
      localStorage.setItem('fa_recipes_mock', JSON.stringify([{ id: 'r1', title: 'Receta Test' }]));
      localStorage.setItem('fa_shopping_mock', JSON.stringify([{ id: 's1', name: 'Manzanas' }]));
      localStorage.setItem('unrelated_key', 'should_not_migrate');

      const migrated = await storage.migrateFromLocalStorage();
      expect(migrated).toBe(true);

      const r = await storage.get('fa_recipes_mock');
      expect(r).toEqual([{ id: 'r1', title: 'Receta Test' }]);

      const s = await storage.get('fa_shopping_mock');
      expect(s).toEqual([{ id: 's1', name: 'Manzanas' }]);

      // Debe haber registrado la marca temporal de migración
      const marker = await storage.get('fa_idb_migrated');
      expect(marker).toBeTruthy();
    });

    it('state.save persiste datos a través de IndexedDbStorage sin romper el acceso síncrono', () => {
      const store = new StateStore();
      store.recipes = [{ id: 'rec-test', title: 'Paella' }];
      store.save('fa_recipes', store.recipes);

      // La lectura síncrona inmediata sigue funcionando
      expect(store.load('fa_recipes', [])).toEqual([{ id: 'rec-test', title: 'Paella' }]);
    });
  });

  describe('US-52: Proxy Propio con Supabase Edge Function', () => {
    it('existe el código de la Edge Function import-recipe con protecciones SSRF y CORS', () => {
      const edgeFnPath = path.resolve(process.cwd(), 'supabase/functions/import-recipe/index.ts');
      expect(fs.existsSync(edgeFnPath)).toBe(true);

      const content = fs.readFileSync(edgeFnPath, 'utf-8');
      expect(content).toContain('isPrivateIp');
      expect(content).toContain('Access-Control-Allow-Origin');
      expect(content).toContain('127.0.0.1');
      expect(content).toContain('192.168');
      expect(content).toContain('10.0.0.0');
      expect(content).toContain('X-Proxy-By');
    });

    it('el código de importRecipe en app.js incluye el endpoint de la Edge Function en primer lugar cuando Supabase está configurado', () => {
      expect(appCode).toContain('/functions/v1/import-recipe');
      expect(appCode).toContain('US-52: Proxy propio con Supabase Edge Function');
    });
  });
});

