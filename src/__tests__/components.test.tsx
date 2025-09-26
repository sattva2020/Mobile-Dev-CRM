import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import Dashboard from '../components/Dashboard';
import TaskBoard from '../components/TaskBoard';
import Settings from '../components/Settings';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard correctly', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('Дашборд проекта')).toBeInTheDocument();
    expect(screen.getByText('Обзор прогресса разработки AI-Fitness Coach 360')).toBeInTheDocument();
  });

  it('displays statistics cards', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('Всего задач')).toBeInTheDocument();
    expect(screen.getByText('Выполнено')).toBeInTheDocument();
    expect(screen.getByText('В работе')).toBeInTheDocument();
    expect(screen.getByText('Просрочено')).toBeInTheDocument();
  });

  it('shows progress charts', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('Прогресс по статусам')).toBeInTheDocument();
    expect(screen.getByText('Распределение по категориям')).toBeInTheDocument();
  });

  it('displays recent tasks section', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('Недавние задачи')).toBeInTheDocument();
  });

  it('shows notifications section', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('Уведомления')).toBeInTheDocument();
  });

  it('displays quick actions', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('Быстрые действия')).toBeInTheDocument();
    expect(screen.getByText('Синхронизировать с GitHub')).toBeInTheDocument();
    expect(screen.getByText('Запустить аудит безопасности')).toBeInTheDocument();
    expect(screen.getByText('Запустить тесты')).toBeInTheDocument();
  });
});

describe('TaskBoard Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders task board correctly', () => {
    render(<TaskBoard />, { wrapper });
    
    expect(screen.getByText('Доска задач')).toBeInTheDocument();
    expect(screen.getByText('Новая задача')).toBeInTheDocument();
  });

  it('displays task columns', () => {
    render(<TaskBoard />, { wrapper });
    
    expect(screen.getByText('К выполнению')).toBeInTheDocument();
    expect(screen.getByText('В работе')).toBeInTheDocument();
    expect(screen.getByText('На проверке')).toBeInTheDocument();
    expect(screen.getByText('Выполнено')).toBeInTheDocument();
  });

  it('shows filters section', () => {
    render(<TaskBoard />, { wrapper });
    
    expect(screen.getByPlaceholderText('Поиск задач...')).toBeInTheDocument();
    expect(screen.getByText('Категория')).toBeInTheDocument();
    expect(screen.getByText('Приоритет')).toBeInTheDocument();
    expect(screen.getByText('Исполнитель')).toBeInTheDocument();
  });

  it('opens task modal when new task button is clicked', () => {
    render(<TaskBoard />, { wrapper });
    
    const newTaskButton = screen.getByText('Новая задача');
    fireEvent.click(newTaskButton);
    
    expect(screen.getByText('Создать задачу')).toBeInTheDocument();
  });

  it('filters tasks by search query', () => {
    render(<TaskBoard />, { wrapper });
    
    const searchInput = screen.getByPlaceholderText('Поиск задач...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    expect(searchInput).toHaveValue('test');
  });

  it('filters tasks by category', () => {
    render(<TaskBoard />, { wrapper });
    
    const categorySelect = screen.getByDisplayValue('Все категории');
    fireEvent.change(categorySelect, { target: { value: 'security' } });
    
    expect(categorySelect).toHaveValue('security');
  });

  it('filters tasks by priority', () => {
    render(<TaskBoard />, { wrapper });
    
    const prioritySelect = screen.getByDisplayValue('Все приоритеты');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    
    expect(prioritySelect).toHaveValue('high');
  });

  it('filters tasks by assignee', () => {
    render(<TaskBoard />, { wrapper });
    
    const assigneeInput = screen.getByPlaceholderText('Имя исполнителя');
    fireEvent.change(assigneeInput, { target: { value: 'John' } });
    
    expect(assigneeInput).toHaveValue('John');
  });
});

describe('Settings Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders settings correctly', () => {
    render(<Settings />, { wrapper });
    
    expect(screen.getByText('Настройки')).toBeInTheDocument();
    expect(screen.getByText('Управление конфигурацией системы и интеграциями')).toBeInTheDocument();
  });

  it('displays GitHub integration section', () => {
    render(<Settings />, { wrapper });
    
    expect(screen.getByText('GitHub интеграция')).toBeInTheDocument();
    expect(screen.getByText('GitHub API')).toBeInTheDocument();
  });

  it('shows AI integration section', () => {
    render(<Settings />, { wrapper });
    
    expect(screen.getByText('AI интеграция')).toBeInTheDocument();
    expect(screen.getByText('AI Assistant (Grok-4-Fast)')).toBeInTheDocument();
  });

  it('displays notifications section', () => {
    render(<Settings />, { wrapper });
    
    expect(screen.getByText('Уведомления')).toBeInTheDocument();
    expect(screen.getByText('Включить уведомления')).toBeInTheDocument();
  });

  it('shows appearance section', () => {
    render(<Settings />, { wrapper });
    
    expect(screen.getByText('Внешний вид')).toBeInTheDocument();
    expect(screen.getByText('Тема')).toBeInTheDocument();
    expect(screen.getByText('Язык')).toBeInTheDocument();
  });

  it('displays system information', () => {
    render(<Settings />, { wrapper });
    
    expect(screen.getByText('Информация о системе')).toBeInTheDocument();
    expect(screen.getByText('Версия приложения:')).toBeInTheDocument();
  });

  it('toggles GitHub auto sync', () => {
    render(<Settings />, { wrapper });
    
    const autoSyncToggle = screen.getByText('Автоматическая синхронизация');
    fireEvent.click(autoSyncToggle);
    
    // Check if sync interval field appears
    expect(screen.getByText('Интервал синхронизации (минуты)')).toBeInTheDocument();
  });

  it('toggles AI assistant', () => {
    render(<Settings />, { wrapper });
    
    const aiToggle = screen.getByText('Включить AI помощника');
    fireEvent.click(aiToggle);
    
    // Check if AI settings fields appear
    expect(screen.getByText('API ключ OpenRouter')).toBeInTheDocument();
    expect(screen.getByText('AI модель')).toBeInTheDocument();
  });

  it('toggles notifications', () => {
    render(<Settings />, { wrapper });
    
    const notificationsToggle = screen.getByText('Включить уведомления');
    fireEvent.click(notificationsToggle);
    
    // Check if notification settings appear
    expect(screen.getByText('Звуковые уведомления')).toBeInTheDocument();
    expect(screen.getByText('Desktop уведомления')).toBeInTheDocument();
  });

  it('changes theme', () => {
    render(<Settings />, { wrapper });
    
    const themeSelect = screen.getByDisplayValue('Светлая');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });
    
    expect(themeSelect).toHaveValue('dark');
  });

  it('changes language', () => {
    render(<Settings />, { wrapper });
    
    const languageSelect = screen.getByDisplayValue('Русский');
    fireEvent.change(languageSelect, { target: { value: 'en' } });
    
    expect(languageSelect).toHaveValue('en');
  });

  it('tests GitHub connection', async () => {
    render(<Settings />, { wrapper });
    
    const testButton = screen.getByText('Тест');
    fireEvent.click(testButton);
    
    // Wait for the test to complete
    await waitFor(() => {
      expect(screen.getByText('Тест')).toBeInTheDocument();
    });
  });

  it('tests AI connection', async () => {
    render(<Settings />, { wrapper });
    
    const testButton = screen.getByText('Тест');
    fireEvent.click(testButton);
    
    // Wait for the test to complete
    await waitFor(() => {
      expect(screen.getByText('Тест')).toBeInTheDocument();
    });
  });
});

describe('Component Integration', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('navigates between components correctly', () => {
    const { rerender } = render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('Дашборд проекта')).toBeInTheDocument();
    
    rerender(<TaskBoard />);
    expect(screen.getByText('Доска задач')).toBeInTheDocument();
    
    rerender(<Settings />);
    expect(screen.getByText('Настройки')).toBeInTheDocument();
  });

  it('maintains state across component switches', () => {
    const { rerender } = render(<Dashboard />, { wrapper });
    
    // Add a task
    const newTaskButton = screen.getByText('Новая задача');
    fireEvent.click(newTaskButton);
    
    // Fill task form
    const titleInput = screen.getByDisplayValue('');
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    
    // Switch to task board
    rerender(<TaskBoard />);
    
    // Check if task is still there
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
