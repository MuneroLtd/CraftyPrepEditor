# Research: Material Preset System

**Task ID**: task-020
**Created**: 2025-10-06

---

## Strategy Pattern Implementation

### Pattern Overview

**Strategy Pattern** is a behavioral design pattern that:
- Defines a family of algorithms (preset configurations)
- Encapsulates each one as an object
- Makes them interchangeable at runtime

**Benefits for Material Presets**:
- ✅ Easy to add new materials (just add new preset object)
- ✅ Decoupled from UI (presets are data, not components)
- ✅ Testable in isolation
- ✅ Type-safe with TypeScript
- ✅ No conditionals (no if/else chains for each material)

### Pattern Structure

```typescript
// Strategy Interface
interface MaterialPreset {
  name: string;
  label: string;
  description: string;
  adjustments: {
    brightness: number;
    contrast: number;
    threshold: number;
  };
}

// Concrete Strategies (each preset is a strategy)
const woodPreset: MaterialPreset = {
  name: 'wood',
  label: 'Wood',
  description: 'Optimized for pine, oak, walnut engraving',
  adjustments: { brightness: 0, contrast: 5, threshold: -10 }
};

// Strategy Collection
const PRESETS: Record<string, MaterialPreset> = {
  wood: woodPreset,
  leather: leatherPreset,
  // ...
};

// Context (uses strategies)
function applyPreset(presetName: string) {
  const strategy = PRESETS[presetName];
  applyAdjustments(strategy.adjustments);
}
```

**Why This Works**:
- Adding new material = add new object to PRESETS
- No code changes to applyPreset() function
- Each preset is self-contained and testable
- Type safety enforced by TypeScript

---

## Optimal Preset Values Research

### Wood Preset

**Materials**: Pine, oak, walnut, maple, cherry
**Laser Behavior**: Wood darkens when engraved, absorbs laser energy well
**Common Issues**: Over-burning in light woods, under-engraving in dark woods

**Optimal Settings**:
- **Brightness**: 0 (neutral - preserve detail)
- **Contrast**: +5 (slight boost to separate light/dark areas)
- **Threshold**: -10 (slightly darker to prevent over-burning)

**Rationale**:
- Slight contrast boost helps with grain texture
- Darker threshold prevents light woods from over-burning
- Neutral brightness preserves natural wood tone variations

---

### Leather Preset

**Materials**: Vegetable-tanned leather, tooling leather
**Laser Behavior**: Burns darker than wood, high contrast results
**Common Issues**: Too light = no visible mark, too dark = burnt smell/damage

**Optimal Settings**:
- **Brightness**: 0 (neutral)
- **Contrast**: +10 (higher boost for bold results)
- **Threshold**: +15 (lighter to prevent over-burning)

**Rationale**:
- Higher contrast creates bold, visible marks on leather
- Lighter threshold prevents damage to leather fibers
- Leather is more forgiving than wood (wider safe range)

---

### Acrylic Preset

**Materials**: Clear acrylic, colored acrylic, cast acrylic
**Laser Behavior**: Frosted/white when engraved, high visibility
**Common Issues**: Too much power = melting, too little = no frost

**Optimal Settings**:
- **Brightness**: 0 (neutral)
- **Contrast**: +15 (high contrast for clear frosting)
- **Threshold**: 0 (auto - acrylic responds well to Otsu)

**Rationale**:
- High contrast creates sharp frosted/clear boundaries
- Auto threshold works well (acrylic has predictable response)
- Neutral brightness preserves detail in colored acrylic

---

### Glass Preset

**Materials**: Glass etching, crystal, mirror
**Laser Behavior**: Fractures surface, creates white frosted effect
**Common Issues**: Uneven frosting, not enough contrast

**Optimal Settings**:
- **Brightness**: 0 (neutral)
- **Contrast**: +20 (very high for maximum frosting)
- **Threshold**: +20 (very light to maximize white areas)

**Rationale**:
- Very high contrast creates deep frosting on glass
- Very light threshold maximizes frosted white areas
- Glass requires highest power settings (reflected in presets)

---

### Metal Preset

**Materials**: Anodized aluminum, coated metals, powder-coated steel
**Laser Behavior**: Removes coating to reveal base metal
**Common Issues**: Inconsistent coating removal, too aggressive

**Optimal Settings**:
- **Brightness**: 0 (neutral)
- **Contrast**: 0 (neutral - coatings vary widely)
- **Threshold**: -5 (slightly darker to avoid over-removal)

**Rationale**:
- Neutral settings work best for varied coating thicknesses
- Slightly darker threshold prevents over-aggressive removal
- Metal is most unpredictable (conservative settings)

---

## Accessibility Research

### Dropdown Component Requirements (WCAG 2.2 AAA)

**Keyboard Navigation**:
- ✅ Tab: Focus dropdown
- ✅ Enter/Space: Open dropdown
- ✅ Arrow Up/Down: Navigate options
- ✅ Home/End: Jump to first/last option
- ✅ Escape: Close dropdown
- ✅ Type-ahead: Type first letter to jump to option

**Screen Reader Support**:
- ✅ `role="combobox"` on trigger
- ✅ `aria-label` describes purpose
- ✅ `aria-expanded` indicates open/closed state
- ✅ `aria-controls` links to options list
- ✅ `aria-activedescendant` indicates focused option
- ✅ Live region announces selection changes

**Color Contrast**:
- ✅ Normal text: ≥7:1 (AAA standard)
- ✅ Large text: ≥4.5:1 (AAA standard)
- ✅ UI components: ≥3:1
- ✅ Focus indicator: ≥3:1, minimum 2px outline

**Reference**: shadcn/ui Select component already implements all WCAG 2.2 requirements ✅

---

## State Management Patterns

### Auto-Switch to Custom Pattern

**Challenge**: Detect when user manually adjusts slider vs. when preset applies adjustment

**Solution**: Track preset selection state separately from slider values

```typescript
// Pattern: Explicit preset tracking
const [selectedPreset, setSelectedPreset] = useState('auto');

function handleSliderChange(value: number) {
  // If not already Custom, switch to Custom
  if (selectedPreset !== 'custom') {
    setSelectedPreset('custom');
    saveToLocalStorage({ /* current values */ });
  }

  // Update slider value
  setSliderValue(value);
}

function handlePresetChange(preset: string) {
  // Apply preset values
  const config = getPreset(preset);
  setBrightness(config.adjustments.brightness);
  setContrast(config.adjustments.contrast);
  setThreshold(config.adjustments.threshold);

  // Set preset state
  setSelectedPreset(preset);
}
```

**Why This Works**:
- Clear separation: preset state vs. slider state
- No race conditions (preset change completes before slider updates)
- User intent is explicit (preset select vs. manual adjust)

---

## localStorage Persistence

### Custom Preset Storage

**Storage Key**: `craftyprep-custom-preset`

**Data Structure**:
```typescript
interface CustomPresetData {
  brightness: number;
  contrast: number;
  threshold: number; // relative to Otsu, not absolute
}
```

**Example**:
```json
{
  "brightness": 20,
  "contrast": 15,
  "threshold": -5
}
```

**Storage Timing**:
- ✅ Save: When user manually adjusts slider
- ✅ Load: On component mount, if "custom" preset selected
- ✅ Clear: When reset button clicked

**Fallback**:
- If localStorage unavailable: Custom preset not persisted (graceful degradation)
- If invalid JSON: Use defaults
- If missing keys: Use defaults

---

## Performance Considerations

### Preset Application Performance

**Current Approach** (App.tsx):
```typescript
// Sliders update via debounced values (100ms)
const debouncedBrightness = useDebounce(brightness, 100);

useEffect(() => {
  applyAdjustments(debouncedBrightness, ...);
}, [debouncedBrightness]);
```

**Preset Application**:
- Preset changes should apply **immediately** (no debounce)
- Reason: User expects instant feedback when selecting preset
- Implementation: Call setter functions directly in handlePresetChange

**Performance Target**: <100ms for preset application ✅

---

## Codebase Integration Points

### Component Hierarchy

```
App.tsx
└── RefinementControls.tsx
    ├── MaterialPresetSelector.tsx (NEW)
    ├── BackgroundRemovalControl.tsx
    ├── BrightnessSlider.tsx
    ├── ContrastSlider.tsx
    ├── ThresholdSlider.tsx
    └── ResetButton.tsx
```

**Integration**:
- MaterialPresetSelector placed **first** in RefinementControls (above sliders)
- Reason: Presets set values that sliders display
- Visual flow: Choose preset → refine with sliders

---

### State Flow

```
User selects preset
  ↓
handlePresetChange(presetName)
  ↓
getPreset(presetName) → preset config
  ↓
setBrightness(config.adjustments.brightness)
setContrast(config.adjustments.contrast)
setThreshold(otsu + config.adjustments.threshold)
  ↓
Sliders update (controlled components)
  ↓
useEffect triggers applyAdjustments()
  ↓
Processed image updates
```

**Alternative Flow** (manual adjustment):
```
User drags brightness slider
  ↓
handleSliderChange('brightness', value)
  ↓
Check: selectedPreset !== 'custom'?
  ↓ YES
setSelectedPreset('custom')
saveToLocalStorage({ brightness: value, ... })
  ↓
setBrightness(value)
  ↓
Debounced update triggers applyAdjustments()
```

---

## Testing Strategy

### Unit Tests (Vitest)

**Preset Configurations**:
```typescript
test('each preset has valid adjustments', () => {
  Object.values(MATERIAL_PRESETS.presets).forEach(preset => {
    expect(preset.adjustments.brightness).toBeGreaterThanOrEqual(-100);
    expect(preset.adjustments.brightness).toBeLessThanOrEqual(100);
    expect(preset.adjustments.contrast).toBeGreaterThanOrEqual(-100);
    expect(preset.adjustments.contrast).toBeLessThanOrEqual(100);
  });
});
```

**MaterialPresetSelector Component**:
```typescript
test('renders all presets', () => {
  render(<MaterialPresetSelector value="auto" onChange={jest.fn()} />);

  fireEvent.click(screen.getByRole('combobox'));

  expect(screen.getByText('Wood')).toBeInTheDocument();
  expect(screen.getByText('Leather')).toBeInTheDocument();
  // ... all 7 presets
});
```

---

### Integration Tests

**Preset Application Flow**:
```typescript
test('selecting preset updates sliders', async () => {
  render(<App />);

  // Upload image, run auto-prep
  // ...

  // Select Wood preset
  const presetDropdown = screen.getByLabelText(/material preset/i);
  fireEvent.change(presetDropdown, { target: { value: 'wood' } });

  // Verify sliders updated
  expect(screen.getByLabelText(/brightness/i)).toHaveValue(0);
  expect(screen.getByLabelText(/contrast/i)).toHaveValue(5);
});
```

**Auto-Switch to Custom**:
```typescript
test('manual adjustment switches to custom', async () => {
  render(<App />);

  // Upload, auto-prep, select Wood
  // ...

  // Manually adjust brightness
  const brightnessSlider = screen.getByLabelText(/brightness/i);
  fireEvent.change(brightnessSlider, { target: { value: 20 } });

  // Verify switched to Custom
  expect(screen.getByRole('combobox')).toHaveValue('custom');
});
```

---

### E2E Tests (Playwright)

**Full User Flow**:
```typescript
test('material preset workflow', async ({ page }) => {
  // Navigate to app
  await page.goto('https://craftyprep.demosrv.uk');

  // Upload image
  await page.setInputFiles('input[type="file"]', 'test-image.jpg');

  // Click Auto-Prep
  await page.click('button:has-text("Auto-Prep")');
  await page.waitForSelector('text=Refinement Controls');

  // Select Wood preset
  await page.click('[role="combobox"]');
  await page.click('text=Wood');

  // Verify image updated (visual regression)
  await expect(page.locator('#processed-preview')).toHaveScreenshot('wood-preset.png');

  // Manually adjust brightness
  await page.fill('input[type="range"][aria-label*="brightness"]', '20');

  // Verify switched to Custom
  await expect(page.locator('[role="combobox"]')).toHaveValue('custom');
});
```

---

## Potential Issues & Mitigations

### Issue 1: Threshold Adjustments Relative to Otsu

**Problem**: Otsu value varies per image. How to apply consistent threshold adjustments?

**Solution**:
- Store threshold adjustments as **relative** values (-10, +15, etc.)
- Apply as: `finalThreshold = otsuValue + preset.adjustments.threshold`
- Example: Otsu=128, Wood preset (threshold: -10) → 118

**Implementation**:
```typescript
const handlePresetChange = (preset: MaterialPresetName) => {
  const config = getPreset(preset);
  setThreshold(otsuThreshold + config.adjustments.threshold);
};
```

---

### Issue 2: Custom Preset Persistence Across Images

**Problem**: Should custom preset persist when user uploads new image?

**Decision**: YES, persist across images
**Rationale**: User may engrave multiple items on same material
**Implementation**: Load custom preset from localStorage on mount (if exists)

---

### Issue 3: Race Conditions (Preset vs. Manual)

**Problem**: User selects preset while slider is still updating from previous change

**Solution**: Use React's batched state updates
- All setState calls in handlePresetChange batch together
- Sliders update atomically (no partial states)
- Debounced slider changes don't conflict (preset change is immediate)

---

## References

### Design Documentation
- `.autoflow/docs/FUNCTIONAL.md#feature-6-material-presets` - Preset specifications
- `.autoflow/docs/ARCHITECTURE.md#strategy-pattern` - Pattern guidance

### Code References
- `src/components/RefinementControls.tsx` - Container for sliders
- `src/components/ui/select.tsx` - shadcn Select component
- `src/App.tsx` - State management patterns

### External Resources
- [Strategy Pattern (Refactoring Guru)](https://refactoring.guru/design-patterns/strategy)
- [WCAG 2.2 Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [localStorage Best Practices (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Research Complete**: ✅
**Ready for Implementation**: ✅
