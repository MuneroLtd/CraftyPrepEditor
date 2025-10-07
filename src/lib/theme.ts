/**
 * Theme Management Utilities
 *
 * Provides utilities for managing theme state:
 * - System theme detection (matchMedia)
 * - localStorage persistence
 * - Theme class application (document.documentElement)
 * - Type validation
 *
 * All functions handle missing browser APIs gracefully.
 */

/**
 * Theme mode types
 */
export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

/**
 * localStorage key for theme preference
 */
export const THEME_STORAGE_KEY = 'craftyprep-theme';

/**
 * Get the current system theme preference
 *
 * @returns 'dark' if system prefers dark, 'light' otherwise
 */
export function getSystemTheme(): EffectiveTheme {
  // Check if matchMedia is supported
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }

  // Check system preference
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDark ? 'dark' : 'light';
}

/**
 * Get stored theme preference from localStorage
 *
 * @returns Stored theme if valid, null otherwise
 */
export function getStoredTheme(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    // Validate stored value
    if (isValidTheme(stored)) {
      return stored;
    }

    // Clear invalid value
    localStorage.removeItem(THEME_STORAGE_KEY);
    return null;
  } catch {
    // localStorage not available or blocked
    return null;
  }
}

/**
 * Store theme preference in localStorage
 *
 * @param theme - Theme to store
 */
export function setStoredTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage not available or quota exceeded
    // Silently fail - app will still work, just no persistence
  }
}

/**
 * Apply theme by adding/removing dark class on document element
 *
 * @param theme - Effective theme to apply ('light' or 'dark')
 */
export function applyTheme(theme: EffectiveTheme): void {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Type guard to check if a value is a valid ThemeMode
 *
 * @param value - Value to check
 * @returns true if value is a valid ThemeMode
 */
export function isValidTheme(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}
