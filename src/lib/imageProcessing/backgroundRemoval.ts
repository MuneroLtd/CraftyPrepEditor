/**
 * Background Removal Algorithm
 *
 * Uses flood-fill to detect and remove solid/near-solid backgrounds,
 * making them transparent.
 *
 * Algorithm:
 * 1. Sample background color from image corners
 * 2. Flood-fill from corners to mark background pixels
 * 3. Set background pixels to transparent (alpha = 0)
 */

/**
 * RGB color type
 */
export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * Get image corner coordinates.
 *
 * @param width - Image width
 * @param height - Image height
 * @returns Array of corner {x, y} coordinates [top-left, top-right, bottom-left, bottom-right]
 */
function getImageCorners(width: number, height: number): Array<{ x: number; y: number }> {
  return [
    { x: 0, y: 0 }, // top-left
    { x: width - 1, y: 0 }, // top-right
    { x: 0, y: height - 1 }, // bottom-left
    { x: width - 1, y: height - 1 }, // bottom-right
  ];
}

/**
 * Sample background color from image corners.
 *
 * Assumes background is the most common color in the 4 corners.
 *
 * @param imageData - Grayscale ImageData
 * @returns Dominant corner color
 */
export function sampleBackgroundColor(imageData: ImageData): RGB {
  const { data, width, height } = imageData;

  // Get corner coordinates
  const corners = getImageCorners(width, height);

  // Collect colors from corners
  const colors: RGB[] = corners.map(({ x, y }) => {
    const pixelIdx = y * width + x;
    const idx = pixelIdx * 4;
    return {
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2],
    };
  });

  // Find most common color (mode)
  const colorCounts = new Map<string, { color: RGB; count: number }>();

  colors.forEach((color) => {
    const key = `${color.r},${color.g},${color.b}`;
    const existing = colorCounts.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorCounts.set(key, { color, count: 1 });
    }
  });

  // Return color with highest count
  let maxCount = 0;
  let dominantColor: RGB = colors[0];

  colorCounts.forEach(({ color, count }) => {
    if (count > maxCount) {
      maxCount = count;
      dominantColor = color;
    }
  });

  return dominantColor;
}

/**
 * Calculate Euclidean distance between two colors in RGB space.
 *
 * @param c1 - First color
 * @param c2 - Second color
 * @returns Distance (0-441, where 441 = sqrt(255^2 * 3))
 */
function colorDistance(c1: RGB, c2: RGB): number {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Flood-fill algorithm using BFS (queue-based, no recursion).
 *
 * Marks all connected pixels within tolerance threshold of target color.
 *
 * Safety limits:
 * - Max queue size: 1,000,000 pixels (prevents DoS on large regions)
 * - Throws error if limit exceeded
 *
 * @param imageData - Grayscale ImageData
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param targetColor - Color to match
 * @param tolerance - Maximum color distance to include (0-255)
 * @returns Set of pixel indices to fill
 * @throws Error if queue size exceeds safety limit
 */
export function floodFill(
  imageData: ImageData,
  startX: number,
  startY: number,
  targetColor: RGB,
  tolerance: number
): Set<number> {
  const { data, width, height } = imageData;
  const visited = new Set<number>();
  const toFill = new Set<number>();
  const queue: Array<{ x: number; y: number }> = [];

  // Safety limit to prevent DoS attacks
  const MAX_QUEUE_SIZE = 1_000_000;

  // Start from given coordinates
  queue.push({ x: startX, y: startY });

  while (queue.length > 0) {
    // Check queue size limit
    if (queue.length > MAX_QUEUE_SIZE) {
      throw new Error(
        `Flood-fill queue exceeded safety limit (${MAX_QUEUE_SIZE} pixels). Image may be too large or background too complex.`
      );
    }
    const { x, y } = queue.shift()!;

    // Check bounds
    if (x < 0 || x >= width || y < 0 || y >= height) {
      continue;
    }

    const pixelIdx = y * width + x;

    // Skip if already visited
    if (visited.has(pixelIdx)) {
      continue;
    }

    visited.add(pixelIdx);

    // Get pixel color
    const dataIdx = pixelIdx * 4;
    const pixelColor: RGB = {
      r: data[dataIdx],
      g: data[dataIdx + 1],
      b: data[dataIdx + 2],
    };

    // Check if pixel matches target color (within tolerance)
    const distance = colorDistance(pixelColor, targetColor);

    if (distance <= tolerance) {
      // Mark for filling
      toFill.add(pixelIdx);

      // Add neighbors to queue (4-directional)
      queue.push({ x: x + 1, y }); // Right
      queue.push({ x: x - 1, y }); // Left
      queue.push({ x, y: y + 1 }); // Down
      queue.push({ x, y: y - 1 }); // Up
    }
    // else: pixel too different, stop flood-fill in this direction
  }

  return toFill;
}

/**
 * Remove background from image by setting matching pixels to transparent.
 *
 * Algorithm:
 * 1. Sample background color from corners
 * 2. Flood-fill from each corner to find connected background pixels
 * 3. Set background pixels alpha = 0 (transparent)
 *
 * @param imageData - Grayscale ImageData
 * @param sensitivity - Color difference tolerance (0-255)
 *   - 0 = Only exact matches removed
 *   - 255 = Very aggressive removal
 * @returns New ImageData with background removed (RGBA with alpha channel)
 */
export function removeBackground(imageData: ImageData, sensitivity: number): ImageData {
  const { data, width, height } = imageData;

  // Step 1: Sample background color from corners
  const bgColor = sampleBackgroundColor(imageData);

  // Step 2: Flood-fill from all 4 corners to find background pixels
  const backgroundPixels = new Set<number>();

  // Use shared corner coordinates helper
  const corners = getImageCorners(width, height);

  corners.forEach(({ x, y }) => {
    const filled = floodFill(imageData, x, y, bgColor, sensitivity);
    filled.forEach((pixelIdx) => backgroundPixels.add(pixelIdx));
  });

  // Step 3: Create result with transparent background
  const result = new ImageData(width, height);

  for (let i = 0; i < data.length; i += 4) {
    const pixelIdx = i / 4;

    if (backgroundPixels.has(pixelIdx)) {
      // Background pixel - set to transparent
      result.data[i] = data[i]; // R (preserve for debugging)
      result.data[i + 1] = data[i + 1]; // G
      result.data[i + 2] = data[i + 2]; // B
      result.data[i + 3] = 0; // A = 0 (transparent)
    } else {
      // Foreground pixel - preserve as-is
      result.data[i] = data[i]; // R
      result.data[i + 1] = data[i + 1]; // G
      result.data[i + 2] = data[i + 2]; // B
      result.data[i + 3] = 255; // A = 255 (opaque)
    }
  }

  return result;
}
