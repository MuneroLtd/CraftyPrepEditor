import * as React from 'react';
import { ConfigurableSlider } from '@/components/ui/configurable-slider';

/**
 * Props for the ContrastSlider component
 */
export interface ContrastSliderProps {
  /** Current contrast value (-100 to +100) */
  value: number;
  /** Callback fired when contrast changes */
  onChange: (value: number) => void;
  /** Whether the slider is disabled */
  disabled?: boolean;
}

/**
 * ContrastSlider - Enhanced slider for adjusting image contrast
 *
 * Allows users to adjust image contrast from -100 (less contrast) to +100 (more contrast).
 * Default value is 0 (no adjustment).
 *
 * Features:
 * - Purple gradient track (low to high)
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
 * <ContrastSlider
 *   value={contrast}
 *   onChange={setContrast}
 * />
 * ```
 */
export function ContrastSlider({
  value,
  onChange,
  disabled = false,
}: ContrastSliderProps): React.JSX.Element {
  return (
    <ConfigurableSlider
      label="Contrast"
      value={value}
      min={-100}
      max={100}
      step={1}
      onChange={onChange}
      disabled={disabled}
      gradientColors={{ start: '#6b21a8', end: '#e9d5ff' }} // purple-800 to purple-200
      ariaLabel="Adjust image contrast from -100 to +100"
      id="contrast-slider"
    />
  );
}
