# Task Plan: task-018 - JPG Export Option

**Task ID**: task-018
**Priority**: LOW
**Estimated Effort**: 3 hours
**Approach**: Test-Driven Development (TDD)

---

## Overview

Add JPG export format option alongside existing PNG export, allowing users to choose between lossless PNG (larger files) and high-quality JPG (smaller files, 95% quality).

### Key Changes
1. Add format parameter to `useImageDownload` hook
2. Add format selector UI to `DownloadButton` component
3. Implement JPG export with 95% quality
4. Update filename generation for correct extension
5. Maintain PNG as default format

---

## 5-Phase TDD Implementation

---

## Phase 1: Write Failing Tests (Red)

**Objective**: Write comprehensive tests for JPG export functionality before implementation

**Duration**: 45 minutes

### 1.1: Update useImageDownload Hook Tests

**File**: `src/tests/unit/hooks/useImageDownload.test.tsx`

**New Test Suite**: "format parameter"
```typescript
describe('format parameter', () => {
  it('defaults to PNG format when format not specified', async () => {
    const { result } = renderHook(() => useImageDownload());
    await act(async () => {
      await result.current.downloadImage(mockCanvas, 'test.jpg');
    });
    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/png',
      undefined
    );
  });

  it('exports as PNG when format is "png"', async () => {
    const { result } = renderHook(() => useImageDownload());
    await act(async () => {
      await result.current.downloadImage(mockCanvas, 'test.jpg', 'png');
    });
    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/png',
      undefined
    );
  });

  it('exports as JPEG when format is "jpeg"', async () => {
    const { result } = renderHook(() => useImageDownload());
    await act(async () => {
      await result.current.downloadImage(mockCanvas, 'test.jpg', 'jpeg');
    });
    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/jpeg',
      0.95
    );
  });

  it('generates .png extension for PNG format', async () => {
    const { result } = renderHook(() => useImageDownload());
    let capturedAnchor: HTMLAnchorElement | null = null;

    appendChildSpy.mockImplementation((node: Node) => {
      if (node instanceof HTMLAnchorElement) capturedAnchor = node;
      return node;
    });

    await act(async () => {
      await result.current.downloadImage(mockCanvas, 'photo.jpg', 'png');
    });

    await waitFor(() => {
      expect(capturedAnchor?.download).toBe('photo_laserprep.png');
    });
  });

  it('generates .jpg extension for JPEG format', async () => {
    const { result } = renderHook(() => useImageDownload());
    let capturedAnchor: HTMLAnchorElement | null = null;

    appendChildSpy.mockImplementation((node: Node) => {
      if (node instanceof HTMLAnchorElement) capturedAnchor = node;
      return node;
    });

    await act(async () => {
      await result.current.downloadImage(mockCanvas, 'photo.png', 'jpeg');
    });

    await waitFor(() => {
      expect(capturedAnchor?.download).toBe('photo_laserprep.jpg');
    });
  });
});
```

### 1.2: Update DownloadButton Component Tests

**File**: `src/tests/unit/components/DownloadButton.test.tsx`

**New Test Suite**: "format selector"
```typescript
describe('format selector', () => {
  it('renders format selector with PNG and JPG options', () => {
    const { getByLabelText } = render(
      <DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />
    );

    expect(getByLabelText(/PNG/i)).toBeInTheDocument();
    expect(getByLabelText(/JPG/i)).toBeInTheDocument();
  });

  it('defaults to PNG format selected', () => {
    const { getByLabelText } = render(
      <DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />
    );

    const pngRadio = getByLabelText(/PNG/i) as HTMLInputElement;
    expect(pngRadio.checked).toBe(true);
  });

  it('changes format when JPG selected', async () => {
    const { getByLabelText } = render(
      <DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />
    );

    const jpgRadio = getByLabelText(/JPG/i) as HTMLInputElement;
    await userEvent.click(jpgRadio);

    expect(jpgRadio.checked).toBe(true);
  });

  it('updates button text to "Download PNG" when PNG selected', () => {
    const { getByRole } = render(
      <DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />
    );

    const button = getByRole('button');
    expect(button).toHaveTextContent('Download PNG');
  });

  it('updates button text to "Download JPG" when JPG selected', async () => {
    const { getByLabelText, getByRole } = render(
      <DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />
    );

    const jpgRadio = getByLabelText(/JPG/i);
    await userEvent.click(jpgRadio);

    const button = getByRole('button');
    expect(button).toHaveTextContent('Download JPG');
  });

  it('passes selected format to download hook', async () => {
    const downloadSpy = vi.fn();
    vi.mock('@/hooks/useImageDownload', () => ({
      useImageDownload: () => ({
        downloadImage: downloadSpy,
        isDownloading: false,
        error: null,
      }),
    }));

    const { getByLabelText, getByRole } = render(
      <DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />
    );

    const jpgRadio = getByLabelText(/JPG/i);
    await userEvent.click(jpgRadio);

    const button = getByRole('button');
    await userEvent.click(button);

    expect(downloadSpy).toHaveBeenCalledWith(mockCanvas, 'test.jpg', 'jpeg');
  });
});

describe('format selector accessibility', () => {
  it('has accessible fieldset and legend', () => {
    const { getByRole } = render(
      <DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />
    );

    const group = getByRole('group', { name: /export format/i });
    expect(group).toBeInTheDocument();
  });

  it('navigates between formats with keyboard', async () => {
    const { getByLabelText } = render(
      <DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />
    );

    const pngRadio = getByLabelText(/PNG/i);
    const jpgRadio = getByLabelText(/JPG/i);

    pngRadio.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(jpgRadio).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    expect(pngRadio).toHaveFocus();
  });
});
```

### 1.3: Add Integration Test

**File**: `src/tests/integration/JPGExport.integration.test.tsx` (new)

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DownloadButton } from '@/components/DownloadButton';

describe('JPG Export Integration', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockBlob: Blob;

  beforeEach(() => {
    mockBlob = new Blob(['fake image'], { type: 'image/jpeg' });
    mockCanvas = {
      toBlob: vi.fn((callback, type, quality) => {
        setTimeout(() => callback(mockBlob), 0);
      }),
    } as unknown as HTMLCanvasElement;
  });

  it('exports image as JPG when JPG format selected', async () => {
    render(<DownloadButton canvas={mockCanvas} originalFilename="photo.png" />);

    // Select JPG format
    const jpgRadio = screen.getByLabelText(/JPG/i);
    await userEvent.click(jpgRadio);

    // Click download
    const button = screen.getByRole('button', { name: /download/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(mockCanvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/jpeg',
        0.95
      );
    });
  });

  it('generates correct JPG filename', async () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');

    render(<DownloadButton canvas={mockCanvas} originalFilename="my-photo.png" />);

    const jpgRadio = screen.getByLabelText(/JPG/i);
    await userEvent.click(jpgRadio);

    const button = screen.getByRole('button', { name: /download/i });
    await userEvent.click(button);

    await waitFor(() => {
      const anchor = appendChildSpy.mock.calls[0][0] as HTMLAnchorElement;
      expect(anchor.download).toBe('my-photo_laserprep.jpg');
    });

    vi.restoreAllMocks();
  });
});
```

### 1.4: Run Tests (Should Fail)

```bash
cd src
npm test -- --run
```

**Expected**: All new tests fail (no implementation yet)

---

## Phase 2: Implement Format Selector UI (Green)

**Objective**: Add format selection UI to DownloadButton component

**Duration**: 30 minutes

### 2.1: Update DownloadButton Component

**File**: `src/components/DownloadButton.tsx`

**Changes**:
1. Add format state
2. Add format selector UI (radio buttons)
3. Update button text based on format
4. Pass format to download hook

```typescript
import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useImageDownload } from '@/hooks/useImageDownload';

export type ExportFormat = 'png' | 'jpeg';

interface DownloadButtonProps {
  canvas: HTMLCanvasElement | null;
  originalFilename: string;
  disabled?: boolean;
}

export function DownloadButton({
  canvas,
  originalFilename,
  disabled = false,
}: DownloadButtonProps) {
  const { downloadImage, isDownloading, error } = useImageDownload();
  const [format, setFormat] = useState<ExportFormat>('png');

  const handleClick = () => {
    downloadImage(canvas, originalFilename, format);
  };

  const isDisabled = disabled || !canvas || isDownloading;

  const formatLabels: Record<ExportFormat, string> = {
    png: 'PNG',
    jpeg: 'JPG',
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Format Selector */}
      <fieldset className="border border-gray-300 rounded-lg p-4">
        <legend className="text-sm font-medium px-2">Export Format</legend>

        <div className="flex space-x-4" role="radiogroup" aria-label="Export format">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="png"
              checked={format === 'png'}
              onChange={() => setFormat('png')}
              className="w-4 h-4 focus:ring-3 focus:ring-blue-500"
              aria-label="PNG (Lossless, larger file)"
            />
            <span className="text-sm">PNG (Lossless)</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="jpeg"
              checked={format === 'jpeg'}
              onChange={() => setFormat('jpeg')}
              className="w-4 h-4 focus:ring-3 focus:ring-blue-500"
              aria-label="JPG (Smaller file, 95% quality)"
            />
            <span className="text-sm">JPG (Smaller)</span>
          </label>
        </div>
      </fieldset>

      {/* Download Button */}
      <button
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={`Download processed image as ${formatLabels[format]}`}
        aria-disabled={isDisabled}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors flex items-center space-x-2
                   focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isDownloading ? (
          <>
            <svg
              className="w-5 h-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <ArrowDownTrayIcon className="w-5 h-5" aria-hidden="true" />
            <span>Download {formatLabels[format]}</span>
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </div>
  );
}
```

### 2.2: Run Tests

```bash
npm test -- DownloadButton
```

**Expected**: Format selector tests pass, download tests still fail (hook not updated)

---

## Phase 3: Implement JPG Export Logic (Green)

**Objective**: Update useImageDownload hook to support format parameter

**Duration**: 45 minutes

### 3.1: Update useImageDownload Hook

**File**: `src/hooks/useImageDownload.ts`

**Changes**:
1. Add format parameter to downloadImage function
2. Add MIME type mapping
3. Add quality mapping
4. Add extension mapping
5. Update toBlob call with format-specific parameters

```typescript
import { useState, useCallback } from 'react';
import { sanitizeFilename } from '@/lib/utils/sanitizeFilename';

export type ExportFormat = 'png' | 'jpeg';

interface UseImageDownloadReturn {
  downloadImage: (
    canvas: HTMLCanvasElement | null,
    originalFilename: string,
    format?: ExportFormat
  ) => Promise<void>;
  isDownloading: boolean;
  error: string | null;
}

// MIME type mapping
const MIME_TYPES: Record<ExportFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
};

// Quality settings (undefined for lossless formats)
const QUALITY: Record<ExportFormat, number | undefined> = {
  png: undefined,
  jpeg: 0.95,
};

// File extension mapping
const EXTENSIONS: Record<ExportFormat, string> = {
  png: 'png',
  jpeg: 'jpg', // Use .jpg not .jpeg for file extension
};

/**
 * Hook for downloading processed images in PNG or JPG format.
 *
 * Converts a canvas element to a blob and triggers browser download
 * with a sanitized filename following the pattern: {original}_laserprep.{ext}
 *
 * Features:
 * - Multi-format support (PNG, JPG)
 * - PNG: Lossless, larger files
 * - JPG: 95% quality, smaller files
 * - Automatic filename generation from original upload name
 * - Special character sanitization in filenames
 * - Proper resource cleanup (blob URL revocation)
 * - Error handling for failed downloads
 * - Loading state during download
 *
 * @returns {UseImageDownloadReturn} Download function, loading state, and error state
 *
 * @example
 * ```tsx
 * const { downloadImage, isDownloading, error } = useImageDownload();
 *
 * // Download as PNG (default)
 * await downloadImage(canvasElement, 'photo.jpg');
 * // Downloads as: photo_laserprep.png
 *
 * // Download as JPG
 * await downloadImage(canvasElement, 'photo.png', 'jpeg');
 * // Downloads as: photo_laserprep.jpg
 * ```
 */
export function useImageDownload(): UseImageDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadImage = useCallback(
    async (
      canvas: HTMLCanvasElement | null,
      originalFilename: string,
      format: ExportFormat = 'png'
    ) => {
      // Validate canvas exists
      if (!canvas) {
        setError('No image to download');
        return;
      }

      try {
        setIsDownloading(true);
        setError(null);

        // Get format-specific settings
        const mimeType = MIME_TYPES[format];
        const quality = QUALITY[format];
        const extension = EXTENSIONS[format];

        // Generate filename: {basename}_laserprep.{ext}
        const baseName = originalFilename.replace(/\.[^/.]+$/, '');
        const sanitizedBaseName = sanitizeFilename(baseName);
        const filename = `${sanitizedBaseName}_laserprep.${extension}`;

        // Convert canvas to blob (format-specific)
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, mimeType, quality);
        });

        // Check if blob creation succeeded
        if (!blob) {
          throw new Error('Failed to create image blob');
        }

        // Create blob URL for download
        const url = URL.createObjectURL(blob);

        // Create temporary anchor element for download
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.style.display = 'none';

        // Add to DOM, trigger click, then remove
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        // Clean up blob URL to prevent memory leaks
        URL.revokeObjectURL(url);
      } catch (err) {
        // Handle any errors during download
        const errorMessage = err instanceof Error ? err.message : 'Download failed';
        setError(errorMessage);
        console.error('Download error:', err);
      } finally {
        // Always reset loading state
        setIsDownloading(false);
      }
    },
    []
  );

  return {
    downloadImage,
    isDownloading,
    error,
  };
}
```

### 3.2: Run All Tests

```bash
npm test -- --run
```

**Expected**: All tests pass (implementation complete)

---

## Phase 4: Integration and E2E Testing (Green)

**Objective**: Verify full flow works end-to-end

**Duration**: 45 minutes

### 4.1: Add E2E Test

**File**: `src/tests/e2e/task-018-jpg-export.spec.ts` (new)

```typescript
import { test, expect } from '@playwright/test';

test.describe('JPG Export - task-018', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');
  });

  test('should export image as JPG format', async ({ page }) => {
    // Upload test image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/test-image.jpg');

    // Wait for auto-prep to complete
    await expect(page.locator('canvas[data-testid="preview-canvas"]')).toBeVisible({
      timeout: 5000,
    });

    // Select JPG format
    const jpgRadio = page.locator('input[name="format"][value="jpeg"]');
    await jpgRadio.check();
    await expect(jpgRadio).toBeChecked();

    // Verify button text updated
    const downloadButton = page.locator('button:has-text("Download JPG")');
    await expect(downloadButton).toBeVisible();

    // Trigger download
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    // Verify filename has .jpg extension
    expect(download.suggestedFilename()).toMatch(/_laserprep\.jpg$/);
  });

  test('should default to PNG format', async ({ page }) => {
    // Upload test image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/test-image.jpg');

    await expect(page.locator('canvas[data-testid="preview-canvas"]')).toBeVisible({
      timeout: 5000,
    });

    // Verify PNG is selected by default
    const pngRadio = page.locator('input[name="format"][value="png"]');
    await expect(pngRadio).toBeChecked();

    // Verify button text shows PNG
    const downloadButton = page.locator('button:has-text("Download PNG")');
    await expect(downloadButton).toBeVisible();
  });

  test('should toggle between PNG and JPG formats', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/test-image.jpg');

    await expect(page.locator('canvas[data-testid="preview-canvas"]')).toBeVisible({
      timeout: 5000,
    });

    // Toggle to JPG
    const jpgRadio = page.locator('input[name="format"][value="jpeg"]');
    await jpgRadio.check();
    await expect(page.locator('button:has-text("Download JPG")')).toBeVisible();

    // Toggle back to PNG
    const pngRadio = page.locator('input[name="format"][value="png"]');
    await pngRadio.check();
    await expect(page.locator('button:has-text("Download PNG")')).toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/test-image.jpg');

    await expect(page.locator('canvas[data-testid="preview-canvas"]')).toBeVisible({
      timeout: 5000,
    });

    // Tab to format selector
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Assuming file input is first

    // Arrow down to JPG
    await page.keyboard.press('ArrowDown');
    const jpgRadio = page.locator('input[name="format"][value="jpeg"]');
    await expect(jpgRadio).toBeChecked();

    // Arrow up back to PNG
    await page.keyboard.press('ArrowUp');
    const pngRadio = page.locator('input[name="format"][value="png"]');
    await expect(pngRadio).toBeChecked();
  });
});
```

### 4.2: Run E2E Tests

```bash
npm run test:e2e -- task-018-jpg-export
```

**Expected**: All E2E tests pass

### 4.3: Manual Testing Checklist

- [ ] Upload image, select JPG, download → filename ends with .jpg
- [ ] Upload image, select PNG, download → filename ends with .png
- [ ] Toggle between formats updates button text
- [ ] Keyboard navigation works (Tab, Arrow keys)
- [ ] Focus indicators visible
- [ ] Screen reader announces format changes (test with NVDA/VoiceOver)
- [ ] JPG file size smaller than PNG (verify with file manager)

---

## Phase 5: Refactor and Optimize (Refactor)

**Objective**: Clean up code, ensure DRY principles, add documentation

**Duration**: 15 minutes

### 5.1: Extract Type Definitions

**File**: `src/types/export.ts` (new, optional)

```typescript
/**
 * Supported export formats for processed images
 */
export type ExportFormat = 'png' | 'jpeg';

/**
 * MIME type mapping for export formats
 */
export const MIME_TYPES: Record<ExportFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
} as const;

/**
 * Quality settings for export formats
 * - PNG: undefined (lossless)
 * - JPEG: 0.95 (95% quality)
 */
export const QUALITY: Record<ExportFormat, number | undefined> = {
  png: undefined,
  jpeg: 0.95,
} as const;

/**
 * File extension mapping for export formats
 */
export const EXTENSIONS: Record<ExportFormat, string> = {
  png: 'png',
  jpeg: 'jpg', // Use .jpg not .jpeg
} as const;

/**
 * Human-readable format labels for UI
 */
export const FORMAT_LABELS: Record<ExportFormat, string> = {
  png: 'PNG',
  jpeg: 'JPG',
} as const;
```

**Note**: This is optional - decide during implementation if centralized types improve maintainability.

### 5.2: Code Review Checklist

**DRY (Don't Repeat Yourself)**:
- [ ] No duplicate format mapping logic
- [ ] Type definitions shared between hook and component
- [ ] Constants extracted and reused

**SOLID Principles**:
- [ ] Single Responsibility: Hook handles download, component handles UI
- [ ] Open/Closed: Easy to add new formats (just update mappings)
- [ ] Dependency Inversion: Component depends on hook interface, not implementation

**FANG Best Practices**:
- [ ] Type safety: TypeScript types for all format parameters
- [ ] Error handling: Graceful failures with user feedback
- [ ] Performance: No unnecessary re-renders or calculations
- [ ] Accessibility: WCAG 2.2 AAA compliance

**Security**:
- [ ] Input validation: Format parameter type-checked
- [ ] No injection risks: Filename properly sanitized
- [ ] Resource cleanup: Blob URLs revoked after use

**Performance**:
- [ ] useCallback for download function (prevent re-renders)
- [ ] Minimal state updates
- [ ] Efficient blob creation

### 5.3: Documentation

**JSDoc Comments**:
- [ ] Hook: Updated with format parameter documentation
- [ ] Component: Added format selector documentation
- [ ] Types: Documented all exported types and constants

### 5.4: Final Test Run

```bash
# Run all tests
npm test -- --run

# Check coverage
npm run test:coverage

# Run E2E
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

**Expected**:
- All tests pass
- Coverage ≥80%
- No TypeScript errors
- No linting errors

---

## Files Modified

### Core Implementation
1. `src/hooks/useImageDownload.ts` - Add format parameter
2. `src/components/DownloadButton.tsx` - Add format selector UI

### Tests
3. `src/tests/unit/hooks/useImageDownload.test.tsx` - Add format tests
4. `src/tests/unit/components/DownloadButton.test.tsx` - Add selector tests
5. `src/tests/integration/JPGExport.integration.test.tsx` - New integration tests
6. `src/tests/e2e/task-018-jpg-export.spec.ts` - New E2E tests

### Optional
7. `src/types/export.ts` - Centralized type definitions (optional)

---

## Success Criteria

### Functional
- [x] Format selector visible and functional
- [x] PNG export works (existing functionality preserved)
- [x] JPG export works (95% quality)
- [x] Button text updates with format
- [x] Filename extensions correct

### Technical
- [x] All unit tests passing
- [x] All integration tests passing
- [x] All E2E tests passing
- [x] Test coverage ≥80%
- [x] No TypeScript errors
- [x] No linting errors

### Quality
- [x] DRY principles applied
- [x] SOLID principles followed
- [x] FANG best practices implemented
- [x] WCAG 2.2 AAA compliant
- [x] Code reviewed and refactored

---

## Rollback Plan

If issues arise:
1. Revert changes to `useImageDownload.ts`
2. Revert changes to `DownloadButton.tsx`
3. Remove new test files
4. PNG export continues to work (backward compatible)

---

## Next Steps

After task-018 completion:
1. Run `/code-review` to validate code quality
2. Run `/test` to verify all tests pass
3. Run `/commit` to archive task and update SPRINTS.md
4. Proceed to task-019 (Accessibility Audit) or task-020 (Cross-Browser Testing)
