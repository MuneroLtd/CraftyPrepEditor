import { BrightnessSlider } from '@/components/BrightnessSlider';
import { ContrastSlider } from '@/components/ContrastSlider';
import { ThresholdSlider } from '@/components/ThresholdSlider';
import { cn } from '@/lib/utils';

/**
 * Props for the RefinementControls component
 */
export interface RefinementControlsProps {
  /** Current brightness value (-100 to +100) */
  brightness: number;
  /** Current contrast value (-100 to +100) */
  contrast: number;
  /** Current threshold value (0 to 255) */
  threshold: number;
  /** Callback fired when brightness changes */
  onBrightnessChange: (value: number) => void;
  /** Callback fired when contrast changes */
  onContrastChange: (value: number) => void;
  /** Callback fired when threshold changes */
  onThresholdChange: (value: number) => void;
  /** Whether the controls are disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * RefinementControls - Container component for image refinement sliders
 *
 * Groups the Brightness, Contrast, and Threshold sliders in a semantic,
 * accessible container with proper heading and spacing.
 *
 * Features:
 * - Semantic HTML (section + heading)
 * - Vertical layout with consistent spacing (16px)
 * - Responsive design (mobile-first)
 * - WCAG 2.2 Level AAA compliant
 *
 * @example
 * ```tsx
 * <RefinementControls
 *   brightness={brightness}
 *   contrast={contrast}
 *   threshold={threshold}
 *   onBrightnessChange={setBrightness}
 *   onContrastChange={setContrast}
 *   onThresholdChange={setThreshold}
 * />
 * ```
 */
export function RefinementControls({
  brightness,
  contrast,
  threshold,
  onBrightnessChange,
  onContrastChange,
  onThresholdChange,
  disabled = false,
  className = '',
}: RefinementControlsProps): React.JSX.Element {
  return (
    <section aria-labelledby="refinement-heading" className={cn('space-y-4', className)}>
      <h2 id="refinement-heading" className="text-lg font-semibold">
        Refinement Controls
      </h2>

      <BrightnessSlider value={brightness} onChange={onBrightnessChange} disabled={disabled} />

      <ContrastSlider value={contrast} onChange={onContrastChange} disabled={disabled} />

      <ThresholdSlider value={threshold} onChange={onThresholdChange} disabled={disabled} />
    </section>
  );
}
