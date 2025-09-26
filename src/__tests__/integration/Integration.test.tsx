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

describe('Integration Tests', () => {
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
    configureGitHubService({ personalAccessToken: 'test-token' });
  });

  describe('App Integration', () => {
    it('renders the complete app with navigation', () => {
      render(
        <AppProvider>
          <Router>
            <App />
          </Router>
        </AppProvider>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Task Board')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('navigates between pages correctly', () => {
      render(
        <AppProvider>
          <Router>
            <App />
          </Router>
        </AppProvider>
      );

      // Start on Dashboard
      expect(screen.getByText('Dashboard')).toBeInTheDocument();

      // Navigate to Task Board
      fireEvent.click(screen.getByText('Task Board'));
      expect(screen.getByText('Task Board')).toBeInTheDocument();

      // Navigate to Settings
      fireEvent.click(screen.getByText('Settings'));
      expect(screen.getByText('Settings')).toBeInTheDocument();

      // Navigate back to Dashboard
      fireEvent.click(screen.getByText('Dashboard'));
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  describe('Dashboard Integration', () => {
    it('displays all dashboard components', () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Total Tasks')).toBeInTheDocument();
      expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
      expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
      expect(screen.getByText('Total Projects')).toBeInTheDocument();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
    });

    it('shows correct task statistics', () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('1')).toBeInTheDocument(); // Todo tasks
      expect(screen.getByText('1')).toBeInTheDocument(); // In Progress tasks
      expect(screen.getByText('0')).toBeInTheDocument(); // Done tasks
    });

    it('displays recent tasks', () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    it('displays recent notifications', () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Test Notification')).toBeInTheDocument();
      expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('shows GitHub repository info', () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('test-owner/test-repo')).toBeInTheDocument();
    });

    it('displays AI status', () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('shows theme information', () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Light')).toBeInTheDocument();
    });

    it('displays language setting', () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Russian')).toBeInTheDocument();
    });

    it('shows notification settings', () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Enabled')).toBeInTheDocument();
      expect(screen.getByText('Sound: On')).toBeInTheDocument();
      expect(screen.getByText('Desktop: Off')).toBeInTheDocument();
    });
  });

  describe('TaskBoard Integration', () => {
    it('displays all task board components', () => {
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      expect(screen.getByText('Task Board')).toBeInTheDocument();
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('shows tasks in correct columns', () => {
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    it('allows adding new tasks', async () => {
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

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
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

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
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

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
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

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
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

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
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

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
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const filterSelect = screen.getByDisplayValue('all');
      fireEvent.change(filterSelect, { target: { value: 'todo' } });

      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
    });

    it('filters tasks by priority', () => {
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const priorityFilter = screen.getByDisplayValue('all');
      fireEvent.change(priorityFilter, { target: { value: 'high' } });

      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
    });

    it('filters tasks by category', () => {
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const categoryFilter = screen.getByDisplayValue('all');
      fireEvent.change(categoryFilter, { target: { value: 'bug' } });

      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
    });
  });

  describe('Settings Integration', () => {
    it('displays all settings sections', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('GitHub Integration')).toBeInTheDocument();
      expect(screen.getByText('AI Features')).toBeInTheDocument();
      expect(screen.getByText('Appearance')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    it('shows current GitHub settings', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByDisplayValue('test-owner')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test-repo')).toBeInTheDocument();
      expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    });

    it('allows updating GitHub repository settings', async () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const ownerInput = screen.getByDisplayValue('test-owner');
      const nameInput = screen.getByDisplayValue('test-repo');
      const saveButton = screen.getByText('Save Settings');

      fireEvent.change(ownerInput, { target: { value: 'new-owner' } });
      fireEvent.change(nameInput, { target: { value: 'new-repo' } });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalledWith(
          expect.objectContaining({
            github: expect.objectContaining({
              repository: {
                owner: 'new-owner',
                name: 'new-repo',
              },
            }),
          })
        );
      });
    });

    it('allows toggling GitHub auto-sync', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const autoSyncCheckbox = screen.getByLabelText('Auto-sync with GitHub');
      fireEvent.click(autoSyncCheckbox);

      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          github: expect.objectContaining({
            autoSync: true,
          }),
        })
      );
    });

    it('allows updating sync interval', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const intervalInput = screen.getByDisplayValue('30');
      fireEvent.change(intervalInput, { target: { value: '60' } });

      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          github: expect.objectContaining({
            syncInterval: 60,
          }),
        })
      );
    });

    it('displays current AI settings', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByDisplayValue('grok-4-fast')).toBeInTheDocument();
    });

    it('allows toggling AI features', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const aiEnabledCheckbox = screen.getByLabelText('Enable AI Features');
      fireEvent.click(aiEnabledCheckbox);

      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          ai: expect.objectContaining({
            enabled: true,
          }),
        })
      );
    });

    it('allows changing AI model', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const modelSelect = screen.getByDisplayValue('grok-4-fast');
      fireEvent.change(modelSelect, { target: { value: 'gpt-4' } });

      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          ai: expect.objectContaining({
            model: 'gpt-4',
          }),
        })
      );
    });

    it('allows toggling AI auto-suggestions', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const autoSuggestionsCheckbox = screen.getByLabelText('Auto-suggestions');
      fireEvent.click(autoSuggestionsCheckbox);

      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          ai: expect.objectContaining({
            autoSuggestions: true,
          }),
        })
      );
    });

    it('displays current theme setting', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByDisplayValue('light')).toBeInTheDocument();
    });

    it('allows changing theme', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const themeSelect = screen.getByDisplayValue('light');
      fireEvent.change(themeSelect, { target: { value: 'dark' } });

      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: 'dark',
        })
      );
    });

    it('displays current language setting', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByDisplayValue('ru')).toBeInTheDocument();
    });

    it('allows changing language', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const languageSelect = screen.getByDisplayValue('ru');
      fireEvent.change(languageSelect, { target: { value: 'en' } });

      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          language: 'en',
        })
      );
    });

    it('displays current notification settings', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByLabelText('Enable Notifications')).toBeChecked();
      expect(screen.getByLabelText('Sound Notifications')).toBeChecked();
      expect(screen.getByLabelText('Desktop Notifications')).not.toBeChecked();
    });

    it('allows toggling notification settings', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

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

    it('allows toggling sound notifications', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

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

    it('allows toggling desktop notifications', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

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

    it('shows success message after saving', async () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const saveButton = screen.getByText('Save Settings');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();
      });
    });
  });

  describe('GitHub Integration', () => {
    it('fetches GitHub issues successfully', async () => {
      const mockIssues = [
        {
          id: 1,
          title: 'Test Issue 1',
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
          number: 1,
          locked: false,
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockIssues });

      const issues = await getGitHubIssues();

      expect(issues).toEqual(mockIssues);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${GITHUB_API_URL}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`,
        {
          headers: {
            Authorization: `token test-token`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
    });

    it('creates GitHub issues successfully', async () => {
      const mockIssue = {
        id: 2,
        title: 'New Issue',
        body: 'Issue description',
        labels: ['bug'],
        state: 'open',
        user: { login: 'testuser', id: 1, avatar_url: '', html_url: '' },
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
        number: 2,
        locked: false,
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockIssue });

      const newIssue = await createGitHubIssue('New Issue', 'Issue description', ['bug']);

      expect(newIssue).toEqual(mockIssue);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${GITHUB_API_URL}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`,
        {
          title: 'New Issue',
          body: 'Issue description',
          labels: ['bug'],
        },
        {
          headers: {
            Authorization: `token test-token`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
    });

    it('handles GitHub API errors gracefully', async () => {
      const errorMessage = 'GitHub API Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(getGitHubIssues()).rejects.toThrow(errorMessage);
    });
  });
});