import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import Settings from '../../components/Settings';
import { useAppContext } from '../../context/AppContext';

// Mock the context hook
jest.mock('../../context/AppContext');
const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('Settings', () => {
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

  const mockUpdateSettings = jest.fn();

  beforeEach(() => {
    mockUseAppContext.mockReturnValue({
      tasks: [],
      notifications: [],
      settings: mockSettings,
      updateTask: jest.fn(),
      updateNotification: jest.fn(),
      updateSettings: mockUpdateSettings,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders settings form with all sections', () => {
    render(<Settings />);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('GitHub Integration')).toBeInTheDocument();
    expect(screen.getByText('AI Features')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('displays current GitHub settings', () => {
    render(<Settings />);

    expect(screen.getByDisplayValue('test-owner')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-repo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('allows updating GitHub repository settings', async () => {
    render(<Settings />);

    const ownerInput = screen.getByDisplayValue('test-owner');
    const nameInput = screen.getByDisplayValue('test-repo');
    const saveButton = screen.getByText('Save Settings');

    fireEvent.change(ownerInput, { target: { value: 'new-owner' } });
    fireEvent.change(nameInput, { target: { value: 'new-repo' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          github: expect.objectContaining({
            repository: {
              owner: 'new-owner',
              name: 'new-repo',
            },
          }),
        })
      );
    });
  });

  it('allows toggling GitHub auto-sync', () => {
    render(<Settings />);

    const autoSyncCheckbox = screen.getByLabelText('Auto-sync with GitHub');
    fireEvent.click(autoSyncCheckbox);

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        github: expect.objectContaining({
          autoSync: true,
        }),
      })
    );
  });

  it('allows updating sync interval', () => {
    render(<Settings />);

    const intervalInput = screen.getByDisplayValue('30');
    fireEvent.change(intervalInput, { target: { value: '60' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        github: expect.objectContaining({
          syncInterval: 60,
        }),
      })
    );
  });

  it('displays current AI settings', () => {
    render(<Settings />);

    expect(screen.getByDisplayValue('grok-4-fast')).toBeInTheDocument();
  });

  it('allows toggling AI features', () => {
    render(<Settings />);

    const aiEnabledCheckbox = screen.getByLabelText('Enable AI Features');
    fireEvent.click(aiEnabledCheckbox);

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        ai: expect.objectContaining({
          enabled: true,
        }),
      })
    );
  });

  it('allows changing AI model', () => {
    render(<Settings />);

    const modelSelect = screen.getByDisplayValue('grok-4-fast');
    fireEvent.change(modelSelect, { target: { value: 'gpt-4' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        ai: expect.objectContaining({
          model: 'gpt-4',
        }),
      })
    );
  });

  it('allows toggling AI auto-suggestions', () => {
    render(<Settings />);

    const autoSuggestionsCheckbox = screen.getByLabelText('Auto-suggestions');
    fireEvent.click(autoSuggestionsCheckbox);

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        ai: expect.objectContaining({
          autoSuggestions: true,
        }),
      })
    );
  });

  it('displays current theme setting', () => {
    render(<Settings />);

    expect(screen.getByDisplayValue('light')).toBeInTheDocument();
  });

  it('allows changing theme', () => {
    render(<Settings />);

    const themeSelect = screen.getByDisplayValue('light');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'dark',
      })
    );
  });

  it('displays current language setting', () => {
    render(<Settings />);

    expect(screen.getByDisplayValue('ru')).toBeInTheDocument();
  });

  it('allows changing language', () => {
    render(<Settings />);

    const languageSelect = screen.getByDisplayValue('ru');
    fireEvent.change(languageSelect, { target: { value: 'en' } });

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'en',
      })
    );
  });

  it('displays current notification settings', () => {
    render(<Settings />);

    expect(screen.getByLabelText('Enable Notifications')).toBeChecked();
    expect(screen.getByLabelText('Sound Notifications')).toBeChecked();
    expect(screen.getByLabelText('Desktop Notifications')).not.toBeChecked();
  });

  it('allows toggling notification settings', () => {
    render(<Settings />);

    const notificationsCheckbox = screen.getByLabelText('Enable Notifications');
    fireEvent.click(notificationsCheckbox);

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        notifications: expect.objectContaining({
          enabled: false,
        }),
      })
    );
  });

  it('allows toggling sound notifications', () => {
    render(<Settings />);

    const soundCheckbox = screen.getByLabelText('Sound Notifications');
    fireEvent.click(soundCheckbox);

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        notifications: expect.objectContaining({
          sound: false,
        }),
      })
    );
  });

  it('allows toggling desktop notifications', () => {
    render(<Settings />);

    const desktopCheckbox = screen.getByLabelText('Desktop Notifications');
    fireEvent.click(desktopCheckbox);

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        notifications: expect.objectContaining({
          desktop: true,
        }),
      })
    );
  });

  it('shows success message after saving', async () => {
    render(<Settings />);

    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();
    });
  });
});
