import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppProvider } from './context/AppContext';

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

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Test utilities
export const createMockTask = (overrides = {}) => ({
  id: 'test-task-1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo' as const,
  priority: 'medium' as const,
  category: 'other' as const,
  labels: [],
  createdAt: '2024-01-17T12:00:00Z',
  updatedAt: '2024-01-17T12:00:00Z',
  ...overrides,
});

export const createMockNotification = (overrides = {}) => ({
  id: 'test-notification-1',
  type: 'info' as const,
  title: 'Test Notification',
  message: 'Test Message',
  source: 'system' as const,
  read: false,
  createdAt: '2024-01-17T12:00:00Z',
  ...overrides,
});

export const createMockSettings = (overrides = {}) => ({
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
  ...overrides,
});

// Mock data generators
export const generateMockTasks = (count: number) => {
  return Array.from({ length: count }, (_, index) => 
    createMockTask({
      id: `task-${index + 1}`,
      title: `Task ${index + 1}`,
      description: `Description for task ${index + 1}`,
    })
  );
};

export const generateMockNotifications = (count: number) => {
  return Array.from({ length: count }, (_, index) => 
    createMockNotification({
      id: `notification-${index + 1}`,
      title: `Notification ${index + 1}`,
      message: `Message for notification ${index + 1}`,
    })
  );
};

// Test helpers
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  localStorageMock.getItem.mockImplementation((key: string) => store[key] || null);
  localStorageMock.setItem.mockImplementation((key: string, value: string) => {
    store[key] = value;
  });
  localStorageMock.removeItem.mockImplementation((key: string) => {
    delete store[key];
  });
  localStorageMock.clear.mockImplementation(() => {
    Object.keys(store).forEach(key => delete store[key]);
  });
  
  return store;
};

export const mockFetch = (response: any, ok = true) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: async () => response,
  });
};

export const mockFetchError = (status = 500, statusText = 'Internal Server Error') => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status,
    statusText,
  });
};
