import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditorLayout } from '../../../../components/layout/EditorLayout';

describe('EditorLayout', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const mockChildren = {
    toolbar: <div data-testid="mock-toolbar">Toolbar</div>,
    leftSidebar: <div data-testid="mock-left-sidebar">Left Sidebar</div>,
    canvas: <div data-testid="mock-canvas">Canvas</div>,
    rightPanel: <div data-testid="mock-right-panel">Right Panel</div>,
    statusBar: <div data-testid="mock-status-bar">Status Bar</div>,
  };

  it('should render with all panels visible by default', () => {
    render(<EditorLayout>{mockChildren}</EditorLayout>);

    expect(screen.getByTestId('mock-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('left-sidebar')).toBeVisible();
    expect(screen.getByTestId('mock-canvas')).toBeVisible();
    expect(screen.getByTestId('right-panel')).toBeVisible();
    expect(screen.getByTestId('status-bar')).toBeVisible();
  });

  it('should always show top toolbar', () => {
    render(<EditorLayout>{mockChildren}</EditorLayout>);

    const toolbar = screen.getByTestId('mock-toolbar');
    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toBeVisible();
  });

  it('should toggle left sidebar visibility via keyboard shortcut', () => {
    render(<EditorLayout>{mockChildren}</EditorLayout>);

    expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();

    // Simulate Ctrl+B to toggle
    fireEvent.keyDown(window, { key: 'b', ctrlKey: true });

    expect(screen.queryByTestId('left-sidebar')).not.toBeInTheDocument();

    // Toggle again
    fireEvent.keyDown(window, { key: 'b', ctrlKey: true });
    expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();
  });

  it('should toggle right panel visibility via keyboard shortcut', () => {
    render(<EditorLayout>{mockChildren}</EditorLayout>);

    expect(screen.getByTestId('right-panel')).toBeInTheDocument();

    // Simulate Ctrl+1 to toggle
    fireEvent.keyDown(window, { key: '1', ctrlKey: true });

    expect(screen.queryByTestId('right-panel')).not.toBeInTheDocument();
  });

  it('should toggle status bar visibility via keyboard shortcut', () => {
    render(<EditorLayout>{mockChildren}</EditorLayout>);

    expect(screen.getByTestId('status-bar')).toBeInTheDocument();

    // Simulate Ctrl+Shift+/ to toggle (Shift added to avoid browser conflicts)
    fireEvent.keyDown(window, { key: '/', ctrlKey: true, shiftKey: true });

    expect(screen.queryByTestId('status-bar')).not.toBeInTheDocument();
  });

  it('should persist layout preferences to localStorage', async () => {
    const { unmount } = render(<EditorLayout>{mockChildren}</EditorLayout>);

    // Toggle left sidebar with Ctrl+B
    fireEvent.keyDown(window, { key: 'b', ctrlKey: true });

    // Wait for debounce (300ms) and check localStorage
    await waitFor(
      () => {
        const saved = localStorage.getItem('craftyprep-layout-preferences');
        expect(saved).toBeTruthy();
        if (saved) {
          const prefs = JSON.parse(saved);
          expect(prefs.leftSidebarVisible).toBe(false);
        }
      },
      { timeout: 400 }
    );

    unmount();
  });

  it('should restore layout preferences on mount', () => {
    // Set preferences in localStorage
    localStorage.setItem(
      'craftyprep-layout-preferences',
      JSON.stringify({
        leftSidebarVisible: false,
        rightPanelVisible: false,
        rightPanelWidth: 500,
        statusBarVisible: false,
        expandedSections: {},
      })
    );

    render(<EditorLayout>{mockChildren}</EditorLayout>);

    expect(screen.queryByTestId('left-sidebar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-panel')).not.toBeInTheDocument();
    expect(screen.queryByTestId('status-bar')).not.toBeInTheDocument();
  });

  it('should handle keyboard shortcut Ctrl+B to toggle left sidebar', () => {
    render(<EditorLayout>{mockChildren}</EditorLayout>);

    expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();

    // Simulate Ctrl+B
    fireEvent.keyDown(window, { key: 'b', ctrlKey: true });
    expect(screen.queryByTestId('left-sidebar')).not.toBeInTheDocument();

    // Simulate Ctrl+B again
    fireEvent.keyDown(window, { key: 'b', ctrlKey: true });
    expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();
  });

  it('should handle keyboard shortcut Ctrl+1 to toggle right panel', () => {
    render(<EditorLayout>{mockChildren}</EditorLayout>);

    expect(screen.getByTestId('right-panel')).toBeInTheDocument();

    // Simulate Ctrl+1
    fireEvent.keyDown(window, { key: '1', ctrlKey: true });
    expect(screen.queryByTestId('right-panel')).not.toBeInTheDocument();
  });
});
