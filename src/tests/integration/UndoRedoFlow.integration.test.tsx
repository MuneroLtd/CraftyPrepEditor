import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from '@/hooks/useHistory';
import type { HistoryState } from '@/lib/types/history';

describe('Undo/Redo Flow Integration', () => {
  const createMockState = (brightness = 0, contrast = 0, threshold = 128): HistoryState => ({
    brightness,
    contrast,
    threshold,
    preset: 'auto',
  });

  describe('Complete Workflow', () => {
    it('supports full adjustment → undo → redo workflow', () => {
      const { result } = renderHook(() => useHistory());

      // Initial state: empty history
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);

      // Push initial state
      act(() => {
        result.current.push(createMockState(0, 0, 128));
      });

      expect(result.current.canUndo).toBe(true); // Can undo from index 0
      expect(result.current.canRedo).toBe(false);

      // Adjust brightness
      act(() => {
        result.current.push(createMockState(10, 0, 128));
      });

      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);

      // Adjust contrast
      act(() => {
        result.current.push(createMockState(10, 5, 128));
      });

      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);

      // Undo once (back to brightness=10, contrast=0)
      let undoResult: HistoryState | null = null;
      act(() => {
        undoResult = result.current.undo();
      });

      expect(undoResult).toEqual(
        expect.objectContaining({
          brightness: 10,
          contrast: 0,
          threshold: 128,
        })
      );
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(true);

      // Redo (back to brightness=10, contrast=5)
      let redoResult: HistoryState | null = null;
      act(() => {
        redoResult = result.current.redo();
      });

      expect(redoResult).toEqual(
        expect.objectContaining({
          brightness: 10,
          contrast: 5,
          threshold: 128,
        })
      );
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);
    });

    it('supports multiple undo and redo operations', () => {
      const { result } = renderHook(() => useHistory());

      // Build a history: 0 → 10 → 20 → 30
      act(() => {
        result.current.push(createMockState(0, 0, 128));
        result.current.push(createMockState(10, 0, 128));
        result.current.push(createMockState(20, 0, 128));
        result.current.push(createMockState(30, 0, 128));
      });

      // Current: brightness=30
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);

      // Undo three times: 30 → 20 → 10 → 0
      let state: HistoryState | null = null;

      act(() => {
        state = result.current.undo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(20);

      act(() => {
        state = result.current.undo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(10);

      act(() => {
        state = result.current.undo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(0);

      // After third undo, we're at index 0 (first state)
      // canUndo is true because currentIndex (0) >= 0
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(true);

      // Redo three times: 0 → 10 → 20 → 30
      act(() => {
        state = result.current.redo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(10);

      act(() => {
        state = result.current.redo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(20);

      act(() => {
        state = result.current.redo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(30);

      // Can't redo further (at latest state)
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);
    });
  });

  describe('Clear History Scenarios', () => {
    it('clears history on auto-prep', () => {
      const { result } = renderHook(() => useHistory());

      // Build history
      act(() => {
        result.current.push(createMockState(0, 0, 128));
        result.current.push(createMockState(10, 0, 128));
        result.current.push(createMockState(20, 0, 128));
      });

      expect(result.current.canUndo).toBe(true);

      // Auto-prep triggered → clear history
      act(() => {
        result.current.clear();
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);

      // Push new state after auto-prep
      act(() => {
        result.current.push(createMockState(0, 0, 150));
      });

      expect(result.current.canUndo).toBe(true); // Can undo from first state
    });

    it('clears history on reset', () => {
      const { result } = renderHook(() => useHistory());

      // Build history
      act(() => {
        result.current.push(createMockState(0, 0, 128));
        result.current.push(createMockState(10, 5, 128));
        result.current.push(createMockState(20, 10, 128));
      });

      expect(result.current.canUndo).toBe(true);

      // Reset triggered → clear history
      act(() => {
        result.current.clear();
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });

    it('clears history on new upload', () => {
      const { result } = renderHook(() => useHistory());

      // Image 1: Build history
      act(() => {
        result.current.push(createMockState(0, 0, 128));
        result.current.push(createMockState(10, 0, 128));
      });

      expect(result.current.canUndo).toBe(true);

      // New upload → clear history
      act(() => {
        result.current.clear();
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);

      // Image 2: Fresh start
      act(() => {
        result.current.push(createMockState(0, 0, 150));
        result.current.push(createMockState(5, 0, 150));
      });

      expect(result.current.canUndo).toBe(true); // Only for Image 2 adjustments
    });
  });

  describe('Branching Behavior', () => {
    it('clears redo history when making new adjustment after undo', () => {
      const { result } = renderHook(() => useHistory());

      // Build history: 0 → 10 → 20
      act(() => {
        result.current.push(createMockState(0, 0, 128));
        result.current.push(createMockState(10, 0, 128));
        result.current.push(createMockState(20, 0, 128));
      });

      // Undo twice: 20 → 10 → 0
      act(() => {
        result.current.undo();
        result.current.undo();
      });

      expect(result.current.canRedo).toBe(true); // Can redo to 10 and 20

      // Make new adjustment (brightness=15)
      act(() => {
        result.current.push(createMockState(15, 0, 128));
      });

      // Redo history cleared (can't get back to 10 or 20)
      expect(result.current.canRedo).toBe(false);
      expect(result.current.canUndo).toBe(true);

      // Undo should go back to 0
      let state: HistoryState | null = null;
      act(() => {
        state = result.current.undo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid adjustments with debouncing', () => {
      const { result } = renderHook(() => useHistory());

      // Simulate rapid slider movements (only final value should be pushed)
      act(() => {
        result.current.push(createMockState(0, 0, 128));
      });

      // Simulate debounced push after rapid changes
      act(() => {
        result.current.push(createMockState(25, 0, 128)); // Final debounced value
      });

      expect(result.current.canUndo).toBe(true);

      let state: HistoryState | null = null;
      act(() => {
        state = result.current.undo();
      });

      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(0);
    });

    it('handles alternating undo and redo operations', () => {
      const { result } = renderHook(() => useHistory());

      // Build history: 0 → 10 → 20
      act(() => {
        result.current.push(createMockState(0, 0, 128));
        result.current.push(createMockState(10, 0, 128));
        result.current.push(createMockState(20, 0, 128));
      });

      // Undo
      let state: HistoryState | null = null;
      act(() => {
        state = result.current.undo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(10);

      // Redo
      act(() => {
        state = result.current.redo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(20);

      // Undo again
      act(() => {
        state = result.current.undo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(10);

      // Undo again
      act(() => {
        state = result.current.undo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(0);

      // Redo twice
      act(() => {
        state = result.current.redo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(10);

      act(() => {
        state = result.current.redo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(20);
    });

    it('maintains correct state after multiple clear operations', () => {
      const { result } = renderHook(() => useHistory());

      // First session
      act(() => {
        result.current.push(createMockState(0, 0, 128));
        result.current.push(createMockState(10, 0, 128));
      });

      act(() => {
        result.current.clear();
      });

      // Second session
      act(() => {
        result.current.push(createMockState(0, 0, 150));
        result.current.push(createMockState(20, 0, 150));
      });

      act(() => {
        result.current.clear();
      });

      // Third session
      act(() => {
        result.current.push(createMockState(0, 0, 160));
        result.current.push(createMockState(30, 0, 160));
      });

      // Should only have third session history
      expect(result.current.canUndo).toBe(true);

      let state: HistoryState | null = null;
      act(() => {
        state = result.current.undo();
      });
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.brightness).toBe(0);
      // @ts-expect-error - Type narrowing issue with act()
      expect(state?.threshold).toBe(160);
    });
  });

  describe('Max History Limit', () => {
    it('enforces maximum history size (10 states)', () => {
      const { result } = renderHook(() => useHistory());

      // Push 15 states (exceeds MAX_HISTORY_SIZE of 10)
      act(() => {
        for (let i = 0; i < 15; i++) {
          result.current.push(createMockState(i, 0, 128));
        }
      });

      // Should only keep last 10 states (brightness 5-14)
      // Current index should be at 9 (last state, brightness=14)
      // Undo 10 times to get to currentIndex = -1
      let state: HistoryState | null = null;
      act(() => {
        for (let i = 0; i < 10; i++) {
          state = result.current.undo();
        }
      });

      // Last undo should return null (currentIndex = -1)
      expect(state).toBeNull();
      expect(result.current.canUndo).toBe(false); // currentIndex = -1, can't undo further
    });
  });

  describe('Callback Integration', () => {
    it('executes callback when state is restored from undo', () => {
      const onRestore = vi.fn();
      const { result } = renderHook(() => useHistory());

      // Build history
      act(() => {
        result.current.push(createMockState(0, 0, 128));
        result.current.push(createMockState(10, 0, 128));
      });

      // Undo with callback
      act(() => {
        const state = result.current.undo();
        if (state) {
          onRestore(state);
        }
      });

      expect(onRestore).toHaveBeenCalledWith(
        expect.objectContaining({
          brightness: 0,
          contrast: 0,
          threshold: 128,
        })
      );
    });

    it('executes callback when state is restored from redo', () => {
      const onRestore = vi.fn();
      const { result } = renderHook(() => useHistory());

      // Build history and undo
      act(() => {
        result.current.push(createMockState(0, 0, 128));
        result.current.push(createMockState(10, 0, 128));
        result.current.undo();
      });

      // Redo with callback
      act(() => {
        const state = result.current.redo();
        if (state) {
          onRestore(state);
        }
      });

      expect(onRestore).toHaveBeenCalledWith(
        expect.objectContaining({
          brightness: 10,
          contrast: 0,
          threshold: 128,
        })
      );
    });
  });
});
