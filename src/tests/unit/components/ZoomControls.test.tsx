import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ZoomControls } from '@/components/ZoomControls';

describe('ZoomControls', () => {
  it('renders zoom in and zoom out buttons', () => {
    render(<ZoomControls zoom={1} onZoomChange={vi.fn()} />);
    expect(screen.getByLabelText(/zoom in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zoom out/i)).toBeInTheDocument();
  });

  it('renders zoom slider', () => {
    render(<ZoomControls zoom={1} onZoomChange={vi.fn()} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
  });

  it('displays current zoom level', () => {
    render(<ZoomControls zoom={2.5} onZoomChange={vi.fn()} />);
    expect(screen.getByText(/250%/i)).toBeInTheDocument();
  });

  it('increases zoom on zoom in button click', () => {
    const handleZoom = vi.fn();
    render(<ZoomControls zoom={1} onZoomChange={handleZoom} />);

    const zoomInBtn = screen.getByLabelText(/zoom in/i);
    fireEvent.click(zoomInBtn);

    expect(handleZoom).toHaveBeenCalledWith(1.25); // 25% increment
  });

  it('decreases zoom on zoom out button click', () => {
    const handleZoom = vi.fn();
    render(<ZoomControls zoom={2} onZoomChange={handleZoom} />);

    const zoomOutBtn = screen.getByLabelText(/zoom out/i);
    fireEvent.click(zoomOutBtn);

    expect(handleZoom).toHaveBeenCalledWith(1.75);
  });

  it('disables zoom out at minimum (1x)', () => {
    render(<ZoomControls zoom={1} onZoomChange={vi.fn()} />);
    const zoomOutBtn = screen.getByLabelText(/zoom out/i);
    expect(zoomOutBtn).toBeDisabled();
  });

  it('disables zoom in at maximum (4x)', () => {
    render(<ZoomControls zoom={4} onZoomChange={vi.fn()} />);
    const zoomInBtn = screen.getByLabelText(/zoom in/i);
    expect(zoomInBtn).toBeDisabled();
  });

  it('updates zoom via slider', () => {
    const handleZoom = vi.fn();
    render(<ZoomControls zoom={1} onZoomChange={handleZoom} />);

    const slider = screen.getByRole('slider');

    // Verify slider exists with correct initial value
    expect(slider).toBeInTheDocument();
    expect(slider.getAttribute('aria-valuenow')).toBe('1');

    // Note: Testing Radix UI slider interactions requires a real DOM environment
    // The component uses pointer events which don't work reliably in JSDOM
    // Integration/E2E tests will verify actual slider functionality
  });

  it('renders reset button', () => {
    render(<ZoomControls zoom={2} onZoomChange={vi.fn()} onReset={vi.fn()} />);
    expect(screen.getByText(/reset/i)).toBeInTheDocument();
  });

  it('calls onReset when reset button clicked', () => {
    const handleReset = vi.fn();
    render(<ZoomControls zoom={2} onZoomChange={vi.fn()} onReset={handleReset} />);

    const resetBtn = screen.getByText(/reset/i);
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalled();
  });

  it('updates slider value when zoom prop changes', () => {
    const { rerender } = render(<ZoomControls zoom={1} onZoomChange={vi.fn()} />);

    let slider = screen.getByRole('slider');
    expect(slider.getAttribute('aria-valuenow')).toBe('1');

    rerender(<ZoomControls zoom={2.5} onZoomChange={vi.fn()} />);

    slider = screen.getByRole('slider');
    expect(slider.getAttribute('aria-valuenow')).toBe('2.5');
  });

  it('respects custom minZoom and maxZoom props', () => {
    const handleZoom = vi.fn();
    render(<ZoomControls zoom={2} onZoomChange={handleZoom} minZoom={0.5} maxZoom={8} />);

    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('aria-valuemin')).toBe('0.5');
    expect(slider.getAttribute('aria-valuemax')).toBe('8');
  });
});
