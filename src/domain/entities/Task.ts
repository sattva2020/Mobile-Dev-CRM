import { TaskId } from '../value-objects/TaskId';
import { TaskStatus, TaskStatusValue } from '../value-objects/TaskStatus';
import { TaskPriority, TaskPriorityValue } from '../value-objects/TaskPriority';

/**
 * Task - Rich Domain Entity
 * Содержит бизнес-логику и валидацию
 * Следует принципам Clean Architecture
 */
export class Task {
  private constructor(
    private readonly id: TaskId,
    private title: string,
    private description: string,
    private status: TaskStatus,
    private priority: TaskPriority,
    private category: string,
    private assignee: string,
    private labels: string[],
    private dueDate: Date | null,
    private estimatedHours: number,
    private actualHours: number,
    private progress: number,
    private githubIssueId: string | null,
    private githubUrl: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {
    this.validateInvariants();
  }

  // Factory methods
  static create(
    title: string,
    description: string,
    priority: TaskPriorityValue,
    category: string,
    assignee: string,
    labels: string[] = [],
    dueDate?: Date,
    estimatedHours: number = 0
  ): Task {
    const now = new Date();
    return new Task(
      TaskId.generate(),
      title,
      description,
      TaskStatus.todo(),
      new TaskPriority(priority),
      category,
      assignee,
      labels,
      dueDate || null,
      estimatedHours,
      0,
      0,
      null,
      null,
      now,
      now
    );
  }

  static fromPersistence(data: {
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
  }): Task {
    return new Task(
      new TaskId(data.id),
      data.title,
      data.description,
      new TaskStatus(data.status as TaskStatusValue),
      new TaskPriority(data.priority as TaskPriorityValue),
      data.category,
      data.assignee,
      data.labels,
      data.dueDate ? new Date(data.dueDate) : null,
      data.estimatedHours,
      data.actualHours,
      data.progress,
      data.githubIssueId,
      data.githubUrl,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }

  // Getters
  getId(): TaskId {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  getPriority(): TaskPriority {
    return this.priority;
  }

  getCategory(): string {
    return this.category;
  }

  getAssignee(): string {
    return this.assignee;
  }

  getLabels(): string[] {
    return [...this.labels];
  }

  getDueDate(): Date | null {
    return this.dueDate;
  }

  getEstimatedHours(): number {
    return this.estimatedHours;
  }

  getActualHours(): number {
    return this.actualHours;
  }

  getProgress(): number {
    return this.progress;
  }

  getGithubIssueId(): string | null {
    return this.githubIssueId;
  }

  getGithubUrl(): string | null {
    return this.githubUrl;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business methods
  updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Task title cannot be empty');
    }
    this.title = title.trim();
    this.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  updatePriority(priority: TaskPriority): void {
    this.priority = priority;
    this.updatedAt = new Date();
  }

  updateCategory(category: string): void {
    if (!category || category.trim().length === 0) {
      throw new Error('Task category cannot be empty');
    }
    this.category = category.trim();
    this.updatedAt = new Date();
  }

  updateAssignee(assignee: string): void {
    this.assignee = assignee;
    this.updatedAt = new Date();
  }

  addLabel(label: string): void {
    if (!label || label.trim().length === 0) {
      throw new Error('Label cannot be empty');
    }
    const trimmedLabel = label.trim();
    if (!this.labels.includes(trimmedLabel)) {
      this.labels.push(trimmedLabel);
      this.updatedAt = new Date();
    }
  }

  removeLabel(label: string): void {
    const index = this.labels.indexOf(label);
    if (index > -1) {
      this.labels.splice(index, 1);
      this.updatedAt = new Date();
    }
  }

  updateDueDate(dueDate: Date | null): void {
    this.dueDate = dueDate;
    this.updatedAt = new Date();
  }

  updateEstimatedHours(hours: number): void {
    if (hours < 0) {
      throw new Error('Estimated hours cannot be negative');
    }
    this.estimatedHours = hours;
    this.updatedAt = new Date();
  }

  addActualHours(hours: number): void {
    if (hours < 0) {
      throw new Error('Actual hours cannot be negative');
    }
    this.actualHours += hours;
    this.updatedAt = new Date();
  }

  updateProgress(progress: number): void {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }
    this.progress = progress;
    this.updatedAt = new Date();
  }

  // Status transitions
  moveToInProgress(): void {
    this.status = this.status.moveToInProgress();
    this.updatedAt = new Date();
  }

  moveToReview(): void {
    this.status = this.status.moveToReview();
    this.updatedAt = new Date();
  }

  moveToDone(): void {
    this.status = this.status.moveToDone();
    this.progress = 100;
    this.updatedAt = new Date();
  }

  moveToCancelled(): void {
    this.status = this.status.moveToCancelled();
    this.updatedAt = new Date();
  }

  // GitHub integration
  linkToGithubIssue(issueId: string, url: string): void {
    this.githubIssueId = issueId;
    this.githubUrl = url;
    this.updatedAt = new Date();
  }

  unlinkFromGithub(): void {
    this.githubIssueId = null;
    this.githubUrl = null;
    this.updatedAt = new Date();
  }

  // Business rules
  isOverdue(): boolean {
    if (!this.dueDate || this.status.isDone() || this.status.isCancelled()) {
      return false;
    }
    return new Date() > this.dueDate;
  }

  isDueSoon(): boolean {
    if (!this.dueDate || this.status.isDone() || this.status.isCancelled()) {
      return false;
    }
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return this.dueDate <= threeDaysFromNow;
  }

  getTimeVariance(): number {
    if (this.estimatedHours === 0) {
      return 0;
    }
    return ((this.actualHours - this.estimatedHours) / this.estimatedHours) * 100;
  }

  isTimeOverrun(): boolean {
    return this.getTimeVariance() > 20; // 20% overrun
  }

  // Validation
  private validateInvariants(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Task title cannot be empty');
    }
    if (!this.category || this.category.trim().length === 0) {
      throw new Error('Task category cannot be empty');
    }
    if (this.estimatedHours < 0) {
      throw new Error('Estimated hours cannot be negative');
    }
    if (this.actualHours < 0) {
      throw new Error('Actual hours cannot be negative');
    }
    if (this.progress < 0 || this.progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }
  }

  // Persistence
  toPersistence(): {
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
  } {
    return {
      id: this.id.getValue(),
      title: this.title,
      description: this.description,
      status: this.status.getValue(),
      priority: this.priority.getValue(),
      category: this.category,
      assignee: this.assignee,
      labels: [...this.labels],
      dueDate: this.dueDate?.toISOString() || null,
      estimatedHours: this.estimatedHours,
      actualHours: this.actualHours,
      progress: this.progress,
      githubIssueId: this.githubIssueId,
      githubUrl: this.githubUrl,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}
