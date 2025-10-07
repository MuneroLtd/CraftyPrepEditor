import { memo } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export interface Tool {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
}

export interface LeftSidebarProps {
  tools: Tool[];
  activeTool?: string;
  /**
   * Compact mode: icon-only buttons (60px wide)
   * Full mode: icon + label buttons (wider)
   * Default: true (compact/icon-only)
   */
  compact?: boolean;
}

/**
 * LeftSidebar - Vertical toolbar with tool buttons
 *
 * Features:
 * - Vertical layout with icon buttons
 * - Active tool highlighting
 * - Disabled state support
 * - Tooltips (via title attribute)
 * - Touch-friendly (≥44px buttons)
 * - Keyboard accessible
 * - Compact mode for tablet (icon-only, 60px)
 * - Full mode for desktop/mobile (icon + label, wider)
 */
export const LeftSidebar = memo(function LeftSidebar({
  tools,
  activeTool,
  compact = true,
}: LeftSidebarProps) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-2', compact ? 'w-16' : 'w-48')}
      data-testid="left-sidebar"
    >
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={tool.id === activeTool ? 'default' : 'ghost'}
          size={compact ? 'icon' : 'default'}
          onClick={tool.onClick}
          disabled={tool.disabled}
          title={tool.tooltip || tool.label}
          aria-label={tool.label}
          className={cn(
            compact ? 'h-12 w-12' : 'h-12 justify-start',
            tool.id === activeTool && 'bg-primary text-primary-foreground'
          )}
          data-testid={`tool-${tool.id}`}
        >
          {tool.icon}
          {!compact && <span className="ml-2">{tool.label}</span>}
        </Button>
      ))}
    </div>
  );
});
