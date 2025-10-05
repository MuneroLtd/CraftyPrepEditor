# Research: Brightness Adjustment Implementation

**Task ID**: task-012
**Research Date**: 2025-10-05

---

## Algorithm Research

### Brightness Adjustment Formula

**Specification** (from FUNCTIONAL.md):
```
newValue = clamp(originalValue + brightness, 0, 255)
```

**Explanation**:
- Simple additive adjustment
- Applied independently to each RGB channel
- Uniform brightness change across all pixels
- Clamping prevents overflow/underflow

**Mathematical Properties**:
- Linear transformation
- Preserves relative differences between pixels
- Reversible (brightness +50 then -50 = original)
- Commutative with other additive adjustments

**Why This Algorithm**:
- Simple and fast (O(n) where n = pixels)
- Intuitive for users (higher = brighter)
- Predictable results
- No artifacts or distortion
- Standard in image editing tools

---

## Canvas API Research

### ImageData Structure

```typescript
interface ImageData {
  data: Uint8ClampedArray;  // RGBA values, 4 bytes per pixel
  width: number;            // Image width in pixels
  height: number;           // Image height in pixels
}
```

**Data Array Layout**:
```
[R0, G0, B0, A0, R1, G1, B1, A1, R2, G2, B2, A2, ...]
```

- Index formula: `pixel[x, y] = data[(y * width + x) * 4]`
- R = Red (index i)
- G = Green (index i+1)
- B = Blue (index i+2)
- A = Alpha (index i+3)

### Relevant Canvas Methods

**createImageData()**:
```typescript
const newData = ctx.createImageData(width, height);
// Creates new ImageData with all pixels set to transparent black [0,0,0,0]
```

**getImageData()**:
```typescript
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// Returns copy of canvas pixel data
```

**putImageData()**:
```typescript
ctx.putImageData(imageData, 0, 0);
// Draws ImageData to canvas (replaces existing content)
```

**Performance**: All methods are synchronous and fast for typical image sizes (<10MB).

---

## Existing Code Patterns

### Pattern 1: Pure Function (grayscale.ts)

```typescript
export function convertToGrayscale(imageData: ImageData): ImageData {
  // 1. Create new ImageData (don't mutate input)
  const { width, height } = imageData;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const newData = ctx.createImageData(width, height);

  // 2. Process pixels
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    // Weighted average (human perception)
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    newData.data[i] = gray;
    newData.data[i + 1] = gray;
    newData.data[i + 2] = gray;
    newData.data[i + 3] = imageData.data[i + 3]; // Preserve alpha
  }

  return newData;
}
```

**Key Takeaways**:
- Pure function (no mutation)
- Create new ImageData
- Loop with `i += 4` (RGBA stride)
- Preserve alpha channel
- Return new ImageData

### Pattern 2: Hook Integration (useImageProcessing.ts)

```typescript
const runAutoPrepAsync = useCallback(async (uploadedImage: HTMLImageElement) => {
  setIsProcessing(true);
  setError(null);

  try {
    // Convert to ImageData
    const canvas = document.createElement('canvas');
    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(uploadedImage, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Apply pipeline
    imageData = convertToGrayscale(imageData);
    imageData = applyHistogramEqualization(imageData);
    imageData = applyOtsuThreshold(imageData);

    // Convert back to HTMLImageElement
    ctx.putImageData(imageData, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    const resultImage = new Image();
    await new Promise((resolve) => {
      resultImage.onload = () => resolve();
      resultImage.src = dataUrl;
    });

    setProcessedImage(resultImage);
    setProcessedCanvas(canvas);
    setIsProcessing(false);
  } catch (err) {
    setError('Processing failed');
    setIsProcessing(false);
  }
}, []);
```

**Key Takeaways**:
- Async processing (non-blocking UI)
- Loading state management
- Error handling
- Convert HTMLImageElement → Canvas → ImageData → Process → ImageData → Canvas → HTMLImageElement

---

## Debouncing Research

### Problem
Without debouncing, slider drag triggers processing on every pixel of movement:
- User drags slider 50 pixels = 50 processing calls
- Each call processes entire image (expensive)
- UI becomes unresponsive
- Wasted computation (intermediate values discarded)

### Solution: Debouncing
Wait for input to "settle" before processing:
- User drags slider (many changes)
- Timer starts/resets on each change
- Only process after 100ms of no changes
- Result: 1 processing call instead of 50

### useDebounce Hook Pattern

```typescript
function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timer
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Cleanup: clear timer if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
```

**How It Works**:
1. User changes value rapidly
2. Each change schedules a timer (100ms)
3. Each new change CANCELS previous timer
4. Only when user stops for 100ms does the debounced value update
5. Debounced value update triggers processing

**Usage**:
```typescript
const [brightness, setBrightness] = useState(0);
const debouncedBrightness = useDebounce(brightness, 100);

useEffect(() => {
  if (baselineImageData) {
    applyAdjustments(debouncedBrightness);
  }
}, [debouncedBrightness]);
```

**Benefits**:
- Reduces processing calls by ~95%
- UI stays responsive (slider updates immediately)
- User sees final result quickly (<100ms after stopping)
- Lower CPU usage

---

## Performance Analysis

### Time Complexity
- **applyBrightness()**: O(n) where n = number of pixels
- **For 2MB image** (1920×1080): ~2 million pixels
- **Processing time**: ~10-50ms (modern browser, fast CPU)

### Space Complexity
- **Input**: ImageData (~8MB for 2MB source image in memory)
- **Output**: New ImageData (~8MB)
- **Total**: ~16MB additional memory during processing
- **Cleanup**: Input freed after processing (GC)

### Optimization Opportunities
**Current (MVP)**:
- Simple loop, sufficient for <10MB images
- No optimization needed

**Future (if needed)**:
- Web Workers for processing (offload main thread)
- Chunked processing for huge images (>20MB)
- SIMD operations (if browser supports)

---

## Baseline Storage Strategy

### Why Store Baseline?

**Without Baseline**:
```
User adjusts brightness → Re-run entire auto-prep pipeline → Apply brightness
(Slow: grayscale + histogram + threshold + brightness)
```

**With Baseline**:
```
User adjusts brightness → Apply brightness to stored baseline
(Fast: just brightness adjustment)
```

**Savings**: ~90% faster for adjustments

### What to Store?

**Option 1**: Store as ImageData
```typescript
baselineImageData: ImageData  // Result after Otsu threshold
```
- **Pros**: Fast re-processing, pure functional approach
- **Cons**: Memory usage (~8MB for 2MB image)

**Option 2**: Store as Canvas
```typescript
baselineCanvas: HTMLCanvasElement
```
- **Pros**: Can draw directly
- **Cons**: Need to getImageData() on each adjustment (slower)

**Decision**: Store as ImageData (Option 1)
- Matches pure functional pattern
- Fast adjustment processing
- Memory cost acceptable (<10MB)

### When to Update Baseline?

1. **After auto-prep completes** (runAutoPrepAsync)
   - Store final ImageData after Otsu threshold
2. **On new image upload** (clear baseline)
3. **On reset** (restore from baseline)

### Memory Management

**Cleanup Strategy**:
- Clear baseline on new upload
- Clear on component unmount
- Browser GC handles cleanup automatically

---

## Integration Architecture

### State Flow

```
App.tsx
├── brightness: number (immediate, for UI)
├── debouncedBrightness: number (delayed, for processing)
└── useImageProcessing
    ├── baselineImageData: ImageData | null
    ├── processedImage: HTMLImageElement | null
    └── applyAdjustments(brightness: number)
```

### Event Flow

```
User drags slider
    ↓
setBrightness(newValue)  [immediate]
    ↓
Slider updates visually  [no delay]
    ↓
[100ms debounce timer]
    ↓
debouncedBrightness updates
    ↓
useEffect triggers
    ↓
applyAdjustments(debouncedBrightness)
    ↓
  1. Clone baselineImageData
  2. Apply brightness adjustment
  3. Convert to HTMLImageElement
  4. Update processedImage
    ↓
Preview updates  [<100ms total]
```

---

## Testing Strategy Research

### Unit Testing Approach

**Test Data Generation**:
```typescript
function createTestImageData(width: number, height: number, fillColor: [r, g, b, a]): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = fillColor[0];     // R
    imageData.data[i + 1] = fillColor[1]; // G
    imageData.data[i + 2] = fillColor[2]; // B
    imageData.data[i + 3] = fillColor[3]; // A
  }

  return imageData;
}
```

**Assertion Pattern**:
```typescript
test('brightness +50 increases pixel values by 50', () => {
  const input = createTestImageData(2, 2, [100, 100, 100, 255]);
  const result = applyBrightness(input, 50);

  expect(result.data[0]).toBe(150); // R
  expect(result.data[1]).toBe(150); // G
  expect(result.data[2]).toBe(150); // B
  expect(result.data[3]).toBe(255); // A unchanged
});
```

### Integration Testing Approach

**Mock Strategy**:
- Mock Canvas API in test setup (already done in tests/setup.ts)
- Use actual React Testing Library rendering
- Test full user flow

**Test Structure**:
```typescript
describe('Brightness Adjustment Integration', () => {
  test('auto-prep then brightness adjustment', async () => {
    const { runAutoPrepAsync, applyAdjustments, processedImage } = renderHook(() => useImageProcessing());

    await runAutoPrepAsync(mockImage);
    expect(processedImage).toBeTruthy();

    await applyAdjustments(50);
    expect(processedImage).toMatchSnapshot();
  });
});
```

### E2E Testing Approach

**Playwright Pattern**:
```typescript
test('brightness adjustment workflow', async ({ page }) => {
  await page.goto('https://craftyprep.demosrv.uk');

  // Upload image
  await page.setInputFiles('input[type="file"]', 'test-image.jpg');

  // Auto-prep
  await page.click('button:has-text("Auto-Prep")');
  await page.waitForSelector('[data-testid="processed-preview"]');

  // Adjust brightness
  const slider = page.locator('[aria-label="Adjust image brightness"]');
  await slider.fill('50');

  // Wait for debounce + processing
  await page.waitForTimeout(150);

  // Verify preview updated
  const preview = page.locator('[data-testid="processed-preview"]');
  await expect(preview).toHaveAttribute('src', /.+/);
});
```

---

## Edge Cases & Solutions

### Edge Case 1: Brightness = 0
**Behavior**: Should return baseline unchanged
**Optimization**: Early return if brightness === 0
```typescript
if (brightness === 0) return imageData;  // No processing needed
```

### Edge Case 2: Clamping
**Problem**: brightness +200 on pixel [200, 200, 200] → [400, 400, 400] (overflow)
**Solution**: Clamp to 0-255
```typescript
const newValue = Math.min(255, Math.max(0, originalValue + brightness));
```

### Edge Case 3: Large Images
**Problem**: 10MB image might take >1 second to process
**Solution**:
- Show processing indicator if >500ms
- Consider Web Worker for future optimization
- Current solution: Acceptable for MVP (<10MB limit)

### Edge Case 4: No Baseline
**Problem**: User adjusts brightness before auto-prep
**Solution**: Disable slider when no baseline
```typescript
<BrightnessSlider disabled={!baselineImageData} />
```

### Edge Case 5: Rapid Changes
**Problem**: User drags slider back and forth rapidly
**Solution**: Debouncing handles this (only process final value)

---

## Security Considerations

### Input Validation
```typescript
function applyBrightness(imageData: ImageData, brightness: number): ImageData {
  // Validate brightness range
  if (brightness < -100 || brightness > 100) {
    throw new Error('Brightness must be between -100 and +100');
  }

  // Validate ImageData
  if (!imageData || !imageData.data) {
    throw new Error('Invalid ImageData');
  }

  // ... process
}
```

### Memory Safety
- No buffer overflows (Uint8ClampedArray auto-clamps)
- No out-of-bounds access (loop bound by data.length)
- Automatic garbage collection (no manual memory management)

### No External Data
- All processing client-side
- No network requests
- No data sent to server
- Privacy-focused design

---

## Performance Benchmarks (Estimated)

### Target Performance
| Image Size | Pixels     | Brightness Adjustment Time | Total Response Time |
|------------|------------|----------------------------|---------------------|
| 500KB      | 640×480    | <10ms                      | <110ms              |
| 2MB        | 1920×1080  | <50ms                      | <150ms              |
| 5MB        | 2560×1440  | <100ms                     | <200ms              |
| 10MB       | 3840×2160  | <200ms                     | <300ms              |

**Total Response Time** = Debounce (100ms) + Processing + Rendering

### Browser Compatibility
- Chrome 90+: ✅ Fast (V8 JIT optimization)
- Firefox 88+: ✅ Fast (SpiderMonkey optimization)
- Safari 14+: ✅ Fast (JavaScriptCore optimization)
- Edge 90+: ✅ Fast (Chromium-based)

---

## Related Research

### Similar Implementations
- **Photoshop**: Brightness adjustment uses same algorithm
- **GIMP**: Brightness/Contrast tool uses linear transformation
- **Canvas Editor Libraries**: fabric.js, Konva.js use similar approach

### Alternative Algorithms (NOT USED)
1. **Curves Adjustment**: More complex, overkill for brightness
2. **Levels Adjustment**: For advanced users, not MVP
3. **Exposure Adjustment**: Similar but multiplicative (different UX)

### Why Our Algorithm Is Best
- Simple and predictable
- Fast (O(n) linear)
- Matches user mental model
- Industry standard
- No artifacts

---

## Conclusion

**Ready to Implement**: ✅

All research complete:
- Algorithm well-defined
- Pattern exists in codebase
- Performance acceptable
- Testing strategy clear
- Security considerations addressed
- Edge cases identified and solved

**No unknowns or risks** - Straightforward implementation following established patterns.

**Next Step**: Run `/build` to implement the 5-phase plan.
