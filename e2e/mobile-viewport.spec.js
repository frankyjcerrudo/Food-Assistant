import { test, expect } from '@playwright/test';

test.describe('Mobile Viewport & Layout Integrity (Zero-Overflow & Editorial Headers)', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fa_onboarding_completed', 'true');
    });
    await page.goto('/');
    await page.waitForFunction(() => typeof window.app?.switchView === 'function');
  });

  test('no debe tener desbordamiento horizontal (horizontal scroll) en ninguna pestaña', async ({ page }) => {
    await expect(page.locator('#view-today')).toBeVisible();

    const viewIds = ['view-today', 'view-recipes', 'view-planner', 'view-shopping', 'view-settings'];

    for (const viewId of viewIds) {
      await page.evaluate((v) => window.app.switchView(v), viewId);
      await page.waitForSelector(`#${viewId}.active`);
      await page.waitForTimeout(100);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(doc ? doc.scrollWidth : 0, body ? body.scrollWidth : 0);
        const clientWidth = doc ? doc.clientWidth : window.innerWidth;
        return {
          scrollWidth,
          clientWidth,
          hasOverflow: scrollWidth > clientWidth + 2
        };
      });

      expect(overflow.hasOverflow, `Vista #${viewId} tiene desbordamiento horizontal (${overflow.scrollWidth}px > ${overflow.clientWidth}px)`).toBe(false);
    }
  });

  test('los títulos de las pestañas principales se encuentran alineados al margen izquierdo', async ({ page }) => {
    const isDesktop = (page.viewportSize()?.width || 0) >= 900;

    // 1. Recetas
    await page.evaluate(() => window.app.switchView('view-recipes'));
    await page.waitForSelector('#view-recipes.active');
    const recipesTitle = page.locator('#view-recipes .section-title');
    await expect(recipesTitle).toBeVisible();
    const recipesBox = await recipesTitle.boundingBox();
    expect(recipesBox).not.toBeNull();
    if (!isDesktop) {
      expect(recipesBox.x).toBeLessThan(40);
    }

    // 2. Planificador
    await page.evaluate(() => window.app.switchView('view-planner'));
    await page.waitForSelector('#view-planner.active');
    const plannerTitle = page.locator('#view-planner .section-title');
    await expect(plannerTitle).toBeVisible();
    const plannerBox = await plannerTitle.boundingBox();
    expect(plannerBox).not.toBeNull();
    if (!isDesktop) {
      expect(plannerBox.x).toBeLessThan(40);
    }

    // 3. Compra
    await page.evaluate(() => window.app.switchView('view-shopping'));
    await page.waitForSelector('#view-shopping.active');
    const shoppingTitle = page.locator('#view-shopping .section-title');
    await expect(shoppingTitle).toBeVisible();
    const shoppingBox = await shoppingTitle.boundingBox();
    expect(shoppingBox).not.toBeNull();
    if (!isDesktop) {
      expect(shoppingBox.x).toBeLessThan(40);
    }
  });

  test('el dock de navegación permanece visible y accesible', async ({ page }) => {
    const isDesktop = (page.viewportSize()?.width || 0) >= 900;
    const viewportSize = page.viewportSize();
    expect(viewportSize).not.toBeNull();

    if (isDesktop) {
      const desktopNav = page.locator('.desktop-header-nav');
      await expect(desktopNav).toBeVisible();
    } else {
      const bottomNav = page.locator('.bottom-nav');
      await expect(bottomNav).toBeVisible();

      const navBox = await bottomNav.boundingBox();
      expect(navBox).not.toBeNull();
      expect(navBox.y + navBox.height).toBeLessThanOrEqual(viewportSize.height + 2);
      expect(navBox.y).toBeGreaterThan(viewportSize.height - 120);
    }
  });

});
