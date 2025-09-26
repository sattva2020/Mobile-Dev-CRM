import { ProjectStatus } from '../../domain/entities/Project';

export interface ProjectResponseDto {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string; // ISO string
  endDate: string | null; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isActive: boolean;
  isCompleted: boolean;
  isOverdue: boolean;
  isDueSoon: boolean;
  progress: number;
  totalEstimatedHours: number;
  totalActualHours: number;
  timeVariance: number;
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    totalEstimatedHours: number;
    totalActualHours: number;
    progress: number;
    timeVariance: number;
  };
}
