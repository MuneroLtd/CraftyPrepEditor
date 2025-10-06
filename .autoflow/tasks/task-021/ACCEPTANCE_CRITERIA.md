# Acceptance Criteria: Undo/Redo History System

**Task ID**: task-021
**Feature**: Undo/Redo functionality with history stack and keyboard shortcuts

---

## Functional Requirements

### FR1: History Stack Management

**AC1.1**: History stack stores up to 10 adjustment states
- **Given** user makes 15 adjustments
- **When** they undo repeatedly
- **Then** they can only undo the last 10 adjustments (oldest 5 dropped)

**AC1.2**: Each history entry contains complete state snapshot
- **Given** user adjusts brightness, contrast, threshold, and preset
- **When** they undo
- **Then** all four values are restored to their previous state

**AC1.3**: History is cleared on auto-prep
- **Given** user has made adjustments with undo history
- **When** they click "Auto-Prep" button
- **Then** undo/redo buttons become disabled (history cleared)

**AC1.4**: History is cleared on reset
- **Given** user has made adjustments with undo history
- **When** they click "Reset" button
- **Then** undo/redo buttons become disabled (history cleared)

**AC1.5**: History is cleared on new image upload
- **Given** user has made adjustments with undo history
- **When** they upload a new image
- **Then** undo/redo buttons become disabled (history cleared)

---

### FR2: Undo Functionality

**AC2.1**: Undo button reverts to previous adjustment state
- **Given** user has made 2 adjustments: brightness +10, then contrast +5
- **When** they click "Undo" button
- **Then** contrast resets to 0, brightness remains +10
- **And** processed image updates to reflect previous state

**AC2.2**: Undo button is disabled when no undo available
- **Given** user is at the oldest history state (or no history)
- **When** they view the undo button
- **Then** it is visually disabled and non-clickable

**AC2.3**: Multiple undos navigate through history
- **Given** user has made 5 adjustments
- **When** they click undo 3 times
- **Then** they are at the state from 3 adjustments ago
- **And** they can still undo 2 more times

**AC2.4**: Undo preserves preset selection
- **Given** user selects "Wood" preset, then "Leather" preset
- **When** they undo
- **Then** preset selector shows "Wood"
- **And** adjustments revert to Wood preset values

---

### FR3: Redo Functionality

**AC3.1**: Redo button re-applies undone adjustment
- **Given** user adjusts brightness +10, then undoes
- **When** they click "Redo" button
- **Then** brightness returns to +10
- **And** processed image updates to reflect redone state

**AC3.2**: Redo button is disabled when no redo available
- **Given** user is at the newest history state (or never undone)
- **When** they view the redo button
- **Then** it is visually disabled and non-clickable

**AC3.3**: New adjustment after undo clears redo stack
- **Given** user has made adjustments, then undone twice
- **When** they make a new adjustment (e.g., change brightness)
- **Then** redo button becomes disabled (redo stack cleared)
- **And** undoing navigates to the state before the new adjustment

**AC3.4**: Multiple redos restore forward through history
- **Given** user has undone 3 times
- **When** they click redo 2 times
- **Then** they are at the state from 1 undo ago
- **And** they can still redo 1 more time

---

### FR4: Keyboard Shortcuts

**AC4.1**: Ctrl+Z triggers undo
- **Given** user has undo available
- **When** they press Ctrl+Z (Windows/Linux) or Cmd+Z (Mac)
- **Then** undo action is triggered (same as clicking Undo button)

**AC4.2**: Ctrl+Y triggers redo
- **Given** user has redo available
- **When** they press Ctrl+Y (Windows/Linux) or Cmd+Y (Mac)
- **Then** redo action is triggered (same as clicking Redo button)

**AC4.3**: Keyboard shortcuts do not conflict with text inputs
- **Given** user is typing in a text field (future feature)
- **When** they press Ctrl+Z
- **Then** it undoes within the text field (native browser behavior)
- **And** it does NOT trigger app-level undo

**AC4.4**: Keyboard shortcuts are announced to screen readers
- **Given** screen reader user has undo/redo available
- **When** they focus on undo/redo buttons
- **Then** screen reader announces "Undo last adjustment (Ctrl+Z)" or "Redo adjustment (Ctrl+Y)"

---

### FR5: UI/UX Requirements

**AC5.1**: Undo/Redo buttons are clearly visible
- **Given** user has processed an image
- **When** they view the refinement controls
- **Then** they see "Undo" and "Redo" buttons with icons
- **And** buttons are positioned near the sliders or reset button

**AC5.2**: Disabled buttons have clear visual indication
- **Given** undo or redo is unavailable
- **When** user views the button
- **Then** it has reduced opacity and grayed-out appearance
- **And** hover shows tooltip explaining why it's disabled

**AC5.3**: Button labels include keyboard shortcut hints
- **Given** user hovers over Undo button
- **Then** tooltip shows "Undo (Ctrl+Z)"
- **And** Mac users see "Undo (Cmd+Z)"

**AC5.4**: State changes are smooth and immediate
- **Given** user clicks undo or redo
- **When** the state change triggers
- **Then** sliders move smoothly to new positions
- **And** processed image updates within 100ms

---

## Accessibility Requirements (WCAG 2.2 Level AAA)

### AA1: Keyboard Accessibility

- [ ] Undo button is keyboard focusable (Tab key)
- [ ] Redo button is keyboard focusable (Tab key)
- [ ] Enter or Space activates focused button
- [ ] Ctrl+Z and Ctrl+Y work globally (not just when buttons focused)
- [ ] Focus indicators are visible (≥3px outline, ≥3:1 contrast)
- [ ] Tab order is logical (undo before redo)

### AA2: Screen Reader Support

- [ ] Buttons have clear aria-label attributes
  - "Undo last adjustment (Ctrl+Z)"
  - "Redo adjustment (Ctrl+Y)"
- [ ] Disabled state is announced ("Undo, button, disabled")
- [ ] State changes are announced (e.g., "Brightness restored to 10")
- [ ] Button purpose is clear from label alone (no reliance on visual icons)

### AA3: Visual Accessibility

- [ ] Button text has ≥7:1 contrast ratio (AAA standard)
- [ ] Disabled button text has ≥4.5:1 contrast ratio
- [ ] Icons are supplementary (buttons work with text alone)
- [ ] Touch targets are ≥44×44px on mobile

### AA4: Motion and Timing

- [ ] Slider animations respect prefers-reduced-motion
- [ ] No auto-playing animations
- [ ] State changes have no timing requirements (users can undo/redo at their own pace)

---

## Performance Requirements

### PR1: Response Time

- [ ] Undo/redo action completes in <100ms
- [ ] Image re-processing after undo/redo completes in <500ms
- [ ] No UI lag when clicking buttons or pressing keyboard shortcuts

### PR2: Memory Management

- [ ] History stack uses <1MB memory (no ImageData stored, only numbers)
- [ ] No memory leaks from history entries
- [ ] History is properly garbage collected when cleared

---

## Testing Requirements

### TR1: Unit Tests

- [ ] useHistory hook tests cover all edge cases:
  - Empty history
  - Single state
  - Max capacity (10 states)
  - Over capacity (11+ states, oldest dropped)
  - Undo when canUndo is false
  - Redo when canRedo is false
  - Clear history
- [ ] UndoRedoButtons component tests:
  - Render with enabled state
  - Render with disabled state
  - Click handlers called correctly
  - Accessibility attributes present

### TR2: Integration Tests

- [ ] Undo/redo flow with sliders:
  - Adjust brightness → undo → brightness restored
  - Adjust multiple sliders → undo → all restored
  - Adjust → undo → redo → state re-applied
  - Adjust → undo → adjust (new) → redo disabled
- [ ] History clearing:
  - Auto-prep clears history
  - Reset clears history
  - New upload clears history

### TR3: E2E Tests (Playwright)

- [ ] User uploads image, adjusts sliders, undoes, verifies image changed
- [ ] User uses Ctrl+Z keyboard shortcut, verifies undo worked
- [ ] User uses Ctrl+Y keyboard shortcut, verifies redo worked
- [ ] Buttons are disabled at appropriate times
- [ ] Screen reader announces button states correctly

---

## Edge Cases

### EC1: Rapid Undo/Redo
- **Scenario**: User rapidly clicks undo 10 times
- **Expected**: All undos execute correctly, no race conditions
- **Test**: Click undo button 10 times in <1 second

### EC2: Keyboard + Mouse Mixed Input
- **Scenario**: User presses Ctrl+Z, then clicks Redo button
- **Expected**: Both actions work correctly in sequence
- **Test**: Alternate between keyboard shortcuts and button clicks

### EC3: Undo During Processing
- **Scenario**: User clicks undo while image is processing
- **Expected**: Undo is queued or ignored until processing completes
- **Test**: Click undo immediately after clicking Reset

### EC4: Maximum History Reached
- **Scenario**: User makes 15 adjustments
- **Expected**: Only last 10 are stored, undoing 10 times reaches the limit
- **Test**: Make 15 adjustments, verify only 10 undos available

### EC5: Browser Back Button
- **Scenario**: User presses browser back button
- **Expected**: Normal browser navigation (undo/redo state is lost - acceptable)
- **Test**: Make adjustments, press browser back, confirm app doesn't crash

---

## Definition of Done

All acceptance criteria above are met AND:

- [ ] Code review passed (DRY, SOLID, FANG principles)
- [ ] Unit tests ≥80% coverage
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Accessibility audit passed (WCAG 2.2 AAA)
- [ ] No performance regressions
- [ ] Documentation updated (component usage examples)
- [ ] No console errors or warnings

---

**Total Acceptance Criteria**: 35
**Must Pass**: 100% (all 35)
