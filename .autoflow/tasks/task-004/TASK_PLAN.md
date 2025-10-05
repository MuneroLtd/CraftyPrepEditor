# Task Plan: Image Canvas and Preview Display

**Task ID**: task-004
**Status**: PLANNED
**Estimated Effort**: 5 hours
**Approach**: Test-Driven Development (TDD) - 5 Phases

---

## Overview

Create a dual-canvas preview system that displays both original and processed images side-by-side (desktop) or stacked (mobile). Implement zoom and pan capabilities for detailed inspection, with proper memory management and performance optimization.

**Key Components**:
1. `ImageCanvas` - Reusable canvas component for rendering single image
2. `ImagePreview` - Container managing dual canvas layout and zoom/pan state
3. `ZoomControls` - UI controls for zoom level adjustment
4. Canvas utility functions for aspect ratio, centering, transforms

**Input**: `uploadedImage: HTMLImageElement | null` from `useFileUpload` hook
**Output**: Responsive dual-canvas preview with zoom/pan controls

---

## Phase 1: Canvas Rendering Foundation (45 minutes)

### Objective
Create the base `ImageCanvas` component with proper lifecycle management and accessibility.

### Tests to Write FIRST
```typescript
// src/tests/unit/components/ImageCanvas.test.tsx

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
    const { unmount, container } = render(<ImageCanvas image={null} alt="Test" />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const clearRectSpy = vi.spyOn(ctx!, 'clearRect');

    unmount();

    expect(clearRectSpy).toHaveBeenCalled();
  });
});
```

### Implementation
```typescript
// src/components/ImageCanvas.tsx

import { useRef, useEffect } from 'react';

interface ImageCanvasProps {
  image: HTMLImageElement | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ImageCanvas({
  image,
  alt,
  width = 800,
  height = 600,
  className = ''
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cleanup function
    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={alt}
    />
  );
}
```

### Acceptance Criteria
- [ ] Canvas element renders correctly
- [ ] Canvas dimensions configurable via props
- [ ] 2D context created successfully
- [ ] Accessibility: canvas has proper ARIA label
- [ ] Memory: context cleaned up on unmount

---

## Phase 2: Image Loading and Drawing (60 minutes)

### Objective
Implement image drawing logic with aspect ratio preservation and centering.

### Tests to Write FIRST
```typescript
// src/tests/unit/components/ImageCanvas.test.tsx (continued)

describe('ImageCanvas - Image Drawing', () => {
  it('draws image to canvas when provided', async () => {
    const mockImage = createMockImage(400, 300);
    const { container } = render(<ImageCanvas image={mockImage} alt="Test" />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const drawImageSpy = vi.spyOn(ctx!, 'drawImage');

    await waitFor(() => {
      expect(drawImageSpy).toHaveBeenCalledWith(
        mockImage,
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  it('handles null image gracefully', () => {
    const { container } = render(<ImageCanvas image={null} alt="Empty" />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const drawImageSpy = vi.spyOn(ctx!, 'drawImage');

    expect(drawImageSpy).not.toHaveBeenCalled();
  });

  it('updates canvas when image prop changes', async () => {
    const image1 = createMockImage(400, 300);
    const image2 = createMockImage(800, 600);

    const { rerender, container } = render(<ImageCanvas image={image1} alt="Test" />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const drawImageSpy = vi.spyOn(ctx!, 'drawImage');

    await waitFor(() => expect(drawImageSpy).toHaveBeenCalledTimes(1));

    rerender(<ImageCanvas image={image2} alt="Test" />);

    await waitFor(() => expect(drawImageSpy).toHaveBeenCalledTimes(2));
  });

  it('preserves aspect ratio when scaling', async () => {
    const wideImage = createMockImage(1600, 800); // 2:1 ratio
    render(<ImageCanvas image={wideImage} alt="Test" width={800} height={600} />);

    // Image should be scaled to fit canvas while maintaining 2:1 ratio
    // Expected: 800x400 (fits width, preserves ratio)
    // Positioned at x=0, y=100 (centered vertically)
    await waitFor(() => {
      const canvas = screen.getByRole('img') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      const drawImageSpy = vi.spyOn(ctx!, 'drawImage');

      expect(drawImageSpy).toHaveBeenCalledWith(
        wideImage,
        0,      // x position
        100,    // y position (centered)
        800,    // scaled width
        400     // scaled height (maintains 2:1 ratio)
      );
    });
  });
});

// src/tests/unit/lib/canvas/calculateAspectRatio.test.ts

describe('calculateAspectRatio', () => {
  it('calculates dimensions for landscape image', () => {
    const result = calculateAspectRatio(
      { width: 1600, height: 800 },  // Image: 2:1
      { width: 800, height: 600 }     // Canvas
    );
    expect(result).toEqual({
      width: 800,
      height: 400,
      x: 0,
      y: 100  // Centered vertically
    });
  });

  it('calculates dimensions for portrait image', () => {
    const result = calculateAspectRatio(
      { width: 800, height: 1600 },  // Image: 1:2
      { width: 800, height: 600 }     // Canvas
    );
    expect(result).toEqual({
      width: 300,   // Scaled to fit height
      height: 600,
      x: 250,       // Centered horizontally
      y: 0
    });
  });

  it('handles exact fit (no scaling needed)', () => {
    const result = calculateAspectRatio(
      { width: 800, height: 600 },
      { width: 800, height: 600 }
    );
    expect(result).toEqual({
      width: 800,
      height: 600,
      x: 0,
      y: 0
    });
  });
});
```

### Implementation
```typescript
// src/lib/canvas/calculateAspectRatio.ts

export interface Dimensions {
  width: number;
  height: number;
}

export interface DrawPosition extends Dimensions {
  x: number;
  y: number;
}

/**
 * Calculate scaled dimensions and position to fit image within canvas
 * while preserving aspect ratio and centering.
 */
export function calculateAspectRatio(
  image: Dimensions,
  canvas: Dimensions
): DrawPosition {
  const imageRatio = image.width / image.height;
  const canvasRatio = canvas.width / canvas.height;

  let width: number;
  let height: number;

  if (imageRatio > canvasRatio) {
    // Image is wider than canvas - fit to width
    width = canvas.width;
    height = width / imageRatio;
  } else {
    // Image is taller than canvas - fit to height
    height = canvas.height;
    width = height * imageRatio;
  }

  // Center the image
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  return { width, height, x, y };
}

// src/components/ImageCanvas.tsx (updated)

import { useRef, useEffect } from 'react';
import { calculateAspectRatio } from '@/lib/canvas/calculateAspectRatio';

export function ImageCanvas({ image, alt, width = 800, height = 600, className = '' }: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image if provided
    if (image && image.complete) {
      const position = calculateAspectRatio(
        { width: image.naturalWidth, height: image.naturalHeight },
        { width: canvas.width, height: canvas.height }
      );

      ctx.drawImage(
        image,
        position.x,
        position.y,
        position.width,
        position.height
      );
    }

    // Cleanup
    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [image, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={alt}
    />
  );
}
```

### Acceptance Criteria
- [ ] Image drawn to canvas correctly
- [ ] Aspect ratio preserved during scaling
- [ ] Image centered on canvas
- [ ] Null image handled gracefully
- [ ] Canvas updates when image changes
- [ ] Utility function has ≥80% test coverage

---

## Phase 3: Responsive Layout and Container (45 minutes)

### Objective
Create `ImagePreview` container with responsive dual-canvas layout and window resize handling.

### Tests to Write FIRST
```typescript
// src/tests/unit/components/ImagePreview.test.tsx

describe('ImagePreview', () => {
  it('renders two ImageCanvas components', () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);
    const canvases = screen.getAllByRole('img');
    expect(canvases).toHaveLength(2);
  });

  it('labels canvases correctly', () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);
    expect(screen.getByLabelText(/original image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/processed image/i)).toBeInTheDocument();
  });

  it('has section labels "Original" and "Processed"', () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);
    expect(screen.getByText(/original/i)).toBeInTheDocument();
    expect(screen.getByText(/processed/i)).toBeInTheDocument();
  });

  it('uses responsive flex layout classes', () => {
    const { container } = render(<ImagePreview originalImage={null} processedImage={null} />);
    const wrapper = container.querySelector('[class*="flex"]');

    // Should have: flex flex-col lg:flex-row (stacked mobile, side-by-side desktop)
    expect(wrapper?.className).toMatch(/flex/);
    expect(wrapper?.className).toMatch(/flex-col/);
    expect(wrapper?.className).toMatch(/lg:flex-row/);
  });

  it('updates canvas dimensions on window resize', async () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);

    const initialCanvases = screen.getAllByRole('img') as HTMLCanvasElement[];
    const initialWidth = initialCanvases[0].width;

    // Simulate window resize
    global.innerWidth = 1200;
    window.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      const updatedCanvases = screen.getAllByRole('img') as HTMLCanvasElement[];
      expect(updatedCanvases[0].width).not.toBe(initialWidth);
    });
  });

  it('cleans up resize listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ImagePreview originalImage={null} processedImage={null} />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
```

### Implementation
```typescript
// src/components/ImagePreview.tsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { ImageCanvas } from './ImageCanvas';

interface ImagePreviewProps {
  originalImage: HTMLImageElement | null;
  processedImage: HTMLImageElement | null;
}

export function ImagePreview({ originalImage, processedImage }: ImagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });

  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;

    // Calculate height to maintain 4:3 aspect ratio
    const height = (width * 3) / 4;

    setCanvasDimensions({ width, height });
  }, []);

  useEffect(() => {
    // Initial calculation
    updateDimensions();

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateDimensions]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Original Image */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Original</h3>
          <ImageCanvas
            image={originalImage}
            alt="Original image preview"
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            className="border border-gray-300 rounded"
          />
        </div>

        {/* Processed Image */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Processed</h3>
          <ImageCanvas
            image={processedImage}
            alt="Processed image preview"
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            className="border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
}
```

### Acceptance Criteria
- [ ] Two canvases rendered side-by-side on desktop (≥1024px)
- [ ] Two canvases stacked on mobile (<768px)
- [ ] Section labels ("Original", "Processed") visible
- [ ] Canvas resizes on window resize (debounced)
- [ ] Resize listener cleaned up on unmount
- [ ] Responsive Tailwind classes applied correctly

---

## Phase 4: Zoom and Pan Controls (90 minutes)

### Objective
Implement zoom controls (buttons + slider) and pan/drag functionality with bounds checking.

### Tests to Write FIRST
```typescript
// src/tests/unit/components/ZoomControls.test.tsx

describe('ZoomControls', () => {
  it('renders zoom in and zoom out buttons', () => {
    render(<ZoomControls zoom={1} onZoomChange={vi.fn()} />);
    expect(screen.getByLabelText(/zoom in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zoom out/i)).toBeInTheDocument();
  });

  it('renders zoom slider', () => {
    render(<ZoomControls zoom={1} onZoomChange={vi.fn()} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
  });

  it('displays current zoom level', () => {
    render(<ZoomControls zoom={2.5} onZoomChange={vi.fn()} />);
    expect(screen.getByText(/250%/i)).toBeInTheDocument();
  });

  it('increases zoom on zoom in button click', () => {
    const handleZoom = vi.fn();
    render(<ZoomControls zoom={1} onZoomChange={handleZoom} />);

    const zoomInBtn = screen.getByLabelText(/zoom in/i);
    fireEvent.click(zoomInBtn);

    expect(handleZoom).toHaveBeenCalledWith(1.25); // 25% increment
  });

  it('decreases zoom on zoom out button click', () => {
    const handleZoom = vi.fn();
    render(<ZoomControls zoom={2} onZoomChange={handleZoom} />);

    const zoomOutBtn = screen.getByLabelText(/zoom out/i);
    fireEvent.click(zoomOutBtn);

    expect(handleZoom).toHaveBeenCalledWith(1.75);
  });

  it('disables zoom out at minimum (1x)', () => {
    render(<ZoomControls zoom={1} onZoomChange={vi.fn()} />);
    const zoomOutBtn = screen.getByLabelText(/zoom out/i);
    expect(zoomOutBtn).toBeDisabled();
  });

  it('disables zoom in at maximum (4x)', () => {
    render(<ZoomControls zoom={4} onZoomChange={vi.fn()} />);
    const zoomInBtn = screen.getByLabelText(/zoom in/i);
    expect(zoomInBtn).toBeDisabled();
  });

  it('updates zoom via slider', () => {
    const handleZoom = vi.fn();
    render(<ZoomControls zoom={1} onZoomChange={handleZoom} />);

    const slider = screen.getByRole('slider') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '3' } });

    expect(handleZoom).toHaveBeenCalledWith(3);
  });

  it('renders reset button', () => {
    render(<ZoomControls zoom={2} onZoomChange={vi.fn()} onReset={vi.fn()} />);
    expect(screen.getByText(/reset/i)).toBeInTheDocument();
  });

  it('calls onReset when reset button clicked', () => {
    const handleReset = vi.fn();
    render(<ZoomControls zoom={2} onZoomChange={vi.fn()} onReset={handleReset} />);

    const resetBtn = screen.getByText(/reset/i);
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalled();
  });
});

// src/tests/unit/components/ImagePreview.test.tsx (continued)

describe('ImagePreview - Zoom and Pan', () => {
  it('initializes zoom at 1x', () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
  });

  it('enables pan drag on mouse down', () => {
    const mockImage = createMockImage(1600, 1200);
    render(<ImagePreview originalImage={mockImage} processedImage={null} />);

    const canvas = screen.getByLabelText(/original image/i);

    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(canvas);

    // Canvas should have translated
    // (verified via transform or context.translate spy)
  });

  it('constrains pan within image bounds', () => {
    const mockImage = createMockImage(800, 600);
    const { container } = render(<ImagePreview originalImage={mockImage} processedImage={null} />);

    // Attempt to pan beyond image bounds
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const translateSpy = vi.spyOn(ctx!, 'translate');

    // Pan should be constrained (not exceed image dimensions)
    // Implementation will clamp pan offset
  });

  it('resets zoom and pan on reset button click', () => {
    render(<ImagePreview originalImage={null} processedImage={null} />);

    // Zoom in first
    const zoomInBtn = screen.getByLabelText(/zoom in/i);
    fireEvent.click(zoomInBtn);
    expect(screen.getByText(/125%/i)).toBeInTheDocument();

    // Reset
    const resetBtn = screen.getByText(/reset/i);
    fireEvent.click(resetBtn);

    expect(screen.getByText(/100%/i)).toBeInTheDocument();
  });

  it('applies zoom transform to canvas context', () => {
    const mockImage = createMockImage(800, 600);
    const { container } = render(<ImagePreview originalImage={mockImage} processedImage={null} />);

    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const scaleSpy = vi.spyOn(ctx!, 'scale');

    // Zoom to 2x
    const zoomInBtn = screen.getByLabelText(/zoom in/i);
    fireEvent.click(zoomInBtn);

    waitFor(() => {
      expect(scaleSpy).toHaveBeenCalledWith(1.25, 1.25);
    });
  });
});
```

### Implementation
```typescript
// src/components/ZoomControls.tsx

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onReset?: () => void;
  minZoom?: number;
  maxZoom?: number;
}

export function ZoomControls({
  zoom,
  onZoomChange,
  onReset,
  minZoom = 1,
  maxZoom = 4
}: ZoomControlsProps) {
  const zoomPercent = Math.round(zoom * 100);
  const step = 0.25;

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + step, maxZoom);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - step, minZoom);
    onZoomChange(newZoom);
  };

  const handleSliderChange = (values: number[]) => {
    onZoomChange(values[0]);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomOut}
        disabled={zoom <= minZoom}
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 flex-1 max-w-xs">
        <Slider
          value={[zoom]}
          onValueChange={handleSliderChange}
          min={minZoom}
          max={maxZoom}
          step={step}
          aria-label="Zoom level"
          className="flex-1"
        />
        <span className="text-sm font-medium w-16 text-right">
          {zoomPercent}%
        </span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomIn}
        disabled={zoom >= maxZoom}
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          aria-label="Reset zoom and pan"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      )}
    </div>
  );
}

// src/components/ImagePreview.tsx (updated with zoom/pan)

import { useState, useEffect, useCallback, useRef } from 'react';
import { ImageCanvas } from './ImageCanvas';
import { ZoomControls } from './ZoomControls';

interface PanOffset {
  x: number;
  y: number;
}

export function ImagePreview({ originalImage, processedImage }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState<PanOffset>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<PanOffset>({ x: 0, y: 0 });

  const handleReset = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom === 1) return; // No panning at 1x zoom

    setIsDragging(true);
    setDragStart({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y
    });
  }, [zoom, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const newOffset = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };

    // TODO: Constrain to image bounds
    setPanOffset(newOffset);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full">
      {/* Zoom Controls */}
      <div className="mb-4">
        <ZoomControls
          zoom={zoom}
          onZoomChange={setZoom}
          onReset={handleReset}
        />
      </div>

      {/* Dual Canvas Preview */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Original</h3>
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          >
            <ImageCanvas
              image={originalImage}
              alt="Original image preview"
              width={800}
              height={600}
              zoom={zoom}
              panOffset={panOffset}
              className="border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Processed</h3>
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          >
            <ImageCanvas
              image={processedImage}
              alt="Processed image preview"
              width={800}
              height={600}
              zoom={zoom}
              panOffset={panOffset}
              className="border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/ImageCanvas.tsx (updated with zoom/pan)

interface ImageCanvasProps {
  image: HTMLImageElement | null;
  alt: string;
  width?: number;
  height?: number;
  zoom?: number;
  panOffset?: { x: number; y: number };
  className?: string;
}

export function ImageCanvas({
  image,
  alt,
  width = 800,
  height = 600,
  zoom = 1,
  panOffset = { x: 0, y: 0 },
  className = ''
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save context state
    ctx.save();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan transforms
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    // Draw image if provided
    if (image && image.complete) {
      const position = calculateAspectRatio(
        { width: image.naturalWidth, height: image.naturalHeight },
        { width: canvas.width, height: canvas.height }
      );

      ctx.drawImage(
        image,
        position.x,
        position.y,
        position.width,
        position.height
      );
    }

    // Restore context state
    ctx.restore();

    // Cleanup
    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [image, width, height, zoom, panOffset]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={alt}
    />
  );
}
```

### Acceptance Criteria
- [ ] Zoom in/out buttons functional
- [ ] Zoom slider updates zoom level
- [ ] Zoom constrained to 1x-4x range
- [ ] Zoom percentage displayed (100%-400%)
- [ ] Pan/drag enabled when zoomed
- [ ] Pan constrained to image bounds
- [ ] Reset button restores zoom=1, pan=0
- [ ] Cursor changes to grab/grabbing
- [ ] Keyboard accessible (Tab, Enter, arrow keys)

---

## Phase 5: Performance and Memory Optimization (60 minutes)

### Objective
Optimize rendering performance and ensure proper memory management with no leaks.

### Tests to Write FIRST
```typescript
// src/tests/integration/CanvasPerformance.test.tsx

describe('Canvas Performance', () => {
  it('renders 2MB image in under 1 second', async () => {
    const large2MBImage = await createLargeTestImage(2 * 1024 * 1024); // 2MB

    const startTime = performance.now();
    render(<ImagePreview originalImage={large2MBImage} processedImage={null} />);

    await waitFor(() => {
      const canvas = screen.getByLabelText(/original image/i) as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      expect(ctx?.getImageData(0, 0, 1, 1)).toBeTruthy();
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(1000); // <1s
  });

  it('does not leak memory after multiple image loads', async () => {
    const { rerender } = render(<ImagePreview originalImage={null} processedImage={null} />);

    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

    // Load and unload images 10 times
    for (let i = 0; i < 10; i++) {
      const testImage = createMockImage(800, 600);
      rerender(<ImagePreview originalImage={testImage} processedImage={null} />);
      await waitFor(() => expect(screen.getByLabelText(/original/i)).toBeInTheDocument());

      rerender(<ImagePreview originalImage={null} processedImage={null} />);
    }

    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be minimal (<10MB growth)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });

  it('debounces window resize events', async () => {
    const { container } = render(<ImagePreview originalImage={null} processedImage={null} />);

    let resizeCount = 0;
    const observer = new MutationObserver(() => resizeCount++);
    observer.observe(container, { attributes: true, subtree: true });

    // Trigger 10 resize events rapidly
    for (let i = 0; i < 10; i++) {
      window.dispatchEvent(new Event('resize'));
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    // Should only resize once due to debouncing
    expect(resizeCount).toBeLessThanOrEqual(2);
    observer.disconnect();
  });

  it('uses requestAnimationFrame for smooth pan dragging', async () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    const mockImage = createMockImage(1600, 1200);

    render(<ImagePreview originalImage={mockImage} processedImage={null} />);

    const canvas = screen.getByLabelText(/original/i);

    // Start drag
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });

    // Should use RAF for smooth updates
    expect(rafSpy).toHaveBeenCalled();
  });
});

// src/tests/unit/components/ImageCanvas.test.tsx (memory tests)

describe('ImageCanvas - Memory Management', () => {
  it('clears canvas context on unmount', () => {
    const { container, unmount } = render(<ImageCanvas image={null} alt="Test" />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const clearRectSpy = vi.spyOn(ctx!, 'clearRect');

    unmount();

    expect(clearRectSpy).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
  });

  it('clears and redraws when dependencies change', async () => {
    const image1 = createMockImage(400, 300);
    const image2 = createMockImage(800, 600);

    const { rerender, container } = render(<ImageCanvas image={image1} alt="Test" />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const clearRectSpy = vi.spyOn(ctx!, 'clearRect');

    rerender(<ImageCanvas image={image2} alt="Test" />);

    await waitFor(() => {
      // Should clear before redrawing
      expect(clearRectSpy).toHaveBeenCalled();
    });
  });
});
```

### Implementation
```typescript
// Optimization 1: Debounce utility

// src/lib/utils/debounce.ts (if not exists)

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Optimization 2: Use requestAnimationFrame for pan

// src/components/ImagePreview.tsx (optimized)

const handleMouseMove = useCallback((e: React.MouseEvent) => {
  if (!isDragging) return;

  // Use RAF for smooth updates
  requestAnimationFrame(() => {
    const newOffset = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };

    // Constrain pan to image bounds
    // (bounds calculation based on image dimensions and zoom)
    setPanOffset(newOffset);
  });
}, [isDragging, dragStart]);

// Optimization 3: Memoize expensive calculations

import { useMemo } from 'react';

const imageBounds = useMemo(() => {
  if (!originalImage) return null;

  return {
    width: originalImage.naturalWidth * zoom,
    height: originalImage.naturalHeight * zoom
  };
}, [originalImage, zoom]);

// Optimization 4: Cleanup canvas properly

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // ... drawing logic ...

  return () => {
    // Clear canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset transforms
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
}, [image, width, height, zoom, panOffset]);
```

### Acceptance Criteria
- [ ] 2MB image renders in <1 second
- [ ] No memory leaks after multiple image loads
- [ ] Window resize debounced (100ms)
- [ ] Pan dragging uses requestAnimationFrame
- [ ] Canvas context properly reset on cleanup
- [ ] All tests passing with ≥80% coverage
- [ ] Performance profiling shows no bottlenecks

---

## Integration Points

### Input Dependencies
- `uploadedImage: HTMLImageElement | null` from `useFileUpload` hook (task-003)
- Window resize events (browser API)
- Mouse events for pan/drag (browser API)

### Output/Exports
```typescript
// Components exported for use in App.tsx
export { ImagePreview } from '@/components/ImagePreview';
export { ImageCanvas } from '@/components/ImageCanvas';
export { ZoomControls } from '@/components/ZoomControls';

// Utilities exported for reuse
export { calculateAspectRatio } from '@/lib/canvas/calculateAspectRatio';
export { debounce } from '@/lib/utils/debounce';
```

### Usage in App.tsx
```typescript
import { ImagePreview } from '@/components/ImagePreview';
import { useFileUpload } from '@/hooks/useFileUpload';

function App() {
  const { uploadedImage } = useFileUpload();

  return (
    <Layout>
      <FileUploadComponent />

      {uploadedImage && (
        <ImagePreview
          originalImage={uploadedImage}
          processedImage={null} // Will be populated by task-008
        />
      )}
    </Layout>
  );
}
```

---

## Files to Create

### Components
- `src/components/ImageCanvas.tsx` - Reusable single canvas component
- `src/components/ImagePreview.tsx` - Dual canvas container with zoom/pan
- `src/components/ZoomControls.tsx` - Zoom UI controls (buttons + slider)

### Utilities
- `src/lib/canvas/calculateAspectRatio.ts` - Aspect ratio calculation
- `src/lib/utils/debounce.ts` - Debounce utility (if not exists)

### Tests
- `src/tests/unit/components/ImageCanvas.test.tsx`
- `src/tests/unit/components/ImagePreview.test.tsx`
- `src/tests/unit/components/ZoomControls.test.tsx`
- `src/tests/unit/lib/canvas/calculateAspectRatio.test.ts`
- `src/tests/integration/CanvasRendering.test.tsx`
- `src/tests/integration/CanvasPerformance.test.tsx`

---

## Testing Strategy

### Unit Tests (≥80% coverage)
- Component rendering and props
- Canvas lifecycle (mount, update, unmount)
- Zoom control interactions
- Utility function correctness
- Memory cleanup validation

### Integration Tests
- Full image load → canvas render flow
- Zoom + pan combined interactions
- Responsive layout transitions
- Performance benchmarks

### Manual Testing Checklist
- [ ] Upload image → appears in both canvases
- [ ] Desktop: side-by-side layout
- [ ] Mobile: stacked layout
- [ ] Zoom in: image scales correctly
- [ ] Zoom out: image scales correctly
- [ ] Pan drag: smooth movement
- [ ] Reset: returns to 1x zoom, 0 pan
- [ ] Window resize: canvases adjust
- [ ] Multiple images: no memory leaks
- [ ] Keyboard navigation works

---

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Canvas performance slow on large images | High | Medium | Optimize with requestAnimationFrame, debouncing |
| Memory leaks from canvas contexts | High | Medium | Rigorous cleanup in useEffect return |
| Pan bounds calculation complex | Medium | Medium | Thorough unit tests for edge cases |
| Responsive layout breaks on edge sizes | Medium | Low | Test multiple breakpoints |
| Zoom transform incorrect | Medium | Low | Visual tests + manual verification |

---

## Estimated Timeline

- **Phase 1**: 45 minutes (Canvas foundation)
- **Phase 2**: 60 minutes (Image drawing + aspect ratio)
- **Phase 3**: 45 minutes (Responsive layout + resize)
- **Phase 4**: 90 minutes (Zoom/pan controls + interaction)
- **Phase 5**: 60 minutes (Performance + memory optimization)

**Total**: 5 hours

---

## Success Criteria

✅ **Task is complete when**:
- All 5 TDD phases implemented and tests passing
- Both canvases render correctly (original + processed)
- Responsive layout working (side-by-side ≥1024px, stacked <768px)
- Zoom controls functional (1x-4x range)
- Pan/drag working smoothly (RAF-based)
- Performance target met (<1s for 2MB image)
- No memory leaks (verified in tests)
- Test coverage ≥80%
- Code review passed (DRY, SOLID, FANG principles)
- Accessibility working (keyboard nav, alt text, ARIA labels)

---

## Next Steps After Completion

1. Update `TASK.md` status: `PENDING` → `PLANNED` → `REVIEW` (via `/build`)
2. Move to task-005: Grayscale Conversion Algorithm
3. ImagePreview will receive `processedImage` from task-008 (Auto-Prep pipeline)
