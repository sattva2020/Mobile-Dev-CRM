import { defineConfig, devices } from '@playwright/test';

/**
 * 🎭 Playwright Advanced Configuration for CRM
 * Расширенная конфигурация Playwright для CRM системы
 * Основано на: https://playwright.help/docs/intro
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
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    // Дополнительные настройки для CRM
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
    // CRM Desktop тесты
    {
      name: 'CRM Desktop',
      testMatch: '**/crm/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Дополнительные настройки для CRM
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },
    
    // CRM Mobile тесты
    {
      name: 'CRM Mobile',
      testMatch: '**/crm/**/*.spec.ts',
      use: { 
        ...devices['Pixel 5'],
        // Настройки для мобильного тестирования
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
      },
    },
    
    // API тесты
    {
      name: 'API Tests',
      testMatch: '**/api/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Настройки для API тестирования
        baseURL: 'http://localhost:3000/api',
      },
    },
    
    // E2E тесты
    {
      name: 'E2E Tests',
      testMatch: '**/e2e/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Настройки для E2E тестирования
        viewport: { width: 1280, height: 720 },
      },
    },
    
    // Accessibility тесты
    {
      name: 'Accessibility Tests',
      testMatch: '**/accessibility/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Настройки для тестирования доступности
        viewport: { width: 1920, height: 1080 },
      },
    },
    
    // Performance тесты
    {
      name: 'Performance Tests',
      testMatch: '**/performance/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // Настройки для тестирования производительности
        viewport: { width: 1920, height: 1080 },
        // Отключение анимаций для точного измерения
        reducedMotion: 'reduce',
      },
    },
    
    // Cross-browser тесты
    {
      name: 'Firefox',
      testMatch: '**/cross-browser/**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'Safari',
      testMatch: '**/cross-browser/**/*.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Tablet тесты
    {
      name: 'iPad',
      testMatch: '**/tablet/**/*.spec.ts',
      use: { ...devices['iPad Pro'] },
    },
    
    // AI Integration тесты
    {
      name: 'AI Integration',
      testMatch: '**/ai-integration/**/*.spec.ts',
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
      outputFolder: 'playwright-report',
      open: 'never' // Не открывать автоматически
    }],
    ['json', { 
      outputFile: 'test-results.json' 
    }],
    ['junit', { 
      outputFile: 'test-results.xml' 
    }],
    ['list'],
    // Кастомный репортер для CRM
    ['./tests/reporters/crm-reporter.ts']
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
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),

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
