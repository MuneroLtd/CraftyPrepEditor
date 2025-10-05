/**
 * Validates that a file can be decoded as a valid image.
 * Creates an Image object and attempts to load the file.
 *
 * @param file - The file to validate
 * @param timeoutMs - Timeout in milliseconds (default: 30000ms = 30s)
 * @returns Promise that resolves to HTMLImageElement if valid, rejects if invalid
 * @throws Error if image cannot be decoded or loading times out
 */
export function validateImageDecode(
  file: File,
  timeoutMs: number = 30000
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    const timeoutId = setTimeout(() => handleTimeout(), timeoutMs);

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      clearTimeout(timeoutId);
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };

    const handleLoad = () => {
      cleanup();
      resolve(img);
    };

    const handleError = () => {
      cleanup();
      reject(new Error('Unable to load image. File may be corrupted.'));
    };

    const handleTimeout = () => {
      cleanup();
      reject(new Error('Image loading timed out.'));
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    img.src = objectUrl;
  });
}
