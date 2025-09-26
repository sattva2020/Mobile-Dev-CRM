# 🎭 Playwright Advanced Features - Продвинутые возможности

> **Источник:** [Playwright Documentation](https://playwright.help/docs/intro)  
> **Создано:** 2025-01-27  
> **Версия:** 2.0.0 - Продвинутые возможности

## 📋 Содержание

1. [Конфигурация тестов](#конфигурация-тестов)
2. [Фикстуры и зависимости](#фикстуры-и-зависимости)
3. [Параллелизм и производительность](#параллелизм-и-производительность)
4. [Отладка и трассировка](#отладка-и-трассировка)
5. [Мокирование и перехват](#мокирование-и-перехват)
6. [Доступность и локализация](#доступность-и-локализация)
7. [Мобильное тестирование](#мобильное-тестирование)
8. [Интеграция с CRM](#интеграция-с-crm)

---

## ⚙️ Конфигурация тестов

### Расширенная конфигурация

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

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
  },

  // Проекты для разных браузеров
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
    timeout: 10000,
    threshold: 0.2,
  },

  // Глобальная настройка
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
});
```

### Аннотации тестов

```typescript
import { test, expect } from '@playwright/test';

test.describe('CRM System', () => {
  test('should create project', async ({ page }) => {
    test.setTimeout(60000); // 60 секунд
    test.slow(); // Увеличить таймауты в 3 раза
    
    await page.goto('/projects');
    // ... тест
  });

  test('should handle slow API', async ({ page }) => {
    test.fixme(); // Пропустить тест
    // ... тест
  });

  test('should work on mobile', async ({ page }) => {
    test.skip(process.env.CI, 'Skipped in CI');
    // ... тест
  });
});
```

---

## 🔧 Фикстуры и зависимости

### Пользовательские фикстуры

```typescript
// tests/fixtures.ts
import { test as base } from '@playwright/test';
import { Page } from '@playwright/test';

type MyFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
  testData: any;
};

export const test = base.extend<MyFixtures>({
  // Аутентифицированная страница
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('[data-testid=username]', 'user');
    await page.fill('[data-testid=password]', 'password');
    await page.click('[data-testid=login-button]');
    await expect(page.getByText('Welcome')).toBeVisible();
    await use(page);
  },

  // Админская страница
  adminPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('[data-testid=username]', 'admin');
    await page.fill('[data-testid=password]', 'admin123');
    await page.click('[data-testid=login-button]');
    await expect(page.getByText('Admin Dashboard')).toBeVisible();
    await use(page);
  },

  // Тестовые данные
  testData: async ({}, use) => {
    const data = {
      projects: [
        { name: 'Test Project 1', priority: 'high' },
        { name: 'Test Project 2', priority: 'medium' },
      ],
      tasks: [
        { title: 'Test Task 1', status: 'todo' },
        { title: 'Test Task 2', status: 'in-progress' },
      ],
    };
    await use(data);
  },
});
```

### Глобальная настройка

```typescript
// tests/global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Global Setup for CRM Tests');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Проверка доступности CRM системы
    await page.goto('http://localhost:3000', { timeout: 30000 });
    await page.waitForSelector('[data-testid="app-loaded"]', { timeout: 10000 });
    
    // Предварительная настройка тестовых данных
    await setupTestData(page);
    
    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function setupTestData(page: Page) {
  // Создание тестового проекта
  await page.goto('http://localhost:3000/projects');
  await page.getByRole('button', { name: 'New Project' }).click();
  await page.getByLabel('Project Name').fill('Test Project');
  await page.getByLabel('Description').fill('Test project for Playwright');
  await page.getByRole('button', { name: 'Save Project' }).click();
}

export default globalSetup;
```

---

## 🚀 Параллелизм и производительность

### Настройка параллелизма

```typescript
// playwright.config.ts
export default defineConfig({
  // Полностью параллельное выполнение
  fullyParallel: true,
  
  // Количество воркеров
  workers: process.env.CI ? 1 : undefined,
  
  // Шардинг для CI
  shard: process.env.CI ? { current: 1, total: 4 } : undefined,
});
```

### Параметризация тестов

```typescript
import { test, expect } from '@playwright/test';

const users = ['admin', 'user', 'guest'];
const priorities = ['low', 'medium', 'high', 'critical'];

// Параметризация по пользователям
for (const user of users) {
  test.describe(`Authenticated as ${user}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('[data-testid=username]', user);
      await page.fill('[data-testid=password]', 'password');
      await page.click('[data-testid=login-button]');
    });

    test('should access projects', async ({ page }) => {
      await page.goto('/projects');
      await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    });
  });
}

// Параметризация по приоритетам
for (const priority of priorities) {
  test(`should create project with ${priority} priority`, async ({ page }) => {
    await page.goto('/projects');
    await page.getByRole('button', { name: 'New Project' }).click();
    await page.getByLabel('Project Name').fill(`Test Project ${priority}`);
    await page.getByRole('combobox', { name: 'Priority' }).selectOption(priority);
    await page.getByRole('button', { name: 'Save Project' }).click();
    
    await expect(page.getByText(`Test Project ${priority}`)).toBeVisible();
  });
}
```

### Оптимизация производительности

```typescript
// Отключение ненужных ресурсов
test.beforeEach(async ({ page }) => {
  // Блокировка изображений для ускорения
  await page.route('**/*.{png,jpg,jpeg,svg,gif}', route => route.abort());
  
  // Блокировка шрифтов
  await page.route('**/*.{woff,woff2,ttf,otf}', route => route.abort());
  
  // Блокировка аналитики
  await page.route('**/analytics/**', route => route.abort());
});

// Кэширование для повторных тестов
test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  // Сохранение состояния аутентификации
  await page.context().storageState({ path: 'auth.json' });
});
```

---

## 🔍 Отладка и трассировка

### Трассировка тестов

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry', // Трассировка при первой ошибке
    // trace: 'retain-on-failure', // Трассировка при ошибках
    // trace: 'on', // Всегда включена
  },
});
```

### Просмотр трассировки

```bash
# Просмотр трассировки
npx playwright show-trace trace.zip

# Просмотр отчета
npx playwright show-report
```

### Отладка тестов

```typescript
import { test, expect } from '@playwright/test';

test('debug test', async ({ page }) => {
  // Установка точки останова
  await page.pause();
  
  await page.goto('/projects');
  await page.getByRole('button', { name: 'New Project' }).click();
  
  // Пошаговая отладка
  await page.pause();
  
  await page.getByLabel('Project Name').fill('Debug Project');
  await page.getByRole('button', { name: 'Save Project' }).click();
});
```

### Логирование и мониторинг

```typescript
test('with logging', async ({ page }) => {
  // Логирование консоли
  page.on('console', msg => console.log(`Console: ${msg.text()}`));
  
  // Логирование сетевых запросов
  page.on('request', request => console.log(`Request: ${request.method()} ${request.url()}`));
  page.on('response', response => console.log(`Response: ${response.status()} ${response.url()}`));
  
  // Логирование ошибок
  page.on('pageerror', error => console.log(`Page error: ${error.message}`));
  
  await page.goto('/projects');
  // ... тест
});
```

---

## 🎭 Мокирование и перехват

### Мокирование API

```typescript
import { test, expect } from '@playwright/test';

test('should mock API responses', async ({ page }) => {
  // Мокирование API ответов
  await page.route('**/api/projects', async route => {
    const json = [
      { id: 1, name: 'Mock Project 1', priority: 'high' },
      { id: 2, name: 'Mock Project 2', priority: 'medium' },
    ];
    await route.fulfill({ json });
  });

  // Мокирование ошибок API
  await page.route('**/api/tasks', async route => {
    await route.fulfill({ status: 500, body: 'Internal Server Error' });
  });

  await page.goto('/projects');
  await expect(page.getByText('Mock Project 1')).toBeVisible();
});
```

### Перехват сетевых запросов

```typescript
test('should intercept network requests', async ({ page }) => {
  const requests: string[] = [];
  
  // Перехват всех запросов
  await page.route('**/*', async route => {
    requests.push(route.request().url());
    await route.continue();
  });

  await page.goto('/projects');
  await page.getByRole('button', { name: 'New Project' }).click();
  
  // Проверка перехваченных запросов
  expect(requests).toContain('http://localhost:3000/api/projects');
});
```

### Мокирование файлов

```typescript
test('should handle file uploads', async ({ page }) => {
  // Мокирование файлового диалога
  await page.setInputFiles('input[type="file"]', {
    name: 'test-file.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('test content'),
  });

  await page.goto('/upload');
  await page.getByRole('button', { name: 'Upload File' }).click();
  await expect(page.getByText('File uploaded successfully')).toBeVisible();
});
```

---

## ♿ Доступность и локализация

### Тестирование доступности

```typescript
import { test, expect } from '@playwright/test';

test('should be accessible', async ({ page }) => {
  await page.goto('/projects');
  
  // Проверка ARIA атрибутов
  await expect(page.getByRole('button', { name: 'New Project' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  
  // Проверка навигации с клавиатуры
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  
  // Проверка фокуса
  await expect(page.getByRole('button', { name: 'New Project' })).toBeFocused();
});
```

### Тестирование локализации

```typescript
test('should support multiple languages', async ({ page }) => {
  const languages = ['en', 'ru', 'es', 'fr'];
  
  for (const lang of languages) {
    await page.goto(`/projects?lang=${lang}`);
    
    // Проверка локализованного текста
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Проверка RTL для арабского
    if (lang === 'ar') {
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    }
  }
});
```

---

## 📱 Мобильное тестирование

### Адаптивный дизайн

```typescript
test('should work on mobile devices', async ({ page }) => {
  // Тест на мобильном размере
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto('/projects');
  
  // Проверка мобильного меню
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  
  // Проверка свайпов
  await page.touchscreen.tap(200, 300);
  await page.touchscreen.swipe(200, 300, 200, 100);
});
```

### Тестирование жестов

```typescript
test('should handle touch gestures', async ({ page }) => {
  await page.goto('/projects');
  
  // Тест свайпа
  await page.touchscreen.tap(200, 300);
  await page.touchscreen.swipe(200, 300, 200, 100);
  
  // Тест пинча
  await page.touchscreen.tap(100, 200);
  await page.touchscreen.tap(300, 400);
});
```

---

## 🏢 Интеграция с CRM

### Расширенные тесты CRM

```typescript
import { test, expect } from '@playwright/test';

test.describe('CRM Advanced Features', () => {
  test('should handle complex project workflow', async ({ page }) => {
    // Создание проекта
    await page.goto('/projects');
    await page.getByRole('button', { name: 'New Project' }).click();
    await page.getByLabel('Project Name').fill('Complex Project');
    await page.getByLabel('Description').fill('Complex project with multiple tasks');
    
    // AI анализ
    await page.getByRole('button', { name: 'Analyze with AI' }).click();
    await expect(page.getByText('AI Analysis Complete')).toBeVisible();
    
    // Сохранение
    await page.getByRole('button', { name: 'Save Project' }).click();
    await expect(page.getByText('Project created successfully')).toBeVisible();
    
    // Создание задач
    await page.getByRole('link', { name: 'Tasks' }).click();
    await page.getByRole('button', { name: 'New Task' }).click();
    await page.getByLabel('Task Title').fill('Task 1');
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    // Проверка связи проекта и задач
    await page.goto('/projects');
    await expect(page.getByText('Complex Project')).toBeVisible();
    await expect(page.getByText('1 task')).toBeVisible();
  });

  test('should handle AI service failures', async ({ page }) => {
    // Мокирование ошибки AI сервиса
    await page.route('**/api/ai/analyze', async route => {
      await route.fulfill({ status: 500, body: 'AI Service Unavailable' });
    });

    await page.goto('/projects');
    await page.getByRole('button', { name: 'New Project' }).click();
    await page.getByLabel('Project Name').fill('Test Project');
    
    // Попытка AI анализа
    await page.getByRole('button', { name: 'Analyze with AI' }).click();
    
    // Проверка обработки ошибки
    await expect(page.getByText('AI Service Unavailable')).toBeVisible();
    await expect(page.getByText('Please try again later')).toBeVisible();
  });
});
```

### Интеграция с OnlyTests

```typescript
test('should use OnlyTests prompts for test generation', async ({ page }) => {
  // Импорт OnlyTests промптов
  const { onlyTestsCRMPrompts } = require('./onlytests-crm-prompts');
  
  // Получение промпта для создания тест-кейсов
  const testCasePrompt = onlyTestsCRMPrompts.getPrompt('design', 'testCasesClassic');
  
  // Использование промпта для генерации тестов
  const testCases = await generateTestCasesFromPrompt(testCasePrompt, {
    system: 'CRM AI-Fitness Coach 360',
    module: 'Project Management',
    requirements: 'User can create, edit, and delete projects'
  });
  
  // Выполнение сгенерированных тестов
  for (const testCase of testCases) {
    await page.goto('/projects');
    await executeTestCase(page, testCase);
  }
});
```

---

## 📊 Мониторинг и отчетность

### Расширенные отчеты

```typescript
// playwright.config.ts
export default defineConfig({
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
    // Кастомный репортер
    ['./tests/custom-reporter.ts']
  ],
});
```

### Кастомный репортер

```typescript
// tests/custom-reporter.ts
import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

class CustomReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    console.log(`🚀 Starting ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase, result: TestResult) {
    console.log(`🧪 Running ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status === 'passed' ? '✅' : '❌';
    console.log(`${status} ${test.title} (${result.duration}ms)`);
  }

  onEnd(result: FullResult) {
    console.log(`📊 Tests completed: ${result.status}`);
    console.log(`   Passed: ${result.passed}`);
    console.log(`   Failed: ${result.failed}`);
    console.log(`   Skipped: ${result.skipped}`);
  }
}

export default CustomReporter;
```

---

## 🎯 Заключение

**Playwright Advanced Features** предоставляют мощные возможности для:

- ✅ **Сложной конфигурации** - гибкая настройка тестов
- ✅ **Продвинутой отладки** - трассировка и мониторинг
- ✅ **Мокирования** - изоляция тестов
- ✅ **Доступности** - тестирование для всех пользователей
- ✅ **Мобильности** - адаптивный дизайн
- ✅ **CRM интеграции** - специализированные тесты

**Формула успеха:** `Advanced Playwright + OnlyTests + CRM = Профессиональное тестирование!`

---

*Создано с использованием [Playwright Documentation](https://playwright.help/docs/intro) и интеграции с OnlyTests платформой для CRM системы "AI-Fitness Coach 360".*
