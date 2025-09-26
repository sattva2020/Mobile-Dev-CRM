import { test, expect } from '@playwright/test';

test.describe('Navigation tabs after auth', () => {
  test('should switch tabs and render sections', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.getByTestId('btn-demo').click();
    await expect(page.getByTestId('dashboard-root')).toBeVisible({ timeout: 10000 });

    const sections: { label: string; content: RegExp }[] = [
      { label: 'Проекты', content: /Проекты/i },
      { label: 'Требования', content: /Требования/i },
      { label: 'Архитектура', content: /Архитектура проекта/i },
      { label: 'Канбан', content: /Канбан доски/i },
      { label: 'GitHub', content: /GitHub интеграция/i },
      { label: 'Настройки', content: /Настройки/i }
    ];

    for (const s of sections) {
      const btn = page.getByRole('button', { name: s.label }).first();
      await btn.click();
      // Проверяем, что основной контент содержит характерный текст раздела
      await expect(page.locator('main')).toContainText(s.content, { timeout: 5000 });
    }
  });
});


