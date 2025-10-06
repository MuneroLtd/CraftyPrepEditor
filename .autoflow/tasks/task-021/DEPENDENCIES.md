# Dependencies: Undo/Redo History System

**Task ID**: task-021
**Sprint**: Sprint 3 (Enhancement & Deployment)

---

## Internal Dependencies

### Code Dependencies

#### 1. State Management in App.tsx
**File**: `src/App.tsx`
**Dependencies**:
- `brightness`, `contrast`, `threshold` state variables
- `selectedPreset` state variable
- `debouncedBrightness`, `debouncedContrast`, `debouncedThreshold` (from useDebounce)
- `baselineImageData` (from useImageProcessing)
- `handleAutoPrepClick` function (for clearing history)
- `handleReset` function (for clearing history)

**Integration Points**:
- History must push state AFTER debounced values stabilize
- History must be cleared when auto-prep or reset is triggered
- Undo/redo must update state variables to trigger re-processing

**Status**: COMPLETE (existing state management working)

---

#### 2. Image Processing Pipeline
**File**: `src/hooks/useImageProcessing.ts`
**Dependencies**:
- `baselineImageData` - required for applying adjustments
- `applyAdjustments(brightness, contrast, threshold)` - triggered by state changes

**Integration Points**:
- When undo/redo changes state → `applyAdjustments` is called via useEffect
- No direct integration needed (state changes trigger existing flow)

**Status**: COMPLETE (processing pipeline working)

---

#### 3. Material Presets System
**File**: `src/lib/types/presets.ts`, `src/lib/presets/presetConfigurations.ts`
**Dependencies**:
- `MaterialPresetName` type (for history state typing)
- Preset configurations (not directly used, but state must include preset)

**Integration Points**:
- History stores current preset name
- Undo/redo must restore preset selection

**Status**: COMPLETE (preset system working)

---

#### 4. Debouncing Hook
**File**: `src/hooks/useDebounce.ts`
**Dependencies**:
- Used for debouncing slider inputs (100ms delay)

**Integration Points**:
- History push should happen AFTER debounce completes
- Use debounced values in useEffect to detect when to push history

**Status**: COMPLETE (debouncing working)

---

#### 5. Custom Preset Persistence
**File**: `src/hooks/useCustomPresetPersistence.ts`
**Dependencies**:
- localStorage persistence of custom preset values

**Potential Conflict**:
- Custom preset auto-saves to localStorage
- History might conflict if not coordinated

**Resolution**:
- History only stores in-memory state (no localStorage)
- Custom preset persistence continues to work independently
- When undo/redo restores 'custom' preset, values are already in state

**Status**: COMPLETE (no blocking issues)

---

### UI Dependencies

#### 1. RefinementControls Component
**File**: `src/components/RefinementControls.tsx`
**Dependencies**:
- Need to add UndoRedoButtons component to this container

**Integration Points**:
- Add UndoRedoButtons above or below existing controls
- Pass `canUndo`, `canRedo`, `onUndo`, `onRedo` props from App.tsx

**Status**: PENDING (will be updated in task-021)

---

#### 2. shadcn/ui Button Component
**File**: `src/components/ui/button.tsx`
**Dependencies**:
- Existing Button component for styling consistency

**Integration Points**:
- UndoRedoButtons will use Button component with variant="outline" and size="sm"

**Status**: COMPLETE (Button component exists)

---

#### 3. Lucide Icons
**Package**: `lucide-react`
**Dependencies**:
- `Undo2` icon (for undo button)
- `Redo2` icon (for redo button)

**Status**: COMPLETE (package installed, icons available)

---

## External Dependencies

### Sprint Dependencies

**Depends On**:
- ✅ Sprint 2 Complete (all adjustments functional)
  - Brightness slider working
  - Contrast slider working
  - Threshold slider working
  - Material presets working
  - State management stable

**Status**: COMPLETE (Sprint 2 done, all adjustments working)

---

### Feature Dependencies

**Requires**:
- ✅ Existing state management in App.tsx
- ✅ useDebounce hook
- ✅ useImageProcessing hook
- ✅ Material preset system
- ✅ Refinement sliders (brightness, contrast, threshold)

**Status**: All dependencies COMPLETE

---

### Browser API Dependencies

**Required APIs**:
- ✅ `window.addEventListener('keydown', ...)` - for keyboard shortcuts
- ✅ `document.activeElement` - to check if input is focused
- ✅ `Array` methods (slice, push) - for history stack management

**Browser Support**:
- All required APIs supported in target browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

**Status**: COMPLETE (all APIs available)

---

## Data Flow Dependencies

### State Update Flow

```
User adjusts slider
  ↓
State changes (brightness/contrast/threshold)
  ↓
Debounce (100ms)
  ↓
useEffect detects debounced value change
  ↓
Push to history stack
  ↓
applyAdjustments(brightness, contrast, threshold)
  ↓
Processed image updates
```

**Dependencies**:
- Debounced values must stabilize before pushing to history
- `baselineImageData` must exist (auto-prep must have run)

---

### Undo/Redo Flow

```
User clicks Undo button (or Ctrl+Z)
  ↓
undoHistory() returns previous state
  ↓
Update state variables (setBrightness, setContrast, setThreshold, setSelectedPreset)
  ↓
useEffect detects state change
  ↓
applyAdjustments(brightness, contrast, threshold)
  ↓
Processed image updates
```

**Dependencies**:
- Existing useEffect that calls applyAdjustments when state changes
- No modification needed (existing flow handles state restoration)

---

## Testing Dependencies

### Test Utilities

**Required**:
- ✅ Vitest (unit testing)
- ✅ @testing-library/react (component testing)
- ✅ @testing-library/react-hooks (hook testing via renderHook)
- ✅ Playwright (E2E testing)

**Status**: COMPLETE (all test utilities installed)

---

### Test Data Dependencies

**Requires**:
- Sample images for E2E tests (already in `src/tests/fixtures/`)
- Mock state data for unit tests (will create in task-021)

**Status**: COMPLETE (fixtures available)

---

## Blockers

### Current Blockers
**None** - All dependencies are complete.

---

### Potential Blockers

**PB1**: State update race conditions
- **Risk**: Undo/redo might conflict with debounced slider updates
- **Mitigation**: useEffect will naturally handle this (React's state batching)
- **Likelihood**: Low

**PB2**: History pollution from rapid slider movements
- **Risk**: Every slider movement might push to history
- **Mitigation**: Only push on debounced value changes (100ms debounce)
- **Likelihood**: Low (debouncing already in place)

**PB3**: Memory issues from large history stack
- **Risk**: Storing ImageData in history could consume >100MB
- **Mitigation**: Only store numbers (brightness, contrast, threshold, preset) - ~100 bytes per entry
- **Likelihood**: Very Low (design prevents this)

---

## Integration Checklist

Before starting implementation, verify:

- [x] All Sprint 2 tasks complete (sliders working)
- [x] State management in App.tsx stable
- [x] useDebounce hook working correctly
- [x] useImageProcessing hook working correctly
- [x] Material preset system functional
- [x] shadcn/ui Button component available
- [x] Lucide icons package installed
- [x] Test utilities installed and working

**Status**: ALL CHECKS PASSED - Ready to implement

---

## Post-Implementation Integration

After completing task-021, these components will need updates:

1. **App.tsx**:
   - Add `useHistory` hook
   - Add keyboard event listener
   - Add `handleUndo` and `handleRedo` functions
   - Update `handleAutoPrepClick` to call `clearHistory()`
   - Update `handleReset` to call `clearHistory()`
   - Add useEffect to push to history on debounced changes

2. **RefinementControls.tsx**:
   - Add `UndoRedoButtons` component
   - Pass `canUndo`, `canRedo`, `onUndo`, `onRedo` props

3. **Tests**:
   - Add unit tests for `useHistory` hook
   - Add unit tests for `UndoRedoButtons` component
   - Add integration tests for undo/redo flow
   - Add E2E tests for keyboard shortcuts

**Estimated Files Modified**: 3 existing files, 5 new files
**Estimated Lines Changed**: ~400 lines added, ~20 lines modified

---

**Dependency Review**: COMPLETE
**Blockers**: NONE
**Ready to Implement**: YES
