import { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import { FileUploadComponent } from './components/FileUploadComponent';
import { AutoPrepButton } from './components/AutoPrepButton';
import { ImagePreview } from './components/ImagePreview';
import { DownloadButton } from './components/DownloadButton';
import { RefinementControls } from './components/RefinementControls';
import { useImageProcessing } from './hooks/useImageProcessing';
import { useFileUpload } from './hooks/useFileUpload';
import { useDebounce } from './hooks/useDebounce';

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

  // Adjustment states
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [threshold, setThreshold] = useState(128);
  const debouncedBrightness = useDebounce(brightness, 100);
  const debouncedContrast = useDebounce(contrast, 100);
  const debouncedThreshold = useDebounce(threshold, 100);

  // Background removal state
  const [backgroundRemovalEnabled, setBackgroundRemovalEnabled] = useState(false);
  const [backgroundRemovalSensitivity, setBackgroundRemovalSensitivity] = useState(128);
  const debouncedBgSensitivity = useDebounce(backgroundRemovalSensitivity, 100);

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
    }
  }, [
    debouncedBrightness,
    debouncedContrast,
    debouncedThreshold,
    baselineImageData,
    applyAdjustments,
  ]);

  // Update threshold slider when Otsu value is calculated
  useEffect(() => {
    if (otsuThreshold !== null) {
      setThreshold(otsuThreshold);
    }
  }, [otsuThreshold]);

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

  // Handle Auto-Prep button click
  const handleAutoPrepClick = () => {
    if (uploadedImage) {
      runAutoPrepAsync(uploadedImage, {
        removeBackground: backgroundRemovalEnabled,
        bgSensitivity: backgroundRemovalSensitivity,
      });
      // Reset adjustments when running auto-prep
      setBrightness(0);
      setContrast(0);
    }
  };

  return (
    <ErrorBoundary>
      <Layout>
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Welcome to CraftyPrep</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                backgroundRemovalEnabled={backgroundRemovalEnabled}
                backgroundRemovalSensitivity={backgroundRemovalSensitivity}
                onBrightnessChange={setBrightness}
                onContrastChange={setContrast}
                onThresholdChange={setThreshold}
                onBackgroundRemovalToggle={setBackgroundRemovalEnabled}
                onBackgroundRemovalSensitivityChange={setBackgroundRemovalSensitivity}
                disabled={isProcessing}
              />
            </div>
          )}

          {/* Image Preview (shown after upload or processing) */}
          {uploadedImage && (
            <div className="w-full max-w-6xl mx-auto px-4">
              <ImagePreview originalImage={uploadedImage} processedImage={processedImage} />
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
