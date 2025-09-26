import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

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

describe('App', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Mobile Dev CRM')).toBeInTheDocument();
  });

  it('displays the main navigation', () => {
    render(<App />);
    expect(screen.getByText('Дашборд')).toBeInTheDocument();
    expect(screen.getByText('Задачи')).toBeInTheDocument();
    expect(screen.getByText('Настройки')).toBeInTheDocument();
  });

  it('shows the dashboard by default', () => {
    render(<App />);
    expect(screen.getByText('Дашборд проекта')).toBeInTheDocument();
  });
});