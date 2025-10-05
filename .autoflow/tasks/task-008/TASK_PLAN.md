# Task Plan: Auto-Prep Button + Processing Pipeline Integration

**Task ID**: task-008
**Status**: PLANNED
**Created**: 2025-10-05

---

## Objective

Wire up the Auto-Prep button to execute the complete processing pipeline (grayscale → histogram equalization → Otsu threshold) and display results with loading states and error handling.

---

## Implementation Plan

### Phase 1: Test-Driven Development Setup

**Files to Create (Tests First)**:
1. `src/tests/unit/components/AutoPrepButton.test.tsx`
2. `src/tests/unit/hooks/useImageProcessing.test.tsx`
3. `src/tests/integration/AutoPrepFlow.test.tsx`

**Test Coverage**:
- Loading states (button disabled, spinner visible)
- Error handling (processing failures, user-friendly messages)
- Pipeline execution (grayscale → equalization → threshold)
- Performance (processing time <5s for 2MB image)
- Accessibility (keyboard, screen reader)

### Phase 2: Component Implementation

**1. AutoPrepButton Component** (`src/components/AutoPrepButton.tsx`)

**Props**:
```typescript
interface AutoPrepButtonProps {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}
```

**Features**:
- Primary button styling (call-to-action)
- Icon (sparkles/magic wand) + text "Auto-Prep"
- Loading state: spinner + "Processing..."
- Disabled state: grayed out with tooltip
- Keyboard accessible (Tab + Enter)
- Screen reader announces state

**2. useImageProcessing Hook** (`src/hooks/useImageProcessing.ts`)

**Interface**:
```typescript
interface UseImageProcessingReturn {
  processedImage: HTMLImageElement | null;
  isProcessing: boolean;
  error: string | null;
  runAutoPrepAsync: (uploadedImage: HTMLImageElement) => Promise<void>;
}
```

**Pipeline Execution**:
```
Input: HTMLImageElement
  ↓
1. Convert to ImageData (canvas.getContext('2d').getImageData)
  ↓
2. convertToGrayscale(imageData)
  ↓
3. applyHistogramEqualization(grayscaleData)
  ↓
4. calculateOptimalThreshold(equalizedData)
  ↓
5. applyOtsuThreshold(equalizedData, threshold)
  ↓
6. Convert ImageData → HTMLImageElement
  ↓
Output: processedImage
```

**Error Handling**:
- Wrap pipeline in try/catch
- Set user-friendly error messages
- Log technical details to console
- Clear error on next successful run

**Performance**:
- Async execution (doesn't block UI)
- Progress indicator if >2s
- Target: <5s for 2MB image

### Phase 3: Integration with App.tsx

**Current State**:
```tsx
<FileUploadComponent /> // Manages uploadedImage
<ImagePreview originalImage={...} processedImage={null} />
```

**New State**:
```tsx
const { processedImage, isProcessing, error, runAutoPrepAsync } = useImageProcessing();

<FileUploadComponent /> // Still manages uploadedImage

<AutoPrepButton
  disabled={!uploadedImage || isProcessing}
  loading={isProcessing}
  onClick={() => runAutoPrepAsync(uploadedImage)}
/>

{error && <ErrorDisplay message={error} />}

<ImagePreview
  originalImage={uploadedImage}
  processedImage={processedImage} // Now populated!
/>
```

**State Management**:
- uploadedImage: Managed by FileUploadComponent
- processedImage: Managed by useImageProcessing hook
- Both passed to ImagePreview for side-by-side display

### Phase 4: Testing Strategy

**Unit Tests**:
- AutoPrepButton renders correctly
- Button states (disabled, loading, enabled)
- Click handler fires
- Accessibility attributes present

**Hook Tests**:
- Pipeline executes in order
- Each algorithm called with correct data
- Error handling works
- Loading states transition correctly

**Integration Tests**:
- Upload image → click Auto-Prep → see result
- Processing time measured
- Error scenarios (corrupted data, etc.)
- Multiple runs (reset state correctly)

---

## Algorithms Used

All algorithms already implemented in `src/lib/imageProcessing/`:
1. `convertToGrayscale` - RGB → Grayscale (luminance-based)
2. `applyHistogramEqualization` - Enhance contrast
3. `calculateOptimalThreshold` - Otsu's method
4. `applyOtsuThreshold` - Binarize using threshold

---

## File Structure

```
src/
├── components/
│   └── AutoPrepButton.tsx          ← NEW
├── hooks/
│   └── useImageProcessing.ts       ← NEW
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   │   └── AutoPrepButton.test.tsx    ← NEW
│   │   └── hooks/
│   │       └── useImageProcessing.test.tsx ← NEW
│   └── integration/
│       └── AutoPrepFlow.test.tsx   ← NEW
└── App.tsx                         ← MODIFIED (integration)
```

---

## Acceptance Criteria Checklist

- [ ] AutoPrepButton component created with icon
- [ ] Button disabled when no image loaded
- [ ] Loading state during processing (spinner + text)
- [ ] Pipeline executes: grayscale → equalization → threshold
- [ ] Processed result displays in right preview
- [ ] Processing time <5s for 2MB image
- [ ] Error handling with user-friendly messages
- [ ] Success feedback (visual confirmation)
- [ ] Original image preserved on left
- [ ] Integration test for complete pipeline
- [ ] Keyboard accessible (Tab + Enter)
- [ ] Screen reader announces status
- [ ] Tests written and passing (≥80% coverage)

---

## Performance Targets

- 2MB image: <3 seconds
- 5MB image: <5 seconds
- UI remains responsive during processing
- Memory cleanup after processing

---

## Dependencies

**Existing Files**:
- `src/lib/imageProcessing/grayscale.ts`
- `src/lib/imageProcessing/histogramEqualization.ts`
- `src/lib/imageProcessing/otsuThreshold.ts`
- `src/components/ImagePreview.tsx`
- `src/components/FileUploadComponent.tsx`

**New Dependencies**: None (uses existing Canvas API)

---

## Implementation Order

1. **Write Tests First** (TDD approach)
   - AutoPrepButton.test.tsx
   - useImageProcessing.test.tsx
   - AutoPrepFlow.test.tsx (integration)

2. **Implement Components** (make tests pass)
   - AutoPrepButton.tsx
   - useImageProcessing.ts

3. **Integrate into App**
   - Modify App.tsx
   - Wire up state management

4. **Verify & Validate**
   - Run all tests
   - Manual testing in browser
   - Performance profiling
   - Accessibility audit

---

## Notes

- **TDD**: Tests written before implementation
- **Performance**: Use requestAnimationFrame for smooth UI
- **Error Recovery**: Clear error on next successful run
- **Accessibility**: Full WCAG 2.2 AAA compliance
- **Memory**: Clean up canvas references after processing
