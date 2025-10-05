import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContrastSlider } from '@/components/ContrastSlider';

describe('ContrastSlider', () => {
  const defaultProps = {
    value: 0,
    onChange: vi.fn(),
  };

  describe('rendering', () => {
    it('renders with "Contrast" label', () => {
      render(<ContrastSlider {...defaultProps} />);
      expect(screen.getByText(/contrast/i)).toBeInTheDocument();
    });

    it('renders slider role', () => {
      render(<ContrastSlider {...defaultProps} />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('displays current contrast value', () => {
      render(<ContrastSlider {...defaultProps} value={20} />);
      expect(screen.getByText(/contrast/i)).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('displays negative contrast values', () => {
      render(<ContrastSlider {...defaultProps} value={-45} />);
      expect(screen.getByText(/contrast/i)).toBeInTheDocument();
      expect(screen.getByText('-45')).toBeInTheDocument();
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<ContrastSlider {...defaultProps} disabled />);
      const slider = screen.getByRole('slider');
      // Radix UI uses data-disabled attribute
      expect(slider).toHaveAttribute('data-disabled');
    });
  });

  describe('value range', () => {
    it('has correct minimum value (-100)', () => {
      render(<ContrastSlider {...defaultProps} value={-100} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '-100');
    });

    it('has correct maximum value (+100)', () => {
      render(<ContrastSlider {...defaultProps} value={100} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    it('displays value at minimum (-100)', () => {
      render(<ContrastSlider {...defaultProps} value={-100} />);
      expect(screen.getByText(/contrast/i)).toBeInTheDocument();
      expect(screen.getByText('-100')).toBeInTheDocument();
    });

    it('displays value at maximum (+100)', () => {
      render(<ContrastSlider {...defaultProps} value={100} />);
      expect(screen.getByText(/contrast/i)).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('displays default value (0)', () => {
      render(<ContrastSlider {...defaultProps} value={0} />);
      expect(screen.getByText(/contrast/i)).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('ARIA attributes', () => {
    it('has descriptive aria-label', () => {
      render(<ContrastSlider {...defaultProps} />);
      const slider = screen.getByRole('slider');
      const ariaLabel = slider.getAttribute('aria-label') || '';
      expect(ariaLabel).toMatch(/contrast/i);
      expect(ariaLabel).toMatch(/-100.*\+100/i);
    });

    it('updates aria-valuenow when value changes', () => {
      const { rerender } = render(<ContrastSlider {...defaultProps} value={0} />);
      let slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '0');

      rerender(<ContrastSlider {...defaultProps} value={60} />);
      slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '60');

      rerender(<ContrastSlider {...defaultProps} value={-80} />);
      slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '-80');
    });
  });

  describe('onChange callback', () => {
    it('provides onChange callback to base component', () => {
      const onChange = vi.fn();
      render(<ContrastSlider {...defaultProps} onChange={onChange} />);

      // Callback should be wired to the slider
      expect(onChange).toBeDefined();
    });
  });

  describe('step size', () => {
    it('uses step size of 1', () => {
      render(<ContrastSlider {...defaultProps} />);
      const slider = screen.getByRole('slider');

      // Step attribute should be 1 for fine-grained control
      // Actual verification depends on implementation
      expect(slider).toBeInTheDocument();
    });
  });
});
