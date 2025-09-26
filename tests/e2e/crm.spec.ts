import { test, expect } from '@playwright/test';

/**
 * E2E тесты для CRM-системы
 * Покрывают основные пользовательские сценарии
 */
test.describe('CRM System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Переход на главную страницу CRM
    await page.goto('http://localhost:3000');
    
    // Ожидание загрузки приложения
    await page.waitForLoadState('networkidle');
  });

  test.describe('Navigation', () => {
    test('should display main navigation', async ({ page }) => {
      // Проверяем наличие основных элементов навигации
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=Задачи')).toBeVisible();
      await expect(page.locator('text=GitHub')).toBeVisible();
      await expect(page.locator('text=AI')).toBeVisible();
      await expect(page.locator('text=Тестирование')).toBeVisible();
    });

    test('should navigate between tabs', async ({ page }) => {
      // Тестируем навигацию между вкладками
      await page.click('text=Задачи');
      await expect(page.locator('text=Доска задач')).toBeVisible();

      await page.click('text=GitHub');
      await expect(page.locator('text=GitHub интеграция')).toBeVisible();

      await page.click('text=AI');
      await expect(page.locator('text=AI Аналитика')).toBeVisible();

      await page.click('text=Тестирование');
      await expect(page.locator('text=Панель тестирования')).toBeVisible();
    });
  });

  test.describe('Task Management', () => {
    test('should create a new task', async ({ page }) => {
      // Переходим на вкладку задач
      await page.click('text=Задачи');
      await expect(page.locator('text=Доска задач')).toBeVisible();

      // Нажимаем кнопку создания задачи
      await page.click('text=Новая задача');
      
      // Заполняем форму задачи
      await page.fill('input[name="title"]', 'Тестовая задача');
      await page.fill('textarea[name="description"]', 'Описание тестовой задачи');
      await page.selectOption('select[name="priority"]', 'high');
      await page.selectOption('select[name="category"]', 'testing');
      await page.fill('input[name="assignee"]', 'Тестер');
      await page.fill('input[name="estimatedHours"]', '4');
      
      // Сохраняем задачу
      await page.click('button[type="submit"]');

      // Проверяем, что задача появилась на доске
      await expect(page.locator('text=Тестовая задача')).toBeVisible();
    });

    test('should edit an existing task', async ({ page }) => {
      // Переходим на вкладку задач
      await page.click('text=Задачи');
      
      // Находим задачу и нажимаем кнопку редактирования
      const taskCard = page.locator('[data-testid="task-card"]').first();
      await taskCard.locator('button[title="Редактировать"]').click();
      
      // Изменяем заголовок задачи
      await page.fill('input[name="title"]', 'Обновленная задача');
      
      // Сохраняем изменения
      await page.click('button[type="submit"]');
      
      // Проверяем, что изменения сохранились
      await expect(page.locator('text=Обновленная задача')).toBeVisible();
    });

    test('should delete a task', async ({ page }) => {
      // Переходим на вкладку задач
      await page.click('text=Задачи');
      
      // Находим задачу и нажимаем кнопку удаления
      const taskCard = page.locator('[data-testid="task-card"]').first();
      await taskCard.locator('button[title="Удалить"]').click();
      
      // Подтверждаем удаление
      await page.click('text=Да, удалить');
      
      // Проверяем, что задача исчезла
      await expect(taskCard).not.toBeVisible();
    });

    test('should change task status', async ({ page }) => {
      // Переходим на вкладку задач
      await page.click('text=Задачи');
      
      // Находим задачу в колонке "К выполнению"
      const todoColumn = page.locator('[data-testid="column-todo"]');
      const taskCard = todoColumn.locator('[data-testid="task-card"]').first();
      
      // Перетаскиваем задачу в колонку "В работе"
      const inProgressColumn = page.locator('[data-testid="column-in-progress"]');
      await taskCard.dragTo(inProgressColumn);
      
      // Проверяем, что задача переместилась
      await expect(inProgressColumn.locator('text=Тестовая задача')).toBeVisible();
    });
  });

  test.describe('GitHub Integration', () => {
    test('should display GitHub integration page', async ({ page }) => {
      // Переходим на вкладку GitHub
      await page.click('text=GitHub');
      
      // Проверяем наличие элементов GitHub интеграции
      await expect(page.locator('text=GitHub интеграция')).toBeVisible();
      await expect(page.locator('text=Репозиторий')).toBeVisible();
      await expect(page.locator('text=Статистика')).toBeVisible();
    });

    test('should test GitHub connection', async ({ page }) => {
      // Переходим на вкладку GitHub
      await page.click('text=GitHub');
      
      // Нажимаем кнопку тестирования соединения
      await page.click('text=Тестировать соединение');
      
      // Ждем результата тестирования
      await expect(page.locator('text=Соединение успешно')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('AI Analytics', () => {
    test('should display AI analytics page', async ({ page }) => {
      // Переходим на вкладку AI
      await page.click('text=AI');
      
      // Проверяем наличие элементов AI аналитики
      await expect(page.locator('text=AI Аналитика')).toBeVisible();
      await expect(page.locator('text=Анализ проекта')).toBeVisible();
      await expect(page.locator('text=Приоритизация задач')).toBeVisible();
    });

    test('should run AI analysis', async ({ page }) => {
      // Переходим на вкладку AI
      await page.click('text=AI');
      
      // Нажимаем кнопку запуска анализа
      await page.click('text=Запустить анализ');
      
      // Ждем завершения анализа
      await expect(page.locator('text=Анализ завершен')).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Testing Panel', () => {
    test('should display testing panel', async ({ page }) => {
      // Переходим на вкладку тестирования
      await page.click('text=Тестирование');
      
      // Проверяем наличие элементов панели тестирования
      await expect(page.locator('text=Панель тестирования')).toBeVisible();
      await expect(page.locator('text=Безопасность')).toBeVisible();
      await expect(page.locator('text=Производительность')).toBeVisible();
      await expect(page.locator('text=Доступность')).toBeVisible();
    });

    test('should run security tests', async ({ page }) => {
      // Переходим на вкладку тестирования
      await page.click('text=Тестирование');
      
      // Нажимаем кнопку запуска тестов безопасности
      await page.click('text=Запустить тесты безопасности');
      
      // Ждем завершения тестов
      await expect(page.locator('text=Тесты безопасности завершены')).toBeVisible({ timeout: 10000 });
    });

    test('should run performance tests', async ({ page }) => {
      // Переходим на вкладку тестирования
      await page.click('text=Тестирование');
      
      // Нажимаем кнопку запуска тестов производительности
      await page.click('text=Запустить тесты производительности');
      
      // Ждем завершения тестов
      await expect(page.locator('text=Тесты производительности завершены')).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Устанавливаем размер экрана мобильного устройства
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Проверяем, что навигация работает на мобильном
      await expect(page.locator('nav')).toBeVisible();
      
      // Проверяем, что можно переключаться между вкладками
      await page.click('text=Задачи');
      await expect(page.locator('text=Доска задач')).toBeVisible();
    });

    test('should work on tablet devices', async ({ page }) => {
      // Устанавливаем размер экрана планшета
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Проверяем, что интерфейс адаптируется
      await expect(page.locator('nav')).toBeVisible();
      
      // Проверяем, что доска задач отображается корректно
      await page.click('text=Задачи');
      await expect(page.locator('text=Доска задач')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Блокируем сетевые запросы
      await page.route('**/*', route => route.abort());
      
      // Переходим на вкладку задач
      await page.click('text=Задачи');
      
      // Проверяем, что отображается сообщение об ошибке
      await expect(page.locator('text=Ошибка загрузки')).toBeVisible();
    });

    test('should handle form validation errors', async ({ page }) => {
      // Переходим на вкладку задач
      await page.click('text=Задачи');
      
      // Пытаемся создать задачу без обязательных полей
      await page.click('text=Новая задача');
      await page.click('button[type="submit"]');
      
      // Проверяем, что отображаются ошибки валидации
      await expect(page.locator('text=Заголовок обязателен')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load quickly', async ({ page }) => {
      const startTime = Date.now();
      
      // Переходим на главную страницу
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Проверяем, что страница загружается менее чем за 3 секунды
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle large number of tasks', async ({ page }) => {
      // Переходим на вкладку задач
      await page.click('text=Задачи');
      
      // Создаем несколько задач
      for (let i = 0; i < 10; i++) {
        await page.click('text=Новая задача');
        await page.fill('input[name="title"]', `Задача ${i + 1}`);
        await page.fill('textarea[name="description"]', `Описание задачи ${i + 1}`);
        await page.click('button[type="submit"]');
      }
      
      // Проверяем, что все задачи отображаются
      await expect(page.locator('[data-testid="task-card"]')).toHaveCount(10);
    });
  });
});
