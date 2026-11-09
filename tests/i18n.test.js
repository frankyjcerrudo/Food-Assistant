import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load i18n in happy-dom environment
const i18nPath = path.resolve(process.cwd(), 'i18n.js');
const i18nCode = fs.readFileSync(i18nPath, 'utf-8');
new Function(i18nCode)();

const I18n = window.I18n;

describe('US-12: Módulo Core de Internacionalización (i18n.js)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute('lang', 'es');
    I18n.setPreference('auto');
  });

  it('debe inicializarse con preferencia "auto" y soporte UMD en window.I18n', () => {
    expect(I18n).toBeDefined();
    expect(I18n.SUPPORTED_LANGUAGES).toContain('es');
    expect(I18n.SUPPORTED_LANGUAGES).toContain('en');
    expect(['auto', 'es', 'en']).toContain(I18n.getPreference());
  });

  it('detecta español cuando navigator.language es "es-ES"', () => {
    const originalNav = window.navigator;
    Object.defineProperty(window, 'navigator', {
      value: { languages: ['es-ES', 'es'], language: 'es-ES' },
      configurable: true
    });

    expect(I18n.detectSystemLanguage()).toBe('es');

    Object.defineProperty(window, 'navigator', {
      value: originalNav,
      configurable: true
    });
  });

  it('detecta inglés cuando navigator.language es "en-US"', () => {
    const originalNav = window.navigator;
    Object.defineProperty(window, 'navigator', {
      value: { languages: ['en-US', 'en'], language: 'en-US' },
      configurable: true
    });

    expect(I18n.detectSystemLanguage()).toBe('en');

    Object.defineProperty(window, 'navigator', {
      value: originalNav,
      configurable: true
    });
  });

  it('aplica fallback a inglés para idiomas no soportados (ej. alemán "de-DE" o francés "fr-FR")', () => {
    const originalNav = window.navigator;
    Object.defineProperty(window, 'navigator', {
      value: { languages: ['fr-FR', 'fr'], language: 'fr-FR' },
      configurable: true
    });

    expect(I18n.detectSystemLanguage()).toBe('en');

    Object.defineProperty(window, 'navigator', {
      value: originalNav,
      configurable: true
    });
  });

  it('traduce correctamente cadenas básicas en español e inglés', () => {
    I18n.setPreference('es');
    expect(I18n.t('nav.today')).toBe('Hoy');
    expect(I18n.t('nav.recipes')).toBe('Recetas');
    expect(I18n.t('common.save')).toBe('Guardar');

    I18n.setPreference('en');
    expect(I18n.t('nav.today')).toBe('Today');
    expect(I18n.t('nav.recipes')).toBe('Recipes');
    expect(I18n.t('common.save')).toBe('Save');
  });

  it('soporta interpolación de parámetros dinámicos {param}', () => {
    I18n.MESSAGES.es.testKey = 'Hola {name}, tienes {count} recetas';
    I18n.setPreference('es');
    expect(I18n.t('testKey', { name: 'Franky', count: 5 })).toBe('Hola Franky, tienes 5 recetas');
  });

  it('actualiza el atributo <html lang="..."> al cambiar de idioma', () => {
    I18n.setPreference('en');
    expect(document.documentElement.getAttribute('lang')).toBe('en');

    I18n.setPreference('es');
    expect(document.documentElement.getAttribute('lang')).toBe('es');
  });

  it('persiste la preferencia en localStorage con la clave fa_language', () => {
    I18n.setPreference('en');
    expect(localStorage.getItem('fa_language')).toBe('en');

    I18n.setPreference('auto');
    expect(localStorage.getItem('fa_language')).toBe('auto');
  });

  it('aplica traducciones automáticas al DOM con applyTranslations()', () => {
    document.body.innerHTML = `
      <div id="test-container">
        <h1 data-i18n="nav.today">Antiguo</h1>
        <input type="text" data-i18n-placeholder="recipes.searchPlaceholder" placeholder="old">
        <button data-i18n-title="common.save" title="old">
          <span class="material-symbols-outlined">save</span>
          <span data-i18n="common.save">Antiguo</span>
        </button>
      </div>
    `;

    I18n.setPreference('en');
    I18n.applyTranslations(document.getElementById('test-container'));

    expect(document.querySelector('h1').textContent).toBe('Today');
    expect(document.querySelector('input').getAttribute('placeholder')).toBe('Search by dish, ingredient or technique...');
    expect(document.querySelector('button').getAttribute('title')).toBe('Save');
    expect(document.querySelector('button span[data-i18n]').textContent).toBe('Save');
  });

  it('traduce los nombres de pasillos de compra mediante getAisleName()', () => {
    I18n.setPreference('es');
    expect(I18n.getAisleName('produce')).toBe('Frutas y Verduras');
    expect(I18n.getAisleName('dairy')).toBe('Lácteos y Huevos');

    I18n.setPreference('en');
    expect(I18n.getAisleName('produce')).toBe('Produce & Veggies');
    expect(I18n.getAisleName('dairy')).toBe('Dairy & Eggs');
  });

  it('clasifica correctamente ingredientes en inglés hacia sus pasillos correspondientes', () => {
    const appPath = path.resolve(process.cwd(), 'app.js');
    const appCode = fs.readFileSync(appPath, 'utf-8');
    new Function(appCode)();
    const { categorizeIngredientAisle, getAisleLabel } = window;

    expect(categorizeIngredientAisle('Chicken breast')).toBe('meat');
    expect(categorizeIngredientAisle('Fresh salmon fillet')).toBe('meat');
    expect(categorizeIngredientAisle('Cheddar cheese')).toBe('dairy');
    expect(categorizeIngredientAisle('Whole milk')).toBe('dairy');
    expect(categorizeIngredientAisle('Cherry tomatoes')).toBe('produce');
    expect(categorizeIngredientAisle('Fresh spinach')).toBe('produce');
    expect(categorizeIngredientAisle('Extra virgin olive oil')).toBe('spices');
    expect(categorizeIngredientAisle('Spaghetti pasta')).toBe('pantry');
    expect(categorizeIngredientAisle('Sliced bread')).toBe('bakery');
    expect(categorizeIngredientAisle('Vanilla ice cream')).toBe('frozen');
    expect(categorizeIngredientAisle('Orange juice')).toBe('beverages');

    // Test getAisleLabel in both languages
    I18n.setPreference('es');
    expect(getAisleLabel('produce')).toBe('Frutas y Verduras');
    expect(getAisleLabel('meat')).toBe('Carnes y Pescados');

    I18n.setPreference('en');
    expect(getAisleLabel('produce')).toBe('Produce & Veggies');
    expect(getAisleLabel('meat')).toBe('Meat & Seafood');
  });

  it('traduce las vistas principales en index.html al alternar a inglés (Fase 2)', () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    // Strip scripts and stylesheet links to prevent happy-dom network requests
    htmlContent = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<link[\s\S]*?>/gi, '');
    document.body.innerHTML = htmlContent;

    I18n.setPreference('en');
    I18n.applyTranslations(document.body);

    // Today
    expect(document.querySelector('.today-title').textContent).toBe("Today's Menu");
    // Recipes
    expect(document.querySelector('#view-recipes .section-title span[data-i18n]').textContent).toBe("Recipes");
    expect(document.querySelector('#recipes-search-input').getAttribute('placeholder')).toBe("Search by dish, ingredient or technique...");
    // Planner
    expect(document.querySelector('#view-planner .section-title').textContent).toBe("Weekly Planner");
    // Shopping
    expect(document.querySelector('#view-shopping .section-title').textContent).toBe("Shopping List");
    expect(document.querySelector('#input-quick-grocery').getAttribute('placeholder')).toBe("Add item (e.g. Bananas, 1L Milk, Eggs...)");
    // Settings
    expect(document.querySelector('#view-settings .section-title').textContent).toBe("Settings");
    expect(document.querySelector('#card-language-settings [data-i18n="settings.languageTitle"]').textContent).toBe("Language");
  });

  it('traduce modales interactivos: Onboarding, Cook Mode e Importador (Fase 3)', () => {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    htmlContent = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<link[\s\S]*?>/gi, '');
    document.body.innerHTML = htmlContent;

    I18n.setPreference('en');
    I18n.applyTranslations(document.body);

    // Onboarding Wizard
    expect(document.querySelector('#onboarding-modal-title').textContent).toBe("Welcome to Sabory!");
    expect(document.querySelector('#btn-onboarding-skip').textContent.trim()).toBe("Skip for now");
    expect(document.querySelector('#onboarding-step-2 .onboarding-step-kicker').textContent).toBe("Step 2 of 5 · Food");
    expect(document.querySelector('#onboarding-step-3 .onboarding-step-kicker').textContent).toBe("Step 3 of 5 · Nutrition");
    expect(document.querySelector('#onboarding-step-4 .onboarding-step-kicker').textContent).toBe("Step 4 of 5 · Household");
    expect(document.querySelector('#btn-onboarding-next span[data-i18n]').textContent).toBe("Next");
    expect(document.querySelector('#btn-onboarding-finish span[data-i18n]').textContent).toBe("Start cooking!");

    // Cook Mode Overlay
    expect(document.querySelector('#cook-mode-overlay .cook-mode-header-kicker span[data-i18n="cooking.mode"]').textContent).toBe("Cooking Mode");
    expect(document.querySelector('#btn-exit-cook-mode span[data-i18n]').textContent).toBe("Exit");
    expect(document.querySelector('#btn-timer-start').textContent).toBe("Start");
    expect(document.querySelector('#btn-timer-reset').textContent).toBe("Reset");
    expect(document.querySelector('#btn-cook-prev-step span[data-i18n]').textContent).toBe("Previous");
    expect(document.querySelector('#btn-cook-next-step span[data-i18n]').textContent).toBe("Next");

    // Recipe Importer
    expect(document.querySelector('#modal-recipe-import h3 span[data-i18n]').textContent).toBe("Recipe Importer");
    expect(document.querySelector('#tab-import-url .import-tab-label').textContent).toBe("Link");
    expect(document.querySelector('#tab-import-text .import-tab-label').textContent).toBe("Text");
    expect(document.querySelector('#tab-import-ai .import-tab-label').textContent).toBe("Photo / AI");
    expect(document.querySelector('#btn-execute-import span[data-i18n]').textContent).toBe("Analyze & Import");
  });

  it('resuelve claves de toast y añade directiva de idioma al prompt de IA (Fase 4)', () => {
    const appPath = path.resolve(process.cwd(), 'app.js');
    const appCode = fs.readFileSync(appPath, 'utf-8');
    new Function(appCode)();

    I18n.setPreference('en');
    expect(I18n.t('toasts.recipeSaved')).toBe('Recipe saved successfully');
    expect(I18n.t('toasts.shoppingCleared')).toBe('Purchased items cleared');

    I18n.setPreference('es');
    expect(I18n.t('toasts.recipeSaved')).toBe('Receta guardada con éxito');
    expect(I18n.t('toasts.shoppingCleared')).toBe('Artículos comprados eliminados');

    // Test AI System Instruction language directive
    const appInstance = new window.FoodAssistantApp();
    I18n.setPreference('en');
    const enInstruction = appInstance.buildAiSystemInstruction();
    expect(enInstruction).toContain('10. LANGUAGE: Respond to Franky in fluent English');

    I18n.setPreference('es');
    const esInstruction = appInstance.buildAiSystemInstruction();
    expect(esInstruction).toContain('10. IDIOMA: Responde a Franky en español');
  });
});
