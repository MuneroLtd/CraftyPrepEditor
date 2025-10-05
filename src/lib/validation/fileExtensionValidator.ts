/**
 * Validates if a filename has an allowed image extension.
 * Allowed extensions: .jpg, .jpeg, .png, .gif, .bmp (case-insensitive)
 *
 * @param filename - The filename to validate
 * @returns true if extension is valid, false otherwise
 */
export function validateFileExtension(filename: string): boolean {
  const extensionRegex = /\.(jpe?g|png|gif|bmp)$/i;
  return extensionRegex.test(filename);
}
