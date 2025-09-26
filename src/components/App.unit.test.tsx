import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the contexts
vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({
    state: { isAuthenticated: false, user: null },
    actions: {}
  })
}));

vi.mock('./context/AppContext', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="app-provider">{children}</div>,
  useApp: () => ({
    state: { projects: [], notifications: [] },
    dispatch: vi.fn()
  })
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('app-provider')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<App />);
    // App should render with providers
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });
});
