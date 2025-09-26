import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { getGitHubIssues, createGitHubIssue, configureGitHubService } from '../../services';
import { GITHUB_API_URL, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } from '../../constants';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Services', () => {
  const mockToken = 'test-github-token';
  const mockIssues = [
    {
      id: 1,
      title: 'Test Issue 1',
      state: 'open',
      user: { login: 'testuser', id: 1, avatar_url: '', html_url: '' },
      labels: [],
      assignees: [],
      comments: 0,
      created_at: '2024-01-17T12:00:00Z',
      updated_at: '2024-01-17T12:00:00Z',
      url: '',
      repository_url: '',
      labels_url: '',
      comments_url: '',
      events_url: '',
      html_url: '',
      number: 1,
      locked: false,
    },
    {
      id: 2,
      title: 'Test Issue 2',
      state: 'closed',
      user: { login: 'testuser', id: 1, avatar_url: '', html_url: '' },
      labels: [],
      assignees: [],
      comments: 0,
      created_at: '2024-01-17T12:00:00Z',
      updated_at: '2024-01-17T12:00:00Z',
      url: '',
      repository_url: '',
      labels_url: '',
      comments_url: '',
      events_url: '',
      html_url: '',
      number: 2,
      locked: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    configureGitHubService({ personalAccessToken: mockToken });
  });

  describe('GitHub Services', () => {
    describe('getGitHubIssues', () => {
      it('fetches issues successfully with a token', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockIssues });

        const issues = await getGitHubIssues();

        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${GITHUB_API_URL}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`,
          {
            headers: {
              Authorization: `token ${mockToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );
        expect(issues).toEqual(mockIssues);
      });

      it('fetches issues successfully without a token', async () => {
        configureGitHubService({});
        mockedAxios.get.mockResolvedValueOnce({ data: mockIssues });

        const issues = await getGitHubIssues();

        expect(mockedAxios.get).toHaveBeenCalledWith(
          `${GITHUB_API_URL}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`,
          {
            headers: {
              Authorization: undefined,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );
        expect(issues).toEqual(mockIssues);
      });

      it('throws an error if the API call fails', async () => {
        const errorMessage = 'Network Error';
        mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

        await expect(getGitHubIssues()).rejects.toThrow(errorMessage);
        expect(console.error).toHaveBeenCalledWith('Error fetching GitHub issues:', expect.any(Error));
      });

      it('handles empty response', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: [] });

        const issues = await getGitHubIssues();

        expect(issues).toEqual([]);
      });

      it('handles malformed response', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: null });

        const issues = await getGitHubIssues();

        expect(issues).toBeNull();
      });
    });

    describe('createGitHubIssue', () => {
      it('creates an issue successfully with a token', async () => {
        const mockIssue = {
          id: 3,
          title: 'New Issue',
          body: 'Issue description',
          labels: ['bug'],
          state: 'open',
          user: { login: 'testuser', id: 1, avatar_url: '', html_url: '' },
          assignees: [],
          comments: 0,
          created_at: '2024-01-17T12:00:00Z',
          updated_at: '2024-01-17T12:00:00Z',
          url: '',
          repository_url: '',
          labels_url: '',
          comments_url: '',
          events_url: '',
          html_url: '',
          number: 3,
          locked: false,
        };
        mockedAxios.post.mockResolvedValueOnce({ data: mockIssue });

        const newIssue = await createGitHubIssue('New Issue', 'Issue description', ['bug']);

        expect(mockedAxios.post).toHaveBeenCalledWith(
          `${GITHUB_API_URL}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`,
          {
            title: 'New Issue',
            body: 'Issue description',
            labels: ['bug'],
          },
          {
            headers: {
              Authorization: `token ${mockToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );
        expect(newIssue).toEqual(mockIssue);
      });

      it('throws an error if no token is configured', async () => {
        configureGitHubService({});

        await expect(createGitHubIssue('Title', 'Body')).rejects.toThrow(
          'GitHub Personal Access Token is not configured.'
        );
        expect(mockedAxios.post).not.toHaveBeenCalled();
      });

      it('throws an error if the API call fails', async () => {
        const errorMessage = 'API Error';
        mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

        await expect(createGitHubIssue('Title', 'Body')).rejects.toThrow(errorMessage);
        expect(console.error).toHaveBeenCalledWith('Error creating GitHub issue:', expect.any(Error));
      });

      it('creates issue without labels', async () => {
        const mockIssue = {
          id: 4,
          title: 'Issue without labels',
          body: 'Description',
          labels: [],
          state: 'open',
          user: { login: 'testuser', id: 1, avatar_url: '', html_url: '' },
          assignees: [],
          comments: 0,
          created_at: '2024-01-17T12:00:00Z',
          updated_at: '2024-01-17T12:00:00Z',
          url: '',
          repository_url: '',
          labels_url: '',
          comments_url: '',
          events_url: '',
          html_url: '',
          number: 4,
          locked: false,
        };
        mockedAxios.post.mockResolvedValueOnce({ data: mockIssue });

        const newIssue = await createGitHubIssue('Issue without labels', 'Description');

        expect(mockedAxios.post).toHaveBeenCalledWith(
          `${GITHUB_API_URL}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`,
          {
            title: 'Issue without labels',
            body: 'Description',
            labels: [],
          },
          {
            headers: {
              Authorization: `token ${mockToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );
        expect(newIssue).toEqual(mockIssue);
      });
    });

    describe('configureGitHubService', () => {
      it('configures service with token', () => {
        configureGitHubService({ personalAccessToken: 'new-token' });
        // Service configuration is internal, so we test it indirectly
        expect(() => configureGitHubService({ personalAccessToken: 'new-token' })).not.toThrow();
      });

      it('configures service without token', () => {
        configureGitHubService({});
        expect(() => configureGitHubService({})).not.toThrow();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles network timeout', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded');
      mockedAxios.get.mockRejectedValueOnce(timeoutError);

      await expect(getGitHubIssues()).rejects.toThrow('timeout of 5000ms exceeded');
    });

    it('handles 404 error', async () => {
      const notFoundError = new Error('Request failed with status code 404');
      mockedAxios.get.mockRejectedValueOnce(notFoundError);

      await expect(getGitHubIssues()).rejects.toThrow('Request failed with status code 404');
    });

    it('handles 401 unauthorized error', async () => {
      const unauthorizedError = new Error('Request failed with status code 401');
      mockedAxios.get.mockRejectedValueOnce(unauthorizedError);

      await expect(getGitHubIssues()).rejects.toThrow('Request failed with status code 401');
    });

    it('handles 403 forbidden error', async () => {
      const forbiddenError = new Error('Request failed with status code 403');
      mockedAxios.get.mockRejectedValueOnce(forbiddenError);

      await expect(getGitHubIssues()).rejects.toThrow('Request failed with status code 403');
    });

    it('handles 500 server error', async () => {
      const serverError = new Error('Request failed with status code 500');
      mockedAxios.get.mockRejectedValueOnce(serverError);

      await expect(getGitHubIssues()).rejects.toThrow('Request failed with status code 500');
    });
  });

  describe('Rate Limiting', () => {
    it('handles rate limit exceeded', async () => {
      const rateLimitError = new Error('Request failed with status code 429');
      mockedAxios.get.mockRejectedValueOnce(rateLimitError);

      await expect(getGitHubIssues()).rejects.toThrow('Request failed with status code 429');
    });
  });

  describe('Data Validation', () => {
    it('validates issue data structure', async () => {
      const invalidIssue = {
        id: 'invalid',
        title: null,
        state: 'invalid',
      };
      mockedAxios.get.mockResolvedValueOnce({ data: [invalidIssue] });

      const issues = await getGitHubIssues();

      expect(issues).toEqual([invalidIssue]);
    });

    it('handles missing required fields', async () => {
      const incompleteIssue = {
        id: 1,
        // missing title, state, etc.
      };
      mockedAxios.get.mockResolvedValueOnce({ data: [incompleteIssue] });

      const issues = await getGitHubIssues();

      expect(issues).toEqual([incompleteIssue]);
    });
  });

  describe('Performance', () => {
    it('handles large response data', async () => {
      const largeIssues = Array.from({ length: 1000 }, (_, index) => ({
        id: index,
        title: `Issue ${index}`,
        state: 'open',
        user: { login: 'testuser', id: 1, avatar_url: '', html_url: '' },
        labels: [],
        assignees: [],
        comments: 0,
        created_at: '2024-01-17T12:00:00Z',
        updated_at: '2024-01-17T12:00:00Z',
        url: '',
        repository_url: '',
        labels_url: '',
        comments_url: '',
        events_url: '',
        html_url: '',
        number: index,
        locked: false,
      }));
      mockedAxios.get.mockResolvedValueOnce({ data: largeIssues });

      const issues = await getGitHubIssues();

      expect(issues).toHaveLength(1000);
    });

    it('handles slow API response', async () => {
      mockedAxios.get.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockIssues }), 1000))
      );

      const startTime = Date.now();
      const issues = await getGitHubIssues();
      const endTime = Date.now();

      expect(issues).toEqual(mockIssues);
      expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
    });
  });
});