# Task Plan: Threshold Adjustment Implementation

**Task ID**: task-015
**Sprint**: Sprint 2 - Refinement Controls & UX
**Status**: PLANNED
**Estimated Effort**: 3 hours
**Created**: 2025-10-05

---

## Overview

Implement manual threshold override functionality for image binarization. Create an `applyThreshold()` function that accepts a manual threshold value (0-255) and applies binarization to grayscale images. This enables users to override the auto-calculated Otsu threshold and fine-tune the black/white separation point for optimal laser engraving results.

---

## Technical Approach

### Core Algorithm

**Threshold Binarization**:
```typescript
function applyThreshold(imageData: ImageData, threshold: number): ImageData {
  // 1. Validate inputs
  // 2. Convert to grayscale (if not already)
  // 3. Apply binarization: pixel < threshold → 0 (black), pixel >= threshold → 255 (white)
  // 4. Return new ImageData
}
```

**Key Difference from Existing**:
- `applyOtsuThreshold()`: Auto-calculates optimal threshold using Otsu's algorithm
- `applyThreshold()`: Accepts manual threshold parameter for user override

### Integration Points

1. **Existing Components**:
   - `ThresholdSlider` component (already exists in src/components/ThresholdSlider.tsx)
   - `calculateOptimalThreshold()` for default value
   - `convertToGrayscale()` for grayscale conversion

2. **Processing Pipeline**:
   ```
   User adjusts threshold slider
        ↓
   Get current imageData
        ↓
   Call applyThreshold(imageData, sliderValue)
        ↓
   Update preview canvas
   ```

---

## 5-Phase TDD Implementation

### Phase 1: Unit Tests (Test-First) - 45 min

**File**: `src/tests/unit/lib/imageProcessing/applyThreshold.test.ts`

**Test Cases**:
1. **Valid threshold values**:
   - Threshold = 0 (all white)
   - Threshold = 128 (mid-point)
   - Threshold = 255 (all black)

2. **Edge cases**:
   - Uniform gray image (all pixels same value)
   - Already binary image
   - Mixed intensity image

3. **Validation**:
   - Threshold < 0 (should throw)
   - Threshold > 255 (should throw)
   - Null/undefined imageData (should throw)

4. **Grayscale handling**:
   - RGB image → convert to grayscale → apply threshold
   - Already grayscale → apply threshold directly

**Expected Behavior**:
- Tests initially fail (Red phase)
- Validate input parameters
- Pure function (no side effects)
- Preserve alpha channel

**Pattern**: Follow `applyBrightness.test.ts` structure

---

### Phase 2: Core Implementation - 60 min

**File**: `src/lib/imageProcessing/applyThreshold.ts`

**Implementation Steps**:

1. **Input Validation**:
   ```typescript
   if (!imageData) {
     throw new Error('applyThreshold: imageData parameter is required');
   }
   if (threshold < 0 || threshold > 255) {
     throw new Error('applyThreshold: threshold must be in range [0, 255]');
   }
   ```

2. **Grayscale Conversion**:
   ```typescript
   import { convertToGrayscale } from './grayscale';

   // Convert to grayscale first (idempotent - if already gray, no change)
   const grayscale = convertToGrayscale(imageData);
   ```

3. **Binarization**:
   ```typescript
   const output = new ImageData(width, height);
   for (let i = 0; i < data.length; i += 4) {
     const gray = data[i]; // R channel (all R=G=B in grayscale)
     const binary = gray < threshold ? 0 : 255;
     output.data[i] = output.data[i+1] = output.data[i+2] = binary;
     output.data[i+3] = data[i+3]; // Preserve alpha
   }
   ```

4. **JSDoc Documentation**:
   - Function purpose
   - Algorithm explanation
   - Parameters and return type
   - Examples
   - Performance notes
   - @pure annotation

**Make Tests Pass** (Green phase)

---

### Phase 3: Refactor & Optimize - 30 min

**Refactoring**:
1. Extract grayscale check (optimization):
   ```typescript
   // Check if already grayscale (R=G=B for all pixels)
   function isGrayscale(imageData: ImageData): boolean {
     // Sample check or full check depending on performance
   }
   ```

2. Code quality:
   - DRY: Reuse existing utilities (clamp, convertToGrayscale)
   - SOLID: Single responsibility (threshold only)
   - Consistent with applyBrightness/applyContrast patterns

3. Performance optimization:
   - Minimize allocations
   - Efficient pixel loop
   - Consider TypedArray optimizations

**Run Tests** - All should still pass (Refactor phase)

---

### Phase 4: Integration - 30 min

**Export Function**:
```typescript
// src/lib/imageProcessing/index.ts
export { applyThreshold } from './applyThreshold';
export { calculateOptimalThreshold, applyOtsuThreshold } from './otsuThreshold';
```

**Integration Test**:
```typescript
// src/tests/integration/thresholdAdjustment.integration.test.ts
describe('Threshold Adjustment Integration', () => {
  it('should apply manual threshold override', () => {
    // 1. Load test image
    // 2. Calculate default threshold (Otsu)
    // 3. Apply manual threshold (different value)
    // 4. Verify results differ
    // 5. Verify both are valid binary images
  });
});
```

**Component Verification**:
- Verify `ThresholdSlider` component exists and works
- Slider range: 0-255
- Default value: result of `calculateOptimalThreshold()`

---

### Phase 5: Documentation - 15 min

**Code Documentation**:
- Comprehensive JSDoc in `applyThreshold.ts`
- Algorithm explanation in comments
- Usage examples

**Update Design Docs**:
```markdown
// .autoflow/docs/FUNCTIONAL.md (Threshold Adjustment section)
**Implementation**: COMPLETE
- **File**: src/lib/imageProcessing/applyThreshold.ts
- **Function**: applyThreshold(imageData, threshold)
- **Range**: 0-255
- **Default**: Auto-calculated via Otsu's method
```

---

## Files to Create/Modify

### New Files:
1. `src/lib/imageProcessing/applyThreshold.ts` - Core implementation
2. `src/tests/unit/lib/imageProcessing/applyThreshold.test.ts` - Unit tests
3. `src/tests/integration/thresholdAdjustment.integration.test.ts` - Integration test

### Modified Files:
1. `src/lib/imageProcessing/index.ts` - Export new function
2. `.autoflow/docs/FUNCTIONAL.md` - Update implementation status

### Existing Files (No Changes Needed):
- `src/components/ThresholdSlider.tsx` - Already exists
- `src/lib/imageProcessing/otsuThreshold.ts` - calculateOptimalThreshold() already exists
- `src/lib/imageProcessing/grayscale.ts` - convertToGrayscale() already exists

---

## Testing Strategy

### Unit Tests (≥80% coverage):
- ✅ Valid threshold values (0, 128, 255)
- ✅ Edge cases (uniform, binary, mixed)
- ✅ Input validation (out of range, null)
- ✅ Grayscale conversion handling
- ✅ Alpha channel preservation
- ✅ Pure function (no side effects)

### Integration Tests:
- ✅ Grayscale → threshold pipeline
- ✅ Manual override vs auto-calculated threshold
- ✅ ThresholdSlider component integration

### Performance Targets:
- 2MB image threshold application: <100ms
- No UI blocking
- Memory efficient (single ImageData allocation)

---

## Success Criteria

**Functional**:
- [ ] `applyThreshold()` function implemented
- [ ] Threshold range 0-255 validated
- [ ] Grayscale conversion integrated
- [ ] Binary output (0 or 255 only)
- [ ] Alpha channel preserved

**Quality**:
- [ ] All unit tests passing (≥80% coverage)
- [ ] Integration test passing
- [ ] Code follows existing patterns (applyBrightness/applyContrast)
- [ ] JSDoc documentation complete
- [ ] No console warnings/errors

**Performance**:
- [ ] <100ms for 2MB image
- [ ] Pure function (no side effects)
- [ ] Memory efficient

---

## Dependencies

**Required** (Already Complete):
- ✅ task-011: RefinementSlider component (COMMITTED)
- ✅ ThresholdSlider component (already exists)
- ✅ calculateOptimalThreshold() (already exists)
- ✅ convertToGrayscale() (already exists)

**Blocked By**: None

**Blocks**:
- task-016: Debounced Preview Updates (needs threshold function)

---

## Risks & Mitigations

**Risk 1**: Performance degradation with large images
- **Mitigation**: Optimize pixel loop, use TypedArray if needed
- **Mitigation**: Benchmark against existing functions (applyBrightness)

**Risk 2**: Grayscale conversion adds overhead
- **Mitigation**: Check if already grayscale before converting
- **Mitigation**: Consider accepting grayscale-only input

**Risk 3**: User confusion about threshold direction (< vs >=)
- **Mitigation**: Clear documentation: "pixels < threshold → black"
- **Mitigation**: Visual preview shows effect immediately

---

## Next Steps

1. **Run `/build`** to implement this plan
2. **Test-first approach**: Write failing tests
3. **Implement**: Make tests pass
4. **Refactor**: Optimize and clean up
5. **Integrate**: Export and verify component integration
6. **Document**: Update design docs

---

**Estimated Completion**: 3 hours
**Complexity**: Medium (follows established patterns)
**Ready for Implementation**: YES
