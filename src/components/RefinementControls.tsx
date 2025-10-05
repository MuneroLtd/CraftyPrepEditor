import { memo } from 'react';
import { BrightnessSlider } from '@/components/BrightnessSlider';
import { ContrastSlider } from '@/components/ContrastSlider';
import { ThresholdSlider } from '@/components/ThresholdSlider';
import { BackgroundRemovalControl } from '@/components/BackgroundRemovalControl';
import { ResetButton } from '@/components/ResetButton';
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
  /** Whether background removal is enabled */
  backgroundRemovalEnabled?: boolean;
  /** Background removal sensitivity (0-255) */
  backgroundRemovalSensitivity?: number;
  /** Callback fired when brightness changes */
  onBrightnessChange: (value: number) => void;
  /** Callback fired when contrast changes */
  onContrastChange: (value: number) => void;
  /** Callback fired when threshold changes */
  onThresholdChange: (value: number) => void;
  /** Callback fired when background removal toggle changes */
  onBackgroundRemovalToggle?: (enabled: boolean) => void;
  /** Callback fired when background removal sensitivity changes */
  onBackgroundRemovalSensitivityChange?: (value: number) => void;
  /** Callback fired when reset button clicked */
  onReset?: () => void;
  /** Whether reset is in progress */
  isResetting?: boolean;
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
 * Memoized to prevent unnecessary re-renders when parent re-renders.
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
export const RefinementControls = memo(function RefinementControls({
  brightness,
  contrast,
  threshold,
  backgroundRemovalEnabled = false,
  backgroundRemovalSensitivity = 128,
  onBrightnessChange,
  onContrastChange,
  onThresholdChange,
  onBackgroundRemovalToggle,
  onBackgroundRemovalSensitivityChange,
  onReset,
  isResetting = false,
  disabled = false,
  className = '',
}: RefinementControlsProps): React.JSX.Element {
  return (
    <section aria-labelledby="refinement-heading" className={cn('space-y-4', className)}>
      <h2 id="refinement-heading" className="text-lg font-semibold">
        Refinement Controls
      </h2>

      {/* Background Removal (before other adjustments in pipeline) */}
      {onBackgroundRemovalToggle && onBackgroundRemovalSensitivityChange && (
        <BackgroundRemovalControl
          enabled={backgroundRemovalEnabled}
          sensitivity={backgroundRemovalSensitivity}
          onToggle={onBackgroundRemovalToggle}
          onSensitivityChange={onBackgroundRemovalSensitivityChange}
          disabled={disabled}
        />
      )}

      <BrightnessSlider value={brightness} onChange={onBrightnessChange} disabled={disabled} />

      <ContrastSlider value={contrast} onChange={onContrastChange} disabled={disabled} />

      <ThresholdSlider value={threshold} onChange={onThresholdChange} disabled={disabled} />

      {/* Reset Button (at the bottom) */}
      {onReset && <ResetButton onReset={onReset} disabled={disabled} loading={isResetting} />}
    </section>
  );
});
