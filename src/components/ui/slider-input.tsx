import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounceCallback } from '@/hooks/useDebounceCallback';

/**
 * Props for the SliderInput component
 *
 * @remarks
 * This component is designed for **integer values only** (step >= 1).
 * The input validation uses a regex that rejects decimal points.
 * If you need decimal values, use a different component or modify the validation logic.
 */
export interface SliderInputProps {
  /** Current value (integer) */
  value: number;
  /** Minimum value (integer) */
  min: number;
  /** Maximum value (integer) */
  max: number;
  /**
   * Step increment (must be >= 1 for integer values)
   *
   * @remarks
   * This component only supports integer steps. If step < 1 is provided,
   * the component will still work but may produce unexpected results.
   */
  step: number;
  /** Callback fired when value changes */
  onChange: (value: number) => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SliderInput - Numeric input with increment/decrement buttons
 *
 * **IMPORTANT**: This component only accepts **integer values** (whole numbers).
 * The input validation rejects decimal points and only accepts digits.
 *
 * Features:
 * - Direct numeric input with validation (integers only)
 * - Increment (+) and decrement (-) buttons
 * - Min/max clamping on blur
 * - Keyboard support (Enter to confirm, Escape to revert)
 * - Touch-friendly buttons (≥44px)
 * - WCAG 2.2 Level AAA compliant
 *
 * @example
 * ```tsx
 * // ✅ CORRECT: Integer step
 * <SliderInput
 *   value={50}
 *   min={0}
 *   max={100}
 *   step={1}  // Integer step works correctly
 *   onChange={(value) => setValue(value)}
 * />
 *
 * // ❌ INCORRECT: Decimal step not supported
 * <SliderInput
 *   value={5.5}
 *   min={0}
 *   max={10}
 *   step={0.5}  // Decimal step will not work as expected
 *   onChange={(value) => setValue(value)}
 * />
 * ```
 */
export function SliderInput({
  value,
  min,
  max,
  step,
  onChange,
  disabled = false,
  className,
}: SliderInputProps): React.JSX.Element {
  const [inputValue, setInputValue] = React.useState(value.toString());
  const [originalValue, setOriginalValue] = React.useState(value);

  // Warn if step is not an integer (development only)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && step < 1) {
      console.warn(
        `SliderInput: step=${step} is less than 1. This component only supports integer values. ` +
          `Consider using step >= 1 or a different component for decimal values.`
      );
    }
  }, [step]);

  // Debounce onChange for typing (250ms delay)
  // Blur and Enter key still trigger immediately
  const debouncedOnChange = useDebounceCallback(onChange, 250);

  // Update input when value prop changes
  React.useEffect(() => {
    setInputValue(value.toString());
    setOriginalValue(value);
  }, [value]);

  /**
   * Clamp value to min/max range
   */
  const clampValue = (val: number): number => {
    return Math.max(min, Math.min(max, val));
  };

  /**
   * Handle increment button click
   */
  const handleIncrement = () => {
    if (disabled || value >= max) return;
    const newValue = clampValue(value + step);
    onChange(newValue);
  };

  /**
   * Handle decrement button click
   */
  const handleDecrement = () => {
    if (disabled || value <= min) return;
    const newValue = clampValue(value - step);
    onChange(newValue);
  };

  /**
   * Handle input change (typing)
   * Uses debounced onChange for performance during rapid typing
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Allow empty input and negative sign
    if (newValue === '' || newValue === '-') {
      setInputValue(newValue);
      return;
    }

    // Reject non-numeric input (integers only - matches step=1 usage)
    if (!/^-?\d*$/.test(newValue)) {
      return;
    }

    setInputValue(newValue);

    // Parse and validate numeric value (integer only)
    const parsed = parseInt(newValue, 10);
    if (!isNaN(parsed)) {
      const clamped = clampValue(parsed);
      // Call debounced onChange - waits 250ms after last keystroke
      debouncedOnChange(clamped);
    }
  };

  /**
   * Handle input blur (validate and clamp)
   * Immediately applies value without debounce
   */
  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10);

    // If invalid, revert to original value
    if (isNaN(parsed)) {
      setInputValue(originalValue.toString());
      return;
    }

    // Clamp and update
    const clamped = clampValue(parsed);
    setInputValue(clamped.toString());
    onChange(clamped);
  };

  /**
   * Handle keyboard events
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      const originalValueStr = originalValue.toString();
      setInputValue(originalValueStr);
      // Force the input to update before blurring
      (e.target as HTMLInputElement).value = originalValueStr;
      (e.target as HTMLInputElement).blur();
    }
  };

  const isAtMin = value <= min;
  const isAtMax = value >= max;

  // Common button classes for increment/decrement buttons
  const buttonClasses = cn(
    'flex h-11 w-11 items-center justify-center rounded-md border-2 border-slate-300',
    'transition-all duration-200',
    'hover:border-slate-400 hover:bg-slate-100',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-slate-950 focus-visible:ring-offset-2',
    'active:scale-95',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-300 disabled:hover:bg-transparent',
    'dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-800'
  );

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Decrement button */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || isAtMin}
        aria-label="Decrease value"
        className={buttonClasses}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Numeric input */}
      <input
        type="number"
        role="spinbutton"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          'h-11 w-20 rounded-md border-2 border-slate-300 bg-white px-3 text-center text-sm font-medium',
          'transition-colors duration-200',
          'hover:border-slate-400',
          'focus:outline-none focus:ring-[3px] focus:ring-slate-950 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-slate-600 dark:bg-slate-900 dark:hover:border-slate-500 dark:focus:ring-slate-300',
          // Hide spin buttons in webkit and Firefox browsers
          '[appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
        )}
      />

      {/* Increment button */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || isAtMax}
        aria-label="Increase value"
        className={buttonClasses}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
