// Экспорт типов из контекста для использования в других частях приложения
export type {
  Task,
  Notification,
  GitHubSettings,
  AISettings,
  Settings,
  AppState,
  AppAction,
} from '../context/AppContext';

// Дополнительные типы для GitHub
export interface GitHubLabel {
  name: string;
  color: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

// Дополнительные типы для AI
export interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  metrics?: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    totalEstimatedHours: number;
    totalActualHours: number;
    velocity: number;
  };
}

// Дополнительные типы для расширения функциональности
export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: Array<{
    id?: number;
    name?: string;
    color: string;
    description?: string | null;
  }>;
  assignees?: Array<{
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
  }>;
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
  html_url: string;
  user?: {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface AISuggestion {
  id: string;
  type: 'optimization' | 'security' | 'performance' | 'accessibility';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  source: 'code-analysis' | 'task-analysis' | 'pattern-detection';
  createdAt: string;
  applied: boolean;
}

export interface ProjectMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  averageCompletionTime: number;
  codeQuality: number;
  testCoverage: number;
  securityScore: number;
  performanceScore: number;
  accessibilityScore: number;
}

export interface SyncStatus {
  lastSync: string;
  status: 'idle' | 'syncing' | 'error';
  error?: string;
  syncedTasks: number;
  totalTasks: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
  dashboard: {
    showMetrics: boolean;
    showRecentTasks: boolean;
    showNotifications: boolean;
  };
}

// Типы для API ответов
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GitHubAPIResponse {
  success: boolean;
  data?: GitHubIssue[];
  error?: string;
  rateLimit?: {
    remaining: number;
    reset: number;
  };
}

export interface AIAPIResponse {
  success: boolean;
  data?: AISuggestion[];
  error?: string;
  usage?: {
    tokens: number;
    cost: number;
  };
}

// Типы для фильтров и поиска
export interface TaskFilters {
  search: string;
  status: string[];
  priority: string[];
  category: string[];
  assignee: string[];
  labels: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
}

export interface SortOptions {
  field: 'title' | 'priority' | 'createdAt' | 'updatedAt' | 'dueDate';
  direction: 'asc' | 'desc';
}

// Типы для экспорта/импорта
export interface ExportData {
  tasks: any[]; // Используем any[] вместо Task[] для избежания циклических зависимостей
  settings: any; // Используем any вместо Settings для избежания циклических зависимостей
  metadata: {
    version: string;
    exportDate: string;
    totalTasks: number;
  };
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}

// Типы для аналитики
export interface AnalyticsEvent {
  id: string;
  type: 'task-created' | 'task-completed' | 'task-updated' | 'sync-performed' | 'ai-suggestion-applied';
  data: Record<string, any>;
  timestamp: string;
  userId?: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}

// Типы для уведомлений
export interface NotificationTemplate {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
  autoClose?: boolean;
  duration?: number;
}

// Типы для валидации
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface TaskValidation {
  title: ValidationResult;
  description: ValidationResult;
  priority: ValidationResult;
  category: ValidationResult;
  dueDate: ValidationResult;
}

// Типы для тестирования
export interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  error?: string;
  output?: string;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
}