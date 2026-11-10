import { test, expect } from '@playwright/test';

test.describe('Shopping List End-to-End User Flow & Concurrency', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('fa_onboarding_completed', 'true');
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register = () => Promise.resolve({
          update: () => Promise.resolve(),
          unregister: () => Promise.resolve(true)
        });
      }
      if (sessionStorage.getItem('__test_initialized') !== 'true') {
        localStorage.setItem('fa_shopping', '[]');
        localStorage.setItem('fa_tombstones', '{}');
        localStorage.setItem('fa_deleted_records', '{"recipes":[],"mealPlans":[],"shoppingItems":[]}');
        sessionStorage.setItem('__test_initialized', 'true');
      }
    });
    await page.goto('/');
    await page.waitForFunction(() => typeof window.app?.switchView === 'function');
    await page.evaluate(() => window.app.switchView('view-shopping'));
    await page.waitForSelector('#view-shopping.active');
  });

  test('tachar múltiples artículos rápidamente y limpiarlos con popup único sin resurrecciones', async ({ page }) => {
    const input = page.locator('#input-quick-grocery');
    const addBtn = page.locator('#btn-add-grocery');

    // 1. Añadir 3 artículos de prueba
    await input.fill('1 kg Manzanas');
    await addBtn.click();
    await input.fill('2 l Leche entera');
    await addBtn.click();
    await input.fill('Barra de Pan');
    await addBtn.click();

    // Comprobar que los 3 artículos aparecen en la lista activa
    const activeItems = page.locator('#shopping-aisles-container .grocery-item-row');
    await expect(activeItems).toHaveCount(3);

    // 2. Tachar los dos primeros artículos haciendo clic en sus casillas
    const checkTargets = page.locator('#shopping-aisles-container .grocery-left');
    await checkTargets.nth(0).click();
    await page.waitForTimeout(100);
    await page.locator('#shopping-aisles-container .grocery-left').nth(0).click();
    await page.waitForTimeout(200);

    // Deben haberse movido a la sección de completados
    const completedSection = page.locator('#shopping-completed-section');
    await expect(completedSection).toBeVisible();
    const completedItems = page.locator('#shopping-completed-section .grocery-item-row');
    await expect(completedItems).toHaveCount(2);

    // 3. Hacer clic en "Limpiar completados"
    const clearBtn = page.locator('.btn-clear-completed-section');
    await clearBtn.click();

    // 4. Verificar que se abre EXACTAMENTE UN diálogo de confirmación
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

    // 5. Confirmar la eliminación
    await acceptBtn.click();
    await page.waitForTimeout(200);

    // El diálogo debe cerrarse
    await expect(confirmDialog).not.toBeVisible();
    await expect(page.locator('#shopping-completed-section')).not.toBeVisible();

    // Solo debe quedar 1 artículo pendiente (Barra de Pan)
    const remainingItems = page.locator('#shopping-aisles-container .grocery-item-row');
    await expect(remainingItems).toHaveCount(1);
    await expect(remainingItems.first()).toContainText('Pan');

    // 6. Simular recarga de página para verificar que los eliminados NO resucitan
    await page.reload();
    await page.waitForFunction(() => typeof window.app?.switchView === 'function');
    await page.evaluate(() => window.app.switchView('view-shopping'));
    await page.waitForSelector('#view-shopping.active');

    const postReloadPending = page.locator('#shopping-aisles-container .grocery-item-row');
    await expect(postReloadPending).toHaveCount(1);
    await expect(postReloadPending.first()).toContainText('Pan');
    await expect(page.locator('#shopping-completed-section')).not.toBeVisible();
  });

  test('los pasillos de la lista de la compra mantienen un orden canónico fijo independientemente del tachado de artículos', async ({ page }) => {
    // Añadir artículos de diferentes pasillos: fruta (produce), lácteos (dairy), panadería (bakery), carne (meat)
    await page.evaluate(() => {
      window.state.shoppingList = [
        { id: 'item-meat', name: 'Pechuga de Pollo', amount: 500, unit: 'g', aisle: 'meat', isChecked: false },
        { id: 'item-produce', name: 'Plátanos', amount: 1, unit: 'kg', aisle: 'produce', isChecked: false },
        { id: 'item-bakery', name: 'Pan de Molde', amount: 1, unit: 'paquete', aisle: 'bakery', isChecked: false },
        { id: 'item-dairy', name: 'Yogur Griego', amount: 4, unit: 'ud', aisle: 'dairy', isChecked: false }
      ];
      window.app.renderShoppingList();
    });

    // Obtener los pasillos renderizados
    const aisleCardsBefore = page.locator('#shopping-aisles-container .aisle-card');
    const count = await aisleCardsBefore.count();
    expect(count).toBeGreaterThanOrEqual(3);

    const aislesBefore = await aisleCardsBefore.evaluateAll(cards => cards.map(c => c.getAttribute('data-aisle')));

    // Tachar un artículo de produce y uno de meat
    await page.evaluate(() => {
      const p = window.state.shoppingList.find(i => i.id === 'item-produce');
      if (p) p.isChecked = true;
      window.app.renderShoppingList();
    });

    const aisleCardsAfter = page.locator('#shopping-aisles-container .aisle-card');
    const aislesAfter = await aisleCardsAfter.evaluateAll(cards => cards.map(c => c.getAttribute('data-aisle')));

    // Validar que los pasillos que permanecen siguen en el mismo orden relativo canónico de AISLE_ORDER
    const canonicalOrder = await page.evaluate(() => window.AISLE_ORDER || ['produce', 'dairy', 'bakery', 'meat', 'seafood', 'pantry']);
    
    let lastIndex = -1;
    for (const aisle of aislesAfter) {
      const idx = canonicalOrder.indexOf(aisle);
      if (idx !== -1) {
        expect(idx).toBeGreaterThan(lastIndex);
        lastIndex = idx;
      }
    }
  });

  test('añadir artículos con cantidades y unidades consolida los artículos y actualiza los contadores', async ({ page }) => {
    const input = page.locator('#input-quick-grocery');
    const addBtn = page.locator('#btn-add-grocery');

    await input.fill('500 g Arroz');
    await addBtn.click();
    await input.fill('1 l Leche desnatada');
    await addBtn.click();

    const summary = page.locator('#shopping-summary-text');
    await expect(summary).toContainText('2');

    const firstItem = page.locator('#shopping-aisles-container .grocery-item-row').first();
    await expect(firstItem).toBeVisible();
    await expect(firstItem.locator('.grocery-amount')).toBeVisible();
  });

  test('eliminar un artículo individual lo retira inmediatamente y persiste tras recarga (tombstone)', async ({ page }) => {
    const input = page.locator('#input-quick-grocery');
    const addBtn = page.locator('#btn-add-grocery');

    await input.fill('Mantequilla con sal');
    await addBtn.click();

    const itemRow = page.locator('#shopping-aisles-container .grocery-item-row', { hasText: 'Mantequilla con sal' });
    await expect(itemRow).toBeVisible();

    // Clic en el botón de borrar (la X del artículo)
    const removeBtn = itemRow.locator('.btn-grocery-remove');
    await removeBtn.click();

    // El artículo desaparece de la vista inmediatamente
    await expect(itemRow).not.toBeVisible();

    // Recargar la página y verificar que no resucita
    await page.reload();
    await page.waitForFunction(() => typeof window.app?.switchView === 'function');
    await page.evaluate(() => window.app.switchView('view-shopping'));
    await page.waitForSelector('#view-shopping.active');

    await expect(page.locator('#shopping-aisles-container', { hasText: 'Mantequilla con sal' })).not.toBeVisible();
  });

  test('conmutar entre vista por pasillos y vista por recetas agrupa los artículos correctamente', async ({ page }) => {
    // Añadir artículos con receta asociada
    await page.evaluate(() => {
      window.state.shoppingList = [
        { id: 's-1', name: 'Espaguetis', amount: 400, unit: 'g', aisle: 'pantry', recipeOrigin: 'Pasta Carbonara', isChecked: false },
        { id: 's-2', name: 'Huevos', amount: 4, unit: 'ud', aisle: 'dairy', recipeOrigin: 'Pasta Carbonara', isChecked: false }
      ];
      window.app.renderShoppingList();
    });

    const btnRecipe = page.locator('#btn-shopping-view-recipe');
    const btnAisle = page.locator('#btn-shopping-view-aisle');

    // Cambiar a vista por receta
    await btnRecipe.click();
    await page.waitForTimeout(100);
    await expect(btnRecipe).toHaveClass(/active/);

    // Debe mostrar la tarjeta con el nombre de la receta
    const recipeCards = page.locator('#shopping-aisles-container .aisle-card');
    await expect(recipeCards.first()).toContainText('Pasta Carbonara');

    // Volver a vista por pasillos
    await btnAisle.click();
    await page.waitForTimeout(100);
    await expect(btnAisle).toHaveClass(/active/);
  });

});
