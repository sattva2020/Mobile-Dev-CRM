import { Task } from '../../../domain/entities/Task';
import { TaskRepository } from '../../../domain/repositories/TaskRepository';
import { CreateTaskDto } from '../../dto/CreateTaskDto';
import { TaskResponseDto } from '../../dto/TaskResponseDto';
import { TaskPriorityValue } from '../../../domain/value-objects/TaskPriority';

/**
 * CreateTaskUseCase - Use Case для создания задачи
 * Следует принципам Clean Architecture
 * Только оркестрация, без бизнес-логики
 */
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(dto: CreateTaskDto): Promise<TaskResponseDto> {
    // Валидация входных данных
    const validationErrors = this.validateDto(dto);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Создание доменной сущности
    const task = Task.create(
      dto.title,
      dto.description,
      dto.priority as TaskPriorityValue,
      dto.category,
      dto.assignee,
      dto.labels || [],
      dto.dueDate ? new Date(dto.dueDate) : undefined,
      dto.estimatedHours || 0
    );

    // Сохранение через репозиторий
    await this.taskRepository.save(task);

    // Возврат DTO
    return this.mapToResponseDto(task);
  }

  private validateDto(dto: CreateTaskDto): string[] {
    const errors: string[] = [];

    if (!dto.title || dto.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!dto.description || dto.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!dto.priority || !['low', 'medium', 'high', 'urgent'].includes(dto.priority)) {
      errors.push('Priority is required and must be valid');
    }

    if (!dto.category || dto.category.trim().length === 0) {
      errors.push('Category is required');
    }

    if (!dto.assignee || dto.assignee.trim().length === 0) {
      errors.push('Assignee is required');
    }

    if (dto.labels && !Array.isArray(dto.labels)) {
      errors.push('Labels must be an array');
    }

    if (dto.dueDate && isNaN(Date.parse(dto.dueDate))) {
      errors.push('Due date must be a valid date');
    }

    if (dto.estimatedHours !== undefined && (dto.estimatedHours < 0 || dto.estimatedHours > 1000)) {
      errors.push('Estimated hours must be between 0 and 1000');
    }

    return errors;
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
