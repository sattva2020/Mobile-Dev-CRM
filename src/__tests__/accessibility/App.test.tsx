import React from 'react';
import { render, screen } from '../../../test-utils';
import App from '../../App';
import { useAppContext } from '../../context/AppContext';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('App Accessibility Tests', () => {
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

  it('has proper heading structure', () => {
    render(<App />);

    // Check for main heading
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent('Dev CRM');

    // Check for page headings
    const pageHeading = screen.getByRole('heading', { level: 2 });
    expect(pageHeading).toBeInTheDocument();
    expect(pageHeading).toHaveTextContent('Dashboard');
  });

  it('has proper navigation structure', () => {
    render(<App />);

    // Check for navigation links
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/');

    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    expect(taskBoardLink).toBeInTheDocument();
    expect(taskBoardLink).toHaveAttribute('href', '/tasks');

    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  it('has proper form labels and controls', async () => {
    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    // Check for form inputs with proper labels
    const titleInput = screen.getByLabelText(/task title/i);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveAttribute('type', 'text');

    const descriptionInput = screen.getByLabelText(/task description/i);
    expect(descriptionInput).toBeInTheDocument();

    const statusSelect = screen.getByLabelText(/status/i);
    expect(statusSelect).toBeInTheDocument();

    const prioritySelect = screen.getByLabelText(/priority/i);
    expect(prioritySelect).toBeInTheDocument();

    const categorySelect = screen.getByLabelText(/category/i);
    expect(categorySelect).toBeInTheDocument();
  });

  it('has proper button labels and roles', () => {
    render(<App />);

    // Check for buttons with proper labels
    const addTaskButton = screen.getByRole('button', { name: /add task/i });
    expect(addTaskButton).toBeInTheDocument();

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    const saveButton = screen.getByRole('button', { name: /save settings/i });
    expect(saveButton).toBeInTheDocument();
  });

  it('has proper table structure for task data', async () => {
    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    // Check for table headers
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Labels')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
  });

  it('has proper color contrast for status indicators', () => {
    render(<App />);

    // Check for status color classes
    const statusElements = screen.getAllByText('todo');
    statusElements.forEach(element => {
      expect(element).toHaveClass('bg-gray-100', 'text-gray-800');
    });
  });

  it('has proper color contrast for priority indicators', () => {
    render(<App />);

    // Check for priority color classes
    const priorityElements = screen.getAllByText('high');
    priorityElements.forEach(element => {
      expect(element).toHaveClass('text-red-600');
    });
  });

  it('has proper focus management', () => {
    render(<App />);

    // Check for focusable elements
    const focusableElements = screen.getAllByRole('link');
    focusableElements.forEach(element => {
      expect(element).toHaveAttribute('tabIndex');
    });
  });

  it('has proper ARIA labels for interactive elements', () => {
    render(<App />);

    // Check for ARIA labels on buttons
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('has proper role attributes for custom components', () => {
    render(<App />);

    // Check for proper roles on custom components
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();

    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });

  it('has proper alt text for images', () => {
    render(<App />);

    // Check for alt text on images
    const images = screen.getAllByRole('img');
    images.forEach(image => {
      expect(image).toHaveAttribute('alt');
    });
  });

  it('has proper form validation and error handling', async () => {
    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    // Try to submit form without required fields
    const addTaskButton = screen.getByRole('button', { name: /add task/i });
    addTaskButton.click();

    // Check for validation messages
    const titleInput = screen.getByLabelText(/task title/i);
    expect(titleInput).toHaveAttribute('required');
  });

  it('has proper keyboard navigation support', () => {
    render(<App />);

    // Check for keyboard navigation support
    const focusableElements = screen.getAllByRole('link');
    focusableElements.forEach(element => {
      expect(element).toHaveAttribute('tabIndex');
    });
  });

  it('has proper screen reader support', () => {
    render(<App />);

    // Check for screen reader support
    const statusElements = screen.getAllByText('todo');
    statusElements.forEach(element => {
      expect(element).toHaveAttribute('aria-label');
    });
  });

  it('has proper language attributes', () => {
    render(<App />);

    // Check for language attributes
    const htmlElement = document.documentElement;
    expect(htmlElement).toHaveAttribute('lang');
  });

  it('has proper semantic HTML structure', () => {
    render(<App />);

    // Check for semantic HTML elements
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
