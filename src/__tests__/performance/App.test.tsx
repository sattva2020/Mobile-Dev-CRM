import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import App from '../../App';
import { useAppContext } from '../../context/AppContext';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('App Performance Tests', () => {
  const mockTasks = Array.from({ length: 100 }, (_, index) => ({
    id: `task-${index}`,
    title: `Task ${index}`,
    description: `Description ${index}`,
    status: 'todo' as const,
    priority: 'medium' as const,
    category: 'feature' as const,
    labels: [`label-${index}`],
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
  }));

  const mockNotifications = Array.from({ length: 50 }, (_, index) => ({
    id: `notification-${index}`,
    type: 'info' as const,
    title: `Notification ${index}`,
    message: `Message ${index}`,
    source: 'system' as const,
    read: false,
    createdAt: '2024-01-17T12:00:00Z',
  }));

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
    mockUseAppContext.mockReturnValue({
      tasks: mockTasks,
      notifications: mockNotifications,
      settings: mockSettings,
      updateTask: mockUpdateTask,
      updateNotification: mockUpdateNotification,
      updateSettings: mockUpdateSettings,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Dashboard with large dataset efficiently', () => {
    const startTime = performance.now();
    
    render(<App />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Dashboard should render within reasonable time (adjust threshold as needed)
    expect(renderTime).toBeLessThan(100); // 100ms threshold
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument(); // Total tasks
  });

  it('renders Task Board with large dataset efficiently', async () => {
    const startTime = performance.now();
    
    render(<App />);
    
    // Navigate to Task Board
    fireEvent.click(screen.getByText('Task Board'));
    await waitFor(() => {
      expect(screen.getByText('Task Board')).toBeInTheDocument();
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Task Board should render within reasonable time
    expect(renderTime).toBeLessThan(200); // 200ms threshold
    
    // Check if tasks are displayed
    expect(screen.getByText('Task 0')).toBeInTheDocument();
    expect(screen.getByText('Task 99')).toBeInTheDocument();
  });

  it('handles rapid navigation without performance issues', async () => {
    render(<App />);
    
    const startTime = performance.now();
    
    // Rapid navigation between pages
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByText('Task Board'));
      await waitFor(() => {
        expect(screen.getByText('Task Board')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Settings'));
      await waitFor(() => {
        expect(screen.getByText('Settings')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Dashboard'));
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    // Total navigation time should be reasonable
    expect(totalTime).toBeLessThan(1000); // 1 second threshold
  });

  it('handles large number of task updates efficiently', async () => {
    render(<App />);
    
    // Navigate to Task Board
    fireEvent.click(screen.getByText('Task Board'));
    await waitFor(() => {
      expect(screen.getByText('Task Board')).toBeInTheDocument();
    });
    
    const startTime = performance.now();
    
    // Update multiple tasks rapidly
    for (let i = 0; i < 10; i++) {
      const statusSelect = screen.getAllByDisplayValue('todo')[0];
      fireEvent.change(statusSelect, { target: { value: 'in-progress' } });
    }
    
    const endTime = performance.now();
    const updateTime = endTime - startTime;
    
    // Updates should be fast
    expect(updateTime).toBeLessThan(100); // 100ms threshold
    expect(mockUpdateTask).toHaveBeenCalledTimes(10);
  });

  it('handles large number of notifications efficiently', () => {
    const startTime = performance.now();
    
    render(<App />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Dashboard should render with many notifications
    expect(renderTime).toBeLessThan(150); // 150ms threshold
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('maintains performance with complex task data', () => {
    const complexTasks = Array.from({ length: 50 }, (_, index) => ({
      id: `task-${index}`,
      title: `Complex Task ${index} with very long title that might cause layout issues`,
      description: `This is a very long description for task ${index} that contains multiple lines of text and might cause performance issues when rendering. It includes special characters like émojis 🚀 and symbols @#$%^&*().`,
      status: 'todo' as const,
      priority: 'high' as const,
      category: 'feature' as const,
      labels: [`label-${index}`, `urgent-${index}`, `complex-${index}`],
      createdAt: '2024-01-17T12:00:00Z',
      updatedAt: '2024-01-17T12:00:00Z',
    }));

    mockUseAppContext.mockReturnValue({
      tasks: complexTasks,
      notifications: mockNotifications,
      settings: mockSettings,
      updateTask: mockUpdateTask,
      updateNotification: mockUpdateNotification,
      updateSettings: mockUpdateSettings,
    });

    const startTime = performance.now();
    
    render(<App />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should handle complex data efficiently
    expect(renderTime).toBeLessThan(200); // 200ms threshold
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('handles memory efficiently with large datasets', () => {
    // Test with very large dataset
    const largeTasks = Array.from({ length: 1000 }, (_, index) => ({
      id: `task-${index}`,
      title: `Task ${index}`,
      description: `Description ${index}`,
      status: 'todo' as const,
      priority: 'medium' as const,
      category: 'feature' as const,
      labels: [`label-${index}`],
      createdAt: '2024-01-17T12:00:00Z',
      updatedAt: '2024-01-17T12:00:00Z',
    }));

    mockUseAppContext.mockReturnValue({
      tasks: largeTasks,
      notifications: mockNotifications,
      settings: mockSettings,
      updateTask: mockUpdateTask,
      updateNotification: mockUpdateNotification,
      updateSettings: mockUpdateSettings,
    });

    const startTime = performance.now();
    
    render(<App />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should handle large dataset reasonably
    expect(renderTime).toBeLessThan(500); // 500ms threshold
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('handles rapid state updates without performance degradation', async () => {
    render(<App />);
    
    // Navigate to Task Board
    fireEvent.click(screen.getByText('Task Board'));
    await waitFor(() => {
      expect(screen.getByText('Task Board')).toBeInTheDocument();
    });
    
    const startTime = performance.now();
    
    // Rapid state updates
    for (let i = 0; i < 20; i++) {
      const statusSelect = screen.getAllByDisplayValue('todo')[0];
      fireEvent.change(statusSelect, { target: { value: 'in-progress' } });
      
      const prioritySelect = screen.getAllByDisplayValue('medium')[0];
      fireEvent.change(prioritySelect, { target: { value: 'high' } });
    }
    
    const endTime = performance.now();
    const updateTime = endTime - startTime;
    
    // Should handle rapid updates efficiently
    expect(updateTime).toBeLessThan(200); // 200ms threshold
    expect(mockUpdateTask).toHaveBeenCalledTimes(40); // 20 status + 20 priority updates
  });
});
