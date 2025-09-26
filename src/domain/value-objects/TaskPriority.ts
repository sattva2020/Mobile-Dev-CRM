/**
 * TaskPriority - Value Object для приоритета задачи
 * Инкапсулирует бизнес-правила приоритетов
 */
export enum TaskPriorityValue {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export class TaskPriority {
  private readonly value: TaskPriorityValue;

  constructor(priority: TaskPriorityValue) {
    this.value = priority;
  }

  getValue(): TaskPriorityValue {
    return this.value;
  }

  isLow(): boolean {
    return this.value === TaskPriorityValue.LOW;
  }

  isMedium(): boolean {
    return this.value === TaskPriorityValue.MEDIUM;
  }

  isHigh(): boolean {
    return this.value === TaskPriorityValue.HIGH;
  }

  isUrgent(): boolean {
    return this.value === TaskPriorityValue.URGENT;
  }

  getNumericValue(): number {
    switch (this.value) {
      case TaskPriorityValue.LOW:
        return 1;
      case TaskPriorityValue.MEDIUM:
        return 2;
      case TaskPriorityValue.HIGH:
        return 3;
      case TaskPriorityValue.URGENT:
        return 4;
      default:
        return 0;
    }
  }

  isHigherThan(other: TaskPriority): boolean {
    return this.getNumericValue() > other.getNumericValue();
  }

  isLowerThan(other: TaskPriority): boolean {
    return this.getNumericValue() < other.getNumericValue();
  }

  equals(other: TaskPriority): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static low(): TaskPriority {
    return new TaskPriority(TaskPriorityValue.LOW);
  }

  static medium(): TaskPriority {
    return new TaskPriority(TaskPriorityValue.MEDIUM);
  }

  static high(): TaskPriority {
    return new TaskPriority(TaskPriorityValue.HIGH);
  }

  static urgent(): TaskPriority {
    return new TaskPriority(TaskPriorityValue.URGENT);
  }
}
