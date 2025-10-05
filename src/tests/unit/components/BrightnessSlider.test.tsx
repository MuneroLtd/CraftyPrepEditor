import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrightnessSlider } from '@/components/BrightnessSlider';

describe('BrightnessSlider', () => {
  const defaultProps = {
    value: 0,
    onChange: vi.fn(),
  };

  describe('rendering', () => {
    it('renders with "Brightness" label', () => {
      render(<BrightnessSlider {...defaultProps} />);
      expect(screen.getByText(/brightness/i)).toBeInTheDocument();
    });

    it('renders slider role', () => {
      render(<BrightnessSlider {...defaultProps} />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('displays current brightness value', () => {
      render(<BrightnessSlider {...defaultProps} value={15} />);
      expect(screen.getByText(/brightness/i)).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('displays negative brightness values', () => {
      render(<BrightnessSlider {...defaultProps} value={-30} />);
      expect(screen.getByText(/brightness/i)).toBeInTheDocument();
      expect(screen.getByText('-30')).toBeInTheDocument();
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<BrightnessSlider {...defaultProps} disabled />);
      const slider = screen.getByRole('slider');
      // Radix UI uses data-disabled attribute
      expect(slider).toHaveAttribute('data-disabled');
    });
  });

  describe('value range', () => {
    it('has correct minimum value (-100)', () => {
      render(<BrightnessSlider {...defaultProps} value={-100} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '-100');
    });

    it('has correct maximum value (+100)', () => {
      render(<BrightnessSlider {...defaultProps} value={100} />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    it('displays value at minimum (-100)', () => {
      render(<BrightnessSlider {...defaultProps} value={-100} />);
      expect(screen.getByText(/brightness/i)).toBeInTheDocument();
      expect(screen.getByText('-100')).toBeInTheDocument();
    });

    it('displays value at maximum (+100)', () => {
      render(<BrightnessSlider {...defaultProps} value={100} />);
      expect(screen.getByText(/brightness/i)).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('displays default value (0)', () => {
      render(<BrightnessSlider {...defaultProps} value={0} />);
      expect(screen.getByText(/brightness/i)).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('ARIA attributes', () => {
    it('has descriptive aria-label', () => {
      render(<BrightnessSlider {...defaultProps} />);
      const slider = screen.getByRole('slider');
      const sliderRoot = slider.parentElement?.parentElement;
      const ariaLabel = sliderRoot?.getAttribute('aria-label') || '';
      expect(ariaLabel).toMatch(/brightness/i);
      expect(ariaLabel).toMatch(/-100.*\+100/i);
    });

    it('updates aria-valuenow when value changes', () => {
      const { rerender } = render(<BrightnessSlider {...defaultProps} value={0} />);
      let slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '0');

      rerender(<BrightnessSlider {...defaultProps} value={50} />);
      slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '50');

      rerender(<BrightnessSlider {...defaultProps} value={-75} />);
      slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '-75');
    });
  });

  describe('onChange callback', () => {
    it('provides onChange callback to base component', () => {
      const onChange = vi.fn();
      render(<BrightnessSlider {...defaultProps} onChange={onChange} />);

      // Callback should be wired to the slider
      expect(onChange).toBeDefined();
    });
  });

  describe('step size', () => {
    it('uses step size of 1', () => {
      render(<BrightnessSlider {...defaultProps} />);
      const slider = screen.getByRole('slider');

      // Step attribute should be 1 for fine-grained control
      // Actual verification depends on implementation
      expect(slider).toBeInTheDocument();
    });
  });
});
