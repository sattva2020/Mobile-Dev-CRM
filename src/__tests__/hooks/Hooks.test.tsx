import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-hooks';
import { useDebounce, useLocalStorage, useSessionStorage, useAsync, useInterval, useTimeout, usePrevious, useToggle, useCounter, useArray, useObject, useForm, useValidation, useApi, useGitHub, useAI, useNotifications, useSettings, useTheme, useLanguage, useKeyboard, useMouse, useScroll, useResize, useFocus, useHover, useClickOutside, useKeyPress, useLongPress, useDoubleClick, useSwipe, usePinch, useRotate, useGesture, useAnimation, useTransition, useSpring, useTween, useEasing, useTiming, useSequence, useStagger, useChain, useTrail, useSprings, useSpringRef, useSpringValue, useSpringValues, useSpringConfig, useSpringProps, useSpringResult, useSpringSet, useSpringGet, useSpringStart, useSpringStop, useSpringPause, useSpringResume, useSpringCancel, useSpringReset, useSpringRestart, useSpringUpdate, useSpringDestroy, useSpringCreate, useSpringMount, useSpringUnmount, useSpringEffect, useSpringCallback, useSpringMemo, useSpringRef as useSpringRefHook, useSpringValue as useSpringValueHook, useSpringValues as useSpringValuesHook, useSpringConfig as useSpringConfigHook, useSpringProps as useSpringPropsHook, useSpringResult as useSpringResultHook, useSpringSet as useSpringSetHook, useSpringGet as useSpringGetHook, useSpringStart as useSpringStartHook, useSpringStop as useSpringStopHook, useSpringPause as useSpringPauseHook, useSpringResume as useSpringResumeHook, useSpringCancel as useSpringCancelHook, useSpringReset as useSpringResetHook, useSpringRestart as useSpringRestartHook, useSpringUpdate as useSpringUpdateHook, useSpringDestroy as useSpringDestroyHook, useSpringCreate as useSpringCreateHook, useSpringMount as useSpringMountHook, useSpringUnmount as useSpringUnmountHook, useSpringEffect as useSpringEffectHook, useSpringCallback as useSpringCallbackHook, useSpringMemo as useSpringMemoHook } from '../../hooks';

describe('Custom Hooks', () => {
  describe('useDebounce', () => {
    it('should return the initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('hello', 500));
      expect(result.current).toBe('hello');
    });

    it('should update the debounced value after the specified delay', () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'hello', delay: 500 },
      });

      expect(result.current).toBe('hello');

      rerender({ value: 'world', delay: 500 });
      expect(result.current).toBe('hello');

      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.current).toBe('world');
    });

    it('should reset the timer if the value changes before the delay', () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'first', delay: 500 },
      });

      expect(result.current).toBe('first');

      rerender({ value: 'second', delay: 500 });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(result.current).toBe('first');

      rerender({ value: 'third', delay: 500 });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(result.current).toBe('first');

      act(() => {
        jest.advanceTimersByTime(200);
      });
      expect(result.current).toBe('third');
    });
  });

  describe('useLocalStorage', () => {
    it('should return the initial value if no stored value exists', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
      expect(result.current[0]).toBe('default-value');
    });

    it('should return the stored value if it exists', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'));
      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
      expect(result.current[0]).toBe('stored-value');
    });

    it('should update the stored value when setValue is called', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
      
      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
    });

    it('should handle JSON serialization/deserialization', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', { a: 1, b: 2 }));
      
      act(() => {
        result.current[1]({ a: 3, b: 4 });
      });

      expect(result.current[0]).toEqual({ a: 3, b: 4 });
    });
  });

  describe('useSessionStorage', () => {
    it('should return the initial value if no stored value exists', () => {
      const { result } = renderHook(() => useSessionStorage('test-key', 'default-value'));
      expect(result.current[0]).toBe('default-value');
    });

    it('should return the stored value if it exists', () => {
      sessionStorage.setItem('test-key', JSON.stringify('stored-value'));
      const { result } = renderHook(() => useSessionStorage('test-key', 'default-value'));
      expect(result.current[0]).toBe('stored-value');
    });

    it('should update the stored value when setValue is called', () => {
      const { result } = renderHook(() => useSessionStorage('test-key', 'default-value'));
      
      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
      expect(sessionStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
    });
  });

  describe('useAsync', () => {
    it('should handle successful async operations', async () => {
      const asyncFn = jest.fn().mockResolvedValue('success');
      const { result } = renderHook(() => useAsync(asyncFn));

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBe('success');
        expect(result.current.error).toBeUndefined();
      });
    });

    it('should handle failed async operations', async () => {
      const asyncFn = jest.fn().mockRejectedValue(new Error('failed'));
      const { result } = renderHook(() => useAsync(asyncFn));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toEqual(new Error('failed'));
      });
    });

    it('should execute the async function on mount', () => {
      const asyncFn = jest.fn().mockResolvedValue('success');
      renderHook(() => useAsync(asyncFn));

      expect(asyncFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('useInterval', () => {
    it('should call the callback at the specified interval', () => {
      const callback = jest.fn();
      renderHook(() => useInterval(callback, 1000));

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should not call the callback if interval is null', () => {
      const callback = jest.fn();
      renderHook(() => useInterval(callback, null));

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('useTimeout', () => {
    it('should call the callback after the specified delay', () => {
      const callback = jest.fn();
      renderHook(() => useTimeout(callback, 1000));

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call the callback if delay is null', () => {
      const callback = jest.fn();
      renderHook(() => useTimeout(callback, null));

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('usePrevious', () => {
    it('should return undefined for the first render', () => {
      const { result } = renderHook(() => usePrevious('hello'));
      expect(result.current).toBeUndefined();
    });

    it('should return the previous value on subsequent renders', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: 'hello' },
      });

      expect(result.current).toBeUndefined();

      rerender({ value: 'world' });
      expect(result.current).toBe('hello');

      rerender({ value: 'universe' });
      expect(result.current).toBe('world');
    });
  });

  describe('useToggle', () => {
    it('should return false by default', () => {
      const { result } = renderHook(() => useToggle());
      expect(result.current[0]).toBe(false);
    });

    it('should return the initial value', () => {
      const { result } = renderHook(() => useToggle(true));
      expect(result.current[0]).toBe(true);
    });

    it('should toggle the value when toggle is called', () => {
      const { result } = renderHook(() => useToggle(false));
      
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(false);
    });

    it('should set the value when setValue is called', () => {
      const { result } = renderHook(() => useToggle(false));
      
      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });
  });

  describe('useCounter', () => {
    it('should return 0 by default', () => {
      const { result } = renderHook(() => useCounter());
      expect(result.current[0]).toBe(0);
    });

    it('should return the initial value', () => {
      const { result } = renderHook(() => useCounter(5));
      expect(result.current[0]).toBe(5);
    });

    it('should increment the counter', () => {
      const { result } = renderHook(() => useCounter(0));
      
      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(1);
    });

    it('should decrement the counter', () => {
      const { result } = renderHook(() => useCounter(5));
      
      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe(4);
    });

    it('should set the counter value', () => {
      const { result } = renderHook(() => useCounter(0));
      
      act(() => {
        result.current[3](10);
      });

      expect(result.current[0]).toBe(10);
    });

    it('should reset the counter', () => {
      const { result } = renderHook(() => useCounter(5));
      
      act(() => {
        result.current[1]();
        result.current[1]();
      });

      expect(result.current[0]).toBe(7);

      act(() => {
        result.current[4]();
      });

      expect(result.current[0]).toBe(5);
    });
  });

  describe('useArray', () => {
    it('should return an empty array by default', () => {
      const { result } = renderHook(() => useArray());
      expect(result.current[0]).toEqual([]);
    });

    it('should return the initial array', () => {
      const { result } = renderHook(() => useArray([1, 2, 3]));
      expect(result.current[0]).toEqual([1, 2, 3]);
    });

    it('should add items to the array', () => {
      const { result } = renderHook(() => useArray([1, 2]));
      
      act(() => {
        result.current[1](3);
      });

      expect(result.current[0]).toEqual([1, 2, 3]);
    });

    it('should remove items from the array', () => {
      const { result } = renderHook(() => useArray([1, 2, 3]));
      
      act(() => {
        result.current[2](1);
      });

      expect(result.current[0]).toEqual([2, 3]);
    });

    it('should clear the array', () => {
      const { result } = renderHook(() => useArray([1, 2, 3]));
      
      act(() => {
        result.current[3]();
      });

      expect(result.current[0]).toEqual([]);
    });
  });

  describe('useObject', () => {
    it('should return an empty object by default', () => {
      const { result } = renderHook(() => useObject());
      expect(result.current[0]).toEqual({});
    });

    it('should return the initial object', () => {
      const { result } = renderHook(() => useObject({ a: 1, b: 2 }));
      expect(result.current[0]).toEqual({ a: 1, b: 2 });
    });

    it('should update the object', () => {
      const { result } = renderHook(() => useObject({ a: 1 }));
      
      act(() => {
        result.current[1]({ a: 2, b: 3 });
      });

      expect(result.current[0]).toEqual({ a: 2, b: 3 });
    });

    it('should merge the object', () => {
      const { result } = renderHook(() => useObject({ a: 1, b: 2 }));
      
      act(() => {
        result.current[2]({ b: 3, c: 4 });
      });

      expect(result.current[0]).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should clear the object', () => {
      const { result } = renderHook(() => useObject({ a: 1, b: 2 }));
      
      act(() => {
        result.current[3]();
      });

      expect(result.current[0]).toEqual({});
    });
  });
});