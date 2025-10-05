# Research: Refinement Slider Components

**Task ID**: task-011
**Task Name**: Refinement Slider Components

---

## Radix UI Slider API Research

### Component Structure
```typescript
import * as SliderPrimitive from '@radix-ui/react-slider';

<SliderPrimitive.Root>
  <SliderPrimitive.Track>
    <SliderPrimitive.Range />
  </SliderPrimitive.Track>
  <SliderPrimitive.Thumb />
</SliderPrimitive.Root>
```

### Key Props
- `value: number[]` - Current value(s) (array for multi-thumb support)
- `onValueChange: (value: number[]) => void` - Callback when value changes
- `min: number` - Minimum value (default: 0)
- `max: number` - Maximum value (default: 100)
- `step: number` - Step increment (default: 1)
- `disabled: boolean` - Disable the slider
- `orientation: 'horizontal' | 'vertical'` - Slider orientation (default: horizontal)
- `dir: 'ltr' | 'rtl'` - Text direction
- `inverted: boolean` - Invert the slider direction

### Automatic ARIA Attributes
Radix UI Slider automatically provides:
- `role="slider"` on thumb
- `aria-valuemin` - Set from min prop
- `aria-valuemax` - Set from max prop
- `aria-valuenow` - Current value
- `aria-orientation` - Horizontal or vertical
- `aria-disabled` - When disabled prop is true

### Keyboard Navigation (Built-in)
- **Arrow Up / Arrow Right**: Increase by one step
- **Arrow Down / Arrow Left**: Decrease by one step
- **Home**: Jump to minimum value
- **End**: Jump to maximum value
- **Page Up**: Increase by larger increment (10% of range)
- **Page Down**: Decrease by larger increment (10% of range)

**Source**: https://www.radix-ui.com/primitives/docs/components/slider

---

## shadcn/ui Slider Customization

### Current Implementation Analysis

From `/opt/workspaces/craftyprep.com/src/components/ui/slider.tsx`:

```typescript
// Track styling
className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"

// Range (filled portion)
className="absolute h-full bg-slate-900 dark:bg-slate-50"

// Thumb styling
className="block h-5 w-5 rounded-full border-2 border-slate-900 bg-white
  ring-offset-white transition-colors
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-slate-950
  focus-visible:ring-offset-2
  disabled:pointer-events-none
  disabled:opacity-50
  dark:border-slate-50
  dark:bg-slate-950
  dark:ring-offset-slate-950
  dark:focus-visible:ring-slate-300"
```

### Issues Identified

1. **Touch Target Size**: Thumb is `h-5 w-5` (20px × 20px)
   - **WCAG AAA Requirement**: ≥44px × 44px
   - **Solution**: Override with `h-11 w-11` (44px × 44px)

2. **Track Height**: Track is `h-2` (8px)
   - May be too thin for touch interaction
   - **Recommendation**: Increase to `h-3` or `h-4` for better touch affordance

3. **Focus Ring**: Uses `focus-visible:ring-2`
   - Ring width is 2px
   - **WCAG AAA Requirement**: ≥3px for focus indicators
   - **Solution**: Use `focus-visible:ring-3`

### Customization Strategy

Create wrapper component that:
1. Overrides thumb size for accessibility
2. Enhances focus indicators
3. Adds label and value display
4. Maintains all built-in Radix UI behavior

---

## Touch Target Sizing Research

### WCAG 2.2 Requirements

**Level AA** (2.5.5):
- Touch targets: ≥24px × 24px
- Exception: Inline text links

**Level AAA** (2.5.8):
- Touch targets: ≥44px × 44px
- More stringent requirement

### Current vs Required

| Element | Current | Required (AAA) | Solution |
|---------|---------|----------------|----------|
| Thumb   | 20px    | 44px           | `h-11 w-11` |
| Track (height) | 8px | N/A (not a target) | Increase to 12px for better UX |

### Implementation

```typescript
// Accessible thumb sizing
<SliderPrimitive.Thumb
  className="h-11 w-11 rounded-full ..."
/>
```

**Tradeoff**: Larger thumb may look visually heavy
**Mitigation**: Use subtle styling, ensure proper spacing

---

## Value Display Patterns

### Option 1: Value in Label
```html
<label>
  Brightness: <span>+15</span>
</label>
<Slider ... />
```

**Pros**: Clear association, simple structure
**Cons**: Value not in ARIA label

### Option 2: Value in ARIA Label
```html
<Slider aria-label="Brightness: +15" ... />
```

**Pros**: Screen readers announce value with label
**Cons**: Visual label separate from ARIA label

### Option 3: Combined (Recommended)
```html
<div>
  <label id="brightness-label">
    Brightness: <span aria-live="polite">+15</span>
  </label>
  <Slider
    aria-labelledby="brightness-label"
    aria-label="Adjust brightness from -100 to +100, currently +15"
  />
</div>
```

**Pros**: Best of both worlds
**Cons**: Slightly more complex

### Chosen Approach
Use Option 3 with:
- Visual label showing current value
- ARIA label with descriptive text + current value
- Live region for value updates (aria-live="polite")

---

## Screen Reader Considerations

### Value Announcements

**Challenge**: How to announce value changes without overwhelming user?

**Solutions**:
1. **aria-live="polite"**: Announces after user action completes
   - Less intrusive
   - Waits for user to pause

2. **aria-live="assertive"**: Announces immediately
   - Can be overwhelming
   - Not recommended for sliders

3. **No live region**: Rely on built-in slider announcements
   - Radix UI handles this automatically
   - Value announced when user adjusts

**Chosen Approach**: Rely on Radix UI's built-in announcements, use `aria-live="polite"` only for value display text.

### Descriptive Labels

**Bad**: "Brightness slider"
**Good**: "Adjust image brightness from -100 to +100"

**Pattern**:
```typescript
aria-label={`Adjust ${label.toLowerCase()} from ${min} to ${max}, currently ${value}`}
```

---

## Testing Patterns for Slider Components

### Testing Radix UI Primitives

**Challenge**: Radix UI components use complex internal structure

**Solution**: Test user-facing behavior, not implementation

### Keyboard Event Testing

```typescript
import { userEvent } from '@testing-library/user-event';

test('increases value with arrow up', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();

  render(<BrightnessSlider value={0} onChange={onChange} />);

  const slider = screen.getByRole('slider');
  await user.click(slider); // Focus first
  await user.keyboard('{ArrowUp}');

  expect(onChange).toHaveBeenCalledWith(1);
});
```

### Focus Indicator Testing

```typescript
test('shows focus indicator when focused', async () => {
  const user = userEvent.setup();
  render(<BrightnessSlider value={0} onChange={vi.fn()} />);

  const slider = screen.getByRole('slider');
  await user.tab(); // Focus via keyboard

  // Check for focus-visible class or styles
  expect(slider).toHaveClass('focus-visible:ring-3');
  // Or check computed styles
});
```

### Touch Target Size Testing

```typescript
test('thumb meets touch target size requirement', () => {
  render(<BrightnessSlider value={0} onChange={vi.fn()} />);

  const slider = screen.getByRole('slider');
  const thumb = slider.querySelector('[role="slider"]');

  // Get computed styles
  const styles = window.getComputedStyle(thumb!);
  const width = parseInt(styles.width);
  const height = parseInt(styles.height);

  expect(width).toBeGreaterThanOrEqual(44);
  expect(height).toBeGreaterThanOrEqual(44);
});
```

### ARIA Attributes Testing

```typescript
test('has correct ARIA attributes', () => {
  render(<BrightnessSlider value={15} onChange={vi.fn()} />);

  const slider = screen.getByRole('slider');

  expect(slider).toHaveAttribute('aria-valuemin', '-100');
  expect(slider).toHaveAttribute('aria-valuemax', '100');
  expect(slider).toHaveAttribute('aria-valuenow', '15');
  expect(slider).toHaveAttribute('aria-label');
  expect(slider.getAttribute('aria-label')).toContain('brightness');
});
```

---

## Accessibility Best Practices

### From WCAG 2.2 Level AAA

#### 2.1.1 Keyboard (Level A)
✅ **Requirement**: All functionality available via keyboard
✅ **Implementation**: Radix UI provides keyboard navigation

#### 2.4.7 Focus Visible (Level AA)
✅ **Requirement**: Focus indicator visible with ≥3:1 contrast
✅ **Implementation**: Override with `focus-visible:ring-3 focus-visible:ring-blue-600`

#### 2.5.5 Target Size (Enhanced) - Level AAA
✅ **Requirement**: Touch targets ≥44px × 44px
✅ **Implementation**: Override thumb with `h-11 w-11`

#### 4.1.2 Name, Role, Value (Level A)
✅ **Requirement**: UI components have accessible name and role
✅ **Implementation**: Radix UI provides role="slider", we add aria-label

### Additional Considerations

1. **Color Contrast**:
   - Label text: ≥7:1 (AAA)
   - Value display: ≥7:1 (AAA)
   - Focus ring: ≥3:1 against background

2. **Reduced Motion**:
   - Respect `prefers-reduced-motion`
   - Disable transitions if user prefers

3. **Zoom Support**:
   - Component works at 200% browser zoom
   - No horizontal scrolling
   - Touch targets remain adequate

---

## Component API Design

### RefinementSlider Props
```typescript
interface RefinementSliderProps {
  /** Label text (e.g., "Brightness") */
  label: string;

  /** Current value */
  value: number;

  /** Minimum value */
  min: number;

  /** Maximum value */
  max: number;

  /** Step size (default: 1) */
  step?: number;

  /** Callback when value changes */
  onChange: (value: number) => void;

  /** Accessible label (overrides default) */
  ariaLabel?: string;

  /** Whether slider is disabled */
  disabled?: boolean;

  /** Additional CSS classes */
  className?: string;
}
```

### Specific Slider Props
```typescript
interface BrightnessSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

interface ContrastSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

interface ThresholdSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}
```

### Container Props
```typescript
interface RefinementControlsProps {
  /** Brightness value (-100 to +100) */
  brightness: number;

  /** Contrast value (-100 to +100) */
  contrast: number;

  /** Threshold value (0 to 255) */
  threshold: number;

  /** Brightness change handler */
  onBrightnessChange: (value: number) => void;

  /** Contrast change handler */
  onContrastChange: (value: number) => void;

  /** Threshold change handler */
  onThresholdChange: (value: number) => void;

  /** Whether all sliders disabled */
  disabled?: boolean;
}
```

---

## Performance Considerations

### Debouncing Strategy

**Question**: Should sliders debounce onChange callbacks?

**Answer**: NO

**Rationale**:
- Sliders should be responsive (immediate visual feedback)
- Debouncing is a state management concern
- Parent component handles debouncing for expensive operations (image processing)

**Implementation**:
```typescript
// In parent component
const debouncedBrightness = useDebounce(brightness, 100);

useEffect(() => {
  // Apply brightness adjustment to image
  applyBrightness(debouncedBrightness);
}, [debouncedBrightness]);
```

### Re-render Optimization

**Challenge**: Sliders re-render on every value change

**Solution**: Memoize if needed
```typescript
export const BrightnessSlider = React.memo(({ value, onChange }: Props) => {
  // Component implementation
});
```

**Note**: May not be necessary. Profile before optimizing.

---

## Integration with Image Processing

### Data Flow

```
User drags slider
  ↓
onChange(newValue) fires
  ↓
Parent component updates state
  ↓
State change triggers debounced effect (100ms)
  ↓
Image processing algorithm runs
  ↓
Preview canvas updates
```

### State Management Pattern

```typescript
// Parent component
const [brightness, setBrightness] = useState(0);
const debouncedBrightness = useDebounce(brightness, 100);

useEffect(() => {
  if (processedImageData) {
    const adjusted = applyBrightness(processedImageData, debouncedBrightness);
    updatePreview(adjusted);
  }
}, [debouncedBrightness, processedImageData]);

return (
  <BrightnessSlider
    value={brightness}
    onChange={setBrightness}
  />
);
```

---

## Summary

### Key Findings

1. **Radix UI provides solid foundation**:
   - Automatic keyboard navigation
   - Built-in ARIA attributes
   - Accessible by default

2. **Customizations needed**:
   - Increase thumb size (20px → 44px)
   - Enhance focus indicators (2px → 3px ring)
   - Add label + value display
   - Ensure color contrast

3. **Testing approach**:
   - Test user-facing behavior, not implementation
   - Use @testing-library/user-event for keyboard simulation
   - Verify ARIA attributes and touch target sizes

4. **Integration strategy**:
   - Controlled components (value from parent)
   - No internal debouncing
   - Parent handles expensive operations

### Resources

- **Radix UI Slider Docs**: https://www.radix-ui.com/primitives/docs/components/slider
- **WCAG 2.2**: https://www.w3.org/WAI/WCAG22/quickref/
- **ARIA Slider Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
- **Touch Target Sizing**: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html

---

**Research Complete**: Ready for implementation
**Next Step**: /build to implement components following TDD approach
