/**
 * Shared constants for the application
 */

/**
 * Standard responsive padding pattern used across layout components
 * Provides consistent spacing: mobile (px-4), tablet (px-6), desktop (px-8)
 */
export const RESPONSIVE_PADDING = 'px-4 py-6 sm:px-6 lg:px-8';

/**
 * File upload configuration constants
 */
export const FILE_UPLOAD = {
  /** Maximum allowed file size in megabytes */
  MAX_SIZE_MB: 10,
  /** Maximum allowed file size in bytes */
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  /** Threshold for showing progress indicator in megabytes */
  LARGE_FILE_THRESHOLD_MB: 2,
  /** Threshold for showing progress indicator in bytes */
  LARGE_FILE_THRESHOLD_BYTES: 2 * 1024 * 1024,
  /** Maximum allowed image dimension in pixels */
  MAX_DIMENSION_PX: 10000,
  /** Maximum allowed total image pixels (100 megapixels) */
  MAX_MEGAPIXELS: 100_000_000,
} as const;
