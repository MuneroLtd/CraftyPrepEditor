import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useClickOutside } from '../../../hooks/useClickOutside';

describe('useClickOutside', () => {
  it('should call onClickOutside when clicking outside element', () => {
    const onClickOutside = vi.fn();

    function TestComponent() {
      const ref = useClickOutside({ isActive: true, onClickOutside });

      return (
        <div>
          <button data-testid="outside">Outside</button>
          <div ref={ref as React.Ref<HTMLDivElement>} data-testid="inside">
            <button>Inside Button</button>
          </div>
        </div>
      );
    }

    render(<TestComponent />);

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('should not call onClickOutside when clicking inside element', () => {
    const onClickOutside = vi.fn();

    function TestComponent() {
      const ref = useClickOutside({ isActive: true, onClickOutside });

      return (
        <div>
          <div ref={ref as React.Ref<HTMLDivElement>} data-testid="inside">
            <button data-testid="inside-button">Inside Button</button>
          </div>
        </div>
      );
    }

    render(<TestComponent />);

    // Click inside
    fireEvent.mouseDown(screen.getByTestId('inside-button'));

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('should exclude refs from outside detection', () => {
    const onClickOutside = vi.fn();

    function TestComponent() {
      const triggerRef = useRef<HTMLButtonElement>(null);
      const panelRef = useClickOutside({
        isActive: true,
        onClickOutside,
        excludeRefs: [triggerRef],
      });

      return (
        <div>
          <button ref={triggerRef} data-testid="trigger">
            Trigger
          </button>
          <div ref={panelRef as React.Ref<HTMLDivElement>} data-testid="panel">
            Panel
          </div>
          <button data-testid="outside">Outside</button>
        </div>
      );
    }

    render(<TestComponent />);

    // Click on excluded trigger (should not close)
    fireEvent.mouseDown(screen.getByTestId('trigger'));
    expect(onClickOutside).not.toHaveBeenCalled();

    // Click on panel (should not close)
    fireEvent.mouseDown(screen.getByTestId('panel'));
    expect(onClickOutside).not.toHaveBeenCalled();

    // Click truly outside (should close)
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('should handle touch events', () => {
    const onClickOutside = vi.fn();

    function TestComponent() {
      const ref = useClickOutside({ isActive: true, onClickOutside });

      return (
        <div>
          <button data-testid="outside">Outside</button>
          <div ref={ref as React.Ref<HTMLDivElement>} data-testid="inside">
            Inside
          </div>
        </div>
      );
    }

    render(<TestComponent />);

    // Touch outside
    fireEvent.touchStart(screen.getByTestId('outside'));

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('should do nothing when not active', () => {
    const onClickOutside = vi.fn();

    function TestComponent() {
      const ref = useClickOutside({ isActive: false, onClickOutside });

      return (
        <div>
          <button data-testid="outside">Outside</button>
          <div ref={ref as React.Ref<HTMLDivElement>} data-testid="inside">
            Inside
          </div>
        </div>
      );
    }

    render(<TestComponent />);

    // Click outside (should not trigger callback)
    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('should cleanup event listeners on unmount', () => {
    const onClickOutside = vi.fn();
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    function TestComponent() {
      const ref = useClickOutside({ isActive: true, onClickOutside });

      return <div ref={ref as React.Ref<HTMLDivElement>}>Content</div>;
    }

    const { unmount } = render(<TestComponent />);

    // Should add event listeners
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true);
    expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), true);

    unmount();

    // Should remove event listeners
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), true);

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
