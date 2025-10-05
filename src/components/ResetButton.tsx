import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the ResetButton component
 */
export interface ResetButtonProps {
  /** Callback fired when reset button clicked */
  onReset: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ResetButton - Component for resetting refinement controls to auto-prep defaults
 *
 * Resets all sliders (brightness, contrast, threshold) to their default values
 * and re-runs the auto-prep algorithm, discarding all manual adjustments.
 *
 * Features:
 * - Secondary button styling (less prominent than Auto-Prep)
 * - Loading state during reset processing
 * - Disabled state when no baseline available
 * - Keyboard accessible (Tab, Enter, Space)
 * - Screen reader support with ARIA labels
 * - Icon (rotate counterclockwise) for visual feedback
 * - Touch-friendly (≥44px target)
 * - WCAG 2.2 Level AAA compliant
 *
 * @example
 * ```tsx
 * <ResetButton
 *   onReset={handleReset}
 *   disabled={!baselineImageData}
 *   loading={isProcessing}
 * />
 * ```
 */
export const ResetButton = memo(function ResetButton({
  onReset,
  disabled = false,
  loading = false,
  className = '',
}: ResetButtonProps): React.JSX.Element {
  return (
    <Button
      onClick={onReset}
      disabled={disabled || loading}
      variant="secondary"
      size="lg"
      className={cn('w-full min-h-[44px]', className)}
      aria-label="Reset to auto-prep defaults"
      aria-busy={loading}
    >
      <RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />
      {loading ? 'Resetting...' : 'Reset to Auto-Prep'}
    </Button>
  );
});
