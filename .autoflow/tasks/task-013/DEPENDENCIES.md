# Dependencies: Background Removal Integration

**Task ID**: task-013

## Existing Code Dependencies

### Core Processing Layer

**src/lib/imageProcessor.ts** (to be modified)
- **Current State**: Implements grayscale, histogram equalization, Otsu threshold
- **Required Changes**:
  - Add `removeBackground()` method call in processing pipeline
  - Modify `applyHistogramEqualization()` to preserve alpha channel
  - Modify `applyThreshold()` to preserve alpha channel
  - Add background removal options to process parameters
- **Integration Point**: After grayscale, before histogram equalization

**src/lib/canvasManager.ts** (if exists, to be modified)
- **Current State**: Canvas creation and ImageData manipulation
- **Required Changes**: Ensure RGBA context support (not just RGB)

### State Management

**src/hooks/useImageProcessing.ts** (to be modified)
- **Current State**: Manages brightness, contrast, threshold state
- **Required Changes**:
  - Add `backgroundRemoval` state object:
    ```typescript
    backgroundRemoval: {
      enabled: boolean;
      sensitivity: number;
    }
    ```
  - Pass background removal options to processing pipeline

**src/contexts/AppContext.tsx** (if using Context API)
- **Current State**: Global app state
- **Required Changes**: Include background removal settings in state structure

### UI Components

**Existing Components to Integrate With:**
- Refinement Controls container (where sliders live)
- Preview component (needs checkerboard background for transparency)
- Auto-Prep button (may need to handle bg removal as part of pipeline)
- Reset button (should reset bg removal to default)

**shadcn/ui Components (already available):**
- `<Slider>` - For sensitivity control (0-255)
- `<Switch>` or `<Checkbox>` - For enable/disable toggle
- `<Label>` - For accessible labels
- `<Tooltip>` - Optional, for sensitivity explanation

### Utilities

**src/hooks/useDebounce.ts** (already exists)
- **Usage**: Debounce sensitivity slider changes (100ms)
- **No changes required**: Reuse existing implementation

**src/lib/utils/colorUtils.ts** (if exists)
- **Potential Usage**: Color distance calculations, RGB utilities
- **May need**: Euclidean distance function for color comparison

### Export Functionality

**src/components/ExportComponent.tsx** or similar
- **Current State**: PNG export using `canvas.toBlob()`
- **Required Verification**: Ensure PNG export preserves alpha channel
- **Expected Behavior**: `toBlob('image/png')` should automatically handle transparency

---

## New Files to Create

### Core Algorithm
1. **src/lib/backgroundRemoval.ts**
   - Main implementation file
   - Exports: `removeBackground()`, `detectEdges()`, `floodFill()`, `sampleBackgroundColor()`

2. **src/lib/algorithms/edgeDetection.ts** (optional, if separated)
   - Sobel operator implementation
   - Edge detection utilities

### UI Components
3. **src/components/BackgroundRemovalControl.tsx**
   - Toggle for enable/disable
   - Sensitivity slider (0-255)
   - Visual feedback (current value display)

### Custom Hooks
4. **src/hooks/useBackgroundRemoval.ts**
   - State management for background removal
   - Debounced processing trigger
   - Integration with app state

### Tests
5. **src/tests/unit/backgroundRemoval.test.ts**
   - Unit tests for core algorithm
   - Edge detection tests
   - Flood-fill tests
   - Color sampling tests

6. **src/tests/unit/BackgroundRemovalControl.test.tsx**
   - Component tests
   - User interaction tests
   - Accessibility tests

7. **src/tests/unit/useBackgroundRemoval.test.ts**
   - Hook tests
   - State management tests
   - Debouncing tests

8. **src/tests/e2e/backgroundRemoval.spec.ts**
   - End-to-end workflow tests
   - PNG alpha verification
   - Full integration tests

---

## External Dependencies (npm packages)

### Already Installed (verified in package.json)
- `react` - UI framework
- `typescript` - Type safety
- `vite` - Build tool
- `vitest` - Unit testing
- `@testing-library/react` - Component testing
- `playwright` - E2E testing
- `tailwindcss` - Styling
- shadcn/ui components (Button, Slider, Switch, etc.)

### No New External Dependencies Required
- All algorithms implemented from scratch (no image processing libraries)
- Canvas API is native browser feature
- No additional npm packages needed

---

## Browser APIs

### Canvas API (native)
- `getContext('2d')` - Get 2D rendering context
- `getImageData()` - Get pixel data (RGBA)
- `putImageData()` - Set pixel data
- `toBlob()` - Export to Blob (PNG with alpha)
- `createImageData()` - Create new ImageData buffer

### File API (native)
- Already used for image upload
- No additional file API features needed

### Typed Arrays (native)
- `Uint8Array` - For ImageData manipulation
- `Uint8ClampedArray` - Canvas ImageData format
- `Set<number>` - For flood-fill visited tracking

---

## Data Structures

### ImageData Format
```typescript
interface ImageData {
  data: Uint8ClampedArray; // [R,G,B,A, R,G,B,A, ...]
  width: number;
  height: number;
}
```

### RGB Color
```typescript
interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}
```

### Background Removal Options
```typescript
interface BackgroundRemovalOptions {
  enabled: boolean;
  sensitivity: number; // 0-255
}
```

### Processing Pipeline State
```typescript
interface ProcessingState {
  originalImage: HTMLImageElement | null;
  processedCanvas: HTMLCanvasElement | null;
  settings: {
    brightness: number;
    contrast: number;
    threshold: number;
    backgroundRemoval: BackgroundRemovalOptions; // NEW
  };
}
```

---

## Algorithm Dependencies

### Edge Detection (Sobel Operator)
**Inputs:**
- Grayscale ImageData

**Outputs:**
- Edge magnitude map (Uint8Array)

**Dependencies:**
- Convolution kernels (Sobel X and Y)
- Gradient magnitude calculation

### Flood-Fill Algorithm
**Inputs:**
- ImageData (grayscale)
- Start coordinates (x, y)
- Target color (RGB)
- Tolerance threshold (0-255)

**Outputs:**
- Set of pixel indices to make transparent

**Dependencies:**
- Queue data structure (for BFS traversal)
- Visited pixels tracking (Boolean array or Set)
- Color distance calculation (Euclidean)

### Background Color Sampling
**Inputs:**
- ImageData

**Outputs:**
- Dominant corner color (RGB)

**Dependencies:**
- Corner pixel sampling (4 corners)
- Mode calculation (most frequent color)

---

## Integration Checklist

### Before Implementation
- [ ] Verify `imageProcessor.ts` exists and review current pipeline
- [ ] Verify `useImageProcessing` hook exists and review state structure
- [ ] Verify shadcn/ui Slider and Switch components are installed
- [ ] Verify Canvas API RGBA support in target browsers
- [ ] Review existing test setup (Vitest, Playwright)

### During Implementation
- [ ] Modify ImageProcessor to accept background removal options
- [ ] Ensure histogram equalization skips transparent pixels (alpha = 0)
- [ ] Ensure threshold preserves alpha channel
- [ ] Add background removal state to app state management
- [ ] Integrate BackgroundRemovalControl into refinement controls UI
- [ ] Wire up useBackgroundRemoval hook to processing pipeline

### After Implementation
- [ ] Verify PNG export includes alpha channel
- [ ] Test integration with existing brightness/contrast/threshold controls
- [ ] Verify reset button includes background removal reset
- [ ] Test with various image types (JPEG, PNG, with/without alpha)

---

## Risk Assessment

### Low Risk
- Existing Canvas API usage (already familiar)
- shadcn/ui components (already integrated)
- Debouncing (already implemented)

### Medium Risk
- Pipeline modification (ensure no breaking changes to existing features)
- Alpha channel preservation (requires careful testing through all steps)
- Performance (flood-fill can be slow on large images)

### Mitigation Strategies
- **Pipeline Changes**: Comprehensive integration tests before and after
- **Alpha Preservation**: Unit test each pipeline step independently
- **Performance**: Queue-based flood-fill, debouncing, potential Web Worker for large images

---

## Definition of Dependencies Met

- [ ] All existing code dependencies identified
- [ ] All new files documented
- [ ] No missing external packages
- [ ] Browser API compatibility verified
- [ ] Data structure contracts defined
- [ ] Integration points documented
- [ ] Risk assessment complete
