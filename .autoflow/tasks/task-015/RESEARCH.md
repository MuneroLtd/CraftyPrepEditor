# Research: Threshold Adjustment Implementation

**Task ID**: task-015
**Research Date**: 2025-10-05

---

## Overview

This document contains research on threshold binarization algorithms, Canvas API techniques, and best practices for implementing manual threshold adjustment in image processing applications.

---

## Threshold Binarization Algorithms

### Otsu's Method (Background - Already Implemented)

**Purpose**: Automatic optimal threshold calculation

**Algorithm**: Maximizes between-class variance to separate foreground and background

**Formula**:
```
For each threshold t (0-255):
  - w₀ = weight of class 0 (pixels < t)
  - w₁ = weight of class 1 (pixels >= t)
  - μ₀ = mean intensity of class 0
  - μ₁ = mean intensity of class 1
  - σ²ʙ = w₀ × w₁ × (μ₀ - μ₁)²  // Between-class variance

Optimal threshold = argmax(σ²ʙ)
```

**Reference**: Otsu, N. (1979). "A Threshold Selection Method from Gray-Level Histograms"

**Existing Implementation**: `src/lib/imageProcessing/otsuThreshold.ts`

**Key Insight**: Otsu provides excellent default, but manual override needed for user-specific requirements (material type, engraving depth, etc.)

---

### Manual Threshold Binarization (This Task)

**Purpose**: User override of automatic threshold for fine-tuning

**Algorithm**: Simple binarization with user-specified threshold

**Formula**:
```typescript
for each pixel p in image:
  gray = 0.299 × R + 0.587 × G + 0.114 × B  // Grayscale
  binary = (gray < threshold) ? 0 : 255      // Binarize
```

**Characteristics**:
- Simpler than Otsu (no optimization)
- Faster (single pass vs. histogram analysis)
- Deterministic (same threshold → same result)
- User-controlled (matches user's material/preferences)

**When to Use**:
- User knows their material better than algorithm
- Otsu's result too aggressive or too conservative
- Specific engraving requirements (depth, power settings)

---

## Canvas API Techniques

### ImageData Manipulation

**Canvas API Workflow**:
```typescript
// 1. Get source ImageData
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, width, height);

// 2. Process pixels
const data = imageData.data; // Uint8ClampedArray
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];     // Red
  const g = data[i+1];   // Green
  const b = data[i+2];   // Blue
  const a = data[i+3];   // Alpha
  // ... process ...
}

// 3. Create output
const output = new ImageData(width, height);
// ... copy processed data ...

// 4. Render
ctx.putImageData(output, 0, 0);
```

**Performance Considerations**:
- ImageData.data is Uint8ClampedArray (fast typed array)
- Values auto-clamped to 0-255 (no manual clamping needed)
- Direct memory access (no getter/setter overhead)

---

### Grayscale Conversion Methods

**1. Luminosity Method (Recommended - Already Used)**:
```typescript
gray = 0.299 × R + 0.587 × G + 0.114 × B
```
- Based on human perception (ITU-R BT.601 standard)
- Green weighted highest (human eye most sensitive)
- Used by Photoshop, GIMP, professional tools

**2. Average Method** (NOT recommended):
```typescript
gray = (R + G + B) / 3
```
- Simple but inaccurate
- Doesn't match human perception

**3. Desaturation Method** (NOT recommended):
```typescript
gray = (max(R,G,B) + min(R,G,B)) / 2
```
- Preserves lightness but not accurate

**Decision**: Use existing `convertToGrayscale()` with luminosity method

---

### Binary Image Characteristics

**Properties of Binary Images**:
- Only two values: 0 (black) or 255 (white)
- R = G = B for all pixels (grayscale)
- High contrast (maximum separation)
- Ideal for laser engraving (clear burn/no-burn regions)

**Validation**:
```typescript
function isBinary(imageData: ImageData): boolean {
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    if (r !== 0 && r !== 255) return false;
  }
  return true;
}
```

---

## Performance Research

### Benchmarking Similar Functions

**Existing Function Performance** (from Sprint 1):
- `convertToGrayscale()`: ~30ms for 2MB image
- `applyBrightness()`: ~50ms for 2MB image
- `applyContrast()`: ~50ms for 2MB image
- `applyOtsuThreshold()`: ~80ms for 2MB image (includes histogram)

**Expected Performance for `applyThreshold()`**:
- Grayscale conversion: ~30ms (if needed)
- Binarization loop: ~20ms (simpler than brightness/contrast)
- **Total**: ~50ms for 2MB image (well under 100ms target)

**Optimization Opportunities**:
1. Skip grayscale conversion if already grayscale (check R=G=B)
2. Use TypedArray direct access (already used)
3. Single-pass algorithm (no histogram needed)

---

### Algorithm Complexity

**Time Complexity**:
- Grayscale conversion: O(n) where n = pixel count
- Threshold binarization: O(n)
- **Total**: O(2n) = O(n) - linear

**Space Complexity**:
- Input: O(n) - original ImageData
- Grayscale: O(n) - intermediate ImageData
- Output: O(n) - binary ImageData
- **Total**: O(3n) = O(n) - linear

**Optimization**: Could reduce to O(2n) by combining grayscale + threshold in one pass

---

## Code Patterns from Existing Implementation

### Pattern 1: Input Validation

**From `applyBrightness.ts`**:
```typescript
if (!imageData) {
  throw new Error('applyBrightness: imageData parameter is required');
}
if (brightness < -100 || brightness > 100) {
  throw new Error(`applyBrightness: brightness must be in range [-100, 100], got ${brightness}`);
}
```

**Apply to `applyThreshold`**:
```typescript
if (!imageData) {
  throw new Error('applyThreshold: imageData parameter is required');
}
if (threshold < 0 || threshold > 255) {
  throw new Error(`applyThreshold: threshold must be in range [0, 255], got ${threshold}`);
}
```

---

### Pattern 2: Pure Function Structure

**Common Pattern**:
```typescript
export function processImage(imageData: ImageData, param: number): ImageData {
  // 1. Validate inputs
  validateInputs(imageData, param);

  // 2. Destructure
  const { data, width, height } = imageData;

  // 3. Create output
  const output = new ImageData(width, height);

  // 4. Process pixels
  for (let i = 0; i < data.length; i += 4) {
    // ... process R, G, B ...
    output.data[i+3] = data[i+3]; // Preserve alpha
  }

  // 5. Return new ImageData
  return output;
}
```

**Benefits**:
- No side effects
- Testable
- Composable
- Predictable

---

### Pattern 3: Pixel Loop Optimization

**Efficient Loop**:
```typescript
const len = data.length;
for (let i = 0; i < len; i += 4) {
  // Direct array access (no bounds checking overhead)
  output.data[i] = processRed(data[i]);
  output.data[i+1] = processGreen(data[i+1]);
  output.data[i+2] = processBlue(data[i+2]);
  output.data[i+3] = data[i+3]; // Alpha passthrough
}
```

**Why Fast**:
- Cache-friendly (sequential access)
- No function calls in tight loop
- Typed array optimizations (JIT compiler)

---

## Integration Patterns

### Integration with Existing Components

**ThresholdSlider Component** (already exists):
```typescript
// src/components/ThresholdSlider.tsx
export function ThresholdSlider({
  value,      // Current threshold (0-255)
  onChange,   // Callback: (newValue: number) => void
  disabled
}) {
  return (
    <RefinementSlider
      label="Threshold"
      value={value}
      min={0}
      max={255}
      step={1}
      onChange={onChange}
      ariaLabel="Adjust binarization threshold from 0 to 255"
      disabled={disabled}
    />
  );
}
```

**Usage Pattern**:
```typescript
const [threshold, setThreshold] = useState(
  calculateOptimalThreshold(grayscaleImage) // Default from Otsu
);

const handleThresholdChange = (newThreshold: number) => {
  setThreshold(newThreshold);
  const result = applyThreshold(currentImage, newThreshold);
  updatePreview(result);
};

<ThresholdSlider value={threshold} onChange={handleThresholdChange} />
```

---

### State Management Pattern

**State Structure**:
```typescript
interface ImageState {
  original: ImageData | null;
  grayscale: ImageData | null;
  processed: ImageData | null;
  brightness: number;    // -100 to 100
  contrast: number;      // -100 to 100
  threshold: number;     // 0 to 255 (auto-calculated or manual)
}
```

**Update Pattern**:
```typescript
// When threshold slider changes:
setImageState(prev => ({
  ...prev,
  threshold: newValue,
  processed: applyThreshold(prev.grayscale, newValue)
}));
```

---

## Testing Strategy Research

### Unit Test Structure (From Existing Tests)

**Test File Pattern**:
```typescript
// applyBrightness.test.ts structure
describe('applyBrightness', () => {
  describe('valid inputs', () => {
    it('should increase brightness', () => {});
    it('should decrease brightness', () => {});
    it('should handle zero adjustment', () => {});
  });

  describe('edge cases', () => {
    it('should clamp values at boundaries', () => {});
    it('should handle uniform images', () => {});
  });

  describe('validation', () => {
    it('should throw on null imageData', () => {});
    it('should throw on out-of-range values', () => {});
  });

  describe('data integrity', () => {
    it('should not modify input', () => {});
    it('should preserve alpha channel', () => {});
  });
});
```

**Apply to `applyThreshold.test.ts`**:
```typescript
describe('applyThreshold', () => {
  describe('valid threshold values', () => {
    it('threshold=0 produces all white', () => {});
    it('threshold=128 produces mid-point split', () => {});
    it('threshold=255 produces all black', () => {});
  });

  describe('grayscale conversion', () => {
    it('should convert RGB to grayscale before threshold', () => {});
    it('should handle already-grayscale images', () => {});
  });

  describe('edge cases', () => {
    it('should handle uniform gray images', () => {});
    it('should handle already-binary images', () => {});
  });

  describe('validation', () => {
    it('should throw on threshold < 0', () => {});
    it('should throw on threshold > 255', () => {});
    it('should throw on null imageData', () => {});
  });

  describe('data integrity', () => {
    it('should not modify input', () => {});
    it('should preserve alpha channel', () => {});
    it('should return binary output (0 or 255 only)', () => {});
  });

  describe('performance', () => {
    it('should process 2MB image in <100ms', () => {});
  });
});
```

---

### Test Data Generation

**Helper Functions**:
```typescript
// Create test image with specific characteristics
function createTestImageData(
  width: number,
  height: number,
  type: 'uniform' | 'gradient' | 'random' | 'binary'
): ImageData {
  const imageData = new ImageData(width, height);
  const data = imageData.data;

  switch (type) {
    case 'uniform':
      data.fill(128); // All pixels gray
      break;
    case 'gradient':
      // Linear gradient from black to white
      break;
    case 'random':
      // Random pixel values
      break;
    case 'binary':
      // Already binary (0 or 255 only)
      break;
  }

  return imageData;
}
```

---

## Security Considerations

### Input Validation

**Attack Vectors**:
1. Malformed ImageData (null, undefined, invalid dimensions)
2. Out-of-range threshold values (negative, > 255, NaN, Infinity)
3. Very large images (DOS via memory exhaustion)

**Mitigations**:
1. Strict input validation (implemented)
2. Range checking (0-255 enforced)
3. Browser handles memory limits (Canvas API max dimensions)

**Not a Concern** (Client-Side Processing):
- No file upload to server
- No persistent storage
- No cross-origin data

---

## Accessibility Research

### Slider Accessibility (Already Implemented)

**WCAG 2.2 Requirements**:
- ✅ Keyboard accessible (arrow keys adjust value)
- ✅ ARIA labels ("Adjust binarization threshold from 0 to 255")
- ✅ Focus indicators (≥3px, ≥3:1 contrast)
- ✅ Screen reader announcements (value changes)
- ✅ Touch target ≥44px (mobile)

**Existing Implementation**: RefinementSlider already compliant

---

## Alternatives Considered

### Alternative 1: Adaptive Threshold (NOT CHOSEN)

**Concept**: Different threshold for different image regions

**Why Not**:
- Complex algorithm (local histogram analysis)
- Slower performance
- Not needed for laser engraving (uniform material)
- Otsu + manual override sufficient

---

### Alternative 2: Multi-Level Threshold (NOT CHOSEN)

**Concept**: Multiple threshold levels (e.g., 0, 128, 255 → 3 levels)

**Why Not**:
- Laser engraving is binary (burn or don't burn)
- Adds UI complexity
- No user requirement

---

### Alternative 3: Histogram-Based UI (NOT CHOSEN)

**Concept**: Show histogram with threshold indicator

**Why Not**:
- Sprint 2 scope: basic controls only
- Could be Sprint 3 enhancement
- Slider sufficient for MVP

---

## Documentation Standards

### JSDoc Template

**Based on Existing Functions**:
```typescript
/**
 * Apply manual threshold binarization to an image.
 *
 * Converts the image to grayscale and then applies binarization
 * using the specified threshold value. Pixels with intensity below
 * the threshold become black (0), pixels at or above become white (255).
 *
 * This enables manual override of the auto-calculated Otsu threshold,
 * allowing users to fine-tune the black/white separation point for
 * their specific laser engraving material and requirements.
 *
 * Formula: binaryValue = (grayValue < threshold) ? 0 : 255
 *
 * @param imageData - Source image data from Canvas getImageData()
 * @param threshold - Binarization threshold (0-255)
 *                    Lower values → more white, higher values → more black
 * @returns New ImageData with binary (black and white) values
 * @throws {Error} If imageData is null or undefined
 * @throws {Error} If threshold is outside the range [0, 255]
 *
 * @example
 * ```typescript
 * const ctx = canvas.getContext('2d');
 * const imageData = ctx.getImageData(0, 0, width, height);
 *
 * // Apply threshold at midpoint
 * const binary = applyThreshold(imageData, 128);
 * ctx.putImageData(binary, 0, 0);
 *
 * // More aggressive threshold (more black)
 * const darker = applyThreshold(imageData, 200);
 *
 * // More lenient threshold (more white)
 * const lighter = applyThreshold(imageData, 50);
 * ```
 *
 * @performance O(n) where n is pixel count. ~50ms for 2MB (5MP) image
 * @pure No side effects, returns new ImageData without modifying input
 * @see calculateOptimalThreshold - For automatic threshold calculation
 * @see applyOtsuThreshold - For automatic threshold + binarization
 */
export function applyThreshold(imageData: ImageData, threshold: number): ImageData {
  // Implementation...
}
```

---

## Key Takeaways

1. **Algorithm**: Simple binarization, leverage existing grayscale conversion
2. **Performance**: O(n) complexity, ~50ms target achievable
3. **Pattern**: Follow applyBrightness/applyContrast structure exactly
4. **Testing**: Comprehensive unit tests, integration test for full pipeline
5. **Integration**: ThresholdSlider already exists, minimal UI work needed
6. **Documentation**: JSDoc with examples, update FUNCTIONAL.md

---

## References

**Academic**:
- Otsu, N. (1979). "A Threshold Selection Method from Gray-Level Histograms"
- ITU-R BT.601 - Grayscale conversion standard

**Web Standards**:
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- ImageData: https://developer.mozilla.org/en-US/docs/Web/API/ImageData

**Existing Codebase**:
- src/lib/imageProcessing/grayscale.ts - Grayscale conversion
- src/lib/imageProcessing/otsuThreshold.ts - Otsu algorithm reference
- src/lib/imageProcessing/applyBrightness.ts - Function pattern reference
- src/components/ThresholdSlider.tsx - UI component

---

**Research Complete. Ready for Implementation.**
