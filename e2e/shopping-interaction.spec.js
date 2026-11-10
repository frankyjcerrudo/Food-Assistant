import { test, expect } from '@playwright/test';

test.describe('Shopping List End-to-End User Flow & Concurrency', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fa_onboarding_completed', 'true');
      // No sobreescribir fa_shopping durante reloads si ya fue modificado en la prueba
      if (sessionStorage.getItem('__test_initialized') !== 'true') {
        localStorage.setItem('fa_shopping', '[]');
        localStorage.setItem('fa_tombstones', '{}');
        localStorage.setItem('fa_deleted_records', '{"recipes":[],"mealPlans":[],"shoppingItems":[]}');
        sessionStorage.setItem('__test_initialized', 'true');
      }
    });
    await page.goto('/');
    await page.waitForFunction(() => typeof window.app?.switchView === 'function');
  });

  test('tachar múltiples artículos rápidamente y limpiarlos con popup único sin resurrecciones', async ({ page }) => {
    // 1. Ir a la pestaña de compra
    await page.evaluate(() => window.app.switchView('view-shopping'));
    await page.waitForSelector('#view-shopping.active');

    const input = page.locator('#input-quick-grocery');
    const addBtn = page.locator('#btn-add-grocery');

    // 2. Añadir 3 artículos de prueba
    await input.fill('1 kg Manzanas');
    await addBtn.click();
    await input.fill('2 l Leche entera');
    await addBtn.click();
    await input.fill('Barra de Pan');
    await addBtn.click();

    // Comprobar que los 3 artículos aparecen en la lista activa
    const activeItems = page.locator('#shopping-aisles-container .grocery-item-row');
    await expect(activeItems).toHaveCount(3);

    // 3. Tachar los dos primeros artículos haciendo clic en sus casillas
    const checkTargets = page.locator('#shopping-aisles-container .grocery-left');
    await checkTargets.nth(0).click();
    await page.waitForTimeout(100);
    // Tras el primer check, ahora el primer elemento restante pasa a ser el índice 0 de la lista activa
    await page.locator('#shopping-aisles-container .grocery-left').nth(0).click();
    await page.waitForTimeout(200);

    // Deben haberse movido a la sección de completados
    const completedSection = page.locator('#shopping-completed-section');
    await expect(completedSection).toBeVisible();
    const completedItems = page.locator('#shopping-completed-section .grocery-item-row');
    await expect(completedItems).toHaveCount(2);

    // 4. Hacer clic en "Limpiar completados"
    const clearBtn = page.locator('.btn-clear-completed-section');
    await clearBtn.click();

    // 5. Verificar que se abre EXACTAMENTE UN diálogo de confirmación
    const confirmDialog = page.locator('#modal-confirm-dialog');
    await expect(confirmDialog).toBeVisible();

    const title = page.locator('#confirm-dialog-title');
    const acceptBtn = page.locator('#btn-confirm-dialog-accept');

    await expect(title).toHaveText('Limpiar comprados');
    await expect(acceptBtn).toHaveText('Eliminar comprados');

    // Esperar 300ms para verificar que NO se muta a "Confirmar acción" ni aparece un segundo popup
    await page.waitForTimeout(300);
    await expect(title).toHaveText('Limpiar comprados');
    await expect(acceptBtn).toHaveText('Eliminar comprados');

    // 6. Confirmar la eliminación
    await acceptBtn.click();
    await page.waitForTimeout(200);

    // El diálogo debe cerrarse
    await expect(confirmDialog).not.toBeVisible();

    // La sección de completados debe haber desaparecido
    await expect(page.locator('#shopping-completed-section')).not.toBeVisible();

    // Solo debe quedar 1 artículo pendiente (Barra de Pan)
    const remainingItems = page.locator('#shopping-aisles-container .grocery-item-row');
    await expect(remainingItems).toHaveCount(1);
    await expect(remainingItems.first()).toContainText('Pan');

    // 7. Simular recarga de página para verificar que los eliminados NO resucitan y el pendiente se conserva
    await page.reload();
    await page.waitForFunction(() => typeof window.app?.switchView === 'function');
    await page.evaluate(() => window.app.switchView('view-shopping'));
    await page.waitForSelector('#view-shopping.active');

    // Sigue habiendo solo 1 artículo pendiente y 0 completados
    const postReloadPending = page.locator('#shopping-aisles-container .grocery-item-row');
    await expect(postReloadPending).toHaveCount(1);
    await expect(postReloadPending.first()).toContainText('Pan');
    await expect(page.locator('#shopping-completed-section')).not.toBeVisible();
  });

});
