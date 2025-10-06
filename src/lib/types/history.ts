/**
 * @file History Type Definitions
 * @description Type definitions for undo/redo history tracking
 *
 * Implements Command Pattern for state management:
 * - Each HistoryState is an immutable snapshot of adjustment values
 * - History stack stores up to 10 states (configurable)
 * - No ImageData stored (memory efficient - only state values)
 */

import type { MaterialPresetName } from './presets';

/**
 * Snapshot of adjustment state for history tracking
 *
 * Represents a single point in the history that can be restored via undo/redo.
 * Only stores adjustment values, not the processed image data (memory efficient).
 */
export interface HistoryState {
  /** Brightness adjustment (-100 to +100) */
  brightness: number;

  /** Contrast adjustment (-100 to +100) */
  contrast: number;

  /** Threshold value (0 to 255) */
  threshold: number;

  /** Selected material preset */
  preset: MaterialPresetName;
}

/**
 * History hook return type
 *
 * Defines the complete interface returned by useHistory hook.
 * Provides all necessary operations for undo/redo functionality.
 */
export interface UseHistoryReturn {
  /** Whether undo operation is available */
  canUndo: boolean;

  /** Whether redo operation is available */
  canRedo: boolean;

  /** Push a new state to history stack */
  push: (state: HistoryState) => void;

  /** Undo to previous state, returns the previous state or null if unavailable */
  undo: () => HistoryState | null;

  /** Redo to next state, returns the next state or null if unavailable */
  redo: () => HistoryState | null;

  /** Clear all history */
  clear: () => void;

  /** Current state in history (null if empty history) */
  currentState: HistoryState | null;
}
