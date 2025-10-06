/**
 * @file useHistory Hook
 * @description History management hook for undo/redo functionality
 *
 * Implements Command Pattern with immutable state snapshots:
 * - Maintains history stack with configurable maximum size
 * - Supports undo/redo operations
 * - Memory efficient (stores only state values, not ImageData)
 * - Automatic redo stack truncation on new changes
 */

import { useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import type { HistoryState, UseHistoryReturn } from '../lib/types/history';

/** Maximum number of states to keep in history */
const MAX_HISTORY_SIZE = 10;

/**
 * History management hook for undo/redo functionality
 *
 * Provides a stack-based history system with the following features:
 * - Push new states to history
 * - Undo to previous states
 * - Redo to next states (if available)
 * - Clear all history
 * - Automatic size limiting (drops oldest states when exceeding max)
 * - Redo stack truncation on new push after undo
 *
 * @returns History management interface
 *
 * @example
 * ```tsx
 * const { canUndo, canRedo, push, undo, redo, clear } = useHistory();
 *
 * // Push new state
 * push({ brightness: 10, contrast: 5, threshold: 128, preset: 'auto' });
 *
 * // Undo
 * if (canUndo) {
 *   const previousState = undo();
 *   // Apply previousState to UI
 * }
 *
 * // Redo
 * if (canRedo) {
 *   const nextState = redo();
 *   // Apply nextState to UI
 * }
 * ```
 */
/** Internal state structure combining history and index */
interface HistoryInternalState {
  history: HistoryState[];
  currentIndex: number;
}

export function useHistory(): UseHistoryReturn {
  /** Combined state for atomic updates */
  const [state, setState] = useState<HistoryInternalState>({
    history: [],
    currentIndex: -1,
  });

  const { history, currentIndex } = state;

  /** Whether undo operation is available (can go back from current position) */
  const canUndo = currentIndex >= 0;

  /** Whether redo operation is available */
  const canRedo = currentIndex < history.length - 1;

  /** Current state in history (null if no history or at index -1) */
  const currentState = currentIndex >= 0 ? history[currentIndex] : null;

  /**
   * Push a new state to history
   *
   * Behavior:
   * - Truncates history at current index (clears redo stack)
   * - Adds new state
   * - Limits total size to MAX_HISTORY_SIZE (drops oldest if needed)
   * - Advances current index
   *
   * @param state - State to push to history
   */
  const push = useCallback((newState: HistoryState) => {
    // Create defensive copy to prevent mutations
    const stateCopy: HistoryState = {
      brightness: newState.brightness,
      contrast: newState.contrast,
      threshold: newState.threshold,
      preset: newState.preset,
    };

    setState((prev) => {
      // Truncate history at current index (clear redo stack)
      const truncated = prev.history.slice(0, prev.currentIndex + 1);

      // Add new state
      let newHistory = [...truncated, stateCopy];

      // Limit to MAX_HISTORY_SIZE (drop oldest if needed)
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_SIZE);
      }

      // Calculate new index (always points to last state after push)
      const newIndex = newHistory.length - 1;

      return {
        history: newHistory,
        currentIndex: newIndex,
      };
    });
  }, []);

  /**
   * Undo to previous state
   *
   * @returns Previous state (the state after undo), or null if no previous state exists
   *
   * Note: This can return null when undoing from the first state (currentIndex=0 → -1).
   * In this case, the redo stack will still contain the undone state, allowing redo.
   */
  const undo = useCallback((): HistoryState | null => {
    let resultState: HistoryState | null = null;

    // Use flushSync to ensure state update completes before returning
    // This is safe to call from event handlers (undo button click)
    flushSync(() => {
      setState((prev) => {
        if (prev.currentIndex < 0) {
          resultState = null;
          return prev; // No change if can't undo
        }

        const newIndex = prev.currentIndex - 1;
        resultState = newIndex >= 0 ? prev.history[newIndex] : null;

        return {
          history: prev.history,
          currentIndex: newIndex,
        };
      });
    });

    return resultState;
  }, []);

  /**
   * Redo to next state
   *
   * @returns Next state, or null if redo unavailable
   */
  const redo = useCallback((): HistoryState | null => {
    let resultState: HistoryState | null = null;

    // Use flushSync to ensure state update completes before returning
    // This is safe to call from event handlers (redo button click)
    flushSync(() => {
      setState((prev) => {
        if (prev.currentIndex >= prev.history.length - 1) {
          resultState = null;
          return prev; // No change if can't redo
        }

        const newIndex = prev.currentIndex + 1;
        resultState = prev.history[newIndex];

        return {
          history: prev.history,
          currentIndex: newIndex,
        };
      });
    });

    return resultState;
  }, []);

  /**
   * Clear all history
   *
   * Resets history stack and index to initial state.
   */
  const clear = useCallback(() => {
    setState({
      history: [],
      currentIndex: -1,
    });
  }, []);

  return {
    canUndo,
    canRedo,
    push,
    undo,
    redo,
    clear,
    currentState,
  };
}
