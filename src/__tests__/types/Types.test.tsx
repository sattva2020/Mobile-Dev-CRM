import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { Task, Project, User, GitHubIssue, TaskStatus, TaskPriority, TaskCategory, NotificationType, NotificationSource, ProjectStatus, UserRole, Theme, Language } from '../../types';

describe('Types Tests', () => {
  describe('Task Type', () => {
    it('should create a valid task object', () => {
      const task: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'high',
        category: 'bug',
        labels: ['urgent'],
        createdAt: '2024-01-17T12:00:00Z',
        updatedAt: '2024-01-17T12:00:00Z',
      };

      expect(task.id).toBe('1');
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.status).toBe('todo');
      expect(task.priority).toBe('high');
      expect(task.category).toBe('bug');
      expect(task.labels).toEqual(['urgent']);
      expect(task.createdAt).toBe('2024-01-17T12:00:00Z');
      expect(task.updatedAt).toBe('2024-01-17T12:00:00Z');
    });

    it('should handle optional fields', () => {
      const task: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'high',
        category: 'bug',
        labels: [],
        createdAt: '2024-01-17T12:00:00Z',
        updatedAt: '2024-01-17T12:00:00Z',
      };

      expect(task.labels).toEqual([]);
    });
  });

  describe('Project Type', () => {
    it('should create a valid project object', () => {
      const project: Project = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        startDate: '2024-01-17T12:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        status: 'Active',
        repositoryUrl: 'https://github.com/test/project',
      };

      expect(project.id).toBe('1');
      expect(project.name).toBe('Test Project');
      expect(project.description).toBe('Test Description');
      expect(project.startDate).toBe('2024-01-17T12:00:00Z');
      expect(project.endDate).toBe('2024-12-31T23:59:59Z');
      expect(project.status).toBe('Active');
      expect(project.repositoryUrl).toBe('https://github.com/test/project');
    });

    it('should handle optional fields', () => {
      const project: Project = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        startDate: '2024-01-17T12:00:00Z',
        status: 'Active',
      };

      expect(project.endDate).toBeUndefined();
      expect(project.repositoryUrl).toBeUndefined();
    });
  });

  describe('User Type', () => {
    it('should create a valid user object', () => {
      const user: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'Developer',
        avatarUrl: 'https://example.com/avatar.jpg',
      };

      expect(user.id).toBe('1');
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('Developer');
      expect(user.avatarUrl).toBe('https://example.com/avatar.jpg');
    });

    it('should handle optional fields', () => {
      const user: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'Developer',
      };

      expect(user.avatarUrl).toBeUndefined();
    });
  });

  describe('GitHubIssue Type', () => {
    it('should create a valid GitHub issue object', () => {
      const issue: GitHubIssue = {
        id: 1,
        node_id: 'node-1',
        url: 'https://api.github.com/repos/test/repo/issues/1',
        repository_url: 'https://api.github.com/repos/test/repo',
        labels_url: 'https://api.github.com/repos/test/repo/issues/1/labels',
        comments_url: 'https://api.github.com/repos/test/repo/issues/1/comments',
        events_url: 'https://api.github.com/repos/test/repo/issues/1/events',
        html_url: 'https://github.com/test/repo/issues/1',
        number: 1,
        state: 'open',
        title: 'Test Issue',
        body: 'Test Body',
        user: {
          login: 'testuser',
          id: 1,
          avatar_url: 'https://example.com/avatar.jpg',
          html_url: 'https://github.com/testuser',
        },
        labels: [],
        assignees: [],
        comments: 0,
        created_at: '2024-01-17T12:00:00Z',
        updated_at: '2024-01-17T12:00:00Z',
        locked: false,
      };

      expect(issue.id).toBe(1);
      expect(issue.node_id).toBe('node-1');
      expect(issue.url).toBe('https://api.github.com/repos/test/repo/issues/1');
      expect(issue.repository_url).toBe('https://api.github.com/repos/test/repo');
      expect(issue.labels_url).toBe('https://api.github.com/repos/test/repo/issues/1/labels');
      expect(issue.comments_url).toBe('https://api.github.com/repos/test/repo/issues/1/comments');
      expect(issue.events_url).toBe('https://api.github.com/repos/test/repo/issues/1/events');
      expect(issue.html_url).toBe('https://github.com/test/repo/issues/1');
      expect(issue.number).toBe(1);
      expect(issue.state).toBe('open');
      expect(issue.title).toBe('Test Issue');
      expect(issue.body).toBe('Test Body');
      expect(issue.user.login).toBe('testuser');
      expect(issue.user.id).toBe(1);
      expect(issue.user.avatar_url).toBe('https://example.com/avatar.jpg');
      expect(issue.user.html_url).toBe('https://github.com/testuser');
      expect(issue.labels).toEqual([]);
      expect(issue.assignees).toEqual([]);
      expect(issue.comments).toBe(0);
      expect(issue.created_at).toBe('2024-01-17T12:00:00Z');
      expect(issue.updated_at).toBe('2024-01-17T12:00:00Z');
      expect(issue.locked).toBe(false);
    });

    it('should handle optional fields', () => {
      const issue: GitHubIssue = {
        id: 1,
        node_id: 'node-1',
        url: 'https://api.github.com/repos/test/repo/issues/1',
        repository_url: 'https://api.github.com/repos/test/repo',
        labels_url: 'https://api.github.com/repos/test/repo/issues/1/labels',
        comments_url: 'https://api.github.com/repos/test/repo/issues/1/comments',
        events_url: 'https://api.github.com/repos/test/repo/issues/1/events',
        html_url: 'https://github.com/test/repo/issues/1',
        number: 1,
        state: 'open',
        title: 'Test Issue',
        user: {
          login: 'testuser',
          id: 1,
          avatar_url: 'https://example.com/avatar.jpg',
          html_url: 'https://github.com/testuser',
        },
        labels: [],
        assignees: [],
        comments: 0,
        created_at: '2024-01-17T12:00:00Z',
        updated_at: '2024-01-17T12:00:00Z',
        locked: false,
      };

      expect(issue.body).toBeUndefined();
      expect(issue.assignee).toBeUndefined();
      expect(issue.milestone).toBeUndefined();
      expect(issue.active_lock_reason).toBeUndefined();
      expect(issue.pull_request).toBeUndefined();
      expect(issue.closed_at).toBeUndefined();
      expect(issue.closed_by).toBeUndefined();
    });
  });

  describe('TaskStatus Type', () => {
    it('should accept valid task status values', () => {
      const statuses: TaskStatus[] = ['todo', 'in-progress', 'done'];
      
      statuses.forEach(status => {
        expect(status).toMatch(/^(todo|in-progress|done)$/);
      });
    });
  });

  describe('TaskPriority Type', () => {
    it('should accept valid task priority values', () => {
      const priorities: TaskPriority[] = ['low', 'medium', 'high', 'critical'];
      
      priorities.forEach(priority => {
        expect(priority).toMatch(/^(low|medium|high|critical)$/);
      });
    });
  });

  describe('TaskCategory Type', () => {
    it('should accept valid task category values', () => {
      const categories: TaskCategory[] = ['bug', 'feature', 'enhancement', 'documentation'];
      
      categories.forEach(category => {
        expect(category).toMatch(/^(bug|feature|enhancement|documentation)$/);
      });
    });
  });

  describe('NotificationType Type', () => {
    it('should accept valid notification type values', () => {
      const types: NotificationType[] = ['info', 'warning', 'error', 'success'];
      
      types.forEach(type => {
        expect(type).toMatch(/^(info|warning|error|success)$/);
      });
    });
  });

  describe('NotificationSource Type', () => {
    it('should accept valid notification source values', () => {
      const sources: NotificationSource[] = ['system', 'user', 'github', 'ai'];
      
      sources.forEach(source => {
        expect(source).toMatch(/^(system|user|github|ai)$/);
      });
    });
  });

  describe('ProjectStatus Type', () => {
    it('should accept valid project status values', () => {
      const statuses: ProjectStatus[] = ['Active', 'Completed', 'On Hold'];
      
      statuses.forEach(status => {
        expect(status).toMatch(/^(Active|Completed|On Hold)$/);
      });
    });
  });

  describe('UserRole Type', () => {
    it('should accept valid user role values', () => {
      const roles: UserRole[] = ['Developer', 'Project Manager', 'Admin'];
      
      roles.forEach(role => {
        expect(role).toMatch(/^(Developer|Project Manager|Admin)$/);
      });
    });
  });

  describe('Theme Type', () => {
    it('should accept valid theme values', () => {
      const themes: Theme[] = ['light', 'dark'];
      
      themes.forEach(theme => {
        expect(theme).toMatch(/^(light|dark)$/);
      });
    });
  });

  describe('Language Type', () => {
    it('should accept valid language values', () => {
      const languages: Language[] = ['en', 'ru'];
      
      languages.forEach(language => {
        expect(language).toMatch(/^(en|ru)$/);
      });
    });
  });

  describe('Type Validation', () => {
    it('should validate task status', () => {
      const validStatuses: TaskStatus[] = ['todo', 'in-progress', 'done'];
      const invalidStatuses = ['invalid', 'pending', 'completed'];
      
      validStatuses.forEach(status => {
        expect(status).toMatch(/^(todo|in-progress|done)$/);
      });
      
      invalidStatuses.forEach(status => {
        expect(status).not.toMatch(/^(todo|in-progress|done)$/);
      });
    });

    it('should validate task priority', () => {
      const validPriorities: TaskPriority[] = ['low', 'medium', 'high', 'critical'];
      const invalidPriorities = ['invalid', 'urgent', 'normal'];
      
      validPriorities.forEach(priority => {
        expect(priority).toMatch(/^(low|medium|high|critical)$/);
      });
      
      invalidPriorities.forEach(priority => {
        expect(priority).not.toMatch(/^(low|medium|high|critical)$/);
      });
    });

    it('should validate task category', () => {
      const validCategories: TaskCategory[] = ['bug', 'feature', 'enhancement', 'documentation'];
      const invalidCategories = ['invalid', 'task', 'issue'];
      
      validCategories.forEach(category => {
        expect(category).toMatch(/^(bug|feature|enhancement|documentation)$/);
      });
      
      invalidCategories.forEach(category => {
        expect(category).not.toMatch(/^(bug|feature|enhancement|documentation)$/);
      });
    });
  });

  describe('Type Compatibility', () => {
    it('should be compatible with React components', () => {
      const TaskComponent: React.FC<{ task: Task }> = ({ task }) => (
        <div data-testid="task">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <span>{task.status}</span>
          <span>{task.priority}</span>
          <span>{task.category}</span>
        </div>
      );

      const task: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'high',
        category: 'bug',
        labels: ['urgent'],
        createdAt: '2024-01-17T12:00:00Z',
        updatedAt: '2024-01-17T12:00:00Z',
      };

      render(<TaskComponent task={task} />);

      expect(screen.getByTestId('task')).toBeInTheDocument();
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('todo')).toBeInTheDocument();
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.getByText('bug')).toBeInTheDocument();
    });

    it('should be compatible with project components', () => {
      const ProjectComponent: React.FC<{ project: Project }> = ({ project }) => (
        <div data-testid="project">
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <span>{project.status}</span>
        </div>
      );

      const project: Project = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        startDate: '2024-01-17T12:00:00Z',
        status: 'Active',
      };

      render(<ProjectComponent project={project} />);

      expect(screen.getByTestId('project')).toBeInTheDocument();
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should be compatible with user components', () => {
      const UserComponent: React.FC<{ user: User }> = ({ user }) => (
        <div data-testid="user">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span>{user.role}</span>
        </div>
      );

      const user: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'Developer',
      };

      render(<UserComponent user={user} />);

      expect(screen.getByTestId('user')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
    });
  });
});
