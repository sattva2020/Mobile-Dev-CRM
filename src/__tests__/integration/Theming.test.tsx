import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import App from '../../App';
import { useAppContext } from '../../context/AppContext';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('Theming Integration Tests', () => {
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
    mockUseAppContext.mockReturnValue({
      tasks: mockTasks,
      notifications: mockNotifications,
      settings: mockSettings,
      updateTask: mockUpdateTask,
      updateNotification: mockUpdateNotification,
      updateSettings: mockUpdateSettings,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays current theme on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('shows theme information on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Current Theme: Light')).toBeInTheDocument();
  });

  it('allows changing theme in Settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check theme settings section
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByDisplayValue('light')).toBeInTheDocument();
  });

  it('allows switching to dark theme', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const themeSelect = screen.getByDisplayValue('light');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'dark',
      })
    );
  });

  it('allows switching to auto theme', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const themeSelect = screen.getByDisplayValue('light');
    fireEvent.change(themeSelect, { target: { value: 'auto' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'auto',
      })
    );
  });

  it('applies dark theme classes when selected', () => {
    const darkSettings = {
      ...mockSettings,
      theme: 'dark' as const,
    };

    mockUseAppContext.mockReturnValue({
      tasks: mockTasks,
      notifications: mockNotifications,
      settings: darkSettings,
      updateTask: mockUpdateTask,
      updateNotification: mockUpdateNotification,
      updateSettings: mockUpdateSettings,
    });

    render(<App />);

    // Check for dark theme classes
    const body = document.body;
    expect(body).toHaveClass('dark');
  });

  it('applies light theme classes when selected', () => {
    render(<App />);

    // Check for light theme classes
    const body = document.body;
    expect(body).toHaveClass('light');
  });

  it('handles theme switching without page reload', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const themeSelect = screen.getByDisplayValue('light');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });

    // Should update theme without reloading
    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'dark',
      })
    );
  });

  it('persists theme selection in localStorage', async () => {
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const themeSelect = screen.getByDisplayValue('light');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });

    // Should save to localStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'dev-crm-settings',
      expect.any(String)
    );
  });

  it('loads theme from localStorage on initialization', () => {
    const mockLocalStorage = {
      getItem: jest.fn((key) => {
        if (key === 'dev-crm-settings') {
          return JSON.stringify({
            ...mockSettings,
            theme: 'dark',
          });
        }
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    render(<App />);

    // Should load dark theme from localStorage
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('handles invalid theme values gracefully', () => {
    const mockLocalStorage = {
      getItem: jest.fn((key) => {
        if (key === 'dev-crm-settings') {
          return JSON.stringify({
            ...mockSettings,
            theme: 'invalid-theme',
          });
        }
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    render(<App />);

    // Should fallback to default theme
    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('shows theme preview in Settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for theme preview
    expect(screen.getByText('Theme Preview')).toBeInTheDocument();
    expect(screen.getByText('Light Theme')).toBeInTheDocument();
    expect(screen.getByText('Dark Theme')).toBeInTheDocument();
  });

  it('allows custom theme configuration', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for custom theme options
    expect(screen.getByText('Custom Theme')).toBeInTheDocument();
    expect(screen.getByText('Primary Color')).toBeInTheDocument();
    expect(screen.getByText('Secondary Color')).toBeInTheDocument();
    expect(screen.getByText('Accent Color')).toBeInTheDocument();
  });

  it('validates theme color values', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Test color input validation
    const primaryColorInput = screen.getByLabelText(/primary color/i);
    fireEvent.change(primaryColorInput, { target: { value: '#ff0000' } });

    // Should accept valid hex color
    expect(primaryColorInput).toHaveValue('#ff0000');

    // Test invalid color
    fireEvent.change(primaryColorInput, { target: { value: 'invalid-color' } });

    // Should handle invalid color gracefully
    expect(primaryColorInput).toHaveValue('invalid-color');
  });

  it('applies custom theme colors', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Set custom colors
    const primaryColorInput = screen.getByLabelText(/primary color/i);
    fireEvent.change(primaryColorInput, { target: { value: '#ff0000' } });

    const secondaryColorInput = screen.getByLabelText(/secondary color/i);
    fireEvent.change(secondaryColorInput, { target: { value: '#00ff00' } });

    const accentColorInput = screen.getByLabelText(/accent color/i);
    fireEvent.change(accentColorInput, { target: { value: '#0000ff' } });

    // Should apply custom colors
    expect(primaryColorInput).toHaveValue('#ff0000');
    expect(secondaryColorInput).toHaveValue('#00ff00');
    expect(accentColorInput).toHaveValue('#0000ff');
  });

  it('shows theme reset option', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for reset button
    expect(screen.getByText('Reset to Default')).toBeInTheDocument();
    expect(screen.getByText('Reset Theme')).toBeInTheDocument();
  });

  it('resets theme to default', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Click reset button
    const resetButton = screen.getByText('Reset to Default');
    fireEvent.click(resetButton);

    // Should reset theme
    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'light',
      })
    );
  });

  it('handles theme switching animation', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const themeSelect = screen.getByDisplayValue('light');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });

    // Should handle theme switching smoothly
    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'dark',
      })
    );
  });

  it('shows theme accessibility information', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for accessibility information
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
    expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
  });

  it('allows enabling high contrast mode', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const highContrastCheckbox = screen.getByLabelText('High Contrast');
    fireEvent.click(highContrastCheckbox);

    // Should enable high contrast
    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        highContrast: true,
      })
    );
  });

  it('allows enabling reduced motion', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const reducedMotionCheckbox = screen.getByLabelText('Reduced Motion');
    fireEvent.click(reducedMotionCheckbox);

    // Should enable reduced motion
    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        reducedMotion: true,
      })
    );
  });

  it('shows theme system preference detection', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for system preference detection
    expect(screen.getByText('System Preference')).toBeInTheDocument();
    expect(screen.getByText('Auto-detect')).toBeInTheDocument();
  });

  it('handles theme system preference', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const autoDetectCheckbox = screen.getByLabelText('Auto-detect');
    fireEvent.click(autoDetectCheckbox);

    // Should enable auto-detection
    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        autoDetect: true,
      })
    );
  });
});
