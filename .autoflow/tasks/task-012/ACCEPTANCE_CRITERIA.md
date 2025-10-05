# Acceptance Criteria: Brightness Adjustment Implementation

**Task ID**: task-012
**Feature**: Real-Time Refinement Controls (Brightness)

---

## Functional Requirements

### FR-1: Brightness Algorithm
- [ ] Function signature: `applyBrightness(imageData: ImageData, brightness: number): ImageData`
- [ ] Formula: `newValue = clamp(originalValue + brightness, 0, 255)`
- [ ] Applied to R, G, B channels (all three)
- [ ] Alpha channel unchanged (preserved)
- [ ] Pure function (no mutation of input)

### FR-2: Brightness Range
- [ ] Range: -100 to +100
- [ ] Default: 0 (no adjustment)
- [ ] Step size: 1
- [ ] Values outside range rejected or clamped

### FR-3: Real-Time Preview Updates
- [ ] Preview updates when brightness slider changes
- [ ] Update triggered after slider drag stops (debounced)
- [ ] Response time <100ms after drag stops
- [ ] UI remains responsive during processing

### FR-4: Slider Integration
- [ ] BrightnessSlider component connected to processing
- [ ] Slider onChange triggers brightness adjustment
- [ ] Current brightness value displayed
- [ ] Slider disabled when no processed image

### FR-5: Baseline Processing
- [ ] Brightness applies to auto-prep result (not original image)
- [ ] Auto-prep baseline preserved for adjustments
- [ ] Multiple brightness changes work correctly
- [ ] Can reset to auto-prep result (brightness = 0)

---

## Technical Requirements

### TR-1: Performance
- [ ] Brightness adjustment completes <100ms for 2MB image
- [ ] Debouncing prevents excessive processing during drag
- [ ] No UI blocking during adjustment
- [ ] Memory cleanup (no leaks)

### TR-2: Code Quality
- [ ] Follows existing imageProcessing pattern (grayscale.ts)
- [ ] Pure functional approach (ImageData → ImageData)
- [ ] TypeScript types complete and correct
- [ ] JSDoc comments on all public functions
- [ ] No console errors or warnings

### TR-3: Testing
- [ ] Unit tests for applyBrightness function
- [ ] Unit tests for useDebounce hook
- [ ] Integration tests for brightness adjustment flow
- [ ] E2E test includes brightness adjustment
- [ ] Test coverage ≥80% for new code

---

## Edge Cases

### EC-1: Brightness = 0
- [ ] Result identical to baseline (auto-prep result)
- [ ] No processing overhead
- [ ] Preview unchanged

### EC-2: Brightness = +100
- [ ] All pixels clamped at 255 (white)
- [ ] No overflow errors
- [ ] Result is pure white image

### EC-3: Brightness = -100
- [ ] All pixels clamped at 0 (black)
- [ ] No underflow errors
- [ ] Result is pure black image

### EC-4: Rapid Slider Changes
- [ ] Debouncing prevents excessive processing
- [ ] Only final value processed
- [ ] No race conditions
- [ ] Preview updates with latest value

### EC-5: Large Images (10MB)
- [ ] Adjustment completes within reasonable time (<500ms)
- [ ] No memory overflow
- [ ] No browser hang

### EC-6: No Processed Image
- [ ] Slider disabled when no auto-prep result
- [ ] No errors when brightness changes before auto-prep
- [ ] Clear UI indication of disabled state

---

## User Experience Requirements

### UX-1: Responsiveness
- [ ] Slider handle moves smoothly (no lag)
- [ ] Value display updates immediately
- [ ] Preview updates <100ms after drag stops
- [ ] No "jumping" or flickering

### UX-2: Visual Feedback
- [ ] Processing indicator if adjustment takes >500ms
- [ ] Preview updates smoothly (no flash)
- [ ] Current brightness value visible
- [ ] Slider position matches brightness value

### UX-3: Accessibility
- [ ] Slider keyboard accessible (inherited from BrightnessSlider)
- [ ] Screen reader announces brightness value changes
- [ ] Focus indicator visible
- [ ] Touch target ≥44px (inherited)

---

## Integration Requirements

### INT-1: BrightnessSlider Component
- [ ] Slider value bound to brightness state
- [ ] onChange handler triggers adjustment
- [ ] Disabled state works correctly
- [ ] Props correctly typed

### INT-2: useImageProcessing Hook
- [ ] Baseline ImageData stored after auto-prep
- [ ] applyAdjustments method available
- [ ] No regression in auto-prep functionality
- [ ] Error handling maintained

### INT-3: App.tsx State Management
- [ ] Brightness state initialized to 0
- [ ] Debounced brightness triggers adjustment
- [ ] State updates don't cause unnecessary re-renders
- [ ] Cleanup on component unmount

---

## Definition of Done

### Code Complete
- [ ] All files created/modified as per TASK_PLAN.md
- [ ] applyBrightness function implemented
- [ ] useDebounce hook implemented
- [ ] useImageProcessing refactored
- [ ] App.tsx integration complete
- [ ] All exports updated (index.ts)

### Tests Pass
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass (including new brightness test)
- [ ] No flaky tests
- [ ] Test coverage ≥80%

### Quality Checks
- [ ] TypeScript compiles with no errors
- [ ] ESLint passes with no errors
- [ ] Code follows existing patterns
- [ ] No console errors in browser
- [ ] Performance targets met

### Documentation
- [ ] JSDoc comments complete
- [ ] TASK_PLAN.md followed
- [ ] ACCEPTANCE_CRITERIA.md met
- [ ] Code is self-documenting

### User Validation
- [ ] Upload image workflow works
- [ ] Auto-prep workflow works
- [ ] Brightness adjustment works as expected
- [ ] Preview updates in real-time
- [ ] No visual bugs or glitches

---

## Test Cases

### Unit Test: applyBrightness

**Test 1: Zero Brightness**
```typescript
Input: ImageData with pixel [128, 128, 128, 255], brightness = 0
Expected: Output [128, 128, 128, 255] (unchanged)
```

**Test 2: Positive Brightness**
```typescript
Input: ImageData with pixel [100, 100, 100, 255], brightness = +50
Expected: Output [150, 150, 150, 255]
```

**Test 3: Negative Brightness**
```typescript
Input: ImageData with pixel [100, 100, 100, 255], brightness = -50
Expected: Output [50, 50, 50, 255]
```

**Test 4: Clamp Upper**
```typescript
Input: ImageData with pixel [200, 200, 200, 255], brightness = +100
Expected: Output [255, 255, 255, 255] (clamped)
```

**Test 5: Clamp Lower**
```typescript
Input: ImageData with pixel [50, 50, 50, 255], brightness = -100
Expected: Output [0, 0, 0, 255] (clamped)
```

**Test 6: Alpha Preservation**
```typescript
Input: ImageData with pixel [128, 128, 128, 200], brightness = +50
Expected: Output [178, 178, 178, 200] (alpha unchanged)
```

**Test 7: Purity**
```typescript
const original = createImageData();
const result = applyBrightness(original, +50);
Assert: original is unchanged (not mutated)
```

### Integration Test: Brightness Adjustment Flow

**Test 1: Full Flow**
```typescript
1. Upload image
2. Run auto-prep
3. Verify baseline stored
4. Set brightness = +50
5. Verify preview updates
6. Verify result matches baseline + brightness
```

**Test 2: Debouncing**
```typescript
1. Upload and auto-prep
2. Rapidly change brightness 10 times
3. Verify only final value processed (not 10 times)
```

**Test 3: Reset to Baseline**
```typescript
1. Upload and auto-prep
2. Set brightness = +50
3. Set brightness = 0
4. Verify preview matches auto-prep result
```

### E2E Test: User Workflow

**Test: Happy Path with Brightness**
```typescript
1. Navigate to https://craftyprep.demosrv.uk
2. Upload test image (2MB)
3. Click "Auto-Prep" button
4. Wait for processing to complete
5. Adjust brightness slider to +50
6. Wait <100ms
7. Verify preview updated
8. Verify preview different from baseline
9. Reset brightness to 0
10. Verify preview matches baseline
```

---

## Success Metrics

- ✅ All acceptance criteria met
- ✅ All tests passing
- ✅ Performance <100ms response time
- ✅ Code review approved
- ✅ No regressions in existing features
- ✅ User can successfully adjust brightness
- ✅ Ready for task-013 (Contrast Adjustment)
