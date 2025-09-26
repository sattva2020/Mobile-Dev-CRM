import { Octokit } from '@octokit/rest';
import { Notification } from '../context/AppContext';
import { GitHubIssue, GitHubLabel, GitHubUser } from '../types';

export class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(token: string, owner: string, repo: string) {
    this.octokit = new Octokit({
      auth: token,
      userAgent: 'Mobile-Dev-CRM/1.0.0',
    });
    this.owner = owner;
    this.repo = repo;
  }

  // Проверка подключения к GitHub
  async testConnection(): Promise<boolean> {
    try {
      await this.octokit.rest.repos.get({
        owner: this.owner,
        repo: this.repo,
      });
      return true;
    } catch (error) {
      console.error('GitHub connection test failed:', error);
      return false;
    }
  }

  async getIssues(): Promise<GitHubIssue[]> {
    try {
      const { data } = await this.octokit.rest.issues.listForRepo({
        owner: this.owner,
        repo: this.repo,
        state: 'all',
        per_page: 100,
      });

      return data.map(issue => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body || '',
        state: issue.state as 'open' | 'closed',
        labels: issue.labels.map(label => ({
          id: typeof label === 'object' ? label.id : 0,
          name: typeof label === 'object' ? label.name : label,
          color: typeof label === 'object' ? label.color || '#000000' : '#000000',
          description: typeof label === 'object' ? label.description : undefined,
        })),
        assignees: (issue.assignees || []).map(assignee => ({
          id: assignee.id,
          login: assignee.login,
          avatar_url: assignee.avatar_url,
          html_url: assignee.html_url,
        })),
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        closed_at: issue.closed_at,
        html_url: issue.html_url,
        user: {
          id: issue.user?.id || 0,
          login: issue.user?.login || '',
          avatar_url: issue.user?.avatar_url || '',
          html_url: issue.user?.html_url || '',
        },
      }));
    } catch (error) {
      console.error('Error fetching GitHub issues:', error);
      throw error;
    }
  }

  async getIssue(number: number): Promise<GitHubIssue> {
    try {
      const { data } = await this.octokit.rest.issues.get({
        owner: this.owner,
        repo: this.repo,
        issue_number: number,
      });

      return {
        id: data.id,
        number: data.number,
        title: data.title,
        body: data.body || '',
        state: data.state as 'open' | 'closed',
        labels: data.labels.map(label => ({
          id: typeof label === 'object' ? label.id : 0,
          name: typeof label === 'object' ? label.name : label,
          color: typeof label === 'object' ? label.color || '#000000' : '#000000',
          description: typeof label === 'object' ? label.description : undefined,
        })),
        assignees: (data.assignees || []).map(assignee => ({
          id: assignee.id,
          login: assignee.login,
          avatar_url: assignee.avatar_url,
          html_url: assignee.html_url,
        })),
        created_at: data.created_at,
        updated_at: data.updated_at,
        closed_at: data.closed_at,
        html_url: data.html_url,
        user: {
          id: data.user?.id || 0,
          login: data.user?.login || '',
          avatar_url: data.user?.avatar_url || '',
          html_url: data.user?.html_url || '',
        },
      };
    } catch (error) {
      console.error('Error fetching GitHub issue:', error);
      throw error;
    }
  }

  async updateIssueStatus(number: number, state: 'open' | 'closed'): Promise<void> {
    try {
      await this.octokit.rest.issues.update({
        owner: this.owner,
        repo: this.repo,
        issue_number: number,
        state,
      });
    } catch (error) {
      console.error('Error updating GitHub issue status:', error);
      throw error;
    }
  }

  async addLabelToIssue(number: number, labels: string[]): Promise<void> {
    try {
      await this.octokit.rest.issues.addLabels({
        owner: this.owner,
        repo: this.repo,
        issue_number: number,
        labels,
      });
    } catch (error) {
      console.error('Error adding labels to GitHub issue:', error);
      throw error;
    }
  }

  async assignIssue(number: number, assignees: string[]): Promise<void> {
    try {
      await this.octokit.rest.issues.addAssignees({
        owner: this.owner,
        repo: this.repo,
        issue_number: number,
        assignees,
      });
    } catch (error) {
      console.error('Error assigning GitHub issue:', error);
      throw error;
    }
  }

  async getLabels(): Promise<GitHubLabel[]> {
    try {
      const { data } = await this.octokit.rest.issues.listLabelsForRepo({
        owner: this.owner,
        repo: this.repo,
      });

      return data.map(label => ({
        id: label.id,
        name: label.name,
        color: label.color,
        description: label.description,
      }));
    } catch (error) {
      console.error('Error fetching GitHub labels:', error);
      throw error;
    }
  }

  async getRepositoryInfo() {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner: this.owner,
        repo: this.repo,
      });

      return {
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        language: data.language,
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        htmlUrl: data.html_url,
      };
    } catch (error) {
      console.error('Error fetching repository info:', error);
      throw error;
    }
  }

  // Создание нового Issue
  async createIssue(title: string, body: string, labels: string[] = [], assignees: string[] = []): Promise<GitHubIssue> {
    try {
      const { data } = await this.octokit.rest.issues.create({
        owner: this.owner,
        repo: this.repo,
        title,
        body,
        labels,
        assignees,
      });

      return {
        id: data.id,
        number: data.number,
        title: data.title,
        body: data.body || '',
        state: data.state as 'open' | 'closed',
        labels: data.labels.map(label => ({
          id: typeof label === 'object' ? label.id : 0,
          name: typeof label === 'object' ? label.name : label,
          color: typeof label === 'object' ? label.color || '#000000' : '#000000',
          description: typeof label === 'object' ? label.description : undefined,
        })),
        assignees: (data.assignees || []).map(assignee => ({
          id: assignee.id,
          login: assignee.login,
          avatar_url: assignee.avatar_url,
          html_url: assignee.html_url,
        })),
        created_at: data.created_at,
        updated_at: data.updated_at,
        closed_at: data.closed_at,
        html_url: data.html_url,
        user: {
          id: data.user?.id || 0,
          login: data.user?.login || '',
          avatar_url: data.user?.avatar_url || '',
          html_url: data.user?.html_url || '',
        },
      };
    } catch (error) {
      console.error('Error creating GitHub issue:', error);
      throw error;
    }
  }

  // Обновление Issue
  async updateIssue(number: number, updates: {
    title?: string;
    body?: string;
    state?: 'open' | 'closed';
    labels?: string[];
    assignees?: string[];
  }): Promise<GitHubIssue> {
    try {
      const { data } = await this.octokit.rest.issues.update({
        owner: this.owner,
        repo: this.repo,
        issue_number: number,
        ...updates,
      });

      return {
        id: data.id,
        number: data.number,
        title: data.title,
        body: data.body || '',
        state: data.state as 'open' | 'closed',
        labels: data.labels.map(label => ({
          id: typeof label === 'object' ? label.id : 0,
          name: typeof label === 'object' ? label.name : label,
          color: typeof label === 'object' ? label.color || '#000000' : '#000000',
          description: typeof label === 'object' ? label.description : undefined,
        })),
        assignees: (data.assignees || []).map(assignee => ({
          id: assignee.id,
          login: assignee.login,
          avatar_url: assignee.avatar_url,
          html_url: assignee.html_url,
        })),
        created_at: data.created_at,
        updated_at: data.updated_at,
        closed_at: data.closed_at,
        html_url: data.html_url,
        user: {
          id: data.user?.id || 0,
          login: data.user?.login || '',
          avatar_url: data.user?.avatar_url || '',
          html_url: data.user?.html_url || '',
        },
      };
    } catch (error) {
      console.error('Error updating GitHub issue:', error);
      throw error;
    }
  }

  // Получение статистики репозитория
  async getRepositoryStats() {
    try {
      const [issues, pulls, commits] = await Promise.all([
        this.octokit.rest.issues.listForRepo({
          owner: this.owner,
          repo: this.repo,
          state: 'all',
          per_page: 100,
        }),
        this.octokit.rest.pulls.list({
          owner: this.owner,
          repo: this.repo,
          state: 'all',
          per_page: 100,
        }),
        this.octokit.rest.repos.listCommits({
          owner: this.owner,
          repo: this.repo,
          per_page: 100,
        }),
      ]);

      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      return {
        totalIssues: issues.data.length,
        openIssues: issues.data.filter(issue => issue.state === 'open').length,
        closedIssues: issues.data.filter(issue => issue.state === 'closed').length,
        totalPulls: pulls.data.length,
        openPulls: pulls.data.filter(pull => pull.state === 'open').length,
        mergedPulls: pulls.data.filter(pull => pull.merged_at).length,
        totalCommits: commits.data.length,
        commitsLastWeek: commits.data.filter(commit => 
          commit.commit.committer?.date && new Date(commit.commit.committer.date) > lastWeek
        ).length,
        commitsLastMonth: commits.data.filter(commit => 
          commit.commit.committer?.date && new Date(commit.commit.committer.date) > lastMonth
        ).length,
        recentActivity: {
          lastIssue: issues.data[0]?.created_at,
          lastPull: pulls.data[0]?.created_at,
          lastCommit: commits.data[0]?.commit.committer?.date,
        },
      };
    } catch (error) {
      console.error('Error fetching repository stats:', error);
      throw error;
    }
  }

  // Синхронизация задач с GitHub Issues
  async syncTasksWithIssues(tasks: any[]): Promise<{ synced: number; errors: string[] }> {
    const results = { synced: 0, errors: [] as string[] };

    for (const task of tasks) {
      try {
        if (task.githubIssueId) {
          // Обновляем существующий Issue
          await this.updateIssue(task.githubIssueId, {
            title: task.title,
            body: task.description,
            state: task.status === 'done' ? 'closed' : 'open',
            labels: task.labels,
            assignees: task.assignee ? [task.assignee] : [],
          });
        } else {
          // Создаем новый Issue
          const issue = await this.createIssue(
            task.title,
            task.description,
            task.labels,
            task.assignee ? [task.assignee] : []
          );
          // Обновляем задачу с ID Issue
          task.githubIssueId = issue.number;
          task.githubUrl = issue.html_url;
        }
        results.synced++;
      } catch (error) {
        results.errors.push(`Ошибка синхронизации задачи "${task.title}": ${error}`);
      }
    }

    return results;
  }

  // Получение информации о rate limit
  async getRateLimit() {
    try {
      const { data } = await this.octokit.rest.rateLimit.get();
      return {
        limit: data.rate.limit,
        remaining: data.rate.remaining,
        reset: new Date(data.rate.reset * 1000),
        used: data.rate.limit - data.rate.remaining,
      };
    } catch (error) {
      console.error('Error fetching rate limit:', error);
      throw error;
    }
  }
}
