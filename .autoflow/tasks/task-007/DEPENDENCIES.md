# Dependencies: Otsu's Threshold Algorithm

**Task ID**: task-007
**Last Updated**: 2025-10-05

---

## Upstream Dependencies (Required Before Starting)

### Task 1.6: Histogram Equalization Algorithm
**Status**: COMPLETE ✅
**Why Required**:
- Otsu's threshold works on equalized grayscale images for best results
- Histogram equalization enhances contrast, improving threshold detection
- Pipeline order: grayscale → histogram equalization → Otsu threshold

**Provides**:
- Equalized grayscale ImageData as input
- ImageData format and structure conventions

**Risk**: None (task complete)

---

### Task 1.5: Grayscale Conversion Algorithm
**Status**: COMPLETE ✅
**Why Required**:
- Otsu's method requires single-channel grayscale data
- Grayscale ensures histogram has 256 bins (0-255)

**Provides**:
- Grayscale ImageData format
- Pure function pattern for image processing

**Risk**: None (task complete)

---

## Downstream Dependencies (Tasks That Depend on This)

### Task 1.8: Auto-Prep Button and Processing Flow
**Status**: PENDING
**Dependency Type**: Hard (blocking)
**Why Depends**:
- Auto-Prep button executes complete pipeline: grayscale → equalization → **threshold**
- Final binarization step requires Otsu's method
- Cannot complete pipeline without threshold algorithm

**Provides To Task 1.8**:
- `calculateOptimalThreshold(imageData)` function
- `applyOtsuThreshold(imageData)` function
- Binarized ImageData output (pure black and white)

**Integration Point**:
```typescript
// In Auto-Prep pipeline (Task 1.8)
const grayscale = convertToGrayscale(originalImageData);
const equalized = applyHistogramEqualization(grayscale);
const binarized = applyOtsuThreshold(equalized); // <-- This task
```

---

### Task 1.9: PNG Export and Download
**Status**: PENDING
**Dependency Type**: Indirect (via Task 1.8)
**Why Depends**:
- Export requires processed image from Auto-Prep pipeline
- Pipeline must include Otsu's threshold for final output

**Provides To Task 1.9**:
- Final binarized image ready for export
- High-contrast black-and-white PNG optimized for laser engraving

---

### Task 1.10: CI Pipeline and Testing Setup
**Status**: PENDING
**Dependency Type**: Testing (non-blocking)
**Why Depends**:
- CI pipeline runs all unit tests including Otsu tests
- Coverage reporting includes this module

**Provides To Task 1.10**:
- Unit tests to be included in CI
- Coverage data for overall project metrics

---

## External Dependencies

### Browser APIs
**Required**: Canvas API
**Why**: ImageData object creation and manipulation
**Risk**: None (universally supported in target browsers)

### TypeScript
**Required**: TypeScript 5.x
**Why**: Type safety and type checking
**Risk**: None (already configured)

### Testing Framework
**Required**: Vitest
**Why**: Unit testing and coverage
**Risk**: None (already configured in package.json)

---

## Technical Dependencies

### Data Structures
**Required**: ImageData object
**Format**:
```typescript
interface ImageData {
  width: number;
  height: number;
  data: Uint8ClampedArray; // RGBA format, 4 bytes per pixel
}
```
**Provided By**: Canvas API, Task 1.4 (Canvas Creation)

### Algorithm Dependencies
**Required**: None (self-contained algorithm)
**Uses**:
- Standard JavaScript arrays
- Math.pow() for variance calculation
- Loops for histogram and variance computation

### Performance Dependencies
**Required**: None
**Optimizations**:
- Cumulative sum optimization (independent)
- Typed arrays for efficiency (independent)

---

## Dependency Graph

```
Task 1.4 (Canvas) ──→ Task 1.5 (Grayscale) ──→ Task 1.6 (Equalization) ──→ [Task 1.7 (Otsu)] ──→ Task 1.8 (Auto-Prep)
                                                                                    ↓
                                                                              Task 1.9 (Export)
                                                                                    ↓
                                                                              Task 1.10 (CI)
```

---

## Risk Assessment

### High Risk
None

### Medium Risk
None

### Low Risk
**Risk**: Performance on very large images (>5MP)
- **Mitigation**: Performance benchmarks included in tests
- **Fallback**: Algorithm is O(n) with 256 iterations, scales well

**Risk**: Edge cases (all-black, all-white) produce invalid thresholds
- **Mitigation**: Comprehensive edge case tests
- **Fallback**: Safe defaults (threshold = 0 or 255)

---

## Version Compatibility

### Node.js
**Required**: None (client-side only)

### Browsers
**Required**: ES2020 support
**APIs Used**:
- `ImageData` constructor
- `Uint8ClampedArray`
- `Math.pow()`
- `Array.fill()`

**Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Completion Criteria

**This task is unblocked when**:
- ✅ Task 1.5 (Grayscale) is COMPLETE
- ✅ Task 1.6 (Histogram Equalization) is COMPLETE

**This task unblocks**:
- Task 1.8 (Auto-Prep Flow)
- Task 1.9 (Export) indirectly
- Task 1.10 (CI) partially

---

## Integration Checklist

Before marking task complete:
- [ ] Functions exported from `otsuThreshold.ts`
- [ ] Functions re-exported from `lib/imageProcessing/index.ts`
- [ ] Unit tests passing
- [ ] Integration with Task 1.6 output verified
- [ ] Accepts ImageData from histogram equalization
- [ ] Produces valid ImageData for canvas display
- [ ] Ready for use in Task 1.8 pipeline

---

**Status**: All dependencies satisfied ✅
**Ready to Start**: Yes
