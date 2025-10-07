import { useEffect, useRef, useCallback } from 'react';

export interface UseClickOutsideOptions {
  /**
   * Whether the click outside handler is active
   */
  isActive: boolean;

  /**
   * Callback when clicking outside the element
   */
  onClickOutside: () => void;

  /**
   * Additional refs to exclude from "outside" detection
   * Useful for trigger buttons that should not close the element
   */
  excludeRefs?: React.RefObject<HTMLElement | null>[];
}

/**
 * useClickOutside - Detect clicks outside an element
 *
 * Features:
 * - Calls callback when clicking outside element
 * - Supports excluding specific elements (e.g., trigger buttons)
 * - Only active when specified
 * - Handles both mouse and touch events
 *
 * @example
 * ```tsx
 * const triggerRef = useRef<HTMLButtonElement>(null);
 * const panelRef = useClickOutside({
 *   isActive: isOpen,
 *   onClickOutside: () => setIsOpen(false),
 *   excludeRefs: [triggerRef],
 * });
 *
 * return (
 *   <>
 *     <button ref={triggerRef}>Toggle</button>
 *     {isOpen && <div ref={panelRef}>Panel content</div>}
 *   </>
 * );
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>({
  isActive,
  onClickOutside,
  excludeRefs = [],
}: UseClickOutsideOptions) {
  const elementRef = useRef<T>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isActive || !elementRef.current) return;

      const target = event.target as Node;

      // Check if click is inside the element
      if (elementRef.current.contains(target)) {
        return;
      }

      // Check if click is inside any excluded elements
      for (const excludeRef of excludeRefs) {
        if (excludeRef.current?.contains(target)) {
          return;
        }
      }

      // Click is outside - trigger callback
      onClickOutside();
    },
    [isActive, onClickOutside, excludeRefs]
  );

  useEffect(() => {
    if (!isActive) return;

    // Use capture phase to handle clicks before they bubble
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isActive, handleClickOutside]);

  return elementRef;
}
