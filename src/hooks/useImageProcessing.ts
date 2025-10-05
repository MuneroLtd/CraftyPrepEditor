/**
 * @file useImageProcessing Hook
 * @description React hook for managing image processing pipeline state and execution
 *
 * Pipeline:
 * 1. Convert uploaded image to ImageData
 * 2. Apply grayscale conversion
 * 3. Apply histogram equalization (contrast enhancement)
 * 4. Calculate optimal threshold (Otsu's method)
 * 5. Apply binarization (threshold)
 * 6. Convert result back to HTMLImageElement
 *
 * Features:
 * - Async processing (non-blocking UI)
 * - Loading state management
 * - Error handling with user-friendly messages
 * - Memory cleanup (no leaks)
 * - Deterministic results (same input → same output)
 */

import { useState, useCallback } from 'react';
import {
  convertToGrayscale,
  applyHistogramEqualization,
  applyOtsuThreshold,
  applyBrightness,
  applyContrast,
  removeBackground,
} from '../lib/imageProcessing';

/**
 * Convert ImageData to HTMLImageElement via Canvas.
 *
 * @param imageData - Source ImageData to convert
 * @param errorMessage - Error message to use if conversion fails
 * @returns Promise resolving to HTMLImageElement and Canvas
 * @throws {Error} If canvas context unavailable or image load fails
 */
async function convertImageDataToImage(
  imageData: ImageData,
  errorMessage: string
): Promise<{ image: HTMLImageElement; canvas: HTMLCanvasElement }> {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Put ImageData on canvas
  ctx.putImageData(imageData, 0, 0);

  // Convert canvas to data URL
  const dataUrl = canvas.toDataURL('image/png');

  // Create HTMLImageElement from data URL
  const image = new Image();
  image.width = canvas.width;
  image.height = canvas.height;

  // Wait for image to load
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(errorMessage));
    image.src = dataUrl;
  });

  return { image, canvas };
}

export interface UseImageProcessingReturn {
  /** Processed image result (null until processing completes) */
  processedImage: HTMLImageElement | null;
  /** Processed image canvas (null until processing completes) - needed for download */
  processedCanvas: HTMLCanvasElement | null;
  /** Baseline ImageData after auto-prep (before adjustments) - used for re-processing */
  baselineImageData: ImageData | null;
  /** Whether processing is currently in progress */
  isProcessing: boolean;
  /** User-friendly error message (null if no error) */
  error: string | null;
  /** Trigger auto-prep processing pipeline */
  runAutoPrepAsync: (
    uploadedImage: HTMLImageElement,
    options?: {
      removeBackground?: boolean;
      bgSensitivity?: number;
    }
  ) => Promise<void>;
  /** Apply brightness/contrast/threshold adjustments to baseline */
  applyAdjustments: (brightness: number, contrast: number) => Promise<void>;
}

/**
 * Hook for managing image processing pipeline state.
 *
 * @returns Processing state and control function
 *
 * @example
 * ```tsx
 * const { processedImage, isProcessing, error, runAutoPrepAsync } = useImageProcessing();
 *
 * // Trigger processing
 * await runAutoPrepAsync(uploadedImage);
 *
 * // Display result
 * <ImagePreview originalImage={uploadedImage} processedImage={processedImage} />
 * ```
 */
export function useImageProcessing(): UseImageProcessingReturn {
  const [processedImage, setProcessedImage] = useState<HTMLImageElement | null>(null);
  const [processedCanvas, setProcessedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [baselineImageData, setBaselineImageData] = useState<ImageData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute the complete auto-prep pipeline on the given image.
   *
   * Pipeline steps:
   * 1. HTMLImageElement → Canvas → ImageData
   * 2. Grayscale conversion
   * 3. Background removal (optional, if enabled)
   * 4. Histogram equalization (preserves alpha if background removed)
   * 5. Otsu threshold calculation and application
   * 6. ImageData → Canvas → data URL → HTMLImageElement
   *
   * @param uploadedImage - Source image to process
   * @param options - Processing options
   * @param options.removeBackground - Whether to remove background
   * @param options.bgSensitivity - Background removal sensitivity (0-255)
   */
  const runAutoPrepAsync = useCallback(
    async (
      uploadedImage: HTMLImageElement,
      options?: {
        removeBackground?: boolean;
        bgSensitivity?: number;
      }
    ) => {
      // Reset state
      setIsProcessing(true);
      setError(null);

      try {
        // Step 1: Convert HTMLImageElement to ImageData
        const canvas = document.createElement('canvas');
        canvas.width = uploadedImage.width;
        canvas.height = uploadedImage.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Draw image to canvas
        ctx.drawImage(uploadedImage, 0, 0);

        // Extract ImageData
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Step 2: Apply grayscale conversion
        imageData = convertToGrayscale(imageData);

        // Step 3: Apply background removal (if enabled)
        const hasBackgroundRemoval = options?.removeBackground ?? false;
        if (hasBackgroundRemoval) {
          const sensitivity = options?.bgSensitivity ?? 128;
          imageData = removeBackground(imageData, sensitivity);
        }

        // Step 4: Apply histogram equalization (preserve alpha if background removed)
        imageData = applyHistogramEqualization(imageData, hasBackgroundRemoval);

        // Step 5: Apply Otsu's method (calculates optimal threshold and applies binarization)
        imageData = applyOtsuThreshold(imageData);

        // Store baseline ImageData for adjustments (brightness, contrast, threshold)
        // Clone ImageData to prevent mutation
        const baseline = new ImageData(
          new Uint8ClampedArray(imageData.data),
          imageData.width,
          imageData.height
        );
        setBaselineImageData(baseline);

        // Step 6: Convert ImageData back to HTMLImageElement
        const { image: resultImage, canvas: resultCanvas } = await convertImageDataToImage(
          imageData,
          'Failed to load processed image'
        );

        // Update state with processed image and canvas
        setProcessedImage(resultImage);
        setProcessedCanvas(resultCanvas);
        setIsProcessing(false);
      } catch (err) {
        // Log technical error to console for debugging
        console.error('Image processing failed:', err);

        // Set user-friendly error message
        setError(
          'Unable to process image. The image may be corrupted or in an unsupported format. Please try a different image.'
        );
        setIsProcessing(false);
        setProcessedImage(null);
        setProcessedCanvas(null);
        setBaselineImageData(null);
      }
    },
    // Empty deps: only uses setState functions (stable by React design) and pure functions
    // No external state or props are captured, so no stale closure risk
    []
  );

  /**
   * Apply adjustments (brightness, contrast, threshold) to the baseline ImageData.
   *
   * This allows users to refine the auto-prep result without re-running the entire pipeline.
   * Adjustments are applied to the stored baseline for efficiency.
   *
   * @param brightness - Brightness adjustment (-100 to +100, 0 = no change)
   * @param contrast - Contrast adjustment (-100 to +100, 0 = no change)
   */
  const applyAdjustments = useCallback(
    async (brightness: number, contrast: number) => {
      // Validate baseline exists
      if (!baselineImageData) {
        console.warn('Cannot apply adjustments: no baseline ImageData available');
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Clone baseline to prevent mutation
        let adjustedData = new ImageData(
          new Uint8ClampedArray(baselineImageData.data),
          baselineImageData.width,
          baselineImageData.height
        );

        // Apply brightness adjustment (if not zero)
        if (brightness !== 0) {
          adjustedData = applyBrightness(adjustedData, brightness);
        }

        // Apply contrast adjustment (if not zero)
        if (contrast !== 0) {
          adjustedData = applyContrast(adjustedData, contrast);
        }

        // Convert ImageData to HTMLImageElement
        const { image: resultImage, canvas: resultCanvas } = await convertImageDataToImage(
          adjustedData,
          'Failed to load adjusted image'
        );

        // Update state with adjusted image
        setProcessedImage(resultImage);
        setProcessedCanvas(resultCanvas);
        setIsProcessing(false);
      } catch (err) {
        console.error('Adjustment processing failed:', err);

        setError('Unable to apply adjustments. Please try again or reset to auto-prep result.');
        setIsProcessing(false);
      }
    },
    [baselineImageData]
  );

  return {
    processedImage,
    processedCanvas,
    baselineImageData,
    isProcessing,
    error,
    runAutoPrepAsync,
    applyAdjustments,
  };
}
