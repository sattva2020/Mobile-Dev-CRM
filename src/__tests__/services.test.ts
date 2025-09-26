import { GitHubService, AIService, DataService, ValidationService } from '../services';

// Mock fetch
global.fetch = jest.fn();

describe('GitHubService', () => {
  let githubService: GitHubService;

  beforeEach(() => {
    githubService = new GitHubService('test-token', 'test-owner', 'test-repo');
    (fetch as jest.Mock).mockClear();
  });

  it('creates instance with correct configuration', () => {
    expect(githubService).toBeInstanceOf(GitHubService);
  });

  it('gets issues successfully', async () => {
    const mockIssues = [{ id: 1, title: 'Test Issue' }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockIssues,
    });

    const issues = await githubService.getIssues();
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/test-owner/test-repo/issues',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'token test-token',
        }),
      })
    );
    expect(issues).toEqual(mockIssues);
  });

  it('creates issue successfully', async () => {
    const mockIssue = { id: 1, title: 'New Issue' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockIssue,
    });

    const issue = await githubService.createIssue('New Issue', 'Description', ['bug']);
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/test-owner/test-repo/issues',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          title: 'New Issue',
          body: 'Description',
          labels: ['bug'],
        }),
      })
    );
    expect(issue).toEqual(mockIssue);
  });

  it('updates issue successfully', async () => {
    const mockIssue = { id: 1, title: 'Updated Issue' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockIssue,
    });

    const issue = await githubService.updateIssue(1, { title: 'Updated Issue' });
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/test-owner/test-repo/issues/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated Issue' }),
      })
    );
    expect(issue).toEqual(mockIssue);
  });

  it('handles API errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(githubService.getIssues()).rejects.toThrow('GitHub API error: 404 Not Found');
  });

  it('tests connection successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const isConnected = await githubService.testConnection();
    expect(isConnected).toBe(true);
  });

  it('tests connection failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    const isConnected = await githubService.testConnection();
    expect(isConnected).toBe(false);
  });
});

describe('AIService', () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService('test-api-key', 'grok-4-fast');
    (fetch as jest.Mock).mockClear();
  });

  it('creates instance with correct configuration', () => {
    expect(aiService).toBeInstanceOf(AIService);
  });

  it('generates suggestions successfully', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: '1. Optimize algorithm\n2. Add caching\n3. Improve error handling'
        }
      }]
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const suggestions = await aiService.generateSuggestions({
      title: 'Test Task',
      description: 'Test Description',
      category: 'performance',
      priority: 'high',
    });
    
    expect(fetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('grok-4-fast'),
      })
    );
    expect(suggestions).toEqual(expect.arrayContaining([
      expect.stringContaining('Optimize algorithm'),
      expect.stringContaining('Add caching'),
      expect.stringContaining('Improve error handling'),
    ]));
  });

  it('analyzes code quality successfully', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: 'Score: 8/10\n1. Good structure\n2. Add comments\n3. Optimize performance'
        }
      }]
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const analysis = await aiService.analyzeCodeQuality('const x = 1;');
    
    expect(analysis.score).toBeGreaterThanOrEqual(1);
    expect(analysis.score).toBeLessThanOrEqual(10);
    expect(analysis.suggestions).toEqual(expect.arrayContaining([
      expect.stringContaining('Good structure'),
      expect.stringContaining('Add comments'),
      expect.stringContaining('Optimize performance'),
    ]));
  });

  it('generates task description successfully', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: 'Detailed task description with context and requirements.'
        }
      }]
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const description = await aiService.generateTaskDescription('Test Task', 'security');
    
    expect(description).toBe('Detailed task description with context and requirements.');
  });

  it('handles API errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    await expect(aiService.generateSuggestions({
      title: 'Test',
      description: 'Test',
      category: 'other',
      priority: 'low',
    })).rejects.toThrow('AI API error: 401 Unauthorized');
  });

  it('requires API key for operations', async () => {
    const serviceWithoutKey = new AIService();
    
    await expect(serviceWithoutKey.generateSuggestions({
      title: 'Test',
      description: 'Test',
      category: 'other',
      priority: 'low',
    })).rejects.toThrow('API key is required');
  });
});

describe('DataService', () => {
  let dataService: DataService;

  beforeEach(() => {
    dataService = new DataService();
    localStorage.clear();
  });

  it('saves and retrieves data', () => {
    const testData = { key: 'value', number: 42 };
    
    dataService.saveData('test', testData);
    const retrieved = dataService.getData('test');
    
    expect(retrieved).toEqual(testData);
  });

  it('retrieves all data when no key provided', () => {
    const testData1 = { key1: 'value1' };
    const testData2 = { key2: 'value2' };
    
    dataService.saveData('test1', testData1);
    dataService.saveData('test2', testData2);
    
    const allData = dataService.getData();
    
    expect(allData).toEqual({
      test1: testData1,
      test2: testData2,
    });
  });

  it('removes data correctly', () => {
    const testData = { key: 'value' };
    
    dataService.saveData('test', testData);
    expect(dataService.getData('test')).toEqual(testData);
    
    dataService.removeData('test');
    expect(dataService.getData('test')).toBeNull();
  });

  it('clears all data', () => {
    const testData = { key: 'value' };
    
    dataService.saveData('test', testData);
    expect(dataService.getData('test')).toEqual(testData);
    
    dataService.clearData();
    expect(dataService.getData()).toBeNull();
  });

  it('exports data as JSON', () => {
    const testData = { key: 'value' };
    
    dataService.saveData('test', testData);
    const exported = dataService.exportData();
    
    expect(JSON.parse(exported)).toEqual({ test: testData });
  });

  it('imports data from JSON', () => {
    const testData = { test: { key: 'value' } };
    const jsonData = JSON.stringify(testData);
    
    const success = dataService.importData(jsonData);
    
    expect(success).toBe(true);
    expect(dataService.getData()).toEqual(testData);
  });

  it('handles invalid JSON import', () => {
    const success = dataService.importData('invalid json');
    
    expect(success).toBe(false);
  });
});

describe('ValidationService', () => {
  let validationService: ValidationService;

  beforeEach(() => {
    validationService = new ValidationService();
  });

  describe('Task validation', () => {
    it('validates correct task', () => {
      const validTask = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        category: 'other',
        estimatedTime: 5,
        dueDate: new Date(Date.now() + 86400000).toISOString(),
      };

      const result = validationService.validateTask(validTask);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('validates task with missing title', () => {
      const invalidTask = {
        title: '',
        description: 'Test Description',
        priority: 'medium',
        category: 'other',
      };

      const result = validationService.validateTask(invalidTask);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Заголовок обязателен');
    });

    it('validates task with long title', () => {
      const invalidTask = {
        title: 'a'.repeat(101),
        description: 'Test Description',
        priority: 'medium',
        category: 'other',
      };

      const result = validationService.validateTask(invalidTask);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Заголовок не должен превышать 100 символов');
    });

    it('validates task with long description', () => {
      const invalidTask = {
        title: 'Test Task',
        description: 'a'.repeat(1001),
        priority: 'medium',
        category: 'other',
      };

      const result = validationService.validateTask(invalidTask);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Описание не должно превышать 1000 символов');
    });

    it('validates task with invalid priority', () => {
      const invalidTask = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'invalid',
        category: 'other',
      };

      const result = validationService.validateTask(invalidTask);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.priority).toBe('Некорректный приоритет');
    });

    it('validates task with invalid category', () => {
      const invalidTask = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        category: 'invalid',
      };

      const result = validationService.validateTask(invalidTask);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBe('Некорректная категория');
    });

    it('validates task with invalid estimated time', () => {
      const invalidTask = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        category: 'other',
        estimatedTime: -1,
      };

      const result = validationService.validateTask(invalidTask);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.estimatedTime).toBe('Время должно быть от 0 до 1000 часов');
    });

    it('validates task with past due date', () => {
      const invalidTask = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        category: 'other',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
      };

      const result = validationService.validateTask(invalidTask);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.dueDate).toBe('Срок выполнения не может быть в прошлом');
    });
  });

  describe('Settings validation', () => {
    it('validates correct settings', () => {
      const validSettings = {
        github: {
          token: 'ghp_xxxxxxxxxxxxxxxxxxxx',
          repository: {
            owner: 'test-owner',
            name: 'test-repo',
          },
        },
        ai: {
          apiKey: 'sk-or-xxxxxxxxxxxxxxxxxxxx',
        },
      };

      const result = validationService.validateSettings(validSettings);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('validates settings with short GitHub token', () => {
      const invalidSettings = {
        github: {
          token: 'short',
        },
      };

      const result = validationService.validateSettings(invalidSettings);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.githubToken).toBe('GitHub токен слишком короткий');
    });

    it('validates settings with invalid GitHub owner', () => {
      const invalidSettings = {
        github: {
          repository: {
            owner: 'invalid@owner',
          },
        },
      };

      const result = validationService.validateSettings(invalidSettings);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.githubOwner).toBe('Некорректное имя владельца репозитория');
    });

    it('validates settings with invalid GitHub repo name', () => {
      const invalidSettings = {
        github: {
          repository: {
            name: 'invalid@repo',
          },
        },
      };

      const result = validationService.validateSettings(invalidSettings);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.githubRepo).toBe('Некорректное имя репозитория');
    });

    it('validates settings with short AI API key', () => {
      const invalidSettings = {
        ai: {
          apiKey: 'short',
        },
      };

      const result = validationService.validateSettings(invalidSettings);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.aiApiKey).toBe('AI API ключ слишком короткий');
    });
  });
});