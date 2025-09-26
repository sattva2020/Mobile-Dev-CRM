import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Типы данных
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  labels: string[];
  assignee?: string;
  estimatedTime?: number; // в часах
  actualTime?: number; // в часах
  estimatedHours?: number; // в часах (алиас)
  actualHours?: number; // в часах (алиас)
  progress?: number; // прогресс выполнения в процентах
  githubIssueId?: number;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  category: 'security' | 'performance' | 'accessibility' | 'testing' | 'documentation' | 'other';
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  source: 'github' | 'ai' | 'system';
}

export interface GitHubSettings {
  token?: string;
  repository: {
    owner: string;
    name: string;
  };
  autoSync: boolean;
  syncInterval: number; // в минутах
}

export interface AISettings {
  enabled: boolean;
  apiKey?: string;
  model: string;
  autoSuggestions: boolean;
}

export interface Settings {
  github: GitHubSettings;
  ai: AISettings;
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
}

export interface AppState {
  tasks: Task[];
  notifications: Notification[];
  settings: Settings;
  loading: boolean;
  error?: string;
  githubService: boolean;
  aiService: boolean;
  lastSync?: string;
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    averageCompletionTime: number;
  };
}

// Типы действий
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_GITHUB_SERVICE'; payload: boolean }
  | { type: 'SET_AI_SERVICE'; payload: boolean }
  | { type: 'SET_LAST_SYNC'; payload: string }
  | { type: 'SET_STATS'; payload: Partial<AppState['stats']> }
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'LOAD_NOTIFICATIONS'; payload: Notification[] };

// Начальное состояние
const initialState: AppState = {
  tasks: [],
  notifications: [],
  settings: {
    github: {
      repository: {
        owner: 'sattva2020',
        name: 'Ai-fitness-Coach-360',
      },
      autoSync: false,
      syncInterval: 30,
    },
    ai: {
      enabled: false,
      model: 'grok-4-fast',
      autoSuggestions: false,
    },
    theme: 'light',
    language: 'ru',
    notifications: {
      enabled: true,
      sound: true,
      desktop: false,
    },
  },
  loading: false,
  githubService: false,
  aiService: false,
  stats: {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    averageCompletionTime: 0,
  },
};

// Редьюсер
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        stats: {
          ...state.stats,
          totalTasks: state.stats.totalTasks + 1,
        },
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : task
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        stats: {
          ...state.stats,
          totalTasks: Math.max(0, state.stats.totalTasks - 1),
        },
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'SET_GITHUB_SERVICE':
      return { ...state, githubService: action.payload };

    case 'SET_AI_SERVICE':
      return { ...state, aiService: action.payload };

    case 'SET_LAST_SYNC':
      return { ...state, lastSync: action.payload };

    case 'SET_STATS':
      return {
        ...state,
        stats: { ...state.stats, ...action.payload },
      };

    case 'LOAD_TASKS':
      return {
        ...state,
        tasks: action.payload,
        stats: {
          ...state.stats,
          totalTasks: action.payload.length,
          completedTasks: action.payload.filter(t => t.status === 'done').length,
          inProgressTasks: action.payload.filter(t => t.status === 'in-progress').length,
          overdueTasks: action.payload.filter(t => 
            t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
          ).length,
        },
      };

    case 'LOAD_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
}

// Контекст
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Хук для использования контекста
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Провайдер
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Загружаем данные из localStorage при инициализации
  React.useEffect(() => {
    const savedTasks = localStorage.getItem('dev-crm-tasks');
    const savedNotifications = localStorage.getItem('dev-crm-notifications');
    const savedSettings = localStorage.getItem('dev-crm-settings');

    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        dispatch({ type: 'LOAD_TASKS', payload: tasks });
      } catch (error) {
        console.error('Ошибка загрузки задач:', error);
      }
    }

    if (savedNotifications) {
      try {
        const notifications = JSON.parse(savedNotifications);
        dispatch({ type: 'LOAD_NOTIFICATIONS', payload: notifications });
      } catch (error) {
        console.error('Ошибка загрузки уведомлений:', error);
      }
    }

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
      }
    }
  }, []);

  // Сохраняем данные в localStorage при изменениях
  React.useEffect(() => {
    localStorage.setItem('dev-crm-tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  React.useEffect(() => {
    localStorage.setItem('dev-crm-notifications', JSON.stringify(state.notifications));
  }, [state.notifications]);

  React.useEffect(() => {
    localStorage.setItem('dev-crm-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Хук для использования контекста
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp должен использоваться внутри AppProvider');
  }

  const { state, dispatch } = context;

  // Вспомогательные функции
  const actions = {
    // Управление задачами
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
      return newTask.id;
    },

    updateTask: (id: string, updates: Partial<Task>) => {
      dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
    },

    deleteTask: (id: string) => {
      dispatch({ type: 'DELETE_TASK', payload: id });
    },

    // Управление уведомлениями
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => {
      const newNotification: Notification = {
        ...notification,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
      return newNotification.id;
    },

    markNotificationRead: (id: string) => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
    },

    clearNotifications: () => {
      dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    },

    // Управление настройками
    updateSettings: (settings: Partial<Settings>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    },

    // Управление сервисами
    setGitHubService: (enabled: boolean) => {
      dispatch({ type: 'SET_GITHUB_SERVICE', payload: enabled });
    },

    setAIService: (enabled: boolean) => {
      dispatch({ type: 'SET_AI_SERVICE', payload: enabled });
    },

    setLastSync: (timestamp: string) => {
      dispatch({ type: 'SET_LAST_SYNC', payload: timestamp });
    },

    // Утилиты
    setLoading: (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    },

    setError: (error: string | undefined) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
  };

  return { state, actions };
};