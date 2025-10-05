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

// Mock Image for test environment
// happy-dom's Image doesn't fire onload event, so we create a mock that does
// We need to extend the actual Image class to maintain instanceof checks
const OriginalImage = global.Image;

class MockImage extends OriginalImage {
  private _onload: (() => void) | null = null;
  private _onerror: OnErrorEventHandler = null;

  get onload() {
    return this._onload;
  }

  set onload(handler: (() => void) | null) {
    this._onload = handler;
  }

  get onerror() {
    return this._onerror;
  }

  set onerror(handler: OnErrorEventHandler) {
    this._onerror = handler;
  }

  set src(value: string) {
    // Store src value without overriding width/height
    const currentWidth = this.width;
    const currentHeight = this.height;

    // Call parent src setter if it exists
    try {
      super.src = value;
    } catch {
      // If parent doesn't have src setter, define our own
      Object.defineProperty(this, '_srcValue', {
        value,
        writable: true,
        configurable: true,
      });
    }

    // Preserve width/height that were set before src
    if (currentWidth) this.width = currentWidth;
    if (currentHeight) this.height = currentHeight;

    // Use Promise.resolve() to defer onload until callbacks are attached
    // This matches browser behavior where onload fires asynchronously
    Promise.resolve().then(() => {
      if (this._onload) {
        this._onload();
      }
    });
  }

  get src(): string {
    try {
      return super.src;
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (this as any)._srcValue || '';
    }
  }
}

// Replace global Image constructor with mock
global.Image = MockImage;
