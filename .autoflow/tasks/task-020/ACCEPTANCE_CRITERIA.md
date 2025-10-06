# Acceptance Criteria: Material Preset System

**Task ID**: task-020
**Feature**: Material-specific preset configurations

---

## Functional Requirements

### FR6.1: Preset Selection ✅

**Criteria**:
- [ ] Preset dropdown visible above refinement sliders
- [ ] Dropdown labeled "Material Preset" with proper HTML label
- [ ] 7 presets available: Auto, Wood, Leather, Acrylic, Glass, Metal, Custom
- [ ] Selecting preset immediately applies optimized settings
- [ ] Selected preset visually indicated in dropdown

**Test**:
```typescript
// User can see and select all presets
test('displays all 7 presets', () => {
  render(<MaterialPresetSelector value="auto" onChange={jest.fn()} />);
  fireEvent.click(screen.getByRole('combobox'));
  expect(screen.getByText('Auto')).toBeInTheDocument();
  expect(screen.getByText('Wood')).toBeInTheDocument();
  expect(screen.getByText('Leather')).toBeInTheDocument();
  expect(screen.getByText('Acrylic')).toBeInTheDocument();
  expect(screen.getByText('Glass')).toBeInTheDocument();
  expect(screen.getByText('Metal')).toBeInTheDocument();
  expect(screen.getByText('Custom')).toBeInTheDocument();
});
```

---

### FR6.2: Preset Configurations ✅

**Criteria**:

**Wood Preset**:
- [ ] Brightness: 0
- [ ] Contrast: +5
- [ ] Threshold: -10 (relative to Otsu)

**Leather Preset**:
- [ ] Brightness: 0
- [ ] Contrast: +10
- [ ] Threshold: +15 (relative to Otsu)

**Acrylic Preset**:
- [ ] Brightness: 0
- [ ] Contrast: +15
- [ ] Threshold: 0 (auto)

**Glass Preset**:
- [ ] Brightness: 0
- [ ] Contrast: +20
- [ ] Threshold: +20 (relative to Otsu)

**Metal Preset**:
- [ ] Brightness: 0
- [ ] Contrast: 0
- [ ] Threshold: -5 (relative to Otsu)

**Auto Preset**:
- [ ] Brightness: 0
- [ ] Contrast: 0
- [ ] Threshold: 0 (Otsu baseline)

**Test**:
```typescript
// Each preset has correct values
test('Wood preset has correct adjustments', () => {
  const wood = getPreset('wood');
  expect(wood.adjustments.brightness).toBe(0);
  expect(wood.adjustments.contrast).toBe(5);
  expect(wood.adjustments.threshold).toBe(-10);
});
```

---

### FR6.3: Custom Preset ✅

**Criteria**:
- [ ] Manual slider adjustment automatically switches preset to "Custom"
- [ ] Custom preset values saved to localStorage
- [ ] Custom preset persists across page reloads
- [ ] Reset button clears custom preset
- [ ] Custom preset shows user's last manual adjustments

**Test**:
```typescript
// Custom preset persists
test('saves custom preset to localStorage', async () => {
  render(<App />);

  // Upload image and auto-prep
  // Select Wood preset
  // Manually adjust brightness slider

  expect(screen.getByRole('combobox')).toHaveValue('custom');
  expect(localStorage.getItem('craftyprep-custom-preset')).toBeTruthy();

  // Reload page
  rerender(<App />);

  // Custom values should be restored
  const saved = JSON.parse(localStorage.getItem('craftyprep-custom-preset'));
  expect(saved.brightness).toBeDefined();
});
```

---

## Business Rules

### BR6.1: Preset Overrides Slider Values ✅

**Criteria**:
- [ ] Selecting preset updates all three sliders (brightness, contrast, threshold)
- [ ] Previous slider values are discarded
- [ ] Processed image updates to reflect preset adjustments

**Test**:
```typescript
test('preset selection updates all sliders', async ({ page }) => {
  // Upload image, run auto-prep
  // Set brightness=50, contrast=30, threshold=200 manually
  // Select Wood preset

  expect(brightnessSlider.value).toBe(0);    // Wood brightness
  expect(contrastSlider.value).toBe(5);      // Wood contrast
  expect(thresholdSlider.value).toBe(otsu - 10); // Wood threshold
});
```

---

### BR6.2: Manual Adjustment Switches to Custom ✅

**Criteria**:
- [ ] Adjusting brightness slider switches to Custom
- [ ] Adjusting contrast slider switches to Custom
- [ ] Adjusting threshold slider switches to Custom
- [ ] Switching happens automatically (no user action required)
- [ ] Custom preset shows immediately in dropdown

**Test**:
```typescript
test('manual slider change switches to Custom', () => {
  render(<App />);

  // Upload, auto-prep, select Wood preset
  expect(screen.getByRole('combobox')).toHaveValue('wood');

  // Manually adjust brightness
  const brightnessSlider = screen.getByLabelText(/brightness/i);
  fireEvent.change(brightnessSlider, { target: { value: 20 } });

  // Preset should switch to Custom
  expect(screen.getByRole('combobox')).toHaveValue('custom');
});
```

---

### BR6.3: Presets Apply Relative to Auto-Prep Baseline ✅

**Criteria**:
- [ ] Preset threshold adjustments are relative to Otsu value
- [ ] Otsu value calculated from auto-prep result
- [ ] Preset adjustments added to Otsu baseline
- [ ] Example: If Otsu=128, Wood preset (threshold: -10) = 118

**Test**:
```typescript
test('threshold presets are relative to Otsu', () => {
  const otsuValue = 128;
  const woodPreset = getPreset('wood');

  const finalThreshold = otsuValue + woodPreset.adjustments.threshold;
  expect(finalThreshold).toBe(118); // 128 - 10
});
```

---

## User Interface Requirements

### UI: Preset Selector Placement ✅

**Criteria**:
- [ ] Dropdown appears above refinement sliders
- [ ] Dropdown width matches slider width
- [ ] Label "Material Preset" visible above dropdown
- [ ] Description text shows below dropdown (explains selected preset)

**Visual Structure**:
```
Material Preset
[Dropdown: Wood ▼]
Optimized for pine, oak, walnut engraving

Brightness
[Slider: 0]

Contrast
[Slider: 5]
...
```

---

### UI: Visual Feedback ✅

**Criteria**:
- [ ] Selected preset highlighted in dropdown
- [ ] Description updates when preset changes
- [ ] Smooth transition when sliders update
- [ ] No jarring jumps or flickers

---

## Accessibility Requirements (WCAG 2.2 AAA)

### A11y: Keyboard Navigation ✅

**Criteria**:
- [ ] Tab key moves focus to preset dropdown
- [ ] Enter/Space opens dropdown menu
- [ ] Arrow keys navigate preset options
- [ ] Enter/Space selects highlighted preset
- [ ] Escape closes dropdown without selection
- [ ] Focus visible at all times (≥3:1 contrast)

**Test**:
```typescript
test('keyboard navigation works', async ({ page }) => {
  await page.keyboard.press('Tab'); // Focus dropdown
  await page.keyboard.press('Enter'); // Open dropdown
  await page.keyboard.press('ArrowDown'); // Navigate to Wood
  await page.keyboard.press('Enter'); // Select Wood

  expect(await page.locator('[role="combobox"]').textContent()).toBe('Wood');
});
```

---

### A11y: Screen Reader Support ✅

**Criteria**:
- [ ] Dropdown has `aria-label="Select material preset"`
- [ ] Each preset option has `aria-description` with full description
- [ ] Preset change announced via ARIA live region
- [ ] Current selection announced when dropdown focused
- [ ] Description text associated with dropdown

**Test**:
```typescript
test('screen reader announcements', () => {
  render(<MaterialPresetSelector value="wood" onChange={jest.fn()} />);

  const dropdown = screen.getByRole('combobox');
  expect(dropdown).toHaveAttribute('aria-label', 'Select material preset');

  fireEvent.click(dropdown);
  const woodOption = screen.getByText('Wood');
  expect(woodOption).toHaveAttribute('aria-description', 'Optimized for pine, oak, walnut engraving');
});
```

---

### A11y: Color Contrast ✅

**Criteria**:
- [ ] Dropdown text: ≥7:1 contrast (AAA)
- [ ] Dropdown border: ≥3:1 contrast
- [ ] Focus indicator: ≥3:1 contrast, ≥3px thick
- [ ] Description text: ≥7:1 contrast
- [ ] Disabled state: visually distinct

---

### A11y: Focus Management ✅

**Criteria**:
- [ ] Focus visible when dropdown focused
- [ ] Focus visible when dropdown open
- [ ] Focus returns to dropdown after selection
- [ ] No focus traps
- [ ] Focus indicator meets contrast requirements

---

## Performance Requirements

### Preset Application Speed ✅

**Criteria**:
- [ ] Preset selection applies in <100ms
- [ ] No UI blocking during preset application
- [ ] Smooth slider transitions
- [ ] Image processing completes within normal bounds

**Test**:
```typescript
test('preset applies quickly', async () => {
  const start = performance.now();

  // Select preset
  fireEvent.change(dropdown, { target: { value: 'wood' } });

  const end = performance.now();
  expect(end - start).toBeLessThan(100);
});
```

---

## Integration Requirements

### Integration with Existing Sliders ✅

**Criteria**:
- [ ] Preset changes update brightness slider
- [ ] Preset changes update contrast slider
- [ ] Preset changes update threshold slider
- [ ] Slider changes trigger Custom preset
- [ ] No conflicts with manual adjustments

---

### Integration with Reset Button ✅

**Criteria**:
- [ ] Reset button resets preset to "Auto"
- [ ] Reset button clears custom preset from localStorage
- [ ] Reset button resets all sliders to defaults
- [ ] Reset button re-runs auto-prep algorithm

**Test**:
```typescript
test('reset button clears custom preset', async () => {
  // Select Wood preset
  // Manually adjust sliders (switches to Custom)
  // Click Reset button

  expect(screen.getByRole('combobox')).toHaveValue('auto');
  expect(localStorage.getItem('craftyprep-custom-preset')).toBeNull();
});
```

---

## Testing Requirements

### Unit Test Coverage ✅

**Criteria**:
- [ ] Preset configurations: 100% coverage
- [ ] MaterialPresetSelector component: ≥80% coverage
- [ ] Type definitions: verified via tests

---

### Integration Test Coverage ✅

**Criteria**:
- [ ] Preset selection flow tested end-to-end
- [ ] Custom preset persistence tested
- [ ] Reset functionality tested
- [ ] Slider integration tested

---

### E2E Test Coverage ✅

**Criteria**:
- [ ] Preset selection tested in real browser
- [ ] Keyboard navigation tested
- [ ] localStorage persistence tested across reloads
- [ ] Visual regression tests pass

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All 7 presets functional (Auto, Wood, Leather, Acrylic, Glass, Metal, Custom)
- [ ] Preset values match FUNCTIONAL.md specification
- [ ] Manual slider adjustment switches to Custom automatically
- [ ] Custom preset persists in localStorage
- [ ] Unit tests pass (≥80% coverage)
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Code review passed (DRY, SOLID, FANG, security, performance)
- [ ] Accessibility verified (WCAG 2.2 AAA, Lighthouse ≥95)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Documentation updated (if needed)

---

**Total Criteria**: 68
**Priority**: HIGH
**Sprint**: Sprint 3
