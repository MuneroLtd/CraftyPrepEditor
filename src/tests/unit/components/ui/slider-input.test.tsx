import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SliderInput } from '@/components/ui/slider-input';

describe('SliderInput', () => {
  const defaultProps = {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    onChange: vi.fn(),
  };

  describe('Rendering', () => {
    it('should render input with current value', () => {
      render(<SliderInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(50);
    });

    it('should render increment button', () => {
      render(<SliderInput {...defaultProps} />);
      const incrementButton = screen.getByLabelText('Increase value');
      expect(incrementButton).toBeInTheDocument();
    });

    it('should render decrement button', () => {
      render(<SliderInput {...defaultProps} />);
      const decrementButton = screen.getByLabelText('Decrease value');
      expect(decrementButton).toBeInTheDocument();
    });

    it('should render with disabled state', () => {
      render(<SliderInput {...defaultProps} disabled />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeDisabled();
    });
  });

  describe('Increment Button', () => {
    it('should increase value by step when clicked', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} onChange={onChange} />);

      const incrementButton = screen.getByLabelText('Increase value');
      await user.click(incrementButton);

      expect(onChange).toHaveBeenCalledWith(51);
    });

    it('should not exceed maximum value', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} value={100} onChange={onChange} />);

      const incrementButton = screen.getByLabelText('Increase value');
      await user.click(incrementButton);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should be disabled at maximum value', () => {
      render(<SliderInput {...defaultProps} value={100} />);
      const incrementButton = screen.getByLabelText('Increase value');
      expect(incrementButton).toBeDisabled();
    });

    it('should be disabled when input is disabled', () => {
      render(<SliderInput {...defaultProps} disabled />);
      const incrementButton = screen.getByLabelText('Increase value');
      expect(incrementButton).toBeDisabled();
    });
  });

  describe('Decrement Button', () => {
    it('should decrease value by step when clicked', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} onChange={onChange} />);

      const decrementButton = screen.getByLabelText('Decrease value');
      await user.click(decrementButton);

      expect(onChange).toHaveBeenCalledWith(49);
    });

    it('should not go below minimum value', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} value={0} onChange={onChange} />);

      const decrementButton = screen.getByLabelText('Decrease value');
      await user.click(decrementButton);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should be disabled at minimum value', () => {
      render(<SliderInput {...defaultProps} value={0} />);
      const decrementButton = screen.getByLabelText('Decrease value');
      expect(decrementButton).toBeDisabled();
    });

    it('should be disabled when input is disabled', () => {
      render(<SliderInput {...defaultProps} disabled />);
      const decrementButton = screen.getByLabelText('Decrease value');
      expect(decrementButton).toBeDisabled();
    });
  });

  describe('Input Field', () => {
    it('should allow typing numeric values', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '75');
      await user.tab(); // Blur to trigger onChange

      expect(onChange).toHaveBeenCalledWith(75);
    });

    it('should clamp value to minimum on blur', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '-10');
      await user.tab();

      expect(onChange).toHaveBeenCalledWith(0);
    });

    it('should clamp value to maximum on blur', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '150');
      await user.tab();

      expect(onChange).toHaveBeenCalledWith(100);
    });

    it('should reject non-numeric input', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, 'abc');

      // Input should remain empty or show previous value
      expect(input).toHaveValue(null); // Empty after clear
    });

    it('should handle negative range', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} min={-100} max={100} value={0} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '-50');
      await user.tab();

      expect(onChange).toHaveBeenCalledWith(-50);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support Enter key to confirm', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '75');
      await user.keyboard('{Enter}');

      expect(onChange).toHaveBeenCalledWith(75);
    });

    it('should support Escape key to revert', async () => {
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '75{Escape}');

      // Should revert to original value and input should be blurred
      expect(input).toHaveValue(50);
      expect(input).not.toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<SliderInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');

      expect(input).toHaveAttribute('aria-valuemin', '0');
      expect(input).toHaveAttribute('aria-valuemax', '100');
      expect(input).toHaveAttribute('aria-valuenow', '50');
    });

    it('should have accessible button labels', () => {
      render(<SliderInput {...defaultProps} />);

      expect(screen.getByLabelText('Increase value')).toBeInTheDocument();
      expect(screen.getByLabelText('Decrease value')).toBeInTheDocument();
    });

    it('should have proper focus management', async () => {
      const user = userEvent.setup();
      render(<SliderInput {...defaultProps} />);

      const input = screen.getByRole('spinbutton');
      await user.tab(); // Focus should go to decrement button
      await user.tab(); // Then to input
      expect(input).toHaveFocus();
    });
  });
});
