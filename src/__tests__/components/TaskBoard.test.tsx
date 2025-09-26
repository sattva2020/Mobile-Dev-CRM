import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import TaskBoard from '../../components/TaskBoard';
import { useAppContext } from '../../context/AppContext';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('TaskBoard', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Description 1',
      status: 'todo' as const,
      priority: 'high' as const,
      category: 'bug' as const,
      labels: ['urgent'],
      createdAt: '2024-01-17T12:00:00Z',
      updatedAt: '2024-01-17T12:00:00Z',
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Description 2',
      status: 'in-progress' as const,
      priority: 'medium' as const,
      category: 'feature' as const,
      labels: ['enhancement'],
      createdAt: '2024-01-17T12:00:00Z',
      updatedAt: '2024-01-17T12:00:00Z',
    },
  ];

  const mockUpdateTask = jest.fn();

  beforeEach(() => {
    mockUseAppContext.mockReturnValue({
      tasks: mockTasks,
      notifications: [],
      settings: {
        github: {
          repository: { owner: 'test', name: 'repo' },
          autoSync: false,
          syncInterval: 30,
        },
        ai: { enabled: false, model: 'grok-4-fast', autoSuggestions: false },
        theme: 'light' as const,
        language: 'ru' as const,
        notifications: { enabled: true, sound: true, desktop: false },
      },
      updateTask: mockUpdateTask,
      updateNotification: jest.fn(),
      updateSettings: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders task board with all columns', () => {
    render(<TaskBoard />);

    expect(screen.getByText('Task Board')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('displays tasks in correct columns', () => {
    render(<TaskBoard />);

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('allows adding new tasks', async () => {
    render(<TaskBoard />);

    const titleInput = screen.getByPlaceholderText('Task title');
    const descriptionInput = screen.getByPlaceholderText('Task description');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          description: 'New Description',
          status: 'todo',
        })
      );
    });
  });

  it('allows updating task status', () => {
    render(<TaskBoard />);

    const statusSelect = screen.getAllByDisplayValue('todo')[0];
    fireEvent.change(statusSelect, { target: { value: 'in-progress' } });

    expect(mockUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        status: 'in-progress',
      })
    );
  });

  it('allows updating task priority', () => {
    render(<TaskBoard />);

    const prioritySelect = screen.getAllByDisplayValue('high')[0];
    fireEvent.change(prioritySelect, { target: { value: 'low' } });

    expect(mockUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        priority: 'low',
      })
    );
  });

  it('allows updating task category', () => {
    render(<TaskBoard />);

    const categorySelect = screen.getAllByDisplayValue('bug')[0];
    fireEvent.change(categorySelect, { target: { value: 'feature' } });

    expect(mockUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        category: 'feature',
      })
    );
  });

  it('allows adding labels to tasks', () => {
    render(<TaskBoard />);

    const labelInput = screen.getAllByPlaceholderText('Add label')[0];
    fireEvent.change(labelInput, { target: { value: 'new-label' } });
    fireEvent.keyDown(labelInput, { key: 'Enter' });

    expect(mockUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        labels: expect.arrayContaining(['new-label']),
      })
    );
  });

  it('allows removing labels from tasks', () => {
    render(<TaskBoard />);

    const removeButton = screen.getAllByText('urgent')[0].parentElement?.querySelector('button');
    if (removeButton) {
      fireEvent.click(removeButton);
    }

    expect(mockUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        labels: [],
      })
    );
  });

  it('filters tasks by status', () => {
    render(<TaskBoard />);

    const filterSelect = screen.getByDisplayValue('all');
    fireEvent.change(filterSelect, { target: { value: 'todo' } });

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
  });

  it('filters tasks by priority', () => {
    render(<TaskBoard />);

    const priorityFilter = screen.getByDisplayValue('all');
    fireEvent.change(priorityFilter, { target: { value: 'high' } });

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
  });

  it('filters tasks by category', () => {
    render(<TaskBoard />);

    const categoryFilter = screen.getByDisplayValue('all');
    fireEvent.change(categoryFilter, { target: { value: 'bug' } });

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
  });
});
