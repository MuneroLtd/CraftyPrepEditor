/**
 * Delayed Loading Hook
 *
 * Only shows loading state if processing takes longer than delayMs.
 * Prevents loading flashes for fast operations (<500ms).
 *
 * This improves UX by:
 * - Avoiding distracting flashes for quick operations
 * - Only showing loading for genuinely slow operations
 * - Maintaining perceived performance
 */

import { useState, useEffect } from 'react';

/**
 * Delays showing loading indicator until processing exceeds delayMs.
 *
 * Use this hook to prevent loading indicator flashing during fast operations.
 * The loading state will only become true if processing takes longer than
 * the specified delay.
 *
 * @param isProcessing - Whether processing is currently active
 * @param delayMs - Delay in milliseconds before showing loading indicator
 * @returns boolean indicating whether loading indicator should be shown
 *
 * @example
 * ```tsx
 * function ImageEditor() {
 *   const [isProcessing, setIsProcessing] = useState(false);
 *   const shouldShowLoading = useDelayedLoading(isProcessing, 500);
 *
 *   useEffect(() => {
 *     setIsProcessing(true);
 *     applyAdjustments().finally(() => setIsProcessing(false));
 *   }, [adjustments]);
 *
 *   return (
 *     <>
 *       {shouldShowLoading && <LoadingSpinner />}
 *       <ImagePreview />
 *     </>
 *   );
 * }
 * ```
 *
 * @performance
 * - Lightweight: Single timer per instance
 * - Automatic cleanup: Timer cleared on unmount/state change
 * - No memory leaks: Proper effect cleanup
 *
 * @accessibility
 * Pair with ARIA live regions for screen reader announcements:
 * ```tsx
 * <div role="status" aria-live="polite">
 *   {shouldShowLoading && 'Processing...'}
 * </div>
 * ```
 */
export function useDelayedLoading(isProcessing: boolean, delayMs: number = 500): boolean {
  const [shouldShowLoading, setShouldShowLoading] = useState(false);

  useEffect(() => {
    if (isProcessing) {
      // Set timer to show loading after delay
      const timer = setTimeout(() => {
        setShouldShowLoading(true);
      }, delayMs);

      // Cleanup: Clear timer if processing stops or component unmounts
      return () => {
        clearTimeout(timer);
        setShouldShowLoading(false);
      };
    } else {
      // Processing finished, hide loading immediately
      setShouldShowLoading(false);
    }
  }, [isProcessing, delayMs]);

  return shouldShowLoading;
}
