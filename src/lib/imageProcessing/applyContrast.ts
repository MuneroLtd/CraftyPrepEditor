/**
 * Contrast adjustment algorithm for image processing.
 *
 * Formula: newValue = clamp(((originalValue - 127) * factor) + 127, 0, 255)
 * Factor: (100 + contrast) / 100
 *
 * Pivots around mid-gray (127) to preserve overall brightness while
 * expanding (positive contrast) or compressing (negative contrast) the dynamic range.
 *
 * Applied to RGB channels independently, alpha channel preserved.
 */

import { clamp } from './utils';

/**
 * Apply contrast adjustment to an image.
 *
 * Adjusts contrast by expanding or compressing pixel values around mid-gray (127).
 * Positive contrast increases dynamic range, negative contrast decreases it.
 *
 * Formula: newValue = clamp(((originalValue - 127) * factor) + 127, 0, 255)
 * Factor: (100 + contrast) / 100
 *
 * Examples:
 * - contrast = 0 → factor = 1.0 (no change)
 * - contrast = 50 → factor = 1.5 (50% increase in contrast)
 * - contrast = -50 → factor = 0.5 (50% decrease in contrast)
 * - contrast = 100 → factor = 2.0 (maximum contrast)
 * - contrast = -100 → factor = 0.0 (all values become 127)
 *
 * This is a pure function - it creates a new ImageData and does not modify the input.
 *
 * @param imageData - Source image data from Canvas getImageData()
 * @param contrast - Contrast adjustment value (-100 to +100)
 *                   Positive values increase contrast, negative values decrease it
 *                   0 = no change
 * @returns New ImageData with contrast adjusted (alpha channel preserved)
 * @throws {Error} If imageData is null or undefined
 * @throws {Error} If contrast is outside the range [-100, 100]
 *
 * @example
 * ```typescript
 * const ctx = canvas.getContext('2d');
 * const imageData = ctx.getImageData(0, 0, width, height);
 *
 * // Increase contrast by 50%
 * const highContrast = applyContrast(imageData, 50);
 * ctx.putImageData(highContrast, 0, 0);
 *
 * // Decrease contrast by 30%
 * const lowContrast = applyContrast(imageData, -30);
 * ctx.putImageData(lowContrast, 0, 0);
 * ```
 *
 * @performance O(n) where n is pixel count. ~50ms for 2MB (5MP) image
 * @pure No side effects, returns new ImageData without modifying input
 * @see https://en.wikipedia.org/wiki/Contrast_(vision)
 */
export function applyContrast(imageData: ImageData, contrast: number): ImageData {
  // Validate imageData parameter
  if (!imageData) {
    throw new Error('applyContrast: imageData parameter is required');
  }

  // Validate contrast range
  if (contrast < -100 || contrast > 100) {
    throw new Error(`applyContrast: contrast must be in range [-100, 100], got ${contrast}`);
  }

  // Calculate contrast factor
  const factor = (100 + contrast) / 100;

  const { data, width, height } = imageData;
  const output = new ImageData(width, height);
  const len = data.length;

  // Process 4 bytes per pixel: R, G, B, A
  for (let i = 0; i < len; i += 4) {
    // Apply contrast to R, G, B channels
    // Formula: ((value - 127) * factor) + 127
    // This pivots around mid-gray (127) to preserve brightness
    output.data[i] = clamp((data[i] - 127) * factor + 127, 0, 255); // Red
    output.data[i + 1] = clamp((data[i + 1] - 127) * factor + 127, 0, 255); // Green
    output.data[i + 2] = clamp((data[i + 2] - 127) * factor + 127, 0, 255); // Blue

    // Preserve alpha channel unchanged
    output.data[i + 3] = data[i + 3];
  }

  return output;
}
