import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import userEvent from '@testing-library/user-event';

describe('useFocusTrap', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should trap focus within container when active', async () => {
    const user = userEvent.setup();

    function TestComponent() {
      const containerRef = useFocusTrap({ isActive: true });

      return (
        <div>
          <button>Outside Before</button>
          <div ref={containerRef as React.Ref<HTMLDivElement>} tabIndex={-1}>
            <button data-testid="first">First</button>
            <button data-testid="middle">Middle</button>
            <button data-testid="last">Last</button>
          </div>
          <button>Outside After</button>
        </div>
      );
    }

    render(<TestComponent />);

    // First element should be auto-focused
    expect(screen.getByTestId('first')).toHaveFocus();

    // Tab to last element
    await user.tab();
    expect(screen.getByTestId('middle')).toHaveFocus();
    await user.tab();
    expect(screen.getByTestId('last')).toHaveFocus();

    // Tab wraps to first
    await user.tab();
    expect(screen.getByTestId('first')).toHaveFocus();
  });

  it('should handle Shift+Tab to cycle backwards', async () => {
    const user = userEvent.setup();

    function TestComponent() {
      const containerRef = useFocusTrap({ isActive: true });

      return (
        <div ref={containerRef as React.Ref<HTMLDivElement>} tabIndex={-1}>
          <button data-testid="first">First</button>
          <button data-testid="last">Last</button>
        </div>
      );
    }

    render(<TestComponent />);

    // First element is auto-focused
    expect(screen.getByTestId('first')).toHaveFocus();

    // Shift+Tab wraps to last
    await user.tab({ shift: true });
    expect(screen.getByTestId('last')).toHaveFocus();

    // Shift+Tab wraps to first
    await user.tab({ shift: true });
    expect(screen.getByTestId('first')).toHaveFocus();
  });

  it('should call onEscape when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();

    function TestComponent() {
      const containerRef = useFocusTrap({ isActive: true, onEscape });

      return (
        <div ref={containerRef as React.Ref<HTMLDivElement>} tabIndex={-1}>
          <button>Button</button>
        </div>
      );
    }

    render(<TestComponent />);

    await user.keyboard('{Escape}');

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('should restore focus when deactivated', () => {
    function TestComponent({ isActive }: { isActive: boolean }) {
      const triggerRef = useRef<HTMLButtonElement>(null);
      const containerRef = useFocusTrap({
        isActive,
        returnFocusRef: triggerRef,
      });

      return (
        <div>
          <button ref={triggerRef} data-testid="trigger">
            Trigger
          </button>
          {isActive && (
            <div ref={containerRef as React.Ref<HTMLDivElement>} tabIndex={-1}>
              <button data-testid="inside">Inside</button>
            </div>
          )}
        </div>
      );
    }

    const { rerender } = render(<TestComponent isActive={false} />);

    // Focus trigger
    screen.getByTestId('trigger').focus();
    expect(screen.getByTestId('trigger')).toHaveFocus();

    // Activate trap
    rerender(<TestComponent isActive={true} />);

    // Focus should move to inside button
    expect(screen.getByTestId('inside')).toHaveFocus();

    // Deactivate trap
    rerender(<TestComponent isActive={false} />);

    // Focus should return to trigger
    expect(screen.getByTestId('trigger')).toHaveFocus();
  });

  it('should not auto-focus when autoFocus is false', () => {
    function TestComponent() {
      const containerRef = useFocusTrap({ isActive: true, autoFocus: false });

      return (
        <div ref={containerRef as React.Ref<HTMLDivElement>} tabIndex={-1}>
          <button data-testid="button">Button</button>
        </div>
      );
    }

    render(<TestComponent />);

    // Button should NOT be auto-focused
    expect(screen.getByTestId('button')).not.toHaveFocus();
  });

  it('should do nothing when not active', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();

    function TestComponent() {
      const containerRef = useFocusTrap({ isActive: false, onEscape });

      return (
        <div>
          <button data-testid="outside">Outside</button>
          <div ref={containerRef as React.Ref<HTMLDivElement>} tabIndex={-1}>
            <button data-testid="inside">Inside</button>
          </div>
        </div>
      );
    }

    render(<TestComponent />);

    // Focus outside
    screen.getByTestId('outside').focus();

    // Escape should not call onEscape
    await user.keyboard('{Escape}');
    expect(onEscape).not.toHaveBeenCalled();

    // Tab should work normally (not trapped)
    await user.tab();
    expect(screen.getByTestId('inside')).toHaveFocus();
  });
});
