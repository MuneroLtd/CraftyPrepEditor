import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

/**
 * CollapsibleSection - Expandable/collapsible section for panels
 *
 * Features:
 * - Click header to expand/collapse
 * - Keyboard accessible (Enter/Space)
 * - Smooth animation
 * - Optional icon
 * - ARIA expanded state
 */
export function CollapsibleSection({
  id,
  title,
  icon,
  children,
  defaultExpanded = true,
  expanded: controlledExpanded,
  onToggle,
}: CollapsibleSectionProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
    if (!isControlled) {
      setInternalExpanded(!internalExpanded);
    }
  };

  // Measure content height for smooth animations
  // Only when expanding to avoid layout thrashing
  useEffect(() => {
    const content = contentRef.current;
    if (!content || !isExpanded) return;

    // Measure content height on expand
    const maxHeight = `${content.scrollHeight}px`;
    content.style.setProperty('--max-height', maxHeight);
  }, [isExpanded, children]);

  return (
    <div className="border-b last:border-b-0" data-testid={`section-${id}`}>
      {/* Header */}
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted transition-colors bg-transparent border-0 text-left"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span className="font-medium text-sm">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            isExpanded && 'transform rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Content - conditionally rendered for accessibility */}
      {isExpanded && (
        <div
          ref={contentRef}
          className="overflow-hidden animate-in slide-in-from-top-2 duration-200"
        >
          <div className="px-4 py-3 space-y-4">{children}</div>
        </div>
      )}
    </div>
  );
}
