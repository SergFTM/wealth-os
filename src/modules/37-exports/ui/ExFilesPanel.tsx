'use client';

import React from 'react';
import { FileText, FileSpreadsheet, Download, Eye, Clock, HardDrive } from 'lucide-react';

interface ExportFile {
  id: string;
  fileName: string;
  format: 'csv' | 'pdf' | 'xlsx' | 'zip';
  sizeBytes: number;
  rowCount?: number;
  sectionId?: string;
  createdAt: string;
  downloadCount?: number;
}

interface ExFilesPanelProps {
  files: ExportFile[];
  onDownload: (fileId: string) => void;
  onPreview?: (fileId: string) => void;
  showDownloadCount?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function FileIcon({ format }: { format: string }) {
  switch (format) {
    case 'csv':
    case 'xlsx':
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    case 'pdf':
      return <FileText className="w-5 h-5 text-red-500" />;
    default:
      return <FileText className="w-5 h-5 text-gray-400" />;
  }
}

function FormatBadge({ format }: { format: string }) {
  const colors: Record<string, string> = {
    csv: 'bg-emerald-100 text-emerald-700',
    xlsx: 'bg-emerald-100 text-emerald-700',
    pdf: 'bg-red-100 text-red-700',
    zip: 'bg-blue-100 text-blue-700',
  };

  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium uppercase ${
        colors[format] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {format}
    </span>
  );
}

export function ExFilesPanel({
  files,
  onDownload,
  onPreview,
  showDownloadCount = false,
}: ExFilesPanelProps) {
  const totalSize = files.reduce((sum, f) => sum + f.sizeBytes, 0);

  if (files.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white/60 rounded-xl border border-gray-100">
        Нет сгенерированных файлов
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-100">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-gray-600">
            <FileText className="w-4 h-4" />
            {files.length} файлов
          </span>
          <span className="flex items-center gap-1 text-gray-600">
            <HardDrive className="w-4 h-4" />
            {formatSize(totalSize)}
          </span>
        </div>
        <button
          onClick={() => files.forEach((f) => onDownload(f.id))}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Скачать все
        </button>
      </div>

      {/* Files List */}
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="group p-4 rounded-xl bg-white/60 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <FileIcon format={file.format} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 truncate">{file.fileName}</span>
                  <FormatBadge format={file.format} />
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    {formatSize(file.sizeBytes)}
                  </span>
                  {file.rowCount !== undefined && (
                    <span>{file.rowCount.toLocaleString()} строк</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(file.createdAt)}
                  </span>
                  {showDownloadCount && file.downloadCount !== undefined && (
                    <span>{file.downloadCount} скачиваний</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onPreview && file.format !== 'zip' && (
                  <button
                    onClick={() => onPreview(file.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Предпросмотр"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDownload(file.id)}
                  className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Скачать"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExFilesPanel;
