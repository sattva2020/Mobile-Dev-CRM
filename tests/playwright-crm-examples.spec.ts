import { test, expect } from '@playwright/test';

/**
 * 🎭 Playwright CRM Examples - Практические примеры тестирования CRM системы
 * Основано на документации: https://playwright.help/docs/writing-tests
 * Интеграция с OnlyTests: https://www.onlytest.io/ru
 */

test.describe('CRM System - AI-Fitness Coach 360', () => {
  test.beforeEach(async ({ page }) => {
    // Переход на главную страницу CRM
    await page.goto('http://localhost:3000');
    
    // Ожидание загрузки приложения
    await expect(page.getByRole('heading', { name: /AI-Fitness Coach 360/i })).toBeVisible();
  });

  test.describe('Project Management', () => {
    test('should create new project with AI analysis', async ({ page }) => {
      // Навигация к созданию проекта
      await page.getByRole('button', { name: 'New Project' }).click();
      
      // Заполнение формы проекта
      await page.getByLabel('Project Name').fill('AI Integration Project');
      await page.getByLabel('Description').fill('Integration of AI services for fitness analysis');
      
      // Выбор приоритета
      await page.getByRole('combobox', { name: 'Priority' }).selectOption('high');
      
      // Выбор статуса
      await page.getByRole('combobox', { name: 'Status' }).selectOption('in-progress');
      
      // AI анализ проекта
      await page.getByRole('button', { name: 'Analyze with AI' }).click();
      
      // Ожидание завершения AI анализа
      await expect(page.getByText('AI Analysis Complete')).toBeVisible({ timeout: 10000 });
      
      // Сохранение проекта
      await page.getByRole('button', { name: 'Save Project' }).click();
      
      // Проверка успешного создания
      await expect(page.getByText('Project created successfully')).toBeVisible();
      await expect(page.getByText('AI Integration Project')).toBeVisible();
    });

    test('should edit existing project', async ({ page }) => {
      // Поиск существующего проекта
      await page.getByRole('textbox', { name: 'Search projects' }).fill('AI Integration');
      
      // Ожидание результатов поиска
      await expect(page.getByText('AI Integration Project')).toBeVisible();
      
      // Открытие для редактирования
      await page.getByRole('button', { name: 'Edit' }).first().click();
      
      // Изменение названия проекта
      await page.getByLabel('Project Name').fill('Updated AI Integration Project');
      
      // Изменение описания
      await page.getByLabel('Description').fill('Updated description with enhanced AI capabilities');
      
      // Сохранение изменений
      await page.getByRole('button', { name: 'Update Project' }).click();
      
      // Проверка успешного обновления
      await expect(page.getByText('Project updated successfully')).toBeVisible();
      await expect(page.getByText('Updated AI Integration Project')).toBeVisible();
    });

    test('should delete project with confirmation', async ({ page }) => {
      // Поиск проекта для удаления
      await page.getByRole('textbox', { name: 'Search projects' }).fill('AI Integration');
      
      // Ожидание результатов
      await expect(page.getByText('AI Integration Project')).toBeVisible();
      
      // Нажатие на кнопку удаления
      await page.getByRole('button', { name: 'Delete' }).first().click();
      
      // Подтверждение удаления в диалоге
      await expect(page.getByText('Are you sure you want to delete this project?')).toBeVisible();
      await page.getByRole('button', { name: 'Confirm Delete' }).click();
      
      // Проверка успешного удаления
      await expect(page.getByText('Project deleted successfully')).toBeVisible();
    });
  });

  test.describe('Task Management', () => {
    test('should create task with AI recommendations', async ({ page }) => {
      // Переход к задачам
      await page.getByRole('link', { name: 'Tasks' }).click();
      
      // Создание новой задачи
      await page.getByRole('button', { name: 'New Task' }).click();
      
      // Заполнение формы задачи
      await page.getByLabel('Task Title').fill('Implement AI Model Training');
      await page.getByLabel('Description').fill('Train AI model for fitness pose recognition');
      
      // Выбор приоритета
      await page.getByRole('combobox', { name: 'Priority' }).selectOption('critical');
      
      // Выбор статуса
      await page.getByRole('combobox', { name: 'Status' }).selectOption('todo');
      
      // AI рекомендации
      await page.getByRole('button', { name: 'Get AI Recommendations' }).click();
      
      // Ожидание AI рекомендаций
      await expect(page.getByText('AI Recommendations Generated')).toBeVisible({ timeout: 15000 });
      
      // Сохранение задачи
      await page.getByRole('button', { name: 'Save Task' }).click();
      
      // Проверка создания
      await expect(page.getByText('Task created successfully')).toBeVisible();
      await expect(page.getByText('Implement AI Model Training')).toBeVisible();
    });

    test('should update task status', async ({ page }) => {
      // Переход к задачам
      await page.getByRole('link', { name: 'Tasks' }).click();
      
      // Поиск задачи
      await page.getByRole('textbox', { name: 'Search tasks' }).fill('AI Model Training');
      
      // Ожидание результатов
      await expect(page.getByText('Implement AI Model Training')).toBeVisible();
      
      // Изменение статуса через dropdown
      await page.getByRole('combobox', { name: 'Status' }).first().selectOption('in-progress');
      
      // Проверка обновления статуса
      await expect(page.getByText('Status updated successfully')).toBeVisible();
    });
  });

  test.describe('AI Integration', () => {
    test('should test AI service connectivity', async ({ page }) => {
      // Переход к настройкам AI
      await page.getByRole('link', { name: 'AI Settings' }).click();
      
      // Проверка статуса AI сервисов
      await expect(page.getByText('AI Services Status')).toBeVisible();
      
      // Тест подключения к OpenRouter
      await page.getByRole('button', { name: 'Test OpenRouter Connection' }).click();
      await expect(page.getByText('OpenRouter: Connected')).toBeVisible({ timeout: 10000 });
      
      // Тест подключения к LM Studio
      await page.getByRole('button', { name: 'Test LM Studio Connection' }).click();
      await expect(page.getByText('LM Studio: Connected')).toBeVisible({ timeout: 10000 });
      
      // Тест подключения к xAI
      await page.getByRole('button', { name: 'Test xAI Connection' }).click();
      await expect(page.getByText('xAI: Connected')).toBeVisible({ timeout: 10000 });
    });

    test('should perform AI analysis on project', async ({ page }) => {
      // Переход к проектам
      await page.getByRole('link', { name: 'Projects' }).click();
      
      // Выбор проекта для анализа
      await page.getByText('AI Integration Project').click();
      
      // Запуск AI анализа
      await page.getByRole('button', { name: 'Run AI Analysis' }).click();
      
      // Ожидание завершения анализа
      await expect(page.getByText('AI Analysis in Progress')).toBeVisible();
      await expect(page.getByText('AI Analysis Complete')).toBeVisible({ timeout: 30000 });
      
      // Проверка результатов анализа
      await expect(page.getByText('Analysis Results')).toBeVisible();
      await expect(page.getByText('Risk Assessment')).toBeVisible();
      await expect(page.getByText('Recommendations')).toBeVisible();
    });
  });

  test.describe('User Interface', () => {
    test('should have responsive design', async ({ page }) => {
      // Тест на мобильном размере
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Проверка мобильного меню
      await page.getByRole('button', { name: 'Menu' }).click();
      await expect(page.getByRole('navigation')).toBeVisible();
      
      // Тест на планшетном размере
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Проверка адаптивности
      await expect(page.getByRole('main')).toBeVisible();
      
      // Тест на десктопном размере
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Проверка полного интерфейса
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Навигация с клавиатуры
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Проверка открытия меню
      await expect(page.getByRole('dialog')).toBeVisible();
      
      // Закрытие с клавиатуры
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });
  });

  test.describe('Data Validation', () => {
    test('should validate required fields', async ({ page }) => {
      // Попытка создания проекта без обязательных полей
      await page.getByRole('button', { name: 'New Project' }).click();
      await page.getByRole('button', { name: 'Save Project' }).click();
      
      // Проверка сообщений об ошибках
      await expect(page.getByText('Project name is required')).toBeVisible();
      await expect(page.getByText('Description is required')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      // Переход к настройкам пользователя
      await page.getByRole('button', { name: 'User Settings' }).click();
      
      // Ввод невалидного email
      await page.getByLabel('Email').fill('invalid-email');
      await page.getByRole('button', { name: 'Save Settings' }).click();
      
      // Проверка ошибки валидации
      await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load pages within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      // Переход на страницу проектов
      await page.goto('http://localhost:3000/projects');
      
      // Ожидание загрузки
      await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
      
      const loadTime = Date.now() - startTime;
      
      // Проверка времени загрузки (менее 3 секунд)
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle large datasets', async ({ page }) => {
      // Переход к проектам
      await page.goto('http://localhost:3000/projects');
      
      // Проверка пагинации
      await expect(page.getByRole('button', { name: 'Next Page' })).toBeVisible();
      
      // Переход на следующую страницу
      await page.getByRole('button', { name: 'Next Page' }).click();
      
      // Проверка загрузки данных
      await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 5000 });
    });
  });
});

// Хуки для очистки данных после тестов
test.afterEach(async ({ page }) => {
  // Очистка тестовых данных если необходимо
  // await page.evaluate(() => {
  //   localStorage.clear();
  //   sessionStorage.clear();
  // });
});

// Глобальная настройка
test.beforeAll(async () => {
  console.log('🚀 Starting Playwright CRM Tests');
});

test.afterAll(async () => {
  console.log('✅ Playwright CRM Tests Completed');
});
