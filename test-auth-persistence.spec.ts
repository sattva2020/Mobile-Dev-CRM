import { test, expect } from '@playwright/test';

test.describe('Auth persistence', () => {
  test('should persist auth-state after reload', async ({ page, context }) => {
    await page.goto('http://localhost:3002');
    await page.getByTestId('btn-demo').click();
    await expect(page.getByTestId('dashboard-root')).toBeVisible({ timeout: 10000 });

    // Проверяем localStorage
    const before = await page.evaluate(() => localStorage.getItem('auth-state'));
    expect(before).toBeTruthy();

    // Релоад
    await page.reload();
    await expect(page.getByTestId('dashboard-root')).toBeVisible({ timeout: 10000 });

    const after = await page.evaluate(() => localStorage.getItem('auth-state'));
    expect(after).toBeTruthy();
  });
});


