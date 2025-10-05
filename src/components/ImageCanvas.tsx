/**
 * ImageCanvas - Reusable canvas component for rendering images with zoom/pan support
 * @module components/ImageCanvas
 */

import { useRef, useEffect, useMemo } from 'react';
import { calculateAspectRatio } from '@/lib/canvas/calculateAspectRatio';

export interface ImageCanvasProps {
  /** Image to render on canvas */
  image: HTMLImageElement | null;
  /** Accessible label for screen readers */
  alt: string;
  /** Canvas width in pixels */
  width?: number;
  /** Canvas height in pixels */
  height?: number;
  /** Zoom level (1 = 100%, 2 = 200%, etc.) */
  zoom?: number;
  /** Pan offset {x, y} in pixels */
  panOffset?: { x: number; y: number };
  /** Additional CSS classes */
  className?: string;
}

/**
 * Canvas component that renders an image with proper aspect ratio preservation,
 * zoom, and pan support. Handles memory cleanup and transform management.
 *
 * @example
 * ```tsx
 * <ImageCanvas
 *   image={myImage}
 *   alt="Original image preview"
 *   width={800}
 *   height={600}
 *   zoom={1.5}
 *   panOffset={{ x: 0, y: 0 }}
 * />
 * ```
 */
export function ImageCanvas({
  image,
  alt,
  width = 800,
  height = 600,
  zoom = 1,
  panOffset = { x: 0, y: 0 },
  className = '',
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Memoize aspect ratio calculation to prevent recalculation when only zoom/pan changes
  const imagePosition = useMemo(() => {
    if (!image?.complete) return null;

    return calculateAspectRatio(
      { width: image.naturalWidth, height: image.naturalHeight },
      { width, height }
    );
  }, [image?.naturalWidth, image?.naturalHeight, image?.complete, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save context state to prevent transform accumulation
    ctx.save();

    // Clear canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan transforms
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    // Draw image if provided and loaded
    if (image && imagePosition) {
      ctx.drawImage(
        image,
        imagePosition.x,
        imagePosition.y,
        imagePosition.width,
        imagePosition.height
      );
    }

    // Restore context state
    ctx.restore();

    // Cleanup function - free GPU memory
    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Reset transforms to prevent accumulation across renders
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
  }, [image, imagePosition, width, height, zoom, panOffset.x, panOffset.y]);

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
