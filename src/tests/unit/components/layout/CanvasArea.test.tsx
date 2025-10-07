import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CanvasArea } from '../../../../components/layout/CanvasArea';

describe('CanvasArea', () => {
  it('should render children', () => {
    render(
      <CanvasArea>
        <div data-testid="child-content">Child content</div>
      </CanvasArea>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should apply scrollable classes', () => {
    const { container } = render(
      <CanvasArea>
        <div>Content</div>
      </CanvasArea>
    );

    const canvasArea = container.firstChild as HTMLElement;
    expect(canvasArea).toHaveClass('flex-1');
    expect(canvasArea).toHaveClass('overflow-auto');
  });

  it('should apply centering classes to inner wrapper', () => {
    render(
      <CanvasArea>
        <div>Content</div>
      </CanvasArea>
    );

    const canvasArea = screen.getByTestId('canvas-area');
    const innerWrapper = canvasArea.firstChild as HTMLElement;
    expect(innerWrapper).toHaveClass('flex');
    expect(innerWrapper).toHaveClass('items-center');
    expect(innerWrapper).toHaveClass('justify-center');
  });

  it('should apply background color classes', () => {
    render(
      <CanvasArea>
        <div>Content</div>
      </CanvasArea>
    );

    const canvasArea = screen.getByTestId('canvas-area');
    expect(canvasArea).toHaveClass('bg-muted/20');
  });

  it('should render with multiple children', () => {
    render(
      <CanvasArea>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </CanvasArea>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('should handle empty children gracefully', () => {
    render(<CanvasArea>{null}</CanvasArea>);

    const canvasArea = screen.getByTestId('canvas-area');
    expect(canvasArea).toBeInTheDocument();
    // The inner wrapper still exists, so we check that no child content is rendered
    const innerWrapper = canvasArea.firstChild as HTMLElement;
    expect(innerWrapper).toBeEmptyDOMElement();
  });
});
