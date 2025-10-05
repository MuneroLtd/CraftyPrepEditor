import { FileDropzone } from './FileDropzone';
import { FileUploadError } from './FileUploadError';
import { FileUploadInfo } from './FileUploadInfo';
import { FileUploadProgress } from './FileUploadProgress';
import { FILE_UPLOAD } from '@/lib/constants';

/**
 * Props interface for FileUploadComponent.
 * All state and handlers are passed from parent component to maintain single source of truth.
 */
interface FileUploadComponentProps {
  selectedFile: File | null;
  uploadedImage: HTMLImageElement | null;
  isLoading: boolean;
  error: string | null;
  info: string | null;
  progress: number;
  handleFileSelect: (file: File) => void;
  clearError: () => void;
  clearInfo: () => void;
}

/**
 * Main file upload component integrating dropzone, error display, and progress indicator.
 * Receives all state and handlers as props from parent component (App.tsx).
 * This ensures single source of truth for file upload state.
 */
export function FileUploadComponent({
  selectedFile,
  uploadedImage,
  isLoading,
  error,
  info,
  progress,
  handleFileSelect,
  clearError,
  clearInfo,
}: FileUploadComponentProps) {
  const isLargeFile = selectedFile && selectedFile.size > FILE_UPLOAD.LARGE_FILE_THRESHOLD_BYTES;
  const showProgress = isLoading && isLargeFile;

  return (
    <div role="region" aria-label="Image upload" className="w-full max-w-2xl mx-auto px-4 py-6">
      {error && <FileUploadError error={error} onDismiss={clearError} />}
      {info && <FileUploadInfo message={info} onDismiss={clearInfo} />}

      {!uploadedImage && (
        <FileDropzone onFileSelect={handleFileSelect} isLoading={isLoading} error={error} />
      )}

      {showProgress && <FileUploadProgress progress={progress} isVisible={showProgress} />}

      {uploadedImage && selectedFile && (
        <div className="mt-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800" role="status" aria-live="polite">
              Image uploaded successfully: {selectedFile.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
