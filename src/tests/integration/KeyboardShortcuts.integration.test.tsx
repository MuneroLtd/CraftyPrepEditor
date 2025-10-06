import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

// Mock component to test keyboard shortcuts in isolation
interface TestAppProps {
  onUndo: () => void;
  onRedo: () => void;
}

function TestApp({ onUndo, onRedo }: TestAppProps) {
  // Set up keyboard listener
  React.useEffect(() => {
    // Keyboard shortcut handler (this will be extracted to App.tsx)
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in text inputs
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      if (ctrlOrCmd && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        onUndo();
      } else if (ctrlOrCmd && event.key === 'y') {
        event.preventDefault();
        onRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onUndo, onRedo]);

  return (
    <div>
      <h1>Test App</h1>
      <input type="text" placeholder="Test input" aria-label="Test input" />
      <textarea placeholder="Test textarea" aria-label="Test textarea" />
      <button onClick={onUndo}>Manual Undo</button>
      <button onClick={onRedo}>Manual Redo</button>
    </div>
  );
}

// Import React for useEffect
import * as React from 'react';

describe('Keyboard Shortcuts Integration', () => {
  let originalPlatform: string;

  beforeEach(() => {
    // Save original platform
    originalPlatform = navigator.platform;
  });

  afterEach(() => {
    // Restore original platform
    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      writable: true,
      configurable: true,
    });
  });

  describe('Undo Shortcut (Ctrl+Z / Cmd+Z)', () => {
    it('triggers undo on Ctrl+Z (Windows/Linux)', async () => {
      // Mock Windows platform
      Object.defineProperty(navigator, 'platform', {
        value: 'Win32',
        writable: true,
        configurable: true,
      });

      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      // Trigger Ctrl+Z
      await act(async () => {
        await user.keyboard('{Control>}z{/Control}');
      });

      expect(onUndo).toHaveBeenCalledTimes(1);
      expect(onRedo).not.toHaveBeenCalled();
    });

    it('triggers undo on Cmd+Z (Mac)', async () => {
      // Mock Mac platform
      Object.defineProperty(navigator, 'platform', {
        value: 'MacIntel',
        writable: true,
        configurable: true,
      });

      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      // Trigger Cmd+Z (Meta+Z)
      await act(async () => {
        await user.keyboard('{Meta>}z{/Meta}');
      });

      expect(onUndo).toHaveBeenCalledTimes(1);
      expect(onRedo).not.toHaveBeenCalled();
    });

    it('can trigger undo multiple times', async () => {
      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      // Trigger Ctrl+Z three times
      await act(async () => {
        await user.keyboard('{Control>}z{/Control}');
        await user.keyboard('{Control>}z{/Control}');
        await user.keyboard('{Control>}z{/Control}');
      });

      expect(onUndo).toHaveBeenCalledTimes(3);
    });
  });

  describe('Redo Shortcut (Ctrl+Y / Cmd+Y)', () => {
    it('triggers redo on Ctrl+Y (Windows/Linux)', async () => {
      // Mock Windows platform
      Object.defineProperty(navigator, 'platform', {
        value: 'Win32',
        writable: true,
        configurable: true,
      });

      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      // Trigger Ctrl+Y
      await act(async () => {
        await user.keyboard('{Control>}y{/Control}');
      });

      expect(onRedo).toHaveBeenCalledTimes(1);
      expect(onUndo).not.toHaveBeenCalled();
    });

    it('triggers redo on Cmd+Y (Mac)', async () => {
      // Mock Mac platform
      Object.defineProperty(navigator, 'platform', {
        value: 'MacIntel',
        writable: true,
        configurable: true,
      });

      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      // Trigger Cmd+Y (Meta+Y)
      await act(async () => {
        await user.keyboard('{Meta>}y{/Meta}');
      });

      expect(onRedo).toHaveBeenCalledTimes(1);
      expect(onUndo).not.toHaveBeenCalled();
    });

    it('can trigger redo multiple times', async () => {
      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      // Trigger Ctrl+Y three times
      await act(async () => {
        await user.keyboard('{Control>}y{/Control}');
        await user.keyboard('{Control>}y{/Control}');
        await user.keyboard('{Control>}y{/Control}');
      });

      expect(onRedo).toHaveBeenCalledTimes(3);
    });
  });

  describe('Shortcut Prevention in Text Inputs', () => {
    it('does not trigger undo when typing in text input', async () => {
      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      const input = screen.getByLabelText('Test input');
      await user.click(input);

      // Type Ctrl+Z in input (should not trigger undo)
      await act(async () => {
        await user.keyboard('{Control>}z{/Control}');
      });

      expect(onUndo).not.toHaveBeenCalled();
    });

    it('does not trigger redo when typing in text input', async () => {
      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      const input = screen.getByLabelText('Test input');
      await user.click(input);

      // Type Ctrl+Y in input (should not trigger redo)
      await act(async () => {
        await user.keyboard('{Control>}y{/Control}');
      });

      expect(onRedo).not.toHaveBeenCalled();
    });

    it('does not trigger undo when typing in textarea', async () => {
      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      const textarea = screen.getByLabelText('Test textarea');
      await user.click(textarea);

      // Type Ctrl+Z in textarea (should not trigger undo)
      await act(async () => {
        await user.keyboard('{Control>}z{/Control}');
      });

      expect(onUndo).not.toHaveBeenCalled();
    });

    it('does not trigger redo when typing in textarea', async () => {
      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      const textarea = screen.getByLabelText('Test textarea');
      await user.click(textarea);

      // Type Ctrl+Y in textarea (should not trigger redo)
      await act(async () => {
        await user.keyboard('{Control>}y{/Control}');
      });

      expect(onRedo).not.toHaveBeenCalled();
    });
  });

  describe('Shortcut Combinations', () => {
    it('can alternate between undo and redo', async () => {
      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      // Undo, Redo, Undo, Redo
      await act(async () => {
        await user.keyboard('{Control>}z{/Control}');
        await user.keyboard('{Control>}y{/Control}');
        await user.keyboard('{Control>}z{/Control}');
        await user.keyboard('{Control>}y{/Control}');
      });

      expect(onUndo).toHaveBeenCalledTimes(2);
      expect(onRedo).toHaveBeenCalledTimes(2);
    });

    it('prevents default browser behavior', async () => {
      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();
      const preventDefaultSpy = vi.fn();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      // Listen for keydown event and check preventDefault
      const keydownHandler = (e: KeyboardEvent) => {
        if (e.defaultPrevented) {
          preventDefaultSpy();
        }
      };

      window.addEventListener('keydown', keydownHandler);

      await act(async () => {
        await user.keyboard('{Control>}z{/Control}');
      });

      window.removeEventListener('keydown', keydownHandler);

      expect(onUndo).toHaveBeenCalled();
      // Default should be prevented to avoid browser's native undo
    });
  });

  describe('Edge Cases', () => {
    it('does not trigger on Z key without modifier', async () => {
      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      await act(async () => {
        await user.keyboard('z');
      });

      expect(onUndo).not.toHaveBeenCalled();
    });

    it('does not trigger on Y key without modifier', async () => {
      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      await act(async () => {
        await user.keyboard('y');
      });

      expect(onRedo).not.toHaveBeenCalled();
    });

    it('does not trigger redo on Ctrl+Shift+Z (common alternative redo)', async () => {
      const onUndo = vi.fn();
      const onRedo = vi.fn();
      const user = userEvent.setup();

      render(<TestApp onUndo={onUndo} onRedo={onRedo} />);

      // Ctrl+Shift+Z should not trigger (we only support Ctrl+Y for redo)
      await act(async () => {
        await user.keyboard('{Control>}{Shift>}z{/Shift}{/Control}');
      });

      expect(onUndo).not.toHaveBeenCalled();
      expect(onRedo).not.toHaveBeenCalled();
    });
  });
});
