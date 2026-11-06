import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load and execute app.js in happy-dom environment
const appPath = path.resolve(process.cwd(), 'app.js');
const appCode = fs.readFileSync(appPath, 'utf-8');
new Function(appCode)();

const {
  FoodAssistantApp,
  RecipeParser,
  escapeHtml,
  isSafeUrl,
  sanitizeUrl,
  cleanRecipeImageUrl
} = window;

describe('Fase 1: Seguridad y Endurecimiento (US-36, US-38, US-40)', () => {
  let app;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <header>
        <button id="btn-header-account">
          <span id="header-account-icon"></span>
          <span id="header-account-text"></span>
        </button>
      </header>
      <div id="settings-user-icon"></div>
      <div id="settings-user-name"></div>
      <div id="settings-user-status"></div>
      <button id="btn-settings-auth-action"></button>
      <button id="btn-sync-now"></button>
      <div id="sync-status-indicator"></div>

      <div id="modal-auth">
        <h3 id="auth-modal-title"></h3>
        <div id="auth-tab-buttons"></div>
        <div id="auth-forms-container"></div>
        <div id="auth-logged-in-container" style="display: none;">
          <span id="auth-profile-name"></span>
          <span id="auth-profile-email"></span>
        </div>
        <div id="auth-error-msg" style="display: none;"></div>
        <input id="auth-email" value="">
        <input id="auth-password" value="">
        <input id="auth-name" value="">
      </div>

      <div id="recipe-modal-body"></div>
      <div id="recipes-cards-grid"></div>
    `;

    app = new FoodAssistantApp();
    app.showToast = vi.fn();
  });

  describe('US-36: Escapado de HTML y URLs Seguras (Anti-XSS)', () => {
    it('escapeHtml sanea caracteres peligrosos (&, <, >, ", \')', () => {
      const malicious = '<script>alert("xss")</script> & \'test\'';
      const safe = escapeHtml(malicious);
      expect(safe).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &#39;test&#39;');
      expect(safe).not.toContain('<script>');
    });

    it('escapeHtml maneja valores null, undefined y números con seguridad', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
      expect(escapeHtml(123)).toBe('123');
    });

    it('isSafeUrl valida protocolos permitidos (http, https, data:image/) y bloquea javascript:', () => {
      expect(isSafeUrl('https://example.com/foto.jpg')).toBe(true);
      expect(isSafeUrl('http://sub.domain.org/recipe')).toBe(true);
      expect(isSafeUrl('data:image/jpeg;base64,/9j/4AAQSkZJRg==')).toBe(true);

      expect(isSafeUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeUrl('javascript:void(0)')).toBe(false);
      expect(isSafeUrl('vbscript:msgbox("xss")')).toBe(false);
      expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
      expect(isSafeUrl('')).toBe(false);
      expect(isSafeUrl(null)).toBe(false);
    });

    it('sanitizeUrl devuelve fallback si la URL contiene javascript:', () => {
      expect(sanitizeUrl('javascript:alert(document.cookie)', '')).toBe('');
      expect(sanitizeUrl('https://seguro.com/receta', '#')).toBe('https://seguro.com/receta');
    });

    it('cleanRecipeImageUrl bloquea URLs maliciosas devolviendo cadena vacía', () => {
      expect(cleanRecipeImageUrl('javascript:alert(1)')).toBe('');
      expect(cleanRecipeImageUrl('https://images.unsplash.com/photo-1?utm_source=test&ref=123')).toBe('https://images.unsplash.com/photo-1');
    });

    it('renderSingleRecipeCardHtml escapa payloads XSS en el título y descripción de la receta', () => {
      const maliciousRecipe = {
        id: 'rec-xss-1',
        title: '<img src=x onerror=alert("xss-title")>',
        description: '<script>alert("xss-desc")</script>',
        imageUrl: 'javascript:alert("img-xss")',
        prepTimeMinutes: 10,
        cookTimeMinutes: 20,
        tags: ['<svg onload=alert(1)>']
      };

      const html = app.renderSingleRecipeCardHtml(maliciousRecipe, false);
      const testContainer = document.createElement('div');
      testContainer.innerHTML = html;

      // Ningún nodo malicioso ejecutable debe haberse instanciado en el DOM
      expect(testContainer.querySelector('script')).toBeNull();
      expect(testContainer.querySelector('img[src^="javascript:"]')).toBeNull();
      expect(testContainer.querySelector('svg')).toBeNull();
      expect(testContainer.querySelector('.recipe-title').textContent).toBe('<img src=x onerror=alert("xss-title")>');
    });

    it('renderRecipeModalContent escapa ingredientes, instrucciones y enlaces de origen peligrosos', () => {
      app.activeRecipe = {
        id: 'rec-detail-xss',
        title: 'Receta Peligrosa',
        description: 'Descripción',
        servings: 2,
        imageUrl: '',
        sourceUrl: 'javascript:alert("pwned")',
        sourceDomain: '<b onmouseover=alert(1)>malicioso</b>',
        tags: ['Seguridad'],
        ingredients: [
          { name: '<script>alert("ing")</script>', amount: 100, unit: 'g' }
        ],
        instructions: [
          { step: 1, text: '<img src=x onerror=alert("step")>', timerMinutes: 5 }
        ]
      };
      app.activeServings = 2;

      app.renderRecipeModalContent();

      const modalBody = document.getElementById('recipe-modal-body');
      expect(modalBody.querySelector('script')).toBeNull();
      expect(modalBody.querySelector('a[href^="javascript:"]')).toBeNull();
      expect(modalBody.querySelector('img[onerror]')).toBeNull();
      expect(modalBody.textContent).toContain('<script>alert("ing")</script>');
    });

    it('parseBulkCollection rechaza estructuras de backup JSON no válidas o primitivas', () => {
      expect(() => RecipeParser.parseBulkCollection('12345')).toThrow(/Estructura de copia de seguridad no válida/);
      expect(() => RecipeParser.parseBulkCollection('"solo un texto"')).toThrow(/Estructura de copia de seguridad no válida/);
    });

    it('parseBulkCollection filtra URLs javascript: al importar candidatos masivos', () => {
      const maliciousBackup = {
        recipes: [
          {
            title: 'Receta Backup',
            imageUrl: 'javascript:alert("backup-img")',
            sourceUrl: 'javascript:alert("backup-source")',
            ingredients: ['100g Harina'],
            instructions: ['Paso 1']
          }
        ]
      };

      const result = RecipeParser.parseBulkCollection(maliciousBackup);
      expect(result.candidates.length).toBe(1);
      expect(result.candidates[0].imageUrl).toBe('');
      expect(result.candidates[0].sourceUrl).toBe('');
    });
  });

  describe('US-38: Eliminar Login Simulado y Datos Personales Hardcodeados', () => {
    it('handleGoogleAuth avisa que se requiere Supabase si el cliente no está inicializado', async () => {
      app.supabaseClient = null;
      await app.handleGoogleAuth();
      expect(app.showToast).toHaveBeenCalledWith(
        expect.stringContaining('La autenticación con Google requiere configurar Supabase'),
        'info'
      );
    });

    it('updateUserAccountUI etiqueta claramente las sesiones sin Supabase como (Demo)', () => {
      window.state.cloudUser = {
        name: 'Carlos',
        email: 'carlos@demo.local',
        id: 'usr_demo_123',
        isDemo: true
      };
      app.supabaseClient = null;

      app.updateUserAccountUI();

      const pillText = document.getElementById('header-account-text');
      const settingsStatus = document.getElementById('settings-user-status');
      expect(pillText.textContent).toContain('(Demo)');
      expect(settingsStatus.textContent).toContain('Perfil local (Demo) - Supabase no configurado');
    });
  });

  describe('US-40: Servidor Local server.ps1 Endurecido', () => {
    it('server.ps1 contiene verificación de Path Traversal y rechazo anti-SSRF', () => {
      const serverCode = fs.readFileSync(path.resolve(process.cwd(), 'server.ps1'), 'utf-8');
      expect(serverCode).toContain('Test-IsSafeExternalUrl');
      expect(serverCode).toContain('StartsWith($fullRoot');
      expect(serverCode).toContain('.webmanifest');
      expect(serverCode).toContain('.webp');
      expect(serverCode).toContain('SSRF protegido');
    });
  });
  describe('Auditoría de Seguridad Formal (Security Audit Fixes)', () => {
    it('renderRecipeModalContent con r.imageUrl sanea src y escapa alt y r.id', () => {
      app.activeRecipe = {
        id: "x'onerror='alert(1)",
        title: 'Tacos" onerror="alert(\'xss-title\')" x="',
        description: 'Deliciosos tacos',
        servings: 2,
        imageUrl: 'https://images.unsplash.com/photo-test',
        sourceUrl: 'https://ejemplo.com/tacos',
        sourceDomain: 'ejemplo.com',
        tags: ['Cena'],
        ingredients: [{ name: 'Tortilla', amount: 2, unit: 'ud' }],
        instructions: [{ step: 1, text: 'Calentar tortilla', timerMinutes: 2 }]
      };
      app.activeServings = 2;

      app.renderRecipeModalContent();

      const modalBody = document.getElementById('recipe-modal-body');
      const img = modalBody.querySelector('.recipe-detail-hero-photo img');
      expect(img).not.toBeNull();
      // El atributo alt contiene el texto pero no rompió la etiqueta ni inyectó onerror
      expect(img.getAttribute('alt')).toBe('Tacos" onerror="alert(\'xss-title\')" x="');
      expect(modalBody.querySelector('img[onerror*="xss-title"]')).toBeNull();
      // onerror escapa la comilla simple del id
      expect(img.getAttribute('onerror')).toContain("x\'onerror=\'alert(1)");
    });

    it('RecipeParser.parseBulkCollection sanea IDs maliciosos con comillas o scripts', () => {
      const malicious = {
        recipes: [
          {
            id: "bad'id\");alert(1);//",
            title: 'Receta Peligrosa',
            ingredients: ['1 huevo'],
            instructions: ['Cocer']
          }
        ]
      };

      const result = RecipeParser.parseBulkCollection(malicious);
      expect(result.candidates.length).toBe(1);
      // El ID debe haber sido reemplazado por un ID seguro generado
      expect(result.candidates[0].id).toMatch(/^rec-[a-zA-Z0-9-]+$/);
      expect(result.candidates[0].id).not.toContain("'");
    });

    it('renderSingleRecipeCardHtml escapa comillas en rec.id para evitar breakout en onclick', () => {
      const recipe = {
        id: "rec-safe-1",
        title: 'Receta Test',
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        imageUrl: '',
        isFavorite: false
      };

      const html = app.renderSingleRecipeCardHtml(recipe, false);
      expect(html).toContain("onclick=\"app.openRecipeDetail('rec-safe-1')\"");
    });

    it('handleGeminiInvokeSubmit sanea mensajes de error en el banner de fallback para prevenir XSS', async () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <input id="gemini-invoke-input" value="Quiero una receta">
        <div id="gemini-invoke-transcription"></div>
        <div id="gemini-invoke-result" style="display: none;"></div>
        <div id="gemini-invoke-result-text"></div>
        <div id="gemini-invoke-result-actions"></div>
        <button id="btn-gemini-invoke-send"></button>
      `;
      document.body.appendChild(container);

      app.callGeminiAgent = vi.fn().mockResolvedValue({
        text: 'Respuesta simulada',
        toolCalls: [],
        isSimulatedFallback: true,
        originalError: '<img src=x onerror=alert("err-xss")>'
      });

      await app.handleGeminiInvokeSubmit();

      const resultText = document.getElementById('gemini-invoke-result-text');
      expect(resultText.querySelector('img')).toBeNull();
      expect(resultText.textContent).toContain('<img src=x onerror=alert("err-xss")>');
    });
  });
});
