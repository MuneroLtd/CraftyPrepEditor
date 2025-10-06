/**
 * Material preset configurations for laser engraving preparation
 *
 * Strategy Pattern Implementation:
 * Each preset is a configuration object (strategy) that can be easily
 * selected and applied. This pattern allows for easy extension of new
 * material types without modifying existing code.
 *
 * Preset Values Based on Material Properties:
 * - Wood: Slight contrast boost, lower threshold for detail retention
 * - Leather: Higher contrast for texture, higher threshold for burn depth
 * - Acrylic: High contrast for edge definition, auto threshold
 * - Glass: Highest contrast for etching visibility, higher threshold
 * - Metal: Auto settings work well, slight threshold reduction
 * - Custom: User-defined adjustments, persisted in localStorage
 */

import type { MaterialPreset, PresetConfiguration, MaterialPresetName } from '@/lib/types/presets';

/**
 * Complete material preset configuration
 *
 * Contains all 7 presets optimized for common laser engraving materials.
 * Adjustments are relative to the auto-prep baseline (Otsu threshold).
 */
export const MATERIAL_PRESETS: PresetConfiguration = {
  default: 'auto',
  presets: {
    auto: {
      name: 'auto',
      label: 'Auto',
      description: 'Default auto-prep settings',
      adjustments: {
        brightness: 0,
        contrast: 0,
        threshold: 0,
      },
    },
    wood: {
      name: 'wood',
      label: 'Wood',
      description: 'Optimized for pine, oak, walnut engraving',
      adjustments: {
        brightness: 0,
        contrast: 5,
        threshold: -10,
      },
    },
    leather: {
      name: 'leather',
      label: 'Leather',
      description: 'Optimized for leather burning/engraving',
      adjustments: {
        brightness: 0,
        contrast: 10,
        threshold: 15,
      },
    },
    acrylic: {
      name: 'acrylic',
      label: 'Acrylic',
      description: 'Optimized for clear or colored acrylic',
      adjustments: {
        brightness: 0,
        contrast: 15,
        threshold: 0,
      },
    },
    glass: {
      name: 'glass',
      label: 'Glass',
      description: 'Optimized for glass etching',
      adjustments: {
        brightness: 0,
        contrast: 20,
        threshold: 20,
      },
    },
    metal: {
      name: 'metal',
      label: 'Metal',
      description: 'Optimized for anodized aluminum, coated metals',
      adjustments: {
        brightness: 0,
        contrast: 0,
        threshold: -5,
      },
    },
    custom: {
      name: 'custom',
      label: 'Custom',
      description: 'User-defined settings',
      adjustments: {
        brightness: 0,
        contrast: 0,
        threshold: 0,
      },
    },
  },
};

/**
 * Get a specific preset by name
 *
 * @param name - Material preset name
 * @returns The requested material preset configuration
 *
 * @example
 * ```typescript
 * const woodPreset = getPreset('wood');
 * console.log(woodPreset.adjustments.contrast); // 5
 * ```
 */
export function getPreset(name: MaterialPresetName): MaterialPreset {
  return MATERIAL_PRESETS.presets[name];
}

/**
 * Get the default preset (auto)
 *
 * @returns The default material preset configuration
 *
 * @example
 * ```typescript
 * const defaultPreset = getDefaultPreset();
 * console.log(defaultPreset.name); // 'auto'
 * ```
 */
export function getDefaultPreset(): MaterialPreset {
  return MATERIAL_PRESETS.presets[MATERIAL_PRESETS.default];
}
