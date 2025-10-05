/**
 * @file useDebounce Hook Tests
 * @description Unit tests for debouncing hook
 *
 * Tests the useDebounce hook which delays value updates until
 * the value stops changing for a specified delay period.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 500));

      expect(result.current).toBe('initial');
    });

    it('should update value after delay', () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'initial', delay: 500 },
      });

      expect(result.current).toBe('initial');

      // Change value
      rerender({ value: 'updated', delay: 500 });

      // Value should not change immediately
      expect(result.current).toBe('initial');

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Value should update after delay
      expect(result.current).toBe('updated');
    });

    it('should work with different data types', () => {
      // Number
      const { result: numberResult, rerender: numberRerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: 0 } }
      );

      numberRerender({ value: 42 });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(numberResult.current).toBe(42);

      // Boolean
      const { result: boolResult, rerender: boolRerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: false } }
      );

      boolRerender({ value: true });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(boolResult.current).toBe(true);

      // Object
      const { result: objResult, rerender: objRerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: { x: 1 } } }
      );

      const newObj = { x: 2 };
      objRerender({ value: newObj });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(objResult.current).toEqual(newObj);
    });
  });

  describe('Debouncing Behavior', () => {
    it('should reset timer on rapid changes', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: 'initial' },
      });

      // Rapid changes
      rerender({ value: 'change1' });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current).toBe('initial'); // Not updated yet

      rerender({ value: 'change2' });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current).toBe('initial'); // Timer reset, still not updated

      rerender({ value: 'final' });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(result.current).toBe('final'); // Finally updated after delay
    });

    it('should only update with final value after rapid changes', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
        initialProps: { value: 0 },
      });

      // Simulate slider dragging (rapid changes)
      for (let i = 1; i <= 10; i++) {
        rerender({ value: i * 10 });
        act(() => {
          vi.advanceTimersByTime(50); // Less than delay
        });
      }

      // Value should still be initial
      expect(result.current).toBe(0);

      // Complete the delay after last change
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should update to final value (100)
      expect(result.current).toBe(100);
    });
  });

  describe('Delay Configuration', () => {
    it('should respect different delay values', () => {
      // 100ms delay
      const { result: result100, rerender: rerender100 } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: 'a' } }
      );

      rerender100({ value: 'b' });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result100.current).toBe('b');

      // 1000ms delay
      const { result: result1000, rerender: rerender1000 } = renderHook(
        ({ value }) => useDebounce(value, 1000),
        { initialProps: { value: 'x' } }
      );

      rerender1000({ value: 'y' });
      act(() => {
        vi.advanceTimersByTime(999); // Just before delay
      });
      expect(result1000.current).toBe('x'); // Not updated yet

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result1000.current).toBe('y'); // Updated after exact delay
    });

    it('should handle zero delay (immediate update)', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 0), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current).toBe('updated');
    });
  });

  describe('Cleanup', () => {
    it('should cleanup timer on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      // Unmount before delay completes
      unmount();

      // clearTimeout should be called
      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    it('should cancel pending update on unmount', () => {
      const { result, unmount, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      // Unmount before delay
      unmount();

      // Advance time (should not update)
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Value should remain initial (not updated after unmount)
      expect(result.current).toBe('initial');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce<string | undefined>(value, 100),
        {
          initialProps: { value: undefined as string | undefined },
        }
      );

      expect(result.current).toBeUndefined();

      rerender({ value: 'defined' as string | undefined });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current).toBe('defined');
    });

    it('should handle null value', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce<string | null>(value, 100),
        {
          initialProps: { value: null as string | null },
        }
      );

      expect(result.current).toBeNull();

      rerender({ value: 'not null' as string | null });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current).toBe('not null');
    });

    it('should handle same value updates (no unnecessary re-renders)', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
        initialProps: { value: 'same' },
      });

      // Update with same value
      rerender({ value: 'same' });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Value remains same
      expect(result.current).toBe('same');
    });
  });

  describe('Real-World Use Case: Slider Adjustment', () => {
    it('should simulate brightness slider drag behavior', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
        initialProps: { value: 0 },
      });

      // Simulate slider drag (brightness 0 → 50)
      const brightnessValues = [0, 10, 20, 30, 40, 50];

      brightnessValues.forEach((brightness, index) => {
        if (index > 0) {
          rerender({ value: brightness });
          act(() => {
            vi.advanceTimersByTime(20); // Rapid changes (< 100ms delay)
          });
        }
      });

      // Value should still be initial (debounced)
      expect(result.current).toBe(0);

      // User stops dragging, wait for debounce
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Value updates to final position
      expect(result.current).toBe(50);
    });
  });
});
