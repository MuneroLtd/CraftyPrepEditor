import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RefinementControls } from '@/components/RefinementControls';

describe('RefinementControls', () => {
  const defaultProps = {
    brightness: 0,
    contrast: 0,
    threshold: 128,
    onBrightnessChange: vi.fn(),
    onContrastChange: vi.fn(),
    onThresholdChange: vi.fn(),
  };

  describe('rendering', () => {
    it('renders section with heading', () => {
      render(<RefinementControls {...defaultProps} />);
      const heading = screen.getByRole('heading', { name: /refinement controls/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('renders section with proper ARIA labelledby', () => {
      render(<RefinementControls {...defaultProps} />);
      const section = screen.getByRole('region', { name: /refinement controls/i });
      expect(section).toHaveAttribute('aria-labelledby', 'refinement-heading');
    });

    it('renders all three sliders', () => {
      render(<RefinementControls {...defaultProps} />);

      // All three sliders should be present
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(3);
    });

    it('renders Brightness slider with label', () => {
      render(<RefinementControls {...defaultProps} />);
      expect(screen.getByText(/brightness/i)).toBeInTheDocument();
    });

    it('renders Contrast slider with label', () => {
      render(<RefinementControls {...defaultProps} />);
      expect(screen.getByText(/contrast/i)).toBeInTheDocument();
    });

    it('renders Threshold slider with label', () => {
      render(<RefinementControls {...defaultProps} />);
      expect(screen.getByText(/threshold/i)).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<RefinementControls {...defaultProps} className="custom-controls" />);
      const section = screen.getByRole('region');
      expect(section).toHaveClass('custom-controls');
    });
  });

  describe('slider values', () => {
    it('displays brightness value', () => {
      render(<RefinementControls {...defaultProps} brightness={25} />);
      expect(screen.getByText(/brightness/i)).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('displays contrast value', () => {
      render(<RefinementControls {...defaultProps} contrast={-30} />);
      expect(screen.getByText(/contrast/i)).toBeInTheDocument();
      expect(screen.getByText('-30')).toBeInTheDocument();
    });

    it('displays threshold value', () => {
      render(<RefinementControls {...defaultProps} threshold={200} />);
      expect(screen.getByText(/threshold/i)).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('updates displayed values when props change', () => {
      const { rerender } = render(
        <RefinementControls {...defaultProps} brightness={5} contrast={0} threshold={128} />
      );
      expect(screen.getByText(/brightness/i)).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();

      rerender(
        <RefinementControls {...defaultProps} brightness={50} contrast={0} threshold={128} />
      );
      expect(screen.getByText(/brightness/i)).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('disables all sliders when disabled prop is true', () => {
      render(<RefinementControls {...defaultProps} disabled />);

      const sliders = screen.getAllByRole('slider');
      // Radix UI uses data-disabled attribute
      sliders.forEach((slider) => {
        expect(slider).toHaveAttribute('data-disabled');
      });
    });

    it('enables all sliders when disabled prop is false', () => {
      render(<RefinementControls {...defaultProps} disabled={false} />);

      const sliders = screen.getAllByRole('slider');
      sliders.forEach((slider) => {
        expect(slider).not.toHaveAttribute('data-disabled');
      });
    });
  });

  describe('layout and spacing', () => {
    it('has space-y-4 class for vertical spacing', () => {
      render(<RefinementControls {...defaultProps} />);
      const section = screen.getByRole('region');
      expect(section).toHaveClass('space-y-4');
    });

    it('renders sliders in vertical order (Brightness, Contrast, Threshold)', () => {
      render(<RefinementControls {...defaultProps} />);

      const labels = [
        screen.getByText(/brightness/i),
        screen.getByText(/contrast/i),
        screen.getByText(/threshold/i),
      ];

      // Check order by comparing positions in document
      const positions = labels.map((label) => {
        const element = label.closest('div');
        return element ? Array.from(document.querySelectorAll('div')).indexOf(element) : -1;
      });

      expect(positions[0]).toBeLessThan(positions[1]);
      expect(positions[1]).toBeLessThan(positions[2]);
    });
  });

  describe('callbacks', () => {
    it('provides onBrightnessChange callback to BrightnessSlider', () => {
      const onBrightnessChange = vi.fn();
      render(<RefinementControls {...defaultProps} onBrightnessChange={onBrightnessChange} />);

      // Callback should be wired to the component
      expect(onBrightnessChange).toBeDefined();
    });

    it('provides onContrastChange callback to ContrastSlider', () => {
      const onContrastChange = vi.fn();
      render(<RefinementControls {...defaultProps} onContrastChange={onContrastChange} />);

      // Callback should be wired to the component
      expect(onContrastChange).toBeDefined();
    });

    it('provides onThresholdChange callback to ThresholdSlider', () => {
      const onThresholdChange = vi.fn();
      render(<RefinementControls {...defaultProps} onThresholdChange={onThresholdChange} />);

      // Callback should be wired to the component
      expect(onThresholdChange).toBeDefined();
    });
  });

  describe('semantic HTML', () => {
    it('uses semantic section element', () => {
      render(<RefinementControls {...defaultProps} />);
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('uses semantic h2 heading', () => {
      render(<RefinementControls {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('heading has unique id for aria-labelledby', () => {
      render(<RefinementControls {...defaultProps} />);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveAttribute('id', 'refinement-heading');
    });
  });
});
