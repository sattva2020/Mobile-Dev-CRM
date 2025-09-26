import { Project } from '../../../domain/entities/Project';
import { ProjectRepository } from '../../../domain/repositories/ProjectRepository';
import { CreateProjectDto } from '../../dto/CreateProjectDto';
import { ProjectResponseDto } from '../../dto/ProjectResponseDto';

/**
 * CreateProjectUseCase - Use Case для создания проекта
 * Следует принципам Clean Architecture
 */
export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(dto: CreateProjectDto): Promise<ProjectResponseDto> {
    // Валидация входных данных
    const validationErrors = this.validateDto(dto);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Создание проекта через доменную логику
    const project = Project.create(
      dto.name,
      dto.description,
      new Date(dto.startDate),
      dto.endDate ? new Date(dto.endDate) : undefined
    );

    // Сохранение через репозиторий
    await this.projectRepository.save(project);

    // Возврат DTO
    return this.mapToResponseDto(project);
  }

  private validateDto(dto: CreateProjectDto): string[] {
    const errors: string[] = [];

    if (!dto.name || dto.name.trim().length === 0) {
      errors.push('Project name is required');
    }
    if (dto.name && dto.name.length > 200) {
      errors.push('Project name must be less than 200 characters');
    }

    if (!dto.description || dto.description.trim().length === 0) {
      errors.push('Project description is required');
    }
    if (dto.description && dto.description.length > 1000) {
      errors.push('Project description must be less than 1000 characters');
    }

    if (!dto.startDate) {
      errors.push('Start date is required');
    }
    if (dto.startDate && isNaN(Date.parse(dto.startDate))) {
      errors.push('Start date must be a valid date');
    }

    if (dto.endDate && isNaN(Date.parse(dto.endDate))) {
      errors.push('End date must be a valid date');
    }

    if (dto.endDate && dto.startDate && new Date(dto.endDate) <= new Date(dto.startDate)) {
      errors.push('End date must be after start date');
    }

    return errors;
  }

  private mapToResponseDto(project: Project): ProjectResponseDto {
    return {
      id: project.getId(),
      name: project.getName(),
      description: project.getDescription(),
      status: project.getStatus(),
      startDate: project.getStartDate().toISOString(),
      endDate: project.getEndDate()?.toISOString() || null,
      createdAt: project.getCreatedAt().toISOString(),
      updatedAt: project.getUpdatedAt().toISOString(),
      isActive: project.isActive(),
      isCompleted: project.isCompleted(),
      isOverdue: project.isOverdue(),
      isDueSoon: project.isDueSoon(),
      progress: project.getProgress(),
      totalEstimatedHours: project.getTotalEstimatedHours(),
      totalActualHours: project.getTotalActualHours(),
      timeVariance: project.getTimeVariance(),
      stats: project.getStats()
    };
  }
}
