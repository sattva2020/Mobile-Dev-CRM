import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function checkA11y(page: any, name: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('#webpack-dev-server-client-overlay') // Исключаем overlay из проверок
    .analyze();
  expect(results.violations, `${name} a11y violations`).toEqual([]);
}

test.describe('A11y: forms & settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.evaluate(() => localStorage.clear());
    await page.waitForLoadState('networkidle');
    // Полностью скрываем webpack dev-server overlay
    await page.evaluate(() => {
      const overlay = document.getElementById('webpack-dev-server-client-overlay');
      if (overlay) {
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
        overlay.style.pointerEvents = 'none';
      }
    });
    // Исключаем overlay из a11y проверок
    await page.addStyleTag({
      content: `
        #webpack-dev-server-client-overlay { display: none !important; visibility: hidden !important; }
        #webpack-dev-server-client-overlay * { display: none !important; visibility: hidden !important; }
      `
    });
  });

  test('Login form', async ({ page }) => {
    await page.getByTestId('btn-login').click({ force: true });
    await page.waitForTimeout(1000); // Даём время на изменение состояния
    await page.getByTestId('login-form').waitFor();
    await checkA11y(page, 'login');
  });

  test('Register form', async ({ page }) => {
    await page.getByTestId('btn-register').click({ force: true });
    await page.waitForTimeout(1000); // Даём время на изменение состояния
    await page.getByTestId('register-form').waitFor();
    await checkA11y(page, 'register');
  });

  test('Settings page', async ({ page }) => {
    await page.getByTestId('btn-demo').click({ force: true });
    await expect(page.locator('[data-testid="dashboard-root"]')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Настройки' }).first().click({ force: true });
    await expect(page.locator('main')).toContainText(/Настройки/i);
    await checkA11y(page, 'settings');
  });
});


