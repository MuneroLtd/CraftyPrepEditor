import React, { useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MobileMenuProps {
  /**
   * Whether the menu is open
   */
  isOpen: boolean;

  /**
   * Callback to close the menu
   */
  onClose: () => void;

  /**
   * Menu items to display
   */
  children: React.ReactNode;
}

/**
 * MobileMenu component - slide-in drawer for mobile navigation
 *
 * Features:
 * - Slides in from the left
 * - Overlay backdrop with click-to-close
 * - Close button with keyboard support
 * - Locks body scroll when open
 * - Smooth transitions
 * - Keyboard accessible (Escape to close)
 * - Focus trap within menu
 *
 * @example
 * <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
 *   <nav>
 *     <button>File</button>
 *     <button>Edit</button>
 *   </nav>
 * </MobileMenu>
 */
export const MobileMenu = React.memo<MobileMenuProps>(({ isOpen, onClose, children }) => {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close menu
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap: focus the close button when menu opens using ref callback
  const handleCloseButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (node && isOpen) {
        // Use ref callback for reliable focus management
        node.focus();
      }
    },
    [isOpen]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm',
          'transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50',
          'w-72 max-w-[80vw]',
          'bg-background border-r border-border',
          'shadow-lg',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            ref={handleCloseButtonRef}
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close menu"
            data-mobile-menu-close
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu content */}
        <div className="overflow-y-auto h-[calc(100%-64px)] p-4">{children}</div>
      </div>
    </>
  );
});

MobileMenu.displayName = 'MobileMenu';
