/**
 * Validates if a file's MIME type is an allowed image type.
 * Allowed types: image/jpeg, image/jpg, image/png, image/gif, image/bmp
 *
 * @param file - The file to validate
 * @returns true if file type is valid, false otherwise
 */
export function validateFileType(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];

  return allowedTypes.includes(file.type.toLowerCase());
}
