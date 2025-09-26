/**
 * UpdateTaskDto - Data Transfer Object для обновления задачи
 * Следует принципам Clean Architecture
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  assignee?: string;
  labels?: string[];
  dueDate?: string | null; // ISO string or null
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;
  status?: 'todo' | 'in-progress' | 'review' | 'done' | 'cancelled';
}

/**
 * Валидация UpdateTaskDto
 */
export class UpdateTaskDtoValidator {
  static validate(dto: UpdateTaskDto): string[] {
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

  static isValid(dto: UpdateTaskDto): boolean {
    return this.validate(dto).length === 0;
  }
}
