import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveSettings,
  loadSettings,
  clearSettings,
  isValidPersistedSettings,
  STORAGE_KEY,
  CURRENT_VERSION,
} from '@/lib/utils/settingsStorage';
import type { PersistedSettings } from '@/lib/utils/settingsStorage';

describe('settingsStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('isValidPersistedSettings', () => {
    it('should validate correct settings', () => {
      const validSettings: PersistedSettings = {
        selectedPreset: 'wood',
        brightness: 10,
        contrast: 20,
        threshold: 128,
        version: CURRENT_VERSION,
      };
      expect(isValidPersistedSettings(validSettings)).toBe(true);
    });

    it('should reject settings with invalid preset', () => {
      const invalid = {
        selectedPreset: 'invalid-preset',
        brightness: 0,
        contrast: 0,
        threshold: 128,
        version: CURRENT_VERSION,
      };
      expect(isValidPersistedSettings(invalid)).toBe(false);
    });

    it('should reject settings with out-of-range brightness', () => {
      const invalid = {
        selectedPreset: 'auto',
        brightness: 150, // Out of range (-100 to 100)
        contrast: 0,
        threshold: 128,
        version: CURRENT_VERSION,
      };
      expect(isValidPersistedSettings(invalid)).toBe(false);
    });

    it('should reject settings with out-of-range contrast', () => {
      const invalid = {
        selectedPreset: 'auto',
        brightness: 0,
        contrast: -150, // Out of range (-100 to 100)
        threshold: 128,
        version: CURRENT_VERSION,
      };
      expect(isValidPersistedSettings(invalid)).toBe(false);
    });

    it('should reject settings with out-of-range threshold', () => {
      const invalid = {
        selectedPreset: 'auto',
        brightness: 0,
        contrast: 0,
        threshold: 300, // Out of range (0 to 255)
        version: CURRENT_VERSION,
      };
      expect(isValidPersistedSettings(invalid)).toBe(false);
    });

    it('should reject settings with missing fields', () => {
      const invalid = {
        selectedPreset: 'auto',
        brightness: 0,
        // Missing contrast, threshold, version
      };
      expect(isValidPersistedSettings(invalid)).toBe(false);
    });

    it('should reject non-object values', () => {
      expect(isValidPersistedSettings(null)).toBe(false);
      expect(isValidPersistedSettings(undefined)).toBe(false);
      expect(isValidPersistedSettings('string')).toBe(false);
      expect(isValidPersistedSettings(123)).toBe(false);
    });

    it('should validate all valid preset types', () => {
      const presets = ['auto', 'wood', 'leather', 'acrylic', 'glass', 'metal', 'custom'];
      presets.forEach((preset) => {
        const settings = {
          selectedPreset: preset,
          brightness: 0,
          contrast: 0,
          threshold: 128,
          version: CURRENT_VERSION,
        };
        expect(isValidPersistedSettings(settings)).toBe(true);
      });
    });
  });

  describe('saveSettings', () => {
    it('should save valid settings to localStorage', () => {
      const settings: PersistedSettings = {
        selectedPreset: 'wood',
        brightness: 10,
        contrast: 20,
        threshold: 130,
        version: CURRENT_VERSION,
      };

      const result = saveSettings(settings);
      expect(result).toBe(true);

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(settings);
    });

    it('should return false when localStorage is unavailable', () => {
      // Mock localStorage.setItem to throw
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      const settings: PersistedSettings = {
        selectedPreset: 'auto',
        brightness: 0,
        contrast: 0,
        threshold: 128,
        version: CURRENT_VERSION,
      };

      const result = saveSettings(settings);
      expect(result).toBe(false);

      setItemSpy.mockRestore();
    });

    it('should return false when quota exceeded', () => {
      // Mock localStorage.setItem to throw QuotaExceededError
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      setItemSpy.mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const settings: PersistedSettings = {
        selectedPreset: 'auto',
        brightness: 0,
        contrast: 0,
        threshold: 128,
        version: CURRENT_VERSION,
      };

      const result = saveSettings(settings);
      expect(result).toBe(false);

      setItemSpy.mockRestore();
    });

    it('should not save invalid settings', () => {
      const invalid = {
        selectedPreset: 'invalid',
        brightness: 200,
        contrast: 0,
        threshold: 128,
        version: CURRENT_VERSION,
      };

      const result = saveSettings(invalid as PersistedSettings);
      expect(result).toBe(false);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('loadSettings', () => {
    it('should load valid settings from localStorage', () => {
      const settings: PersistedSettings = {
        selectedPreset: 'leather',
        brightness: -10,
        contrast: 15,
        threshold: 125,
        version: CURRENT_VERSION,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

      const loaded = loadSettings();
      expect(loaded).toEqual(settings);
    });

    it('should return null when no settings exist', () => {
      const loaded = loadSettings();
      expect(loaded).toBeNull();
    });

    it('should return null when settings are invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json {');

      const loaded = loadSettings();
      expect(loaded).toBeNull();

      // Should clear corrupted data
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should return null when settings fail validation', () => {
      const invalid = {
        selectedPreset: 'invalid',
        brightness: 0,
        contrast: 0,
        threshold: 128,
        version: CURRENT_VERSION,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalid));

      const loaded = loadSettings();
      expect(loaded).toBeNull();

      // Should clear invalid data
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should return null when localStorage is unavailable', () => {
      // Mock localStorage.getItem to throw
      const getItemSpy = vi.spyOn(localStorage, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      const loaded = loadSettings();
      expect(loaded).toBeNull();

      getItemSpy.mockRestore();
    });

    it('should handle corrupted data and clear it', () => {
      localStorage.setItem(STORAGE_KEY, 'corrupted data');

      const loaded = loadSettings();
      expect(loaded).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('clearSettings', () => {
    it('should remove settings from localStorage', () => {
      const settings: PersistedSettings = {
        selectedPreset: 'auto',
        brightness: 0,
        contrast: 0,
        threshold: 128,
        version: CURRENT_VERSION,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

      clearSettings();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should not throw when settings do not exist', () => {
      expect(() => clearSettings()).not.toThrow();
    });

    it('should not throw when localStorage is unavailable', () => {
      const removeItemSpy = vi.spyOn(localStorage, 'removeItem');
      removeItemSpy.mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      expect(() => clearSettings()).not.toThrow();

      removeItemSpy.mockRestore();
    });
  });

  describe('integration scenarios', () => {
    it('should handle save → load → clear cycle', () => {
      const settings: PersistedSettings = {
        selectedPreset: 'metal',
        brightness: 25,
        contrast: -15,
        threshold: 140,
        version: CURRENT_VERSION,
      };

      // Save
      const saved = saveSettings(settings);
      expect(saved).toBe(true);

      // Load
      const loaded = loadSettings();
      expect(loaded).toEqual(settings);

      // Clear
      clearSettings();
      const loadedAfterClear = loadSettings();
      expect(loadedAfterClear).toBeNull();
    });

    it('should handle multiple saves (overwrite)', () => {
      const settings1: PersistedSettings = {
        selectedPreset: 'wood',
        brightness: 10,
        contrast: 10,
        threshold: 130,
        version: CURRENT_VERSION,
      };

      const settings2: PersistedSettings = {
        selectedPreset: 'glass',
        brightness: -20,
        contrast: 30,
        threshold: 120,
        version: CURRENT_VERSION,
      };

      saveSettings(settings1);
      saveSettings(settings2);

      const loaded = loadSettings();
      expect(loaded).toEqual(settings2); // Should have settings2 (last write wins)
    });
  });
});
