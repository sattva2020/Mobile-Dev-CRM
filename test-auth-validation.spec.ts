import { test, expect } from '@playwright/test';

test.describe('Auth validation', () => {
  test('should show error when passwords do not match', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.getByTestId('btn-register').click();
    await page.getByTestId('register-form').waitFor();

    await page.getByTestId('register-name').fill('Тест');
    await page.getByTestId('register-email').fill('test@example.com');
    await page.getByTestId('register-password').fill('123456');
    await page.getByTestId('register-confirm').fill('654321');
    await page.getByTestId('register-submit').click();

    // Ожидаем сообщение об ошибке
    await expect(page.getByText('Пароли не совпадают', { exact: false })).toBeVisible();
  });

  test('should show error when password is too short', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.getByTestId('btn-register').click();
    await page.getByTestId('register-form').waitFor();

    await page.getByTestId('register-name').fill('Тест');
    await page.getByTestId('register-email').fill('test2@example.com');
    await page.getByTestId('register-password').fill('123');
    await page.getByTestId('register-confirm').fill('123');
    await page.getByTestId('register-submit').click();

    await expect(page.getByText('Пароль должен содержать минимум 6 символов', { exact: false })).toBeVisible();
  });
});


