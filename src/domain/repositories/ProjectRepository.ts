import { Project } from '../entities/Project';

/**
 * ProjectRepository - Интерфейс для работы с проектами
 * Следует принципам Clean Architecture
 */
export interface ProjectRepository {
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  save(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
  findByStatus(status: string): Promise<Project[]>;
  findByUser(userId: string): Promise<Project[]>;
  findActive(): Promise<Project[]>;
  findOverdue(): Promise<Project[]>;
  search(query: string): Promise<Project[]>;
  exists(id: string): Promise<boolean>;
  countByStatus(status: string): Promise<number>;
  getStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    active: number;
    completed: number;
    overdue: number;
  }>;
}
