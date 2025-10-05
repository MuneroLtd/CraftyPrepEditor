import { useEffect } from 'react';
import { Info } from 'lucide-react';

export interface FileUploadInfoProps {
  message: string;
  onDismiss?: () => void;
}

/**
 * Info message component for file upload notifications.
 * Accessible with ARIA live region for screen reader announcements.
 * Auto-dismisses after 5 seconds.
 */
export function FileUploadInfo({ message, onDismiss }: FileUploadInfoProps) {
  useEffect(() => {
    if (!onDismiss) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-sm text-blue-800">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
          aria-label="Dismiss info message"
        >
          <span className="text-xl leading-none" aria-hidden="true">
            ×
          </span>
        </button>
      )}
    </div>
  );
}
