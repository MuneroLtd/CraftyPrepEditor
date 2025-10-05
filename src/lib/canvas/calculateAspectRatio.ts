/**
 * Canvas utility for calculating aspect ratio-preserving dimensions
 * @module lib/canvas/calculateAspectRatio
 */

export interface Dimensions {
  width: number;
  height: number;
}

export interface DrawPosition extends Dimensions {
  x: number;
  y: number;
}

/**
 * Calculate scaled dimensions and position to fit image within canvas
 * while preserving aspect ratio and centering.
 *
 * @param image - Source image dimensions
 * @param canvas - Target canvas dimensions
 * @returns Scaled width, height, and centered x, y position
 *
 * @example
 * ```typescript
 * // Landscape image on standard canvas
 * const result = calculateAspectRatio(
 *   { width: 1600, height: 800 },  // 2:1 image
 *   { width: 800, height: 600 }    // 4:3 canvas
 * );
 * // Returns: { width: 800, height: 400, x: 0, y: 100 }
 * ```
 */
export function calculateAspectRatio(image: Dimensions, canvas: Dimensions): DrawPosition {
  const imageRatio = image.width / image.height;
  const canvasRatio = canvas.width / canvas.height;

  let width: number;
  let height: number;

  if (imageRatio > canvasRatio) {
    // Image is wider than canvas - fit to width
    width = canvas.width;
    height = width / imageRatio;
  } else {
    // Image is taller than canvas - fit to height
    height = canvas.height;
    width = height * imageRatio;
  }

  // Center the image
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  return { width, height, x, y };
}
