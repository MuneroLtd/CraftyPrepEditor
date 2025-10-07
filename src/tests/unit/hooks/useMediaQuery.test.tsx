import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

describe('useMediaQuery', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    // Save original matchMedia
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    // Restore original matchMedia only if window exists
    if (typeof window !== 'undefined') {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('should return desktop breakpoint by default', () => {
    // Mock matchMedia to return desktop (≥1024px)
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === '(min-width: 1024px)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useMediaQuery());

    expect(result.current).toEqual({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  });

  it('should return mobile breakpoint when screen < 768px', () => {
    // Mock matchMedia to return mobile (<768px)
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useMediaQuery());

    expect(result.current).toEqual({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    });
  });

  it('should return tablet breakpoint when screen 768-1023px', () => {
    // Mock matchMedia to return tablet (768-1023px)
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === '(min-width: 768px) and (max-width: 1023px)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useMediaQuery());

    expect(result.current).toEqual({
      isMobile: false,
      isTablet: true,
      isDesktop: false,
    });
  });

  it('should add and remove event listeners on mount/unmount', () => {
    const addEventListenerSpy = vi.fn();
    const removeEventListenerSpy = vi.fn();

    window.matchMedia = vi.fn(() => ({
      matches: false,
      media: '',
      onchange: null,
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    const { unmount } = renderHook(() => useMediaQuery());

    // Should add listeners for all 3 media queries
    expect(addEventListenerSpy).toHaveBeenCalledTimes(3);

    unmount();

    // Should remove listeners for all 3 media queries
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(3);
  });

  it('should handle SSR (window.matchMedia undefined)', () => {
    // Simulate SSR environment where matchMedia doesn't exist
    const originalMatchMedia = window.matchMedia;
    // @ts-expect-error - Testing SSR scenario
    window.matchMedia = undefined;

    const { result } = renderHook(() => useMediaQuery());

    // Should default to desktop for SSR
    expect(result.current).toEqual({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });

    // Restore matchMedia
    window.matchMedia = originalMatchMedia;
  });
});
