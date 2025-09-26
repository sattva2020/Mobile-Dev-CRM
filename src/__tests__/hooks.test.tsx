import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '../context/AppContext';
import { useLocalStorage, useDebounce, useThrottle, useApi } from '../hooks';

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

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = useLocalStorage('test-key', 'initial-value');
    
    expect(result[0]).toBe('initial-value');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('returns stored value from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('stored-value'));
    
    const { result } = useLocalStorage('test-key', 'initial-value');
    
    expect(result[0]).toBe('stored-value');
  });

  it('updates localStorage when value changes', () => {
    const { result } = useLocalStorage('test-key', 'initial-value');
    
    act(() => {
      result[1]('new-value');
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
    expect(result[0]).toBe('new-value');
  });

  it('handles function updates', () => {
    const { result } = useLocalStorage('test-key', 0);
    
    act(() => {
      result[1](prev => prev + 1);
    });
    
    expect(result[0]).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(1));
  });

  it('handles localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    const { result } = useLocalStorage('test-key', 'fallback-value');
    
    expect(result[0]).toBe('fallback-value');
  });
});

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated1', delay: 100 });
    rerender({ value: 'updated2', delay: 100 });
    rerender({ value: 'updated3', delay: 100 });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe('updated3');
  });
});

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throttles function calls', () => {
    const mockFn = jest.fn();
    const { result } = renderHook(() => useThrottle(mockFn, 100));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    expect(mockFn).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      result.current();
    });

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe('useApi', () => {
  it('initializes with correct state', () => {
    const { result } = useApi();

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('executes API call successfully', async () => {
    const mockApiCall = jest.fn().mockResolvedValue('success');
    const { result } = useApi();

    await act(async () => {
      await result.current.execute(mockApiCall);
    });

    expect(result.current.data).toBe('success');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockApiCall).toHaveBeenCalledTimes(1);
  });

  it('handles API call errors', async () => {
    const mockApiCall = jest.fn().mockRejectedValue(new Error('API Error'));
    const { result } = useApi();

    await act(async () => {
      try {
        await result.current.execute(mockApiCall);
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('API Error');
  });

  it('resets state correctly', () => {
    const { result } = useApi();

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});

describe('useApp hooks integration', () => {
  it('useApp provides correct context', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    expect(result.current.state).toBeDefined();
    expect(result.current.actions).toBeDefined();
    expect(result.current.state.tasks).toEqual([]);
    expect(result.current.state.notifications).toEqual([]);
  });

  it('useApp actions work correctly', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    act(() => {
      result.current.actions.addTask({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
        category: 'other',
        labels: [],
      });
    });

    expect(result.current.state.tasks).toHaveLength(1);
    expect(result.current.state.tasks[0].title).toBe('Test Task');
  });
});