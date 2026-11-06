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

  describe('Optimización Responsive para Pantallas Grandes (Desktop / Tablet >= 900px)', () => {
    const media900 = css.slice(css.indexOf('@media (min-width: 900px)'));

    it('styles.css incluye regla @media (min-width: 900px) con ancho ampliado para app-container', () => {
      expect(media900).toContain('@media (min-width: 900px)');
      expect(media900).toMatch(/max-width:\s*12[0-9]{2}px/);
    });

    it('reposiciona la barra de navegación para evitar la cápsula flotante en el vacío en desktop', () => {
      expect(media900).toMatch(/\.bottom-nav\s*\{[^}]*position:\s*sticky;/s);
    });

    it('amplía la cuadrícula de recetas a 3 columnas en >= 900px y 4 columnas en >= 1200px', () => {
      expect(media900).toMatch(/\.recipes-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*1fr\)/s);
      expect(media900).toMatch(/@media\s*\(\s*min-width:\s*1200px\s*\)[^}]*\.recipes-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*1fr\)/s);
    });

    it('optimiza la disposición de slots del planificador para pantallas anchas', () => {
      expect(media900).toMatch(/\.slots-grid\s*\{[^}]*grid-template-columns:\s*repeat\([24],\s*minmax\(0,\s*1fr\)\)/s);
    });
  });
});
