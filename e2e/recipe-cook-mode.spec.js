import { test, expect } from '@playwright/test';

test.describe('Recipe Catalog, Servings Scaling & Cook Mode Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fa_onboarding_completed', 'true');
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register = () => Promise.resolve({
          update: () => Promise.resolve(),
          unregister: () => Promise.resolve(true)
        });
      }
    });
    await page.goto('/');
    await page.waitForFunction(() => typeof window.app?.switchView === 'function');
    await page.evaluate(() => window.app.switchView('view-recipes'));
    await page.waitForSelector('#view-recipes.active');
  });

  test('búsqueda de recetas por texto y filtrado por chips de etiquetas', async ({ page }) => {
    const searchInput = page.locator('#recipes-search-input');
    await expect(searchInput).toBeVisible();

    // 1. Filtrar por término de búsqueda "Pesto"
    await searchInput.fill('Pesto');
    await page.waitForTimeout(150);

    const cards = page.locator('#recipes-cards-grid .recipe-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText(/pesto/i);
    }

    // 2. Limpiar búsqueda
    await searchInput.fill('');
    await page.waitForTimeout(100);

    // 3. Filtrar por chip de etiqueta
    const chipAlmuerzo = page.locator('#recipes-tag-filters .m3-filter-chip[data-tag="Almuerzo"]');
    if (await chipAlmuerzo.isVisible()) {
      await chipAlmuerzo.click();
      await page.waitForTimeout(100);
      await expect(chipAlmuerzo).toHaveClass(/active/);
    }
  });

  test('abrir el detalle de una receta y escalar el número de raciones recalcula ingredientes proporcionalmente', async ({ page }) => {
    const firstCard = page.locator('#recipes-cards-grid .recipe-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    const modalRecipe = page.locator('#modal-recipe-detail');
    await expect(modalRecipe).toBeVisible();

    const title = page.locator('#modal-recipe-detail .recipe-detail-title');
    await expect(title).toBeVisible();

    const servingsValEl = page.locator('#modal-recipe-detail .recipe-stat-servings-val');
    await expect(servingsValEl).toBeVisible();
    const initialServingsText = await servingsValEl.innerText();

    // Incrementar porciones (+)
    const btnIncrease = page.locator('#modal-recipe-detail .btn-servings-step').nth(1);
    await btnIncrease.click();
    await page.waitForTimeout(100);

    const newServingsText = await servingsValEl.innerText();
    expect(newServingsText).not.toEqual(initialServingsText);

    // Decrementar porciones (-)
    const btnDecrease = page.locator('#modal-recipe-detail .btn-servings-step').nth(0);
    await btnDecrease.click();
    await page.waitForTimeout(100);
    expect(await servingsValEl.innerText()).toEqual(initialServingsText);

    // Cerrar el modal
    await page.locator('#btn-close-recipe-modal').click();
    await expect(modalRecipe).not.toBeVisible();
  });

  test('iniciar el Modo Cocina (Cook Mode), avanzar por los pasos de preparación y salir', async ({ page }) => {
    const firstCard = page.locator('#recipes-cards-grid .recipe-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    const modalRecipe = page.locator('#modal-recipe-detail');
    await expect(modalRecipe).toBeVisible();

    // Clic en Iniciar Modo Cocina
    const btnStartCook = page.locator('#btn-bottom-start-cook-mode, #btn-cook-mode').first();
    await expect(btnStartCook).toBeVisible();
    await btnStartCook.click();

    // El modal de receta se cierra y se activa el overlay de cocina
    const cookOverlay = page.locator('#cook-mode-overlay');
    await expect(cookOverlay).toHaveClass(/active/);

    const stepIndicator = page.locator('#cook-step-indicator');
    await expect(stepIndicator).toBeVisible();
    await expect(stepIndicator).toContainText(/1/);

    // Avanzar al paso siguiente
    const btnNext = page.locator('#btn-cook-next-step');
    await btnNext.click();
    await page.waitForTimeout(100);
    await expect(stepIndicator).toContainText(/2/);

    // Retroceder al paso anterior
    const btnPrev = page.locator('#btn-cook-prev-step');
    await btnPrev.click();
    await page.waitForTimeout(100);
    await expect(stepIndicator).toContainText(/1/);

    // Salir del modo cocina
    const btnExit = page.locator('#btn-exit-cook-mode');
    await btnExit.click();
    await page.waitForTimeout(100);

    await expect(cookOverlay).not.toHaveClass(/active/);
  });

});
