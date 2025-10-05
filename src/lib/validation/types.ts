/**
 * Shared validation types
 */

/**
 * Result of file validation operations.
 * Used across all validation modules to ensure consistent return types.
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
  image?: HTMLImageElement;
}
