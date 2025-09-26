import { Task } from './Task';

/**
 * Project - Rich Domain Entity
 * Содержит бизнес-логику для управления проектами
 * Следует принципам Clean Architecture
 */
export class Project {
  private constructor(
    private readonly id: string,
    private name: string,
    private description: string,
    private status: ProjectStatus,
    private startDate: Date,
    private endDate: Date | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private tasks: Task[] = []
  ) {
    this.validateInvariants();
  }

  // Factory methods
  static create(
    name: string,
    description: string,
    startDate: Date,
    endDate?: Date
  ): Project {
    const now = new Date();
    return new Project(
      this.generateId(),
      name,
      description,
      ProjectStatus.ACTIVE,
      startDate,
      endDate || null,
      now,
      now
    );
  }

  static fromPersistence(data: {
    id: string;
    name: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
  }): Project {
    return new Project(
      data.id,
      data.name,
      data.description,
      data.status as ProjectStatus,
      new Date(data.startDate),
      data.endDate ? new Date(data.endDate) : null,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getStatus(): ProjectStatus {
    return this.status;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date | null {
    return this.endDate;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  // Business methods
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Project name cannot be empty');
    }
    this.name = name.trim();
    this.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  updateEndDate(endDate: Date | null): void {
    if (endDate && endDate <= this.startDate) {
      throw new Error('End date must be after start date');
    }
    this.endDate = endDate;
    this.updatedAt = new Date();
  }

  // Status transitions
  activate(): void {
    if (this.status === ProjectStatus.ACTIVE) {
      throw new Error('Project is already active');
    }
    this.status = ProjectStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  pause(): void {
    if (this.status === ProjectStatus.PAUSED) {
      throw new Error('Project is already paused');
    }
    this.status = ProjectStatus.PAUSED;
    this.updatedAt = new Date();
  }

  complete(): void {
    if (this.status === ProjectStatus.COMPLETED) {
      throw new Error('Project is already completed');
    }
    this.status = ProjectStatus.COMPLETED;
    this.endDate = new Date();
    this.updatedAt = new Date();
  }

  archive(): void {
    if (this.status === ProjectStatus.ARCHIVED) {
      throw new Error('Project is already archived');
    }
    this.status = ProjectStatus.ARCHIVED;
    this.updatedAt = new Date();
  }

  // Task management
  addTask(task: Task): void {
    if (this.tasks.some(t => t.getId().getValue() === task.getId().getValue())) {
      throw new Error('Task already exists in project');
    }
    this.tasks.push(task);
    this.updatedAt = new Date();
  }

  removeTask(taskId: string): void {
    const index = this.tasks.findIndex(t => t.getId().getValue() === taskId);
    if (index === -1) {
      throw new Error('Task not found in project');
    }
    this.tasks.splice(index, 1);
    this.updatedAt = new Date();
  }

  // Business rules
  isActive(): boolean {
    return this.status === ProjectStatus.ACTIVE;
  }

  isCompleted(): boolean {
    return this.status === ProjectStatus.COMPLETED;
  }

  isOverdue(): boolean {
    if (!this.endDate || this.isCompleted()) {
      return false;
    }
    return new Date() > this.endDate;
  }

  isDueSoon(): boolean {
    if (!this.endDate || this.isCompleted()) {
      return false;
    }
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return this.endDate <= threeDaysFromNow;
  }

  getProgress(): number {
    if (this.tasks.length === 0) {
      return 0;
    }
    const completedTasks = this.tasks.filter(task => task.getStatus().isDone());
    return Math.round((completedTasks.length / this.tasks.length) * 100);
  }

  getTotalEstimatedHours(): number {
    return this.tasks.reduce((sum, task) => sum + task.getEstimatedHours(), 0);
  }

  getTotalActualHours(): number {
    return this.tasks.reduce((sum, task) => sum + task.getActualHours(), 0);
  }

  getTimeVariance(): number {
    const estimated = this.getTotalEstimatedHours();
    if (estimated === 0) {
      return 0;
    }
    const actual = this.getTotalActualHours();
    return ((actual - estimated) / estimated) * 100;
  }

  getOverdueTasks(): Task[] {
    return this.tasks.filter(task => task.isOverdue());
  }

  getDueSoonTasks(): Task[] {
    return this.tasks.filter(task => task.isDueSoon());
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(task => task.getStatus().getValue() === status);
  }

  getTasksByPriority(priority: string): Task[] {
    return this.tasks.filter(task => task.getPriority().getValue() === priority);
  }

  getTasksByAssignee(assignee: string): Task[] {
    return this.tasks.filter(task => task.getAssignee() === assignee);
  }

  // Statistics
  getStats(): {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    totalEstimatedHours: number;
    totalActualHours: number;
    progress: number;
    timeVariance: number;
  } {
    return {
      totalTasks: this.tasks.length,
      completedTasks: this.getTasksByStatus('done').length,
      inProgressTasks: this.getTasksByStatus('in-progress').length,
      overdueTasks: this.getOverdueTasks().length,
      totalEstimatedHours: this.getTotalEstimatedHours(),
      totalActualHours: this.getTotalActualHours(),
      progress: this.getProgress(),
      timeVariance: this.getTimeVariance()
    };
  }

  // Validation
  private validateInvariants(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Project name cannot be empty');
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Project description cannot be empty');
    }
    if (this.endDate && this.endDate <= this.startDate) {
      throw new Error('End date must be after start date');
    }
  }

  private static generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Persistence
  toPersistence(): {
    id: string;
    name: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
  } {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate?.toISOString() || null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}

export enum ProjectStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}
