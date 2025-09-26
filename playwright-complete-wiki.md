# 🎭 Playwright Complete Wiki - Полная документация

> **Источник:** [Playwright Documentation](https://playwright.help/docs/intro)  
> **Создано:** 2025-01-27  
> **Версия:** 2.0.0 - Полное покрытие документации

## 📋 Содержание

1. [Введение и установка](#введение-и-установка)
2. [Быстрый старт](#быстрый-старт)
3. [Основы тестирования](#основы-тестирования)
4. [Продвинутые возможности](#продвинутые-возможности)
5. [Интеграции и экосистема](#интеграции-и-экосистема)
6. [Лучшие практики](#лучшие-практики)
7. [Примеры для CRM](#примеры-для-crm)

---

## 🚀 Введение и установка

### Что такое Playwright

**Playwright** - это современный инструмент для end-to-end тестирования, который поддерживает:

- ✅ **Все современные движки** - Chromium, WebKit, Firefox
- ✅ **Кроссплатформенность** - Windows, Linux, macOS
- ✅ **Мобильные устройства** - Google Chrome Android, Mobile Safari
- ✅ **CI/CD интеграция** - локально и на CI
- ✅ **Режимы выполнения** - безголовый и обычный

### Установка Playwright

```bash
# npm
npm init playwright@latest

# yarn
yarn create playwright

# pnpm
pnpm create playwright
```

### Что устанавливается

```
playwright.config.ts    # Конфигурация
package.json           # Зависимости
tests/
  example.spec.ts     # Базовый пример
tests-examples/
  demo-todo-app.spec.ts # Детальный пример
```

### Системные требования

- **Node.js:** 18, 20 или 22
- **Windows:** 10+, Windows Server 2016+, WSL
- **macOS:** 13 Ventura или новее
- **Linux:** Debian 12, Ubuntu 22.04, Ubuntu 24.04 (x86-64, arm64)

---

## 🎯 Быстрый старт

### Запуск примера теста

```bash
# Запуск всех тестов
npx playwright test

# UI режим
npx playwright test --ui

# Просмотр отчета
npx playwright show-report
```

### HTML отчеты

```bash
# Просмотр отчета
npx playwright show-report

# Открытие в браузере
npx playwright show-report --host 0.0.0.0
```

### UI режим

```bash
# Запуск в UI режиме
npx playwright test --ui

# Отладка с перемоткой времени
npx playwright test --ui --debug
```

---

## 🧪 Основы тестирования

### Первый тест

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

### Действия

```typescript
// Навигация
await page.goto('https://example.com');

// Взаимодействия
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('user@example.com');
await page.getByRole('checkbox').check();
```

### Утверждения

```typescript
// Синхронные
expect(success).toBeTruthy();

// Асинхронные
await expect(page).toHaveTitle(/Playwright/);
await expect(locator).toBeVisible();
await expect(locator).toHaveText('Expected text');
```

---

## ⚙️ Продвинутые возможности

### Конфигурация тестов

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### Фикстуры

```typescript
import { test as base } from '@playwright/test';

type MyFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('[data-testid=username]', 'user');
    await page.fill('[data-testid=password]', 'password');
    await page.click('[data-testid=login-button]');
    await use(page);
  },
});
```

### Параллелизм

```typescript
// Полностью параллельное выполнение
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
});
```

### Параметризация тестов

```typescript
const users = ['alice', 'bob', 'charlie'];

for (const user of users) {
  test(`authenticated as ${user}`, async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid=username]', user);
    // ... rest of the test
  });
}
```

---

## 🔗 Интеграции и экосистема

### VS Code интеграция

```bash
# Установка расширения
code --install-extension ms-playwright.playwright
```

### CI/CD интеграция

```yaml
# GitHub Actions
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### API тестирование

```typescript
import { test, expect } from '@playwright/test';

test('API test', async ({ request }) => {
  const response = await request.get('/api/users');
  expect(response.status()).toBe(200);
  
  const users = await response.json();
  expect(users).toHaveLength(3);
});
```

---

## 🏆 Лучшие практики

### Локаторы

```typescript
// ✅ Хорошо - семантические локаторы
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('user@example.com');

// ❌ Плохо - CSS селекторы
await page.locator('#submit-button').click();
```

### Ожидания

```typescript
// ✅ Хорошо - встроенные ожидания
await expect(page.getByRole('heading')).toBeVisible();

// ❌ Плохо - ручные ожидания
await page.waitForTimeout(1000);
```

### Структура тестов

```typescript
test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid=username]', 'admin');
    await page.fill('[data-testid=password]', 'password');
    await page.click('[data-testid=login-button]');
  });

  test('should create new user', async ({ page }) => {
    await page.getByRole('button', { name: 'New User' }).click();
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByRole('button', { name: 'Save' }).click();
    
    await expect(page.getByText('User created successfully')).toBeVisible();
  });
});
```

---

## 🏢 Примеры для CRM

### Project Management Tests

```typescript
test.describe('CRM Project Management', () => {
  test('should create project with AI analysis', async ({ page }) => {
    await page.goto('/projects');
    await page.getByRole('button', { name: 'New Project' }).click();
    
    await page.getByLabel('Project Name').fill('AI Integration Project');
    await page.getByLabel('Description').fill('Integration of AI services');
    await page.getByRole('combobox', { name: 'Priority' }).selectOption('high');
    
    await page.getByRole('button', { name: 'Analyze with AI' }).click();
    await expect(page.getByText('AI Analysis Complete')).toBeVisible();
    
    await page.getByRole('button', { name: 'Save Project' }).click();
    await expect(page.getByText('Project created successfully')).toBeVisible();
  });
});
```

### Task Management Tests

```typescript
test.describe('CRM Task Management', () => {
  test('should create task with AI recommendations', async ({ page }) => {
    await page.goto('/tasks');
    await page.getByRole('button', { name: 'New Task' }).click();
    
    await page.getByLabel('Task Title').fill('Implement AI Model');
    await page.getByLabel('Description').fill('Train AI model for analysis');
    await page.getByRole('combobox', { name: 'Priority' }).selectOption('critical');
    
    await page.getByRole('button', { name: 'Get AI Recommendations' }).click();
    await expect(page.getByText('AI Recommendations Generated')).toBeVisible();
    
    await page.getByRole('button', { name: 'Save Task' }).click();
    await expect(page.getByText('Task created successfully')).toBeVisible();
  });
});
```

### AI Integration Tests

```typescript
test.describe('AI Integration', () => {
  test('should test AI service connectivity', async ({ page }) => {
    await page.goto('/ai-settings');
    
    await page.getByRole('button', { name: 'Test OpenRouter Connection' }).click();
    await expect(page.getByText('OpenRouter: Connected')).toBeVisible();
    
    await page.getByRole('button', { name: 'Test LM Studio Connection' }).click();
    await expect(page.getByText('LM Studio: Connected')).toBeVisible();
    
    await page.getByRole('button', { name: 'Test xAI Connection' }).click();
    await expect(page.getByText('xAI: Connected')).toBeVisible();
  });
});
```

---

## 📚 Дополнительные ресурсы

### Официальная документация
- [Playwright Documentation](https://playwright.help/docs/intro)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Интеграции
- [OnlyTests Platform](https://www.onlytest.io/ru) - Генерация тестовых данных
- [Playwright MCP](https://github.com/microsoft/playwright-mcp) - Model Controlled Playwright
- [CRM Testing Examples](./playwright-crm-examples.spec.ts) - Практические примеры

### Полезные команды

```bash
# Установка
npm init playwright@latest
npx playwright install

# Запуск тестов
npx playwright test
npx playwright test --ui
npx playwright test --headed

# Генерация тестов
npx playwright codegen

# Просмотр трассировки
npx playwright show-trace trace.zip

# Обновление
npm install -D @playwright/test@latest
npx playwright install --with-deps
```

---

## 🎯 Заключение

**Playwright** - это мощный инструмент для автоматизации тестирования, который идеально подходит для:

- ✅ **CRM систем** - тестирование бизнес-логики
- ✅ **AI интеграций** - проверка работы с внешними API
- ✅ **Пользовательских сценариев** - E2E тестирование
- ✅ **Интеграции с OnlyTests** - автоматическая генерация тестов

**Формула успеха:** `Playwright + OnlyTests + CRM = Профессиональное тестирование!`

---

*Создано с использованием [Playwright Documentation](https://playwright.help/docs/intro) и интеграции с OnlyTests платформой для CRM системы "AI-Fitness Coach 360".*
