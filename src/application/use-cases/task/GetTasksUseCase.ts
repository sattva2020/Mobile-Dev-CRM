import { TaskRepository } from '../../../domain/repositories/TaskRepository';
import { TaskResponseDto, TaskListResponseDto, TaskStatsResponseDto } from '../../dto/TaskResponseDto';

/**
 * GetTasksUseCase - Use Case для получения задач
 * Следует принципам Clean Architecture
 * Только оркестрация, без бизнес-логики
 */
export class GetTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getAll(): Promise<TaskListResponseDto> {
    const tasks = await this.taskRepository.findAll();
    const taskDtos = tasks.map(task => this.mapToResponseDto(task));
    
    return {
      tasks: taskDtos,
      total: taskDtos.length,
      page: 1,
      limit: taskDtos.length,
      hasMore: false
    };
  }

  async getById(id: string): Promise<TaskResponseDto | null> {
    const { TaskId } = require('../../../domain/value-objects/TaskId');
    
    try {
      const taskId = new TaskId(id);
      const task = await this.taskRepository.findById(taskId);
      
      if (!task) {
        return null;
      }
      
      return this.mapToResponseDto(task);
    } catch (error) {
      throw new Error('Invalid task ID format');
    }
  }

  async getByStatus(status: string): Promise<TaskListResponseDto> {
    const tasks = await this.taskRepository.findByStatus(status);
    const taskDtos = tasks.map(task => this.mapToResponseDto(task));
    
    return {
      tasks: taskDtos,
      total: taskDtos.length,
      page: 1,
      limit: taskDtos.length,
      hasMore: false
    };
  }

  async getByPriority(priority: string): Promise<TaskListResponseDto> {
    const tasks = await this.taskRepository.findByPriority(priority);
    const taskDtos = tasks.map(task => this.mapToResponseDto(task));
    
    return {
      tasks: taskDtos,
      total: taskDtos.length,
      page: 1,
      limit: taskDtos.length,
      hasMore: false
    };
  }

  async getByCategory(category: string): Promise<TaskListResponseDto> {
    const tasks = await this.taskRepository.findByCategory(category);
    const taskDtos = tasks.map(task => this.mapToResponseDto(task));
    
    return {
      tasks: taskDtos,
      total: taskDtos.length,
      page: 1,
      limit: taskDtos.length,
      hasMore: false
    };
  }

  async getByAssignee(assignee: string): Promise<TaskListResponseDto> {
    const tasks = await this.taskRepository.findByAssignee(assignee);
    const taskDtos = tasks.map(task => this.mapToResponseDto(task));
    
    return {
      tasks: taskDtos,
      total: taskDtos.length,
      page: 1,
      limit: taskDtos.length,
      hasMore: false
    };
  }

  async getOverdue(): Promise<TaskListResponseDto> {
    const tasks = await this.taskRepository.findOverdue();
    const taskDtos = tasks.map(task => this.mapToResponseDto(task));
    
    return {
      tasks: taskDtos,
      total: taskDtos.length,
      page: 1,
      limit: taskDtos.length,
      hasMore: false
    };
  }

  async getDueSoon(): Promise<TaskListResponseDto> {
    const tasks = await this.taskRepository.findDueSoon();
    const taskDtos = tasks.map(task => this.mapToResponseDto(task));
    
    return {
      tasks: taskDtos,
      total: taskDtos.length,
      page: 1,
      limit: taskDtos.length,
      hasMore: false
    };
  }

  async search(query: string): Promise<TaskListResponseDto> {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }
    
    const tasks = await this.taskRepository.search(query.trim());
    const taskDtos = tasks.map(task => this.mapToResponseDto(task));
    
    return {
      tasks: taskDtos,
      total: taskDtos.length,
      page: 1,
      limit: taskDtos.length,
      hasMore: false
    };
  }

  async getStats(): Promise<TaskStatsResponseDto> {
    const stats = await this.taskRepository.getStats();
    
    return {
      total: stats.total,
      byStatus: stats.byStatus,
      byPriority: stats.byPriority,
      byCategory: stats.byCategory,
      overdue: stats.overdue,
      dueSoon: stats.dueSoon,
      averageProgress: 0, // TODO: Calculate from tasks
      averageTimeVariance: 0 // TODO: Calculate from tasks
    };
  }

  private mapToResponseDto(task: any): TaskResponseDto {
    return {
      id: task.getId().getValue(),
      title: task.getTitle(),
      description: task.getDescription(),
      status: task.getStatus().getValue(),
      priority: task.getPriority().getValue(),
      category: task.getCategory(),
      assignee: task.getAssignee(),
      labels: task.getLabels(),
      dueDate: task.getDueDate()?.toISOString() || null,
      estimatedHours: task.getEstimatedHours(),
      actualHours: task.getActualHours(),
      progress: task.getProgress(),
      githubIssueId: task.getGithubIssueId(),
      githubUrl: task.getGithubUrl(),
      createdAt: task.getCreatedAt().toISOString(),
      updatedAt: task.getUpdatedAt().toISOString(),
      isOverdue: task.isOverdue(),
      isDueSoon: task.isDueSoon(),
      timeVariance: task.getTimeVariance(),
      isTimeOverrun: task.isTimeOverrun()
    };
  }
}
