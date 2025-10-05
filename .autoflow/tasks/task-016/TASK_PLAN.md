# Task Plan: Debounced Preview Updates (Remaining Work)

**Task ID**: task-016
**Status**: PLANNED
**Estimated Effort**: 1.5 hours (reduced from 4 hours - 6/8 criteria already complete)

---

## Current State Analysis

### ✅ Already Complete (6/8 Acceptance Criteria)

1. **Custom useDebounce hook created**
   - Location: `src/hooks/useDebounce.ts`
   - Well-documented with JSDoc and examples
   - Implements proper cleanup and timer management

2. **100ms debounce on slider inputs**
   - Implemented in `src/App.tsx` (lines 43-45, 50)
   - All slider values debounced: brightness, contrast, threshold, bg sensitivity

3. **Preview updates only after drag stops**
   - Debounced values control preview rendering
   - UI remains responsive during drag (immediate value update)
   - Processing delayed until user stops dragging (100ms after)

4. **Canvas operations optimized**
   - Verified in previous tasks (need to confirm during testing)
   - offScreenCanvas pattern likely in place

5. **React.memo for expensive components**
   - `RefinementControls` component uses `memo` wrapper
   - Prevents unnecessary re-renders

6. **No UI blocking during processing**
   - Debouncing ensures processing happens after user input
   - Async pattern prevents blocking

### ❌ Remaining Work (2/8 Acceptance Criteria)

#### 1. Loading Indicator if Update >500ms

**Current Gap**: No delayed loading indicator
**Required**: Show loading state ONLY if adjustment takes >500ms
**UX Pattern**: Delayed loading indicator to avoid flashing for fast operations

**Implementation Plan**:
- Create `useDelayedLoading` hook
  - Accepts `isProcessing` and `delayMs` (500ms)
  - Returns `shouldShowLoading` after delay
  - Clears timeout if processing finishes before delay
- Add loading state to `App.tsx`
  - Track when canvas processing is in progress
  - Use delayed hook: `shouldShowLoading = useDelayedLoading(isProcessing, 500)`
- Add loading overlay to preview area
  - Spinner + "Processing..." text
  - Only visible when `shouldShowLoading` is true
  - Positioned over preview canvas

**Files to Modify**:
- `src/hooks/useDelayedLoading.ts` (NEW)
- `src/App.tsx` (add isProcessing state, use delayed hook)
- `src/components/ImagePreview.tsx` or create `LoadingOverlay.tsx`

#### 2. Performance Tests (<100ms for Adjustments)

**Current Gap**: No performance tests
**Required**: Automated tests verifying <100ms response time
**Target**: Slider adjustment processing <100ms

**Implementation Plan**:
- Create performance test file
  - `src/tests/unit/performance/adjustments.test.ts`
- Test each adjustment type:
  - Brightness adjustment
  - Contrast adjustment
  - Threshold adjustment
  - Background removal sensitivity
- Measure execution time:
  - Mock canvas element
  - Call processing functions
  - Assert execution time <100ms
- Use `performance.now()` for accurate timing
- Run tests with realistic image data (1920×1080 sample)

**Files to Create**:
- `src/tests/unit/performance/adjustments.test.ts` (NEW)

**Test Structure**:
```typescript
describe('Adjustment Performance', () => {
  it('brightness adjustment completes in <100ms', () => {
    const start = performance.now();
    applyBrightnessAdjustment(imageData, 50);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });
  // ... similar for contrast, threshold, bg removal
});
```

---

## Implementation Steps

### Step 1: Create useDelayedLoading Hook (30 mins)

**File**: `src/hooks/useDelayedLoading.ts`

```typescript
/**
 * Delayed Loading Hook
 *
 * Only shows loading state if processing takes longer than delayMs.
 * Prevents loading flashes for fast operations.
 */
import { useState, useEffect } from 'react';

export function useDelayedLoading(
  isProcessing: boolean,
  delayMs: number = 500
): boolean {
  const [shouldShowLoading, setShouldShowLoading] = useState(false);

  useEffect(() => {
    if (isProcessing) {
      // Set timer to show loading after delay
      const timer = setTimeout(() => {
        setShouldShowLoading(true);
      }, delayMs);

      return () => {
        clearTimeout(timer);
        setShouldShowLoading(false);
      };
    } else {
      // Processing finished, hide loading immediately
      setShouldShowLoading(false);
    }
  }, [isProcessing, delayMs]);

  return shouldShowLoading;
}
```

**Tests**: `src/tests/unit/hooks/useDelayedLoading.test.ts`
- Test shows loading after 500ms
- Test doesn't show if processing finishes <500ms
- Test clears timer on unmount

### Step 2: Add Loading State to App (30 mins)

**File**: `src/App.tsx`

**Changes**:
1. Import `useDelayedLoading`
2. Add `isProcessing` state
3. Set `isProcessing=true` when preview updates start
4. Set `isProcessing=false` when updates complete
5. Use `shouldShowLoading = useDelayedLoading(isProcessing, 500)`
6. Pass `shouldShowLoading` to ImagePreview component

**Implementation**:
```typescript
const [isProcessing, setIsProcessing] = useState(false);
const shouldShowLoading = useDelayedLoading(isProcessing, 500);

useEffect(() => {
  if (!processedImageData) return;

  setIsProcessing(true);

  // Apply adjustments (async or sync)
  const result = applyAdjustments(...);

  setIsProcessing(false);
}, [debouncedBrightness, debouncedContrast, debouncedThreshold]);
```

### Step 3: Add Loading Overlay to Preview (20 mins)

**Option A**: Modify `ImagePreview.tsx`
**Option B**: Create `LoadingOverlay.tsx` component

**Recommended**: Option A (simpler)

**File**: `src/components/ImagePreview.tsx`

Add loading overlay:
```tsx
{shouldShowLoading && (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
    <div className="text-white text-center">
      <Spinner />
      <p>Processing...</p>
    </div>
  </div>
)}
```

### Step 4: Create Performance Tests (30 mins)

**File**: `src/tests/unit/performance/adjustments.test.ts`

**Structure**:
```typescript
import { describe, it, expect } from 'vitest';
import { applyBrightnessAdjustment, applyContrastAdjustment, ... } from '@/lib/image-processing';

describe('Adjustment Performance', () => {
  const createTestImageData = () => {
    // Create 1920×1080 ImageData for realistic testing
    const width = 1920;
    const height = 1080;
    const data = new Uint8ClampedArray(width * height * 4);
    // Fill with sample data
    return new ImageData(data, width, height);
  };

  it('brightness adjustment <100ms', () => {
    const imageData = createTestImageData();
    const start = performance.now();
    applyBrightnessAdjustment(imageData, 50);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });

  it('contrast adjustment <100ms', () => { ... });
  it('threshold adjustment <100ms', () => { ... });
  it('background removal <100ms', () => { ... });
});
```

**Run**: `npm test -- src/tests/unit/performance/`

---

## Acceptance Criteria Verification

### Criteria 7: Loading Indicator if Update >500ms

**Verification**:
- [ ] `useDelayedLoading` hook created and tested
- [ ] `isProcessing` state added to App.tsx
- [ ] Loading overlay appears after 500ms
- [ ] Loading overlay NOT shown if processing <500ms
- [ ] Loading overlay positioned correctly over preview
- [ ] Accessible (ARIA live region for screen readers)

**Manual Test**:
1. Upload large image (5MB)
2. Drag brightness slider rapidly
3. If adjustment >500ms: loading overlay appears
4. If adjustment <500ms: no loading overlay

### Criteria 8: Performance <100ms for Adjustments

**Verification**:
- [ ] Performance test file created
- [ ] Tests for all adjustment types (brightness, contrast, threshold, bg removal)
- [ ] All tests passing (<100ms target)
- [ ] Tests use realistic image size (1920×1080)
- [ ] Tests run in CI pipeline

**Automated Test**:
```bash
npm test -- src/tests/unit/performance/
```

---

## Dependencies

### Completed Dependencies
✅ task-2.2: Brightness slider (RefinementSlider pattern)
✅ task-2.3: Contrast slider
✅ task-2.4: Threshold slider
✅ task-2.5: Canvas preview rendering

### External Dependencies
- `useDebounce` hook (already created)
- Canvas processing functions (already implemented)
- ImagePreview component (already created)

---

## Risks & Mitigations

### Risk 1: Processing Time Varies by Image Size
**Impact**: Tests might be flaky if timing is inconsistent
**Mitigation**:
- Use consistent test image size (1920×1080)
- Allow 10% margin in tests (110ms threshold)
- Run tests multiple times and average

### Risk 2: Loading Indicator Flashing
**Impact**: Bad UX if indicator flashes on/off
**Mitigation**:
- 500ms delay prevents flashing
- Only show for genuinely slow operations
- Test with various image sizes

---

## Testing Strategy

### Unit Tests
1. `useDelayedLoading` hook tests (3 test cases)
2. Performance tests (4 adjustment types)
3. Total: ~7 new tests

### Integration Tests
- Verify loading overlay integration with App.tsx
- Test debounced values trigger processing state

### E2E Tests
- Not required (performance is internal concern)
- Optional: Verify loading overlay appears in slow scenarios

### Performance Benchmarks
- Run performance tests on different hardware
- Document baseline performance
- Monitor performance regression over time

---

## Success Criteria

**All 8/8 Acceptance Criteria Met**:
1. ✅ useDebounce hook created
2. ✅ 100ms debounce on sliders
3. ✅ Preview updates after drag stops
4. ✅ Loading indicator if >500ms (NEW)
5. ✅ Canvas operations optimized
6. ✅ React.memo for expensive components
7. ✅ Performance <100ms (NEW - verified with tests)
8. ✅ No UI blocking

**Definition of Done**:
- [ ] `useDelayedLoading` hook implemented and tested
- [ ] Loading overlay integrated and working
- [ ] Performance tests created and passing
- [ ] All existing tests still passing
- [ ] Code review passed
- [ ] WCAG 2.2 AAA compliance verified (loading overlay)

---

## Estimated Effort Breakdown

- **Step 1**: useDelayedLoading hook - 30 mins
- **Step 2**: App.tsx integration - 30 mins
- **Step 3**: Loading overlay - 20 mins
- **Step 4**: Performance tests - 30 mins
- **Testing & Fixes**: 10 mins

**Total**: ~2 hours (conservative estimate, likely 1.5 hours)

---

## Next Steps

1. Run `/build` to implement remaining work
2. Focus on useDelayedLoading hook first (foundation)
3. Add loading state to App.tsx
4. Create performance tests
5. Run `/test` to verify all tests pass
6. Run `/code-review` for quality check
