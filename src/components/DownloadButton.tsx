import { useState, useCallback } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useImageDownload, type ExportFormat } from '@/hooks/useImageDownload';

/**
 * Format labels for UI display
 */
const FORMAT_LABELS: Record<ExportFormat, string> = {
  png: 'PNG',
  jpeg: 'JPG',
};

/**
 * Props for DownloadButton component
 */
interface DownloadButtonProps {
  /**
   * Processed image canvas to download (null if no image processed yet)
   */
  canvas: HTMLCanvasElement | null;
  /**
   * Original filename from uploaded file (used to generate download filename)
   */
  originalFilename: string;
  /**
   * Force disable button (optional - auto-disabled if canvas is null)
   */
  disabled?: boolean;
}

/**
 * DownloadButton - Triggers download of processed image as PNG or JPG
 *
 * Exports the processed canvas as a PNG or JPG blob and downloads it with
 * a sanitized filename following the pattern: {original}_laserprep.{ext}
 *
 * Features:
 * - Multi-format support (PNG or JPG)
 * - Format selector with keyboard navigation
 * - Automatic filename generation from original upload
 * - Loading state during download
 * - Error handling with user-friendly messages
 * - Keyboard accessible (Tab, Enter, Space, Arrow keys)
 * - Screen reader support (ARIA labels, live regions)
 *
 * @param canvas - Processed image canvas (from useImageProcessing hook)
 * @param originalFilename - Original uploaded file name (for naming)
 * @param disabled - Force disable button (optional)
 *
 * @example
 * ```tsx
 * <DownloadButton
 *   canvas={processedImage}
 *   originalFilename="photo.jpg"
 * />
 * // Downloads as: photo_laserprep.png (default) or photo_laserprep.jpg (if JPG selected)
 * ```
 */
export function DownloadButton({
  canvas,
  originalFilename,
  disabled = false,
}: DownloadButtonProps) {
  const { downloadImage, isDownloading, error } = useImageDownload();
  const [format, setFormat] = useState<ExportFormat>('png');

  const handleClick = useCallback(() => {
    downloadImage(canvas, originalFilename, format);
  }, [downloadImage, canvas, originalFilename, format]);

  // Button is disabled if:
  // - Explicitly disabled via prop
  // - No canvas available
  // - Currently downloading
  const isDisabled = disabled || !canvas || isDownloading;

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
        aria-label={`Download processed image as ${FORMAT_LABELS[format]}`}
        aria-disabled={isDisabled}
        className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors flex items-center space-x-2
                   focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isDownloading ? (
          <>
            {/* Loading spinner */}
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
            <span>Download {FORMAT_LABELS[format]}</span>
          </>
        )}
      </button>

      {/* Error message (if download failed) */}
      {error && (
        <div className="text-sm text-red-600" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </div>
  );
}
