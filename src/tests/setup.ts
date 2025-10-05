import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Extend Vitest's expect with jest-dom matchers
expect.extend({});

// Polyfill ImageData for test environment
// happy-dom doesn't provide ImageData, so we implement a minimal version
if (typeof ImageData === 'undefined') {
  class ImageDataPolyfill {
    public data: Uint8ClampedArray;
    public width: number;
    public height: number;

    constructor(dataOrWidth: Uint8ClampedArray | number, widthOrHeight: number, height?: number) {
      if (dataOrWidth instanceof Uint8ClampedArray) {
        // ImageData(data, width, height?)
        this.data = dataOrWidth;
        this.width = widthOrHeight;
        this.height = height ?? dataOrWidth.length / (widthOrHeight * 4);
      } else {
        // ImageData(width, height)
        this.width = dataOrWidth;
        this.height = widthOrHeight;
        this.data = new Uint8ClampedArray(dataOrWidth * widthOrHeight * 4);
      }
    }
  }

  // @ts-expect-error - Polyfill for test environment
  global.ImageData = ImageDataPolyfill;
}
