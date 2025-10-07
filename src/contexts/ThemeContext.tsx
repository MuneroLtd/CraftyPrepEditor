/**
 * Theme Context and Provider
 *
 * Manages application theme state with:
 * - Three theme modes: 'light', 'dark', 'system'
 * - Automatic system theme detection and sync
 * - localStorage persistence
 * - Document class management for Tailwind dark mode
 */

/* eslint-disable react-refresh/only-export-components */
// Reason: Co-locating useTheme hook with ThemeProvider is idiomatic React pattern.
// Splitting into separate file would add unnecessary import boilerplate.
// HMR still functions correctly with this suppression.

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  type ThemeMode,
  type EffectiveTheme,
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  applyTheme,
} from '@/lib/theme';

/**
 * Theme context interface
 */
interface ThemeContextType {
  /** Current theme mode ('light' | 'dark' | 'system') */
  theme: ThemeMode;

  /** Update theme mode */
  setTheme: (theme: ThemeMode) => void;

  /** Effective theme with 'system' resolved to 'light' or 'dark' */
  effectiveTheme: EffectiveTheme;

  /** Error state if theme initialization or operations fail */
  error: Error | null;
}

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme provider props
 */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme Provider Component
 *
 * Provides theme state and management to the component tree.
 * Handles initialization, persistence, and system theme synchronization.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Error state
  const [error, setError] = useState<Error | null>(null);

  // Initialize theme from localStorage or default to 'system'
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      return getStoredTheme() || 'system';
    } catch (err) {
      // Log error in development
      if (import.meta.env.DEV) {
        console.error('Failed to initialize theme from localStorage:', err);
      }
      setError(err instanceof Error ? err : new Error('Theme initialization failed'));
      return 'system'; // Fallback to system theme
    }
  });

  // Track system theme for 'system' mode
  const [systemTheme, setSystemTheme] = useState<EffectiveTheme>(() => {
    try {
      return getSystemTheme();
    } catch (err) {
      // Log error in development
      if (import.meta.env.DEV) {
        console.error('Failed to detect system theme:', err);
      }
      setError(err instanceof Error ? err : new Error('System theme detection failed'));
      return 'light'; // Fallback to light theme
    }
  });

  // Calculate effective theme
  const effectiveTheme: EffectiveTheme = theme === 'system' ? systemTheme : theme;

  /**
   * Update theme and persist to localStorage
   */
  const setTheme = (newTheme: ThemeMode) => {
    try {
      setThemeState(newTheme);
      setStoredTheme(newTheme);
      // Clear error on successful operation
      if (error) {
        setError(null);
      }
    } catch (err) {
      // Log error in development
      if (import.meta.env.DEV) {
        console.error('Failed to update theme:', err);
      }
      setError(err instanceof Error ? err : new Error('Theme update failed'));
    }
  };

  /**
   * Apply theme class on mount and when theme changes
   */
  useEffect(() => {
    try {
      applyTheme(effectiveTheme);
    } catch (err) {
      // Log error in development
      if (import.meta.env.DEV) {
        console.error('Failed to apply theme:', err);
      }
      setError(err instanceof Error ? err : new Error('Theme application failed'));
    }
  }, [effectiveTheme]);

  /**
   * Listen for system theme changes
   * Only updates when theme is 'system'
   */
  useEffect(() => {
    try {
      // Check if matchMedia is supported
      if (typeof window === 'undefined' || !window.matchMedia) {
        return;
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (event: MediaQueryListEvent) => {
        try {
          // Only update if user has 'system' preference
          if (theme === 'system') {
            setSystemTheme(event.matches ? 'dark' : 'light');
          }
        } catch (err) {
          // Log error in development
          if (import.meta.env.DEV) {
            console.error('Failed to handle system theme change:', err);
          }
          setError(err instanceof Error ? err : new Error('System theme change failed'));
        }
      };

      // Add listener
      mediaQuery.addEventListener('change', handleChange);

      // Cleanup
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } catch (err) {
      // Log error in development
      if (import.meta.env.DEV) {
        console.error('Failed to set up system theme listener:', err);
      }
      setError(err instanceof Error ? err : new Error('System theme listener setup failed'));
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme, error }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 *
 * Must be used within a ThemeProvider.
 *
 * @throws {Error} If used outside ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, setTheme, effectiveTheme } = useTheme();
 *
 *   return (
 *     <button onClick={() => setTheme('dark')}>
 *       Current: {effectiveTheme}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
