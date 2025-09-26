# 🎭 Playwright Wiki - Полное руководство по тестированию

> **Источник:** [Playwright Documentation - Writing Tests](https://playwright.help/docs/writing-tests)  
> **Создано:** 2025-01-27  
> **Версия:** 1.0.0

## 📋 Содержание

1. [Введение в Playwright](#введение-в-playwright)
2. [Первый тест](#первый-тест)
3. [Действия в Playwright](#действия-в-playwright)
4. [Утверждения (Assertions)](#утверждения-assertions)
5. [Изоляция тестов](#изоляция-тестов)
6. [Хуки тестов](#хуки-тестов)
7. [Лучшие практики](#лучшие-практики)
8. [Примеры для CRM](#примеры-для-crm)
9. [Интеграция с OnlyTests](#интеграция-с-onlytests)

---

## 🎯 Введение в Playwright

**Playwright** - это современный инструмент для автоматизации тестирования веб-приложений, который позволяет:

- ✅ **Выполнять действия** - клики, ввод текста, навигация
- ✅ **Проверять состояние** - утверждения и ожидания
- ✅ **Автоматически ждать** - не нужно вручную ждать загрузки
- ✅ **Избегать гонок** - умные утверждения без таймаутов

### 🚀 Ключевые преимущества

- **Автоматическое ожидание** - Playwright ждет готовности элементов
- **Изоляция тестов** - каждый тест получает свежую среду
- **Кроссплатформенность** - Chrome, Firefox, Safari, Edge
- **TypeScript поддержка** - строгая типизация
- **Отладка** - встроенные инструменты отладки

---

## 🧪 Первый тест

### Базовый пример

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  
  // Ожидаем, что заголовок "содержит" подстроку
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  
  // Нажимаем на ссылку "Начать"
  await page.getByRole('link', { name: 'Get started' }).click();
  
  // Ожидаем, что на странице есть заголовок с именем "Установка"
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

### 🔧 Настройка TypeScript

Добавьте `// @ts-check` в начало файла для автоматической проверки типов в VS Code:

```typescript
// @ts-check
import { test, expect } from '@playwright/test';
```

---

## 🎮 Действия в Playwright

### Навигация

```typescript
// Переход на URL
await page.goto('https://playwright.dev/');

// Playwright автоматически ждет загрузки страницы
```

### Взаимодействия

```typescript
// Создание локатора
const getStarted = page.getByRole('link', { name: 'Get started' });

// Нажатие на элемент
await getStarted.click();

// Или в одну строку
await page.getByRole('link', { name: 'Get started' }).click();
```

### 📋 Основные действия

| Действие | Описание | Пример |
|----------|----------|---------|
| `locator.check()` | Установить флажок | `await page.getByRole('checkbox').check()` |
| `locator.click()` | Нажать на элемент | `await page.getByRole('button').click()` |
| `locator.uncheck()` | Снять флажок | `await page.getByRole('checkbox').uncheck()` |
| `locator.hover()` | Навести курсор | `await page.getByRole('link').hover()` |
| `locator.fill()` | Заполнить поле | `await page.getByRole('textbox').fill('text')` |
| `locator.focus()` | Установить фокус | `await page.getByRole('textbox').focus()` |
| `locator.press()` | Нажать клавишу | `await page.getByRole('textbox').press('Enter')` |
| `locator.setInputFiles()` | Выбрать файлы | `await page.getByRole('file').setInputFiles('file.pdf')` |
| `locator.selectOption()` | Выбрать опцию | `await page.getByRole('combobox').selectOption('value')` |

---

## ✅ Утверждения (Assertions)

### Универсальные сопоставители

```typescript
// Синхронные утверждения
expect(success).toBeTruthy();
expect(array).toContain('item');
expect(value).toEqual(expected);
```

### Асинхронные утверждения

```typescript
// Playwright автоматически ждет выполнения условий
await expect(page).toHaveTitle(/Playwright/);
await expect(locator).toBeVisible();
await expect(locator).toHaveText('Expected text');
```

### 📋 Популярные утверждения

| Утверждение | Описание | Пример |
|-------------|----------|---------|
| `toBeChecked()` | Флажок установлен | `await expect(checkbox).toBeChecked()` |
| `toBeEnabled()` | Элемент включен | `await expect(button).toBeEnabled()` |
| `toBeVisible()` | Элемент видим | `await expect(element).toBeVisible()` |
| `toContainText()` | Содержит текст | `await expect(element).toContainText('text')` |
| `toHaveAttribute()` | Имеет атрибут | `await expect(element).toHaveAttribute('href')` |
| `toHaveCount()` | Количество элементов | `await expect(list).toHaveCount(5)` |
| `toHaveText()` | Точное соответствие текста | `await expect(element).toHaveText('Exact text')` |
| `toHaveValue()` | Значение поля | `await expect(input).toHaveValue('value')` |
| `toHaveTitle()` | Заголовок страницы | `await expect(page).toHaveTitle('Title')` |
| `toHaveURL()` | URL страницы | `await expect(page).toHaveURL('https://example.com')` |

---

## 🔒 Изоляция тестов

Playwright обеспечивает полную изоляцию тестов:

```typescript
import { test } from '@playwright/test';

test('example test', async ({ page }) => {
  // "page" принадлежит изолированному контексту браузера
  // созданному для этого конкретного теста
});

test('another test', async ({ page }) => {
  // "page" во втором тесте полностью изолирован от первого
});
```

### 🎯 Преимущества изоляции

- **Свежая среда** - каждый тест начинается с чистого листа
- **Параллельность** - тесты могут выполняться одновременно
- **Надежность** - тесты не влияют друг на друга
- **Отладка** - легче найти проблемы

---

## 🪝 Хуки тестов

### Группировка тестов

```typescript
import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на начальный URL перед каждым тестом
    await page.goto('https://playwright.dev/');
  });

  test('main navigation', async ({ page }) => {
    // Утверждения используют API expect
    await expect(page).toHaveURL('https://playwright.dev/');
  });
});
```

### 📋 Доступные хуки

| Хук | Описание | Когда выполняется |
|-----|----------|-------------------|
| `test.beforeAll()` | Один раз перед всеми тестами | В начале группы тестов |
| `test.beforeEach()` | Перед каждым тестом | Перед каждым тестом в группе |
| `test.afterEach()` | После каждого теста | После каждого теста в группе |
| `test.afterAll()` | Один раз после всех тестов | В конце группы тестов |

---

## 🏆 Лучшие практики

### 1. Использование локаторов

```typescript
// ✅ Хорошо - семантические локаторы
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('user@example.com');

// ❌ Плохо - CSS селекторы
await page.locator('#submit-button').click();
await page.locator('input[type="email"]').fill('user@example.com');
```

### 2. Ожидания и утверждения

```typescript
// ✅ Хорошо - используйте встроенные ожидания
await expect(page.getByRole('heading')).toBeVisible();
await expect(page.getByText('Success')).toHaveCount(1);

// ❌ Плохо - ручные ожидания
await page.waitForTimeout(1000);
```

### 3. Структура тестов

```typescript
// ✅ Хорошо - четкая структура
test('user can login', async ({ page }) => {
  // Arrange - подготовка
  await page.goto('/login');
  
  // Act - действие
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Assert - проверка
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

### 4. Обработка ошибок

```typescript
// ✅ Хорошо - специфичные ожидания
await expect(page.getByText('Error message')).toBeVisible();

// ❌ Плохо - общие ожидания
await page.waitForTimeout(5000);
```

---

## 🏢 Примеры для CRM

### Тест создания проекта

```typescript
import { test, expect } from '@playwright/test';

test.describe('CRM Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should create new project', async ({ page }) => {
    // Навигация к созданию проекта
    await page.getByRole('button', { name: 'New Project' }).click();
    
    // Заполнение формы
    await page.getByLabel('Project Name').fill('Test Project');
    await page.getByLabel('Description').fill('Test Description');
    await page.getByRole('combobox', { name: 'Priority' }).selectOption('high');
    
    // Сохранение
    await page.getByRole('button', { name: 'Save Project' }).click();
    
    // Проверка результата
    await expect(page.getByText('Project created successfully')).toBeVisible();
    await expect(page.getByText('Test Project')).toBeVisible();
  });

  test('should edit existing project', async ({ page }) => {
    // Поиск проекта
    await page.getByRole('textbox', { name: 'Search' }).fill('Test Project');
    
    // Открытие для редактирования
    await page.getByRole('button', { name: 'Edit' }).first().click();
    
    // Изменение данных
    await page.getByLabel('Project Name').fill('Updated Project');
    
    // Сохранение
    await page.getByRole('button', { name: 'Update' }).click();
    
    // Проверка
    await expect(page.getByText('Project updated successfully')).toBeVisible();
  });
});
```

### Тест управления задачами

```typescript
test.describe('CRM Task Management', () => {
  test('should create task with AI analysis', async ({ page }) => {
    await page.goto('/tasks');
    
    // Создание задачи
    await page.getByRole('button', { name: 'New Task' }).click();
    await page.getByLabel('Task Title').fill('Implement AI Integration');
    await page.getByLabel('Description').fill('Integrate AI services for project analysis');
    
    // Выбор приоритета
    await page.getByRole('combobox', { name: 'Priority' }).selectOption('high');
    
    // AI анализ
    await page.getByRole('button', { name: 'Analyze with AI' }).click();
    await expect(page.getByText('AI Analysis Complete')).toBeVisible();
    
    // Сохранение
    await page.getByRole('button', { name: 'Save Task' }).click();
    
    // Проверка
    await expect(page.getByText('Task created successfully')).toBeVisible();
  });
});
```

---

## 🔗 Интеграция с OnlyTests

### Использование OnlyTests промптов для Playwright

```typescript
// Пример использования OnlyTests промпта "Создание Тест-кейсов"
const onlyTestsPrompt = `
Используй OnlyTests промпт "Создание Тест-кейсов (Классический формат)" 
для создания тест-кейсов для CRM системы "AI-Fitness Coach 360"
`;

// Генерация тест-кейсов с помощью OnlyTests
const testCases = await generateTestCases({
  system: 'CRM AI-Fitness Coach 360',
  module: 'Project Management',
  requirements: 'User can create, edit, and delete projects'
});
```

### Playwright + OnlyTests + CRM

```typescript
import { test, expect } from '@playwright/test';
import { onlyTestsCRMPrompts } from './onlytests-crm-prompts';

test.describe('CRM with OnlyTests Integration', () => {
  test('should execute OnlyTests generated test cases', async ({ page }) => {
    // Получение промпта из OnlyTests
    const testPlanPrompt = onlyTestsCRMPrompts.getPrompt('planning', 'testPlan');
    
    // Выполнение тестов на основе OnlyTests стратегии
    await page.goto('http://localhost:3000');
    
    // Тестирование согласно OnlyTests плану
    await expect(page.getByRole('heading', { name: 'AI-Fitness Coach 360' })).toBeVisible();
    
    // Проверка функциональности согласно OnlyTests критериям
    await expect(page.getByRole('button', { name: 'New Project' })).toBeEnabled();
  });
});
```

---

## 📚 Дополнительные ресурсы

### Официальная документация
- [Playwright Documentation](https://playwright.help/docs/writing-tests)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

### Интеграции
- [OnlyTests Platform](https://www.onlytest.io/ru) - Генерация тестовых данных и промптов
- [Playwright MCP](https://github.com/microsoft/playwright-mcp) - Model Controlled Playwright
- [CRM Testing Examples](./onlytests-crm-prompts.js) - Практические примеры для CRM

### Полезные команды

```bash
# Установка Playwright
npm install -D @playwright/test
npx playwright install

# Запуск тестов
npx playwright test

# Запуск в UI режиме
npx playwright test --ui

# Генерация тестов
npx playwright codegen

# Просмотр трассировки
npx playwright show-trace trace.zip
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

*Создано с использованием [Playwright Documentation](https://playwright.help/docs/writing-tests) и интеграции с OnlyTests платформой для CRM системы "AI-Fitness Coach 360".*
