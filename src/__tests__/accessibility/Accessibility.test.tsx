import React from 'react';
import { render, screen } from '../../test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AppProvider } from '../../context/AppContext';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../../App';
import Dashboard from '../../components/Dashboard';
import TaskBoard from '../../components/TaskBoard';
import Settings from '../../components/Settings';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
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
    jest.clearAllMocks();
  });

  describe('App Accessibility', () => {
    it('should have no accessibility violations in the main app layout', async () => {
      const { container } = render(
        <AppProvider>
          <Router>
            <App />
          </Router>
        </AppProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('navigation links should be accessible', async () => {
      render(
        <AppProvider>
          <Router>
            <App />
          </Router>
        </AppProvider>
      );

      expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Task Board/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Settings/i })).toBeInTheDocument();
    });
  });

  describe('Dashboard Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible statistics cards', async () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Total Tasks')).toBeInTheDocument();
      expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
      expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
    });
  });

  describe('TaskBoard Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible task columns', async () => {
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });
  });

  describe('Settings Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible form sections', async () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByText('GitHub Integration')).toBeInTheDocument();
      expect(screen.getByText('AI Features')).toBeInTheDocument();
      expect(screen.getByText('Appearance')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
  });
});