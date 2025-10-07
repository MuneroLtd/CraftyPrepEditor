/**
 * Theme Toggle Component
 *
 * Provides a button to cycle through theme modes:
 * Light → Dark → System → Light
 *
 * Features:
 * - Visual icons for each theme (Sun, Moon, Monitor)
 * - Keyboard accessible (Enter, Space)
 * - ARIA labels for screen readers
 * - 44x44px touch target (WCAG AAA)
 * - High contrast in both themes
 */

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Theme cycle map
 * Defines the next theme for each current theme
 */
const THEME_CYCLE = {
  light: 'dark',
  dark: 'system',
  system: 'light',
} as const;

/**
 * Theme Toggle Button Component
 *
 * Cycles through theme modes on click.
 * Displays appropriate icon for current theme.
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  /**
   * Cycle to next theme
   */
  const handleClick = () => {
    const nextTheme = THEME_CYCLE[theme];
    setTheme(nextTheme);
  };

  /**
   * Get icon component for current theme
   */
  const IconComponent = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  }[theme];

  /**
   * Get accessible label describing current theme
   */
  const label = {
    light: 'Theme: Light (click to change)',
    dark: 'Theme: Dark (click to change)',
    system: 'Theme: System (click to change)',
  }[theme];

  return (
    <button
      onClick={handleClick}
      aria-label={label}
      className="
        flex items-center justify-center
        w-11 h-11
        rounded-lg
        bg-transparent
        text-primary-foreground
        hover:bg-primary-hover/20
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary-foreground/30
        focus-visible:ring-offset-2
        focus-visible:ring-offset-primary
        transition-[background-color,box-shadow]
        duration-200
        cursor-pointer
      "
      type="button"
    >
      <IconComponent className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}

export default ThemeToggle;
