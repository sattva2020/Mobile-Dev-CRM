// Сервис для работы с GitHub API
export class GitHubService {
  private baseUrl = 'https://api.github.com';
  private token?: string;
  private owner?: string;
  private repo?: string;

  constructor(token?: string, owner?: string, repo?: string) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `token ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getIssues(): Promise<any[]> {
    if (!this.owner || !this.repo) {
      throw new Error('Owner and repo must be set');
    }
    
    return this.request<any[]>(`/repos/${this.owner}/${this.repo}/issues`);
  }

  async createIssue(title: string, body: string, labels: string[] = []): Promise<any> {
    if (!this.owner || !this.repo) {
      throw new Error('Owner and repo must be set');
    }

    return this.request<any>(`/repos/${this.owner}/${this.repo}/issues`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        body,
        labels,
      }),
    });
  }

  async updateIssue(issueNumber: number, updates: { title?: string; body?: string; state?: string }): Promise<any> {
    if (!this.owner || !this.repo) {
      throw new Error('Owner and repo must be set');
    }

    return this.request<any>(`/repos/${this.owner}/${this.repo}/issues/${issueNumber}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async closeIssue(issueNumber: number): Promise<any> {
    return this.updateIssue(issueNumber, { state: 'closed' });
  }

  async getRepository(): Promise<any> {
    if (!this.owner || !this.repo) {
      throw new Error('Owner and repo must be set');
    }

    return this.request<any>(`/repos/${this.owner}/${this.repo}`);
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getRepository();
      return true;
    } catch (error) {
      console.error('GitHub connection test failed:', error);
      return false;
    }
  }
}

// Сервис для работы с AI API
export class AIService {
  private apiKey?: string;
  private model = 'grok-4-fast';
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey;
    if (model) {
      this.model = model;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Mobile Dev CRM',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async generateSuggestions(task: any): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    const prompt = `Проанализируй задачу разработки: "${task.title}" - ${task.description}
    
    Категория: ${task.category}
    Приоритет: ${task.priority}
    
    Предложи 3-5 конкретных улучшений или оптимизаций для этой задачи.`;

    const response = await this.request<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Парсим ответ и извлекаем предложения
    const suggestions = content
      .split('\n')
      .filter((line: string) => line.trim() && (line.includes('-') || line.includes('•') || line.includes('1.') || line.includes('2.')))
      .map((line: string) => line.replace(/^[-•\d.\s]+/, '').trim())
      .filter((suggestion: string) => suggestion.length > 0);

    return suggestions.slice(0, 5);
  }

  async analyzeCodeQuality(code: string): Promise<{ score: number; suggestions: string[] }> {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    const prompt = `Проанализируй качество кода и дай оценку от 1 до 10:

\`\`\`typescript
${code}
\`\`\`

Оцени по критериям:
- Читаемость и понятность
- Производительность
- Безопасность
- Соответствие best practices

Дай общую оценку и 3-5 конкретных предложений по улучшению.`;

    const response = await this.request<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 400,
        temperature: 0.3,
      }),
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Извлекаем оценку
    const scoreMatch = content.match(/(\d+)\/10|оценка[:\s]*(\d+)|score[:\s]*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]) : 7;

    // Извлекаем предложения
    const suggestions = content
      .split('\n')
      .filter((line: string) => line.trim() && (line.includes('-') || line.includes('•') || line.includes('1.') || line.includes('2.')))
      .map((line: string) => line.replace(/^[-•\d.\s]+/, '').trim())
      .filter((suggestion: string) => suggestion.length > 0);

    return {
      score: Math.min(Math.max(score, 1), 10),
      suggestions: suggestions.slice(0, 5),
    };
  }

  async generateTaskDescription(title: string, category: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    const prompt = `Создай детальное описание задачи для мобильного приложения AI-Fitness Coach 360:

Заголовок: "${title}"
Категория: ${category}

Описание должно включать:
- Контекст и цель задачи
- Технические детали
- Критерии приемки
- Потенциальные риски

Сделай описание конкретным и actionable.`;

    const response = await this.request<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.5,
      }),
    });

    return response.choices[0]?.message?.content || '';
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateSuggestions({
        title: 'Test task',
        description: 'This is a test task for connection testing',
        category: 'testing',
        priority: 'low',
      });
      return true;
    } catch (error) {
      console.error('AI connection test failed:', error);
      return false;
    }
  }
}

// Сервис для работы с данными
export class DataService {
  private storageKey = 'dev-crm-data';

  saveData<T>(key: string, data: T): void {
    try {
      const existingData = this.getData<Record<string, any>>() || {};
      existingData[key] = data;
      localStorage.setItem(this.storageKey, JSON.stringify(existingData));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  getData<T>(key?: string): T | null {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return null;

      const parsedData = JSON.parse(data);
      return key ? parsedData[key] : parsedData;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  removeData(key: string): void {
    try {
      const existingData = this.getData<Record<string, any>>() || {};
      delete existingData[key];
      localStorage.setItem(this.storageKey, JSON.stringify(existingData));
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

  clearData(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  exportData(): string {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Сервис для работы с уведомлениями
export class NotificationService {
  private notifications: any[] = [];

  addNotification(notification: any): void {
    this.notifications.unshift(notification);
    
    // Ограничиваем количество уведомлений
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    // Показываем браузерное уведомление если разрешено
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
      });
    }
  }

  getNotifications(): any[] {
    return this.notifications;
  }

  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  clearNotifications(): void {
    this.notifications = [];
  }

  async requestPermission(): Promise<boolean> {
    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
}

// Сервис для работы с экспортом
export class ExportService {
  exportToJSON(data: any, filename: string = 'export.json'): void {
    const jsonData = JSON.stringify(data, null, 2);
    this.downloadFile(jsonData, filename, 'application/json');
  }

  exportToCSV(data: any[], filename: string = 'export.csv'): void {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    this.downloadFile(csvContent, filename, 'text/csv');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}

// Сервис для работы с валидацией
export class ValidationService {
  validateTask(task: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!task.title || task.title.trim().length === 0) {
      errors.title = 'Заголовок обязателен';
    } else if (task.title.length > 100) {
      errors.title = 'Заголовок не должен превышать 100 символов';
    }

    if (task.description && task.description.length > 1000) {
      errors.description = 'Описание не должно превышать 1000 символов';
    }

    if (!task.priority || !['low', 'medium', 'high', 'critical'].includes(task.priority)) {
      errors.priority = 'Некорректный приоритет';
    }

    if (!task.category || !['security', 'performance', 'accessibility', 'testing', 'documentation', 'other'].includes(task.category)) {
      errors.category = 'Некорректная категория';
    }

    if (task.estimatedTime && (task.estimatedTime < 0 || task.estimatedTime > 1000)) {
      errors.estimatedTime = 'Время должно быть от 0 до 1000 часов';
    }

    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      errors.dueDate = 'Срок выполнения не может быть в прошлом';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateSettings(settings: any): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (settings.github?.token && settings.github.token.length < 10) {
      errors.githubToken = 'GitHub токен слишком короткий';
    }

    if (settings.github?.repository?.owner && !/^[a-zA-Z0-9_-]+$/.test(settings.github.repository.owner)) {
      errors.githubOwner = 'Некорректное имя владельца репозитория';
    }

    if (settings.github?.repository?.name && !/^[a-zA-Z0-9_-]+$/.test(settings.github.repository.name)) {
      errors.githubRepo = 'Некорректное имя репозитория';
    }

    if (settings.ai?.apiKey && settings.ai.apiKey.length < 10) {
      errors.aiApiKey = 'AI API ключ слишком короткий';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Экспорт всех сервисов
export const githubService = new GitHubService();
export const aiService = new AIService();
export const dataService = new DataService();
export const notificationService = new NotificationService();
export const exportService = new ExportService();
export const validationService = new ValidationService();
