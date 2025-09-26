import { test, expect } from '@playwright/test';

test.describe('Visual regression (baseline)', () => {
  test('Auth screen', async ({ page }) => {
    await page.goto('http://localhost:3002');
    // прячем плавающие/пульсирующие элементы через CSS
    await page.addStyleTag({ content: '.animate-float, .animate-pulse { animation: none !important; }' });
    await expect(page).toHaveScreenshot('auth-screen.png', { fullPage: true });
  });

  test('Dashboard after demo', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.getByTestId('btn-demo').click();
    await expect(page.locator('[data-testid="dashboard-root"]')).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveScreenshot('dashboard.png', { fullPage: true });
  });
});


