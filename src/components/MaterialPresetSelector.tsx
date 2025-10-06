/**
 * Material Preset Selector Component
 *
 * Provides a dropdown selector for choosing material-specific presets
 * that optimize brightness, contrast, and threshold settings for common
 * laser engraving materials.
 *
 * Features:
 * - 7 material presets (Auto, Wood, Leather, Acrylic, Glass, Metal, Custom)
 * - WCAG 2.2 AAA accessibility compliance
 * - Keyboard navigation support
 * - Screen reader compatible
 * - Visual feedback for selected preset
 *
 * @example
 * ```tsx
 * <MaterialPresetSelector
 *   value={selectedPreset}
 *   onChange={handlePresetChange}
 *   disabled={isProcessing}
 * />
 * ```
 */

import { memo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MATERIAL_PRESETS } from '@/lib/presets/presetConfigurations';
import type { MaterialPresetName } from '@/lib/types/presets';

/**
 * Preset display order
 * Defined at module level to avoid recreation on each render
 */
const PRESET_ORDER: MaterialPresetName[] = [
  'auto',
  'wood',
  'leather',
  'acrylic',
  'glass',
  'metal',
  'custom',
];

/**
 * MaterialPresetSelector component props
 */
export interface MaterialPresetSelectorProps {
  /** Currently selected preset */
  value: MaterialPresetName;

  /** Callback when preset selection changes */
  onChange: (preset: MaterialPresetName) => void;

  /** Whether the selector is disabled */
  disabled?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Material Preset Selector Component
 *
 * Dropdown selector for material-specific image processing presets.
 * Automatically displays the description of the currently selected preset.
 *
 * Accessibility:
 * - Keyboard navigable (Tab, Enter, Arrow keys, Escape)
 * - Screen reader announcements for preset names and descriptions
 * - ARIA labels and descriptions
 * - Focus visible indicators
 */
export const MaterialPresetSelector = memo(function MaterialPresetSelector({
  value,
  onChange,
  disabled = false,
  className = '',
}: MaterialPresetSelectorProps): React.JSX.Element {
  // Get current preset for description display
  const currentPreset = MATERIAL_PRESETS.presets[value];

  return (
    <div className={className}>
      {/* Label */}
      <label htmlFor="material-preset" className="block text-sm font-medium mb-2 text-slate-800">
        Material Preset
      </label>

      {/* Select Dropdown */}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="material-preset" className="w-full" aria-label="Select material preset">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRESET_ORDER.map((presetName) => {
            const preset = MATERIAL_PRESETS.presets[presetName];
            return (
              <SelectItem key={presetName} value={presetName} aria-description={preset.description}>
                {preset.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Description Text */}
      <p className="text-xs text-slate-800 mt-1" role="status" aria-live="polite">
        {currentPreset.description}
      </p>
    </div>
  );
});
