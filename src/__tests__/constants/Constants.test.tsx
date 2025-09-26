import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { API_BASE_URL, GITHUB_API_URL, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, OPENROUTER_API_URL, OPENROUTER_API_KEY, TASK_STATUSES, TASK_PRIORITIES, TASK_CATEGORIES, NOTIFICATION_TYPES, NOTIFICATION_SOURCES, PROJECT_STATUSES, USER_ROLES, THEMES, LANGUAGES } from '../../constants';

describe('Constants Tests', () => {
  describe('API Constants', () => {
    it('should have valid API base URL', () => {
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe('string');
      expect(API_BASE_URL.length).toBeGreaterThan(0);
    });

    it('should have valid GitHub API URL', () => {
      expect(GITHUB_API_URL).toBeDefined();
      expect(typeof GITHUB_API_URL).toBe('string');
      expect(GITHUB_API_URL).toMatch(/^https:\/\/api\.github\.com$/);
    });

    it('should have valid GitHub repository owner', () => {
      expect(GITHUB_REPO_OWNER).toBeDefined();
      expect(typeof GITHUB_REPO_OWNER).toBe('string');
      expect(GITHUB_REPO_OWNER.length).toBeGreaterThan(0);
    });

    it('should have valid GitHub repository name', () => {
      expect(GITHUB_REPO_NAME).toBeDefined();
      expect(typeof GITHUB_REPO_NAME).toBe('string');
      expect(GITHUB_REPO_NAME.length).toBeGreaterThan(0);
    });

    it('should have valid OpenRouter API URL', () => {
      expect(OPENROUTER_API_URL).toBeDefined();
      expect(typeof OPENROUTER_API_URL).toBe('string');
      expect(OPENROUTER_API_URL).toMatch(/^https:\/\/openrouter\.ai\/api\/v1$/);
    });

    it('should have valid OpenRouter API key', () => {
      expect(OPENROUTER_API_KEY).toBeDefined();
      expect(typeof OPENROUTER_API_KEY).toBe('string');
      expect(OPENROUTER_API_KEY.length).toBeGreaterThan(0);
    });
  });

  describe('Task Constants', () => {
    it('should have valid task statuses', () => {
      expect(TASK_STATUSES).toBeDefined();
      expect(Array.isArray(TASK_STATUSES)).toBe(true);
      expect(TASK_STATUSES.length).toBeGreaterThan(0);
      expect(TASK_STATUSES).toEqual(['todo', 'in-progress', 'done']);
    });

    it('should have valid task priorities', () => {
      expect(TASK_PRIORITIES).toBeDefined();
      expect(Array.isArray(TASK_PRIORITIES)).toBe(true);
      expect(TASK_PRIORITIES.length).toBeGreaterThan(0);
      expect(TASK_PRIORITIES).toEqual(['low', 'medium', 'high', 'critical']);
    });

    it('should have valid task categories', () => {
      expect(TASK_CATEGORIES).toBeDefined();
      expect(Array.isArray(TASK_CATEGORIES)).toBe(true);
      expect(TASK_CATEGORIES.length).toBeGreaterThan(0);
      expect(TASK_CATEGORIES).toEqual(['bug', 'feature', 'enhancement', 'documentation']);
    });
  });

  describe('Notification Constants', () => {
    it('should have valid notification types', () => {
      expect(NOTIFICATION_TYPES).toBeDefined();
      expect(Array.isArray(NOTIFICATION_TYPES)).toBe(true);
      expect(NOTIFICATION_TYPES.length).toBeGreaterThan(0);
      expect(NOTIFICATION_TYPES).toEqual(['info', 'warning', 'error', 'success']);
    });

    it('should have valid notification sources', () => {
      expect(NOTIFICATION_SOURCES).toBeDefined();
      expect(Array.isArray(NOTIFICATION_SOURCES)).toBe(true);
      expect(NOTIFICATION_SOURCES.length).toBeGreaterThan(0);
      expect(NOTIFICATION_SOURCES).toEqual(['system', 'user', 'github', 'ai']);
    });
  });

  describe('Project Constants', () => {
    it('should have valid project statuses', () => {
      expect(PROJECT_STATUSES).toBeDefined();
      expect(Array.isArray(PROJECT_STATUSES)).toBe(true);
      expect(PROJECT_STATUSES.length).toBeGreaterThan(0);
      expect(PROJECT_STATUSES).toEqual(['Active', 'Completed', 'On Hold']);
    });
  });

  describe('User Constants', () => {
    it('should have valid user roles', () => {
      expect(USER_ROLES).toBeDefined();
      expect(Array.isArray(USER_ROLES)).toBe(true);
      expect(USER_ROLES.length).toBeGreaterThan(0);
      expect(USER_ROLES).toEqual(['Developer', 'Project Manager', 'Admin']);
    });
  });

  describe('Theme Constants', () => {
    it('should have valid themes', () => {
      expect(THEMES).toBeDefined();
      expect(Array.isArray(THEMES)).toBe(true);
      expect(THEMES.length).toBeGreaterThan(0);
      expect(THEMES).toEqual(['light', 'dark']);
    });
  });

  describe('Language Constants', () => {
    it('should have valid languages', () => {
      expect(LANGUAGES).toBeDefined();
      expect(Array.isArray(LANGUAGES)).toBe(true);
      expect(LANGUAGES.length).toBeGreaterThan(0);
      expect(LANGUAGES).toEqual(['en', 'ru']);
    });
  });

  describe('Constant Validation', () => {
    it('should validate task status values', () => {
      TASK_STATUSES.forEach(status => {
        expect(typeof status).toBe('string');
        expect(status.length).toBeGreaterThan(0);
        expect(['todo', 'in-progress', 'done']).toContain(status);
      });
    });

    it('should validate task priority values', () => {
      TASK_PRIORITIES.forEach(priority => {
        expect(typeof priority).toBe('string');
        expect(priority.length).toBeGreaterThan(0);
        expect(['low', 'medium', 'high', 'critical']).toContain(priority);
      });
    });

    it('should validate task category values', () => {
      TASK_CATEGORIES.forEach(category => {
        expect(typeof category).toBe('string');
        expect(category.length).toBeGreaterThan(0);
        expect(['bug', 'feature', 'enhancement', 'documentation']).toContain(category);
      });
    });

    it('should validate notification type values', () => {
      NOTIFICATION_TYPES.forEach(type => {
        expect(typeof type).toBe('string');
        expect(type.length).toBeGreaterThan(0);
        expect(['info', 'warning', 'error', 'success']).toContain(type);
      });
    });

    it('should validate notification source values', () => {
      NOTIFICATION_SOURCES.forEach(source => {
        expect(typeof source).toBe('string');
        expect(source.length).toBeGreaterThan(0);
        expect(['system', 'user', 'github', 'ai']).toContain(source);
      });
    });

    it('should validate project status values', () => {
      PROJECT_STATUSES.forEach(status => {
        expect(typeof status).toBe('string');
        expect(status.length).toBeGreaterThan(0);
        expect(['Active', 'Completed', 'On Hold']).toContain(status);
      });
    });

    it('should validate user role values', () => {
      USER_ROLES.forEach(role => {
        expect(typeof role).toBe('string');
        expect(role.length).toBeGreaterThan(0);
        expect(['Developer', 'Project Manager', 'Admin']).toContain(role);
      });
    });

    it('should validate theme values', () => {
      THEMES.forEach(theme => {
        expect(typeof theme).toBe('string');
        expect(theme.length).toBeGreaterThan(0);
        expect(['light', 'dark']).toContain(theme);
      });
    });

    it('should validate language values', () => {
      LANGUAGES.forEach(language => {
        expect(typeof language).toBe('string');
        expect(language.length).toBeGreaterThan(0);
        expect(['en', 'ru']).toContain(language);
      });
    });
  });

  describe('Constant Consistency', () => {
    it('should have consistent array types', () => {
      expect(Array.isArray(TASK_STATUSES)).toBe(true);
      expect(Array.isArray(TASK_PRIORITIES)).toBe(true);
      expect(Array.isArray(TASK_CATEGORIES)).toBe(true);
      expect(Array.isArray(NOTIFICATION_TYPES)).toBe(true);
      expect(Array.isArray(NOTIFICATION_SOURCES)).toBe(true);
      expect(Array.isArray(PROJECT_STATUSES)).toBe(true);
      expect(Array.isArray(USER_ROLES)).toBe(true);
      expect(Array.isArray(THEMES)).toBe(true);
      expect(Array.isArray(LANGUAGES)).toBe(true);
    });

    it('should have consistent string types', () => {
      expect(typeof API_BASE_URL).toBe('string');
      expect(typeof GITHUB_API_URL).toBe('string');
      expect(typeof GITHUB_REPO_OWNER).toBe('string');
      expect(typeof GITHUB_REPO_NAME).toBe('string');
      expect(typeof OPENROUTER_API_URL).toBe('string');
      expect(typeof OPENROUTER_API_KEY).toBe('string');
    });

    it('should have consistent URL formats', () => {
      expect(API_BASE_URL).toMatch(/^https?:\/\/.+/);
      expect(GITHUB_API_URL).toMatch(/^https:\/\/api\.github\.com$/);
      expect(OPENROUTER_API_URL).toMatch(/^https:\/\/openrouter\.ai\/api\/v1$/);
    });

    it('should have consistent repository formats', () => {
      expect(GITHUB_REPO_OWNER).toMatch(/^[a-zA-Z0-9-_]+$/);
      expect(GITHUB_REPO_NAME).toMatch(/^[a-zA-Z0-9-_]+$/);
    });
  });

  describe('Constant Usage', () => {
    it('should be usable in React components', () => {
      const TestComponent: React.FC = () => (
        <div>
          <div data-testid="task-statuses">{TASK_STATUSES.join(', ')}</div>
          <div data-testid="task-priorities">{TASK_PRIORITIES.join(', ')}</div>
          <div data-testid="task-categories">{TASK_CATEGORIES.join(', ')}</div>
          <div data-testid="notification-types">{NOTIFICATION_TYPES.join(', ')}</div>
          <div data-testid="notification-sources">{NOTIFICATION_SOURCES.join(', ')}</div>
          <div data-testid="project-statuses">{PROJECT_STATUSES.join(', ')}</div>
          <div data-testid="user-roles">{USER_ROLES.join(', ')}</div>
          <div data-testid="themes">{THEMES.join(', ')}</div>
          <div data-testid="languages">{LANGUAGES.join(', ')}</div>
        </div>
      );

      render(<TestComponent />);

      expect(screen.getByTestId('task-statuses')).toHaveTextContent('todo, in-progress, done');
      expect(screen.getByTestId('task-priorities')).toHaveTextContent('low, medium, high, critical');
      expect(screen.getByTestId('task-categories')).toHaveTextContent('bug, feature, enhancement, documentation');
      expect(screen.getByTestId('notification-types')).toHaveTextContent('info, warning, error, success');
      expect(screen.getByTestId('notification-sources')).toHaveTextContent('system, user, github, ai');
      expect(screen.getByTestId('project-statuses')).toHaveTextContent('Active, Completed, On Hold');
      expect(screen.getByTestId('user-roles')).toHaveTextContent('Developer, Project Manager, Admin');
      expect(screen.getByTestId('themes')).toHaveTextContent('light, dark');
      expect(screen.getByTestId('languages')).toHaveTextContent('en, ru');
    });

    it('should be usable in form controls', () => {
      const TestComponent: React.FC = () => (
        <div>
          <select data-testid="status-select">
            {TASK_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select data-testid="priority-select">
            {TASK_PRIORITIES.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          <select data-testid="category-select">
            {TASK_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      );

      render(<TestComponent />);

      expect(screen.getByTestId('status-select')).toBeInTheDocument();
      expect(screen.getByTestId('priority-select')).toBeInTheDocument();
      expect(screen.getByTestId('category-select')).toBeInTheDocument();
    });
  });
});
