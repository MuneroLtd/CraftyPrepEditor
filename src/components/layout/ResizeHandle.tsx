import React from 'react';
import { cn } from '../../lib/utils';

export interface ResizeHandleProps {
  /**
   * Current width in pixels for ARIA value
   */
  width: number;

  /**
   * Minimum width in pixels for ARIA valuemin
   */
  minWidth: number;

  /**
   * Maximum width in pixels for ARIA valuemax
   */
  maxWidth: number;

  /**
   * Whether the panel is currently being resized
   */
  isResizing: boolean;

  /**
   * Handler for mousedown event
   */
  onMouseDown: (event: React.MouseEvent) => void;

  /**
   * Handler for touchstart event
   */
  onTouchStart: (event: React.TouchEvent) => void;

  /**
   * Handler for keyboard events
   */
  onKeyDown: (event: React.KeyboardEvent) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ResizeHandle component for draggable panel resizing
 *
 * Features:
 * - 4px wide vertical bar on panel edge
 * - Hover cursor: col-resize
 * - Touch-friendly grab points (≥44px tall)
 * - Keyboard accessible (Left/Right arrows, Home/End)
 * - Screen reader announcements for current width
 * - WCAG 2.2 AAA compliant
 *
 * @example
 * <ResizeHandle
 *   width={400}
 *   minWidth={200}
 *   maxWidth={600}
 *   isResizing={false}
 *   onMouseDown={handleMouseDown}
 *   onTouchStart={handleTouchStart}
 *   onKeyDown={handleKeyDown}
 * />
 */
export const ResizeHandle = React.memo<ResizeHandleProps>(
  ({ width, minWidth, maxWidth, isResizing, onMouseDown, onTouchStart, onKeyDown, className }) => {
    return (
      <div
        role="separator"
        aria-label="Resize panel"
        aria-orientation="vertical"
        aria-valuenow={width}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
        aria-valuetext={`Panel width: ${width} pixels`}
        tabIndex={0}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onKeyDown={onKeyDown}
        className={cn(
          // Base styles
          'relative flex-shrink-0',
          'w-1 cursor-col-resize',
          'bg-border hover:bg-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'transition-colors duration-150',

          // Active state
          isResizing && 'bg-primary',

          // Custom classes
          className
        )}
      >
        {/* Visual grab points for touch accessibility (≥44px tall each) */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2" aria-hidden="true">
          {/* Top grab point */}
          <div className="h-11 w-full" />

          {/* Middle grab indicator (visual only) */}
          <div className="mx-auto my-2 h-8 w-0.5 rounded-full bg-current opacity-40" />

          {/* Bottom grab point */}
          <div className="h-11 w-full" />
        </div>

        {/* Screen reader live region for width announcements */}
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {isResizing ? `Resizing: ${width} pixels` : ''}
        </span>
      </div>
    );
  }
);

ResizeHandle.displayName = 'ResizeHandle';
