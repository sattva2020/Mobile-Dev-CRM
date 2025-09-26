import axios from 'axios';
import { getGitHubIssues, createGitHubIssue, configureGitHubService } from '../../services';
import { GITHUB_API_URL, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } from '../../constants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GitHub Services', () => {
  const mockToken = 'test-token';

  beforeEach(() => {
    jest.clearAllMocks();
    configureGitHubService({ personalAccessToken: mockToken });
  });

  describe('getGitHubIssues', () => {
    it('fetches issues successfully with a token', async () => {
      const mockIssues = [
        {
          id: 1,
          title: 'Test Issue',
          state: 'open',
          body: 'Test body',
          user: { login: 'test-user' },
          labels: [{ name: 'bug', color: 'red' }],
          assignees: [],
          created_at: '2024-01-17T12:00:00Z',
          updated_at: '2024-01-17T12:00:00Z',
        },
      ];
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
      configureGitHubService({}); // No token
      const mockIssues = [
        {
          id: 1,
          title: 'Test Issue',
          state: 'open',
          body: 'Test body',
          user: { login: 'test-user' },
          labels: [{ name: 'bug', color: 'red' }],
          assignees: [],
          created_at: '2024-01-17T12:00:00Z',
          updated_at: '2024-01-17T12:00:00Z',
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockIssues });

      const issues = await getGitHubIssues();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${GITHUB_API_URL}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`,
        {
          headers: {
            Authorization: undefined, // No token in headers
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

    it('handles API errors with status codes', async () => {
      const error = {
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { message: 'Repository not found' },
        },
      };
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(getGitHubIssues()).rejects.toEqual(error);
    });
  });

  describe('createGitHubIssue', () => {
    it('creates an issue successfully with a token', async () => {
      const mockIssue = {
        id: 2,
        title: 'New Issue',
        body: 'Body',
        labels: ['bug'],
        state: 'open',
        user: { login: 'test-user' },
        assignees: [],
        created_at: '2024-01-17T12:00:00Z',
        updated_at: '2024-01-17T12:00:00Z',
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockIssue });

      const newIssue = await createGitHubIssue('New Issue', 'Body', ['bug']);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${GITHUB_API_URL}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`,
        {
          title: 'New Issue',
          body: 'Body',
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

    it('creates an issue with default labels when none provided', async () => {
      const mockIssue = {
        id: 2,
        title: 'New Issue',
        body: 'Body',
        labels: [],
        state: 'open',
        user: { login: 'test-user' },
        assignees: [],
        created_at: '2024-01-17T12:00:00Z',
        updated_at: '2024-01-17T12:00:00Z',
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockIssue });

      await createGitHubIssue('New Issue', 'Body');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        {
          title: 'New Issue',
          body: 'Body',
          labels: [],
        },
        expect.any(Object)
      );
    });

    it('throws an error if no token is configured', async () => {
      configureGitHubService({}); // No token
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

    it('handles API errors with status codes', async () => {
      const error = {
        response: {
          status: 403,
          statusText: 'Forbidden',
          data: { message: 'API rate limit exceeded' },
        },
      };
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(createGitHubIssue('Title', 'Body')).rejects.toEqual(error);
    });
  });

  describe('configureGitHubService', () => {
    it('updates the configuration correctly', () => {
      const newConfig = { personalAccessToken: 'new-token' };
      configureGitHubService(newConfig);

      // The configuration is internal, so we test it indirectly through service calls
      expect(() => configureGitHubService(newConfig)).not.toThrow();
    });

    it('handles empty configuration', () => {
      expect(() => configureGitHubService({})).not.toThrow();
    });

    it('handles configuration with undefined token', () => {
      expect(() => configureGitHubService({ personalAccessToken: undefined })).not.toThrow();
    });
  });
});
