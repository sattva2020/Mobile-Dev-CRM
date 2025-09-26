import axios from 'axios';
import { Notification } from '../context/AppContext';
import { AIResponse, Task, Project } from '../types';

export class AIService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey: string, model: string = 'x-ai/grok-4-fast:free') {
    this.apiKey = apiKey;
    this.baseUrl = 'https://openrouter.ai/api/v1';
    this.model = model;
  }

  private async makeRequest(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Mobile Dev CRM',
          },
        }
      );

      return {
        success: true,
        data: (response.data as any).choices[0]?.message?.content,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async analyzeTaskProgress(task: Task): Promise<AIResponse> {
    const systemPrompt = `Ты - AI-ассистент для отслеживания прогресса разработки мобильных приложений. 
    Анализируй задачи и давай рекомендации по улучшению процесса разработки.`;

    const prompt = `
    Проанализируй следующую задачу и дай рекомендации:
    
    Задача: ${task.title}
    Описание: ${task.description}
    Приоритет: ${task.priority}
    Статус: ${task.status}
    Прогресс: ${task.progress || 0}%
    Оценка времени: ${task.estimatedHours} часов
    Фактическое время: ${task.actualHours || 'не указано'} часов
    Метки: ${task.labels.join(', ')}
    
    Дай рекомендации по:
    1. Улучшению процесса выполнения
    2. Оценке времени
    3. Приоритизации
    4. Потенциальным рискам
    `;

    return this.makeRequest(prompt, systemPrompt);
  }

  async analyzeProjectHealth(project: Project): Promise<AIResponse> {
    const systemPrompt = `Ты - AI-аналитик проектов разработки мобильных приложений.
    Анализируй метрики проекта и давай рекомендации по улучшению.`;

    const prompt = `
    Проанализируй состояние проекта:
    
    Проект: ${project.name}
    Статус: ${project.status}
    Всего задач: ${project.metrics?.totalTasks || 0}
    Выполнено: ${project.metrics?.completedTasks || 0}
    В работе: ${project.metrics?.inProgressTasks || 0}
    Просрочено: ${project.metrics?.overdueTasks || 0}
    Оценка времени: ${project.metrics?.totalEstimatedHours || 0} часов
    Фактическое время: ${project.metrics?.totalActualHours || 0} часов
    Скорость: ${project.metrics?.velocity || 0} задач/неделю
    
    Дай анализ:
    1. Общее состояние проекта
    2. Основные проблемы
    3. Рекомендации по улучшению
    4. Прогноз завершения
    `;

    return this.makeRequest(prompt, systemPrompt);
  }

  async suggestTaskPrioritization(tasks: Task[]): Promise<AIResponse> {
    const systemPrompt = `Ты - AI-планировщик задач для разработки мобильных приложений.
    Анализируй список задач и предлагай оптимальную приоритизацию.`;

    const prompt = `
    Проанализируй следующие задачи и предложи оптимальную приоритизацию:
    
    ${tasks.map((task, index) => `
    ${index + 1}. ${task.title}
       - Приоритет: ${task.priority}
       - Статус: ${task.status}
       - Прогресс: ${task.progress || 0}%
       - Время: ${task.estimatedHours} часов
       - Метки: ${task.labels.join(', ')}
    `).join('\n')}
    
    Предложи:
    1. Новую приоритизацию задач
    2. Обоснование изменений
    3. Рекомендации по планированию
    4. Выявление зависимостей
    `;

    return this.makeRequest(prompt, systemPrompt);
  }

  async generateProgressReport(project: Project, tasks: Task[]): Promise<AIResponse> {
    const systemPrompt = `Ты - AI-аналитик для генерации отчетов о прогрессе разработки.
    Создавай структурированные и информативные отчеты.`;

    const prompt = `
    Создай отчет о прогрессе проекта:
    
    Проект: ${project.name}
    Период: ${project.startDate} - ${new Date().toISOString().split('T')[0]}
    
    Статистика:
    - Всего задач: ${tasks.length}
    - Выполнено: ${tasks.filter(t => t.status === 'done').length}
    - В работе: ${tasks.filter(t => t.status === 'in-progress').length}
    - Ожидают: ${tasks.filter(t => t.status === 'todo').length}
    - На проверке: ${tasks.filter(t => t.status === 'review').length}
    
    Включи в отчет:
    1. Общий обзор прогресса
    2. Ключевые достижения
    3. Текущие проблемы
    4. Рекомендации
    5. Прогноз на следующую неделю
    `;

    return this.makeRequest(prompt, systemPrompt);
  }

  async suggestCodeReviewFocus(task: Task): Promise<AIResponse> {
    const systemPrompt = `Ты - AI-эксперт по code review для мобильной разработки.
    Анализируй задачи и предлагай фокус для code review.`;

    const prompt = `
    Предложи фокус для code review задачи:
    
    Задача: ${task.title}
    Описание: ${task.description}
    Метки: ${task.labels.join(', ')}
    Тип: ${task.labels.includes('security') ? 'Безопасность' : 
          task.labels.includes('performance') ? 'Производительность' :
          task.labels.includes('accessibility') ? 'Доступность' : 'Общая разработка'}
    
    Предложи:
    1. Ключевые области для проверки
    2. Потенциальные проблемы
    3. Best practices для данного типа задач
    4. Чек-лист для review
    `;

    return this.makeRequest(prompt, systemPrompt);
  }

  async analyzeTeamProductivity(teamMembers: any[], tasks: Task[]): Promise<AIResponse> {
    const systemPrompt = `Ты - AI-аналитик производительности команды разработки.
    Анализируй данные команды и давай рекомендации по улучшению.`;

    const prompt = `
    Проанализируй производительность команды:
    
    Команда:
    ${teamMembers.map(member => `
    - ${member.name} (${member.role})
      Вместимость: ${member.capacity} часов/неделю
    `).join('\n')}
    
    Задачи:
    ${tasks.map(task => `
    - ${task.title}
      Назначена: ${task.assignee}
      Статус: ${task.status}
      Время: ${task.actualHours || task.estimatedHours} часов
    `).join('\n')}
    
    Проанализируй:
    1. Распределение нагрузки
    2. Эффективность команды
    3. Проблемные области
    4. Рекомендации по оптимизации
    `;

    return this.makeRequest(prompt, systemPrompt);
  }
}
