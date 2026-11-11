import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const stylesPath = path.resolve(process.cwd(), 'styles.css');
const appPath = path.resolve(process.cwd(), 'app.js');
const stylesCss = fs.readFileSync(stylesPath, 'utf-8');
const appJs = fs.readFileSync(appPath, 'utf-8');

describe('US-23, US-24 & US-49: Sistema de Diseño Moderno, Micro-interacciones y Plantillas sin Inline Styles', () => {
  describe('US-23: Tokens de Diseño Moderno, Tipografía Editorial, Grid 8pt y Sombras Multicapa', () => {
    it('define la escala tipográfica editorial con ratio 2.5x (--text-xs a --text-display: 2.5rem)', () => {
      expect(stylesCss).toContain('--text-xs: 0.75rem');
      expect(stylesCss).toContain('--text-sm: 0.875rem');
      expect(stylesCss).toContain('--text-base: 1rem');
      expect(stylesCss).toContain('--text-lg: 1.25rem');
      expect(stylesCss).toContain('--text-xl: 1.5rem');
      expect(stylesCss).toContain('--text-display: 2.5rem');
    });

    it('define tracking editorial negativo (-0.02em / -0.025em) en cabeceras y font-variant-numeric: tabular-nums en contadores', () => {
      expect(stylesCss).toContain('--tracking-editorial: -0.025em');
      expect(stylesCss).toContain('font-variant-numeric: tabular-nums');
    });

    it('define el sistema de espaciado estricto de 8pt (--space-0-5 a --space-6)', () => {
      expect(stylesCss).toContain('--space-0-5: 4px');
      expect(stylesCss).toContain('--space-1: 8px');
      expect(stylesCss).toContain('--space-1-5: 12px');
      expect(stylesCss).toContain('--space-2: 16px');
      expect(stylesCss).toContain('--space-3: 24px');
      expect(stylesCss).toContain('--space-4: 32px');
      expect(stylesCss).toContain('--space-5: 40px');
      expect(stylesCss).toContain('--space-6: 48px');
    });

    it('define bordes translúcidos sutiles en modo claro y oscuro (1px solid rgba(..., 0.08))', () => {
      expect(stylesCss).toMatch(/--border-subtle:\s*1px solid rgba\(\d+,\s*\d+,\s*\d+,\s*0\.08\)/);
      expect(stylesCss).toMatch(/:root\[data-theme="dark"\][\s\S]*?--border-subtle:\s*1px solid rgba\(\d+,\s*\d+,\s*\d+,\s*0\.08\)/);
    });

    it('define sombras multicapa compuestas (--elevation-1, --elevation-2, --elevation-3)', () => {
      expect(stylesCss).toMatch(/--elevation-1:\s*0 1px 2px rgba\(/);
      expect(stylesCss).toMatch(/--elevation-2:\s*0 2px 4px rgba\(/);
      expect(stylesCss).toMatch(/--elevation-3:\s*0 4px 8px rgba\(/);
    });
  });

  describe('US-23 & US-24: Micro-interacciones (Emil Kowalski), Feedback Táctil y Modales en Top Layer', () => {
    it('define curvas cubic-bezier personalizadas (--ease-out, --ease-drawer, --ease-spring)', () => {
      expect(stylesCss).toContain('--ease-out: cubic-bezier(0.23, 1, 0.32, 1)');
      expect(stylesCss).toContain('--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)');
      expect(stylesCss).toContain('--ease-spring: cubic-bezier(0.22, 1, 0.36, 1)');
    });

    it('aplica feedback táctil :active con transform: scale(0.97) en elementos interactivos', () => {
      expect(stylesCss).toContain('transform: scale(0.97)');
      expect(stylesCss).toContain(':active:not(:disabled)');
    });

    it('anima modales y <dialog> desde scale(0.95) y opacity: 0 con @starting-style y allow-discrete', () => {
      expect(stylesCss).toContain('@starting-style');
      expect(stylesCss).toContain('allow-discrete');
      expect(stylesCss).toContain('scale(0.95)');
      expect(stylesCss).not.toContain('scale(0)');
    });

    it('respeta la accesibilidad con @media (prefers-reduced-motion: reduce)', () => {
      expect(stylesCss).toContain('@media (prefers-reduced-motion: reduce)');
    });

    it('elimina por completo transition: all de styles.css para garantizar rendimiento a 60/120fps', () => {
      const transitionAllMatches = stylesCss.match(/transition\s*:\s*all\b/gi);
      expect(transitionAllMatches).toBeNull();
    });
  });

  describe('US-49: Eliminación de Inline Styles estáticos en plantillas JS de app.js', () => {
    it('no contiene atributos style="..." estáticos en plantillas HTML de app.js (solo variables CSS dinámicas --*)', () => {
      const styleAttrRegex = /style="([^"]*)"/g;
      const staticStyleAttrs = [];
      let match;
      while ((match = styleAttrRegex.exec(appJs)) !== null) {
        const styleContent = match[1].trim();
        // Split declarations and check if every declaration is a CSS custom property (--*)
        const declarations = styleContent
          .split(';')
          .map(d => d.trim())
          .filter(Boolean);
        const hasStaticProperty = declarations.some(decl => !decl.startsWith('--'));
        if (hasStaticProperty) {
          staticStyleAttrs.push(match[0]);
        }
      }
      expect(staticStyleAttrs).toEqual([]);
    });

    it('no asigna cadenas de estilo directo mediante element.style = "..." en app.js', () => {
      const directStyleAssign = appJs.match(/\.style\s*=\s*['"`]/g);
      expect(directStyleAssign).toBeNull();
    });
  });
  describe('US-84 (v1.78): Auditoría Móvil P2 - Ergonomía Táctil, Contraste WCAG 2.2 AA y Accesibilidad', () => {
    it('define colores conformes con WCAG 2.2 AA (terracota #B84D27 en light, dark texto #261008 en botones oscuros y #b45309 en grasa)', () => {
      expect(stylesCss).toContain('--m3-primary: #B84D27');
      expect(stylesCss).toContain('--color-terracotta: #B84D27');
      expect(stylesCss).toContain('--m3-on-primary: #261008');
      expect(stylesCss).toContain('.macro-fat .macro-chip-label { color: #b45309; }');
      expect(stylesCss).toContain('color: var(--m3-on-primary-container, #5C220D);');
    });

    it('define áreas táctiles mínimas (≥ 44x44px) en @media (pointer: coarse) y controles de Modo Cocina', () => {
      expect(stylesCss).toContain('@media (pointer: coarse)');
      expect(stylesCss).toContain('.btn-remove-circle::after');
      expect(stylesCss).toContain('width: 44px');
      expect(stylesCss).toContain('height: 44px');
      expect(stylesCss).toContain('#cook-mode-overlay .btn-sm');
      expect(stylesCss).toContain('min-height: 48px');
    });

    it('reserva padding inferior seguro para el dock flotante en móvil (calc(104px + env(safe-area-inset-bottom)))', () => {
      expect(stylesCss).toContain('padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px))');
    });

    it('asigna nombres accesibles (aria-label o <label for>) a todos los inputs principales en index.html', () => {
      const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
      expect(indexHtml).toContain('id="recipes-search-input" aria-label="');
      expect(indexHtml).toContain('id="input-fridge-ingredient" aria-label="');
      expect(indexHtml).toContain('id="input-quick-grocery" aria-label="');
      expect(indexHtml).toContain('id="gemini-invoke-input" class="form-input gemini-input" aria-label="');
      expect(indexHtml).toContain('id="input-goal-calories" placeholder="2000" aria-label="');
      expect(indexHtml).toContain('<label class="form-label" for="auth-email">');
    });
  });
  describe('US-85 (v1.79): Auditoría Visual P3 - Iconografía Vectorial, LCP y Pulido Desktop', () => {
    it('elimina los @import bloqueantes de styles.css e incorpora preconnect en index.html para acelerar LCP', () => {
      const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
      expect(stylesCss).not.toMatch(/^@import\s+url\(/m);
      expect(indexHtml).toContain('<link rel="preconnect" href="https://fonts.googleapis.com">');
      expect(indexHtml).toContain('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
    });

    it('unifica la iconografía sustituyendo emojis crudos en modales de macros y onboarding por Material Symbols', () => {
      const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
      expect(indexHtml).toContain('local_fire_department');
      expect(indexHtml).toContain('egg_alt');
      expect(indexHtml).toContain('grain');
      expect(indexHtml).not.toContain('🔥 Kcal');
      expect(indexHtml).not.toContain('🥩 Proteína');
      expect(indexHtml).not.toContain('🌾 Carbos');
    });

    it('aplica font-variant-numeric: tabular-nums a contadores y temporizadores dinámicos', () => {
      expect(stylesCss).toContain('.today-header-kcal-num');
      expect(stylesCss).toContain('.macro-chip-val');
      expect(stylesCss).toContain('font-variant-numeric: tabular-nums');
    });

    it('restringe la visualización de #pwa-smart-banner en escritorio y centra el estado vacío de compra', () => {
      expect(stylesCss).toContain('#pwa-smart-banner');
      expect(stylesCss).toContain('display: none !important;');
      expect(stylesCss).toContain('max-width: 520px;');
      expect(stylesCss).toContain('margin: var(--space-4) auto;');
    });

    it('soporta transiciones suaves entre vistas con document.startViewTransition en switchView', () => {
      const appJs = fs.readFileSync(path.join(process.cwd(), 'app.js'), 'utf-8');
      expect(appJs).toContain('document.startViewTransition');
      expect(appJs).toContain('prefers-reduced-motion');
    });
  });

  describe('US-86 (v1.80): Pulido Integral de Jerarquía y Estética Editorial', () => {
    const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
    const stylesCss = fs.readFileSync(path.join(process.cwd(), 'styles.css'), 'utf-8');

    it('declara tarjeta de macros al 100% bajo la cabecera en Hoy', () => {
      expect(indexHtml).toContain('class="today-nutrition-card today-header-macros today-nutrition-fullwidth"');
      expect(stylesCss).toContain('.today-nutrition-card.today-nutrition-fullwidth');
      expect(stylesCss).toContain('width: 100% !important;');
    });

    it('integra armoniosamente el botón central del Sous Chef dentro del dock sin protuberancias', () => {
      expect(indexHtml).toContain('id="btn-central-gemini-invoke"');
      expect(stylesCss).toContain('.bottom-nav');
      expect(stylesCss).toContain('.nav-item-gemini');
    });

    it('elimina la redundancia "Hoy" en la etiqueta de fecha del Menú de Hoy', () => {
      expect(indexHtml).toContain('id="today-date-text"');
      expect(indexHtml).not.toContain('<span id="today-date-text" data-i18n="nav.today">Hoy</span>');
    });

    it('unifica la barra de navegación del Planificador Semanal en una sola fila', () => {
      expect(indexHtml).toContain('week-nav-bar-unified');
      expect(stylesCss).toContain('.week-nav-bar-unified');
      expect(stylesCss).toContain('.week-nav-controls-group');
    });

    it('declara ficha de receta modal a pantalla completa en móvil por encima del dock', () => {
      expect(stylesCss).toContain('@media (max-width: 768px)');
      expect(stylesCss).toContain('#modal-recipe-detail');
      expect(stylesCss).toContain('width: 100vw !important;');
      expect(stylesCss).toContain('height: 100dvh !important;');
      expect(stylesCss).toContain('z-index: 200 !important;');
    });

    it('detecta y asegura la experiencia movil con dock en tablets y plegables (Z Fold 8, iPads, etc.)', () => {
      expect(indexHtml).toContain('US-86: Deteccion de dispositivos moviles');
      expect(stylesCss).toContain('html.is-mobile-device .bottom-nav');
      expect(stylesCss).toContain('display: flex !important;');
      expect(stylesCss).toContain('html.is-mobile-device .desktop-header-nav');
      expect(stylesCss).toContain('display: none !important;');
    });

    it('FoodAssistantApp en app.js implementa detectMobileDevice y applyDeviceMode', () => {
      const appJs = fs.readFileSync(path.join(process.cwd(), 'app.js'), 'utf-8');
      expect(appJs).toContain('detectMobileDevice()');
      expect(appJs).toContain('applyDeviceMode(isMobile)');
      expect(appJs).toContain('this.isMobileDevice =');
    });
  });
});
