/**
 * Tests for Background Removal Pipeline Integration
 *
 * Verifies that background removal integrates correctly with other pipeline steps
 * and that alpha channel is preserved through histogram equalization, threshold, and brightness.
 */

import { describe, it, expect } from 'vitest';
import {
  removeBackground,
  convertToGrayscale,
  applyHistogramEqualization,
  applyOtsuThreshold,
  applyBrightness,
} from '@/lib/imageProcessing';

describe('Background Removal Pipeline Integration', () => {
  function createTestImageData(): ImageData {
    // Create a 100x100 test image: white background with black center
    const imageData = new ImageData(100, 100);
    const { data } = imageData;

    // Fill with white (255,255,255)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255; // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
      data[i + 3] = 255; // A
    }

    // Draw black square in center (40x40 pixels, from 30 to 70)
    for (let y = 30; y < 70; y++) {
      for (let x = 30; x < 70; x++) {
        const idx = (y * 100 + x) * 4;
        data[idx] = 0; // R
        data[idx + 1] = 0; // G
        data[idx + 2] = 0; // B
        // Alpha stays 255
      }
    }

    return imageData;
  }

  it('pipeline: grayscale → background removal → produces correct transparency', () => {
    const imageData = createTestImageData();

    // Step 1: Grayscale
    let processed = convertToGrayscale(imageData);

    // Step 2: Background removal
    processed = removeBackground(processed, 50);

    // Verify corner pixel (white background) is transparent
    const cornerAlpha = processed.data[3];
    expect(cornerAlpha).toBe(0);

    // Verify center pixel (black foreground) is opaque
    const centerIdx = (50 * 100 + 50) * 4;
    const centerAlpha = processed.data[centerIdx + 3];
    expect(centerAlpha).toBe(255);
  });

  it('preserves alpha through histogram equalization', () => {
    const imageData = createTestImageData();

    // Grayscale → background removal
    let processed = convertToGrayscale(imageData);
    processed = removeBackground(processed, 50);

    // Histogram equalization should preserve alpha (pass preserveAlpha = true)
    processed = applyHistogramEqualization(processed, true);

    // Background should still be transparent
    const backgroundAlpha = processed.data[3];
    expect(backgroundAlpha).toBe(0);

    // Foreground should still be opaque
    const foregroundIdx = (50 * 100 + 50) * 4;
    const foregroundAlpha = processed.data[foregroundIdx + 3];
    expect(foregroundAlpha).toBe(255);
  });

  it('preserves alpha through Otsu threshold', () => {
    const imageData = createTestImageData();

    // Grayscale → background removal → histogram equalization (with alpha preservation)
    let processed = convertToGrayscale(imageData);
    processed = removeBackground(processed, 50);
    processed = applyHistogramEqualization(processed, true);

    // Apply threshold (should preserve alpha)
    processed = applyOtsuThreshold(processed);

    // Background should still be transparent
    const backgroundAlpha = processed.data[3];
    expect(backgroundAlpha).toBe(0);

    // Foreground should still be opaque
    const foregroundIdx = (50 * 100 + 50) * 4;
    const foregroundAlpha = processed.data[foregroundIdx + 3];
    expect(foregroundAlpha).toBe(255);
  });

  it('preserves alpha through brightness adjustment', () => {
    const imageData = createTestImageData();

    // Full pipeline: grayscale → background removal → histogram (preserve alpha) → threshold
    let processed = convertToGrayscale(imageData);
    processed = removeBackground(processed, 50);
    processed = applyHistogramEqualization(processed, true);
    processed = applyOtsuThreshold(processed);

    // Apply brightness adjustment (should preserve alpha)
    processed = applyBrightness(processed, 50);

    // Background should still be transparent
    const backgroundAlpha = processed.data[3];
    expect(backgroundAlpha).toBe(0);

    // Foreground should still be opaque
    const foregroundIdx = (50 * 100 + 50) * 4;
    const foregroundAlpha = processed.data[foregroundIdx + 3];
    expect(foregroundAlpha).toBe(255);
  });

  it('end-to-end pipeline with background removal', () => {
    const imageData = createTestImageData();

    // Complete pipeline with alpha preservation
    let processed = convertToGrayscale(imageData);
    processed = removeBackground(processed, 75);
    processed = applyHistogramEqualization(processed, true);
    processed = applyOtsuThreshold(processed);
    processed = applyBrightness(processed, 25);

    // Verify final result has transparency
    const hasTransparency = processed.data.some((value, idx) => {
      if ((idx + 1) % 4 === 0) {
        // Alpha channel
        return value === 0;
      }
      return false;
    });

    expect(hasTransparency).toBe(true);

    // Verify foreground still exists
    const foregroundIdx = (50 * 100 + 50) * 4;
    const foregroundAlpha = processed.data[foregroundIdx + 3];
    expect(foregroundAlpha).toBe(255);
  });
});
