import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders button with default variant', () => {
      render(<Button>Click Me</Button>);
      const button = screen.getByRole('button', { name: 'Click Me' });
      expect(button).toBeInTheDocument();
      // Check for base button classes
      expect(button).toHaveClass('inline-flex');
      expect(button.className).toContain('bg-slate'); // Default variant uses slate colors
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Button variant="secondary">Secondary</Button>);
      let button = screen.getByRole('button');
      expect(button.className).toContain('bg-slate'); // Secondary variant

      rerender(<Button variant="outline">Outline</Button>);
      button = screen.getByRole('button');
      expect(button.className).toContain('border'); // Outline has border

      rerender(<Button variant="ghost">Ghost</Button>);
      button = screen.getByRole('button');
      expect(button.className).toContain('hover:bg'); // Ghost has hover background

      rerender(<Button variant="link">Link</Button>);
      button = screen.getByRole('button');
      expect(button.className).toContain('underline-offset'); // Link has underline

      rerender(<Button variant="destructive">Destructive</Button>);
      button = screen.getByRole('button');
      expect(button.className).toContain('bg-red'); // Destructive uses red
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('h-9');

      rerender(<Button size="default">Default</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');

      rerender(<Button size="lg">Large</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('h-11');

      rerender(<Button size="icon">Icon</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('h-10 w-10');
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      // Should still have base button classes
      expect(button).toHaveClass('inline-flex');
    });

    it('renders as disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none');
    });
  });

  describe('asChild prop', () => {
    it('renders as button element when asChild is false (default)', () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveClass('inline-flex');
    });

    it('renders as Slot when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link.textContent).toBe('Link Button');
      // Button styles should be applied to the link
      expect(link).toHaveClass('inline-flex');
      expect(link.className).toContain('bg-slate'); // Default button styles
    });

    it('merges className correctly with asChild', () => {
      render(
        <Button asChild className="custom-link-class">
          <a href="/test">Styled Link</a>
        </Button>
      );

      const link = screen.getByRole('link');
      // Should have both button classes and custom class
      expect(link).toHaveClass('custom-link-class');
      expect(link).toHaveClass('inline-flex');
      expect(link.className).toContain('bg-slate'); // Button background classes
    });

    it('applies variant styles to child element with asChild', () => {
      render(
        <Button asChild variant="outline" size="lg">
          <a href="/test">Outline Link</a>
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link.className).toContain('border'); // Outline variant has border
      expect(link.className).toContain('h-11'); // Large size
    });
  });

  describe('interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('keyboard accessibility', () => {
    it('is keyboard accessible with Tab, Enter, and Space', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <div>
          <button>Other Button</button>
          <Button onClick={handleClick}>Target Button</Button>
        </div>
      );

      const button = screen.getByRole('button', { name: 'Target Button' });

      // Tab to button
      await user.tab();
      await user.tab();
      expect(button).toHaveFocus();

      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Activate with Space
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('shows focus-visible styles on keyboard focus', async () => {
      const user = userEvent.setup();

      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');

      // Tab to button (keyboard focus)
      await user.tab();
      expect(button).toHaveFocus();
      // focus-visible class should be applied (Tailwind handles this)
      expect(button).toHaveClass('focus-visible:outline-none');
      expect(button).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();

      render(<Button ref={ref}>Button</Button>);

      expect(ref).toHaveBeenCalled();
      const refValue = ref.mock.calls[0][0];
      expect(refValue).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards ref with asChild', () => {
      const ref = vi.fn();

      render(
        <Button asChild ref={ref}>
          <a href="/test">Link</a>
        </Button>
      );

      expect(ref).toHaveBeenCalled();
      const refValue = ref.mock.calls[0][0];
      expect(refValue).toBeInstanceOf(HTMLAnchorElement);
    });
  });
});
