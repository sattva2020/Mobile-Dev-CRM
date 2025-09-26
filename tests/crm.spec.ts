import { test, expect } from '@playwright/test';

test.describe('CRM System Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на главную страницу CRM
    await page.goto('http://localhost:3001');
  });

  test('CRM загружается корректно', async ({ page }) => {
    // Проверяем, что страница загрузилась
    await expect(page).toHaveTitle(/CRM|AI-Fitness Coach 360/);
    
    // Проверяем наличие основных элементов
    await expect(page.locator('body')).toBeVisible();
  });

  test('Проверка API подключения', async ({ page }) => {
    // Проверяем, что API доступен
    const response = await page.request.get('http://localhost:3000');
    expect(response.status()).toBe(200);
  });

  test('Проверка проектов API', async ({ page }) => {
    // Проверяем API проектов
    const response = await page.request.get('http://localhost:3000/projects');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('Проверка задач API', async ({ page }) => {
    // Проверяем API задач
    const response = await page.request.get('http://localhost:3000/tasks');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('Проверка требований API', async ({ page }) => {
    // Проверяем API требований
    const response = await page.request.get('http://localhost:3000/requirements');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('Проверка уведомлений API', async ({ page }) => {
    // Проверяем API уведомлений
    const response = await page.request.get('http://localhost:3000/notifications');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('Создание нового проекта', async ({ page }) => {
    // Создаем новый проект через API
    const newProject = {
      name: 'Test Project - Playwright Test',
      description: 'Проект для тестирования Playwright',
      status: 'active'
    };

    const response = await page.request.post('http://localhost:3000/projects', {
      data: newProject
    });
    
    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data.name).toBe(newProject.name);
    expect(data.description).toBe(newProject.description);
    expect(data.status).toBe(newProject.status);
  });

  test('Создание новой задачи', async ({ page }) => {
    // Сначала создаем проект
    const projectResponse = await page.request.post('http://localhost:3000/projects', {
      data: {
        name: 'Test Project for Task',
        description: 'Проект для тестирования задач',
        status: 'active'
      }
    });
    
    const project = await projectResponse.json();
    
    // Создаем задачу
    const newTask = {
      title: 'Test Task - Playwright Test',
      description: 'Задача для тестирования Playwright',
      status: 'todo',
      priority: 'medium',
      category: 'testing',
      assignee: 'Test User',
      labels: ['test', 'playwright'],
      estimated_hours: 2,
      project_id: project.id
    };

    const response = await page.request.post('http://localhost:3000/tasks', {
      data: newTask
    });
    
    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data.title).toBe(newTask.title);
    expect(data.description).toBe(newTask.description);
    expect(data.status).toBe(newTask.status);
    expect(data.priority).toBe(newTask.priority);
  });

  test('Фильтрация задач по статусу', async ({ page }) => {
    // Проверяем фильтрацию задач по статусу
    const todoResponse = await page.request.get('http://localhost:3000/tasks?status=eq.todo');
    expect(todoResponse.status()).toBe(200);
    
    const todoData = await todoResponse.json();
    expect(Array.isArray(todoData)).toBe(true);
    
    // Проверяем, что все задачи имеют статус 'todo'
    for (const task of todoData) {
      expect(task.status).toBe('todo');
    }
  });

  test('Фильтрация задач по приоритету', async ({ page }) => {
    // Проверяем фильтрацию задач по приоритету
    const highPriorityResponse = await page.request.get('http://localhost:3000/tasks?priority=eq.high');
    expect(highPriorityResponse.status()).toBe(200);
    
    const highPriorityData = await highPriorityResponse.json();
    expect(Array.isArray(highPriorityData)).toBe(true);
    
    // Проверяем, что все задачи имеют высокий приоритет
    for (const task of highPriorityData) {
      expect(task.priority).toBe('high');
    }
  });

  test('Обновление задачи', async ({ page }) => {
    // Сначала создаем задачу
    const createResponse = await page.request.post('http://localhost:3000/tasks', {
      data: {
        title: 'Task to Update',
        description: 'Задача для обновления',
        status: 'todo',
        priority: 'medium',
        category: 'testing'
      }
    });
    
    const task = await createResponse.json();
    
    // Обновляем задачу
    const updateData = {
      status: 'in-progress',
      progress: 50,
      actual_hours: 1
    };

    const updateResponse = await page.request.patch(`http://localhost:3000/tasks?id=eq.${task.id}`, {
      data: updateData
    });
    
    expect(updateResponse.status()).toBe(204);
  });

  test('Проверка производительности API', async ({ page }) => {
    const startTime = Date.now();
    
    // Выполняем несколько запросов
    await Promise.all([
      page.request.get('http://localhost:3000/projects'),
      page.request.get('http://localhost:3000/tasks'),
      page.request.get('http://localhost:3000/requirements'),
      page.request.get('http://localhost:3000/notifications')
    ]);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Проверяем, что время ответа приемлемое (менее 5 секунд)
    expect(responseTime).toBeLessThan(5000);
  });

  test('Проверка CORS настроек', async ({ page }) => {
    // Проверяем CORS заголовки
    const response = await page.request.get('http://localhost:3000/projects', {
      headers: {
        'Origin': 'http://localhost:3001'
      }
    });
    
    expect(response.status()).toBe(200);
    
    // Проверяем наличие CORS заголовков
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeDefined();
  });
});
