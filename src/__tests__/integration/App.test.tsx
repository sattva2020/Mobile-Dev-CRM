import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import App from '../../App';
import { useAppContext } from '../../context/AppContext';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('App Integration Tests', () => {
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

  it('renders the main navigation', () => {
    render(<App />);

    expect(screen.getByText('Dev CRM')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Task Board')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('navigates between pages correctly', async () => {
    render(<App />);

    // Start on Dashboard
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // Navigate to Task Board
    fireEvent.click(screen.getByText('Task Board'));
    await waitFor(() => {
      expect(screen.getByText('Task Board')).toBeInTheDocument();
    });

    // Navigate to Settings
    fireEvent.click(screen.getByText('Settings'));
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    // Navigate back to Dashboard
    fireEvent.click(screen.getByText('Dashboard'));
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('displays task statistics on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('1')).toBeInTheDocument(); // Todo tasks
    expect(screen.getByText('0')).toBeInTheDocument(); // In Progress tasks
    expect(screen.getByText('0')).toBeInTheDocument(); // Done tasks
  });

  it('shows recent tasks on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
  });

  it('displays notifications on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('shows GitHub repository info on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('test-owner/test-repo')).toBeInTheDocument();
  });

  it('displays AI status on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('shows theme information on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('displays language setting on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Russian')).toBeInTheDocument();
  });

  it('shows notification settings on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByText('Sound: On')).toBeInTheDocument();
    expect(screen.getByText('Desktop: Off')).toBeInTheDocument();
  });

  it('allows task management on Task Board', async () => {
    render(<App />);

    // Navigate to Task Board
    fireEvent.click(screen.getByText('Task Board'));
    await waitFor(() => {
      expect(screen.getByText('Task Board')).toBeInTheDocument();
    });

    // Check if task is displayed
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();

    // Try to update task status
    const statusSelect = screen.getByDisplayValue('todo');
    fireEvent.change(statusSelect, { target: { value: 'in-progress' } });

    expect(mockUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        status: 'in-progress',
      })
    );
  });

  it('allows settings management on Settings page', async () => {
    render(<App />);

    // Navigate to Settings
    fireEvent.click(screen.getByText('Settings'));
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    // Check if settings are displayed
    expect(screen.getByDisplayValue('test-owner')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-repo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('light')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ru')).toBeInTheDocument();

    // Try to update theme
    const themeSelect = screen.getByDisplayValue('light');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'dark',
      })
    );
  });

  it('maintains state consistency across navigation', async () => {
    render(<App />);

    // Start on Dashboard
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();

    // Navigate to Task Board
    fireEvent.click(screen.getByText('Task Board'));
    await waitFor(() => {
      expect(screen.getByText('Task Board')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();

    // Navigate to Settings
    fireEvent.click(screen.getByText('Settings'));
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    // Navigate back to Dashboard
    fireEvent.click(screen.getByText('Dashboard'));
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
  });

  it('handles empty state gracefully', () => {
    mockUseAppContext.mockReturnValue({
      tasks: [],
      notifications: [],
      settings: mockSettings,
      updateTask: mockUpdateTask,
      updateNotification: mockUpdateNotification,
      updateSettings: mockUpdateSettings,
    });

    render(<App />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // No tasks
  });
});
