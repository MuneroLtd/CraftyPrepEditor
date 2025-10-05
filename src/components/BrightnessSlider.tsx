import { RefinementSlider } from '@/components/RefinementSlider';

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
 * BrightnessSlider - Slider for adjusting image brightness
 *
 * Allows users to adjust image brightness from -100 (darker) to +100 (lighter).
 * Default value is 0 (no adjustment).
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
    <RefinementSlider
      label="Brightness"
      value={value}
      min={-100}
      max={100}
      step={1}
      onChange={onChange}
      ariaLabel="Adjust image brightness from -100 to +100"
      disabled={disabled}
    />
  );
}
