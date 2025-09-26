import { TaskId } from '../../../domain/value-objects/TaskId';
import { TaskRepository } from '../../../domain/repositories/TaskRepository';

/**
 * DeleteTaskUseCase - Use Case для удаления задачи
 * Следует принципам Clean Architecture
 * Только оркестрация, без бизнес-логики
 */
export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    // Валидация ID
    if (!id || id.trim().length === 0) {
      throw new Error('Task ID is required');
    }

    // Создание TaskId
    let taskId: TaskId;
    try {
      taskId = new TaskId(id);
    } catch (error) {
      throw new Error('Invalid task ID format');
    }

    // Проверка существования задачи
    const exists = await this.taskRepository.exists(taskId);
    if (!exists) {
      throw new Error('Task not found');
    }

    // Удаление задачи
    await this.taskRepository.delete(taskId);
  }
}
