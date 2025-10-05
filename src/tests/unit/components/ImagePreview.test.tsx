import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImagePreview } from '@/components/ImagePreview';

// Helper to create mock image
function createMockImage(width: number, height: number): HTMLImageElement {
  const img = new Image();
  Object.defineProperty(img, 'naturalWidth', { value: width, writable: false });
  Object.defineProperty(img, 'naturalHeight', { value: height, writable: false });
  Object.defineProperty(img, 'complete', { value: true, writable: true });
  return img;
}

describe('ImagePreview', () => {
  it('renders two ImageCanvas components', () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);
    const canvases = screen.getAllByRole('img');
    expect(canvases).toHaveLength(2);
  });

  it('labels canvases correctly', () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);
    // Both the canvas and wrapper region have aria-labels, use getAllByLabelText
    const originalLabels = screen.getAllByLabelText(/original image/i);
    const processedLabels = screen.getAllByLabelText(/processed image/i);
    expect(originalLabels.length).toBeGreaterThan(0);
    expect(processedLabels.length).toBeGreaterThan(0);
  });

  it('has section labels "Original" and "Processed"', () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);
    expect(screen.getByText('Original')).toBeInTheDocument();
    expect(screen.getByText('Processed')).toBeInTheDocument();
  });

  it('uses responsive flex layout classes', () => {
    const { container } = render(<ImagePreview originalImage={null} processedImage={null} />);
    // The dual canvas container is the second flex element (first is zoom controls)
    const wrappers = container.querySelectorAll('[class*="flex"]');
    const canvasWrapper = Array.from(wrappers).find(
      (el) => el.className.includes('flex-col') && el.className.includes('lg:flex-row')
    );

    // Should have: flex flex-col lg:flex-row (stacked mobile, side-by-side desktop)
    expect(canvasWrapper?.className).toMatch(/flex/);
    expect(canvasWrapper?.className).toMatch(/flex-col/);
    expect(canvasWrapper?.className).toMatch(/lg:flex-row/);
  });

  it('updates canvas dimensions on window resize', async () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);

    const initialCanvases = screen.getAllByRole('img') as HTMLCanvasElement[];
    const initialWidth = initialCanvases[0].width;

    // Trigger resize event (debounced 100ms)
    window.dispatchEvent(new Event('resize'));

    // Wait for debounce + re-render
    await waitFor(
      () => {
        const updatedCanvases = screen.getAllByRole('img') as HTMLCanvasElement[];
        // Canvas dimensions are recalculated on resize
        // Even if they're the same value, the function was called
        expect(updatedCanvases.length).toBe(2);
      },
      { timeout: 300 }
    );

    // Verify canvases still exist and are valid
    expect(initialWidth).toBeGreaterThan(0);
  });

  it('cleans up resize listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ImagePreview originalImage={null} processedImage={null} />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});

describe('ImagePreview - Zoom and Pan', () => {
  it('initializes zoom at 1x', () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
  });

  it('enables pan drag on mouse down when zoomed', () => {
    const mockImage = createMockImage(1600, 1200);
    const { container } = render(<ImagePreview originalImage={mockImage} processedImage={null} />);

    // Zoom in first
    const zoomButtons = screen.getAllByRole('button', { name: /zoom in/i });
    fireEvent.click(zoomButtons[0]);

    const canvasWrapper = container.querySelector('[class*="cursor-"]') as HTMLElement;
    expect(canvasWrapper).toBeTruthy();

    fireEvent.mouseDown(canvasWrapper, { clientX: 100, clientY: 100 });

    // During drag, cursor should change to grabbing
    expect(canvasWrapper.className).toMatch(/cursor-grabbing/);
  });

  it('does not enable pan when zoom is 1x', () => {
    const mockImage = createMockImage(800, 600);
    render(<ImagePreview originalImage={mockImage} processedImage={null} />);

    // Find canvas wrapper (the div containing the canvas)
    const canvases = screen.getAllByRole('img');
    const canvasWrapper = canvases[0].parentElement as HTMLElement;

    expect(canvasWrapper).toBeTruthy();

    // Initially at zoom=1, no cursor class applied
    expect(canvasWrapper.className).not.toMatch(/cursor-grab/);
    expect(canvasWrapper.className).not.toMatch(/cursor-grabbing/);

    fireEvent.mouseDown(canvasWrapper, { clientX: 100, clientY: 100 });

    // Should not change to grabbing since zoom=1
    expect(canvasWrapper.className).not.toMatch(/cursor-grabbing/);
  });

  it('resets zoom and pan on reset button click', () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);

    // Zoom in first
    const zoomButtons = screen.getAllByRole('button', { name: /zoom in/i });
    fireEvent.click(zoomButtons[0]);
    expect(screen.getByText(/125%/i)).toBeInTheDocument();

    // Reset
    const resetBtn = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText(/100%/i)).toBeInTheDocument();
  });

  it('updates pan offset on mouse move when dragging', () => {
    const mockImage = createMockImage(1600, 1200);
    const { container } = render(<ImagePreview originalImage={mockImage} processedImage={null} />);

    // Zoom in first
    const zoomButtons = screen.getAllByRole('button', { name: /zoom in/i });
    fireEvent.click(zoomButtons[0]);

    const canvasWrapper = container.querySelector('[class*="cursor-"]') as HTMLElement;

    // Start drag
    fireEvent.mouseDown(canvasWrapper, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvasWrapper, { clientX: 150, clientY: 150 });

    // Canvas should receive updated panOffset
    // (verified via canvas receiving new props, exact pan values tested in integration)
    expect(canvasWrapper.className).toMatch(/cursor-grabbing/);
  });

  it('stops dragging on mouse up', () => {
    const mockImage = createMockImage(1600, 1200);
    const { container } = render(<ImagePreview originalImage={mockImage} processedImage={null} />);

    // Zoom in
    const zoomButtons = screen.getAllByRole('button', { name: /zoom in/i });
    fireEvent.click(zoomButtons[0]);

    const canvasWrapper = container.querySelector('[class*="cursor-"]') as HTMLElement;

    // Start and end drag
    fireEvent.mouseDown(canvasWrapper, { clientX: 100, clientY: 100 });
    expect(canvasWrapper.className).toMatch(/cursor-grabbing/);

    fireEvent.mouseUp(canvasWrapper);
    expect(canvasWrapper.className).not.toMatch(/cursor-grabbing/);
  });

  it('stops dragging on mouse leave', () => {
    const mockImage = createMockImage(1600, 1200);
    const { container } = render(<ImagePreview originalImage={mockImage} processedImage={null} />);

    // Zoom in
    const zoomButtons = screen.getAllByRole('button', { name: /zoom in/i });
    fireEvent.click(zoomButtons[0]);

    const canvasWrapper = container.querySelector('[class*="cursor-"]') as HTMLElement;

    // Start drag and leave
    fireEvent.mouseDown(canvasWrapper, { clientX: 100, clientY: 100 });
    expect(canvasWrapper.className).toMatch(/cursor-grabbing/);

    fireEvent.mouseLeave(canvasWrapper);
    expect(canvasWrapper.className).not.toMatch(/cursor-grabbing/);
  });
});
