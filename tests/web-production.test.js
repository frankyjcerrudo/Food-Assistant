import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const read = (f) => fs.readFileSync(path.resolve(process.cwd(), f), 'utf-8');

describe('US-76: Adaptación Web de Producción para sabory.food', () => {
  const html = read('index.html');
  const css = read('styles.css');

  describe('Previsualización Social Enriquecida (Open Graph & Twitter Cards)', () => {
    it('declara URL canónica hacia https://sabory.food/', () => {
      expect(html).toContain('<link rel="canonical" href="https://sabory.food/">');
    });

    it('incluye todas las etiquetas Open Graph requeridas con URLs absolutas a sabory.food', () => {
      expect(html).toMatch(/<meta property="og:type" content="website">/);
      expect(html).toMatch(/<meta property="og:site_name" content="Sabory">/);
      expect(html).toMatch(/<meta property="og:url" content="https:\/\/sabory\.food\/">/);
      expect(html).toMatch(/<meta property="og:title"\s+content="[^"]*Sabory[^"]*">/);
      expect(html).toMatch(/<meta property="og:description"[\s\S]*?content="[^"]+"/);
      expect(html).toMatch(/<meta property="og:image" content="https:\/\/sabory\.food\/icon-512\.png">/);
      expect(html).toMatch(/<meta property="og:image:width" content="512">/);
      expect(html).toMatch(/<meta property="og:image:height" content="512">/);
      expect(html).toMatch(/<meta property="og:locale" content="es_ES">/);
    });

    it('incluye etiquetas Twitter Card con imagen y título de marca', () => {
      expect(html).toMatch(/<meta name="twitter:card" content="summary">/);
      expect(html).toMatch(/<meta name="twitter:title"\s+content="[^"]*Sabory[^"]*">/);
      expect(html).toMatch(/<meta name="twitter:description"[\s\S]*?content="[^"]+"/);
      expect(html).toMatch(/<meta name="twitter:image" content="https:\/\/sabory\.food\/icon-512\.png">/);
    });
  });

  describe('Smart Install Banner PWA para Web Móvil (HTML & Accesibilidad)', () => {
    it('contiene el elemento aside #pwa-smart-banner oculto por defecto con sus botones de acción', () => {
      expect(html).toMatch(/<aside class="pwa-smart-banner" id="pwa-smart-banner"[^>]*hidden/);
      expect(html).toContain('id="btn-smart-install-pwa"');
      expect(html).toContain('id="btn-smart-dismiss-pwa"');
      expect(html).toMatch(/aria-label="[^"]*instalación[^"]*"/i);
    });
  });

  describe('Lógica de Smart Install Banner PWA en FoodAssistantApp (app.js)', () => {
    let appInstance;

    beforeEach(() => {
      localStorage.clear();
      document.body.innerHTML = `
        <div id="pwa-install-box" hidden>
          <button id="btn-install-pwa"></button>
        </div>
        <aside class="pwa-smart-banner" id="pwa-smart-banner" hidden>
          <button id="btn-smart-install-pwa"></button>
          <button id="btn-smart-dismiss-pwa"></button>
        </aside>
      `;

      new Function(fs.readFileSync(path.resolve(process.cwd(), 'app.js'), 'utf-8'))();
      appInstance = new window.FoodAssistantApp();
      appInstance.deferredInstallPrompt = null;
    });

    it('mantiene el banner oculto si no hay evento beforeinstallprompt', () => {
      appInstance.deferredInstallPrompt = null;
      appInstance.updatePwaInstallUI();
      const banner = document.getElementById('pwa-smart-banner');
      expect(banner.hidden).toBe(true);
    });

    it('muestra el banner inteligente si beforeinstallprompt está disponible y no se ha descartado', () => {
      appInstance.deferredInstallPrompt = { prompt: vi.fn(), userChoice: Promise.resolve({ outcome: 'accepted' }) };
      vi.spyOn(appInstance, 'isStandaloneDisplay').mockReturnValue(false);

      appInstance.updatePwaInstallUI();
      const banner = document.getElementById('pwa-smart-banner');
      expect(banner.hidden).toBe(false);
    });

    it('mantiene el banner oculto si la app se ejecuta en modo standalone (ya instalada)', () => {
      appInstance.deferredInstallPrompt = { prompt: vi.fn() };
      vi.spyOn(appInstance, 'isStandaloneDisplay').mockReturnValue(true);

      appInstance.updatePwaInstallUI();
      const banner = document.getElementById('pwa-smart-banner');
      expect(banner.hidden).toBe(true);
    });

    it('dismissPwaBanner guarda fa_pwa_banner_dismissed en localStorage y oculta el banner', () => {
      const banner = document.getElementById('pwa-smart-banner');
      banner.hidden = false;

      appInstance.dismissPwaBanner();
      expect(localStorage.getItem('fa_pwa_banner_dismissed')).toBe('true');
      expect(banner.hidden).toBe(true);
      expect(appInstance.isPwaBannerDismissed()).toBe(true);
    });

    it('no muestra el banner si el usuario lo descartó previamente en localStorage', () => {
      localStorage.setItem('fa_pwa_banner_dismissed', 'true');
      appInstance.deferredInstallPrompt = { prompt: vi.fn() };
      vi.spyOn(appInstance, 'isStandaloneDisplay').mockReturnValue(false);

      appInstance.updatePwaInstallUI();
      const banner = document.getElementById('pwa-smart-banner');
      expect(banner.hidden).toBe(true);
    });

    it('btn-smart-install-pwa invoca promptPwaInstall y btn-smart-dismiss-pwa invoca dismissPwaBanner', () => {
      const promptSpy = vi.spyOn(appInstance, 'promptPwaInstall').mockImplementation(() => {});
      const dismissSpy = vi.spyOn(appInstance, 'dismissPwaBanner').mockImplementation(() => {});

      appInstance.initPwaInstall();

      document.getElementById('btn-smart-install-pwa').click();
      expect(promptSpy).toHaveBeenCalledTimes(1);

      document.getElementById('btn-smart-dismiss-pwa').click();
      expect(dismissSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Barra de Navegación Integrada en Cabecera para Desktop (HTML & app.js)', () => {
    it('index.html incluye nav.desktop-header-nav con accesos a Hoy, Recetas, Planificador, Compra y Asistente IA', () => {
      expect(html).toContain('id="desktop-header-nav"');
      expect(html).toMatch(/class="header-nav-btn[^"]*"\s+data-view="view-today"/);
      expect(html).toMatch(/class="header-nav-btn[^"]*"\s+data-view="view-recipes"/);
      expect(html).toMatch(/class="header-nav-btn[^"]*"\s+data-view="view-planner"/);
      expect(html).toMatch(/class="header-nav-btn[^"]*"\s+data-view="view-shopping"/);
      expect(html).toContain('id="btn-desktop-gemini-invoke"');
    });

    it('switchView sincroniza la clase active tanto en la navegación móvil como en la cabecera desktop', () => {
      document.body.innerHTML = `
        <header class="app-header">
          <nav class="desktop-header-nav">
            <button class="header-nav-btn active" data-view="view-today">Hoy</button>
            <button class="header-nav-btn" data-view="view-recipes">Recetas</button>
          </nav>
        </header>
        <main class="view-panel active" id="view-today"></main>
        <section class="view-panel" id="view-recipes"></section>
        <nav class="bottom-nav">
          <button class="nav-item active" data-view="view-today">Hoy</button>
          <button class="nav-item" data-view="view-recipes">Recetas</button>
        </nav>
      `;

      new Function(fs.readFileSync(path.resolve(process.cwd(), 'app.js'), 'utf-8'))();
      const app = new window.FoodAssistantApp();
      app.initElements();

      app.switchView('view-recipes');

      const desktopActive = document.querySelector('.desktop-header-nav .header-nav-btn.active');
      const mobileActive = document.querySelector('.bottom-nav .nav-item.active');

      expect(desktopActive?.dataset.view).toBe('view-recipes');
      expect(mobileActive?.dataset.view).toBe('view-recipes');
    });
  });

  describe('Optimización Responsive para Pantallas Grandes (Desktop / Tablet >= 900px)', () => {
    const media900 = css.slice(css.indexOf('@media (min-width: 900px)'));

    it('styles.css incluye regla @media (min-width: 900px) con ancho ampliado >= 1300px para app-container', () => {
      expect(media900).toContain('@media (min-width: 900px)');
      expect(media900).toMatch(/max-width:\s*13[0-9]{2}px/);
    });

    it('oculta la cápsula flotante inferior en desktop y activa la navegación en cabecera', () => {
      expect(media900).toMatch(/\.bottom-nav\s*\{[^}]*display:\s*none\s*!important;/s);
      expect(media900).toMatch(/\.desktop-header-nav\s*\{[^}]*display:\s*flex\s*!important;/s);
    });

    it('amplía la cuadrícula de recetas a 3 columnas en >= 900px y 4 columnas en >= 1180px', () => {
      expect(media900).toMatch(/\.recipes-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s);
      expect(media900).toMatch(/@media\s*\(\s*min-width:\s*1180px\s*\)[\s\S]*?\.recipes-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*1fr\)/s);
    });

    it('organiza los slots del menú de Hoy y del planificador en columnas horizontales en desktop', () => {
      expect(media900).toMatch(/#today-slots-container\s*\{[^}]*grid-template-columns:\s*repeat\([24],\s*minmax\(0,\s*1fr\)\)/s);
      expect(media900).toMatch(/\.day-card\s+\.slots-grid\s*\{[^}]*grid-template-columns:\s*repeat\([24],\s*minmax\(0,\s*1fr\)\)/s);
    });

    it('muestra los pasillos de compra en cuadrícula multi-tarjeta en desktop', () => {
      expect(media900).toMatch(/#shopping-aisles-container\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fill/s);
    });

    it('estila el widget de macros en desktop ocupando todo el ancho disponible con cero layout shift en las recetas', () => {
      expect(media900).toMatch(/\.today-subtitle\s*\{[^}]*display:\s*none\s*!important;/s);
      expect(media900).toMatch(/\.today-nutrition-card\.today-header-macros\s*\{[^}]*flex:\s*1\s+1\s+auto;/s);
      expect(media900).toMatch(/\.today-nutrition-pill-bar\s*\{[\s\S]*?flex-direction:\s*row/s);
      expect(media900).toMatch(/\.today-nutrition-card\.is-expanded\s+\.today-nutrition-details-body\s*\{[^}]*display:\s*none\s*!important;/s);
    });

    it('openNutritionBreakdownModal abre el modal de desglose nutricional en escritorio con cero layout shift en las recetas', () => {
      new Function(fs.readFileSync(path.resolve(process.cwd(), 'app.js'), 'utf-8'))();
      const app = new window.FoodAssistantApp();
      window.app = app;

      document.body.innerHTML = `
        <div id="today-slots-container"></div>
        <div id="today-nutrition-card" class="today-nutrition-card today-header-macros">
          <div class="today-nutrition-pill-bar" id="today-nutrition-pill-bar">
            <span class="today-header-macro-action-label">Ver desglose</span>
          </div>
          <div class="today-nutrition-details-body" id="today-nutrition-details-body"></div>
        </div>
        <dialog class="modal-overlay" id="modal-nutrition-breakdown">
          <div class="nutrition-breakdown-modal-body" id="nutrition-breakdown-modal-body"></div>
        </dialog>
      `;

      const modal = document.getElementById('modal-nutrition-breakdown');
      modal.showModal = vi.fn(() => { modal.open = true; });
      modal.close = vi.fn(() => { modal.open = false; });

      app.openNutritionBreakdownModal();
      expect(modal.showModal).toHaveBeenCalledTimes(1);

      const body = document.getElementById('nutrition-breakdown-modal-body');
      expect(body.innerHTML).toContain('macro-chip');
      expect(body.innerHTML).toContain('macro-ratio-bar');

      app.closeNutritionBreakdownModal();
      expect(modal.close).toHaveBeenCalledTimes(1);
    });

    it('renderTodaySlots genera tarjetas enriquecidas con calorías, macros, tags y acción de ver receta', () => {
      document.body.innerHTML = `
        <div id="today-slots-container"></div>
        <div id="today-nutrition-card"></div>
        <span id="today-summary-text"></span>
      `;

      new Function(fs.readFileSync(path.resolve(process.cwd(), 'app.js'), 'utf-8'))();
      const app = new window.FoodAssistantApp();

      window.state = {
        recipes: [{
          id: 'rec-test-1',
          title: 'Pollo al Curry con Arroz',
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 2,
          tags: ['Alto en proteína', 'Cena'],
          ingredients: [{ name: 'Pollo', amount: 200, unit: 'g' }]
        }],
        mealPlan: {
          [window.toLocalDateKey(new Date())]: {
            breakfast: null,
            lunch: 'rec-test-1',
            snack: null,
            dinner: null,
            leftoverSlots: {}
          }
        },
        dietaryPreferences: [],
        settings: { nutritionGoals: { enabled: true, calories: 2000, protein: 120, carbs: 200, fat: 60 } }
      };

      app.renderTodayView();

      const container = document.getElementById('today-slots-container');
      expect(container.innerHTML).toContain('today-meal-slot-card');
      expect(container.innerHTML).toContain('today-meal-desktop-action');
      expect(container.innerHTML).toContain('today-meal-kcal-badge');
      expect(container.innerHTML).toContain('today-meal-macro-pill');
      expect(container.innerHTML).toContain('Ver receta');
    });
  });
});
