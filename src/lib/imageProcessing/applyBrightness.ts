/**
 * Brightness adjustment algorithm for image processing.
 *
 * Formula: newValue = clamp(originalValue + brightness, 0, 255)
 *
 * Applied to RGB channels independently, alpha channel preserved.
 */

import { clamp } from './utils';

/**
 * Apply brightness adjustment to an image.
 *
 * Adjusts brightness by adding a constant value to each RGB channel.
 * Values are clamped to the valid range [0, 255] to prevent overflow/underflow.
 *
 * Formula: newValue = clamp(originalValue + brightness, 0, 255)
 *
 * This is a pure function - it creates a new ImageData and does not modify the input.
 *
 * @param imageData - Source image data from Canvas getImageData()
 * @param brightness - Brightness adjustment value (-100 to +100)
 *                     Positive values brighten, negative values darken
 *                     0 = no change
 * @returns New ImageData with brightness adjusted (alpha channel preserved)
 * @throws {Error} If imageData is null or undefined
 * @throws {Error} If brightness is outside the range [-100, 100]
 *
 * @example
 * ```typescript
 * const ctx = canvas.getContext('2d');
 * const imageData = ctx.getImageData(0, 0, width, height);
 *
 * // Brighten by 50 units
 * const brighter = applyBrightness(imageData, 50);
 * ctx.putImageData(brighter, 0, 0);
 *
 * // Darken by 30 units
 * const darker = applyBrightness(imageData, -30);
 * ctx.putImageData(darker, 0, 0);
 * ```
 *
 * @performance O(n) where n is pixel count. ~50ms for 2MB (5MP) image
 * @pure No side effects, returns new ImageData without modifying input
 */
export function applyBrightness(imageData: ImageData, brightness: number): ImageData {
  // Validate imageData parameter (Issue 3 fix)
  if (!imageData) {
    throw new Error('applyBrightness: imageData parameter is required');
  }

  // Validate brightness range (Issue 2 fix)
  if (brightness < -100 || brightness > 100) {
    throw new Error(`applyBrightness: brightness must be in range [-100, 100], got ${brightness}`);
  }

  const { data, width, height } = imageData;
  const output = new ImageData(width, height);
  const len = data.length;

  // Process 4 bytes per pixel: R, G, B, A
  for (let i = 0; i < len; i += 4) {
    // Apply brightness to R, G, B channels (clamp to 0-255)
    output.data[i] = clamp(data[i] + brightness, 0, 255); // Red
    output.data[i + 1] = clamp(data[i + 1] + brightness, 0, 255); // Green
    output.data[i + 2] = clamp(data[i + 2] + brightness, 0, 255); // Blue

    // Preserve alpha channel unchanged
    output.data[i + 3] = data[i + 3];
  }

  return output;
}
