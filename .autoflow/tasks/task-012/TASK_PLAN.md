# Task Plan: Brightness Adjustment Implementation

**Task ID**: task-012
**Status**: PLANNED
**Estimated Effort**: 3 hours
**Priority**: HIGH

---

## Overview

Implement brightness adjustment algorithm and integrate with BrightnessSlider component to enable real-time preview updates with debounced performance optimization.

### Dependencies
- ✅ task-011 (BrightnessSlider component) - COMMITTED
- ✅ Existing image processing pipeline (useImageProcessing hook)
- ✅ Canvas API infrastructure

---

## Implementation Approach: 5-Phase TDD

### Phase 1: Pure Function Implementation (30 min)

**Objective**: Create brightness adjustment algorithm as pure function

**Files to Create**:
- `src/lib/imageProcessing/applyBrightness.ts`
- `tests/unit/imageProcessing/applyBrightness.test.ts`

**Algorithm Specification**:
```typescript
/**
 * Apply brightness adjustment to image data
 * Formula: newValue = clamp(originalValue + brightness, 0, 255)
 * Applied to R, G, B channels (alpha unchanged)
 */
function applyBrightness(imageData: ImageData, brightness: number): ImageData
```

**Implementation Steps**:
1. Write failing tests first (TDD):
   - brightness = 0 → no change
   - brightness = +50 → pixels 50 units brighter
   - brightness = -50 → pixels 50 units darker
   - brightness = +100 → clamp at 255 (edge case)
   - brightness = -100 → clamp at 0 (edge case)
   - Alpha channel preserved
   - Pure function (no mutation)

2. Implement function:
   - Create new ImageData (copy input)
   - Loop through pixels (i += 4 for RGBA)
   - Apply formula to R, G, B channels
   - Clamp values to 0-255 range
   - Return new ImageData

3. Follow existing pattern from `grayscale.ts`

**Acceptance Criteria**:
- [ ] All unit tests pass
- [ ] Function is pure (no side effects)
- [ ] Performance: O(n) where n = pixel count
- [ ] Matches specification: `newValue = clamp(value + brightness, 0, 255)`

---

### Phase 2: State Management Integration (60 min)

**Objective**: Wire brightness adjustment to processing pipeline with baseline storage

**Files to Modify**:
- `src/hooks/useImageProcessing.ts`
- `src/App.tsx`
- `src/lib/imageProcessing/index.ts` (export applyBrightness)

**Hook Refactoring** (useImageProcessing.ts):

**Current State**:
```typescript
{
  processedImage: HTMLImageElement | null;
  processedCanvas: HTMLCanvasElement | null;
  isProcessing: boolean;
  error: string | null;
  runAutoPrepAsync: (image) => Promise<void>;
}
```

**New State**:
```typescript
{
  processedImage: HTMLImageElement | null;
  processedCanvas: HTMLCanvasElement | null;
  baselineImageData: ImageData | null;  // NEW: Auto-prep result before adjustments
  isProcessing: boolean;
  error: string | null;
  runAutoPrepAsync: (image) => Promise<void>;
  applyAdjustments: (brightness: number) => Promise<void>;  // NEW: Apply brightness
}
```

**Key Design Decision**:
- Auto-prep creates BASELINE (grayscale → histogram eq → threshold)
- Brightness adjustments apply to BASELINE, not original image
- Store baseline ImageData for efficient re-processing

**Implementation Steps**:
1. Add `baselineImageData` state to useImageProcessing
2. Modify `runAutoPrepAsync` to store baseline after Otsu threshold
3. Create `applyAdjustments(brightness)` method:
   - Clone baselineImageData
   - Apply brightness adjustment
   - Convert to HTMLImageElement
   - Update processedImage state

**App.tsx Changes**:
1. Add brightness state: `const [brightness, setBrightness] = useState(0)`
2. Wire BrightnessSlider: `onChange={setBrightness}`
3. Call applyAdjustments when brightness changes

**Acceptance Criteria**:
- [ ] Baseline stored after auto-prep
- [ ] Brightness applies to baseline (not original)
- [ ] Preview updates when brightness changes
- [ ] No regression in auto-prep functionality

---

### Phase 3: Debouncing Implementation (30 min)

**Objective**: Prevent excessive processing during slider drag (<100ms response)

**Files to Create**:
- `src/hooks/useDebounce.ts`
- `tests/unit/hooks/useDebounce.test.ts`

**Debounce Hook**:
```typescript
/**
 * Debounce a value by delayMs milliseconds
 * Updates only after value stops changing for delayMs
 */
function useDebounce<T>(value: T, delayMs: number): T
```

**Implementation Steps**:
1. Write tests for useDebounce:
   - Value updates after delay
   - Resets timer on rapid changes
   - Cleanup on unmount

2. Implement hook:
   - Use useState for debounced value
   - Use useEffect with setTimeout
   - Cleanup function clears timeout

3. Integrate in App.tsx:
   ```typescript
   const [brightness, setBrightness] = useState(0);
   const debouncedBrightness = useDebounce(brightness, 100);

   useEffect(() => {
     if (baselineImageData) {
       applyAdjustments(debouncedBrightness);
     }
   }, [debouncedBrightness]);
   ```

**Acceptance Criteria**:
- [ ] Slider updates immediately (UI responsive)
- [ ] Processing triggered 100ms after drag stops
- [ ] No excessive processing during drag
- [ ] Performance: <100ms response time

---

### Phase 4: Testing (45 min)

**Objective**: Comprehensive test coverage for brightness adjustment

**Files to Create**:
- `tests/integration/BrightnessAdjustment.test.tsx`

**Files to Modify**:
- `tests/e2e/happy-path.spec.ts` (add brightness step)

**Integration Tests** (BrightnessAdjustment.test.tsx):
```typescript
describe('Brightness Adjustment Integration', () => {
  test('auto-prep then brightness adjustment updates preview');
  test('debouncing prevents excessive processing');
  test('brightness = 0 matches baseline');
  test('multiple brightness changes work correctly');
  test('error handling for invalid brightness values');
});
```

**E2E Test Addition** (happy-path.spec.ts):
```typescript
test('user can adjust brightness after auto-prep', async ({ page }) => {
  // Upload image
  // Click auto-prep
  // Adjust brightness slider
  // Verify preview updates
  // Verify performance <100ms
});
```

**Test Coverage Goals**:
- Unit tests: applyBrightness function (100%)
- Integration tests: Full brightness adjustment flow
- E2E tests: User workflow with performance validation

**Acceptance Criteria**:
- [ ] All tests pass
- [ ] Coverage ≥80% for new code
- [ ] E2E test validates <100ms response
- [ ] No flaky tests

---

### Phase 5: Documentation & Review (15 min)

**Objective**: Document implementation and prepare for code review

**Documentation Tasks**:
1. Add JSDoc comments to all new functions
2. Update README if needed (probably not)
3. Document performance characteristics
4. Add inline comments for complex logic

**Code Review Checklist**:
- [ ] Follows existing code patterns (grayscale.ts, etc.)
- [ ] Pure functional approach maintained
- [ ] No memory leaks (ImageData cleanup)
- [ ] TypeScript types complete
- [ ] Error handling comprehensive
- [ ] Accessibility maintained (slider already accessible)

**Performance Validation**:
- [ ] 2MB image: brightness adjustment <100ms
- [ ] Debouncing works correctly
- [ ] No UI blocking during processing

---

## File Structure

```
src/
├── lib/
│   └── imageProcessing/
│       ├── applyBrightness.ts       [NEW]
│       └── index.ts                 [MODIFIED - export applyBrightness]
├── hooks/
│   ├── useDebounce.ts               [NEW]
│   └── useImageProcessing.ts        [MODIFIED - add baseline + applyAdjustments]
├── App.tsx                          [MODIFIED - add brightness state + debouncing]
└── tests/
    ├── unit/
    │   ├── imageProcessing/
    │   │   └── applyBrightness.test.ts     [NEW]
    │   └── hooks/
    │       └── useDebounce.test.ts          [NEW]
    ├── integration/
    │   └── BrightnessAdjustment.test.tsx    [NEW]
    └── e2e/
        └── happy-path.spec.ts               [MODIFIED - add brightness step]
```

---

## Key Design Decisions

### 1. Apply to Baseline, Not Original
**Decision**: Brightness applies to auto-prep result (baseline), not original image

**Rationale**:
- User expects to refine the auto-prep result
- Matches functional specification
- More intuitive user experience

### 2. Store Baseline as ImageData
**Decision**: Store baseline as ImageData, not canvas or image

**Rationale**:
- Efficient re-processing (no canvas redraw)
- Matches pure functional pattern
- Easy to apply multiple adjustments later (contrast, threshold)

### 3. Debounce at 100ms
**Decision**: 100ms debounce delay

**Rationale**:
- Meets performance requirement (<100ms)
- Balances responsiveness vs. processing cost
- Standard debounce duration for sliders

### 4. Pure Functional Approach
**Decision**: All processing functions pure (ImageData → ImageData)

**Rationale**:
- Matches existing codebase patterns
- Easier to test
- No side effects or mutation bugs
- Composable (can add more adjustments later)

---

## Risk Assessment

### Low Risk
- ✅ Algorithm is simple and well-defined
- ✅ Pattern exists in codebase (grayscale.ts)
- ✅ BrightnessSlider already implemented
- ✅ Canvas API well-supported

### Medium Risk
- ⚠️  Hook refactoring might affect auto-prep flow
  - **Mitigation**: Comprehensive integration tests
  - **Mitigation**: Test auto-prep still works after changes

### Potential Issues
- Memory usage with large images (ImageData stored)
  - **Mitigation**: Cleanup on new upload or reset
  - **Monitoring**: Test with 10MB images

---

## Performance Targets

- **Brightness Algorithm**: O(n) time complexity (n = pixels)
- **2MB Image**: <100ms adjustment time
- **Slider Response**: <100ms after drag stops (debounced)
- **Memory**: <50MB additional for baseline storage

---

## Next Steps

After completing this task:
1. Run `/code-review` to validate quality
2. Run `/test` to ensure all tests pass
3. Run `/verify-implementation` for E2E validation
4. Run `/commit` when COMPLETE

**Then proceed to**: task-013 (Contrast Adjustment) - similar pattern, faster implementation

---

## Notes

- This task establishes the pattern for contrast and threshold adjustments
- Debouncing hook will be reused for contrast/threshold sliders
- Baseline storage enables efficient multi-adjustment workflow
- Pure functional approach makes future enhancements easy (undo/redo, presets)
