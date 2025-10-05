# Task Plan: task-014 - Contrast Adjustment Implementation

**Task ID**: task-014
**Sprint**: Sprint 2 (Refinement Controls & UX)
**Estimated Effort**: 3 hours
**Status**: PLANNED
**Created**: 2025-10-05

---

## Objective

Implement contrast adjustment algorithm and integrate with existing ContrastSlider component to enable real-time image contrast control.

## Algorithm Specification

**Formula** (from FUNCTIONAL.md):
```typescript
function applyContrast(imageData: ImageData, contrast: number): ImageData {
  const factor = (100 + contrast) / 100;

  for each pixel (R, G, B):
    newValue = clamp(((oldValue - 127) * factor) + 127, 0, 255)

  preserve alpha channel
}
```

**How it works**:
- Pivots around mid-gray (127) to preserve overall brightness
- Positive contrast: spreads values from center (increases dynamic range)
- Negative contrast: compresses values toward center (decreases dynamic range)
- Factor calculation: `(100 + contrast) / 100`
  - contrast = 0 → factor = 1.0 (no change)
  - contrast = 50 → factor = 1.5 (50% increase)
  - contrast = -50 → factor = 0.5 (50% decrease)
  - contrast = 100 → factor = 2.0 (maximum)
  - contrast = -100 → factor = 0.0 (all pixels → 127)

## 5-Phase TDD Implementation

### Phase 1: RED - Write Failing Tests (45 minutes)

**File**: `src/tests/unit/lib/imageProcessing/applyContrast.test.ts`

**Test Cases**:

1. **Basic Functionality**
   - Creates new ImageData (doesn't modify input)
   - Returns ImageData with same dimensions
   - Preserves alpha channel

2. **Factor Calculation**
   - contrast = 0 → no change (factor = 1.0)
   - contrast = 100 → factor = 2.0
   - contrast = -100 → factor = 0.0

3. **Mid-Gray Pivot**
   - Mid-gray pixels (127) remain 127 at any contrast
   - Values > 127 increase with positive contrast
   - Values < 127 decrease with positive contrast
   - Values approach 127 with negative contrast

4. **Edge Cases**
   - Pure black (0) with max positive contrast → 0 (clamped)
   - Pure white (255) with max positive contrast → 255 (clamped)
   - Pure black (0) with max negative contrast → 127
   - Pure white (255) with max negative contrast → 127
   - Mixed values with various contrast levels

5. **Clamping**
   - Results always in [0, 255] range
   - No overflow on extreme inputs
   - No underflow on extreme inputs

6. **Input Validation**
   - Throws on null/undefined imageData
   - Throws on contrast < -100
   - Throws on contrast > 100
   - Descriptive error messages

7. **Performance**
   - Processes large images efficiently
   - O(n) time complexity where n = pixel count

**Pattern**: Follow `applyBrightness.test.ts` structure

---

### Phase 2: GREEN - Minimal Implementation (60 minutes)

**File**: `src/lib/imageProcessing/applyContrast.ts`

**Implementation Steps**:

1. Create function signature:
   ```typescript
   export function applyContrast(imageData: ImageData, contrast: number): ImageData
   ```

2. Input validation:
   ```typescript
   if (!imageData) {
     throw new Error('applyContrast: imageData parameter is required');
   }
   if (contrast < -100 || contrast > 100) {
     throw new Error(`applyContrast: contrast must be in range [-100, 100], got ${contrast}`);
   }
   ```

3. Calculate factor:
   ```typescript
   const factor = (100 + contrast) / 100;
   ```

4. Create output ImageData:
   ```typescript
   const { data, width, height } = imageData;
   const output = new ImageData(width, height);
   ```

5. Process pixels:
   ```typescript
   for (let i = 0; i < data.length; i += 4) {
     // Apply contrast to R, G, B
     output.data[i] = clamp(((data[i] - 127) * factor) + 127, 0, 255);
     output.data[i + 1] = clamp(((data[i + 1] - 127) * factor) + 127, 0, 255);
     output.data[i + 2] = clamp(((data[i + 2] - 127) * factor) + 127, 0, 255);

     // Preserve alpha
     output.data[i + 3] = data[i + 3];
   }
   ```

6. Use clamp() utility (copy from applyBrightness.ts for now):
   ```typescript
   function clamp(value: number, min: number, max: number): number {
     return Math.min(Math.max(value, min), max);
   }
   ```

7. Add comprehensive JSDoc (follow applyBrightness.ts pattern)

8. Run tests → all pass

---

### Phase 3: REFACTOR - Clean Up (30 minutes)

**Tasks**:

1. **Extract clamp() to shared utility**:
   - Create `src/lib/imageProcessing/utils.ts`
   - Move clamp() function
   - Export: `export { clamp }`
   - Update applyBrightness.ts to import clamp
   - Update applyContrast.ts to import clamp
   - Run tests → ensure still passing

2. **Export from index**:
   - Update `src/lib/imageProcessing/index.ts`:
     ```typescript
     export { applyContrast } from './applyContrast';
     ```

3. **Code quality checks**:
   - Run `npm run lint` → fix any issues
   - Run `npm run typecheck` → verify types
   - Review JSDoc completeness
   - Ensure consistent error messages

4. **Documentation**:
   - Add usage examples in JSDoc
   - Document performance characteristics
   - Note algorithm source (FUNCTIONAL.md)

---

### Phase 4: INTEGRATE - Wire to UI (30 minutes)

**Tasks**:

1. **Verify ContrastSlider exists**:
   - File: `src/components/ContrastSlider.tsx` ✓ (already exists)
   - Uses RefinementSlider base component
   - Range: -100 to +100
   - Default: 0

2. **Check parent component integration**:
   - Identify where ContrastSlider is used
   - Verify onChange handler exists
   - Check state management for contrast value
   - Follow brightness integration pattern

3. **Processing pipeline integration**:
   - Ensure contrast applied in correct order
   - Likely: brightness → contrast → threshold
   - Verify debounced preview update (100ms per spec)
   - Check performance (<500ms for 2MB image)

4. **Manual testing checklist**:
   - [ ] Upload test image
   - [ ] Adjust contrast slider
   - [ ] Verify preview updates
   - [ ] Test extreme values (-100, 0, +100)
   - [ ] Test reset button
   - [ ] Verify value display
   - [ ] Check keyboard accessibility (arrow keys)
   - [ ] Test with various image types (JPEG, PNG)

---

### Phase 5: VALIDATE - E2E Testing (15 minutes)

**Manual Validation**:

1. **Functionality**:
   - [ ] Contrast adjustment works correctly
   - [ ] Preview updates in real-time
   - [ ] Debounce prevents excessive processing
   - [ ] Reset button restores defaults

2. **Edge Cases**:
   - [ ] Extreme values (-100, +100) handled
   - [ ] Rapid slider movements handled
   - [ ] Large images (2MB) process quickly

3. **Accessibility**:
   - [ ] Slider keyboard accessible (Tab, Arrow keys)
   - [ ] Focus indicator visible
   - [ ] Screen reader announces values
   - [ ] Touch targets adequate (≥44px)

4. **Performance**:
   - [ ] 2MB image processes in <500ms
   - [ ] UI remains responsive during processing
   - [ ] No janky slider movement

5. **Integration**:
   - [ ] Works with brightness adjustment
   - [ ] Works with threshold adjustment
   - [ ] Export includes contrast adjustments

---

## Dependencies

**Technical**:
- Canvas API (ImageData) ✓
- TypeScript ✓
- Vitest (testing framework) ✓
- React (UI components) ✓

**Components**:
- ContrastSlider ✓ (already exists)
- RefinementSlider ✓ (base component)

**Tasks**:
- task-012 (Brightness Adjustment) - COMPLETE ✓

**Patterns to Follow**:
- `src/lib/imageProcessing/applyBrightness.ts` (implementation)
- `src/tests/unit/lib/imageProcessing/applyBrightness.test.ts` (testing)
- Alpha preservation pattern (from memory)

---

## Success Criteria

**Functional**:
- [ ] Contrast formula implemented correctly
- [ ] Factor calculated from slider value
- [ ] Applied to RGB channels independently
- [ ] Alpha channel preserved
- [ ] Slider triggers contrast adjustment
- [ ] Preview updates with debounce

**Quality**:
- [ ] Unit tests ≥80% coverage
- [ ] All edge cases tested
- [ ] Input validation complete
- [ ] No TypeScript errors
- [ ] No lint errors

**Performance**:
- [ ] O(n) algorithm (efficient)
- [ ] <500ms for 2MB image
- [ ] <100ms preview update start

**Accessibility**:
- [ ] Keyboard accessible
- [ ] Screen reader compatible
- [ ] Visible focus indicators

---

## Implementation Notes

**Key Algorithm Details**:
- Mid-gray pivot (127) is critical for preserving overall brightness
- Formula: `((value - 127) * factor) + 127`
- This expands/compresses the value range around the midpoint
- Positive factor (>1.0): values spread from center
- Negative factor (<1.0): values compress toward center

**Performance Considerations**:
- Simple arithmetic operations (fast)
- Single pass through pixel array
- No complex calculations
- Should easily meet performance targets
- Web Worker not needed (spec requires only for >2s processing)

**Common Pitfalls to Avoid**:
- Don't forget to preserve alpha channel
- Don't modify input imageData (pure function)
- Don't skip clamping (prevents invalid values)
- Don't forget input validation
- Don't assume contrast is in correct range

---

## Next Steps

After planning complete:
1. Run `/build` to implement this plan
2. Follow TDD phases sequentially
3. Ensure all tests pass before moving to next phase
4. Manual validation before marking COMPLETE

---

**References**:
- Algorithm: [.autoflow/docs/FUNCTIONAL.md#contrast-adjustment]
- Architecture: [.autoflow/docs/ARCHITECTURE.md#processing-patterns]
- Pattern: [src/lib/imageProcessing/applyBrightness.ts]
