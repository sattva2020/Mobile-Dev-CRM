/**
 * CreateTaskDto - Data Transfer Object для создания задачи
 * Следует принципам Clean Architecture
 */
export interface CreateTaskDto {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignee: string;
  labels?: string[];
  dueDate?: string; // ISO string
  estimatedHours?: number;
}

/**
 * Валидация CreateTaskDto
 */
export class CreateTaskDtoValidator {
  static validate(dto: CreateTaskDto): string[] {
    const errors: string[] = [];

    if (!dto.title || dto.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (dto.title && dto.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (!dto.description || dto.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (dto.description && dto.description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }

    if (!dto.priority || !['low', 'medium', 'high', 'urgent'].includes(dto.priority)) {
      errors.push('Priority must be one of: low, medium, high, urgent');
    }

    if (!dto.category || dto.category.trim().length === 0) {
      errors.push('Category is required');
    }

    if (dto.category && dto.category.length > 100) {
      errors.push('Category must be less than 100 characters');
    }

    if (!dto.assignee || dto.assignee.trim().length === 0) {
      errors.push('Assignee is required');
    }

    if (dto.assignee && dto.assignee.length > 100) {
      errors.push('Assignee must be less than 100 characters');
    }

    if (dto.labels && !Array.isArray(dto.labels)) {
      errors.push('Labels must be an array');
    }

    if (dto.labels && dto.labels.some(label => typeof label !== 'string' || label.trim().length === 0)) {
      errors.push('All labels must be non-empty strings');
    }

    if (dto.dueDate && isNaN(Date.parse(dto.dueDate))) {
      errors.push('Due date must be a valid ISO date string');
    }

    if (dto.estimatedHours !== undefined) {
      if (typeof dto.estimatedHours !== 'number' || dto.estimatedHours < 0) {
        errors.push('Estimated hours must be a non-negative number');
      }
      if (dto.estimatedHours > 1000) {
        errors.push('Estimated hours must be less than 1000');
      }
    }

    return errors;
  }

  static isValid(dto: CreateTaskDto): boolean {
    return this.validate(dto).length === 0;
  }
}
