import { validateFileType } from './fileTypeValidator';
import { validateFileExtension } from './fileExtensionValidator';
import { validateFileSize } from './fileSizeValidator';
import { sanitizeFilename } from './filenameSanitizer';
import { validateImageDecode } from './imageDecoder';
import { validateImageDimensions } from './imageDimensionValidator';
import type { ValidationResult } from './types';

/**
 * Validates a file through a comprehensive pipeline:
 * 1. File type check (MIME)
 * 2. File extension check
 * 3. File size check
 * 4. Filename sanitization
 * 5. Image decode (async)
 * 6. Image dimension check
 *
 * Short-circuits on first failure for performance.
 *
 * @param file - The file to validate
 * @param maxSizeMB - Maximum allowed file size in MB (default: 10)
 * @returns Promise<ValidationResult> with validation outcome
 */
export async function validateFile(file: File, maxSizeMB: number = 10): Promise<ValidationResult> {
  // Step 1: Validate MIME type
  if (!validateFileType(file)) {
    return {
      valid: false,
      error: 'Unsupported file type. Please upload JPG, PNG, GIF, or BMP.',
    };
  }

  // Step 2: Validate file extension
  if (!validateFileExtension(file.name)) {
    return {
      valid: false,
      error: 'Unsupported file type. Please upload JPG, PNG, GIF, or BMP.',
    };
  }

  // Step 3: Validate file size
  if (!validateFileSize(file, maxSizeMB)) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB. Your file is ${fileSizeMB}MB.`,
    };
  }

  // Step 4: Sanitize filename
  const sanitizedFilename = sanitizeFilename(file.name);

  // Step 5: Attempt to decode image (async)
  let image: HTMLImageElement;
  try {
    image = await validateImageDecode(file);
  } catch (error) {
    return {
      valid: false,
      error:
        error instanceof Error ? error.message : 'Unable to load image. File may be corrupted.',
    };
  }

  // Step 6: Validate image dimensions
  const dimensionResult = validateImageDimensions(image);
  if (!dimensionResult.valid) {
    return {
      valid: false,
      error: dimensionResult.error,
    };
  }

  // All validations passed
  return {
    valid: true,
    sanitizedFilename,
    image,
  };
}
