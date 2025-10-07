import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useResize } from '../../../hooks/useResize';

describe('useResize', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with the provided initial width', () => {
    const { result } = renderHook(() =>
      useResize({
        initialWidth: 400,
        minWidth: 200,
        maxWidth: 600,
      })
    );

    expect(result.current.width).toBe(400);
    expect(result.current.isResizing).toBe(false);
  });

  it('should clamp width to min/max constraints', () => {
    const onResizeEnd = vi.fn();
    const { result } = renderHook(() =>
      useResize({
        initialWidth: 400,
        minWidth: 200,
        maxWidth: 600,
        onResizeEnd,
      })
    );

    // Try to set width below minimum
    act(() => {
      result.current.setWidth(100);
    });
    expect(result.current.width).toBe(200);

    // Try to set width above maximum
    act(() => {
      result.current.setWidth(800);
    });
    expect(result.current.width).toBe(600);

    // Set valid width
    act(() => {
      result.current.setWidth(400);
    });
    expect(result.current.width).toBe(400);
  });

  it('should handle keyboard arrow left to decrease width', () => {
    const onResizeEnd = vi.fn();
    const { result } = renderHook(() =>
      useResize({
        initialWidth: 400,
        minWidth: 200,
        maxWidth: 600,
        onResizeEnd,
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    Object.defineProperty(event, 'preventDefault', {
      value: vi.fn(),
    });

    act(() => {
      result.current.handleKeyDown(event as unknown as React.KeyboardEvent);
    });

    expect(result.current.width).toBe(390); // 400 - 10
    expect(onResizeEnd).toHaveBeenCalledWith(390);
  });

  it('should handle keyboard arrow right to increase width', () => {
    const onResizeEnd = vi.fn();
    const { result } = renderHook(() =>
      useResize({
        initialWidth: 400,
        minWidth: 200,
        maxWidth: 600,
        onResizeEnd,
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    Object.defineProperty(event, 'preventDefault', {
      value: vi.fn(),
    });

    act(() => {
      result.current.handleKeyDown(event as unknown as React.KeyboardEvent);
    });

    expect(result.current.width).toBe(410); // 400 + 10
    expect(onResizeEnd).toHaveBeenCalledWith(410);
  });

  it('should handle keyboard Home to set minimum width', () => {
    const onResizeEnd = vi.fn();
    const { result } = renderHook(() =>
      useResize({
        initialWidth: 400,
        minWidth: 200,
        maxWidth: 600,
        onResizeEnd,
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'Home' });
    Object.defineProperty(event, 'preventDefault', {
      value: vi.fn(),
    });

    act(() => {
      result.current.handleKeyDown(event as unknown as React.KeyboardEvent);
    });

    expect(result.current.width).toBe(200);
    expect(onResizeEnd).toHaveBeenCalledWith(200);
  });

  it('should handle keyboard End to set maximum width', () => {
    const onResizeEnd = vi.fn();
    const { result } = renderHook(() =>
      useResize({
        initialWidth: 400,
        minWidth: 200,
        maxWidth: 600,
        onResizeEnd,
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'End' });
    Object.defineProperty(event, 'preventDefault', {
      value: vi.fn(),
    });

    act(() => {
      result.current.handleKeyDown(event as unknown as React.KeyboardEvent);
    });

    expect(result.current.width).toBe(600);
    expect(onResizeEnd).toHaveBeenCalledWith(600);
  });

  it('should set isResizing to true on mouse down', () => {
    const { result } = renderHook(() =>
      useResize({
        initialWidth: 400,
        minWidth: 200,
        maxWidth: 600,
      })
    );

    const event = {
      preventDefault: vi.fn(),
      clientX: 100,
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.handleMouseDown(event);
    });

    expect(result.current.isResizing).toBe(true);
  });

  it('should call onResize callback when width changes', () => {
    const onResize = vi.fn();
    const { result } = renderHook(() =>
      useResize({
        initialWidth: 400,
        minWidth: 200,
        maxWidth: 600,
        onResize,
      })
    );

    act(() => {
      result.current.setWidth(450);
    });

    expect(onResize).toHaveBeenCalledWith(450);
  });

  it('should not trigger shortcuts for unhandled keys', () => {
    const onResizeEnd = vi.fn();
    const { result } = renderHook(() =>
      useResize({
        initialWidth: 400,
        minWidth: 200,
        maxWidth: 600,
        onResizeEnd,
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    Object.defineProperty(event, 'preventDefault', {
      value: vi.fn(),
    });

    const initialWidth = result.current.width;

    act(() => {
      result.current.handleKeyDown(event as unknown as React.KeyboardEvent);
    });

    // Width should not change for unhandled keys
    expect(result.current.width).toBe(initialWidth);
    expect(onResizeEnd).not.toHaveBeenCalled();
  });
});
