import { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export interface FileUploadErrorProps {
  error: string;
  onDismiss: () => void;
}

/**
 * Error display component for file upload errors.
 * Auto-dismisses after 5 seconds with accessibility announcements.
 */
export function FileUploadError({ error, onDismiss }: FileUploadErrorProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [error, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 p-4 mb-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />

      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">{error}</p>
      </div>

      <button
        onClick={onDismiss}
        aria-label="Dismiss error message"
        className="
          flex-shrink-0 p-1 rounded
          text-red-600 hover:bg-red-100
          focus:outline-none focus:ring-2 focus:ring-red-500
        "
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
