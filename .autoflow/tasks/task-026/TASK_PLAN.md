# Task Plan: Enhanced Slider and Input Components

**Task ID**: task-026
**Status**: PLANNED
**Priority**: HIGH
**Estimated Hours**: 12

---

## Overview

Transform basic HTML sliders into professional, polished components with:
- Custom-styled range sliders with gradient tracks
- Large, visible handles with hover/focus effects
- Real-time inline value display
- Numeric input fields with increment/decrement buttons
- Comprehensive keyboard support
- Touch-friendly interactions
- Visual feedback during adjustment

**Current State**: Basic Radix UI sliders exist (`RefinementSlider.tsx`, `BrightnessSlider.tsx`, `ContrastSlider.tsx`, `ThresholdSlider.tsx`) using minimal styling.

**Goal**: Create a beautiful, professional slider system that provides satisfying tactile feedback and visual polish.

---

## Analysis

### Current Implementation

**Existing Components**:
- `src/components/ui/slider.tsx` - Base Radix UI slider wrapper
- `src/components/RefinementSlider.tsx` - Generic slider with label + value
- `src/components/BrightnessSlider.tsx` - Brightness control (-100 to +100)
- `src/components/ContrastSlider.tsx` - Contrast control (-100 to +100)
- `src/components/ThresholdSlider.tsx` - Threshold control (0 to 255)

**Current Features**:
- ✅ Keyboard navigation (arrows, Home, End)
- ✅ ARIA labels and accessibility
- ✅ Separate label and value display
- ✅ Touch targets (44px × 44px handles)
- ❌ No gradient track fill
- ❌ No inline value display
- ❌ No numeric input field
- ❌ No increment/decrement buttons
- ❌ Limited visual feedback
- ❌ Basic styling only

**Technology Stack**:
- React 19.1.1 + TypeScript 5.x
- Radix UI Slider (v1.3.6) - accessible primitives
- Tailwind CSS 4 - utility styling
- Lucide React (v0.544.0) - icons available

---

## Design Specification

### Component Architecture

```
EnhancedSlider (new)
├── Slider Track
│   ├── Background (unfilled portion)
│   ├── Gradient Fill (filled portion, shows value)
│   └── Tick Marks (optional, for key values)
├── Slider Handle
│   ├── Circle with border
│   ├── Hover/Focus ring
│   └── Active/Dragging state
├── Value Display
│   ├── Inline badge above handle
│   └── Live update during drag
└── Numeric Input (optional)
    ├── Input field (editable)
    ├── Increment button (+)
    └── Decrement button (-)
```

### Visual Design

**Track**:
- Height: 8px (thicker than current 8px)
- Background: Light gray (unfilled)
- Fill: Gradient from start color to end color
  - Brightness: Blue gradient (darker → lighter)
  - Contrast: Purple gradient (low → high)
  - Threshold: Gray to white gradient
- Border radius: Full rounded

**Handle**:
- Size: 24px × 24px (larger than current 44px, more proportional)
- Border: 3px solid, accent color
- Background: White (light theme) / Dark (dark theme)
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Hover: Scale 1.1, shadow increases
- Focus: 3px ring, accent color
- Active/Dragging: Scale 1.15, stronger shadow

**Value Display**:
- Position: Floating above handle, centered
- Background: Accent color with opacity
- Padding: 4px 8px
- Font: Medium weight, 14px
- Border radius: 6px
- Shows during hover or drag
- Smooth fade in/out

**Numeric Input** (optional feature):
- Width: 80px
- Height: 36px
- Border: 1px solid gray
- Centered text
- Increment/Decrement buttons on sides
- Validates min/max bounds

---

## Implementation Plan

### Phase 1: Enhanced Slider Base Component

**Goal**: Create `EnhancedSlider.tsx` with gradient track and improved handle styling.

**Files to Create/Modify**:
- `src/components/ui/enhanced-slider.tsx` (NEW)
- `src/components/ui/slider.tsx` (REFERENCE - may deprecate)

**Implementation Steps**:

1. **Create EnhancedSlider Component**
   ```typescript
   // src/components/ui/enhanced-slider.tsx
   interface EnhancedSliderProps {
     value: number;
     min: number;
     max: number;
     step: number;
     onChange: (value: number) => void;
     gradientColors?: { start: string; end: string };
     showValueBadge?: boolean;
     disabled?: boolean;
     'aria-label'?: string;
   }
   ```

2. **Implement Gradient Track**
   - Calculate fill percentage based on value
   - Use linear-gradient for color fill
   - Dual-layer approach: background track + fill overlay
   - Support custom gradient colors via props

3. **Style Enhanced Handle**
   - 24px × 24px circle
   - 3px border with theme-aware color
   - Box shadow for depth
   - Hover/focus scale animations
   - Active state visual feedback

4. **Add Floating Value Badge**
   - Positioned above handle with CSS
   - Shows current value
   - Appears on hover or during drag
   - Smooth opacity transition (200ms)
   - Uses absolute positioning relative to handle

**Testing**:
- Unit test: Gradient calculation for various values
- Unit test: Value badge visibility states
- Unit test: Handle styling classes
- Accessibility test: Focus indicators, ARIA attributes
- Visual test: Gradient appearance at min/mid/max values

---

### Phase 2: Numeric Input with Increment/Decrement

**Goal**: Add optional numeric input field with +/- buttons.

**Files to Create/Modify**:
- `src/components/ui/slider-input.tsx` (NEW)
- Update `EnhancedSlider` to support input mode

**Implementation Steps**:

1. **Create SliderInput Component**
   ```typescript
   interface SliderInputProps {
     value: number;
     min: number;
     max: number;
     step: number;
     onChange: (value: number) => void;
     disabled?: boolean;
   }
   ```

2. **Implement Input Field**
   - Controlled input (value from props)
   - Validates on blur (clamps to min/max)
   - Allows manual typing
   - Parses numeric input only
   - Shows error state for invalid input

3. **Add Increment/Decrement Buttons**
   - Minus button (decreases by step)
   - Plus button (increases by step)
   - Lucide icons: `Minus`, `Plus`
   - Disables when at min/max
   - Hover and active states
   - Accessible button labels

4. **Integration with EnhancedSlider**
   - `showInput` prop to enable input mode
   - Input and slider sync bi-directionally
   - Layout: slider above, input below (or side-by-side)
   - Consistent value updates

**Testing**:
- Unit test: Input validation (min/max clamping)
- Unit test: Increment/decrement logic
- Unit test: Invalid input handling
- Unit test: Disabled state for buttons
- E2E test: Manual value entry and slider sync
- Accessibility test: Button labels and keyboard nav

---

### Phase 3: Keyboard Shortcuts Enhancement

**Goal**: Comprehensive keyboard support for power users.

**Files to Create/Modify**:
- `src/hooks/useKeyboardSlider.ts` (NEW)
- Update `EnhancedSlider` to use hook

**Implementation Steps**:

1. **Create useKeyboardSlider Hook**
   ```typescript
   interface UseKeyboardSliderOptions {
     value: number;
     min: number;
     max: number;
     step: number;
     largeStep?: number; // For Page Up/Down
     onChange: (value: number) => void;
     disabled?: boolean;
   }
   ```

2. **Implement Keyboard Handlers**
   - Arrow Left/Down: Decrease by step
   - Arrow Right/Up: Increase by step
   - Page Down: Decrease by largeStep (default: 10)
   - Page Up: Increase by largeStep (default: 10)
   - Home: Jump to minimum
   - End: Jump to maximum
   - Plus/Minus keys: Increment/decrement
   - Number keys: Quick jump to percentage (1 = 10%, 5 = 50%, etc.)

3. **Add Visual Feedback**
   - Brief highlight animation on keyboard input
   - Value badge shows during keyboard interaction
   - Smooth value transitions

4. **Focus Management**
   - Focus visible indicator
   - Focus trap when dragging
   - Tab navigation support

**Testing**:
- Unit test: Each keyboard shortcut
- Unit test: Boundary conditions (min/max)
- Unit test: largeStep calculations
- E2E test: Keyboard navigation flow
- Accessibility test: Focus indicators

---

### Phase 4: Touch and Mobile Enhancements

**Goal**: Ensure sliders work beautifully on touch devices.

**Files to Create/Modify**:
- `src/hooks/useTouchSlider.ts` (NEW)
- Update `EnhancedSlider` for touch

**Implementation Steps**:

1. **Create useTouchSlider Hook**
   ```typescript
   interface UseTouchSliderOptions {
     onTouchStart?: () => void;
     onTouchEnd?: () => void;
     onTouchMove?: (deltaX: number) => void;
   }
   ```

2. **Implement Touch Handlers**
   - Touch start: Show value badge
   - Touch move: Update value with delta
   - Touch end: Hide value badge (delay)
   - Haptic feedback on value change (if supported)

3. **Increase Touch Targets**
   - Handle: Minimum 44px × 44px (current)
   - Buttons: Minimum 44px × 44px
   - Comfortable spacing between controls

4. **Mobile-Specific Styling**
   - Larger handle on mobile (28px vs 24px)
   - Increased track height (10px vs 8px)
   - Simplified animations (performance)

**Testing**:
- E2E test: Touch drag on mobile viewport
- E2E test: Touch target sizes
- Performance test: Animation frame rate on mobile

---

### Phase 5: Visual Feedback and Animations

**Goal**: Add micro-interactions for satisfying UX.

**Files to Create/Modify**:
- `src/styles/slider-animations.css` (NEW)
- Update `EnhancedSlider` with animations

**Implementation Steps**:

1. **Define Animation Classes**
   ```css
   @keyframes slider-handle-pulse {
     0%, 100% { transform: scale(1); }
     50% { transform: scale(1.15); }
   }

   @keyframes value-badge-fade-in {
     from { opacity: 0; transform: translateY(4px); }
     to { opacity: 1; transform: translateY(0); }
   }
   ```

2. **Implement Hover Effects**
   - Handle scales to 1.1
   - Shadow increases
   - Value badge fades in
   - Smooth transitions (200ms ease)

3. **Implement Active/Dragging State**
   - Handle scales to 1.15
   - Stronger shadow (0 4px 8px)
   - Value badge always visible
   - Track brightens slightly

4. **Implement Success State** (after adjustment)
   - Brief green glow on handle
   - Subtle pulse animation
   - Fades after 500ms

5. **Respect prefers-reduced-motion**
   ```css
   @media (prefers-reduced-motion: reduce) {
     .enhanced-slider * {
       animation: none !important;
       transition: none !important;
     }
   }
   ```

**Testing**:
- Visual test: Hover states
- Visual test: Drag states
- Visual test: Success animations
- Accessibility test: Reduced motion preference

---

### Phase 6: Refactor Existing Sliders

**Goal**: Migrate existing sliders to use `EnhancedSlider`.

**Files to Modify**:
- `src/components/RefinementSlider.tsx` (UPDATE)
- `src/components/BrightnessSlider.tsx` (UPDATE)
- `src/components/ContrastSlider.tsx` (UPDATE)
- `src/components/ThresholdSlider.tsx` (UPDATE)

**Implementation Steps**:

1. **Update RefinementSlider**
   - Replace `Slider` with `EnhancedSlider`
   - Add gradient colors via props
   - Enable value badge by default
   - Optionally enable numeric input

2. **Update BrightnessSlider**
   - Gradient: `#1e40af` (blue-800) to `#93c5fd` (blue-300)
   - Large step: 10
   - Enable numeric input

3. **Update ContrastSlider**
   - Gradient: `#6b21a8` (purple-800) to `#e9d5ff` (purple-200)
   - Large step: 10
   - Enable numeric input

4. **Update ThresholdSlider**
   - Gradient: `#374151` (gray-700) to `#f3f4f6` (gray-100)
   - Large step: 25
   - Enable numeric input

5. **Update Tests**
   - Verify gradient rendering
   - Test numeric input integration
   - Ensure backwards compatibility

**Testing**:
- Unit test: Each slider with new props
- E2E test: Brightness, contrast, threshold sliders
- Visual regression test: Compare before/after
- Accessibility test: All sliders maintain WCAG AAA

---

### Phase 7: Integration and Documentation

**Goal**: Integrate enhanced sliders into the app and document usage.

**Files to Create/Modify**:
- `src/components/RefinementControls.tsx` (VERIFY)
- `src/components/ControlPanel.tsx` (VERIFY)
- Update component documentation

**Implementation Steps**:

1. **Verify Integration**
   - Check sliders render in RefinementControls
   - Verify layout with new styling
   - Test panel collapse/expand with sliders

2. **Update Component Props**
   - Ensure all parent components pass correct props
   - Verify gradient colors match design
   - Enable/disable features as needed

3. **Performance Optimization**
   - Debounce value changes if needed
   - Memoize gradient calculations
   - Optimize re-renders

4. **Documentation**
   - Add JSDoc comments to all new components
   - Create usage examples
   - Document keyboard shortcuts
   - Update FUNCTIONAL.md with new features

**Testing**:
- E2E test: Full workflow with enhanced sliders
- Performance test: Slider interaction frame rate
- Accessibility audit: Full app with new sliders

---

## Test-Driven Development Approach

### Test Categories

1. **Unit Tests** (Vitest)
   - Component rendering
   - Props validation
   - Event handlers
   - Keyboard shortcuts
   - Value calculations
   - Gradient rendering

2. **Integration Tests** (Vitest)
   - Slider + Input sync
   - Parent component integration
   - State management

3. **E2E Tests** (Playwright)
   - Mouse drag interactions
   - Touch interactions (mobile)
   - Keyboard navigation
   - Value display accuracy
   - Visual feedback

4. **Accessibility Tests** (axe + Playwright)
   - ARIA attributes
   - Focus indicators
   - Keyboard navigation
   - Color contrast (WCAG AAA)
   - Screen reader compatibility

### Test Files to Create

```
src/tests/unit/components/ui/
├── enhanced-slider.test.tsx (NEW)
├── slider-input.test.tsx (NEW)

src/tests/unit/hooks/
├── useKeyboardSlider.test.ts (NEW)
├── useTouchSlider.test.ts (NEW)

src/tests/e2e/
├── enhanced-sliders.spec.ts (NEW)
├── slider-keyboard-nav.spec.ts (NEW)
├── slider-touch.spec.ts (NEW)
```

### TDD Workflow

**For each phase**:
1. Write failing tests for new behavior
2. Implement minimum code to pass tests
3. Refactor for quality and performance
4. Add edge case tests
5. Verify accessibility compliance

---

## Acceptance Criteria Mapping

| Criteria | Implementation | Test Coverage |
|----------|----------------|---------------|
| Custom slider with styled track and handle | Phase 1: EnhancedSlider base | Unit + Visual tests |
| Gradient fill showing value position | Phase 1: Gradient track | Unit + Visual tests |
| Inline value display | Phase 1: Floating badge | Unit + E2E tests |
| Numeric input with validation | Phase 2: SliderInput | Unit + E2E tests |
| +/- increment buttons | Phase 2: Increment/Decrement | Unit + E2E tests |
| Keyboard support (arrows, page, home/end) | Phase 3: useKeyboardSlider | Unit + E2E tests |
| Hover/focus states with transitions | Phase 5: Animations | Visual + E2E tests |
| Touch-friendly on mobile | Phase 4: Touch enhancements | E2E mobile tests |
| Satisfying interaction feedback | Phase 5: Micro-interactions | Visual + E2E tests |

---

## Dependencies

**Existing Dependencies** (already installed):
- `@radix-ui/react-slider` (v1.3.6) - Accessible slider primitive
- `lucide-react` (v0.544.0) - Icons for buttons
- `tailwind-merge` (v3.3.1) - Class name utilities
- `react` (v19.1.1) - Framework

**No New Dependencies Required** ✅

---

## Risks and Mitigations

### Risk 1: Performance with Complex Gradients
**Mitigation**: Use CSS gradients (GPU-accelerated), memoize calculations, test on low-end devices.

### Risk 2: Touch Interaction Conflicts
**Mitigation**: Proper event handling (preventDefault), test on real mobile devices, use Radix UI primitives.

### Risk 3: Accessibility Regression
**Mitigation**: Maintain existing ARIA attributes, test with screen readers, run axe audits, respect prefers-reduced-motion.

### Risk 4: Visual Inconsistency
**Mitigation**: Define design tokens in Tailwind config, create Storybook stories, visual regression tests.

---

## Timeline Estimate

| Phase | Hours | Cumulative |
|-------|-------|------------|
| Phase 1: Enhanced Slider Base | 2h | 2h |
| Phase 2: Numeric Input | 2h | 4h |
| Phase 3: Keyboard Shortcuts | 1.5h | 5.5h |
| Phase 4: Touch Enhancements | 1.5h | 7h |
| Phase 5: Visual Feedback | 2h | 9h |
| Phase 6: Refactor Existing | 1.5h | 10.5h |
| Phase 7: Integration & Docs | 1.5h | 12h |

**Total**: 12 hours

---

## Definition of Done

- [ ] `EnhancedSlider` component created with gradient track
- [ ] Floating value badge shows on hover/drag
- [ ] `SliderInput` component with +/- buttons implemented
- [ ] Full keyboard support (arrows, page, home/end, numbers)
- [ ] Touch-friendly interactions with haptic feedback
- [ ] Smooth animations for hover, focus, active states
- [ ] All existing sliders migrated to `EnhancedSlider`
- [ ] Unit test coverage ≥80%
- [ ] E2E tests for mouse, keyboard, touch interactions
- [ ] Accessibility audit passes (WCAG 2.2 AAA)
- [ ] No performance regressions (60fps animations)
- [ ] Documentation updated (JSDoc + FUNCTIONAL.md)
- [ ] All acceptance criteria met
- [ ] Code review passed
- [ ] Visual design approved

---

## Next Steps

1. Run `/build` to begin implementation (Phase 1)
2. Create `EnhancedSlider` component with TDD approach
3. Implement gradient track and styled handle
4. Add floating value badge
5. Test and refine visual appearance
6. Proceed to Phase 2 (Numeric Input)

---

**Status**: PLANNED
**Ready for**: `/build` command
**Blocker**: None
