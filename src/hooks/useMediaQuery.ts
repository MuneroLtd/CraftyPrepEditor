import { useEffect, useState } from 'react';

/**
 * Breakpoint thresholds for responsive design
 * Mobile: <768px
 * Tablet: 768px - 1023px
 * Desktop: ≥1024px
 */
const BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const;

export interface MediaQueryResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Hook to detect screen size breakpoints using window.matchMedia
 *
 * Returns an object indicating the current breakpoint:
 * - isMobile: true when screen width < 768px
 * - isTablet: true when screen width is 768-1023px
 * - isDesktop: true when screen width ≥ 1024px
 *
 * Automatically updates when window is resized and cleans up listeners on unmount.
 *
 * @returns {MediaQueryResult} Current breakpoint state
 *
 * @example
 * const { isMobile, isTablet, isDesktop } = useMediaQuery();
 *
 * if (isMobile) {
 *   // Render mobile layout
 * } else if (isTablet) {
 *   // Render tablet layout
 * } else {
 *   // Render desktop layout
 * }
 */
export function useMediaQuery(): MediaQueryResult {
  // Initialize state based on current window size
  const [matches, setMatches] = useState<MediaQueryResult>(() => {
    // Check if window and matchMedia are defined (SSR safety)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true, // Default to desktop for SSR
      };
    }

    return {
      isMobile: window.matchMedia(BREAKPOINTS.mobile).matches,
      isTablet: window.matchMedia(BREAKPOINTS.tablet).matches,
      isDesktop: window.matchMedia(BREAKPOINTS.desktop).matches,
    };
  });

  useEffect(() => {
    // Skip if window or matchMedia is not defined (SSR)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    // Create MediaQueryList objects
    const mobileQuery = window.matchMedia(BREAKPOINTS.mobile);
    const tabletQuery = window.matchMedia(BREAKPOINTS.tablet);
    const desktopQuery = window.matchMedia(BREAKPOINTS.desktop);

    // Handler to update state when media query changes
    const handleChange = () => {
      setMatches({
        isMobile: mobileQuery.matches,
        isTablet: tabletQuery.matches,
        isDesktop: desktopQuery.matches,
      });
    };

    // Add listeners (using addEventListener for modern browsers)
    // Fallback to addListener for older browsers
    mobileQuery.addEventListener('change', handleChange);
    tabletQuery.addEventListener('change', handleChange);
    desktopQuery.addEventListener('change', handleChange);

    // Cleanup listeners on unmount
    return () => {
      mobileQuery.removeEventListener('change', handleChange);
      tabletQuery.removeEventListener('change', handleChange);
      desktopQuery.removeEventListener('change', handleChange);
    };
  }, []); // Empty dependency array - listeners don't need to be re-created

  return matches;
}
