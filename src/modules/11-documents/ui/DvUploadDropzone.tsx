"use client";

import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface DvUploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading?: boolean;
  accept?: string;
}

export function DvUploadDropzone({ 
  onFilesSelected, 
  isUploading = false,
  accept = ".pdf,.png,.jpg,.jpeg,.docx"
}: DvUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setSelectedFiles(files);
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-all
          ${isDragging 
            ? 'border-emerald-500 bg-emerald-50/50' 
            : 'border-stone-300 bg-white/50 hover:border-emerald-400 hover:bg-emerald-50/30'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center gap-2">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${isDragging ? 'bg-emerald-100' : 'bg-stone-100'}
          `}>
            <Upload className={`w-6 h-6 ${isDragging ? 'text-emerald-600' : 'text-stone-500'}`} />
          </div>
          
          <div>
            <p className="text-sm font-medium text-stone-700">
              {isDragging ? 'Отпустите файлы здесь' : 'Перетащите файлы или нажмите для выбора'}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              PDF, PNG, JPG, DOCX • до 50 MB
            </p>
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-stone-600">Загрузка...</span>
            </div>
          </div>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 bg-white/80 rounded-lg border border-stone-200"
            >
              <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-700 truncate">{file.name}</p>
                <p className="text-xs text-stone-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-stone-100 rounded"
              >
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
