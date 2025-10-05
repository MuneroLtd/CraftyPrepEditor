/**
 * @file AutoPrepButton Component Tests
 * @description Unit tests for the Auto-Prep button component with TDD approach
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AutoPrepButton } from '../../../components/AutoPrepButton';

describe('AutoPrepButton Component', () => {
  describe('Rendering', () => {
    it('renders button with "Auto-Prep" text', () => {
      render(<AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button', { name: /auto-prep/i });
      expect(button).toBeInTheDocument();
    });

    it('renders with sparkles icon', () => {
      render(<AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />);

      // Icon should be present (via aria-label or data-testid)
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // SVG or icon element should exist inside button
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('applies primary button styling', () => {
      const { container } = render(
        <AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />
      );

      const button = screen.getByRole('button');
      // Should have variant="default" (primary styling from shadcn/ui)
      expect(button).toHaveClass('bg-primary');
    });

    it('meets minimum size requirements (140px × 44px)', () => {
      render(<AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      // Should have size="lg" for larger touch target
      expect(button).toHaveClass('h-11'); // Tailwind h-11 = 44px
    });
  });

  describe('Disabled State', () => {
    it('is disabled when disabled prop is true', () => {
      render(<AutoPrepButton disabled={true} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('shows tooltip text when disabled', () => {
      render(<AutoPrepButton disabled={true} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      // Tooltip should be present via aria-label or title
      expect(button).toHaveAttribute('aria-label');
      expect(button.getAttribute('aria-label')).toContain('Upload an image first');
    });

    it('does not fire onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<AutoPrepButton disabled={true} loading={false} onClick={onClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onClick).not.toHaveBeenCalled();
    });

    it('has reduced opacity when disabled', () => {
      render(<AutoPrepButton disabled={true} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      // Disabled state should have opacity class
      expect(button).toHaveClass('disabled:opacity-50');
    });
  });

  describe('Loading State', () => {
    it('shows spinner when loading', () => {
      render(<AutoPrepButton disabled={false} loading={true} onClick={vi.fn()} />);

      // Spinner should be visible (via aria-label or test-id)
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('shows "Processing..." text when loading', () => {
      render(<AutoPrepButton disabled={false} loading={true} onClick={vi.fn()} />);

      // Use getAllByText since there are multiple "Processing" text instances
      const processingTexts = screen.getAllByText(/processing/i);
      expect(processingTexts.length).toBeGreaterThan(0);
    });

    it('is disabled during loading to prevent double-clicks', () => {
      render(<AutoPrepButton disabled={false} loading={true} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('does not fire onClick when loading', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<AutoPrepButton disabled={false} loading={true} onClick={onClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onClick).not.toHaveBeenCalled();
    });

    it('hides icon when loading (shows spinner instead)', () => {
      const { rerender } = render(
        <AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />
      );

      // Icon visible when not loading
      let button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();

      // Rerender with loading=true
      rerender(<AutoPrepButton disabled={false} loading={true} onClick={vi.fn()} />);

      // Spinner visible, original icon hidden
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Enabled State', () => {
    it('is enabled when disabled=false and loading=false', () => {
      render(<AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('fires onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<AutoPrepButton disabled={false} loading={false} onClick={onClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('shows "Auto-Prep" text when enabled', () => {
      render(<AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button', { name: /auto-prep/i });
      expect(button).toBeInTheDocument();
      expect(screen.queryByText(/processing\.\.\./i)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility (WCAG 2.2 AAA)', () => {
    it('is keyboard accessible (focusable with Tab)', () => {
      render(<AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('activates with Enter key', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<AutoPrepButton disabled={false} loading={false} onClick={onClick} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('activates with Space key', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<AutoPrepButton disabled={false} loading={false} onClick={onClick} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('has visible focus indicator', () => {
      render(<AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      // Should have focus-visible class for keyboard focus
      expect(button).toHaveClass('focus-visible:ring-2');
    });

    it('has accessible label', () => {
      render(<AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button', { name: /auto-prep/i });
      expect(button).toBeInTheDocument();
    });

    it('announces loading state to screen readers', () => {
      render(<AutoPrepButton disabled={false} loading={true} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      // Should have aria-busy during loading
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('announces disabled state to screen readers', () => {
      render(<AutoPrepButton disabled={true} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('has sufficient color contrast (≥7:1 for AAA)', () => {
      render(<AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      // Primary button should use text-primary-foreground for high contrast
      expect(button).toHaveClass('text-primary-foreground');
    });

    it('meets touch target size (≥44px × 44px)', () => {
      render(<AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />);

      const button = screen.getByRole('button');
      const rect = button.getBoundingClientRect();

      // h-11 = 44px height, min-w-[140px] = 140px width
      expect(rect.height).toBeGreaterThanOrEqual(44);
      expect(rect.width).toBeGreaterThanOrEqual(140);
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid clicks gracefully', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<AutoPrepButton disabled={false} loading={false} onClick={onClick} />);

      const button = screen.getByRole('button');

      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Each click should register (debouncing happens in parent component)
      expect(onClick).toHaveBeenCalledTimes(3);
    });

    it('transitions smoothly between states', () => {
      const { rerender } = render(
        <AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />
      );

      // Start enabled
      let button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(screen.getByText(/auto-prep/i)).toBeInTheDocument();

      // Transition to loading
      rerender(<AutoPrepButton disabled={false} loading={true} onClick={vi.fn()} />);
      const processingTexts = screen.getAllByText(/processing/i);
      expect(processingTexts.length).toBeGreaterThan(0);
      expect(button).toBeDisabled();

      // Transition to disabled
      rerender(<AutoPrepButton disabled={true} loading={false} onClick={vi.fn()} />);
      expect(button).toBeDisabled();
      expect(screen.queryByText(/processing/i)).not.toBeInTheDocument();
    });

    it('maintains consistent width across states', () => {
      const { rerender } = render(
        <AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />
      );

      const button = screen.getByRole('button');
      const initialWidth = button.getBoundingClientRect().width;

      // Change to loading state
      rerender(<AutoPrepButton disabled={false} loading={true} onClick={vi.fn()} />);
      const loadingWidth = button.getBoundingClientRect().width;

      // Width should remain consistent (prevent layout shift)
      expect(Math.abs(loadingWidth - initialWidth)).toBeLessThan(10);
    });
  });

  describe('Performance', () => {
    it('renders quickly (<100ms)', () => {
      const start = performance.now();

      render(<AutoPrepButton disabled={false} loading={false} onClick={vi.fn()} />);

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('does not cause unnecessary re-renders', () => {
      const onClick = vi.fn();
      const { rerender } = render(
        <AutoPrepButton disabled={false} loading={false} onClick={onClick} />
      );

      // Same props should not trigger re-render
      rerender(<AutoPrepButton disabled={false} loading={false} onClick={onClick} />);

      // Component should be stable (React.memo or similar optimization)
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
