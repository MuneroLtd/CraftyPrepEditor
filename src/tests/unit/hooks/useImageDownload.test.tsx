import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useImageDownload } from '@/hooks/useImageDownload';

describe('useImageDownload', () => {
  // Mock canvas element
  let mockCanvas: HTMLCanvasElement;
  let mockBlob: Blob;

  // Mock DOM methods - using any to avoid complex Vitest type issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let createObjectURLSpy: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let revokeObjectURLSpy: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let appendChildSpy: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let removeChildSpy: any;

  beforeEach(() => {
    // Create mock blob
    mockBlob = new Blob(['fake image data'], { type: 'image/png' });

    // Create mock canvas
    mockCanvas = {
      toBlob: vi.fn((callback: BlobCallback) => {
        // Simulate async blob creation
        setTimeout(() => callback(mockBlob), 0);
      }),
    } as unknown as HTMLCanvasElement;

    // Mock URL.createObjectURL and URL.revokeObjectURL
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    // Mock document.body methods
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('downloadImage', () => {
    it('creates blob from canvas successfully', async () => {
      const { result } = renderHook(() => useImageDownload());

      await act(async () => {
        await result.current.downloadImage(mockCanvas, 'test-photo.jpg');
      });

      expect(mockCanvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');
    });

    it('generates correct filename with _laserprep.png suffix', async () => {
      const { result } = renderHook(() => useImageDownload());
      let capturedAnchor: HTMLAnchorElement | null = null;

      // Capture the anchor element when it's appended
      appendChildSpy.mockImplementation((node: Node) => {
        if (node instanceof HTMLAnchorElement) {
          capturedAnchor = node;
        }
        return node;
      });

      await act(async () => {
        await result.current.downloadImage(mockCanvas, 'my-photo.jpg');
      });

      await waitFor(() => {
        expect(capturedAnchor).not.toBeNull();
        expect(capturedAnchor?.download).toBe('my-photo_laserprep.png');
      });
    });

    it('sanitizes filename during generation', async () => {
      const { result } = renderHook(() => useImageDownload());
      let capturedAnchor: HTMLAnchorElement | null = null;

      appendChildSpy.mockImplementation((node: Node) => {
        if (node instanceof HTMLAnchorElement) {
          capturedAnchor = node;
        }
        return node;
      });

      await act(async () => {
        await result.current.downloadImage(mockCanvas, 'photo/test?.jpg');
      });

      await waitFor(() => {
        expect(capturedAnchor).not.toBeNull();
        expect(capturedAnchor?.download).toBe('photo_test__laserprep.png');
      });
    });

    it('handles filenames without extensions', async () => {
      const { result } = renderHook(() => useImageDownload());
      let capturedAnchor: HTMLAnchorElement | null = null;

      appendChildSpy.mockImplementation((node: Node) => {
        if (node instanceof HTMLAnchorElement) {
          capturedAnchor = node;
        }
        return node;
      });

      await act(async () => {
        await result.current.downloadImage(mockCanvas, 'photo');
      });

      await waitFor(() => {
        expect(capturedAnchor).not.toBeNull();
        expect(capturedAnchor?.download).toBe('photo_laserprep.png');
      });
    });

    it('handles filenames with multiple dots', async () => {
      const { result } = renderHook(() => useImageDownload());
      let capturedAnchor: HTMLAnchorElement | null = null;

      appendChildSpy.mockImplementation((node: Node) => {
        if (node instanceof HTMLAnchorElement) {
          capturedAnchor = node;
        }
        return node;
      });

      await act(async () => {
        await result.current.downloadImage(mockCanvas, 'my.photo.backup.2024.jpg');
      });

      await waitFor(() => {
        expect(capturedAnchor).not.toBeNull();
        expect(capturedAnchor?.download).toBe('my.photo.backup.2024_laserprep.png');
      });
    });

    it('triggers download via anchor element', async () => {
      const { result } = renderHook(() => useImageDownload());

      // Mock click method
      const clickSpy = vi.fn();
      appendChildSpy.mockImplementation((node: Node) => {
        if (node instanceof HTMLAnchorElement) {
          node.click = clickSpy;
        }
        return node;
      });

      await act(async () => {
        await result.current.downloadImage(mockCanvas, 'test.jpg');
      });

      await waitFor(() => {
        expect(clickSpy).toHaveBeenCalled();
      });
    });

    it('creates blob URL for download', async () => {
      const { result } = renderHook(() => useImageDownload());

      await act(async () => {
        await result.current.downloadImage(mockCanvas, 'test.jpg');
      });

      await waitFor(() => {
        expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
      });
    });

    it('cleans up blob URL after download', async () => {
      const { result } = renderHook(() => useImageDownload());

      await act(async () => {
        await result.current.downloadImage(mockCanvas, 'test.jpg');
      });

      await waitFor(() => {
        expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
      });
    });

    it('removes anchor element from DOM after download', async () => {
      const { result } = renderHook(() => useImageDownload());

      await act(async () => {
        await result.current.downloadImage(mockCanvas, 'test.jpg');
      });

      await waitFor(() => {
        expect(removeChildSpy).toHaveBeenCalled();
      });
    });

    it('handles null canvas gracefully', async () => {
      const { result } = renderHook(() => useImageDownload());

      await act(async () => {
        await result.current.downloadImage(null, 'test.jpg');
      });

      expect(result.current.error).toBe('No image to download');
      expect(mockCanvas.toBlob).not.toHaveBeenCalled();
    });

    it('handles blob creation failure', async () => {
      const { result } = renderHook(() => useImageDownload());

      // Mock toBlob to return null
      const failingCanvas = {
        toBlob: vi.fn((callback: BlobCallback) => {
          setTimeout(() => callback(null), 0);
        }),
      } as unknown as HTMLCanvasElement;

      await act(async () => {
        await result.current.downloadImage(failingCanvas, 'test.jpg');
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to create image blob');
      });
    });
  });

  describe('isDownloading state', () => {
    it('sets isDownloading to true during download', async () => {
      const { result } = renderHook(() => useImageDownload());

      expect(result.current.isDownloading).toBe(false);

      act(() => {
        result.current.downloadImage(mockCanvas, 'test.jpg');
      });

      expect(result.current.isDownloading).toBe(true);

      await waitFor(() => {
        expect(result.current.isDownloading).toBe(false);
      });
    });

    it('sets isDownloading back to false after successful download', async () => {
      const { result } = renderHook(() => useImageDownload());

      await act(async () => {
        await result.current.downloadImage(mockCanvas, 'test.jpg');
      });

      expect(result.current.isDownloading).toBe(false);
    });

    it('sets isDownloading back to false after error', async () => {
      const { result } = renderHook(() => useImageDownload());

      await act(async () => {
        await result.current.downloadImage(null, 'test.jpg');
      });

      expect(result.current.isDownloading).toBe(false);
    });
  });

  describe('error state', () => {
    it('initializes with null error', () => {
      const { result } = renderHook(() => useImageDownload());
      expect(result.current.error).toBeNull();
    });

    it('clears error on successful download', async () => {
      const { result } = renderHook(() => useImageDownload());

      // First trigger an error
      await act(async () => {
        await result.current.downloadImage(null, 'test.jpg');
      });
      expect(result.current.error).toBe('No image to download');

      // Then trigger successful download
      await act(async () => {
        await result.current.downloadImage(mockCanvas, 'test.jpg');
      });

      expect(result.current.error).toBeNull();
    });

    it('sets error when canvas is null', async () => {
      const { result } = renderHook(() => useImageDownload());

      await act(async () => {
        await result.current.downloadImage(null, 'test.jpg');
      });

      expect(result.current.error).toBe('No image to download');
    });

    it('sets error when blob creation fails', async () => {
      const { result } = renderHook(() => useImageDownload());

      const failingCanvas = {
        toBlob: vi.fn((callback: BlobCallback) => {
          setTimeout(() => callback(null), 0);
        }),
      } as unknown as HTMLCanvasElement;

      await act(async () => {
        await result.current.downloadImage(failingCanvas, 'test.jpg');
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to create image blob');
      });
    });
  });
});
