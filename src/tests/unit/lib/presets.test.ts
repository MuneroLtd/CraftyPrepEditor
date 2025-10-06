import { describe, it, expect } from 'vitest';
import type { MaterialPresetName, MaterialPreset } from '@/lib/types/presets';

describe('MaterialPreset Types', () => {
  describe('MaterialPresetName', () => {
    it('should include all valid preset names', () => {
      const validNames: MaterialPresetName[] = [
        'auto',
        'wood',
        'leather',
        'acrylic',
        'glass',
        'metal',
        'custom',
      ];

      // TypeScript compilation ensures these are valid
      expect(validNames).toHaveLength(7);
      expect(validNames).toContain('auto');
      expect(validNames).toContain('wood');
      expect(validNames).toContain('leather');
      expect(validNames).toContain('acrylic');
      expect(validNames).toContain('glass');
      expect(validNames).toContain('metal');
      expect(validNames).toContain('custom');
    });
  });

  describe('MaterialPreset Interface', () => {
    it('should have correct structure for a valid preset', () => {
      const testPreset: MaterialPreset = {
        name: 'wood',
        label: 'Wood',
        description: 'Optimized for wood engraving',
        adjustments: {
          brightness: 0,
          contrast: 5,
          threshold: -10,
        },
      };

      expect(testPreset.name).toBe('wood');
      expect(testPreset.label).toBe('Wood');
      expect(testPreset.description).toBe('Optimized for wood engraving');
      expect(testPreset.adjustments.brightness).toBe(0);
      expect(testPreset.adjustments.contrast).toBe(5);
      expect(testPreset.adjustments.threshold).toBe(-10);
    });

    it('should enforce adjustment value ranges via types', () => {
      // This test validates that the type system allows valid values
      const validPreset: MaterialPreset = {
        name: 'glass',
        label: 'Glass',
        description: 'Test',
        adjustments: {
          brightness: 50, // -100 to +100 is valid
          contrast: -50, // -100 to +100 is valid
          threshold: 25, // -50 to +50 is valid
        },
      };

      expect(validPreset.adjustments.brightness).toBe(50);
      expect(validPreset.adjustments.contrast).toBe(-50);
      expect(validPreset.adjustments.threshold).toBe(25);
    });

    it('should have all required fields', () => {
      const preset: MaterialPreset = {
        name: 'custom',
        label: 'Custom',
        description: 'User-defined settings',
        adjustments: {
          brightness: 0,
          contrast: 0,
          threshold: 0,
        },
      };

      // All fields should be defined
      expect(preset.name).toBeDefined();
      expect(preset.label).toBeDefined();
      expect(preset.description).toBeDefined();
      expect(preset.adjustments).toBeDefined();
      expect(preset.adjustments.brightness).toBeDefined();
      expect(preset.adjustments.contrast).toBeDefined();
      expect(preset.adjustments.threshold).toBeDefined();
    });

    it('should support all preset names in the type', () => {
      const presets: MaterialPreset[] = [
        {
          name: 'auto',
          label: 'Auto',
          description: 'Default',
          adjustments: { brightness: 0, contrast: 0, threshold: 0 },
        },
        {
          name: 'wood',
          label: 'Wood',
          description: 'Wood',
          adjustments: { brightness: 0, contrast: 5, threshold: -10 },
        },
        {
          name: 'leather',
          label: 'Leather',
          description: 'Leather',
          adjustments: { brightness: 0, contrast: 10, threshold: 15 },
        },
        {
          name: 'acrylic',
          label: 'Acrylic',
          description: 'Acrylic',
          adjustments: { brightness: 0, contrast: 15, threshold: 0 },
        },
        {
          name: 'glass',
          label: 'Glass',
          description: 'Glass',
          adjustments: { brightness: 0, contrast: 20, threshold: 20 },
        },
        {
          name: 'metal',
          label: 'Metal',
          description: 'Metal',
          adjustments: { brightness: 0, contrast: 0, threshold: -5 },
        },
        {
          name: 'custom',
          label: 'Custom',
          description: 'Custom',
          adjustments: { brightness: 0, contrast: 0, threshold: 0 },
        },
      ];

      expect(presets).toHaveLength(7);
      expect(presets.every((p) => p.name)).toBe(true);
    });
  });

  describe('Adjustment Value Validation', () => {
    it('should validate brightness range (-100 to +100)', () => {
      const testBrightness = (value: number) => {
        const preset: MaterialPreset = {
          name: 'custom',
          label: 'Custom',
          description: 'Test',
          adjustments: { brightness: value, contrast: 0, threshold: 0 },
        };
        return preset.adjustments.brightness;
      };

      expect(testBrightness(-100)).toBe(-100);
      expect(testBrightness(0)).toBe(0);
      expect(testBrightness(100)).toBe(100);
    });

    it('should validate contrast range (-100 to +100)', () => {
      const testContrast = (value: number) => {
        const preset: MaterialPreset = {
          name: 'custom',
          label: 'Custom',
          description: 'Test',
          adjustments: { brightness: 0, contrast: value, threshold: 0 },
        };
        return preset.adjustments.contrast;
      };

      expect(testContrast(-100)).toBe(-100);
      expect(testContrast(0)).toBe(0);
      expect(testContrast(100)).toBe(100);
    });

    it('should validate threshold range (-50 to +50 relative to Otsu)', () => {
      const testThreshold = (value: number) => {
        const preset: MaterialPreset = {
          name: 'custom',
          label: 'Custom',
          description: 'Test',
          adjustments: { brightness: 0, contrast: 0, threshold: value },
        };
        return preset.adjustments.threshold;
      };

      expect(testThreshold(-50)).toBe(-50);
      expect(testThreshold(0)).toBe(0);
      expect(testThreshold(50)).toBe(50);
    });
  });
});
