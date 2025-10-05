/**
 * Tests for useDelayedLoading hook
 *
 * Tests delayed loading state management to prevent loading indicator flashing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDelayedLoading } from '@/hooks/useDelayedLoading';

describe('useDelayedLoading', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false initially when processing starts', () => {
    const { result } = renderHook(() => useDelayedLoading(true, 500));

    expect(result.current).toBe(false);
  });

  it('returns true after delay if still processing', () => {
    const { result } = renderHook(() => useDelayedLoading(true, 500));

    // Initial state
    expect(result.current).toBe(false);

    // Fast-forward 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should now show loading
    expect(result.current).toBe(true);
  });

  it('returns false if processing finishes before delay', () => {
    const { result, rerender } = renderHook(
      ({ isProcessing }) => useDelayedLoading(isProcessing, 500),
      { initialProps: { isProcessing: true } }
    );

    // Initial state
    expect(result.current).toBe(false);

    // Fast-forward 300ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Stop processing before delay completes
    rerender({ isProcessing: false });

    // Fast-forward remaining time
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Should NOT show loading (processing finished before delay)
    expect(result.current).toBe(false);
  });

  it('clears timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useDelayedLoading(true, 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('resets loading state immediately when processing stops after delay', () => {
    const { result, rerender } = renderHook(
      ({ isProcessing }) => useDelayedLoading(isProcessing, 500),
      { initialProps: { isProcessing: true } }
    );

    // Fast-forward past delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Loading should be visible
    expect(result.current).toBe(true);

    // Stop processing
    rerender({ isProcessing: false });

    // Loading should hide immediately
    expect(result.current).toBe(false);
  });

  it('handles multiple processing cycles correctly', () => {
    const { result, rerender } = renderHook(
      ({ isProcessing }) => useDelayedLoading(isProcessing, 500),
      { initialProps: { isProcessing: false } }
    );

    // Start processing
    rerender({ isProcessing: true });
    expect(result.current).toBe(false);

    // Fast-forward past delay
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe(true);

    // Stop processing
    rerender({ isProcessing: false });
    expect(result.current).toBe(false);

    // Start processing again
    rerender({ isProcessing: true });
    expect(result.current).toBe(false);

    // Fast-forward past delay again
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe(true);
  });

  it('uses custom delay value', () => {
    const { result } = renderHook(() => useDelayedLoading(true, 1000));

    // Initial state
    expect(result.current).toBe(false);

    // Fast-forward 500ms (less than custom delay)
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe(false);

    // Fast-forward remaining 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe(true);
  });

  it('handles delay value changes', () => {
    const { result, rerender } = renderHook(({ delay }) => useDelayedLoading(true, delay), {
      initialProps: { delay: 500 },
    });

    expect(result.current).toBe(false);

    // Change delay
    rerender({ delay: 300 });

    // Fast-forward 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should show loading with new delay
    expect(result.current).toBe(true);
  });
});
