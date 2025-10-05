# Task Plan: File Upload Component

**Task ID**: task-003
**Sprint**: Sprint 1 - Foundation & Core Processing
**Estimated Effort**: 6 hours
**Status**: PLANNED

---

## Overview

Implement comprehensive file upload functionality with drag-and-drop, file picker, multi-layered validation (type, size, MIME, dimensions), security sanitization, and full accessibility support. This component serves as the entry point for all user workflows.

---

## TDD Implementation Plan

### Phase 1: Core Validation Logic (Pure Functions) - 1.5 hours

**Implementation Order (Test-First)**:

1. **fileTypeValidator.ts** (`src/lib/validation/fileTypeValidator.ts`)
   - Function: `validateFileType(file: File): boolean`
   - Validates MIME type against whitelist: `['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp']`
   - Tests: valid types, invalid types, edge cases (null, undefined)

2. **fileSizeValidator.ts** (`src/lib/validation/fileSizeValidator.ts`)
   - Function: `validateFileSize(file: File, maxSizeMB: number = 10): boolean`
   - Validates file size ≤ 10MB (10 * 1024 * 1024 bytes)
   - Tests: under limit, at limit, over limit, 0 bytes

3. **fileExtensionValidator.ts** (`src/lib/validation/fileExtensionValidator.ts`)
   - Function: `validateFileExtension(filename: string): boolean`
   - Validates extension with regex: `/\.(jpe?g|png|gif|bmp)$/i`
   - Tests: valid extensions, case insensitivity, invalid extensions, no extension, double extensions

4. **filenameSanitizer.ts** (`src/lib/validation/filenameSanitizer.ts`)
   - Function: `sanitizeFilename(filename: string): string`
   - Replaces dangerous characters: `/[/\\?%*:|"<>]/g` with `_`
   - Tests: special characters, safe filenames, edge cases (all special chars, empty)

5. **imageDecoder.ts** (`src/lib/validation/imageDecoder.ts`)
   - Function: `validateImageDecode(file: File): Promise<HTMLImageElement>`
   - Creates Image object, loads from Blob URL, validates decode success
   - Tests: valid images (mock onload), corrupted files (mock onerror), timeout

6. **imageDimensionValidator.ts** (`src/lib/validation/imageDimensionValidator.ts`)
   - Function: `validateImageDimensions(img: HTMLImageElement): { valid: boolean; error?: string }`
   - Validates: width ≤ 10000px, height ≤ 10000px, total pixels ≤ 100MP
   - Tests: within limits, exceeding width, exceeding height, exceeding pixels, tiny images

**Test Files**:
- `src/tests/unit/validation/fileTypeValidator.test.ts`
- `src/tests/unit/validation/fileSizeValidator.test.ts`
- `src/tests/unit/validation/fileExtensionValidator.test.ts`
- `src/tests/unit/validation/filenameSanitizer.test.ts`
- `src/tests/unit/validation/imageDecoder.test.ts`
- `src/tests/unit/validation/imageDimensionValidator.test.ts`

---

### Phase 2: File Processing Pipeline - 0.5 hours

**Implementation Order (Test-First)**:

1. **fileValidator.ts** (`src/lib/validation/fileValidator.ts`)
   - Function: `validateFile(file: File): Promise<ValidationResult>`
   - Interface:
     ```typescript
     interface ValidationResult {
       valid: boolean;
       error?: string;
       sanitizedFilename?: string;
       image?: HTMLImageElement;
     }
     ```
   - Orchestrates validators in sequence:
     1. File type check (MIME)
     2. File extension check
     3. File size check
     4. Filename sanitization
     5. Image decode (async)
     6. Image dimension check
   - Short-circuits on first failure (early exit)
   - Returns comprehensive result object

**Tests**:
- `src/tests/unit/validation/fileValidator.test.ts`
  - Test complete validation pipeline
  - Test early exit on each validator failure
  - Test success case (all validators pass)
  - Test error message propagation

---

### Phase 3: React Hook for File Upload - 1 hour

**Implementation Order (Test-First)**:

1. **useFileUpload.ts** (`src/hooks/useFileUpload.ts`)
   - State management:
     ```typescript
     interface FileUploadState {
       selectedFile: File | null;
       uploadedImage: HTMLImageElement | null;
       isLoading: boolean;
       error: string | null;
       progress: number; // 0-100 for files >2MB
     }
     ```
   - Actions:
     ```typescript
     interface FileUploadActions {
       handleFileSelect: (file: File) => Promise<void>;
       handleDrop: (event: React.DragEvent) => void;
       handleFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
       clearError: () => void;
       resetUpload: () => void;
     }
     ```
   - Logic:
     - Calls `validateFile()` from Phase 2
     - Manages loading state during validation
     - Tracks progress for files >2MB
     - Sets error messages on validation failure
     - Handles multiple files (takes first, shows info message)

**Tests**:
- `src/tests/unit/hooks/useFileUpload.test.ts`
  - Test state transitions (idle → loading → success)
  - Test state transitions (idle → loading → error)
  - Test file selection flow
  - Test error clearing
  - Test reset functionality
  - Test progress tracking for large files
  - Test multiple files handling

---

### Phase 4: UI Components - 2 hours

**Implementation Order (Test-First)**:

1. **FileDropzone.tsx** (`src/components/FileDropzone.tsx`)
   - Props:
     ```typescript
     interface FileDropzoneProps {
       onFileSelect: (file: File) => void;
       isLoading: boolean;
       error: string | null;
     }
     ```
   - Visual states:
     - Default: Dashed border, upload icon, text "Drag image here or click to browse"
     - Hover: Solid border, background color change
     - Active drop: Highlighted background, solid border
     - Loading: Spinner overlay, disabled
   - Size: 300px × 200px (mobile), 500px × 300px (desktop)
   - Drag event handlers:
     - `onDragEnter` → highlight
     - `onDragLeave` → remove highlight
     - `onDragOver` → prevent default
     - `onDrop` → handle file
   - Click handler: triggers hidden file input
   - Keyboard: Tab to focus, Enter to open picker

2. **FileUploadError.tsx** (`src/components/FileUploadError.tsx`)
   - Props: `{ error: string; onDismiss: () => void }`
   - Red alert box with warning icon
   - Error message text
   - Close button (×)
   - Auto-dismiss after 5 seconds
   - `aria-live="assertive"` for immediate screen reader announcement

3. **FileUploadProgress.tsx** (`src/components/FileUploadProgress.tsx`)
   - Props: `{ progress: number; isVisible: boolean }`
   - Shows only for files >2MB
   - Progress bar: 0-100%
   - Percentage text: "Loading: {progress}%"
   - Spinner animation
   - `aria-live="polite"` with progress updates

4. **FileUploadComponent.tsx** (`src/components/FileUploadComponent.tsx`)
   - Main integration component
   - Uses `useFileUpload` hook
   - Renders:
     - `<FileUploadError>` (if error exists)
     - `<FileDropzone>` (if no uploaded image)
     - `<FileUploadProgress>` (if loading and file >2MB)
   - Passes callbacks and state between components
   - Accessibility:
     - `role="region"` with `aria-label="Image upload"`
     - Hidden file input for accessibility
     - Focus management
     - Screen reader announcements

**Test Files**:
- `src/tests/unit/components/FileDropzone.test.tsx`
- `src/tests/unit/components/FileUploadError.test.tsx`
- `src/tests/unit/components/FileUploadProgress.test.tsx`
- `src/tests/integration/FileUploadComponent.test.tsx`

**Integration Tests** (FileUploadComponent):
- Test drag-and-drop flow
- Test click-to-browse flow
- Test error display and dismissal
- Test loading state with progress
- Test keyboard navigation (Tab, Enter)
- Test screen reader announcements (query `aria-live` regions)
- Test file validation errors display correctly
- Test successful upload flow

---

### Phase 5: Accessibility & Final Integration - 1 hour

**Accessibility Implementation**:

1. **Keyboard Navigation**:
   - Tab to dropzone → visible focus indicator (3px outline)
   - Enter key → opens file picker
   - Escape key → clears error (if present)

2. **ARIA Attributes**:
   - Dropzone: `role="button"`, `aria-label="Upload image file. Drag and drop or press Enter to browse."`
   - Error region: `aria-live="assertive"`, `role="alert"`
   - Progress region: `aria-live="polite"`
   - Loading state: `aria-busy="true"`

3. **Screen Reader Announcements**:
   - File selected: "Image file selected: {filename}"
   - Validation error: "Error: {error message}"
   - Upload progress: "Loading image: {progress}%"
   - Upload success: "Image uploaded successfully"

4. **Focus Management**:
   - Maintain focus on dropzone during upload
   - Move focus to error close button when error appears
   - Return focus to dropzone after error dismissed

**Final Integration**:
- Wire FileUploadComponent into main App layout
- Add to main page below header
- Ensure responsive sizing (mobile, tablet, desktop)
- Verify all visual states render correctly
- Test complete upload flow end-to-end

---

## Acceptance Criteria Checklist

**Functionality**:
- [ ] Drag-and-drop zone component created with visual feedback
- [ ] File picker integration (click dropzone to browse)
- [ ] File type validation: JPG, JPEG, PNG, GIF, BMP only (whitelist)
- [ ] File size validation: 10MB maximum
- [ ] MIME type verification (not just extension check)
- [ ] Filename sanitization implemented (remove dangerous characters)
- [ ] Upload progress indicator for large files (>2MB)
- [ ] Clear error messages for invalid files (type, size, corrupted)
- [ ] Visual states: default, hover, active drop, loading, error

**Accessibility**:
- [ ] Keyboard accessible (Tab to dropzone, Enter to open picker)
- [ ] Screen reader announcements for upload status
- [ ] Focus indicators visible (≥3:1 contrast, ≥3px)
- [ ] ARIA labels and roles correctly applied

**Testing**:
- [ ] Unit tests for all validation logic
- [ ] Integration test for complete upload flow
- [ ] Tests written and passing (≥80% coverage)
- [ ] Code review passed
- [ ] Security review passed

**Edge Cases Handled**:
- [ ] Non-image file → Error: "Unsupported file type..."
- [ ] Multiple files → Process first, info message
- [ ] Corrupted file → Error: "Unable to load image..."
- [ ] File >10MB → Error: "File too large..."
- [ ] Dimensions >10000px → Error: "Image dimensions too large..."

---

## Dependencies

**Required**:
- Task 1.2 (Basic Layout) - MUST be COMPLETE
  - Need layout container to place upload component
  - Verify layout exists before starting

**No New Packages Required**:
- Native File API (built-in)
- Native Drag-and-Drop API (built-in)
- React 18 (already installed)
- TypeScript (already installed)
- Tailwind CSS (already configured)

---

## Research Notes

**Browser APIs Used**:
1. **File API**:
   - `File` object from input or drag-drop
   - `FileReader` for progress tracking
   - `URL.createObjectURL()` for image preview

2. **Drag-and-Drop API**:
   - `DragEvent` interface
   - `dataTransfer.files` for dropped files
   - `preventDefault()` on dragover to enable drop

3. **Image API**:
   - `HTMLImageElement` for decode validation
   - `Image.onload` / `Image.onerror` events
   - `naturalWidth` / `naturalHeight` for dimensions

**Security Considerations**:
- Double validation: MIME type + file extension (both must match)
- Image decode validation prevents malicious files disguised as images
- Dimension/memory limits prevent DoS attacks
- Filename sanitization prevents path traversal
- Client-side only (no server upload risk)

**Performance Optimizations**:
- Debounce drag events (prevent excessive re-renders)
- Async image validation (doesn't block UI)
- Progress tracking only for files >2MB
- Early exit in validation pipeline (fail fast)

---

## Error Messages

**File Type Error**:
```
Unsupported file type. Please upload JPG, PNG, GIF, or BMP.
```

**File Size Error**:
```
File too large. Maximum size is 10MB. Your file is {actualSize}MB.
```

**Corrupted File Error**:
```
Unable to load image. File may be corrupted.
```

**Dimension Error**:
```
Image dimensions too large. Maximum is 10000×10000 pixels.
```

**Memory Error**:
```
Image is too complex to process. Please use a smaller image.
```

**Multiple Files Info**:
```
Multiple files detected. Processing first file only.
```

---

## Next Steps After Completion

After this task is COMPLETE:
1. Run `/code-review` to validate DRY, SOLID, FANG principles
2. Run `/test` to verify ≥80% coverage
3. Run `/commit` to archive and commit
4. Proceed to Task 1.4: Image Canvas and Preview Display

---

**Ready to Build**: All design decisions made, TDD plan complete, dependencies verified. Run `/build` to implement.
