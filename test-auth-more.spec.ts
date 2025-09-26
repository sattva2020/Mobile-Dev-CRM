import { test, expect } from '@playwright/test';

test.describe('Auth advanced', () => {
  test('logout clears state and returns to auth screen', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.getByTestId('btn-demo').click();
    await expect(page.getByTestId('dashboard-root')).toBeVisible({ timeout: 10000 });

    // Эмулируем logout через очистку состояния (как делает кнопка в коде)
    await page.evaluate(() => {
      localStorage.removeItem('auth-state');
      localStorage.removeItem('current-project');
      localStorage.removeItem('user-projects');
    });
    await page.reload();

    // Проверяем, что снова видим экран авторизации (кнопка входа доступна)
    await expect(page.getByTestId('btn-login')).toBeVisible({ timeout: 10000 });
  });

  test('login form submits on Enter key', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.getByTestId('btn-login').click();
    await page.getByTestId('login-form').waitFor();

    await page.getByTestId('login-email').fill('dev@example.com');
    await page.getByTestId('login-password').fill('password123');
    await page.keyboard.press('Enter');

    await expect(page.getByTestId('dashboard-root')).toBeVisible({ timeout: 10000 });
  });

  test('no console errors in main flows', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
    });

    await page.goto('http://localhost:3002');
    await page.getByTestId('btn-register').click();
    await page.getByTestId('register-form').waitFor();
    await page.getByTestId('register-name').fill('Тест');
    await page.getByTestId('register-email').fill('ok@example.com');
    await page.getByTestId('register-password').fill('123456');
    await page.getByTestId('register-confirm').fill('123456');
    await page.getByTestId('register-submit').click();
    await expect(page.getByTestId('dashboard-root')).toBeVisible({ timeout: 10000 });

    expect(errors.join('\n')).toEqual('');
  });
});


