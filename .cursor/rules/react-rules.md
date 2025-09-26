# ⚛️ React Rules for CRM Project

## 📋 **React Best Practices**

### **1. Component Structure**
- ✅ Use functional components with hooks
- ✅ Separate presentation from logic
- ✅ Use custom hooks for complex logic
- ✅ Prefer composition over inheritance

```typescript
// ✅ CORRECT - Functional component
interface TaskCardProps {
  task: TaskEntity;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onStatusChange, 
  onDelete 
}) => {
  const handleStatusChange = useCallback((status: TaskStatus) => {
    onStatusChange(task.id, status);
  }, [task.id, onStatusChange]);

  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <TaskStatusSelect 
        value={task.status} 
        onChange={handleStatusChange} 
      />
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
};
```

### **2. State Management**
- ✅ Use local state for component-specific data
- ✅ Use context for shared state
- ✅ Use custom hooks for complex state logic
- ✅ Avoid prop drilling

```typescript
// ✅ CORRECT - Custom hook for state
export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (dto: CreateTaskDto) => {
    setLoading(true);
    try {
      const newTask = await taskService.createTask(dto);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { tasks, loading, error, createTask };
};
```

### **3. Performance Optimization**
- ✅ Use React.memo for expensive components
- ✅ Use useCallback for event handlers
- ✅ Use useMemo for expensive calculations
- ✅ Avoid unnecessary re-renders

```typescript
// ✅ CORRECT - Optimized component
export const TaskList = React.memo<TaskListProps>(({ tasks, onTaskUpdate }) => {
  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<TaskEntity>) => {
    onTaskUpdate(taskId, updates);
  }, [onTaskUpdate]);

  const sortedTasks = useMemo(() => 
    tasks.sort((a, b) => a.priority - b.priority), 
    [tasks]
  );

  return (
    <div className="task-list">
      {sortedTasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onUpdate={handleTaskUpdate} 
        />
      ))}
    </div>
  );
});
```

### **4. Error Boundaries**
- ✅ Use error boundaries for error handling
- ✅ Provide fallback UI for errors
- ✅ Log errors for debugging
- ✅ Handle async errors properly

```typescript
// ✅ CORRECT - Error boundary
export class TaskErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Task component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong with tasks</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### **5. Testing**
- ✅ Write tests for components
- ✅ Test user interactions
- ✅ Mock external dependencies
- ✅ Use testing library best practices

```typescript
// ✅ CORRECT - Component test
describe('TaskCard', () => {
  it('should render task information', () => {
    const mockTask = new TaskEntity('1', 'Test Task', TaskStatus.TODO, TaskPriority.MEDIUM);
    const onStatusChange = jest.fn();
    const onDelete = jest.fn();

    render(
      <TaskCard 
        task={mockTask} 
        onStatusChange={onStatusChange} 
        onDelete={onDelete} 
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('TODO')).toBeInTheDocument();
  });

  it('should call onStatusChange when status is updated', () => {
    const mockTask = new TaskEntity('1', 'Test Task', TaskStatus.TODO, TaskPriority.MEDIUM);
    const onStatusChange = jest.fn();
    const onDelete = jest.fn();

    render(
      <TaskCard 
        task={mockTask} 
        onStatusChange={onStatusChange} 
        onDelete={onDelete} 
      />
    );

    fireEvent.click(screen.getByText('Move to In Progress'));
    expect(onStatusChange).toHaveBeenCalledWith('1', TaskStatus.IN_PROGRESS);
  });
});
```

## 🎯 **AI Generation Rules**

### **When generating React components:**

1. **Use functional components with hooks**
2. **Separate presentation from logic**
3. **Use proper TypeScript interfaces**
4. **Follow performance best practices**
5. **Include error handling**
6. **Write testable code**

### **Prompts for React generation:**

```
Generate React component following these rules:

1. Use functional component with hooks
2. Separate presentation from logic
3. Use proper TypeScript interfaces
4. Follow performance best practices
5. Include error handling
6. Write testable code
7. Use React.memo for optimization
8. Use useCallback for event handlers
9. Use useMemo for expensive calculations
10. Include proper error boundaries
```

## 🚨 **Red Flags - NEVER Generate**

- ❌ Class components (unless absolutely necessary)
- ❌ Inline styles
- ❌ Direct DOM manipulation
- ❌ Mutating props
- ❌ Using index as key
- ❌ Missing error handling
- ❌ No TypeScript interfaces
- ❌ Prop drilling
- ❌ Unnecessary re-renders
- ❌ Missing accessibility

## 📊 **Quality Checklist**

Before accepting generated React code:

- [ ] Functional component with hooks
- [ ] Proper TypeScript interfaces
- [ ] Performance optimizations
- [ ] Error handling
- [ ] Accessibility features
- [ ] Testable structure
- [ ] No prop drilling
- [ ] Proper key usage
- [ ] Error boundaries
- [ ] Clean separation of concerns

---

**Version:** 1.0.0  
**Last Updated:** ${new Date().toLocaleDateString('ru-RU')}  
**Status:** ✅ Active
