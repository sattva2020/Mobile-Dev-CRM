# 🏗️ Cursor IDE Rules - Clean Architecture for AI Era

## 📋 **Core Principles**

You are an expert in Clean Architecture and AI-assisted development. Follow these rules when generating or modifying code in this CRM project.

## 🎯 **Architecture Rules**

### **1. Entity Rules - Rich Domain Models**
- ✅ Entities MUST contain business logic and validation
- ✅ Entities MUST be independent of frameworks, databases, or external concerns
- ✅ Entities MUST validate their own invariants
- ❌ NEVER create anemic entities (data containers only)
- ❌ NEVER add framework-specific annotations to entities
- ❌ NEVER add serialization logic to entities

```typescript
// ✅ CORRECT - Rich Entity
class TaskEntity {
  constructor(
    private id: string,
    private title: string,
    private status: TaskStatus,
    private priority: TaskPriority
  ) {
    this.validateInvariants();
  }
  
  moveToInProgress(): void {
    if (this.status !== TaskStatus.TODO) {
      throw new Error('Can only move from TODO to IN_PROGRESS');
    }
    this.status = TaskStatus.IN_PROGRESS;
  }
  
  private validateInvariants(): void {
    if (!this.title.trim()) {
      throw new Error('Task title cannot be empty');
    }
  }
}

// ❌ WRONG - Anemic Entity
class TaskEntity {
  id: string;
  title: string;
  status: string;
  // No business logic - just data container
}
```

### **2. Use Case Rules - Orchestration Only**
- ✅ Use Cases MUST only orchestrate, never contain business logic
- ✅ Use Cases MUST depend on interfaces, not concrete implementations
- ✅ Use Cases MUST have clear input/output DTOs
- ✅ Use Cases MUST handle errors through domain exceptions
- ❌ NEVER put business logic in Use Cases
- ❌ NEVER depend on frameworks in Use Cases

```typescript
// ✅ CORRECT - Use Case
class CreateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private notificationService: NotificationService
  ) {}
  
  async execute(dto: CreateTaskDto): Promise<TaskEntity> {
    // 1. Create domain entity (business logic is in entity)
    const task = new TaskEntity(dto.id, dto.title, TaskStatus.TODO, dto.priority);
    
    // 2. Save through repository interface
    await this.taskRepository.save(task);
    
    // 3. Send notification
    await this.notificationService.notifyTaskCreated(task);
    
    return task;
  }
}

// ❌ WRONG - Business logic in Use Case
class CreateTaskUseCase {
  async execute(dto: CreateTaskDto): Promise<TaskEntity> {
    // Business logic should be in entity, not here
    if (!dto.title.trim()) {
      throw new Error('Title cannot be empty');
    }
    // ...
  }
}
```

### **3. Repository Rules - Interface Segregation**
- ✅ Repositories MUST be interfaces in domain layer
- ✅ Repositories MUST have single responsibility
- ✅ Repositories MUST be implemented in infrastructure layer
- ❌ NEVER put repository implementations in domain layer
- ❌ NEVER mix different aggregate roots in one repository

```typescript
// ✅ CORRECT - Repository Interface
interface TaskRepository {
  findById(id: string): Promise<TaskEntity | null>;
  save(task: TaskEntity): Promise<void>;
  findByStatus(status: TaskStatus): Promise<TaskEntity[]>;
  delete(id: string): Promise<void>;
}

// ✅ CORRECT - Repository Implementation
class PostgresTaskRepository implements TaskRepository {
  constructor(private db: Database) {}
  
  async findById(id: string): Promise<TaskEntity | null> {
    const row = await this.db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return row ? this.mapToEntity(row) : null;
  }
  
  private mapToEntity(row: any): TaskEntity {
    return new TaskEntity(row.id, row.title, row.status, row.priority);
  }
}
```

### **4. DTO Rules - Clear Boundaries**
- ✅ DTOs MUST be simple data structures
- ✅ DTOs MUST be used for crossing layer boundaries
- ✅ DTOs MUST have clear naming (Request/Response)
- ❌ NEVER put business logic in DTOs
- ❌ NEVER use entities as DTOs

```typescript
// ✅ CORRECT - DTOs
interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId?: string;
}

interface CreateTaskResponse {
  taskId: string;
  status: string;
  createdAt: string;
}

// ❌ WRONG - Using Entity as DTO
class CreateTaskUseCase {
  async execute(task: TaskEntity): Promise<TaskEntity> {
    // Entity should not cross boundaries
  }
}
```

## 🎯 **AI Generation Rules**

### **When generating code, always:**

1. **Start with Entity** - Define business rules first
2. **Create Use Case** - Orchestrate the flow
3. **Add Repository Interface** - Define data access
4. **Create DTOs** - Define boundaries
5. **Implement Adapters** - Connect to external world

### **Prompts for AI Generation:**

#### **For Entity Generation:**
```
Create a domain entity for [entity_name] following Clean Architecture:

1. Include all business rules and validation
2. No external dependencies (no frameworks, databases, etc.)
3. Methods should reflect business operations
4. Validate invariants in constructor
5. Use domain exceptions for business rule violations

Example structure:
- Constructor with validation
- Business methods with checks
- Private methods for logic
- Domain exceptions for errors
```

#### **For Use Case Generation:**
```
Create a Use Case for [functionality] following Clean Architecture:

1. Only orchestration, no business logic
2. Dependencies through interfaces
3. Clear input/output DTOs
4. Error handling through domain exceptions
5. Single responsibility

Example structure:
- Input DTO
- Output DTO
- Interface dependencies
- Orchestration sequence
- Error handling
```

#### **For Repository Generation:**
```
Create a repository interface for [entity] following Clean Architecture:

1. Interface in domain layer
2. Single responsibility
3. Domain entity as return type
4. Clear method names
5. No framework dependencies

Example methods:
- findById(id: string): Promise<Entity | null>
- save(entity: Entity): Promise<void>
- findByCriteria(criteria: Criteria): Promise<Entity[]>
```

## 🚨 **Red Flags - NEVER Generate**

- ❌ Business logic in controllers
- ❌ Entities knowing about databases
- ❌ Use Cases with implementation details
- ❌ Dependencies violating Dependency Rule
- ❌ Mixed responsibilities
- ❌ Framework annotations in domain
- ❌ Serialization logic in entities
- ❌ Database queries in Use Cases

## 📊 **Quality Checklist**

Before accepting generated code, verify:

- [ ] Entity contains only business logic
- [ ] Use Case only orchestrates
- [ ] No framework dependencies in domain
- [ ] Clear layer boundaries
- [ ] Tests are easily generatable
- [ ] AI can understand structure from single file
- [ ] Dependencies point inward only
- [ ] Single responsibility per class
- [ ] Clear naming conventions
- [ ] Proper error handling

## 🏗️ **CRM Project Specific Rules**

### **Task Management:**
- TaskEntity must validate status transitions
- TaskRepository must handle CRUD operations
- TaskUseCase must orchestrate task operations
- TaskDTOs must cross boundaries safely

### **GitHub Integration:**
- GitHubService must be in infrastructure layer
- GitHubRepository must implement interface
- GitHubUseCase must orchestrate GitHub operations
- GitHubDTOs must handle API responses

### **AI Analytics:**
- AIEntity must contain analysis rules
- AIUseCase must orchestrate AI operations
- AIService must be in infrastructure layer
- AIDTOs must handle AI responses

## 🎯 **Testing Rules**

### **For AI-Generated Tests:**
- Mock all external dependencies
- Test business logic in entities
- Test orchestration in Use Cases
- Test boundaries with DTOs
- Use Given-When-Then structure

```typescript
// ✅ CORRECT - Test Structure
describe('CreateTaskUseCase', () => {
  it('should create task with valid data', async () => {
    // Given
    const mockRepo = mock<TaskRepository>();
    const mockNotification = mock<NotificationService>();
    const useCase = new CreateTaskUseCase(mockRepo, mockNotification);
    
    // When
    const result = await useCase.execute(validDto);
    
    // Then
    expect(mockRepo.save).toHaveBeenCalledWith(expect.any(TaskEntity));
    expect(result).toBeInstanceOf(TaskEntity);
  });
});
```

## 🚀 **Performance Rules**

- Use DTOs for data transfer (avoid entity serialization)
- Implement repository patterns for data access
- Use interfaces for dependency injection
- Keep domain layer lightweight
- Separate concerns properly

## 📚 **References**

- Clean Architecture by Robert Martin
- Rich Domain Models vs Anemic Domain Models
- Dependency Rule
- Interface Segregation Principle
- Single Responsibility Principle

---

**Remember:** In the AI era, architecture is not about "correctness" but about "clarity and verifiability". Generate code that AI can understand and maintain! 🎉

**Version:** 1.0.0  
**Last Updated:** ${new Date().toLocaleDateString('ru-RU')}  
**Status:** ✅ Active
