import { useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLayoutPreferences, type LayoutPreferences } from '../../hooks/useLayoutPreferences';
import { usePlatform } from '../../hooks/usePlatform';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useResize } from '../../hooks/useResize';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useClickOutside } from '../../hooks/useClickOutside';
import { PANEL_CONSTRAINTS } from '../../lib/constants/layout';
import { ResizeHandle } from './ResizeHandle';
import { FloatingActionButton } from './FloatingActionButton';

// Text input types that should not trigger keyboard shortcuts
const TEXT_INPUT_TYPES = [
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
  'date',
  'datetime-local',
  'month',
  'time',
  'week',
] as const;

export interface EditorLayoutProps {
  children: {
    toolbar: ReactNode;
    leftSidebar: ReactNode;
    canvas: ReactNode;
    rightPanel: ReactNode;
    statusBar: ReactNode;
  };
}

/**
 * EditorLayout - Professional multi-panel image editor layout
 *
 * Features:
 * - Top toolbar (always visible)
 * - Left sidebar (toggleable, compact mode on tablet)
 * - Center canvas area
 * - Right panel (toggleable, resizable with drag handle)
 * - Bottom status bar (toggleable)
 * - Keyboard shortcuts (Ctrl+B, Ctrl+1, Ctrl+/)
 * - Layout preferences persistence (localStorage)
 * - Responsive design (mobile/tablet/desktop)
 * - Panel resize with keyboard and mouse/touch support
 */
export function EditorLayout({ children }: EditorLayoutProps) {
  const { preferences, updatePreferences } = useLayoutPreferences();
  const { isMobile, isTablet, isDesktop } = useMediaQuery();
  const { isMac } = usePlatform();

  // Refs for focus management on mobile overlays
  const leftSidebarTriggerRef = useRef<HTMLButtonElement>(null);
  const rightPanelTriggerRef = useRef<HTMLButtonElement>(null);

  // Panel resize logic
  const {
    width: panelWidth,
    isResizing,
    handleMouseDown,
    handleTouchStart,
    handleKeyDown,
    setWidth,
  } = useResize({
    initialWidth: preferences.rightPanelWidth,
    minWidth: PANEL_CONSTRAINTS.MIN_WIDTH,
    maxWidth: PANEL_CONSTRAINTS.MAX_WIDTH,
    onResizeEnd: (width) => {
      // Save final width to localStorage
      updatePreferences((prev) => ({
        ...prev,
        rightPanelWidth: width,
      }));
    },
  });

  // Sync panel width when preferences change from other sources
  useEffect(() => {
    setWidth(preferences.rightPanelWidth);
  }, [preferences.rightPanelWidth, setWidth]);

  // Generic toggle function to avoid code duplication
  const togglePreference = useCallback(
    (
      key: keyof Pick<
        LayoutPreferences,
        'leftSidebarVisible' | 'rightPanelVisible' | 'statusBarVisible'
      >
    ) => {
      updatePreferences((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    },
    [updatePreferences]
  );

  const toggleLeftSidebar = useCallback(
    () => togglePreference('leftSidebarVisible'),
    [togglePreference]
  );
  const toggleRightPanel = useCallback(
    () => togglePreference('rightPanelVisible'),
    [togglePreference]
  );
  const toggleStatusBar = useCallback(
    () => togglePreference('statusBarVisible'),
    [togglePreference]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs or navigating dropdowns
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable ||
        (target.tagName === 'INPUT' &&
          TEXT_INPUT_TYPES.some((type) => type === (target as HTMLInputElement).type))
      ) {
        return;
      }

      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      try {
        // Ctrl/Cmd + B: Toggle left sidebar
        if (ctrlOrCmd && event.key === 'b') {
          event.preventDefault();
          toggleLeftSidebar();
        }
        // Ctrl/Cmd + 1: Toggle right panel
        else if (ctrlOrCmd && event.key === '1') {
          event.preventDefault();
          toggleRightPanel();
        }
        // Ctrl/Cmd + Shift + /: Toggle status bar (Shift added to avoid browser conflicts)
        else if (ctrlOrCmd && event.shiftKey && event.key === '/') {
          event.preventDefault();
          toggleStatusBar();
        }
      } catch (error) {
        // Silently handle errors - keyboard shortcuts are non-critical
        console.error('Keyboard shortcut error:', error);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMac, toggleLeftSidebar, toggleRightPanel, toggleStatusBar]);

  // Determine panel visibility based on screen size and preferences
  // Helper function to simplify complex ternary logic
  const getPanelVisibility = (
    preference: boolean,
    showOnDesktop: boolean,
    showOnTablet: boolean,
    showOnMobile: boolean
  ): boolean => {
    if (isDesktop) return showOnDesktop && preference;
    if (isTablet) return showOnTablet && preference;
    return showOnMobile && preference;
  };

  const shouldShowLeftSidebar = getPanelVisibility(
    preferences.leftSidebarVisible,
    true, // Show on desktop if preference allows
    true, // Show on tablet if preference allows
    false // Hidden on mobile by default
  );

  const shouldShowRightPanel = getPanelVisibility(
    preferences.rightPanelVisible,
    true, // Show on desktop if preference allows
    false, // Hidden on tablet by default
    false // Hidden on mobile by default
  );

  // Determine if panels should be overlays (mobile) or layout columns (tablet/desktop)
  const isPanelsOverlay = isMobile;

  // Focus trap for left sidebar mobile overlay
  const leftSidebarRef = useFocusTrap<HTMLDivElement>({
    isActive: isPanelsOverlay && shouldShowLeftSidebar,
    returnFocusRef: leftSidebarTriggerRef,
    onEscape: toggleLeftSidebar,
  });

  // Focus trap for right panel mobile overlay
  const rightPanelRef = useFocusTrap<HTMLDivElement>({
    isActive: isPanelsOverlay && shouldShowRightPanel,
    returnFocusRef: rightPanelTriggerRef,
    onEscape: toggleRightPanel,
  });

  // Click outside to close left sidebar (mobile only)
  const leftSidebarClickOutsideRef = useClickOutside<HTMLDivElement>({
    isActive: isPanelsOverlay && shouldShowLeftSidebar,
    onClickOutside: toggleLeftSidebar,
  });

  // Click outside to close right panel (mobile only)
  const rightPanelClickOutsideRef = useClickOutside<HTMLDivElement>({
    isActive: isPanelsOverlay && shouldShowRightPanel,
    onClickOutside: toggleRightPanel,
  });

  // Merge refs for left sidebar (focus trap + click outside)
  const mergeLeftSidebarRefs = useCallback(
    (node: HTMLDivElement | null) => {
      leftSidebarRef.current = node;
      leftSidebarClickOutsideRef.current = node;
    },
    [leftSidebarRef, leftSidebarClickOutsideRef]
  );

  // Merge refs for right panel (focus trap + click outside)
  const mergeRightPanelRefs = useCallback(
    (node: HTMLDivElement | null) => {
      rightPanelRef.current = node;
      rightPanelClickOutsideRef.current = node;
    },
    [rightPanelRef, rightPanelClickOutsideRef]
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Skip Navigation Links */}
      <a
        href="#canvas-area"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:outline focus:outline-2 focus:outline-offset-2 focus:rounded"
      >
        Skip to canvas
      </a>

      {/* Top Toolbar - Always visible */}
      <div className="border-b" role="toolbar" aria-label="Main toolbar">
        {children.toolbar}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        {shouldShowLeftSidebar && (
          <div
            ref={isPanelsOverlay ? mergeLeftSidebarRefs : undefined}
            className={`border-r bg-background ${
              isPanelsOverlay
                ? 'fixed left-0 top-14 bottom-0 z-30 shadow-lg' // Mobile: overlay
                : 'relative' // Tablet/Desktop: layout column
            }`}
            style={
              isPanelsOverlay
                ? { width: '240px' } // Mobile: fixed width
                : isTablet
                  ? { width: '60px' } // Tablet: compact/icon-only
                  : undefined // Desktop: auto width from child
            }
            role="toolbar"
            aria-label="Tools"
            aria-modal={isPanelsOverlay ? 'true' : undefined}
            data-testid="left-sidebar"
            tabIndex={isPanelsOverlay ? -1 : undefined}
          >
            {children.leftSidebar}
          </div>
        )}

        {/* Center Canvas */}
        <div
          id="canvas-area"
          className="flex-1 flex flex-col"
          role="main"
          aria-label="Canvas workspace"
        >
          {children.canvas}
        </div>

        {/* Right Panel with Resize Handle */}
        {shouldShowRightPanel && (
          <>
            {/* Resize Handle - Desktop only */}
            {isDesktop && (
              <ResizeHandle
                width={panelWidth}
                minWidth={200}
                maxWidth={600}
                isResizing={isResizing}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onKeyDown={handleKeyDown}
              />
            )}

            {/* Right Panel */}
            <div
              ref={isPanelsOverlay ? mergeRightPanelRefs : undefined}
              className={`border-l bg-background overflow-y-auto ${
                isPanelsOverlay
                  ? 'fixed right-0 top-14 bottom-0 z-30 shadow-lg' // Mobile: overlay
                  : 'relative' // Tablet/Desktop: layout column
              }`}
              style={
                isPanelsOverlay
                  ? { width: '280px' } // Mobile: fixed width
                  : { width: `${panelWidth}px` } // Desktop: resizable
              }
              role="complementary"
              aria-label="Properties panel"
              aria-modal={isPanelsOverlay ? 'true' : undefined}
              data-testid="right-panel"
              tabIndex={isPanelsOverlay ? -1 : undefined}
            >
              {children.rightPanel}
            </div>
          </>
        )}

        {/* Floating Action Button - Mobile only */}
        {isMobile && (
          <FloatingActionButton
            onToolsClick={toggleLeftSidebar}
            onPropertiesClick={toggleRightPanel}
            isToolsVisible={preferences.leftSidebarVisible}
            isPropertiesVisible={preferences.rightPanelVisible}
          />
        )}
      </div>

      {/* Bottom Status Bar */}
      {preferences.statusBarVisible && (
        <div className="border-t" role="status" aria-live="polite" data-testid="status-bar">
          {children.statusBar}
        </div>
      )}
    </div>
  );
}
