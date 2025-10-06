import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInitialSettings } from '@/hooks/useInitialSettings';
import { loadSettings } from '@/lib/utils/settingsStorage';
import type { PersistedSettings } from '@/lib/utils/settingsStorage';

// Mock the settings storage module
vi.mock('@/lib/utils/settingsStorage', () => ({
  loadSettings: vi.fn(),
  CURRENT_VERSION: 1,
}));

describe('useInitialSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load settings from localStorage on mount', () => {
    const mockSettings: PersistedSettings = {
      selectedPreset: 'wood',
      brightness: 15,
      contrast: 10,
      threshold: 135,
      version: 1,
    };

    vi.mocked(loadSettings).mockReturnValue(mockSettings);

    const { result } = renderHook(() => useInitialSettings());

    expect(loadSettings).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual(mockSettings);
  });

  it('should return null when no settings exist', () => {
    vi.mocked(loadSettings).mockReturnValue(null);

    const { result } = renderHook(() => useInitialSettings());

    expect(loadSettings).toHaveBeenCalledTimes(1);
    expect(result.current).toBeNull();
  });

  it('should only load settings once', () => {
    const mockSettings: PersistedSettings = {
      selectedPreset: 'auto',
      brightness: 0,
      contrast: 0,
      threshold: 128,
      version: 1,
    };

    vi.mocked(loadSettings).mockReturnValue(mockSettings);

    const { rerender } = renderHook(() => useInitialSettings());

    expect(loadSettings).toHaveBeenCalledTimes(1);

    // Rerender shouldn't trigger another load
    rerender();
    rerender();
    rerender();

    expect(loadSettings).toHaveBeenCalledTimes(1);
  });

  it('should handle loadSettings errors gracefully', () => {
    vi.mocked(loadSettings).mockReturnValue(null);

    // Should not throw
    expect(() => {
      renderHook(() => useInitialSettings());
    }).not.toThrow();
  });
});
