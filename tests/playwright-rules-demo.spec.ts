import { test, expect } from '@playwright/test';

/**
 * 🎭 Playwright Rules Demo Test
 * Демонстрация работы правил Playwright на практике
 * Показывает, как работают наши правила в реальных условиях
 */

test.describe('Playwright Rules Demo', () => {
  test('should demonstrate semantic locators', async ({ page }) => {
    // ✅ Правильно - семантические локаторы
    await page.goto('https://example.com');
    
    // Используем getByRole для кнопок
    const heading = page.getByRole('heading', { name: 'Example Domain' });
    await expect(heading).toBeVisible();
    
    // Используем getByText для текста
    const text = page.getByText('This domain is for use in illustrative examples');
    await expect(text).toBeVisible();
    
    // Используем getByTitle для ссылок
    const link = page.getByRole('link', { name: 'More information...' });
    await expect(link).toBeVisible();
  });

  test('should demonstrate proper waiting', async ({ page }) => {
    await page.goto('https://example.com');
    
    // ✅ Правильно - встроенные ожидания
    await expect(page.getByRole('heading')).toBeVisible();
    await expect(page.getByText('Example Domain')).toBeVisible();
    
    // ✅ Правильно - ожидание с таймаутом
    await expect(page.getByRole('heading')).toBeVisible({ timeout: 10000 });
  });

  test('should demonstrate form interactions', async ({ page }) => {
    await page.goto('https://httpbin.org/forms/post');
    
    // ✅ Правильно - семантические локаторы для форм
    await page.getByLabel('Customer name').fill('Test User');
    await page.getByLabel('Telephone').fill('123-456-7890');
    await page.getByLabel('Email address').fill('test@example.com');
    
    // Проверяем заполнение
    await expect(page.getByLabel('Customer name')).toHaveValue('Test User');
    await expect(page.getByLabel('Telephone')).toHaveValue('123-456-7890');
    await expect(page.getByLabel('Email address')).toHaveValue('test@example.com');
  });

  test('should demonstrate error handling', async ({ page }) => {
    // Тест обработки ошибок
    await page.goto('https://httpbin.org/status/404');
    
    // Проверяем статус страницы
    const response = await page.waitForResponse('**/status/404');
    expect(response.status()).toBe(404);
  });

  test('should demonstrate network mocking', async ({ page }) => {
    // Мокирование сетевых запросов
    await page.route('**/api/test', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Mocked response' })
      });
    });

    await page.goto('https://httpbin.org/json');
    
    // Проверяем, что страница загрузилась
    await expect(page.getByText('json')).toBeVisible();
  });

  test('should demonstrate accessibility testing', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Проверяем ARIA атрибуты
    const heading = page.getByRole('heading', { name: 'Example Domain' });
    await expect(heading).toBeVisible();
    
    // Проверяем навигацию с клавиатуры
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Проверяем, что фокус работает
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should demonstrate mobile testing', async ({ page }) => {
    // Установка мобильного размера экрана
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('https://example.com');
    
    // Проверяем, что контент отображается на мобильном
    await expect(page.getByRole('heading')).toBeVisible();
    await expect(page.getByText('Example Domain')).toBeVisible();
  });

  test('should demonstrate performance testing', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Проверяем, что страница загрузилась быстро
    expect(loadTime).toBeLessThan(5000); // Менее 5 секунд
    
    // Проверяем, что контент отображается
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('should demonstrate screenshot and video', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Делаем скриншот
    await page.screenshot({ path: 'test-results/example-screenshot.png' });
    
    // Проверяем, что скриншот создан
    const fs = require('fs');
    expect(fs.existsSync('test-results/example-screenshot.png')).toBe(true);
  });

  test('should demonstrate console logging', async ({ page }) => {
    // Логирование консоли
    const consoleMessages: string[] = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    await page.goto('https://example.com');
    
    // Проверяем, что страница загрузилась без ошибок
    await expect(page.getByRole('heading')).toBeVisible();
    
    // В реальном тесте здесь можно проверить consoleMessages
    console.log('Console messages:', consoleMessages);
  });
});
