# Task Plan: Undo/Redo History System

**Task ID**: task-021
**Sprint**: Sprint 3 (Enhancement & Deployment)
**Estimated Effort**: 5 hours
**Approach**: Test-Driven Development (TDD) with Command Pattern

---

## Overview

Implement undo/redo functionality using the Command Pattern with a history stack (max 10 states) and keyboard shortcuts for iterative refinement workflow.

**Core Pattern**: Command Pattern with immutable state snapshots
**Integration**: Hooks into existing state management in App.tsx
**UI**: Undo/Redo buttons + Keyboard shortcuts (Ctrl+Z, Ctrl+Y)

---

## Phase 1: Types & Interfaces (TDD)

### Tests to Write First
```typescript
// src/tests/unit/lib/types/history.test.ts
describe('HistoryState type', () => {
  it('should define valid history state structure', () => {
    const state: HistoryState = {
      brightness: 10,
      contrast: -5,
      threshold: 128,
      preset: 'wood'
    };
    expect(state).toBeDefined();
  });
});
```

### Implementation
**File**: `src/lib/types/history.ts`

```typescript
import type { MaterialPresetName } from './presets';

/**
 * Snapshot of adjustment state for history tracking
 */
export interface HistoryState {
  brightness: number;
  contrast: number;
  threshold: number;
  preset: MaterialPresetName;
}

/**
 * History hook return type
 */
export interface UseHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  push: (state: HistoryState) => void;
  undo: () => HistoryState | null;
  redo: () => HistoryState | null;
  clear: () => void;
  currentState: HistoryState | null;
}
```

**Deliverables**:
- [ ] Type definitions in `src/lib/types/history.ts`
- [ ] Unit tests for type validation
- [ ] All tests passing

---

## Phase 2: useHistory Hook (TDD)

### Tests to Write First
```typescript
// src/tests/unit/hooks/useHistory.test.ts
describe('useHistory hook', () => {
  it('should initialize with empty history', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('should push state to history', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.push({
        brightness: 10,
        contrast: 5,
        threshold: 128,
        preset: 'auto'
      });
    });
    expect(result.current.canUndo).toBe(true);
  });

  it('should undo to previous state', () => {
    const { result } = renderHook(() => useHistory());
    const state1 = { brightness: 10, contrast: 5, threshold: 128, preset: 'auto' as MaterialPresetName };
    const state2 = { brightness: 20, contrast: 10, threshold: 130, preset: 'auto' as MaterialPresetName };

    act(() => {
      result.current.push(state1);
      result.current.push(state2);
    });

    act(() => {
      const undoneState = result.current.undo();
      expect(undoneState).toEqual(state1);
    });
  });

  it('should redo to next state', () => {
    // ... similar test for redo
  });

  it('should limit history to 10 states', () => {
    const { result } = renderHook(() => useHistory());

    act(() => {
      for (let i = 0; i < 15; i++) {
        result.current.push({
          brightness: i,
          contrast: 0,
          threshold: 128,
          preset: 'auto'
        });
      }
    });

    // Should only have 10 states (oldest 5 dropped)
    let undoCount = 0;
    while (result.current.canUndo) {
      act(() => result.current.undo());
      undoCount++;
    }
    expect(undoCount).toBe(9); // 10 states = 9 undo operations
  });

  it('should clear redo stack on new push after undo', () => {
    // Test: undo → push → redo should be unavailable
  });

  it('should clear all history', () => {
    // Test: push states → clear → canUndo/canRedo should be false
  });
});
```

### Implementation
**File**: `src/hooks/useHistory.ts`

```typescript
import { useState, useCallback } from 'react';
import type { HistoryState, UseHistoryReturn } from '../lib/types/history';

const MAX_HISTORY_SIZE = 10;

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  const currentState = currentIndex >= 0 ? history[currentIndex] : null;

  const push = useCallback((state: HistoryState) => {
    setHistory(prev => {
      // Truncate history at current index (clear redo stack)
      const truncated = prev.slice(0, currentIndex + 1);

      // Add new state
      const newHistory = [...truncated, state];

      // Limit to MAX_HISTORY_SIZE (drop oldest if needed)
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return newHistory.slice(newHistory.length - MAX_HISTORY_SIZE);
      }

      return newHistory;
    });

    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      return Math.min(newIndex, MAX_HISTORY_SIZE - 1);
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (!canUndo) return null;

    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [canUndo, currentIndex, history]);

  const redo = useCallback(() => {
    if (!canRedo) return null;

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [canRedo, currentIndex, history]);

  const clear = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    canUndo,
    canRedo,
    push,
    undo,
    redo,
    clear,
    currentState,
  };
}
```

**Deliverables**:
- [ ] useHistory hook implementation
- [ ] Comprehensive unit tests (≥80% coverage)
- [ ] All tests passing
- [ ] Edge cases covered (empty history, limits, truncation)

---

## Phase 3: UndoRedoButtons Component (TDD)

### Tests to Write First
```typescript
// src/tests/unit/components/UndoRedoButtons.test.ts
describe('UndoRedoButtons', () => {
  it('should render undo and redo buttons', () => {
    render(<UndoRedoButtons onUndo={vi.fn()} onRedo={vi.fn()} canUndo={true} canRedo={true} />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument();
  });

  it('should disable undo button when canUndo is false', () => {
    render(<UndoRedoButtons onUndo={vi.fn()} onRedo={vi.fn()} canUndo={false} canRedo={true} />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
  });

  it('should disable redo button when canRedo is false', () => {
    // ... similar test
  });

  it('should call onUndo when undo button clicked', () => {
    const onUndo = vi.fn();
    render(<UndoRedoButtons onUndo={onUndo} onRedo={vi.fn()} canUndo={true} canRedo={false} />);
    fireEvent.click(screen.getByRole('button', { name: /undo/i }));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it('should call onRedo when redo button clicked', () => {
    // ... similar test
  });

  it('should have proper ARIA labels', () => {
    // Test accessibility attributes
  });

  it('should have keyboard focus indicators', () => {
    // Test focus management
  });
});
```

### Implementation
**File**: `src/components/UndoRedoButtons.tsx`

```typescript
import { Button } from './ui/button';
import { Undo2, Redo2 } from 'lucide-react';

export interface UndoRedoButtonsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function UndoRedoButtons({ onUndo, onRedo, canUndo, canRedo }: UndoRedoButtonsProps) {
  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo last adjustment (Ctrl+Z)"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="h-4 w-4 mr-1" aria-hidden="true" />
        Undo
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        aria-label="Redo adjustment (Ctrl+Y)"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="h-4 w-4 mr-1" aria-hidden="true" />
        Redo
      </Button>
    </div>
  );
}
```

**Deliverables**:
- [ ] UndoRedoButtons component
- [ ] Unit tests (≥80% coverage)
- [ ] Accessibility compliance (WCAG 2.2 AAA)
- [ ] Focus indicators visible
- [ ] Disabled states working

---

## Phase 4: Keyboard Shortcuts (TDD)

### Tests to Write First
```typescript
// src/tests/integration/UndoRedoKeyboard.test.tsx
describe('Undo/Redo Keyboard Shortcuts', () => {
  it('should undo on Ctrl+Z', () => {
    render(<App />);
    // Upload image, run auto-prep, adjust sliders
    // Press Ctrl+Z
    fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
    // Verify state reverted
  });

  it('should redo on Ctrl+Y', () => {
    // ... similar test
  });

  it('should not trigger when input is focused', () => {
    // Prevent conflicts with text inputs
  });

  it('should work with Cmd+Z on Mac', () => {
    // Support metaKey for Mac users
  });
});
```

### Implementation
**File**: `src/App.tsx` (add keyboard event listener)

```typescript
// In App component
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Check if Ctrl (or Cmd on Mac) is pressed
    const isModifier = e.ctrlKey || e.metaKey;

    // Don't trigger if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (isModifier && e.key === 'z') {
      e.preventDefault();
      handleUndo();
    } else if (isModifier && e.key === 'y') {
      e.preventDefault();
      handleRedo();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [handleUndo, handleRedo]);
```

**Deliverables**:
- [ ] Keyboard event listener in App.tsx
- [ ] Ctrl+Z (undo) working
- [ ] Ctrl+Y (redo) working
- [ ] Cmd+Z/Y working on Mac
- [ ] No conflicts with input fields
- [ ] Integration tests passing

---

## Phase 5: Integration with State Updates (TDD)

### Tests to Write First
```typescript
// src/tests/integration/UndoRedoFlow.test.tsx
describe('Undo/Redo Integration Flow', () => {
  it('should push state to history when slider changes', () => {
    render(<App />);
    // Upload and auto-prep
    // Adjust brightness slider
    // Wait for debounce
    // Verify history has new state
    // Undo should restore previous brightness
  });

  it('should clear history on auto-prep', () => {
    // Upload, adjust sliders, run auto-prep again
    // Verify undo is not available
  });

  it('should clear history on reset', () => {
    // Upload, adjust sliders, click reset
    // Verify undo is not available
  });

  it('should truncate redo stack on new adjustment after undo', () => {
    // Adjust → Adjust → Undo → Adjust (new)
    // Verify redo is not available
  });
});
```

### Implementation
**File**: `src/App.tsx`

```typescript
// Add useHistory hook
const {
  canUndo,
  canRedo,
  push: pushHistory,
  undo: undoHistory,
  redo: redoHistory,
  clear: clearHistory,
} = useHistory();

// Push to history when debounced values change (after auto-prep completes)
useEffect(() => {
  if (baselineImageData && brightness !== undefined && contrast !== undefined && threshold !== undefined) {
    // Only push if not currently undoing/redoing (prevent duplicate pushes)
    pushHistory({
      brightness,
      contrast,
      threshold,
      preset: selectedPreset,
    });
  }
}, [debouncedBrightness, debouncedContrast, debouncedThreshold, baselineImageData]);

// Clear history on auto-prep
const handleAutoPrepClick = () => {
  if (uploadedImage) {
    runAutoPrepAsync(uploadedImage, { ... });
    clearHistory();
    // ... reset adjustments
  }
};

// Clear history on reset
const handleReset = useCallback(() => {
  // ... existing reset logic
  clearHistory();
}, [uploadedImage, otsuThreshold, runAutoPrepAsync, clearHistory]);

// Undo handler
const handleUndo = useCallback(() => {
  const previousState = undoHistory();
  if (previousState) {
    setBrightness(previousState.brightness);
    setContrast(previousState.contrast);
    setThreshold(previousState.threshold);
    setSelectedPreset(previousState.preset);
  }
}, [undoHistory]);

// Redo handler
const handleRedo = useCallback(() => {
  const nextState = redoHistory();
  if (nextState) {
    setBrightness(nextState.brightness);
    setContrast(nextState.contrast);
    setThreshold(nextState.threshold);
    setSelectedPreset(nextState.preset);
  }
}, [redoHistory]);
```

**Deliverables**:
- [ ] History pushes on debounced slider changes
- [ ] History clears on auto-prep
- [ ] History clears on reset
- [ ] Undo restores previous state
- [ ] Redo restores next state
- [ ] UndoRedoButtons component rendered in RefinementControls
- [ ] Integration tests passing
- [ ] E2E tests passing

---

## Acceptance Criteria Checklist

- [ ] History stack implemented (max 10 states)
- [ ] Undo button reverts to previous state
- [ ] Redo button re-applies undone state
- [ ] Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo)
- [ ] New adjustment clears redo stack
- [ ] Buttons disabled when no undo/redo available
- [ ] Unit tests for history operations (≥80% coverage)
- [ ] WCAG 2.2 AAA accessibility compliance
- [ ] Keyboard shortcuts working
- [ ] Auto-prep clears history
- [ ] Reset clears history
- [ ] Mac Cmd+Z/Y support

---

## Definition of Done

- [ ] All 5 phases complete
- [ ] All acceptance criteria met
- [ ] Unit tests passing (≥80% coverage)
- [ ] Integration tests passing
- [ ] E2E verification passed
- [ ] Code review passed
- [ ] No regressions in existing functionality
- [ ] Accessibility audit passed
- [ ] Memory leaks tested (no ImageData in history)

---

## Estimated Time Breakdown

- Phase 1 (Types): 0.5 hours
- Phase 2 (useHistory hook): 1.5 hours
- Phase 3 (UndoRedoButtons): 1 hour
- Phase 4 (Keyboard shortcuts): 0.5 hours
- Phase 5 (Integration): 1 hour
- Testing & polish: 0.5 hours

**Total**: 5 hours
