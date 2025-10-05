/**
 * Debounce Hook
 *
 * Delays updating a value until it stops changing for a specified delay.
 * Useful for preventing excessive processing during rapid user input (e.g., slider drag).
 */

import { useState, useEffect } from 'react';

/**
 * Debounces a value by delayMs milliseconds.
 *
 * The debounced value will only update after the source value has stopped
 * changing for the specified delay period. This is useful for:
 * - Preventing excessive API calls during typing
 * - Delaying expensive operations during slider drag
 * - Optimizing performance for rapid state changes
 *
 * @param value - The value to debounce
 * @param delayMs - Delay in milliseconds before updating debounced value
 * @returns Debounced value that updates after delay
 *
 * @example
 * ```tsx
 * function BrightnessControl() {
 *   const [brightness, setBrightness] = useState(0);
 *   const debouncedBrightness = useDebounce(brightness, 100);
 *
 *   useEffect(() => {
 *     // Only called 100ms after user stops dragging slider
 *     applyBrightnessAdjustment(debouncedBrightness);
 *   }, [debouncedBrightness]);
 *
 *   return (
 *     <Slider
 *       value={brightness}
 *       onChange={setBrightness} // Updates immediately (UI responsive)
 *     />
 *   );
 * }
 * ```
 *
 * @performance
 * - Lightweight: Only creates a single timer
 * - Automatic cleanup: Timer cleared on unmount or value change
 * - No memory leaks: Effect cleanup ensures proper teardown
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Cleanup: Clear timer if value changes or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]); // Re-run effect when value or delay changes

  return debouncedValue;
}
