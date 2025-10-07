import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBar } from '../../../../components/layout/StatusBar';

describe('StatusBar', () => {
  it('should display ready status message', () => {
    render(<StatusBar status="ready" message="Ready to edit" zoomLevel={100} />);

    expect(screen.getByText('Ready to edit')).toBeInTheDocument();
  });

  it('should display processing status with loading indicator', () => {
    render(<StatusBar status="processing" message="Processing image..." zoomLevel={100} />);

    expect(screen.getByText('Processing image...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should display error status with error styling', () => {
    render(<StatusBar status="error" message="Upload failed" zoomLevel={100} />);

    const statusElement = screen.getByText('Upload failed');
    expect(statusElement).toBeInTheDocument();
  });

  it('should show image dimensions when provided', () => {
    render(
      <StatusBar status="ready" imageDimensions={{ width: 1920, height: 1080 }} zoomLevel={100} />
    );

    expect(screen.getByText(/1920.*×.*1080/)).toBeInTheDocument();
  });

  it('should show current zoom level', () => {
    render(<StatusBar status="ready" zoomLevel={150} />);

    // Updated: Text is now split across spans for responsive display
    expect(screen.getByText('150%')).toBeInTheDocument();
  });

  it('should show contextual tip when provided', () => {
    render(
      <StatusBar status="ready" zoomLevel={100} tip="Click Auto-Prep to enhance your image" />
    );

    expect(screen.getByText('Click Auto-Prep to enhance your image')).toBeInTheDocument();
  });

  it('should have aria-live region for status updates', () => {
    render(<StatusBar status="ready" message="Ready" zoomLevel={100} />);

    const statusBar = screen.getByRole('status');
    expect(statusBar).toHaveAttribute('aria-live', 'polite');
  });

  it('should not show dimensions when image not loaded', () => {
    render(<StatusBar status="ready" zoomLevel={100} />);

    expect(screen.queryByText(/Dimensions:/)).not.toBeInTheDocument();
  });

  it('should handle missing message', () => {
    render(<StatusBar status="ready" zoomLevel={100} />);

    const statusBar = screen.getByRole('status');
    expect(statusBar).toBeInTheDocument();
  });

  it('should truncate long messages on mobile', () => {
    render(
      <StatusBar
        status="ready"
        message="This is a very long status message that should be truncated on mobile devices to prevent layout issues"
        zoomLevel={100}
      />
    );

    const messageElement = screen.getByText(/This is a very long/);
    expect(messageElement).toBeInTheDocument();
  });
});
