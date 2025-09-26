import { test, expect } from '@playwright/test';

test.describe('CRM API Tests', () => {
  test('API сервер запущен', async ({ request }) => {
    // Проверяем, что API сервер доступен
    const response = await request.get('http://localhost:3000');
    expect(response.status()).toBe(200);
  });

  test('Проверка проектов API', async ({ request }) => {
    // Проверяем API проектов
    const response = await request.get('http://localhost:3000/projects');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('Проверка задач API', async ({ request }) => {
    // Проверяем API задач
    const response = await request.get('http://localhost:3000/tasks');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('Проверка требований API', async ({ request }) => {
    // Проверяем API требований
    const response = await request.get('http://localhost:3000/requirements');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('Проверка уведомлений API', async ({ request }) => {
    // Проверяем API уведомлений
    const response = await request.get('http://localhost:3000/notifications');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('Создание нового проекта', async ({ request }) => {
    // Создаем новый проект через API
    const newProject = {
      name: 'Test Project - Playwright API Test',
      description: 'Проект для тестирования Playwright API',
      status: 'active'
    };

    const response = await request.post('http://localhost:3000/projects', {
      data: newProject,
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    
    expect(response.status()).toBe(201);
    
    // Проверяем, что ответ не пустой
    const responseText = await response.text();
    expect(responseText).toBeTruthy();
    
    if (responseText) {
      const data = JSON.parse(responseText);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].name).toBe(newProject.name);
      expect(data[0].description).toBe(newProject.description);
      expect(data[0].status).toBe(newProject.status);
    }
  });

  test('Создание новой задачи', async ({ request }) => {
    // Сначала создаем проект
    const projectResponse = await request.post('http://localhost:3000/projects', {
      data: {
        name: 'Test Project for Task API',
        description: 'Проект для тестирования задач API',
        status: 'active'
      },
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    
    const projectText = await projectResponse.text();
    const projectData = projectText ? JSON.parse(projectText) : [];
    const project = Array.isArray(projectData) && projectData.length > 0 ? projectData[0] : { id: '00000000-0000-0000-0000-000000000000' };
    
    // Создаем задачу
    const newTask = {
      title: 'Test Task - Playwright API Test',
      description: 'Задача для тестирования Playwright API',
      status: 'todo',
      priority: 'medium',
      category: 'testing',
      assignee: 'Test User',
      labels: ['test', 'playwright', 'api'],
      estimated_hours: 2,
      project_id: project.id
    };

    const response = await request.post('http://localhost:3000/tasks', {
      data: newTask,
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    
    expect(response.status()).toBe(201);
    
    const responseText = await response.text();
    if (responseText) {
      const data = JSON.parse(responseText);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].title).toBe(newTask.title);
      expect(data[0].description).toBe(newTask.description);
      expect(data[0].status).toBe(newTask.status);
      expect(data[0].priority).toBe(newTask.priority);
    }
  });

  test('Фильтрация задач по статусу', async ({ request }) => {
    // Проверяем фильтрацию задач по статусу
    const todoResponse = await request.get('http://localhost:3000/tasks?status=eq.todo');
    expect(todoResponse.status()).toBe(200);
    
    const todoData = await todoResponse.json();
    expect(Array.isArray(todoData)).toBe(true);
    
    // Проверяем, что все задачи имеют статус 'todo'
    for (const task of todoData) {
      expect(task.status).toBe('todo');
    }
  });

  test('Фильтрация задач по приоритету', async ({ request }) => {
    // Проверяем фильтрацию задач по приоритету
    const highPriorityResponse = await request.get('http://localhost:3000/tasks?priority=eq.high');
    expect(highPriorityResponse.status()).toBe(200);
    
    const highPriorityData = await highPriorityResponse.json();
    expect(Array.isArray(highPriorityData)).toBe(true);
    
    // Проверяем, что все задачи имеют высокий приоритет
    for (const task of highPriorityData) {
      expect(task.priority).toBe('high');
    }
  });

  test('Обновление задачи', async ({ request }) => {
    // Сначала создаем задачу
    const createResponse = await request.post('http://localhost:3000/tasks', {
      data: {
        title: 'Task to Update API Test',
        description: 'Задача для обновления API тест',
        status: 'todo',
        priority: 'medium',
        category: 'testing'
      },
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    
    const taskText = await createResponse.text();
    const taskData = taskText ? JSON.parse(taskText) : [];
    const task = Array.isArray(taskData) && taskData.length > 0 ? taskData[0] : { id: '00000000-0000-0000-0000-000000000000' };
    
    // Обновляем задачу
    const updateData = {
      status: 'in-progress',
      progress: 50,
      actual_hours: 1
    };

    const updateResponse = await request.patch(`http://localhost:3000/tasks?id=eq.${task.id}`, {
      data: updateData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    expect(updateResponse.status()).toBe(204);
  });

  test('Проверка производительности API', async ({ request }) => {
    const startTime = Date.now();
    
    // Выполняем несколько запросов параллельно
    await Promise.all([
      request.get('http://localhost:3000/projects'),
      request.get('http://localhost:3000/tasks'),
      request.get('http://localhost:3000/requirements'),
      request.get('http://localhost:3000/notifications')
    ]);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Проверяем, что время ответа приемлемое (менее 5 секунд)
    expect(responseTime).toBeLessThan(5000);
  });

  test('Проверка CORS настроек', async ({ request }) => {
    // Проверяем CORS заголовки
    const response = await request.get('http://localhost:3000/projects', {
      headers: {
        'Origin': 'http://localhost:3001'
      }
    });
    
    expect(response.status()).toBe(200);
    
    // Проверяем наличие CORS заголовков
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeDefined();
  });

  test('Проверка OpenAPI схемы', async ({ request }) => {
    // Проверяем OpenAPI схему
    const response = await request.get('http://localhost:3000');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.swagger).toBe('2.0');
    expect(data.paths).toBeDefined();
    expect(data.paths['/projects']).toBeDefined();
    expect(data.paths['/tasks']).toBeDefined();
    expect(data.paths['/requirements']).toBeDefined();
    expect(data.paths['/notifications']).toBeDefined();
  });
});
