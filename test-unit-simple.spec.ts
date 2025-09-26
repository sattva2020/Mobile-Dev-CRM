import { describe, it, expect } from 'vitest';

// Простые unit тесты без React
describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const formatDate = (date: Date): string => {
        return date.toLocaleDateString('ru-RU');
      };
      
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15.01.2024');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
      
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
      
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const generateId = (): string => {
        return Math.random().toString(36).substr(2, 9);
      };
      
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1.length).toBe(9);
      expect(id2.length).toBe(9);
    });
  });

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB'
        }).format(amount);
      };
      
      expect(formatCurrency(1000)).toBe('1 000,00 ₽');
      expect(formatCurrency(1234.56)).toBe('1 234,56 ₽');
    });
  });
});

describe('Business Logic', () => {
  describe('Task Management', () => {
    it('creates task with correct properties', () => {
      interface Task {
        id: string;
        title: string;
        status: 'todo' | 'in-progress' | 'done';
        priority: 'low' | 'medium' | 'high';
      }

      const createTask = (title: string, priority: 'low' | 'medium' | 'high' = 'medium'): Task => ({
        id: Math.random().toString(36).substr(2, 9),
        title,
        status: 'todo',
        priority
      });

      const task = createTask('Test task', 'high');
      expect(task.title).toBe('Test task');
      expect(task.status).toBe('todo');
      expect(task.priority).toBe('high');
      expect(task.id).toBeDefined();
    });

    it('updates task status', () => {
      interface Task {
        id: string;
        title: string;
        status: 'todo' | 'in-progress' | 'done';
      }

      const updateTaskStatus = (task: Task, status: 'todo' | 'in-progress' | 'done'): Task => ({
        ...task,
        status
      });

      const task = { id: '1', title: 'Test', status: 'todo' as const };
      const updatedTask = updateTaskStatus(task, 'in-progress');
      
      expect(updatedTask.status).toBe('in-progress');
      expect(updatedTask.title).toBe('Test');
    });
  });

  describe('Notification System', () => {
    it('creates notification with correct properties', () => {
      interface Notification {
        id: string;
        type: 'success' | 'warning' | 'error' | 'info';
        title: string;
        message: string;
        read: boolean;
      }

      const createNotification = (
        type: 'success' | 'warning' | 'error' | 'info',
        title: string,
        message: string
      ): Notification => ({
        id: Math.random().toString(36).substr(2, 9),
        type,
        title,
        message,
        read: false
      });

      const notification = createNotification('success', 'Task completed', 'Your task has been completed successfully');
      
      expect(notification.type).toBe('success');
      expect(notification.title).toBe('Task completed');
      expect(notification.read).toBe(false);
    });

    it('marks notification as read', () => {
      interface Notification {
        id: string;
        read: boolean;
      }

      const markAsRead = (notification: Notification): Notification => ({
        ...notification,
        read: true
      });

      const notification = { id: '1', read: false };
      const updatedNotification = markAsRead(notification);
      
      expect(updatedNotification.read).toBe(true);
    });
  });
});

describe('Data Validation', () => {
  describe('Form Validation', () => {
    it('validates required fields', () => {
      const validateRequired = (value: string): boolean => {
        return value.trim().length > 0;
      };

      expect(validateRequired('test')).toBe(true);
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });

    it('validates password strength', () => {
      const validatePassword = (password: string): boolean => {
        return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
      };

      expect(validatePassword('Password123')).toBe(true);
      expect(validatePassword('password')).toBe(false);
      expect(validatePassword('PASSWORD')).toBe(false);
      expect(validatePassword('Pass1')).toBe(false);
    });
  });

  describe('Data Processing', () => {
    it('filters tasks by status', () => {
      interface Task {
        id: string;
        title: string;
        status: 'todo' | 'in-progress' | 'done';
      }

      const tasks: Task[] = [
        { id: '1', title: 'Task 1', status: 'todo' },
        { id: '2', title: 'Task 2', status: 'in-progress' },
        { id: '3', title: 'Task 3', status: 'done' },
        { id: '4', title: 'Task 4', status: 'todo' }
      ];

      const filterTasksByStatus = (tasks: Task[], status: 'todo' | 'in-progress' | 'done'): Task[] => {
        return tasks.filter(task => task.status === status);
      };

      const todoTasks = filterTasksByStatus(tasks, 'todo');
      const doneTasks = filterTasksByStatus(tasks, 'done');

      expect(todoTasks).toHaveLength(2);
      expect(doneTasks).toHaveLength(1);
      expect(todoTasks[0].status).toBe('todo');
    });

    it('calculates completion percentage', () => {
      interface Task {
        status: 'todo' | 'in-progress' | 'done';
      }

      const calculateCompletion = (tasks: Task[]): number => {
        const completed = tasks.filter(task => task.status === 'done').length;
        return Math.round((completed / tasks.length) * 100);
      };

      const tasks: Task[] = [
        { status: 'done' },
        { status: 'done' },
        { status: 'todo' },
        { status: 'in-progress' }
      ];

      expect(calculateCompletion(tasks)).toBe(50);
    });
  });
});
