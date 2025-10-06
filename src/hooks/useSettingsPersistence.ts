/**
 * Settings Persistence Hook
 *
 * Automatically saves user settings to localStorage with debouncing.
 * Returns a function to manually clear settings.
 */

import { useEffect, useRef } from 'react';
import { saveSettings, clearSettings, CURRENT_VERSION } from '@/lib/utils/settingsStorage';
import type { MaterialPresetName } from '@/lib/types/presets';

const DEBOUNCE_DELAY = 500; // ms

/**
 * Hook to persist settings to localStorage
 *
 * @param selectedPreset - Currently selected preset
 * @param brightness - Brightness adjustment value (-100 to 100)
 * @param contrast - Contrast adjustment value (-100 to 100)
 * @param threshold - Threshold value (0 to 255)
 * @returns Function to clear settings from localStorage
 */
export function useSettingsPersistence(
  selectedPreset: MaterialPresetName,
  brightness: number,
  contrast: number,
  threshold: number
): () => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevValuesRef = useRef<{
    selectedPreset: MaterialPresetName;
    brightness: number;
    contrast: number;
    threshold: number;
  } | null>(null);

  useEffect(() => {
    const isInitialRender = prevValuesRef.current === null;

    // Check if values have actually changed (skip check on initial render)
    if (!isInitialRender) {
      const hasChanged =
        prevValuesRef.current!.selectedPreset !== selectedPreset ||
        prevValuesRef.current!.brightness !== brightness ||
        prevValuesRef.current!.contrast !== contrast ||
        prevValuesRef.current!.threshold !== threshold;

      if (!hasChanged) {
        return;
      }
    }

    // Update previous values
    prevValuesRef.current = { selectedPreset, brightness, contrast, threshold };

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      saveSettings({
        selectedPreset,
        brightness,
        contrast,
        threshold,
        version: CURRENT_VERSION,
      });
    }, DEBOUNCE_DELAY);

    // Cleanup on unmount or before next effect
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [selectedPreset, brightness, contrast, threshold]);

  // Return clear function for UI integration
  return clearSettings;
}
