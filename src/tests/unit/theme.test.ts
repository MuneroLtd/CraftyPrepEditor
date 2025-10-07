import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  isValidTheme,
  THEME_STORAGE_KEY,
} from '@/lib/theme';

describe('theme utilities', () => {
  describe('getSystemTheme', () => {
    beforeEach(() => {
      // Reset matchMedia mock before each test
      delete (window as unknown as { matchMedia?: unknown }).matchMedia;
    });

    it('returns "dark" when system prefers dark', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      expect(getSystemTheme()).toBe('dark');
    });

    it('returns "light" when system prefers light', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      expect(getSystemTheme()).toBe('light');
    });

    it('returns "light" when matchMedia is not supported', () => {
      delete (window as unknown as { matchMedia?: unknown }).matchMedia;

      expect(getSystemTheme()).toBe('light');
    });
  });

  describe('getStoredTheme', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('returns stored theme when valid', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('returns null when no theme is stored', () => {
      expect(getStoredTheme()).toBeNull();
    });

    it('returns null when stored value is invalid', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'invalid-theme');
      expect(getStoredTheme()).toBeNull();
    });

    it('returns null and clears storage when localStorage throws', () => {
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = vi.fn(() => {
        throw new Error('localStorage not available');
      });

      expect(getStoredTheme()).toBeNull();

      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe('setStoredTheme', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('stores valid theme in localStorage', () => {
      setStoredTheme('dark');
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    });

    it('stores "system" theme', () => {
      setStoredTheme('system');
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
    });

    it('does not throw when localStorage is disabled', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => setStoredTheme('dark')).not.toThrow();

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('applyTheme', () => {
    beforeEach(() => {
      // Reset document classList
      document.documentElement.className = '';
    });

    afterEach(() => {
      document.documentElement.className = '';
    });

    it('adds "dark" class when applying dark theme', () => {
      applyTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes "dark" class when applying light theme', () => {
      document.documentElement.classList.add('dark');
      applyTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('preserves other classes when applying theme', () => {
      document.documentElement.classList.add('some-other-class');
      applyTheme('dark');
      expect(document.documentElement.classList.contains('some-other-class')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('isValidTheme', () => {
    it('returns true for "light"', () => {
      expect(isValidTheme('light')).toBe(true);
    });

    it('returns true for "dark"', () => {
      expect(isValidTheme('dark')).toBe(true);
    });

    it('returns true for "system"', () => {
      expect(isValidTheme('system')).toBe(true);
    });

    it('returns false for invalid string', () => {
      expect(isValidTheme('invalid')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isValidTheme(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isValidTheme(undefined)).toBe(false);
    });

    it('returns false for number', () => {
      expect(isValidTheme(123)).toBe(false);
    });

    it('returns false for object', () => {
      expect(isValidTheme({})).toBe(false);
    });
  });
});
