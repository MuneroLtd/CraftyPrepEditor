export interface FileUploadProgressProps {
  progress: number; // 0-100
  isVisible: boolean;
}

/**
 * Progress indicator for file uploads (shown for files >2MB).
 * Includes accessible progress announcements.
 */
export function FileUploadProgress({ progress, isVisible }: FileUploadProgressProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Loading image...</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
      </div>

      <div
        className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-live="polite"
      >
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        Loading image: {Math.round(progress)}% complete
      </p>
    </div>
  );
}
