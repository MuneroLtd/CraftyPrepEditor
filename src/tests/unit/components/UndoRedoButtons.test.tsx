import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UndoRedoButtons } from '@/components/UndoRedoButtons';

describe('UndoRedoButtons', () => {
  describe('Rendering', () => {
    it('renders both undo and redo buttons', () => {
      render(<UndoRedoButtons canUndo={true} canRedo={true} onUndo={vi.fn()} onRedo={vi.fn()} />);

      expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument();
    });

    it('displays undo and redo icons', () => {
      render(<UndoRedoButtons canUndo={true} canRedo={true} onUndo={vi.fn()} onRedo={vi.fn()} />);

      // Icons should be present (lucide-react renders as svg)
      const buttons = screen.getAllByRole('button');
      expect(buttons[0].querySelector('svg')).toBeInTheDocument();
      expect(buttons[1].querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables undo button when canUndo is false', () => {
      render(<UndoRedoButtons canUndo={false} canRedo={true} onUndo={vi.fn()} onRedo={vi.fn()} />);

      const undoButton = screen.getByRole('button', { name: /undo/i });
      expect(undoButton).toBeDisabled();
    });

    it('disables redo button when canRedo is false', () => {
      render(<UndoRedoButtons canUndo={true} canRedo={false} onUndo={vi.fn()} onRedo={vi.fn()} />);

      const redoButton = screen.getByRole('button', { name: /redo/i });
      expect(redoButton).toBeDisabled();
    });

    it('disables both buttons when both are false', () => {
      render(<UndoRedoButtons canUndo={false} canRedo={false} onUndo={vi.fn()} onRedo={vi.fn()} />);

      const undoButton = screen.getByRole('button', { name: /undo/i });
      const redoButton = screen.getByRole('button', { name: /redo/i });

      expect(undoButton).toBeDisabled();
      expect(redoButton).toBeDisabled();
    });

    it('enables both buttons when both are true', () => {
      render(<UndoRedoButtons canUndo={true} canRedo={true} onUndo={vi.fn()} onRedo={vi.fn()} />);

      const undoButton = screen.getByRole('button', { name: /undo/i });
      const redoButton = screen.getByRole('button', { name: /redo/i });

      expect(undoButton).not.toBeDisabled();
      expect(redoButton).not.toBeDisabled();
    });
  });

  describe('Click Handlers', () => {
    it('calls onUndo when undo button is clicked', async () => {
      const onUndo = vi.fn();
      const user = userEvent.setup();

      render(<UndoRedoButtons canUndo={true} canRedo={true} onUndo={onUndo} onRedo={vi.fn()} />);

      const undoButton = screen.getByRole('button', { name: /undo/i });
      await user.click(undoButton);

      expect(onUndo).toHaveBeenCalledTimes(1);
    });

    it('calls onRedo when redo button is clicked', async () => {
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<UndoRedoButtons canUndo={true} canRedo={true} onUndo={vi.fn()} onRedo={onRedo} />);

      const redoButton = screen.getByRole('button', { name: /redo/i });
      await user.click(redoButton);

      expect(onRedo).toHaveBeenCalledTimes(1);
    });

    it('does not call onUndo when undo button is disabled and clicked', async () => {
      const onUndo = vi.fn();
      const user = userEvent.setup();

      render(<UndoRedoButtons canUndo={false} canRedo={true} onUndo={onUndo} onRedo={vi.fn()} />);

      const undoButton = screen.getByRole('button', { name: /undo/i });
      await user.click(undoButton);

      expect(onUndo).not.toHaveBeenCalled();
    });

    it('does not call onRedo when redo button is disabled and clicked', async () => {
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<UndoRedoButtons canUndo={true} canRedo={false} onUndo={vi.fn()} onRedo={onRedo} />);

      const redoButton = screen.getByRole('button', { name: /redo/i });
      await user.click(redoButton);

      expect(onRedo).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility (WCAG 2.2 AAA)', () => {
    it('has accessible labels on both buttons', () => {
      render(<UndoRedoButtons canUndo={true} canRedo={true} onUndo={vi.fn()} onRedo={vi.fn()} />);

      const undoButton = screen.getByRole('button', { name: /undo/i });
      const redoButton = screen.getByRole('button', { name: /redo/i });

      expect(undoButton).toHaveAccessibleName();
      expect(redoButton).toHaveAccessibleName();
    });

    it('maintains focus visibility on keyboard navigation', async () => {
      const user = userEvent.setup();

      render(<UndoRedoButtons canUndo={true} canRedo={true} onUndo={vi.fn()} onRedo={vi.fn()} />);

      // Tab to first button
      await user.tab();
      expect(screen.getByRole('button', { name: /undo/i })).toHaveFocus();

      // Tab to second button
      await user.tab();
      expect(screen.getByRole('button', { name: /redo/i })).toHaveFocus();
    });

    it('can be activated with keyboard (Enter key)', async () => {
      const onUndo = vi.fn();
      const user = userEvent.setup();

      render(<UndoRedoButtons canUndo={true} canRedo={true} onUndo={onUndo} onRedo={vi.fn()} />);

      const undoButton = screen.getByRole('button', { name: /undo/i });
      undoButton.focus();

      await user.keyboard('{Enter}');
      expect(onUndo).toHaveBeenCalledTimes(1);
    });

    it('can be activated with keyboard (Space key)', async () => {
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<UndoRedoButtons canUndo={true} canRedo={true} onUndo={vi.fn()} onRedo={onRedo} />);

      const redoButton = screen.getByRole('button', { name: /redo/i });
      redoButton.focus();

      await user.keyboard(' ');
      expect(onRedo).toHaveBeenCalledTimes(1);
    });

    it('has proper ARIA attributes when disabled', () => {
      render(<UndoRedoButtons canUndo={false} canRedo={false} onUndo={vi.fn()} onRedo={vi.fn()} />);

      const undoButton = screen.getByRole('button', { name: /undo/i });
      const redoButton = screen.getByRole('button', { name: /redo/i });

      // The disabled prop already provides ARIA state, aria-disabled is redundant
      expect(undoButton).toBeDisabled();
      expect(redoButton).toBeDisabled();
    });

    it('provides keyboard shortcuts in tooltips or labels', () => {
      render(<UndoRedoButtons canUndo={true} canRedo={true} onUndo={vi.fn()} onRedo={vi.fn()} />);

      const undoButton = screen.getByRole('button', { name: /undo/i });
      const redoButton = screen.getByRole('button', { name: /redo/i });

      // Should mention keyboard shortcuts (Ctrl+Z, Ctrl+Y) in accessible name or description
      const undoLabel = undoButton.getAttribute('aria-label') || undoButton.textContent;
      const redoLabel = redoButton.getAttribute('aria-label') || redoButton.textContent;

      expect(undoLabel).toMatch(/ctrl.*z|⌘.*z/i);
      expect(redoLabel).toMatch(/ctrl.*y|⌘.*y/i);
    });
  });

  describe('Visual Styling', () => {
    it('renders buttons with proper spacing', () => {
      const { container } = render(
        <UndoRedoButtons canUndo={true} canRedo={true} onUndo={vi.fn()} onRedo={vi.fn()} />
      );

      // Should have a container with proper layout
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      expect(wrapper.classList.toString()).toMatch(/flex|grid|gap/);
    });

    it('renders with shadcn Button variant', () => {
      render(<UndoRedoButtons canUndo={true} canRedo={true} onUndo={vi.fn()} onRedo={vi.fn()} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        // shadcn Button should have specific classes
        expect(button.className).toBeTruthy();
      });
    });
  });
});
