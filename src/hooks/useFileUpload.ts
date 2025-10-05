import { useState, useRef, useEffect } from 'react';
import { validateFile } from '@/lib/validation/fileValidator';
import { FILE_UPLOAD } from '@/lib/constants';

/**
 * File upload state
 */
export interface FileUploadState {
  selectedFile: File | null;
  uploadedImage: HTMLImageElement | null;
  isLoading: boolean;
  error: string | null;
  info: string | null;
  progress: number; // 0-100 for files >2MB
}

/**
 * File upload actions
 */
export interface FileUploadActions {
  handleFileSelect: (file: File, multipleFiles?: boolean) => Promise<void>;
  handleDrop: (event: React.DragEvent) => void;
  handleFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearError: () => void;
  clearInfo: () => void;
  resetUpload: () => void;
}

/**
 * Hook for managing file upload state and validation.
 * Handles file selection, drag-and-drop, validation, and progress tracking.
 *
 * @returns Combined state and actions for file upload
 */
export function useFileUpload(): FileUploadState & FileUploadActions {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Handles file selection and validation
   */
  const handleFileSelect = async (file: File, multipleFiles = false): Promise<void> => {
    // Cancel any in-flight validation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this validation
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Reset state
    setError(null);
    setInfo(null);
    setProgress(0);
    setIsLoading(true);

    // Show info message if multiple files were provided
    if (multipleFiles) {
      setInfo('Multiple files detected. Processing first file only.');
    }

    // Track progress for large files (>2MB)
    const isLargeFile = file.size > FILE_UPLOAD.LARGE_FILE_THRESHOLD_BYTES;
    if (isLargeFile) {
      // Simulate progress (actual validation is fast, but we show progress for UX)
      setProgress(25);
    }

    try {
      // Check if aborted before validation
      if (abortController.signal.aborted) {
        return;
      }

      // Validate file
      const result = await validateFile(file);

      // Check if aborted after validation
      if (abortController.signal.aborted) {
        return;
      }

      if (isLargeFile) {
        setProgress(75);
      }

      if (!result.valid) {
        setError(result.error || 'File validation failed.');
        setSelectedFile(null);
        setUploadedImage(null);
        setIsLoading(false);
        setProgress(0);
        return;
      }

      // Success
      setSelectedFile(file);
      setUploadedImage(result.image || null);
      setError(null);
      setProgress(100);
    } catch (err) {
      // Don't set error if aborted
      if (abortController.signal.aborted) {
        return;
      }
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setSelectedFile(null);
      setUploadedImage(null);
      setProgress(0);
    } finally {
      // Only clear loading if not aborted
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  /**
   * Handles drag-and-drop event
   */
  const handleDrop = (event: React.DragEvent): void => {
    event.preventDefault();

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      // Take first file only, but track if multiple were provided
      handleFileSelect(files[0], files.length > 1);
    }
  };

  /**
   * Handles file input change event
   */
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Take first file only, but track if multiple were provided
      handleFileSelect(files[0], files.length > 1);
    }
  };

  /**
   * Clears the current error message
   */
  const clearError = (): void => {
    setError(null);
  };

  /**
   * Clears the current info message
   */
  const clearInfo = (): void => {
    setInfo(null);
  };

  /**
   * Resets all upload state
   */
  const resetUpload = (): void => {
    // Abort any in-flight validation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setSelectedFile(null);
    setUploadedImage(null);
    setError(null);
    setInfo(null);
    setProgress(0);
    setIsLoading(false);
  };

  return {
    // State
    selectedFile,
    uploadedImage,
    isLoading,
    error,
    info,
    progress,
    // Actions
    handleFileSelect,
    handleDrop,
    handleFileInputChange,
    clearError,
    clearInfo,
    resetUpload,
  };
}
