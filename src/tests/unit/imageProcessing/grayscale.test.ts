import { describe, it, expect } from 'vitest';
import { convertToGrayscale } from '../../../lib/imageProcessing/grayscale';

/**
 * Test utilities for creating ImageData in Node.js environment
 */
function createImageData(width: number, height: number): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  return new ImageData(data, width, height);
}

function setPixel(
  imageData: ImageData,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number = 255
): void {
  const index = (y * imageData.width + x) * 4;
  imageData.data[index] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}

function getPixel(imageData: ImageData, x: number, y: number): [number, number, number, number] {
  const index = (y * imageData.width + x) * 4;
  return [
    imageData.data[index],
    imageData.data[index + 1],
    imageData.data[index + 2],
    imageData.data[index + 3],
  ];
}

describe('convertToGrayscale', () => {
  describe('Pure Colors', () => {
    it('should convert pure black (0,0,0) to gray 0', () => {
      const input = createImageData(1, 1);
      setPixel(input, 0, 0, 0, 0, 0);

      const output = convertToGrayscale(input);
      const [r, g, b, a] = getPixel(output, 0, 0);

      expect(r).toBe(0);
      expect(g).toBe(0);
      expect(b).toBe(0);
      expect(a).toBe(255); // alpha preserved
    });

    it('should convert pure white (255,255,255) to gray 255', () => {
      const input = createImageData(1, 1);
      setPixel(input, 0, 0, 255, 255, 255);

      const output = convertToGrayscale(input);
      const [r, g, b, a] = getPixel(output, 0, 0);

      expect(r).toBe(255);
      expect(g).toBe(255);
      expect(b).toBe(255);
      expect(a).toBe(255);
    });

    it('should convert pure red (255,0,0) to gray 76 (0.299 * 255)', () => {
      const input = createImageData(1, 1);
      setPixel(input, 0, 0, 255, 0, 0);

      const output = convertToGrayscale(input);
      const [r, g, b, a] = getPixel(output, 0, 0);

      const expectedGray = Math.round(0.299 * 255); // 76
      expect(r).toBe(expectedGray);
      expect(g).toBe(expectedGray);
      expect(b).toBe(expectedGray);
      expect(a).toBe(255);
    });

    it('should convert pure green (0,255,0) to gray 150 (0.587 * 255)', () => {
      const input = createImageData(1, 1);
      setPixel(input, 0, 0, 0, 255, 0);

      const output = convertToGrayscale(input);
      const [r, g, b, a] = getPixel(output, 0, 0);

      const expectedGray = Math.round(0.587 * 255); // 150
      expect(r).toBe(expectedGray);
      expect(g).toBe(expectedGray);
      expect(b).toBe(expectedGray);
      expect(a).toBe(255);
    });

    it('should convert pure blue (0,0,255) to gray 29 (0.114 * 255)', () => {
      const input = createImageData(1, 1);
      setPixel(input, 0, 0, 0, 0, 255);

      const output = convertToGrayscale(input);
      const [r, g, b, a] = getPixel(output, 0, 0);

      const expectedGray = Math.round(0.114 * 255); // 29
      expect(r).toBe(expectedGray);
      expect(g).toBe(expectedGray);
      expect(b).toBe(expectedGray);
      expect(a).toBe(255);
    });
  });

  describe('Mixed Colors', () => {
    it('should convert mixed color (128,64,32) using weighted formula', () => {
      const input = createImageData(1, 1);
      setPixel(input, 0, 0, 128, 64, 32);

      const output = convertToGrayscale(input);
      const [r, g, b, a] = getPixel(output, 0, 0);

      // Gray = 0.299 * 128 + 0.587 * 64 + 0.114 * 32
      // Gray = 38.272 + 37.568 + 3.648 = 79.488 ≈ 79
      const expectedGray = Math.round(0.299 * 128 + 0.587 * 64 + 0.114 * 32);
      expect(r).toBe(expectedGray);
      expect(g).toBe(expectedGray);
      expect(b).toBe(expectedGray);
      expect(a).toBe(255);
    });

    it('should handle mid-gray values (128,128,128)', () => {
      const input = createImageData(1, 1);
      setPixel(input, 0, 0, 128, 128, 128);

      const output = convertToGrayscale(input);
      const [r, g, b, a] = getPixel(output, 0, 0);

      // Gray = 0.299 * 128 + 0.587 * 128 + 0.114 * 128 = 128
      expect(r).toBe(128);
      expect(g).toBe(128);
      expect(b).toBe(128);
      expect(a).toBe(255);
    });
  });

  describe('Alpha Channel', () => {
    it('should preserve alpha channel for transparent pixels', () => {
      const input = createImageData(1, 1);
      setPixel(input, 0, 0, 255, 0, 0, 128); // semi-transparent red

      const output = convertToGrayscale(input);
      const [r, , , a] = getPixel(output, 0, 0);

      expect(a).toBe(128); // alpha preserved
      expect(r).toBe(Math.round(0.299 * 255));
    });

    it('should preserve alpha channel for fully transparent pixels', () => {
      const input = createImageData(1, 1);
      setPixel(input, 0, 0, 100, 150, 200, 0); // fully transparent

      const output = convertToGrayscale(input);
      const [r, , , a] = getPixel(output, 0, 0);

      expect(a).toBe(0); // alpha preserved
      // Grayscale still calculated even if transparent
      const expectedGray = Math.round(0.299 * 100 + 0.587 * 150 + 0.114 * 200);
      expect(r).toBe(expectedGray);
    });
  });

  describe('Full Image Processing', () => {
    it('should process all pixels in a multi-pixel image', () => {
      const width = 3;
      const height = 2;
      const input = createImageData(width, height);

      // Set various colors
      setPixel(input, 0, 0, 255, 0, 0); // red
      setPixel(input, 1, 0, 0, 255, 0); // green
      setPixel(input, 2, 0, 0, 0, 255); // blue
      setPixel(input, 0, 1, 255, 255, 255); // white
      setPixel(input, 1, 1, 0, 0, 0); // black
      setPixel(input, 2, 1, 128, 128, 128); // gray

      const output = convertToGrayscale(input);

      // Verify each pixel
      expect(getPixel(output, 0, 0)[0]).toBe(Math.round(0.299 * 255)); // red
      expect(getPixel(output, 1, 0)[0]).toBe(Math.round(0.587 * 255)); // green
      expect(getPixel(output, 2, 0)[0]).toBe(Math.round(0.114 * 255)); // blue
      expect(getPixel(output, 0, 1)[0]).toBe(255); // white
      expect(getPixel(output, 1, 1)[0]).toBe(0); // black
      expect(getPixel(output, 2, 1)[0]).toBe(128); // gray

      // All should be grayscale (R == G == B)
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const [r, g, b] = getPixel(output, x, y);
          expect(r).toBe(g);
          expect(g).toBe(b);
        }
      }
    });

    it('should maintain correct dimensions', () => {
      const width = 100;
      const height = 75;
      const input = createImageData(width, height);

      const output = convertToGrayscale(input);

      expect(output.width).toBe(width);
      expect(output.height).toBe(height);
      expect(output.data.length).toBe(width * height * 4);
    });
  });

  describe('Performance', () => {
    it('should process a 5MP image (<2MB) in under 1 second', () => {
      // 5MP ≈ 2560x1920 pixels
      const width = 2560;
      const height = 1920;
      const input = createImageData(width, height);

      // Fill with random data
      for (let i = 0; i < input.data.length; i++) {
        input.data[i] = Math.floor(Math.random() * 256);
      }

      const startTime = performance.now();
      const output = convertToGrayscale(input);
      const endTime = performance.now();

      const duration = endTime - startTime;

      // Should complete in under 1 second
      expect(duration).toBeLessThan(1000);
      expect(output.data.length).toBe(input.data.length);
    });
  });

  describe('Pure Function Behavior', () => {
    it('should not mutate the input ImageData', () => {
      const input = createImageData(2, 2);
      setPixel(input, 0, 0, 255, 0, 0);
      setPixel(input, 1, 1, 0, 255, 0);

      const originalData = new Uint8ClampedArray(input.data);

      convertToGrayscale(input);

      // Input should be unchanged
      expect(input.data).toEqual(originalData);
    });

    it('should return a new ImageData object', () => {
      const input = createImageData(1, 1);
      const output = convertToGrayscale(input);

      expect(output).not.toBe(input);
      expect(output.data).not.toBe(input.data);
    });
  });
});
