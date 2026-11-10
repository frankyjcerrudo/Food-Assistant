import { test, expect } from '@playwright/test';

test.describe('Settings, Internationalization (i18n), Themes & Onboarding', () => {

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
    await page.evaluate(() => window.app.switchView('view-settings'));
    await page.waitForSelector('#view-settings.active');
  });

  test('cambio de tema (oscuro / claro / sistema) actualiza los atributos data-theme del DOM', async ({ page }) => {
    const btnDark = page.locator('#theme-segmented-group .segmented-btn[data-theme-val="dark"]');
    const btnLight = page.locator('#theme-segmented-group .segmented-btn[data-theme-val="light"]');

    // Cambiar a Tema Oscuro
    await btnDark.click();
    await page.waitForTimeout(100);
    const htmlThemeDark = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(htmlThemeDark).toBe('dark');

    // Cambiar a Tema Claro
    await btnLight.click();
    await page.waitForTimeout(100);
    const htmlThemeLight = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(htmlThemeLight).toBe('light');

    // Recargar la página y verificar persistencia
    await page.reload();
    await page.waitForFunction(() => typeof window.app?.switchView === 'function');
    const postReloadTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(postReloadTheme).toBe('light');
  });

  test('cambio de idioma (Español / Inglés) actualiza dinámicamente los textos del DOM y la navegación', async ({ page }) => {
    const btnEn = page.locator('#language-segmented-group .segmented-btn[data-lang-val="en"]');
    const btnEs = page.locator('#language-segmented-group .segmented-btn[data-lang-val="es"]');

    // 1. Cambiar a Inglés
    await btnEn.click();
    await page.waitForTimeout(150);

    const htmlLangEn = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(htmlLangEn).toBe('en');

    const titleEn = page.locator('#view-settings .section-title');
    await expect(titleEn).toHaveText('Settings');

    // 2. Cambiar de vuelta a Español
    await btnEs.click();
    await page.waitForTimeout(150);

    const htmlLangEs = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(htmlLangEs).toBe('es');

    const titleEs = page.locator('#view-settings .section-title');
    await expect(titleEs).toHaveText('Ajustes');
  });

  test('re-lanzar el asistente de bienvenida (onboarding) y cerrarlo con skip', async ({ page }) => {
    const btnRelaunch = page.locator('#btn-relaunch-onboarding');
    await expect(btnRelaunch).toBeVisible();
    await btnRelaunch.click();

    const modalOnboarding = page.locator('#modal-onboarding');
    await expect(modalOnboarding).toBeVisible();

    // Omitir onboarding
    const btnSkip = page.locator('#btn-onboarding-skip');
    await expect(btnSkip).toBeVisible();
    await btnSkip.click();
    await page.waitForTimeout(150);

    await expect(modalOnboarding).not.toBeVisible();
  });

});
