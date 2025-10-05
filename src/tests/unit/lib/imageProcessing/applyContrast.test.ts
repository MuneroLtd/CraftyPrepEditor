/**
 * Unit tests for applyContrast function
 *
 * Tests the contrast adjustment algorithm that pivots around mid-gray (127).
 * Formula: newValue = clamp(((oldValue - 127) * factor) + 127, 0, 255)
 * Factor: (100 + contrast) / 100
 */

import { describe, it, expect } from 'vitest';
import { applyContrast } from '@/lib/imageProcessing/applyContrast';

describe('applyContrast', () => {
  // Helper to create test ImageData
  function createTestImageData(pixels: number[][]): ImageData {
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

      const result = applyContrast(input, 50);

      // Input should be unchanged
      expect(input.data).toEqual(inputCopy);
      // Result should be a different instance
      expect(result).not.toBe(input);
    });

    it('should return ImageData with same dimensions', () => {
      const input = new ImageData(10, 20);
      const result = applyContrast(input, 0);

      expect(result.width).toBe(10);
      expect(result.height).toBe(20);
    });

    it('should preserve alpha channel', () => {
      const input = createTestImageData([[100, 150, 200, 128]]);
      const result = applyContrast(input, 50);

      expect(result.data[3]).toBe(128); // Alpha unchanged
    });
  });

  describe('Factor Calculation', () => {
    it('should not change image when contrast is 0 (factor = 1.0)', () => {
      const input = createTestImageData([[50, 127, 200]]);
      const result = applyContrast(input, 0);

      expect(result.data[0]).toBe(50); // R unchanged
      expect(result.data[1]).toBe(127); // G unchanged
      expect(result.data[2]).toBe(200); // B unchanged
    });

    it('should apply factor = 2.0 when contrast = 100', () => {
      // Mid-gray (127) should remain 127
      // 177 with factor 2.0: ((177 - 127) * 2) + 127 = (50 * 2) + 127 = 227
      const input = createTestImageData([[127, 177, 77]]);
      const result = applyContrast(input, 100);

      expect(result.data[0]).toBe(127); // Mid-gray unchanged
      expect(result.data[1]).toBe(227); // 177 -> 227
      expect(result.data[2]).toBe(27); // 77 -> 27
    });

    it('should apply factor = 0.0 when contrast = -100', () => {
      // All values should become 127 (mid-gray)
      const input = createTestImageData([[0, 127, 255]]);
      const result = applyContrast(input, -100);

      expect(result.data[0]).toBe(127); // 0 -> 127
      expect(result.data[1]).toBe(127); // 127 -> 127
      expect(result.data[2]).toBe(127); // 255 -> 127
    });
  });

  describe('Mid-Gray Pivot (127)', () => {
    it('should keep mid-gray pixels at 127 for any contrast', () => {
      const input = createTestImageData([[127, 127, 127]]);

      const resultPos = applyContrast(input, 75);
      expect(resultPos.data[0]).toBe(127);
      expect(resultPos.data[1]).toBe(127);
      expect(resultPos.data[2]).toBe(127);

      const resultNeg = applyContrast(input, -75);
      expect(resultNeg.data[0]).toBe(127);
      expect(resultNeg.data[1]).toBe(127);
      expect(resultNeg.data[2]).toBe(127);
    });

    it('should increase values > 127 with positive contrast', () => {
      // 177 with contrast 50: ((177 - 127) * 1.5) + 127 = 75 + 127 = 202
      const input = createTestImageData([[177, 177, 177]]);
      const result = applyContrast(input, 50);

      expect(result.data[0]).toBeGreaterThan(177);
      expect(result.data[1]).toBeGreaterThan(177);
      expect(result.data[2]).toBeGreaterThan(177);
      expect(result.data[0]).toBe(202);
    });

    it('should decrease values < 127 with positive contrast', () => {
      // 77 with contrast 50: ((77 - 127) * 1.5) + 127 = -75 + 127 = 52
      const input = createTestImageData([[77, 77, 77]]);
      const result = applyContrast(input, 50);

      expect(result.data[0]).toBeLessThan(77);
      expect(result.data[1]).toBeLessThan(77);
      expect(result.data[2]).toBeLessThan(77);
      expect(result.data[0]).toBe(52);
    });

    it('should compress all values toward 127 with negative contrast', () => {
      // 200 with contrast -50: ((200 - 127) * 0.5) + 127 = 36.5 + 127 = 163.5 -> 164
      // 50 with contrast -50: ((50 - 127) * 0.5) + 127 = -38.5 + 127 = 88.5 -> 89
      const input = createTestImageData([[200, 127, 50]]);
      const result = applyContrast(input, -50);

      expect(result.data[0]).toBeLessThan(200); // 200 -> closer to 127
      expect(result.data[0]).toBeGreaterThan(127);
      expect(result.data[1]).toBe(127); // 127 unchanged
      expect(result.data[2]).toBeGreaterThan(50); // 50 -> closer to 127
      expect(result.data[2]).toBeLessThan(127);
    });
  });

  describe('Edge Cases', () => {
    it('should clamp pure black with max positive contrast', () => {
      // 0 with factor 2.0: ((0 - 127) * 2) + 127 = -254 + 127 = -127 -> clamp to 0
      const input = createTestImageData([[0, 0, 0]]);
      const result = applyContrast(input, 100);

      expect(result.data[0]).toBe(0);
      expect(result.data[1]).toBe(0);
      expect(result.data[2]).toBe(0);
    });

    it('should clamp pure white with max positive contrast', () => {
      // 255 with factor 2.0: ((255 - 127) * 2) + 127 = 256 + 127 = 383 -> clamp to 255
      const input = createTestImageData([[255, 255, 255]]);
      const result = applyContrast(input, 100);

      expect(result.data[0]).toBe(255);
      expect(result.data[1]).toBe(255);
      expect(result.data[2]).toBe(255);
    });

    it('should convert pure black to mid-gray with max negative contrast', () => {
      const input = createTestImageData([[0, 0, 0]]);
      const result = applyContrast(input, -100);

      expect(result.data[0]).toBe(127);
      expect(result.data[1]).toBe(127);
      expect(result.data[2]).toBe(127);
    });

    it('should convert pure white to mid-gray with max negative contrast', () => {
      const input = createTestImageData([[255, 255, 255]]);
      const result = applyContrast(input, -100);

      expect(result.data[0]).toBe(127);
      expect(result.data[1]).toBe(127);
      expect(result.data[2]).toBe(127);
    });

    it('should handle mixed values correctly', () => {
      // Test various values with moderate contrast
      const input = createTestImageData([[0, 64, 127, 191, 255]]);
      const result = applyContrast(input, 50);

      // All values should be in valid range
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBeGreaterThanOrEqual(0);
        expect(result.data[i]).toBeLessThanOrEqual(255);
        expect(result.data[i + 1]).toBeGreaterThanOrEqual(0);
        expect(result.data[i + 1]).toBeLessThanOrEqual(255);
        expect(result.data[i + 2]).toBeGreaterThanOrEqual(0);
        expect(result.data[i + 2]).toBeLessThanOrEqual(255);
      }
    });
  });

  describe('Clamping', () => {
    it('should ensure all results are in [0, 255] range', () => {
      const input = new ImageData(10, 10);
      // Fill with random values
      for (let i = 0; i < input.data.length; i += 4) {
        input.data[i] = Math.floor(Math.random() * 256);
        input.data[i + 1] = Math.floor(Math.random() * 256);
        input.data[i + 2] = Math.floor(Math.random() * 256);
        input.data[i + 3] = 255;
      }

      const result = applyContrast(input, 100);

      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBeGreaterThanOrEqual(0);
        expect(result.data[i]).toBeLessThanOrEqual(255);
        expect(result.data[i + 1]).toBeGreaterThanOrEqual(0);
        expect(result.data[i + 1]).toBeLessThanOrEqual(255);
        expect(result.data[i + 2]).toBeGreaterThanOrEqual(0);
        expect(result.data[i + 2]).toBeLessThanOrEqual(255);
      }
    });

    it('should handle extreme input values without overflow', () => {
      const input = createTestImageData([[0, 255, 127]]);

      // Test with various contrast levels
      [-100, -75, -50, 0, 50, 75, 100].forEach((contrast) => {
        const result = applyContrast(input, contrast);

        expect(result.data[0]).toBeGreaterThanOrEqual(0);
        expect(result.data[0]).toBeLessThanOrEqual(255);
        expect(result.data[1]).toBeGreaterThanOrEqual(0);
        expect(result.data[1]).toBeLessThanOrEqual(255);
        expect(result.data[2]).toBeGreaterThanOrEqual(0);
        expect(result.data[2]).toBeLessThanOrEqual(255);
      });
    });
  });

  describe('Input Validation', () => {
    it('should throw error for null imageData', () => {
      expect(() => applyContrast(null as unknown as ImageData, 0)).toThrow(
        'applyContrast: imageData parameter is required'
      );
    });

    it('should throw error for undefined imageData', () => {
      expect(() => applyContrast(undefined as unknown as ImageData, 0)).toThrow(
        'applyContrast: imageData parameter is required'
      );
    });

    it('should throw error for contrast < -100', () => {
      const input = new ImageData(1, 1);
      expect(() => applyContrast(input, -101)).toThrow(
        'applyContrast: contrast must be in range [-100, 100], got -101'
      );
    });

    it('should throw error for contrast > 100', () => {
      const input = new ImageData(1, 1);
      expect(() => applyContrast(input, 101)).toThrow(
        'applyContrast: contrast must be in range [-100, 100], got 101'
      );
    });

    it('should provide descriptive error messages', () => {
      const input = new ImageData(1, 1);

      expect(() => applyContrast(null as unknown as ImageData, 0)).toThrow(
        /imageData parameter is required/
      );
      expect(() => applyContrast(input, 150)).toThrow(/contrast must be in range \[-100, 100\]/);
    });
  });

  describe('Performance', () => {
    it('should process large images efficiently', () => {
      // Create 1000x1000 pixel image (1 megapixel)
      const input = new ImageData(1000, 1000);

      const start = performance.now();
      applyContrast(input, 50);
      const duration = performance.now() - start;

      // Should complete in reasonable time (< 500ms for 1MP)
      // Note: Actual target is <500ms for 2MB (5MP) per FUNCTIONAL.md
      expect(duration).toBeLessThan(500);
    });

    it('should have O(n) time complexity', () => {
      // Small image
      const small = new ImageData(100, 100); // 10k pixels
      const startSmall = performance.now();
      applyContrast(small, 50);
      const durationSmall = performance.now() - startSmall;

      // Large image (10x pixels)
      const large = new ImageData(316, 316); // ~100k pixels
      const startLarge = performance.now();
      applyContrast(large, 50);
      const durationLarge = performance.now() - startLarge;

      // Should scale roughly linearly (with some overhead)
      // If O(n), 10x pixels should take < 20x time
      expect(durationLarge).toBeLessThan(durationSmall * 20);
    });
  });
});
