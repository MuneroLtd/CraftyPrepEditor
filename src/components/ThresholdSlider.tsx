import { RefinementSlider } from '@/components/RefinementSlider';

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
 * ThresholdSlider - Slider for adjusting binarization threshold
 *
 * Allows users to adjust the threshold value for image binarization from 0 to 255.
 * Default value is typically auto-calculated using Otsu's algorithm.
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
    <RefinementSlider
      label="Threshold"
      value={value}
      min={0}
      max={255}
      step={1}
      onChange={onChange}
      ariaLabel="Adjust binarization threshold from 0 to 255"
      disabled={disabled}
    />
  );
}
