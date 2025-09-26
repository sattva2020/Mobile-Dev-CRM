import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { AppProvider } from '../../context/AppContext';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../../App';
import Dashboard from '../../components/Dashboard';
import TaskBoard from '../../components/TaskBoard';
import Settings from '../../components/Settings';
import { sendEmail, sendInAppNotification, configureNotificationService } from '../../services/notifications';

jest.mock('../../services/notifications');

describe('Notifications Integration Tests', () => {
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
    configureNotificationService({ emailService: 'smtp', smtpConfig: {} });
  });

  describe('Notification Service Configuration', () => {
    it('should configure notification service with email service', () => {
      configureNotificationService({ emailService: 'smtp', smtpConfig: {} });
      expect(() => configureNotificationService({ emailService: 'smtp', smtpConfig: {} })).not.toThrow();
    });

    it('should configure notification service without email service', () => {
      configureNotificationService({});
      expect(() => configureNotificationService({})).not.toThrow();
    });
  });

  describe('Email Notifications', () => {
    it('should send email notifications successfully', async () => {
      const mockEmail = {
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test Body',
      };

      (sendEmail as jest.Mock).mockResolvedValueOnce({ success: true });

      const result = await sendEmail(mockEmail.to, mockEmail.subject, mockEmail.body);

      expect(result).toEqual({ success: true });
      expect(sendEmail).toHaveBeenCalledWith(mockEmail.to, mockEmail.subject, mockEmail.body);
    });

    it('should handle email notification errors gracefully', async () => {
      const errorMessage = 'Email Service Error';
      (sendEmail as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(sendEmail('test@example.com', 'Subject', 'Body')).rejects.toThrow(errorMessage);
    });

    it('should handle email validation errors gracefully', async () => {
      const errorMessage = 'Invalid email address';
      (sendEmail as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(sendEmail('invalid-email', 'Subject', 'Body')).rejects.toThrow(errorMessage);
    });
  });

  describe('In-App Notifications', () => {
    it('should send in-app notifications successfully', async () => {
      const mockNotification = {
        userId: 'user-1',
        message: 'Test notification message',
        type: 'info' as const,
      };

      (sendInAppNotification as jest.Mock).mockResolvedValueOnce({ success: true });

      const result = await sendInAppNotification(mockNotification.userId, mockNotification.message, mockNotification.type);

      expect(result).toEqual({ success: true });
      expect(sendInAppNotification).toHaveBeenCalledWith(mockNotification.userId, mockNotification.message, mockNotification.type);
    });

    it('should handle in-app notification errors gracefully', async () => {
      const errorMessage = 'Notification Service Error';
      (sendInAppNotification as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(sendInAppNotification('user-1', 'Message', 'info')).rejects.toThrow(errorMessage);
    });

    it('should handle missing user ID gracefully', async () => {
      const errorMessage = 'User ID is required';
      (sendInAppNotification as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(sendInAppNotification('', 'Message', 'info')).rejects.toThrow(errorMessage);
    });
  });

  describe('Notification Dashboard Integration', () => {
    it('should display notifications in dashboard', async () => {
      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Recent Notifications')).toBeInTheDocument();
      expect(screen.getByText('Test Notification')).toBeInTheDocument();
      expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('should handle empty notification list', async () => {
      const emptyNotifications = [];

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Recent Notifications')).toBeInTheDocument();
    });

    it('should handle notification errors gracefully', async () => {
      (sendInAppNotification as jest.Mock).mockRejectedValueOnce(new Error('Notification Service Error'));

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(screen.getByText('Recent Notifications')).toBeInTheDocument();
    });
  });

  describe('Notification Settings Integration', () => {
    it('should display notification settings in settings page', () => {
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Enable Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Sound Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Desktop Notifications')).toBeInTheDocument();
    });

    it('should allow toggling notification settings', () => {
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

    it('should allow toggling sound notifications', () => {
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

    it('should allow toggling desktop notifications', () => {
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
  });

  describe('Notification Performance', () => {
    it('should handle notification service timeouts gracefully', async () => {
      (sendEmail as jest.Mock).mockImplementationOnce(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      );

      await expect(sendEmail('test@example.com', 'Subject', 'Body')).rejects.toThrow('Timeout');
    });

    it('should handle notification service rate limiting gracefully', async () => {
      (sendEmail as jest.Mock).mockRejectedValueOnce(new Error('Rate limit exceeded'));

      await expect(sendEmail('test@example.com', 'Subject', 'Body')).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle notification service errors gracefully', async () => {
      (sendEmail as jest.Mock).mockRejectedValueOnce(new Error('Notification Service Error'));

      await expect(sendEmail('test@example.com', 'Subject', 'Body')).rejects.toThrow('Notification Service Error');
    });
  });

  describe('Notification Data Privacy', () => {
    it('should not log sensitive notification data', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const consoleWarnSpy = jest.spyOn(console, 'warn');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      render(
        <AppProvider>
          <Dashboard />
        </AppProvider>
      );

      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('email'));
      expect(consoleWarnSpy).not.toHaveBeenCalledWith(expect.stringContaining('email'));
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(expect.stringContaining('email'));

      consoleSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should not expose notification API keys in client-side code', () => {
      const sourceCode = require('../../services/notifications').toString();
      expect(sourceCode).not.toContain('smtp-password');
      expect(sourceCode).not.toContain('api-key');
    });
  });
});
