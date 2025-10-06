/**
 * @file useHistory Hook Tests
 * @description Comprehensive unit tests for history management hook
 *
 * Tests the useHistory hook which implements undo/redo functionality
 * using a stack-based history with a maximum size limit.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../../../hooks/useHistory';
import type { HistoryState } from '../../../lib/types/history';
import type { MaterialPresetName } from '../../../lib/types/presets';

describe('useHistory hook', () => {
  beforeEach(() => {
    // Clean slate for each test
  });

  afterEach(() => {
    // Cleanup if needed
  });

  describe('Initialization', () => {
    it('should initialize with empty history', () => {
      const { result } = renderHook(() => useHistory());

      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
      expect(result.current.currentState).toBeNull();
    });

    it('should have all required methods defined', () => {
      const { result } = renderHook(() => useHistory());

      expect(typeof result.current.push).toBe('function');
      expect(typeof result.current.undo).toBe('function');
      expect(typeof result.current.redo).toBe('function');
      expect(typeof result.current.clear).toBe('function');
    });
  });

  describe('Push Operation', () => {
    it('should push state to history', () => {
      const { result } = renderHook(() => useHistory());

      const state: HistoryState = {
        brightness: 10,
        contrast: 5,
        threshold: 128,
        preset: 'auto',
      };

      act(() => {
        result.current.push(state);
      });

      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);
      expect(result.current.currentState).toEqual(state);
    });

    it('should handle multiple push operations', () => {
      const { result } = renderHook(() => useHistory());

      const state1: HistoryState = {
        brightness: 10,
        contrast: 5,
        threshold: 128,
        preset: 'auto',
      };

      const state2: HistoryState = {
        brightness: 20,
        contrast: 10,
        threshold: 130,
        preset: 'wood',
      };

      act(() => {
        result.current.push(state1);
        result.current.push(state2);
      });

      expect(result.current.canUndo).toBe(true);
      expect(result.current.currentState).toEqual(state2);
    });

    it('should push state with different preset types', () => {
      const { result } = renderHook(() => useHistory());

      const presets: MaterialPresetName[] = ['auto', 'wood', 'leather', 'acrylic'];

      presets.forEach((preset) => {
        act(() => {
          result.current.push({
            brightness: 0,
            contrast: 0,
            threshold: 128,
            preset,
          });
        });
      });

      expect(result.current.currentState?.preset).toBe('acrylic');
    });
  });

  describe('Undo Operation', () => {
    it('should undo to previous state', () => {
      const { result } = renderHook(() => useHistory());

      const state1: HistoryState = {
        brightness: 10,
        contrast: 5,
        threshold: 128,
        preset: 'auto',
      };

      const state2: HistoryState = {
        brightness: 20,
        contrast: 10,
        threshold: 130,
        preset: 'wood',
      };

      act(() => {
        result.current.push(state1);
        result.current.push(state2);
      });

      let undoneState: HistoryState | null = null;
      act(() => {
        undoneState = result.current.undo();
      });

      expect(undoneState).toEqual(state1);
      expect(result.current.currentState).toEqual(state1);
      expect(result.current.canUndo).toBe(true); // Can undo to before state1
      expect(result.current.canRedo).toBe(true); // Can redo to state2
    });

    it('should return null when no undo available', () => {
      const { result } = renderHook(() => useHistory());

      let undoneState: HistoryState | null = null;
      act(() => {
        undoneState = result.current.undo();
      });

      expect(undoneState).toBeNull();
      expect(result.current.canUndo).toBe(false);
    });

    it('should handle multiple consecutive undos', () => {
      const { result } = renderHook(() => useHistory());

      const states: HistoryState[] = [
        { brightness: 0, contrast: 0, threshold: 128, preset: 'auto' },
        { brightness: 10, contrast: 5, threshold: 130, preset: 'auto' },
        { brightness: 20, contrast: 10, threshold: 135, preset: 'wood' },
        { brightness: 30, contrast: 15, threshold: 140, preset: 'leather' },
      ];

      act(() => {
        states.forEach((state) => result.current.push(state));
      });

      // Undo 3 times
      act(() => {
        result.current.undo(); // back to state 2
        result.current.undo(); // back to state 1
        result.current.undo(); // back to state 0
      });

      expect(result.current.currentState).toEqual(states[0]);
      expect(result.current.canUndo).toBe(true); // Can undo to before state 0
      expect(result.current.canRedo).toBe(true); // Can redo
    });

    it('should stop at oldest state', () => {
      const { result } = renderHook(() => useHistory());

      const state: HistoryState = {
        brightness: 10,
        contrast: 5,
        threshold: 128,
        preset: 'auto',
      };

      act(() => {
        result.current.push(state);
      });

      // Undo once (to before first push - empty state)
      act(() => {
        result.current.undo();
      });

      expect(result.current.canUndo).toBe(false);

      // Try to undo again (should return null)
      let undoneState: HistoryState | null = null;
      act(() => {
        undoneState = result.current.undo();
      });

      expect(undoneState).toBeNull();
    });
  });

  describe('Redo Operation', () => {
    it('should redo to next state after undo', () => {
      const { result } = renderHook(() => useHistory());

      const state1: HistoryState = {
        brightness: 10,
        contrast: 5,
        threshold: 128,
        preset: 'auto',
      };

      const state2: HistoryState = {
        brightness: 20,
        contrast: 10,
        threshold: 130,
        preset: 'wood',
      };

      act(() => {
        result.current.push(state1);
        result.current.push(state2);
        result.current.undo();
      });

      let redoneState: HistoryState | null = null;
      act(() => {
        redoneState = result.current.redo();
      });

      expect(redoneState).toEqual(state2);
      expect(result.current.currentState).toEqual(state2);
      expect(result.current.canRedo).toBe(false); // At newest state
      expect(result.current.canUndo).toBe(true);
    });

    it('should return null when no redo available', () => {
      const { result } = renderHook(() => useHistory());

      let redoneState: HistoryState | null = null;
      act(() => {
        redoneState = result.current.redo();
      });

      expect(redoneState).toBeNull();
      expect(result.current.canRedo).toBe(false);
    });

    it('should handle multiple consecutive redos', () => {
      const { result } = renderHook(() => useHistory());

      const states: HistoryState[] = [
        { brightness: 0, contrast: 0, threshold: 128, preset: 'auto' },
        { brightness: 10, contrast: 5, threshold: 130, preset: 'auto' },
        { brightness: 20, contrast: 10, threshold: 135, preset: 'wood' },
      ];

      act(() => {
        states.forEach((state) => result.current.push(state));
        // Undo to first state
        result.current.undo();
        result.current.undo();
      });

      // Redo twice
      act(() => {
        result.current.redo();
        result.current.redo();
      });

      expect(result.current.currentState).toEqual(states[2]);
      expect(result.current.canRedo).toBe(false);
    });
  });

  describe('Clear Operation', () => {
    it('should clear all history', () => {
      const { result } = renderHook(() => useHistory());

      const states: HistoryState[] = [
        { brightness: 0, contrast: 0, threshold: 128, preset: 'auto' },
        { brightness: 10, contrast: 5, threshold: 130, preset: 'auto' },
        { brightness: 20, contrast: 10, threshold: 135, preset: 'wood' },
      ];

      act(() => {
        states.forEach((state) => result.current.push(state));
      });

      expect(result.current.canUndo).toBe(true);

      act(() => {
        result.current.clear();
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
      expect(result.current.currentState).toBeNull();
    });

    it('should clear history after undo', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.push({ brightness: 10, contrast: 5, threshold: 128, preset: 'auto' });
        result.current.push({ brightness: 20, contrast: 10, threshold: 130, preset: 'wood' });
        result.current.undo();
      });

      expect(result.current.canRedo).toBe(true);

      act(() => {
        result.current.clear();
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });
  });

  describe('History Size Limit (Max 10 States)', () => {
    it('should limit history to 10 states', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        // Push 15 states
        for (let i = 0; i < 15; i++) {
          result.current.push({
            brightness: i,
            contrast: 0,
            threshold: 128,
            preset: 'auto',
          });
        }
      });

      // After pushing 15 states, only last 10 should be kept
      // currentIndex should be at 9 (last state)
      // We should be able to undo 9 times to get to state 5 (oldest kept state)
      let undoCount = 0;

      // Undo until we can't anymore
      for (let i = 0; i < 20; i++) {
        if (result.current.canUndo) {
          act(() => {
            const undone = result.current.undo();
            if (undone !== null) {
              undoCount++;
            }
          });
        } else {
          break;
        }
      }

      // Should only have 10 states total = 9 undo operations (from state 14 to state 5)
      expect(undoCount).toBe(9);
    });

    it('should drop oldest states when exceeding limit', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        // Push 12 states
        for (let i = 0; i < 12; i++) {
          result.current.push({
            brightness: i * 10,
            contrast: 0,
            threshold: 128,
            preset: 'auto',
          });
        }
      });

      // Undo 9 times to reach the oldest available state
      act(() => {
        for (let i = 0; i < 9; i++) {
          result.current.undo();
        }
      });

      // Oldest state should be state 2 (states 0 and 1 dropped)
      // After undoing 9 times from state 11, we're at state 2
      expect(result.current.currentState?.brightness).toBe(20); // brightness for state 2
    });
  });

  describe('Redo Stack Truncation', () => {
    it('should clear redo stack on new push after undo', () => {
      const { result } = renderHook(() => useHistory());

      const states: HistoryState[] = [
        { brightness: 0, contrast: 0, threshold: 128, preset: 'auto' },
        { brightness: 10, contrast: 5, threshold: 130, preset: 'auto' },
        { brightness: 20, contrast: 10, threshold: 135, preset: 'wood' },
      ];

      act(() => {
        states.forEach((state) => result.current.push(state));
        result.current.undo(); // Now at state 1
        result.current.undo(); // Now at state 0
      });

      expect(result.current.canRedo).toBe(true);

      // Push a new state
      const newState: HistoryState = {
        brightness: 50,
        contrast: 25,
        threshold: 150,
        preset: 'metal',
      };

      act(() => {
        result.current.push(newState);
      });

      // Redo should now be unavailable (redo stack truncated)
      expect(result.current.canRedo).toBe(false);
      expect(result.current.currentState).toEqual(newState);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid push operations', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.push({
            brightness: i,
            contrast: 0,
            threshold: 128,
            preset: 'auto',
          });
        }
      });

      expect(result.current.currentState?.brightness).toBe(4);
      expect(result.current.canUndo).toBe(true);
    });

    it('should handle alternating undo/redo operations', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.push({ brightness: 10, contrast: 5, threshold: 128, preset: 'auto' });
        result.current.push({ brightness: 20, contrast: 10, threshold: 130, preset: 'wood' });
      });

      act(() => {
        result.current.undo();
        result.current.redo();
        result.current.undo();
        result.current.redo();
      });

      expect(result.current.currentState?.brightness).toBe(20);
    });

    it('should handle undo at oldest state gracefully', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.push({ brightness: 10, contrast: 5, threshold: 128, preset: 'auto' });
        result.current.undo(); // At index -1 (before first state)
      });

      let state: HistoryState | null = null;
      act(() => {
        state = result.current.undo();
      });

      expect(state).toBeNull();
      expect(result.current.canUndo).toBe(false);
    });

    it('should handle redo at newest state gracefully', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.push({ brightness: 10, contrast: 5, threshold: 128, preset: 'auto' });
      });

      let state: HistoryState | null = null;
      act(() => {
        state = result.current.redo();
      });

      expect(state).toBeNull();
      expect(result.current.canRedo).toBe(false);
    });
  });

  describe('State Immutability', () => {
    it('should not mutate pushed states', () => {
      const { result } = renderHook(() => useHistory());

      const originalState: HistoryState = {
        brightness: 10,
        contrast: 5,
        threshold: 128,
        preset: 'auto',
      };

      const stateCopy = { ...originalState };

      act(() => {
        result.current.push(originalState);
      });

      // Modify original state
      originalState.brightness = 999;

      // Current state should not be affected
      expect(result.current.currentState?.brightness).toBe(stateCopy.brightness);
    });
  });

  describe('Real-World Usage Scenarios', () => {
    it('should simulate typical undo/redo workflow', () => {
      const { result } = renderHook(() => useHistory());

      // User adjusts brightness
      act(() => {
        result.current.push({ brightness: 10, contrast: 0, threshold: 128, preset: 'auto' });
      });

      // User adjusts contrast
      act(() => {
        result.current.push({ brightness: 10, contrast: 5, threshold: 128, preset: 'auto' });
      });

      // User adjusts threshold
      act(() => {
        result.current.push({ brightness: 10, contrast: 5, threshold: 135, preset: 'auto' });
      });

      expect(result.current.currentState?.threshold).toBe(135);

      // User undoes twice
      act(() => {
        result.current.undo();
        result.current.undo();
      });

      expect(result.current.currentState?.contrast).toBe(0);

      // User redoes once
      act(() => {
        result.current.redo();
      });

      expect(result.current.currentState?.contrast).toBe(5);
    });

    it('should handle history clear on reset', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.push({ brightness: 10, contrast: 5, threshold: 128, preset: 'auto' });
        result.current.push({ brightness: 20, contrast: 10, threshold: 130, preset: 'wood' });
      });

      // Simulate reset button click
      act(() => {
        result.current.clear();
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });
  });
});
