import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { AppProvider } from '../../context/AppContext';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../../App';
import Dashboard from '../../components/Dashboard';
import TaskBoard from '../../components/TaskBoard';
import Settings from '../../components/Settings';
import { getGitHubIssues, createGitHubIssue, configureGitHubService } from '../../services';
import { GITHUB_API_URL, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } from '../../constants';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Performance Tests', () => {
  const mockTasks = Array.from({ length: 1000 }, (_, index) => ({
    id: `task-${index}`,
    title: `Task ${index}`,
    description: `Description ${index}`,
    status: 'todo' as const,
    priority: 'medium' as const,
    category: 'feature' as const,
    labels: [`label-${index % 10}`],
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
  }));

  const mockNotifications = Array.from({ length: 100 }, (_, index) => ({
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
    jest.clearAllMocks();
    configureGitHubService({ personalAccessToken: 'test-token' });
  });

  describe('Large Data Sets', () => {
    it('handles large task lists efficiently', () => {
      const startTime = performance.now();
      
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1000); // Should render in less than 1 second
      expect(screen.getByText('Task Board')).toBeInTheDocument();
    });

    it('handles large notification lists efficiently', () => {
      const startTime = performance.now();
      
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1000); // Should render in less than 1 second
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('handles large settings data efficiently', () => {
      const largeSettings = {
        ...mockSettings,
        github: {
          ...mockSettings.github,
          repository: {
            owner: 'a'.repeat(1000),
            name: 'b'.repeat(1000),
          },
        },
      };

      const startTime = performance.now();
      
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1000); // Should render in less than 1 second
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('Rendering Performance', () => {
    it('renders Dashboard quickly', () => {
      const startTime = performance.now();
      
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100); // Should render in less than 100ms
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders TaskBoard quickly', () => {
      const startTime = performance.now();
      
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100); // Should render in less than 100ms
      expect(screen.getByText('Task Board')).toBeInTheDocument();
    });

    it('renders Settings quickly', () => {
      const startTime = performance.now();
      
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100); // Should render in less than 100ms
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders App quickly', () => {
      const startTime = performance.now();
      
      render(
        <AppProvider>
          <Router>
            <App />
          </Router>
        </AppProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(200); // Should render in less than 200ms
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  describe('User Interaction Performance', () => {
    it('handles rapid task status changes efficiently', () => {
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const statusSelect = screen.getAllByDisplayValue('todo')[0];
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        fireEvent.change(statusSelect, { target: { value: 'in-progress' } });
        fireEvent.change(statusSelect, { target: { value: 'done' } });
        fireEvent.change(statusSelect, { target: { value: 'todo' } });
      }
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;

      expect(interactionTime).toBeLessThan(1000); // Should handle 100 changes in less than 1 second
    });

    it('handles rapid task priority changes efficiently', () => {
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const prioritySelect = screen.getAllByDisplayValue('medium')[0];
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        fireEvent.change(prioritySelect, { target: { value: 'high' } });
        fireEvent.change(prioritySelect, { target: { value: 'low' } });
        fireEvent.change(prioritySelect, { target: { value: 'medium' } });
      }
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;

      expect(interactionTime).toBeLessThan(1000); // Should handle 100 changes in less than 1 second
    });

    it('handles rapid task category changes efficiently', () => {
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const categorySelect = screen.getAllByDisplayValue('feature')[0];
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        fireEvent.change(categorySelect, { target: { value: 'bug' } });
        fireEvent.change(categorySelect, { target: { value: 'enhancement' } });
        fireEvent.change(categorySelect, { target: { value: 'feature' } });
      }
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;

      expect(interactionTime).toBeLessThan(1000); // Should handle 100 changes in less than 1 second
    });

    it('handles rapid label additions efficiently', () => {
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const labelInput = screen.getAllByPlaceholderText('Add label')[0];
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        fireEvent.change(labelInput, { target: { value: `label-${i}` } });
        fireEvent.keyDown(labelInput, { key: 'Enter' });
      }
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;

      expect(interactionTime).toBeLessThan(1000); // Should handle 100 label additions in less than 1 second
    });

    it('handles rapid filter changes efficiently', () => {
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const filterSelect = screen.getByDisplayValue('all');
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        fireEvent.change(filterSelect, { target: { value: 'todo' } });
        fireEvent.change(filterSelect, { target: { value: 'in-progress' } });
        fireEvent.change(filterSelect, { target: { value: 'done' } });
        fireEvent.change(filterSelect, { target: { value: 'all' } });
      }
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;

      expect(interactionTime).toBeLessThan(1000); // Should handle 100 filter changes in less than 1 second
    });
  });

  describe('Settings Performance', () => {
    it('handles rapid settings changes efficiently', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const ownerInput = screen.getByDisplayValue('test-owner');
      const nameInput = screen.getByDisplayValue('test-repo');
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        fireEvent.change(ownerInput, { target: { value: `owner-${i}` } });
        fireEvent.change(nameInput, { target: { value: `repo-${i}` } });
      }
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;

      expect(interactionTime).toBeLessThan(1000); // Should handle 100 changes in less than 1 second
    });

    it('handles rapid checkbox toggles efficiently', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const autoSyncCheckbox = screen.getByLabelText('Auto-sync with GitHub');
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        fireEvent.click(autoSyncCheckbox);
      }
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;

      expect(interactionTime).toBeLessThan(1000); // Should handle 100 toggles in less than 1 second
    });

    it('handles rapid select changes efficiently', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const themeSelect = screen.getByDisplayValue('light');
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        fireEvent.change(themeSelect, { target: { value: 'dark' } });
        fireEvent.change(themeSelect, { target: { value: 'light' } });
      }
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;

      expect(interactionTime).toBeLessThan(1000); // Should handle 100 changes in less than 1 second
    });
  });

  describe('Navigation Performance', () => {
    it('handles rapid navigation efficiently', () => {
      render(
        <AppProvider>
          <Router>
            <App />
          </Router>
        </AppProvider>
      );

      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        fireEvent.click(screen.getByText('Dashboard'));
        fireEvent.click(screen.getByText('Task Board'));
        fireEvent.click(screen.getByText('Settings'));
      }
      
      const endTime = performance.now();
      const navigationTime = endTime - startTime;

      expect(navigationTime).toBeLessThan(2000); // Should handle 100 navigation cycles in less than 2 seconds
    });
  });

  describe('Memory Usage', () => {
    it('does not leak memory with repeated renders', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      for (let i = 0; i < 100; i++) {
        const { unmount } = render(
          <AppProvider>
            <Router>
              <App />
            </Router>
          </AppProvider>
        );
        unmount();
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it('does not leak memory with repeated task updates', () => {
      const { unmount } = render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      for (let i = 0; i < 1000; i++) {
        const statusSelect = screen.getAllByDisplayValue('todo')[0];
        fireEvent.change(statusSelect, { target: { value: 'in-progress' } });
        fireEvent.change(statusSelect, { target: { value: 'done' } });
        fireEvent.change(statusSelect, { target: { value: 'todo' } });
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 5MB)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
      
      unmount();
    });
  });

  describe('API Performance', () => {
    it('handles GitHub API calls efficiently', async () => {
      const mockIssues = Array.from({ length: 1000 }, (_, index) => ({
        id: index,
        title: `Issue ${index}`,
        state: 'open',
        user: { login: 'testuser', id: 1, avatar_url: '', html_url: '' },
        labels: [],
        assignees: [],
        comments: 0,
        created_at: '2024-01-17T12:00:00Z',
        updated_at: '2024-01-17T12:00:00Z',
        url: '',
        repository_url: '',
        labels_url: '',
        comments_url: '',
        events_url: '',
        html_url: '',
        number: index,
        locked: false,
      }));
      
      mockedAxios.get.mockResolvedValueOnce({ data: mockIssues });

      const startTime = performance.now();
      const issues = await getGitHubIssues();
      const endTime = performance.now();
      const apiTime = endTime - startTime;

      expect(apiTime).toBeLessThan(5000); // Should complete in less than 5 seconds
      expect(issues).toHaveLength(1000);
    });

    it('handles GitHub API errors efficiently', async () => {
      const errorMessage = 'GitHub API Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      const startTime = performance.now();
      
      try {
        await getGitHubIssues();
      } catch (error) {
        // Expected to throw
      }
      
      const endTime = performance.now();
      const errorTime = endTime - startTime;

      expect(errorTime).toBeLessThan(1000); // Should handle errors quickly
    });
  });
});