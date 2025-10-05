# Task Plan: Histogram Equalization Algorithm

**Task ID**: task-006
**Task Name**: Histogram Equalization Algorithm
**Status**: PLANNED
**Estimated Effort**: 4 hours
**Created**: 2025-10-05

---

## Overview

Implement histogram equalization algorithm to enhance image contrast automatically as part of the auto-prep processing pipeline. This step makes details more visible for laser engraving by spreading the tonal distribution across the full 0-255 range.

---

## Algorithm Specification

From `.autoflow/docs/FUNCTIONAL.md#auto-prep-processing`:

```
Histogram Equalization:
1. Calculate histogram of grayscale values (0-255)
2. Compute cumulative distribution function (CDF)
3. Normalize CDF to 0-255 range
4. Map each pixel value through normalized CDF
```

**Mathematical Formula**:
```
For each intensity value i:
  CDF[i] = Σ(histogram[0] to histogram[i])

Normalized CDF:
  normalized[i] = ((CDF[i] - CDF_min) / (total_pixels - CDF_min)) × 255

Where CDF_min = first non-zero value in CDF

Pixel mapping:
  new_pixel_value = normalized[old_pixel_value]
```

---

## Implementation Plan

### Phase 1: Test Setup (TDD - Tests First)

**File**: `/opt/workspaces/craftyprep.com/src/tests/unit/histogramEqualization.test.ts`

**Test Cases**:
1. **Histogram Calculation Test**
   - Create known grayscale image (e.g., 2×2 with values [0, 128, 128, 255])
   - Calculate histogram
   - Verify: histogram[0] = 1, histogram[128] = 2, histogram[255] = 1, others = 0

2. **CDF Computation Test**
   - Given histogram from test 1
   - Verify CDF is monotonically increasing
   - Verify CDF[255] = total pixel count
   - Verify CDF[0] = histogram[0]

3. **CDF Normalization Test**
   - Given CDF from test 2
   - Verify normalized values are in 0-255 range
   - Verify minimum maps close to 0
   - Verify maximum maps to 255

4. **Deterministic Output Test**
   - Process same image twice
   - Verify pixel-perfect identical results

5. **Contrast Enhancement Test**
   - Create low-contrast image (values clustered around 128)
   - Apply equalization
   - Measure standard deviation before/after
   - Verify std deviation increased (contrast enhanced)

6. **Edge Case: All-White Image**
   - ImageData with all pixels = 255
   - Apply equalization
   - Verify output unchanged (all 255)

7. **Edge Case: All-Black Image**
   - ImageData with all pixels = 0
   - Apply equalization
   - Verify output unchanged (all 0)

8. **Performance Test**
   - Create 5MP grayscale image (2236×2236 pixels ≈ 5,000,000 pixels)
   - Measure execution time
   - Assert: execution time < 1000ms

**Expected to fail initially** (tests written before implementation).

---

### Phase 2: Helper Functions Implementation

**File**: `/opt/workspaces/craftyprep.com/src/lib/imageProcessing.ts`

**Function 1: calculateHistogram**
```typescript
/**
 * Calculate histogram of grayscale image
 * @param imageData - Grayscale ImageData (R=G=B)
 * @returns Array of 256 bins with frequency counts
 */
function calculateHistogram(imageData: ImageData): number[] {
  const histogram = new Array(256).fill(0);

  // Iterate through pixels (step by 4 for RGBA)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const gray = imageData.data[i]; // R channel (same as G and B in grayscale)
    histogram[gray]++;
  }

  return histogram;
}
```

**Function 2: computeCDF**
```typescript
/**
 * Compute cumulative distribution function
 * @param histogram - 256-bin histogram
 * @returns CDF array (256 values)
 */
function computeCDF(histogram: number[]): number[] {
  const cdf = new Array(256);
  cdf[0] = histogram[0];

  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + histogram[i];
  }

  return cdf;
}
```

**Function 3: normalizeCDF**
```typescript
/**
 * Normalize CDF to 0-255 range
 * @param cdf - Cumulative distribution function
 * @param totalPixels - Total number of pixels
 * @returns Normalized CDF (lookup table for pixel mapping)
 */
function normalizeCDF(cdf: number[], totalPixels: number): Uint8ClampedArray {
  const normalized = new Uint8ClampedArray(256);

  // Find first non-zero CDF value (CDF_min)
  let cdfMin = 0;
  for (let i = 0; i < 256; i++) {
    if (cdf[i] > 0) {
      cdfMin = cdf[i];
      break;
    }
  }

  // Normalize each value
  const denominator = totalPixels - cdfMin;
  for (let i = 0; i < 256; i++) {
    if (denominator === 0) {
      // All pixels same value - no equalization possible
      normalized[i] = i;
    } else {
      normalized[i] = Math.round(((cdf[i] - cdfMin) / denominator) * 255);
    }
  }

  return normalized;
}
```

---

### Phase 3: Main Function Implementation

**Function: applyHistogramEqualization**
```typescript
/**
 * Apply histogram equalization to enhance contrast
 * @param imageData - Grayscale ImageData (R=G=B for all pixels)
 * @returns New ImageData with equalized histogram
 */
export function applyHistogramEqualization(imageData: ImageData): ImageData {
  // Step 1: Calculate histogram
  const histogram = calculateHistogram(imageData);

  // Step 2: Compute CDF
  const cdf = computeCDF(histogram);

  // Step 3: Normalize CDF to create lookup table
  const totalPixels = imageData.width * imageData.height;
  const lookupTable = normalizeCDF(cdf, totalPixels);

  // Step 4: Map pixels through lookup table
  const result = new ImageData(imageData.width, imageData.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const oldValue = imageData.data[i]; // Grayscale value
    const newValue = lookupTable[oldValue]; // Map through equalized CDF

    // Set RGB (all same for grayscale)
    result.data[i] = newValue;
    result.data[i + 1] = newValue;
    result.data[i + 2] = newValue;

    // Preserve alpha
    result.data[i + 3] = imageData.data[i + 3];
  }

  return result;
}
```

---

### Phase 4: Run Tests and Iterate

1. Run unit tests: `npm test src/tests/unit/histogramEqualization.test.ts`
2. Fix any failures
3. Verify all tests pass
4. Check code coverage: `npm run test:coverage`
5. Ensure ≥80% coverage for new code

---

### Phase 5: Integration Verification

**Verify pipeline integration**:
```typescript
// This will be implemented in task-008, but verify compatibility now
const pipeline = [
  convertToGrayscale,        // task-005 (COMPLETE)
  applyHistogramEqualization, // task-006 (this task)
  // calculateOtsuThreshold,  // task-007 (next)
  // applyThreshold          // task-007 (next)
];

// Test: grayscale → equalization works correctly
const grayscale = convertToGrayscale(originalImageData);
const equalized = applyHistogramEqualization(grayscale);

// Verify output is valid ImageData
// Verify dimensions match input
// Verify contrast is enhanced
```

---

## Implementation Checklist

### Tests (Phase 1)
- [ ] Create test file: `src/tests/unit/histogramEqualization.test.ts`
- [ ] Test: Histogram calculation correctness
- [ ] Test: CDF computation correctness
- [ ] Test: CDF normalization to 0-255
- [ ] Test: Deterministic output
- [ ] Test: Contrast enhancement verification
- [ ] Test: Edge case - all-white image
- [ ] Test: Edge case - all-black image
- [ ] Test: Performance (<1s for 5MP image)
- [ ] All tests fail initially (TDD)

### Implementation (Phases 2-3)
- [ ] Implement `calculateHistogram()` helper
- [ ] Implement `computeCDF()` helper
- [ ] Implement `normalizeCDF()` helper
- [ ] Implement `applyHistogramEqualization()` main function
- [ ] Add TypeScript types and JSDoc comments
- [ ] Ensure pure functions (no side effects)

### Verification (Phase 4)
- [ ] All unit tests passing
- [ ] Code coverage ≥80%
- [ ] Type checking passes: `npm run typecheck`
- [ ] Linting passes: `npm run lint`
- [ ] Performance target met (<1s for 2MB image)

### Integration (Phase 5)
- [ ] Verify works with grayscale output from task-005
- [ ] Verify output suitable for task-007 (Otsu threshold)
- [ ] Add to imageProcessing.ts exports
- [ ] Update module documentation

---

## Technical Decisions

### Decision 1: Helper Function Visibility
**Options**:
- A) Export helpers for easier testing
- B) Keep helpers private, test through main function

**Decision**: Keep helpers private (not exported)
**Rationale**:
- Main function is the public API
- Implementation details can change
- Test through main function with comprehensive test cases
- Simpler public interface

### Decision 2: Input Validation
**Options**:
- A) Validate input is grayscale (R=G=B)
- B) Assume input is grayscale (trust caller)
- C) Auto-convert to grayscale if needed

**Decision**: Assume input is grayscale (Option B)
**Rationale**:
- Pipeline enforces order: grayscale → equalization
- Input validation adds overhead
- TypeScript types document expected input
- Fail-fast if misused (clear error)

### Decision 3: Performance Optimization
**Options**:
- A) Simple implementation, optimize if needed
- B) Pre-optimize with Web Workers
- C) Use typed arrays throughout

**Decision**: Simple implementation with typed arrays (A + C)
**Rationale**:
- Target is <1s for 2MB - achievable with simple approach
- Uint8ClampedArray for normalized CDF (native performance)
- Web Workers add complexity (defer to future if needed)

---

## Performance Targets

- **2MB image (5MP)**: <1 second total processing
- **Algorithm complexity**: O(n) where n = number of pixels
- **Memory usage**: O(1) extra memory (256-element arrays, reusable)

**Breakdown**:
- Histogram calculation: O(n) - ~200ms for 5MP
- CDF computation: O(256) = O(1) - negligible
- CDF normalization: O(256) = O(1) - negligible
- Pixel mapping: O(n) - ~300ms for 5MP
- **Total**: ~500ms for 5MP image (well under 1s target)

---

## Files Modified/Created

### Created
- `/opt/workspaces/craftyprep.com/src/tests/unit/histogramEqualization.test.ts`

### Modified
- `/opt/workspaces/craftyprep.com/src/lib/imageProcessing.ts` (add histogram equalization)

---

## Dependencies

**Depends On**:
- task-005 (Grayscale Conversion) - COMPLETE
  - Provides grayscale ImageData as input
  - Ensures R=G=B for all pixels

**Blocks**:
- task-007 (Otsu's Threshold Algorithm)
  - Requires equalized grayscale image as input
- task-008 (Auto-Prep Button and Processing Flow)
  - Requires complete processing pipeline

---

## Success Criteria

1. ✅ All unit tests passing (8 tests minimum)
2. ✅ Code coverage ≥80% for new code
3. ✅ TypeScript compilation successful
4. ✅ Linting passes (no errors or warnings)
5. ✅ Performance: <1s for 2MB/5MP image
6. ✅ Deterministic: same input always produces same output
7. ✅ Contrast enhancement measurable (std deviation increase)
8. ✅ Edge cases handled correctly (all-white, all-black)
9. ✅ Integration with pipeline works (grayscale → equalization)
10. ✅ Pure function (no side effects, immutable)

---

## Estimated Breakdown

- **Phase 1 (Tests)**: 1.5 hours
  - Write 8 comprehensive unit tests
  - Set up test utilities and fixtures

- **Phase 2 (Helpers)**: 1 hour
  - Implement 3 helper functions
  - Add TypeScript types and docs

- **Phase 3 (Main Function)**: 1 hour
  - Implement main equalization function
  - Wire up helper functions

- **Phase 4 (Verification)**: 0.5 hours
  - Run tests and fix any issues
  - Verify coverage and performance

- **Total**: 4 hours

---

## Notes

- This algorithm is a standard computer vision technique
- Improves contrast by utilizing full tonal range (0-255)
- Critical for laser engraving to reveal details in midtones
- Works best on grayscale images (prerequisite: task-005)
- Output feeds directly into Otsu threshold (task-007)

---

**Next Steps After Completion**:
1. Update task-006 status: PLANNED → REVIEW
2. Run `/code-review` to validate implementation
3. Proceed to task-007 (Otsu's Threshold Algorithm)
