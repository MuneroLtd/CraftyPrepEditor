import { useMemo } from 'react';
import { isMacPlatform } from '../lib/utils/platform';

/**
 * usePlatform - Hook for platform detection and platform-specific values
 *
 * Features:
 * - Detects macOS vs other platforms
 * - Provides platform-specific modifier key label
 * - Memoized for performance
 * - Testable (can be mocked in tests)
 *
 * Example:
 * ```tsx
 * const { isMac, modKey } = usePlatform();
 * // isMac: true/false
 * // modKey: '⌘' on macOS, 'Ctrl' on others
 * ```
 */
export function usePlatform() {
  return useMemo(() => {
    const isMac = isMacPlatform();
    return {
      isMac,
      modKey: isMac ? '⌘' : 'Ctrl',
    };
  }, []);
}
