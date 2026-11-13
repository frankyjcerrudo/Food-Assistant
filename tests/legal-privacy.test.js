import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

new Function(fs.readFileSync(path.resolve(process.cwd(), 'app.js'), 'utf-8'))();
const { FoodAssistantApp } = window;

const read = (f) => fs.readFileSync(path.resolve(process.cwd(), f), 'utf-8');

describe('Fase 3 Google Play: Requisitos Legales y Políticas (US-74 & US-75)', () => {
  const html = read('index.html');
  const privacyHtml = read('privacy.html');
  const swJs = read('sw.js');

  describe('US-75: Política de Privacidad Pública (/privacy.html y Enlaces)', () => {
    it('existe el archivo privacy.html válido en la raíz del proyecto', () => {
      expect(fs.existsSync(path.resolve(process.cwd(), 'privacy.html'))).toBe(true);
      expect(privacyHtml).toContain('<!DOCTYPE html>');
      expect(privacyHtml).toContain('<html lang="es">');
      expect(privacyHtml).toContain('Política de Privacidad');
      expect(privacyHtml).toContain('Sabory');
    });

    it('privacy.html contiene el ancla #account-deletion exigida por Google Play Console para solicitud de borrado', () => {
      expect(privacyHtml).toMatch(/id=["']account-deletion["']/);
      expect(privacyHtml).toContain('Eliminación de Cuenta y Retención de Datos');
      expect(privacyHtml).toContain('saboryfood@gmail.com');
    });

    it('privacy.html detalla la arquitectura Offline-First, Supabase (RLS), BYOK y Google Gemini API', () => {
      expect(privacyHtml).toContain('Offline-First');
      expect(privacyHtml).toContain('IndexedDB');
      expect(privacyHtml).toContain('Supabase');
      expect(privacyHtml).toContain('Row Level Security');
      expect(privacyHtml).toContain('Gemini');
      expect(privacyHtml).toContain('Bring Your Own Key');
    });

    it('privacy.html explica los permisos del dispositivo (cámara/fotos, micrófono y screen wake lock)', () => {
      expect(privacyHtml).toContain('Cámara y Galería de Fotos');
      expect(privacyHtml).toContain('Micrófono');
      expect(privacyHtml).toContain('Screen Wake Lock');
    });

    it('sw.js incluye ./privacy.html en ASSETS_TO_CACHE para disponibilidad offline', () => {
      expect(swJs).toContain("'./privacy.html'");
    });

    it('index.html incluye enlaces visibles a privacy.html en Ajustes y en el modal de autenticación', () => {
      expect(html).toContain('id="card-legal-privacy"');
      expect(html).toContain('id="link-privacy-policy"');
      expect(html).toContain('href="privacy.html"');
      expect(html).toContain('id="link-auth-privacy"');
    });
  });

  describe('US-74: Eliminación de Cuenta y Datos en la Nube (Google Play Policy & GDPR)', () => {
    it('index.html incluye botones para eliminar cuenta y datos en Ajustes y en el modal de cuenta', () => {
      expect(html).toContain('id="btn-settings-delete-account"');
      expect(html).toContain('id="btn-auth-delete-account"');
    });

    it('deleteAccountAndData cancela la operación y no borra nada si el usuario cancela la confirmación', async () => {
      const showConfirmSpy = vi.fn().mockResolvedValue(false);
      const app = {
        showConfirmDialog: showConfirmSpy,
        deleteAccountAndData: FoodAssistantApp.prototype.deleteAccountAndData
      };

      const result = await app.deleteAccountAndData();
      expect(result).toBe(false);
      expect(showConfirmSpy).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Eliminar cuenta y datos',
        danger: true,
        icon: 'delete_forever'
      }));
    });

    it('deleteAccountAndData en modo local limpia datos y restaura las recetas iniciales', async () => {
      const prev = {
        cloudUser: window.state.cloudUser,
        recipes: window.state.recipes,
        mealPlan: window.state.mealPlan,
        shoppingList: window.state.shoppingList,
        deletedRecords: window.state.deletedRecords
      };

      window.state.cloudUser = null;
      window.state.recipes = [{ id: 'custom-1', title: 'Receta propia' }];
      window.state.shoppingList = [{ id: 's1', name: 'Leche' }];
      window.state.deletedRecords = { recipes: ['rec-old'], mealPlans: [], shoppingItems: [] };

      const saveSpy = vi.spyOn(window.state, 'save');

      const app = {
        showConfirmDialog: vi.fn().mockResolvedValue(true),
        closeAuthModal: vi.fn(),
        updateUserAccountUI: vi.fn(),
        render: vi.fn(),
        showToast: vi.fn(),
        deleteAccountAndData: FoodAssistantApp.prototype.deleteAccountAndData
      };

      try {
        const result = await app.deleteAccountAndData(true);
        expect(result).toBe(true);
        expect(window.state.cloudUser).toBeNull();
        expect(window.state.shoppingList).toEqual([]);
        expect(window.state.deletedRecords.recipes).toEqual([]);
        expect(window.state.recipes.length).toBeGreaterThan(1);
        expect(saveSpy).toHaveBeenCalledWith('fa_recipes', expect.any(Array));
        expect(saveSpy).toHaveBeenCalledWith('fa_shopping', []);
        expect(app.updateUserAccountUI).toHaveBeenCalled();
        expect(app.render).toHaveBeenCalled();
        expect(app.showToast).toHaveBeenCalledWith('Tus datos locales han sido eliminados.', 'info');
      } finally {
        Object.assign(window.state, prev);
        saveSpy.mockRestore();
      }
    });

    it('deleteAccountAndData con usuario de Supabase ejecuta delete en tablas remotas y cierra sesión', async () => {
      const prev = {
        cloudUser: window.state.cloudUser,
        recipes: window.state.recipes,
        mealPlan: window.state.mealPlan,
        shoppingList: window.state.shoppingList,
        deletedRecords: window.state.deletedRecords
      };

      window.state.cloudUser = { id: 'usr-123', email: 'test@sabory.app', isDemo: false };
      window.state.recipes = [{ id: 'rec-1', title: 'Paella' }];
      window.state.shoppingList = [];
      window.state.deletedRecords = { recipes: [], mealPlans: [], shoppingItems: [] };

      const deleteEqMock = vi.fn().mockResolvedValue({ error: null });
      const deleteMock = vi.fn().mockReturnValue({ eq: deleteEqMock });
      const fromMock = vi.fn().mockReturnValue({ delete: deleteMock });
      const signOutMock = vi.fn().mockResolvedValue({ error: null });

      const fakeSupabase = {
        from: fromMock,
        auth: { signOut: signOutMock }
      };

      const app = {
        supabaseClient: fakeSupabase,
        showConfirmDialog: vi.fn().mockResolvedValue(true),
        closeAuthModal: vi.fn(),
        updateUserAccountUI: vi.fn(),
        render: vi.fn(),
        showToast: vi.fn(),
        deleteAccountAndData: FoodAssistantApp.prototype.deleteAccountAndData
      };

      try {
        const result = await app.deleteAccountAndData(true);
        expect(result).toBe(true);
        expect(fromMock).toHaveBeenCalledWith('recipes');
        expect(fromMock).toHaveBeenCalledWith('meal_plans');
        expect(fromMock).toHaveBeenCalledWith('shopping_items');
        expect(fromMock).toHaveBeenCalledWith('user_settings');
        expect(deleteEqMock).toHaveBeenCalledWith('user_id', 'usr-123');
        expect(signOutMock).toHaveBeenCalled();
        expect(window.state.cloudUser).toBeNull();
        expect(app.showToast).toHaveBeenCalledWith('Tu cuenta y tus datos han sido eliminados de la nube.', 'info');
      } finally {
        Object.assign(window.state, prev);
      }
    });
  });
});
