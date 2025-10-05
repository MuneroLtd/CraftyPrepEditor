/**
 * Tests for BackgroundRemovalControl Component
 *
 * Verifies:
 * - Toggle functionality
 * - Slider visibility and interaction
 * - Accessibility (ARIA attributes, keyboard navigation)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackgroundRemovalControl } from '@/components/BackgroundRemovalControl';

describe('BackgroundRemovalControl', () => {
  const mockOnToggle = vi.fn();
  const mockOnSensitivityChange = vi.fn();

  it('renders toggle and label', () => {
    render(
      <BackgroundRemovalControl
        enabled={false}
        sensitivity={128}
        onToggle={mockOnToggle}
        onSensitivityChange={mockOnSensitivityChange}
      />
    );

    expect(screen.getByText('Remove Background')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('toggle has correct aria-checked state', () => {
    const { rerender } = render(
      <BackgroundRemovalControl
        enabled={false}
        sensitivity={128}
        onToggle={mockOnToggle}
        onSensitivityChange={mockOnSensitivityChange}
      />
    );

    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    rerender(
      <BackgroundRemovalControl
        enabled={true}
        sensitivity={128}
        onToggle={mockOnToggle}
        onSensitivityChange={mockOnSensitivityChange}
      />
    );

    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onToggle when toggle is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BackgroundRemovalControl
        enabled={false}
        sensitivity={128}
        onToggle={mockOnToggle}
        onSensitivityChange={mockOnSensitivityChange}
      />
    );

    const toggle = screen.getByRole('switch');
    await user.click(toggle);

    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });

  it('hides sensitivity slider when disabled', () => {
    render(
      <BackgroundRemovalControl
        enabled={false}
        sensitivity={128}
        onToggle={mockOnToggle}
        onSensitivityChange={mockOnSensitivityChange}
      />
    );

    // Sensitivity slider should not be visible when disabled
    expect(screen.queryByText('Sensitivity')).not.toBeInTheDocument();
  });

  it('shows sensitivity slider when enabled', () => {
    render(
      <BackgroundRemovalControl
        enabled={true}
        sensitivity={128}
        onToggle={mockOnToggle}
        onSensitivityChange={mockOnSensitivityChange}
      />
    );

    // Sensitivity slider should be visible when enabled
    expect(screen.getByText(/Sensitivity/)).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('slider displays current sensitivity value', () => {
    render(
      <BackgroundRemovalControl
        enabled={true}
        sensitivity={150}
        onSensitivityChange={mockOnSensitivityChange}
        onToggle={mockOnToggle}
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '150');
  });

  it('disables toggle when disabled prop is true', () => {
    render(
      <BackgroundRemovalControl
        enabled={false}
        sensitivity={128}
        onToggle={mockOnToggle}
        onSensitivityChange={mockOnSensitivityChange}
        disabled={true}
      />
    );

    const toggle = screen.getByRole('switch');
    expect(toggle).toBeDisabled();
  });

  it('disables slider when disabled prop is true', () => {
    render(
      <BackgroundRemovalControl
        enabled={true}
        sensitivity={128}
        onToggle={mockOnToggle}
        onSensitivityChange={mockOnSensitivityChange}
        disabled={true}
      />
    );

    const slider = screen.getByRole('slider');
    // Radix UI Slider uses data-disabled attribute instead of disabled
    expect(slider).toHaveAttribute('data-disabled');
  });

  it('toggle is keyboard accessible', async () => {
    const user = userEvent.setup();

    render(
      <BackgroundRemovalControl
        enabled={false}
        sensitivity={128}
        onToggle={mockOnToggle}
        onSensitivityChange={mockOnSensitivityChange}
      />
    );

    const toggle = screen.getByRole('switch');
    toggle.focus();

    expect(toggle).toHaveFocus();

    // Press Space to toggle
    await user.keyboard(' ');
    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });

  it('has proper ARIA labels', () => {
    render(
      <BackgroundRemovalControl
        enabled={true}
        sensitivity={150}
        onToggle={mockOnToggle}
        onSensitivityChange={mockOnSensitivityChange}
      />
    );

    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-label', 'Toggle background removal');

    // Slider has aria-valuenow, aria-valuemin, aria-valuemax
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '150');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '255');
  });
});
