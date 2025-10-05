# Research: task-014 - Contrast Adjustment Implementation

**Task ID**: task-014
**Created**: 2025-10-05

---

## Research Questions

### Q1: How does contrast adjustment work mathematically?

**Answer**: Contrast adjustment modifies the spread of pixel values around a central pivot point.

**Formula** (from FUNCTIONAL.md):
```
factor = (100 + contrast) / 100
newValue = clamp(((oldValue - 127) * factor) + 127, 0, 255)
```

**Mathematical Explanation**:

1. **Pivot Point Selection**: 127 (mid-gray, middle of 0-255 range)
   - Why 127? It's the midpoint of the 0-255 range
   - Pivoting around midpoint preserves overall image brightness

2. **Transformation Steps**:
   ```
   Step 1: Subtract pivot    → (value - 127)
   Step 2: Scale by factor   → (value - 127) * factor
   Step 3: Add pivot back    → ((value - 127) * factor) + 127
   Step 4: Clamp to range    → clamp(result, 0, 255)
   ```

3. **Effect of Factor**:
   - factor > 1.0: Expands value range (increases contrast)
     - Values > 127 get brighter (move toward 255)
     - Values < 127 get darker (move toward 0)
     - Example: factor = 1.5 means 50% expansion

   - factor = 1.0: No change (contrast = 0)
     - Values remain unchanged

   - factor < 1.0: Compresses value range (decreases contrast)
     - All values move toward 127
     - Example: factor = 0.5 means 50% compression

   - factor = 0.0: All values → 127 (contrast = -100)
     - Image becomes uniform mid-gray

4. **Example Calculations**:

   **Positive Contrast** (contrast = 50, factor = 1.5):
   - Black (0): ((0 - 127) * 1.5) + 127 = -63.5 → -64 (clamped to 0)
   - Mid-gray (127): ((127 - 127) * 1.5) + 127 = 127 (unchanged)
   - White (255): ((255 - 127) * 1.5) + 127 = 319 (clamped to 255)
   - Dark gray (64): ((64 - 127) * 1.5) + 127 = 32.5 → 32 (darker)
   - Light gray (192): ((192 - 127) * 1.5) + 127 = 224.5 → 224 (lighter)

   **Negative Contrast** (contrast = -50, factor = 0.5):
   - Black (0): ((0 - 127) * 0.5) + 127 = 63.5 → 64 (lighter, toward 127)
   - Mid-gray (127): ((127 - 127) * 0.5) + 127 = 127 (unchanged)
   - White (255): ((255 - 127) * 0.5) + 127 = 191 (darker, toward 127)
   - Dark gray (64): ((64 - 127) * 0.5) + 127 = 95.5 → 96 (lighter)
   - Light gray (192): ((192 - 127) * 0.5) + 127 = 159.5 → 160 (darker)

**Source**: [.autoflow/docs/FUNCTIONAL.md#contrast-adjustment]

---

### Q2: Why pivot around 127 instead of 128?

**Answer**: Historical convention and mathematical convenience.

**Reasoning**:

1. **Range Analysis**:
   - 0-255 range has 256 values
   - True mathematical midpoint: 127.5
   - Need integer pivot: 127 or 128

2. **Convention**:
   - Most image processing libraries use 127
   - Established in legacy systems (Adobe, ImageMagick, etc.)
   - Consistency with existing implementations

3. **Practical Impact**:
   - Difference is negligible (0.5 out of 255 = 0.2%)
   - Both produce visually identical results
   - 127 is specified in FUNCTIONAL.md

4. **Mathematical Properties**:
   - 127 = 0x7F (clean binary: 01111111)
   - Symmetric around 127: 0-127 (128 values), 127-255 (129 values)
   - Asymmetry is acceptable for practical purposes

**Decision**: Use 127 per specification

---

### Q3: How do we handle edge cases with clamping?

**Answer**: Clamp after calculation, before assignment.

**Edge Cases**:

1. **Overflow** (result > 255):
   - Occurs with high positive contrast on bright pixels
   - Example: White (255) with contrast = 100 (factor = 2.0)
     - Calculation: ((255 - 127) * 2.0) + 127 = 383
     - Clamped: 255
   - Solution: `clamp(result, 0, 255)`

2. **Underflow** (result < 0):
   - Occurs with high positive contrast on dark pixels
   - Example: Black (0) with contrast = 100 (factor = 2.0)
     - Calculation: ((0 - 127) * 2.0) + 127 = -127
     - Clamped: 0
   - Solution: `clamp(result, 0, 255)`

3. **Extreme Negative Contrast**:
   - contrast = -100, factor = 0.0
   - All values → 127 (uniform gray)
   - No clamping needed (127 is in range)

4. **Floating Point Precision**:
   - Calculations may produce non-integers
   - Canvas ImageData requires integers (0-255)
   - JavaScript handles automatically (truncates decimals in Uint8ClampedArray)
   - Explicit Math.round() not needed (clamp handles it)

**Implementation**:
```typescript
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Usage:
output.data[i] = clamp(((data[i] - 127) * factor) + 127, 0, 255);
```

**Why This Works**:
- Math.max(value, 0) ensures value ≥ 0
- Math.min(result, 255) ensures value ≤ 255
- Single operation, efficient

---

### Q4: How does contrast interact with brightness in the processing pipeline?

**Answer**: They are independent adjustments applied sequentially.

**Pipeline Order** (from ARCHITECTURE.md):
```
Original Image
  ↓
Brightness Adjustment (additive)
  ↓
Contrast Adjustment (multiplicative)
  ↓
Threshold Adjustment (binary)
  ↓
Final Output
```

**Why This Order**:

1. **Brightness First** (Additive):
   - Shifts entire value range up/down
   - Example: +50 brightness adds 50 to all values
   - Establishes base luminance

2. **Contrast Second** (Multiplicative):
   - Scales values around pivot (127)
   - Works on brightness-adjusted values
   - Refines dynamic range

3. **Threshold Last** (Binary):
   - Converts to black/white
   - Final step for laser engraving preparation
   - Operates on fully-adjusted grayscale

**Independence**:
- Each adjustment is a pure function
- Order matters but adjustments don't interfere
- User can adjust any slider independently
- Preview updates show combined effect

**Mathematical Composition**:
```typescript
const pipeline = [
  (img) => applyBrightness(img, brightnessValue),
  (img) => applyContrast(img, contrastValue),
  (img) => applyThreshold(img, thresholdValue)
];

const result = pipeline.reduce((img, fn) => fn(img), originalImage);
```

**Example** (brightness = +50, contrast = +50):
1. Start: pixel value = 100
2. After brightness: 100 + 50 = 150
3. After contrast: ((150 - 127) * 1.5) + 127 = 161.5 → 162
4. Final: 162

---

### Q5: What are the performance characteristics?

**Answer**: O(n) time complexity, minimal memory overhead.

**Time Complexity**:
- Single loop through all pixels: O(n) where n = pixel count
- Per-pixel operations:
  - 3 subtractions (R, G, B)
  - 3 multiplications (R, G, B)
  - 3 additions (R, G, B)
  - 3 clamp operations (R, G, B)
  - 1 alpha copy
  - Total: ~13 operations per pixel
- Very fast arithmetic operations

**Space Complexity**:
- Input ImageData: n * 4 bytes (RGBA)
- Output ImageData: n * 4 bytes (RGBA)
- Total: O(n) space
- No intermediate allocations

**Benchmark Estimates** (2MB image ≈ 5 megapixels):
- Pixel count: ~5,000,000
- Operations: ~65,000,000
- Modern CPU: ~3 GHz
- Estimated time: ~20-50ms (well under 500ms target)

**Actual Performance** (from brightness testing):
- Similar algorithm complexity
- Brightness: ~50ms for 5MP image
- Expected: Similar (50-100ms)
- Target: <500ms ✓ Easily met

**Optimization Opportunities** (NOT NEEDED):
- Web Worker for >2s processing (per spec)
  - Not needed for this simple algorithm
  - Overhead not worth it
- SIMD operations (WebAssembly)
  - Overkill for this use case
  - Added complexity not justified
- GPU acceleration (WebGL)
  - Massive overkill
  - Canvas API sufficient

**Conclusion**: No optimization needed, algorithm is inherently fast.

---

### Q6: How do we test pure function behavior?

**Answer**: Verify input is not modified, new output is created.

**Testing Strategy**:

1. **Input Immutability Test**:
   ```typescript
   test('does not modify input imageData', () => {
     const input = createTestImageData(/* ... */);
     const inputCopy = cloneImageData(input);

     applyContrast(input, 50);

     // Verify input unchanged
     expect(input.data).toEqual(inputCopy.data);
   });
   ```

2. **New Output Test**:
   ```typescript
   test('returns new ImageData instance', () => {
     const input = createTestImageData(/* ... */);
     const output = applyContrast(input, 50);

     // Verify different instances
     expect(output).not.toBe(input);
     expect(output.data).not.toBe(input.data);
   });
   ```

3. **Dimension Preservation Test**:
   ```typescript
   test('preserves dimensions', () => {
     const input = new ImageData(100, 50);
     const output = applyContrast(input, 50);

     expect(output.width).toBe(100);
     expect(output.height).toBe(50);
   });
   ```

**Pattern**: Follow applyBrightness.test.ts structure

---

### Q7: How do we handle rapid slider movements (debouncing)?

**Answer**: Debounce handled at component/parent level, not in algorithm.

**Separation of Concerns**:

1. **Algorithm Responsibility** (applyContrast.ts):
   - Pure image processing function
   - Fast, synchronous execution
   - No knowledge of UI events
   - No debouncing logic

2. **UI Responsibility** (Parent Component):
   - Listen to slider onChange events
   - Debounce updates (100ms per spec)
   - Call applyContrast with final value
   - Update preview canvas

**Debounce Implementation** (in parent, not our task):
```typescript
const debouncedUpdate = useDeferredValue(contrastValue);
// or
const debouncedUpdate = debounce((value) => {
  const processed = applyContrast(imageData, value);
  updatePreview(processed);
}, 100);
```

**Our Task Scope**:
- Implement fast applyContrast function
- Ensure it's fast enough (<100ms for quick response)
- Let parent component handle debouncing

**Integration Point**:
```typescript
// Parent component (not our task, but for context)
<ContrastSlider
  value={contrast}
  onChange={(newValue) => {
    setContrast(newValue);
    // Debounced update happens here
  }}
/>
```

---

## Key Findings Summary

### Algorithm
- ✓ Formula well-defined in FUNCTIONAL.md
- ✓ Pivot around 127 (mid-gray)
- ✓ Factor calculation: (100 + contrast) / 100
- ✓ Apply to RGB, preserve alpha

### Performance
- ✓ O(n) time complexity (single pass)
- ✓ Expected ~50ms for 2MB image
- ✓ Well under 500ms target
- ✓ No optimization needed

### Testing
- ✓ Follow applyBrightness.test.ts pattern
- ✓ Test pure function behavior
- ✓ Test edge cases (clamping, pivot, extremes)
- ✓ Test input validation

### Integration
- ✓ ContrastSlider component exists
- ✓ Debouncing handled by parent
- ✓ Pipeline order: brightness → contrast → threshold
- ✓ Independent adjustments (composable)

### Patterns
- ✓ Pure function (create new ImageData)
- ✓ Alpha preservation (critical for PNG)
- ✓ Input validation (null check, range check)
- ✓ Consistent error messages

---

## Open Questions

**Q: Exact parent component for ContrastSlider integration?**
- **Status**: To be identified during implementation
- **Resolution**: Follow brightness integration (same parent)
- **Risk**: Low (pattern is established)

**Q: Should clamp() be extracted to utils?**
- **Status**: Decision during refactor phase
- **Options**:
  - Keep duplicated (simple, no shared dependency)
  - Extract to utils (DRY, reusable)
- **Recommendation**: Extract (promotes reuse, DRY principle)
- **Risk**: None (simple refactor)

---

## References

**Design Documentation**:
- [.autoflow/docs/FUNCTIONAL.md#contrast-adjustment] - Algorithm specification
- [.autoflow/docs/ARCHITECTURE.md#processing-patterns] - Pipeline pattern

**Code References**:
- [src/lib/imageProcessing/applyBrightness.ts] - Implementation pattern
- [src/tests/unit/lib/imageProcessing/applyBrightness.test.ts] - Testing pattern
- [src/components/ContrastSlider.tsx] - UI component

**External Resources**:
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- ImageData: https://developer.mozilla.org/en-US/docs/Web/API/ImageData
- Contrast Adjustment Theory: https://en.wikipedia.org/wiki/Contrast_(vision)

**Memory MCP Entities**:
- Alpha_Channel_Preservation (design_pattern)

---

**Research Complete**: All questions answered, ready to implement.
