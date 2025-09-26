import { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';

// Хук для работы с localStorage
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Ошибка чтения localStorage ключа "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Ошибка записи localStorage ключа "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// Хук для debounce
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Хук для throttle
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

// Хук для работы с API
export const useApi = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

// Хук для работы с уведомлениями
export const useNotifications = () => {
  const { state, actions } = useApp();

  const addNotification = useCallback((notification: Omit<typeof state.notifications[0], 'id' | 'createdAt'>) => {
    actions.addNotification(notification);
  }, [actions]);

  const markAsRead = useCallback((id: string) => {
    actions.markNotificationRead(id);
  }, [actions]);

  const clearAll = useCallback(() => {
    actions.clearNotifications();
  }, [actions]);

  const unreadCount = state.notifications.filter(n => !n.read).length;

  return {
    notifications: state.notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearAll,
  };
};

// Хук для работы с задачами
export const useTasks = () => {
  const { state, actions } = useApp();

  const addTask = useCallback((task: Omit<typeof state.tasks[0], 'id' | 'createdAt' | 'updatedAt'>) => {
    return actions.addTask(task);
  }, [actions]);

  const updateTask = useCallback((id: string, updates: Partial<typeof state.tasks[0]>) => {
    actions.updateTask(id, updates);
  }, [actions]);

  const deleteTask = useCallback((id: string) => {
    actions.deleteTask(id);
  }, [actions]);

  const getTasksByStatus = useCallback((status: string) => {
    return state.tasks.filter(task => task.status === status);
  }, [state.tasks]);

  const getTasksByCategory = useCallback((category: string) => {
    return state.tasks.filter(task => task.category === category);
  }, [state.tasks]);

  const getTasksByPriority = useCallback((priority: string) => {
    return state.tasks.filter(task => task.priority === priority);
  }, [state.tasks]);

  const getOverdueTasks = useCallback(() => {
    const now = new Date();
    return state.tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < now && task.status !== 'done'
    );
  }, [state.tasks]);

  return {
    tasks: state.tasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getTasksByCategory,
    getTasksByPriority,
    getOverdueTasks,
    stats: state.stats,
  };
};

// Хук для работы с настройками
export const useSettings = () => {
  const { state, actions } = useApp();

  const updateSettings = useCallback((settings: Partial<typeof state.settings>) => {
    actions.updateSettings(settings);
  }, [actions]);

  const updateGitHubSettings = useCallback((githubSettings: Partial<typeof state.settings.github>) => {
    actions.updateSettings({
      github: { ...state.settings.github, ...githubSettings }
    });
  }, [actions, state.settings.github]);

  const updateAISettings = useCallback((aiSettings: Partial<typeof state.settings.ai>) => {
    actions.updateSettings({
      ai: { ...state.settings.ai, ...aiSettings }
    });
  }, [actions, state.settings.ai]);

  return {
    settings: state.settings,
    updateSettings,
    updateGitHubSettings,
    updateAISettings,
  };
};

// Хук для работы с GitHub
export const useGitHub = () => {
  const { state, actions } = useApp();

  const syncWithGitHub = useCallback(async () => {
    actions.setLoading(true);
    try {
      // Здесь будет логика синхронизации с GitHub
      await new Promise(resolve => setTimeout(resolve, 2000)); // Имитация
      actions.setLastSync(new Date().toISOString());
      actions.addNotification({
        type: 'success',
        title: 'Синхронизация завершена',
        message: 'Задачи успешно синхронизированы с GitHub',
        source: 'github',
        read: false,
      });
    } catch (error) {
      actions.addNotification({
        type: 'error',
        title: 'Ошибка синхронизации',
        message: 'Не удалось синхронизировать с GitHub',
        source: 'github',
        read: false,
      });
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const createGitHubIssue = useCallback(async (task: typeof state.tasks[0]) => {
    // Здесь будет логика создания Issue в GitHub
    console.log('Creating GitHub issue for task:', task.title);
  }, []);

  return {
    isConnected: state.githubService,
    lastSync: state.lastSync,
    syncWithGitHub,
    createGitHubIssue,
  };
};

// Хук для работы с AI
export const useAI = () => {
  const { state, actions } = useApp();

  const getSuggestions = useCallback(async (task: typeof state.tasks[0]) => {
    actions.setLoading(true);
    try {
      // Здесь будет логика получения предложений от AI
      await new Promise(resolve => setTimeout(resolve, 1500)); // Имитация
      actions.addNotification({
        type: 'info',
        title: 'AI предложение',
        message: 'AI предлагает оптимизацию для этой задачи',
        source: 'ai',
        read: false,
      });
    } catch (error) {
      actions.addNotification({
        type: 'error',
        title: 'Ошибка AI',
        message: 'Не удалось получить предложения от AI',
        source: 'ai',
        read: false,
      });
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const analyzeTask = useCallback(async (task: typeof state.tasks[0]) => {
    // Здесь будет логика анализа задачи AI
    console.log('Analyzing task with AI:', task.title);
  }, []);

  return {
    isEnabled: state.aiService,
    getSuggestions,
    analyzeTask,
  };
};

// Хук для работы с клавиатурой
export const useKeyboard = (callback: (key: string) => void, keys: string[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        event.preventDefault();
        callback(event.key);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [callback, keys]);
};

// Хук для работы с размером окна
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Хук для работы с видимостью страницы
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
};

// Хук для работы с копированием в буфер обмена
export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Ошибка копирования в буфер обмена:', error);
    }
  }, []);

  return { copied, copyToClipboard };
};

// Хук для работы с анимациями
export const useAnimation = (duration: number = 300) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), duration);
  }, [duration]);

  return { isAnimating, animate };
};

// Хук для работы с формами
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setTouchedField = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const validate = useCallback((validationRules: Record<keyof T, (value: any) => string | undefined>) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    Object.entries(validationRules).forEach(([field, validator]) => {
      const error = validator(values[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouchedField,
    reset,
    validate,
  };
};
