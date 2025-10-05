import { describe, it, expect } from 'vitest';
import { validateImageDimensions } from '@/lib/validation/imageDimensionValidator';

describe('imageDimensionValidator', () => {
  const createMockImage = (width: number, height: number): HTMLImageElement => {
    return {
      naturalWidth: width,
      naturalHeight: height,
    } as HTMLImageElement;
  };

  it('should accept image within dimension limits', () => {
    const img = createMockImage(800, 600);
    const result = validateImageDimensions(img);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept image at maximum width', () => {
    const img = createMockImage(10000, 5000);
    const result = validateImageDimensions(img);
    expect(result.valid).toBe(true);
  });

  it('should accept image at maximum height', () => {
    const img = createMockImage(5000, 10000);
    const result = validateImageDimensions(img);
    expect(result.valid).toBe(true);
  });

  it('should accept image at maximum dimensions', () => {
    const img = createMockImage(10000, 10000);
    const result = validateImageDimensions(img);
    expect(result.valid).toBe(true);
  });

  it('should reject image exceeding maximum width', () => {
    const img = createMockImage(10001, 5000);
    const result = validateImageDimensions(img);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Image dimensions too large. Maximum is 10000×10000 pixels.');
  });

  it('should reject image exceeding maximum height', () => {
    const img = createMockImage(5000, 10001);
    const result = validateImageDimensions(img);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Image dimensions too large. Maximum is 10000×10000 pixels.');
  });

  it('should reject image exceeding both dimensions', () => {
    // 12000 x 12000 = 144MP which exceeds 100MP limit
    // So this will trigger the megapixel error first
    const img = createMockImage(12000, 12000);
    const result = validateImageDimensions(img);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Image is too complex to process. Please use a smaller image.');
  });

  it('should accept tiny 1x1 image', () => {
    const img = createMockImage(1, 1);
    const result = validateImageDimensions(img);
    expect(result.valid).toBe(true);
  });

  it('should reject image exceeding 100 megapixel limit', () => {
    // 10000 x 10001 = 100,010,000 pixels (just over 100MP)
    const img = createMockImage(10000, 10001);
    const result = validateImageDimensions(img);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Image is too complex to process. Please use a smaller image.');
  });

  it('should accept image at exactly 100 megapixels', () => {
    // 10000 x 10000 = 100,000,000 pixels (exactly 100MP)
    const img = createMockImage(10000, 10000);
    const result = validateImageDimensions(img);
    expect(result.valid).toBe(true);
  });

  it('should handle large megapixel image under dimension limits', () => {
    // 9000 x 11000 = 99,000,000 pixels (under 100MP but height exceeds)
    const img = createMockImage(9000, 11000);
    const result = validateImageDimensions(img);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Image dimensions too large. Maximum is 10000×10000 pixels.');
  });
});
