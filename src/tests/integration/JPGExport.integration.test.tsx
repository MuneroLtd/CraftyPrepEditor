import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useImageDownload } from '@/hooks/useImageDownload';

/**
 * Integration tests for JPG export functionality
 *
 * These tests verify the complete flow from hook to download with JPG format.
 * Full component integration is tested via E2E tests.
 */
describe('JPG Export Integration', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockBlob: Blob;
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let appendChildSpy: ReturnType<typeof vi.spyOn>;
  let removeChildSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockBlob = new Blob(['fake image'], { type: 'image/jpeg' });
    mockCanvas = {
      toBlob: vi.fn((callback, type, quality) => {
        setTimeout(() => callback(mockBlob), 0);
      }),
    } as unknown as HTMLCanvasElement;

    // Setup spies
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exports image as JPG with correct MIME type and quality', async () => {
    const { result } = renderHook(() => useImageDownload());

    await act(async () => {
      await result.current.downloadImage(mockCanvas, 'photo.png', 'jpeg');
    });

    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/jpeg',
      0.95
    );
  });

  it('generates correct JPG filename from original PNG filename', async () => {
    let capturedAnchor: HTMLAnchorElement | null = null;

    appendChildSpy.mockImplementation((node) => {
      if (node instanceof HTMLAnchorElement) {
        capturedAnchor = node;
      }
      return node;
    });

    const { result } = renderHook(() => useImageDownload());

    await act(async () => {
      await result.current.downloadImage(mockCanvas, 'my-photo.png', 'jpeg');
    });

    await waitFor(() => {
      expect(capturedAnchor).not.toBeNull();
      expect(capturedAnchor?.download).toBe('my-photo_laserprep.jpg');
    });
  });
});
