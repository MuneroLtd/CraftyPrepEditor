/**
 * Luminosity method weights based on human perception
 * ITU-R BT.601 standard for broadcast video
 */
const WEIGHT_R = 0.299;
const WEIGHT_G = 0.587;
const WEIGHT_B = 0.114;

/**
 * Converts an RGB/RGBA image to grayscale using the luminosity method.
 *
 * Uses weighted averages based on human perception:
 * - Red: 29.9% (humans least sensitive to red)
 * - Green: 58.7% (humans most sensitive to green)
 * - Blue: 11.4% (humans least sensitive to blue)
 *
 * Formula: Gray = 0.299 × R + 0.587 × G + 0.114 × B
 *
 * This is the same algorithm used by professional tools like Photoshop and GIMP.
 *
 * @param imageData - Source image data from Canvas getImageData()
 * @returns New ImageData with grayscale values (alpha channel preserved)
 *
 * @example
 * ```typescript
 * const ctx = canvas.getContext('2d');
 * const imageData = ctx.getImageData(0, 0, width, height);
 * const grayscale = convertToGrayscale(imageData);
 * ctx.putImageData(grayscale, 0, 0);
 * ```
 *
 * @performance <1 second for 5MP (2MB) image
 * @pure No side effects, returns new ImageData without modifying input
 */
export function convertToGrayscale(imageData: ImageData): ImageData {
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);
  const len = data.length;

  // Process 4 bytes per pixel: R, G, B, A
  for (let i = 0; i < len; i += 4) {
    // Calculate weighted grayscale value
    const gray = Math.round(
      WEIGHT_R * data[i] + // Red
        WEIGHT_G * data[i + 1] + // Green
        WEIGHT_B * data[i + 2] // Blue
    );

    // Set R, G, B to gray value (creates grayscale)
    output.data[i] = gray;
    output.data[i + 1] = gray;
    output.data[i + 2] = gray;

    // Preserve alpha channel unchanged
    output.data[i + 3] = data[i + 3];
  }

  return output;
}
