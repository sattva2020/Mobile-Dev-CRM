import { defineConfig, devices } from '@playwright/test';

/**
 * 🎭 Playwright Configuration for CRM System
 * Конфигурация Playwright для тестирования CRM системы "AI-Fitness Coach 360"
 * Основано на: https://playwright.help/docs/writing-tests
 */

export default defineConfig({
  // Тестовая директория
  testDir: './tests',
  
  // Паттерны для поиска тестовых файлов
  testMatch: [
    '**/playwright-crm-examples.spec.ts',
    '**/crm.spec.ts',
    '**/api-only.spec.ts'
  ],
  
  // Полностью параллельное выполнение
  fullyParallel: true,
  
  // Запуск в режиме fail-fast
  forbidOnly: !!process.env.CI,
  
  // Повторные попытки только в CI
  retries: process.env.CI ? 2 : 0,
  
  // Количество воркеров
  workers: process.env.CI ? 1 : undefined,
  
  // Глобальная настройка
  use: {
    // Базовый URL для тестов
    baseURL: 'http://localhost:3000',
    
    // Трассировка для отладки
    trace: 'on-first-retry',
    
    // Скриншоты при ошибках
    screenshot: 'only-on-failure',
    
    // Видео при ошибках
    video: 'retain-on-failure',
    
    // Таймауты
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // Настройка проектов для разных браузеров
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Мобильные тесты
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    // Планшетные тесты
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Веб-сервер для разработки
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // Настройка отчетов
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
    ['list'],
  ],

  // Настройка ожиданий
  expect: {
    // Таймаут для утверждений
    timeout: 10000,
    
    // Порог для визуальных сравнений
    threshold: 0.2,
  },

  // Настройка глобальной настройки
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
});
