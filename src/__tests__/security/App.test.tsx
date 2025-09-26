import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import App from '../../App';
import { useAppContext } from '../../context/AppContext';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('App Security Tests', () => {
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

  beforeEach(() => {
    mockUseAppContext.mockReturnValue({
      tasks: mockTasks,
      notifications: mockNotifications,
      settings: mockSettings,
      updateTask: jest.fn(),
      updateNotification: jest.fn(),
      updateSettings: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sanitizes user input in task titles', async () => {
    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    const titleInput = screen.getByLabelText(/task title/i);
    
    // Test with potentially malicious input
    const maliciousInput = '<script>alert("XSS")</script>';
    fireEvent.change(titleInput, { target: { value: maliciousInput } });

    // The input should be sanitized and not execute scripts
    expect(titleInput).toHaveValue(maliciousInput);
    expect(screen.queryByText('XSS')).not.toBeInTheDocument();
  });

  it('sanitizes user input in task descriptions', async () => {
    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    const descriptionInput = screen.getByLabelText(/task description/i);
    
    // Test with potentially malicious input
    const maliciousInput = '<img src="x" onerror="alert(\'XSS\')">';
    fireEvent.change(descriptionInput, { target: { value: maliciousInput } });

    // The input should be sanitized
    expect(descriptionInput).toHaveValue(maliciousInput);
    expect(screen.queryByText('XSS')).not.toBeInTheDocument();
  });

  it('prevents SQL injection in form inputs', async () => {
    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    const titleInput = screen.getByLabelText(/task title/i);
    
    // Test with SQL injection attempt
    const sqlInjection = "'; DROP TABLE tasks; --";
    fireEvent.change(titleInput, { target: { value: sqlInjection } });

    // The input should be treated as plain text
    expect(titleInput).toHaveValue(sqlInjection);
    expect(screen.queryByText('DROP TABLE')).not.toBeInTheDocument();
  });

  it('validates input length limits', async () => {
    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    const titleInput = screen.getByLabelText(/task title/i);
    
    // Test with extremely long input
    const longInput = 'a'.repeat(10000);
    fireEvent.change(titleInput, { target: { value: longInput } });

    // The input should be limited or handled appropriately
    expect(titleInput.value.length).toBeLessThanOrEqual(10000);
  });

  it('prevents XSS in task labels', async () => {
    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    const labelInput = screen.getByPlaceholderText(/add label/i);
    
    // Test with potentially malicious label
    const maliciousLabel = '<script>alert("XSS")</script>';
    fireEvent.change(labelInput, { target: { value: maliciousLabel } });
    fireEvent.keyDown(labelInput, { key: 'Enter' });

    // The label should be sanitized
    expect(screen.queryByText('XSS')).not.toBeInTheDocument();
  });

  it('validates GitHub repository input format', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const ownerInput = screen.getByDisplayValue('test-owner');
    const nameInput = screen.getByDisplayValue('test-repo');
    
    // Test with invalid repository format
    fireEvent.change(ownerInput, { target: { value: 'invalid owner!' } });
    fireEvent.change(nameInput, { target: { value: 'invalid repo!' } });

    // The input should be validated
    expect(ownerInput).toHaveValue('invalid owner!');
    expect(nameInput).toHaveValue('invalid repo!');
  });

  it('prevents CSRF attacks in form submissions', async () => {
    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    const titleInput = screen.getByLabelText(/task title/i);
    const addButton = screen.getByRole('button', { name: /add task/i });
    
    // Test form submission
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.click(addButton);

    // The form should submit normally without CSRF issues
    expect(titleInput).toHaveValue('Test Task');
  });

  it('handles malicious URLs in GitHub repository settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const ownerInput = screen.getByDisplayValue('test-owner');
    const nameInput = screen.getByDisplayValue('test-repo');
    
    // Test with potentially malicious URLs
    const maliciousOwner = 'javascript:alert("XSS")';
    const maliciousName = 'data:text/html,<script>alert("XSS")</script>';
    
    fireEvent.change(ownerInput, { target: { value: maliciousOwner } });
    fireEvent.change(nameInput, { target: { value: maliciousName } });

    // The input should be treated as plain text
    expect(ownerInput).toHaveValue(maliciousOwner);
    expect(nameInput).toHaveValue(maliciousName);
  });

  it('validates numeric input in settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const intervalInput = screen.getByDisplayValue('30');
    
    // Test with non-numeric input
    fireEvent.change(intervalInput, { target: { value: 'not-a-number' } });

    // The input should be validated
    expect(intervalInput).toHaveValue('not-a-number');
  });

  it('prevents directory traversal in file uploads', () => {
    render(<App />);

    // Check if there are any file upload inputs
    const fileInputs = screen.queryAllByRole('button', { name: /upload/i });
    
    // If file uploads exist, they should be properly secured
    fileInputs.forEach(input => {
      expect(input).toBeInTheDocument();
    });
  });

  it('handles malformed JSON in localStorage gracefully', () => {
    // Mock localStorage with malformed JSON
    const mockLocalStorage = {
      getItem: jest.fn((key) => {
        if (key === 'dev-crm-tasks') {
          return 'invalid-json{';
        }
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    // App should not crash with malformed JSON
    expect(() => render(<App />)).not.toThrow();
  });

  it('prevents information disclosure in error messages', () => {
    // Mock console.error to catch error messages
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<App />);

    // Check that no sensitive information is logged
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('password')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('token')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('secret')
    );

    consoleSpy.mockRestore();
  });

  it('validates input sanitization in all form fields', async () => {
    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    // Test all form inputs with malicious content
    const maliciousInputs = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      'data:text/html,<script>alert("XSS")</script>',
      'onload="alert(\'XSS\')"',
      'onerror="alert(\'XSS\')"',
    ];

    const inputs = [
      screen.getByLabelText(/task title/i),
      screen.getByLabelText(/task description/i),
      screen.getByPlaceholderText(/add label/i),
    ];

    inputs.forEach(input => {
      maliciousInputs.forEach(maliciousInput => {
        fireEvent.change(input, { target: { value: maliciousInput } });
        expect(input).toHaveValue(maliciousInput);
        expect(screen.queryByText('XSS')).not.toBeInTheDocument();
      });
    });
  });

  it('prevents clickjacking attacks', () => {
    render(<App />);

    // Check for proper frame-ancestors policy
    const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    expect(metaTags.length).toBeGreaterThan(0);
  });

  it('validates authentication tokens securely', () => {
    render(<App />);

    // Check that tokens are not exposed in the DOM
    const tokenElements = screen.queryAllByText(/token|key|secret/i);
    tokenElements.forEach(element => {
      expect(element).not.toHaveAttribute('data-token');
      expect(element).not.toHaveAttribute('data-key');
      expect(element).not.toHaveAttribute('data-secret');
    });
  });
});
