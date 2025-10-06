/**
 * Material preset type definitions for laser engraving preparation
 *
 * Strategy Pattern Implementation:
 * - Each preset is a configuration object (strategy)
 * - Easily extensible for new materials
 * - Decoupled from UI components
 */

/**
 * Available material preset names
 */
export type MaterialPresetName =
  | 'auto'
  | 'wood'
  | 'leather'
  | 'acrylic'
  | 'glass'
  | 'metal'
  | 'custom';

/**
 * Material preset configuration
 *
 * Defines the adjustments for a specific material type.
 * Adjustments are applied relative to the auto-prep baseline.
 */
export interface MaterialPreset {
  /** Unique preset identifier */
  name: MaterialPresetName;

  /** Display label for UI */
  label: string;

  /** Human-readable description of the preset */
  description: string;

  /** Adjustment values relative to auto-prep baseline */
  adjustments: {
    /** Brightness adjustment (-100 to +100) */
    brightness: number;

    /** Contrast adjustment (-100 to +100) */
    contrast: number;

    /**
     * Threshold adjustment relative to Otsu value (-50 to +50)
     *
     * Example: If Otsu threshold = 128 and adjustment = -10,
     * final threshold = 118
     */
    threshold: number;
  };
}

/**
 * Complete preset configuration
 *
 * Contains all available presets and the default preset name.
 */
export interface PresetConfiguration {
  /** Map of all available presets */
  presets: Record<MaterialPresetName, MaterialPreset>;

  /** Default preset name */
  default: MaterialPresetName;
}
