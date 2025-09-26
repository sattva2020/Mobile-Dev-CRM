/**
 * TaskResponseDto - Data Transfer Object для ответа с задачей
 * Следует принципам Clean Architecture
 */
export interface TaskResponseDto {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  assignee: string;
  labels: string[];
  dueDate: string | null;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  githubIssueId: string | null;
  githubUrl: string | null;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
  isDueSoon: boolean;
  timeVariance: number;
  isTimeOverrun: boolean;
}

/**
 * TaskListResponseDto - Data Transfer Object для списка задач
 */
export interface TaskListResponseDto {
  tasks: TaskResponseDto[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * TaskStatsResponseDto - Data Transfer Object для статистики задач
 */
export interface TaskStatsResponseDto {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  overdue: number;
  dueSoon: number;
  averageProgress: number;
  averageTimeVariance: number;
}
