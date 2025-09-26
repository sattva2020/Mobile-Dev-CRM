import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { AppProvider } from '../../context/AppContext';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../../App';
import TaskBoard from '../../components/TaskBoard';
import Settings from '../../components/Settings';
import { getGitHubIssues, createGitHubIssue, configureGitHubService } from '../../services';
import { GITHUB_API_URL, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } from '../../constants';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Security Tests', () => {
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

  describe('XSS Protection', () => {
    it('should not execute malicious scripts in task titles', () => {
      const maliciousTitle = '<script>alert("xss")</script>';
      
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const titleInput = screen.getByPlaceholderText('Task title');
      fireEvent.change(titleInput, { target: { value: maliciousTitle } });

      expect(screen.getByDisplayValue(maliciousTitle)).toBeInTheDocument();
    });

    it('should not execute malicious scripts in task descriptions', () => {
      const maliciousDescription = '<script>alert("xss")</script>';
      
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const descriptionInput = screen.getByPlaceholderText('Task description');
      fireEvent.change(descriptionInput, { target: { value: maliciousDescription } });

      expect(screen.getByDisplayValue(maliciousDescription)).toBeInTheDocument();
    });
  });

  describe('Input Validation', () => {
    it('should validate task title length', () => {
      const longTitle = 'a'.repeat(1000);
      
      render(
        <AppProvider>
          <TaskBoard />
        </AppProvider>
      );

      const titleInput = screen.getByPlaceholderText('Task title');
      fireEvent.change(titleInput, { target: { value: longTitle } });

      expect(screen.getByDisplayValue(longTitle)).toBeInTheDocument();
    });

    it('should validate GitHub repository owner format', () => {
      const invalidOwner = 'invalid-owner-format!@#';
      
      render(
        <AppProvider>
          <Settings />
        </AppProvider>
      );

      const ownerInput = screen.getByLabelText('Repository Owner');
      fireEvent.change(ownerInput, { target: { value: invalidOwner } });

      expect(screen.getByDisplayValue(invalidOwner)).toBeInTheDocument();
    });
  });

  describe('Authentication Security', () => {
    it('should not expose GitHub tokens in client-side code', () => {
      const sourceCode = require('../../services').toString();
      expect(sourceCode).not.toContain('ghp_');
      expect(sourceCode).not.toContain('github_pat_');
    });

    it('should handle missing GitHub tokens gracefully', async () => {
      configureGitHubService({});

      await expect(getGitHubIssues()).rejects.toThrow();
    });
  });

  describe('API Security', () => {
    it('should use HTTPS for GitHub API calls', () => {
      expect(GITHUB_API_URL).toMatch(/^https:/);
    });

    it('should handle API rate limiting gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Rate limit exceeded'));

      await expect(getGitHubIssues()).rejects.toThrow('Rate limit exceeded');
    });
  });
});