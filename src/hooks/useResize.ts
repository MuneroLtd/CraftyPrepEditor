import { useCallback, useEffect, useRef, useState } from 'react';

// Performance constants
const THROTTLE_MS = 16; // 60fps (16.67ms per frame)
const KEYBOARD_STEP_SMALL = 10; // Small step for keyboard resize (pixels)

export interface UseResizeOptions {
  /**
   * Initial width of the panel in pixels
   */
  initialWidth: number;

  /**
   * Minimum allowed width in pixels
   */
  minWidth: number;

  /**
   * Maximum allowed width in pixels
   */
  maxWidth: number;

  /**
   * Callback fired when resize completes (on mouse up or keyboard change)
   * Use this to save the final width to localStorage
   */
  onResizeEnd?: (width: number) => void;

  /**
   * Callback fired during resize (throttled to 60fps)
   * Use this for real-time width updates
   */
  onResize?: (width: number) => void;
}

export interface UseResizeResult {
  /**
   * Current width in pixels
   */
  width: number;

  /**
   * Whether the panel is currently being resized
   */
  isResizing: boolean;

  /**
   * Handler for mousedown event on resize handle
   */
  handleMouseDown: (event: React.MouseEvent) => void;

  /**
   * Handler for touchstart event on resize handle
   */
  handleTouchStart: (event: React.TouchEvent) => void;

  /**
   * Handler for keyboard events (arrow keys, Home, End)
   */
  handleKeyDown: (event: React.KeyboardEvent) => void;

  /**
   * Programmatically set the width
   */
  setWidth: (width: number) => void;
}

/**
 * Hook for implementing draggable panel resize with keyboard support
 *
 * Provides:
 * - Mouse drag resize (desktop)
 * - Touch drag resize (mobile)
 * - Keyboard resize (Left/Right arrows, Home/End)
 * - Real-time updates throttled to 60fps
 * - Min/max width constraints
 * - Callback on resize end for persistence
 *
 * @param options - Configuration for resize behavior
 * @returns Resize state and handlers
 *
 * @example
 * const { width, isResizing, handleMouseDown, handleKeyDown } = useResize({
 *   initialWidth: 400,
 *   minWidth: 200,
 *   maxWidth: 600,
 *   onResizeEnd: (width) => saveToLocalStorage(width),
 * });
 */
export function useResize({
  initialWidth,
  minWidth,
  maxWidth,
  onResizeEnd,
  onResize,
}: UseResizeOptions): UseResizeResult {
  const [width, setWidthState] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  // Refs for tracking drag state
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  /**
   * Clamp width to min/max constraints
   */
  const clampWidth = useCallback(
    (value: number): number => {
      return Math.max(minWidth, Math.min(maxWidth, value));
    },
    [minWidth, maxWidth]
  );

  /**
   * Set width with constraints applied
   */
  const setWidth = useCallback(
    (newWidth: number) => {
      const clamped = clampWidth(newWidth);
      setWidthState(clamped);
      onResize?.(clamped);
    },
    [clampWidth, onResize]
  );

  /**
   * Throttled width update (60fps = ~16ms)
   * Uses requestAnimationFrame for smooth updates
   */
  const updateWidth = useCallback(
    (newWidth: number) => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

      // Throttle to 60fps for performance
      if (timeSinceLastUpdate < THROTTLE_MS) {
        // Cancel any pending update
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }

        // Schedule update on next frame
        rafIdRef.current = requestAnimationFrame(() => {
          setWidth(newWidth);
          lastUpdateTimeRef.current = Date.now();
          rafIdRef.current = null;
        });
      } else {
        setWidth(newWidth);
        lastUpdateTimeRef.current = now;
      }
    },
    [setWidth]
  );

  /**
   * Mouse move handler for drag resize
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const deltaX = event.clientX - startXRef.current;
      const newWidth = startWidthRef.current + deltaX;
      updateWidth(newWidth);
    },
    [updateWidth]
  );

  /**
   * Mouse up handler to end resize
   */
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);

    // Cancel any pending animation frame
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // Call onResizeEnd with final width
    onResizeEnd?.(width);
  }, [width, onResizeEnd]);

  /**
   * Touch move handler for mobile drag resize
   */
  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length === 0) return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - startXRef.current;
      const newWidth = startWidthRef.current + deltaX;
      updateWidth(newWidth);
    },
    [updateWidth]
  );

  /**
   * Touch end handler to end resize
   */
  const handleTouchEnd = useCallback(() => {
    setIsResizing(false);

    // Cancel any pending animation frame
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // Call onResizeEnd with final width
    onResizeEnd?.(width);
  }, [width, onResizeEnd]);

  /**
   * Start mouse drag resize
   */
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setIsResizing(true);
      startXRef.current = event.clientX;
      startWidthRef.current = width;
    },
    [width]
  );

  /**
   * Start touch drag resize
   */
  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (event.touches.length === 0) return;

      event.preventDefault();
      setIsResizing(true);
      const touch = event.touches[0];
      startXRef.current = touch.clientX;
      startWidthRef.current = width;
    },
    [width]
  );

  /**
   * Keyboard resize handler
   * - Left arrow: decrease width by 10px
   * - Right arrow: increase width by 10px
   * - Home: set to minimum width
   * - End: set to maximum width
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      let newWidth = width;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          newWidth = width - KEYBOARD_STEP_SMALL;
          break;

        case 'ArrowRight':
          event.preventDefault();
          newWidth = width + KEYBOARD_STEP_SMALL;
          break;

        case 'Home':
          event.preventDefault();
          newWidth = minWidth;
          break;

        case 'End':
          event.preventDefault();
          newWidth = maxWidth;
          break;

        default:
          return; // Don't handle other keys
      }

      const clamped = clampWidth(newWidth);
      setWidthState(clamped);
      onResize?.(clamped);
      onResizeEnd?.(clamped); // Save immediately on keyboard resize
    },
    [width, minWidth, maxWidth, clampWidth, onResize, onResizeEnd]
  );

  /**
   * Setup global mouse/touch event listeners when resizing
   */
  useEffect(() => {
    if (!isResizing) return;

    // Add global listeners for mouse/touch move and up
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    return () => {
      // Cleanup listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      // Restore user select and cursor
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  /**
   * Cleanup animation frame on unmount
   */
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return {
    width,
    isResizing,
    handleMouseDown,
    handleTouchStart,
    handleKeyDown,
    setWidth,
  };
}
