# Task Plan: Otsu's Threshold Algorithm

**Task ID**: task-007
**Task Name**: Otsu's Threshold Algorithm
**Status**: PLANNED
**Created**: 2025-10-05

---

## Overview

Implement Otsu's method for automatic optimal threshold calculation and apply binarization to create high-contrast black-and-white images optimized for laser engraving.

## Algorithm Specification

### Otsu's Method

**Purpose**: Automatically determine the optimal threshold that separates foreground from background by maximizing between-class variance.

**Steps**:

1. **Calculate Histogram**: Count pixel frequency for each intensity value (0-255)
2. **Compute Probabilities**: Normalize histogram to get probability of each intensity
3. **For Each Threshold t (0-255)**:
   - Compute class probabilities: w₀(t), w₁(t)
   - Compute class means: μ₀(t), μ₁(t)
   - Compute between-class variance: σ²ʙ(t) = w₀(t) × w₁(t) × [μ₀(t) - μ₁(t)]²
4. **Select Optimal Threshold**: t* = argmax(σ²ʙ(t))
5. **Apply Binarization**: pixel < t* → 0 (black), pixel ≥ t* → 255 (white)

### Mathematical Formulas

**Class 0 (Background)**: Pixels with intensity [0, t-1]
- Weight: w₀(t) = Σᵢ₌₀ᵗ⁻¹ p(i)
- Mean: μ₀(t) = Σᵢ₌₀ᵗ⁻¹ [i × p(i)] / w₀(t)

**Class 1 (Foreground)**: Pixels with intensity [t, 255]
- Weight: w₁(t) = Σᵢ₌ₜ²⁵⁵ p(i) = 1 - w₀(t)
- Mean: μ₁(t) = Σᵢ₌ₜ²⁵⁵ [i × p(i)] / w₁(t)

**Between-Class Variance**:
σ²ʙ(t) = w₀(t) × w₁(t) × [μ₀(t) - μ₁(t)]²

**Optimal Threshold**:
t* = argmax₀≤ₜ≤₂₅₅ σ²ʙ(t)

---

## Implementation Plan

### Phase 1: Test Suite (TDD - Tests First)

**File**: `src/tests/unit/imageProcessing/otsuThreshold.test.ts`

**Test Cases**:
1. ✅ Calculates optimal threshold for bimodal image (known result)
2. ✅ Handles all-black image (threshold = 0 or 1)
3. ✅ Handles all-white image (threshold = 254 or 255)
4. ✅ Handles uniform gray image (threshold ≈ 127-128)
5. ✅ Binarizes correctly (pixels < threshold → 0, else → 255)
6. ✅ Preserves ImageData dimensions
7. ✅ Performance: <2s for 2MB image (5MP)
8. ✅ Deterministic: same input → same output
9. ✅ Low-contrast image doesn't crash
10. ✅ High-contrast image (already binary) handles gracefully

**Test Data Preparation**:
- Create synthetic test images with known optimal thresholds
- Bimodal distribution: peaks at 50 and 200 → threshold ≈ 125
- All-black: all pixels = 0
- All-white: all pixels = 255
- Uniform: all pixels = 128

### Phase 2: Core Implementation

**File**: `src/lib/imageProcessing/otsuThreshold.ts`

**Functions**:

```typescript
/**
 * Calculate optimal threshold using Otsu's method
 * @param imageData - Grayscale ImageData
 * @returns Optimal threshold value (0-255)
 */
export function calculateOptimalThreshold(imageData: ImageData): number

/**
 * Apply Otsu's threshold to binarize image
 * @param imageData - Grayscale ImageData
 * @returns Binarized ImageData (pure black and white)
 */
export function applyOtsuThreshold(imageData: ImageData): ImageData
```

**Implementation Strategy**:

1. **Histogram Calculation**:
   ```typescript
   const histogram = new Array(256).fill(0);
   for (let i = 0; i < data.length; i += 4) {
     const gray = data[i]; // Already grayscale
     histogram[gray]++;
   }
   ```

2. **Probability Distribution**:
   ```typescript
   const totalPixels = imageData.width * imageData.height;
   const probability = histogram.map(count => count / totalPixels);
   ```

3. **Variance Calculation** (optimized with cumulative sums):
   ```typescript
   let maxVariance = 0;
   let optimalThreshold = 0;

   for (let t = 0; t < 256; t++) {
     const w0 = cumulative_weight[t];
     const w1 = 1 - w0;

     if (w0 === 0 || w1 === 0) continue;

     const mu0 = cumulative_mean[t] / w0;
     const mu1 = (total_mean - cumulative_mean[t]) / w1;

     const variance = w0 * w1 * Math.pow(mu0 - mu1, 2);

     if (variance > maxVariance) {
       maxVariance = variance;
       optimalThreshold = t;
     }
   }
   ```

4. **Binarization**:
   ```typescript
   const output = new ImageData(width, height);
   for (let i = 0; i < data.length; i += 4) {
     const value = data[i] < threshold ? 0 : 255;
     outputData[i] = value;     // R
     outputData[i+1] = value;   // G
     outputData[i+2] = value;   // B
     outputData[i+3] = 255;     // A
   }
   ```

### Phase 3: Integration

**Update**: `src/lib/imageProcessing/index.ts`

```typescript
export { calculateOptimalThreshold, applyOtsuThreshold } from './otsuThreshold';
```

### Phase 4: Performance Optimization

**Targets**:
- 2MB image (2048×1536 ≈ 3.1MP): <2 seconds
- Optimize histogram calculation (single pass)
- Use cumulative sums to avoid repeated summations
- Pre-allocate arrays to avoid reallocation

**Optimization Techniques**:
1. Single-pass histogram calculation
2. Cumulative weight and mean arrays (avoid O(n²) complexity)
3. Typed arrays for better memory efficiency
4. Early termination when w0 or w1 = 0

---

## Acceptance Criteria Checklist

- [ ] `calculateOptimalThreshold()` implemented
- [ ] `applyOtsuThreshold()` implemented
- [ ] Histogram calculation correct
- [ ] Between-class variance formula correct
- [ ] Optimal threshold selection working
- [ ] Binarization applied correctly (< threshold → 0, else → 255)
- [ ] Edge cases handled:
  - [ ] All-black image
  - [ ] All-white image
  - [ ] Uniform gray image
  - [ ] Low-contrast image
  - [ ] High-contrast image
- [ ] Unit tests written and passing
- [ ] Test coverage ≥80%
- [ ] Performance: <2s for 2MB image
- [ ] Deterministic behavior verified
- [ ] TypeScript types correct
- [ ] Pure functions (no side effects)
- [ ] Exported from index.ts
- [ ] Lint passing
- [ ] Type check passing

---

## Performance Benchmarks

**Target**: <2 seconds for 2MB image (2048×1536 pixels)

**Breakdown**:
- Histogram calculation: <100ms
- Variance calculations (256 iterations): <500ms
- Binarization: <500ms
- Total overhead: <900ms
- **Target Total**: <2000ms

**Measurement**:
```typescript
const start = performance.now();
const result = applyOtsuThreshold(imageData);
const duration = performance.now() - start;
expect(duration).toBeLessThan(2000);
```

---

## Dependencies

**Required**:
- Task 1.6 (Histogram Equalization) - provides equalized grayscale input

**Provides To**:
- Task 1.8 (Auto-Prep Flow) - final binarization step in pipeline

---

## Testing Strategy

### Unit Tests

**Test File**: `src/tests/unit/imageProcessing/otsuThreshold.test.ts`

**Coverage**:
1. Threshold calculation accuracy
2. Binarization correctness
3. Edge cases (all-black, all-white, uniform, low/high contrast)
4. Performance benchmarks
5. Deterministic behavior
6. ImageData preservation (dimensions, structure)

### Integration Tests

**Tested in**: Task 1.8 (Auto-Prep Flow)
- Full pipeline: grayscale → histogram equalization → Otsu threshold
- Verify output is binary (only 0 and 255 values)

---

## Risks and Mitigations

**Risk 1**: Low-contrast images produce poor thresholds
- **Mitigation**: Histogram equalization (Task 1.6) runs before Otsu's method
- **Fallback**: Return threshold = 127 if variance is too low

**Risk 2**: Performance issues on large images
- **Mitigation**: Use cumulative sums optimization (O(n) instead of O(n²))
- **Test**: Performance benchmark for 2MB target

**Risk 3**: All-black or all-white images crash
- **Mitigation**: Early detection and safe default (threshold = 0 or 255)
- **Test**: Edge case tests

---

## References

**Algorithm**:
- Otsu, Nobuyuki (1979). "A Threshold Selection Method from Gray-Level Histograms"
- Between-class variance maximization approach

**Documentation**:
- [.autoflow/docs/FUNCTIONAL.md#auto-prep-processing]
- [.autoflow/docs/ARCHITECTURE.md#processing-layer]

---

## Completion Checklist

- [ ] Tests written (TDD approach)
- [ ] Implementation complete
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Edge cases handled
- [ ] Code review passed
- [ ] Integrated with pipeline
- [ ] Documentation updated
- [ ] Status updated to COMPLETE

---

**Estimated Effort**: 5 hours
**Actual Effort**: (Will be recorded on completion)
