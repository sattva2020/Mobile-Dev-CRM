import { Task } from '../../../domain/entities/Task';
import { TaskId } from '../../../domain/value-objects/TaskId';
import { TaskStatus, TaskStatusValue } from '../../../domain/value-objects/TaskStatus';
import { TaskPriority, TaskPriorityValue } from '../../../domain/value-objects/TaskPriority';

describe('Task Entity', () => {
  describe('Creation', () => {
    it('should create a task with valid data', () => {
      const task = Task.create(
        'Test Task',
        'Test Description',
        TaskPriorityValue.HIGH,
        'development',
        'developer',
        ['bug', 'urgent'],
        new Date('2024-12-31'),
        8
      );

      expect(task.getTitle()).toBe('Test Task');
      expect(task.getDescription()).toBe('Test Description');
      expect(task.getPriority().getValue()).toBe(TaskPriorityValue.HIGH);
      expect(task.getCategory()).toBe('development');
      expect(task.getAssignee()).toBe('developer');
      expect(task.getLabels()).toEqual(['bug', 'urgent']);
      expect(task.getEstimatedHours()).toBe(8);
      expect(task.getStatus().getValue()).toBe(TaskStatusValue.TODO);
      expect(task.getProgress()).toBe(0);
    });

    it('should throw error for empty title', () => {
      expect(() => {
        Task.create('', 'Description', TaskPriorityValue.MEDIUM, 'category', 'assignee');
      }).toThrow('Task title cannot be empty');
    });

    it('should throw error for empty category', () => {
      expect(() => {
        Task.create('Title', 'Description', TaskPriorityValue.MEDIUM, '', 'assignee');
      }).toThrow('Task category cannot be empty');
    });
  });

  describe('Status Transitions', () => {
    let task: Task;

    beforeEach(() => {
      task = Task.create(
        'Test Task',
        'Test Description',
        TaskPriorityValue.MEDIUM,
        'development',
        'developer'
      );
    });

    it('should move from TODO to IN_PROGRESS', () => {
      task.moveToInProgress();
      expect(task.getStatus().getValue()).toBe(TaskStatusValue.IN_PROGRESS);
    });

    it('should move from IN_PROGRESS to REVIEW', () => {
      task.moveToInProgress();
      task.moveToReview();
      expect(task.getStatus().getValue()).toBe(TaskStatusValue.REVIEW);
    });

    it('should move from REVIEW to DONE', () => {
      task.moveToInProgress();
      task.moveToReview();
      task.moveToDone();
      expect(task.getStatus().getValue()).toBe(TaskStatusValue.DONE);
      expect(task.getProgress()).toBe(100);
    });

    it('should throw error for invalid transition', () => {
      task.moveToInProgress();
      expect(() => {
        task.moveToInProgress(); // Already in progress
      }).toThrow('Cannot move from in-progress to in-progress');
    });
  });

  describe('Business Rules', () => {
    let task: Task;

    beforeEach(() => {
      task = Task.create(
        'Test Task',
        'Test Description',
        TaskPriorityValue.MEDIUM,
        'development',
        'developer',
        [],
        new Date('2024-12-31'),
        8
      );
    });

    it('should detect overdue tasks', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      task.updateDueDate(pastDate);
      
      expect(task.isOverdue()).toBe(true);
    });

    it('should detect due soon tasks', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      task.updateDueDate(tomorrow);
      
      expect(task.isDueSoon()).toBe(true);
    });

    it('should calculate time variance', () => {
      task.updateEstimatedHours(10);
      task.addActualHours(12);
      
      expect(task.getTimeVariance()).toBe(20); // 20% overrun
    });

    it('should detect time overrun', () => {
      task.updateEstimatedHours(10);
      task.addActualHours(12);
      
      expect(task.isTimeOverrun()).toBe(true);
    });
  });

  describe('Updates', () => {
    let task: Task;

    beforeEach(() => {
      task = Task.create(
        'Test Task',
        'Test Description',
        TaskPriorityValue.MEDIUM,
        'development',
        'developer'
      );
    });

    it('should update title', () => {
      task.updateTitle('Updated Title');
      expect(task.getTitle()).toBe('Updated Title');
    });

    it('should throw error for empty title update', () => {
      expect(() => {
        task.updateTitle('');
      }).toThrow('Task title cannot be empty');
    });

    it('should update priority', () => {
      const newPriority = new TaskPriority(TaskPriorityValue.HIGH);
      task.updatePriority(newPriority);
      expect(task.getPriority().getValue()).toBe(TaskPriorityValue.HIGH);
    });

    it('should add labels', () => {
      task.addLabel('new-label');
      expect(task.getLabels()).toContain('new-label');
    });

    it('should remove labels', () => {
      task.addLabel('test-label');
      task.removeLabel('test-label');
      expect(task.getLabels()).not.toContain('test-label');
    });

    it('should update progress', () => {
      task.updateProgress(50);
      expect(task.getProgress()).toBe(50);
    });

    it('should throw error for invalid progress', () => {
      expect(() => {
        task.updateProgress(150);
      }).toThrow('Progress must be between 0 and 100');
    });
  });

  describe('GitHub Integration', () => {
    let task: Task;

    beforeEach(() => {
      task = Task.create(
        'Test Task',
        'Test Description',
        TaskPriorityValue.MEDIUM,
        'development',
        'developer'
      );
    });

    it('should link to GitHub issue', () => {
      task.linkToGithubIssue('123', 'https://github.com/repo/issues/123');
      
      expect(task.getGithubIssueId()).toBe('123');
      expect(task.getGithubUrl()).toBe('https://github.com/repo/issues/123');
    });

    it('should unlink from GitHub', () => {
      task.linkToGithubIssue('123', 'https://github.com/repo/issues/123');
      task.unlinkFromGithub();
      
      expect(task.getGithubIssueId()).toBeNull();
      expect(task.getGithubUrl()).toBeNull();
    });
  });

  describe('Persistence', () => {
    it('should create from persistence data', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Task',
        description: 'Test Description',
        status: 'in-progress',
        priority: 'high',
        category: 'development',
        assignee: 'developer',
        labels: ['bug'],
        dueDate: '2024-12-31T00:00:00.000Z',
        estimatedHours: 8,
        actualHours: 4,
        progress: 50,
        githubIssueId: '123',
        githubUrl: 'https://github.com/repo/issues/123',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z'
      };

      const task = Task.fromPersistence(data);

      expect(task.getTitle()).toBe('Test Task');
      expect(task.getStatus().getValue()).toBe('in-progress');
      expect(task.getPriority().getValue()).toBe('high');
      expect(task.getProgress()).toBe(50);
    });

    it('should convert to persistence data', () => {
      const task = Task.create(
        'Test Task',
        'Test Description',
        TaskPriorityValue.HIGH,
        'development',
        'developer'
      );

      const data = task.toPersistence();

      expect(data.title).toBe('Test Task');
      expect(data.status).toBe('todo');
      expect(data.priority).toBe('high');
      expect(data.id).toBeDefined();
      expect(data.createdAt).toBeDefined();
      expect(data.updatedAt).toBeDefined();
    });
  });
});
