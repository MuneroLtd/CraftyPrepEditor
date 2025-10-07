import * as React from 'react';
import { EnhancedSlider } from '@/components/ui/enhanced-slider';
import { SliderInput } from '@/components/ui/slider-input';

/**
 * Props for the ConfigurableSlider component
 */
export interface ConfigurableSliderProps {
  /** Label text for the slider */
  label: string;
  /** Current value */
  value: number;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment */
  step: number;
  /** Callback fired when value changes */
  onChange: (value: number) => void;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Gradient colors for the track */
  gradientColors: { start: string; end: string };
  /** ARIA label for accessibility */
  ariaLabel: string;
  /** Optional HTML id for the slider */
  id?: string;
}

/**
 * ConfigurableSlider - Reusable slider component with label and input
 *
 * A DRY component that combines EnhancedSlider and SliderInput with
 * configurable label, range, and gradient colors. Eliminates duplication
 * across Brightness, Contrast, and Threshold sliders.
 *
 * Features:
 * - Customizable gradient track
 * - Floating value badge on hover/drag
 * - Numeric input with +/- buttons
 * - Full keyboard support
 * - Touch-friendly (44px targets)
 *
 * @errorHandling
 * This component wraps EnhancedSlider and SliderInput, which use Radix UI primitives.
 * Errors from child components will propagate to parent components.
 * Implement error boundaries at the application level for graceful degradation.
 *
 * @example
 * ```tsx
 * <ConfigurableSlider
 *   label="Brightness"
 *   value={brightness}
 *   min={-100}
 *   max={100}
 *   step={1}
 *   onChange={setBrightness}
 *   gradientColors={{ start: '#1e40af', end: '#93c5fd' }}
 *   ariaLabel="Adjust image brightness from -100 to +100"
 * />
 * ```
 */
export function ConfigurableSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled = false,
  gradientColors,
  ariaLabel,
  id,
}: ConfigurableSliderProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
        </label>
      </div>

      {/* Enhanced slider with gradient */}
      <EnhancedSlider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        gradientColors={gradientColors}
        showValueBadge
        disabled={disabled}
        aria-label={ariaLabel}
        className="mb-3"
      />

      {/* Numeric input with +/- buttons */}
      <div className="flex justify-center">
        <SliderInput
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
