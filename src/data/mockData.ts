import { Task, Notification } from '../types';

// Тестовые задачи
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Исправить уязвимость SQL injection',
    description: 'Обнаружена потенциальная уязвимость SQL injection в модуле работы с базой данных. Необходимо заменить прямые SQL запросы на параметризованные.',
    status: 'in-progress',
    priority: 'critical',
    labels: ['security', 'database', 'urgent'],
    assignee: 'Иван Петров',
    estimatedTime: 8,
    actualTime: 6,
    githubIssueId: 123,
    githubUrl: 'https://github.com/sattva2020/Ai-fitness-Coach-360/issues/123',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    dueDate: '2024-01-20T18:00:00Z',
    category: 'security',
  },
  {
    id: 'task-2',
    title: 'Оптимизировать производительность pose detection',
    description: 'Улучшить FPS распознавания поз с 15 до 30 кадров в секунду. Оптимизировать алгоритмы обработки ключевых точек.',
    status: 'review',
    priority: 'high',
    labels: ['performance', 'pose-detection', 'optimization'],
    assignee: 'Мария Сидорова',
    estimatedTime: 12,
    actualTime: 10,
    githubIssueId: 124,
    githubUrl: 'https://github.com/sattva2020/Ai-fitness-Coach-360/issues/124',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-17T16:45:00Z',
    dueDate: '2024-01-18T18:00:00Z',
    category: 'performance',
  },
  {
    id: 'task-3',
    title: 'Добавить accessibility labels для всех элементов',
    description: 'Обеспечить поддержку скринридеров, добавив accessibility labels для всех интерактивных элементов интерфейса.',
    status: 'todo',
    priority: 'medium',
    labels: ['accessibility', 'ui', 'screen-reader'],
    assignee: 'Алексей Козлов',
    estimatedTime: 6,
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
    dueDate: '2024-01-25T18:00:00Z',
    category: 'accessibility',
  },
  {
    id: 'task-4',
    title: 'Написать unit тесты для модуля аналитики',
    description: 'Создать комплексные unit тесты для модуля аналитики, покрывающие все основные функции и edge cases.',
    status: 'done',
    priority: 'medium',
    labels: ['testing', 'analytics', 'unit-tests'],
    assignee: 'Елена Волкова',
    estimatedTime: 8,
    actualTime: 7,
    githubIssueId: 125,
    githubUrl: 'https://github.com/sattva2020/Ai-fitness-Coach-360/issues/125',
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    dueDate: '2024-01-15T18:00:00Z',
    category: 'testing',
  },
  {
    id: 'task-5',
    title: 'Обновить документацию API',
    description: 'Обновить документацию API, добавить примеры использования и описание всех endpoints.',
    status: 'todo',
    priority: 'low',
    labels: ['documentation', 'api', 'swagger'],
    assignee: 'Дмитрий Новиков',
    estimatedTime: 4,
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z',
    dueDate: '2024-01-30T18:00:00Z',
    category: 'documentation',
  },
  {
    id: 'task-6',
    title: 'Исправить утечку памяти в TTS модуле',
    description: 'Обнаружена утечка памяти в модуле text-to-speech. Необходимо оптимизировать управление ресурсами.',
    status: 'in-progress',
    priority: 'high',
    labels: ['memory-leak', 'tts', 'performance'],
    assignee: 'Ольга Морозова',
    estimatedTime: 6,
    actualTime: 4,
    createdAt: '2024-01-16T13:00:00Z',
    updatedAt: '2024-01-17T10:30:00Z',
    dueDate: '2024-01-22T18:00:00Z',
    category: 'performance',
  },
  {
    id: 'task-7',
    title: 'Добавить поддержку темной темы',
    description: 'Реализовать переключение между светлой и темной темой с сохранением пользовательских предпочтений.',
    status: 'todo',
    priority: 'medium',
    labels: ['ui', 'theme', 'user-experience'],
    assignee: 'Сергей Лебедев',
    estimatedTime: 10,
    createdAt: '2024-01-17T15:00:00Z',
    updatedAt: '2024-01-17T15:00:00Z',
    dueDate: '2024-01-28T18:00:00Z',
    category: 'other',
  },
  {
    id: 'task-8',
    title: 'Улучшить обработку ошибок в камере',
    description: 'Добавить более информативные сообщения об ошибках при работе с камерой и fallback режимы.',
    status: 'review',
    priority: 'medium',
    labels: ['camera', 'error-handling', 'user-experience'],
    assignee: 'Анна Соколова',
    estimatedTime: 5,
    actualTime: 5,
    githubIssueId: 126,
    githubUrl: 'https://github.com/sattva2020/Ai-fitness-Coach-360/issues/126',
    createdAt: '2024-01-15T16:00:00Z',
    updatedAt: '2024-01-17T14:20:00Z',
    dueDate: '2024-01-19T18:00:00Z',
    category: 'other',
  },
];

// Тестовые уведомления
export const mockNotifications: Notification[] = [
  {
    id: 'notification-1',
    type: 'success',
    title: 'Задача выполнена',
    message: 'Unit тесты для модуля аналитики успешно написаны и проходят все проверки.',
    read: false,
    createdAt: '2024-01-17T12:00:00Z',
    source: 'github',
  },
  {
    id: 'notification-2',
    type: 'warning',
    title: 'Приближается срок выполнения',
    message: 'Задача "Оптимизировать производительность pose detection" должна быть завершена завтра.',
    read: false,
    createdAt: '2024-01-17T10:00:00Z',
    source: 'system',
  },
  {
    id: 'notification-3',
    type: 'error',
    title: 'Ошибка синхронизации с GitHub',
    message: 'Не удалось синхронизировать задачу #127 с GitHub. Проверьте настройки API.',
    read: true,
    createdAt: '2024-01-16T18:30:00Z',
    source: 'github',
  },
  {
    id: 'notification-4',
    type: 'info',
    title: 'AI предложение',
    message: 'AI обнаружил потенциальную оптимизацию в коде модуля pose detection. Хотите применить?',
    read: false,
    createdAt: '2024-01-17T08:00:00Z',
    source: 'ai',
  },
  {
    id: 'notification-5',
    type: 'success',
    title: 'Синхронизация завершена',
    message: 'Успешно синхронизировано 5 задач с GitHub. Все изменения применены.',
    read: true,
    createdAt: '2024-01-16T20:00:00Z',
    source: 'github',
  },
];

// Функция для получения случайной задачи
export const getRandomTask = (): Task => {
  const randomIndex = Math.floor(Math.random() * mockTasks.length);
  return { ...mockTasks[randomIndex], id: generateId('task') };
};

// Функция для получения случайного уведомления
export const getRandomNotification = (): Notification => {
  const types: Notification['type'][] = ['success', 'warning', 'error', 'info'];
  const sources: Notification['source'][] = ['github', 'ai', 'system'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomSource = sources[Math.floor(Math.random() * sources.length)];
  
  return {
    id: generateId('notification'),
    type: randomType,
    title: 'Тестовое уведомление',
    message: 'Это тестовое уведомление для демонстрации функциональности.',
    read: false,
    createdAt: new Date().toISOString(),
    source: randomSource,
  };
};

// Функция для генерации ID
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
