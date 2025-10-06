/**
 * Validation utilities for custom preset data
 *
 * Ensures localStorage data is valid before applying to application state.
 * Prevents security issues from malicious or corrupted data.
 */

/**
 * Custom preset data structure
 */
export interface CustomPresetData {
  brightness: number;
  contrast: number;
  threshold: number;
}

/**
 * Validates custom preset data from localStorage
 *
 * Checks:
 * - Data structure is correct
 * - All values are numbers
 * - All values are within valid ranges
 *
 * @param data - Unknown data from localStorage
 * @returns True if data is valid, false otherwise
 *
 * @example
 * ```typescript
 * const saved = localStorage.getItem('custom-preset');
 * if (saved) {
 *   const data = JSON.parse(saved);
 *   if (isValidCustomPreset(data)) {
 *     // Safe to use data
 *   }
 * }
 * ```
 */
export function isValidCustomPreset(data: unknown): data is CustomPresetData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const preset = data as Record<string, unknown>;

  // Check brightness: number in range [-100, 100]
  if (
    typeof preset.brightness !== 'number' ||
    !Number.isFinite(preset.brightness) ||
    preset.brightness < -100 ||
    preset.brightness > 100
  ) {
    return false;
  }

  // Check contrast: number in range [-100, 100]
  if (
    typeof preset.contrast !== 'number' ||
    !Number.isFinite(preset.contrast) ||
    preset.contrast < -100 ||
    preset.contrast > 100
  ) {
    return false;
  }

  // Check threshold: number in range [-50, 50]
  if (
    typeof preset.threshold !== 'number' ||
    !Number.isFinite(preset.threshold) ||
    preset.threshold < -50 ||
    preset.threshold > 50
  ) {
    return false;
  }

  return true;
}

/**
 * Safely loads custom preset from localStorage
 *
 * Returns null if:
 * - No saved preset exists
 * - Parsing fails
 * - Validation fails
 *
 * @returns Valid custom preset data or null
 *
 * @example
 * ```typescript
 * const customPreset = loadCustomPreset();
 * if (customPreset) {
 *   setBrightness(customPreset.brightness);
 *   setContrast(customPreset.contrast);
 *   setThreshold(otsuThreshold + customPreset.threshold);
 * }
 * ```
 */
export function loadCustomPreset(): CustomPresetData | null {
  try {
    const saved = localStorage.getItem('craftyprep-custom-preset');
    if (!saved) {
      return null;
    }

    const parsed = JSON.parse(saved);

    if (isValidCustomPreset(parsed)) {
      return parsed;
    } else {
      console.warn('Invalid custom preset data in localStorage, removing');
      localStorage.removeItem('craftyprep-custom-preset');
      return null;
    }
  } catch (error) {
    console.error('Failed to load custom preset from localStorage:', error);
    return null;
  }
}
