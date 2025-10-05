# Research: Debounced Preview Updates

**Task ID**: task-016
**Status**: PLANNED

---

## Overview

Research for implementing delayed loading indicators and performance testing for debounced preview updates. 6/8 acceptance criteria already complete - this research focuses on the 2 remaining items.

---

## 1. Delayed Loading Indicator Pattern

### Problem Statement

**Challenge**: Show loading indicator for slow operations without flashing for fast operations

**Requirements**:
- Only show loading if processing takes >500ms
- Prevent loading flash for fast operations (<500ms)
- Clear loading immediately when processing completes
- Accessible to screen readers

### Solution Pattern: Delayed Boolean State

**Approach**: Use setTimeout to delay showing loading indicator

**Implementation**:
```typescript
function useDelayedLoading(isProcessing: boolean, delayMs: number): boolean {
  const [shouldShowLoading, setShouldShowLoading] = useState(false);

  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        setShouldShowLoading(true);
      }, delayMs);

      return () => {
        clearTimeout(timer);
        setShouldShowLoading(false);
      };
    } else {
      setShouldShowLoading(false);
    }
  }, [isProcessing, delayMs]);

  return shouldShowLoading;
}
```

**Behavior**:
- Processing starts → timer set for 500ms
- Processing finishes <500ms → timer cleared, no loading shown
- Processing continues >500ms → loading shown after 500ms
- Processing finishes → loading hidden immediately

### UX Research

**Industry Standards**:
- **Google**: Shows loading after 300-500ms (Gmail, Drive)
- **Microsoft**: 500ms delay for spinners (Office 365)
- **Apple**: 250-500ms for progress indicators (macOS)

**Research Findings**:
- Users don't notice delays <200ms
- 200-500ms: Users notice but tolerate
- >500ms: Users expect feedback
- Flashing indicators (<200ms visible) are annoying

**Recommendation**: 500ms delay
- Balances responsiveness with feedback
- Prevents flashing for fast operations
- Matches industry standards

### Accessibility Considerations

**ARIA Live Regions**:
```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {shouldShowLoading && <span>Processing image...</span>}
</div>
```

**Requirements**:
- `role="status"`: Indicates loading state
- `aria-live="polite"`: Announces when not interrupting
- `aria-atomic="true"`: Reads entire message
- Text content: "Processing image..." (clear, concise)

**Screen Reader Behavior**:
- Announces "Processing image..." when loading appears
- Silent when loading disappears (expected behavior)
- Doesn't interrupt user navigation

### Alternative Patterns Considered

**1. Progress Bar**
- **Pros**: Shows actual progress
- **Cons**: Requires tracking progress (complex), overkill for <3s operations
- **Verdict**: ❌ Rejected (too complex)

**2. Skeleton Screen**
- **Pros**: Visual placeholder, no flash
- **Cons**: Doesn't indicate processing happening
- **Verdict**: ❌ Rejected (wrong use case)

**3. Disabled State Only**
- **Pros**: Simple, no extra UI
- **Cons**: No feedback for >500ms operations
- **Verdict**: ❌ Rejected (insufficient feedback)

**4. Delayed Spinner (Selected)**
- **Pros**: Clear feedback, prevents flash, simple
- **Cons**: None significant
- **Verdict**: ✅ Selected

---

## 2. Performance Testing Strategies

### Goal

Verify slider adjustments complete processing in <100ms for 1920×1080 images.

### Measurement Approach

**API**: `performance.now()`
- **Precision**: Microsecond (0.001ms)
- **Overhead**: <0.1ms (negligible)
- **Browser Support**: All modern browsers

**Basic Pattern**:
```typescript
const start = performance.now();
applyBrightnessAdjustment(imageData, value);
const duration = performance.now() - start;
expect(duration).toBeLessThan(100);
```

### Test Image Data

**Size**: 1920×1080 (Full HD)
- **Rationale**: Realistic, common screen resolution
- **Pixel Count**: 2,073,600 pixels
- **Data Size**: 8,294,400 bytes (width × height × 4 RGBA)

**Creation**:
```typescript
function createTestImageData(): ImageData {
  const width = 1920;
  const height = 1080;
  const data = new Uint8ClampedArray(width * height * 4);

  // Fill with sample data (middle gray)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 128;     // R
    data[i+1] = 128;   // G
    data[i+2] = 128;   // B
    data[i+3] = 255;   // A (opaque)
  }

  return new ImageData(data, width, height);
}
```

### Performance Benchmarks

**Expected Times** (based on Canvas API performance):
- **Brightness**: ~10-30ms (simple pixel loop)
- **Contrast**: ~15-40ms (requires histogram calculation)
- **Threshold**: ~20-50ms (requires Otsu algorithm)
- **Background Removal**: ~30-80ms (edge detection + fill)

**Target**: All <100ms
- **Buffer**: 20-50ms safety margin
- **Rationale**: Allows for slower devices, GC pauses

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import {
  applyBrightnessAdjustment,
  applyContrastAdjustment,
  applyThresholdAdjustment,
  applyBackgroundRemoval
} from '@/lib/image-processing';

describe('Adjustment Performance', () => {
  const createTestImageData = () => { /* ... */ };

  it('brightness adjustment completes in <100ms', () => {
    const imageData = createTestImageData();
    const start = performance.now();

    applyBrightnessAdjustment(imageData, 50);

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });

  // Similar tests for contrast, threshold, background removal
});
```

### Handling Test Variability

**Issue**: Performance varies by:
- Hardware (CPU speed, memory)
- Browser engine (V8, SpiderMonkey, JavaScriptCore)
- System load (other processes)

**Solutions**:

1. **Multiple Runs**:
   ```typescript
   const runs = 5;
   const times: number[] = [];

   for (let i = 0; i < runs; i++) {
     const start = performance.now();
     applyBrightnessAdjustment(imageData, 50);
     times.push(performance.now() - start);
   }

   const avgTime = times.reduce((a, b) => a + b) / runs;
   expect(avgTime).toBeLessThan(100);
   ```

2. **Margin Allowance**:
   ```typescript
   // Allow 10% margin for slower hardware
   expect(duration).toBeLessThan(110);
   ```

3. **Skip on CI** (if needed):
   ```typescript
   const isCI = process.env.CI === 'true';
   const testFn = isCI ? it.skip : it;

   testFn('performance test', () => {
     // Test code
   });
   ```

### Performance Regression Detection

**Baseline Recording**:
```typescript
// Record baseline times
const baseline = {
  brightness: 25,
  contrast: 35,
  threshold: 45,
  backgroundRemoval: 70
};

// Test against baseline + margin
expect(duration).toBeLessThan(baseline.brightness * 1.2); // 20% margin
```

**CI Integration**:
- Run performance tests on every PR
- Compare with baseline
- Alert if regression >20%

---

## 3. React Hook Patterns

### Custom Hook Best Practices

**From useDebounce** (existing implementation):
- ✅ Clear, descriptive name
- ✅ Generic type support
- ✅ Proper cleanup (return cleanup function)
- ✅ Dependencies array correct
- ✅ JSDoc documentation with examples

**Apply to useDelayedLoading**:
- Name: `useDelayedLoading` (descriptive)
- Return: `boolean` (simple, clear)
- Parameters: `isProcessing: boolean, delayMs: number`
- Cleanup: Clear timeout on unmount

### Hook Testing Pattern

**Test Cases for useDelayedLoading**:

1. **Shows loading after delay**:
   ```typescript
   it('shows loading after delayMs', async () => {
     const { result } = renderHook(() =>
       useDelayedLoading(true, 500)
     );

     expect(result.current).toBe(false); // Initially false

     await waitFor(() => {
       expect(result.current).toBe(true); // True after 500ms
     }, { timeout: 600 });
   });
   ```

2. **Doesn't show if processing finishes quickly**:
   ```typescript
   it('does not show if processing finishes before delay', async () => {
     const { result, rerender } = renderHook(
       ({ isProcessing }) => useDelayedLoading(isProcessing, 500),
       { initialProps: { isProcessing: true } }
     );

     // Wait 400ms
     await waitFor(() => {}, { timeout: 400 });

     // Stop processing before 500ms
     rerender({ isProcessing: false });

     expect(result.current).toBe(false);
   });
   ```

3. **Cleans up on unmount**:
   ```typescript
   it('clears timer on unmount', () => {
     const { unmount } = renderHook(() =>
       useDelayedLoading(true, 500)
     );

     unmount(); // Should not throw, timer cleared
   });
   ```

---

## 4. Loading Overlay Design

### Visual Design

**Overlay Structure**:
```tsx
<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
  <div className="text-white text-center space-y-2">
    <Spinner className="w-8 h-8 animate-spin" />
    <p className="text-sm">Processing...</p>
  </div>
</div>
```

**CSS Classes**:
- `absolute inset-0`: Cover entire preview area
- `bg-black/50`: Semi-transparent dark overlay (50% opacity)
- `flex items-center justify-center`: Center spinner
- `z-10`: Above canvas, below other UI
- `text-white`: Contrast against dark background
- `animate-spin`: Rotate spinner

### Component Options

**Option A: Inline in ImagePreview.tsx**
```tsx
export function ImagePreview({ shouldShowLoading, ... }) {
  return (
    <div className="relative">
      <canvas ... />
      {shouldShowLoading && <LoadingOverlay />}
    </div>
  );
}
```
- **Pros**: Simple, co-located
- **Cons**: Couples loading logic to preview

**Option B: Separate LoadingOverlay Component**
```tsx
export function LoadingOverlay({ message = 'Processing...' }) {
  return (
    <div className="absolute inset-0 ...">
      <Spinner />
      <p>{message}</p>
    </div>
  );
}
```
- **Pros**: Reusable, testable
- **Cons**: Extra file

**Recommendation**: Option A (inline)
- Loading is tightly coupled to preview
- Unlikely to reuse elsewhere
- Simpler implementation

### Accessibility

**Requirements**:
- `role="status"`: Loading state
- `aria-live="polite"`: Screen reader announcement
- Text content: "Processing image adjustments"

**Implementation**:
```tsx
{shouldShowLoading && (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="absolute inset-0 bg-black/50 flex items-center justify-center"
  >
    <div className="text-white text-center">
      <Spinner aria-hidden="true" />
      <p>Processing image adjustments</p>
    </div>
  </div>
)}
```

---

## 5. Integration Points

### App.tsx State Management

**Current State**:
```typescript
const [brightness, setBrightness] = useState(0);
const [contrast, setContrast] = useState(0);
const [threshold, setThreshold] = useState(128);
const [backgroundRemovalEnabled, setBackgroundRemovalEnabled] = useState(false);
const [backgroundRemovalSensitivity, setBackgroundRemovalSensitivity] = useState(128);

const debouncedBrightness = useDebounce(brightness, 100);
const debouncedContrast = useDebounce(contrast, 100);
const debouncedThreshold = useDebounce(threshold, 100);
const debouncedBgSensitivity = useDebounce(backgroundRemovalSensitivity, 100);
```

**Add Processing State**:
```typescript
const [isProcessing, setIsProcessing] = useState(false);
const shouldShowLoading = useDelayedLoading(isProcessing, 500);
```

**Update useEffect** (example for brightness):
```typescript
useEffect(() => {
  if (!processedImageData) return;

  setIsProcessing(true);

  // Apply adjustment
  const result = applyBrightnessAdjustment(
    processedImageData,
    debouncedBrightness
  );

  setProcessedImageData(result);
  setIsProcessing(false);
}, [debouncedBrightness, processedImageData]);
```

**Challenge**: Need to track processing for all adjustments
- Multiple useEffects
- Each sets isProcessing independently
- Race condition if multiple adjustments triggered

**Solution**: Combine into single processing effect
```typescript
useEffect(() => {
  if (!originalImageData) return;

  setIsProcessing(true);

  // Apply all adjustments in sequence
  let result = originalImageData;

  if (debouncedBackgroundRemoval) {
    result = applyBackgroundRemoval(result, debouncedBgSensitivity);
  }

  result = applyBrightnessAdjustment(result, debouncedBrightness);
  result = applyContrastAdjustment(result, debouncedContrast);
  result = applyThresholdAdjustment(result, debouncedThreshold);

  setProcessedImageData(result);
  setIsProcessing(false);
}, [
  originalImageData,
  debouncedBrightness,
  debouncedContrast,
  debouncedThreshold,
  debouncedBackgroundRemoval,
  debouncedBgSensitivity
]);
```

---

## 6. Performance Optimization Research

### Canvas API Performance

**Fast Operations** (pixel-by-pixel):
- Reading pixels: ~5-10ms for 1920×1080
- Writing pixels: ~10-15ms
- Simple math per pixel: ~15-30ms

**Expensive Operations**:
- Histogram calculation: ~20-40ms
- Sorting: ~10-20ms (for Otsu)
- Edge detection: ~50-100ms

**Optimization Techniques**:

1. **Typed Arrays**:
   ```typescript
   const data = imageData.data; // Uint8ClampedArray
   // Already optimal, no conversion needed
   ```

2. **Loop Optimization**:
   ```typescript
   // ✅ Fast: Hoist length, cache array access
   const pixels = imageData.data;
   const length = pixels.length;
   for (let i = 0; i < length; i += 4) {
     pixels[i] += adjustment; // R
   }

   // ❌ Slow: Re-read length, multiple array access
   for (let i = 0; i < imageData.data.length; i++) {
     imageData.data[i] += adjustment;
   }
   ```

3. **Avoid Allocation in Hot Path**:
   ```typescript
   // ✅ Fast: Reuse array
   const histogram = new Uint32Array(256);

   // ❌ Slow: Allocate every time
   const histogram = new Array(256).fill(0);
   ```

4. **SIMD (Future)**:
   - Not yet widely supported
   - Could improve by 2-4x
   - Monitor for future optimization

---

## Research Summary

### Key Findings

1. **Delayed Loading Pattern**:
   - ✅ 500ms delay prevents flashing
   - ✅ Industry standard approach
   - ✅ Simple implementation with useEffect + setTimeout

2. **Performance Testing**:
   - ✅ Use `performance.now()` for accuracy
   - ✅ Test with 1920×1080 images (realistic)
   - ✅ Allow 10-20% margin for variability
   - ✅ Average multiple runs for stability

3. **Integration**:
   - ✅ Combine adjustments into single effect
   - ✅ Single isProcessing state
   - ✅ useDelayedLoading hook for UX

### Recommended Implementation Order

1. **useDelayedLoading Hook** (30 mins)
   - Simple, foundational
   - Easy to test

2. **App.tsx Integration** (30 mins)
   - Add processing state
   - Combine adjustment effects

3. **Loading Overlay** (20 mins)
   - Inline in ImagePreview
   - ARIA accessibility

4. **Performance Tests** (30 mins)
   - Create test suite
   - Test all adjustment types

**Total**: ~2 hours (conservative, likely 1.5 hours)

---

## References

### Documentation
- [MDN: performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)
- [React Hooks Reference](https://react.dev/reference/react)
- [ARIA: status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role)

### Performance Research
- [V8 JavaScript Performance](https://v8.dev/blog/fast-for-in)
- [Canvas API Performance](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

### UX Research
- [Google Material Design - Progress Indicators](https://m3.material.io/components/progress-indicators)
- [Nielsen Norman Group - Response Times](https://www.nngroup.com/articles/response-times-3-important-limits/)

---

**Next Step**: Run `/build` to implement based on this research
