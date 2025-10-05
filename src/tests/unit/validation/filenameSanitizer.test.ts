import { describe, it, expect } from 'vitest';
import { sanitizeFilename } from '@/lib/validation/filenameSanitizer';

describe('filenameSanitizer', () => {
  it('should leave safe filename unchanged', () => {
    expect(sanitizeFilename('image.jpg')).toBe('image.jpg');
  });

  it('should leave alphanumeric with dashes and underscores', () => {
    expect(sanitizeFilename('my-image_2023.png')).toBe('my-image_2023.png');
  });

  it('should replace forward slash with underscore', () => {
    expect(sanitizeFilename('path/to/image.jpg')).toBe('path_to_image.jpg');
  });

  it('should replace backslash with underscore', () => {
    expect(sanitizeFilename('path\\to\\image.jpg')).toBe('path_to_image.jpg');
  });

  it('should replace question mark with underscore', () => {
    expect(sanitizeFilename('image?.jpg')).toBe('image_.jpg');
  });

  it('should replace percent with underscore', () => {
    expect(sanitizeFilename('image%20.jpg')).toBe('image_20.jpg');
  });

  it('should replace asterisk with underscore', () => {
    expect(sanitizeFilename('image*.jpg')).toBe('image_.jpg');
  });

  it('should replace colon with underscore', () => {
    expect(sanitizeFilename('image:test.jpg')).toBe('image_test.jpg');
  });

  it('should replace pipe with underscore', () => {
    expect(sanitizeFilename('image|test.jpg')).toBe('image_test.jpg');
  });

  it('should replace double quote with underscore', () => {
    expect(sanitizeFilename('image"test.jpg')).toBe('image_test.jpg');
  });

  it('should replace less than with underscore', () => {
    expect(sanitizeFilename('image<test.jpg')).toBe('image_test.jpg');
  });

  it('should replace greater than with underscore', () => {
    expect(sanitizeFilename('image>test.jpg')).toBe('image_test.jpg');
  });

  it('should replace multiple special characters', () => {
    expect(sanitizeFilename('my/photo?.jpg')).toBe('my_photo_.jpg');
  });

  it('should handle filename with all special characters', () => {
    expect(sanitizeFilename('/\\?%*:|"<>')).toBe('__________');
  });

  it('should preserve spaces', () => {
    expect(sanitizeFilename('my image.jpg')).toBe('my image.jpg');
  });

  it('should handle empty string', () => {
    expect(sanitizeFilename('')).toBe('');
  });
});
