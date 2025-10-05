/**
 * @file applyBrightness Function Tests
 * @description Unit tests for brightness adjustment algorithm
 *
 * Tests the applyBrightness function which adjusts image brightness
 * using the formula: newValue = clamp(originalValue + brightness, 0, 255)
 */

import { describe, it, expect } from 'vitest';
import { applyBrightness } from '../../../lib/imageProcessing/applyBrightness';

describe('applyBrightness', () => {
  /**
   * Helper function to create test ImageData
   */
  function createTestImageData(pixels: number[][]): ImageData {
    const width = pixels.length;
    const height = 1;
    const imageData = new ImageData(width, height);

    pixels.forEach((pixel, index) => {
      const offset = index * 4;
      imageData.data[offset] = pixel[0]; // R
      imageData.data[offset + 1] = pixel[1]; // G
      imageData.data[offset + 2] = pixel[2]; // B
      imageData.data[offset + 3] = pixel[3]; // A
    });

    return imageData;
  }

  /**
   * Helper to extract pixels from ImageData
   */
  function extractPixels(imageData: ImageData): number[][] {
    const pixels: number[][] = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      pixels.push([
        imageData.data[i],
        imageData.data[i + 1],
        imageData.data[i + 2],
        imageData.data[i + 3],
      ]);
    }
    return pixels;
  }

  describe('Basic Functionality', () => {
    it('should return new ImageData with same dimensions', () => {
      const input = createTestImageData([[128, 128, 128, 255]]);
      const output = applyBrightness(input, 0);

      expect(output.width).toBe(input.width);
      expect(output.height).toBe(input.height);
      expect(output.data.length).toBe(input.data.length);
    });

    it('should not mutate input ImageData (pure function)', () => {
      const input = createTestImageData([[100, 100, 100, 255]]);
      const originalData = [...input.data];

      applyBrightness(input, 50);

      // Verify input unchanged
      expect([...input.data]).toEqual(originalData);
    });
  });

  describe('Brightness = 0 (No Change)', () => {
    it('should return identical pixel values when brightness = 0', () => {
      const input = createTestImageData([
        [128, 128, 128, 255],
        [50, 100, 150, 200],
        [0, 0, 0, 255],
      ]);

      const output = applyBrightness(input, 0);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([
        [128, 128, 128, 255],
        [50, 100, 150, 200],
        [0, 0, 0, 255],
      ]);
    });
  });

  describe('Positive Brightness', () => {
    it('should increase pixel values by brightness amount', () => {
      const input = createTestImageData([[100, 100, 100, 255]]);

      const output = applyBrightness(input, 50);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([[150, 150, 150, 255]]);
    });

    it('should handle different RGB values independently', () => {
      const input = createTestImageData([[50, 100, 150, 255]]);

      const output = applyBrightness(input, 30);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([[80, 130, 180, 255]]);
    });
  });

  describe('Negative Brightness', () => {
    it('should decrease pixel values by brightness amount', () => {
      const input = createTestImageData([[100, 100, 100, 255]]);

      const output = applyBrightness(input, -50);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([[50, 50, 50, 255]]);
    });

    it('should handle different RGB values independently with negative brightness', () => {
      const input = createTestImageData([[100, 150, 200, 255]]);

      const output = applyBrightness(input, -30);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([[70, 120, 170, 255]]);
    });
  });

  describe('Upper Clamp (brightness causes overflow)', () => {
    it('should clamp values at 255 when brightness + value > 255', () => {
      const input = createTestImageData([[200, 200, 200, 255]]);

      const output = applyBrightness(input, 100);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([[255, 255, 255, 255]]);
    });

    it('should clamp individual channels independently', () => {
      const input = createTestImageData([[200, 150, 100, 255]]);

      const output = applyBrightness(input, 100);
      const outputPixels = extractPixels(output);

      // 200+100=300→255, 150+100=250, 100+100=200
      expect(outputPixels).toEqual([[255, 250, 200, 255]]);
    });

    it('should produce pure white when brightness = +100 on bright pixels', () => {
      const input = createTestImageData([[200, 220, 240, 255]]);

      const output = applyBrightness(input, 100);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([[255, 255, 255, 255]]);
    });
  });

  describe('Lower Clamp (brightness causes underflow)', () => {
    it('should clamp values at 0 when brightness + value < 0', () => {
      const input = createTestImageData([[50, 50, 50, 255]]);

      const output = applyBrightness(input, -100);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([[0, 0, 0, 255]]);
    });

    it('should clamp individual channels independently at lower bound', () => {
      const input = createTestImageData([[100, 50, 30, 255]]);

      const output = applyBrightness(input, -100);
      const outputPixels = extractPixels(output);

      // 100-100=0, 50-100=-50→0, 30-100=-70→0
      expect(outputPixels).toEqual([[0, 0, 0, 255]]);
    });

    it('should produce pure black when brightness = -100 on dark pixels', () => {
      const input = createTestImageData([[50, 30, 20, 255]]);

      const output = applyBrightness(input, -100);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([[0, 0, 0, 255]]);
    });
  });

  describe('Alpha Channel Preservation', () => {
    it('should preserve alpha channel unchanged', () => {
      const input = createTestImageData([[128, 128, 128, 200]]);

      const output = applyBrightness(input, 50);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([[178, 178, 178, 200]]);
    });

    it('should preserve different alpha values for different pixels', () => {
      const input = createTestImageData([
        [100, 100, 100, 255],
        [100, 100, 100, 128],
        [100, 100, 100, 0],
      ]);

      const output = applyBrightness(input, 50);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([
        [150, 150, 150, 255],
        [150, 150, 150, 128],
        [150, 150, 150, 0],
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single pixel image', () => {
      const input = createTestImageData([[128, 128, 128, 255]]);

      const output = applyBrightness(input, 50);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([[178, 178, 178, 255]]);
    });

    it('should handle all black pixels (0, 0, 0)', () => {
      const input = createTestImageData([
        [0, 0, 0, 255],
        [0, 0, 0, 255],
      ]);

      const output = applyBrightness(input, 50);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([
        [50, 50, 50, 255],
        [50, 50, 50, 255],
      ]);
    });

    it('should handle all white pixels (255, 255, 255)', () => {
      const input = createTestImageData([
        [255, 255, 255, 255],
        [255, 255, 255, 255],
      ]);

      const output = applyBrightness(input, -50);
      const outputPixels = extractPixels(output);

      expect(outputPixels).toEqual([
        [205, 205, 205, 255],
        [205, 205, 205, 255],
      ]);
    });

    it('should handle extreme brightness values within range', () => {
      const input = createTestImageData([[128, 128, 128, 255]]);

      // Test max positive brightness
      const brightOutput = applyBrightness(input, 100);
      expect(extractPixels(brightOutput)).toEqual([[228, 228, 228, 255]]);

      // Test max negative brightness
      const darkOutput = applyBrightness(input, -100);
      expect(extractPixels(darkOutput)).toEqual([[28, 28, 28, 255]]);
    });
  });

  describe('Formula Validation', () => {
    it('should apply formula: newValue = clamp(value + brightness, 0, 255)', () => {
      const testCases: Array<{
        input: number;
        brightness: number;
        expected: number;
      }> = [
        { input: 128, brightness: 0, expected: 128 },
        { input: 128, brightness: 50, expected: 178 },
        { input: 128, brightness: -50, expected: 78 },
        { input: 200, brightness: 100, expected: 255 }, // Clamp upper
        { input: 50, brightness: -100, expected: 0 }, // Clamp lower
        { input: 0, brightness: 50, expected: 50 },
        { input: 255, brightness: -50, expected: 205 },
      ];

      testCases.forEach(({ input, brightness, expected }) => {
        const imageData = createTestImageData([[input, input, input, 255]]);
        const output = applyBrightness(imageData, brightness);
        const pixels = extractPixels(output);

        expect(pixels[0]).toEqual([expected, expected, expected, 255]);
      });
    });
  });
});
