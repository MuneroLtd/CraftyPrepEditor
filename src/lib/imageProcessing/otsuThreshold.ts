/**
 * Otsu's Threshold Algorithm
 *
 * Implements Otsu's method for automatic optimal threshold calculation
 * and image binarization. This algorithm maximizes between-class variance
 * to find the optimal threshold that separates foreground from background.
 *
 * Reference: Otsu, N. (1979). "A Threshold Selection Method from Gray-Level Histograms"
 */

/**
 * Calculate the optimal threshold using Otsu's method
 *
 * Otsu's method finds the threshold that maximizes between-class variance,
 * effectively separating the image into foreground and background classes.
 *
 * Algorithm:
 * 1. Calculate histogram of grayscale intensities (0-255)
 * 2. Compute probability distribution from histogram
 * 3. For each possible threshold (0-255):
 *    - Calculate class weights (w₀, w₁)
 *    - Calculate class means (μ₀, μ₁)
 *    - Calculate between-class variance: σ²ʙ = w₀ × w₁ × (μ₀ - μ₁)²
 * 4. Select threshold with maximum between-class variance
 *
 * @param imageData - Grayscale ImageData to analyze
 * @returns Optimal threshold value (0-255)
 */
export function calculateOptimalThreshold(imageData: ImageData): number {
  const { data, width, height } = imageData;
  const totalPixels = width * height;

  // Step 1: Calculate histogram
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i]; // Grayscale value (R channel, since all R=G=B)
    histogram[gray]++;
  }

  // Step 2: Calculate probability distribution
  const probability = histogram.map((count) => count / totalPixels);

  // Step 3: Calculate cumulative sums for optimization
  // This avoids O(n²) complexity by pre-computing cumulative values
  const cumulativeWeight = new Array(256);
  const cumulativeMean = new Array(256);

  cumulativeWeight[0] = probability[0];
  cumulativeMean[0] = 0 * probability[0];

  for (let i = 1; i < 256; i++) {
    cumulativeWeight[i] = cumulativeWeight[i - 1] + probability[i];
    cumulativeMean[i] = cumulativeMean[i - 1] + i * probability[i];
  }

  const totalMean = cumulativeMean[255];

  // Step 4: Find threshold with maximum between-class variance
  let maxVariance = 0;
  let optimalThreshold = 0;

  for (let t = 0; t < 256; t++) {
    const w0 = cumulativeWeight[t]; // Weight of class 0 (background)
    const w1 = 1 - w0; // Weight of class 1 (foreground)

    // Skip if either class is empty or too small
    if (w0 === 0 || w1 === 0 || w0 < 0.0001 || w1 < 0.0001) {
      continue;
    }

    const mu0 = cumulativeMean[t] / w0; // Mean of class 0
    const mu1 = (totalMean - cumulativeMean[t]) / w1; // Mean of class 1

    // Between-class variance: σ²ʙ = w₀ × w₁ × (μ₀ - μ₁)²
    const variance = w0 * w1 * Math.pow(mu0 - mu1, 2);

    if (variance > maxVariance) {
      maxVariance = variance;
      optimalThreshold = t;
    }
  }

  // Handle edge case: if no valid threshold found (uniform image), return midpoint
  if (maxVariance === 0) {
    // Find min and max intensities in histogram
    let minIntensity = 0;
    let maxIntensity = 255;

    for (let i = 0; i < 256; i++) {
      if (histogram[i] > 0) {
        minIntensity = i;
        break;
      }
    }

    for (let i = 255; i >= 0; i--) {
      if (histogram[i] > 0) {
        maxIntensity = i;
        break;
      }
    }

    // Return midpoint between min and max
    optimalThreshold = Math.floor((minIntensity + maxIntensity) / 2);
  }

  return optimalThreshold;
}

/**
 * Apply Otsu's threshold to binarize an image
 *
 * This function calculates the optimal threshold using Otsu's method
 * and then binarizes the image by setting pixels below the threshold
 * to black (0) and pixels at or above the threshold to white (255).
 *
 * The result is a high-contrast black-and-white image optimized for
 * laser engraving applications.
 *
 * @param imageData - Grayscale ImageData to binarize
 * @returns Binarized ImageData (pure black and white)
 */
export function applyOtsuThreshold(imageData: ImageData): ImageData {
  const { width, height, data } = imageData;

  // Calculate optimal threshold
  const threshold = calculateOptimalThreshold(imageData);

  // Create new ImageData for output
  const output = new ImageData(width, height);
  const outputData = output.data;

  // Apply binarization
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i];

    // Binarize: < threshold → 0 (black), >= threshold → 255 (white)
    const binaryValue = gray < threshold ? 0 : 255;

    outputData[i] = binaryValue; // R
    outputData[i + 1] = binaryValue; // G
    outputData[i + 2] = binaryValue; // B
    outputData[i + 3] = data[i + 3]; // A (preserve alpha channel from input)
  }

  return output;
}
