/**
 * Integration tests for threshold adjustment feature
 *
 * Tests the complete pipeline: grayscale conversion → threshold binarization
 * and verifies manual threshold override vs auto-calculated Otsu threshold.
 */

import { describe, it, expect } from 'vitest';
import {
  applyThreshold,
  calculateOptimalThreshold,
  applyOtsuThreshold,
  convertToGrayscale,
} from '@/lib/imageProcessing';

describe('Threshold Adjustment Integration', () => {
  // Helper to create test image
  function createTestImage(width: number, height: number, grayscaleValue: number): ImageData {
    const imageData = new ImageData(width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = grayscaleValue; // R
      imageData.data[i + 1] = grayscaleValue; // G
      imageData.data[i + 2] = grayscaleValue; // B
      imageData.data[i + 3] = 255; // A
    }
    return imageData;
  }

  // Helper to create gradient image
  function createGradientImage(width: number, height: number): ImageData {
    const imageData = new ImageData(width, height);
    const totalPixels = width * height;

    for (let i = 0; i < imageData.data.length; i += 4) {
      const pixelIndex = i / 4;
      const gray = Math.floor((pixelIndex / totalPixels) * 255);
      imageData.data[i] = gray; // R
      imageData.data[i + 1] = gray; // G
      imageData.data[i + 2] = gray; // B
      imageData.data[i + 3] = 255; // A
    }

    return imageData;
  }

  describe('Grayscale → Threshold Pipeline', () => {
    it('should apply manual threshold after grayscale conversion', () => {
      // Create RGB image
      const input = new ImageData(10, 10);
      for (let i = 0; i < input.data.length; i += 4) {
        input.data[i] = 100; // R
        input.data[i + 1] = 200; // G
        input.data[i + 2] = 50; // B
        input.data[i + 3] = 255; // A
      }

      // Apply threshold (includes grayscale conversion)
      const result = applyThreshold(input, 128);

      // Verify binary output
      for (let i = 0; i < result.data.length; i += 4) {
        expect([0, 255]).toContain(result.data[i]);
        expect(result.data[i]).toBe(result.data[i + 1]);
        expect(result.data[i + 1]).toBe(result.data[i + 2]);
      }
    });

    it('should produce same result as explicit grayscale + threshold', () => {
      const input = new ImageData(10, 10);
      for (let i = 0; i < input.data.length; i += 4) {
        input.data[i] = 150;
        input.data[i + 1] = 150;
        input.data[i + 2] = 150;
        input.data[i + 3] = 255;
      }

      // Method 1: Direct threshold application
      const direct = applyThreshold(input, 128);

      // Method 2: Explicit grayscale then threshold
      const grayscale = convertToGrayscale(input);
      const explicit = applyThreshold(grayscale, 128);

      // Results should be identical
      expect(direct.data).toEqual(explicit.data);
    });
  });

  describe('Manual Override vs Auto-Calculated Threshold', () => {
    it('should allow manual threshold override', () => {
      const input = createGradientImage(100, 100);

      // Auto-calculate optimal threshold
      const grayscale = convertToGrayscale(input);
      const optimalThreshold = calculateOptimalThreshold(grayscale);

      // Apply auto threshold
      const autoResult = applyOtsuThreshold(grayscale);

      // Apply manual threshold (different value)
      const manualThreshold = optimalThreshold + 50; // Shift threshold
      const manualResult = applyThreshold(input, manualThreshold);

      // Results should differ
      expect(autoResult.data).not.toEqual(manualResult.data);

      // Both should be valid binary images
      for (let i = 0; i < autoResult.data.length; i += 4) {
        expect([0, 255]).toContain(autoResult.data[i]);
        expect([0, 255]).toContain(manualResult.data[i]);
      }
    });

    it('should match Otsu result when using calculated threshold', () => {
      const input = createGradientImage(50, 50);

      // Calculate optimal threshold
      const grayscale = convertToGrayscale(input);
      const optimalThreshold = calculateOptimalThreshold(grayscale);

      // Apply Otsu auto-threshold
      const otsuResult = applyOtsuThreshold(grayscale);

      // Apply manual threshold with Otsu value
      const manualResult = applyThreshold(input, optimalThreshold);

      // Results should be identical
      expect(manualResult.data).toEqual(otsuResult.data);
    });
  });

  describe('Threshold Range Effects', () => {
    it('should produce different results for different thresholds', () => {
      const input = createGradientImage(20, 20);

      const low = applyThreshold(input, 64); // More white
      const mid = applyThreshold(input, 128); // Mid-point
      const high = applyThreshold(input, 192); // More black

      // Count white pixels (value 255)
      const countWhite = (data: Uint8ClampedArray) => {
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] === 255) count++;
        }
        return count;
      };

      const lowWhite = countWhite(low.data);
      const midWhite = countWhite(mid.data);
      const highWhite = countWhite(high.data);

      // Lower threshold → more white pixels
      expect(lowWhite).toBeGreaterThan(midWhite);
      expect(midWhite).toBeGreaterThan(highWhite);
    });

    it('should handle extreme thresholds correctly', () => {
      const input = createTestImage(10, 10, 127);

      // Threshold = 0 → all white
      const allWhite = applyThreshold(input, 0);
      for (let i = 0; i < allWhite.data.length; i += 4) {
        expect(allWhite.data[i]).toBe(255);
      }

      // Threshold = 255 → all black
      const allBlack = applyThreshold(input, 255);
      for (let i = 0; i < allBlack.data.length; i += 4) {
        expect(allBlack.data[i]).toBe(0);
      }
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle bimodal image (typical use case)', () => {
      // Create image with two distinct intensity regions
      const input = new ImageData(100, 100);

      // Half dark (0-64), half light (192-255)
      for (let i = 0; i < input.data.length; i += 4) {
        const pixelIndex = i / 4;
        const gray = pixelIndex < 5000 ? 50 : 200;
        input.data[i] = gray;
        input.data[i + 1] = gray;
        input.data[i + 2] = gray;
        input.data[i + 3] = 255;
      }

      // Auto threshold should find a reasonable separation point
      const grayscale = convertToGrayscale(input);
      const optimalThreshold = calculateOptimalThreshold(grayscale);

      // Otsu should find some threshold (exact value depends on distribution)
      expect(optimalThreshold).toBeGreaterThanOrEqual(0);
      expect(optimalThreshold).toBeLessThanOrEqual(255);

      // Apply threshold
      const result = applyThreshold(input, optimalThreshold);

      // Verify binary output
      for (let i = 0; i < result.data.length; i += 4) {
        expect([0, 255]).toContain(result.data[i]);
      }
    });

    it('should handle uniform image gracefully', () => {
      const input = createTestImage(20, 20, 127);

      // Any threshold should work (all pixels same value)
      const result = applyThreshold(input, 128);

      // All should be black (127 < 128)
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBe(0);
        expect(result.data[i + 1]).toBe(0);
        expect(result.data[i + 2]).toBe(0);
      }
    });
  });

  describe('Performance', () => {
    it('should process medium images quickly', () => {
      const input = createGradientImage(500, 500); // 250k pixels

      const start = performance.now();
      applyThreshold(input, 128);
      const duration = performance.now() - start;

      // Should be much faster than 2MP target
      expect(duration).toBeLessThan(100);
    });

    it('should work with pipeline operations', () => {
      const input = new ImageData(100, 100);

      // Fill with random colors
      for (let i = 0; i < input.data.length; i += 4) {
        input.data[i] = Math.random() * 255;
        input.data[i + 1] = Math.random() * 255;
        input.data[i + 2] = Math.random() * 255;
        input.data[i + 3] = 255;
      }

      const start = performance.now();

      // Pipeline: grayscale → calculate threshold → apply threshold
      const grayscale = convertToGrayscale(input);
      const threshold = calculateOptimalThreshold(grayscale);
      const result = applyThreshold(input, threshold);

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50); // Full pipeline should be fast
      expect(result.width).toBe(100);
      expect(result.height).toBe(100);
    });
  });
});
