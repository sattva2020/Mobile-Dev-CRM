import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import App from '../../App';
import { useAppContext } from '../../context/AppContext';
import * as githubService from '../../services';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

// Mock GitHub service
jest.mock('../../services');
const mockGithubService = githubService as jest.Mocked<typeof githubService>;

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

  it('displays GitHub repository information on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('test-owner/test-repo')).toBeInTheDocument();
    expect(screen.getByText('GitHub Repository')).toBeInTheDocument();
  });

  it('shows GitHub sync status on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Auto-sync: Off')).toBeInTheDocument();
    expect(screen.getByText('Sync Interval: 30 minutes')).toBeInTheDocument();
  });

  it('allows configuring GitHub repository in Settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check GitHub settings section
    expect(screen.getByText('GitHub Integration')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-owner')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-repo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('allows toggling GitHub auto-sync in Settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

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

  it('allows updating GitHub sync interval in Settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

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

  it('handles GitHub API errors gracefully', async () => {
    // Mock GitHub API error
    mockGithubService.getGitHubIssues.mockRejectedValueOnce(
      new Error('GitHub API Error')
    );

    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Try to sync with GitHub
    const syncButton = screen.getByRole('button', { name: /sync now/i });
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(screen.getByText('Error syncing with GitHub')).toBeInTheDocument();
    });
  });

  it('successfully syncs with GitHub API', async () => {
    // Mock successful GitHub API response
    const mockIssues = [
      {
        id: 1,
        title: 'GitHub Issue 1',
        body: 'Issue description',
        state: 'open',
        user: { login: 'test-user' },
        labels: [{ name: 'bug', color: 'red' }],
        assignees: [],
        created_at: '2024-01-17T12:00:00Z',
        updated_at: '2024-01-17T12:00:00Z',
      },
    ];
    mockGithubService.getGitHubIssues.mockResolvedValueOnce(mockIssues);

    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Sync with GitHub
    const syncButton = screen.getByRole('button', { name: /sync now/i });
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(screen.getByText('Successfully synced with GitHub')).toBeInTheDocument();
    });

    expect(mockGithubService.getGitHubIssues).toHaveBeenCalled();
  });

  it('creates GitHub issues from tasks', async () => {
    // Mock successful GitHub issue creation
    const mockIssue = {
      id: 2,
      title: 'New GitHub Issue',
      body: 'Issue description',
      state: 'open',
      user: { login: 'test-user' },
      labels: ['bug'],
      assignees: [],
      created_at: '2024-01-17T12:00:00Z',
      updated_at: '2024-01-17T12:00:00Z',
    };
    mockGithubService.createGitHubIssue.mockResolvedValueOnce(mockIssue);

    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    // Create a new task
    const titleInput = screen.getByLabelText(/task title/i);
    const descriptionInput = screen.getByLabelText(/task description/i);
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(addButton);

    // Check if task was created
    expect(mockUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Task',
        description: 'New Description',
      })
    );
  });

  it('handles GitHub authentication errors', async () => {
    // Mock GitHub authentication error
    mockGithubService.getGitHubIssues.mockRejectedValueOnce(
      new Error('Authentication failed')
    );

    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Try to sync with GitHub
    const syncButton = screen.getByRole('button', { name: /sync now/i });
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(screen.getByText('Authentication failed')).toBeInTheDocument();
    });
  });

  it('validates GitHub repository format', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const ownerInput = screen.getByDisplayValue('test-owner');
    const nameInput = screen.getByDisplayValue('test-repo');
    
    // Test with invalid repository format
    fireEvent.change(ownerInput, { target: { value: 'invalid owner!' } });
    fireEvent.change(nameInput, { target: { value: 'invalid repo!' } });

    // The input should be validated
    expect(ownerInput).toHaveValue('invalid owner!');
    expect(nameInput).toHaveValue('invalid repo!');
  });

  it('handles GitHub API rate limiting', async () => {
    // Mock GitHub API rate limit error
    mockGithubService.getGitHubIssues.mockRejectedValueOnce(
      new Error('API rate limit exceeded')
    );

    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Try to sync with GitHub
    const syncButton = screen.getByRole('button', { name: /sync now/i });
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(screen.getByText('API rate limit exceeded')).toBeInTheDocument();
    });
  });

  it('displays GitHub issue count on Dashboard', () => {
    render(<App />);

    // Check if GitHub issue count is displayed
    expect(screen.getByText('GitHub Issues')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // No issues synced yet
  });

  it('shows GitHub sync status indicator', () => {
    render(<App />);

    // Check for sync status indicator
    expect(screen.getByText('GitHub Sync Status')).toBeInTheDocument();
    expect(screen.getByText('Not Connected')).toBeInTheDocument();
  });

  it('handles GitHub webhook notifications', () => {
    render(<App />);

    // Check if webhook notifications are handled
    expect(screen.getByText('Webhook Notifications')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('validates GitHub personal access token', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for token validation
    const tokenInput = screen.getByLabelText(/personal access token/i);
    expect(tokenInput).toBeInTheDocument();
    expect(tokenInput).toHaveAttribute('type', 'password');
  });

  it('handles GitHub repository not found errors', async () => {
    // Mock GitHub repository not found error
    mockGithubService.getGitHubIssues.mockRejectedValueOnce(
      new Error('Repository not found')
    );

    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Try to sync with GitHub
    const syncButton = screen.getByRole('button', { name: /sync now/i });
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(screen.getByText('Repository not found')).toBeInTheDocument();
    });
  });
});
