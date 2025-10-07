import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopToolbar } from '../../../../components/layout/TopToolbar';

describe('TopToolbar', () => {
  const defaultProps = {
    file: {
      onUpload: vi.fn(),
      onDownload: vi.fn(),
      onClear: vi.fn(),
    },
    edit: {
      onUndo: vi.fn(),
      onRedo: vi.fn(),
      onReset: vi.fn(),
      canUndo: true,
      canRedo: true,
    },
    view: {
      onToggleLeftSidebar: vi.fn(),
      onToggleRightPanel: vi.fn(),
      onToggleStatusBar: vi.fn(),
    },
    zoom: {
      level: 100,
      onChange: vi.fn(),
    },
  };

  it('should render all menu groups', () => {
    render(<TopToolbar {...defaultProps} />);

    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('should display current zoom level', () => {
    render(<TopToolbar {...defaultProps} zoom={{ ...defaultProps.zoom, level: 150 }} />);

    expect(screen.getByText('150%')).toBeInTheDocument();
  });

  it('should call onUpload when Upload is clicked', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} />);

    await user.click(screen.getByText('File'));
    await user.click(await screen.findByText('Upload'));

    expect(defaultProps.file.onUpload).toHaveBeenCalled();
  });

  it('should call onDownload when Download is clicked', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} />);

    await user.click(screen.getByText('File'));
    await user.click(await screen.findByText('Download'));

    expect(defaultProps.file.onDownload).toHaveBeenCalled();
  });

  it('should call onClear when Clear is clicked', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} />);

    await user.click(screen.getByText('File'));
    await user.click(await screen.findByText('Clear'));

    expect(defaultProps.file.onClear).toHaveBeenCalled();
  });

  it('should call onUndo when Undo is clicked', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} />);

    await user.click(screen.getByText('Edit'));
    await user.click(await screen.findByText('Undo'));

    expect(defaultProps.edit.onUndo).toHaveBeenCalled();
  });

  it('should call onRedo when Redo is clicked', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} />);

    await user.click(screen.getByText('Edit'));
    await user.click(await screen.findByText('Redo'));

    expect(defaultProps.edit.onRedo).toHaveBeenCalled();
  });

  it('should call onReset when Reset is clicked', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} />);

    await user.click(screen.getByText('Edit'));
    await user.click(await screen.findByText('Reset'));

    expect(defaultProps.edit.onReset).toHaveBeenCalled();
  });

  it('should disable Undo button when canUndo is false', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} edit={{ ...defaultProps.edit, canUndo: false }} />);

    await user.click(screen.getByText('Edit'));

    const undoItem = await screen.findByText('Undo');
    expect(undoItem.closest('[role="menuitem"]')).toHaveAttribute('data-disabled');
  });

  it('should disable Redo button when canRedo is false', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} edit={{ ...defaultProps.edit, canRedo: false }} />);

    await user.click(screen.getByText('Edit'));

    const redoItem = await screen.findByText('Redo');
    expect(redoItem.closest('[role="menuitem"]')).toHaveAttribute('data-disabled');
  });

  it('should show toggle options in View menu', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} />);

    await user.click(screen.getByText('View'));

    expect(await screen.findByText('Left Sidebar')).toBeInTheDocument();
    expect(await screen.findByText('Right Panel')).toBeInTheDocument();
    expect(await screen.findByText('Status Bar')).toBeInTheDocument();
  });

  it('should call onZoomChange when zoom preset is selected', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} />);

    await user.click(screen.getByText('100%'));
    await user.click(await screen.findByText('150%'));

    expect(defaultProps.zoom.onChange).toHaveBeenCalledWith(150);
  });

  it('should have proper ARIA labels', () => {
    render(<TopToolbar {...defaultProps} />);

    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toHaveAttribute('aria-label', 'Main toolbar');
  });

  it('should call onZoomChange with decreased value when zoom out is clicked', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} />);

    const zoomOutButton = screen.getByLabelText('Zoom out');
    await user.click(zoomOutButton);

    expect(defaultProps.zoom.onChange).toHaveBeenCalledWith(75);
  });

  it('should call onZoomChange with increased value when zoom in is clicked', async () => {
    const user = userEvent.setup();
    render(<TopToolbar {...defaultProps} />);

    const zoomInButton = screen.getByLabelText('Zoom in');
    await user.click(zoomInButton);

    expect(defaultProps.zoom.onChange).toHaveBeenCalledWith(125);
  });
});
