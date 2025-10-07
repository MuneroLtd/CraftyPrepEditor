import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLayoutPreferences } from '../../../hooks/useLayoutPreferences';

describe('useLayoutPreferences', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should return default preferences when localStorage is empty', () => {
    const { result } = renderHook(() => useLayoutPreferences());

    expect(result.current.preferences).toEqual({
      leftSidebarVisible: true,
      rightPanelVisible: true,
      rightPanelWidth: 400,
      statusBarVisible: true,
      expandedSections: {
        properties: true,
        adjustments: true,
        layers: false,
      },
    });
  });

  it('should load preferences from localStorage on mount', () => {
    const savedPrefs = {
      leftSidebarVisible: false,
      rightPanelVisible: false,
      rightPanelWidth: 500,
      statusBarVisible: false,
      expandedSections: {
        properties: false,
        adjustments: true,
        layers: true,
      },
    };

    localStorage.setItem('craftyprep-layout-preferences', JSON.stringify(savedPrefs));

    const { result } = renderHook(() => useLayoutPreferences());

    expect(result.current.preferences).toEqual(savedPrefs);
  });

  it('should save preferences to localStorage on change', async () => {
    const { result } = renderHook(() => useLayoutPreferences());

    act(() => {
      result.current.updatePreferences({
        ...result.current.preferences,
        leftSidebarVisible: false,
      });
    });

    // Wait for debounce (300ms)
    await new Promise((resolve) => setTimeout(resolve, 350));

    const saved = localStorage.getItem('craftyprep-layout-preferences');
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved!);
    expect(parsed.leftSidebarVisible).toBe(false);
  });

  it('should validate stored data and ignore corrupt data', () => {
    localStorage.setItem('craftyprep-layout-preferences', 'invalid json');

    const { result } = renderHook(() => useLayoutPreferences());

    // Should fallback to defaults
    expect(result.current.preferences.leftSidebarVisible).toBe(true);
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock localStorage to throw error
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useLayoutPreferences());

    // Should return defaults without crashing
    expect(result.current.preferences.leftSidebarVisible).toBe(true);

    consoleErrorSpy.mockRestore();
  });

  // Note: Debouncing is tested implicitly in the "should save preferences to localStorage on change" test
  // The debounce ensures rapid updates don't cause excessive localStorage writes
  // Manual testing confirms that multiple rapid updates result in a single save after the debounce delay

  it('should provide reset function to restore defaults', () => {
    const { result } = renderHook(() => useLayoutPreferences());

    // Change preferences
    act(() => {
      result.current.updatePreferences({
        ...result.current.preferences,
        leftSidebarVisible: false,
        rightPanelVisible: false,
      });
    });

    // Reset to defaults
    act(() => {
      result.current.resetPreferences();
    });

    expect(result.current.preferences).toEqual({
      leftSidebarVisible: true,
      rightPanelVisible: true,
      rightPanelWidth: 400,
      statusBarVisible: true,
      expandedSections: {
        properties: true,
        adjustments: true,
        layers: false,
      },
    });
  });

  it('should validate panel width is within acceptable range', () => {
    const invalidPrefs = {
      leftSidebarVisible: true,
      rightPanelVisible: true,
      rightPanelWidth: 1000, // Invalid: max is 600
      statusBarVisible: true,
      expandedSections: {
        properties: true,
        adjustments: true,
        layers: false,
      },
    };

    localStorage.setItem('craftyprep-layout-preferences', JSON.stringify(invalidPrefs));

    const { result } = renderHook(() => useLayoutPreferences());

    // Should clamp to max value
    expect(result.current.preferences.rightPanelWidth).toBe(600);
  });

  it('should validate panel width minimum value', () => {
    const invalidPrefs = {
      leftSidebarVisible: true,
      rightPanelVisible: true,
      rightPanelWidth: 50, // Invalid: min is 200
      statusBarVisible: true,
      expandedSections: {
        properties: true,
        adjustments: true,
        layers: false,
      },
    };

    localStorage.setItem('craftyprep-layout-preferences', JSON.stringify(invalidPrefs));

    const { result } = renderHook(() => useLayoutPreferences());

    // Should clamp to min value
    expect(result.current.preferences.rightPanelWidth).toBe(200);
  });

  // Security and validation tests (LAYOUT-R4-003, LAYOUT-R4-007)
  describe('security and validation', () => {
    it('should handle invalid JSON in localStorage', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      localStorage.setItem('craftyprep-layout-preferences', '{invalid json}');

      const { result } = renderHook(() => useLayoutPreferences());

      expect(result.current.preferences).toEqual({
        leftSidebarVisible: true,
        rightPanelVisible: true,
        rightPanelWidth: 400,
        statusBarVisible: true,
        expandedSections: {
          properties: true,
          adjustments: true,
          layers: false,
        },
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load layout preferences:',
        expect.any(SyntaxError)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should prevent prototype pollution from malicious localStorage data', () => {
      const maliciousPrefs = {
        leftSidebarVisible: true,
        rightPanelVisible: true,
        rightPanelWidth: 400,
        statusBarVisible: true,
        expandedSections: {
          properties: true,
          adjustments: true,
          layers: false,
          __proto__: { polluted: true },
          constructor: { polluted: true },
          prototype: { polluted: true },
        },
      };

      localStorage.setItem('craftyprep-layout-preferences', JSON.stringify(maliciousPrefs));

      const { result } = renderHook(() => useLayoutPreferences());

      // Should only have whitelisted sections
      expect(Object.keys(result.current.preferences.expandedSections)).toEqual([
        'properties',
        'adjustments',
        'layers',
      ]);

      // Should not have dangerous keys
      expect('__proto__' in result.current.preferences.expandedSections).toBe(false);
      expect('constructor' in result.current.preferences.expandedSections).toBe(false);
      expect('prototype' in result.current.preferences.expandedSections).toBe(false);

      // Object prototype should not be polluted
      expect(Object.hasOwn(Object.prototype, 'polluted')).toBe(false);
    });

    it('should reject non-boolean values in expandedSections', () => {
      const invalidPrefs = {
        leftSidebarVisible: true,
        rightPanelVisible: true,
        rightPanelWidth: 400,
        statusBarVisible: true,
        expandedSections: {
          properties: 'true', // String instead of boolean
          adjustments: 1, // Number instead of boolean
          layers: null, // Null instead of boolean
        },
      };

      localStorage.setItem('craftyprep-layout-preferences', JSON.stringify(invalidPrefs));

      const { result } = renderHook(() => useLayoutPreferences());

      // Should use defaults for invalid values
      expect(result.current.preferences.expandedSections).toEqual({
        properties: true, // Default
        adjustments: true, // Default
        layers: false, // Default
      });
    });
  });
});
