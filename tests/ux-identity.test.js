import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const cssPath = path.resolve(process.cwd(), 'styles.css');
const htmlPath = path.resolve(process.cwd(), 'index.html');
const appPath = path.resolve(process.cwd(), 'app.js');
const cssContent = fs.readFileSync(cssPath, 'utf-8');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
const appCode = fs.readFileSync(appPath, 'utf-8');

document.documentElement.innerHTML = htmlContent;
new Function(appCode)();

const { FoodAssistantApp, state, SEED_RECIPES } = window;

describe('US-73: Auditoría Integral de UX, Arquitectura de Información e Identidad "Savory"', () => {
  let appInstance;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.innerHTML = htmlContent;
    state.recipes = typeof structuredClone === 'function' ? structuredClone(SEED_RECIPES) : JSON.parse(JSON.stringify(SEED_RECIPES));
    state.mealPlan = state.generateInitialMealPlan();
    appInstance = new FoodAssistantApp();
    window.app = appInstance;
  });

  it('1. Identidad Editorial Culinaria "Savory": Branding, tipografía serif y paleta cálida terracota/crema', () => {
    expect(htmlContent).toContain('<title>Savory</title>');
    const brandName = document.querySelector('.app-header .brand-name');
    expect(brandName).not.toBeNull();
    expect(brandName.textContent.trim()).toBe('Savory');

    // Tipografía serif editorial y fuente geométrica en styles.css
    expect(cssContent).toContain('Playfair+Display');
    expect(cssContent).toContain('--font-serif:');
    expect(cssContent).toContain('--m3-surface-canvas: #FAF7F2');
    expect(cssContent).toContain('--m3-primary: #C85A32');
    expect(cssContent).toContain('--color-brand: #2D6A4F');

    // Modo oscuro cálido Espresso Obsidian
    expect(cssContent).toContain('--m3-surface-canvas: #141210');
    expect(cssContent).toContain('--m3-primary: #E57A52');
  });

  it('2. Cabecera minimalista (Top Bar): sin badge de versión ni botón de tema en header', () => {
    const header = document.querySelector('header.app-header');
    expect(header).not.toBeNull();
    expect(header.querySelector('#app-version-badge')).toBeNull();
    expect(header.querySelector('#btn-header-theme')).toBeNull();
    expect(header.querySelector('#btn-header-account')).not.toBeNull();
    expect(header.querySelector('#btn-header-settings')).not.toBeNull();

    // El badge de versión vive ahora dentro de Ajustes (#card-app-version)
    const settingsVersionCard = document.getElementById('card-app-version');
    expect(settingsVersionCard).not.toBeNull();
    expect(settingsVersionCard.querySelector('#app-version-badge')).not.toBeNull();
  });

  it('3. Vista "Hoy": Comidas planificadas primero, sin botón "Semana →" y píldora nutricional desplegable', () => {
    const todayView = document.getElementById('view-today');
    expect(todayView).not.toBeNull();

    // Sin botón redundante "Semana →"
    expect(todayView.querySelector('#btn-goto-planner')).toBeNull();

    // #today-slots-container aparece ANTES que #today-nutrition-card en el DOM
    const childrenIds = Array.from(todayView.children).map(el => el.id).filter(Boolean);
    const slotsIdx = childrenIds.indexOf('today-slots-container');
    const nutritionIdx = childrenIds.indexOf('today-nutrition-card');
    expect(slotsIdx).toBeGreaterThanOrEqual(0);
    expect(nutritionIdx).toBeGreaterThan(slotsIdx);

    // Activar objetivos nutricionales y verificar la píldora compacta desplegable
    state.settings.nutritionGoals = {
      enabled: true,
      calories: 2000,
      protein: 140,
      carbs: 200,
      fat: 65
    };
    const todayKey = window.toLocalDateKey(new Date());
    state.mealPlan[todayKey] = {
      dayName: 'Hoy',
      breakfast: state.recipes[0]?.id || 'rec-pesto-pasta',
      lunch: null,
      snack: null,
      dinner: null,
      customSlots: []
    };
    appInstance.renderTodayView();

    const nutritionCard = document.getElementById('today-nutrition-card');
    const pillBar = document.getElementById('today-nutrition-pill-bar');
    expect(pillBar).not.toBeNull();
    expect(nutritionCard.classList.contains('is-expanded')).toBe(false);

    // Al pulsar la píldora se despliega el detalle nutricional
    appInstance.toggleTodayNutritionDetails();
    expect(nutritionCard.classList.contains('is-expanded')).toBe(true);
  });

  it('4. Planificador Semanal: Acordeón inteligente (2 días expandidos, 5 días compactos en 1 línea)', () => {
    appInstance.plannerExpandedDays = null;
    appInstance.renderPlanner();

    const dayCards = Array.from(document.querySelectorAll('#planner-days-container .day-card'));
    expect(dayCards.length).toBe(7);

    const expandedCards = dayCards.filter(c => c.classList.contains('is-expanded'));
    const collapsedCards = dayCards.filter(c => c.classList.contains('is-collapsed'));
    expect(expandedCards.length).toBeGreaterThanOrEqual(1);
    expect(expandedCards.length).toBeLessThanOrEqual(2);
    expect(collapsedCards.length).toBe(7 - expandedCards.length);

    // Cada tarjeta tiene resumen compacto y NO tiene el botón inferior duplicado .planner-day-footer
    dayCards.forEach(card => {
      expect(card.querySelector('.day-compact-summary')).not.toBeNull();
      expect(card.querySelector('.planner-day-footer')).toBeNull();
    });

    // Alternar un día plegado lo expande
    const firstCollapsed = collapsedCards[0];
    const targetDate = firstCollapsed.dataset.date;
    appInstance.togglePlannerDayAccordion(targetDate);
    expect(firstCollapsed.classList.contains('is-expanded')).toBe(true);

    // Botón de expandir/plegar toda la semana
    appInstance.toggleAllPlannerDays();
    const allExpandedNow = Array.from(document.querySelectorAll('#planner-days-container .day-card'))
      .every(c => c.classList.contains('is-expanded'));
    expect(allExpandedNow).toBe(true);
  });

  it('5. Recetas y Ajustes: Chip "Mi Nevera" en filtros, sin #view-ai huérfana y Ajustes en 2 niveles', () => {
    // Buscador limpio sin botón de nevera incrustado
    const searchBar = document.querySelector('#view-recipes .m3-search-bar');
    expect(searchBar).not.toBeNull();
    expect(searchBar.querySelector('#btn-toggle-fridge-panel')).toBeNull();

    // "Mi Nevera" es el primer chip de #recipes-tag-filters
    const tagFilters = document.getElementById('recipes-tag-filters');
    expect(tagFilters).not.toBeNull();
    const firstChip = tagFilters.querySelector('button');
    expect(firstChip).not.toBeNull();
    expect(firstChip.id).toBe('btn-toggle-fridge-panel');

    // No existe la vista huérfana #view-ai en index.html
    expect(document.getElementById('view-ai')).toBeNull();

    // Ajustes divididos en Nivel 1 (Preferencias Culinarias) y Nivel 2 (#settings-advanced-accordion)
    const advancedAccordion = document.getElementById('settings-advanced-accordion');
    expect(advancedAccordion).not.toBeNull();
    expect(advancedAccordion.tagName.toLowerCase()).toBe('details');
    expect(advancedAccordion.hasAttribute('open')).toBe(false);
    expect(advancedAccordion.querySelector('#card-ai-settings')).not.toBeNull();
    expect(advancedAccordion.querySelector('#card-external-agent')).not.toBeNull();
    expect(advancedAccordion.querySelector('#card-app-version')).not.toBeNull();
  });
});
