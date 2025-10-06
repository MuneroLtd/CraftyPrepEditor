# Task Plan: Material Preset System

**Task ID**: task-020
**Created**: 2025-10-06
**Status**: PLANNED

---

## Overview

Implement a material-specific preset system using the Strategy Pattern that provides optimized brightness/contrast/threshold configurations for common laser engraving materials (Wood, Leather, Acrylic, Glass, Metal).

**Design Pattern**: Strategy Pattern
- Each preset is a configuration object (strategy)
- Easily extensible for new materials
- Decoupled from UI components

**Key Requirements**:
- 5 material presets with optimized values
- Dropdown selector UI component
- Auto-switch to "Custom" on manual adjustment
- Custom preset persistence in localStorage
- WCAG 2.2 AAA accessibility compliance

---

## 5-Phase TDD Implementation Plan

### Phase 1: Types & Interfaces (TDD Foundation)

**Objective**: Define type-safe preset configurations and interfaces

**Test First**:
- `src/tests/unit/lib/presets.test.ts`
  - Test preset type structure
  - Test preset value ranges
  - Test preset completeness (all required fields)

**Implementation**:
- `src/lib/types/presets.ts`
  ```typescript
  export type MaterialPresetName =
    | 'auto'
    | 'wood'
    | 'leather'
    | 'acrylic'
    | 'glass'
    | 'metal'
    | 'custom';

  export interface MaterialPreset {
    name: MaterialPresetName;
    label: string;
    description: string;
    adjustments: {
      brightness: number;  // -100 to +100
      contrast: number;    // -100 to +100
      threshold: number;   // relative adjustment to Otsu (-50 to +50)
    };
  }

  export interface PresetConfiguration {
    presets: Record<MaterialPresetName, MaterialPreset>;
    default: MaterialPresetName;
  }
  ```

**Acceptance Criteria**:
- ✅ TypeScript types compile without errors
- ✅ All preset names are valid literals
- ✅ Adjustment ranges are enforced
- ✅ Type tests pass

---

### Phase 2: Preset Configurations (Strategy Pattern)

**Objective**: Implement preset configurations as reusable strategies

**Test First**:
- `src/tests/unit/lib/presetConfigurations.test.ts`
  - Test each preset has required fields
  - Test adjustment values are within valid ranges
  - Test preset retrieval by name
  - Test default preset is 'auto'

**Implementation**:
- `src/lib/presets/presetConfigurations.ts`
  ```typescript
  import { MaterialPreset, PresetConfiguration } from '@/lib/types/presets';

  export const MATERIAL_PRESETS: PresetConfiguration = {
    default: 'auto',
    presets: {
      auto: {
        name: 'auto',
        label: 'Auto',
        description: 'Default auto-prep settings',
        adjustments: { brightness: 0, contrast: 0, threshold: 0 }
      },
      wood: {
        name: 'wood',
        label: 'Wood',
        description: 'Optimized for pine, oak, walnut engraving',
        adjustments: { brightness: 0, contrast: 5, threshold: -10 }
      },
      leather: {
        name: 'leather',
        label: 'Leather',
        description: 'Optimized for leather burning/engraving',
        adjustments: { brightness: 0, contrast: 10, threshold: 15 }
      },
      acrylic: {
        name: 'acrylic',
        label: 'Acrylic',
        description: 'Optimized for clear or colored acrylic',
        adjustments: { brightness: 0, contrast: 15, threshold: 0 }
      },
      glass: {
        name: 'glass',
        label: 'Glass',
        description: 'Optimized for glass etching',
        adjustments: { brightness: 0, contrast: 20, threshold: 20 }
      },
      metal: {
        name: 'metal',
        label: 'Metal',
        description: 'Optimized for anodized aluminum, coated metals',
        adjustments: { brightness: 0, contrast: 0, threshold: -5 }
      },
      custom: {
        name: 'custom',
        label: 'Custom',
        description: 'User-defined settings',
        adjustments: { brightness: 0, contrast: 0, threshold: 0 }
      }
    }
  };

  export function getPreset(name: MaterialPresetName): MaterialPreset {
    return MATERIAL_PRESETS.presets[name];
  }

  export function getDefaultPreset(): MaterialPreset {
    return MATERIAL_PRESETS.presets[MATERIAL_PRESETS.default];
  }
  ```

**Acceptance Criteria**:
- ✅ All 7 presets defined (auto + 5 materials + custom)
- ✅ Preset values match FUNCTIONAL.md specification
- ✅ Getter functions return correct presets
- ✅ All tests pass

---

### Phase 3: MaterialPresetSelector Component

**Objective**: Create accessible dropdown component for preset selection

**Test First**:
- `src/tests/unit/components/MaterialPresetSelector.test.tsx`
  - Test component renders with all presets
  - Test preset selection triggers onChange callback
  - Test disabled state
  - Test keyboard navigation (Tab, Enter, Arrows, Escape)
  - Test ARIA attributes (role, labels, descriptions)
  - Test visual feedback for selected preset

**Implementation**:
- `src/components/MaterialPresetSelector.tsx`
  ```typescript
  import { memo } from 'react';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { MATERIAL_PRESETS } from '@/lib/presets/presetConfigurations';
  import type { MaterialPresetName } from '@/lib/types/presets';

  export interface MaterialPresetSelectorProps {
    value: MaterialPresetName;
    onChange: (preset: MaterialPresetName) => void;
    disabled?: boolean;
    className?: string;
  }

  export const MaterialPresetSelector = memo(function MaterialPresetSelector({
    value,
    onChange,
    disabled = false,
    className = '',
  }: MaterialPresetSelectorProps): React.JSX.Element {
    const presetOrder: MaterialPresetName[] = [
      'auto', 'wood', 'leather', 'acrylic', 'glass', 'metal', 'custom'
    ];

    return (
      <div className={className}>
        <label
          htmlFor="material-preset"
          className="block text-sm font-medium mb-2"
        >
          Material Preset
        </label>
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger
            id="material-preset"
            className="w-full"
            aria-label="Select material preset"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {presetOrder.map((presetName) => {
              const preset = MATERIAL_PRESETS.presets[presetName];
              return (
                <SelectItem
                  key={presetName}
                  value={presetName}
                  aria-description={preset.description}
                >
                  {preset.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-600 mt-1">
          {MATERIAL_PRESETS.presets[value].description}
        </p>
      </div>
    );
  });
  ```

**Acceptance Criteria**:
- ✅ Component renders all 7 presets
- ✅ Selecting preset triggers onChange with correct value
- ✅ Disabled state prevents interaction
- ✅ Keyboard accessible (Tab, Enter, Arrows work)
- ✅ Screen reader announces preset name and description
- ✅ Visual feedback shows selected preset
- ✅ All unit tests pass

---

### Phase 4: Integration with State Management

**Objective**: Integrate preset selector with App state and auto-switch to Custom

**Test First**:
- `src/tests/integration/MaterialPresetFlow.integration.test.tsx`
  - Test preset selection applies correct adjustments
  - Test manual slider change switches to Custom
  - Test Custom preset persists in localStorage
  - Test preset change updates all sliders
  - Test reset button resets to Auto preset

**Implementation**:

1. **Update App.tsx**:
   ```typescript
   // Add preset state
   const [selectedPreset, setSelectedPreset] = useState<MaterialPresetName>('auto');

   // Handle preset change
   const handlePresetChange = useCallback((preset: MaterialPresetName) => {
     const presetConfig = getPreset(preset);

     if (preset === 'custom') {
       // Load from localStorage if exists
       const saved = localStorage.getItem('craftyprep-custom-preset');
       if (saved) {
         const customValues = JSON.parse(saved);
         setBrightness(customValues.brightness);
         setContrast(customValues.contrast);
         setThreshold(otsuThreshold + customValues.threshold);
       }
     } else {
       // Apply preset adjustments
       setBrightness(presetConfig.adjustments.brightness);
       setContrast(presetConfig.adjustments.contrast);
       setThreshold(otsuThreshold + presetConfig.adjustments.threshold);
     }

     setSelectedPreset(preset);
   }, [otsuThreshold]);

   // Auto-switch to Custom on manual slider change
   const handleSliderChange = useCallback((
     type: 'brightness' | 'contrast' | 'threshold',
     value: number
   ) => {
     if (selectedPreset !== 'custom') {
       setSelectedPreset('custom');

       // Save custom values to localStorage
       const customValues = {
         brightness: type === 'brightness' ? value : brightness,
         contrast: type === 'contrast' ? value : contrast,
         threshold: type === 'threshold' ? value - otsuThreshold : threshold - otsuThreshold,
       };
       localStorage.setItem('craftyprep-custom-preset', JSON.stringify(customValues));
     }

     // Update slider value
     if (type === 'brightness') setBrightness(value);
     if (type === 'contrast') setContrast(value);
     if (type === 'threshold') setThreshold(value);
   }, [selectedPreset, brightness, contrast, threshold, otsuThreshold]);
   ```

2. **Update RefinementControls.tsx**:
   ```typescript
   // Add preset selector props
   selectedPreset?: MaterialPresetName;
   onPresetChange?: (preset: MaterialPresetName) => void;

   // Add MaterialPresetSelector above sliders
   {onPresetChange && (
     <MaterialPresetSelector
       value={selectedPreset}
       onChange={onPresetChange}
       disabled={disabled}
     />
   )}
   ```

3. **Update Reset Handler**:
   ```typescript
   const handleReset = useCallback(() => {
     setSelectedPreset('auto');
     setBrightness(DEFAULT_BRIGHTNESS);
     setContrast(DEFAULT_CONTRAST);
     setThreshold(otsuThreshold);
     localStorage.removeItem('craftyprep-custom-preset');
     runAutoPrepAsync(uploadedImage, { ... });
   }, [uploadedImage, otsuThreshold, runAutoPrepAsync]);
   ```

**Acceptance Criteria**:
- ✅ Preset selector appears above sliders
- ✅ Selecting preset applies correct adjustments
- ✅ Manual slider change switches to Custom
- ✅ Custom preset persists across page reloads
- ✅ Reset button clears custom preset and returns to Auto
- ✅ Integration tests pass

---

### Phase 5: Accessibility & Polish

**Objective**: Ensure WCAG 2.2 AAA compliance and polish UX

**Test First**:
- `src/tests/e2e/materialPresets.spec.ts`
  - Test keyboard navigation through presets
  - Test screen reader announcements
  - Test focus management
  - Test color contrast (≥7:1 for normal text)
  - Test visual feedback for state changes
  - Test with assistive technologies

**Implementation**:

1. **Accessibility Enhancements**:
   - ARIA live region for preset changes
   - Focus management on preset selection
   - Clear visual indicators
   - High-contrast mode support

2. **Visual Polish**:
   - Smooth transitions for value changes
   - Loading states during preset application
   - Tooltips for preset descriptions
   - Responsive design (mobile-first)

3. **E2E Tests** (`src/tests/e2e/materialPresets.spec.ts`):
   ```typescript
   test('should apply Wood preset and show correct adjustments', async ({ page }) => {
     // Upload image
     // Click Auto-Prep
     // Select Wood preset from dropdown
     // Verify brightness, contrast, threshold sliders show correct values
     // Verify processed image updates
   });

   test('should switch to Custom on manual slider change', async ({ page }) => {
     // Upload image, auto-prep, select Wood preset
     // Manually adjust brightness slider
     // Verify preset dropdown shows "Custom"
     // Reload page
     // Verify Custom preset persists with saved values
   });

   test('should be keyboard accessible', async ({ page }) => {
     // Tab to preset dropdown
     // Press Enter to open
     // Use Arrow keys to navigate
     // Press Enter to select
     // Verify focus management
   });
   ```

**Acceptance Criteria**:
- ✅ Keyboard navigation fully functional
- ✅ Screen reader announces all interactions
- ✅ Color contrast ≥7:1 (AAA)
- ✅ Focus indicators visible (≥3:1 contrast)
- ✅ Visual feedback for all state changes
- ✅ Responsive on mobile/tablet/desktop
- ✅ E2E tests pass
- ✅ Accessibility audit passes (Lighthouse ≥95)

---

## Testing Strategy

### Unit Tests (Vitest)
- `src/tests/unit/lib/presets.test.ts` - Type definitions
- `src/tests/unit/lib/presetConfigurations.test.ts` - Preset data
- `src/tests/unit/components/MaterialPresetSelector.test.tsx` - Component behavior

### Integration Tests (Vitest + React Testing Library)
- `src/tests/integration/MaterialPresetFlow.integration.test.tsx` - End-to-end preset flow
- `src/tests/integration/CustomPresetPersistence.integration.test.tsx` - localStorage

### E2E Tests (Playwright)
- `src/tests/e2e/materialPresets.spec.ts` - Browser automation
- Keyboard navigation
- Screen reader compatibility
- Visual regression

**Coverage Target**: ≥80% (lines, branches, functions)

---

## Dependencies

**Sprint 2 Complete** (all sliders functional):
- ✅ BrightnessSlider component
- ✅ ContrastSlider component
- ✅ ThresholdSlider component
- ✅ RefinementControls container
- ✅ App.tsx state management

**New Dependencies**:
- None (uses existing shadcn/ui Select component)

---

## Implementation Checklist

### Phase 1: Types & Interfaces
- [ ] Create `src/lib/types/presets.ts`
- [ ] Write unit tests for types
- [ ] Verify TypeScript compilation

### Phase 2: Preset Configurations
- [ ] Create `src/lib/presets/presetConfigurations.ts`
- [ ] Define all 7 presets with correct values
- [ ] Write unit tests for configurations
- [ ] Verify all tests pass

### Phase 3: MaterialPresetSelector Component
- [ ] Create `src/components/MaterialPresetSelector.tsx`
- [ ] Write unit tests for component
- [ ] Test keyboard navigation
- [ ] Test ARIA attributes
- [ ] Verify accessibility

### Phase 4: Integration
- [ ] Update App.tsx with preset state
- [ ] Implement handlePresetChange
- [ ] Implement auto-switch to Custom
- [ ] Implement localStorage persistence
- [ ] Update RefinementControls
- [ ] Update handleReset
- [ ] Write integration tests
- [ ] Verify all integration tests pass

### Phase 5: Accessibility & Polish
- [ ] Add ARIA live regions
- [ ] Implement focus management
- [ ] Add visual feedback
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Write E2E tests
- [ ] Run Lighthouse audit (target ≥95)
- [ ] Verify WCAG 2.2 AAA compliance

---

## Success Metrics

- ✅ All 7 presets selectable
- ✅ Preset values match FUNCTIONAL.md specification
- ✅ Manual adjustment switches to Custom automatically
- ✅ Custom preset persists across sessions
- ✅ Unit test coverage ≥80%
- ✅ Integration tests pass
- ✅ E2E tests pass
- ✅ Lighthouse accessibility score ≥95
- ✅ Code review passed
- ✅ No TypeScript errors
- ✅ No linting errors

---

## Estimated Effort

**Total**: 6 hours

- Phase 1: 0.5 hours (types)
- Phase 2: 1 hour (configurations + tests)
- Phase 3: 2 hours (component + tests)
- Phase 4: 1.5 hours (integration + tests)
- Phase 5: 1 hour (accessibility + E2E tests)

---

**Status**: PLANNED
**Next Step**: Run `/build` to begin implementation
