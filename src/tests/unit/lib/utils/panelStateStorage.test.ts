import { describe, it, expect, beforeEach, vi } from 'vitest';
import { savePanelState, loadPanelState, clearPanelState } from '@/lib/utils/panelStateStorage';

describe('panelStateStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });

  describe('savePanelState', () => {
    it('should save panel state to localStorage', () => {
      const state = {
        materialPresets: true,
        backgroundRemoval: false,
        adjustments: true,
        history: true,
        export: true,
        actions: false,
      };
      savePanelState(state);

      const stored = localStorage.getItem('craftyprep_panel_state');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(state);
    });

    it('should overwrite existing state', () => {
      const state1 = {
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      };
      const state2 = {
        materialPresets: false,
        backgroundRemoval: false,
        adjustments: false,
        history: false,
        export: false,
        actions: false,
      };

      savePanelState(state1);
      savePanelState(state2);

      const stored = JSON.parse(localStorage.getItem('craftyprep_panel_state')!);
      expect(stored).toEqual(state2);
    });

    it('should handle localStorage errors gracefully', () => {
      const state = {
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      };

      // Should not throw even with localStorage errors
      expect(() => savePanelState(state)).not.toThrow();
    });

    it('should handle QuotaExceededError with specific message', () => {
      const state = {
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      };

      // Setup console.warn spy FIRST
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Then mock setItem to throw QuotaExceededError
      const quotaError = new Error('QuotaExceededError');
      quotaError.name = 'QuotaExceededError';
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw quotaError;
      });

      savePanelState(state);

      // Verify specific warning message for quota exceeded
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('localStorage quota exceeded')
      );
    });

    it('should handle generic localStorage errors with generic message', () => {
      const state = {
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      };

      // Setup console.warn spy FIRST
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Then mock setItem to throw generic error
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Generic error');
      });

      savePanelState(state);

      // Verify generic warning message
      expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to save panel state:', expect.any(Error));
    });
  });

  describe('loadPanelState', () => {
    it('should load panel state from localStorage', () => {
      const state = {
        materialPresets: true,
        backgroundRemoval: false,
        adjustments: true,
        history: false,
        export: true,
        actions: false,
      };
      savePanelState(state);

      const loaded = loadPanelState();
      expect(loaded).toEqual(state);
    });

    it('should return default state if localStorage empty', () => {
      const loaded = loadPanelState();
      expect(loaded).toEqual({
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      });
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('craftyprep_panel_state', 'invalid json');
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = loadPanelState();
      expect(loaded).toEqual({
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      });

      consoleWarnSpy.mockRestore();
    });

    it('should validate panel state schema', () => {
      // Missing required fields
      localStorage.setItem(
        'craftyprep_panel_state',
        JSON.stringify({
          materialPresets: true,
          // missing other fields
        })
      );
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = loadPanelState();
      expect(loaded).toEqual({
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      });

      consoleWarnSpy.mockRestore();
    });

    it('should reject invalid types in schema', () => {
      localStorage.setItem(
        'craftyprep_panel_state',
        JSON.stringify({
          materialPresets: 'invalid', // should be boolean
          backgroundRemoval: true,
          adjustments: true,
          history: true,
          export: true,
          actions: true,
        })
      );
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = loadPanelState();
      expect(loaded).toEqual({
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      });

      consoleWarnSpy.mockRestore();
    });

    it('should handle localStorage unavailable gracefully', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = loadPanelState();
      expect(loaded).toEqual({
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      });

      spy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('should handle SecurityError with specific message', () => {
      // Setup console.warn spy FIRST
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Then mock getItem to throw SecurityError
      const securityError = new Error('SecurityError');
      securityError.name = 'SecurityError';
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw securityError;
      });

      const loaded = loadPanelState();

      // Should return default state
      expect(loaded).toEqual({
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      });

      // Verify specific warning message for security error
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('localStorage access denied')
      );
    });

    it('should handle corrupted data with SyntaxError', () => {
      localStorage.setItem('craftyprep_panel_state', '{corrupted json}');
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = loadPanelState();

      // Should return default state
      expect(loaded).toEqual({
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      });

      // Verify warning message for corrupted data
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Corrupted panel state data')
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle generic errors during load', () => {
      // Setup console.warn spy FIRST
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Then mock getItem to throw generic error
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Generic load error');
      });

      const loaded = loadPanelState();

      // Should return default state
      expect(loaded).toEqual({
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      });

      // Verify generic warning message
      expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to load panel state:', expect.any(Error));
    });
  });

  describe('clearPanelState', () => {
    it('should remove panel state from localStorage', () => {
      const state = {
        materialPresets: true,
        backgroundRemoval: true,
        adjustments: true,
        history: true,
        export: true,
        actions: true,
      };
      savePanelState(state);

      expect(localStorage.getItem('craftyprep_panel_state')).toBeTruthy();

      clearPanelState();

      expect(localStorage.getItem('craftyprep_panel_state')).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      // Should not throw even with localStorage errors
      expect(() => clearPanelState()).not.toThrow();
    });
  });
});
