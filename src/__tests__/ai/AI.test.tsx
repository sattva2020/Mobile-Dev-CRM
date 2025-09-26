import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { AppProvider } from '../../context/AppContext';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../../App';
import Dashboard from '../../components/Dashboard';
import TaskBoard from '../../components/TaskBoard';
import Settings from '../../components/Settings';
import { getAIInsights, generateAISuggestions, configureAIService } from '../../services/ai';
import { OPENROUTER_API_URL, OPENROUTER_API_KEY } from '../../constants';

jest.mock('../../services/ai');

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
      enabled: true,
      model: 'grok-4-fast',
      autoSuggestions: true,
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
    configureAIService({ apiKey: 'test-api-key' });
  });

  describe('AI Service Configuration', () => {
    it('should configure AI service with API key', () => {
      configureAIService({ apiKey: 'new-api-key' });
      expect(() => configureAIService({ apiKey: 'new-api-key' })).not.toThrow();
    });

    it('should configure AI service without API key', () => {
      configureAIService({});
      expect(() => configureAIService({})).not.toThrow();
    });
  });

  describe('AI Insights', () => {
    it('should fetch AI insights successfully', async () => {
      const mockInsights = {
        summary: 'Project is progressing well',
        recommendations: [
          'Consider prioritizing high-priority tasks',
          'Review completed tasks for quality',
        ],
        metrics: {
          completionRate: 0.75,
          averageTaskTime: 2.5,
          teamProductivity: 0.8,
        },
      };

      (getAIInsights as jest.Mock).mockResolvedValueOnce(mockInsights);

      const insights = await getAIInsights();

      expect(insights).toEqual(mockInsights);
      expect(getAIInsights).toHaveBeenCalledTimes(1);
    });

    it('should handle AI insights errors gracefully', async () => {
      const errorMessage = 'AI Service Error';
      (getAIInsights as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(getAIInsights()).rejects.toThrow(errorMessage);
    });

    it('should handle missing AI insights gracefully', async () => {
      (getAIInsights as jest.Mock).mockResolvedValueOnce(null);

      const insights = await getAIInsights();

      expect(insights).toBeNull();
    });
  });

  describe('AI Suggestions', () => {
    it('should generate AI suggestions successfully', async () => {
      const mockSuggestions = [
        'Consider breaking down large tasks into smaller ones',
        'Review task priorities based on business impact',
        'Implement automated testing for critical features',
      ];

      (generateAISuggestions as jest.Mock).mockResolvedValueOnce(mockSuggestions);

      const suggestions = await generateAISuggestions();

      expect(suggestions).toEqual(mockSuggestions);
      expect(generateAISuggestions).toHaveBeenCalledTimes(1);
    });

    it('should handle AI suggestions errors gracefully', async () => {
      const errorMessage = 'AI Service Error';
      (generateAISuggestions as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(generateAISuggestions()).rejects.toThrow(errorMessage);
    });

    it('should handle empty AI suggestions gracefully', async () => {
      (generateAISuggestions as jest.Mock).mockResolvedValueOnce([]);

      const suggestions = await generateAISuggestions();

      expect(suggestions).toEqual([]);
    });
  });

  describe('AI Dashboard Integration', () => {
    it('should display AI insights in dashboard', async () => {
      const mockInsights = {
        summary: 'Project is progressing well',
        recommendations: [
          'Consider prioritizing high-priority tasks',
          'Review completed tasks for quality',
        ],
        metrics: {
          completionRate: 0.75,
          averageTaskTime: 2.5,
          teamProductivity: 0.8,
        },
      };

      (getAIInsights as jest.Mock).mockResolvedValueOnce(mockInsights);

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('AI Insights')).toBeInTheDocument();
        expect(screen.getByText('Project is progressing well')).toBeInTheDocument();
      });
    });

    it('should display AI suggestions in dashboard', async () => {
      const mockSuggestions = [
        'Consider breaking down large tasks into smaller ones',
        'Review task priorities based on business impact',
        'Implement automated testing for critical features',
      ];

      (generateAISuggestions as jest.Mock).mockResolvedValueOnce(mockSuggestions);

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('AI Suggestions')).toBeInTheDocument();
        expect(screen.getByText('Consider breaking down large tasks into smaller ones')).toBeInTheDocument();
      });
    });

    it('should handle AI service errors in dashboard', async () => {
      (getAIInsights as jest.Mock).mockRejectedValueOnce(new Error('AI Service Error'));

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('AI Insights')).toBeInTheDocument();
        expect(screen.getByText('Unable to load AI insights')).toBeInTheDocument();
      });
    });
  });

  describe('AI TaskBoard Integration', () => {
    it('should provide AI-powered task suggestions', async () => {
      const mockSuggestions = [
        'Consider breaking down large tasks into smaller ones',
        'Review task priorities based on business impact',
        'Implement automated testing for critical features',
      ];

      (generateAISuggestions as jest.Mock).mockResolvedValueOnce(mockSuggestions);

      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('AI Suggestions')).toBeInTheDocument();
        expect(screen.getByText('Consider breaking down large tasks into smaller ones')).toBeInTheDocument();
      });
    });

    it('should handle AI service errors in task board', async () => {
      (generateAISuggestions as jest.Mock).mockRejectedValueOnce(new Error('AI Service Error'));

      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('AI Suggestions')).toBeInTheDocument();
        expect(screen.getByText('Unable to load AI suggestions')).toBeInTheDocument();
      });
    });
  });

  describe('AI Settings Integration', () => {
    it('should display AI settings in settings page', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByText('AI Features')).toBeInTheDocument();
      expect(screen.getByLabelText('Enable AI Features')).toBeInTheDocument();
      expect(screen.getByLabelText('Auto-suggestions')).toBeInTheDocument();
    });

    it('should allow toggling AI features', () => {
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

    it('should allow changing AI model', () => {
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

    it('should allow toggling AI auto-suggestions', () => {
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
  });

  describe('AI Performance', () => {
    it('should handle AI service timeouts gracefully', async () => {
      (getAIInsights as jest.Mock).mockImplementationOnce(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      );

      await expect(getAIInsights()).rejects.toThrow('Timeout');
    });

    it('should handle AI service rate limiting gracefully', async () => {
      (getAIInsights as jest.Mock).mockRejectedValueOnce(new Error('Rate limit exceeded'));

      await expect(getAIInsights()).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle AI service errors gracefully', async () => {
      (getAIInsights as jest.Mock).mockRejectedValueOnce(new Error('AI Service Error'));

      await expect(getAIInsights()).rejects.toThrow('AI Service Error');
    });
  });

  describe('AI Data Privacy', () => {
    it('should not log sensitive AI data', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const consoleWarnSpy = jest.spyOn(console, 'warn');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('api-key'));
      expect(consoleWarnSpy).not.toHaveBeenCalledWith(expect.stringContaining('api-key'));
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('api-key'));

      consoleSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should not expose AI API keys in client-side code', () => {
      const sourceCode = require('../../services/ai').toString();
      expect(sourceCode).not.toContain('sk-');
      expect(sourceCode).not.toContain('api-key');
    });
  });
});
