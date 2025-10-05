# Task Plan: Background Removal Integration

**Task ID**: task-013
**Status**: PLANNED
**Priority**: HIGH
**Estimated Effort**: 6 hours

## Overview

Implement automatic background removal with manual sensitivity control as part of the Auto-Prep processing pipeline. Uses edge detection and flood-fill algorithm to detect and remove solid/near-solid backgrounds, making them transparent.

## Implementation Phases (TDD Approach)

### Phase 1: Algorithm Core (2 hours)

**Test-Driven Development Cycle:**

1. **RED - Write Failing Tests**
   ```typescript
   // tests/unit/backgroundRemoval.test.ts
   - detectEdges() returns edge map for test images
   - sampleBackgroundColor() identifies dominant corner color
   - floodFill() marks connected regions within tolerance
   - removeBackground() produces RGBA output with correct alpha
   ```

2. **GREEN - Implement Minimal Code**
   ```typescript
   // src/lib/backgroundRemoval.ts

   // Edge detection using Sobel operator
   function detectEdges(imageData: ImageData): Uint8Array

   // Sample background color from image corners
   function sampleBackgroundColor(imageData: ImageData): RGB

   // Flood-fill algorithm with tolerance threshold
   function floodFill(
     imageData: ImageData,
     startX: number,
     startY: number,
     targetColor: RGB,
     tolerance: number
   ): Set<number>

   // Main background removal function
   export function removeBackground(
     imageData: ImageData,
     sensitivity: number
   ): ImageData
   ```

3. **REFACTOR - Optimize**
   - Use queue-based flood-fill (avoid recursion)
   - Optimize color comparison (cache tolerance calculations)
   - Efficient pixel iteration (typed arrays)

**Deliverables:**
- `src/lib/backgroundRemoval.ts` - Core algorithm implementation
- `src/tests/unit/backgroundRemoval.test.ts` - Comprehensive unit tests
- Test coverage ≥90% for all functions

---

### Phase 2: Pipeline Integration (1.5 hours)

**Test-Driven Development Cycle:**

1. **RED - Write Failing Tests**
   ```typescript
   // tests/unit/imageProcessor.test.ts
   - Pipeline includes background removal after grayscale
   - Alpha channel preserved through histogram equalization
   - Alpha channel preserved through threshold
   - End-to-end pipeline produces RGBA with transparency
   ```

2. **GREEN - Implement Integration**
   ```typescript
   // src/lib/imageProcessor.ts (modify existing)

   class ImageProcessor {
     processImage(
       imageData: ImageData,
       options: {
         removeBackground?: boolean;
         bgSensitivity?: number;
         brightness: number;
         contrast: number;
         threshold: number;
       }
     ): ImageData {
       let processed = this.convertToGrayscale(imageData);

       if (options.removeBackground) {
         processed = removeBackground(processed, options.bgSensitivity || 128);
       }

       processed = this.applyHistogramEqualization(processed, true); // preserve alpha
       processed = this.applyThreshold(processed, options.threshold, true); // preserve alpha

       // ... brightness, contrast (preserve alpha)

       return processed;
     }
   }
   ```

3. **REFACTOR - Ensure Alpha Preservation**
   - Modify histogram equalization to skip transparent pixels
   - Modify threshold to preserve alpha channel
   - Verify all pipeline steps handle RGBA correctly

**Deliverables:**
- Modified `src/lib/imageProcessor.ts` with background removal step
- Updated tests for pipeline integration
- Alpha channel preservation verified

---

### Phase 3: UI Components (1.5 hours)

**Test-Driven Development Cycle:**

1. **RED - Write Failing Tests**
   ```typescript
   // tests/unit/BackgroundRemovalControl.test.tsx
   - Component renders toggle and slider
   - Toggle enables/disables background removal
   - Slider changes sensitivity value (0-255)
   - Debounced updates (100ms) trigger processing
   - Checkerboard pattern shown for transparency preview
   ```

2. **GREEN - Implement Component**
   ```typescript
   // src/components/BackgroundRemovalControl.tsx

   export function BackgroundRemovalControl({
     enabled,
     sensitivity,
     onToggle,
     onSensitivityChange
   }: Props) {
     return (
       <div className="bg-removal-control">
         <div className="flex items-center justify-between mb-2">
           <label htmlFor="bg-removal-toggle">
             Remove Background
           </label>
           <Switch
             id="bg-removal-toggle"
             checked={enabled}
             onCheckedChange={onToggle}
           />
         </div>

         {enabled && (
           <div className="mt-4">
             <label htmlFor="bg-sensitivity">
               Sensitivity: {sensitivity}
             </label>
             <Slider
               id="bg-sensitivity"
               min={0}
               max={255}
               step={1}
               value={[sensitivity]}
               onValueChange={([value]) => onSensitivityChange(value)}
             />
           </div>
         )}
       </div>
     );
   }
   ```

3. **REFACTOR - Polish UI/UX**
   - Add tooltip explaining sensitivity
   - Implement checkerboard background for transparency preview
   - Ensure WCAG 2.2 AAA accessibility (focus indicators, ARIA labels)
   - Match existing control styling

**Deliverables:**
- `src/components/BackgroundRemovalControl.tsx` - UI component
- `src/tests/unit/BackgroundRemovalControl.test.tsx` - Component tests
- Accessible, responsive component

---

### Phase 4: State & Hooks (1 hour)

**Test-Driven Development Cycle:**

1. **RED - Write Failing Tests**
   ```typescript
   // tests/unit/useBackgroundRemoval.test.ts
   - Hook manages enabled state
   - Hook manages sensitivity state (default 128)
   - Hook debounces sensitivity changes (100ms)
   - Hook triggers processing callback with correct params
   ```

2. **GREEN - Implement Hook**
   ```typescript
   // src/hooks/useBackgroundRemoval.ts

   export function useBackgroundRemoval(
     onProcess: (enabled: boolean, sensitivity: number) => void
   ) {
     const [enabled, setEnabled] = useState(false);
     const [sensitivity, setSensitivity] = useState(128);

     const debouncedProcess = useDebounce(() => {
       onProcess(enabled, sensitivity);
     }, 100);

     useEffect(() => {
       if (enabled) {
         debouncedProcess();
       }
     }, [enabled, sensitivity]);

     return {
       enabled,
       sensitivity,
       setEnabled,
       setSensitivity
     };
   }
   ```

3. **REFACTOR - State Management**
   - Integrate with global app state (Context or Zustand)
   - Add to settings state structure
   - Wire up to image processing pipeline

**Deliverables:**
- `src/hooks/useBackgroundRemoval.ts` - Custom hook
- `src/tests/unit/useBackgroundRemoval.test.ts` - Hook tests
- State integration complete

---

### Phase 5: E2E & Polish (30 minutes)

**Test-Driven Development Cycle:**

1. **RED - Write Failing E2E Tests**
   ```typescript
   // tests/e2e/backgroundRemoval.spec.ts

   test('user removes background from image', async ({ page }) => {
     // Upload test image with white background
     await page.goto('/');
     await page.setInputFiles('input[type="file"]', 'test-white-bg.jpg');

     // Enable background removal
     await page.click('[data-testid="bg-removal-toggle"]');

     // Adjust sensitivity
     await page.fill('[data-testid="bg-sensitivity-slider"]', '150');

     // Verify preview shows transparency (checkerboard visible)
     await expect(page.locator('[data-testid="preview-canvas"]')).toHaveAttribute('data-has-transparency', 'true');

     // Download and verify PNG has alpha channel
     const [download] = await Promise.all([
       page.waitForEvent('download'),
       page.click('[data-testid="download-button"]')
     ]);
     const path = await download.path();
     const hasAlpha = await verifyPNGHasAlpha(path);
     expect(hasAlpha).toBe(true);
   });
   ```

2. **GREEN - Implement & Verify**
   - Run E2E tests with Playwright
   - Fix any integration issues
   - Verify PNG export includes alpha channel

3. **REFACTOR - Final Polish**
   - Performance optimization (if needed)
   - Add JSDoc comments
   - Update component documentation
   - Verify WCAG 2.2 AAA compliance

**Deliverables:**
- `src/tests/e2e/backgroundRemoval.spec.ts` - E2E tests
- All tests passing (unit, integration, E2E)
- Performance targets met (<100ms slider response)
- Accessibility verified (Lighthouse score ≥95)

---

## Technical Decisions

### Algorithm Choice: Sobel + Flood-Fill

**Rationale:**
- Sobel edge detection: Fast, simple, sufficient for laser prep use case
- Flood-fill: Efficient for solid/near-solid backgrounds
- Queue-based implementation: Avoids recursion stack overflow

**Alternative Considered:** Canny edge detection (rejected: too complex for MVP)

### Sensitivity Parameter Mapping

- **Range**: 0-255 (matches threshold slider convention)
- **Default**: 128 (mid-range)
- **Meaning**: Color difference tolerance for flood-fill
  - 0 = Remove only exact color matches
  - 255 = Remove very different colors (aggressive)

### Alpha Channel Strategy

- **Format**: RGBA throughout pipeline (not separate mask)
- **Preservation**: All pipeline steps modified to skip/preserve alpha
- **Export**: PNG with alpha channel (automatic via Canvas API)

---

## Dependencies

### Existing Code (to be modified):
- `src/lib/imageProcessor.ts` - Add background removal to pipeline
- `src/hooks/useImageProcessing.ts` - Add background removal state
- Pipeline functions (histogram eq, threshold) - Preserve alpha

### New Components (to be created):
- `src/lib/backgroundRemoval.ts` - Core algorithm
- `src/components/BackgroundRemovalControl.tsx` - UI control
- `src/hooks/useBackgroundRemoval.ts` - State management hook

### External Dependencies (already available):
- shadcn/ui Slider component
- shadcn/ui Switch component
- Canvas API (getImageData, putImageData, toBlob)
- Existing useDebounce hook

---

## Testing Checklist

- [ ] Edge detection produces correct edge map
- [ ] Background color detection samples corners correctly
- [ ] Flood-fill algorithm handles tolerance correctly
- [ ] Background removal produces RGBA with correct alpha
- [ ] Pipeline integration preserves alpha through all steps
- [ ] UI toggle enables/disables feature
- [ ] Slider adjusts sensitivity (0-255)
- [ ] Debouncing works (100ms delay)
- [ ] Checkerboard pattern displays transparency
- [ ] PNG export includes alpha channel
- [ ] Performance: <100ms slider response
- [ ] Accessibility: WCAG 2.2 AAA compliant
- [ ] E2E workflow: upload → enable → adjust → download

---

## Performance Targets

- **Slider Response**: <100ms after drag stops
- **Processing Time**: <500ms for 2MB image
- **Memory**: <10MB additional (flood-fill visited array)
- **UI Responsiveness**: No blocking during processing

---

## Accessibility Requirements

- [ ] Toggle has ARIA label and role
- [ ] Slider has ARIA label, min, max, value
- [ ] Keyboard navigation works (Tab, Arrow keys)
- [ ] Focus indicators visible (≥3:1 contrast)
- [ ] Screen reader announces state changes
- [ ] Touch targets ≥44×44px

---

## Definition of Done

- [ ] All unit tests passing (≥90% coverage)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Background removal works as specified
- [ ] Pipeline integration complete
- [ ] UI component accessible and responsive
- [ ] Performance targets met
- [ ] Code reviewed (DRY, SOLID, FANG principles)
- [ ] Documentation complete (JSDoc comments)
- [ ] No console errors or warnings
- [ ] WCAG 2.2 AAA compliance verified

---

**Next Action**: Run `/build` to implement this plan using TDD approach.
