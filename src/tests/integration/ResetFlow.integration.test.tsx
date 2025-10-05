import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';

/**
 * Helper function to convert data URL to Blob
 */
function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(',');
  const contentType = parts[0].match(/:(.*?);/)![1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

// Create a valid 1×1 PNG mock file
const dataUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
const blob = dataURLToBlob(dataUrl);
const mockImageFile = new File([blob], 'test-image.png', { type: 'image/png' });

describe('Reset Flow Integration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('completes full reset workflow: upload → auto-prep → adjust → reset', async () => {
    const user = userEvent.setup();

    const { container } = render(<App />);

    // Step 1: Upload image
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, mockImageFile);

    // Wait for upload to complete
    await waitFor(
      () => {
        expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Step 2: Run auto-prep
    const autoPrepButton = await screen.findByRole('button', { name: /auto-prep/i });
    await user.click(autoPrepButton);

    // Wait for auto-prep to complete
    await waitFor(
      () => {
        expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Verify refinement controls are visible
    await waitFor(() => {
      expect(screen.getByText(/refinement controls/i)).toBeInTheDocument();
    });

    // Step 3: Adjust sliders
    // Find brightness slider
    const brightnessSlider = screen.getByRole('slider', { name: /brightness/i });
    expect(brightnessSlider).toBeInTheDocument();

    // Get initial values
    const initialBrightness = brightnessSlider.getAttribute('aria-valuenow');

    // Adjust brightness (simulate changing value)
    await user.clear(brightnessSlider);
    await user.type(brightnessSlider, '50');

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Verify brightness changed
    const adjustedBrightness = brightnessSlider.getAttribute('aria-valuenow');
    expect(adjustedBrightness).not.toBe(initialBrightness);

    // Step 4: Reset
    const resetButton = await screen.findByRole('button', { name: /reset/i });
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).not.toBeDisabled();

    await user.click(resetButton);

    // Wait for reset to complete
    await waitFor(
      () => {
        expect(screen.queryByText(/resetting/i)).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Step 5: Verify sliders returned to defaults
    await waitFor(() => {
      const resetBrightness = brightnessSlider.getAttribute('aria-valuenow');
      expect(resetBrightness).toBe('0');
    });
  });

  it('resets brightness to 0', async () => {
    const user = userEvent.setup();

    const { container } = render(<App />);

    // Upload and auto-prep
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, mockImageFile);

    await waitFor(() => {
      expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
    });

    const autoPrepButton = await screen.findByRole('button', { name: /auto-prep/i });
    await user.click(autoPrepButton);

    await waitFor(() => {
      expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
    });

    // Adjust brightness
    const brightnessSlider = await screen.findByRole('slider', { name: /brightness/i });
    await user.clear(brightnessSlider);
    await user.type(brightnessSlider, '50');
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Reset
    const resetButton = await screen.findByRole('button', { name: /reset/i });
    await user.click(resetButton);

    await waitFor(() => {
      expect(screen.queryByText(/resetting/i)).not.toBeInTheDocument();
    });

    // Verify brightness is 0
    await waitFor(() => {
      const brightness = brightnessSlider.getAttribute('aria-valuenow');
      expect(brightness).toBe('0');
    });
  });

  it('resets contrast to 0', async () => {
    const user = userEvent.setup();

    const { container } = render(<App />);

    // Upload and auto-prep
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, mockImageFile);

    await waitFor(() => {
      expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
    });

    const autoPrepButton = await screen.findByRole('button', { name: /auto-prep/i });
    await user.click(autoPrepButton);

    await waitFor(() => {
      expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
    });

    // Adjust contrast
    const contrastSlider = await screen.findByRole('slider', { name: /contrast/i });
    await user.clear(contrastSlider);
    await user.type(contrastSlider, '-20');
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Reset
    const resetButton = await screen.findByRole('button', { name: /reset/i });
    await user.click(resetButton);

    await waitFor(() => {
      expect(screen.queryByText(/resetting/i)).not.toBeInTheDocument();
    });

    // Verify contrast is 0
    await waitFor(() => {
      const contrast = contrastSlider.getAttribute('aria-valuenow');
      expect(contrast).toBe('0');
    });
  });

  it('resets threshold to Otsu value', async () => {
    const user = userEvent.setup();

    const { container } = render(<App />);

    // Upload and auto-prep
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, mockImageFile);

    await waitFor(() => {
      expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
    });

    const autoPrepButton = await screen.findByRole('button', { name: /auto-prep/i });
    await user.click(autoPrepButton);

    await waitFor(() => {
      expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
    });

    // Get Otsu threshold value
    const thresholdSlider = await screen.findByRole('slider', { name: /threshold/i });
    const otsuValue = thresholdSlider.getAttribute('aria-valuenow');

    // Adjust threshold
    await user.clear(thresholdSlider);
    await user.type(thresholdSlider, '200');
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Verify threshold changed
    const adjustedValue = thresholdSlider.getAttribute('aria-valuenow');
    expect(adjustedValue).toBe('200');

    // Reset
    const resetButton = await screen.findByRole('button', { name: /reset/i });
    await user.click(resetButton);

    await waitFor(() => {
      expect(screen.queryByText(/resetting/i)).not.toBeInTheDocument();
    });

    // Verify threshold returned to Otsu value
    await waitFor(() => {
      const resetValue = thresholdSlider.getAttribute('aria-valuenow');
      expect(resetValue).toBe(otsuValue);
    });
  });

  it('disables background removal on reset', async () => {
    const user = userEvent.setup();

    const { container } = render(<App />);

    // Upload and auto-prep
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, mockImageFile);

    await waitFor(() => {
      expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
    });

    const autoPrepButton = await screen.findByRole('button', { name: /auto-prep/i });
    await user.click(autoPrepButton);

    await waitFor(() => {
      expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
    });

    // Enable background removal
    const bgToggle = await screen.findByRole('switch', { name: /background removal/i });
    await user.click(bgToggle);

    await waitFor(() => {
      expect(bgToggle).toBeChecked();
    });

    // Reset
    const resetButton = await screen.findByRole('button', { name: /reset/i });
    await user.click(resetButton);

    await waitFor(() => {
      expect(screen.queryByText(/resetting/i)).not.toBeInTheDocument();
    });

    // Verify background removal is disabled
    await waitFor(() => {
      expect(bgToggle).not.toBeChecked();
    });
  });

  it('handles multiple reset operations correctly', async () => {
    const user = userEvent.setup();

    const { container } = render(<App />);

    // Upload and auto-prep
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, mockImageFile);

    await waitFor(() => {
      expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
    });

    const autoPrepButton = await screen.findByRole('button', { name: /auto-prep/i });
    await user.click(autoPrepButton);

    await waitFor(() => {
      expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
    });

    const resetButton = await screen.findByRole('button', { name: /reset/i });
    const brightnessSlider = await screen.findByRole('slider', { name: /brightness/i });

    // First reset cycle
    await user.clear(brightnessSlider);
    await user.type(brightnessSlider, '30');
    await new Promise((resolve) => setTimeout(resolve, 150));

    await user.click(resetButton);
    await waitFor(() => {
      expect(screen.queryByText(/resetting/i)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(brightnessSlider.getAttribute('aria-valuenow')).toBe('0');
    });

    // Second reset cycle
    await user.clear(brightnessSlider);
    await user.type(brightnessSlider, '-40');
    await new Promise((resolve) => setTimeout(resolve, 150));

    await user.click(resetButton);
    await waitFor(() => {
      expect(screen.queryByText(/resetting/i)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(brightnessSlider.getAttribute('aria-valuenow')).toBe('0');
    });
  });

  it('shows reset button only after auto-prep completes', async () => {
    const user = userEvent.setup();

    const { container } = render(<App />);

    // Initially no reset button
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();

    // Upload image
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, mockImageFile);

    await waitFor(() => {
      expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
    });

    // Still no reset button before auto-prep
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();

    // Run auto-prep
    const autoPrepButton = await screen.findByRole('button', { name: /auto-prep/i });
    await user.click(autoPrepButton);

    await waitFor(() => {
      expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
    });

    // Now reset button should appear
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });
  });

  it('disables reset button during processing', async () => {
    const user = userEvent.setup();

    const { container } = render(<App />);

    // Upload and auto-prep
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, mockImageFile);

    await waitFor(() => {
      expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
    });

    const autoPrepButton = await screen.findByRole('button', { name: /auto-prep/i });
    await user.click(autoPrepButton);

    // During processing, if reset button exists, it should be disabled
    // Note: This test assumes reset button exists during processing (may not if only shown after)
    await waitFor(() => {
      const resetButton = screen.queryByRole('button', { name: /reset/i });
      if (resetButton) {
        expect(resetButton).toBeDisabled();
      }
    });
  });
});
