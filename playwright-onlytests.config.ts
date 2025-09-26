import { defineConfig, devices } from '@playwright/test';

/**
 * 🎭 Playwright Configuration with OnlyTests Approach
 * Конфигурация Playwright с использованием OnlyTests архитектуры
 * Основано на: https://github.com/e-semenyuk/onlytests-qa
 */

export default defineConfig({
  // Тестовая директория
  testDir: './tests',
  
  // Полностью параллельное выполнение
  fullyParallel: true,
  
  // Запрет только в CI
  forbidOnly: !!process.env.CI,
  
  // Повторные попытки
  retries: process.env.CI ? 2 : 0,
  
  // Количество воркеров
  workers: process.env.CI ? 1 : undefined,
  
  // Глобальная настройка
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    // Дополнительные настройки для OnlyTests подхода
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    // Настройки для AI интеграции
    extraHTTPHeaders: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
    },
  },

  // Проекты для разных типов тестов
  projects: [
    // CRM Desktop тесты с OnlyTests подходом
    {
      name: 'CRM Desktop - OnlyTests',
      testMatch: '**/ui/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Настройки для CRM
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },
    
    // CRM Mobile тесты с OnlyTests подходом
    {
      name: 'CRM Mobile - OnlyTests',
      testMatch: '**/ui/**/*.spec.ts',
      use: { 
        ...devices['Pixel 5'],
        // Настройки для мобильного тестирования
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
      },
    },
    
    // CRM Tablet тесты с OnlyTests подходом
    {
      name: 'CRM Tablet - OnlyTests',
      testMatch: '**/ui/**/*.spec.ts',
      use: { 
        ...devices['iPad Pro'],
        // Настройки для планшетного тестирования
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
      },
    },
    
    // Cross-browser тесты с OnlyTests подходом
    {
      name: 'Firefox - OnlyTests',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'Safari - OnlyTests',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },
    
    // AI Integration тесты с OnlyTests подходом
    {
      name: 'AI Integration - OnlyTests',
      testMatch: '**/ui/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Настройки для AI интеграции
        viewport: { width: 1920, height: 1080 },
        // Дополнительные заголовки для AI API
        extraHTTPHeaders: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
    
    // Performance тесты с OnlyTests подходом
    {
      name: 'Performance - OnlyTests',
      testMatch: '**/ui/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Настройки для тестирования производительности
        viewport: { width: 1920, height: 1080 },
        // Отключение анимаций для точного измерения
        reducedMotion: 'reduce',
      },
    },
    
    // Accessibility тесты с OnlyTests подходом
    {
      name: 'Accessibility - OnlyTests',
      testMatch: '**/ui/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Настройки для тестирования доступности
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  // Веб-сервер для разработки
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    // Настройки для CRM системы
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_crm',
      AI_SERVICES_ENABLED: 'true',
    },
  },

  // Настройка отчетов
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report-onlytests',
      open: 'never' // Не открывать автоматически
    }],
    ['json', { 
      outputFile: 'test-results-onlytests.json' 
    }],
    ['junit', { 
      outputFile: 'test-results-onlytests.xml' 
    }],
    ['list'],
    // Кастомный репортер для OnlyTests подхода
    ['./tests/reporters/onlytests-reporter.ts']
  ],

  // Настройка ожиданий
  expect: {
    timeout: 10000,
    // Настройки для скриншотов
    threshold: 0.2,
    // Настройки для анимаций
    animation: 'disabled',
  },

  // Глобальная настройка
  globalSetup: require.resolve('./tests/global-setup-onlytests.ts'),
  globalTeardown: require.resolve('./tests/global-teardown-onlytests.ts'),

  // Настройки для CI
  ...(process.env.CI && {
    // Настройки для CI окружения
    use: {
      ...devices['Desktop Chrome'],
      // Отключение анимаций в CI
      reducedMotion: 'reduce',
      // Настройки для стабильности в CI
      actionTimeout: 15000,
      navigationTimeout: 45000,
    },
  }),

  // Настройки для отладки
  ...(process.env.DEBUG && {
    // Настройки для отладки
    use: {
      headless: false,
      slowMo: 1000,
      trace: 'on',
      screenshot: 'on',
      video: 'on',
    },
  }),
});
