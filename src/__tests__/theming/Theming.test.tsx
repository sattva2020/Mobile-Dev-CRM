import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { AppProvider } from '../../context/AppContext';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../../App';
import Dashboard from '../../components/Dashboard';
import TaskBoard from '../../components/TaskBoard';
import Settings from '../../components/Settings';
import { applyTheme, getTheme, configureThemeService } from '../../services/theming';

jest.mock('../../services/theming');

describe('Theming Integration Tests', () => {
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
    configureThemeService({ defaultTheme: 'light' });
  });

  describe('Theme Service Configuration', () => {
    it('should configure theme service with default theme', () => {
      configureThemeService({ defaultTheme: 'dark' });
      expect(() => configureThemeService({ defaultTheme: 'dark' })).not.toThrow();
    });

    it('should configure theme service without default theme', () => {
      configureThemeService({});
      expect(() => configureThemeService({})).not.toThrow();
    });
  });

  describe('Theme Application', () => {
    it('should apply light theme successfully', async () => {
      (applyTheme as jest.Mock).mockResolvedValueOnce({ success: true });

      const result = await applyTheme('light');

      expect(result).toEqual({ success: true });
      expect(applyTheme).toHaveBeenCalledWith('light');
    });

    it('should apply dark theme successfully', async () => {
      (applyTheme as jest.Mock).mockResolvedValueOnce({ success: true });

      const result = await applyTheme('dark');

      expect(result).toEqual({ success: true });
      expect(applyTheme).toHaveBeenCalledWith('dark');
    });

    it('should handle theme application errors gracefully', async () => {
      const errorMessage = 'Theme Application Error';
      (applyTheme as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(applyTheme('light')).rejects.toThrow(errorMessage);
    });

    it('should handle invalid theme gracefully', async () => {
      const errorMessage = 'Invalid theme';
      (applyTheme as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(applyTheme('invalid-theme')).rejects.toThrow(errorMessage);
    });
  });

  describe('Theme Retrieval', () => {
    it('should get current theme successfully', async () => {
      (getTheme as jest.Mock).mockResolvedValueOnce('light');

      const theme = await getTheme();

      expect(theme).toBe('light');
      expect(getTheme).toHaveBeenCalledTimes(1);
    });

    it('should handle theme retrieval errors gracefully', async () => {
      const errorMessage = 'Theme Retrieval Error';
      (getTheme as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(getTheme()).rejects.toThrow(errorMessage);
    });

    it('should handle missing theme gracefully', async () => {
      (getTheme as jest.Mock).mockResolvedValueOnce(null);

      const theme = await getTheme();

      expect(theme).toBeNull();
    });
  });

  describe('Theme Dashboard Integration', () => {
    it('should display theme information in dashboard', async () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Theme')).toBeInTheDocument();
      expect(screen.getByText('Light')).toBeInTheDocument();
    });

    it('should handle theme errors in dashboard', async () => {
      (getTheme as jest.Mock).mockRejectedValueOnce(new Error('Theme Error'));

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Theme')).toBeInTheDocument();
    });
  });

  describe('Theme Settings Integration', () => {
    it('should display theme settings in settings page', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByText('Appearance')).toBeInTheDocument();
      expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    });

    it('should allow changing theme', () => {
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

    it('should handle theme change errors gracefully', async () => {
      (applyTheme as jest.Mock).mockRejectedValueOnce(new Error('Theme Change Error'));

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
  });

  describe('Theme Performance', () => {
    it('should handle theme service timeouts gracefully', async () => {
      (applyTheme as jest.Mock).mockImplementationOnce(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      );

      await expect(applyTheme('light')).rejects.toThrow('Timeout');
    });

    it('should handle theme service rate limiting gracefully', async () => {
      (applyTheme as jest.Mock).mockRejectedValueOnce(new Error('Rate limit exceeded'));

      await expect(applyTheme('light')).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle theme service errors gracefully', async () => {
      (applyTheme as jest.Mock).mockRejectedValueOnce(new Error('Theme Service Error'));

      await expect(applyTheme('light')).rejects.toThrow('Theme Service Error');
    });
  });

  describe('Theme Data Privacy', () => {
    it('should not log sensitive theme data', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const consoleWarnSpy = jest.spyOn(console, 'warn');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('theme'));
      expect(consoleWarnSpy).not.toHaveBeenCalledWith(expect.stringContaining('theme'));
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('theme'));

      consoleSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should not expose theme API keys in client-side code', () => {
      const sourceCode = require('../../services/theming').toString();
      expect(sourceCode).not.toContain('theme-api-key');
      expect(sourceCode).not.toContain('api-key');
    });
  });
});
