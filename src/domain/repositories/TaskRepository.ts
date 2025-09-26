import { Task } from '../entities/Task';
import { TaskId } from '../value-objects/TaskId';

/**
 * TaskRepository - Repository Interface
 * Определяет контракт для работы с задачами
 * Следует принципам Clean Architecture
 */
export interface TaskRepository {
  /**
   * Сохранить задачу
   */
  save(task: Task): Promise<void>;

  /**
   * Найти задачу по ID
   */
  findById(id: TaskId): Promise<Task | null>;

  /**
   * Найти все задачи
   */
  findAll(): Promise<Task[]>;

  /**
   * Найти задачи по статусу
   */
  findByStatus(status: string): Promise<Task[]>;

  /**
   * Найти задачи по приоритету
   */
  findByPriority(priority: string): Promise<Task[]>;

  /**
   * Найти задачи по категории
   */
  findByCategory(category: string): Promise<Task[]>;

  /**
   * Найти задачи по исполнителю
   */
  findByAssignee(assignee: string): Promise<Task[]>;

  /**
   * Найти просроченные задачи
   */
  findOverdue(): Promise<Task[]>;

  /**
   * Найти задачи, которые скоро должны быть выполнены
   */
  findDueSoon(): Promise<Task[]>;

  /**
   * Найти задачи по поисковому запросу
   */
  search(query: string): Promise<Task[]>;

  /**
   * Удалить задачу
   */
  delete(id: TaskId): Promise<void>;

  /**
   * Проверить существование задачи
   */
  exists(id: TaskId): Promise<boolean>;

  /**
   * Получить количество задач по статусу
   */
  countByStatus(status: string): Promise<number>;

  /**
   * Получить статистику задач
   */
  getStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
    overdue: number;
    dueSoon: number;
  }>;
}
