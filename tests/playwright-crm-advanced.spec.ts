import { test, expect } from '@playwright/test';
import { authenticatedPage, adminPage } from '../fixtures/auth';
import { testData } from '../fixtures/test-data';

/**
 * 🎭 Playwright Advanced CRM Tests
 * Расширенные тесты для CRM системы с использованием OnlyTests
 * Основано на: https://playwright.help/docs/intro
 */

test.describe('CRM Advanced Features', () => {
  test.describe('Project Management', () => {
    test('should create complex project with AI analysis', async ({ page }) => {
      await page.goto('/projects');
      await page.getByRole('button', { name: 'New Project' }).click();
      
      // Заполнение основной информации
      await page.getByLabel('Project Name').fill('AI Integration Project');
      await page.getByLabel('Description').fill('Complex project with AI integration and multiple tasks');
      await page.getByRole('combobox', { name: 'Priority' }).selectOption('high');
      await page.getByRole('combobox', { name: 'Status' }).selectOption('in-progress');
      
      // AI анализ проекта
      await page.getByRole('button', { name: 'Analyze with AI' }).click();
      await expect(page.getByText('AI Analysis Complete')).toBeVisible({ timeout: 15000 });
      
      // Проверка AI рекомендаций
      await expect(page.getByText('AI Recommendations')).toBeVisible();
      await expect(page.getByText('Estimated Duration')).toBeVisible();
      await expect(page.getByText('Risk Assessment')).toBeVisible();
      
      // Сохранение проекта
      await page.getByRole('button', { name: 'Save Project' }).click();
      await expect(page.getByText('Project created successfully')).toBeVisible();
      
      // Проверка отображения в списке
      await expect(page.getByText('AI Integration Project')).toBeVisible();
      await expect(page.getByText('High Priority')).toBeVisible();
    });

    test('should handle project with multiple tasks', async ({ page }) => {
      // Создание проекта
      await page.goto('/projects');
      await page.getByRole('button', { name: 'New Project' }).click();
      await page.getByLabel('Project Name').fill('Multi-Task Project');
      await page.getByLabel('Description').fill('Project with multiple tasks');
      await page.getByRole('button', { name: 'Save Project' }).click();
      
      // Переход к задачам
      await page.getByRole('link', { name: 'Tasks' }).click();
      
      // Создание первой задачи
      await page.getByRole('button', { name: 'New Task' }).click();
      await page.getByLabel('Task Title').fill('Task 1: Setup');
      await page.getByLabel('Description').fill('Initial setup task');
      await page.getByRole('combobox', { name: 'Priority' }).selectOption('high');
      await page.getByRole('button', { name: 'Save Task' }).click();
      
      // Создание второй задачи
      await page.getByRole('button', { name: 'New Task' }).click();
      await page.getByLabel('Task Title').fill('Task 2: Implementation');
      await page.getByLabel('Description').fill('Main implementation task');
      await page.getByRole('combobox', { name: 'Priority' }).selectOption('medium');
      await page.getByRole('button', { name: 'Save Task' }).click();
      
      // Проверка задач
      await expect(page.getByText('Task 1: Setup')).toBeVisible();
      await expect(page.getByText('Task 2: Implementation')).toBeVisible();
      
      // Проверка связи с проектом
      await page.getByRole('link', { name: 'Projects' }).click();
      await expect(page.getByText('Multi-Task Project')).toBeVisible();
      await expect(page.getByText('2 tasks')).toBeVisible();
    });

    test('should handle project deletion with confirmation', async ({ page }) => {
      // Создание проекта для удаления
      await page.goto('/projects');
      await page.getByRole('button', { name: 'New Project' }).click();
      await page.getByLabel('Project Name').fill('Project to Delete');
      await page.getByLabel('Description').fill('This project will be deleted');
      await page.getByRole('button', { name: 'Save Project' }).click();
      
      // Удаление проекта
      await page.getByRole('button', { name: 'Delete Project' }).click();
      
      // Подтверждение удаления
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByText('Are you sure you want to delete this project?')).toBeVisible();
      await page.getByRole('button', { name: 'Confirm Delete' }).click();
      
      // Проверка удаления
      await expect(page.getByText('Project deleted successfully')).toBeVisible();
      await expect(page.getByText('Project to Delete')).not.toBeVisible();
    });
  });

  test.describe('Task Management', () => {
    test('should create task with AI recommendations', async ({ page }) => {
      await page.goto('/tasks');
      await page.getByRole('button', { name: 'New Task' }).click();
      
      // Заполнение основной информации
      await page.getByLabel('Task Title').fill('AI Model Training');
      await page.getByLabel('Description').fill('Train AI model for data analysis');
      await page.getByRole('combobox', { name: 'Priority' }).selectOption('critical');
      await page.getByRole('combobox', { name: 'Status' }).selectOption('todo');
      
      // Получение AI рекомендаций
      await page.getByRole('button', { name: 'Get AI Recommendations' }).click();
      await expect(page.getByText('AI Recommendations Generated')).toBeVisible({ timeout: 15000 });
      
      // Проверка AI рекомендаций
      await expect(page.getByText('Recommended Duration')).toBeVisible();
      await expect(page.getByText('Skill Requirements')).toBeVisible();
      await expect(page.getByText('Risk Factors')).toBeVisible();
      
      // Сохранение задачи
      await page.getByRole('button', { name: 'Save Task' }).click();
      await expect(page.getByText('Task created successfully')).toBeVisible();
      
      // Проверка отображения
      await expect(page.getByText('AI Model Training')).toBeVisible();
      await expect(page.getByText('Critical Priority')).toBeVisible();
    });

    test('should update task status through workflow', async ({ page }) => {
      // Создание задачи
      await page.goto('/tasks');
      await page.getByRole('button', { name: 'New Task' }).click();
      await page.getByLabel('Task Title').fill('Workflow Task');
      await page.getByLabel('Description').fill('Task to test workflow');
      await page.getByRole('button', { name: 'Save Task' }).click();
      
      // Изменение статуса на "In Progress"
      await page.getByRole('button', { name: 'Start Task' }).click();
      await expect(page.getByText('Task started')).toBeVisible();
      await expect(page.getByText('In Progress')).toBeVisible();
      
      // Изменение статуса на "Review"
      await page.getByRole('button', { name: 'Mark for Review' }).click();
      await expect(page.getByText('Task marked for review')).toBeVisible();
      await expect(page.getByText('Review')).toBeVisible();
      
      // Изменение статуса на "Completed"
      await page.getByRole('button', { name: 'Complete Task' }).click();
      await expect(page.getByText('Task completed')).toBeVisible();
      await expect(page.getByText('Completed')).toBeVisible();
    });

    test('should handle task assignment and reassignment', async ({ page }) => {
      // Создание задачи
      await page.goto('/tasks');
      await page.getByRole('button', { name: 'New Task' }).click();
      await page.getByLabel('Task Title').fill('Assignable Task');
      await page.getByLabel('Description').fill('Task for assignment testing');
      await page.getByRole('button', { name: 'Save Task' }).click();
      
      // Назначение задачи
      await page.getByRole('button', { name: 'Assign Task' }).click();
      await page.getByRole('combobox', { name: 'Assignee' }).selectOption('user1');
      await page.getByRole('button', { name: 'Assign' }).click();
      
      // Проверка назначения
      await expect(page.getByText('Task assigned to user1')).toBeVisible();
      await expect(page.getByText('Assigned to: user1')).toBeVisible();
      
      // Переназначение задачи
      await page.getByRole('button', { name: 'Reassign Task' }).click();
      await page.getByRole('combobox', { name: 'Assignee' }).selectOption('user2');
      await page.getByRole('button', { name: 'Reassign' }).click();
      
      // Проверка переназначения
      await expect(page.getByText('Task reassigned to user2')).toBeVisible();
      await expect(page.getByText('Assigned to: user2')).toBeVisible();
    });
  });

  test.describe('AI Integration', () => {
    test('should test all AI service connections', async ({ page }) => {
      await page.goto('/ai-settings');
      
      // Тест OpenRouter подключения
      await page.getByRole('button', { name: 'Test OpenRouter Connection' }).click();
      await expect(page.getByText('OpenRouter: Connected')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('OpenRouter: Response Time')).toBeVisible();
      
      // Тест LM Studio подключения
      await page.getByRole('button', { name: 'Test LM Studio Connection' }).click();
      await expect(page.getByText('LM Studio: Connected')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('LM Studio: Response Time')).toBeVisible();
      
      // Тест xAI подключения
      await page.getByRole('button', { name: 'Test xAI Connection' }).click();
      await expect(page.getByText('xAI: Connected')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('xAI: Response Time')).toBeVisible();
      
      // Проверка общего статуса
      await expect(page.getByText('All AI Services: Connected')).toBeVisible();
    });

    test('should handle AI service failures gracefully', async ({ page }) => {
      // Мокирование ошибки OpenRouter
      await page.route('**/api/ai/openrouter', async route => {
        await route.fulfill({ status: 500, body: 'OpenRouter Service Unavailable' });
      });

      await page.goto('/ai-settings');
      
      // Тест с ошибкой
      await page.getByRole('button', { name: 'Test OpenRouter Connection' }).click();
      await expect(page.getByText('OpenRouter: Connection Failed')).toBeVisible();
      await expect(page.getByText('OpenRouter: Service Unavailable')).toBeVisible();
      
      // Проверка обработки ошибки
      await expect(page.getByText('AI Service Error')).toBeVisible();
      await expect(page.getByText('Please check your configuration')).toBeVisible();
    });

    test('should perform AI analysis with real data', async ({ page }) => {
      await page.goto('/projects');
      await page.getByRole('button', { name: 'New Project' }).click();
      
      // Заполнение данных для AI анализа
      await page.getByLabel('Project Name').fill('AI Analysis Test Project');
      await page.getByLabel('Description').fill('Project for testing AI analysis capabilities');
      await page.getByRole('combobox', { name: 'Priority' }).selectOption('high');
      
      // Запуск AI анализа
      await page.getByRole('button', { name: 'Analyze with AI' }).click();
      
      // Ожидание завершения анализа
      await expect(page.getByText('AI Analysis Complete')).toBeVisible({ timeout: 20000 });
      
      // Проверка результатов анализа
      await expect(page.getByText('AI Analysis Results')).toBeVisible();
      await expect(page.getByText('Estimated Duration')).toBeVisible();
      await expect(page.getByText('Risk Assessment')).toBeVisible();
      await expect(page.getByText('Resource Requirements')).toBeVisible();
      
      // Проверка качества анализа
      const analysisText = await page.getByText('AI Analysis Results').textContent();
      expect(analysisText).toContain('Analysis');
    });
  });

  test.describe('User Management', () => {
    test('should create user with proper permissions', async ({ page }) => {
      await page.goto('/users');
      await page.getByRole('button', { name: 'New User' }).click();
      
      // Заполнение информации о пользователе
      await page.getByLabel('Username').fill('testuser');
      await page.getByLabel('Email').fill('test@example.com');
      await page.getByLabel('Password').fill('password123');
      await page.getByLabel('Confirm Password').fill('password123');
      await page.getByRole('combobox', { name: 'Role' }).selectOption('user');
      
      // Настройка разрешений
      await page.getByRole('checkbox', { name: 'Can Create Projects' }).check();
      await page.getByRole('checkbox', { name: 'Can Create Tasks' }).check();
      await page.getByRole('checkbox', { name: 'Can Access AI Features' }).check();
      
      // Сохранение пользователя
      await page.getByRole('button', { name: 'Save User' }).click();
      await expect(page.getByText('User created successfully')).toBeVisible();
      
      // Проверка отображения в списке
      await expect(page.getByText('testuser')).toBeVisible();
      await expect(page.getByText('test@example.com')).toBeVisible();
      await expect(page.getByText('User')).toBeVisible();
    });

    test('should handle user authentication flow', async ({ page }) => {
      // Переход на страницу входа
      await page.goto('/login');
      
      // Заполнение формы входа
      await page.getByLabel('Username').fill('testuser');
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Проверка успешного входа
      await expect(page.getByText('Welcome, testuser')).toBeVisible();
      await expect(page.getByText('Dashboard')).toBeVisible();
      
      // Проверка навигации
      await page.getByRole('link', { name: 'Projects' }).click();
      await expect(page.getByText('Projects')).toBeVisible();
      
      await page.getByRole('link', { name: 'Tasks' }).click();
      await expect(page.getByText('Tasks')).toBeVisible();
      
      // Выход из системы
      await page.getByRole('button', { name: 'Logout' }).click();
      await expect(page.getByText('Login')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Установка мобильного размера экрана
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/projects');
      
      // Проверка мобильного меню
      await page.getByRole('button', { name: 'Menu' }).click();
      await expect(page.getByRole('navigation')).toBeVisible();
      
      // Проверка создания проекта на мобильном
      await page.getByRole('button', { name: 'New Project' }).click();
      await page.getByLabel('Project Name').fill('Mobile Project');
      await page.getByLabel('Description').fill('Project created on mobile');
      await page.getByRole('button', { name: 'Save Project' }).click();
      
      // Проверка отображения
      await expect(page.getByText('Mobile Project')).toBeVisible();
    });

    test('should work on tablet devices', async ({ page }) => {
      // Установка планшетного размера экрана
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/tasks');
      
      // Проверка создания задачи на планшете
      await page.getByRole('button', { name: 'New Task' }).click();
      await page.getByLabel('Task Title').fill('Tablet Task');
      await page.getByLabel('Description').fill('Task created on tablet');
      await page.getByRole('button', { name: 'Save Task' }).click();
      
      // Проверка отображения
      await expect(page.getByText('Tablet Task')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/projects');
      
      // Навигация с клавиатуры
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Проверка фокуса на кнопке
      await expect(page.getByRole('button', { name: 'New Project' })).toBeFocused();
      
      // Создание проекта с клавиатуры
      await page.keyboard.press('Enter');
      await page.getByLabel('Project Name').fill('Keyboard Project');
      await page.keyboard.press('Tab');
      await page.getByLabel('Description').fill('Project created with keyboard');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Проверка создания
      await expect(page.getByText('Keyboard Project')).toBeVisible();
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      await page.goto('/projects');
      
      // Проверка ARIA атрибутов
      await expect(page.getByRole('button', { name: 'New Project' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('navigation')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load pages within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/projects');
      await expect(page.getByText('Projects')).toBeVisible();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Менее 3 секунд
    });

    test('should handle large datasets efficiently', async ({ page }) => {
      // Мокирование большого количества проектов
      await page.route('**/api/projects', async route => {
        const projects = Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          name: `Project ${i + 1}`,
          priority: 'medium',
          status: 'in-progress'
        }));
        await route.fulfill({ json: projects });
      });

      await page.goto('/projects');
      
      // Проверка загрузки большого количества проектов
      await expect(page.getByText('Project 1')).toBeVisible();
      await expect(page.getByText('Project 100')).toBeVisible();
      
      // Проверка производительности
      const startTime = Date.now();
      await page.getByRole('button', { name: 'Next Page' }).click();
      const navigationTime = Date.now() - startTime;
      expect(navigationTime).toBeLessThan(1000); // Менее 1 секунды
    });
  });
});
