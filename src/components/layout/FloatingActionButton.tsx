import React from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Menu, Wrench, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FloatingActionButtonProps {
  /**
   * Callback when "Tools" is clicked (toggle left sidebar)
   */
  onToolsClick: () => void;

  /**
   * Callback when "Properties" is clicked (toggle right panel)
   */
  onPropertiesClick: () => void;

  /**
   * Whether the left sidebar is visible
   */
  isToolsVisible: boolean;

  /**
   * Whether the right panel is visible
   */
  isPropertiesVisible: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * FloatingActionButton component for mobile panel toggles
 *
 * Features:
 * - Fixed position in bottom-right corner
 * - Dropdown menu with panel toggle options
 * - ≥44px touch target (WCAG AAA)
 * - Visual indicator for panel visibility
 * - Keyboard accessible
 * - High z-index to float above canvas
 *
 * @example
 * <FloatingActionButton
 *   onToolsClick={() => toggleLeftSidebar()}
 *   onPropertiesClick={() => toggleRightPanel()}
 *   isToolsVisible={false}
 *   isPropertiesVisible={false}
 * />
 */
export const FloatingActionButton = React.memo<FloatingActionButtonProps>(
  ({ onToolsClick, onPropertiesClick, isToolsVisible, isPropertiesVisible, className }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className={cn(
              // Fixed positioning in bottom-right
              'fixed bottom-6 right-6 z-50',
              // Large size for touch (≥44px)
              'h-14 w-14',
              // Rounded and shadowed
              'rounded-full shadow-lg',
              // Primary color
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90',
              // Animation
              'transition-all duration-200',
              'hover:scale-110',
              // Focus
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              className
            )}
            aria-label="Panel options menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onToolsClick} className="cursor-pointer">
            <Wrench className="mr-2 h-4 w-4" />
            <span>{isToolsVisible ? 'Hide' : 'Show'} Tools</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onPropertiesClick} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>{isPropertiesVisible ? 'Hide' : 'Show'} Properties</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';
