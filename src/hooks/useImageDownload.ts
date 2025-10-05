import { useState, useCallback } from 'react';
import { sanitizeFilename } from '@/lib/utils/sanitizeFilename';

/**
 * Supported export formats for processed images
 */
export type ExportFormat = 'png' | 'jpeg';

/**
 * Return type for useImageDownload hook
 */
interface UseImageDownloadReturn {
  /**
   * Function to download image from canvas as PNG or JPG
   * @param canvas - Canvas element containing the image to download
   * @param originalFilename - Original filename from uploaded file (used to generate download filename)
   * @param format - Export format ('png' or 'jpeg'), defaults to 'png'
   */
  downloadImage: (
    canvas: HTMLCanvasElement | null,
    originalFilename: string,
    format?: ExportFormat
  ) => Promise<void>;
  /**
   * Whether download is currently in progress
   */
  isDownloading: boolean;
  /**
   * Error message if download failed, null otherwise
   */
  error: string | null;
}

// MIME type mapping
const MIME_TYPES = {
  png: 'image/png',
  jpeg: 'image/jpeg',
} as const;

// Quality settings (undefined for lossless formats)
const QUALITY = {
  png: undefined,
  jpeg: 0.95,
} as const;

// File extension mapping
const EXTENSIONS = {
  png: 'png',
  jpeg: 'jpg', // Use .jpg not .jpeg for file extension
} as const;

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
