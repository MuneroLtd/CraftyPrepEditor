# Acceptance Criteria: File Upload Component

**Task ID**: task-003
**Source**: .autoflow/TASK.md

---

## Functional Requirements

### Upload Mechanisms
- [ ] Drag-and-drop zone component created with visual feedback
- [ ] File picker integration (click dropzone to browse)
- [ ] Multiple file handling: process first file only, show info message

### File Validation
- [ ] File type validation: JPG, JPEG, PNG, GIF, BMP only (whitelist)
- [ ] File size validation: 10MB maximum
- [ ] MIME type verification (not just extension check)
- [ ] File extension validation with regex
- [ ] Image decode validation (prevents corrupted files)
- [ ] Dimension validation (max 10000×10000px)
- [ ] Memory validation (max 100 megapixels)

### Security
- [ ] Filename sanitization implemented (remove dangerous characters: `/\?%*:|"<>`)
- [ ] Double validation: MIME type AND extension both required
- [ ] No server upload (client-side only processing)
- [ ] Blob URLs cleaned up after use (prevent memory leaks)

### User Feedback
- [ ] Upload progress indicator for large files (>2MB)
- [ ] Clear error messages for invalid files (type, size, corrupted, dimensions)
- [ ] Visual states: default, hover, active drop, loading, error
- [ ] Success confirmation when image loaded
- [ ] Error auto-dismiss after 5 seconds
- [ ] Error manual dismiss via close button

### Accessibility (WCAG 2.2 AAA)
- [ ] Keyboard accessible (Tab to dropzone, Enter to open picker)
- [ ] Screen reader announcements for upload status
- [ ] Screen reader announcements for errors
- [ ] Focus indicators visible (≥3:1 contrast, ≥3px outline)
- [ ] ARIA labels: `role="button"`, `aria-label` on dropzone
- [ ] ARIA live regions: `aria-live="assertive"` for errors, `aria-live="polite"` for progress
- [ ] `aria-busy="true"` during loading

### Testing
- [ ] Unit tests for all validation logic (6 validators)
- [ ] Unit tests for validation pipeline orchestrator
- [ ] Unit tests for useFileUpload hook
- [ ] Unit tests for UI components (Dropzone, Error, Progress)
- [ ] Integration test for complete upload flow
- [ ] Tests written and passing (≥80% coverage)
- [ ] Code review passed
- [ ] Security review passed

---

## Edge Cases

### EC1.1: Non-Image File
- **Scenario**: User drags text file, PDF, or other non-image
- **Expected**: Display error "Unsupported file type. Please upload JPG, PNG, GIF, or BMP."
- [ ] Tested and handled

### EC1.2: Multiple Files
- **Scenario**: User drags 3 files at once
- **Expected**: Process first file, display info "Multiple files detected. Processing first file only."
- [ ] Tested and handled

### EC1.3: Corrupted File
- **Scenario**: File has .jpg extension but cannot be decoded as image
- **Expected**: Display error "Unable to load image. File may be corrupted."
- [ ] Tested and handled

### EC1.4: File Size Exceeded
- **Scenario**: User uploads 15MB file
- **Expected**: Display error "File too large. Maximum size is 10MB. Your file is 15MB."
- [ ] Tested and handled

### EC1.5: Dimensions Exceeded
- **Scenario**: User uploads 12000×8000px image
- **Expected**: Display error "Image dimensions too large. Maximum is 10000×10000 pixels."
- [ ] Tested and handled

### EC1.6: Memory Limit Exceeded
- **Scenario**: User uploads image with >100 megapixels
- **Expected**: Display error "Image is too complex to process. Please use a smaller image."
- [ ] Tested and handled

### EC1.7: File Picker Canceled
- **Scenario**: User clicks dropzone but closes file picker without selecting
- **Expected**: No error, return to default state
- [ ] Tested and handled

### EC1.8: Rapid Successive Uploads
- **Scenario**: User uploads file, then immediately uploads another before first completes
- **Expected**: Cancel first upload, process second
- [ ] Tested and handled

### EC1.9: Special Characters in Filename
- **Scenario**: Filename is `my/photo?.jpg`
- **Expected**: Sanitized to `my_photo_.jpg`
- [ ] Tested and handled

### EC1.10: File with No Extension
- **Scenario**: File named `image` (no extension)
- **Expected**: Display error "Unsupported file type..."
- [ ] Tested and handled

---

## Definition of Done

**Implementation**:
- [ ] Implementation matches functional spec (.autoflow/docs/FUNCTIONAL.md#feature-1)
- [ ] All validation tests passing
- [ ] Security validation working (MIME + extension)
- [ ] Accessibility tested with keyboard
- [ ] Accessibility tested with screen reader (NVDA or VoiceOver)
- [ ] All edge cases handled
- [ ] No console errors or warnings

**Code Quality**:
- [ ] Code follows DRY principles (no duplication)
- [ ] Code follows SOLID principles (single responsibility, etc.)
- [ ] TypeScript types are comprehensive
- [ ] All functions have JSDoc comments
- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied

**Testing**:
- [ ] Unit test coverage ≥80%
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Edge case tests passing
- [ ] Performance: file validation completes <500ms for 2MB file
- [ ] Memory: no memory leaks (Blob URLs cleaned up)

**Documentation**:
- [ ] Component props documented
- [ ] Hook API documented
- [ ] Validation functions documented
- [ ] Error messages match specification

**Security**:
- [ ] No `eval()` or `Function()` usage
- [ ] No `dangerouslySetInnerHTML`
- [ ] Filename sanitization prevents path traversal
- [ ] MIME type validation prevents malicious files
- [ ] Dimension limits prevent DoS attacks
- [ ] No sensitive data in console logs

**Deployment Readiness**:
- [ ] Works in Chrome, Firefox, Safari, Edge (latest)
- [ ] Works on desktop (≥1024px)
- [ ] Works on tablet (768-1023px)
- [ ] Works on mobile (≥320px)
- [ ] No build errors
- [ ] No TypeScript errors

---

## Verification Steps

**Manual Testing**:
1. Upload valid JPG file → Success
2. Upload PNG, GIF, BMP files → Success
3. Upload 15MB file → Error displayed
4. Upload text file → Error displayed
5. Drag file over dropzone → Hover state visible
6. Drop file on dropzone → File uploads
7. Click dropzone → File picker opens
8. Press Tab to dropzone, then Enter → File picker opens
9. Upload file >2MB → Progress bar appears
10. Upload corrupted image → Error displayed
11. Close error message → Error dismissed
12. Upload multiple files → Info message shown, first file processed
13. Test with screen reader → Status announced correctly

**Automated Testing**:
```bash
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:coverage      # Coverage report
npm run lint               # ESLint
npm run typecheck          # TypeScript
```

**Coverage Report**:
- Expected: ≥80% coverage
- Focus areas: validation functions, hook logic, error handling

---

**Status**: PENDING → PLANNED
**Next Command**: `/build`
