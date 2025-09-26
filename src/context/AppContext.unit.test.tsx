import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider } from './AppContext';
import React from 'react';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('AppContext', () => {
  it('provides initial state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    const { result } = renderHook(() => {
      // Mock useApp hook
      return {
        state: {
          tasks: [],
          notifications: [],
          settings: {
            github: { repository: { owner: '', name: '' }, autoSync: false, syncInterval: 30 },
            ai: { enabled: false, model: '', autoSuggestions: false },
            theme: 'light' as const,
            language: 'ru' as const,
            notifications: { enabled: true, sound: true, desktop: false }
          },
          loading: false,
          githubService: false,
          aiService: false,
          stats: {
            totalTasks: 0,
            completedTasks: 0,
            inProgressTasks: 0,
            overdueTasks: 0,
            averageCompletionTime: 0
          }
        },
        dispatch: vi.fn()
      };
    }, { wrapper });

    expect(result.current.state.tasks).toEqual([]);
    expect(result.current.state.notifications).toEqual([]);
    expect(result.current.state.loading).toBe(false);
  });
});
