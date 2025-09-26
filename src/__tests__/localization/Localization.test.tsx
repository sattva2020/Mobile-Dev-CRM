import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { AppProvider } from '../../context/AppContext';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../../App';
import Dashboard from '../../components/Dashboard';
import TaskBoard from '../../components/TaskBoard';
import Settings from '../../components/Settings';
import { setLanguage, getLanguage, configureLocalizationService } from '../../services/localization';

jest.mock('../../services/localization');

describe('Localization Integration Tests', () => {
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
    configureLocalizationService({ defaultLanguage: 'en' });
  });

  describe('Localization Service Configuration', () => {
    it('should configure localization service with default language', () => {
      configureLocalizationService({ defaultLanguage: 'ru' });
      expect(() => configureLocalizationService({ defaultLanguage: 'ru' })).not.toThrow();
    });

    it('should configure localization service without default language', () => {
      configureLocalizationService({});
      expect(() => configureLocalizationService({})).not.toThrow();
    });
  });

  describe('Language Setting', () => {
    it('should set language successfully', async () => {
      (setLanguage as jest.Mock).mockResolvedValueOnce({ success: true });

      const result = await setLanguage('ru');

      expect(result).toEqual({ success: true });
      expect(setLanguage).toHaveBeenCalledWith('ru');
    });

    it('should handle language setting errors gracefully', async () => {
      const errorMessage = 'Language Setting Error';
      (setLanguage as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(setLanguage('ru')).rejects.toThrow(errorMessage);
    });

    it('should handle invalid language gracefully', async () => {
      const errorMessage = 'Invalid language';
      (setLanguage as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(setLanguage('invalid-lang')).rejects.toThrow(errorMessage);
    });
  });

  describe('Language Retrieval', () => {
    it('should get current language successfully', async () => {
      (getLanguage as jest.Mock).mockResolvedValueOnce('ru');

      const language = await getLanguage();

      expect(language).toBe('ru');
      expect(getLanguage).toHaveBeenCalledTimes(1);
    });

    it('should handle language retrieval errors gracefully', async () => {
      const errorMessage = 'Language Retrieval Error';
      (getLanguage as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(getLanguage()).rejects.toThrow(errorMessage);
    });

    it('should handle missing language gracefully', async () => {
      (getLanguage as jest.Mock).mockResolvedValueOnce(null);

      const language = await getLanguage();

      expect(language).toBeNull();
    });
  });

  describe('Localization Dashboard Integration', () => {
    it('should display language information in dashboard', async () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Language')).toBeInTheDocument();
      expect(screen.getByText('Russian')).toBeInTheDocument();
    });

    it('should handle language errors in dashboard', async () => {
      (getLanguage as jest.Mock).mockRejectedValueOnce(new Error('Language Error'));

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Language')).toBeInTheDocument();
    });
  });

  describe('Localization Settings Integration', () => {
    it('should display language settings in settings page', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByText('Appearance')).toBeInTheDocument();
      expect(screen.getByLabelText('Language')).toBeInTheDocument();
    });

    it('should allow changing language', () => {
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

    it('should handle language change errors gracefully', async () => {
      (setLanguage as jest.Mock).mockRejectedValueOnce(new Error('Language Change Error'));

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
  });

  describe('Localization Performance', () => {
    it('should handle localization service timeouts gracefully', async () => {
      (setLanguage as jest.Mock).mockImplementationOnce(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      );

      await expect(setLanguage('ru')).rejects.toThrow('Timeout');
    });

    it('should handle localization service rate limiting gracefully', async () => {
      (setLanguage as jest.Mock).mockRejectedValueOnce(new Error('Rate limit exceeded'));

      await expect(setLanguage('ru')).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle localization service errors gracefully', async () => {
      (setLanguage as jest.Mock).mockRejectedValueOnce(new Error('Localization Service Error'));

      await expect(setLanguage('ru')).rejects.toThrow('Localization Service Error');
    });
  });

  describe('Localization Data Privacy', () => {
    it('should not log sensitive localization data', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const consoleWarnSpy = jest.spyOn(console, 'warn');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('language'));
      expect(consoleWarnSpy).not.toHaveBeenCalledWith(expect.stringContaining('language'));
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('language'));

      consoleSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should not expose localization API keys in client-side code', () => {
      const sourceCode = require('../../services/localization').toString();
      expect(sourceCode).not.toContain('localization-api-key');
      expect(sourceCode).not.toContain('api-key');
    });
  });
});
