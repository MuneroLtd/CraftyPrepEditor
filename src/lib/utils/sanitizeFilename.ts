/**
 * Sanitize filename by replacing invalid filesystem characters with underscores.
 *
 * Replaces characters that are invalid in filenames across different operating systems:
 * - Forward slash (/)
 * - Backslash (\)
 * - Question mark (?)
 * - Percent sign (%)
 * - Asterisk (*)
 * - Colon (:)
 * - Pipe (|)
 * - Double quote (")
 * - Less than (<)
 * - Greater than (>)
 *
 * @param filename - Original filename to sanitize
 * @returns Sanitized filename safe for download across all platforms
 *
 * @example
 * sanitizeFilename('photo/name.jpg') // Returns: 'photo_name.jpg'
 * sanitizeFilename('test?.png')      // Returns: 'test_.png'
 * sanitizeFilename('C:\\photo.jpg')  // Returns: 'C__photo.jpg'
 */
export function sanitizeFilename(filename: string): string {
  // Replace invalid filesystem characters: / \ ? % * : | " < >
  return filename.replace(/[/\\?%*:|"<>]/g, '_');
}
