/**
 * Shared utility functions for image processing algorithms.
 */

/**
 * Clamps a value between min and max bounds.
 *
 * @param value - Value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 *
 * @example
 * ```typescript
 * clamp(300, 0, 255) // Returns 255
 * clamp(-50, 0, 255) // Returns 0
 * clamp(150, 0, 255) // Returns 150
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
