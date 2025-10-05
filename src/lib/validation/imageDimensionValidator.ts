import type { ValidationResult } from './types';
import { FILE_UPLOAD } from '@/lib/constants';

/**
 * Validates image dimensions against maximum limits.
 * - Maximum width: 10000px
 * - Maximum height: 10000px
 * - Maximum total pixels: 100 megapixels
 *
 * @param img - The image element to validate
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateImageDimensions(img: HTMLImageElement): ValidationResult {
  const MAX_DIMENSION = FILE_UPLOAD.MAX_DIMENSION_PX;
  const MAX_MEGAPIXELS = FILE_UPLOAD.MAX_MEGAPIXELS;

  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const totalPixels = width * height;

  // Check total pixel count (memory limit) first, as it's more important for security
  if (totalPixels > MAX_MEGAPIXELS) {
    return {
      valid: false,
      error: 'Image is too complex to process. Please use a smaller image.',
    };
  }

  // Check dimension limits
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return {
      valid: false,
      error: 'Image dimensions too large. Maximum is 10000×10000 pixels.',
    };
  }

  return { valid: true };
}
