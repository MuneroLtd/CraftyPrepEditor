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
  calculateOptimalThreshold,
  applyOtsuThreshold,
} from '../lib/imageProcessing';

export interface UseImageProcessingReturn {
  /** Processed image result (null until processing completes) */
  processedImage: HTMLImageElement | null;
  /** Whether processing is currently in progress */
  isProcessing: boolean;
  /** User-friendly error message (null if no error) */
  error: string | null;
  /** Trigger auto-prep processing pipeline */
  runAutoPrepAsync: (uploadedImage: HTMLImageElement) => Promise<void>;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute the complete auto-prep pipeline on the given image.
   *
   * Pipeline steps:
   * 1. HTMLImageElement → Canvas → ImageData
   * 2. Grayscale conversion
   * 3. Histogram equalization
   * 4. Otsu threshold calculation
   * 5. Threshold application (binarization)
   * 6. ImageData → Canvas → data URL → HTMLImageElement
   *
   * @param uploadedImage - Source image to process
   */
  const runAutoPrepAsync = useCallback(async (uploadedImage: HTMLImageElement) => {
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

      // Step 3: Apply histogram equalization (contrast enhancement)
      imageData = applyHistogramEqualization(imageData);

      // Step 4: Apply Otsu's method (calculates optimal threshold and applies binarization)
      imageData = applyOtsuThreshold(imageData);

      // Step 6: Convert ImageData back to HTMLImageElement
      // Put processed data back on canvas
      ctx.putImageData(imageData, 0, 0);

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');

      // Create new HTMLImageElement from data URL
      const resultImage = new Image();
      resultImage.width = canvas.width;
      resultImage.height = canvas.height;

      // Wait for image to load before setting state
      await new Promise<void>((resolve, reject) => {
        resultImage.onload = () => resolve();
        resultImage.onerror = () => reject(new Error('Failed to load processed image'));
        resultImage.src = dataUrl;
      });

      // Update state with processed image
      setProcessedImage(resultImage);
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
    }
  }, []);

  return {
    processedImage,
    isProcessing,
    error,
    runAutoPrepAsync,
  };
}
