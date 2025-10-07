import { useState, useEffect, useCallback, useRef } from 'react';
import { PANEL_CONSTRAINTS } from '../lib/constants/layout';

export interface LayoutPreferences {
  leftSidebarVisible: boolean;
  rightPanelVisible: boolean;
  rightPanelWidth: number;
  statusBarVisible: boolean;
  expandedSections: Record<string, boolean>;
}

const DEFAULT_PREFERENCES: LayoutPreferences = {
  leftSidebarVisible: true,
  rightPanelVisible: true,
  rightPanelWidth: PANEL_CONSTRAINTS.DEFAULT_WIDTH,
  statusBarVisible: true,
  expandedSections: {
    properties: true,
    adjustments: true,
    layers: false,
  },
};

// Whitelist of allowed section IDs to prevent prototype pollution
const ALLOWED_SECTIONS = ['properties', 'adjustments', 'layers'] as const;

const STORAGE_KEY = 'craftyprep-layout-preferences';
// Debounce delay balances UI responsiveness with localStorage I/O frequency
const DEBOUNCE_DELAY = 300;

/**
 * Validate and sanitize expandedSections to prevent prototype pollution
 */
function validateExpandedSections(sections: unknown): Record<string, boolean> {
  if (!sections || typeof sections !== 'object') {
    return DEFAULT_PREFERENCES.expandedSections;
  }

  // Create a clean object without prototype chain
  const validated = Object.create(null) as Record<string, boolean>;
  const sectionObj = sections as Record<string, unknown>;

  // Only copy whitelisted sections
  for (const key of ALLOWED_SECTIONS) {
    if (key in sectionObj && typeof sectionObj[key] === 'boolean') {
      validated[key] = sectionObj[key];
    } else {
      // Use default if missing or invalid
      validated[key] = DEFAULT_PREFERENCES.expandedSections[key];
    }
  }

  return validated;
}

/**
 * Validate and sanitize layout preferences
 */
function validatePreferences(prefs: unknown): LayoutPreferences {
  if (!prefs || typeof prefs !== 'object') {
    return DEFAULT_PREFERENCES;
  }

  const p = prefs as Partial<LayoutPreferences>;

  return {
    leftSidebarVisible:
      typeof p.leftSidebarVisible === 'boolean'
        ? p.leftSidebarVisible
        : DEFAULT_PREFERENCES.leftSidebarVisible,
    rightPanelVisible:
      typeof p.rightPanelVisible === 'boolean'
        ? p.rightPanelVisible
        : DEFAULT_PREFERENCES.rightPanelVisible,
    rightPanelWidth:
      typeof p.rightPanelWidth === 'number' &&
      Number.isFinite(p.rightPanelWidth) &&
      p.rightPanelWidth > 0
        ? Math.max(
            PANEL_CONSTRAINTS.MIN_WIDTH,
            Math.min(PANEL_CONSTRAINTS.MAX_WIDTH, p.rightPanelWidth)
          )
        : DEFAULT_PREFERENCES.rightPanelWidth,
    statusBarVisible:
      typeof p.statusBarVisible === 'boolean'
        ? p.statusBarVisible
        : DEFAULT_PREFERENCES.statusBarVisible,
    expandedSections: validateExpandedSections(p.expandedSections),
  };
}

/**
 * Load preferences from localStorage with error handling
 */
function loadPreferences(): LayoutPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(stored);
    return validatePreferences(parsed);
  } catch (error) {
    console.error('Failed to load layout preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save preferences to localStorage with error handling
 */
function savePreferences(prefs: LayoutPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('Failed to save layout preferences:', error);
  }
}

/**
 * Hook for managing layout preferences with localStorage persistence
 *
 * Features:
 * - Loads preferences from localStorage on mount
 * - Saves preferences to localStorage on change (debounced)
 * - Validates stored data
 * - Handles localStorage errors gracefully
 * - Provides reset function
 */
export function useLayoutPreferences() {
  const [preferences, setPreferences] = useState<LayoutPreferences>(loadPreferences);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);

  // Debounced save to localStorage (skip initial mount)
  useEffect(() => {
    // Skip save on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      savePreferences(preferences);
      saveTimeoutRef.current = null;
    }, DEBOUNCE_DELAY);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
        // Flush final save before unmount to prevent data loss
        savePreferences(preferences);
      }
    };
  }, [preferences]);

  // DEFAULT_PREFERENCES is a stable module constant, safe to omit from deps
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return {
    preferences,
    updatePreferences: setPreferences,
    resetPreferences,
  };
}
