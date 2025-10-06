import { useState, useEffect, useCallback, useRef } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import { FileUploadComponent } from './components/FileUploadComponent';
import { AutoPrepButton } from './components/AutoPrepButton';
import { ImagePreview } from './components/ImagePreview';
import { DownloadButton } from './components/DownloadButton';
import { RefinementControls } from './components/RefinementControls';
import { UndoRedoButtons } from './components/UndoRedoButtons';
import { useImageProcessing } from './hooks/useImageProcessing';
import { useFileUpload } from './hooks/useFileUpload';
import { useDebounce } from './hooks/useDebounce';
import { useDelayedLoading } from './hooks/useDelayedLoading';
import { useCustomPresetPersistence, clearCustomPreset } from './hooks/useCustomPresetPersistence';
import { useHistory } from './hooks/useHistory';
import { useSettingsPersistence } from './hooks/useSettingsPersistence';
import { useInitialSettings } from './hooks/useInitialSettings';
import {
  DEFAULT_BRIGHTNESS,
  DEFAULT_CONTRAST,
  DEFAULT_BACKGROUND_REMOVAL_ENABLED,
  DEFAULT_BACKGROUND_REMOVAL_SENSITIVITY,
} from './lib/constants';
import { getPreset } from './lib/presets/presetConfigurations';
import { loadCustomPreset } from './lib/utils/presetValidation';
import { isMacPlatform } from './lib/utils/platform';
import type { MaterialPresetName } from './lib/types/presets';

function App() {
  // File upload state (managed by useFileUpload hook - single source of truth)
  const {
    uploadedImage,
    selectedFile,
    isLoading,
    error: uploadError,
    info,
    progress,
    handleFileSelect,
    clearError,
    clearInfo,
  } = useFileUpload();

  // Image processing state (managed by useImageProcessing hook)
  const {
    processedImage,
    processedCanvas,
    baselineImageData,
    otsuThreshold,
    isProcessing,
    error: processingError,
    runAutoPrepAsync,
    applyAdjustments,
  } = useImageProcessing();

  // Preset state
  const [selectedPreset, setSelectedPreset] = useState<MaterialPresetName>('auto');

  // Adjustment states (use constants for initial values)
  const [brightness, setBrightness] = useState(DEFAULT_BRIGHTNESS);
  const [contrast, setContrast] = useState(DEFAULT_CONTRAST);
  const [threshold, setThreshold] = useState(128); // Will be updated to Otsu value
  const debouncedBrightness = useDebounce(brightness, 100);
  const debouncedContrast = useDebounce(contrast, 100);
  const debouncedThreshold = useDebounce(threshold, 100);

  // Background removal state (use constants for initial values)
  const [backgroundRemovalEnabled, setBackgroundRemovalEnabled] = useState(
    DEFAULT_BACKGROUND_REMOVAL_ENABLED
  );
  const [backgroundRemovalSensitivity, setBackgroundRemovalSensitivity] = useState(
    DEFAULT_BACKGROUND_REMOVAL_SENSITIVITY
  );
  const debouncedBgSensitivity = useDebounce(backgroundRemovalSensitivity, 100);

  // Delayed loading indicator (only show if processing >500ms)
  const shouldShowLoading = useDelayedLoading(isProcessing, 500);

  // Custom preset persistence (auto-saves to localStorage with debouncing)
  useCustomPresetPersistence(selectedPreset, brightness, contrast, threshold, otsuThreshold);

  // Settings persistence (auto-saves all settings to localStorage)
  const clearAllSettings = useSettingsPersistence(selectedPreset, brightness, contrast, threshold);

  // Load initial settings from localStorage
  const initialSettings = useInitialSettings();

  // Track if initial settings have been applied (performance optimization)
  const initialSettingsAppliedRef = useRef(false);

  // Apply initial settings on mount (runs once)
  useEffect(() => {
    if (initialSettings && !uploadedImage && !initialSettingsAppliedRef.current) {
      setSelectedPreset(initialSettings.selectedPreset);
      setBrightness(initialSettings.brightness);
      setContrast(initialSettings.contrast);
      setThreshold(initialSettings.threshold);
      initialSettingsAppliedRef.current = true;
    }
  }, [initialSettings, uploadedImage]);

  // Undo/Redo history management
  const {
    canUndo,
    canRedo,
    push: pushToHistory,
    undo,
    redo,
    clear: clearHistory,
    currentState: historyCurrentState,
  } = useHistory();

  /**
   * State flow documentation:
   * 1. Background removal changes → runs auto-prep → sets baselineImageData
   * 2. baselineImageData changes → re-applies brightness/contrast/threshold adjustments
   *
   * This cascading is intentional:
   * - Background removal requires full pipeline re-run
   * - Brightness/contrast/threshold are quick adjustments on existing baseline
   * - isProcessing state shows loading indicator during auto-prep
   */

  // Apply brightness/contrast/threshold adjustments when debounced values change
  useEffect(() => {
    if (baselineImageData) {
      applyAdjustments(debouncedBrightness, debouncedContrast, debouncedThreshold);

      // Only push to history if values differ from defaults (avoid pushing initial state after auto-prep)
      // Also skip history push when preset is 'auto' (auto-prep state)
      const hasNonDefaultAdjustments =
        debouncedBrightness !== DEFAULT_BRIGHTNESS ||
        debouncedContrast !== DEFAULT_CONTRAST ||
        (otsuThreshold !== null && debouncedThreshold !== otsuThreshold);

      const shouldPushToHistory = hasNonDefaultAdjustments && selectedPreset !== 'auto';

      // Check if state has actually changed from current history state to prevent duplicate pushes
      // This prevents re-pushing during undo/redo operations
      const stateHasChanged =
        !historyCurrentState ||
        historyCurrentState.brightness !== debouncedBrightness ||
        historyCurrentState.contrast !== debouncedContrast ||
        historyCurrentState.threshold !== debouncedThreshold ||
        historyCurrentState.preset !== selectedPreset;

      if (shouldPushToHistory && stateHasChanged) {
        // Push to history after applying adjustments (debounced)
        pushToHistory({
          brightness: debouncedBrightness,
          contrast: debouncedContrast,
          threshold: debouncedThreshold,
          preset: selectedPreset,
        });
      }
    }
  }, [
    debouncedBrightness,
    debouncedContrast,
    debouncedThreshold,
    baselineImageData,
    applyAdjustments,
    pushToHistory,
    selectedPreset,
    otsuThreshold,
    historyCurrentState,
  ]);

  // Update threshold slider when Otsu value is calculated
  useEffect(() => {
    if (otsuThreshold !== null) {
      setThreshold(otsuThreshold);
    }
  }, [otsuThreshold]);

  /**
   * Restore custom preset from localStorage after auto-prep completes
   *
   * When Otsu threshold is calculated (after auto-prep), check if there's a
   * saved custom preset in localStorage. If found, restore it automatically.
   *
   * This ensures user's custom adjustments persist across page reloads.
   *
   * Timing: Runs after otsuThreshold is set (after auto-prep completes)
   * Condition: Only runs once when preset is 'auto' (initial state)
   */
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    // Only restore on initial load, not after every auto-prep
    if (otsuThreshold !== null && selectedPreset === 'auto' && isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      const customPreset = loadCustomPreset();
      if (customPreset) {
        setBrightness(customPreset.brightness);
        setContrast(customPreset.contrast);
        setThreshold(otsuThreshold + customPreset.threshold);
        setSelectedPreset('custom');
      }
    }
  }, [otsuThreshold, selectedPreset]);

  // Re-run auto-prep when background removal settings change
  // Note: runAutoPrepAsync sets isProcessing=true, showing loading indicator
  useEffect(() => {
    if (uploadedImage && backgroundRemovalEnabled) {
      runAutoPrepAsync(uploadedImage, {
        removeBackground: backgroundRemovalEnabled,
        bgSensitivity: debouncedBgSensitivity,
      });
    }
  }, [uploadedImage, backgroundRemovalEnabled, debouncedBgSensitivity, runAutoPrepAsync]);

  /**
   * Handle preset selection change
   *
   * Applies the selected preset's adjustments to the sliders.
   * For Custom preset, loads saved values from localStorage with validation.
   */
  const handlePresetChange = useCallback(
    (preset: MaterialPresetName) => {
      const presetConfig = getPreset(preset);

      if (preset === 'custom') {
        // Load custom preset from localStorage with validation
        const customValues = loadCustomPreset();
        if (customValues) {
          setBrightness(customValues.brightness);
          setContrast(customValues.contrast);
          if (otsuThreshold !== null) {
            setThreshold(otsuThreshold + customValues.threshold);
          }
        }
      } else {
        // Apply preset adjustments
        setBrightness(presetConfig.adjustments.brightness);
        setContrast(presetConfig.adjustments.contrast);
        if (otsuThreshold !== null) {
          setThreshold(otsuThreshold + presetConfig.adjustments.threshold);
        }
      }

      setSelectedPreset(preset);
    },
    [otsuThreshold]
  );

  /**
   * Handle slider changes with auto-switch to Custom preset
   *
   * When user manually adjusts sliders, automatically switch to Custom preset.
   * The useCustomPresetPersistence hook handles saving to localStorage automatically
   * with debouncing, validation, and error handling.
   */
  const handleBrightnessChange = useCallback(
    (value: number) => {
      setBrightness(value);
      if (selectedPreset !== 'custom') {
        setSelectedPreset('custom');
      }
    },
    [selectedPreset]
  );

  const handleContrastChange = useCallback(
    (value: number) => {
      setContrast(value);
      if (selectedPreset !== 'custom') {
        setSelectedPreset('custom');
      }
    },
    [selectedPreset]
  );

  const handleThresholdChange = useCallback(
    (value: number) => {
      setThreshold(value);
      if (selectedPreset !== 'custom') {
        setSelectedPreset('custom');
      }
    },
    [selectedPreset]
  );

  // Handle Auto-Prep button click
  const handleAutoPrepClick = () => {
    if (uploadedImage) {
      runAutoPrepAsync(uploadedImage, {
        removeBackground: backgroundRemovalEnabled,
        bgSensitivity: backgroundRemovalSensitivity,
      });
      // Reset adjustments when running auto-prep
      setBrightness(DEFAULT_BRIGHTNESS);
      setContrast(DEFAULT_CONTRAST);
      setSelectedPreset('auto');
      // Clear undo/redo history
      clearHistory();
      // Prevent custom preset restoration after manual auto-prep
      isInitialLoadRef.current = false;
    }
  };

  /**
   * Handle reset button click
   *
   * Resets all refinement controls to their default values and re-runs
   * the auto-prep algorithm from scratch, discarding all manual adjustments.
   *
   * State flow:
   * 1. Reset brightness, contrast, threshold to defaults
   * 2. Disable background removal
   * 3. Reset background removal sensitivity
   * 4. Re-run auto-prep algorithm with default settings
   * 5. Threshold will be updated to new Otsu value via useEffect
   * 6. Clear undo/redo history
   */
  const handleReset = useCallback(() => {
    if (uploadedImage && otsuThreshold !== null) {
      // Reset all adjustment values to defaults
      setBrightness(DEFAULT_BRIGHTNESS);
      setContrast(DEFAULT_CONTRAST);
      setThreshold(otsuThreshold); // Reset to Otsu value
      setBackgroundRemovalEnabled(DEFAULT_BACKGROUND_REMOVAL_ENABLED);
      setBackgroundRemovalSensitivity(DEFAULT_BACKGROUND_REMOVAL_SENSITIVITY);
      setSelectedPreset('auto'); // Reset preset to Auto

      // Clear custom preset from localStorage with error handling
      clearCustomPreset();

      // Clear undo/redo history
      clearHistory();

      // Re-run auto-prep with default settings
      runAutoPrepAsync(uploadedImage, {
        removeBackground: DEFAULT_BACKGROUND_REMOVAL_ENABLED,
        bgSensitivity: DEFAULT_BACKGROUND_REMOVAL_SENSITIVITY,
      });
    }
  }, [uploadedImage, otsuThreshold, runAutoPrepAsync, clearHistory]);

  /**
   * Apply a history state to the current UI
   *
   * Shared logic for undo/redo operations to maintain DRY principle.
   * The history push effect will compare the new state with current history state
   * and skip pushing if they're the same, preventing duplicate pushes during undo/redo.
   */
  const applyHistoryState = useCallback(
    (state: {
      brightness: number;
      contrast: number;
      threshold: number;
      preset?: MaterialPresetName;
    }) => {
      setBrightness(state.brightness);
      setContrast(state.contrast);
      setThreshold(state.threshold);
      if (state.preset) {
        setSelectedPreset(state.preset);
      }
      applyAdjustments(state.brightness, state.contrast, state.threshold);
    },
    [applyAdjustments]
  );

  /**
   * Handle undo operation
   *
   * Restores previous state from history and re-applies adjustments.
   * If undoing to before first adjustment (no previous state), restore auto-prep defaults.
   */
  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (baselineImageData) {
      if (previousState) {
        // Apply the previous state from history
        applyHistoryState(previousState);
      } else {
        // No previous state means we've undone to before first adjustment
        // Restore to auto-prep defaults (brightness=0, contrast=0, threshold=otsuThreshold)
        if (otsuThreshold !== null) {
          const defaultState = {
            brightness: DEFAULT_BRIGHTNESS,
            contrast: DEFAULT_CONTRAST,
            threshold: otsuThreshold,
            preset: 'auto' as MaterialPresetName,
          };
          applyHistoryState(defaultState);
        }
      }
    }
  }, [undo, baselineImageData, applyHistoryState, otsuThreshold]);

  /**
   * Handle redo operation
   *
   * Restores next state from history and re-applies adjustments
   */
  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState && baselineImageData) {
      applyHistoryState(nextState);
    }
  }, [redo, baselineImageData, applyHistoryState]);

  /**
   * Keyboard shortcuts for undo/redo
   *
   * Ctrl+Z / Cmd+Z - Undo
   * Ctrl+Y / Cmd+Y - Redo
   *
   * Does not trigger when typing in text inputs to avoid conflicts
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in text-like inputs
      const target = event.target as HTMLElement;

      // Block for text areas and contenteditable elements
      if (target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // For input elements, only block text-like types
      if (target.tagName === 'INPUT') {
        const inputElement = target as HTMLInputElement;
        const textInputTypes = ['text', 'email', 'password', 'search', 'tel', 'url'];
        if (textInputTypes.includes(inputElement.type)) {
          return;
        }
        // Allow shortcuts for range, checkbox, radio, etc.
      }

      const isMac = isMacPlatform();
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      if (ctrlOrCmd && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) {
          handleUndo();
        }
      } else if (ctrlOrCmd && event.key === 'y') {
        event.preventDefault();
        if (canRedo) {
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canUndo, canRedo, handleUndo, handleRedo]);

  /**
   * Clear undo/redo history when new image is uploaded
   */
  useEffect(() => {
    if (uploadedImage) {
      clearHistory();
    }
  }, [uploadedImage, clearHistory]);

  return (
    <ErrorBoundary>
      <Layout onClearSettings={clearAllSettings}>
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Welcome to CraftyPrep</h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              Transform your images for laser engraving with our powerful image preparation tool.
            </p>
          </div>

          {/* File Upload - Pass all state and handlers as props */}
          <FileUploadComponent
            selectedFile={selectedFile}
            uploadedImage={uploadedImage}
            isLoading={isLoading}
            error={uploadError}
            info={info}
            progress={progress}
            handleFileSelect={handleFileSelect}
            clearError={clearError}
            clearInfo={clearInfo}
          />

          {/* Auto-Prep Button (shown after upload) */}
          {uploadedImage && (
            <div className="w-full max-w-2xl mx-auto px-4">
              <AutoPrepButton
                disabled={!uploadedImage || isProcessing}
                loading={isProcessing}
                onClick={handleAutoPrepClick}
              />
            </div>
          )}

          {/* Processing Error Display */}
          {processingError && (
            <div className="w-full max-w-2xl mx-auto px-4">
              <div
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
                role="alert"
                aria-live="assertive"
              >
                <p className="text-sm font-medium text-red-800">{processingError}</p>
              </div>
            </div>
          )}

          {/* Refinement Controls (shown after processing) */}
          {baselineImageData && (
            <div className="w-full max-w-2xl mx-auto px-4 space-y-6">
              <h3 className="text-xl font-semibold text-center">Refine Your Image</h3>
              <RefinementControls
                brightness={brightness}
                contrast={contrast}
                threshold={threshold}
                selectedPreset={selectedPreset}
                onPresetChange={handlePresetChange}
                backgroundRemovalEnabled={backgroundRemovalEnabled}
                backgroundRemovalSensitivity={backgroundRemovalSensitivity}
                onBrightnessChange={handleBrightnessChange}
                onContrastChange={handleContrastChange}
                onThresholdChange={handleThresholdChange}
                onBackgroundRemovalToggle={setBackgroundRemovalEnabled}
                onBackgroundRemovalSensitivityChange={setBackgroundRemovalSensitivity}
                onReset={handleReset}
                isResetting={isProcessing}
                disabled={isProcessing}
              />

              {/* Undo/Redo Buttons */}
              <div className="flex justify-center">
                <UndoRedoButtons
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                />
              </div>
            </div>
          )}

          {/* Image Preview (shown after upload or processing) */}
          {uploadedImage && (
            <div className="w-full max-w-6xl mx-auto px-4">
              <ImagePreview
                originalImage={uploadedImage}
                processedImage={processedImage}
                isLoading={shouldShowLoading}
              />
            </div>
          )}

          {/* Download Button (shown after processing) */}
          {processedImage && selectedFile && (
            <div className="w-full max-w-2xl mx-auto px-4">
              <DownloadButton
                canvas={processedCanvas}
                originalFilename={selectedFile.name}
                disabled={!processedCanvas}
              />
            </div>
          )}
        </div>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
