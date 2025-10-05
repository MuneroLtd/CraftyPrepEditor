/**
 * @file AutoPrepButton Component
 * @description Primary call-to-action button for triggering auto-prep processing pipeline
 *
 * Features:
 * - Loading state with spinner and "Processing..." text
 * - Disabled state with tooltip
 * - Icon (sparkles) + text layout
 * - Full WCAG 2.2 AAA accessibility compliance
 * - Keyboard accessible (Tab + Enter/Space)
 * - Screen reader support with status announcements
 */

import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

export interface AutoPrepButtonProps {
  /** Whether the button should be disabled (e.g., no image loaded) */
  disabled: boolean;
  /** Whether processing is currently in progress */
  loading: boolean;
  /** Callback fired when button is clicked */
  onClick: () => void;
}

/**
 * Auto-Prep button component with loading and disabled states.
 *
 * Executes the complete image processing pipeline:
 * 1. Grayscale conversion
 * 2. Histogram equalization
 * 3. Otsu threshold (binarization)
 *
 * @example
 * ```tsx
 * <AutoPrepButton
 *   disabled={!uploadedImage || isProcessing}
 *   loading={isProcessing}
 *   onClick={() => runAutoPrepAsync(uploadedImage)}
 * />
 * ```
 */
export function AutoPrepButton({ disabled, loading, onClick }: AutoPrepButtonProps) {
  // Button is disabled if explicitly disabled OR currently loading
  const isDisabled = disabled || loading;

  // Button text changes based on loading state
  const buttonText = loading ? 'Processing...' : 'Auto-Prep';

  // Accessible label includes state information
  const ariaLabel = disabled
    ? 'Auto-Prep: Upload an image first'
    : loading
      ? 'Processing image'
      : 'Auto-Prep: Process image for laser engraving';

  return (
    <Button
      variant="default"
      size="lg"
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={isDisabled}
      className="min-w-[140px] h-11 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50"
      tabIndex={0}
    >
      {/* Loading spinner (shown during processing) */}
      {loading && (
        <Loader2 className="animate-spin" data-testid="loading-spinner" aria-hidden="true" />
      )}

      {/* Sparkles icon (shown when not loading) */}
      {!loading && <Sparkles aria-hidden="true" />}

      {/* Button text */}
      <span>{buttonText}</span>

      {/* Screen reader only status announcement */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {loading ? 'Processing image, please wait' : ''}
      </span>
    </Button>
  );
}
