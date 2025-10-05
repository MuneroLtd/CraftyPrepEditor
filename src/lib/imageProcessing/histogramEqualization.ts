/**
 * Histogram Equalization Algorithm
 *
 * Enhances image contrast by redistributing pixel intensities to utilize
 * the full 0-255 range. Uses cumulative distribution function (CDF) mapping.
 */

/**
 * Calculate histogram of grayscale image
 * @param imageData - Grayscale ImageData (R=G=B)
 * @returns Array of 256 bins with frequency counts
 */
function calculateHistogram(imageData: ImageData): Uint32Array {
  const histogram = new Uint32Array(256);

  // Iterate through pixels (step by 4 for RGBA)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const gray = imageData.data[i]; // R channel (same as G and B in grayscale)
    histogram[gray]++;
  }

  return histogram;
}

/**
 * Compute cumulative distribution function
 * @param histogram - 256-bin histogram
 * @returns CDF array (256 values)
 */
function computeCDF(histogram: Uint32Array): Uint32Array {
  const cdf = new Uint32Array(256);
  cdf[0] = histogram[0];

  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + histogram[i];
  }

  return cdf;
}

/**
 * Normalize CDF to 0-255 range
 * @param cdf - Cumulative distribution function
 * @param totalPixels - Total number of pixels
 * @returns Normalized CDF (lookup table for pixel mapping)
 */
function normalizeCDF(cdf: Uint32Array, totalPixels: number): Uint8ClampedArray {
  const normalized = new Uint8ClampedArray(256);

  // Find first non-zero CDF value (CDF_min)
  let cdfMin = 0;
  for (let i = 0; i < 256; i++) {
    if (cdf[i] > 0) {
      cdfMin = cdf[i];
      break;
    }
  }

  // Normalize each value
  const denominator = totalPixels - cdfMin;
  for (let i = 0; i < 256; i++) {
    if (denominator === 0) {
      // All pixels same value - no equalization possible
      normalized[i] = i;
    } else {
      // Formula: ((CDF[i] - CDF_min) / (total_pixels - CDF_min)) × 255
      normalized[i] = Math.round(((cdf[i] - cdfMin) / denominator) * 255);
    }
  }

  return normalized;
}

/**
 * Apply histogram equalization to enhance contrast
 *
 * Algorithm:
 * 1. Calculate histogram of grayscale values (0-255)
 * 2. Compute cumulative distribution function (CDF)
 * 3. Normalize CDF to 0-255 range
 * 4. Map each pixel value through normalized CDF
 *
 * @param imageData - Grayscale ImageData (R=G=B for all pixels)
 * @returns New ImageData with equalized histogram
 */
export function applyHistogramEqualization(imageData: ImageData): ImageData {
  // Step 1: Calculate histogram
  const histogram = calculateHistogram(imageData);

  // Step 2: Compute CDF
  const cdf = computeCDF(histogram);

  // Step 3: Normalize CDF to create lookup table
  const totalPixels = imageData.width * imageData.height;
  const lookupTable = normalizeCDF(cdf, totalPixels);

  // Step 4: Map pixels through lookup table
  const result = new ImageData(imageData.width, imageData.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const oldValue = imageData.data[i]; // Grayscale value
    const newValue = lookupTable[oldValue]; // Map through equalized CDF

    // Set RGB (all same for grayscale)
    result.data[i] = newValue;
    result.data[i + 1] = newValue;
    result.data[i + 2] = newValue;

    // Preserve alpha
    result.data[i + 3] = imageData.data[i + 3];
  }

  return result;
}
