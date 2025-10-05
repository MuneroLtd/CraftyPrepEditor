import { RefinementSlider } from '@/components/RefinementSlider';

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
 * ContrastSlider - Slider for adjusting image contrast
 *
 * Allows users to adjust image contrast from -100 (less contrast) to +100 (more contrast).
 * Default value is 0 (no adjustment).
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
    <RefinementSlider
      label="Contrast"
      value={value}
      min={-100}
      max={100}
      step={1}
      onChange={onChange}
      ariaLabel="Adjust image contrast from -100 to +100"
      disabled={disabled}
    />
  );
}
