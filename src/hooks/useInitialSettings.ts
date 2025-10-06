/**
 * Initial Settings Hook
 *
 * Loads persisted settings from localStorage on initial mount.
 * Returns the loaded settings or null if none exist.
 */

import { useState, useEffect } from 'react';
import { loadSettings } from '@/lib/utils/settingsStorage';
import type { PersistedSettings } from '@/lib/utils/settingsStorage';

/**
 * Hook to load initial settings from localStorage
 *
 * Runs once on mount and returns the persisted settings if they exist.
 *
 * @returns PersistedSettings if valid data exists, null otherwise
 */
export function useInitialSettings(): PersistedSettings | null {
  const [settings, setSettings] = useState<PersistedSettings | null>(null);

  useEffect(() => {
    // Load settings only once on mount
    const loaded = loadSettings();
    setSettings(loaded);
  }, []); // Empty dependency array ensures this runs only once

  return settings;
}
