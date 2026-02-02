"use client";

import { FileText, Download, ExternalLink, Image, File } from 'lucide-react';

interface DvDocPreviewProps {
  document: {
    id: string;
    name: string;
    fileType: string;
    filePath: string;
    fileSize: number;
  };
  onDownload: () => void;
}

export function DvDocPreview({ document, onDownload }: DvDocPreviewProps) {
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(document.fileType.toLowerCase());
  const isPdf = document.fileType.toLowerCase() === 'pdf';

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Preview Area */}
      <div className="bg-stone-100 rounded-xl overflow-hidden min-h-[400px] flex items-center justify-center">
        {isImage ? (
          <div className="p-4 w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={document.filePath}
              alt={document.name}
              className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden flex-col items-center gap-3 text-stone-400">
              <Image className="w-16 h-16" />
              <p className="text-sm">Не удалось загрузить изображение</p>
            </div>
          </div>
        ) : isPdf ? (
          <div className="w-full h-[500px] relative">
            <iframe
              src={document.filePath}
              className="w-full h-full border-0"
              title={document.name}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 hidden">
              <FileText className="w-16 h-16 text-stone-300" />
              <p className="text-sm text-stone-500 mt-3">PDF Preview</p>
              <p className="text-xs text-stone-400">{document.name}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8">
            <File className="w-20 h-20 text-stone-300" />
            <div className="text-center">
              <p className="text-stone-600 font-medium">{document.name}</p>
              <p className="text-sm text-stone-400 mt-1">
                {document.fileType.toUpperCase()} • {formatFileSize(document.fileSize)}
              </p>
            </div>
            <p className="text-sm text-stone-500">
              Предпросмотр недоступен для этого типа файла
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-stone-500">
          {document.fileType.toUpperCase()} • {formatFileSize(document.fileSize)}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            className="
              inline-flex items-center gap-2 px-4 py-2 rounded-lg
              bg-gradient-to-r from-emerald-500 to-emerald-600
              text-white text-sm font-medium
              hover:from-emerald-600 hover:to-emerald-700
              transition-all
            "
          >
            <Download className="w-4 h-4" />
            Скачать
          </button>
          <button
            onClick={() => window.open(document.filePath, '_blank')}
            className="
              inline-flex items-center gap-2 px-4 py-2 rounded-lg
              bg-white border border-stone-200 text-stone-700 text-sm font-medium
              hover:bg-stone-50
              transition-all
            "
          >
            <ExternalLink className="w-4 h-4" />
            Открыть
          </button>
        </div>
      </div>
    </div>
  );
}
