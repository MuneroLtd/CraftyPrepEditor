# Dependencies: Reset Button and State Management

**Task ID**: task-017
**Sprint**: Sprint 2 (Refinement Controls & UX)

---

## Direct Dependencies (COMPLETED)

### task-014: Brightness Slider Implementation
**Status**: ✅ COMMITTED
**Relationship**: Reset must restore brightness to default (0)
**Impact**: Reset handler needs to call `setBrightness(DEFAULT_BRIGHTNESS)`
**Files Affected**:
- `src/components/BrightnessSlider.tsx` - Slider component
- `src/App.tsx` - Brightness state management

---

### task-015: Contrast Slider Implementation
**Status**: ✅ COMMITTED
**Relationship**: Reset must restore contrast to default (0)
**Impact**: Reset handler needs to call `setContrast(DEFAULT_CONTRAST)`
**Files Affected**:
- `src/components/ContrastSlider.tsx` - Slider component
- `src/App.tsx` - Contrast state management

---

### task-016: Threshold Slider with Auto-Detection
**Status**: ✅ COMMITTED
**Relationship**: Reset must restore threshold to auto-calculated Otsu value
**Impact**: Reset handler needs to call `setThreshold(otsuThreshold)`
**Files Affected**:
- `src/components/ThresholdSlider.tsx` - Slider component
- `src/App.tsx` - Threshold state management
- `src/hooks/useImageProcessing.ts` - Otsu threshold calculation

---

### Background Removal Control
**Status**: ✅ COMMITTED
**Relationship**: Reset must disable background removal and reset sensitivity
**Impact**: Reset handler needs to call `setBackgroundRemovalEnabled(false)` and `setBackgroundRemovalSensitivity(128)`
**Files Affected**:
- `src/components/BackgroundRemovalControl.tsx` - Background removal toggle/slider
- `src/App.tsx` - Background removal state management

---

## Existing Components Used

### RefinementControls Component
**File**: `src/components/RefinementControls.tsx`
**Usage**: Container for sliders and reset button
**Modification Required**: Add `onReset` prop and `<ResetButton>` component
**Current Props**:
```typescript
interface RefinementControlsProps {
  brightness: number;
  contrast: number;
  threshold: number;
  backgroundRemovalEnabled?: boolean;
  backgroundRemovalSensitivity?: number;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onThresholdChange: (value: number) => void;
  onBackgroundRemovalToggle?: (enabled: boolean) => void;
  onBackgroundRemovalSensitivityChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}
```
**New Props to Add**:
```typescript
onReset?: () => void;
isResetting?: boolean;
```

---

### Button Component (shadcn/ui)
**File**: `src/components/ui/button.tsx`
**Usage**: Base button component for ResetButton
**Props Used**:
```typescript
variant: "secondary"  // Less prominent than primary
size: "lg"            // Large size
disabled: boolean
onClick: () => void
className: string
```
**No modification required** - Existing component sufficient

---

## Existing Hooks Used

### useImageProcessing Hook
**File**: `src/hooks/useImageProcessing.ts`
**Usage**: Access `runAutoPrepAsync` to re-run auto-prep pipeline
**Required Exports**:
```typescript
interface UseImageProcessingReturn {
  otsuThreshold: number | null;       // Auto-calculated threshold value
  runAutoPrepAsync: (               // Re-run auto-prep
    uploadedImage: HTMLImageElement,
    options?: {
      removeBackground?: boolean;
      bgSensitivity?: number;
    }
  ) => Promise<void>;
  isProcessing: boolean;             // Used for loading state
}
```
**No modification required** - Existing hook provides all needed functionality

---

### useFileUpload Hook
**File**: `src/hooks/useFileUpload.ts`
**Usage**: Access `uploadedImage` for reset re-processing
**Required Exports**:
```typescript
interface UseFileUploadReturn {
  uploadedImage: HTMLImageElement | null;  // Source image for re-processing
}
```
**No modification required** - Existing hook provides needed state

---

### useState (React)
**Usage**: State management for slider values
**Required State**:
```typescript
const [brightness, setBrightness] = useState(0);
const [contrast, setContrast] = useState(0);
const [threshold, setThreshold] = useState(128);
const [backgroundRemovalEnabled, setBackgroundRemovalEnabled] = useState(false);
const [backgroundRemovalSensitivity, setBackgroundRemovalSensitivity] = useState(128);
```
**No modification required** - Standard React hook

---

### useCallback (React)
**Usage**: Memoize reset handler to prevent unnecessary re-renders
**Implementation**:
```typescript
const handleReset = useCallback(() => {
  // Reset logic
}, [uploadedImage, otsuThreshold, runAutoPrepAsync]);
```
**No modification required** - Standard React hook

---

## New Files to Create

### ResetButton Component
**File**: `src/components/ResetButton.tsx`
**Purpose**: Reset button component with loading state and accessibility
**Dependencies**:
- `@/components/ui/button` - Base button component
- `lucide-react` - RotateCcw icon
- `@/lib/utils` - cn() utility for className merging

---

### ResetButton Tests
**File**: `src/tests/unit/components/ResetButton.test.tsx`
**Purpose**: Unit tests for ResetButton component
**Dependencies**:
- `@testing-library/react` - Rendering and assertions
- `vitest` - Test runner and mocking

---

### Reset Flow Integration Tests
**File**: `src/tests/integration/ResetFlow.integration.test.tsx`
**Purpose**: Integration tests for complete reset workflow
**Dependencies**:
- `@testing-library/react` - Rendering and user interactions
- `vitest` - Test runner
- All components involved in reset workflow

---

### Constants File (Optional but Recommended)
**File**: `src/lib/constants.ts`
**Purpose**: Centralized default values for sliders
**Content**:
```typescript
export const DEFAULT_BRIGHTNESS = 0;
export const DEFAULT_CONTRAST = 0;
export const DEFAULT_THRESHOLD = 128;
export const DEFAULT_BG_SENSITIVITY = 128;
```
**Dependencies**: None

---

## External Dependencies (Already in package.json)

### React
**Version**: 19.x
**Usage**: Component framework, hooks

### TypeScript
**Version**: 5.x
**Usage**: Type safety for all code

### lucide-react
**Version**: Latest
**Usage**: RotateCcw icon for reset button

### Tailwind CSS
**Version**: 4.x
**Usage**: Styling for reset button

### shadcn/ui
**Usage**: Base button component

### Vitest
**Usage**: Unit and integration testing

### @testing-library/react
**Usage**: Component testing utilities

---

## Dependency Graph

```
task-017 (Reset Button)
  ├─ REQUIRES: task-014 (Brightness Slider) ✅
  ├─ REQUIRES: task-015 (Contrast Slider) ✅
  ├─ REQUIRES: task-016 (Threshold Slider) ✅
  ├─ REQUIRES: Background Removal Control ✅
  │
  ├─ USES: RefinementControls (MODIFY)
  ├─ USES: Button (shadcn/ui) (NO CHANGE)
  ├─ USES: useImageProcessing hook (NO CHANGE)
  ├─ USES: useFileUpload hook (NO CHANGE)
  │
  └─ CREATES:
      ├─ ResetButton.tsx
      ├─ ResetButton.test.tsx
      ├─ ResetFlow.integration.test.tsx
      └─ constants.ts (optional)
```

---

## State Dependencies

### Current State (App.tsx)

```typescript
// Managed by useFileUpload
const { uploadedImage } = useFileUpload();

// Managed by useImageProcessing
const { otsuThreshold, isProcessing, runAutoPrepAsync } = useImageProcessing();

// Local state (App.tsx)
const [brightness, setBrightness] = useState(0);
const [contrast, setContrast] = useState(0);
const [threshold, setThreshold] = useState(128);
const [backgroundRemovalEnabled, setBackgroundRemovalEnabled] = useState(false);
const [backgroundRemovalSensitivity, setBackgroundRemovalSensitivity] = useState(128);
```

### Reset Handler Dependencies

The reset handler depends on:
1. **uploadedImage** - Source image to re-process
2. **otsuThreshold** - Auto-calculated threshold to restore
3. **runAutoPrepAsync** - Function to re-run auto-prep pipeline
4. **All setter functions** - To update state to defaults

**Dependency Chain**:
```
handleReset
  ├─ Reads: uploadedImage, otsuThreshold
  ├─ Calls: setBrightness, setContrast, setThreshold
  ├─ Calls: setBackgroundRemovalEnabled, setBackgroundRemovalSensitivity
  └─ Calls: runAutoPrepAsync(uploadedImage, options)
```

---

## Blocking Considerations

### No Blockers
- ✅ All required tasks committed
- ✅ All required hooks exist
- ✅ All required components exist
- ✅ All dependencies in package.json

### Potential Issues

**Issue 1: State Synchronization**
- **Risk**: Reset might trigger multiple re-renders
- **Mitigation**: Use `useCallback` with correct dependencies

**Issue 2: Race Conditions**
- **Risk**: User clicks reset multiple times
- **Mitigation**: Disable button during processing (use `isProcessing` state)

**Issue 3: Stale Closure**
- **Risk**: Reset handler captures old state values
- **Mitigation**: Include all dependencies in `useCallback` deps array

---

## Testing Dependencies

### Unit Tests
**Dependencies**:
- Vitest (test runner)
- @testing-library/react (rendering)
- @testing-library/user-event (interactions)
- vi.fn() for mock callbacks

### Integration Tests
**Dependencies**:
- All components in reset flow
- Mock image data
- waitFor utilities for async operations

### E2E Tests (Manual)
**Dependencies**:
- Browser (Chrome, Firefox, Safari)
- Screen reader (NVDA/VoiceOver)
- Real test images (2MB JPEG/PNG)

---

## Version Compatibility

### React 19
**Status**: ✅ Compatible
**Notes**: Uses only stable hooks (useState, useCallback, memo)

### TypeScript 5.x
**Status**: ✅ Compatible
**Notes**: Standard TypeScript interfaces, no advanced features

### Vite 7
**Status**: ✅ Compatible
**Notes**: No build tool-specific code

### Node 20 LTS
**Status**: ✅ Compatible
**Notes**: All code runs in browser, Node only for build

---

## Summary

**Total Dependencies**: 4 task dependencies (all completed)
**Blocking Status**: ✅ NO BLOCKERS
**Ready to Implement**: ✅ YES
**Risk Level**: 🟢 LOW (all dependencies satisfied, well-defined scope)
