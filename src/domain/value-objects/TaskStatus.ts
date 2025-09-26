/**
 * TaskStatus - Value Object для статуса задачи
 * Инкапсулирует бизнес-правила перехода между статусами
 */
export enum TaskStatusValue {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  DONE = 'done',
  CANCELLED = 'cancelled'
}

export class TaskStatus {
  private readonly value: TaskStatusValue;

  constructor(status: TaskStatusValue) {
    this.value = status;
  }

  getValue(): TaskStatusValue {
    return this.value;
  }

  isTodo(): boolean {
    return this.value === TaskStatusValue.TODO;
  }

  isInProgress(): boolean {
    return this.value === TaskStatusValue.IN_PROGRESS;
  }

  isReview(): boolean {
    return this.value === TaskStatusValue.REVIEW;
  }

  isDone(): boolean {
    return this.value === TaskStatusValue.DONE;
  }

  isCancelled(): boolean {
    return this.value === TaskStatusValue.CANCELLED;
  }

  canMoveToInProgress(): boolean {
    return this.value === TaskStatusValue.TODO;
  }

  canMoveToReview(): boolean {
    return this.value === TaskStatusValue.IN_PROGRESS;
  }

  canMoveToDone(): boolean {
    return this.value === TaskStatusValue.REVIEW;
  }

  canMoveToCancelled(): boolean {
    return this.value === TaskStatusValue.TODO || 
           this.value === TaskStatusValue.IN_PROGRESS;
  }

  moveToInProgress(): TaskStatus {
    if (!this.canMoveToInProgress()) {
      throw new Error(`Cannot move from ${this.value} to in-progress`);
    }
    return new TaskStatus(TaskStatusValue.IN_PROGRESS);
  }

  moveToReview(): TaskStatus {
    if (!this.canMoveToReview()) {
      throw new Error(`Cannot move from ${this.value} to review`);
    }
    return new TaskStatus(TaskStatusValue.REVIEW);
  }

  moveToDone(): TaskStatus {
    if (!this.canMoveToDone()) {
      throw new Error(`Cannot move from ${this.value} to done`);
    }
    return new TaskStatus(TaskStatusValue.DONE);
  }

  moveToCancelled(): TaskStatus {
    if (!this.canMoveToCancelled()) {
      throw new Error(`Cannot move from ${this.value} to cancelled`);
    }
    return new TaskStatus(TaskStatusValue.CANCELLED);
  }

  equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static todo(): TaskStatus {
    return new TaskStatus(TaskStatusValue.TODO);
  }

  static inProgress(): TaskStatus {
    return new TaskStatus(TaskStatusValue.IN_PROGRESS);
  }

  static review(): TaskStatus {
    return new TaskStatus(TaskStatusValue.REVIEW);
  }

  static done(): TaskStatus {
    return new TaskStatus(TaskStatusValue.DONE);
  }

  static cancelled(): TaskStatus {
    return new TaskStatus(TaskStatusValue.CANCELLED);
  }
}
