// Константы для статусов задач
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  REVIEW: 'review',
  DONE: 'done',
} as const;

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'К выполнению',
  [TASK_STATUS.IN_PROGRESS]: 'В работе',
  [TASK_STATUS.REVIEW]: 'На проверке',
  [TASK_STATUS.DONE]: 'Выполнено',
} as const;

// Константы для приоритетов задач
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Низкий',
  [TASK_PRIORITY.MEDIUM]: 'Средний',
  [TASK_PRIORITY.HIGH]: 'Высокий',
  [TASK_PRIORITY.CRITICAL]: 'Критический',
} as const;

// Константы для категорий задач
export const TASK_CATEGORY = {
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  ACCESSIBILITY: 'accessibility',
  TESTING: 'testing',
  DOCUMENTATION: 'documentation',
  OTHER: 'other',
} as const;

export const TASK_CATEGORY_LABELS = {
  [TASK_CATEGORY.SECURITY]: 'Безопасность',
  [TASK_CATEGORY.PERFORMANCE]: 'Производительность',
  [TASK_CATEGORY.ACCESSIBILITY]: 'Доступность',
  [TASK_CATEGORY.TESTING]: 'Тестирование',
  [TASK_CATEGORY.DOCUMENTATION]: 'Документация',
  [TASK_CATEGORY.OTHER]: 'Другое',
} as const;

// Константы для типов уведомлений
export const NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
} as const;

export const NOTIFICATION_TYPE_LABELS = {
  [NOTIFICATION_TYPE.SUCCESS]: 'Успех',
  [NOTIFICATION_TYPE.WARNING]: 'Предупреждение',
  [NOTIFICATION_TYPE.ERROR]: 'Ошибка',
  [NOTIFICATION_TYPE.INFO]: 'Информация',
} as const;

// Константы для источников уведомлений
export const NOTIFICATION_SOURCE = {
  GITHUB: 'github',
  AI: 'ai',
  SYSTEM: 'system',
} as const;

export const NOTIFICATION_SOURCE_LABELS = {
  [NOTIFICATION_SOURCE.GITHUB]: 'GitHub',
  [NOTIFICATION_SOURCE.AI]: 'AI',
  [NOTIFICATION_SOURCE.SYSTEM]: 'Система',
} as const;

// Константы для тем
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const THEME_LABELS = {
  [THEME.LIGHT]: 'Светлая',
  [THEME.DARK]: 'Темная',
} as const;

// Константы для языков
export const LANGUAGE = {
  RU: 'ru',
  EN: 'en',
} as const;

export const LANGUAGE_LABELS = {
  [LANGUAGE.RU]: 'Русский',
  [LANGUAGE.EN]: 'English',
} as const;

// Константы для AI моделей
export const AI_MODEL = {
  GROK_4_FAST: 'grok-4-fast',
  GPT_4: 'gpt-4',
  CLAUDE_3: 'claude-3',
} as const;

export const AI_MODEL_LABELS = {
  [AI_MODEL.GROK_4_FAST]: 'Grok-4-Fast (рекомендуется)',
  [AI_MODEL.GPT_4]: 'GPT-4',
  [AI_MODEL.CLAUDE_3]: 'Claude-3',
} as const;

// Константы для цветов
export const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
} as const;

// Константы для размеров
export const SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const;

// Константы для breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Константы для localStorage ключей
export const STORAGE_KEYS = {
  TASKS: 'dev-crm-tasks',
  NOTIFICATIONS: 'dev-crm-notifications',
  SETTINGS: 'dev-crm-settings',
  THEME: 'dev-crm-theme',
  LANGUAGE: 'dev-crm-language',
} as const;

// Константы для API endpoints
export const API_ENDPOINTS = {
  GITHUB: {
    BASE: 'https://api.github.com',
    ISSUES: '/repos/{owner}/{repo}/issues',
    REPOSITORY: '/repos/{owner}/{repo}',
  },
  OPENROUTER: {
    BASE: 'https://openrouter.ai/api/v1',
    CHAT: '/chat/completions',
  },
} as const;

// Константы для лимитов
export const LIMITS = {
  MAX_TASK_TITLE_LENGTH: 100,
  MAX_TASK_DESCRIPTION_LENGTH: 1000,
  MAX_LABELS_PER_TASK: 10,
  MAX_NOTIFICATIONS: 100,
  MAX_TASKS_PER_PAGE: 50,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
} as const;

// Константы для валидации
export const VALIDATION_RULES = {
  REQUIRED: (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Поле обязательно для заполнения';
    }
    return undefined;
  },
  MIN_LENGTH: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Минимальная длина: ${min} символов`;
    }
    return undefined;
  },
  MAX_LENGTH: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Максимальная длина: ${max} символов`;
    }
    return undefined;
  },
  EMAIL: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Некорректный email адрес';
    }
    return undefined;
  },
  URL: (value: string) => {
    try {
      new URL(value);
      return undefined;
    } catch {
      return 'Некорректный URL';
    }
  },
  POSITIVE_NUMBER: (value: number) => {
    if (value && value <= 0) {
      return 'Значение должно быть положительным';
    }
    return undefined;
  },
} as const;

// Константы для сообщений
export const MESSAGES = {
  SUCCESS: {
    TASK_CREATED: 'Задача успешно создана',
    TASK_UPDATED: 'Задача успешно обновлена',
    TASK_DELETED: 'Задача успешно удалена',
    SETTINGS_SAVED: 'Настройки успешно сохранены',
    SYNC_COMPLETED: 'Синхронизация завершена',
    NOTIFICATION_SENT: 'Уведомление отправлено',
  },
  ERROR: {
    TASK_CREATE_FAILED: 'Ошибка создания задачи',
    TASK_UPDATE_FAILED: 'Ошибка обновления задачи',
    TASK_DELETE_FAILED: 'Ошибка удаления задачи',
    SETTINGS_SAVE_FAILED: 'Ошибка сохранения настроек',
    SYNC_FAILED: 'Ошибка синхронизации',
    NETWORK_ERROR: 'Ошибка сети',
    UNKNOWN_ERROR: 'Произошла неизвестная ошибка',
  },
  WARNING: {
    UNSAVED_CHANGES: 'У вас есть несохраненные изменения',
    TASK_OVERDUE: 'Задача просрочена',
    LOW_STORAGE: 'Мало места для хранения',
  },
  INFO: {
    WELCOME: 'Добро пожаловать в Mobile Dev CRM',
    NO_TASKS: 'Нет задач для отображения',
    NO_NOTIFICATIONS: 'Нет новых уведомлений',
    SYNC_IN_PROGRESS: 'Синхронизация в процессе...',
  },
} as const;

// Константы для анимаций
export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
} as const;

// Константы для иконок
export const ICONS = {
  TASK: '📋',
  SECURITY: '🔒',
  PERFORMANCE: '⚡',
  ACCESSIBILITY: '♿',
  TESTING: '🧪',
  DOCUMENTATION: '📚',
  GITHUB: '🐙',
  AI: '🤖',
  NOTIFICATION: '🔔',
  SETTINGS: '⚙️',
  DASHBOARD: '📊',
  SUCCESS: '✅',
  WARNING: '⚠️',
  ERROR: '❌',
  INFO: 'ℹ️',
} as const;

// Константы для меток
export const COMMON_LABELS = [
  'urgent',
  'bug',
  'feature',
  'enhancement',
  'documentation',
  'testing',
  'security',
  'performance',
  'accessibility',
  'ui',
  'ux',
  'api',
  'database',
  'frontend',
  'backend',
  'mobile',
  'desktop',
  'web',
] as const;

// Константы для сортировки
export const SORT_OPTIONS = {
  TITLE: 'title',
  PRIORITY: 'priority',
  STATUS: 'status',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  DUE_DATE: 'dueDate',
} as const;

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// Константы для фильтров
export const FILTER_OPTIONS = {
  ALL: 'all',
  TODAY: 'today',
  THIS_WEEK: 'this-week',
  THIS_MONTH: 'this-month',
  OVERDUE: 'overdue',
  ASSIGNED_TO_ME: 'assigned-to-me',
  CREATED_BY_ME: 'created-by-me',
} as const;

// Константы для экспорта
export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf',
} as const;

export const EXPORT_FORMAT_LABELS = {
  [EXPORT_FORMATS.JSON]: 'JSON',
  [EXPORT_FORMATS.CSV]: 'CSV',
  [EXPORT_FORMATS.PDF]: 'PDF',
} as const;
