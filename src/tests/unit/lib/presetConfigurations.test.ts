import { describe, it, expect } from 'vitest';
import { MATERIAL_PRESETS, getPreset, getDefaultPreset } from '@/lib/presets/presetConfigurations';
import type { MaterialPresetName } from '@/lib/types/presets';

describe('Preset Configurations', () => {
  describe('MATERIAL_PRESETS', () => {
    it('should have all 7 presets defined', () => {
      const presetNames = Object.keys(MATERIAL_PRESETS.presets);
      expect(presetNames).toHaveLength(7);
      expect(presetNames).toContain('auto');
      expect(presetNames).toContain('wood');
      expect(presetNames).toContain('leather');
      expect(presetNames).toContain('acrylic');
      expect(presetNames).toContain('glass');
      expect(presetNames).toContain('metal');
      expect(presetNames).toContain('custom');
    });

    it('should have "auto" as default preset', () => {
      expect(MATERIAL_PRESETS.default).toBe('auto');
    });

    it('should have all required fields for each preset', () => {
      Object.values(MATERIAL_PRESETS.presets).forEach((preset) => {
        expect(preset.name).toBeDefined();
        expect(preset.label).toBeDefined();
        expect(preset.description).toBeDefined();
        expect(preset.adjustments).toBeDefined();
        expect(preset.adjustments.brightness).toBeDefined();
        expect(preset.adjustments.contrast).toBeDefined();
        expect(preset.adjustments.threshold).toBeDefined();
      });
    });
  });

  describe('Auto Preset', () => {
    it('should have zero adjustments (baseline)', () => {
      const auto = MATERIAL_PRESETS.presets.auto;
      expect(auto.name).toBe('auto');
      expect(auto.label).toBe('Auto');
      expect(auto.adjustments.brightness).toBe(0);
      expect(auto.adjustments.contrast).toBe(0);
      expect(auto.adjustments.threshold).toBe(0);
    });

    it('should have descriptive label and description', () => {
      const auto = MATERIAL_PRESETS.presets.auto;
      expect(auto.label).toBe('Auto');
      expect(auto.description).toContain('auto-prep');
    });
  });

  describe('Wood Preset', () => {
    it('should have correct adjustment values', () => {
      const wood = MATERIAL_PRESETS.presets.wood;
      expect(wood.name).toBe('wood');
      expect(wood.label).toBe('Wood');
      expect(wood.adjustments.brightness).toBe(0);
      expect(wood.adjustments.contrast).toBe(5);
      expect(wood.adjustments.threshold).toBe(-10);
    });

    it('should have descriptive label and description', () => {
      const wood = MATERIAL_PRESETS.presets.wood;
      expect(wood.label).toBe('Wood');
      expect(wood.description).toBeTruthy();
      expect(wood.description.length).toBeGreaterThan(0);
    });
  });

  describe('Leather Preset', () => {
    it('should have correct adjustment values', () => {
      const leather = MATERIAL_PRESETS.presets.leather;
      expect(leather.name).toBe('leather');
      expect(leather.label).toBe('Leather');
      expect(leather.adjustments.brightness).toBe(0);
      expect(leather.adjustments.contrast).toBe(10);
      expect(leather.adjustments.threshold).toBe(15);
    });

    it('should have descriptive label and description', () => {
      const leather = MATERIAL_PRESETS.presets.leather;
      expect(leather.label).toBe('Leather');
      expect(leather.description).toContain('leather');
    });
  });

  describe('Acrylic Preset', () => {
    it('should have correct adjustment values', () => {
      const acrylic = MATERIAL_PRESETS.presets.acrylic;
      expect(acrylic.name).toBe('acrylic');
      expect(acrylic.label).toBe('Acrylic');
      expect(acrylic.adjustments.brightness).toBe(0);
      expect(acrylic.adjustments.contrast).toBe(15);
      expect(acrylic.adjustments.threshold).toBe(0);
    });

    it('should have descriptive label and description', () => {
      const acrylic = MATERIAL_PRESETS.presets.acrylic;
      expect(acrylic.label).toBe('Acrylic');
      expect(acrylic.description).toContain('acrylic');
    });
  });

  describe('Glass Preset', () => {
    it('should have correct adjustment values', () => {
      const glass = MATERIAL_PRESETS.presets.glass;
      expect(glass.name).toBe('glass');
      expect(glass.label).toBe('Glass');
      expect(glass.adjustments.brightness).toBe(0);
      expect(glass.adjustments.contrast).toBe(20);
      expect(glass.adjustments.threshold).toBe(20);
    });

    it('should have descriptive label and description', () => {
      const glass = MATERIAL_PRESETS.presets.glass;
      expect(glass.label).toBe('Glass');
      expect(glass.description).toContain('glass');
    });
  });

  describe('Metal Preset', () => {
    it('should have correct adjustment values', () => {
      const metal = MATERIAL_PRESETS.presets.metal;
      expect(metal.name).toBe('metal');
      expect(metal.label).toBe('Metal');
      expect(metal.adjustments.brightness).toBe(0);
      expect(metal.adjustments.contrast).toBe(0);
      expect(metal.adjustments.threshold).toBe(-5);
    });

    it('should have descriptive label and description', () => {
      const metal = MATERIAL_PRESETS.presets.metal;
      expect(metal.label).toBe('Metal');
      expect(metal.description).toContain('metal');
    });
  });

  describe('Custom Preset', () => {
    it('should have zero adjustments (user-defined)', () => {
      const custom = MATERIAL_PRESETS.presets.custom;
      expect(custom.name).toBe('custom');
      expect(custom.label).toBe('Custom');
      expect(custom.adjustments.brightness).toBe(0);
      expect(custom.adjustments.contrast).toBe(0);
      expect(custom.adjustments.threshold).toBe(0);
    });

    it('should have descriptive label and description', () => {
      const custom = MATERIAL_PRESETS.presets.custom;
      expect(custom.label).toBe('Custom');
      expect(custom.description).toContain('User-defined');
    });
  });

  describe('Adjustment Value Ranges', () => {
    it('should have brightness values within range (-100 to +100)', () => {
      Object.values(MATERIAL_PRESETS.presets).forEach((preset) => {
        expect(preset.adjustments.brightness).toBeGreaterThanOrEqual(-100);
        expect(preset.adjustments.brightness).toBeLessThanOrEqual(100);
      });
    });

    it('should have contrast values within range (-100 to +100)', () => {
      Object.values(MATERIAL_PRESETS.presets).forEach((preset) => {
        expect(preset.adjustments.contrast).toBeGreaterThanOrEqual(-100);
        expect(preset.adjustments.contrast).toBeLessThanOrEqual(100);
      });
    });

    it('should have threshold values within range (-50 to +50)', () => {
      Object.values(MATERIAL_PRESETS.presets).forEach((preset) => {
        expect(preset.adjustments.threshold).toBeGreaterThanOrEqual(-50);
        expect(preset.adjustments.threshold).toBeLessThanOrEqual(50);
      });
    });
  });

  describe('getPreset()', () => {
    it('should return correct preset for each name', () => {
      const presetNames: MaterialPresetName[] = [
        'auto',
        'wood',
        'leather',
        'acrylic',
        'glass',
        'metal',
        'custom',
      ];

      presetNames.forEach((name) => {
        const preset = getPreset(name);
        expect(preset.name).toBe(name);
        expect(preset).toBe(MATERIAL_PRESETS.presets[name]);
      });
    });

    it('should return wood preset with correct values', () => {
      const wood = getPreset('wood');
      expect(wood.adjustments.brightness).toBe(0);
      expect(wood.adjustments.contrast).toBe(5);
      expect(wood.adjustments.threshold).toBe(-10);
    });

    it('should return glass preset with correct values', () => {
      const glass = getPreset('glass');
      expect(glass.adjustments.brightness).toBe(0);
      expect(glass.adjustments.contrast).toBe(20);
      expect(glass.adjustments.threshold).toBe(20);
    });
  });

  describe('getDefaultPreset()', () => {
    it('should return auto preset', () => {
      const defaultPreset = getDefaultPreset();
      expect(defaultPreset.name).toBe('auto');
      expect(defaultPreset).toBe(MATERIAL_PRESETS.presets.auto);
    });

    it('should return preset with zero adjustments', () => {
      const defaultPreset = getDefaultPreset();
      expect(defaultPreset.adjustments.brightness).toBe(0);
      expect(defaultPreset.adjustments.contrast).toBe(0);
      expect(defaultPreset.adjustments.threshold).toBe(0);
    });
  });

  describe('Preset Consistency', () => {
    it('should have unique labels for all presets', () => {
      const labels = Object.values(MATERIAL_PRESETS.presets).map((p) => p.label);
      const uniqueLabels = new Set(labels);
      expect(uniqueLabels.size).toBe(labels.length);
    });

    it('should have unique descriptions for all presets', () => {
      const descriptions = Object.values(MATERIAL_PRESETS.presets).map((p) => p.description);
      const uniqueDescriptions = new Set(descriptions);
      expect(uniqueDescriptions.size).toBe(descriptions.length);
    });

    it('should have preset name matching the key', () => {
      Object.entries(MATERIAL_PRESETS.presets).forEach(([key, preset]) => {
        expect(preset.name).toBe(key);
      });
    });
  });
});
