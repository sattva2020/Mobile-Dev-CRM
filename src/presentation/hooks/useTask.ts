import { useState, useEffect, useCallback } from 'react';
import { CreateTaskUseCase } from '../../application/use-cases/task/CreateTaskUseCase';
import { CreateTaskDto } from '../../application/dto/CreateTaskDto';
import { TaskResponseDto } from '../../application/dto/TaskResponseDto';

/**
 * useTask - Custom Hook для работы с задачами
 * Следует принципам Clean Architecture
 * Презентационный слой
 */
export interface UseTaskState {
  tasks: TaskResponseDto[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
    overdue: number;
    dueSoon: number;
  } | null;
}

export interface UseTaskActions {
  createTask: (dto: CreateTaskDto) => Promise<void>;
  refreshTasks: () => Promise<void>;
  clearError: () => void;
}

export function useTask(
  createTaskUseCase: CreateTaskUseCase
): UseTaskState & UseTaskActions {
  const [state, setState] = useState<UseTaskState>({
    tasks: [],
    loading: false,
    error: null,
    stats: null
  });

  const createTask = useCallback(async (dto: CreateTaskDto) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const newTask = await createTaskUseCase.execute(dto);
      setState(prev => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, [createTaskUseCase]);

  const refreshTasks = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Здесь будет логика загрузки задач
      // Пока что просто очищаем ошибку
      setState(prev => ({
        ...prev,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Загрузка задач при монтировании
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  return {
    ...state,
    createTask,
    refreshTasks,
    clearError
  };
}
