import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePanelState } from '@/hooks/usePanelState';
import { savePanelState } from '@/lib/utils/panelStateStorage';

// Mock the storage utility
vi.mock('@/lib/utils/panelStateStorage', () => ({
  loadPanelState: vi.fn(() => ({
    materialPresets: true,
    backgroundRemoval: true,
    adjustments: true,
    history: true,
    export: true,
    actions: true,
  })),
  savePanelState: vi.fn(),
}));

describe('usePanelState', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with loaded state', () => {
    const { result } = renderHook(() => usePanelState());

    expect(result.current.state).toEqual({
      materialPresets: true,
      backgroundRemoval: true,
      adjustments: true,
      history: true,
      export: true,
      actions: true,
    });
  });

  it('should update section state', () => {
    const { result } = renderHook(() => usePanelState());

    act(() => {
      result.current.updateSection('adjustments', false);
    });

    expect(result.current.state.adjustments).toBe(false);
    expect(savePanelState).toHaveBeenCalledWith(
      expect.objectContaining({
        adjustments: false,
      })
    );
  });

  it('should persist state changes to localStorage', () => {
    const { result } = renderHook(() => usePanelState());

    act(() => {
      result.current.updateSection('materialPresets', false);
    });

    expect(savePanelState).toHaveBeenCalledWith(
      expect.objectContaining({
        materialPresets: false,
      })
    );
  });

  it('should preserve other sections when updating one', () => {
    const { result } = renderHook(() => usePanelState());

    const initialState = { ...result.current.state };

    act(() => {
      result.current.updateSection('adjustments', false);
    });

    expect(result.current.state.adjustments).toBe(false);
    expect(result.current.state.materialPresets).toBe(initialState.materialPresets);
    expect(result.current.state.backgroundRemoval).toBe(initialState.backgroundRemoval);
    expect(result.current.state.history).toBe(initialState.history);
    expect(result.current.state.export).toBe(initialState.export);
    expect(result.current.state.actions).toBe(initialState.actions);
  });

  it('should handle multiple rapid updates', () => {
    const { result } = renderHook(() => usePanelState());

    act(() => {
      result.current.updateSection('adjustments', false);
      result.current.updateSection('export', false);
      result.current.updateSection('history', false);
    });

    expect(result.current.state.adjustments).toBe(false);
    expect(result.current.state.export).toBe(false);
    expect(result.current.state.history).toBe(false);
  });

  it('should maintain referential stability of updateSection', () => {
    const { result, rerender } = renderHook(() => usePanelState());

    const firstUpdateSection = result.current.updateSection;

    rerender();

    const secondUpdateSection = result.current.updateSection;

    expect(firstUpdateSection).toBe(secondUpdateSection);
  });
});
