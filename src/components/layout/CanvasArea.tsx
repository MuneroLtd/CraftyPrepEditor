import { memo } from 'react';
import type { ReactNode } from 'react';

export interface CanvasAreaProps {
  children: ReactNode;
}

/**
 * CanvasArea - Center workspace container for canvas
 *
 * Features:
 * - Fills available flex space
 * - Scrollable when content overflows
 * - Centers content when smaller than container
 * - Muted background for contrast
 *
 * @example
 * ```tsx
 * <CanvasArea>
 *   <canvas width={800} height={600} />
 * </CanvasArea>
 * ```
 */
export const CanvasArea = memo(function CanvasArea({ children }: CanvasAreaProps) {
  return (
    <div className="flex-1 overflow-auto bg-muted/20" data-testid="canvas-area">
      <div className="min-h-full flex items-center justify-center p-4">{children}</div>
    </div>
  );
});
