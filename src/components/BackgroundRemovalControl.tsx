/**
 * BackgroundRemovalControl Component
 *
 * Provides UI controls for background removal feature:
 * - Toggle to enable/disable
 * - Sensitivity slider (0-255)
 *
 * Features:
 * - WCAG 2.2 Level AAA compliant
 * - Keyboard accessible (Tab, Space, Arrow keys)
 * - Screen reader friendly
 * - Touch-friendly (≥44×44px targets)
 */

import { memo } from 'react';
import { RefinementSlider } from '@/components/RefinementSlider';

/**
 * Props for the BackgroundRemovalControl component
 */
export interface BackgroundRemovalControlProps {
  /** Whether background removal is enabled */
  enabled: boolean;
  /** Sensitivity value (0-255) */
  sensitivity: number;
  /** Callback fired when toggle changes */
  onToggle: (enabled: boolean) => void;
  /** Callback fired when sensitivity changes */
  onSensitivityChange: (value: number) => void;
  /** Whether the controls are disabled */
  disabled?: boolean;
}

/**
 * BackgroundRemovalControl - Toggle and slider for background removal
 *
 * Memoized to prevent unnecessary re-renders when parent re-renders.
 *
 * @example
 * ```tsx
 * <BackgroundRemovalControl
 *   enabled={bgRemovalEnabled}
 *   sensitivity={bgSensitivity}
 *   onToggle={setBackgroundRemovalEnabled}
 *   onSensitivityChange={setBackgroundSensitivity}
 * />
 * ```
 */
export const BackgroundRemovalControl = memo(function BackgroundRemovalControl({
  enabled,
  sensitivity,
  onToggle,
  onSensitivityChange,
  disabled = false,
}: BackgroundRemovalControlProps): React.JSX.Element {
  return (
    <div className="space-y-2">
      {/* Toggle for enabling/disabling background removal */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="bg-removal-toggle"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Remove Background
        </label>

        {/* Custom toggle switch using checkbox */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle background removal"
          id="bg-removal-toggle"
          disabled={disabled}
          onClick={() => onToggle(!enabled)}
          className={`
            relative inline-flex h-11 w-20 items-center rounded-full
            transition-colors focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-offset-2 focus-visible:ring-offset-background
            focus-visible:ring-blue-500
            disabled:cursor-not-allowed disabled:opacity-50
            ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
          `}
        >
          <span
            className={`
              ${enabled ? 'translate-x-11' : 'translate-x-1'}
              inline-block h-9 w-9 transform rounded-full bg-white
              transition-transform
            `}
          />
        </button>
      </div>

      {/* Sensitivity slider (only visible when enabled) */}
      {enabled && (
        <div className="pt-2">
          <RefinementSlider
            label="Sensitivity"
            value={sensitivity}
            min={0}
            max={255}
            step={1}
            onChange={onSensitivityChange}
            ariaLabel="Adjust background removal sensitivity from 0 to 255. Higher values remove more aggressively."
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
});
