import { useRef, useState, type KeyboardEvent } from 'react';
import { Upload } from 'lucide-react';

export interface FileDropzoneProps {
  onFileSelect: (file: File, multipleFiles?: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * File dropzone component with drag-and-drop and click-to-browse functionality.
 * Fully accessible with keyboard navigation and screen reader support.
 */
export function FileDropzone({ onFileSelect, isLoading, error }: FileDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0], files.length > 1);
    }
  };

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0], files.length > 1);
    }
  };

  return (
    <div
      role="button"
      tabIndex={isLoading ? -1 : 0}
      aria-label="Upload image file. Drag and drop or press Enter to browse."
      aria-busy={isLoading}
      aria-disabled={isLoading}
      className={`
        relative flex flex-col items-center justify-center
        w-full min-h-[200px] md:min-h-[300px]
        border-2 border-dashed rounded-lg
        transition-all duration-200
        ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${error ? 'border-red-300' : ''}
        focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
        disabled={isLoading}
      />

      <div className="flex flex-col items-center gap-4 px-4 py-8">
        <Upload
          className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
          aria-hidden="true"
        />

        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            {isLoading ? 'Loading image...' : 'Drag image here or click to browse'}
          </p>
          <p className="mt-2 text-sm text-gray-500">JPG, PNG, GIF, or BMP • Max 10MB</p>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
          <div
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          />
        </div>
      )}
    </div>
  );
}
