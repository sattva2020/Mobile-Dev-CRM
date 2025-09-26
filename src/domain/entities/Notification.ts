/**
 * Notification - Rich Domain Entity
 * Содержит бизнес-логику для управления уведомлениями
 * Следует принципам Clean Architecture
 */
export class Notification {
  private constructor(
    private readonly id: string,
    private title: string,
    private message: string,
    private type: NotificationType,
    private source: NotificationSource,
    private read: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private metadata: Record<string, any> = {}
  ) {
    this.validateInvariants();
  }

  // Factory methods
  static create(
    title: string,
    message: string,
    type: NotificationType,
    source: NotificationSource,
    metadata?: Record<string, any>
  ): Notification {
    const now = new Date();
    return new Notification(
      this.generateId(),
      title,
      message,
      type,
      source,
      false,
      now,
      now,
      metadata || {}
    );
  }

  static fromPersistence(data: {
    id: string;
    title: string;
    message: string;
    type: string;
    source: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, any>;
  }): Notification {
    return new Notification(
      data.id,
      data.title,
      data.message,
      data.type as NotificationType,
      data.source as NotificationSource,
      data.read,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.metadata || {}
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getMessage(): string {
    return this.message;
  }

  getType(): NotificationType {
    return this.type;
  }

  getSource(): NotificationSource {
    return this.source;
  }

  isRead(): boolean {
    return this.read;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getMetadata(): Record<string, any> {
    return { ...this.metadata };
  }

  // Business methods
  updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Notification title cannot be empty');
    }
    this.title = title.trim();
    this.updatedAt = new Date();
  }

  updateMessage(message: string): void {
    if (!message || message.trim().length === 0) {
      throw new Error('Notification message cannot be empty');
    }
    this.message = message.trim();
    this.updatedAt = new Date();
  }

  updateType(type: NotificationType): void {
    this.type = type;
    this.updatedAt = new Date();
  }

  markAsRead(): void {
    if (this.read) {
      throw new Error('Notification is already read');
    }
    this.read = true;
    this.updatedAt = new Date();
  }

  markAsUnread(): void {
    if (!this.read) {
      throw new Error('Notification is already unread');
    }
    this.read = false;
    this.updatedAt = new Date();
  }

  updateMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.updatedAt = new Date();
  }

  addMetadata(key: string, value: any): void {
    this.metadata[key] = value;
    this.updatedAt = new Date();
  }

  removeMetadata(key: string): void {
    delete this.metadata[key];
    this.updatedAt = new Date();
  }

  // Business rules
  isSuccess(): boolean {
    return this.type === NotificationType.SUCCESS;
  }

  isWarning(): boolean {
    return this.type === NotificationType.WARNING;
  }

  isError(): boolean {
    return this.type === NotificationType.ERROR;
  }

  isInfo(): boolean {
    return this.type === NotificationType.INFO;
  }

  isFromSystem(): boolean {
    return this.source === NotificationSource.SYSTEM;
  }

  isFromGitHub(): boolean {
    return this.source === NotificationSource.GITHUB;
  }

  isFromAI(): boolean {
    return this.source === NotificationSource.AI;
  }

  isFromUser(): boolean {
    return this.source === NotificationSource.USER;
  }

  isRecent(): boolean {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    return this.createdAt > oneHourAgo;
  }

  isOld(): boolean {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.createdAt < oneWeekAgo;
  }

  getAgeInMinutes(): number {
    const now = new Date();
    return Math.floor((now.getTime() - this.createdAt.getTime()) / (1000 * 60));
  }

  getAgeInHours(): number {
    return Math.floor(this.getAgeInMinutes() / 60);
  }

  getAgeInDays(): number {
    return Math.floor(this.getAgeInHours() / 24);
  }

  // Priority based on type and age
  getPriority(): NotificationPriority {
    if (this.isError()) {
      return NotificationPriority.HIGH;
    }
    if (this.isWarning()) {
      return NotificationPriority.MEDIUM;
    }
    if (this.isSuccess() && this.isRecent()) {
      return NotificationPriority.LOW;
    }
    if (this.isInfo() && this.isRecent()) {
      return NotificationPriority.MEDIUM;
    }
    return NotificationPriority.LOW;
  }

  // Validation
  private validateInvariants(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Notification title cannot be empty');
    }
    if (!this.message || this.message.trim().length === 0) {
      throw new Error('Notification message cannot be empty');
    }
    if (!Object.values(NotificationType).includes(this.type)) {
      throw new Error('Invalid notification type');
    }
    if (!Object.values(NotificationSource).includes(this.source)) {
      throw new Error('Invalid notification source');
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
    title: string;
    message: string;
    type: string;
    source: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
    metadata: Record<string, any>;
  } {
    return {
      id: this.id,
      title: this.title,
      message: this.message,
      type: this.type,
      source: this.source,
      read: this.read,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      metadata: { ...this.metadata }
    };
  }
}

export enum NotificationType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info'
}

export enum NotificationSource {
  SYSTEM = 'system',
  GITHUB = 'github',
  AI = 'ai',
  USER = 'user'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
