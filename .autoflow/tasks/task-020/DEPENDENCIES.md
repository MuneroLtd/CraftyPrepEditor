# Dependencies: Material Preset System

**Task ID**: task-020
**Last Updated**: 2025-10-06

---

## Prerequisites (MUST be complete)

### Sprint 2 Complete ✅

All refinement slider components must be functional:

1. **BrightnessSlider** (`src/components/BrightnessSlider.tsx`)
   - Status: ✅ COMPLETE
   - Provides: Brightness adjustment (-100 to +100)
   - Required for: Preset brightness adjustments

2. **ContrastSlider** (`src/components/ContrastSlider.tsx`)
   - Status: ✅ COMPLETE
   - Provides: Contrast adjustment (-100 to +100)
   - Required for: Preset contrast adjustments

3. **ThresholdSlider** (`src/components/ThresholdSlider.tsx`)
   - Status: ✅ COMPLETE
   - Provides: Threshold adjustment (0 to 255)
   - Required for: Preset threshold adjustments

4. **RefinementControls** (`src/components/RefinementControls.tsx`)
   - Status: ✅ COMPLETE
   - Provides: Container for all sliders
   - Required for: Preset selector placement

5. **App.tsx State Management**
   - Status: ✅ COMPLETE
   - Provides: brightness, contrast, threshold state
   - Provides: setBrightness, setContrast, setThreshold handlers
   - Required for: Preset application logic

6. **Auto-Prep Algorithm**
   - Status: ✅ COMPLETE
   - Provides: Otsu threshold calculation
   - Required for: Relative threshold adjustments

---

## External Dependencies

### shadcn/ui Components

**Select Component** (`src/components/ui/select.tsx`)
- Status: ✅ Already installed (used in project)
- Provides: Dropdown UI for preset selection
- Version: Latest (from shadcn/ui)
- Accessibility: WCAG 2.2 compliant
- Keyboard navigation: Built-in

**No additional installation required** - Select component already in project.

---

## Internal Dependencies

### Types

**Existing Types** (no changes needed):
- `src/lib/constants.ts` - DEFAULT_BRIGHTNESS, DEFAULT_CONTRAST
- TypeScript built-ins

**New Types** (to be created):
- `src/lib/types/presets.ts` - MaterialPreset, PresetConfiguration, MaterialPresetName

---

### Utilities

**Existing Utilities** (no changes needed):
- `src/lib/utils.ts` - cn() for className merging
- `src/hooks/useImageProcessing.ts` - Otsu threshold calculation

**New Utilities** (to be created):
- `src/lib/presets/presetConfigurations.ts` - Preset data and getters

---

## State Dependencies

### App.tsx State

**Required State** (already exists):
```typescript
const [brightness, setBrightness] = useState(DEFAULT_BRIGHTNESS);
const [contrast, setContrast] = useState(DEFAULT_CONTRAST);
const [threshold, setThreshold] = useState(128);
const { otsuThreshold } = useImageProcessing();
```

**New State** (to be added):
```typescript
const [selectedPreset, setSelectedPreset] = useState<MaterialPresetName>('auto');
```

---

### localStorage

**Required Browser API**:
- `localStorage.setItem()` - Save custom preset
- `localStorage.getItem()` - Load custom preset
- `localStorage.removeItem()` - Clear custom preset

**Availability**: ✅ All modern browsers
**Fallback**: Graceful degradation (custom preset not persisted)

---

## Component Dependencies

### RefinementControls.tsx

**Changes Required**:
- Add `selectedPreset` prop
- Add `onPresetChange` handler prop
- Render MaterialPresetSelector above sliders

**Impact**: LOW (additive change, no breaking changes)

---

### App.tsx

**Changes Required**:
- Add preset state
- Add preset change handler
- Modify slider change handlers (auto-switch to Custom)
- Update reset handler (clear custom preset)

**Impact**: MEDIUM (logic changes, but no breaking changes to existing flow)

---

## Data Dependencies

### Preset Values (from FUNCTIONAL.md)

**Source**: `.autoflow/docs/FUNCTIONAL.md#feature-6-material-presets`

**Values Validated**:
- ✅ Wood: brightness=0, contrast=+5, threshold=-10
- ✅ Leather: brightness=0, contrast=+10, threshold=+15
- ✅ Acrylic: brightness=0, contrast=+15, threshold=0
- ✅ Glass: brightness=0, contrast=+20, threshold=+20
- ✅ Metal: brightness=0, contrast=0, threshold=-5

**No external API** - all values are constants.

---

## Testing Dependencies

### Unit Testing

**Already Available**:
- ✅ Vitest (configured)
- ✅ @testing-library/react (installed)
- ✅ @testing-library/jest-dom (installed)

**No additional packages needed**.

---

### Integration Testing

**Already Available**:
- ✅ Vitest (configured)
- ✅ React Testing Library (installed)

**No additional packages needed**.

---

### E2E Testing

**Already Available**:
- ✅ Playwright (configured)
- ✅ Test environment: https://craftyprep.demosrv.uk

**No additional packages needed**.

---

## Deployment Dependencies

### Build Process

**No changes required**:
- ✅ Vite build configuration (unchanged)
- ✅ TypeScript compilation (unchanged)
- ✅ Docker build (unchanged)

---

### Environment

**No environment variables needed**:
- All preset values are constants
- localStorage available in all target browsers

---

## Risk Assessment

### Dependency Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Sprint 2 incomplete | LOW | HIGH | ✅ Sprint 2 verified complete |
| localStorage unavailable | LOW | LOW | Graceful degradation (custom preset not saved) |
| Otsu threshold not calculated | LOW | HIGH | ✅ Already working in Sprint 2 |
| Select component missing | LOW | MEDIUM | ✅ Component exists in project |

**Overall Risk**: LOW

---

## Dependency Graph

```
task-020 (Material Presets)
├── Sprint 2 Complete ✅
│   ├── BrightnessSlider ✅
│   ├── ContrastSlider ✅
│   ├── ThresholdSlider ✅
│   ├── RefinementControls ✅
│   └── App.tsx state management ✅
├── shadcn/ui Select ✅
├── Otsu threshold calculation ✅
└── localStorage API ✅
```

**All dependencies satisfied** ✅

---

## Blocking Issues

**None** - All dependencies are satisfied.

---

## Next Steps

1. ✅ Verify Sprint 2 complete (DONE)
2. ✅ Confirm shadcn Select available (DONE)
3. ➡️ Begin Phase 1: Types & Interfaces
4. Continue with TASK_PLAN.md phases

---

**Status**: READY TO BUILD
**Blockers**: NONE
