/**
 * Background Removal Algorithm Tests
 *
 * Tests for background sampling, flood-fill, and background removal.
 */

import { describe, it, expect } from 'vitest';
import {
  sampleBackgroundColor,
  floodFill,
  removeBackground,
} from '@/lib/imageProcessing/backgroundRemoval';

describe('sampleBackgroundColor', () => {
  it('samples dominant color from image corners', () => {
    const imageData = new ImageData(10, 10);
    const { data } = imageData;

    // Fill entire image with white
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255; // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
      data[i + 3] = 255; // A
    }

    // Set all 4 corners to black (should be detected as background)
    const corners = [
      0, // top-left
      9, // top-right
      90, // bottom-left
      99, // bottom-right
    ];

    corners.forEach((idx) => {
      const i = idx * 4;
      data[i] = 0; // R
      data[i + 1] = 0; // G
      data[i + 2] = 0; // B
    });

    const bgColor = sampleBackgroundColor(imageData);

    // Background color should be black (most common in corners)
    expect(bgColor).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('handles single-color image', () => {
    const imageData = new ImageData(5, 5);
    const { data } = imageData;

    // Fill with red
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255; // R
      data[i + 1] = 0; // G
      data[i + 2] = 0; // B
      data[i + 3] = 255; // A
    }

    const bgColor = sampleBackgroundColor(imageData);

    // Should detect red
    expect(bgColor).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe('floodFill', () => {
  it('marks connected pixels within tolerance', () => {
    const imageData = new ImageData(5, 5);
    const { data } = imageData;

    // Fill with white (255,255,255)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255; // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
      data[i + 3] = 255; // A
    }

    // Create black center pixel (3x3 grid, center = index 12)
    const centerIdx = 12 * 4; // pixel 12
    data[centerIdx] = 0;
    data[centerIdx + 1] = 0;
    data[centerIdx + 2] = 0;

    const targetColor = { r: 255, g: 255, b: 255 };
    const tolerance = 10;

    const filledPixels = floodFill(imageData, 0, 0, targetColor, tolerance);

    // Should fill all white pixels (24 out of 25, excluding center black pixel)
    expect(filledPixels.size).toBe(24);
    expect(filledPixels.has(12)).toBe(false); // Center black pixel not filled
  });

  it('respects tolerance threshold', () => {
    const imageData = new ImageData(3, 3);
    const { data } = imageData;

    // Set pixels with varying shades in a connected pattern:
    // Row 0: (250,250,250), (245,245,245), (100,100,100)
    // Row 1: (240,240,240), (230,230,230), (50,50,50)
    // Row 2: (220,220,220), (210,210,210), (0,0,0)

    const pattern = [
      250,
      245,
      100, // Row 0
      240,
      230,
      50, // Row 1
      220,
      210,
      0, // Row 2
    ];

    for (let i = 0; i < 9; i++) {
      const idx = i * 4;
      data[idx] = pattern[i];
      data[idx + 1] = pattern[i];
      data[idx + 2] = pattern[i];
      data[idx + 3] = 255;
    }

    const targetColor = { r: 250, g: 250, b: 250 };
    const tolerance = 30; // Should fill pixels within 30 units of target

    const filledPixels = floodFill(imageData, 0, 0, targetColor, tolerance);

    // Starting at (0,0) with value 250:
    // - (0,0) = 250 ✓ (distance 0)
    // - (1,0) = 245 ✓ (distance ~8.66)
    // - (0,1) = 240 ✓ (distance ~17.32)
    // - (1,1) = 230 ✓ (distance ~34.64) - JUST outside tolerance!
    // - (0,2) = 220 ✓ (distance ~51.96) - outside tolerance
    // Should fill: 250, 245, 240 (3 pixels connected within tolerance)
    expect(filledPixels.size).toBe(3);
  });

  it('handles non-connected regions (no fill across gaps)', () => {
    const imageData = new ImageData(5, 1);
    const { data } = imageData;

    // Pattern: white, white, black (barrier), white, white
    data[0] = 255;
    data[1] = 255;
    data[2] = 255;
    data[3] = 255; // Pixel 0
    data[4] = 255;
    data[5] = 255;
    data[6] = 255;
    data[7] = 255; // Pixel 1
    data[8] = 0;
    data[9] = 0;
    data[10] = 0;
    data[11] = 255; // Pixel 2 (black barrier)
    data[12] = 255;
    data[13] = 255;
    data[14] = 255;
    data[15] = 255; // Pixel 3
    data[16] = 255;
    data[17] = 255;
    data[18] = 255;
    data[19] = 255; // Pixel 4

    const targetColor = { r: 255, g: 255, b: 255 };
    const tolerance = 10;

    const filledPixels = floodFill(imageData, 0, 0, targetColor, tolerance);

    // Should only fill pixels 0 and 1 (stopped by black barrier at pixel 2)
    expect(filledPixels.size).toBe(2);
    expect(filledPixels.has(0)).toBe(true);
    expect(filledPixels.has(1)).toBe(true);
    expect(filledPixels.has(3)).toBe(false); // Not connected
    expect(filledPixels.has(4)).toBe(false); // Not connected
  });
});

describe('removeBackground', () => {
  it('removes background pixels by setting alpha to 0', () => {
    const imageData = new ImageData(5, 5);
    const { data } = imageData;

    // Fill with white background
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }

    // Create black foreground object in center (3x3 grid, center pixel)
    const centerIdx = 12 * 4; // pixel 12
    data[centerIdx] = 0;
    data[centerIdx + 1] = 0;
    data[centerIdx + 2] = 0;

    const sensitivity = 10; // Low tolerance
    const result = removeBackground(imageData, sensitivity);

    // Background (white) pixels should be transparent (alpha = 0)
    expect(result.data[3]).toBe(0); // Top-left corner alpha
    expect(result.data[7]).toBe(0); // Another background pixel alpha

    // Foreground (black center) pixel should remain opaque (alpha = 255)
    expect(result.data[centerIdx + 3]).toBe(255); // Center pixel alpha
  });

  it('preserves foreground with correct RGB values', () => {
    const imageData = new ImageData(3, 3);
    const { data } = imageData;

    // Fill with white background
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }

    // Center pixel = red foreground
    const centerIdx = 4 * 4; // pixel 4 (center of 3x3)
    data[centerIdx] = 255; // R
    data[centerIdx + 1] = 0; // G
    data[centerIdx + 2] = 0; // B

    const result = removeBackground(imageData, 50);

    // Center red pixel should be preserved with RGB intact
    expect(result.data[centerIdx]).toBe(255); // R
    expect(result.data[centerIdx + 1]).toBe(0); // G
    expect(result.data[centerIdx + 2]).toBe(0); // B
    expect(result.data[centerIdx + 3]).toBe(255); // A (opaque)
  });

  it('handles all-same-color image gracefully', () => {
    const imageData = new ImageData(3, 3);
    const { data } = imageData;

    // Fill with gray
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 128;
      data[i + 1] = 128;
      data[i + 2] = 128;
      data[i + 3] = 255;
    }

    const result = removeBackground(imageData, 10);

    // All pixels match background → all transparent
    const allTransparent = result.data.every((value, idx) => {
      if ((idx + 1) % 4 === 0) {
        // Alpha channel
        return value === 0;
      }
      return true; // Don't care about RGB
    });

    expect(allTransparent).toBe(true);
  });

  it('adjusts removal based on sensitivity', () => {
    const imageData = new ImageData(3, 3);
    const { data } = imageData;

    // Background: (200,200,200)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 200;
      data[i + 1] = 200;
      data[i + 2] = 200;
      data[i + 3] = 255;
    }

    // Center pixel: (180,180,180) - slightly different
    const centerIdx = 4 * 4;
    data[centerIdx] = 180;
    data[centerIdx + 1] = 180;
    data[centerIdx + 2] = 180;

    // Low sensitivity (10) - center pixel too different, not removed
    const resultLow = removeBackground(imageData, 10);
    expect(resultLow.data[centerIdx + 3]).toBe(255); // Still opaque

    // High sensitivity (50) - center pixel within tolerance, removed
    const resultHigh = removeBackground(imageData, 50);
    expect(resultHigh.data[centerIdx + 3]).toBe(0); // Transparent
  });
});
