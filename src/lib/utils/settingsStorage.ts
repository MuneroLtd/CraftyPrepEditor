/**
 * Settings Storage Utilities
 *
 * Handles localStorage operations for persisting user settings.
 * Privacy-focused: only stores preset selection and slider values, no sensitive data.
 */

import type { MaterialPresetName } from '@/lib/types/presets';
import { VALID_PRESET_NAMES } from '@/lib/presets/presetConfigurations';

export const STORAGE_KEY = 'craftyprep-settings';
export const CURRENT_VERSION = 1;

/**
 * Interface for persisted settings in localStorage
 */
export interface PersistedSettings {
  selectedPreset: MaterialPresetName;
  brightness: number;
  contrast: number;
  threshold: number;
  version: number;
}

/**
 * Validates that a value is a valid PersistedSettings object
 */
export function isValidPersistedSettings(value: unknown): value is PersistedSettings {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const settings = value as Record<string, unknown>;

  // Check all required fields exist
  if (
    typeof settings.selectedPreset !== 'string' ||
    typeof settings.brightness !== 'number' ||
    typeof settings.contrast !== 'number' ||
    typeof settings.threshold !== 'number' ||
    typeof settings.version !== 'number'
  ) {
    return false;
  }

  // Validate preset is one of the valid options
  if (!VALID_PRESET_NAMES.includes(settings.selectedPreset as MaterialPresetName)) {
    return false;
  }

  // Validate brightness range (-100 to 100)
  if (settings.brightness < -100 || settings.brightness > 100) {
    return false;
  }

  // Validate contrast range (-100 to 100)
  if (settings.contrast < -100 || settings.contrast > 100) {
    return false;
  }

  // Validate threshold range (0 to 255)
  if (settings.threshold < 0 || settings.threshold > 255) {
    return false;
  }

  return true;
}

/**
 * Saves settings to localStorage
 * @returns true if successful, false otherwise
 */
export function saveSettings(settings: PersistedSettings): boolean {
  // Validate before saving
  if (!isValidPersistedSettings(settings)) {
    console.warn('Invalid settings, not saving to localStorage');
    return false;
  }

  try {
    const serialized = JSON.stringify(settings);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    // Handle localStorage unavailable, quota exceeded, etc.
    console.warn('Failed to save settings to localStorage:', error);
    return false;
  }
}

/**
 * Loads settings from localStorage
 * @returns PersistedSettings if valid data exists, null otherwise
 */
export function loadSettings(): PersistedSettings | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    if (isValidPersistedSettings(parsed)) {
      return parsed;
    } else {
      // Invalid data, clear it
      console.warn('Invalid settings data in localStorage, clearing');
      clearSettings();
      return null;
    }
  } catch (error) {
    // Handle parse errors, localStorage unavailable, etc.
    console.warn('Failed to load settings from localStorage:', error);

    // Try to clear corrupted data
    try {
      clearSettings();
    } catch {
      // Ignore errors when clearing
    }

    return null;
  }
}

/**
 * Clears settings from localStorage
 */
export function clearSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Handle localStorage unavailable
    console.warn('Failed to clear settings from localStorage:', error);
  }
}
