# Dependencies: Brightness Adjustment Implementation

**Task ID**: task-012

---

## Direct Dependencies

### 1. task-011: BrightnessSlider Component
**Status**: ✅ COMMITTED

**What we need**:
- BrightnessSlider component with props: `value`, `onChange`, `disabled`
- Range: -100 to +100
- Accessible UI component

**How we use it**:
- Wire `onChange` to brightness state in App.tsx
- Display current brightness value
- Disable when no processed image available

**Risk**: LOW - Component already implemented and tested

---

### 2. Existing Image Processing Pipeline
**Status**: ✅ AVAILABLE

**What we need**:
- `useImageProcessing` hook with auto-prep functionality
- Canvas API infrastructure
- ImageData manipulation capability

**Current API**:
```typescript
interface UseImageProcessingReturn {
  processedImage: HTMLImageElement | null;
  processedCanvas: HTMLCanvasElement | null;
  isProcessing: boolean;
  error: string | null;
  runAutoPrepAsync: (image: HTMLImageElement) => Promise<void>;
}
```

**Changes Required**:
- Add `baselineImageData: ImageData | null` to state
- Add `applyAdjustments(brightness: number) => Promise<void>` method
- Store baseline after auto-prep completes

**Risk**: MEDIUM - Refactoring existing hook, need comprehensive testing

---

### 3. Image Processing Library Pattern
**Status**: ✅ AVAILABLE

**Existing Functions**:
- `convertToGrayscale(imageData: ImageData): ImageData`
- `applyHistogramEqualization(imageData: ImageData): ImageData`
- `applyOtsuThreshold(imageData: ImageData): ImageData`

**Pattern to Follow**:
```typescript
/**
 * Pure function: ImageData → ImageData
 * No mutation, creates new ImageData
 * Exported from lib/imageProcessing/index.ts
 */
export function applyBrightness(imageData: ImageData, brightness: number): ImageData {
  // Implementation
}
```

**Risk**: LOW - Well-established pattern, easy to follow

---

## Indirect Dependencies

### 4. Canvas API (Browser)
**Status**: ✅ AVAILABLE

**Required Features**:
- `getContext('2d')`
- `getImageData()`
- `putImageData()`
- `createImageData()`

**Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

**Risk**: NONE - Canvas API is stable and well-supported

---

### 5. React Hooks (useState, useEffect, useCallback)
**Status**: ✅ AVAILABLE

**Used For**:
- Brightness state management
- Debouncing implementation
- Processing pipeline integration

**Risk**: NONE - Standard React APIs

---

## Task Dependencies (Sprint 2)

### Blockers
None - All dependencies are satisfied.

### Blocked By This Task
- task-013: Contrast Adjustment Implementation (similar pattern)
- task-014: Threshold Adjustment Implementation (similar pattern)

Both tasks will follow the pattern established here:
1. Pure function in lib/imageProcessing/
2. Apply to baseline (not original)
3. Debounced slider input
4. Integration with useImageProcessing

---

## External Dependencies

### NPM Packages
All required packages already installed:
- `react` ^19.0.0 (hooks)
- `typescript` ^5.7.3 (types)
- `vitest` ^3.0.0 (testing)
- `@testing-library/react` (integration testing)
- `playwright` (E2E testing)

**No new dependencies required** ✅

---

## Data Dependencies

### Input Data
**From BrightnessSlider**:
- `brightness: number` (range -100 to +100)

**From useImageProcessing**:
- `baselineImageData: ImageData` (auto-prep result)

### Output Data
**To App.tsx**:
- `processedImage: HTMLImageElement` (adjusted preview)

**To Tests**:
- `applyBrightness()` function for unit testing
- Integration testing hooks

---

## File Dependencies

### Files We Read
- `src/hooks/useImageProcessing.ts` - Understand current API
- `src/lib/imageProcessing/grayscale.ts` - Pattern reference
- `src/components/BrightnessSlider.tsx` - Component API
- `src/App.tsx` - Integration point

### Files We Modify
- `src/hooks/useImageProcessing.ts` - Add baseline storage + applyAdjustments
- `src/App.tsx` - Add brightness state + debouncing
- `src/lib/imageProcessing/index.ts` - Export applyBrightness
- `tests/e2e/happy-path.spec.ts` - Add brightness test step

### Files We Create
- `src/lib/imageProcessing/applyBrightness.ts` - Algorithm
- `src/hooks/useDebounce.ts` - Debouncing hook
- `tests/unit/imageProcessing/applyBrightness.test.ts` - Unit tests
- `tests/unit/hooks/useDebounce.test.ts` - Hook tests
- `tests/integration/BrightnessAdjustment.test.tsx` - Integration tests

---

## Conceptual Dependencies

### Design Patterns
**Pipeline Pattern** (existing):
```typescript
const pipeline = [
  convertToGrayscale,
  applyHistogramEqualization,
  applyOtsuThreshold
];
```

**We extend with**:
```typescript
// After auto-prep completes
const adjusted = applyBrightness(baseline, brightness);
```

### State Management Pattern (existing)
- React Context or local state in App.tsx
- Hooks for encapsulation
- Async processing with loading states

### Testing Pattern (existing)
- Vitest for unit tests
- React Testing Library for integration
- Playwright for E2E
- TDD approach (tests first)

---

## Knowledge Dependencies

### Required Knowledge
- Canvas API and ImageData manipulation ✅ (team has this)
- Pure functional programming ✅ (established in codebase)
- React hooks (useState, useEffect) ✅
- Debouncing pattern ✅ (common pattern)
- TDD methodology ✅ (used in previous tasks)

### Documentation References
- `.autoflow/docs/FUNCTIONAL.md#brightness-adjustment` - Algorithm spec
- `.autoflow/docs/ARCHITECTURE.md#processing-patterns` - Architecture pattern
- `src/lib/imageProcessing/grayscale.ts` - Code pattern reference

---

## Risk Assessment

### High Risk Dependencies
None.

### Medium Risk Dependencies
1. **useImageProcessing Hook Refactoring**
   - Risk: Breaking existing auto-prep flow
   - Mitigation: Comprehensive integration tests
   - Mitigation: Test auto-prep independently after changes

### Low Risk Dependencies
1. **BrightnessSlider Component**
   - Risk: Component API might not match expectations
   - Mitigation: Component already implemented and tested (task-011)

2. **Canvas API**
   - Risk: Browser compatibility issues
   - Mitigation: Target browsers all support required features

### Zero Risk Dependencies
- React hooks
- TypeScript
- Testing libraries
- Pure functions pattern

---

## Dependency Graph

```
task-012 (Brightness Adjustment)
    │
    ├─── task-011 (BrightnessSlider) ✅ COMMITTED
    │
    ├─── useImageProcessing hook ✅ EXISTS
    │       └─── Canvas API ✅ BROWSER
    │
    ├─── Image Processing Library ✅ EXISTS
    │       ├─── grayscale.ts (pattern)
    │       ├─── histogramEqualization.ts (pattern)
    │       └─── otsuThreshold.ts (pattern)
    │
    └─── Testing Infrastructure ✅ EXISTS
            ├─── Vitest
            ├─── React Testing Library
            └─── Playwright
```

---

## Pre-Implementation Checklist

Before starting `/build`:
- [x] task-011 (BrightnessSlider) is COMMITTED
- [x] useImageProcessing hook exists and works
- [x] Image processing library pattern understood
- [x] Canvas API availability confirmed
- [x] Testing infrastructure ready
- [x] Design documentation reviewed
- [x] No blocking dependencies

**Status**: ✅ ALL DEPENDENCIES SATISFIED - READY TO BUILD

---

## Post-Implementation Impact

### Tasks Unblocked
- task-013: Contrast Adjustment (can follow same pattern)
- task-014: Threshold Adjustment (can follow same pattern)

### Pattern Established
This task establishes the pattern for all refinement controls:
1. Pure function in lib/imageProcessing/
2. Apply to baseline ImageData
3. Debounced slider input
4. Integration via useImageProcessing hook

### Reusable Components
- `useDebounce` hook → reusable for contrast/threshold sliders
- Baseline storage pattern → reusable for all adjustments
- Testing patterns → reusable for future adjustments
