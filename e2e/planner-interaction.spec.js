import { test, expect } from '@playwright/test';

test.describe('Weekly Planner End-to-End User Flow & Concurrency', () => {

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
    await page.evaluate(() => window.app.switchView('view-planner'));
    await page.waitForSelector('#view-planner.active');
  });

  test('navegación semanal (anterior, siguiente, esta semana) actualiza el rango de fechas', async ({ page }) => {
    const rangeText = page.locator('#planner-week-range-text');
    await expect(rangeText).toBeVisible();
    const initialText = await rangeText.innerText();

    // 1. Navegar a la semana siguiente
    const btnNext = page.locator('#btn-next-week');
    await btnNext.click();
    await page.waitForTimeout(100);
    const nextText = await rangeText.innerText();
    expect(nextText).not.toEqual(initialText);

    // 2. Navegar a la semana anterior
    const btnPrev = page.locator('#btn-prev-week');
    await btnPrev.click();
    await page.waitForTimeout(100);
    const prevText = await rangeText.innerText();
    expect(prevText).toEqual(initialText);

    // 3. Botón "Esta semana"
    await btnNext.click();
    await page.locator('#btn-current-week').click();
    await page.waitForTimeout(100);
    expect(await rangeText.innerText()).toEqual(initialText);
  });

  test('asignar una receta a un hueco de comida desde el modal selector', async ({ page }) => {
    // Expandir todos los días para asegurar que los huecos son visibles
    await page.locator('#btn-toggle-all-planner-days').click();
    await page.waitForTimeout(150);

    // Buscar un hueco de comida vacío
    const emptySlot = page.locator('#planner-days-container .meal-slot:not(.has-meal)').first();
    await expect(emptySlot).toBeVisible();
    const dateStr = await emptySlot.getAttribute('data-date');
    const slotKey = await emptySlot.getAttribute('data-slot');

    await emptySlot.click();

    // El modal de selección de receta debe abrirse
    const pickerModal = page.locator('#modal-recipe-picker');
    await expect(pickerModal).toBeVisible();

    // Seleccionar la primera receta disponible
    const firstOption = page.locator('#picker-recipes-list .picker-recipe-row').first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    // El modal debe cerrarse y el hueco específico ahora debe tener una receta
    await expect(pickerModal).not.toBeVisible();
    const targetSlot = page.locator(`.meal-slot[data-date="${dateStr}"][data-slot="${slotKey}"]`);
    await expect(targetSlot).toHaveClass(/has-meal/);
    await expect(targetSlot.locator('.slot-recipe-name')).toBeVisible();
  });

  test('quitar una receta de un hueco mediante el botón de limpieza de slot', async ({ page }) => {
    // Asegurar que hay una receta en el primer día
    const dateInfo = await page.evaluate(() => {
      const dates = window.app.getPlannerWeekDates();
      const firstDate = dates[0].dateKey;
      const firstRecipe = window.state.recipes[0];
      if (firstRecipe) {
        const dayPlan = window.state.getDayPlan(firstDate);
        dayPlan.lunch = firstRecipe.id;
        window.app.renderPlanner();
      }
      return { firstDate };
    });

    // Expandir días
    await page.locator('#btn-toggle-all-planner-days').click();
    await page.waitForTimeout(150);

    const targetSlot = page.locator(`.meal-slot[data-date="${dateInfo.firstDate}"][data-slot="lunch"]`);
    await expect(targetSlot).toHaveClass(/has-meal/);

    // Hacer clic en el botón de quitar receta (.btn-slot-clear)
    const clearBtn = targetSlot.locator('.btn-slot-clear');
    await clearBtn.click();
    await page.waitForTimeout(150);

    // El hueco específico debe volver al estado vacío (sin .has-meal)
    await expect(targetSlot).not.toHaveClass(/has-meal/);
  });

  test('intercambiar recetas entre diferentes días y huecos (moveOrSwapPlannerSlot) mantiene la integridad y persiste', async ({ page }) => {
    // Configurar 2 días con 2 recetas distintas
    const info = await page.evaluate(() => {
      const dates = window.app.getPlannerWeekDates();
      const d1 = dates[0].dateKey;
      const d2 = dates[1].dateKey;
      const r1 = window.state.recipes[0];
      const r2 = window.state.recipes[1];

      const p1 = window.state.getDayPlan(d1);
      const p2 = window.state.getDayPlan(d2);
      p1.lunch = r1.id;
      p2.lunch = r2.id;
      window.app.renderPlanner();

      return { d1, d2, r1Title: r1.title, r2Title: r2.title, r1Id: r1.id, r2Id: r2.id };
    });

    // Realizar swap entre d1 (lunch) y d2 (lunch)
    const swapResult = await page.evaluate(({ d1, d2 }) => {
      return window.app.moveOrSwapPlannerSlot(d1, 'lunch', false, d2, 'lunch', false);
    }, info);

    expect(swapResult).not.toBe(false);

    // Validar que en el DOM se han intercambiado
    const slotD1 = page.locator(`.meal-slot[data-date="${info.d1}"][data-slot="lunch"] .slot-recipe-name`);
    const slotD2 = page.locator(`.meal-slot[data-date="${info.d2}"][data-slot="lunch"] .slot-recipe-name`);

    await expect(slotD1).toHaveText(info.r2Title);
    await expect(slotD2).toHaveText(info.r1Title);

    // Recargar y verificar que el swap persiste
    await page.reload();
    await page.waitForFunction(() => typeof window.app?.switchView === 'function');
    await page.evaluate(() => window.app.switchView('view-planner'));
    await page.waitForSelector('#view-planner.active');

    const postReloadD1 = page.locator(`.meal-slot[data-date="${info.d1}"][data-slot="lunch"] .slot-recipe-name`);
    const postReloadD2 = page.locator(`.meal-slot[data-date="${info.d2}"][data-slot="lunch"] .slot-recipe-name`);

    await expect(postReloadD1).toHaveText(info.r2Title);
    await expect(postReloadD2).toHaveText(info.r1Title);
  });

  test('enviar a la compra desde el planificador semanal agrega los ingredientes de las recetas al carrito', async ({ page }) => {
    // Asignar una receta con ingredientes a un día de la semana
    await page.evaluate(() => {
      window.state.shoppingList = [];
      const dates = window.app.getPlannerWeekDates();
      const d1 = dates[0].dateKey;
      const r1 = window.state.recipes[0];
      const p1 = window.state.getDayPlan(d1);
      p1.lunch = r1.id;
      window.app.renderPlanner();
    });

    // Clic en "Enviar a la Compra"
    const sendBtn = page.locator('#btn-send-plan-to-shopping');
    await sendBtn.click();

    // Modal de previsualización debe aparecer
    const previewModal = page.locator('#modal-shopping-preview');
    await expect(previewModal).toBeVisible();

    // Confirmar añadir
    const confirmAdd = page.locator('#btn-confirm-add-shopping');
    await confirmAdd.click();
    await page.waitForTimeout(200);

    // El modal se cierra
    await expect(previewModal).not.toBeVisible();

    // Navegar a la lista de la compra y comprobar que los artículos existen
    await page.evaluate(() => window.app.switchView('view-shopping'));
    await page.waitForSelector('#view-shopping.active');

    const activeGroceries = page.locator('#shopping-aisles-container .grocery-item-row');
    const count = await activeGroceries.count();
    expect(count).toBeGreaterThan(0);
  });

});
