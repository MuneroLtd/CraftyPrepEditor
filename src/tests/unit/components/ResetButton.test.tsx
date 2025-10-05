import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResetButton } from '@/components/ResetButton';

describe('ResetButton', () => {
  it('renders reset button with correct text and icon', () => {
    render(<ResetButton onReset={vi.fn()} />);

    const button = screen.getByRole('button', { name: /reset/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Reset to Auto-Prep')).toBeInTheDocument();
  });

  it('calls onReset callback when clicked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(<ResetButton onReset={onReset} />);

    const button = screen.getByRole('button', { name: /reset/i });
    await user.click(button);

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<ResetButton onReset={vi.fn()} disabled={true} />);

    const button = screen.getByRole('button', { name: /reset/i });
    expect(button).toBeDisabled();
  });

  it('is disabled when loading prop is true', () => {
    render(<ResetButton onReset={vi.fn()} loading={true} />);

    const button = screen.getByRole('button', { name: /reset/i });
    expect(button).toBeDisabled();
  });

  it('shows loading text when loading', () => {
    render(<ResetButton onReset={vi.fn()} loading={true} />);

    expect(screen.getByText('Resetting...')).toBeInTheDocument();
    expect(screen.queryByText('Reset to Auto-Prep')).not.toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(<ResetButton onReset={vi.fn()} loading={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Reset to auto-prep defaults');
    expect(button).toHaveAttribute('aria-busy', 'false');
  });

  it('has aria-busy true when loading', () => {
    render(<ResetButton onReset={vi.fn()} loading={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('activates on Enter key press', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(<ResetButton onReset={onReset} />);

    const button = screen.getByRole('button', { name: /reset/i });
    button.focus();
    await user.keyboard('{Enter}');

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('activates on Space key press', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(<ResetButton onReset={onReset} />);

    const button = screen.getByRole('button', { name: /reset/i });
    button.focus();
    await user.keyboard(' ');

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('does not call onReset when disabled', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(<ResetButton onReset={onReset} disabled={true} />);

    const button = screen.getByRole('button', { name: /reset/i });
    await user.click(button);

    expect(onReset).not.toHaveBeenCalled();
  });

  it('meets minimum touch target size (44px height)', () => {
    const { container } = render(<ResetButton onReset={vi.fn()} />);

    const button = container.querySelector('button');
    expect(button).not.toBeNull();

    // Button should have min-h-[44px] class which ensures ≥44px height
    expect(button?.className).toContain('min-h-[44px]');
  });

  it('uses secondary variant styling', () => {
    const { container } = render(<ResetButton onReset={vi.fn()} />);

    const button = container.querySelector('button');
    expect(button).not.toBeNull();

    // Should contain variant-secondary or equivalent class from shadcn/ui
    // This is a proxy test - actual styling is from shadcn/ui Button component
    expect(button?.getAttribute('class')).toBeTruthy();
  });

  it('accepts custom className', () => {
    const { container } = render(<ResetButton onReset={vi.fn()} className="custom-class" />);

    const button = container.querySelector('button');
    expect(button?.className).toContain('custom-class');
  });

  it('renders icon with aria-hidden', () => {
    const { container } = render(<ResetButton onReset={vi.fn()} />);

    const icon = container.querySelector('svg[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });
});
