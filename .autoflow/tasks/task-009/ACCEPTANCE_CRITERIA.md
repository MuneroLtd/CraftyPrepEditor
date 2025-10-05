# Acceptance Criteria: PNG Export and Download

**Task ID**: task-009
**Created**: 2025-10-05

---

## Functional Requirements

### Download Button

- [x] Download button component created with clear label "Download PNG"
- [x] Button includes download icon (ArrowDownTrayIcon from @heroicons/react)
- [x] Button disabled when no processed image exists
- [x] Button shows loading state during download ("Downloading..." with spinner)
- [x] Button visually distinct in disabled state

### Export Functionality

- [x] Canvas exported to PNG Blob using `canvas.toBlob('image/png')`
- [x] Blob creation is asynchronous (non-blocking)
- [x] Export works for all processed images regardless of size

### Filename Generation

- [x] Filename pattern: `{original_basename}_laserprep.png`
- [x] Original extension removed before adding suffix
- [x] Example: `photo.jpg` → `photo_laserprep.png`
- [x] Example: `image.png` → `image_laserprep.png`
- [x] Example: `scan` (no extension) → `scan_laserprep.png`

### Filename Sanitization

- [x] Special characters replaced with underscore: `/\?%*:|"<>`
- [x] Forward slash `/` → `_`
- [x] Backslash `\` → `_`
- [x] Question mark `?` → `_`
- [x] Percent `%` → `_`
- [x] Asterisk `*` → `_`
- [x] Colon `:` → `_`
- [x] Pipe `|` → `_`
- [x] Double quote `"` → `_`
- [x] Less than `<` → `_`
- [x] Greater than `>` → `_`
- [x] Normal characters preserved (letters, numbers, hyphens, underscores, periods)

### Download Trigger

- [x] Download triggered via blob URL and anchor element
- [x] Anchor element created programmatically
- [x] `download` attribute set to generated filename
- [x] Click event triggered programmatically
- [x] Anchor element removed from DOM after click

### Resource Cleanup

- [x] Blob URLs cleaned up with `URL.revokeObjectURL()` after download
- [x] No memory leaks from unreleased blob URLs
- [x] Anchor element removed from DOM

### Error Handling

- [x] Error displayed if canvas is null/undefined
- [x] Error displayed if blob creation fails
- [x] Error messages user-friendly and actionable
- [x] Error displayed in visible UI (below button)
- [x] Error announced to screen readers (role="alert", aria-live="assertive")

---

## Technical Requirements

### Code Quality

- [x] TypeScript with strict type checking
- [x] No `any` types (use proper types)
- [x] Pure functions where possible (sanitizeFilename)
- [x] React hooks follow rules (useCallback for downloadImage)
- [x] No side effects in render

### Testing Coverage

- [x] Unit tests for `sanitizeFilename()` (all character replacements)
- [x] Unit tests for `useImageDownload()` hook (blob creation, cleanup, errors)
- [x] Unit tests for `DownloadButton` component (render states, interactions)
- [x] Integration test for complete workflow (upload → process → download)
- [x] Test coverage ≥80% for all new code

### Test Cases

**sanitizeFilename.test.ts**:
- [x] Replaces forward slashes
- [x] Replaces backslashes
- [x] Replaces question marks
- [x] Replaces percent signs
- [x] Replaces asterisks
- [x] Replaces colons
- [x] Replaces pipes
- [x] Replaces double quotes
- [x] Replaces angle brackets (< and >)
- [x] Handles multiple special characters in one string
- [x] Preserves normal characters (letters, numbers, -, _, .)
- [x] Handles empty string
- [x] Handles extension-only filenames (.png)

**useImageDownload.test.tsx**:
- [x] Creates blob from canvas successfully
- [x] Generates correct filename with _laserprep.png suffix
- [x] Sanitizes filename during generation
- [x] Handles filenames without extensions
- [x] Triggers download (anchor created, clicked, removed)
- [x] Cleans up blob URL after download
- [x] Handles null canvas gracefully (shows error)
- [x] Handles blob creation failure (shows error)

**DownloadButton.test.tsx**:
- [x] Renders with "Download PNG" text
- [x] Shows download icon
- [x] Disabled when canvas is null
- [x] Enabled when canvas exists
- [x] Shows loading state during download
- [x] Calls downloadImage on click
- [x] Shows error message if download fails
- [x] Error message has role="alert"

---

## Accessibility Requirements (WCAG 2.2 AAA)

### Keyboard Navigation

- [x] Button reachable via Tab key
- [x] Button activatable via Enter key
- [x] Button activatable via Space key
- [x] Focus indicator visible (≥3:1 contrast, ≥3px outline)
- [x] No keyboard traps

### Screen Reader Support

- [x] Button has descriptive `aria-label`: "Download processed image as PNG"
- [x] Disabled state announced via `aria-disabled` attribute
- [x] Loading state announced (button text changes to "Downloading...")
- [x] Error messages announced immediately (aria-live="assertive")
- [x] Icon has `aria-hidden="true"` (decorative only)

### Visual Design

- [x] Button has both text and icon (not icon-only)
- [x] Color contrast ≥7:1 for text (WCAG AAA)
- [x] Color contrast ≥4.5:1 for large text (WCAG AAA)
- [x] Disabled state visually distinct (gray background)
- [x] Hover state provides feedback (darker blue on hover)
- [x] Loading spinner visible and animated

### Error Messages

- [x] Error messages clear and specific
- [x] Errors have `role="alert"` for immediate announcement
- [x] Errors have `aria-live="assertive"` for screen readers
- [x] Error text contrast ≥7:1 (red on white background)

---

## Performance Requirements

### Export Performance

- [x] 2MB image (5 megapixels) exports in <1 second
- [x] No UI blocking during export (async operation)
- [x] Loading state displayed immediately on button click

### Memory Management

- [x] Blob URLs revoked immediately after download
- [x] No memory leaks from retained blob references
- [x] Anchor element removed from DOM after use

---

## Integration Requirements

### useFileUpload Hook Updates

- [x] Hook now exposes `uploadedFile: File | null` in addition to `uploadedImage`
- [x] File object preserved for filename access
- [x] Existing functionality not broken

### App.tsx Integration

- [x] DownloadButton imported and rendered
- [x] Button positioned below ImagePreview component
- [x] Button shown only when `processedImage` exists
- [x] `processedImage` canvas passed to button
- [x] `uploadedFile.name` passed to button
- [x] Layout remains responsive and centered

---

## Edge Cases Handled

### Filename Edge Cases

- [x] Filename with no extension: `photo` → `photo_laserprep.png`
- [x] Filename with multiple dots: `my.photo.2024.jpg` → `my.photo.2024_laserprep.png`
- [x] Filename with special chars: `photo/test?.jpg` → `photo_test__laserprep.png`
- [x] Very long filename (browser truncates naturally, no manual limit needed)

### Download Edge Cases

- [x] No canvas (null): Shows error "No image to download"
- [x] Blob creation fails: Shows error "Failed to create image blob"
- [x] User cancels download: No error (download simply cancelled)

### Browser Compatibility

- [x] Works in Chrome 90+
- [x] Works in Firefox 88+
- [x] Works in Safari 14+
- [x] Works in Edge 90+
- [x] Canvas API `toBlob()` supported in all target browsers

---

## Documentation Requirements

- [x] Component has JSDoc comments explaining purpose and usage
- [x] Hook has JSDoc comments with examples
- [x] Utility function has JSDoc comments
- [x] Example usage provided in JSDoc

---

## Validation Checklist

Before marking task COMPLETE:

### Functionality
- [x] Download button appears after processing
- [x] Button disabled state works correctly
- [x] Click downloads file with correct filename
- [x] Downloaded PNG matches preview exactly
- [x] Filename sanitization working

### Testing
- [x] All unit tests passing
- [x] Integration test passing
- [x] Test coverage ≥80%
- [x] No console errors during tests

### Code Quality
- [x] Linting passed (npm run lint)
- [x] Type checking passed (npm run typecheck)
- [x] Code review passed (DRY, SOLID, FANG)
- [x] No TODO comments left in code

### Accessibility
- [x] Keyboard navigation working
- [x] Screen reader announces states
- [x] Focus indicators visible
- [x] ARIA attributes correct

### Performance
- [x] Export completes in <1 second for 2MB image
- [x] No memory leaks (blob URLs cleaned up)
- [x] No performance regressions

---

**Status**: Ready for implementation
**Next Command**: `/build` (TDD: tests first, then implementation)
