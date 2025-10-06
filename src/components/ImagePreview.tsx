/**
 * ImagePreview - Dual-canvas preview container with zoom and pan controls
 * @module components/ImagePreview
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { ImageCanvas } from './ImageCanvas';
import { ZoomControls } from './ZoomControls';

export interface ImagePreviewProps {
  /** Original uploaded image */
  originalImage: HTMLImageElement | null;
  /** Processed image after auto-prep */
  processedImage: HTMLImageElement | null;
  /** Whether to show loading overlay (only shown if processing >500ms) */
  isLoading?: boolean;
}

interface PanOffset {
  x: number;
  y: number;
}

interface CanvasWrapperProps {
  image: HTMLImageElement | null;
  alt: string;
  width: number;
  height: number;
  zoom: number;
  panOffset: PanOffset;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  children?: ReactNode;
}

/**
 * Reusable canvas wrapper component with pan/drag/keyboard interaction.
 * Eliminates code duplication between Original and Processed canvases.
 */
function CanvasWrapper({
  image,
  alt,
  width,
  height,
  zoom,
  panOffset,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onKeyDown,
}: CanvasWrapperProps) {
  // Determine testid based on alt text
  const testId = alt.includes('Original') ? 'original-canvas' : 'processed-canvas';
  
  return (
    <div
      data-testid={testId}
      tabIndex={zoom > 1 ? 0 : -1}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onKeyDown={onKeyDown}
      className={`${isDragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : ''} ${
        zoom > 1 ? 'focus:outline-4 focus:outline-blue-600 focus:outline-offset-2' : ''
      }`}
      role="region"
      aria-label={`${alt} - ${zoom > 1 ? 'Use arrow keys to pan' : 'Zoom in to enable panning'}`}
    >
      <ImageCanvas
        image={image}
        alt={alt}
        width={width}
        height={height}
        zoom={zoom}
        panOffset={panOffset}
        className="border border-gray-300 rounded"
      />
    </div>
  );
}

/**
 * Container component managing dual-canvas layout (original + processed),
 * zoom controls, pan/drag interaction, and responsive resizing.
 *
 * Features:
 * - Side-by-side layout on desktop (≥1024px)
 * - Stacked layout on mobile (<768px)
 * - Synchronized zoom across both canvases
 * - Pan/drag when zoomed (zoom > 1x)
 * - Debounced window resize handling
 * - Loading overlay (only shown if processing >500ms)
 *
 * @example
 * ```tsx
 * <ImagePreview
 *   originalImage={uploadedImage}
 *   processedImage={processedImage}
 *   isLoading={shouldShowLoading}
 * />
 * ```
 */
export function ImagePreview({
  originalImage,
  processedImage,
  isLoading = false,
}: ImagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState<PanOffset>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<PanOffset>({ x: 0, y: 0 });

  /**
   * Calculate canvas dimensions based on container width
   * Maintains 4:3 aspect ratio
   */
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;

    // Detect breakpoint: mobile (<768px) vs desktop (≥1024px)
    const isMobile = window.innerWidth < 768;

    // Mobile: 90% of container (stacked layout), Desktop: 45% (side-by-side)
    const widthPercentage = isMobile ? 0.9 : 0.45;
    const canvasWidth = Math.max(containerWidth * widthPercentage, 400); // min 400px

    // Maintain 4:3 aspect ratio
    const canvasHeight = (canvasWidth * 3) / 4;

    setCanvasDimensions({ width: canvasWidth, height: canvasHeight });
  }, []);

  /**
   * Reset zoom and pan to defaults
   */
  const handleReset = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  /**
   * Start pan drag (only if zoomed)
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom === 1) return; // No panning at 1x zoom

      setIsDragging(true);
      setDragStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      });
    },
    [zoom, panOffset]
  );

  /**
   * Calculate pan bounds based on image size, canvas size, and zoom level
   */
  const calculatePanBounds = useCallback(
    (image: HTMLImageElement | null) => {
      if (!image || zoom === 1) {
        return { maxX: 0, maxY: 0, minX: 0, minY: 0 };
      }

      // Calculate scaled image dimensions
      const scaledWidth = canvasDimensions.width * zoom;
      const scaledHeight = canvasDimensions.height * zoom;

      // Max pan is how much the image extends beyond the canvas
      const maxX = Math.max(0, (scaledWidth - canvasDimensions.width) / 2);
      const maxY = Math.max(0, (scaledHeight - canvasDimensions.height) / 2);

      return { maxX, maxY, minX: -maxX, minY: -maxY };
    },
    [zoom, canvasDimensions]
  );

  /**
   * Update pan offset during drag using requestAnimationFrame for smooth 60fps
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        const newOffset = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        };

        // Constrain pan to image bounds
        const bounds = calculatePanBounds(originalImage || processedImage);
        const constrainedOffset = {
          x: Math.max(bounds.minX, Math.min(bounds.maxX, newOffset.x)),
          y: Math.max(bounds.minY, Math.min(bounds.maxY, newOffset.y)),
        };

        setPanOffset(constrainedOffset);
      });
    },
    [isDragging, dragStart, calculatePanBounds, originalImage, processedImage]
  );

  /**
   * End pan drag
   */
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  /**
   * Handle keyboard pan (arrow keys) when zoomed
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (zoom === 1) return; // No panning at 1x zoom

      const PAN_STEP = 20; // Pixels to pan per key press
      const newOffset = { ...panOffset };

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newOffset.y += PAN_STEP;
          break;
        case 'ArrowDown':
          e.preventDefault();
          newOffset.y -= PAN_STEP;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newOffset.x += PAN_STEP;
          break;
        case 'ArrowRight':
          e.preventDefault();
          newOffset.x -= PAN_STEP;
          break;
        default:
          return;
      }

      // Constrain to bounds
      const bounds = calculatePanBounds(originalImage || processedImage);
      const constrainedOffset = {
        x: Math.max(bounds.minX, Math.min(bounds.maxX, newOffset.x)),
        y: Math.max(bounds.minY, Math.min(bounds.maxY, newOffset.y)),
      };

      setPanOffset(constrainedOffset);
    },
    [zoom, panOffset, calculatePanBounds, originalImage, processedImage]
  );

  /**
   * Setup window resize listener with debouncing
   */
  useEffect(() => {
    // Initial calculation
    updateDimensions();

    // Debounced resize handler (100ms)
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
      {/* Zoom Controls */}
      <div className="mb-4">
        <ZoomControls zoom={zoom} onZoomChange={setZoom} onReset={handleReset} />
      </div>

      {/* Dual Canvas Preview */}
      <div className="flex flex-col lg:flex-row gap-4 relative">
        {/* Original Image Canvas */}
        <div className="flex-1" data-testid="original-preview">
          <h3 className="text-lg font-semibold mb-2">Original</h3>
          <CanvasWrapper
            image={originalImage}
            alt="Original image preview"
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            zoom={zoom}
            panOffset={panOffset}
            isDragging={isDragging}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Processed Image Canvas */}
        <div className="flex-1" data-testid="processed-preview">
          <h3 className="text-lg font-semibold mb-2">Processed</h3>
          <div className="relative">
            <CanvasWrapper
              image={processedImage}
              alt="Processed image preview"
              width={canvasDimensions.width}
              height={canvasDimensions.height}
              zoom={zoom}
              panOffset={panOffset}
              isDragging={isDragging}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onKeyDown={handleKeyDown}
            />

            {/* Loading Overlay - Only shown if processing >500ms */}
            {isLoading && (
              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded"
                role="status"
                aria-live="polite"
                aria-label="Processing image"
              >
                <div className="text-white text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-2"></div>
                  <p className="text-lg font-medium">Processing...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
