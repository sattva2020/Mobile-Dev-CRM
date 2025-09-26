# 🎯 TypeScript Rules for CRM Project

## 📋 **TypeScript Best Practices**

### **1. Strict Type Safety**
- ✅ Always use strict TypeScript configuration
- ✅ No `any` types without explicit justification
- ✅ Use proper type guards and assertions
- ✅ Prefer interfaces over types for object shapes

```typescript
// ✅ CORRECT - Strict typing
interface TaskEntity {
  readonly id: string;
  readonly title: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
}

// ❌ WRONG - Loose typing
interface TaskEntity {
  id: any;
  title: any;
  status: any;
}
```

### **2. Domain Types**
- ✅ Create domain-specific types for business concepts
- ✅ Use enums for fixed sets of values
- ✅ Use branded types for IDs
- ✅ Avoid primitive obsession

```typescript
// ✅ CORRECT - Domain types
type TaskId = string & { readonly __brand: 'TaskId' };
type UserId = string & { readonly __brand: 'UserId' };

enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  DONE = 'done'
}

enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}
```

### **3. Error Handling**
- ✅ Use Result pattern for operations that can fail
- ✅ Create domain-specific exceptions
- ✅ Use discriminated unions for error states
- ✅ Never use exceptions for control flow

```typescript
// ✅ CORRECT - Result pattern
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

class TaskCreationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'TaskCreationError';
  }
}
```

### **4. Dependency Injection**
- ✅ Use constructor injection
- ✅ Define interfaces for dependencies
- ✅ Use factory functions for complex objects
- ✅ Avoid service locator pattern

```typescript
// ✅ CORRECT - Constructor injection
class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly notificationService: NotificationService
  ) {}
}

// ❌ WRONG - Service locator
class CreateTaskUseCase {
  async execute(dto: CreateTaskDto) {
    const taskRepo = ServiceLocator.get<TaskRepository>('TaskRepository');
    // ...
  }
}
```

### **5. Immutability**
- ✅ Use readonly properties
- ✅ Prefer functional approaches
- ✅ Use Object.freeze for deep immutability
- ✅ Avoid mutation of input parameters

```typescript
// ✅ CORRECT - Immutable entity
class TaskEntity {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly status: TaskStatus
  ) {}
  
  moveToInProgress(): TaskEntity {
    if (this.status !== TaskStatus.TODO) {
      throw new Error('Can only move from TODO to IN_PROGRESS');
    }
    return new TaskEntity(this.id, this.title, TaskStatus.IN_PROGRESS);
  }
}
```

## 🎯 **AI Generation Rules**

### **When generating TypeScript code:**

1. **Always use strict types**
2. **Create domain-specific types**
3. **Use proper error handling**
4. **Follow dependency injection**
5. **Prefer immutability**

### **Prompts for TypeScript generation:**

```
Generate TypeScript code following these rules:

1. Use strict typing (no any types)
2. Create domain-specific types and enums
3. Use Result pattern for error handling
4. Follow dependency injection
5. Prefer immutability
6. Use readonly properties
7. Create proper interfaces
8. Use branded types for IDs
```

## 🚨 **Red Flags - NEVER Generate**

- ❌ `any` types without justification
- ❌ Mutable entities
- ❌ Service locator pattern
- ❌ Exceptions for control flow
- ❌ Primitive obsession
- ❌ Loose typing
- ❌ Mutation of input parameters
- ❌ Global state

## 📊 **Quality Checklist**

Before accepting generated TypeScript code:

- [ ] No `any` types
- [ ] Proper error handling
- [ ] Immutable entities
- [ ] Constructor injection
- [ ] Domain-specific types
- [ ] Readonly properties
- [ ] Proper interfaces
- [ ] Branded types for IDs
- [ ] No mutation of inputs
- [ ] Strict type safety

---

**Version:** 1.0.0  
**Last Updated:** ${new Date().toLocaleDateString('ru-RU')}  
**Status:** ✅ Active
