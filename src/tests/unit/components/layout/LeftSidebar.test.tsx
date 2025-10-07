import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeftSidebar } from '../../../../components/layout/LeftSidebar';
import { Wand2, Crop, Type } from 'lucide-react';

describe('LeftSidebar', () => {
  const mockTools = [
    {
      id: 'auto-prep',
      label: 'Auto-Prep',
      icon: <Wand2 />,
      onClick: vi.fn(),
      tooltip: 'Automatically prepare image',
    },
    {
      id: 'crop',
      label: 'Crop',
      icon: <Crop />,
      onClick: vi.fn(),
      disabled: true,
    },
    {
      id: 'text',
      label: 'Text',
      icon: <Type />,
      onClick: vi.fn(),
    },
  ];

  it('should render all tool buttons', () => {
    render(<LeftSidebar tools={mockTools} />);

    expect(screen.getByLabelText('Auto-Prep')).toBeInTheDocument();
    expect(screen.getByLabelText('Crop')).toBeInTheDocument();
    expect(screen.getByLabelText('Text')).toBeInTheDocument();
  });

  it('should highlight active tool', () => {
    render(<LeftSidebar tools={mockTools} activeTool="auto-prep" />);

    const autoPrepButton = screen.getByLabelText('Auto-Prep');
    expect(autoPrepButton).toHaveClass('bg-primary');
  });

  it('should call onClick when tool button is clicked', async () => {
    const user = userEvent.setup();
    render(<LeftSidebar tools={mockTools} />);

    const autoPrepButton = screen.getByLabelText('Auto-Prep');
    await user.click(autoPrepButton);

    expect(mockTools[0].onClick).toHaveBeenCalled();
  });

  it('should disable tool buttons when disabled prop is true', () => {
    render(<LeftSidebar tools={mockTools} />);

    const cropButton = screen.getByLabelText('Crop');
    expect(cropButton).toBeDisabled();
  });

  it('should have proper aria-labels', () => {
    render(<LeftSidebar tools={mockTools} />);

    expect(screen.getByLabelText('Auto-Prep')).toBeInTheDocument();
    expect(screen.getByLabelText('Crop')).toBeInTheDocument();
    expect(screen.getByLabelText('Text')).toBeInTheDocument();
  });

  it('should show tooltip on hover', () => {
    render(<LeftSidebar tools={mockTools} />);

    const autoPrepButton = screen.getByLabelText('Auto-Prep');
    expect(autoPrepButton).toHaveAttribute('title', 'Automatically prepare image');
  });

  it('should use label as tooltip when tooltip not provided', () => {
    render(<LeftSidebar tools={mockTools} />);

    const textButton = screen.getByLabelText('Text');
    expect(textButton).toHaveAttribute('title', 'Text');
  });

  it('should have touch-friendly button size', () => {
    render(<LeftSidebar tools={mockTools} />);

    const autoPrepButton = screen.getByLabelText('Auto-Prep');
    expect(autoPrepButton).toHaveClass('h-12', 'w-12');
  });
});
