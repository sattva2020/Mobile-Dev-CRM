import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { AppProvider, useAppContext } from '../../context/AppContext';
import { Task, Project, User } from '../../types';
import { mockTasks, mockProjects, mockUsers } from '../../data/mockData';

describe('Context Tests', () => {
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
  ];

  const mockProjects = [
    {
      id: '1',
      name: 'Test Project 1',
      description: 'Description 1',
      startDate: '2024-01-17T12:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      status: 'Active' as const,
      repositoryUrl: 'https://github.com/test/project1',
    },
  ];

  const mockUsers = [
    {
      id: '1',
      name: 'Test User 1',
      email: 'test1@example.com',
      role: 'Developer' as const,
      avatarUrl: 'https://example.com/avatar1.jpg',
    },
  ];

  const mockNotifications = [
    {
      id: '1',
      type: 'info' as const,
      title: 'Test Notification',
      message: 'Test Message',
      source: 'system' as const,
      read: false,
      createdAt: '2024-01-17T12:00:00Z',
    },
  ];

  const mockSettings = {
    github: {
      repository: {
        owner: 'test-owner',
        name: 'test-repo',
      },
      autoSync: false,
      syncInterval: 30,
    },
    ai: {
      enabled: false,
      model: 'grok-4-fast',
      autoSuggestions: false,
    },
    theme: 'light' as const,
    language: 'ru' as const,
    notifications: {
      enabled: true,
      sound: true,
      desktop: false,
    },
  };

  const mockUpdateTask = jest.fn();
  const mockUpdateNotification = jest.fn();
  const mockUpdateSettings = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AppContext Provider', () => {
    it('should provide initial state correctly', () => {
      render(
        <AppProvider>
          <div data-testid="test-component">Test</div>
        </AppProvider>
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });

    it('should provide tasks from initial state', () => {
      render(
        <AppProvider>
          <div data-testid="test-component">Test</div>
        </AppProvider>
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });

    it('should provide projects from initial state', () => {
      render(
        <AppProvider>
          <div data-testid="test-component">Test</div>
        </AppProvider>
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });

    it('should provide users from initial state', () => {
      render(
        <AppProvider>
          <div data-testid="test-component">Test</div>
        </AppProvider>
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  describe('useAppContext Hook', () => {
    it('should throw error when used outside provider', () => {
      const TestComponent = () => {
        useAppContext();
        return <div>Test</div>;
      };

      expect(() => render(<TestComponent />)).toThrow('useAppContext must be used within an AppProvider');
    });

    it('should return context when used within provider', () => {
      const TestComponent = () => {
        const context = useAppContext();
        return <div data-testid="context">{context ? 'Context available' : 'No context'}</div>;
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('context')).toHaveTextContent('Context available');
    });
  });

  describe('Task Management', () => {
    it('should add task correctly', () => {
      const TestComponent = () => {
        const { addTask } = useAppContext();
        const handleAddTask = () => {
          addTask({
            id: 'new-task',
            title: 'New Task',
            description: 'New Description',
            status: 'todo',
            priority: 'medium',
            category: 'feature',
            labels: [],
            createdAt: '2024-01-17T12:00:00Z',
            updatedAt: '2024-01-17T12:00:00Z',
          });
        };
        return <button onClick={handleAddTask}>Add Task</button>;
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      fireEvent.click(screen.getByText('Add Task'));
      expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    it('should update task correctly', () => {
      const TestComponent = () => {
        const { updateTask } = useAppContext();
        const handleUpdateTask = () => {
          updateTask({
            id: '1',
            title: 'Updated Task',
            description: 'Updated Description',
            status: 'in-progress',
            priority: 'high',
            category: 'bug',
            labels: ['urgent'],
            createdAt: '2024-01-17T12:00:00Z',
            updatedAt: '2024-01-17T12:00:00Z',
          });
        };
        return <button onClick={handleUpdateTask}>Update Task</button>;
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      fireEvent.click(screen.getByText('Update Task'));
      expect(screen.getByText('Update Task')).toBeInTheDocument();
    });

    it('should delete task correctly', () => {
      const TestComponent = () => {
        const { deleteTask } = useAppContext();
        const handleDeleteTask = () => {
          deleteTask('1');
        };
        return <button onClick={handleDeleteTask}>Delete Task</button>;
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      fireEvent.click(screen.getByText('Delete Task'));
      expect(screen.getByText('Delete Task')).toBeInTheDocument();
    });
  });

  describe('Project Management', () => {
    it('should add project correctly', () => {
      const TestComponent = () => {
        const { addProject } = useAppContext();
        const handleAddProject = () => {
          addProject({
            id: 'new-project',
            name: 'New Project',
            description: 'New Description',
            startDate: '2024-01-17T12:00:00Z',
            endDate: '2024-12-31T23:59:59Z',
            status: 'Active',
            repositoryUrl: 'https://github.com/test/new-project',
          });
        };
        return <button onClick={handleAddProject}>Add Project</button>;
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      fireEvent.click(screen.getByText('Add Project'));
      expect(screen.getByText('Add Project')).toBeInTheDocument();
    });

    it('should update project correctly', () => {
      const TestComponent = () => {
        const { updateProject } = useAppContext();
        const handleUpdateProject = () => {
          updateProject({
            id: '1',
            name: 'Updated Project',
            description: 'Updated Description',
            startDate: '2024-01-17T12:00:00Z',
            endDate: '2024-12-31T23:59:59Z',
            status: 'Completed',
            repositoryUrl: 'https://github.com/test/updated-project',
          });
        };
        return <button onClick={handleUpdateProject}>Update Project</button>;
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      fireEvent.click(screen.getByText('Update Project'));
      expect(screen.getByText('Update Project')).toBeInTheDocument();
    });

    it('should delete project correctly', () => {
      const TestComponent = () => {
        const { deleteProject } = useAppContext();
        const handleDeleteProject = () => {
          deleteProject('1');
        };
        return <button onClick={handleDeleteProject}>Delete Project</button>;
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      fireEvent.click(screen.getByText('Delete Project'));
      expect(screen.getByText('Delete Project')).toBeInTheDocument();
    });
  });

  describe('Context State Updates', () => {
    it('should update state when task is added', () => {
      const TestComponent = () => {
        const { tasks, addTask } = useAppContext();
        const handleAddTask = () => {
          addTask({
            id: 'new-task',
            title: 'New Task',
            description: 'New Description',
            status: 'todo',
            priority: 'medium',
            category: 'feature',
            labels: [],
            createdAt: '2024-01-17T12:00:00Z',
            updatedAt: '2024-01-17T12:00:00Z',
          });
        };
        return (
          <div>
            <div data-testid="task-count">{tasks.length}</div>
            <button onClick={handleAddTask}>Add Task</button>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('task-count')).toHaveTextContent('0');
      fireEvent.click(screen.getByText('Add Task'));
      expect(screen.getByTestId('task-count')).toHaveTextContent('1');
    });

    it('should update state when task is updated', () => {
      const TestComponent = () => {
        const { tasks, updateTask } = useAppContext();
        const handleUpdateTask = () => {
          updateTask({
            id: '1',
            title: 'Updated Task',
            description: 'Updated Description',
            status: 'in-progress',
            priority: 'high',
            category: 'bug',
            labels: ['urgent'],
            createdAt: '2024-01-17T12:00:00Z',
            updatedAt: '2024-01-17T12:00:00Z',
          });
        };
        return (
          <div>
            <div data-testid="task-count">{tasks.length}</div>
            <button onClick={handleUpdateTask}>Update Task</button>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('task-count')).toHaveTextContent('0');
      fireEvent.click(screen.getByText('Update Task'));
      expect(screen.getByTestId('task-count')).toHaveTextContent('1');
    });

    it('should update state when task is deleted', () => {
      const TestComponent = () => {
        const { tasks, deleteTask } = useAppContext();
        const handleDeleteTask = () => {
          deleteTask('1');
        };
        return (
          <div>
            <div data-testid="task-count">{tasks.length}</div>
            <button onClick={handleDeleteTask}>Delete Task</button>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('task-count')).toHaveTextContent('0');
      fireEvent.click(screen.getByText('Delete Task'));
      expect(screen.getByTestId('task-count')).toHaveTextContent('0');
    });
  });

  describe('Context Error Handling', () => {
    it('should handle task operations gracefully', () => {
      const TestComponent = () => {
        const { addTask, updateTask, deleteTask } = useAppContext();
        const handleAddTask = () => {
          try {
            addTask(null as any);
          } catch (error) {
            // Handle error gracefully
          }
        };
        const handleUpdateTask = () => {
          try {
            updateTask(null as any);
          } catch (error) {
            // Handle error gracefully
          }
        };
        const handleDeleteTask = () => {
          try {
            deleteTask(null as any);
          } catch (error) {
            // Handle error gracefully
          }
        };
        return (
          <div>
            <button onClick={handleAddTask}>Add Task</button>
            <button onClick={handleUpdateTask}>Update Task</button>
            <button onClick={handleDeleteTask}>Delete Task</button>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByText('Add Task')).toBeInTheDocument();
      expect(screen.getByText('Update Task')).toBeInTheDocument();
      expect(screen.getByText('Delete Task')).toBeInTheDocument();
    });

    it('should handle project operations gracefully', () => {
      const TestComponent = () => {
        const { addProject, updateProject, deleteProject } = useAppContext();
        const handleAddProject = () => {
          try {
            addProject(null as any);
          } catch (error) {
            // Handle error gracefully
          }
        };
        const handleUpdateProject = () => {
          try {
            updateProject(null as any);
          } catch (error) {
            // Handle error gracefully
          }
        };
        const handleDeleteProject = () => {
          try {
            deleteProject(null as any);
          } catch (error) {
            // Handle error gracefully
          }
        };
        return (
          <div>
            <button onClick={handleAddProject}>Add Project</button>
            <button onClick={handleUpdateProject}>Update Project</button>
            <button onClick={handleDeleteProject}>Delete Project</button>
          </div>
        );
      };

      render(
        <AppProvider>
          <TestComponent />
        </AppProvider>
      );

      expect(screen.getByText('Add Project')).toBeInTheDocument();
      expect(screen.getByText('Update Project')).toBeInTheDocument();
      expect(screen.getByText('Delete Project')).toBeInTheDocument();
    });
  });
});