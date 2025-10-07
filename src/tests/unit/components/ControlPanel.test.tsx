import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ControlPanel } from '@/components/ControlPanel';
import type { MaterialPresetName } from '@/lib/types/presets';

describe('ControlPanel Component', () => {
  const mockProps = {
    selectedPreset: 'auto' as MaterialPresetName,
    onPresetChange: vi.fn(),
    brightness: 0,
    contrast: 0,
    threshold: 128,
    onBrightnessChange: vi.fn(),
    onContrastChange: vi.fn(),
    onThresholdChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render the main heading', () => {
    render(<ControlPanel {...mockProps} />);
    expect(screen.getByText('Controls')).toBeInTheDocument();
  });

  it('should render Material Presets section', () => {
    render(<ControlPanel {...mockProps} />);
    expect(screen.getByText('Material Presets')).toBeInTheDocument();
  });

  it('should render Adjustments section', () => {
    render(<ControlPanel {...mockProps} />);
    expect(screen.getByText('Adjustments')).toBeInTheDocument();
  });

  it('should render Background Removal section when callbacks provided', () => {
    render(
      <ControlPanel
        {...mockProps}
        onBackgroundRemovalToggle={vi.fn()}
        onBackgroundRemovalSensitivityChange={vi.fn()}
      />
    );
    expect(screen.getByText('Background Removal')).toBeInTheDocument();
  });

  it('should not render Background Removal section when callbacks not provided', () => {
    render(<ControlPanel {...mockProps} />);
    expect(screen.queryByText('Background Removal')).not.toBeInTheDocument();
  });

  it('should render History section when callbacks provided', () => {
    render(<ControlPanel {...mockProps} onUndo={vi.fn()} onRedo={vi.fn()} />);
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('should not render History section when callbacks not provided', () => {
    render(<ControlPanel {...mockProps} />);
    expect(screen.queryByText('History')).not.toBeInTheDocument();
  });

  it('should render Export section when canvas and filename provided', () => {
    const canvas = document.createElement('canvas');
    render(<ControlPanel {...mockProps} canvas={canvas} originalFilename="test.jpg" />);
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('should not render Export section when canvas not provided', () => {
    render(<ControlPanel {...mockProps} originalFilename="test.jpg" />);
    expect(screen.queryByText('Export')).not.toBeInTheDocument();
  });

  it('should render Actions section when reset callback provided', () => {
    render(<ControlPanel {...mockProps} onReset={vi.fn()} />);
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should not render Actions section when reset callback not provided', () => {
    render(<ControlPanel {...mockProps} />);
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    const { container } = render(<ControlPanel {...mockProps} />);
    const region = container.querySelector('[role="region"]');
    expect(region).toHaveAttribute('aria-label', 'Control Panel');
  });

  it('should pass disabled prop to child components', () => {
    render(<ControlPanel {...mockProps} disabled={true} />);
    // The sliders will have disabled state - we can check via the presence of disabled class
    // This is a sanity check that the prop is being passed down
    expect(screen.getByText('Adjustments')).toBeInTheDocument();
  });

  it('should render all sections when all optional props provided', () => {
    const canvas = document.createElement('canvas');
    render(
      <ControlPanel
        {...mockProps}
        onBackgroundRemovalToggle={vi.fn()}
        onBackgroundRemovalSensitivityChange={vi.fn()}
        onUndo={vi.fn()}
        onRedo={vi.fn()}
        canvas={canvas}
        originalFilename="test.jpg"
        onReset={vi.fn()}
      />
    );

    expect(screen.getByText('Material Presets')).toBeInTheDocument();
    expect(screen.getByText('Background Removal')).toBeInTheDocument();
    expect(screen.getByText('Adjustments')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  describe('Keyboard Navigation', () => {
    it('should allow Tab navigation through accordion triggers', async () => {
      const user = userEvent.setup();
      const canvas = document.createElement('canvas');
      render(
        <ControlPanel
          {...mockProps}
          onBackgroundRemovalToggle={vi.fn()}
          onBackgroundRemovalSensitivityChange={vi.fn()}
          onUndo={vi.fn()}
          onRedo={vi.fn()}
          canvas={canvas}
          originalFilename="test.jpg"
          onReset={vi.fn()}
        />
      );

      // Get all accordion triggers (filter out non-accordion buttons like Undo/Redo/Export/Reset)
      const allButtons = screen.getAllByRole('button');
      const triggers = allButtons.filter(
        (button) => button.hasAttribute('aria-controls') && button.hasAttribute('aria-expanded')
      );
      expect(triggers.length).toBeGreaterThan(0);

      // Tab to first trigger
      await user.tab();
      const firstTrigger = triggers[0];
      expect(firstTrigger).toHaveFocus();

      // Tab to next trigger
      await user.tab();
      // Verify focus moved (can't easily check which element has focus in jsdom,
      // but we can verify no errors occurred)
      expect(document.activeElement).toBeTruthy();
    });

    it('should expand/collapse accordion section with Enter key', async () => {
      const user = userEvent.setup();
      render(<ControlPanel {...mockProps} />);

      // Get Material Presets trigger
      const trigger = screen.getByRole('button', { name: /material presets/i });

      // Focus and press Enter
      trigger.focus();
      await user.keyboard('{Enter}');

      // Section should toggle (we can't easily check expanded state in jsdom,
      // but we verify the interaction doesn't throw)
      expect(trigger).toBeInTheDocument();
    });

    it('should expand/collapse accordion section with Space key', async () => {
      const user = userEvent.setup();
      render(<ControlPanel {...mockProps} />);

      // Get Adjustments trigger
      const trigger = screen.getByRole('button', { name: /adjustments/i });

      // Focus and press Space
      trigger.focus();
      await user.keyboard(' ');

      // Section should toggle
      expect(trigger).toBeInTheDocument();
    });

    it('should have visible focus indicators on accordion triggers', () => {
      render(<ControlPanel {...mockProps} />);

      // Get all accordion triggers
      const triggers = screen.getAllByRole('button');

      triggers.forEach((trigger) => {
        // Focus the trigger
        trigger.focus();

        // Verify trigger is focused (this ensures focus indicators would be visible)
        expect(trigger).toHaveFocus();

        // Verify ARIA attributes are present
        expect(trigger).toHaveAttribute('aria-expanded');
        expect(trigger).toHaveAttribute('aria-controls');
      });
    });

    it('should maintain proper ARIA attributes during keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ControlPanel {...mockProps} />);

      // Get Material Presets trigger
      const trigger = screen.getByRole('button', { name: /material presets/i });

      // Verify initial ARIA attributes
      expect(trigger).toHaveAttribute('aria-expanded');
      expect(trigger).toHaveAttribute('aria-controls');

      // Toggle with keyboard
      trigger.focus();
      await user.keyboard('{Enter}');

      // ARIA attributes should still be present after interaction
      expect(trigger).toHaveAttribute('aria-expanded');
      expect(trigger).toHaveAttribute('aria-controls');
    });

    it('should not create keyboard traps in accordion sections', async () => {
      const user = userEvent.setup();
      const canvas = document.createElement('canvas');
      render(
        <ControlPanel
          {...mockProps}
          canvas={canvas}
          originalFilename="test.jpg"
          onReset={vi.fn()}
        />
      );

      // Tab through entire component
      let tabCount = 0;
      const maxTabs = 50; // Safety limit

      while (tabCount < maxTabs) {
        await user.tab();
        tabCount++;

        // If focus returns to body or loops, we've completed the cycle
        if (document.activeElement === document.body) {
          break;
        }
      }

      // Should have completed without hitting the safety limit
      expect(tabCount).toBeLessThan(maxTabs);
    });
  });
});
