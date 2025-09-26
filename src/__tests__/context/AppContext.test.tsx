import React from 'react';
import { render, screen, act } from '../../../test-utils';
import { AppProvider, useAppContext } from '../../context/AppContext';
import { Task, Notification, Settings } from '../../types';

// Test component to consume the context
const TestComponent: React.FC = () => {
  const {
    tasks,
    notifications,
    settings,
    updateTask,
    updateNotification,
    updateSettings,
  } = useAppContext();

  const handleAddTask = () => {
    const newTask: Task = {
      id: 'new-task',
      title: 'New Task',
      description: 'New Description',
      status: 'todo',
      priority: 'medium',
      category: 'feature',
      labels: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateTask(newTask);
  };

  const handleUpdateTask = () => {
    const updatedTask: Task = {
      ...tasks[0],
      status: 'done',
    };
    updateTask(updatedTask);
  };

  const handleAddNotification = () => {
    const newNotification: Notification = {
      id: 'new-notification',
      type: 'info',
      title: 'New Notification',
      message: 'New Message',
      source: 'system',
      read: false,
      createdAt: new Date().toISOString(),
    };
    updateNotification(newNotification);
  };

  const handleUpdateNotification = () => {
    const updatedNotification: Notification = {
      ...notifications[0],
      read: true,
    };
    updateNotification(updatedNotification);
  };

  const handleUpdateSettings = () => {
    const updatedSettings: Settings = {
      ...settings,
      theme: 'dark',
    };
    updateSettings(updatedSettings);
  };

  return (
    <div>
      <div data-testid="task-count">{tasks.length}</div>
      <div data-testid="notification-count">{notifications.length}</div>
      <div data-testid="theme">{settings.theme}</div>
      
      <button onClick={handleAddTask}>Add Task</button>
      <button onClick={handleUpdateTask}>Update Task</button>
      <button onClick={handleAddNotification}>Add Notification</button>
      <button onClick={handleUpdateNotification}>Update Notification</button>
      <button onClick={handleUpdateSettings}>Update Settings</button>
    </div>
  );
};

describe('AppContext', () => {
  it('provides initial state correctly', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('task-count')).toHaveTextContent('0');
    expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('adds a task', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const initialTaskCount = 0;
    act(() => {
      screen.getByText('Add Task').click();
    });

    expect(screen.getByTestId('task-count')).toHaveTextContent((initialTaskCount + 1).toString());
  });

  it('updates a task', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // First add a task
    act(() => {
      screen.getByText('Add Task').click();
    });

    // Then update it
    act(() => {
      screen.getByText('Update Task').click();
    });

    // The task should still be there (count should be 1)
    expect(screen.getByTestId('task-count')).toHaveTextContent('1');
  });

  it('adds a notification', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const initialNotificationCount = 0;
    act(() => {
      screen.getByText('Add Notification').click();
    });

    expect(screen.getByTestId('notification-count')).toHaveTextContent((initialNotificationCount + 1).toString());
  });

  it('updates a notification', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // First add a notification
    act(() => {
      screen.getByText('Add Notification').click();
    });

    // Then update it
    act(() => {
      screen.getByText('Update Notification').click();
    });

    // The notification should still be there (count should be 1)
    expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
  });

  it('updates settings', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByText('Update Settings').click();
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('persists data to localStorage', () => {
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByText('Add Task').click();
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'dev-crm-tasks',
      expect.any(String)
    );
  });

  it('loads data from localStorage on initialization', () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Persisted Task',
        description: 'Description',
        status: 'todo' as const,
        priority: 'medium' as const,
        category: 'feature' as const,
        labels: [],
        createdAt: '2024-01-17T12:00:00Z',
        updatedAt: '2024-01-17T12:00:00Z',
      },
    ];

    const mockLocalStorage = {
      getItem: jest.fn((key) => {
        if (key === 'dev-crm-tasks') {
          return JSON.stringify(mockTasks);
        }
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('task-count')).toHaveTextContent('1');
  });

  it('handles corrupted localStorage data gracefully', () => {
    const mockLocalStorage = {
      getItem: jest.fn((key) => {
        if (key === 'dev-crm-tasks') {
          return 'invalid-json';
        }
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // Should not crash and should have default state
    expect(screen.getByTestId('task-count')).toHaveTextContent('0');
  });
});
