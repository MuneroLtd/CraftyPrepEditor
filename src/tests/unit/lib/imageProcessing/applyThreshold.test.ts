/**
 * Unit tests for applyThreshold function
 *
 * Tests manual threshold binarization algorithm.
 * Formula: pixel < threshold → 0 (black), pixel >= threshold → 255 (white)
 */

import { describe, it, expect } from 'vitest';
import { applyThreshold } from '@/lib/imageProcessing/applyThreshold';

describe('applyThreshold', () => {
  // Helper to create test ImageData
  // Accepts either:
  // - Array of numbers for grayscale pixels: [100, 150, 200]
  // - Array of [R,G,B,A] arrays for RGB pixels: [[100,150,200], [50,100,150]]
  function createTestImageData(pixels: (number | number[])[]): ImageData {
    const width = pixels.length;
    const height = 1; // Single row of pixels
    const imageData = new ImageData(width, height);

    for (let x = 0; x < width; x++) {
      const index = x * 4;
      const pixel = pixels[x];
      const [r, g, b, a = 255] = Array.isArray(pixel) ? pixel : [pixel, pixel, pixel];
      imageData.data[index] = r;
      imageData.data[index + 1] = g;
      imageData.data[index + 2] = b;
      imageData.data[index + 3] = a;
    }

    return imageData;
  }

  describe('Basic Functionality', () => {
    it('should create new ImageData without modifying input', () => {
      const input = createTestImageData([[127, 127, 127]]);
      const inputCopy = new Uint8ClampedArray(input.data);

      const result = applyThreshold(input, 128);

      // Input should be unchanged
      expect(input.data).toEqual(inputCopy);
      // Result should be a different instance
      expect(result).not.toBe(input);
    });

    it('should return ImageData with same dimensions', () => {
      const input = new ImageData(10, 20);
      const result = applyThreshold(input, 128);

      expect(result.width).toBe(10);
      expect(result.height).toBe(20);
    });

    it('should preserve alpha channel', () => {
      const input = createTestImageData([[100, 150, 200, 128]]);
      const result = applyThreshold(input, 128);

      expect(result.data[3]).toBe(128); // Alpha unchanged
    });
  });

  describe('Threshold Values', () => {
    it('should produce all white with threshold = 0', () => {
      // All pixels >= 0, so all become white (255)
      const input = createTestImageData([0, 50, 127, 200, 255]);
      const result = applyThreshold(input, 0);

      // All pixels should be 255 (white)
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBe(255); // R
        expect(result.data[i + 1]).toBe(255); // G
        expect(result.data[i + 2]).toBe(255); // B
      }
    });

    it('should produce all black with threshold = 255', () => {
      // All pixels < 255, so all become black (0)
      const input = createTestImageData([0, 50, 127, 200, 254]);
      const result = applyThreshold(input, 255);

      // All pixels should be 0 (black)
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBe(0); // R
        expect(result.data[i + 1]).toBe(0); // G
        expect(result.data[i + 2]).toBe(0); // B
      }
    });

    it('should binarize at threshold = 128', () => {
      // Values < 128 → 0 (black)
      // Values >= 128 → 255 (white)
      const input = createTestImageData([50, 100, 127, 128, 200]);
      const result = applyThreshold(input, 128);

      expect(result.data[0]).toBe(0); // 50 < 128 → 0
      expect(result.data[4]).toBe(0); // 100 < 128 → 0
      expect(result.data[8]).toBe(0); // 127 < 128 → 0
      expect(result.data[12]).toBe(255); // 128 >= 128 → 255
      expect(result.data[16]).toBe(255); // 200 >= 128 → 255
    });
  });

  describe('Binarization Logic', () => {
    it('should apply pixel < threshold → 0 (black)', () => {
      const input = createTestImageData([100]);
      const result = applyThreshold(input, 128);

      expect(result.data[0]).toBe(0); // R
      expect(result.data[1]).toBe(0); // G
      expect(result.data[2]).toBe(0); // B
    });

    it('should apply pixel >= threshold → 255 (white)', () => {
      const input = createTestImageData([150]);
      const result = applyThreshold(input, 128);

      expect(result.data[0]).toBe(255); // R
      expect(result.data[1]).toBe(255); // G
      expect(result.data[2]).toBe(255); // B
    });

    it('should handle boundary value (pixel == threshold)', () => {
      const input = createTestImageData([128]);
      const result = applyThreshold(input, 128);

      // 128 >= 128 → 255 (white)
      expect(result.data[0]).toBe(255); // R
      expect(result.data[1]).toBe(255); // G
      expect(result.data[2]).toBe(255); // B
    });
  });

  describe('Grayscale Handling', () => {
    it('should convert RGB to grayscale before thresholding', () => {
      // Create RGB image (not grayscale)
      const input = new ImageData(1, 1);
      input.data[0] = 100; // R
      input.data[1] = 200; // G
      input.data[2] = 50; // B
      input.data[3] = 255; // A

      const result = applyThreshold(input, 128);

      // After grayscale conversion: 0.299*100 + 0.587*200 + 0.114*50 = 153.1 ≈ 153
      // 153 >= 128 → 255 (white)
      expect(result.data[0]).toBe(255); // R
      expect(result.data[1]).toBe(255); // G
      expect(result.data[2]).toBe(255); // B
    });

    it('should handle already grayscale image', () => {
      // Create grayscale image (R = G = B)
      const input = createTestImageData([100]);
      const result = applyThreshold(input, 128);

      // 100 < 128 → 0 (black)
      expect(result.data[0]).toBe(0); // R
      expect(result.data[1]).toBe(0); // G
      expect(result.data[2]).toBe(0); // B
    });

    it('should produce binary output (only 0 or 255)', () => {
      const input = new ImageData(10, 10);
      // Fill with random RGB values
      for (let i = 0; i < input.data.length; i += 4) {
        input.data[i] = Math.floor(Math.random() * 256);
        input.data[i + 1] = Math.floor(Math.random() * 256);
        input.data[i + 2] = Math.floor(Math.random() * 256);
        input.data[i + 3] = 255;
      }

      const result = applyThreshold(input, 128);

      // Verify all pixels are either 0 or 255
      for (let i = 0; i < result.data.length; i += 4) {
        expect([0, 255]).toContain(result.data[i]); // R
        expect([0, 255]).toContain(result.data[i + 1]); // G
        expect([0, 255]).toContain(result.data[i + 2]); // B
        // And R = G = B (grayscale)
        expect(result.data[i]).toBe(result.data[i + 1]);
        expect(result.data[i + 1]).toBe(result.data[i + 2]);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle uniform gray image', () => {
      // All pixels same value
      const input = createTestImageData([127, 127, 127, 127, 127]);
      const result = applyThreshold(input, 128);

      // All 127 < 128 → all black (0)
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBe(0);
        expect(result.data[i + 1]).toBe(0);
        expect(result.data[i + 2]).toBe(0);
      }
    });

    it('should handle already binary image', () => {
      // Image with only 0 and 255
      const input = createTestImageData([0, 255, 0, 255]);
      const result = applyThreshold(input, 128);

      expect(result.data[0]).toBe(0); // 0 < 128 → 0
      expect(result.data[4]).toBe(255); // 255 >= 128 → 255
      expect(result.data[8]).toBe(0); // 0 < 128 → 0
      expect(result.data[12]).toBe(255); // 255 >= 128 → 255
    });

    it('should handle pure black image', () => {
      const input = createTestImageData([[0, 0, 0]]);
      const result = applyThreshold(input, 128);

      // All 0 < 128 → all black (0)
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBe(0);
        expect(result.data[i + 1]).toBe(0);
        expect(result.data[i + 2]).toBe(0);
      }
    });

    it('should handle pure white image', () => {
      const input = createTestImageData([[255, 255, 255]]);
      const result = applyThreshold(input, 128);

      // All 255 >= 128 → all white (255)
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBe(255);
        expect(result.data[i + 1]).toBe(255);
        expect(result.data[i + 2]).toBe(255);
      }
    });

    it('should handle mixed intensity image', () => {
      const input = createTestImageData([0, 64, 127, 128, 191, 255]);
      const result = applyThreshold(input, 128);

      expect(result.data[0]).toBe(0); // 0 < 128 → 0
      expect(result.data[4]).toBe(0); // 64 < 128 → 0
      expect(result.data[8]).toBe(0); // 127 < 128 → 0
      expect(result.data[12]).toBe(255); // 128 >= 128 → 255
      expect(result.data[16]).toBe(255); // 191 >= 128 → 255
      expect(result.data[20]).toBe(255); // 255 >= 128 → 255
    });
  });

  describe('Input Validation', () => {
    it('should throw error for null imageData', () => {
      expect(() => applyThreshold(null as unknown as ImageData, 128)).toThrow(
        'applyThreshold: imageData parameter is required'
      );
    });

    it('should throw error for undefined imageData', () => {
      expect(() => applyThreshold(undefined as unknown as ImageData, 128)).toThrow(
        'applyThreshold: imageData parameter is required'
      );
    });

    it('should throw error for threshold < 0', () => {
      const input = new ImageData(1, 1);
      expect(() => applyThreshold(input, -1)).toThrow(
        'applyThreshold: threshold must be in range [0, 255], got -1'
      );
    });

    it('should throw error for threshold > 255', () => {
      const input = new ImageData(1, 1);
      expect(() => applyThreshold(input, 256)).toThrow(
        'applyThreshold: threshold must be in range [0, 255], got 256'
      );
    });

    it('should provide descriptive error messages', () => {
      const input = new ImageData(1, 1);

      expect(() => applyThreshold(null as unknown as ImageData, 128)).toThrow(
        /imageData parameter is required/
      );
      expect(() => applyThreshold(input, 300)).toThrow(/threshold must be in range \[0, 255\]/);
    });
  });

  describe('Performance', () => {
    it('should process large images efficiently', () => {
      // Create 1414x1414 pixel image (~2 megapixels, ~8MB RGBA)
      const input = new ImageData(1414, 1414);

      const start = performance.now();
      applyThreshold(input, 128);
      const duration = performance.now() - start;

      // Should complete in reasonable time
      // Note: Includes grayscale conversion (first pass) + threshold (second pass)
      // Target: <250ms for 2MP image (double-pass acceptable)
      expect(duration).toBeLessThan(250);
    });

    it('should have O(n) time complexity', () => {
      // Small image
      const small = new ImageData(100, 100); // 10k pixels
      const startSmall = performance.now();
      applyThreshold(small, 128);
      const durationSmall = performance.now() - startSmall;

      // Large image (10x pixels)
      const large = new ImageData(316, 316); // ~100k pixels
      const startLarge = performance.now();
      applyThreshold(large, 128);
      const durationLarge = performance.now() - startLarge;

      // Should scale roughly linearly (with some overhead)
      // If O(n), 10x pixels should take < 20x time
      expect(durationLarge).toBeLessThan(durationSmall * 20);
    });
  });
});
