import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function runA11y(page: any, name: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations, `${name} a11y violations`).toEqual([]);
}

test.describe('Accessibility (axe)', () => {
  test('Auth page', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await runA11y(page, 'Auth');
  });

  test('Dashboard (demo)', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.getByTestId('btn-demo').click();
    await expect(page.locator('[data-testid="dashboard-root"]')).toBeVisible({ timeout: 10000 });
    await runA11y(page, 'Dashboard');
  });
});


