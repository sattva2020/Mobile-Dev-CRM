import { ProjectStatus } from '../../domain/entities/Project';

export interface CreateProjectDto {
  name: string;
  description: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string
}

export class CreateProjectDtoValidator {
  static validate(dto: CreateProjectDto): void {
    if (!dto.name || dto.name.trim() === '') {
      throw new Error('Project name is required');
    }
    if (dto.name.length > 200) {
      throw new Error('Project name must be less than 200 characters');
    }
    if (!dto.description || dto.description.trim() === '') {
      throw new Error('Project description is required');
    }
    if (dto.description.length > 1000) {
      throw new Error('Project description must be less than 1000 characters');
    }
    if (!dto.startDate) {
      throw new Error('Start date is required');
    }
    if (isNaN(Date.parse(dto.startDate))) {
      throw new Error('Start date must be a valid date');
    }
    if (dto.endDate && isNaN(Date.parse(dto.endDate))) {
      throw new Error('End date must be a valid date');
    }
    if (dto.endDate && dto.startDate && new Date(dto.endDate) <= new Date(dto.startDate)) {
      throw new Error('End date must be after start date');
    }
  }
}
