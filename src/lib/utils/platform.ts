/**
 * @file Platform Detection Utilities
 * @description Centralized platform detection for keyboard shortcuts and UI customization
 */

// Type declaration for experimental userAgentData API (Chromium only)
interface NavigatorUAData {
  platform: string;
}

declare global {
  interface Navigator {
    userAgentData?: NavigatorUAData;
  }
}

/**
 * Detect if the current platform is macOS/iOS
 *
 * Uses modern userAgentData API when available (Chromium browsers),
 * falls back to deprecated navigator.platform (Safari, Firefox)
 *
 * @returns true if running on macOS or iOS device
 */
export function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  // Use modern API if available (Chromium only)
  if (navigator.userAgentData?.platform) {
    return navigator.userAgentData.platform === 'macOS';
  }

  // Fallback to deprecated API (still needed for Safari, Firefox)
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

/**
 * Get platform-specific undo keyboard shortcut text
 *
 * @returns Formatted shortcut string (⌘Z for Mac, Ctrl+Z for others)
 */
export function getUndoShortcut(): string {
  return isMacPlatform() ? '⌘Z' : 'Ctrl+Z';
}

/**
 * Get platform-specific redo keyboard shortcut text
 *
 * @returns Formatted shortcut string (⌘Y for Mac, Ctrl+Y for others)
 */
export function getRedoShortcut(): string {
  return isMacPlatform() ? '⌘Y' : 'Ctrl+Y';
}
