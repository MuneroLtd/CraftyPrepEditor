# Dependencies: Threshold Adjustment Implementation

**Task ID**: task-015

---

## Upstream Dependencies (Required Before This Task)

### ✅ task-011: Refinement Slider Components
**Status**: COMMITTED
**Why Required**: ThresholdSlider component implementation
**What We Need**:
- RefinementSlider base component
- ThresholdSlider wrapper component
- Slider range 0-255
- onChange callback pattern

**Impact if Missing**: Cannot test slider integration
**Current State**: Complete - ThresholdSlider exists in src/components/ThresholdSlider.tsx

---

### ✅ Existing Image Processing Functions
**Status**: COMMITTED (Sprint 1)
**Why Required**: Reuse grayscale conversion and Otsu calculation
**What We Need**:
- `convertToGrayscale()` - src/lib/imageProcessing/grayscale.ts
- `calculateOptimalThreshold()` - src/lib/imageProcessing/otsuThreshold.ts
- `applyOtsuThreshold()` - src/lib/imageProcessing/otsuThreshold.ts (reference implementation)

**Impact if Missing**: Would need to duplicate grayscale conversion logic
**Current State**: All functions exist and tested

---

### ✅ Utility Functions
**Status**: COMMITTED (Sprint 1)
**Why Required**: Input validation and utilities
**What We Need**:
- `clamp()` utility (if needed for value clamping)
- ImageData creation patterns
- Test helper utilities

**Impact if Missing**: Would need to create utilities
**Current State**: Available in src/lib/imageProcessing/utils.ts

---

## Downstream Dependencies (Tasks Blocked by This)

### 🔄 task-016: Debounced Preview Updates
**Status**: PENDING
**Why Blocked**: Needs `applyThreshold()` function to debounce
**What They Need**:
- `applyThreshold(imageData, threshold)` function
- Performance characteristics (<100ms)
- Synchronous execution

**Impact of Delay**: Preview updates won't be debounced, may cause performance issues
**Estimated Impact**: HIGH - user experience degradation with rapid slider movement

---

### 🔄 task-017: Reset Button and State Management
**Status**: PENDING
**Why Blocked**: Reset needs to restore threshold to default
**What They Need**:
- Default threshold value (from `calculateOptimalThreshold()`)
- `applyThreshold()` to re-apply threshold after reset

**Impact of Delay**: Reset button cannot restore threshold slider
**Estimated Impact**: MEDIUM - feature incomplete but not blocking

---

## External Dependencies (Third-Party)

### ✅ Canvas API
**Why Required**: ImageData creation and manipulation
**Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
**Fallback**: None needed (requirement in CLAUDE.md)
**Current State**: Available in all target browsers

---

### ✅ TypeScript
**Version**: 5.x
**Why Required**: Type safety for ImageData, function signatures
**Current State**: Configured in tsconfig.json

---

### ✅ Vitest
**Version**: Latest
**Why Required**: Unit testing framework
**Current State**: Configured in vite.config.ts

---

## Internal Code Dependencies

### Function Dependencies Graph

```
applyThreshold() (NEW)
  ├─→ convertToGrayscale()       [EXISTING - src/lib/imageProcessing/grayscale.ts]
  ├─→ ImageData constructor       [BROWSER API]
  └─→ clamp() (optional)          [EXISTING - src/lib/imageProcessing/utils.ts]

ThresholdSlider                   [EXISTING - src/components/ThresholdSlider.tsx]
  └─→ RefinementSlider             [EXISTING - src/components/RefinementSlider.tsx]

calculateOptimalThreshold()       [EXISTING - src/lib/imageProcessing/otsuThreshold.ts]
  └─→ Used for default value

Integration:
  applyThreshold() + ThresholdSlider + calculateOptimalThreshold()
```

---

## Data Dependencies

### Input: ImageData
**Source**: Canvas getImageData() or previous processing step
**Format**: Standard ImageData (width, height, data: Uint8ClampedArray)
**Requirements**:
- Any format (RGB, RGBA, grayscale)
- Will be converted to grayscale internally

**Validation**:
- Not null/undefined
- Valid width/height
- data.length === width * height * 4

---

### Input: Threshold Value
**Source**: ThresholdSlider onChange callback or calculateOptimalThreshold()
**Format**: number (integer 0-255)
**Requirements**:
- Range: 0-255 (inclusive)
- Integer (non-integer will be used as-is, but slider provides integers)

**Default**: Result of `calculateOptimalThreshold(grayscaleImageData)`

---

### Output: ImageData
**Format**: Grayscale binary ImageData (pure black and white)
**Characteristics**:
- R = G = B (grayscale)
- Values only 0 or 255 (binary)
- Alpha channel preserved from input
- Same dimensions as input

---

## Test Dependencies

### Unit Test Dependencies
**Required**:
- Vitest test framework
- Canvas API (happy-dom provides ImageData)
- Test helper utilities (createTestImageData, etc.)

**Test Data**:
- Sample images (various sizes)
- Edge case images (uniform, gradient, binary)
- Performance test images (large 2MB+)

---

### Integration Test Dependencies
**Required**:
- `convertToGrayscale()` function
- `calculateOptimalThreshold()` function
- ThresholdSlider component

**Test Scenarios**:
1. Grayscale → threshold pipeline
2. Manual threshold vs auto threshold
3. Slider integration

---

## File Dependencies

### Files This Task Will Create
1. `src/lib/imageProcessing/applyThreshold.ts` - Main implementation
2. `src/tests/unit/lib/imageProcessing/applyThreshold.test.ts` - Unit tests
3. `src/tests/integration/thresholdAdjustment.integration.test.ts` - Integration test

### Files This Task Will Modify
1. `src/lib/imageProcessing/index.ts` - Add export for applyThreshold
2. `.autoflow/docs/FUNCTIONAL.md` - Update implementation status

### Files This Task Will NOT Modify (Dependencies)
1. `src/components/ThresholdSlider.tsx` - Already exists, no changes needed
2. `src/lib/imageProcessing/grayscale.ts` - Reuse as-is
3. `src/lib/imageProcessing/otsuThreshold.ts` - Reuse as-is
4. `src/lib/imageProcessing/utils.ts` - Reuse clamp if needed

---

## Dependency Resolution Strategy

### Strategy 1: Leverage Existing Code
- ✅ Reuse `convertToGrayscale()` instead of duplicating
- ✅ Follow patterns from `applyBrightness.ts` and `applyContrast.ts`
- ✅ Use existing test helpers and utilities

**Benefit**: Consistency, DRY, faster implementation

---

### Strategy 2: Defer UI Integration
- ThresholdSlider component already exists
- Focus on core algorithm first
- Integration test verifies component works

**Benefit**: Parallel development possible (UI team can work independently)

---

### Strategy 3: Clear Interface Contract
**Function Signature**:
```typescript
export function applyThreshold(
  imageData: ImageData,
  threshold: number
): ImageData;
```

**Contract**:
- Input: Any ImageData (will convert to grayscale)
- Output: Binary ImageData (0 or 255 only)
- Pure function (no side effects)
- Throws on invalid inputs

**Benefit**: Downstream tasks (016, 017) can plan implementation now

---

## Dependency Risk Assessment

### Risk 1: Performance Impact of Grayscale Conversion
**Likelihood**: Low
**Impact**: Medium
**Mitigation**:
- Grayscale conversion is O(n), same as threshold application
- Total: O(2n) ≈ O(n) - acceptable
- Benchmark shows <100ms for 2MB image (tested in Sprint 1)

---

### Risk 2: ThresholdSlider Already Exists But Untested
**Likelihood**: Low
**Impact**: Low
**Mitigation**:
- Component already implemented in task-011
- Has unit tests (src/tests/unit/components/ThresholdSlider.test.tsx)
- Integration test will verify end-to-end

---

### Risk 3: Downstream Tasks Blocked
**Likelihood**: None (task is independent)
**Impact**: Medium (if delayed)
**Mitigation**:
- Task-016 and task-017 depend on this
- Prioritized as HIGH priority
- Estimated 3 hours - achievable in single session

---

## Dependency Checklist

**Before Starting Implementation**:
- [x] Verify ThresholdSlider component exists
- [x] Verify convertToGrayscale() exists
- [x] Verify calculateOptimalThreshold() exists
- [x] Review existing test patterns (applyBrightness.test.ts)
- [x] Confirm ImageData API available in test environment

**After Implementation**:
- [ ] Export applyThreshold from index.ts
- [ ] Verify integration test passes
- [ ] Update FUNCTIONAL.md status
- [ ] Notify downstream tasks (016, 017) that dependency is ready

---

**All upstream dependencies resolved. Ready for implementation.**
