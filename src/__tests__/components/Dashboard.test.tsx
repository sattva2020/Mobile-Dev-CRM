import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import Dashboard from '../../components/Dashboard';
import { useAppContext } from '../../context/AppContext';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('Dashboard', () => {
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

  const mockNotifications = [
    {
      id: '1',
      type: 'success' as const,
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

  beforeEach(() => {
    mockUseAppContext.mockReturnValue({
      tasks: mockTasks,
      notifications: mockNotifications,
      settings: mockSettings,
      updateTask: jest.fn(),
      updateNotification: jest.fn(),
      updateSettings: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard with correct task statistics', () => {
    render(<Dashboard />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Todo tasks
    expect(screen.getByText('1')).toBeInTheDocument(); // In Progress tasks
    expect(screen.getByText('0')).toBeInTheDocument(); // Done tasks
  });

  it('displays recent tasks', () => {
    render(<Dashboard />);

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('displays recent notifications', () => {
    render(<Dashboard />);

    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('shows GitHub repository info', () => {
    render(<Dashboard />);

    expect(screen.getByText('test-owner/test-repo')).toBeInTheDocument();
  });

  it('displays AI status', () => {
    render(<Dashboard />);

    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('shows theme information', () => {
    render(<Dashboard />);

    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('displays language setting', () => {
    render(<Dashboard />);

    expect(screen.getByText('Russian')).toBeInTheDocument();
  });

  it('shows notification settings', () => {
    render(<Dashboard />);

    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByText('Sound: On')).toBeInTheDocument();
    expect(screen.getByText('Desktop: Off')).toBeInTheDocument();
  });
});
