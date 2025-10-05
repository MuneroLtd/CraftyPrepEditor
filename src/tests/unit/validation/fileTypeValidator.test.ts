import { describe, it, expect } from 'vitest';
import { validateFileType } from '@/lib/validation/fileTypeValidator';

describe('fileTypeValidator', () => {
  it('should accept image/jpeg', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    expect(validateFileType(file)).toBe(true);
  });

  it('should accept image/jpg', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpg' });
    expect(validateFileType(file)).toBe(true);
  });

  it('should accept image/png', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    expect(validateFileType(file)).toBe(true);
  });

  it('should accept image/gif', () => {
    const file = new File(['test'], 'test.gif', { type: 'image/gif' });
    expect(validateFileType(file)).toBe(true);
  });

  it('should accept image/bmp', () => {
    const file = new File(['test'], 'test.bmp', { type: 'image/bmp' });
    expect(validateFileType(file)).toBe(true);
  });

  it('should reject application/pdf', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    expect(validateFileType(file)).toBe(false);
  });

  it('should reject text/plain', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    expect(validateFileType(file)).toBe(false);
  });

  it('should reject video/mp4', () => {
    const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    expect(validateFileType(file)).toBe(false);
  });

  it('should reject empty MIME type', () => {
    const file = new File(['test'], 'test.jpg', { type: '' });
    expect(validateFileType(file)).toBe(false);
  });

  it('should handle case insensitivity in MIME type', () => {
    const file = new File(['test'], 'test.jpg', { type: 'IMAGE/JPEG' });
    expect(validateFileType(file)).toBe(true);
  });
});
