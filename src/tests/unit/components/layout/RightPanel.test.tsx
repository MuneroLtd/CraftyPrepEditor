import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RightPanel } from '../../../../components/layout/RightPanel';
import { Settings, Sliders, Layers } from 'lucide-react';

const mockUpdatePreferences = vi.fn();

// Mock useLayoutPreferences hook
vi.mock('../../../../hooks/useLayoutPreferences', () => ({
  useLayoutPreferences: () => ({
    preferences: {
      leftSidebarVisible: true,
      rightPanelVisible: true,
      rightPanelWidth: 400,
      statusBarVisible: true,
      expandedSections: {
        properties: true,
        adjustments: true,
        layers: false,
      },
    },
    updatePreferences: mockUpdatePreferences,
  }),
}));

describe('RightPanel', () => {
  beforeEach(() => {
    localStorage.clear();
    mockUpdatePreferences.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const mockSections = [
    {
      id: 'properties',
      title: 'Properties',
      icon: <Settings className="h-4 w-4" />,
      children: (
        <div>
          <p>Image dimensions and settings</p>
          <p>Size: 1920x1080</p>
        </div>
      ),
      defaultExpanded: true,
    },
    {
      id: 'adjustments',
      title: 'Adjustments',
      icon: <Sliders className="h-4 w-4" />,
      children: (
        <div>
          <p>Brightness, contrast, and filters</p>
          <p>Brightness: 0</p>
        </div>
      ),
      defaultExpanded: true,
    },
    {
      id: 'layers',
      title: 'Layers',
      icon: <Layers className="h-4 w-4" />,
      children: <div>Layer management</div>,
      defaultExpanded: false,
    },
  ];

  it('should render all sections', () => {
    render(<RightPanel sections={mockSections} />);

    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Adjustments')).toBeInTheDocument();
    expect(screen.getByText('Layers')).toBeInTheDocument();
  });

  it('should render expanded sections by default', () => {
    render(<RightPanel sections={mockSections} />);

    // Properties section should be expanded
    expect(screen.getByText('Image dimensions and settings')).toBeInTheDocument();
    // Adjustments section should be expanded
    expect(screen.getByText('Brightness, contrast, and filters')).toBeInTheDocument();
  });

  it('should not render collapsed section content', () => {
    render(<RightPanel sections={mockSections} />);

    // Layers section should be collapsed
    expect(screen.queryByText('Layer management')).not.toBeInTheDocument();
  });

  it('should toggle section on click', async () => {
    const user = userEvent.setup();
    render(<RightPanel sections={mockSections} />);

    // Click on Layers section to expand it
    await user.click(screen.getByText('Layers'));

    // Verify updatePreferences was called
    expect(mockUpdatePreferences).toHaveBeenCalled();
  });

  it('should have proper section icons', () => {
    const { container } = render(<RightPanel sections={mockSections} />);

    // Verify icons are present (they're rendered as SVG elements from lucide-react)
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('should have proper section IDs', () => {
    render(<RightPanel sections={mockSections} />);

    expect(screen.getByTestId('section-properties')).toBeInTheDocument();
    expect(screen.getByTestId('section-adjustments')).toBeInTheDocument();
    expect(screen.getByTestId('section-layers')).toBeInTheDocument();
  });

  it('should have proper ARIA structure', () => {
    render(<RightPanel sections={mockSections} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3); // One button per section

    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded');
    });
  });

  it('should render section content properly', () => {
    render(<RightPanel sections={mockSections} />);

    // Check for properties content
    expect(screen.getByText('Image dimensions and settings')).toBeInTheDocument();
    expect(screen.getByText('Size: 1920x1080')).toBeInTheDocument();

    // Check for adjustments content
    expect(screen.getByText('Brightness, contrast, and filters')).toBeInTheDocument();
    expect(screen.getByText('Brightness: 0')).toBeInTheDocument();
  });

  it('should persist section toggle state', async () => {
    const user = userEvent.setup();
    render(<RightPanel sections={mockSections} />);

    // Toggle properties section
    await user.click(screen.getByText('Properties'));

    // Verify updatePreferences was called with correct structure
    expect(mockUpdatePreferences).toHaveBeenCalledWith(
      expect.objectContaining({
        expandedSections: expect.objectContaining({
          properties: false,
        }),
      })
    );
  });

  it('should use default expanded state when not in preferences', () => {
    render(<RightPanel sections={mockSections} />);

    // Properties should be expanded (defaultExpanded: true)
    expect(screen.getByText('Image dimensions and settings')).toBeInTheDocument();

    // Layers should be collapsed (defaultExpanded: false)
    expect(screen.queryByText('Layer management')).not.toBeInTheDocument();
  });

  it('should render multiple sections correctly', () => {
    render(<RightPanel sections={mockSections} />);

    // Verify all three sections are rendered
    const sections = screen.getAllByRole('button');
    expect(sections).toHaveLength(3);
  });
});
