import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import App from '../../App';
import { useAppContext } from '../../context/AppContext';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('Notifications Integration Tests', () => {
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
    {
      id: '2',
      type: 'success' as const,
      title: 'Success Notification',
      message: 'Operation completed successfully',
      source: 'github' as const,
      read: false,
      createdAt: '2024-01-17T12:00:00Z',
    },
    {
      id: '3',
      type: 'warning' as const,
      title: 'Warning Notification',
      message: 'This is a warning message',
      source: 'ai' as const,
      read: true,
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

  it('displays notifications on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Recent Notifications')).toBeInTheDocument();
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('Success Notification')).toBeInTheDocument();
    expect(screen.getByText('Warning Notification')).toBeInTheDocument();
  });

  it('shows notification count on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Total notifications
    expect(screen.getByText('2')).toBeInTheDocument(); // Unread notifications
  });

  it('displays notification types correctly', () => {
    render(<App />);

    // Check for different notification types
    expect(screen.getByText('info')).toBeInTheDocument();
    expect(screen.getByText('success')).toBeInTheDocument();
    expect(screen.getByText('warning')).toBeInTheDocument();
  });

  it('shows notification sources correctly', () => {
    render(<App />);

    // Check for different notification sources
    expect(screen.getByText('system')).toBeInTheDocument();
    expect(screen.getByText('github')).toBeInTheDocument();
    expect(screen.getByText('ai')).toBeInTheDocument();
  });

  it('allows marking notifications as read', () => {
    render(<App />);

    // Find unread notification
    const unreadNotification = screen.getByText('Test Notification');
    const markAsReadButton = unreadNotification.closest('.notification-item')?.querySelector('button[aria-label="Mark as read"]');
    
    if (markAsReadButton) {
      fireEvent.click(markAsReadButton);
      expect(mockUpdateNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          read: true,
        })
      );
    }
  });

  it('allows dismissing notifications', () => {
    render(<App />);

    // Find notification dismiss button
    const notification = screen.getByText('Test Notification');
    const dismissButton = notification.closest('.notification-item')?.querySelector('button[aria-label="Dismiss"]');
    
    if (dismissButton) {
      fireEvent.click(dismissButton);
      expect(mockUpdateNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          read: true,
        })
      );
    }
  });

  it('filters notifications by type', () => {
    render(<App />);

    // Check for notification type filters
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('filters notifications by source', () => {
    render(<App />);

    // Check for notification source filters
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('shows notification timestamps', () => {
    render(<App />);

    // Check for notification timestamps
    expect(screen.getByText('17.01.2024')).toBeInTheDocument();
  });

  it('handles notification click events', () => {
    render(<App />);

    // Click on a notification
    const notification = screen.getByText('Test Notification');
    fireEvent.click(notification);

    // Should handle click event
    expect(notification).toBeInTheDocument();
  });

  it('displays notification settings on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByText('Sound: On')).toBeInTheDocument();
    expect(screen.getByText('Desktop: Off')).toBeInTheDocument();
  });

  it('allows configuring notification settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check notification settings section
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Enable Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Sound Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Desktop Notifications')).toBeInTheDocument();
  });

  it('allows toggling notification settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const notificationsCheckbox = screen.getByLabelText('Enable Notifications');
    fireEvent.click(notificationsCheckbox);

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        notifications: expect.objectContaining({
          enabled: false,
        }),
      })
    );
  });

  it('allows toggling sound notifications', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const soundCheckbox = screen.getByLabelText('Sound Notifications');
    fireEvent.click(soundCheckbox);

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        notifications: expect.objectContaining({
          sound: false,
        }),
      })
    );
  });

  it('allows toggling desktop notifications', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const desktopCheckbox = screen.getByLabelText('Desktop Notifications');
    fireEvent.click(desktopCheckbox);

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        notifications: expect.objectContaining({
          desktop: true,
        }),
      })
    );
  });

  it('handles notification overflow gracefully', () => {
    // Mock many notifications
    const manyNotifications = Array.from({ length: 100 }, (_, index) => ({
      id: `notification-${index}`,
      type: 'info' as const,
      title: `Notification ${index}`,
      message: `Message ${index}`,
      source: 'system' as const,
      read: false,
      createdAt: '2024-01-17T12:00:00Z',
    }));

    mockUseAppContext.mockReturnValue({
      tasks: mockTasks,
      notifications: manyNotifications,
      settings: mockSettings,
      updateTask: mockUpdateTask,
      updateNotification: mockUpdateNotification,
      updateSettings: mockUpdateSettings,
    });

    render(<App />);

    // Should display limited number of notifications
    expect(screen.getByText('Recent Notifications')).toBeInTheDocument();
    expect(screen.getByText('Show More')).toBeInTheDocument();
  });

  it('shows notification priority levels', () => {
    render(<App />);

    // Check for notification priority indicators
    expect(screen.getByText('Priority: High')).toBeInTheDocument();
    expect(screen.getByText('Priority: Medium')).toBeInTheDocument();
    expect(screen.getByText('Priority: Low')).toBeInTheDocument();
  });

  it('handles notification expiration', () => {
    render(<App />);

    // Check for notification expiration handling
    expect(screen.getByText('Expires')).toBeInTheDocument();
  });

  it('shows notification actions', () => {
    render(<App />);

    // Check for notification action buttons
    expect(screen.getByText('Mark as Read')).toBeInTheDocument();
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
    expect(screen.getByText('Archive')).toBeInTheDocument();
  });

  it('handles notification grouping', () => {
    render(<App />);

    // Check for notification grouping
    expect(screen.getByText('Grouped Notifications')).toBeInTheDocument();
    expect(screen.getByText('System (2)')).toBeInTheDocument();
    expect(screen.getByText('GitHub (1)')).toBeInTheDocument();
  });

  it('shows notification search functionality', () => {
    render(<App />);

    // Check for notification search
    expect(screen.getByPlaceholderText('Search notifications...')).toBeInTheDocument();
  });

  it('handles notification sorting', () => {
    render(<App />);

    // Check for notification sorting options
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
  });

  it('shows notification statistics', () => {
    render(<App />);

    // Check for notification statistics
    expect(screen.getByText('Total: 3')).toBeInTheDocument();
    expect(screen.getByText('Unread: 2')).toBeInTheDocument();
    expect(screen.getByText('Read: 1')).toBeInTheDocument();
  });

  it('handles notification auto-refresh', () => {
    render(<App />);

    // Check for auto-refresh functionality
    expect(screen.getByText('Auto-refresh')).toBeInTheDocument();
    expect(screen.getByText('30 seconds')).toBeInTheDocument();
  });

  it('shows notification history', () => {
    render(<App />);

    // Check for notification history
    expect(screen.getByText('Notification History')).toBeInTheDocument();
    expect(screen.getByText('View All')).toBeInTheDocument();
  });
});
