import * as React from 'react';
import { ConfigurableSlider } from '@/components/ui/configurable-slider';

/**
 * Props for the ThresholdSlider component
 */
export interface ThresholdSliderProps {
  /** Current threshold value (0 to 255) */
  value: number;
  /** Callback fired when threshold changes */
  onChange: (value: number) => void;
  /** Whether the slider is disabled */
  disabled?: boolean;
}

/**
 * ThresholdSlider - Enhanced slider for adjusting binarization threshold
 *
 * Allows users to adjust the threshold value for image binarization from 0 to 255.
 * Default value is typically auto-calculated using Otsu's algorithm.
 *
 * Features:
 * - Gray to white gradient track
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
 * <ThresholdSlider
 *   value={threshold}
 *   onChange={setThreshold}
 * />
 * ```
 */
export function ThresholdSlider({
  value,
  onChange,
  disabled = false,
}: ThresholdSliderProps): React.JSX.Element {
  return (
    <ConfigurableSlider
      label="Threshold"
      value={value}
      min={0}
      max={255}
      step={1}
      onChange={onChange}
      disabled={disabled}
      gradientColors={{ start: '#374151', end: '#f3f4f6' }} // gray-700 to gray-100
      ariaLabel="Adjust binarization threshold from 0 to 255"
      id="threshold-slider"
    />
  );
}
