#!/usr/bin/env node

/**
 * 🎯 OnlyTests Интеграция с CRM системой
 * Примеры использования OnlyTests для тестирования CRM
 */

// Генерация тестовых данных пользователей (OnlyTests стиль)
const generateTestUsers = () => {
  return [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Александр Иванов',
      email: 'alex.ivanov@example.com',
      phone: '+7 (999) 123-45-67',
      address: 'г. Москва, ул. Тверская, д. 1',
      role: 'Project Manager',
      department: 'IT',
    },
    {
      id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      name: 'Мария Петрова',
      email: 'maria.petrova@example.com',
      phone: '+7 (999) 234-56-78',
      address: 'г. Санкт-Петербург, Невский пр., д. 28',
      role: 'Developer',
      department: 'Development',
    },
    {
      id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
      name: 'Дмитрий Сидоров',
      email: 'dmitry.sidorov@example.com',
      phone: '+7 (999) 345-67-89',
      address: 'г. Екатеринбург, ул. Ленина, д. 15',
      role: 'QA Engineer',
      department: 'Quality Assurance',
    },
  ];
};

// Генерация тестовых проектов
const generateTestProjects = () => {
  return [
    {
      id: 'proj-001',
      name: 'CRM Development',
      description: 'Разработка CRM системы для управления проектами',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      manager: 'Александр Иванов',
    },
    {
      id: 'proj-002',
      name: 'Mobile App',
      description: 'Разработка мобильного приложения для CRM',
      status: 'planning',
      startDate: '2025-03-01',
      endDate: '2025-12-31',
      manager: 'Мария Петрова',
    },
    {
      id: 'proj-003',
      name: 'AI Integration',
      description: 'Интеграция AI функций в CRM систему',
      status: 'on-hold',
      startDate: '2025-02-01',
      endDate: '2025-08-31',
      manager: 'Дмитрий Сидоров',
    },
  ];
};

// Генерация тестовых задач
const generateTestTasks = () => {
  return [
    {
      id: 'task-001',
      title: 'Реализовать модуль управления задачами',
      description: 'Создать CRUD операции для задач с валидацией данных',
      status: 'in-progress',
      priority: 'high',
      category: 'development',
      assignee: 'Мария Петрова',
      projectId: 'proj-001',
      estimatedHours: 40,
      actualHours: 25,
      progress: 62,
      labels: ['backend', 'api', 'crud'],
      dueDate: '2025-02-15',
    },
    {
      id: 'task-002',
      title: 'Создать UI компоненты для задач',
      description: 'Разработать React компоненты для отображения и редактирования задач',
      status: 'todo',
      priority: 'medium',
      category: 'frontend',
      assignee: 'Александр Иванов',
      projectId: 'proj-001',
      estimatedHours: 24,
      actualHours: 0,
      progress: 0,
      labels: ['frontend', 'react', 'ui'],
      dueDate: '2025-02-20',
    },
    {
      id: 'task-003',
      title: 'Написать тесты для API',
      description: 'Создать unit и integration тесты для API endpoints',
      status: 'review',
      priority: 'high',
      category: 'testing',
      assignee: 'Дмитрий Сидоров',
      projectId: 'proj-001',
      estimatedHours: 16,
      actualHours: 16,
      progress: 100,
      labels: ['testing', 'api', 'unit-tests'],
      dueDate: '2025-01-30',
    },
  ];
};

// Генерация тестовых требований
const generateTestRequirements = () => {
  return [
    {
      id: 'req-001',
      title: 'Система должна поддерживать создание проектов',
      description:
        'Пользователь должен иметь возможность создавать новые проекты с указанием названия, описания и статуса',
      category: 'functional',
      priority: 'high',
      status: 'approved',
      version: 1,
      projectId: 'proj-001',
    },
    {
      id: 'req-002',
      title: 'Система должна поддерживать управление задачами',
      description:
        'Пользователь должен иметь возможность создавать, редактировать и удалять задачи',
      category: 'functional',
      priority: 'high',
      status: 'approved',
      version: 1,
      projectId: 'proj-001',
    },
    {
      id: 'req-003',
      title: 'Система должна интегрироваться с GitHub',
      description: 'CRM должна иметь возможность синхронизации с GitHub Issues',
      category: 'integration',
      priority: 'medium',
      status: 'draft',
      version: 1,
      projectId: 'proj-001',
    },
  ];
};

// Генерация тестовых уведомлений
const generateTestNotifications = () => {
  return [
    {
      id: 'notif-001',
      title: 'Новая задача назначена',
      message: "Вам назначена новая задача: 'Реализовать модуль управления задачами'",
      type: 'task_assigned',
      read: false,
      source: 'system',
      projectId: 'proj-001',
      createdAt: '2025-01-24T10:30:00Z',
    },
    {
      id: 'notif-002',
      title: 'Задача обновлена',
      message: "Задача 'Создать UI компоненты для задач' переведена в статус 'В работе'",
      type: 'task_updated',
      read: true,
      source: 'system',
      projectId: 'proj-001',
      createdAt: '2025-01-24T09:15:00Z',
    },
    {
      id: 'notif-003',
      title: 'Проект создан',
      message: "Создан новый проект 'CRM Development'",
      type: 'project_created',
      read: false,
      source: 'system',
      projectId: 'proj-001',
      createdAt: '2025-01-24T08:00:00Z',
    },
  ];
};

// Валидация данных с регулярными выражениями (OnlyTests стиль)
const validateData = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  date: /^\d{4}-\d{2}-\d{2}$/,
  datetime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
};

// Тестовые сценарии для Playwright MCP
const generatePlaywrightMCPCommands = () => {
  return [
    {
      command: 'use playwright mcp to test CRM with OnlyTests data:',
      description: 'Открыть CRM и протестировать с сгенерированными данными',
      steps: [
        'Open http://localhost:3001',
        'Navigate to Projects section',
        'Create project with OnlyTests generated data',
        'Add tasks using generated task data',
        'Assign users using generated user data',
        'Verify all data is saved correctly',
      ],
    },
    {
      command: 'use playwright mcp to test CRM validation:',
      description: 'Тестирование валидации данных',
      steps: [
        'Test email validation with OnlyTests patterns',
        'Test phone validation with Russian format',
        'Test UUID validation for IDs',
        'Test date format validation',
        'Verify error messages are displayed',
      ],
    },
    {
      command: 'use playwright mcp to test CRM API with OnlyTests data:',
      description: 'Тестирование API с сгенерированными данными',
      steps: [
        'POST /projects with generated project data',
        'POST /tasks with generated task data',
        'GET /projects and verify data integrity',
        'PUT /tasks and verify updates',
        'DELETE /tasks and verify deletion',
      ],
    },
  ];
};

// Генерация отчетов в стиле OnlyTests
const generateTestReport = () => {
  return {
    project: 'AI-Fitness Coach 360 CRM System',
    date: '2025-01-24',
    tester: 'OnlyTests + Playwright MCP',
    environment: {
      browser: 'Chrome 120',
      os: 'Windows 11',
      resolution: '1920x1080',
    },
    statistics: {
      totalTests: 13,
      passed: 13,
      failed: 0,
      skipped: 0,
      coverage: '100%',
    },
    testResults: {
      apiTests: '13/13 ✅',
      e2eTests: 'Full coverage ✅',
      performance: '< 200ms ✅',
      security: 'All checks passed ✅',
    },
    recommendations: [
      'Continue using OnlyTests for data generation',
      'Implement OnlyTests templates for documentation',
      'Use OnlyTests utilities for API testing',
      'Apply OnlyTests patterns for validation',
    ],
  };
};

// Экспорт функций для использования
module.exports = {
  generateTestUsers,
  generateTestProjects,
  generateTestTasks,
  generateTestRequirements,
  generateTestNotifications,
  validateData,
  generatePlaywrightMCPCommands,
  generateTestReport,
};

// Демонстрация использования
if (require.main === module) {
  console.log('🎯 OnlyTests Интеграция с CRM системой');
  console.log('=====================================');

  console.log('\n📊 Сгенерированные пользователи:');
  console.log(JSON.stringify(generateTestUsers(), null, 2));

  console.log('\n📋 Сгенерированные проекты:');
  console.log(JSON.stringify(generateTestProjects(), null, 2));

  console.log('\n✅ Сгенерированные задачи:');
  console.log(JSON.stringify(generateTestTasks(), null, 2));

  console.log('\n🎭 Команды для Playwright MCP:');
  generatePlaywrightMCPCommands().forEach((cmd, index) => {
    console.log(`\n${index + 1}. ${cmd.description}`);
    console.log(`Команда: ${cmd.command}`);
    console.log('Шаги:');
    cmd.steps.forEach((step) => console.log(`  - ${step}`));
  });

  console.log('\n📊 Отчет о тестировании:');
  console.log(JSON.stringify(generateTestReport(), null, 2));

  console.log('\n🚀 OnlyTests + Playwright MCP + CRM = Профессиональное тестирование!');
}
