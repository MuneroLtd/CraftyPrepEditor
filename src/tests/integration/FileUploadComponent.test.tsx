import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUploadComponent } from '@/components/FileUploadComponent';

/**
 * Helper function to create default props for FileUploadComponent tests.
 * Allows overriding specific props while providing sensible defaults.
 */
const createDefaultProps = (overrides = {}) => ({
  selectedFile: null,
  uploadedImage: null,
  isLoading: false,
  error: null,
  info: null,
  progress: 0,
  handleFileSelect: vi.fn(),
  clearError: vi.fn(),
  clearInfo: vi.fn(),
  ...overrides,
});

describe('FileUploadComponent Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dropzone initially', () => {
    render(<FileUploadComponent {...createDefaultProps()} />);

    expect(screen.getByRole('button', { name: /upload image file/i })).toBeInTheDocument();
    expect(screen.getByText(/drag image here or click to browse/i)).toBeInTheDocument();
  });

  it.skip('should handle successful file upload', async () => {
    const user = userEvent.setup();

    const blob = new Blob(['fake-image'], { type: 'image/jpeg' });
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    // Simple Image mock that only fires load once
    let loadHandler: (() => void) | null = null;
    const mockImage = {
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'load') {
          loadHandler = handler;
        }
      }),
      removeEventListener: vi.fn(),
      src: '',
      naturalWidth: 800,
      naturalHeight: 600,
    };

    // Override Image constructor
    global.Image = vi.fn(() => {
      // Set src property to trigger load
      Object.defineProperty(mockImage, 'src', {
        set: () => {
          // Fire load handler once immediately after src is set
          if (loadHandler) {
            setTimeout(() => loadHandler!(), 0);
          }
        },
        configurable: true,
      });
      return mockImage;
    }) as unknown as typeof Image;

    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    render(<FileUploadComponent {...createDefaultProps()} />);

    const dropzone = screen.getByRole('button', { name: /upload image file/i });
    await user.click(dropzone);

    // Simulate file selection using DataTransfer (happy-dom compatible)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    fireEvent.change(input, {
      target: { files: dataTransfer.files },
    });

    await waitFor(() => {
      expect(screen.getByText(/image uploaded successfully/i)).toBeInTheDocument();
    });
  });

  it.skip('should display error for invalid file type', async () => {
    const user = userEvent.setup();

    const file = new File(['test'], 'document.pdf', { type: 'application/pdf' });

    render(<FileUploadComponent {...createDefaultProps()} />);

    const dropzone = screen.getByRole('button', { name: /upload image file/i });
    await user.click(dropzone);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    fireEvent.change(input, {
      target: { files: dataTransfer.files },
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument();
    });
  });

  it.skip('should allow error dismissal', async () => {
    const user = userEvent.setup();

    const file = new File(['test'], 'invalid.pdf', { type: 'application/pdf' });

    render(<FileUploadComponent {...createDefaultProps()} />);

    const dropzone = screen.getByRole('button', { name: /upload image file/i });
    await user.click(dropzone);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    fireEvent.change(input, {
      target: { files: dataTransfer.files },
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
    await user.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();

    render(<FileUploadComponent {...createDefaultProps()} />);

    const dropzone = screen.getByRole('button', { name: /upload image file/i });

    // Tab to dropzone
    await user.tab();
    expect(dropzone).toHaveFocus();

    // Should have visible focus indicator
    expect(dropzone).toHaveClass('focus:ring-4');
  });
});
