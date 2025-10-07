import { useEffect, useRef, useCallback } from 'react';

export interface UseFocusTrapOptions {
  /**
   * Whether the focus trap is active
   */
  isActive: boolean;

  /**
   * Element to restore focus to when trap deactivates
   */
  returnFocusRef?: React.RefObject<HTMLElement | null>;

  /**
   * Callback when Escape key is pressed
   */
  onEscape?: () => void;

  /**
   * Whether to automatically focus first element on activation
   * @default true
   */
  autoFocus?: boolean;
}

/**
 * useFocusTrap - Trap keyboard focus within a container
 *
 * Features:
 * - Traps Tab/Shift+Tab within container
 * - Handles Escape key to close
 * - Auto-focuses first focusable element
 * - Restores focus on deactivation
 * - WCAG 2.4.3 compliant (Focus Order)
 *
 * @example
 * ```tsx
 * const triggerRef = useRef<HTMLButtonElement>(null);
 * const containerRef = useFocusTrap({
 *   isActive: isOpen,
 *   returnFocusRef: triggerRef,
 *   onEscape: () => setIsOpen(false),
 * });
 *
 * return (
 *   <>
 *     <button ref={triggerRef} onClick={() => setIsOpen(true)}>Open</button>
 *     {isOpen && <div ref={containerRef}>...</div>}
 *   </>
 * );
 * ```
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>({
  isActive,
  returnFocusRef,
  onEscape,
  autoFocus = true,
}: UseFocusTrapOptions) {
  const containerRef = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Get all focusable elements within container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors));
  }, []);

  // Handle Tab key to trap focus
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive || !containerRef.current) return;

      // Handle Escape key
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      // Handle Tab key
      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift+Tab: If on first element, move to last
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: If on last element, move to first
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [isActive, onEscape, getFocusableElements]
  );

  // Manage focus when trap activates/deactivates
  useEffect(() => {
    if (!isActive) {
      // Deactivating: Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
      return;
    }

    // Activating: Store current focus and move to container
    previousActiveElement.current = (document.activeElement as HTMLElement) || null;

    if (autoFocus && containerRef.current) {
      // Try to use returnFocusRef for context
      if (returnFocusRef?.current) {
        previousActiveElement.current = returnFocusRef.current;
      }

      // Focus first focusable element in container
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        // Fallback: Focus container itself if no focusable children
        containerRef.current.focus();
      }
    }
  }, [isActive, autoFocus, getFocusableElements, returnFocusRef]);

  // Add keyboard event listener
  useEffect(() => {
    if (!isActive) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handleKeyDown]);

  return containerRef;
}
