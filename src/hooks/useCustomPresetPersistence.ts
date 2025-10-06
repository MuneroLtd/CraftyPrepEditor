/**
 * Custom hook for managing custom preset persistence to localStorage
 *
 * Features:
 * - Automatic persistence when selectedPreset is 'custom'
 * - Debounced writes (500ms) for performance
 * - Input validation before saving
 * - Error handling for localStorage failures
 * - Separation of concerns (SRP)
 *
 * This hook addresses multiple code quality issues:
 * - DRY: Eliminates duplicated persistence logic across slider handlers
 * - SRP: Separates persistence logic from state management
 * - Security: Validates data before persisting
 * - Performance: Debounces rapid writes
 * - Error Handling: Gracefully handles localStorage failures
 */

import { useEffect, useRef } from 'react';
import type { CustomPresetData } from '@/lib/utils/presetValidation';

const STORAGE_KEY = 'craftyprep-custom-preset';
const DEBOUNCE_DELAY_MS = 500;

/**
 * Saves custom preset to localStorage with debouncing
 *
 * Automatically persists brightness, contrast, and threshold adjustments
 * when the user has selected the 'custom' preset.
 *
 * @param selectedPreset - Currently selected preset name
 * @param brightness - Current brightness value
 * @param contrast - Current contrast value
 * @param threshold - Current threshold value (absolute, will be normalized to Otsu baseline)
 * @param otsuThreshold - Calculated Otsu threshold baseline
 *
 * @example
 * ```typescript
 * // In App.tsx:
 * useCustomPresetPersistence(
 *   selectedPreset,
 *   brightness,
 *   contrast,
 *   threshold,
 *   otsuThreshold
 * );
 * ```
 */
export function useCustomPresetPersistence(
  selectedPreset: string,
  brightness: number,
  contrast: number,
  threshold: number,
  otsuThreshold: number | null
): void {
  // Use ref to store timeout ID for debouncing
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Only persist if custom preset is selected and we have Otsu value
    if (selectedPreset !== 'custom' || otsuThreshold === null) {
      return;
    }

    // Clear any pending timeout
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    // Debounce the localStorage write
    timeoutRef.current = window.setTimeout(() => {
      try {
        const customData: CustomPresetData = {
          brightness,
          contrast,
          threshold: threshold - otsuThreshold, // Normalize to Otsu baseline
        };

        // Validate before saving (defensive programming)
        if (
          typeof customData.brightness === 'number' &&
          typeof customData.contrast === 'number' &&
          typeof customData.threshold === 'number' &&
          Number.isFinite(customData.brightness) &&
          Number.isFinite(customData.contrast) &&
          Number.isFinite(customData.threshold)
        ) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(customData));
        } else {
          console.warn('Invalid custom preset data, not saving');
        }
      } catch (error) {
        // Handle localStorage errors gracefully
        // Possible causes: quota exceeded, private mode, disabled localStorage
        console.error('Failed to save custom preset to localStorage:', error);
        // In production, could show a toast notification to user
      }
    }, DEBOUNCE_DELAY_MS);

    // Cleanup function: clear timeout on unmount or dependency change
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [selectedPreset, brightness, contrast, threshold, otsuThreshold]);
}

/**
 * Clears custom preset from localStorage
 *
 * Useful when resetting to default values or switching to a different preset.
 *
 * @example
 * ```typescript
 * clearCustomPreset(); // Call when resetting to auto preset
 * ```
 */
export function clearCustomPreset(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear custom preset from localStorage:', error);
  }
}
