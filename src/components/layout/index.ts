/**
 * Layout Components - Modern Image Editor Layout System
 *
 * Professional multi-panel layout with:
 * - Top toolbar (file operations, editing, view controls, zoom)
 * - Left sidebar (tool selection)
 * - Center canvas (main workspace)
 * - Right panel (properties, adjustments with collapsible sections)
 * - Bottom status bar (status messages, dimensions, zoom, tips)
 *
 * Features:
 * - Keyboard shortcuts (Ctrl+B, Ctrl+1, Ctrl+H)
 * - Layout preferences persistence (localStorage)
 * - Responsive design (mobile/tablet/desktop)
 * - WCAG 2.2 AAA compliant
 */

export { EditorLayout } from './EditorLayout';
export type { EditorLayoutProps } from './EditorLayout';

export { TopToolbar } from './TopToolbar';
export type { TopToolbarProps } from './TopToolbar';

export { LeftSidebar } from './LeftSidebar';
export type { LeftSidebarProps, Tool } from './LeftSidebar';

export { CanvasArea } from './CanvasArea';
export type { CanvasAreaProps } from './CanvasArea';

export { RightPanel } from './RightPanel';
export type { RightPanelProps, PanelSection } from './RightPanel';

export { CollapsibleSection } from './CollapsibleSection';
export type { CollapsibleSectionProps } from './CollapsibleSection';

export { StatusBar } from './StatusBar';
export type { StatusBarProps } from './StatusBar';
