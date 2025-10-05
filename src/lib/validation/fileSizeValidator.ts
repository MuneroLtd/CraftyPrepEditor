import { FILE_UPLOAD } from '@/lib/constants';

/**
 * Validates if a file's size is within the allowed limit.
 *
 * @param file - The file to validate
 * @param maxSizeMB - Maximum allowed file size in megabytes (default: 10MB)
 * @returns true if file size is valid, false otherwise
 */
export function validateFileSize(file: File, maxSizeMB: number = FILE_UPLOAD.MAX_SIZE_MB): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}
