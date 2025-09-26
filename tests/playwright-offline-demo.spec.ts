import { test, expect } from '@playwright/test';

/**
 * 🎭 Playwright Offline Demo Test
 * Демонстрация работы правил Playwright без зависимости от внешних сервисов
 * Показывает, как работают наши правила в изолированной среде
 */

test.describe('Playwright Offline Demo', () => {
  test('should demonstrate semantic locators with data URLs', async ({ page }) => {
    // ✅ Правильно - используем data URL для изолированного тестирования
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Test Page</title></head>
        <body>
          <h1>Test Application</h1>
          <button id="test-btn">Click Me</button>
          <input type="text" id="test-input" placeholder="Enter text">
          <div id="result">Result will appear here</div>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    
    // Используем семантические локаторы
    const heading = page.getByRole('heading', { name: 'Test Application' });
    await expect(heading).toBeVisible();
    
    const button = page.getByRole('button', { name: 'Click Me' });
    await expect(button).toBeVisible();
    
    const input = page.getByPlaceholder('Enter text');
    await expect(input).toBeVisible();
  });

  test('should demonstrate form interactions with data URL', async ({ page }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Form Test</title></head>
        <body>
          <form>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name">
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">
            
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    
    // ✅ Правильно - семантические локаторы для форм
    await page.getByLabel('Name:').fill('Test User');
    await page.getByLabel('Email:').fill('test@example.com');
    
    // Проверяем заполнение
    await expect(page.getByLabel('Name:')).toHaveValue('Test User');
    await expect(page.getByLabel('Email:')).toHaveValue('test@example.com');
  });

  test('should demonstrate proper waiting strategies', async ({ page }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Async Test</title></head>
        <body>
          <div id="loading">Loading...</div>
          <div id="content" style="display: none;">Content loaded!</div>
          <script>
            setTimeout(() => {
              document.getElementById('loading').style.display = 'none';
              document.getElementById('content').style.display = 'block';
            }, 1000);
          </script>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    
    // ✅ Правильно - встроенные ожидания
    await expect(page.getByText('Loading...')).toBeVisible();
    await expect(page.getByText('Content loaded!')).toBeVisible({ timeout: 5000 });
  });

  test('should demonstrate accessibility testing', async ({ page }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Accessibility Test</title></head>
        <body>
          <h1>Main Heading</h1>
          <nav>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <main>
            <button aria-label="Close dialog">×</button>
            <input type="text" aria-label="Search" placeholder="Search...">
          </main>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    
    // Проверяем ARIA атрибуты
    const heading = page.getByRole('heading', { name: 'Main Heading' });
    await expect(heading).toBeVisible();
    
    const closeButton = page.getByRole('button', { name: 'Close dialog' });
    await expect(closeButton).toBeVisible();
    
    const searchInput = page.getByRole('textbox', { name: 'Search' });
    await expect(searchInput).toBeVisible();
  });

  test('should demonstrate mobile testing', async ({ page }) => {
    // Установка мобильного размера экрана
    await page.setViewportSize({ width: 375, height: 667 });
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mobile Test</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <h1>Mobile App</h1>
          <button>Mobile Button</button>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    
    // Проверяем, что контент отображается на мобильном
    await expect(page.getByRole('heading')).toBeVisible();
    await expect(page.getByRole('button')).toBeVisible();
  });

  test('should demonstrate performance testing', async ({ page }) => {
    const startTime = Date.now();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Performance Test</title></head>
        <body>
          <h1>Fast Loading Page</h1>
          <p>This page loads quickly</p>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Проверяем, что страница загрузилась быстро
    expect(loadTime).toBeLessThan(1000); // Менее 1 секунды
    
    // Проверяем, что контент отображается
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('should demonstrate screenshot capabilities', async ({ page }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Screenshot Test</title></head>
        <body style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); padding: 20px;">
          <h1 style="color: white; text-align: center;">Beautiful Test Page</h1>
          <p style="color: white; text-align: center;">This is a test page for screenshots</p>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    
    // Делаем скриншот
    await page.screenshot({ 
      path: 'test-results/offline-demo-screenshot.png',
      fullPage: true 
    });
    
    // Проверяем, что скриншот создан
    const fs = require('fs');
    expect(fs.existsSync('test-results/offline-demo-screenshot.png')).toBe(true);
  });

  test('should demonstrate console logging', async ({ page }) => {
    // Логирование консоли
    const consoleMessages: string[] = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Console Test</title></head>
        <body>
          <h1>Console Test Page</h1>
          <script>
            console.log('Test message from page');
            console.warn('Test warning from page');
          </script>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    
    // Проверяем, что страница загрузилась
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Проверяем console сообщения
    expect(consoleMessages).toContain('Test message from page');
    expect(consoleMessages).toContain('Test warning from page');
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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Network Mock Test</title></head>
        <body>
          <h1>Network Mock Test</h1>
          <button onclick="fetch('/api/test').then(r => r.json()).then(d => console.log(d))">Test API</button>
        </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    
    // Проверяем, что страница загрузилась
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Тестируем мокированный API
    const consoleMessages: string[] = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    await page.getByRole('button').click();
    
    // Ждем ответа
    await page.waitForTimeout(1000);
    
    // Проверяем, что получили мокированный ответ
    expect(consoleMessages.some(msg => msg.includes('Mocked response'))).toBe(true);
  });
});
