# Acceptance Criteria: Threshold Adjustment Implementation

**Task ID**: task-015
**Feature**: Manual threshold override for image binarization

---

## Functional Requirements

### FR-1: Threshold Binarization Function
**Criterion**: `applyThreshold()` function accepts imageData and threshold parameter
- [ ] Function signature: `applyThreshold(imageData: ImageData, threshold: number): ImageData`
- [ ] Threshold parameter range: 0 to 255 (inclusive)
- [ ] Returns new ImageData (pure function, no side effects)
- [ ] Input imageData not modified

**Acceptance Test**:
```typescript
const result = applyThreshold(imageData, 128);
expect(result).not.toBe(imageData); // New object
expect(result.width).toBe(imageData.width);
expect(result.height).toBe(imageData.height);
```

---

### FR-2: Default Value from Otsu's Method
**Criterion**: Default threshold value calculated using existing `calculateOptimalThreshold()`
- [ ] `calculateOptimalThreshold()` already exists in otsuThreshold.ts
- [ ] Returns optimal threshold for grayscale image
- [ ] Range: 0-255

**Acceptance Test**:
```typescript
const grayscale = convertToGrayscale(imageData);
const defaultThreshold = calculateOptimalThreshold(grayscale);
expect(defaultThreshold).toBeGreaterThanOrEqual(0);
expect(defaultThreshold).toBeLessThanOrEqual(255);
```

---

### FR-3: Manual Override via Slider
**Criterion**: ThresholdSlider component enables manual threshold adjustment
- [ ] ThresholdSlider component exists (src/components/ThresholdSlider.tsx)
- [ ] Range: 0 to 255
- [ ] Step: 1
- [ ] Default: Auto-calculated from Otsu
- [ ] onChange callback fires with new value

**Acceptance Test**:
```typescript
const { getByRole } = render(
  <ThresholdSlider value={128} onChange={mockOnChange} />
);
const slider = getByRole('slider');
expect(slider).toHaveAttribute('aria-valuemin', '0');
expect(slider).toHaveAttribute('aria-valuemax', '255');
expect(slider).toHaveAttribute('aria-valuenow', '128');
```

---

### FR-4: Grayscale Conversion + Threshold Application
**Criterion**: Image converted to grayscale before threshold binarization
- [ ] RGB/RGBA images converted to grayscale first
- [ ] Already-grayscale images processed directly
- [ ] Grayscale conversion uses existing `convertToGrayscale()` function
- [ ] Binarization formula: `pixel < threshold ? 0 : 255`

**Acceptance Test**:
```typescript
// RGB input
const rgbImage = createTestImageData(100, 100, 'rgb');
const result = applyThreshold(rgbImage, 128);

// Verify binary output (only 0 or 255)
for (let i = 0; i < result.data.length; i += 4) {
  const r = result.data[i];
  const g = result.data[i+1];
  const b = result.data[i+2];

  expect(r).toBeOneOf([0, 255]);
  expect(g).toBeOneOf([0, 255]);
  expect(b).toBeOneOf([0, 255]);
  expect(r).toBe(g);
  expect(g).toBe(b);
}
```

---

### FR-5: Preview Updates with Debounce
**Criterion**: Preview updates after slider adjustment (debounce handled in task-016)
- [ ] Function completes in <100ms for 2MB image
- [ ] Returns immediately (synchronous)
- [ ] No UI blocking

**Acceptance Test**:
```typescript
const start = performance.now();
const result = applyThreshold(largeImageData, 128);
const duration = performance.now() - start;

expect(duration).toBeLessThan(100); // <100ms for 2MB image
```

**Note**: Debounce implementation is task-016 dependency.

---

### FR-6: Unit Tests for Threshold Ranges
**Criterion**: Comprehensive unit tests covering all threshold values
- [ ] Threshold = 0 (all pixels become white)
- [ ] Threshold = 128 (mid-point)
- [ ] Threshold = 255 (all pixels become black)
- [ ] Edge cases (uniform image, already binary)
- [ ] Invalid inputs (threshold < 0, threshold > 255, null imageData)

**Acceptance Test**:
```typescript
describe('applyThreshold edge cases', () => {
  it('threshold=0 produces all white', () => {
    const result = applyThreshold(grayImage, 0);
    // All pixels should be 255 (white)
  });

  it('threshold=255 produces all black', () => {
    const result = applyThreshold(grayImage, 255);
    // All pixels should be 0 (black)
  });

  it('throws on threshold < 0', () => {
    expect(() => applyThreshold(grayImage, -1)).toThrow();
  });

  it('throws on threshold > 255', () => {
    expect(() => applyThreshold(grayImage, 256)).toThrow();
  });
});
```

---

### FR-7: Visual Feedback for Threshold Effect
**Criterion**: Preview canvas shows threshold effect in real-time
- [ ] Canvas updates when threshold changes
- [ ] Binary image displayed (pure black and white)
- [ ] No artifacts or rendering issues

**Acceptance Test** (E2E - deferred to /verify-implementation):
```typescript
// E2E test
await page.getByRole('slider', { name: /threshold/i }).fill('100');
const preview = await page.locator('canvas').screenshot();
// Verify binary output (only black and white pixels)
```

---

## Technical Requirements

### TR-1: Input Validation
**Criterion**: Function validates all inputs before processing
- [ ] Throws error if imageData is null/undefined
- [ ] Throws error if threshold < 0
- [ ] Throws error if threshold > 255
- [ ] Error messages are descriptive

**Acceptance Test**:
```typescript
expect(() => applyThreshold(null, 128)).toThrow('imageData parameter is required');
expect(() => applyThreshold(imageData, -1)).toThrow('threshold must be in range [0, 255]');
expect(() => applyThreshold(imageData, 256)).toThrow('threshold must be in range [0, 255]');
```

---

### TR-2: Pure Function
**Criterion**: No side effects, returns new ImageData
- [ ] Input imageData not modified
- [ ] Returns new ImageData instance
- [ ] No global state changes
- [ ] Deterministic (same input → same output)

**Acceptance Test**:
```typescript
const original = createTestImageData(10, 10);
const originalCopy = new ImageData(
  new Uint8ClampedArray(original.data),
  original.width,
  original.height
);

const result = applyThreshold(original, 128);

// Original unchanged
expect(original.data).toEqual(originalCopy.data);
```

---

### TR-3: Performance
**Criterion**: Processes 2MB image in <100ms
- [ ] Algorithm complexity: O(n) where n = pixel count
- [ ] Single allocation (new ImageData)
- [ ] No unnecessary intermediate objects
- [ ] Efficient pixel loop

**Acceptance Test**:
```typescript
const largeImage = createTestImageData(2000, 1000); // ~2MB
const iterations = 10;

const start = performance.now();
for (let i = 0; i < iterations; i++) {
  applyThreshold(largeImage, 128);
}
const avgDuration = (performance.now() - start) / iterations;

expect(avgDuration).toBeLessThan(100);
```

---

### TR-4: Code Quality
**Criterion**: Follows existing codebase patterns
- [ ] Consistent with `applyBrightness.ts` and `applyContrast.ts` structure
- [ ] Uses existing utilities (`convertToGrayscale`, `clamp` if needed)
- [ ] JSDoc documentation complete
- [ ] TypeScript strict mode compliant
- [ ] No ESLint warnings

**Acceptance Test**:
```bash
npm run lint        # No errors
npm run typecheck   # No errors
```

---

### TR-5: Test Coverage
**Criterion**: ≥80% code coverage for applyThreshold function
- [ ] All branches tested
- [ ] All edge cases covered
- [ ] Error conditions tested
- [ ] Integration test included

**Acceptance Test**:
```bash
npm run test:coverage
# applyThreshold.ts: 100% coverage (target ≥80%)
```

---

### TR-6: Alpha Channel Preservation
**Criterion**: Alpha channel values preserved from input
- [ ] Alpha values copied unchanged
- [ ] No alpha manipulation
- [ ] Transparent pixels remain transparent

**Acceptance Test**:
```typescript
const imageWithAlpha = createTestImageDataWithAlpha(10, 10);
const result = applyThreshold(imageWithAlpha, 128);

for (let i = 0; i < result.data.length; i += 4) {
  expect(result.data[i+3]).toBe(imageWithAlpha.data[i+3]);
}
```

---

## Definition of Done

**All criteria met**:
- ✅ All functional requirements (FR-1 through FR-7) complete
- ✅ All technical requirements (TR-1 through TR-6) complete
- ✅ Unit tests passing (≥80% coverage)
- ✅ Integration test passing
- ✅ No ESLint errors or warnings
- ✅ No TypeScript errors
- ✅ Code review passed (DRY, SOLID, FANG principles)
- ✅ Documentation complete (JSDoc, design docs updated)
- ✅ Performance targets met (<100ms for 2MB image)

---

## Out of Scope (Future Tasks)

**Not included in this task**:
- ❌ Debounce implementation (task-016)
- ❌ Preview component integration (handled separately)
- ❌ Reset button functionality (task-017)
- ❌ State management (task-017)
- ❌ E2E accessibility testing (task-019)

---

**Task is ready for implementation when all acceptance criteria can be verified.**
