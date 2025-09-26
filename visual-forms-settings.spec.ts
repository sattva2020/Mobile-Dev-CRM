import { test, expect } from '@playwright/test';

test.describe('Visual regression (forms & settings)', () => {
  test('Login form', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.addStyleTag({ content: '.animate-float, .animate-pulse { animation: none !important; }' });
    await page.getByTestId('btn-login').click();
    await page.getByTestId('login-form').waitFor();
    await expect(page).toHaveScreenshot('login-form.png', { fullPage: true });
  });

  test('Register form', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.addStyleTag({ content: '.animate-float, .animate-pulse { animation: none !important; }' });
    await page.getByTestId('btn-register').click();
    await page.getByTestId('register-form').waitFor();
    await expect(page).toHaveScreenshot('register-form.png', { fullPage: true });
  });

  test('Settings page (after demo login)', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.getByTestId('btn-demo').click();
    await expect(page.getByTestId('dashboard-root')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Настройки' }).first().click();
    await expect(page.locator('main')).toContainText(/Настройки/i);
    await expect(page).toHaveScreenshot('settings.png', { fullPage: true });
  });
});


