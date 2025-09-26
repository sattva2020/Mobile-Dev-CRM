import { Task } from '../../../domain/entities/Task';
import { TaskId } from '../../../domain/value-objects/TaskId';
import { TaskRepository } from '../../../domain/repositories/TaskRepository';
import { UpdateTaskDto } from '../../dto/UpdateTaskDto';
import { TaskResponseDto } from '../../dto/TaskResponseDto';

/**
 * UpdateTaskUseCase - Use Case для обновления задачи
 * Следует принципам Clean Architecture
 * Только оркестрация, без бизнес-логики
 */
export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string, dto: UpdateTaskDto): Promise<TaskResponseDto> {
    // Валидация входных данных
    const validationErrors = this.validateDto(dto);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Получение существующей задачи
    const taskId = new TaskId(id);
    const existingTask = await this.taskRepository.findById(taskId);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Обновление задачи через доменные методы
    this.updateTaskFromDto(existingTask, dto);

    // Сохранение через репозиторий
    await this.taskRepository.save(existingTask);

    // Возврат DTO
    return this.mapToResponseDto(existingTask);
  }

  private validateDto(dto: UpdateTaskDto): string[] {
    const errors: string[] = [];

    if (dto.title !== undefined) {
      if (!dto.title || dto.title.trim().length === 0) {
        errors.push('Title cannot be empty');
      }
      if (dto.title && dto.title.length > 200) {
        errors.push('Title must be less than 200 characters');
      }
    }

    if (dto.description !== undefined) {
      if (!dto.description || dto.description.trim().length === 0) {
        errors.push('Description cannot be empty');
      }
      if (dto.description && dto.description.length > 1000) {
        errors.push('Description must be less than 1000 characters');
      }
    }

    if (dto.priority !== undefined) {
      if (!['low', 'medium', 'high', 'urgent'].includes(dto.priority)) {
        errors.push('Priority must be one of: low, medium, high, urgent');
      }
    }

    if (dto.category !== undefined) {
      if (!dto.category || dto.category.trim().length === 0) {
        errors.push('Category cannot be empty');
      }
      if (dto.category && dto.category.length > 100) {
        errors.push('Category must be less than 100 characters');
      }
    }

    if (dto.assignee !== undefined) {
      if (!dto.assignee || dto.assignee.trim().length === 0) {
        errors.push('Assignee cannot be empty');
      }
      if (dto.assignee && dto.assignee.length > 100) {
        errors.push('Assignee must be less than 100 characters');
      }
    }

    if (dto.labels !== undefined) {
      if (!Array.isArray(dto.labels)) {
        errors.push('Labels must be an array');
      }
      if (dto.labels && dto.labels.some(label => typeof label !== 'string' || label.trim().length === 0)) {
        errors.push('All labels must be non-empty strings');
      }
    }

    if (dto.dueDate !== undefined && dto.dueDate !== null) {
      if (isNaN(Date.parse(dto.dueDate))) {
        errors.push('Due date must be a valid ISO date string');
      }
    }

    if (dto.estimatedHours !== undefined) {
      if (typeof dto.estimatedHours !== 'number' || dto.estimatedHours < 0) {
        errors.push('Estimated hours must be a non-negative number');
      }
      if (dto.estimatedHours > 1000) {
        errors.push('Estimated hours must be less than 1000');
      }
    }

    if (dto.actualHours !== undefined) {
      if (typeof dto.actualHours !== 'number' || dto.actualHours < 0) {
        errors.push('Actual hours must be a non-negative number');
      }
      if (dto.actualHours > 1000) {
        errors.push('Actual hours must be less than 1000');
      }
    }

    if (dto.progress !== undefined) {
      if (typeof dto.progress !== 'number' || dto.progress < 0 || dto.progress > 100) {
        errors.push('Progress must be a number between 0 and 100');
      }
    }

    if (dto.status !== undefined) {
      if (!['todo', 'in-progress', 'review', 'done', 'cancelled'].includes(dto.status)) {
        errors.push('Status must be one of: todo, in-progress, review, done, cancelled');
      }
    }

    return errors;
  }

  private updateTaskFromDto(task: Task, dto: UpdateTaskDto): void {
    // Обновление базовых полей
    if (dto.title !== undefined) {
      task.updateTitle(dto.title);
    }

    if (dto.description !== undefined) {
      task.updateDescription(dto.description);
    }

    if (dto.priority !== undefined) {
      const { TaskPriority } = require('../../../domain/value-objects/TaskPriority');
      task.updatePriority(new TaskPriority(dto.priority));
    }

    if (dto.category !== undefined) {
      task.updateCategory(dto.category);
    }

    if (dto.assignee !== undefined) {
      task.updateAssignee(dto.assignee);
    }

    if (dto.labels !== undefined) {
      // Очищаем существующие метки и добавляем новые
      const currentLabels = task.getLabels();
      currentLabels.forEach(label => task.removeLabel(label));
      dto.labels.forEach(label => task.addLabel(label));
    }

    if (dto.dueDate !== undefined) {
      task.updateDueDate(dto.dueDate ? new Date(dto.dueDate) : null);
    }

    if (dto.estimatedHours !== undefined) {
      task.updateEstimatedHours(dto.estimatedHours);
    }

    if (dto.actualHours !== undefined) {
      const currentActualHours = task.getActualHours();
      const difference = dto.actualHours - currentActualHours;
      if (difference > 0) {
        task.addActualHours(difference);
      }
    }

    if (dto.progress !== undefined) {
      task.updateProgress(dto.progress);
    }

    // Обновление статуса
    if (dto.status !== undefined) {
      this.updateTaskStatus(task, dto.status);
    }
  }

  private updateTaskStatus(task: Task, status: string): void {
    const currentStatus = task.getStatus().getValue();
    
    if (currentStatus === status) {
      return; // Статус уже установлен
    }

    switch (status) {
      case 'in-progress':
        task.moveToInProgress();
        break;
      case 'review':
        task.moveToReview();
        break;
      case 'done':
        task.moveToDone();
        break;
      case 'cancelled':
        task.moveToCancelled();
        break;
      case 'todo':
        // Возврат к TODO - требует специальной логики
        // Пока что просто обновляем прогресс
        task.updateProgress(0);
        break;
      default:
        throw new Error(`Invalid status transition from ${currentStatus} to ${status}`);
    }
  }

  private mapToResponseDto(task: Task): TaskResponseDto {
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
