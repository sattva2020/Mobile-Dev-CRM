import { test, expect } from '../../src/core/test-base';

/**
 * 🎭 CRM Tests using OnlyTests Approach
 * Тесты CRM системы с использованием OnlyTests архитектуры
 * Основано на: https://github.com/e-semenyuk/onlytests-qa
 */

test.describe('CRM Projects - OnlyTests Approach', () => {
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

  test('should delete project', async ({ projectsPage }) => {
    // Создание проекта для удаления
    await projectsPage.navigate();
    await projectsPage.createProject('Project to Delete', 'This project will be deleted');
    
    // Удаление проекта
    await projectsPage.deleteProject('Project to Delete');
    
    // Проверка удаления
    const projectExists = await projectsPage.getProjectByName('Project to Delete');
    expect(projectExists).toBe(false);
  });
});

test.describe('CRM Tasks - OnlyTests Approach', () => {
  test('should create new task', async ({ tasksPage }) => {
    await tasksPage.navigate();
    await tasksPage.createTask('Test Task', 'Test task description', 'medium');
    
    const taskExists = await tasksPage.getTaskByTitle('Test Task');
    expect(taskExists).toBe(true);
  });

  test('should create task with AI recommendations', async ({ tasksPage }) => {
    await tasksPage.navigate();
    await tasksPage.createTaskWithAI('AI Task', 'AI task description', 'critical');
    
    const taskExists = await tasksPage.getTaskByTitle('AI Task');
    expect(taskExists).toBe(true);
  });

  test('should update task status', async ({ tasksPage }) => {
    await tasksPage.navigate();
    await tasksPage.createTask('Status Task', 'Task for status testing');
    
    await tasksPage.updateTaskStatus('Status Task', 'in-progress');
    
    // Проверка обновления статуса
    const statusElement = tasksPage.page.getByText('Status Task').locator('..').getByText('In Progress');
    await expect(statusElement).toBeVisible();
  });
});

test.describe('CRM AI Integration - OnlyTests Approach', () => {
  test('should test all AI services', async ({ aiSettingsPage }) => {
    await aiSettingsPage.navigate();
    
    const results = await aiSettingsPage.testAllAIServices();
    
    expect(results.openrouter).toBe(true);
    expect(results.lmstudio).toBe(true);
    expect(results.xai).toBe(true);
  });

  test('should handle AI service failure gracefully', async ({ aiSettingsPage }) => {
    await aiSettingsPage.navigate();
    
    // Мокирование ошибки OpenRouter
    await aiSettingsPage.page.route('**/api/ai/openrouter', async route => {
      await route.fulfill({ status: 500, body: 'Service Unavailable' });
    });
    
    const openrouterConnected = await aiSettingsPage.testOpenRouterConnection();
    expect(openrouterConnected).toBe(false);
  });

  test('should test individual AI services', async ({ aiSettingsPage }) => {
    await aiSettingsPage.navigate();
    
    const openrouterConnected = await aiSettingsPage.testOpenRouterConnection();
    const lmstudioConnected = await aiSettingsPage.testLMStudioConnection();
    const xaiConnected = await aiSettingsPage.testXAIConnection();
    
    expect(openrouterConnected).toBe(true);
    expect(lmstudioConnected).toBe(true);
    expect(xaiConnected).toBe(true);
  });
});

test.describe('CRM User Workflows - OnlyTests Approach', () => {
  test('should complete full project workflow', async ({ projectsPage, tasksPage }) => {
    // 1. Создание проекта
    await projectsPage.navigate();
    await projectsPage.createProjectWithAI('Workflow Project', 'Complete workflow project', 'high');
    
    // 2. Создание задач для проекта
    await tasksPage.navigate();
    await tasksPage.createTask('Task 1: Setup', 'Initial setup task', 'high');
    await tasksPage.createTask('Task 2: Implementation', 'Main implementation task', 'medium');
    await tasksPage.createTask('Task 3: Testing', 'Testing and validation task', 'low');
    
    // 3. Проверка создания
    const projectExists = await projectsPage.getProjectByName('Workflow Project');
    const task1Exists = await tasksPage.getTaskByTitle('Task 1: Setup');
    const task2Exists = await tasksPage.getTaskByTitle('Task 2: Implementation');
    const task3Exists = await tasksPage.getTaskByTitle('Task 3: Testing');
    
    expect(projectExists).toBe(true);
    expect(task1Exists).toBe(true);
    expect(task2Exists).toBe(true);
    expect(task3Exists).toBe(true);
  });

  test('should handle project with multiple tasks', async ({ projectsPage, tasksPage }) => {
    // Создание проекта
    await projectsPage.navigate();
    await projectsPage.createProject('Multi-Task Project', 'Project with multiple tasks');
    
    // Создание задач
    await tasksPage.navigate();
    await tasksPage.createTask('Task A', 'First task', 'high');
    await tasksPage.createTask('Task B', 'Second task', 'medium');
    await tasksPage.createTask('Task C', 'Third task', 'low');
    
    // Проверка задач
    const taskAExists = await tasksPage.getTaskByTitle('Task A');
    const taskBExists = await tasksPage.getTaskByTitle('Task B');
    const taskCExists = await tasksPage.getTaskByTitle('Task C');
    
    expect(taskAExists).toBe(true);
    expect(taskBExists).toBe(true);
    expect(taskCExists).toBe(true);
  });
});

test.describe('CRM Error Handling - OnlyTests Approach', () => {
  test('should handle network errors gracefully', async ({ projectsPage }) => {
    // Мокирование сетевой ошибки
    await projectsPage.page.route('**/api/projects', async route => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    
    await projectsPage.navigate();
    await projectsPage.createProject('Error Project', 'Project for error testing');
    
    // Проверка отображения ошибки
    await expect(projectsPage.page.getByText('Error creating project')).toBeVisible();
    await expect(projectsPage.page.getByText('Please try again later')).toBeVisible();
  });

  test('should handle validation errors', async ({ projectsPage }) => {
    await projectsPage.navigate();
    
    // Попытка создания проекта с пустым именем
    await projectsPage.newProjectButton.click();
    await projectsPage.saveProjectButton.click();
    
    // Проверка валидации
    await expect(projectsPage.page.getByText('Project name is required')).toBeVisible();
  });

  test('should handle AI service timeout', async ({ aiSettingsPage }) => {
    // Мокирование таймаута AI сервиса
    await aiSettingsPage.page.route('**/api/ai/openrouter', async route => {
      await new Promise(resolve => setTimeout(resolve, 15000)); // 15 секунд задержки
      await route.fulfill({ status: 200, body: '{"status": "connected"}' });
    });
    
    await aiSettingsPage.navigate();
    
    const startTime = Date.now();
    const openrouterConnected = await aiSettingsPage.testOpenRouterConnection();
    const duration = Date.now() - startTime;
    
    // Проверка таймаута
    expect(duration).toBeGreaterThan(10000); // Больше 10 секунд
    expect(openrouterConnected).toBe(false); // Должен вернуть false из-за таймаута
  });
});

test.describe('CRM Performance - OnlyTests Approach', () => {
  test('should load pages within acceptable time', async ({ projectsPage }) => {
    const startTime = Date.now();
    
    await projectsPage.navigate();
    await projectsPage.page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Менее 3 секунд
  });

  test('should handle large datasets efficiently', async ({ projectsPage }) => {
    // Мокирование большого количества проектов
    await projectsPage.page.route('**/api/projects', async route => {
      const projects = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Project ${i + 1}`,
        priority: 'medium',
        status: 'in-progress'
      }));
      await route.fulfill({ json: projects });
    });

    await projectsPage.navigate();
    
    // Проверка загрузки большого количества проектов
    await expect(projectsPage.page.getByText('Project 1')).toBeVisible();
    await expect(projectsPage.page.getByText('Project 100')).toBeVisible();
    
    // Проверка производительности пагинации
    const startTime = Date.now();
    await projectsPage.page.getByRole('button', { name: 'Next Page' }).click();
    const navigationTime = Date.now() - startTime;
    expect(navigationTime).toBeLessThan(1000); // Менее 1 секунды
  });
});

test.describe('CRM Accessibility - OnlyTests Approach', () => {
  test('should support keyboard navigation', async ({ projectsPage }) => {
    await projectsPage.navigate();
    
    // Навигация с клавиатуры
    await projectsPage.page.keyboard.press('Tab');
    await projectsPage.page.keyboard.press('Tab');
    await projectsPage.page.keyboard.press('Enter');
    
    // Проверка фокуса на кнопке
    await expect(projectsPage.newProjectButton).toBeFocused();
  });

  test('should have proper ARIA attributes', async ({ projectsPage }) => {
    await projectsPage.navigate();
    
    // Проверка ARIA атрибутов
    await expect(projectsPage.newProjectButton).toBeVisible();
    await expect(projectsPage.page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(projectsPage.page.getByRole('main')).toBeVisible();
    await expect(projectsPage.page.getByRole('navigation')).toBeVisible();
  });
});

test.describe('CRM Mobile - OnlyTests Approach', () => {
  test('should work on mobile devices', async ({ projectsPage }) => {
    // Установка мобильного размера экрана
    await projectsPage.page.setViewportSize({ width: 375, height: 667 });
    
    await projectsPage.navigate();
    
    // Проверка мобильного меню
    await projectsPage.page.getByRole('button', { name: 'Menu' }).click();
    await expect(projectsPage.page.getByRole('navigation')).toBeVisible();
    
    // Проверка создания проекта на мобильном
    await projectsPage.createProject('Mobile Project', 'Project created on mobile');
    
    const projectExists = await projectsPage.getProjectByName('Mobile Project');
    expect(projectExists).toBe(true);
  });

  test('should work on tablet devices', async ({ tasksPage }) => {
    // Установка планшетного размера экрана
    await tasksPage.page.setViewportSize({ width: 768, height: 1024 });
    
    await tasksPage.navigate();
    
    // Проверка создания задачи на планшете
    await tasksPage.createTask('Tablet Task', 'Task created on tablet');
    
    const taskExists = await tasksPage.getTaskByTitle('Tablet Task');
    expect(taskExists).toBe(true);
  });
});
