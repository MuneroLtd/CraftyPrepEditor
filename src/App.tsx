import { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import { FileUploadComponent } from './components/FileUploadComponent';
import { AutoPrepButton } from './components/AutoPrepButton';
import { ImagePreview } from './components/ImagePreview';
import { DownloadButton } from './components/DownloadButton';
import { BrightnessSlider } from './components/BrightnessSlider';
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
    isProcessing,
    error: processingError,
    runAutoPrepAsync,
    applyAdjustments,
  } = useImageProcessing();

  // Brightness adjustment state
  const [brightness, setBrightness] = useState(0);
  const debouncedBrightness = useDebounce(brightness, 100);

  // Apply brightness adjustment when debounced value changes
  useEffect(() => {
    if (baselineImageData) {
      applyAdjustments(debouncedBrightness);
    }
  }, [debouncedBrightness, baselineImageData, applyAdjustments]);

  // Handle Auto-Prep button click
  const handleAutoPrepClick = () => {
    if (uploadedImage) {
      runAutoPrepAsync(uploadedImage);
      // Reset brightness when running auto-prep
      setBrightness(0);
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
              <BrightnessSlider
                value={brightness}
                onChange={setBrightness}
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
