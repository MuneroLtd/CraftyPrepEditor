import { useState, useCallback } from 'react';
import { sanitizeFilename } from '@/lib/utils/sanitizeFilename';

/**
 * Return type for useImageDownload hook
 */
interface UseImageDownloadReturn {
  /**
   * Function to download image from canvas as PNG
   * @param canvas - Canvas element containing the image to download
   * @param originalFilename - Original filename from uploaded file (used to generate download filename)
   */
  downloadImage: (canvas: HTMLCanvasElement | null, originalFilename: string) => Promise<void>;
  /**
   * Whether download is currently in progress
   */
  isDownloading: boolean;
  /**
   * Error message if download failed, null otherwise
   */
  error: string | null;
}

/**
 * Hook for downloading processed images as PNG files.
 *
 * Converts a canvas element to a PNG blob and triggers browser download
 * with a sanitized filename following the pattern: {original}_laserprep.png
 *
 * Features:
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
 * // Trigger download
 * await downloadImage(canvasElement, 'my-photo.jpg');
 * // Downloads as: my-photo_laserprep.png
 * ```
 */
export function useImageDownload(): UseImageDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadImage = useCallback(
    async (canvas: HTMLCanvasElement | null, originalFilename: string) => {
      // Validate canvas exists
      if (!canvas) {
        setError('No image to download');
        return;
      }

      try {
        setIsDownloading(true);
        setError(null);

        // Generate filename: {basename}_laserprep.png
        // Remove extension from original filename
        const baseName = originalFilename.replace(/\.[^/.]+$/, '');
        // Sanitize special characters
        const sanitizedBaseName = sanitizeFilename(baseName);
        // Add suffix and PNG extension
        const filename = `${sanitizedBaseName}_laserprep.png`;

        // Convert canvas to PNG blob (asynchronous)
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/png');
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
