/**
 * ZoomControls - UI controls for adjusting canvas zoom level
 * @module components/ZoomControls
 */

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export interface ZoomControlsProps {
  /** Current zoom level (1 = 100%, 2 = 200%, etc.) */
  zoom: number;
  /** Callback when zoom changes */
  onZoomChange: (zoom: number) => void;
  /** Optional callback for reset button */
  onReset?: () => void;
  /** Minimum zoom level (default: 1) */
  minZoom?: number;
  /** Maximum zoom level (default: 4) */
  maxZoom?: number;
}

/**
 * Zoom control UI with buttons, slider, and percentage display.
 * Provides zoom in/out buttons, continuous slider, and optional reset.
 *
 * @example
 * ```tsx
 * <ZoomControls
 *   zoom={1.5}
 *   onZoomChange={setZoom}
 *   onReset={() => setZoom(1)}
 *   minZoom={1}
 *   maxZoom={4}
 * />
 * ```
 */
export function ZoomControls({
  zoom,
  onZoomChange,
  onReset,
  minZoom = 1,
  maxZoom = 4,
}: ZoomControlsProps) {
  const zoomPercent = Math.round(zoom * 100);
  const step = 0.25;

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + step, maxZoom);
    onZoomChange(newZoom);
  }, [zoom, step, maxZoom, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - step, minZoom);
    onZoomChange(newZoom);
  }, [zoom, step, minZoom, onZoomChange]);

  const handleSliderChange = useCallback(
    (values: number[]) => {
      onZoomChange(values[0]);
    },
    [onZoomChange]
  );

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
        <span className="text-sm font-medium w-16 text-right text-gray-900" aria-live="polite">
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
        <Button variant="outline" size="sm" onClick={onReset} aria-label="Reset zoom and pan">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      )}
    </div>
  );
}
