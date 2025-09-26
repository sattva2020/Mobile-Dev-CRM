import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import App from '../../App';
import { useAppContext } from '../../context/AppContext';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('Localization Integration Tests', () => {
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

  it('displays current language on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Russian')).toBeInTheDocument();
  });

  it('shows language information on Dashboard', () => {
    render(<App />);

    expect(screen.getByText('Localization')).toBeInTheDocument();
    expect(screen.getByText('Current Language: Russian')).toBeInTheDocument();
  });

  it('allows changing language in Settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check language settings section
    expect(screen.getByText('Localization')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ru')).toBeInTheDocument();
  });

  it('allows switching to English', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const languageSelect = screen.getByDisplayValue('ru');
    fireEvent.change(languageSelect, { target: { value: 'en' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'en',
      })
    );
  });

  it('allows switching to French', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const languageSelect = screen.getByDisplayValue('ru');
    fireEvent.change(languageSelect, { target: { value: 'fr' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'fr',
      })
    );
  });

  it('allows switching to German', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const languageSelect = screen.getByDisplayValue('ru');
    fireEvent.change(languageSelect, { target: { value: 'de' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'de',
      })
    );
  });

  it('handles language switching without page reload', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const languageSelect = screen.getByDisplayValue('ru');
    fireEvent.change(languageSelect, { target: { value: 'en' } });

    // Should update language without reloading
    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'en',
      })
    );
  });

  it('persists language selection in localStorage', async () => {
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

    const languageSelect = screen.getByDisplayValue('ru');
    fireEvent.change(languageSelect, { target: { value: 'en' } });

    // Should save to localStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'dev-crm-settings',
      expect.any(String)
    );
  });

  it('loads language from localStorage on initialization', () => {
    const mockLocalStorage = {
      getItem: jest.fn((key) => {
        if (key === 'dev-crm-settings') {
          return JSON.stringify({
            ...mockSettings,
            language: 'en',
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

    // Should load English from localStorage
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('handles invalid language values gracefully', () => {
    const mockLocalStorage = {
      getItem: jest.fn((key) => {
        if (key === 'dev-crm-settings') {
          return JSON.stringify({
            ...mockSettings,
            language: 'invalid-language',
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

    // Should fallback to default language
    expect(screen.getByText('Russian')).toBeInTheDocument();
  });

  it('shows language preview in Settings', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for language preview
    expect(screen.getByText('Language Preview')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Russian')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
    expect(screen.getByText('German')).toBeInTheDocument();
  });

  it('displays localized date formats', () => {
    render(<App />);

    // Check for localized date format
    expect(screen.getByText('17.01.2024')).toBeInTheDocument();
  });

  it('displays localized time formats', () => {
    render(<App />);

    // Check for localized time format
    expect(screen.getByText('12:00')).toBeInTheDocument();
  });

  it('displays localized number formats', () => {
    render(<App />);

    // Check for localized number format
    expect(screen.getByText('1 000')).toBeInTheDocument();
  });

  it('displays localized currency formats', () => {
    render(<App />);

    // Check for localized currency format
    expect(screen.getByText('1 000 ₽')).toBeInTheDocument();
  });

  it('handles RTL languages correctly', async () => {
    const rtlSettings = {
      ...mockSettings,
      language: 'ar' as const,
    };

    mockUseAppContext.mockReturnValue({
      tasks: mockTasks,
      notifications: mockNotifications,
      settings: rtlSettings,
      updateTask: mockUpdateTask,
      updateNotification: mockUpdateNotification,
      updateSettings: mockUpdateSettings,
    });

    render(<App />);

    // Check for RTL support
    const body = document.body;
    expect(body).toHaveAttribute('dir', 'rtl');
  });

  it('handles LTR languages correctly', () => {
    render(<App />);

    // Check for LTR support
    const body = document.body;
    expect(body).toHaveAttribute('dir', 'ltr');
  });

  it('shows language-specific font families', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for font family options
    expect(screen.getByText('Font Family')).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Serif')).toBeInTheDocument();
    expect(screen.getByText('Sans-serif')).toBeInTheDocument();
  });

  it('allows changing font family', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const fontSelect = screen.getByDisplayValue('default');
    fireEvent.change(fontSelect, { target: { value: 'serif' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        fontFamily: 'serif',
      })
    );
  });

  it('shows language-specific text sizes', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for text size options
    expect(screen.getByText('Text Size')).toBeInTheDocument();
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('allows changing text size', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const textSizeSelect = screen.getByDisplayValue('medium');
    fireEvent.change(textSizeSelect, { target: { value: 'large' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        textSize: 'large',
      })
    );
  });

  it('shows language detection option', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for auto-detection option
    expect(screen.getByText('Auto-detect Language')).toBeInTheDocument();
    expect(screen.getByText('Detect from Browser')).toBeInTheDocument();
  });

  it('allows enabling auto-detection', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const autoDetectCheckbox = screen.getByLabelText('Detect from Browser');
    fireEvent.click(autoDetectCheckbox);

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        autoDetectLanguage: true,
      })
    );
  });

  it('shows language-specific keyboard shortcuts', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for keyboard shortcuts
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+Shift+L')).toBeInTheDocument();
  });

  it('handles language-specific validation messages', async () => {
    render(<App />);

    // Navigate to Task Board
    const taskBoardLink = screen.getByRole('link', { name: /task board/i });
    taskBoardLink.click();

    await screen.findByText('Task Board');

    // Test form validation with localized messages
    const addButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(addButton);

    // Should show localized validation message
    expect(screen.getByText('Пожалуйста, заполните все обязательные поля')).toBeInTheDocument();
  });

  it('shows language-specific help text', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Check for help text
    expect(screen.getByText('Выберите язык интерфейса')).toBeInTheDocument();
  });

  it('handles language-specific error messages', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    // Test error handling with localized messages
    const languageSelect = screen.getByDisplayValue('ru');
    fireEvent.change(languageSelect, { target: { value: 'invalid' } });

    // Should show localized error message
    expect(screen.getByText('Неверный язык')).toBeInTheDocument();
  });

  it('shows language-specific success messages', async () => {
    render(<App />);

    // Navigate to Settings
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    settingsLink.click();

    await screen.findByText('Settings');

    const languageSelect = screen.getByDisplayValue('ru');
    fireEvent.change(languageSelect, { target: { value: 'en' } });

    // Should show localized success message
    expect(screen.getByText('Язык изменен успешно')).toBeInTheDocument();
  });
});
