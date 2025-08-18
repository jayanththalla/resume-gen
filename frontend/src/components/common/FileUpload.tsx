import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File, content: string) => void;
  className?: string;
  placeholder?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = '.tex,.txt',
  maxSize = 5,
  onFileSelect,
  className = '',
  placeholder = 'Drop your LaTeX file here or click to browse',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      return `File type not supported. Allowed types: ${accept}`;
    }
    
    return null;
  };

  const processFile = async (file: File) => {
    setUploadStatus('uploading');
    setError('');
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setUploadStatus('error');
      return;
    }

    try {
      const content = await file.text();
      setUploadedFile(file);
      setUploadStatus('success');
      onFileSelect(file, content);
    } catch (err) {
      setError('Failed to read file content');
      setUploadStatus('error');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setError('');
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Upload className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    if (isDragOver) return 'border-blue-500 bg-blue-50';
    switch (uploadStatus) {
      case 'success':
        return 'border-green-300 bg-green-50';
      case 'error':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-300 hover:border-gray-400';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${getStatusColor()}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploadStatus === 'uploading'}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}
          
          {uploadStatus === 'success' && uploadedFile ? (
            <div className="flex items-center space-x-3">
              <File className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">{uploadedFile.name}</span>
              <button
                onClick={removeFile}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                {uploadStatus === 'uploading' ? 'Processing file...' : placeholder}
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: {accept} • Max size: {maxSize}MB
              </p>
            </div>
          )}
          
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};