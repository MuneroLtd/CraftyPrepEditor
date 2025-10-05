import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateImageDecode } from '@/lib/validation/imageDecoder';

describe('imageDecoder', () => {
  beforeEach(() => {
    // Clear any mocks between tests
    vi.clearAllMocks();
  });

  it('should successfully decode valid image', async () => {
    const blob = new Blob(['fake-image-data'], { type: 'image/jpeg' });
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    // Mock Image constructor
    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') {
          // Simulate successful load
          setTimeout(() => handler(), 0);
        }
      }),
      removeEventListener: vi.fn(),
      src: '',
      naturalWidth: 800,
      naturalHeight: 600,
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    const result = await validateImageDecode(file);

    expect(result).toBeDefined();
    expect(result.naturalWidth).toBe(800);
    expect(result.naturalHeight).toBe(600);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should reject corrupted image file', async () => {
    const blob = new Blob(['corrupted-data'], { type: 'image/jpeg' });
    const file = new File([blob], 'corrupted.jpg', { type: 'image/jpeg' });

    // Mock Image constructor with error
    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'error') {
          // Simulate error
          setTimeout(() => handler(), 0);
        }
      }),
      removeEventListener: vi.fn(),
      src: '',
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    await expect(validateImageDecode(file)).rejects.toThrow(
      'Unable to load image. File may be corrupted.'
    );
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should timeout for extremely slow loading image', async () => {
    const blob = new Blob(['slow-image'], { type: 'image/jpeg' });
    const file = new File([blob], 'slow.jpg', { type: 'image/jpeg' });

    // Mock Image constructor that never calls load or error
    const mockImage = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      src: '',
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    // Use a very short timeout for testing (10ms)
    await expect(validateImageDecode(file, 10)).rejects.toThrow('Image loading timed out.');
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  }, 15000); // Give test itself more time
});
