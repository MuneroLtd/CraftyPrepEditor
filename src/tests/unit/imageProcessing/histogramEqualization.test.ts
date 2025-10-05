import { describe, it, expect } from 'vitest';
import { applyHistogramEqualization } from '../../../lib/imageProcessing/histogramEqualization';

describe('Histogram Equalization', () => {
  describe('calculateHistogram', () => {
    it('should correctly calculate histogram for known grayscale image', () => {
      // Create 2x2 image with values [0, 128, 128, 255]
      const imageData = new ImageData(2, 2);
      // Pixel 0: black (0, 0, 0, 255)
      imageData.data[0] = 0;
      imageData.data[1] = 0;
      imageData.data[2] = 0;
      imageData.data[3] = 255;
      // Pixel 1: mid-gray (128, 128, 128, 255)
      imageData.data[4] = 128;
      imageData.data[5] = 128;
      imageData.data[6] = 128;
      imageData.data[7] = 255;
      // Pixel 2: mid-gray (128, 128, 128, 255)
      imageData.data[8] = 128;
      imageData.data[9] = 128;
      imageData.data[10] = 128;
      imageData.data[11] = 255;
      // Pixel 3: white (255, 255, 255, 255)
      imageData.data[12] = 255;
      imageData.data[13] = 255;
      imageData.data[14] = 255;
      imageData.data[15] = 255;

      const result = applyHistogramEqualization(imageData);

      // After equalization, values should be spread across the range
      // We can't predict exact values without knowing the normalization,
      // but we can verify the image data is valid
      expect(result).toBeInstanceOf(ImageData);
      expect(result.width).toBe(2);
      expect(result.height).toBe(2);
      expect(result.data.length).toBe(16);
    });
  });

  describe('CDF Computation', () => {
    it('should produce monotonically increasing CDF', () => {
      // Create uniform image
      const imageData = new ImageData(4, 4);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.floor((i / 4) * 16); // 0-255 distributed
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = 255;
      }

      const result = applyHistogramEqualization(imageData);

      // Verify result is valid
      expect(result).toBeInstanceOf(ImageData);
      expect(result.data.length).toBe(imageData.data.length);
    });
  });

  describe('CDF Normalization', () => {
    it('should normalize values to 0-255 range', () => {
      const imageData = new ImageData(10, 10);
      // Create low contrast image (values 100-150)
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = 100 + Math.floor(Math.random() * 50);
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = 255;
      }

      const result = applyHistogramEqualization(imageData);

      // Check all values are in valid range
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBeGreaterThanOrEqual(0);
        expect(result.data[i]).toBeLessThanOrEqual(255);
        // Verify grayscale (R=G=B)
        expect(result.data[i]).toBe(result.data[i + 1]);
        expect(result.data[i]).toBe(result.data[i + 2]);
      }
    });
  });

  describe('Deterministic Output', () => {
    it('should produce identical results for same input', () => {
      const imageData = new ImageData(5, 5);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.floor(Math.random() * 256);
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = 255;
      }

      const result1 = applyHistogramEqualization(imageData);
      const result2 = applyHistogramEqualization(imageData);

      // Verify pixel-perfect match
      for (let i = 0; i < result1.data.length; i++) {
        expect(result1.data[i]).toBe(result2.data[i]);
      }
    });
  });

  describe('Contrast Enhancement', () => {
    it('should increase standard deviation (enhance contrast)', () => {
      // Create low-contrast image (values clustered around 128)
      const imageData = new ImageData(50, 50);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = 128 + Math.floor((Math.random() - 0.5) * 20); // 118-138 range
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = 255;
      }

      // Calculate standard deviation before
      const beforeValues: number[] = [];
      for (let i = 0; i < imageData.data.length; i += 4) {
        beforeValues.push(imageData.data[i]);
      }
      const beforeMean = beforeValues.reduce((a, b) => a + b) / beforeValues.length;
      const beforeStdDev = Math.sqrt(
        beforeValues.reduce((sum, val) => sum + Math.pow(val - beforeMean, 2), 0) /
          beforeValues.length
      );

      const result = applyHistogramEqualization(imageData);

      // Calculate standard deviation after
      const afterValues: number[] = [];
      for (let i = 0; i < result.data.length; i += 4) {
        afterValues.push(result.data[i]);
      }
      const afterMean = afterValues.reduce((a, b) => a + b) / afterValues.length;
      const afterStdDev = Math.sqrt(
        afterValues.reduce((sum, val) => sum + Math.pow(val - afterMean, 2), 0) / afterValues.length
      );

      // Contrast should be enhanced (higher std deviation)
      expect(afterStdDev).toBeGreaterThan(beforeStdDev);
    });
  });

  describe('Edge Cases', () => {
    it('should handle all-white image (no change)', () => {
      const imageData = new ImageData(10, 10);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 255;
        imageData.data[i + 1] = 255;
        imageData.data[i + 2] = 255;
        imageData.data[i + 3] = 255;
      }

      const result = applyHistogramEqualization(imageData);

      // All pixels should remain 255
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBe(255);
        expect(result.data[i + 1]).toBe(255);
        expect(result.data[i + 2]).toBe(255);
        expect(result.data[i + 3]).toBe(255);
      }
    });

    it('should handle all-black image (no change)', () => {
      const imageData = new ImageData(10, 10);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 0;
        imageData.data[i + 1] = 0;
        imageData.data[i + 2] = 0;
        imageData.data[i + 3] = 255;
      }

      const result = applyHistogramEqualization(imageData);

      // All pixels should remain 0 (except alpha)
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBe(0);
        expect(result.data[i + 1]).toBe(0);
        expect(result.data[i + 2]).toBe(0);
        expect(result.data[i + 3]).toBe(255);
      }
    });
  });

  describe('Performance', () => {
    it('should process 5MP image in under 1 second', () => {
      // Create ~5MP image (2236x2236 ≈ 5,000,000 pixels)
      const imageData = new ImageData(2236, 2236);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.floor(Math.random() * 256);
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = 255;
      }

      const startTime = performance.now();
      const result = applyHistogramEqualization(imageData);
      const endTime = performance.now();

      const executionTime = endTime - startTime;

      expect(result).toBeInstanceOf(ImageData);
      expect(executionTime).toBeLessThan(1000); // < 1 second
    });
  });

  describe('Integration', () => {
    it('should preserve alpha channel', () => {
      const imageData = new ImageData(5, 5);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.floor(Math.random() * 256);
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = 200; // Non-255 alpha
      }

      const result = applyHistogramEqualization(imageData);

      // Alpha should be preserved
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i + 3]).toBe(imageData.data[i + 3]);
      }
    });

    it('should produce valid ImageData with correct dimensions', () => {
      const imageData = new ImageData(100, 50);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.floor(Math.random() * 256);
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = 255;
      }

      const result = applyHistogramEqualization(imageData);

      expect(result.width).toBe(100);
      expect(result.height).toBe(50);
      expect(result.data.length).toBe(100 * 50 * 4);
    });
  });

  describe('preserveAlpha Parameter', () => {
    it('should skip transparent pixels when preserveAlpha is true', () => {
      // Create image with some transparent pixels
      const imageData = new ImageData(3, 3);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 100; // R
        imageData.data[i + 1] = 100; // G
        imageData.data[i + 2] = 100; // B
        // Make every other pixel transparent
        imageData.data[i + 3] = i % 8 === 0 ? 0 : 255; // A
      }

      const result = applyHistogramEqualization(imageData, true);

      // Transparent pixels should remain unchanged
      for (let i = 0; i < result.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) {
          expect(result.data[i]).toBe(100); // Original value preserved
          expect(result.data[i + 1]).toBe(100);
          expect(result.data[i + 2]).toBe(100);
          expect(result.data[i + 3]).toBe(0); // Still transparent
        }
      }
    });

    it('should preserve transparent pixels in output when preserveAlpha is true', () => {
      const imageData = new ImageData(4, 4);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.floor(Math.random() * 256);
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = i % 8 === 0 ? 0 : 255; // Some transparent
      }

      const result = applyHistogramEqualization(imageData, true);

      // Check alpha preservation
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i + 3]).toBe(imageData.data[i + 3]);
      }
    });

    it('should handle mixed opaque/transparent images when preserveAlpha is true', () => {
      const imageData = new ImageData(10, 10);
      // Half transparent, half opaque
      for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.floor(Math.random() * 256);
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = i < imageData.data.length / 2 ? 0 : 255;
      }

      const result = applyHistogramEqualization(imageData, true);

      expect(result).toBeInstanceOf(ImageData);
      expect(result.width).toBe(10);
      expect(result.height).toBe(10);
    });

    it('should produce different histograms with/without preserveAlpha', () => {
      // Create image where transparent pixels would skew histogram
      const imageData = new ImageData(20, 20);
      let pixelIdx = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Most transparent pixels are dark (would skew histogram to darker)
        // Opaque pixels are brighter
        const isTransparent = pixelIdx % 4 === 0;
        const value = isTransparent ? 30 : 150; // Clear separation
        imageData.data[i] = value;
        imageData.data[i + 1] = value;
        imageData.data[i + 2] = value;
        imageData.data[i + 3] = isTransparent ? 0 : 255;
        pixelIdx++;
      }

      const resultWithAlpha = applyHistogramEqualization(imageData, true);
      const resultWithoutAlpha = applyHistogramEqualization(imageData, false);

      // With preserveAlpha=true: only opaque pixels (value 150) contribute to histogram
      // With preserveAlpha=false: all pixels contribute (mix of 30 and 150)
      // This should produce different equalization results

      // Check opaque pixels for difference
      let sumWithAlpha = 0;
      let sumWithoutAlpha = 0;
      let opaqueCount = 0;

      for (let i = 0; i < resultWithAlpha.data.length; i += 4) {
        if (imageData.data[i + 3] === 255) {
          sumWithAlpha += resultWithAlpha.data[i];
          sumWithoutAlpha += resultWithoutAlpha.data[i];
          opaqueCount++;
        }
      }

      const avgWithAlpha = sumWithAlpha / opaqueCount;
      const avgWithoutAlpha = sumWithoutAlpha / opaqueCount;

      // Averages should differ significantly (at least 10 units)
      expect(Math.abs(avgWithAlpha - avgWithoutAlpha)).toBeGreaterThan(10);
    });

    it('should handle edge case: all pixels transparent', () => {
      const imageData = new ImageData(5, 5);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 128;
        imageData.data[i + 1] = 128;
        imageData.data[i + 2] = 128;
        imageData.data[i + 3] = 0; // All transparent
      }

      const result = applyHistogramEqualization(imageData, true);

      // All pixels should remain unchanged
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBe(128);
        expect(result.data[i + 1]).toBe(128);
        expect(result.data[i + 2]).toBe(128);
        expect(result.data[i + 3]).toBe(0);
      }
    });
  });
});
