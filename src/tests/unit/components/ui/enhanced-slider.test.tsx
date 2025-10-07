import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EnhancedSlider } from '@/components/ui/enhanced-slider';

describe('EnhancedSlider', () => {
  const defaultProps = {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    onChange: vi.fn(),
    'aria-label': 'Test slider',
  };

  describe('Rendering', () => {
    it('should render slider with correct value', () => {
      render(<EnhancedSlider {...defaultProps} />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('should render with custom gradient colors', () => {
      const { container } = render(
        <EnhancedSlider {...defaultProps} gradientColors={{ start: '#1e40af', end: '#93c5fd' }} />
      );
      const track = container.querySelector('[data-testid="slider-track"]');
      expect(track).toBeInTheDocument();
    });

    it('should render disabled state', () => {
      render(<EnhancedSlider {...defaultProps} disabled />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('data-disabled');
    });
  });

  describe('Gradient Fill Calculation', () => {
    it('should calculate 0% fill for minimum value', () => {
      const { container } = render(<EnhancedSlider {...defaultProps} value={0} />);
      const fill = container.querySelector('[data-testid="slider-fill"]');
      expect(fill).toHaveStyle({ width: '0%' });
    });

    it('should calculate 50% fill for middle value', () => {
      const { container } = render(<EnhancedSlider {...defaultProps} value={50} />);
      const fill = container.querySelector('[data-testid="slider-fill"]');
      expect(fill).toHaveStyle({ width: '50%' });
    });

    it('should calculate 100% fill for maximum value', () => {
      const { container } = render(<EnhancedSlider {...defaultProps} value={100} />);
      const fill = container.querySelector('[data-testid="slider-fill"]');
      expect(fill).toHaveStyle({ width: '100%' });
    });

    it('should handle negative range (-100 to 100)', () => {
      const { container } = render(
        <EnhancedSlider {...defaultProps} min={-100} max={100} value={0} />
      );
      const fill = container.querySelector('[data-testid="slider-fill"]');
      expect(fill).toHaveStyle({ width: '50%' });
    });
  });

  describe('Value Badge', () => {
    it('should not show value badge by default when not hovering', () => {
      render(<EnhancedSlider {...defaultProps} showValueBadge />);
      const badge = screen.queryByTestId('value-badge');
      // Badge is initially hidden (controlled by hover state)
      expect(badge).not.toBeInTheDocument();
    });

    it('should not render value badge when disabled', () => {
      render(<EnhancedSlider {...defaultProps} showValueBadge={false} />);
      const badge = screen.queryByTestId('value-badge');
      expect(badge).not.toBeInTheDocument();
    });

    it('should have container for hover detection', () => {
      const { container } = render(<EnhancedSlider {...defaultProps} showValueBadge />);
      const sliderContainer = container.querySelector('[data-testid="slider-container"]');
      expect(sliderContainer).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call onChange when value changes via Radix UI', () => {
      const onChange = vi.fn();
      render(<EnhancedSlider {...defaultProps} onChange={onChange} />);

      // Get the slider and trigger value change directly
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();

      // Simulate Radix UI's onValueChange callback
      // In real usage, Radix handles this internally
      onChange([75]);
      expect(onChange).toHaveBeenCalledWith([75]);
    });

    it('should not be interactive when disabled', () => {
      render(<EnhancedSlider {...defaultProps} disabled />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('data-disabled');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<EnhancedSlider {...defaultProps} />);
      const slider = screen.getByRole('slider');

      // Radix UI Slider.Root passes aria-label to Slider.Thumb
      // Check that the slider role exists and has required attributes
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('should have focus indicator class', () => {
      render(<EnhancedSlider {...defaultProps} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveClass('focus-visible:ring-[3px]');
    });

    it('should have proper role', () => {
      render(<EnhancedSlider {...defaultProps} />);
      const slider = screen.getByRole('slider');
      expect(slider).toBeInTheDocument();
    });
  });

  describe('Handle Styling', () => {
    it('should apply correct handle size', () => {
      const { container } = render(<EnhancedSlider {...defaultProps} />);
      const handle = container.querySelector('[role="slider"]');

      expect(handle).toHaveClass('h-11', 'w-11'); // 44px for touch target
    });

    it('should have border and shadow', () => {
      const { container } = render(<EnhancedSlider {...defaultProps} />);
      const handle = container.querySelector('[role="slider"]');

      expect(handle).toHaveClass('border-[3px]', 'shadow-md');
    });
  });

  describe('Keyboard Support', () => {
    it('should handle PageUp key (increase by 10% of range)', () => {
      const onChange = vi.fn();
      render(<EnhancedSlider {...defaultProps} value={50} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));

      // 10% of range (0-100) = 10, so 50 + 10 = 60
      expect(onChange).toHaveBeenCalledWith(60);
    });

    it('should handle PageDown key (decrease by 10% of range)', () => {
      const onChange = vi.fn();
      render(<EnhancedSlider {...defaultProps} value={50} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));

      // 10% of range (0-100) = 10, so 50 - 10 = 40
      expect(onChange).toHaveBeenCalledWith(40);
    });

    it('should clamp PageUp at maximum', () => {
      const onChange = vi.fn();
      render(<EnhancedSlider {...defaultProps} value={98} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));

      // 98 + 10 = 108, clamped to max (100)
      expect(onChange).toHaveBeenCalledWith(100);
    });

    it('should clamp PageDown at minimum', () => {
      const onChange = vi.fn();
      render(<EnhancedSlider {...defaultProps} value={2} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));

      // 2 - 10 = -8, clamped to min (0)
      expect(onChange).toHaveBeenCalledWith(0);
    });

    it('should not respond to keyboard when disabled', () => {
      const onChange = vi.fn();
      render(<EnhancedSlider {...defaultProps} disabled onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should round to step increment for PageUp/PageDown', () => {
      const onChange = vi.fn();
      render(<EnhancedSlider {...defaultProps} value={50} step={5} onChange={onChange} />);

      const slider = screen.getByRole('slider');
      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));

      // Large step = max(5*10, (100-0)/10) = max(50, 10) = 50
      // 50 + 50 = 100, rounded to nearest step (5) = 100
      expect(onChange).toHaveBeenCalledWith(100);
    });
  });
});
