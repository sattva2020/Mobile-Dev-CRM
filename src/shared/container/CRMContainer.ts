import { container } from './DIContainer';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { SupabaseTaskRepository } from '../../infrastructure/repositories/SupabaseTaskRepository';
import { CreateTaskUseCase } from '../../application/use-cases/task/CreateTaskUseCase';
import { UpdateTaskUseCase } from '../../application/use-cases/task/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../application/use-cases/task/DeleteTaskUseCase';
import { GetTasksUseCase } from '../../application/use-cases/task/GetTasksUseCase';

/**
 * CRMContainer - Конфигурация DI для CRM системы
 * Следует принципам Clean Architecture
 */
export class CRMContainer {
  static configure(): void {
    // Регистрация репозиториев
    container.registerSingleton<TaskRepository>(
      'TaskRepository',
      () => new SupabaseTaskRepository(
        process.env.REACT_APP_SUPABASE_URL || 'http://localhost:3000',
        process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      )
    );

    // Регистрация Use Cases
    container.registerTransient<CreateTaskUseCase>(
      'CreateTaskUseCase',
      () => new CreateTaskUseCase(container.get<TaskRepository>('TaskRepository'))
    );

    container.registerTransient<UpdateTaskUseCase>(
      'UpdateTaskUseCase',
      () => new UpdateTaskUseCase(container.get<TaskRepository>('TaskRepository'))
    );

    container.registerTransient<DeleteTaskUseCase>(
      'DeleteTaskUseCase',
      () => new DeleteTaskUseCase(container.get<TaskRepository>('TaskRepository'))
    );

    container.registerTransient<GetTasksUseCase>(
      'GetTasksUseCase',
      () => new GetTasksUseCase(container.get<TaskRepository>('TaskRepository'))
    );
  }

  /**
   * Получение Use Case для задач
   */
  static getCreateTaskUseCase(): CreateTaskUseCase {
    return container.get<CreateTaskUseCase>('CreateTaskUseCase');
  }

  static getUpdateTaskUseCase(): UpdateTaskUseCase {
    return container.get<UpdateTaskUseCase>('UpdateTaskUseCase');
  }

  static getDeleteTaskUseCase(): DeleteTaskUseCase {
    return container.get<DeleteTaskUseCase>('DeleteTaskUseCase');
  }

  static getGetTasksUseCase(): GetTasksUseCase {
    return container.get<GetTasksUseCase>('GetTasksUseCase');
  }

  /**
   * Получение репозитория
   */
  static getTaskRepository(): TaskRepository {
    return container.get<TaskRepository>('TaskRepository');
  }
}
