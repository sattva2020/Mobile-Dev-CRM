import { test, expect } from '@playwright/test';

test.describe('Mobile layout sanity', () => {
  test('auth screen is readable on 375x667', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3002');

    await expect(page.getByTestId('btn-login')).toBeVisible();
    await expect(page.getByTestId('btn-register')).toBeVisible();

    // Нажимаем регистрацию и проверяем, что поля не выходят за экран
    await page.getByTestId('btn-register').click();
    const form = page.getByTestId('register-form');
    await form.waitFor();

    const formBox = await form.evaluate((el) => el.getBoundingClientRect());
    expect(formBox.width).toBeLessThanOrEqual(375);
  });
});


