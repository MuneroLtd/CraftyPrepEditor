import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSettingsPersistence } from '@/hooks/useSettingsPersistence';
import { saveSettings, clearSettings } from '@/lib/utils/settingsStorage';

// Mock the settings storage module
vi.mock('@/lib/utils/settingsStorage', () => ({
  saveSettings: vi.fn(() => true),
  clearSettings: vi.fn(),
  CURRENT_VERSION: 1,
}));

describe('useSettingsPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(saveSettings).mockReturnValue(true);
  });

  it('should save settings after debounce delay', async () => {
    const saveMock = vi.mocked(saveSettings);

    renderHook(() => useSettingsPersistence('wood', 10, 20, 130));

    // Initial render should not save immediately
    expect(saveMock).not.toHaveBeenCalled();

    // Should save after debounce (wait 600ms to be safe)
    await waitFor(
      () => {
        expect(saveMock).toHaveBeenCalledWith({
          selectedPreset: 'wood',
          brightness: 10,
          contrast: 20,
          threshold: 130,
          version: 1,
        });
      },
      { timeout: 1000 }
    );
  });

  it('should debounce rapid changes', async () => {
    const saveMock = vi.mocked(saveSettings);

    const { rerender } = renderHook(
      ({ brightness }) => useSettingsPersistence('auto', brightness, 0, 128),
      {
        initialProps: { brightness: 0 },
      }
    );

    // Make rapid changes
    rerender({ brightness: 10 });
    rerender({ brightness: 20 });
    rerender({ brightness: 30 });

    // Should not have saved yet
    expect(saveMock).not.toHaveBeenCalled();

    // Should save only once with final value after debounce
    await waitFor(
      () => {
        expect(saveMock).toHaveBeenCalledTimes(1);
        expect(saveMock).toHaveBeenCalledWith({
          selectedPreset: 'auto',
          brightness: 30,
          contrast: 0,
          threshold: 128,
          version: 1,
        });
      },
      { timeout: 1000 }
    );
  });

  it('should not save if values have not changed', async () => {
    const saveMock = vi.mocked(saveSettings);

    const { rerender } = renderHook(
      ({ selectedPreset }) => useSettingsPersistence(selectedPreset, 0, 0, 128),
      {
        initialProps: { selectedPreset: 'auto' as const },
      }
    );

    // Wait for initial save
    await waitFor(
      () => {
        expect(saveMock).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 }
    );

    // Rerender with same values
    rerender({ selectedPreset: 'auto' as const });

    // Give it time to potentially save again (but it shouldn't)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Should still only have been called once
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('should cleanup debounce on unmount', async () => {
    const saveMock = vi.mocked(saveSettings);

    const { unmount } = renderHook(() => useSettingsPersistence('auto', 0, 0, 128));

    // Unmount immediately
    unmount();

    // Wait to see if it saves (it shouldn't)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Should not have saved
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('should return clearSettings function', () => {
    const clearMock = vi.mocked(clearSettings);

    const { result } = renderHook(() => useSettingsPersistence('auto', 0, 0, 128));

    expect(typeof result.current).toBe('function');

    // Call the returned function
    result.current();

    expect(clearMock).toHaveBeenCalledTimes(1);
  });

  it('should handle all preset types', async () => {
    const saveMock = vi.mocked(saveSettings);

    const presets = ['auto', 'wood', 'leather', 'acrylic', 'glass', 'metal', 'custom'] as const;

    for (const preset of presets) {
      vi.clearAllMocks();

      renderHook(() => useSettingsPersistence(preset, 0, 0, 128));

      await waitFor(
        () => {
          expect(saveMock).toHaveBeenCalledWith({
            selectedPreset: preset,
            brightness: 0,
            contrast: 0,
            threshold: 128,
            version: 1,
          });
        },
        { timeout: 1000 }
      );
    }
  });

  it('should handle boundary values', async () => {
    const saveMock = vi.mocked(saveSettings);

    // Test min values
    renderHook(() => useSettingsPersistence('auto', -100, -100, 0));

    await waitFor(
      () => {
        expect(saveMock).toHaveBeenCalledWith({
          selectedPreset: 'auto',
          brightness: -100,
          contrast: -100,
          threshold: 0,
          version: 1,
        });
      },
      { timeout: 1000 }
    );

    vi.clearAllMocks();

    // Test max values
    renderHook(() => useSettingsPersistence('auto', 100, 100, 255));

    await waitFor(
      () => {
        expect(saveMock).toHaveBeenCalledWith({
          selectedPreset: 'auto',
          brightness: 100,
          contrast: 100,
          threshold: 255,
          version: 1,
        });
      },
      { timeout: 1000 }
    );
  });

  it('should handle saveSettings failure gracefully', async () => {
    const saveMock = vi.mocked(saveSettings);
    saveMock.mockReturnValue(false); // Simulate failure

    // Should not throw
    expect(() => {
      renderHook(() => useSettingsPersistence('auto', 0, 0, 128));
    }).not.toThrow();

    // Should have attempted to save
    await waitFor(
      () => {
        expect(saveMock).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  it('should save on every distinct change after debounce', async () => {
    const saveMock = vi.mocked(saveSettings);

    const { rerender } = renderHook(
      ({ brightness }) => useSettingsPersistence('auto', brightness, 0, 128),
      { initialProps: { brightness: 0 } }
    );

    // Wait for first save
    await waitFor(() => expect(saveMock).toHaveBeenCalledTimes(1), { timeout: 1000 });

    // Second change
    rerender({ brightness: 10 });
    await waitFor(() => expect(saveMock).toHaveBeenCalledTimes(2), { timeout: 1000 });

    // Third change
    rerender({ brightness: 20 });
    await waitFor(() => expect(saveMock).toHaveBeenCalledTimes(3), { timeout: 1000 });
  });
});
