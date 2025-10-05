# Acceptance Criteria: task-018 - JPG Export Option

**Task**: Add JPG export format option alongside existing PNG export
**Priority**: LOW
**Estimated Effort**: 3 hours

---

## Functional Requirements

### FR1: Format Selector UI
- [ ] Format selector visible on download section (radio buttons or toggle)
- [ ] Two options: "PNG" and "JPG"
- [ ] PNG is selected by default
- [ ] Format selection persists during session (not across page reloads)
- [ ] Clear visual indication of selected format

### FR2: JPG Export Functionality
- [ ] JPG export uses 'image/jpeg' MIME type
- [ ] JPG quality set to 95% (0.95)
- [ ] Generated filename includes `.jpg` extension
- [ ] Example: `photo.png` → `photo_laserprep.jpg`

### FR3: PNG Export (Existing)
- [ ] PNG export continues to work as before
- [ ] PNG remains default format
- [ ] PNG filename includes `.png` extension
- [ ] Example: `photo.jpg` → `photo_laserprep.png`

### FR4: Download Button Behavior
- [ ] Button text updates to show selected format
  - PNG selected: "Download PNG"
  - JPG selected: "Download JPG"
- [ ] Button remains disabled when no image loaded
- [ ] Loading state during download
- [ ] Error handling for both formats

---

## Technical Requirements

### TR1: Hook Implementation
- [ ] `useImageDownload` hook accepts format parameter
- [ ] Format parameter type: 'png' | 'jpeg'
- [ ] Default format is 'png'
- [ ] MIME type selection based on format
- [ ] Quality parameter only applied for JPEG (0.95)

### TR2: Component Updates
- [ ] `DownloadButton` component manages format state
- [ ] Format selector UI implemented (accessible)
- [ ] Format passed to download hook
- [ ] Button text dynamically updates

### TR3: Filename Generation
- [ ] Extension extracted from format parameter
- [ ] Filename pattern: `{basename}_laserprep.{ext}`
- [ ] Sanitization applied before extension
- [ ] Multiple dots in filename handled correctly

---

## Testing Requirements

### UT1: Unit Tests - useImageDownload Hook
- [ ] Test PNG export (existing tests pass)
- [ ] Test JPG export with MIME type 'image/jpeg'
- [ ] Test JPG export with quality 0.95
- [ ] Test filename generation with .jpg extension
- [ ] Test format parameter defaults to 'png'
- [ ] Test format parameter accepts 'jpeg'

### UT2: Unit Tests - DownloadButton Component
- [ ] Test format selector renders
- [ ] Test default format is PNG
- [ ] Test format selection changes state
- [ ] Test button text updates with format
- [ ] Test format passed to hook correctly
- [ ] Test keyboard navigation on format selector

### UT3: Integration Tests
- [ ] Test full PNG export flow
- [ ] Test full JPG export flow
- [ ] Test format toggle → download flow
- [ ] Test filename extensions match selected format

### UT4: E2E Tests
- [ ] Test JPG export via Playwright
- [ ] Test format selector interaction
- [ ] Test downloaded file has .jpg extension
- [ ] Test file size comparison (JPG < PNG for typical images)

---

## Accessibility Requirements

### AC1: Keyboard Navigation
- [ ] Format selector accessible via Tab key
- [ ] Arrow keys navigate between PNG/JPG options
- [ ] Enter/Space toggle selection
- [ ] Focus indicator visible (≥3px, ≥3:1 contrast)

### AC2: Screen Reader Support
- [ ] Format selector has proper ARIA labels
- [ ] Format change announced to screen readers
- [ ] Button text change announced
- [ ] Group label: "Export format"

### AC3: Visual Design
- [ ] Selected format clearly indicated
- [ ] Color contrast ≥7:1 for text
- [ ] Focus indicators meet WCAG 2.2 AAA
- [ ] No reliance on color alone

---

## Performance Requirements

### PF1: File Size
- [ ] JPG file size < PNG file size (for typical photos)
- [ ] JPG quality 95% provides good balance
- [ ] No significant performance degradation

### PF2: Export Time
- [ ] JPG export completes in <2 seconds (2MB image)
- [ ] No blocking UI during export
- [ ] Loading state shown during processing

---

## Browser Compatibility

- [ ] Chrome 90+ - Format selector and JPG export working
- [ ] Firefox 88+ - Format selector and JPG export working
- [ ] Safari 14+ - Format selector and JPG export working
- [ ] Edge 90+ - Format selector and JPG export working

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Code review passed (DRY, SOLID, FANG)
- [ ] Accessibility verified (keyboard + screen reader)
- [ ] Performance verified (file sizes, export time)
- [ ] Browser compatibility verified
- [ ] Documentation updated (JSDoc comments)
- [ ] No console errors or warnings

---

## Out of Scope

- Quality slider for JPG (future enhancement)
- Other formats (WebP, AVIF) - Sprint 3+
- Format preference persistence across sessions (Sprint 3+)
- Batch export (Sprint 3+)
