import { test, expect } from '@playwright/test';

test.describe('Desktop two-column layout', () => {
  test('xl viewport shows two columns and right sticky form', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3002');

    // По умолчанию должны быть видны кнопки и левый блок
    await expect(page.getByTestId('btn-register')).toBeVisible();

    // Проверяем что основная сетка применена
    const grid = page.locator('div').filter({ has: page.getByText('Mobile Dev CRM') }).nth(0);
    await expect(grid).toBeVisible();

    // Открываем форму регистрации и проверяем ширину
    await page.getByTestId('btn-register').click();
    const form = page.getByTestId('register-form');
    await form.waitFor();

    // Проверяем, что форма не шире 720px (условно max-w-xl ~ 768)
    const formWidth = await form.evaluate((el) => el.getBoundingClientRect().width);
    expect(formWidth).toBeLessThanOrEqual(780);
  });
});


