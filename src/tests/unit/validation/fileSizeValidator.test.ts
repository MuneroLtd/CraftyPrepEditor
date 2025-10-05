import { describe, it, expect } from 'vitest';
import { validateFileSize } from '@/lib/validation/fileSizeValidator';

describe('fileSizeValidator', () => {
  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  it('should accept file under 10MB', () => {
    const file = new File([new ArrayBuffer(5 * 1024 * 1024)], 'test.jpg');
    expect(validateFileSize(file)).toBe(true);
  });

  it('should accept file exactly at 10MB', () => {
    const file = new File([new ArrayBuffer(MAX_SIZE_BYTES)], 'test.jpg');
    expect(validateFileSize(file)).toBe(true);
  });

  it('should reject file over 10MB', () => {
    const file = new File([new ArrayBuffer(MAX_SIZE_BYTES + 1)], 'test.jpg');
    expect(validateFileSize(file)).toBe(false);
  });

  it('should reject file much larger than 10MB', () => {
    const file = new File([new ArrayBuffer(15 * 1024 * 1024)], 'test.jpg');
    expect(validateFileSize(file)).toBe(false);
  });

  it('should accept 0 byte file', () => {
    const file = new File([], 'test.jpg');
    expect(validateFileSize(file)).toBe(true);
  });

  it('should accept file with custom max size', () => {
    const file = new File([new ArrayBuffer(3 * 1024 * 1024)], 'test.jpg');
    expect(validateFileSize(file, 5)).toBe(true);
  });

  it('should reject file exceeding custom max size', () => {
    const file = new File([new ArrayBuffer(6 * 1024 * 1024)], 'test.jpg');
    expect(validateFileSize(file, 5)).toBe(false);
  });
});
