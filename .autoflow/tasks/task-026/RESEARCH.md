# Research: Enhanced Slider and Input Components

**Task ID**: task-026
**Task**: Enhanced Slider and Input Components

---

## Research Overview

This document contains research findings on slider component design patterns, accessibility best practices, animation techniques, and implementation approaches for creating professional, polished slider controls.

---

## 1. Slider Design Patterns

### Industry Standards

**Material Design (Google)**:
- Continuous sliders for selecting from a range
- Thumb size: 24px × 24px (desktop), 28px (mobile)
- Track height: 4-8px
- Active state: Thumb scales up
- Value display: Tooltip above thumb
- Reference: [Material Design Sliders](https://m3.material.io/components/sliders)

**Apple Human Interface Guidelines**:
- Sliders for picking values from continuous ranges
- Large touch targets: 44pt minimum
- Clear visual feedback
- Haptic feedback on value change
- Reference: [Apple HIG - Sliders](https://developer.apple.com/design/human-interface-guidelines/)

**Fluent Design (Microsoft)**:
- Clear track with contrasting fill
- 20px thumb with shadow
- Smooth animations (200-300ms)
- Keyboard shortcuts: arrows, page, home/end
- Reference: [Fluent UI Slider](https://developer.microsoft.com/en-us/fluentui)

**Common Patterns Across Platforms**:
- ✅ Gradient or solid fill showing progress
- ✅ Value display (inline or tooltip)
- ✅ Large thumb for easy grabbing
- ✅ Keyboard navigation support
- ✅ Touch-friendly sizing
- ✅ Hover/focus states with animations

---

## 2. Accessibility Best Practices

### WCAG 2.2 AAA Requirements for Sliders

**2.4.7 Focus Visible (AA)**:
- Focus indicator must be visible
- Minimum 3px width
- Minimum 3:1 contrast ratio with background

**2.4.13 Focus Appearance (AAA)**:
- Focus indicator area ≥2px thick
- Contrast ≥3:1 against focused component
- Contrast ≥3:1 against adjacent colors

**2.5.5 Target Size (AAA)**:
- Touch targets ≥44px × 44px
- Or have sufficient spacing (≥24px offset)

**2.5.8 Target Size (Minimum) (AA)**:
- Minimum 24px × 24px

**Keyboard Support** (Required):
- Arrow keys: Increment/decrement by step
- Page Up/Down: Large increment/decrement
- Home: Jump to minimum
- End: Jump to maximum

**ARIA Attributes** (Required):
- `role="slider"` (provided by Radix UI)
- `aria-label` or `aria-labelledby`
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- `aria-valuetext` for formatted values
- `aria-orientation` (horizontal/vertical)

**Screen Reader Support**:
- Announce current value on change
- Use `aria-live="polite"` for value updates
- Provide clear labels

**References**:
- [WCAG 2.2 Understanding Docs](https://www.w3.org/WAI/WCAG22/Understanding/)
- [ARIA Slider Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)
- [Inclusive Components - Slider](https://inclusive-components.design/)

---

## 3. Gradient Implementation Techniques

### CSS Linear Gradients

**Basic Gradient Syntax**:
```css
background: linear-gradient(to right, #start, #end);
```

**Dynamic Gradient with Value Fill**:
```css
/* Track with gradient fill based on percentage */
.slider-track {
  background: linear-gradient(
    to right,
    #blue 0%,
    #blue 50%,    /* Filled to current value */
    #gray 50%,    /* Unfilled from current value */
    #gray 100%
  );
}
```

**Dual-Layer Approach** (Recommended):
```css
/* Background layer (full gradient) */
.slider-track-background {
  background: linear-gradient(to right, #1e40af, #93c5fd);
  opacity: 0.3;
}

/* Fill layer (clipped to current value) */
.slider-track-fill {
  background: linear-gradient(to right, #1e40af, #93c5fd);
  width: 50%; /* Calculated from value */
}
```

**Performance Considerations**:
- CSS gradients are GPU-accelerated ✅
- No JavaScript calculations during drag ✅
- Use `transform` instead of `left/width` for animations ✅

**Browser Support**:
- Linear gradients: 98%+ (all modern browsers)
- Fallback: Solid color

**References**:
- [MDN: linear-gradient()](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient)
- [CSS-Tricks: Gradient Techniques](https://css-tricks.com/css3-gradients/)

---

## 4. Radix UI Slider Architecture

### Radix UI Slider Primitives

**Components Provided**:
- `Slider.Root` - Container with role="slider"
- `Slider.Track` - Track background
- `Slider.Range` - Filled portion of track
- `Slider.Thumb` - Draggable handle

**Built-in Accessibility**:
- ✅ Keyboard navigation (arrows, page, home/end)
- ✅ ARIA attributes (role, aria-valuemin/max/now)
- ✅ Focus management
- ✅ Touch and mouse support
- ✅ RTL support

**API Surface**:
```typescript
<Slider.Root
  value={[50]}
  onValueChange={(values) => onChange(values[0])}
  min={0}
  max={100}
  step={1}
  disabled={false}
  orientation="horizontal"
  dir="ltr"
  inverted={false}
  minStepsBetweenThumbs={0}
>
  <Slider.Track>
    <Slider.Range />
  </Slider.Track>
  <Slider.Thumb />
</Slider.Root>
```

**Styling Approach**:
- Class-based styling (Tailwind compatible)
- No default styles (unstyled primitive)
- Full control over appearance

**Advantages**:
- ✅ Accessibility built-in
- ✅ Cross-browser compatible
- ✅ Touch and mouse handling
- ✅ Keyboard shortcuts
- ✅ TypeScript support
- ✅ Small bundle size (~8KB)

**References**:
- [Radix UI Slider Docs](https://www.radix-ui.com/docs/primitives/components/slider)
- [Radix UI GitHub](https://github.com/radix-ui/primitives)

---

## 5. Animation and Interaction Design

### Micro-interactions Best Practices

**Hover States**:
- Duration: 150-200ms
- Easing: `ease-out` or `cubic-bezier(0.4, 0, 0.2, 1)`
- Effect: Scale (1.1x), shadow increase
- Delay: Immediate (0ms)

**Active/Dragging States**:
- Duration: 100ms (faster for immediate feedback)
- Effect: Scale (1.15x), stronger shadow
- Easing: `ease-in-out`

**Focus States**:
- Duration: 200ms
- Ring appearance: 3px solid
- Contrast: ≥3:1
- Easing: `ease-out`

**Value Badge Transitions**:
- Fade in: 200ms
- Fade out: 300ms (slightly slower for readability)
- Easing: `ease-in-out`
- Transform: Slight translate (4px up on enter)

**Success Animations**:
- Pulse: 500ms
- Glow: 400ms fade out
- Color: Green accent
- Trigger: After value change completes

**Performance Targets**:
- All animations: 60fps (16.67ms per frame)
- Use `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (layout thrashing)

**Reduced Motion**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**References**:
- [Material Motion System](https://m3.material.io/styles/motion)
- [Framer Motion Duration Guidelines](https://www.framer.com/motion/)
- [Web Animation Performance](https://web.dev/animations-guide/)

---

## 6. Touch and Mobile Interactions

### Touch Event Handling

**Event Types**:
- `touchstart` - Finger touches screen
- `touchmove` - Finger drags
- `touchend` - Finger lifts
- `touchcancel` - Touch interrupted

**Best Practices**:
- Prevent default to avoid scroll conflicts
- Track single touch (ignore multi-touch)
- Calculate delta from start position
- Provide immediate visual feedback

**Touch Target Sizing**:
- Minimum: 44px × 44px (WCAG AAA)
- Recommended: 48px × 48px (Material Design)
- Spacing: 8px between targets

**Haptic Feedback** (iOS):
```javascript
// iOS Haptic Feedback API
if (window.navigator && window.navigator.vibrate) {
  window.navigator.vibrate(10); // 10ms vibration
}

// iOS Taptic Engine (via React Native or Capacitor)
// Haptics.impactOccurred({ style: 'light' });
```

**Mobile Optimizations**:
- Larger thumb: 28px (vs 24px desktop)
- Thicker track: 10px (vs 8px desktop)
- Faster animations: 150ms (vs 200ms desktop)
- No hover states (touch devices don't hover)

**References**:
- [MDN: Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Google: Touch Target Sizes](https://web.dev/accessible-tap-targets/)

---

## 7. Numeric Input Patterns

### Input Field Design

**Layout Options**:
1. **Below Slider** (Recommended):
   - Slider on top, input below
   - Clear visual hierarchy
   - Doesn't interfere with slider

2. **Side-by-Side**:
   - Slider left, input right
   - Compact layout
   - May be cramped on mobile

3. **Inline with Label**:
   - Label - Input - Slider
   - Most compact
   - Complex layout

**Input Validation**:
```typescript
// Validation logic
const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  const raw = e.target.value;

  // Allow typing (including incomplete numbers)
  if (raw === '' || raw === '-') {
    setInputValue(raw);
    return;
  }

  // Parse number
  const parsed = parseFloat(raw);

  // Validate
  if (isNaN(parsed)) {
    return; // Ignore invalid input
  }

  // Update (don't clamp during typing)
  setInputValue(raw);
};

const handleInputBlur = () => {
  const parsed = parseFloat(inputValue);

  if (isNaN(parsed)) {
    // Reset to current value
    setInputValue(String(value));
    return;
  }

  // Clamp to min/max
  const clamped = Math.max(min, Math.min(max, parsed));

  // Update value
  onChange(clamped);
  setInputValue(String(clamped));
};
```

**Increment/Decrement Buttons**:
- Icon: Lucide `Plus` and `Minus`
- Size: 36px × 36px (button)
- Icon size: 16px
- Position: Flanking input field
- Disabled state: When at min/max
- Repeat on hold: Optional (advanced)

**References**:
- [Inclusive Components - Number Input](https://inclusive-components.design/)
- [Nielsen Norman Group - Input Fields](https://www.nngroup.com/articles/form-design-white-space/)

---

## 8. Keyboard Shortcuts Design

### Standard Slider Shortcuts

**ARIA Slider Pattern**:
- Right/Up Arrow: Increase by step
- Left/Down Arrow: Decrease by step
- Page Up: Increase by 10× step (or large step)
- Page Down: Decrease by 10× step (or large step)
- Home: Jump to minimum
- End: Jump to maximum

**Enhanced Shortcuts** (Optional):
- Plus (+): Increase by step
- Minus (-): Decrease by step
- Number keys (1-9): Jump to 10%-90% of range
- 0: Jump to 0%

**Implementation**:
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  const { key } = e;
  let newValue = value;

  switch (key) {
    case 'ArrowRight':
    case 'ArrowUp':
      newValue = Math.min(max, value + step);
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      newValue = Math.max(min, value - step);
      break;
    case 'PageUp':
      newValue = Math.min(max, value + largeStep);
      break;
    case 'PageDown':
      newValue = Math.max(min, value - largeStep);
      break;
    case 'Home':
      newValue = min;
      break;
    case 'End':
      newValue = max;
      break;
    default:
      return; // Don't prevent default for other keys
  }

  e.preventDefault();
  onChange(newValue);
};
```

**Visual Feedback**:
- Brief highlight on keyboard input
- Value badge appears
- Smooth animation to new value

**References**:
- [WAI-ARIA Slider Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)
- [Keyboard Event Reference](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)

---

## 9. Performance Optimization

### Performance Bottlenecks

**Common Issues**:
1. Layout thrashing during drag
2. Excessive re-renders
3. Inefficient gradient calculations
4. Animation frame drops

**Solutions**:

**1. Debounce Value Updates**:
```typescript
const [debouncedValue] = useDebouncedValue(value, 50);

useEffect(() => {
  onValueChange(debouncedValue);
}, [debouncedValue]);
```

**2. Memoize Calculations**:
```typescript
const fillPercentage = useMemo(() => {
  return ((value - min) / (max - min)) * 100;
}, [value, min, max]);
```

**3. Use Transform for Animations**:
```css
/* Good - GPU accelerated */
.thumb {
  transform: scale(1.1);
  transition: transform 200ms;
}

/* Bad - Layout thrashing */
.thumb {
  width: 26px;
  height: 26px;
  transition: width 200ms, height 200ms;
}
```

**4. Optimize Event Handlers**:
```typescript
// Use passive event listeners for scroll prevention
element.addEventListener('touchmove', handler, { passive: false });

// Use capture phase for better performance
element.addEventListener('pointermove', handler, { capture: true });
```

**5. Reduce Re-renders**:
```typescript
// Use React.memo for child components
const SliderThumb = React.memo(({ value, ...props }) => {
  return <Thumb {...props} />;
});

// Use useCallback for event handlers
const handleChange = useCallback((newValue: number) => {
  onChange(newValue);
}, [onChange]);
```

**Performance Targets**:
- Slider drag: 60fps (16.67ms per frame)
- Value update: <50ms latency
- Animation: 60fps (no dropped frames)
- Initial render: <100ms

**Measurement**:
```typescript
// Performance API
const start = performance.now();
// ... operation ...
const end = performance.now();
console.log(`Operation took ${end - start}ms`);

// React Profiler
<Profiler id="Slider" onRender={onRenderCallback}>
  <EnhancedSlider />
</Profiler>
```

**References**:
- [Web Performance Fundamentals](https://web.dev/vitals/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

## 10. Color and Gradient Selection

### Gradient Color Schemes

**Brightness Slider**:
- Concept: Darker to lighter
- Start: `#1e40af` (blue-800, dark blue)
- End: `#93c5fd` (blue-300, light blue)
- Rationale: Blue evokes light, clear visual progression

**Contrast Slider**:
- Concept: Low contrast to high contrast
- Start: `#6b21a8` (purple-800, deep purple)
- End: `#e9d5ff` (purple-200, light purple)
- Rationale: Purple evokes intensity, vibrant colors

**Threshold Slider**:
- Concept: Dark to light (binary threshold)
- Start: `#374151` (gray-700, dark gray)
- End: `#f3f4f6` (gray-100, light gray)
- Rationale: Grayscale shows black/white threshold

**Color Contrast Requirements**:
- Gradient endpoints: ≥7:1 with white background (WCAG AAA)
- Gradient endpoints: ≥4.5:1 with each other (readability)
- Handle border: ≥3:1 with track (visibility)
- Focus ring: ≥3:1 with background (accessibility)

**Color Blindness Considerations**:
- Avoid red-green gradients (8% of males are red-green colorblind)
- Use blue-yellow or purple-gray combinations
- Provide texture/pattern if color is sole indicator
- Test with color blindness simulators

**References**:
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coblis Color Blindness Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)

---

## 11. Testing Strategies

### Unit Testing (Vitest + React Testing Library)

**Test Categories**:
1. **Rendering Tests**
   - Component renders without errors
   - Props are applied correctly
   - Default values render

2. **Interaction Tests**
   - Value changes on drag
   - Keyboard shortcuts work
   - Input field updates slider
   - Buttons increment/decrement

3. **Validation Tests**
   - Min/max clamping
   - Invalid input handling
   - Disabled state blocks interaction

4. **Accessibility Tests**
   - ARIA attributes present
   - Focus management correct
   - Labels associated

**Example Test**:
```typescript
describe('EnhancedSlider', () => {
  it('updates value on drag', async () => {
    const onChange = vi.fn();
    render(
      <EnhancedSlider
        value={50}
        min={0}
        max={100}
        step={1}
        onChange={onChange}
      />
    );

    const thumb = screen.getByRole('slider');

    // Simulate drag
    fireEvent.mouseDown(thumb);
    fireEvent.mouseMove(thumb, { clientX: 200 });
    fireEvent.mouseUp(thumb);

    expect(onChange).toHaveBeenCalled();
  });
});
```

---

### E2E Testing (Playwright)

**Test Scenarios**:
1. **Mouse Drag**
   - Click and drag slider
   - Verify value updates
   - Verify visual feedback

2. **Keyboard Navigation**
   - Focus slider
   - Press arrow keys
   - Verify value changes

3. **Touch Interaction** (Mobile)
   - Touch and drag slider
   - Verify touch targets ≥44px
   - Verify responsive styling

4. **Integration**
   - Adjust brightness slider
   - Verify image updates
   - Verify value persists

**Example Test**:
```typescript
test('brightness slider adjusts image', async ({ page }) => {
  await page.goto('https://craftyprep.demosrv.uk');

  // Upload image
  await page.setInputFiles('input[type="file"]', 'test-image.jpg');

  // Find slider
  const slider = page.locator('[aria-label*="Brightness"]');

  // Drag slider
  await slider.click();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  // Verify value updated
  const value = await page.locator('[data-testid="brightness-value"]').textContent();
  expect(value).toBe('2');

  // Verify image changed (screenshot comparison)
  await expect(page.locator('canvas')).toHaveScreenshot('brightness-adjusted.png');
});
```

---

### Accessibility Testing

**Tools**:
- **axe-core** - Automated accessibility audits
- **Playwright + axe** - E2E accessibility tests
- **Screen readers** - Manual testing (NVDA, VoiceOver)

**Test Checklist**:
- [ ] All interactive elements have ARIA labels
- [ ] Focus indicators visible (≥3:1 contrast)
- [ ] Touch targets ≥44px × 44px
- [ ] Keyboard navigation works
- [ ] Screen reader announces values
- [ ] Color contrast meets WCAG AAA
- [ ] Reduced motion respected

**Example Test**:
```typescript
test('slider is accessible', async ({ page }) => {
  await page.goto('https://craftyprep.demosrv.uk');

  // Run axe audit
  const results = await new AxeBuilder({ page })
    .include('[role="slider"]')
    .analyze();

  expect(results.violations).toEqual([]);
});
```

---

## 12. Implementation Recommendations

### Phase 1: Start Simple
1. Create basic `EnhancedSlider` with gradient track
2. Style handle with hover states
3. Add floating value badge
4. Test with existing sliders

### Phase 2: Add Features
1. Create `SliderInput` component
2. Implement +/- buttons
3. Add keyboard shortcuts hook
4. Integrate input with slider

### Phase 3: Polish
1. Add animations and transitions
2. Optimize for touch devices
3. Add success state feedback
4. Test on real devices

### Phase 4: Refactor
1. Migrate all existing sliders
2. Update parent components
3. Comprehensive testing
4. Documentation

**Avoid**:
- ❌ Over-engineering (keep it simple)
- ❌ Too many features at once (incremental)
- ❌ Breaking accessibility (test continuously)
- ❌ Performance regressions (monitor frame rate)

---

## 13. Lessons from Existing Sliders

### Current Implementation Analysis

**Strengths**:
- ✅ Uses Radix UI (accessible primitive)
- ✅ Keyboard navigation works
- ✅ ARIA labels present
- ✅ Touch targets meet AAA (44px)
- ✅ Value display (separate label)

**Weaknesses**:
- ❌ No gradient fill (plain track)
- ❌ Small handle (11px) not visually prominent
- ❌ Basic styling (minimal visual feedback)
- ❌ No numeric input
- ❌ No increment/decrement buttons
- ❌ Limited animations
- ❌ Value label separate (not inline)

**Opportunities**:
- ✨ Gradient track shows value visually
- ✨ Larger, styled handle more prominent
- ✨ Floating badge provides instant feedback
- ✨ Numeric input for precision
- ✨ Buttons for step adjustments
- ✨ Smooth animations enhance UX

**Migration Path**:
1. Keep existing sliders functional during development
2. Create EnhancedSlider alongside (not replacing yet)
3. Test EnhancedSlider thoroughly
4. Migrate sliders one by one
5. Deprecate old slider after all migrations complete

---

## Conclusion

**Key Takeaways**:
1. Use Radix UI Slider primitive for accessibility foundation
2. Implement gradient track with CSS for visual feedback
3. Larger handle (24px) with hover/focus animations
4. Floating value badge for instant feedback
5. Numeric input + buttons for precision control
6. Comprehensive keyboard shortcuts (arrows, page, home/end)
7. Touch-friendly sizing (≥44px targets)
8. Smooth animations (60fps) respecting reduced motion
9. WCAG 2.2 AAA compliance (focus indicators, contrast, keyboard)
10. Performance optimization (memoization, GPU acceleration)

**Implementation Priority**:
1. **High**: Gradient track, styled handle, value badge
2. **Medium**: Numeric input, +/- buttons
3. **Low**: Advanced keyboard shortcuts, haptic feedback

**Success Metrics**:
- Visual appeal: "Looks professional and polished"
- Usability: "Easy to adjust values precisely"
- Performance: "Smooth and responsive (60fps)"
- Accessibility: "Works with keyboard and screen readers"

**Ready to implement** ✅

---

**Status**: Research complete
**Next**: Begin Phase 1 implementation (EnhancedSlider base)
