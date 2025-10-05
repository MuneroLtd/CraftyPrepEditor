import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

/**
 * Props for the RefinementSlider component
 */
export interface RefinementSliderProps {
  /** Label text displayed above the slider */
  label: string;
  /** Current value of the slider */
  value: number;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment */
  step: number;
  /** Callback fired when value changes */
  onChange: (value: number) => void;
  /** Optional ARIA label for accessibility (defaults to label + value) */
  ariaLabel?: string;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * RefinementSlider - Base slider component for image refinement controls
 *
 * A fully accessible slider component built on Radix UI Slider primitive.
 * Meets WCAG 2.2 Level AAA requirements with enhanced touch targets and focus indicators.
 *
 * Features:
 * - Touch-friendly (44px × 44px handle for AAA compliance)
 * - Keyboard accessible (Arrow keys, Home, End)
 * - High-contrast focus indicators (≥3:1 contrast, ≥3px width)
 * - Screen reader compatible with proper ARIA attributes
 * - Value display integrated with label
 *
 * @example
 * ```tsx
 * <RefinementSlider
 *   label="Brightness"
 *   value={0}
 *   min={-100}
 *   max={100}
 *   step={1}
 *   onChange={(value) => setBrightness(value)}
 * />
 * ```
 */
export function RefinementSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  ariaLabel,
  disabled = false,
  className = '',
}: RefinementSliderProps): React.JSX.Element {
  // Generate default ARIA label if not provided
  const defaultAriaLabel = `${label}: ${value}`;
  const effectiveAriaLabel = ariaLabel || defaultAriaLabel;

  // Handle value change from Radix UI Slider (array format)
  const handleValueChange = (values: number[]) => {
    if (values.length > 0) {
      onChange(values[0]);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label with value display */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{value}</span>
      </div>

      {/* Slider with enhanced accessibility */}
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-label={effectiveAriaLabel}
        className="w-full"
      />
    </div>
  );
}
