import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileUpload } from '@/hooks/useFileUpload';

describe('useFileUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFileUpload());

    expect(result.current.selectedFile).toBeNull();
    expect(result.current.uploadedImage).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.progress).toBe(0);
  });

  it('should handle successful file selection', async () => {
    const { result } = renderHook(() => useFileUpload());

    const blob = new Blob(['fake-image'], { type: 'image/jpeg' });
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    // Mock Image
    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') setTimeout(() => handler(), 0);
      }),
      removeEventListener: vi.fn(),
      src: '',
      naturalWidth: 800,
      naturalHeight: 600,
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    await act(async () => {
      await result.current.handleFileSelect(file);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.selectedFile).toBe(file);
    expect(result.current.uploadedImage).toBeDefined();
    expect(result.current.uploadedImage?.naturalWidth).toBe(800);
    expect(result.current.error).toBeNull();
  });

  it('should handle file validation error', async () => {
    const { result } = renderHook(() => useFileUpload());

    const file = new File(['test'], 'document.pdf', { type: 'application/pdf' });

    await act(async () => {
      await result.current.handleFileSelect(file);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.selectedFile).toBeNull();
    expect(result.current.uploadedImage).toBeNull();
    expect(result.current.error).toBe(
      'Unsupported file type. Please upload JPG, PNG, GIF, or BMP.'
    );
  });

  it('should show loading state during validation', async () => {
    const { result } = renderHook(() => useFileUpload());

    const blob = new Blob(['fake-image'], { type: 'image/jpeg' });
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') setTimeout(() => handler(), 50); // Delay to test loading state
      }),
      removeEventListener: vi.fn(),
      src: '',
      naturalWidth: 800,
      naturalHeight: 600,
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    // Start the upload
    act(() => {
      result.current.handleFileSelect(file);
    });

    // Check loading state immediately after starting
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    // Wait for completion
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should clear error when clearError is called', async () => {
    const { result } = renderHook(() => useFileUpload());

    const file = new File(['test'], 'invalid.pdf', { type: 'application/pdf' });

    await act(async () => {
      await result.current.handleFileSelect(file);
    });

    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should reset upload state when resetUpload is called', async () => {
    const { result } = renderHook(() => useFileUpload());

    const blob = new Blob(['fake-image'], { type: 'image/jpeg' });
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') setTimeout(() => handler(), 0);
      }),
      removeEventListener: vi.fn(),
      src: '',
      naturalWidth: 800,
      naturalHeight: 600,
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    await act(async () => {
      await result.current.handleFileSelect(file);
    });

    await waitFor(() => {
      expect(result.current.selectedFile).toBeTruthy();
    });

    act(() => {
      result.current.resetUpload();
    });

    expect(result.current.selectedFile).toBeNull();
    expect(result.current.uploadedImage).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.progress).toBe(0);
  });

  it('should track progress for large files', async () => {
    const { result } = renderHook(() => useFileUpload());

    // Create a file > 2MB
    const largeData = new ArrayBuffer(3 * 1024 * 1024); // 3MB
    const blob = new Blob([largeData], { type: 'image/jpeg' });
    const file = new File([blob], 'large.jpg', { type: 'image/jpeg' });

    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') setTimeout(() => handler(), 0);
      }),
      removeEventListener: vi.fn(),
      src: '',
      naturalWidth: 800,
      naturalHeight: 600,
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    await act(async () => {
      await result.current.handleFileSelect(file);
    });

    await waitFor(() => {
      expect(result.current.progress).toBeGreaterThan(0);
    });
  });

  it('should handle FileInputChange event', async () => {
    const { result } = renderHook(() => useFileUpload());

    const blob = new Blob(['fake-image'], { type: 'image/jpeg' });
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    const mockEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') setTimeout(() => handler(), 0);
      }),
      removeEventListener: vi.fn(),
      src: '',
      naturalWidth: 800,
      naturalHeight: 600,
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    await act(async () => {
      await result.current.handleFileInputChange(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.selectedFile).toBe(file);
    });
  });

  it('should handle DragEvent with files', async () => {
    const { result } = renderHook(() => useFileUpload());

    const blob = new Blob(['fake-image'], { type: 'image/jpeg' });
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    const mockEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        files: [file],
      },
    } as unknown as React.DragEvent<HTMLDivElement>;

    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') setTimeout(() => handler(), 0);
      }),
      removeEventListener: vi.fn(),
      src: '',
      naturalWidth: 800,
      naturalHeight: 600,
    };

    global.Image = vi.fn(() => mockImage) as unknown as typeof Image;
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    await act(async () => {
      result.current.handleDrop(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.selectedFile).toBe(file);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
