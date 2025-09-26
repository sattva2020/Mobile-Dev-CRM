import { test as base } from '@playwright/test';
import { Page } from '@playwright/test';

/**
 * 🔐 Authentication Fixtures for CRM Tests
 * Фикстуры аутентификации для тестов CRM системы
 */

type AuthFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
  userPage: Page;
  guestPage: Page;
};

export const test = base.extend<AuthFixtures>({
  /**
   * Аутентифицированная страница (обычный пользователь)
   */
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('user');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/dashboard');
    await expect(page.getByText('Welcome')).toBeVisible();
    await use(page);
  },

  /**
   * Админская страница
   */
  adminPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/admin');
    await expect(page.getByText('Admin Dashboard')).toBeVisible();
    await use(page);
  },

  /**
   * Пользовательская страница
   */
  userPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('testpass');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/dashboard');
    await expect(page.getByText('User Dashboard')).toBeVisible();
    await use(page);
  },

  /**
   * Гостевая страница (без аутентификации)
   */
  guestPage: async ({ page }, use) => {
    await page.goto('/');
    await use(page);
  },
});

export { expect } from '@playwright/test';
