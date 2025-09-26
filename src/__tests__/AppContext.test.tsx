import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '../context/AppContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('AppContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial state', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    expect(result.current.state.tasks).toEqual([]);
    expect(result.current.state.notifications).toEqual([]);
    expect(result.current.state.loading).toBe(false);
  });

  it('adds a task', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    act(() => {
      result.current.actions.addTask({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
        category: 'other',
        labels: [],
      });
    });

    expect(result.current.state.tasks).toHaveLength(1);
    expect(result.current.state.tasks[0].title).toBe('Test Task');
  });

  it('updates a task', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    let taskId: string;
    act(() => {
      taskId = result.current.actions.addTask({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
        category: 'other',
        labels: [],
      });
    });

    act(() => {
      result.current.actions.updateTask(taskId, { status: 'in-progress' });
    });

    expect(result.current.state.tasks[0].status).toBe('in-progress');
  });

  it('deletes a task', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    let taskId: string;
    act(() => {
      taskId = result.current.actions.addTask({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
        category: 'other',
        labels: [],
      });
    });

    expect(result.current.state.tasks).toHaveLength(1);

    act(() => {
      result.current.actions.deleteTask(taskId);
    });

    expect(result.current.state.tasks).toHaveLength(0);
  });

  it('adds a notification', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    act(() => {
      result.current.actions.addNotification({
        type: 'info',
        title: 'Test Notification',
        message: 'Test Message',
        source: 'system',
      });
    });

    expect(result.current.state.notifications).toHaveLength(1);
    expect(result.current.state.notifications[0].title).toBe('Test Notification');
  });

  it('marks notification as read', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    let notificationId: string;
    act(() => {
      notificationId = result.current.actions.addNotification({
        type: 'info',
        title: 'Test Notification',
        message: 'Test Message',
        source: 'system',
      });
    });

    expect(result.current.state.notifications[0].read).toBe(false);

    act(() => {
      result.current.actions.markNotificationRead(notificationId);
    });

    expect(result.current.state.notifications[0].read).toBe(true);
  });

  it('clears notifications', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    act(() => {
      result.current.actions.addNotification({
        type: 'info',
        title: 'Test Notification',
        message: 'Test Message',
        source: 'system',
      });
    });

    expect(result.current.state.notifications).toHaveLength(1);

    act(() => {
      result.current.actions.clearNotifications();
    });

    expect(result.current.state.notifications).toHaveLength(0);
  });

  it('updates settings', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    act(() => {
      result.current.actions.updateSettings({
        theme: 'dark',
        language: 'en',
      });
    });

    expect(result.current.state.settings.theme).toBe('dark');
    expect(result.current.state.settings.language).toBe('en');
  });

  it('sets GitHub service status', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    act(() => {
      result.current.actions.setGitHubService(true);
    });

    expect(result.current.state.githubService).toBe(true);
  });

  it('sets AI service status', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    act(() => {
      result.current.actions.setAIService(true);
    });

    expect(result.current.state.aiService).toBe(true);
  });

  it('throws error when used outside provider', () => {
    const { result } = renderHook(() => useApp());
    
    expect(result.error).toBeDefined();
  });
});