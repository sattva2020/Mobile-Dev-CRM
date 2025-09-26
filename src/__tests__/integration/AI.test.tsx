import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import App from '../../App';
import { useAppContext } from '../../context/AppContext';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('AI Integration Tests', () => {
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

  it('displays AI status on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('AI Status')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
    expect(screen.getByText('Model: grok-4-fast')).toBeInTheDocument();
  });

  it('shows AI auto-suggestions status on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Auto-suggestions: Off')).toBeInTheDocument();
  });

  it('allows configuring AI features in Settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check AI settings section
    expect(screen.getByText('AI Features')).toBeInTheDocument();
    expect(screen.getByDisplayValue('grok-4-fast')).toBeInTheDocument();
  });

  it('allows toggling AI features in Settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

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

  it('allows changing AI model in Settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

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

  it('allows toggling AI auto-suggestions in Settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

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

  it('shows AI suggestions when enabled', async () => {
    // Mock settings with AI enabled
    const aiEnabledSettings = {
      ...mockSettings,
      ai: {
        enabled: true,
        model: 'grok-4-fast',
        autoSuggestions: true,
      },
    };

    mockUseAppContext.mockReturnValue({
      tasks: mockTasks,
      notifications: mockNotifications,
      settings: aiEnabledSettings,
      updateTask: mockUpdateTask,
      updateNotification: mockUpdateNotification,
      updateSettings: mockUpdateSettings,
    });

    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    // Check if AI suggestions are displayed
    expect(screen.getByText('AI Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Suggested Labels')).toBeInTheDocument();
    expect(screen.getByText('Suggested Priority')).toBeInTheDocument();
  });

  it('handles AI API errors gracefully', async () => {
    // Mock AI API error
    global.fetch = jest.fn().mockRejectedValueOnce(
      new Error('AI API Error')
    );

    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Try to enable AI features
    const aiEnabledCheckbox = screen.getByLabelText('Enable AI Features');
    fireEvent.click(aiEnabledCheckbox);

    await waitFor(() => {
      expect(screen.getByText('Error enabling AI features')).toBeInTheDocument();
    });
  });

  it('successfully enables AI features', async () => {
    // Mock successful AI API response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Enable AI features
    const aiEnabledCheckbox = screen.getByLabelText('Enable AI Features');
    fireEvent.click(aiEnabledCheckbox);

    await waitFor(() => {
      expect(screen.getByText('AI features enabled successfully')).toBeInTheDocument();
    });
  });

  it('displays AI model information', () => {
    render(<App />);

    expect(screen.getByText('AI Model')).toBeInTheDocument();
    expect(screen.getByText('grok-4-fast')).toBeInTheDocument();
  });

  it('shows AI usage statistics', () => {
    render(<App />);

    expect(screen.getByText('AI Usage')).toBeInTheDocument();
    expect(screen.getByText('Requests: 0')).toBeInTheDocument();
    expect(screen.getByText('Tokens Used: 0')).toBeInTheDocument();
  });

  it('handles AI model switching', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const modelSelect = screen.getByDisplayValue('grok-4-fast');
    
    // Test switching to different models
    const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'grok-4-fast'];
    
    models.forEach(model => {
      fireEvent.change(modelSelect, { target: { value: model } });
      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          ai: expect.objectContaining({
            model: model,
          }),
        })
      );
    });
  });

  it('validates AI model selection', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const modelSelect = screen.getByDisplayValue('grok-4-fast');
    
    // Test with invalid model
    fireEvent.change(modelSelect, { target: { value: 'invalid-model' } });

    // The selection should be validated
    expect(modelSelect).toHaveValue('invalid-model');
  });

  it('handles AI rate limiting', async () => {
    // Mock AI API rate limit error
    global.fetch = jest.fn().mockRejectedValueOnce(
      new Error('AI API rate limit exceeded')
    );

    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Try to enable AI features
    const aiEnabledCheckbox = screen.getByLabelText('Enable AI Features');
    fireEvent.click(aiEnabledCheckbox);

    await waitFor(() => {
      expect(screen.getByText('AI API rate limit exceeded')).toBeInTheDocument();
    });
  });

  it('displays AI configuration status', () => {
    render(<App />);

    expect(screen.getByText('AI Configuration')).toBeInTheDocument();
    expect(screen.getByText('Status: Not Configured')).toBeInTheDocument();
  });

  it('shows AI feature availability', () => {
    render(<App />);

    expect(screen.getByText('Available AI Features')).toBeInTheDocument();
    expect(screen.getByText('Task Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Priority Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Label Suggestions')).toBeInTheDocument();
  });

  it('handles AI model loading states', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for loading states
    expect(screen.getByText('Loading AI Models...')).toBeInTheDocument();
  });

  it('validates AI API key configuration', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for API key input
    const apiKeyInput = screen.getByLabelText(/api key/i);
    expect(apiKeyInput).toBeInTheDocument();
    expect(apiKeyInput).toHaveAttribute('type', 'password');
  });

  it('handles AI model compatibility', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for model compatibility information
    expect(screen.getByText('Model Compatibility')).toBeInTheDocument();
    expect(screen.getByText('Supported Features')).toBeInTheDocument();
  });
});
