import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StatusBarProps {
  status: 'ready' | 'processing' | 'error';
  message?: string;
  imageDimensions?: { width: number; height: number };
  zoomLevel: number;
  tip?: string;
}

/**
 * StatusBar - Bottom status bar showing app state and contextual information
 *
 * Features:
 * - Status messages (ready, processing, error)
 * - Image dimensions display
 * - Zoom level display
 * - Contextual tips (hidden on mobile)
 * - Screen reader support (aria-live)
 * - Responsive layout:
 *   - Mobile (<768px): Status + dimensions only, compact spacing
 *   - Tablet (768-1023px): Status + dimensions + zoom
 *   - Desktop (≥1024px): Full layout with tips
 */
export const StatusBar = memo(function StatusBar({
  status,
  message,
  imageDimensions,
  zoomLevel,
  tip,
}: StatusBarProps) {
  return (
    <div
      className="border-t bg-background px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
      role="status"
      aria-live="polite"
      data-testid="status-bar"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left section: Status message and metrics */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Status Message */}
          {message && (
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              {status === 'processing' && (
                <Loader2
                  className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-muted-foreground flex-shrink-0"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  'truncate',
                  status === 'error' && 'text-destructive font-medium',
                  status === 'processing' && 'text-muted-foreground',
                  status === 'ready' && 'text-foreground'
                )}
              >
                {message}
              </span>
            </div>
          )}

          {/* Image Dimensions - Always visible when available */}
          {imageDimensions && (
            <span className="text-muted-foreground whitespace-nowrap">
              <span className="hidden sm:inline">Dimensions: </span>
              {imageDimensions.width}×{imageDimensions.height}
              <span className="hidden sm:inline">px</span>
            </span>
          )}

          {/* Zoom Level - Hidden on mobile, visible on tablet+ */}
          <span className="text-muted-foreground whitespace-nowrap hidden sm:inline">
            <span className="hidden sm:inline">Zoom: </span>
            {zoomLevel}%
          </span>
        </div>

        {/* Right section: Contextual tip - Hidden on mobile and tablet */}
        {tip && (
          <span className="text-muted-foreground hidden lg:inline truncate max-w-md">{tip}</span>
        )}
      </div>
    </div>
  );
});
