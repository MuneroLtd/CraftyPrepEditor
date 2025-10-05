import { describe, it, expect, vi } from 'vitest';
import { validateFile } from '@/lib/validation/fileValidator';

describe('fileValidator', () => {
  it('should successfully validate a valid image file', async () => {
    const blob = new Blob(['fake-image'], { type: 'image/jpeg' });
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    // Mock Image to simulate successful load
    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') setTimeout(() => handler(), 0);
      }),
      removeEventListener: vi.fn(),
      src: '',
      naturalWidth: 800,
      naturalHeight: 600,
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    const result = await validateFile(file);

    expect(result.valid).toBe(true);
    expect(result.sanitizedFilename).toBe('test.jpg');
    expect(result.image).toBeDefined();
    expect(result.image?.naturalWidth).toBe(800);
    expect(result.image?.naturalHeight).toBe(600);
    expect(result.error).toBeUndefined();
  });

  it('should fail on invalid MIME type', async () => {
    const file = new File(['test'], 'document.pdf', { type: 'application/pdf' });

    const result = await validateFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Unsupported file type. Please upload JPG, PNG, GIF, or BMP.');
  });

  it('should fail on invalid file extension', async () => {
    const file = new File(['test'], 'image.txt', { type: 'image/jpeg' });

    const result = await validateFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Unsupported file type. Please upload JPG, PNG, GIF, or BMP.');
  });

  it('should fail on file size exceeding limit', async () => {
    const largeData = new ArrayBuffer(11 * 1024 * 1024); // 11MB
    const file = new File([largeData], 'large.jpg', { type: 'image/jpeg' });

    const result = await validateFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('File too large');
    expect(result.error).toContain('10MB');
  });

  it('should sanitize dangerous characters in filename', async () => {
    const blob = new Blob(['fake-image'], { type: 'image/jpeg' });
    const file = new File([blob], 'my/photo?.jpg', { type: 'image/jpeg' });

    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') setTimeout(() => handler(), 0);
      }),
      removeEventListener: vi.fn(),
      src: '',
      naturalWidth: 800,
      naturalHeight: 600,
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    const result = await validateFile(file);

    expect(result.valid).toBe(true);
    expect(result.sanitizedFilename).toBe('my_photo_.jpg');
  });

  it('should fail on corrupted image', async () => {
    const blob = new Blob(['corrupted'], { type: 'image/jpeg' });
    const file = new File([blob], 'corrupted.jpg', { type: 'image/jpeg' });

    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'error') setTimeout(() => handler(), 0);
      }),
      removeEventListener: vi.fn(),
      src: '',
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    const result = await validateFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Unable to load image. File may be corrupted.');
  });

  it('should fail on image with excessive dimensions', async () => {
    const blob = new Blob(['fake-image'], { type: 'image/jpeg' });
    const file = new File([blob], 'huge.jpg', { type: 'image/jpeg' });

    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') setTimeout(() => handler(), 0);
      }),
      removeEventListener: vi.fn(),
      src: '',
      naturalWidth: 12000,
      naturalHeight: 12000,
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    const result = await validateFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Image is too complex to process. Please use a smaller image.');
  });

  it('should exit early on first validation failure', async () => {
    // File with invalid MIME type should not proceed to image decode
    const file = new File(['test'], 'invalid.pdf', { type: 'application/pdf' });

    const mockImage = vi.fn();
    global.Image = mockImage as unknown as typeof Image;

    const result = await validateFile(file);

    expect(result.valid).toBe(false);
    // Image should not have been created since MIME validation failed
    expect(mockImage).not.toHaveBeenCalled();
  });
});
