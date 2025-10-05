import { describe, it, expect } from 'vitest';
import { validateFileExtension } from '@/lib/validation/fileExtensionValidator';

describe('fileExtensionValidator', () => {
  it('should accept .jpg extension', () => {
    expect(validateFileExtension('image.jpg')).toBe(true);
  });

  it('should accept .jpeg extension', () => {
    expect(validateFileExtension('image.jpeg')).toBe(true);
  });

  it('should accept .png extension', () => {
    expect(validateFileExtension('image.png')).toBe(true);
  });

  it('should accept .gif extension', () => {
    expect(validateFileExtension('image.gif')).toBe(true);
  });

  it('should accept .bmp extension', () => {
    expect(validateFileExtension('image.bmp')).toBe(true);
  });

  it('should be case insensitive for .JPG', () => {
    expect(validateFileExtension('image.JPG')).toBe(true);
  });

  it('should be case insensitive for .PNG', () => {
    expect(validateFileExtension('image.PNG')).toBe(true);
  });

  it('should be case insensitive for .JPEG', () => {
    expect(validateFileExtension('image.JPEG')).toBe(true);
  });

  it('should reject .pdf extension', () => {
    expect(validateFileExtension('document.pdf')).toBe(false);
  });

  it('should reject .txt extension', () => {
    expect(validateFileExtension('file.txt')).toBe(false);
  });

  it('should reject .mp4 extension', () => {
    expect(validateFileExtension('video.mp4')).toBe(false);
  });

  it('should reject filename with no extension', () => {
    expect(validateFileExtension('image')).toBe(false);
  });

  it('should reject double extension .jpg.exe', () => {
    expect(validateFileExtension('image.jpg.exe')).toBe(false);
  });

  it('should handle filename with path', () => {
    expect(validateFileExtension('/path/to/image.png')).toBe(true);
  });

  it('should handle filename with multiple dots', () => {
    expect(validateFileExtension('my.image.file.jpg')).toBe(true);
  });
});
