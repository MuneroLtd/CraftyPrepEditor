# Research: Histogram Equalization Algorithm

**Task ID**: task-006
**Task Name**: Histogram Equalization Algorithm
**Created**: 2025-10-05

---

## Algorithm Overview

### What is Histogram Equalization?

Histogram equalization is a computer vision technique that improves image contrast by redistributing pixel intensity values to utilize the full available range (0-255 for 8-bit images).

**Purpose**: Enhance details in images with low contrast or poor lighting.

**Use Case for CraftyPrep**: Make laser engraving details more visible by spreading tonal values evenly across the spectrum.

---

## Mathematical Foundation

### Step 1: Histogram Calculation

A histogram counts the frequency of each intensity value:

```
histogram[i] = count of pixels with intensity value i
where i ∈ [0, 255] for 8-bit grayscale
```

**Example**:
```
Image: 2×2 pixels with values [50, 50, 100, 200]

histogram[50] = 2
histogram[100] = 1
histogram[200] = 1
histogram[all others] = 0
```

---

### Step 2: Cumulative Distribution Function (CDF)

The CDF is the running sum of histogram values:

```
CDF[i] = Σ(histogram[0] to histogram[i])
       = histogram[0] + histogram[1] + ... + histogram[i]
```

**Properties**:
- CDF is monotonically increasing: CDF[i] ≤ CDF[i+1]
- CDF[0] = histogram[0]
- CDF[255] = total number of pixels

**Example** (continuing from above):
```
CDF[0...49] = 0
CDF[50] = 2
CDF[51...99] = 2
CDF[100] = 3
CDF[101...199] = 3
CDF[200] = 4
CDF[201...255] = 4
```

---

### Step 3: CDF Normalization

Normalize CDF to map intensities to full 0-255 range:

```
normalized[i] = ((CDF[i] - CDF_min) / (total_pixels - CDF_min)) × 255

where:
  CDF_min = first non-zero value in CDF
  total_pixels = image width × height
```

**Why CDF_min?**
- Prevents black pixels in output if original has no pixels at value 0
- Ensures maximum contrast utilization

**Example** (continuing from above):
```
total_pixels = 4
CDF_min = 2 (first non-zero CDF value)

normalized[50] = ((2 - 2) / (4 - 2)) × 255 = 0
normalized[100] = ((3 - 2) / (4 - 2)) × 255 = 127.5 ≈ 128
normalized[200] = ((4 - 2) / (4 - 2)) × 255 = 255
```

---

### Step 4: Pixel Mapping

Map each original pixel value through the normalized CDF lookup table:

```
for each pixel p in image:
  new_value = normalized[old_value]
```

**Example** (continuing from above):
```
Original: [50, 50, 100, 200]
Mapped:   [0,  0,  128, 255]

Result: Contrast expanded from range [50, 200] to full [0, 255]
```

---

## Why It Works

### Contrast Enhancement Mechanism

**Before Equalization**:
- Pixels clustered in narrow range (e.g., 80-120)
- Underutilizes 0-79 and 121-255 ranges
- Low contrast, details hard to see

**After Equalization**:
- Pixels spread across full 0-255 range
- Histogram more uniform distribution
- High contrast, details visible

**Mathematical Proof**:
- Normalized CDF maps input range [min, max] → output range [0, 255]
- Frequent intensity values get larger spread (more contrast)
- Rare intensity values get compressed (less contrast)
- Overall effect: flatter histogram = more evenly distributed intensities

---

## Algorithm Complexity

### Time Complexity: O(n)

**Breakdown**:
1. **Histogram calculation**: O(n) - iterate through all n pixels once
2. **CDF computation**: O(256) = O(1) - fixed 256 bins
3. **CDF normalization**: O(256) = O(1) - fixed 256 values
4. **Pixel mapping**: O(n) - iterate through all n pixels once

**Total**: O(n) + O(1) + O(1) + O(n) = **O(n)** where n = number of pixels

---

### Space Complexity: O(1)

**Memory Usage**:
1. **Histogram**: 256 integers = 256 × 4 bytes = 1 KB
2. **CDF**: 256 integers = 1 KB
3. **Normalized CDF**: 256 bytes (Uint8ClampedArray) = 256 bytes
4. **Output ImageData**: Same size as input (not extra, it's the result)

**Total Extra Memory**: ~2.25 KB (constant, independent of image size)

**Space Complexity**: **O(1)** - fixed memory regardless of input size

---

## Performance Estimation

### For 2MB Image (5 Megapixels)

**Assumptions**:
- Image: 2236×2236 pixels = 4,999,696 pixels ≈ 5 million pixels
- Modern browser on mid-range laptop
- Single-threaded JavaScript

**Benchmark Estimates**:

1. **Histogram calculation**: ~200-300ms
   - 5M array accesses and increments
   - Cache-friendly (sequential access)

2. **CDF computation**: <1ms
   - 256 additions (negligible)

3. **CDF normalization**: <1ms
   - 256 divisions and multiplications (negligible)

4. **Pixel mapping**: ~200-300ms
   - 5M array lookups and writes
   - Uint8ClampedArray optimized by browser

**Total Estimated Time**: **400-600ms** for 5MP image

**Target**: <1 second ✅ Well within target

---

## Implementation Considerations

### 1. Data Types

**Histogram & CDF**:
- Use `number[]` (Array of numbers)
- JavaScript numbers are 64-bit floats, can hold integers up to 2^53
- Max pixel count: 10000×10000 = 100M (well within safe integer range)

**Normalized CDF**:
- Use `Uint8ClampedArray`
- Automatically clamps values to 0-255 range
- Faster array access (typed array)
- Same type as ImageData.data (efficient)

---

### 2. Edge Cases

**All pixels same value** (e.g., all 128):
- histogram[128] = total_pixels, all others = 0
- CDF_min = total_pixels
- denominator = total_pixels - CDF_min = 0
- **Solution**: Check for zero denominator, return input unchanged

**All pixels 0 (black)**:
- histogram[0] = total_pixels
- CDF_min = total_pixels (CDF[0])
- denominator = 0
- **Solution**: Return input unchanged (already optimal)

**All pixels 255 (white)**:
- histogram[255] = total_pixels
- CDF_min = total_pixels (CDF[255])
- denominator = 0
- **Solution**: Return input unchanged (already optimal)

**Two distinct values only** (e.g., 0 and 255):
- Already high contrast
- Equalization won't change much
- **Solution**: Allow algorithm to proceed, output similar to input

---

### 3. Floating Point Precision

**Normalization formula produces floats**:
```javascript
normalized[i] = ((CDF[i] - CDF_min) / (total_pixels - CDF_min)) × 255
```

**Solution**: Use `Math.round()` to convert to integer:
```javascript
normalized[i] = Math.round(((CDF[i] - CDF_min) / (total_pixels - CDF_min)) * 255)
```

**Alternative**: Uint8ClampedArray automatically rounds and clamps:
```javascript
const normalized = new Uint8ClampedArray(256);
normalized[i] = ((CDF[i] - CDF_min) / (total_pixels - CDF_min)) * 255;
// Automatically rounds to nearest integer and clamps to 0-255
```

**Chosen Approach**: Use Uint8ClampedArray (simpler, faster, automatic clamping)

---

### 4. Grayscale Assumption

**Input Requirement**: ImageData must be grayscale (R=G=B for all pixels)

**Why?**:
- Histogram is 1D (single channel)
- Cannot equalize color images directly (would need per-channel or HSV approach)

**Validation**:
- Trust caller (pipeline ensures grayscale from task-005)
- No runtime validation (performance)
- TypeScript types document requirement

**Alternative for Color Images** (future enhancement):
- Convert RGB → HSV
- Equalize V (value) channel only
- Convert HSV → RGB
- **Not needed for MVP**: All images converted to grayscale first

---

## Comparison to Alternatives

### Alternative 1: Adaptive Histogram Equalization (AHE)

**Difference**: Divides image into tiles, equalizes each tile separately

**Pros**:
- Better local contrast
- Handles varying lighting conditions

**Cons**:
- Much more complex (divide into tiles, interpolate boundaries)
- Slower (multiple histograms)
- Overkill for laser engraving prep

**Decision**: Use standard global equalization (simpler, faster, sufficient)

---

### Alternative 2: Contrast Limited Adaptive Histogram Equalization (CLAHE)

**Difference**: AHE with limit on contrast amplification

**Pros**:
- Prevents noise amplification
- Better for medical/scientific imaging

**Cons**:
- Even more complex
- Requires tuning parameters
- Not needed for laser prep

**Decision**: Use standard equalization (simpler)

---

### Alternative 3: Gamma Correction

**Difference**: Non-linear intensity transformation: `output = input^gamma`

**Pros**:
- Very simple (single power operation per pixel)
- Fast

**Cons**:
- Requires manual gamma tuning (not automatic)
- Doesn't adapt to image content
- Less effective for varied images

**Decision**: Histogram equalization better (automatic, adaptive)

---

## Real-World Examples

### Example 1: Low-Contrast Photo

**Input**:
- Foggy landscape photo
- Most pixels in range [100, 150]
- Histogram peak around 120-130
- Looks washed out, details hard to see

**After Equalization**:
- Pixels spread across [20, 240] range
- Histogram more evenly distributed
- Details in fog visible
- Clouds, trees, ground differentiated

**For Laser Engraving**: Trees and background separated, better engrave detail

---

### Example 2: Backlit Portrait

**Input**:
- Person in front of bright window
- Face dark (values 30-60)
- Background bright (values 200-250)
- High contrast but face details lost

**After Equalization**:
- Face values spread to [0, 100]
- Background compressed to [180, 255]
- Facial features more visible
- Background still bright but not blown out

**For Laser Engraving**: Facial details visible, better engrave quality

---

### Example 3: Already Optimized Image

**Input**:
- Professional product photo
- Already uses full 0-255 range
- Histogram well-distributed

**After Equalization**:
- Minimal change (already optimized)
- Slight redistribution of tones
- Output very similar to input

**For Laser Engraving**: No harm, image already good

---

## Implementation Best Practices

### 1. Pure Function Pattern

```typescript
// ✅ Good: Pure function
export function applyHistogramEqualization(imageData: ImageData): ImageData {
  // Create new ImageData (don't modify input)
  const result = new ImageData(imageData.width, imageData.height);

  // Process...

  return result; // Return new object
}

// ❌ Bad: Mutates input
export function applyHistogramEqualization(imageData: ImageData): ImageData {
  // Modifies imageData.data directly
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = newValue; // Mutation!
  }
  return imageData;
}
```

---

### 2. Separation of Concerns

```typescript
// ✅ Good: Helper functions
function calculateHistogram(imageData: ImageData): number[] { ... }
function computeCDF(histogram: number[]): number[] { ... }
function normalizeCDF(cdf: number[], totalPixels: number): Uint8ClampedArray { ... }

export function applyHistogramEqualization(imageData: ImageData): ImageData {
  const histogram = calculateHistogram(imageData);
  const cdf = computeCDF(histogram);
  const lookupTable = normalizeCDF(cdf, imageData.width * imageData.height);
  return mapPixels(imageData, lookupTable);
}

// ❌ Bad: Monolithic function
export function applyHistogramEqualization(imageData: ImageData): ImageData {
  // 100+ lines of code all in one function
  // Hard to test, hard to understand
}
```

---

### 3. TypeScript Types

```typescript
// ✅ Good: Explicit types
function calculateHistogram(imageData: ImageData): number[] {
  const histogram: number[] = new Array(256).fill(0);
  // ...
  return histogram;
}

// ✅ Good: Type safety
const normalized: Uint8ClampedArray = new Uint8ClampedArray(256);

// ❌ Bad: Implicit any
function calculateHistogram(imageData) { // 'any' type
  const histogram = new Array(256).fill(0); // Type unclear
  return histogram;
}
```

---

## Testing Strategy

### Unit Test Categories

1. **Correctness Tests**:
   - Histogram calculation with known distribution
   - CDF computation formula verification
   - Normalization to 0-255 range
   - Pixel mapping accuracy

2. **Edge Case Tests**:
   - All-white image
   - All-black image
   - Two-value image (already binary)
   - Single-pixel image

3. **Property Tests**:
   - Deterministic (same input → same output)
   - Output dimensions match input
   - Output is grayscale (R=G=B)
   - Alpha channel preserved

4. **Performance Tests**:
   - 5MP image processes in <1000ms
   - Memory usage reasonable

5. **Integration Tests**:
   - Works with convertToGrayscale() output
   - Output suitable for Otsu threshold

---

### Test Data Generation

**Known Test Images**:
```typescript
// Tiny test image with known histogram
function createTestImage(): ImageData {
  const img = new ImageData(2, 2); // 4 pixels

  // Pixel values: [50, 50, 100, 200]
  setPixel(img, 0, 0, 50);   // R=G=B=50
  setPixel(img, 1, 0, 50);
  setPixel(img, 0, 1, 100);
  setPixel(img, 1, 1, 200);

  return img;
}

// Expected histogram:
// histogram[50] = 2
// histogram[100] = 1
// histogram[200] = 1
// all others = 0
```

---

## References

### Academic Papers
- Rafael C. Gonzalez, Richard E. Woods (2008). "Digital Image Processing" (3rd ed.). Prentice Hall. Chapter 3: Intensity Transformations and Spatial Filtering.

### Online Resources
- Wikipedia: Histogram Equalization - https://en.wikipedia.org/wiki/Histogram_equalization
- OpenCV Documentation: Histograms - https://docs.opencv.org/4.x/d5/daf/tutorial_py_histogram_equalization.html

### Code Examples
- MDN Web Docs: ImageData - https://developer.mozilla.org/en-US/docs/Web/API/ImageData
- Canvas API Pixel Manipulation - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

---

## Decision Log

### Decision 1: Global vs. Adaptive Equalization
**Chosen**: Global histogram equalization
**Rationale**: Simpler, faster, sufficient for laser engraving prep
**Trade-off**: Less local contrast than adaptive methods, but acceptable

---

### Decision 2: Data Structure for Normalized CDF
**Chosen**: Uint8ClampedArray
**Rationale**:
- Automatic clamping to 0-255
- Same type as ImageData.data (efficient)
- Browser-optimized typed array
**Alternative**: Regular array with manual clamping (slower, more code)

---

### Decision 3: Edge Case Handling
**Chosen**: Return input unchanged for degenerate cases (all one value)
**Rationale**: Graceful degradation, no errors
**Alternative**: Throw error (bad UX), force to binary (incorrect)

---

### Decision 4: Input Validation
**Chosen**: No runtime validation (trust caller)
**Rationale**:
- Pipeline ensures correct input (grayscale from task-005)
- Runtime validation adds overhead
- TypeScript types document contract
**Alternative**: Validate R=G=B for all pixels (slower, unnecessary)

---

## Open Questions

### Q1: Should we validate input is grayscale?
**Answer**: No - trust pipeline, document in types, optimize for speed

### Q2: What if image is already high-contrast?
**Answer**: Algorithm proceeds, output similar to input (no harm)

### Q3: Performance acceptable for large images (10MP+)?
**Answer**: O(n) algorithm should scale, but may hit 1s target limit. Can optimize with Web Workers if needed in future (task-008).

### Q4: Should we expose helper functions for testing?
**Answer**: No - keep helpers private, test through main function. Simpler public API.

---

## Implementation Risks

### Risk 1: Floating Point Precision
**Mitigation**: Use Uint8ClampedArray for automatic rounding/clamping
**Severity**: Low

### Risk 2: Division by Zero
**Mitigation**: Check denominator before division, return input if zero
**Severity**: Medium (would crash without check)

### Risk 3: Performance on Large Images
**Mitigation**: Performance test validates target, O(n) is inherently fast
**Severity**: Low

### Risk 4: Integration with Pipeline
**Mitigation**: Integration test with task-005 output
**Severity**: Low (interface is simple: ImageData → ImageData)

---

## Summary

Histogram equalization is a well-established, mathematically sound technique for automatic contrast enhancement. The algorithm is:

- **Simple**: 4 straightforward steps
- **Fast**: O(n) time, O(1) space
- **Effective**: Proven technique used in OpenCV, Photoshop, etc.
- **Appropriate**: Perfect for laser engraving prep (needs high contrast)

Implementation will be straightforward with comprehensive tests ensuring correctness and performance.

---

**Ready to Implement**: ✅ Algorithm understood, edge cases identified, test strategy defined
