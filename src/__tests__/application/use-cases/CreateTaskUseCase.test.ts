import { CreateTaskUseCase } from '../../../application/use-cases/task/CreateTaskUseCase';
import { TaskRepository } from '../../../domain/repositories/TaskRepository';
import { Task } from '../../../domain/entities/Task';
import { CreateTaskDto } from '../../../application/dto/CreateTaskDto';

// Mock repository
class MockTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  async save(task: Task): Promise<void> {
    this.tasks.push(task);
  }

  async findById(id: any): Promise<Task | null> {
    return this.tasks.find(t => t.getId().getValue() === id.getValue()) || null;
  }

  async findAll(): Promise<Task[]> {
    return [...this.tasks];
  }

  async findByStatus(status: string): Promise<Task[]> {
    return this.tasks.filter(t => t.getStatus().getValue() === status);
  }

  async findByPriority(priority: string): Promise<Task[]> {
    return this.tasks.filter(t => t.getPriority().getValue() === priority);
  }

  async findByCategory(category: string): Promise<Task[]> {
    return this.tasks.filter(t => t.getCategory() === category);
  }

  async findByAssignee(assignee: string): Promise<Task[]> {
    return this.tasks.filter(t => t.getAssignee() === assignee);
  }

  async findOverdue(): Promise<Task[]> {
    return this.tasks.filter(t => t.isOverdue());
  }

  async findDueSoon(): Promise<Task[]> {
    return this.tasks.filter(t => t.isDueSoon());
  }

  async search(query: string): Promise<Task[]> {
    return this.tasks.filter(t => 
      t.getTitle().toLowerCase().includes(query.toLowerCase()) ||
      t.getDescription().toLowerCase().includes(query.toLowerCase())
    );
  }

  async delete(id: any): Promise<void> {
    const index = this.tasks.findIndex(t => t.getId().getValue() === id.getValue());
    if (index > -1) {
      this.tasks.splice(index, 1);
    }
  }

  async exists(id: any): Promise<boolean> {
    return this.tasks.some(t => t.getId().getValue() === id.getValue());
  }

  async countByStatus(status: string): Promise<number> {
    return this.tasks.filter(t => t.getStatus().getValue() === status).length;
  }

  async getStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
    overdue: number;
    dueSoon: number;
  }> {
    return {
      total: this.tasks.length,
      byStatus: {},
      byPriority: {},
      byCategory: {},
      overdue: 0,
      dueSoon: 0
    };
  }
}

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockRepository: MockTaskRepository;

  beforeEach(() => {
    mockRepository = new MockTaskRepository();
    useCase = new CreateTaskUseCase(mockRepository);
  });

  describe('Valid creation', () => {
    it('should create a task with valid data', async () => {
      const dto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        category: 'development',
        assignee: 'developer',
        labels: ['bug', 'urgent'],
        dueDate: '2024-12-31T00:00:00.000Z',
        estimatedHours: 8
      };

      const result = await useCase.execute(dto);

      expect(result.title).toBe('Test Task');
      expect(result.description).toBe('Test Description');
      expect(result.priority).toBe('high');
      expect(result.category).toBe('development');
      expect(result.assignee).toBe('developer');
      expect(result.labels).toEqual(['bug', 'urgent']);
      expect(result.status).toBe('todo');
      expect(result.progress).toBe(0);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should create a task with minimal data', async () => {
      const dto: CreateTaskDto = {
        title: 'Minimal Task',
        description: 'Minimal Description',
        priority: 'medium',
        category: 'general',
        assignee: 'user'
      };

      const result = await useCase.execute(dto);

      expect(result.title).toBe('Minimal Task');
      expect(result.priority).toBe('medium');
      expect(result.labels).toEqual([]);
      expect(result.estimatedHours).toBe(0);
    });
  });

  describe('Validation errors', () => {
    it('should throw error for empty title', async () => {
      const dto: CreateTaskDto = {
        title: '',
        description: 'Description',
        priority: 'medium',
        category: 'category',
        assignee: 'assignee'
      };

      await expect(useCase.execute(dto)).rejects.toThrow('Validation failed: Title is required');
    });

    it('should throw error for empty description', async () => {
      const dto: CreateTaskDto = {
        title: 'Title',
        description: '',
        priority: 'medium',
        category: 'category',
        assignee: 'assignee'
      };

      await expect(useCase.execute(dto)).rejects.toThrow('Validation failed: Description is required');
    });

    it('should throw error for invalid priority', async () => {
      const dto: CreateTaskDto = {
        title: 'Title',
        description: 'Description',
        priority: 'invalid' as any,
        category: 'category',
        assignee: 'assignee'
      };

      await expect(useCase.execute(dto)).rejects.toThrow('Validation failed: Priority is required and must be valid');
    });

    it('should throw error for empty category', async () => {
      const dto: CreateTaskDto = {
        title: 'Title',
        description: 'Description',
        priority: 'medium',
        category: '',
        assignee: 'assignee'
      };

      await expect(useCase.execute(dto)).rejects.toThrow('Validation failed: Category is required');
    });

    it('should throw error for empty assignee', async () => {
      const dto: CreateTaskDto = {
        title: 'Title',
        description: 'Description',
        priority: 'medium',
        category: 'category',
        assignee: ''
      };

      await expect(useCase.execute(dto)).rejects.toThrow('Validation failed: Assignee is required');
    });

    it('should throw error for invalid due date', async () => {
      const dto: CreateTaskDto = {
        title: 'Title',
        description: 'Description',
        priority: 'medium',
        category: 'category',
        assignee: 'assignee',
        dueDate: 'invalid-date'
      };

      await expect(useCase.execute(dto)).rejects.toThrow('Validation failed: Due date must be a valid date');
    });

    it('should throw error for negative estimated hours', async () => {
      const dto: CreateTaskDto = {
        title: 'Title',
        description: 'Description',
        priority: 'medium',
        category: 'category',
        assignee: 'assignee',
        estimatedHours: -1
      };

      await expect(useCase.execute(dto)).rejects.toThrow('Validation failed: Estimated hours must be between 0 and 1000');
    });

    it('should throw error for too many estimated hours', async () => {
      const dto: CreateTaskDto = {
        title: 'Title',
        description: 'Description',
        priority: 'medium',
        category: 'category',
        assignee: 'assignee',
        estimatedHours: 1001
      };

      await expect(useCase.execute(dto)).rejects.toThrow('Validation failed: Estimated hours must be between 0 and 1000');
    });
  });

  describe('Repository interaction', () => {
    it('should save task to repository', async () => {
      const dto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        category: 'development',
        assignee: 'developer'
      };

      await useCase.execute(dto);

      const tasks = await mockRepository.findAll();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].getTitle()).toBe('Test Task');
    });
  });
});
