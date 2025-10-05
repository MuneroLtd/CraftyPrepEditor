import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ImageCanvas } from '@/components/ImageCanvas';

// Mock canvas context
const mockContext = {
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  translate: vi.fn(),
  setTransform: vi.fn(),
};

// Helper to create mock image
function createMockImage(width: number, height: number): HTMLImageElement {
  const img = new Image();
  Object.defineProperty(img, 'naturalWidth', { value: width, writable: false });
  Object.defineProperty(img, 'naturalHeight', { value: height, writable: false });
  Object.defineProperty(img, 'complete', { value: true, writable: true });
  return img;
}

beforeEach(() => {
  // Mock canvas getContext
  HTMLCanvasElement.prototype.getContext = vi.fn(
    () => mockContext
  ) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  // Reset all mocks
  vi.clearAllMocks();
});

describe('ImageCanvas', () => {
  it('renders a canvas element', () => {
    render(<ImageCanvas image={null} alt="Test canvas" />);
    const canvas = screen.getByRole('img', { name: /test canvas/i });
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe('CANVAS');
  });

  it('sets canvas dimensions correctly', () => {
    render(<ImageCanvas image={null} alt="Test" width={800} height={600} />);
    const canvas = screen.getByRole('img') as HTMLCanvasElement;
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });

  it('creates 2d rendering context', () => {
    const { container } = render(<ImageCanvas image={null} alt="Test" />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    expect(ctx).not.toBeNull();
  });

  it('has correct alt text for accessibility', () => {
    render(<ImageCanvas image={null} alt="Original preview" />);
    expect(screen.getByLabelText(/original preview/i)).toBeInTheDocument();
  });

  it('cleans up canvas context on unmount', () => {
    const { unmount } = render(<ImageCanvas image={null} alt="Test" />);

    unmount();

    expect(mockContext.clearRect).toHaveBeenCalled();
  });
});

describe('ImageCanvas - Image Drawing', () => {
  it('draws image to canvas when provided', async () => {
    const mockImage = createMockImage(400, 300);
    render(<ImageCanvas image={mockImage} alt="Test" />);

    await waitFor(() => {
      expect(mockContext.drawImage).toHaveBeenCalledWith(
        mockImage,
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  it('handles null image gracefully', () => {
    render(<ImageCanvas image={null} alt="Empty" />);

    expect(mockContext.drawImage).not.toHaveBeenCalled();
  });

  it('updates canvas when image prop changes', async () => {
    const image1 = createMockImage(400, 300);
    const image2 = createMockImage(800, 600);

    const { rerender } = render(<ImageCanvas image={image1} alt="Test" />);

    await waitFor(() => expect(mockContext.drawImage).toHaveBeenCalledTimes(1));

    rerender(<ImageCanvas image={image2} alt="Test" />);

    await waitFor(() => expect(mockContext.drawImage).toHaveBeenCalledTimes(2));
  });

  it('preserves aspect ratio when scaling', async () => {
    const wideImage = createMockImage(1600, 800); // 2:1 ratio
    render(<ImageCanvas image={wideImage} alt="Test" width={800} height={600} />);

    await waitFor(() => {
      // Image should be scaled to fit canvas while maintaining 2:1 ratio
      // Expected: 800x400 (fits width, preserves ratio)
      // Positioned at x=0, y=100 (centered vertically)
      expect(mockContext.drawImage).toHaveBeenCalledWith(
        wideImage,
        0, // x position
        100, // y position (centered)
        800, // scaled width
        400 // scaled height (maintains 2:1 ratio)
      );
    });
  });
});

describe('ImageCanvas - Memory Management', () => {
  it('clears canvas context on unmount', () => {
    const { unmount } = render(<ImageCanvas image={null} alt="Test" />);

    unmount();

    expect(mockContext.clearRect).toHaveBeenCalled();
  });

  it('clears and redraws when dependencies change', async () => {
    const image1 = createMockImage(400, 300);
    const image2 = createMockImage(800, 600);

    const { rerender } = render(<ImageCanvas image={image1} alt="Test" />);

    rerender(<ImageCanvas image={image2} alt="Test" />);

    await waitFor(() => {
      // Should clear before redrawing
      expect(mockContext.clearRect).toHaveBeenCalled();
    });
  });
});
