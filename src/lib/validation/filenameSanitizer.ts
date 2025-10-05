/**
 * Sanitizes a filename by replacing dangerous characters with underscores.
 * Dangerous characters: / \ ? % * : | " < >
 *
 * @param filename - The filename to sanitize
 * @returns Sanitized filename with dangerous characters replaced by underscores
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[/\\?%*:|"<>]/g, '_');
}
