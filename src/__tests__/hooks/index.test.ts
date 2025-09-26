import { renderHook, act } from '@testing-library/react-hooks';
import { useLocalStorage, useDebounce } from '../../hooks';

describe('Custom Hooks', () => {
  describe('useLocalStorage', () => {
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
      });
      mockLocalStorage.getItem.mockReturnValue(null);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('returns initial value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
      
      expect(result.current[0]).toBe('initial-value');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('returns stored value when localStorage has data', () => {
      mockLocalStorage.getItem.mockReturnValue('"stored-value"');
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
      
      expect(result.current[0]).toBe('stored-value');
    });

    it('updates localStorage when value changes', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
      
      act(() => {
        result.current[1]('new-value');
      });
      
      expect(result.current[0]).toBe('new-value');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', '"new-value"');
    });

    it('handles JSON parsing errors gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
      
      expect(result.current[0]).toBe('initial-value');
    });

    it('handles complex objects', () => {
      const complexObject = { name: 'test', value: 123 };
      
      const { result } = renderHook(() => useLocalStorage('test-key', complexObject));
      
      act(() => {
        result.current[1]({ name: 'updated', value: 456 });
      });
      
      expect(result.current[0]).toEqual({ name: 'updated', value: 456 });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', '{"name":"updated","value":456}');
    });
  });

  describe('useDebounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns the initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('hello', 500));
      expect(result.current).toBe('hello');
    });

    it('updates the debounced value after the specified delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'hello', delay: 500 } }
      );

      expect(result.current).toBe('hello');

      rerender({ value: 'world', delay: 500 });
      expect(result.current).toBe('hello'); // Value should not change immediately

      act(() => {
        jest.advanceTimersByTime(499);
      });
      expect(result.current).toBe('hello'); // Still not changed

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(result.current).toBe('world'); // Now it should change
    });

    it('resets the timer if the value changes before the delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'first', delay: 500 } }
      );

      expect(result.current).toBe('first');

      rerender({ value: 'second', delay: 500 });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(result.current).toBe('first'); // Still 'first'

      rerender({ value: 'third', delay: 500 }); // Change again
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(result.current).toBe('first'); // Still 'first'

      act(() => {
        jest.advanceTimersByTime(200); // Total 500ms from 'third' change
      });
      expect(result.current).toBe('third'); // Now it should be 'third'
    });

    it('handles multiple rerenders correctly', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'A', delay: 100 } }
      );

      expect(result.current).toBe('A');

      rerender({ value: 'B', delay: 100 });
      act(() => {
        jest.advanceTimersByTime(50);
      });
      rerender({ value: 'C', delay: 100 });
      act(() => {
        jest.advanceTimersByTime(50);
      });
      rerender({ value: 'D', delay: 100 });

      act(() => {
        jest.advanceTimersByTime(100); // D should now be applied
      });
      expect(result.current).toBe('D');
    });

    it('cleans up timeout on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      const { unmount } = renderHook(() => useDebounce('test', 1000));
      
      unmount();
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});
