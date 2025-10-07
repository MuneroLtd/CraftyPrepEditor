import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

/**
 * Props for the EnhancedSlider component
 */
export interface EnhancedSliderProps {
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
  /** Gradient colors for the filled portion */
  gradientColors?: { start: string; end: string };
  /** Whether to show floating value badge on hover/drag */
  showValueBadge?: boolean;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Additional CSS classes for the root element */
  className?: string;
}

/**
 * EnhancedSlider - Professional slider component with gradient track and visual feedback
 *
 * Features:
 * - Custom gradient fill showing current value position
 * - Floating value badge (appears on hover/drag)
 * - Large, touch-friendly handle (44px × 44px)
 * - Smooth animations and transitions
 * - Full keyboard support:
 *   - Arrow keys: increment/decrement by step
 *   - Page Up/Down: increment/decrement by 10% of range
 *   - Home/End: jump to min/max (via Radix UI)
 * - WCAG 2.2 Level AAA compliant
 *
 * @errorHandling
 * This component uses Radix UI primitives internally. If Radix UI throws an error
 * (e.g., due to invalid props), it will propagate to the parent component.
 * Parent components should implement error boundaries if graceful degradation is needed.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 *
 * @example
 * ```tsx
 * <EnhancedSlider
 *   value={50}
 *   min={0}
 *   max={100}
 *   step={1}
 *   onChange={(value) => setValue(value)}
 *   gradientColors={{ start: '#1e40af', end: '#93c5fd' }}
 *   showValueBadge
 *   aria-label="Brightness"
 * />
 * ```
 */
export const EnhancedSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  EnhancedSliderProps
>(
  (
    {
      value,
      min,
      max,
      step,
      onChange,
      gradientColors,
      showValueBadge = true,
      disabled = false,
      'aria-label': ariaLabel,
      className,
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);

    // Calculate fill percentage (0-100)
    const fillPercentage = React.useMemo(() => {
      const range = max - min;
      const normalizedValue = value - min;
      return (normalizedValue / range) * 100;
    }, [value, min, max]);

    // Handle value change from Radix UI Slider (array format)
    const handleValueChange = (values: number[]) => {
      if (values.length > 0) {
        onChange(values[0]);
      }
    };

    // Handle keyboard events for PageUp/PageDown (Radix handles Arrow/Home/End)
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      const range = max - min;
      const largeStep = Math.max(step * 10, range / 10); // 10% of range or 10x step

      if (e.key === 'PageUp') {
        e.preventDefault();
        const newValue = Math.min(max, value + largeStep);
        onChange(Math.round(newValue / step) * step);
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        const newValue = Math.max(min, value - largeStep);
        onChange(Math.round(newValue / step) * step);
      }
    };

    // Show badge when hovering or dragging (if enabled)
    const showBadge = showValueBadge && (isHovered || isDragging);

    // Thumb button classes with conditional styling
    const thumbClasses = cn(
      // Base styling
      'block h-11 w-11 rounded-full border-[3px] bg-white shadow-md',
      'transition-all duration-200 ease-out',
      // Border colors
      'border-slate-900 dark:border-slate-50',
      // Focus styles
      'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-slate-950 focus-visible:ring-offset-2',
      'dark:focus-visible:ring-slate-300',
      // Hover styles (scale and shadow)
      'hover:scale-110 hover:shadow-lg',
      // Active/dragging styles
      isDragging && 'scale-[1.15] shadow-xl',
      // Disabled styles
      'disabled:pointer-events-none disabled:opacity-50'
    );

    // Generate gradient CSS
    const gradientStyle = React.useMemo(() => {
      if (!gradientColors) {
        // Use Tailwind CSS variable for slate-900 to stay in sync with design system
        return {
          background: 'hsl(var(--slate-900, 222.2 47.4% 11.2%))',
        };
      }

      return {
        background: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})`,
      };
    }, [gradientColors]);

    return (
      <div
        data-testid="slider-container"
        className={cn('relative w-full', className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SliderPrimitive.Root
          ref={ref}
          className="relative flex w-full touch-none select-none items-center"
          value={[value]}
          onValueChange={handleValueChange}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-label={ariaLabel}
        >
          {/* Track background (unfilled portion) */}
          <SliderPrimitive.Track
            data-testid="slider-track"
            className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
          >
            {/* Gradient fill (filled portion) */}
            <div
              data-testid="slider-fill"
              className="absolute h-full rounded-full transition-all duration-150 ease-out"
              style={{
                width: `${fillPercentage}%`,
                ...gradientStyle,
              }}
            />
          </SliderPrimitive.Track>

          {/* Handle with enhanced styling */}
          <SliderPrimitive.Thumb className={thumbClasses}>
            {/* Floating value badge */}
            {showBadge && (
              <div
                data-testid="value-badge"
                className={cn(
                  'absolute -top-10 left-1/2 -translate-x-1/2',
                  'rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white',
                  'shadow-lg dark:bg-slate-50 dark:text-slate-900',
                  'animate-in fade-in-0 slide-in-from-bottom-1 duration-200',
                  'pointer-events-none select-none'
                )}
              >
                {value}
                {/* Arrow pointing down */}
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900 dark:bg-slate-50" />
              </div>
            )}
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
      </div>
    );
  }
);

EnhancedSlider.displayName = 'EnhancedSlider';
