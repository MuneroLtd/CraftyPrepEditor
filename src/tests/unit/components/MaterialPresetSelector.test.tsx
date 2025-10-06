import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MaterialPresetSelector } from '@/components/MaterialPresetSelector';
import type { MaterialPresetName } from '@/lib/types/presets';

describe('MaterialPresetSelector', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      const onChange = vi.fn();
      render(<MaterialPresetSelector value="auto" onChange={onChange} />);

      expect(screen.getByLabelText(/material preset/i)).toBeInTheDocument();
    });

    it('should render label', () => {
      const onChange = vi.fn();
      render(<MaterialPresetSelector value="auto" onChange={onChange} />);

      expect(screen.getByText('Material Preset')).toBeInTheDocument();
    });

    it('should display current preset description', () => {
      const onChange = vi.fn();
      render(<MaterialPresetSelector value="auto" onChange={onChange} />);

      expect(screen.getByText(/default auto-prep settings/i)).toBeInTheDocument();
    });

    it('should display wood preset description when wood selected', () => {
      const onChange = vi.fn();
      render(<MaterialPresetSelector value="wood" onChange={onChange} />);

      expect(screen.getByText(/optimized for pine, oak, walnut/i)).toBeInTheDocument();
    });

    it('should display glass preset description when glass selected', () => {
      const onChange = vi.fn();
      render(<MaterialPresetSelector value="glass" onChange={onChange} />);

      expect(screen.getByText(/optimized for glass etching/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const onChange = vi.fn();
      render(<MaterialPresetSelector value="auto" onChange={onChange} />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-label', 'Select material preset');
    });

    it('should associate label with select', () => {
      const onChange = vi.fn();
      render(<MaterialPresetSelector value="auto" onChange={onChange} />);

      const label = screen.getByText('Material Preset');
      const select = screen.getByRole('combobox');

      expect(label).toHaveAttribute('for', 'material-preset');
      expect(select).toHaveAttribute('id', 'material-preset');
    });

    it('should be keyboard accessible', () => {
      const onChange = vi.fn();
      render(<MaterialPresetSelector value="auto" onChange={onChange} />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).not.toHaveAttribute('disabled');
    });

    it('should support disabled state', () => {
      const onChange = vi.fn();
      render(<MaterialPresetSelector value="auto" onChange={onChange} disabled />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('disabled');
    });
  });

  describe('User Interaction', () => {
    it('should display current selected value', () => {
      const onChange = vi.fn();
      const { rerender } = render(<MaterialPresetSelector value="auto" onChange={onChange} />);

      let trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('Auto');

      rerender(<MaterialPresetSelector value="wood" onChange={onChange} />);
      trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('Wood');

      rerender(<MaterialPresetSelector value="leather" onChange={onChange} />);
      trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('Leather');
    });

    it('should accept custom className', () => {
      const onChange = vi.fn();
      const { container } = render(
        <MaterialPresetSelector value="auto" onChange={onChange} className="custom-class" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Preset Options', () => {
    it('should render select trigger for preset selection', () => {
      const onChange = vi.fn();
      render(<MaterialPresetSelector value="auto" onChange={onChange} />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-label', 'Select material preset');
    });

    it('should have proper component structure', () => {
      const onChange = vi.fn();
      render(<MaterialPresetSelector value="auto" onChange={onChange} />);

      // Label should exist
      expect(screen.getByText('Material Preset')).toBeInTheDocument();

      // Select trigger should exist
      expect(screen.getByRole('combobox')).toBeInTheDocument();

      // Description should exist
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle all preset values', () => {
      const onChange = vi.fn();
      const presets: MaterialPresetName[] = [
        'auto',
        'wood',
        'leather',
        'acrylic',
        'glass',
        'metal',
        'custom',
      ];

      presets.forEach((preset) => {
        const { unmount } = render(<MaterialPresetSelector value={preset} onChange={onChange} />);
        const trigger = screen.getByRole('combobox');
        expect(trigger).toBeInTheDocument();
        unmount();
      });
    });

    it('should render without crashing when disabled', () => {
      const onChange = vi.fn();
      const { container } = render(
        <MaterialPresetSelector value="auto" onChange={onChange} disabled />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should update description when value changes', () => {
      const onChange = vi.fn();
      const { rerender } = render(<MaterialPresetSelector value="auto" onChange={onChange} />);

      expect(screen.getByText(/default auto-prep settings/i)).toBeInTheDocument();

      rerender(<MaterialPresetSelector value="wood" onChange={onChange} />);
      expect(screen.getByText(/optimized for pine, oak, walnut/i)).toBeInTheDocument();

      rerender(<MaterialPresetSelector value="custom" onChange={onChange} />);
      expect(screen.getByText(/user-defined settings/i)).toBeInTheDocument();
    });
  });
});
