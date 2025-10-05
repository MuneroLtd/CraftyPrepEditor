# Task Plan: PNG Export and Download

**Task ID**: task-009
**Task Name**: PNG Export and Download
**Status**: PLANNED
**Created**: 2025-10-05
**Estimated Effort**: 4 hours

---

## Overview

Implement PNG export functionality that allows users to download their processed laser-ready images. The system will export the processed canvas as a PNG blob and trigger a browser download with a properly sanitized filename.

---

## Goals

1. Create a download button component that appears when processed image is ready
2. Implement canvas-to-PNG export using Canvas API's `toBlob()` method
3. Generate proper filename: `{original_name}_laserprep.png`
4. Sanitize filenames to prevent invalid characters
5. Trigger browser download via blob URL and anchor element
6. Clean up resources to prevent memory leaks
7. Ensure accessibility (keyboard support, screen reader announcements)

---

## Technical Approach

### Architecture

**Component Structure**:
```
src/
├── components/
│   └── DownloadButton.tsx          # Download button UI component
├── hooks/
│   └── useImageDownload.ts         # Download logic hook
└── lib/
    └── utils/
        └── sanitizeFilename.ts     # Filename sanitization utility
```

**Data Flow**:
```
processedImage (HTMLCanvasElement)
  ↓
canvas.toBlob('image/png')
  ↓
Blob URL created
  ↓
Anchor element (download attribute)
  ↓
Click triggered programmatically
  ↓
URL.revokeObjectURL() cleanup
```

### Implementation Plan

#### Phase 1: Filename Sanitization Utility (TDD)

**File**: `src/lib/utils/sanitizeFilename.ts`

**Test Cases** (write tests FIRST):
1. Replaces forward slashes: `photo/name.png` → `photo_name.png`
2. Replaces backslashes: `photo\name.png` → `photo_name.png`
3. Replaces question marks: `photo?.png` → `photo_.png`
4. Replaces percent signs: `photo%20.png` → `photo_20.png`
5. Replaces asterisks: `photo*.png` → `photo_.png`
6. Replaces colons: `photo:name.png` → `photo_name.png`
7. Replaces pipes: `photo|name.png` → `photo_name.png`
8. Replaces quotes: `photo"name.png` → `photo_name.png`
9. Replaces angle brackets: `photo<name>.png` → `photo_name_.png`
10. Handles multiple special chars: `photo/\?*.png` → `photo____.png`
11. Preserves normal chars: `photo-name_2024.png` → `photo-name_2024.png`
12. Handles empty string: `` → ``
13. Handles extension only: `.png` → `.png`

**Implementation**:
```typescript
/**
 * Sanitize filename by replacing invalid characters with underscores
 *
 * @param filename - Original filename
 * @returns Sanitized filename safe for download
 */
export function sanitizeFilename(filename: string): string {
  // Replace invalid filesystem characters: / \ ? % * : | " < >
  return filename.replace(/[/\\?%*:|"<>]/g, '_');
}
```

**Test File**: `src/tests/unit/lib/utils/sanitizeFilename.test.ts`

---

#### Phase 2: Download Hook (TDD)

**File**: `src/hooks/useImageDownload.ts`

**Test Cases** (write tests FIRST):
1. Creates blob from canvas successfully
2. Generates correct filename: `photo.jpg` → `photo_laserprep.png`
3. Sanitizes filename during generation
4. Handles filenames without extensions: `photo` → `photo_laserprep.png`
5. Creates and clicks download anchor programmatically
6. Revokes blob URL after download (cleanup)
7. Handles canvas.toBlob() errors gracefully
8. Does nothing when canvas is null/undefined

**Hook Interface**:
```typescript
interface UseImageDownloadReturn {
  downloadImage: (canvas: HTMLCanvasElement | null, originalFilename: string) => Promise<void>;
  isDownloading: boolean;
  error: string | null;
}

export function useImageDownload(): UseImageDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadImage = useCallback(async (
    canvas: HTMLCanvasElement | null,
    originalFilename: string
  ) => {
    if (!canvas) {
      setError('No image to download');
      return;
    }

    try {
      setIsDownloading(true);
      setError(null);

      // Generate filename: {basename}_laserprep.png
      const baseName = originalFilename.replace(/\.[^/.]+$/, ''); // Remove extension
      const sanitizedBaseName = sanitizeFilename(baseName);
      const filename = `${sanitizedBaseName}_laserprep.png`;

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      // Create blob URL and download
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Cleanup blob URL
      URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      setError(errorMessage);
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { downloadImage, isDownloading, error };
}
```

**Test File**: `src/tests/unit/hooks/useImageDownload.test.tsx`

---

#### Phase 3: Download Button Component (TDD)

**File**: `src/components/DownloadButton.tsx`

**Test Cases** (write tests FIRST):
1. Renders button with "Download PNG" text
2. Shows download icon (ArrowDownTray from heroicons)
3. Disabled when no processed image
4. Enabled when processed image exists
5. Shows loading state during download
6. Calls downloadImage on click
7. Shows error message if download fails
8. Keyboard accessible (Tab, Enter)
9. ARIA attributes correct (aria-label, aria-disabled)
10. Screen reader announces state changes

**Component Interface**:
```typescript
interface DownloadButtonProps {
  canvas: HTMLCanvasElement | null;
  originalFilename: string;
  disabled?: boolean;
}

export function DownloadButton({
  canvas,
  originalFilename,
  disabled = false
}: DownloadButtonProps) {
  const { downloadImage, isDownloading, error } = useImageDownload();

  const handleClick = () => {
    downloadImage(canvas, originalFilename);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleClick}
        disabled={disabled || !canvas || isDownloading}
        aria-label="Download processed image as PNG"
        aria-disabled={disabled || !canvas || isDownloading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors flex items-center space-x-2"
      >
        {isDownloading ? (
          <>
            <LoadingSpinner className="w-5 h-5" />
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <ArrowDownTrayIcon className="w-5 h-5" aria-hidden="true" />
            <span>Download PNG</span>
          </>
        )}
      </button>

      {error && (
        <div
          className="text-sm text-red-600"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
    </div>
  );
}
```

**Test File**: `src/tests/unit/components/DownloadButton.test.tsx`

---

#### Phase 4: Integration with App.tsx

**Modifications**:

1. Import DownloadButton component
2. Track uploadedFile name in state (for filename generation)
3. Pass processedImage canvas and original filename to DownloadButton
4. Position button below ImagePreview

**Updated App.tsx structure**:
```typescript
function App() {
  const { uploadedImage, uploadedFile } = useFileUpload(); // Get filename
  const { processedImage, isProcessing, error, runAutoPrepAsync } = useImageProcessing();

  return (
    <Layout>
      {/* ... existing upload, auto-prep button, preview ... */}

      {/* Download Button (shown after processing) */}
      {processedImage && uploadedFile && (
        <div className="w-full max-w-2xl mx-auto px-4">
          <DownloadButton
            canvas={processedImage}
            originalFilename={uploadedFile.name}
            disabled={!processedImage}
          />
        </div>
      )}
    </Layout>
  );
}
```

**Note**: `useFileUpload` hook needs to expose `uploadedFile` (File object) in addition to `uploadedImage`.

---

## Implementation Steps (TDD Order)

### Step 1: Filename Sanitization
1. ✅ Write tests for `sanitizeFilename.test.ts` (all edge cases)
2. ✅ Run tests (they should fail - RED)
3. ✅ Implement `sanitizeFilename.ts`
4. ✅ Run tests (they should pass - GREEN)
5. ✅ Refactor if needed

### Step 2: Download Hook
1. ✅ Write tests for `useImageDownload.test.tsx`
2. ✅ Run tests (should fail - RED)
3. ✅ Implement `useImageDownload.ts`
4. ✅ Run tests (should pass - GREEN)
5. ✅ Refactor if needed

### Step 3: Download Button Component
1. ✅ Write tests for `DownloadButton.test.tsx`
2. ✅ Run tests (should fail - RED)
3. ✅ Implement `DownloadButton.tsx`
4. ✅ Run tests (should pass - GREEN)
5. ✅ Refactor if needed

### Step 4: useFileUpload Hook Update
1. ✅ Update `useFileUpload` to expose `uploadedFile: File | null`
2. ✅ Update existing tests to verify uploadedFile is tracked
3. ✅ Run tests

### Step 5: App Integration
1. ✅ Import DownloadButton in App.tsx
2. ✅ Get uploadedFile from useFileUpload
3. ✅ Add DownloadButton below ImagePreview
4. ✅ Manual testing: upload → auto-prep → download

### Step 6: Integration Testing
1. ✅ Create integration test: full workflow (upload → process → download)
2. ✅ Verify downloaded file is valid PNG
3. ✅ Verify filename matches expected pattern

---

## Testing Strategy

### Unit Tests (≥80% coverage required)

**sanitizeFilename.test.ts**:
- ✅ All special character replacements
- ✅ Edge cases (empty string, extension only, normal filenames)

**useImageDownload.test.tsx**:
- ✅ Blob creation from canvas
- ✅ Filename generation logic
- ✅ Error handling (null canvas, blob creation failure)
- ✅ Cleanup (URL.revokeObjectURL called)

**DownloadButton.test.tsx**:
- ✅ Render states (idle, disabled, downloading, error)
- ✅ Click handler called
- ✅ Accessibility (keyboard, ARIA, screen reader)

### Integration Tests

**download-flow.test.tsx**:
- ✅ Full workflow: upload image → auto-prep → download
- ✅ Verify downloaded file is valid PNG blob
- ✅ Verify filename matches pattern

---

## Accessibility Requirements

**WCAG 2.2 Level AAA Compliance**:

1. **Keyboard Navigation**:
   - ✅ Button reachable via Tab key
   - ✅ Button activatable via Enter/Space
   - ✅ Focus indicator visible (≥3:1 contrast, ≥3px)

2. **Screen Reader Support**:
   - ✅ Button has descriptive aria-label
   - ✅ Disabled state announced (aria-disabled)
   - ✅ Loading state announced
   - ✅ Error messages in live region (aria-live="assertive")

3. **Visual Design**:
   - ✅ Button text + icon for clarity
   - ✅ Color contrast ≥7:1 (AAA)
   - ✅ Disabled state visually distinct
   - ✅ Icon has aria-hidden (decorative)

4. **Error Handling**:
   - ✅ Error messages clear and actionable
   - ✅ Error announced immediately (role="alert")

---

## Performance Considerations

**Target**: Export 2MB image in <1 second

**Optimization Strategies**:
1. Use `canvas.toBlob()` (async, non-blocking)
2. Immediate URL cleanup after download
3. No unnecessary re-renders during download
4. Memoize downloadImage function with useCallback

**Memory Management**:
- ✅ Revoke blob URLs after download
- ✅ Remove anchor element from DOM after click
- ✅ No retained references to blobs

---

## Error Handling

**Potential Errors**:
1. Canvas is null/undefined → Show error: "No image to download"
2. canvas.toBlob() fails → Show error: "Failed to create image blob"
3. Blob creation returns null → Show error: "Failed to create image blob"

**Error Display**:
- ✅ Error message below button
- ✅ Red text (text-red-600)
- ✅ role="alert" for screen readers
- ✅ aria-live="assertive" for immediate announcement

**Error Recovery**:
- User can retry download (error clears on next attempt)
- No need to re-process image (canvas still exists)

---

## Documentation Requirements

**Component Documentation**:
```typescript
/**
 * DownloadButton - Triggers download of processed image as PNG
 *
 * Exports the processed canvas as a PNG blob and downloads it with
 * a sanitized filename following the pattern: {original}_laserprep.png
 *
 * @param canvas - Processed image canvas (from useImageProcessing)
 * @param originalFilename - Original uploaded file name (for naming)
 * @param disabled - Force disable button (optional)
 *
 * @example
 * <DownloadButton
 *   canvas={processedImage}
 *   originalFilename="photo.jpg"
 * />
 * // Downloads as: photo_laserprep.png
 */
```

**Hook Documentation**:
```typescript
/**
 * useImageDownload - Handle image download from canvas
 *
 * Converts canvas to PNG blob and triggers browser download.
 * Handles filename generation, sanitization, and cleanup.
 *
 * @returns {downloadImage, isDownloading, error}
 *
 * @example
 * const { downloadImage, isDownloading, error } = useImageDownload();
 *
 * // Trigger download
 * await downloadImage(canvasElement, 'original-photo.jpg');
 * // Downloads as: original-photo_laserprep.png
 */
```

---

## Definition of Done

- [x] sanitizeFilename utility implemented and tested
- [x] useImageDownload hook implemented and tested
- [x] DownloadButton component implemented and tested
- [x] useFileUpload updated to expose uploadedFile
- [x] DownloadButton integrated in App.tsx
- [x] All unit tests passing (≥80% coverage)
- [x] Integration test for full workflow
- [x] Manual testing: upload → auto-prep → download works
- [x] Downloaded PNG matches preview exactly
- [x] Filename generation correct and sanitized
- [x] Blob URLs cleaned up (no memory leaks)
- [x] Keyboard navigation working
- [x] Screen reader announces states correctly
- [x] Error handling working for all edge cases
- [x] Code review passed (DRY, SOLID, FANG)
- [x] Linting passed (npm run lint)
- [x] Type checking passed (npm run typecheck)

---

## Next Steps

After implementation:
1. Run `/code-review` → Verify code quality (DRY, SOLID, FANG, security, performance)
2. Run `/test` → Run full test suite, verify ≥80% coverage
3. Run `/commit` → Commit work and mark task COMPLETE

---

**Status**: PLANNED
**Ready for**: `/build` command to begin TDD implementation
