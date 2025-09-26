/**
 * 📊 Test Data Fixtures for CRM Tests
 * Фикстуры тестовых данных для тестов CRM системы
 */

export const testData = {
  projects: {
    valid: {
      name: 'Test Project',
      description: 'Test project description',
      priority: 'high',
      status: 'in-progress',
      estimatedHours: 40,
      actualHours: 0
    },
    invalid: {
      name: '',
      description: 'x'.repeat(1001), // Слишком длинное описание
      priority: 'invalid',
      status: 'invalid'
    },
    aiProject: {
      name: 'AI Integration Project',
      description: 'Project for AI integration testing',
      priority: 'critical',
      status: 'planning',
      estimatedHours: 80,
      actualHours: 0
    },
    complexProject: {
      name: 'Complex Multi-Task Project',
      description: 'Project with multiple tasks and dependencies',
      priority: 'medium',
      status: 'in-progress',
      estimatedHours: 120,
      actualHours: 30
    }
  },
  
  tasks: {
    valid: {
      title: 'Test Task',
      description: 'Test task description',
      priority: 'medium',
      status: 'todo',
      estimatedHours: 8,
      actualHours: 0
    },
    invalid: {
      title: '',
      description: 'x'.repeat(1001), // Слишком длинное описание
      priority: 'invalid',
      status: 'invalid'
    },
    aiTask: {
      title: 'AI Model Training',
      description: 'Train AI model for data analysis',
      priority: 'critical',
      status: 'in-progress',
      estimatedHours: 16,
      actualHours: 4
    },
    complexTask: {
      title: 'Complex Implementation Task',
      description: 'Task with multiple dependencies and requirements',
      priority: 'high',
      status: 'review',
      estimatedHours: 24,
      actualHours: 18
    }
  },
  
  users: {
    admin: {
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      role: 'admin',
      permissions: ['create_projects', 'edit_projects', 'delete_projects', 'manage_users']
    },
    user: {
      username: 'user',
      password: 'password',
      email: 'user@example.com',
      role: 'user',
      permissions: ['create_projects', 'edit_projects', 'create_tasks', 'edit_tasks']
    },
    testuser: {
      username: 'testuser',
      password: 'testpass',
      email: 'test@example.com',
      role: 'user',
      permissions: ['create_projects', 'create_tasks']
    },
    guest: {
      username: 'guest',
      password: 'guest123',
      email: 'guest@example.com',
      role: 'guest',
      permissions: ['view_projects', 'view_tasks']
    }
  },
  
  aiServices: {
    openrouter: {
      name: 'OpenRouter',
      status: 'connected',
      responseTime: 150,
      apiKey: 'test-openrouter-key'
    },
    lmstudio: {
      name: 'LM Studio',
      status: 'connected',
      responseTime: 200,
      apiKey: 'test-lmstudio-key'
    },
    xai: {
      name: 'xAI',
      status: 'connected',
      responseTime: 100,
      apiKey: 'test-xai-key'
    }
  },
  
  notifications: {
    projectCreated: {
      type: 'success',
      title: 'Project Created',
      message: 'Project created successfully',
      duration: 5000
    },
    taskAssigned: {
      type: 'info',
      title: 'Task Assigned',
      message: 'Task assigned to you',
      duration: 3000
    },
    aiAnalysisComplete: {
      type: 'success',
      title: 'AI Analysis Complete',
      message: 'AI analysis completed successfully',
      duration: 7000
    },
    error: {
      type: 'error',
      title: 'Error',
      message: 'An error occurred',
      duration: 10000
    }
  },
  
  requirements: {
    functional: [
      'User can create projects',
      'User can edit projects',
      'User can delete projects',
      'User can create tasks',
      'User can assign tasks',
      'User can use AI features'
    ],
    nonFunctional: [
      'System should respond within 3 seconds',
      'System should support 100 concurrent users',
      'System should be accessible via keyboard',
      'System should work on mobile devices'
    ],
    aiRequirements: [
      'AI should analyze project requirements',
      'AI should provide task recommendations',
      'AI should estimate project duration',
      'AI should assess project risks'
    ]
  },
  
  testCases: {
    projectCreation: {
      id: 'TC001',
      title: 'Create New Project',
      description: 'Test creating a new project with valid data',
      steps: [
        'Navigate to Projects page',
        'Click New Project button',
        'Fill project name',
        'Fill project description',
        'Select priority',
        'Click Save Project',
        'Verify project is created'
      ],
      expectedResult: 'Project is created successfully and appears in the list'
    },
    taskAssignment: {
      id: 'TC002',
      title: 'Assign Task to User',
      description: 'Test assigning a task to a user',
      steps: [
        'Navigate to Tasks page',
        'Click on a task',
        'Click Assign Task button',
        'Select user from dropdown',
        'Click Assign button',
        'Verify task is assigned'
      ],
      expectedResult: 'Task is assigned to the selected user'
    },
    aiAnalysis: {
      id: 'TC003',
      title: 'AI Project Analysis',
      description: 'Test AI analysis of a project',
      steps: [
        'Navigate to Projects page',
        'Click on a project',
        'Click Analyze with AI button',
        'Wait for analysis to complete',
        'Review analysis results',
        'Verify analysis quality'
      ],
      expectedResult: 'AI analysis is completed with relevant recommendations'
    }
  },
  
  mockResponses: {
    projects: [
      { id: 1, name: 'Mock Project 1', priority: 'high', status: 'in-progress' },
      { id: 2, name: 'Mock Project 2', priority: 'medium', status: 'planning' },
      { id: 3, name: 'Mock Project 3', priority: 'low', status: 'completed' }
    ],
    tasks: [
      { id: 1, title: 'Mock Task 1', priority: 'high', status: 'todo' },
      { id: 2, title: 'Mock Task 2', priority: 'medium', status: 'in-progress' },
      { id: 3, title: 'Mock Task 3', priority: 'low', status: 'completed' }
    ],
    users: [
      { id: 1, username: 'user1', email: 'user1@example.com', role: 'user' },
      { id: 2, username: 'user2', email: 'user2@example.com', role: 'user' },
      { id: 3, username: 'admin', email: 'admin@example.com', role: 'admin' }
    ]
  },
  
  errorMessages: {
    validation: {
      required: 'This field is required',
      tooLong: 'Text is too long',
      invalidEmail: 'Invalid email format',
      passwordMismatch: 'Passwords do not match'
    },
    network: {
      connectionFailed: 'Connection failed',
      timeout: 'Request timeout',
      serverError: 'Server error occurred'
    },
    ai: {
      serviceUnavailable: 'AI service is unavailable',
      analysisFailed: 'AI analysis failed',
      recommendationsFailed: 'Failed to generate recommendations'
    }
  }
};

/**
 * Генератор случайных тестовых данных
 */
export class TestDataGenerator {
  static generateProject(overrides: Partial<typeof testData.projects.valid> = {}) {
    return {
      ...testData.projects.valid,
      name: `Generated Project ${Date.now()}`,
      description: `Generated project description ${Date.now()}`,
      ...overrides
    };
  }

  static generateTask(overrides: Partial<typeof testData.tasks.valid> = {}) {
    return {
      ...testData.tasks.valid,
      title: `Generated Task ${Date.now()}`,
      description: `Generated task description ${Date.now()}`,
      ...overrides
    };
  }

  static generateUser(overrides: Partial<typeof testData.users.user> = {}) {
    return {
      ...testData.users.user,
      username: `generated_user_${Date.now()}`,
      email: `generated_${Date.now()}@example.com`,
      ...overrides
    };
  }
}

/**
 * Утилиты для работы с тестовыми данными
 */
export class TestDataUtils {
  static validateProject(project: any): boolean {
    return project.name && 
           project.description && 
           project.priority && 
           project.status;
  }

  static validateTask(task: any): boolean {
    return task.title && 
           task.description && 
           task.priority && 
           task.status;
  }

  static validateUser(user: any): boolean {
    return user.username && 
           user.email && 
           user.role;
  }

  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateRandomEmail(): string {
    return `test_${Date.now()}@example.com`;
  }
}
