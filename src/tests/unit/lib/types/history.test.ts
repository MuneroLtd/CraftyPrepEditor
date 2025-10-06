/**
 * @file History Type Tests
 * @description Unit tests for history type definitions
 *
 * Tests validate the type structure used for undo/redo history tracking.
 */

import { describe, it, expect } from 'vitest';
import type { HistoryState, UseHistoryReturn } from '../../../../lib/types/history';
import type { MaterialPresetName } from '../../../../lib/types/presets';

describe('HistoryState type', () => {
  it('should define valid history state structure with all required fields', () => {
    const state: HistoryState = {
      brightness: 10,
      contrast: -5,
      threshold: 128,
      preset: 'wood',
    };

    expect(state).toBeDefined();
    expect(state.brightness).toBe(10);
    expect(state.contrast).toBe(-5);
    expect(state.threshold).toBe(128);
    expect(state.preset).toBe('wood');
  });

  it('should accept all valid material preset names', () => {
    const presets: MaterialPresetName[] = [
      'auto',
      'wood',
      'leather',
      'acrylic',
      'glass',
      'metal',
      'custom',
    ];

    presets.forEach((preset) => {
      const state: HistoryState = {
        brightness: 0,
        contrast: 0,
        threshold: 128,
        preset,
      };

      expect(state.preset).toBe(preset);
    });
  });

  it('should accept negative and positive adjustment values', () => {
    const negativeState: HistoryState = {
      brightness: -100,
      contrast: -100,
      threshold: 0,
      preset: 'auto',
    };

    const positiveState: HistoryState = {
      brightness: 100,
      contrast: 100,
      threshold: 255,
      preset: 'auto',
    };

    expect(negativeState.brightness).toBe(-100);
    expect(positiveState.brightness).toBe(100);
  });

  it('should accept zero values', () => {
    const zeroState: HistoryState = {
      brightness: 0,
      contrast: 0,
      threshold: 0,
      preset: 'auto',
    };

    expect(zeroState.brightness).toBe(0);
    expect(zeroState.contrast).toBe(0);
    expect(zeroState.threshold).toBe(0);
  });
});

describe('UseHistoryReturn type', () => {
  it('should define complete hook return interface', () => {
    // This test validates the type structure exists
    // Actual hook tests will validate runtime behavior
    const mockReturn: UseHistoryReturn = {
      canUndo: false,
      canRedo: false,
      push: () => {},
      undo: () => null,
      redo: () => null,
      clear: () => {},
      currentState: null,
    };

    expect(mockReturn.canUndo).toBe(false);
    expect(mockReturn.canRedo).toBe(false);
    expect(typeof mockReturn.push).toBe('function');
    expect(typeof mockReturn.undo).toBe('function');
    expect(typeof mockReturn.redo).toBe('function');
    expect(typeof mockReturn.clear).toBe('function');
    expect(mockReturn.currentState).toBeNull();
  });

  it('should allow currentState to be HistoryState or null', () => {
    const withState: UseHistoryReturn = {
      canUndo: true,
      canRedo: false,
      push: () => {},
      undo: () => null,
      redo: () => null,
      clear: () => {},
      currentState: {
        brightness: 10,
        contrast: 5,
        threshold: 128,
        preset: 'wood',
      },
    };

    const withoutState: UseHistoryReturn = {
      canUndo: false,
      canRedo: false,
      push: () => {},
      undo: () => null,
      redo: () => null,
      clear: () => {},
      currentState: null,
    };

    expect(withState.currentState).not.toBeNull();
    expect(withoutState.currentState).toBeNull();
  });

  it('should validate push function accepts HistoryState', () => {
    const historyState: HistoryState = {
      brightness: 20,
      contrast: 10,
      threshold: 130,
      preset: 'leather',
    };

    // Type check: this should compile without errors
    const mockPush: UseHistoryReturn['push'] = (state: HistoryState) => {
      expect(state).toBeDefined();
    };

    mockPush(historyState);
  });

  it('should validate undo and redo return HistoryState or null', () => {
    // Type check: return type must be HistoryState | null
    const mockUndo: UseHistoryReturn['undo'] = () => {
      return {
        brightness: 5,
        contrast: -5,
        threshold: 120,
        preset: 'auto',
      };
    };

    const mockUndoNull: UseHistoryReturn['undo'] = () => null;

    expect(mockUndo()).not.toBeNull();
    expect(mockUndoNull()).toBeNull();
  });
});
