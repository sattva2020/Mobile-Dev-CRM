# 🎭 Playwright + OnlyTests Integration

> **Источник:** [OnlyTests QA Framework](https://github.com/e-semenyuk/onlytests-qa)  
> **Создано:** 2025-01-27  
> **Проект:** AI-Fitness Coach 360 CRM System

## 📋 Содержание

1. [OnlyTests Architecture](#onlytests-architecture)
2. [CRM Integration](#crm-integration)
3. [Page Objects](#page-objects)
4. [Test Organization](#test-organization)
5. [Environment Management](#environment-management)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

---

## 🏗️ OnlyTests Architecture

### Упрощенная архитектура

```
src/
├── config/
│   └── environment.ts          # Environment configuration
├── core/
│   ├── interfaces.ts           # Essential interfaces
│   ├── page.factory.ts         # Page factory
│   └── test-base.ts            # Test fixtures
├── pages/
│   ├── base-page.ts            # Base page object
│   ├── home-page.ts            # Home page
│   ├── projects-page.ts        # Projects page
│   ├── tasks-page.ts           # Tasks page
│   └── ai-settings-page.ts     # AI Settings page
├── setup/
│   └── test-setup.ts           # Test setup utilities
└── utils/
    ├── config-validator.ts     # Configuration validation
    ├── logger.ts               # Logging utilities
    └── test-utils.ts           # Common test utilities
```

### Ключевые принципы

1. **No over-engineering** - убраны ненужные интерфейсы
2. **Direct class usage** - страницы наследуют BasePage напрямую
3. **Simple test data** - хардкод значений в тестах
4. **Minimal configuration** - только необходимые переменные

---

## 🏢 CRM Integration

### BasePage для CRM

```typescript
// src/pages/base-page.ts
import { Page, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForElement(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async fillInput(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }
}
```

### ProjectsPage для CRM

```typescript
// src/pages/projects-page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ProjectsPage extends BasePage {
  // Локаторы
  private get newProjectButton() { 
    return this.page.getByRole('button', { name: 'New Project' }); 
  }
  
  private get projectNameInput() { 
    return this.page.getByLabel('Project Name'); 
  }
  
  private get projectDescriptionInput() { 
    return this.page.getByLabel('Description'); 
  }
  
  private get prioritySelect() { 
    return this.page.getByRole('combobox', { name: 'Priority' }); 
  }
  
  private get saveProjectButton() { 
    return this.page.getByRole('button', { name: 'Save Project' }); 
  }
  
  private get analyzeWithAIButton() { 
    return this.page.getByRole('button', { name: 'Analyze with AI' }); 
  }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async navigate(): Promise<void> {
    await super.navigate('/projects');
  }

  async createProject(name: string, description: string, priority: string = 'medium'): Promise<void> {
    await this.newProjectButton.click();
    await this.projectNameInput.fill(name);
    await this.projectDescriptionInput.fill(description);
    await this.prioritySelect.selectOption(priority);
    await this.saveProjectButton.click();
  }

  async createProjectWithAI(name: string, description: string, priority: string = 'high'): Promise<void> {
    await this.newProjectButton.click();
    await this.projectNameInput.fill(name);
    await this.projectDescriptionInput.fill(description);
    await this.prioritySelect.selectOption(priority);
    
    // AI анализ
    await this.analyzeWithAIButton.click();
    await this.page.waitForSelector('[data-testid="ai-analysis-complete"]', { timeout: 15000 });
    
    await this.saveProjectButton.click();
  }

  async getProjectByName(name: string): Promise<boolean> {
    try {
      await this.page.getByText(name).waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async deleteProject(name: string): Promise<void> {
    await this.page.getByText(name).click();
    await this.page.getByRole('button', { name: 'Delete Project' }).click();
    await this.page.getByRole('button', { name: 'Confirm Delete' }).click();
  }
}
```

### TasksPage для CRM

```typescript
// src/pages/tasks-page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class TasksPage extends BasePage {
  // Локаторы
  private get newTaskButton() { 
    return this.page.getByRole('button', { name: 'New Task' }); 
  }
  
  private get taskTitleInput() { 
    return this.page.getByLabel('Task Title'); 
  }
  
  private get taskDescriptionInput() { 
    return this.page.getByLabel('Description'); 
  }
  
  private get prioritySelect() { 
    return this.page.getByRole('combobox', { name: 'Priority' }); 
  }
  
  private get saveTaskButton() { 
    return this.page.getByRole('button', { name: 'Save Task' }); 
  }
  
  private get getAIRecommendationsButton() { 
    return this.page.getByRole('button', { name: 'Get AI Recommendations' }); 
  }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async navigate(): Promise<void> {
    await super.navigate('/tasks');
  }

  async createTask(title: string, description: string, priority: string = 'medium'): Promise<void> {
    await this.newTaskButton.click();
    await this.taskTitleInput.fill(title);
    await this.taskDescriptionInput.fill(description);
    await this.prioritySelect.selectOption(priority);
    await this.saveTaskButton.click();
  }

  async createTaskWithAI(title: string, description: string, priority: string = 'high'): Promise<void> {
    await this.newTaskButton.click();
    await this.taskTitleInput.fill(title);
    await this.taskDescriptionInput.fill(description);
    await this.prioritySelect.selectOption(priority);
    
    // AI рекомендации
    await this.getAIRecommendationsButton.click();
    await this.page.waitForSelector('[data-testid="ai-recommendations-complete"]', { timeout: 15000 });
    
    await this.saveTaskButton.click();
  }

  async getTaskByTitle(title: string): Promise<boolean> {
    try {
      await this.page.getByText(title).waitFor({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async updateTaskStatus(title: string, status: string): Promise<void> {
    await this.page.getByText(title).click();
    await this.page.getByRole('combobox', { name: 'Status' }).selectOption(status);
    await this.page.getByRole('button', { name: 'Update Task' }).click();
  }
}
```

### AISettingsPage для CRM

```typescript
// src/pages/ai-settings-page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class AISettingsPage extends BasePage {
  // Локаторы
  private get testOpenRouterButton() { 
    return this.page.getByRole('button', { name: 'Test OpenRouter Connection' }); 
  }
  
  private get testLMStudioButton() { 
    return this.page.getByRole('button', { name: 'Test LM Studio Connection' }); 
  }
  
  private get testXAIButton() { 
    return this.page.getByRole('button', { name: 'Test xAI Connection' }); 
  }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async navigate(): Promise<void> {
    await super.navigate('/ai-settings');
  }

  async testOpenRouterConnection(): Promise<boolean> {
    await this.testOpenRouterButton.click();
    try {
      await this.page.getByText('OpenRouter: Connected').waitFor({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async testLMStudioConnection(): Promise<boolean> {
    await this.testLMStudioButton.click();
    try {
      await this.page.getByText('LM Studio: Connected').waitFor({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async testXAIConnection(): Promise<boolean> {
    await this.testXAIButton.click();
    try {
      await this.page.getByText('xAI: Connected').waitFor({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async testAllAIServices(): Promise<{ openrouter: boolean; lmstudio: boolean; xai: boolean }> {
    const openrouter = await this.testOpenRouterConnection();
    const lmstudio = await this.testLMStudioConnection();
    const xai = await this.testXAIConnection();
    
    return { openrouter, lmstudio, xai };
  }
}
```

---

## 🧪 Test Organization

### Test Base с фикстурами

```typescript
// src/core/test-base.ts
import { test as base } from '@playwright/test';
import { ProjectsPage } from '../pages/projects-page';
import { TasksPage } from '../pages/tasks-page';
import { AISettingsPage } from '../pages/ai-settings-page';
import { env } from '../config/environment';

type CRMFixtures = {
  projectsPage: ProjectsPage;
  tasksPage: TasksPage;
  aiSettingsPage: AISettingsPage;
};

export const test = base.extend<CRMFixtures>({
  projectsPage: async ({ page }, use) => {
    const projectsPage = new ProjectsPage(page, env.getBaseUrl());
    await use(projectsPage);
  },

  tasksPage: async ({ page }, use) => {
    const tasksPage = new TasksPage(page, env.getBaseUrl());
    await use(tasksPage);
  },

  aiSettingsPage: async ({ page }, use) => {
    const aiSettingsPage = new AISettingsPage(page, env.getBaseUrl());
    await use(aiSettingsPage);
  },
});

export { expect } from '@playwright/test';
```

### Environment Configuration

```typescript
// src/config/environment.ts
export const env = {
  getBaseUrl(): string {
    return process.env.BASE_URL || 'http://localhost:3000';
  },

  getApiUrl(): string {
    return process.env.API_URL || 'http://localhost:3000/api';
  },

  getTimeout(): number {
    return parseInt(process.env.TIMEOUT || '30000');
  },

  getRetries(): number {
    return parseInt(process.env.RETRIES || '2');
  },

  isHeadless(): boolean {
    return process.env.HEADLESS === 'true';
  }
};
```

---

## 📝 Writing Tests

### Простые тесты с фикстурами

```typescript
// tests/ui/projects.spec.ts
import { test, expect } from '../../src/core/test-base';

test('should create new project', async ({ projectsPage }) => {
  await projectsPage.navigate();
  await projectsPage.createProject('Test Project', 'Test project description', 'high');
  
  const projectExists = await projectsPage.getProjectByName('Test Project');
  expect(projectExists).toBe(true);
});

test('should create project with AI analysis', async ({ projectsPage }) => {
  await projectsPage.navigate();
  await projectsPage.createProjectWithAI('AI Project', 'AI project description', 'critical');
  
  const projectExists = await projectsPage.getProjectByName('AI Project');
  expect(projectExists).toBe(true);
});
```

### Тесты с AI интеграцией

```typescript
// tests/ui/ai-integration.spec.ts
import { test, expect } from '../../src/core/test-base';

test('should test all AI services', async ({ aiSettingsPage }) => {
  await aiSettingsPage.navigate();
  
  const results = await aiSettingsPage.testAllAIServices();
  
  expect(results.openrouter).toBe(true);
  expect(results.lmstudio).toBe(true);
  expect(results.xai).toBe(true);
});

test('should handle AI service failure', async ({ aiSettingsPage }) => {
  await aiSettingsPage.navigate();
  
  // Мокирование ошибки OpenRouter
  await aiSettingsPage.page.route('**/api/ai/openrouter', async route => {
    await route.fulfill({ status: 500, body: 'Service Unavailable' });
  });
  
  const openrouterConnected = await aiSettingsPage.testOpenRouterConnection();
  expect(openrouterConnected).toBe(false);
});
```

### Тесты задач

```typescript
// tests/ui/tasks.spec.ts
import { test, expect } from '../../src/core/test-base';

test('should create task with AI recommendations', async ({ tasksPage }) => {
  await tasksPage.navigate();
  await tasksPage.createTaskWithAI('AI Task', 'AI task description', 'critical');
  
  const taskExists = await tasksPage.getTaskByTitle('AI Task');
  expect(taskExists).toBe(true);
});

test('should update task status', async ({ tasksPage }) => {
  await tasksPage.navigate();
  await tasksPage.createTask('Test Task', 'Test task description');
  
  await tasksPage.updateTaskStatus('Test Task', 'in-progress');
  
  // Проверка обновления статуса
  const statusElement = tasksPage.page.getByText('Test Task').locator('..').getByText('In Progress');
  await expect(statusElement).toBeVisible();
});
```

---

## 🔧 Configuration

### Playwright Configuration

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
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'CRM Desktop',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'CRM Mobile',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### Environment Variables

```bash
# .env
NODE_ENV=development
BASE_URL=http://localhost:3000
API_URL=http://localhost:3000/api
TIMEOUT=30000
RETRIES=2
HEADLESS=true
```

---

## 🏆 Best Practices

### 1. Упрощенная архитектура
- ✅ **Прямое наследование** - страницы наследуют BasePage
- ✅ **Простые локаторы** - семантические селекторы
- ✅ **Хардкод данных** - простые значения в тестах
- ✅ **Минимальная конфигурация** - только необходимое

### 2. Типобезопасность
- ✅ **TypeScript** - полная типизация
- ✅ **Интерфейсы** - четкие контракты
- ✅ **IntelliSense** - автодополнение в IDE

### 3. Поддерживаемость
- ✅ **Page Objects** - чистое разделение логики
- ✅ **Фикстуры** - переиспользуемые компоненты
- ✅ **Утилиты** - общие функции

### 4. Надежность
- ✅ **Встроенные повторы** - автоматические повторы
- ✅ **Обработка ошибок** - graceful handling
- ✅ **Ожидания** - встроенные waitFor

---

## 🎯 Заключение

**OnlyTests + Playwright + CRM = Упрощенное и эффективное тестирование!**

### Ключевые преимущества:
- ✅ **Простота** - легко понять и поддерживать
- ✅ **Типобезопасность** - полная поддержка TypeScript
- ✅ **Надежность** - встроенные механизмы повтора
- ✅ **Расширяемость** - легко добавлять новые страницы
- ✅ **CRM интеграция** - специализированные компоненты

### Формула успеха:
**OnlyTests Architecture + Playwright Rules + CRM System = Профессиональное тестирование!**

---

*Создано на основе [OnlyTests QA Framework](https://github.com/e-semenyuk/onlytests-qa) для проекта "AI-Fitness Coach 360".*
