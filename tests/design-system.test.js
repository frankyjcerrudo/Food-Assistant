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
});
