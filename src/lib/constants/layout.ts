/**
 * Layout constants for panel sizing and constraints
 *
 * These values are used across EditorLayout and useLayoutPreferences
 * to ensure consistent panel sizing behavior.
 */
export const PANEL_CONSTRAINTS = {
  /**
   * Minimum panel width in pixels
   * Below this width, panels become unusable
   */
  MIN_WIDTH: 200,

  /**
   * Maximum panel width in pixels
   * Above this width, panels take too much screen space
   */
  MAX_WIDTH: 600,

  /**
   * Default panel width in pixels
   * Used on first load before user resizes
   */
  DEFAULT_WIDTH: 400,
} as const;
