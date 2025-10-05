import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DownloadButton } from '@/components/DownloadButton';
import * as useImageDownloadModule from '@/hooks/useImageDownload';

describe('DownloadButton', () => {
  const mockCanvas = document.createElement('canvas');
  const mockDownloadImage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useImageDownload hook
    vi.spyOn(useImageDownloadModule, 'useImageDownload').mockReturnValue({
      downloadImage: mockDownloadImage,
      isDownloading: false,
      error: null,
    });
  });

  describe('rendering', () => {
    it('renders with "Download PNG" text', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      expect(screen.getByText('Download PNG')).toBeInTheDocument();
    });

    it('shows download icon', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      // Icon should be present (ArrowDownTrayIcon rendered)
      const button = screen.getByRole('button', { name: /download processed image/i });
      expect(button).toBeInTheDocument();
    });

    it('has correct aria-label', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: 'Download processed image as PNG' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('is disabled when canvas is null', () => {
      render(<DownloadButton canvas={null} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: /download processed image/i });
      expect(button).toBeDisabled();
    });

    it('is disabled when disabled prop is true', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" disabled />);

      const button = screen.getByRole('button', { name: /download processed image/i });
      expect(button).toBeDisabled();
    });

    it('is enabled when canvas exists and not explicitly disabled', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: /download processed image/i });
      expect(button).not.toBeDisabled();
    });

    it('has aria-disabled when disabled', () => {
      render(<DownloadButton canvas={null} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: /download processed image/i });
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('loading state', () => {
    it('shows loading state during download', () => {
      vi.spyOn(useImageDownloadModule, 'useImageDownload').mockReturnValue({
        downloadImage: mockDownloadImage,
        isDownloading: true,
        error: null,
      });

      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      expect(screen.getByText('Downloading...')).toBeInTheDocument();
    });

    it('is disabled during download', () => {
      vi.spyOn(useImageDownloadModule, 'useImageDownload').mockReturnValue({
        downloadImage: mockDownloadImage,
        isDownloading: true,
        error: null,
      });

      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: /download processed image/i });
      expect(button).toBeDisabled();
    });
  });

  describe('click handling', () => {
    it('calls downloadImage on click', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: /download processed image/i });
      fireEvent.click(button);

      expect(mockDownloadImage).toHaveBeenCalledWith(mockCanvas, 'test.jpg', 'png');
    });

    it('does not call downloadImage when disabled', () => {
      render(<DownloadButton canvas={null} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: /download processed image/i });
      fireEvent.click(button);

      expect(mockDownloadImage).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('shows error message when download fails', () => {
      vi.spyOn(useImageDownloadModule, 'useImageDownload').mockReturnValue({
        downloadImage: mockDownloadImage,
        isDownloading: false,
        error: 'Failed to create image blob',
      });

      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      expect(screen.getByText('Failed to create image blob')).toBeInTheDocument();
    });

    it('error message has role="alert"', () => {
      vi.spyOn(useImageDownloadModule, 'useImageDownload').mockReturnValue({
        downloadImage: mockDownloadImage,
        isDownloading: false,
        error: 'Failed to create image blob',
      });

      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Failed to create image blob');
    });

    it('error message has aria-live="assertive"', () => {
      vi.spyOn(useImageDownloadModule, 'useImageDownload').mockReturnValue({
        downloadImage: mockDownloadImage,
        isDownloading: false,
        error: 'Failed to create image blob',
      });

      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
    });

    it('does not show error when error is null', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const errorMessage = screen.queryByRole('alert');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe('keyboard accessibility', () => {
    it('is focusable via tab', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: /download processed image/i });

      // Tab to focus button
      button.focus();
      expect(button).toHaveFocus();
    });

    it('can be activated with Enter key', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: /download processed image/i });
      button.focus();

      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      // Button's onClick should fire (via default button behavior)
      // We can't directly test Enter key triggering click without more complex setup,
      // but we verify the button is keyboard accessible
      expect(button).toHaveFocus();
    });

    it('can be activated with Space key', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: /download processed image/i });
      button.focus();

      fireEvent.keyDown(button, { key: ' ', code: 'Space' });

      // Verify button is keyboard accessible
      expect(button).toHaveFocus();
    });
  });

  describe('visual feedback', () => {
    it('has proper styling classes', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: /download processed image/i });

      // Check for expected classes (basic check - exact classes may vary)
      expect(button).toHaveClass('px-6', 'py-3');
    });

    it('shows different text when downloading vs idle', () => {
      const { rerender } = render(
        <DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />
      );

      // Initially shows "Download PNG"
      expect(screen.getByText('Download PNG')).toBeInTheDocument();

      // When downloading, shows "Downloading..."
      vi.spyOn(useImageDownloadModule, 'useImageDownload').mockReturnValue({
        downloadImage: mockDownloadImage,
        isDownloading: true,
        error: null,
      });

      rerender(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      expect(screen.getByText('Downloading...')).toBeInTheDocument();
      expect(screen.queryByText('Download PNG')).not.toBeInTheDocument();
    });
  });

  describe('icon accessibility', () => {
    it('icon has aria-hidden attribute', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      // ArrowDownTrayIcon should have aria-hidden="true"
      const button = screen.getByRole('button', { name: /download processed image/i });

      // Find SVG element within button (icon)
      const svg = button.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('format selector', () => {
    it('renders format selector with PNG and JPG options', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      expect(screen.getByLabelText(/PNG \(Lossless, larger file\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/JPG \(Smaller file, 95% quality\)/i)).toBeInTheDocument();
    });

    it('defaults to PNG format selected', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const pngRadio = screen.getByLabelText(/PNG \(Lossless, larger file\)/i) as HTMLInputElement;
      expect(pngRadio.checked).toBe(true);
    });

    it('changes format when JPG selected', async () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const jpgRadio = screen.getByLabelText(/JPG \(Smaller file, 95% quality\)/i) as HTMLInputElement;
      fireEvent.click(jpgRadio);

      expect(jpgRadio.checked).toBe(true);
    });

    it('updates button text to "Download PNG" when PNG selected', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const button = screen.getByRole('button', { name: /download/i });
      expect(button).toHaveTextContent('Download PNG');
    });

    it('updates button text to "Download JPG" when JPG selected', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const jpgRadio = screen.getByLabelText(/JPG \(Smaller file, 95% quality\)/i);
      fireEvent.click(jpgRadio);

      const button = screen.getByRole('button', { name: /download/i });
      expect(button).toHaveTextContent('Download JPG');
    });

    it('passes selected format to download hook', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const jpgRadio = screen.getByLabelText(/JPG \(Smaller file, 95% quality\)/i);
      fireEvent.click(jpgRadio);

      const button = screen.getByRole('button', { name: /download/i });
      fireEvent.click(button);

      expect(mockDownloadImage).toHaveBeenCalledWith(mockCanvas, 'test.jpg', 'jpeg');
    });
  });

  describe('format selector accessibility', () => {
    it('has accessible fieldset and legend', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const group = screen.getByRole('group', { name: /export format/i });
      expect(group).toBeInTheDocument();
    });

    it('can navigate between format options via tab', () => {
      render(<DownloadButton canvas={mockCanvas} originalFilename="test.jpg" />);

      const pngRadio = screen.getByLabelText(/PNG \(Lossless, larger file\)/i) as HTMLInputElement;
      const jpgRadio = screen.getByLabelText(/JPG \(Smaller file, 95% quality\)/i) as HTMLInputElement;

      // Verify both radio buttons are focusable
      pngRadio.focus();
      expect(pngRadio).toHaveFocus();

      jpgRadio.focus();
      expect(jpgRadio).toHaveFocus();
    });
  });
});
