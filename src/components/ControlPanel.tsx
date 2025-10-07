/**
 * ControlPanel Component
 *
 * Professional control panel with collapsible sections for all image processing controls.
 * Organizes controls into logical groups with persistent expand/collapse state.
 *
 * Features:
 * - Accordion-based collapsible sections
 * - State persistence across sessions
 * - Keyboard accessible (WCAG 2.2 AAA)
 * - Smooth animations (respects prefers-reduced-motion)
 * - Reuses existing control components (no duplication)
 *
 * @module ControlPanel
 */

import { memo, useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MaterialPresetSelector } from '@/components/MaterialPresetSelector';
import { BackgroundRemovalControl } from '@/components/BackgroundRemovalControl';
import { BrightnessSlider } from '@/components/BrightnessSlider';
import { ContrastSlider } from '@/components/ContrastSlider';
import { ThresholdSlider } from '@/components/ThresholdSlider';
import { UndoRedoButtons } from '@/components/UndoRedoButtons';
import { DownloadButton } from '@/components/DownloadButton';
import { ResetButton } from '@/components/ResetButton';
import { usePanelState } from '@/hooks/usePanelState';
import { cn } from '@/lib/utils';
import type { MaterialPresetName } from '@/lib/types/presets';

/**
 * Props for ControlPanel component
 */
export interface ControlPanelProps {
  // Material Presets
  /** Currently selected material preset */
  selectedPreset: MaterialPresetName;
  /** Callback when preset selection changes */
  onPresetChange: (preset: MaterialPresetName) => void;

  // Background Removal (optional - only shown if callbacks provided)
  /** Whether background removal is enabled */
  backgroundRemovalEnabled?: boolean;
  /** Background removal sensitivity (0-255) */
  backgroundRemovalSensitivity?: number;
  /** Callback when background removal is toggled */
  onBackgroundRemovalToggle?: (enabled: boolean) => void;
  /** Callback when background removal sensitivity changes */
  onBackgroundRemovalSensitivityChange?: (value: number) => void;

  // Adjustments
  /** Current brightness value (-100 to +100) */
  brightness: number;
  /** Current contrast value (-100 to +100) */
  contrast: number;
  /** Current threshold value (0 to 255) */
  threshold: number;
  /** Callback when brightness changes */
  onBrightnessChange: (value: number) => void;
  /** Callback when contrast changes */
  onContrastChange: (value: number) => void;
  /** Callback when threshold changes */
  onThresholdChange: (value: number) => void;

  // History (optional - only shown if callbacks provided)
  /** Whether undo is available */
  canUndo?: boolean;
  /** Whether redo is available */
  canRedo?: boolean;
  /** Callback for undo action */
  onUndo?: () => void;
  /** Callback for redo action */
  onRedo?: () => void;

  // Export (optional - only shown if canvas provided)
  /** Canvas element for export */
  canvas?: HTMLCanvasElement | null;
  /** Original filename for export */
  originalFilename?: string;

  // Actions (optional - only shown if callback provided)
  /** Callback for reset action */
  onReset?: () => void;
  /** Whether reset is in progress */
  isResetting?: boolean;

  // State
  /** Whether controls are disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Professional control panel with collapsible sections
 *
 * Organizes all image processing controls into logical groups:
 * - Material Presets: Quick material-specific configurations
 * - Background Removal: Toggle and sensitivity control
 * - Adjustments: Brightness, contrast, and threshold sliders
 * - History: Undo/redo operations
 * - Export: Download processed image
 * - Actions: Reset to defaults
 *
 * Each section is collapsible and state persists across sessions.
 *
 * @example
 * ```tsx
 * <ControlPanel
 *   selectedPreset="wood"
 *   onPresetChange={handlePresetChange}
 *   brightness={brightness}
 *   contrast={contrast}
 *   threshold={threshold}
 *   onBrightnessChange={setBrightness}
 *   onContrastChange={setContrast}
 *   onThresholdChange={setThreshold}
 *   canvas={processedCanvas}
 *   originalFilename={file.name}
 *   onReset={handleReset}
 * />
 * ```
 */
export const ControlPanel = memo(function ControlPanel({
  selectedPreset,
  onPresetChange,
  backgroundRemovalEnabled = false,
  backgroundRemovalSensitivity = 128,
  onBackgroundRemovalToggle,
  onBackgroundRemovalSensitivityChange,
  brightness,
  contrast,
  threshold,
  onBrightnessChange,
  onContrastChange,
  onThresholdChange,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  canvas,
  originalFilename,
  onReset,
  isResetting = false,
  disabled = false,
  className,
}: ControlPanelProps) {
  const { state, updateSection } = usePanelState();
  const previousValueRef = useRef<string[]>([]);

  // Convert panel state to accordion value array (sections that are expanded)
  const defaultValue = Object.entries(state)
    .filter(([, expanded]) => expanded)
    .map(([section]) => section);

  // Initialize previousValueRef on first render
  if (previousValueRef.current.length === 0) {
    previousValueRef.current = defaultValue;
  }

  /**
   * Handle accordion value changes
   *
   * Updates panel state when sections are expanded/collapsed.
   * Optimized to only update sections that actually changed by comparing
   * with previous value using Set operations.
   */
  const handleValueChange = (value: string[]) => {
    const previousValue = previousValueRef.current;
    const previousSet = new Set(previousValue);
    const currentSet = new Set(value);

    // Find sections that were added (expanded)
    const added = value.filter((section) => !previousSet.has(section));

    // Find sections that were removed (collapsed)
    const removed = previousValue.filter((section) => !currentSet.has(section));

    // Update only sections that changed
    added.forEach((section) => {
      updateSection(section as keyof typeof state, true);
    });

    removed.forEach((section) => {
      updateSection(section as keyof typeof state, false);
    });

    // Store current value for next comparison
    previousValueRef.current = value;
  };

  return (
    <div
      className={cn('rounded-lg border bg-card shadow-sm', 'p-6 space-y-4', className)}
      role="region"
      aria-label="Control Panel"
    >
      <h2 className="text-xl font-semibold">Controls</h2>

      <Accordion
        type="multiple"
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        className="space-y-2"
      >
        {/* Material Presets Section */}
        <AccordionItem value="materialPresets" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
            <span className="font-medium">Material Presets</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <MaterialPresetSelector
              value={selectedPreset}
              onChange={onPresetChange}
              disabled={disabled}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Background Removal Section (conditional) */}
        {onBackgroundRemovalToggle && onBackgroundRemovalSensitivityChange && (
          <AccordionItem value="backgroundRemoval" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
              <span className="font-medium">Background Removal</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <BackgroundRemovalControl
                enabled={backgroundRemovalEnabled}
                sensitivity={backgroundRemovalSensitivity}
                onToggle={onBackgroundRemovalToggle}
                onSensitivityChange={onBackgroundRemovalSensitivityChange}
                disabled={disabled}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Adjustments Section */}
        <AccordionItem value="adjustments" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
            <span className="font-medium">Adjustments</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
            <BrightnessSlider
              value={brightness}
              onChange={onBrightnessChange}
              disabled={disabled}
            />
            <ContrastSlider value={contrast} onChange={onContrastChange} disabled={disabled} />
            <ThresholdSlider value={threshold} onChange={onThresholdChange} disabled={disabled} />
          </AccordionContent>
        </AccordionItem>

        {/* History Section (conditional) */}
        {onUndo && onRedo && (
          <AccordionItem value="history" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
              <span className="font-medium">History</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <UndoRedoButtons
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={onUndo}
                onRedo={onRedo}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Export Section (conditional) */}
        {canvas && originalFilename && (
          <AccordionItem value="export" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
              <span className="font-medium">Export</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <DownloadButton
                canvas={canvas}
                originalFilename={originalFilename}
                disabled={!canvas}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Actions Section (conditional) */}
        {onReset && (
          <AccordionItem value="actions" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
              <span className="font-medium">Actions</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <ResetButton onReset={onReset} disabled={disabled} loading={isResetting} />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
});
