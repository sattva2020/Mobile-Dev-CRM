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

describe('GitHub Integration Tests', () => {
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
    configureGitHubService({ personalAccessToken: 'test-token' });
  });

  describe('GitHub Service Configuration', () => {
    it('should configure GitHub service with token', () => {
      configureGitHubService({ personalAccessToken: 'new-token' });
      expect(() => configureGitHubService({ personalAccessToken: 'new-token' })).not.toThrow();
    });

    it('should configure GitHub service without token', () => {
      configureGitHubService({});
      expect(() => configureGitHubService({})).not.toThrow();
    });
  });

  describe('GitHub Issues', () => {
    it('should fetch GitHub issues successfully', async () => {
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

    it('should handle GitHub issues errors gracefully', async () => {
      const errorMessage = 'GitHub API Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(getGitHubIssues()).rejects.toThrow(errorMessage);
    });

    it('should handle empty GitHub issues response', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const issues = await getGitHubIssues();

      expect(issues).toEqual([]);
    });
  });

  describe('GitHub Issue Creation', () => {
    it('should create GitHub issue successfully', async () => {
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

    it('should handle GitHub issue creation errors gracefully', async () => {
      const errorMessage = 'GitHub API Error';
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(createGitHubIssue('Title', 'Body')).rejects.toThrow(errorMessage);
    });

    it('should handle missing GitHub token gracefully', async () => {
      configureGitHubService({});

      await expect(createGitHubIssue('Title', 'Body')).rejects.toThrow(
        'GitHub Personal Access Token is not configured.'
      );
    });
  });

  describe('GitHub Dashboard Integration', () => {
    it('should display GitHub repository info in dashboard', async () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('GitHub Repository')).toBeInTheDocument();
      expect(screen.getByText('test-owner/test-repo')).toBeInTheDocument();
    });

    it('should handle GitHub errors in dashboard', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('GitHub API Error'));

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('GitHub Repository')).toBeInTheDocument();
    });
  });

  describe('GitHub Settings Integration', () => {
    it('should display GitHub settings in settings page', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByText('GitHub Integration')).toBeInTheDocument();
      expect(screen.getByLabelText('Repository Owner')).toBeInTheDocument();
      expect(screen.getByLabelText('Repository Name')).toBeInTheDocument();
    });

    it('should allow updating GitHub repository settings', async () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const ownerInput = screen.getByLabelText('Repository Owner');
      const nameInput = screen.getByLabelText('Repository Name');

      fireEvent.change(ownerInput, { target: { value: 'new-owner' } });
      fireEvent.change(nameInput, { target: { value: 'new-repo' } });

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

    it('should allow toggling GitHub auto-sync', () => {
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
  });

  describe('GitHub Performance', () => {
    it('should handle GitHub API timeouts gracefully', async () => {
      mockedAxios.get.mockImplementationOnce(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      );

      await expect(getGitHubIssues()).rejects.toThrow('Timeout');
    });

    it('should handle GitHub API rate limiting gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Rate limit exceeded'));

      await expect(getGitHubIssues()).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle GitHub API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('GitHub API Error'));

      await expect(getGitHubIssues()).rejects.toThrow('GitHub API Error');
    });
  });

  describe('GitHub Data Privacy', () => {
    it('should not log sensitive GitHub data', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const consoleWarnSpy = jest.spyOn(console, 'warn');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('token'));
      expect(consoleWarnSpy).not.toHaveBeenCalledWith(expect.stringContaining('token'));
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('token'));

      consoleSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should not expose GitHub API keys in client-side code', () => {
      const sourceCode = require('../../services').toString();
      expect(sourceCode).not.toContain('ghp_');
      expect(sourceCode).not.toContain('github_pat_');
    });
  });
});
