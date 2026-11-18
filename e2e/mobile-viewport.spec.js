import { test, expect } from '@playwright/test';

test.describe('Mobile Viewport & Layout Integrity (Zero-Overflow & Editorial Headers)', () => {

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
      expect(recipesBox.x).toBeLessThan(45);
    }

    // 2. Planificador
    await page.evaluate(() => window.app.switchView('view-planner'));
    await page.waitForSelector('#view-planner.active');
    const plannerTitle = page.locator('#view-planner .section-title');
    await expect(plannerTitle).toBeVisible();
    const plannerBox = await plannerTitle.boundingBox();
    expect(plannerBox).not.toBeNull();
    if (!isDesktop) {
      expect(plannerBox.x).toBeLessThan(45);
    }

    // 3. Compra
    await page.evaluate(() => window.app.switchView('view-shopping'));
    await page.waitForSelector('#view-shopping.active');
    const shoppingTitle = page.locator('#view-shopping .section-title');
    await expect(shoppingTitle).toBeVisible();
    const shoppingBox = await shoppingTitle.boundingBox();
    expect(shoppingBox).not.toBeNull();
    if (!isDesktop) {
      expect(shoppingBox.x).toBeLessThan(45);
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

  test('los modales principales se adaptan al ancho del viewport sin desbordarse ni truncar botones', async ({ page }) => {
    const viewportSize = page.viewportSize();
    expect(viewportSize).not.toBeNull();

    // 1. Abrir diálogo de confirmación genérico
    await page.evaluate(() => {
      window.app.showConfirmDialog({
        title: 'Prueba de Modal',
        message: 'Este es un mensaje largo para comprobar que el modal no desborda la pantalla en dispositivos estrechos.',
        confirmText: 'Aceptar prueba'
      });
    });

    const confirmModal = page.locator('#modal-confirm-dialog');
    await expect(confirmModal).toBeVisible();

    const cardBox = await page.locator('#modal-confirm-dialog .confirm-dialog-content').first().boundingBox();
    expect(cardBox).not.toBeNull();
    expect(cardBox.x).toBeGreaterThanOrEqual(0);
    expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(viewportSize.width + 5);

    // Cerrar modal
    await page.locator('#btn-confirm-dialog-cancel').click();
    await expect(confirmModal).not.toBeVisible();
  });

  test('adaptación dinámica de la navegación al redimensionar la ventana', async ({ page }) => {
    // Redimensionar a móvil estrecho (360px)
    await page.setViewportSize({ width: 360, height: 740 });
    await expect(page.locator('.bottom-nav')).toBeVisible();
    await expect(page.locator('.desktop-header-nav')).not.toBeVisible();

    // Redimensionar a escritorio amplio (1200px)
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.desktop-header-nav')).toBeVisible();
    await expect(page.locator('.bottom-nav')).not.toBeVisible();
  });

  test('ajustes y controles avanzados no se desbordan ni se solapan en móviles estrechos (320px y 360px)', async ({ page }) => {
    await page.evaluate(() => window.app.switchView('view-settings'));
    await page.waitForSelector('#view-settings.active');

    // Abrir el acordeón de configuración avanzada
    const accordion = page.locator('#settings-advanced-accordion');
    await expect(accordion).toBeVisible();
    const isOpen = await accordion.evaluate((el) => el.hasAttribute('open'));
    if (!isOpen) {
      await accordion.locator('summary').click();
    }

    for (const viewport of [{ width: 320, height: 700 }, { width: 360, height: 740 }]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(100);

      // 1. Verificar que los botones segmentados permanecen dentro de su contenedor
      for (const groupId of ['#theme-segmented-group', '#language-segmented-group']) {
        const group = page.locator(groupId);
        const groupBox = await group.boundingBox();
        expect(groupBox).not.toBeNull();

        const buttons = group.locator('.segmented-btn');
        const count = await buttons.count();
        expect(count).toBe(3);

        for (let i = 0; i < count; i++) {
          const btnBox = await buttons.nth(i).boundingBox();
          expect(btnBox).not.toBeNull();
          expect(btnBox.x).toBeGreaterThanOrEqual(groupBox.x - 1);
          expect(btnBox.x + btnBox.width).toBeLessThanOrEqual(groupBox.x + groupBox.width + 2);
        }
      }

      // 2. Verificar que los botones dentro de tarjetas avanzadas no se salen de su tarjeta
      for (const btnId of ['#btn-force-cache-update', '#btn-auto-tag-recipes', '#btn-reset-demo']) {
        const btn = page.locator(btnId);
        await btn.scrollIntoViewIfNeeded();
        await expect(btn).toBeVisible();
        const btnBox = await btn.boundingBox();
        const cardBox = await btn.locator('xpath=ancestor::div[contains(@class,"card")]').boundingBox();
        expect(btnBox).not.toBeNull();
        expect(cardBox).not.toBeNull();
        expect(btnBox.x).toBeGreaterThanOrEqual(cardBox.x - 1);
        expect(btnBox.x + btnBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 2);
      }

      // 3. Verificar que el switch de TTS es visible y no se solapa con el texto descriptivo
      const ttsSwitch = page.locator('#card-tts-settings .m3-switch');
      const ttsInfo = page.locator('#card-tts-settings .goals-switch-info');
      await expect(ttsSwitch).toBeVisible();
      const switchBox = await ttsSwitch.boundingBox();
      const infoBox = await ttsInfo.boundingBox();
      expect(switchBox).not.toBeNull();
      expect(infoBox).not.toBeNull();
      expect(infoBox.x + infoBox.width).toBeLessThanOrEqual(switchBox.x + 1);
    }
  });

});
