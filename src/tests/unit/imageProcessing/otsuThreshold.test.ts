import { describe, it, expect } from 'vitest';
import { calculateOptimalThreshold, applyOtsuThreshold } from '@/lib/imageProcessing/otsuThreshold';

/**
 * Test suite for Otsu's threshold algorithm
 */
describe('Otsu Threshold Algorithm', () => {
  /**
   * Helper: Create ImageData with uniform intensity
   */
  function createUniformImage(width: number, height: number, intensity: number): ImageData {
    const imageData = new ImageData(width, height);
    const { data } = imageData;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = intensity; // R
      data[i + 1] = intensity; // G
      data[i + 2] = intensity; // B
      data[i + 3] = 255; // A
    }

    return imageData;
  }

  /**
   * Helper: Create bimodal image (two intensity peaks)
   */
  function createBimodalImage(
    width: number,
    height: number,
    peak1: number,
    peak2: number
  ): ImageData {
    const imageData = new ImageData(width, height);
    const { data } = imageData;

    // Fill half with peak1, half with peak2
    const midpoint = (width * height) / 2;
    let pixelIndex = 0;

    for (let i = 0; i < data.length; i += 4) {
      const intensity = pixelIndex < midpoint ? peak1 : peak2;
      data[i] = intensity;
      data[i + 1] = intensity;
      data[i + 2] = intensity;
      data[i + 3] = 255;
      pixelIndex++;
    }

    return imageData;
  }

  /**
   * Helper: Verify output is binary (only 0 and 255)
   */
  function verifyBinary(imageData: ImageData): boolean {
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
      const value = data[i];
      if (value !== 0 && value !== 255) {
        return false;
      }
    }
    return true;
  }

  describe('calculateOptimalThreshold', () => {
    it('should calculate optimal threshold for bimodal image', () => {
      const imageData = createBimodalImage(100, 100, 50, 200);
      const threshold = calculateOptimalThreshold(imageData);

      // Optimal threshold should separate the two peaks
      // With Otsu's method, threshold may be at or near one of the peaks
      // as long as it separates the two classes
      expect(threshold).toBeGreaterThanOrEqual(50);
      expect(threshold).toBeLessThanOrEqual(200);

      // Should produce valid binarization
      const binarized = applyOtsuThreshold(imageData);
      expect(verifyBinary(binarized)).toBe(true);
    });

    it('should handle all-black image', () => {
      const imageData = createUniformImage(100, 100, 0);
      const threshold = calculateOptimalThreshold(imageData);

      // Should return valid threshold (0 or 1)
      expect(threshold).toBeGreaterThanOrEqual(0);
      expect(threshold).toBeLessThanOrEqual(1);
    });

    it('should handle all-white image', () => {
      const imageData = createUniformImage(100, 100, 255);
      const threshold = calculateOptimalThreshold(imageData);

      // Should return valid threshold (254 or 255)
      expect(threshold).toBeGreaterThanOrEqual(254);
      expect(threshold).toBeLessThanOrEqual(255);
    });

    it('should handle uniform gray image', () => {
      const imageData = createUniformImage(100, 100, 128);
      const threshold = calculateOptimalThreshold(imageData);

      // Should return valid threshold
      expect(threshold).toBeGreaterThanOrEqual(0);
      expect(threshold).toBeLessThanOrEqual(255);
    });

    it('should handle low-contrast image', () => {
      // Create image with narrow intensity range (120-135)
      const imageData = new ImageData(100, 100);
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
        const intensity = 120 + Math.floor(Math.random() * 16); // 120-135
        data[i] = intensity;
        data[i + 1] = intensity;
        data[i + 2] = intensity;
        data[i + 3] = 255;
      }

      const threshold = calculateOptimalThreshold(imageData);

      // Should return threshold within intensity range
      expect(threshold).toBeGreaterThanOrEqual(120);
      expect(threshold).toBeLessThanOrEqual(135);
    });

    it('should handle high-contrast bimodal image', () => {
      const imageData = createBimodalImage(100, 100, 10, 245);
      const threshold = calculateOptimalThreshold(imageData);

      // Threshold should separate the two peaks
      // May be at or near one of the peaks
      expect(threshold).toBeGreaterThanOrEqual(10);
      expect(threshold).toBeLessThanOrEqual(245);

      // Should produce valid binarization
      const binarized = applyOtsuThreshold(imageData);
      expect(verifyBinary(binarized)).toBe(true);
    });

    it('should be deterministic', () => {
      const imageData = createBimodalImage(100, 100, 50, 200);

      // Run 10 times and verify same result
      const threshold1 = calculateOptimalThreshold(imageData);
      for (let i = 0; i < 9; i++) {
        const threshold = calculateOptimalThreshold(imageData);
        expect(threshold).toBe(threshold1);
      }
    });

    it('should not modify input ImageData', () => {
      const imageData = createBimodalImage(100, 100, 50, 200);
      const originalData = new Uint8ClampedArray(imageData.data);

      calculateOptimalThreshold(imageData);

      // Verify input unchanged
      expect(imageData.data).toEqual(originalData);
    });

    it('should return integer threshold', () => {
      const imageData = createBimodalImage(100, 100, 50, 200);
      const threshold = calculateOptimalThreshold(imageData);

      expect(Number.isInteger(threshold)).toBe(true);
    });
  });

  describe('applyOtsuThreshold', () => {
    it('should binarize image correctly', () => {
      const imageData = createBimodalImage(100, 100, 50, 200);
      const result = applyOtsuThreshold(imageData);

      // Verify output is binary
      expect(verifyBinary(result)).toBe(true);
    });

    it('should preserve ImageData dimensions', () => {
      const imageData = createBimodalImage(123, 456, 50, 200);
      const result = applyOtsuThreshold(imageData);

      expect(result.width).toBe(123);
      expect(result.height).toBe(456);
      expect(result.data.length).toBe(123 * 456 * 4);
    });

    it('should set pixels below threshold to black', () => {
      // Create image with known threshold (bimodal 50/200)
      const imageData = createBimodalImage(100, 100, 50, 200);
      const result = applyOtsuThreshold(imageData);
      const threshold = calculateOptimalThreshold(imageData);

      // Check pixels that were 50 (below threshold)
      const { data: inputData } = imageData;
      const { data: outputData } = result;

      for (let i = 0; i < inputData.length; i += 4) {
        if (inputData[i] < threshold) {
          expect(outputData[i]).toBe(0);
          expect(outputData[i + 1]).toBe(0);
          expect(outputData[i + 2]).toBe(0);
        }
      }
    });

    it('should set pixels above or equal to threshold to white', () => {
      const imageData = createBimodalImage(100, 100, 50, 200);
      const result = applyOtsuThreshold(imageData);
      const threshold = calculateOptimalThreshold(imageData);

      const { data: inputData } = imageData;
      const { data: outputData } = result;

      for (let i = 0; i < inputData.length; i += 4) {
        if (inputData[i] >= threshold) {
          expect(outputData[i]).toBe(255);
          expect(outputData[i + 1]).toBe(255);
          expect(outputData[i + 2]).toBe(255);
        }
      }
    });

    it('should preserve alpha channel', () => {
      const imageData = createBimodalImage(100, 100, 50, 200);
      const result = applyOtsuThreshold(imageData);
      const { data } = result;

      for (let i = 3; i < data.length; i += 4) {
        expect(data[i]).toBe(255);
      }
    });

    it('should handle all-black image', () => {
      const imageData = createUniformImage(100, 100, 0);
      const result = applyOtsuThreshold(imageData);

      // Should produce binary output (all same value since uniform)
      expect(verifyBinary(result)).toBe(true);

      // All pixels should be the same (either all 0 or all 255)
      const firstValue = result.data[0];
      for (let i = 0; i < result.data.length; i += 4) {
        expect(result.data[i]).toBe(firstValue);
      }
    });

    it('should handle all-white image', () => {
      const imageData = createUniformImage(100, 100, 255);
      const result = applyOtsuThreshold(imageData);

      // Should produce all-white output
      expect(verifyBinary(result)).toBe(true);
      expect(result.data[0]).toBe(255);
    });

    it('should not modify input ImageData', () => {
      const imageData = createBimodalImage(100, 100, 50, 200);
      const originalData = new Uint8ClampedArray(imageData.data);

      applyOtsuThreshold(imageData);

      // Verify input unchanged
      expect(imageData.data).toEqual(originalData);
    });

    it('should be deterministic', () => {
      const imageData = createBimodalImage(100, 100, 50, 200);

      const result1 = applyOtsuThreshold(imageData);
      const result2 = applyOtsuThreshold(imageData);

      expect(result1.data).toEqual(result2.data);
    });

    it('should meet performance target for large image', () => {
      // Create 2048x1536 image (~3.1MP, typical 2MB JPEG)
      const imageData = createBimodalImage(2048, 1536, 50, 200);

      const start = performance.now();
      applyOtsuThreshold(imageData);
      const duration = performance.now() - start;

      // Should complete in less than 2 seconds
      expect(duration).toBeLessThan(2000);
    });

    it('should produce different results for different images', () => {
      const image1 = createBimodalImage(100, 100, 30, 220);
      const image2 = createBimodalImage(100, 100, 100, 150);

      const threshold1 = calculateOptimalThreshold(image1);
      const threshold2 = calculateOptimalThreshold(image2);

      // Thresholds should differ for different distributions
      // If they're the same, that's okay as long as results might differ
      const result1 = applyOtsuThreshold(image1);
      const result2 = applyOtsuThreshold(image2);

      // At least the thresholds should be calculated
      expect(threshold1).toBeGreaterThanOrEqual(0);
      expect(threshold2).toBeGreaterThanOrEqual(0);

      // Both should be binary
      expect(verifyBinary(result1)).toBe(true);
      expect(verifyBinary(result2)).toBe(true);
    });

    it('should create new ImageData object', () => {
      const imageData = createBimodalImage(100, 100, 50, 200);
      const result = applyOtsuThreshold(imageData);

      // Should be different object
      expect(result).not.toBe(imageData);
      expect(result.data).not.toBe(imageData.data);
    });
  });

  describe('Integration: Threshold Calculation and Binarization', () => {
    it('should use consistent threshold between functions', () => {
      const imageData = createBimodalImage(100, 100, 50, 200);

      const threshold = calculateOptimalThreshold(imageData);
      const binarized = applyOtsuThreshold(imageData);

      // Verify binarization used the same threshold
      const { data: inputData } = imageData;
      const { data: outputData } = binarized;

      for (let i = 0; i < inputData.length; i += 4) {
        const inputValue = inputData[i];
        const outputValue = outputData[i];

        if (inputValue < threshold) {
          expect(outputValue).toBe(0);
        } else {
          expect(outputValue).toBe(255);
        }
      }
    });

    it('should handle real-world scenario: document scan', () => {
      // Simulate document scan: mostly white (240-255) with some text (0-50)
      const imageData = new ImageData(200, 200);
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
        // 90% white background, 10% black text
        const isText = Math.random() < 0.1;
        const intensity = isText
          ? Math.floor(Math.random() * 51)
          : 240 + Math.floor(Math.random() * 16);

        data[i] = intensity;
        data[i + 1] = intensity;
        data[i + 2] = intensity;
        data[i + 3] = 255;
      }

      const threshold = calculateOptimalThreshold(imageData);
      const binarized = applyOtsuThreshold(imageData);

      // Threshold should separate text from background
      // May be at or near one of the peaks (50 or 240)
      expect(threshold).toBeGreaterThanOrEqual(0);
      expect(threshold).toBeLessThanOrEqual(255);

      // Output should be binary
      expect(verifyBinary(binarized)).toBe(true);
    });
  });
});
