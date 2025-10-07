import React, { useCallback } from 'react';
import type { ReactNode } from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import { useLayoutPreferences } from '../../hooks/useLayoutPreferences';

export interface PanelSection {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export interface RightPanelProps {
  sections: PanelSection[];
}

/**
 * RightPanel - Right sidebar with collapsible sections
 *
 * Features:
 * - Multiple collapsible sections
 * - Persists section state to localStorage
 * - Scrollable content
 * - Keyboard accessible
 * - Memoized to prevent unnecessary re-renders
 */
export const RightPanel = React.memo<RightPanelProps>(function RightPanel({ sections }) {
  const { preferences, updatePreferences } = useLayoutPreferences();

  const toggleSection = useCallback(
    (sectionId: string) => {
      updatePreferences({
        ...preferences,
        expandedSections: {
          ...preferences.expandedSections,
          [sectionId]: !preferences.expandedSections[sectionId],
        },
      });
    },
    [preferences, updatePreferences]
  );

  return (
    <div className="flex flex-col bg-background overflow-y-auto" data-testid="right-panel">
      {sections.map((section) => (
        <CollapsibleSection
          key={section.id}
          id={section.id}
          title={section.title}
          icon={section.icon}
          expanded={preferences.expandedSections[section.id] ?? section.defaultExpanded ?? true}
          onToggle={() => toggleSection(section.id)}
        >
          {section.children}
        </CollapsibleSection>
      ))}
    </div>
  );
});
