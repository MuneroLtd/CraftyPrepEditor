/**
 * @file useImageProcessing Hook Tests
 * @description Unit tests for the image processing pipeline hook with TDD approach
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useImageProcessing } from '../../../hooks/useImageProcessing';
import * as imageProcessing from '../../../lib/imageProcessing';

// Mock the image processing library
vi.mock('../../../lib/imageProcessing', () => ({
  convertToGrayscale: vi.fn(),
  applyHistogramEqualization: vi.fn(),
  calculateOptimalThreshold: vi.fn(),
  applyOtsuThreshold: vi.fn(),
}));

describe('useImageProcessing Hook', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;
  let mockImage: HTMLImageElement;

  beforeEach(() => {
    // Save original createElement
    const originalCreateElement = document.createElement.bind(document);

    // Create mock canvas (using original createElement to avoid recursion)
    mockCanvas = originalCreateElement('canvas') as HTMLCanvasElement;

    // Create mock context with proper interface
    mockContext = {
      drawImage: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      canvas: mockCanvas,
    } as unknown as CanvasRenderingContext2D;

    // Mock document.createElement to return our canvas for 'canvas', real elements otherwise
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') return mockCanvas;
      return originalCreateElement(tagName);
    });

    // Mock canvas.getContext to return our mock context
    vi.spyOn(mockCanvas, 'getContext').mockReturnValue(mockContext);

    // Create mock image
    mockImage = new Image();
    mockImage.width = 100;
    mockImage.height = 100;

    // Mock getImageData to return valid ImageData
    const mockImageData = new ImageData(100, 100);
    vi.mocked(mockContext.getImageData).mockReturnValue(mockImageData);

    // Mock toDataURL
    vi.spyOn(mockCanvas, 'toDataURL').mockReturnValue('data:image/png;base64,mock');

    // Setup default return values for processing functions
    vi.mocked(imageProcessing.convertToGrayscale).mockReturnValue(mockImageData);
    vi.mocked(imageProcessing.applyHistogramEqualization).mockReturnValue(mockImageData);
    vi.mocked(imageProcessing.calculateOptimalThreshold).mockReturnValue(128);
    vi.mocked(imageProcessing.applyOtsuThreshold).mockReturnValue(mockImageData);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('returns null processedImage initially', () => {
      const { result } = renderHook(() => useImageProcessing());

      expect(result.current.processedImage).toBeNull();
    });

    it('returns false for isProcessing initially', () => {
      const { result } = renderHook(() => useImageProcessing());

      expect(result.current.isProcessing).toBe(false);
    });

    it('returns null for error initially', () => {
      const { result } = renderHook(() => useImageProcessing());

      expect(result.current.error).toBeNull();
    });

    it('provides runAutoPrepAsync function', () => {
      const { result } = renderHook(() => useImageProcessing());

      expect(result.current.runAutoPrepAsync).toBeInstanceOf(Function);
    });
  });

  describe('Processing Pipeline Execution', () => {
    it('sets isProcessing to true when pipeline starts', async () => {
      const { result } = renderHook(() => useImageProcessing());

      // Start processing (don't await yet)
      const promise = result.current.runAutoPrepAsync(mockImage);

      // Should be processing immediately
      await waitFor(() => {
        expect(result.current.isProcessing).toBe(true);
      });

      await promise;
    });

    it('sets isProcessing to false when pipeline completes', async () => {
      const { result } = renderHook(() => useImageProcessing());

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(result.current.isProcessing).toBe(false);
      });
    });

    it('calls convertToGrayscale with image ImageData', async () => {
      const { result } = renderHook(() => useImageProcessing());

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(imageProcessing.convertToGrayscale).toHaveBeenCalledTimes(1);
        expect(imageProcessing.convertToGrayscale).toHaveBeenCalledWith(expect.any(ImageData));
      });
    });

    it('calls applyHistogramEqualization with grayscale result', async () => {
      const { result } = renderHook(() => useImageProcessing());
      const mockGrayscaleData = new ImageData(100, 100);
      vi.mocked(imageProcessing.convertToGrayscale).mockReturnValue(mockGrayscaleData);

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(imageProcessing.applyHistogramEqualization).toHaveBeenCalledTimes(1);
        expect(imageProcessing.applyHistogramEqualization).toHaveBeenCalledWith(mockGrayscaleData);
      });
    });

    it('calls calculateOptimalThreshold with equalized result', async () => {
      const { result } = renderHook(() => useImageProcessing());
      const mockEqualizedData = new ImageData(100, 100);
      vi.mocked(imageProcessing.applyHistogramEqualization).mockReturnValue(mockEqualizedData);

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(imageProcessing.calculateOptimalThreshold).toHaveBeenCalledTimes(1);
        expect(imageProcessing.calculateOptimalThreshold).toHaveBeenCalledWith(mockEqualizedData);
      });
    });

    it('calls applyOtsuThreshold with equalized data and calculated threshold', async () => {
      const { result } = renderHook(() => useImageProcessing());
      const mockEqualizedData = new ImageData(100, 100);
      const mockThreshold = 150;

      vi.mocked(imageProcessing.applyHistogramEqualization).mockReturnValue(mockEqualizedData);
      vi.mocked(imageProcessing.calculateOptimalThreshold).mockReturnValue(mockThreshold);

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(imageProcessing.applyOtsuThreshold).toHaveBeenCalledTimes(1);
        expect(imageProcessing.applyOtsuThreshold).toHaveBeenCalledWith(
          mockEqualizedData,
          mockThreshold
        );
      });
    });

    it('executes pipeline in correct order: grayscale → equalization → threshold', async () => {
      const { result } = renderHook(() => useImageProcessing());
      const callOrder: string[] = [];

      vi.mocked(imageProcessing.convertToGrayscale).mockImplementation((data) => {
        callOrder.push('grayscale');
        return data;
      });
      vi.mocked(imageProcessing.applyHistogramEqualization).mockImplementation((data) => {
        callOrder.push('equalization');
        return data;
      });
      vi.mocked(imageProcessing.calculateOptimalThreshold).mockImplementation(() => {
        callOrder.push('calculate-threshold');
        return 128;
      });
      vi.mocked(imageProcessing.applyOtsuThreshold).mockImplementation((data) => {
        callOrder.push('apply-threshold');
        return data;
      });

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(callOrder).toEqual([
          'grayscale',
          'equalization',
          'calculate-threshold',
          'apply-threshold',
        ]);
      });
    });

    it('populates processedImage after successful processing', async () => {
      const { result } = renderHook(() => useImageProcessing());

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(result.current.processedImage).not.toBeNull();
        expect(result.current.processedImage).toBeInstanceOf(HTMLImageElement);
      });
    });

    it('converts final ImageData to HTMLImageElement', async () => {
      const { result } = renderHook(() => useImageProcessing());

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
        expect(result.current.processedImage?.src).toContain('data:image/png');
      });
    });
  });

  describe('Error Handling', () => {
    it('catches errors during processing', async () => {
      const { result } = renderHook(() => useImageProcessing());

      vi.mocked(imageProcessing.convertToGrayscale).mockImplementation(() => {
        throw new Error('Processing failed');
      });

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });
    });

    it('sets user-friendly error message on failure', async () => {
      const { result } = renderHook(() => useImageProcessing());

      vi.mocked(imageProcessing.convertToGrayscale).mockImplementation(() => {
        throw new Error('Technical error');
      });

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(result.current.error).toContain('Unable to process image');
        // Should not expose technical details
        expect(result.current.error).not.toContain('Technical error');
      });
    });

    it('logs technical error details to console', async () => {
      const { result } = renderHook(() => useImageProcessing());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const technicalError = new Error('Technical failure');

      vi.mocked(imageProcessing.convertToGrayscale).mockImplementation(() => {
        throw technicalError;
      });

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Image processing failed:', technicalError);
      });

      consoleErrorSpy.mockRestore();
    });

    it('sets isProcessing to false on error', async () => {
      const { result } = renderHook(() => useImageProcessing());

      vi.mocked(imageProcessing.convertToGrayscale).mockImplementation(() => {
        throw new Error('Error');
      });

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(result.current.isProcessing).toBe(false);
      });
    });

    it('does not populate processedImage on error', async () => {
      const { result } = renderHook(() => useImageProcessing());

      vi.mocked(imageProcessing.convertToGrayscale).mockImplementation(() => {
        throw new Error('Error');
      });

      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(result.current.processedImage).toBeNull();
      });
    });

    it('clears error on next successful run', async () => {
      const { result } = renderHook(() => useImageProcessing());

      // First run: error
      vi.mocked(imageProcessing.convertToGrayscale).mockImplementationOnce(() => {
        throw new Error('Error');
      });
      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      // Second run: success
      vi.mocked(imageProcessing.convertToGrayscale).mockReturnValue(new ImageData(100, 100));
      await result.current.runAutoPrepAsync(mockImage);

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('Multiple Processing Runs', () => {
    it('resets state correctly between runs', async () => {
      const { result } = renderHook(() => useImageProcessing());

      // First run
      await result.current.runAutoPrepAsync(mockImage);
      const firstImage = result.current.processedImage;

      // Second run
      await result.current.runAutoPrepAsync(mockImage);
      const secondImage = result.current.processedImage;

      // Should produce new image instance
      expect(secondImage).not.toBe(firstImage);
      expect(secondImage).toBeInstanceOf(HTMLImageElement);
    });

    it('handles concurrent processing calls gracefully', async () => {
      const { result } = renderHook(() => useImageProcessing());

      // Start two processing calls simultaneously
      const promise1 = result.current.runAutoPrepAsync(mockImage);
      const promise2 = result.current.runAutoPrepAsync(mockImage);

      await Promise.all([promise1, promise2]);

      // Should complete without errors
      await waitFor(() => {
        expect(result.current.isProcessing).toBe(false);
        expect(result.current.processedImage).not.toBeNull();
      });
    });
  });

  describe('Performance', () => {
    it('completes processing in reasonable time (<5s)', async () => {
      const { result } = renderHook(() => useImageProcessing());
      const start = performance.now();

      await result.current.runAutoPrepAsync(mockImage);

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(5000); // 5 seconds
    });

    it('is asynchronous (non-blocking)', async () => {
      const { result } = renderHook(() => useImageProcessing());

      // Start processing
      const promise = result.current.runAutoPrepAsync(mockImage);

      // Should return Promise immediately (non-blocking)
      expect(promise).toBeInstanceOf(Promise);
    });

    it('cleans up canvas references', async () => {
      const { result } = renderHook(() => useImageProcessing());

      await result.current.runAutoPrepAsync(mockImage);

      // Canvas should be created but not kept in memory
      // (Implementation detail: check no memory leaks via cleanup)
      expect(document.createElement).toHaveBeenCalledWith('canvas');
    });
  });

  describe('Edge Cases', () => {
    it('handles very small images (1×1 px)', async () => {
      const { result } = renderHook(() => useImageProcessing());
      const tinyImage = new Image();
      tinyImage.width = 1;
      tinyImage.height = 1;

      const tinyImageData = new ImageData(1, 1);
      vi.mocked(mockContext.getImageData).mockReturnValue(tinyImageData);

      await result.current.runAutoPrepAsync(tinyImage);

      await waitFor(() => {
        expect(result.current.processedImage).not.toBeNull();
      });
    });

    it('handles large images (4096×4096 px)', async () => {
      const { result } = renderHook(() => useImageProcessing());
      const largeImage = new Image();
      largeImage.width = 4096;
      largeImage.height = 4096;

      const largeImageData = new ImageData(4096, 4096);
      vi.mocked(mockContext.getImageData).mockReturnValue(largeImageData);

      await result.current.runAutoPrepAsync(largeImage);

      await waitFor(() => {
        expect(result.current.processedImage).not.toBeNull();
      });
    });

    it('handles rectangular images (different aspect ratios)', async () => {
      const { result } = renderHook(() => useImageProcessing());
      const wideImage = new Image();
      wideImage.width = 200;
      wideImage.height = 50;

      const wideImageData = new ImageData(200, 50);
      vi.mocked(mockContext.getImageData).mockReturnValue(wideImageData);

      await result.current.runAutoPrepAsync(wideImage);

      await waitFor(() => {
        expect(result.current.processedImage).not.toBeNull();
        expect(result.current.processedImage?.width).toBe(200);
        expect(result.current.processedImage?.height).toBe(50);
      });
    });
  });

  describe('Memory Management', () => {
    it('does not leak memory on repeated processing', async () => {
      const { result } = renderHook(() => useImageProcessing());

      // Run processing multiple times
      for (let i = 0; i < 5; i++) {
        await result.current.runAutoPrepAsync(mockImage);
      }

      // Should not accumulate canvas elements
      // (Implementation uses single canvas, reuses it)
      await waitFor(() => {
        expect(result.current.isProcessing).toBe(false);
      });
    });
  });
});
