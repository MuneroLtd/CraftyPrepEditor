/**
 * usePanelState Hook
 *
 * Custom hook for managing control panel expand/collapse state with persistence.
 * Handles loading initial state from localStorage and saving changes.
 *
 * @module usePanelState
 */

import { useState, useCallback } from 'react';
import { savePanelState, loadPanelState, type PanelState } from '@/lib/utils/panelStateStorage';

/**
 * Return type for usePanelState hook
 */
export interface UsePanelStateReturn {
  /** Current panel state */
  state: PanelState;
  /** Update a specific section's expanded state */
  updateSection: (section: keyof PanelState, expanded: boolean) => void;
}

/**
 * Hook for managing control panel section expanded/collapsed state
 *
 * Features:
 * - Loads initial state from localStorage
 * - Auto-saves changes to localStorage
 * - Memoized update function for performance
 * - Type-safe section updates
 *
 * @returns Panel state and update function
 *
 * @example
 * ```tsx
 * function ControlPanel() {
 *   const { state, updateSection } = usePanelState();
 *
 *   return (
 *     <Accordion
 *       value={Object.keys(state).filter(k => state[k])}
 *       onValueChange={(value) => {
 *         Object.keys(state).forEach((section) => {
 *           updateSection(section, value.includes(section));
 *         });
 *       }}
 *     >
 *       {/ * sections * /}
 *     </Accordion>
 *   );
 * }
 * ```
 */
export function usePanelState(): UsePanelStateReturn {
  // Load initial state from localStorage on mount
  const [state, setState] = useState<PanelState>(() => loadPanelState());

  /**
   * Update a specific section's expanded state
   *
   * Updates both local state and persists to localStorage.
   * Memoized to maintain referential stability.
   *
   * @param section - Section key to update
   * @param expanded - Whether section should be expanded
   */
  const updateSection = useCallback((section: keyof PanelState, expanded: boolean) => {
    setState((prev) => {
      const newState = { ...prev, [section]: expanded };
      savePanelState(newState);
      return newState;
    });
  }, []);

  return { state, updateSection };
}
