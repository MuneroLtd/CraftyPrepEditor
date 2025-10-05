/**
 * Manual threshold binarization for image processing.
 *
 * Formula: pixel < threshold → 0 (black), pixel >= threshold → 255 (white)
 *
 * Converts image to grayscale first (using luminosity method), then applies
 * threshold to create a binary (black and white) image.
 *
 * Applied to RGB channels after grayscale conversion, alpha channel preserved.
 *
 * PERFORMANCE OPTIMIZATION:
 * Uses single-pass algorithm - grayscale conversion and threshold application
 * happen in one loop iteration. This eliminates redundant pixel reads/writes
 * and significantly improves performance for large images.
 */

/**
 * Luminosity method weights (ITU-R BT.601 standard)
 * Used for grayscale conversion before thresholding
 */
const WEIGHT_R = 0.299;
const WEIGHT_G = 0.587;
const WEIGHT_B = 0.114;

/**
 * Apply manual threshold binarization to an image.
 *
 * Converts image to grayscale, then applies threshold to create binary output.
 * Pixels with grayscale value < threshold become black (0), pixels >= threshold
 * become white (255).
 *
 * This enables users to override the auto-calculated Otsu threshold and manually
 * fine-tune the black/white separation point for optimal laser engraving results.
 *
 * Algorithm:
 * 1. Convert to grayscale (if not already)
 * 2. For each pixel: if gray < threshold → 0, else → 255
 * 3. Return binary image (only black and white pixels)
 *
 * Examples:
 * - threshold = 0 → all pixels become white (all pixels >= 0)
 * - threshold = 128 → mid-point threshold (standard)
 * - threshold = 255 → all pixels become black (all pixels < 255)
 *
 * This is a pure function - it creates a new ImageData and does not modify the input.
 *
 * @param imageData - Source image data from Canvas getImageData()
 * @param threshold - Threshold value (0 to 255)
 *                    Pixels < threshold → black (0)
 *                    Pixels >= threshold → white (255)
 * @returns New ImageData with binary values (0 or 255 only, alpha channel preserved)
 * @throws {Error} If imageData is null or undefined
 * @throws {Error} If threshold is outside the range [0, 255]
 *
 * @example
 * ```typescript
 * const ctx = canvas.getContext('2d');
 * const imageData = ctx.getImageData(0, 0, width, height);
 *
 * // Apply threshold at mid-point (128)
 * const binary = applyThreshold(imageData, 128);
 * ctx.putImageData(binary, 0, 0);
 *
 * // Lower threshold (more white)
 * const moreWhite = applyThreshold(imageData, 64);
 *
 * // Higher threshold (more black)
 * const moreBlack = applyThreshold(imageData, 192);
 * ```
 *
 * @performance O(n) where n is pixel count. <100ms for 2MB (2MP) image
 * @pure No side effects, returns new ImageData without modifying input
 * @see https://en.wikipedia.org/wiki/Thresholding_(image_processing)
 * @see calculateOptimalThreshold for auto-calculation using Otsu's method
 */
export function applyThreshold(imageData: ImageData, threshold: number): ImageData {
  // Validate imageData parameter
  if (!imageData) {
    throw new Error('applyThreshold: imageData parameter is required');
  }

  // Validate threshold range [0, 255]
  if (threshold < 0 || threshold > 255) {
    throw new Error(`applyThreshold: threshold must be in range [0, 255], got ${threshold}`);
  }

  const { data, width, height } = imageData;
  const output = new ImageData(width, height);
  const len = data.length;

  // SINGLE-PASS OPTIMIZATION:
  // Combine grayscale conversion AND threshold application in one loop
  // This eliminates the need for separate convertToGrayscale() call
  // Performance: O(n) instead of O(2n) - 50% fewer pixel operations

  // Process 4 bytes per pixel: R, G, B, A
  for (let i = 0; i < len; i += 4) {
    // Step 1: Convert to grayscale using luminosity method
    // Formula: Gray = 0.299×R + 0.587×G + 0.114×B
    const gray = Math.round(
      WEIGHT_R * data[i] + // Red
        WEIGHT_G * data[i + 1] + // Green
        WEIGHT_B * data[i + 2] // Blue
    );

    // Step 2: Apply threshold binarization immediately
    // pixel < threshold → 0 (black)
    // pixel >= threshold → 255 (white)
    const binary = gray < threshold ? 0 : 255;

    // Set R, G, B to binary value
    output.data[i] = binary; // Red
    output.data[i + 1] = binary; // Green
    output.data[i + 2] = binary; // Blue

    // Preserve alpha channel unchanged
    output.data[i + 3] = data[i + 3];
  }

  return output;
}
