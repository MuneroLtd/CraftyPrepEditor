import * as React from 'react';
import { ConfigurableSlider } from '@/components/ui/configurable-slider';

/**
 * Props for the BrightnessSlider component
 */
export interface BrightnessSliderProps {
  /** Current brightness value (-100 to +100) */
  value: number;
  /** Callback fired when brightness changes */
  onChange: (value: number) => void;
  /** Whether the slider is disabled */
  disabled?: boolean;
}

/**
 * BrightnessSlider - Enhanced slider for adjusting image brightness
 *
 * Allows users to adjust image brightness from -100 (darker) to +100 (lighter).
 * Default value is 0 (no adjustment).
 *
 * Features:
 * - Blue gradient track (dark to light)
 * - Floating value badge on hover/drag
 * - Numeric input with +/- buttons
 * - Full keyboard support
 * - Touch-friendly (44px targets)
 *
 * @errorHandling
 * Relies on ConfigurableSlider which uses Radix UI primitives.
 * Parent components should implement error boundaries for graceful degradation.
 *
 * @example
 * ```tsx
 * <BrightnessSlider
 *   value={brightness}
 *   onChange={setBrightness}
 * />
 * ```
 */
export function BrightnessSlider({
  value,
  onChange,
  disabled = false,
}: BrightnessSliderProps): React.JSX.Element {
  return (
    <ConfigurableSlider
      label="Brightness"
      value={value}
      min={-100}
      max={100}
      step={1}
      onChange={onChange}
      disabled={disabled}
      gradientColors={{ start: '#1e40af', end: '#93c5fd' }} // blue-800 to blue-300
      ariaLabel="Adjust image brightness from -100 to +100"
      id="brightness-slider"
    />
  );
}
