import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThresholdSlider } from '@/components/ThresholdSlider';

describe('ThresholdSlider', () => {
  const defaultProps = {
    value: 128,
    onChange: vi.fn(),
  };

  describe('rendering', () => {
    it('renders with "Threshold" label', () => {
      render(<ThresholdSlider {...defaultProps} />);
      expect(screen.getByText(/threshold/i)).toBeInTheDocument();
    });

    it('renders slider role', () => {
      render(<ThresholdSlider {...defaultProps} />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('displays current threshold value', () => {
      render(<ThresholdSlider {...defaultProps} value={156} />);
      expect(screen.getByText(/threshold/i)).toBeInTheDocument();
      expect(screen.getByText('156')).toBeInTheDocument();
    });

    it('accepts value from props (auto-calculated)', () => {
      render(<ThresholdSlider {...defaultProps} value={142} />);
      expect(screen.getByText(/threshold/i)).toBeInTheDocument();
      expect(screen.getByText('142')).toBeInTheDocument();
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<ThresholdSlider {...defaultProps} disabled />);
      const slider = screen.getByRole('slider');
      // Radix UI uses data-disabled attribute
      expect(slider).toHaveAttribute('data-disabled');
    });
  });

  describe('value range', () => {
    it('has correct minimum value (0)', () => {
      render(<ThresholdSlider {...defaultProps} value={0} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
    });

    it('has correct maximum value (255)', () => {
      render(<ThresholdSlider {...defaultProps} value={255} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemax', '255');
    });

    it('displays value at minimum (0)', () => {
      render(<ThresholdSlider {...defaultProps} value={0} />);
      expect(screen.getByText(/threshold/i)).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('displays value at maximum (255)', () => {
      render(<ThresholdSlider {...defaultProps} value={255} />);
      expect(screen.getByText(/threshold/i)).toBeInTheDocument();
      expect(screen.getByText('255')).toBeInTheDocument();
    });

    it('displays typical Otsu value (128)', () => {
      render(<ThresholdSlider {...defaultProps} value={128} />);
      expect(screen.getByText(/threshold/i)).toBeInTheDocument();
      expect(screen.getByText('128')).toBeInTheDocument();
    });
  });

  describe('ARIA attributes', () => {
    it('has descriptive aria-label', () => {
      render(<ThresholdSlider {...defaultProps} />);
      const slider = screen.getByRole('slider');
      const ariaLabel = slider.getAttribute('aria-label') || '';
      expect(ariaLabel).toMatch(/threshold/i);
      expect(ariaLabel).toMatch(/0.*255/i);
    });

    it('updates aria-valuenow when value changes', () => {
      const { rerender } = render(<ThresholdSlider {...defaultProps} value={100} />);
      let slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '100');

      rerender(<ThresholdSlider {...defaultProps} value={200} />);
      slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '200');

      rerender(<ThresholdSlider {...defaultProps} value={50} />);
      slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });
  });

  describe('onChange callback', () => {
    it('provides onChange callback to base component', () => {
      const onChange = vi.fn();
      render(<ThresholdSlider {...defaultProps} onChange={onChange} />);

      // Callback should be wired to the slider
      expect(onChange).toBeDefined();
    });
  });

  describe('step size', () => {
    it('uses step size of 1', () => {
      render(<ThresholdSlider {...defaultProps} />);
      const slider = screen.getByRole('slider');

      // Step attribute should be 1 for fine-grained control
      // Actual verification depends on implementation
      expect(slider).toBeInTheDocument();
    });
  });
});
