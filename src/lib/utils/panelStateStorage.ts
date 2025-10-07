/**
 * Panel State Storage Utility
 *
 * Manages persistence of control panel expand/collapse state to localStorage.
 * Provides type-safe operations with validation and error handling.
 *
 * @module panelStateStorage
 */

/**
 * Panel state interface defining which sections are expanded
 */
export interface PanelState {
  /** Whether Material Presets section is expanded */
  materialPresets: boolean;
  /** Whether Background Removal section is expanded */
  backgroundRemoval: boolean;
  /** Whether Adjustments section is expanded */
  adjustments: boolean;
  /** Whether History section is expanded */
  history: boolean;
  /** Whether Export section is expanded */
  export: boolean;
  /** Whether Actions section is expanded */
  actions: boolean;
}

/** localStorage key for panel state */
const STORAGE_KEY = 'craftyprep_panel_state';

/**
 * Default panel state - all sections expanded for discoverability
 */
const DEFAULT_STATE: PanelState = {
  materialPresets: true,
  backgroundRemoval: true,
  adjustments: true,
  history: true,
  export: true,
  actions: true,
};

/**
 * Save panel state to localStorage
 *
 * @param state - Panel state to save
 *
 * @example
 * ```ts
 * savePanelState({
 *   materialPresets: true,
 *   backgroundRemoval: false,
 *   adjustments: true,
 *   history: true,
 *   export: true,
 *   actions: true,
 * });
 * ```
 */
export function savePanelState(state: PanelState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn(
        'localStorage quota exceeded. Panel state will not persist. ' +
          'Consider clearing browser data or using private browsing mode.'
      );
    } else {
      console.warn('Failed to save panel state:', error);
    }
  }
}

/**
 * Load panel state from localStorage
 *
 * Returns default state if:
 * - No saved state exists
 * - Saved state is invalid JSON
 * - Saved state fails schema validation
 * - localStorage is unavailable
 *
 * @returns Panel state from localStorage or default state
 *
 * @example
 * ```ts
 * const state = loadPanelState();
 * // { materialPresets: true, backgroundRemoval: true, ... }
 * ```
 */
export function loadPanelState(): PanelState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;

    const parsed = JSON.parse(stored);

    // Validate schema
    if (!isValidPanelState(parsed)) {
      console.warn('Invalid panel state schema, using defaults');
      return DEFAULT_STATE;
    }

    return parsed;
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'SecurityError') {
        console.warn('localStorage access denied (private browsing?). Using default panel state.');
      } else if (error instanceof SyntaxError) {
        console.warn('Corrupted panel state data. Using default panel state.');
      } else {
        console.warn('Failed to load panel state:', error);
      }
    } else {
      console.warn('Failed to load panel state:', error);
    }
    return DEFAULT_STATE;
  }
}

/**
 * Clear panel state from localStorage
 *
 * Used to reset to default state (all sections expanded).
 *
 * @example
 * ```ts
 * clearPanelState();
 * ```
 */
export function clearPanelState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear panel state:', error);
  }
}

/**
 * Validate that an object conforms to PanelState schema
 *
 * Checks:
 * - Object exists and is an object
 * - All required fields present
 * - All fields are boolean type
 *
 * @param obj - Object to validate
 * @returns True if valid PanelState, false otherwise
 *
 * @internal
 */
function isValidPanelState(obj: unknown): obj is PanelState {
  if (!obj || typeof obj !== 'object') return false;

  const required: (keyof PanelState)[] = [
    'materialPresets',
    'backgroundRemoval',
    'adjustments',
    'history',
    'export',
    'actions',
  ];

  return required.every((key) => {
    return key in obj && typeof (obj as Record<string, unknown>)[key] === 'boolean';
  });
}
