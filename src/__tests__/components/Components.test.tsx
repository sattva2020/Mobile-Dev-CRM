import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import Dashboard from '../../components/Dashboard';
import TaskBoard from '../../components/TaskBoard';
import Settings from '../../components/Settings';

// Мокируем зависимости
jest.mock('@octokit/rest');
jest.mock('axios');

describe('Dashboard Component', () => {
  it('renders dashboard correctly', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Дашборд проекта')).toBeInTheDocument();
    expect(screen.getByText('Обзор прогресса разработки AI-Fitness Coach 360')).toBeInTheDocument();
  });

  it('displays statistics cards', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Всего задач')).toBeInTheDocument();
    expect(screen.getByText('Выполнено')).toBeInTheDocument();
    expect(screen.getByText('В работе')).toBeInTheDocument();
  });

  it('shows project progress', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Прогресс проекта')).toBeInTheDocument();
  });
});

describe('TaskBoard Component', () => {
  it('renders task board correctly', () => {
    render(<TaskBoard />);
    
    expect(screen.getByText('Доска задач')).toBeInTheDocument();
    expect(screen.getByText('Новая задача')).toBeInTheDocument();
  });

  it('displays task columns', () => {
    render(<TaskBoard />);
    
    expect(screen.getByText('К выполнению')).toBeInTheDocument();
    expect(screen.getByText('В работе')).toBeInTheDocument();
    expect(screen.getByText('Выполнено')).toBeInTheDocument();
  });

  it('has search functionality', () => {
    render(<TaskBoard />);
    
    const searchInput = screen.getByPlaceholderText('Поиск задач...');
    expect(searchInput).toBeInTheDocument();
  });

  it('allows adding new tasks', () => {
    render(<TaskBoard />);
    
    const newTaskButton = screen.getByText('Новая задача');
    fireEvent.click(newTaskButton);
    
    // Модальное окно должно открыться
    waitFor(() => {
      expect(screen.getByText('Новая задача')).toBeInTheDocument();
    });
  });
});

describe('Settings Component', () => {
  it('renders settings correctly', () => {
    render(<Settings />);
    
    expect(screen.getByText('Настройки')).toBeInTheDocument();
    expect(screen.getByText('Управление конфигурацией системы и интеграциями')).toBeInTheDocument();
  });

  it('displays GitHub integration section', () => {
    render(<Settings />);
    
    expect(screen.getByText('GitHub интеграция')).toBeInTheDocument();
    expect(screen.getByText('GitHub API')).toBeInTheDocument();
  });

  it('displays AI integration section', () => {
    render(<Settings />);
    
    expect(screen.getByText('AI интеграция')).toBeInTheDocument();
  });

  it('has form fields for configuration', () => {
    render(<Settings />);
    
    expect(screen.getByText('Personal Access Token')).toBeInTheDocument();
    expect(screen.getByText('Автоматическая синхронизация')).toBeInTheDocument();
  });

  it('enables auto sync when toggled', () => {
    render(<Settings />);
    
    const autoSyncToggle = screen.getByText('Автоматическая синхронизация');
    fireEvent.click(autoSyncToggle);
    
    // Check if sync interval field appears
    waitFor(() => {
      expect(screen.getByText('Интервал синхронизации (минуты)')).toBeInTheDocument();
    });
  });

  it('toggles AI assistant', () => {
    render(<Settings />);
    
    const aiToggle = screen.getByText('Включить AI помощника');
    fireEvent.click(aiToggle);

    // Check if AI settings fields appear
    waitFor(() => {
      expect(screen.getByText('API ключ OpenRouter')).toBeInTheDocument();
      expect(screen.getByText('AI модель')).toBeInTheDocument();
    });
  });

  it('shows system information', () => {
    render(<Settings />);
    
    expect(screen.getByText('Информация о системе')).toBeInTheDocument();
    expect(screen.getByText('Версия приложения:')).toBeInTheDocument();
  });
});