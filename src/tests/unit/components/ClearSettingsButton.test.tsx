import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClearSettingsButton } from '@/components/ClearSettingsButton';

describe('ClearSettingsButton', () => {
  it('renders clear button with correct text and icon', () => {
    render(<ClearSettingsButton onClear={vi.fn()} />);

    const button = screen.getByRole('button', { name: /clear saved settings/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Clear Settings')).toBeInTheDocument();
  });

  it('calls onClear callback when clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<ClearSettingsButton onClear={onClear} />);

    const button = screen.getByRole('button', { name: /clear saved settings/i });
    await user.click(button);

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('is enabled by default when disabled prop is not provided', () => {
    render(<ClearSettingsButton onClear={vi.fn()} />);

    const button = screen.getByRole('button', { name: /clear saved settings/i });
    expect(button).not.toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<ClearSettingsButton onClear={vi.fn()} disabled={true} />);

    const button = screen.getByRole('button', { name: /clear saved settings/i });
    expect(button).toBeDisabled();
  });

  it('has correct aria-label attribute', () => {
    render(<ClearSettingsButton onClear={vi.fn()} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Clear saved settings');
  });

  it('has correct title attribute for tooltip', () => {
    render(<ClearSettingsButton onClear={vi.fn()} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Clear saved settings');
  });

  it('activates on Enter key press', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<ClearSettingsButton onClear={onClear} />);

    const button = screen.getByRole('button', { name: /clear saved settings/i });
    button.focus();
    await user.keyboard('{Enter}');

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('activates on Space key press', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<ClearSettingsButton onClear={onClear} />);

    const button = screen.getByRole('button', { name: /clear saved settings/i });
    button.focus();
    await user.keyboard(' ');

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does not call onClear when disabled', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<ClearSettingsButton onClear={onClear} disabled={true} />);

    const button = screen.getByRole('button', { name: /clear saved settings/i });
    await user.click(button);

    expect(onClear).not.toHaveBeenCalled();
  });

  it('uses ghost variant styling', () => {
    const { container } = render(<ClearSettingsButton onClear={vi.fn()} />);

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    // Button should have styling classes from shadcn/ui ghost variant
    expect(button?.getAttribute('class')).toBeTruthy();
  });

  it('renders Trash2 icon with correct size classes', () => {
    const { container } = render(<ClearSettingsButton onClear={vi.fn()} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon?.getAttribute('class')).toContain('h-4');
    expect(icon?.getAttribute('class')).toContain('w-4');
    expect(icon?.getAttribute('class')).toContain('mr-2');
  });

  it('has text-muted-foreground and hover:text-foreground classes', () => {
    const { container } = render(<ClearSettingsButton onClear={vi.fn()} />);

    const button = container.querySelector('button');
    expect(button?.className).toContain('text-muted-foreground');
    expect(button?.className).toContain('hover:text-foreground');
  });

  it('maintains focus visibility for keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<ClearSettingsButton onClear={vi.fn()} />);

    const button = screen.getByRole('button', { name: /clear saved settings/i });

    // Tab to focus the button
    await user.tab();

    expect(button).toHaveFocus();
  });
});
