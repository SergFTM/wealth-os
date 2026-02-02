"use client";

import { History, Upload, Check, FileText } from 'lucide-react';

interface DocumentVersion {
  id: string;
  versionNumber: number;
  filePath: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface DvVersionsPanelProps {
  versions: DocumentVersion[];
  currentVersionId: string | null;
  onUploadNewVersion: () => void;
  onSetCurrent: (id: string) => void;
  onDownload: (version: DocumentVersion) => void;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function DvVersionsPanel({
  versions,
  currentVersionId,
  onUploadNewVersion,
  onSetCurrent,
  onDownload,
}: DvVersionsPanelProps) {
  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-700">
          История версий ({versions.length})
        </h3>
        <button
          onClick={onUploadNewVersion}
          className="
            inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
            bg-gradient-to-r from-emerald-500 to-emerald-600
            text-white text-sm font-medium
            hover:from-emerald-600 hover:to-emerald-700
            transition-all
          "
        >
          <Upload className="w-4 h-4" />
          Загрузить новую версию
        </button>
      </div>

      {versions.length === 0 ? (
        <div className="text-center py-8">
          <History className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm text-stone-500">Нет истории версий</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedVersions.map((version) => (
            <div
              key={version.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border transition-colors
                ${version.id === currentVersionId
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-white border-stone-200 hover:border-stone-300'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${version.id === currentVersionId
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-100 text-stone-500'
                  }
                `}>
                  <span className="text-xs font-bold">v{version.versionNumber}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-stone-800">
                      Версия {version.versionNumber}
                    </p>
                    {version.id === currentVersionId && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded">
                        <Check className="w-3 h-3" />
                        Текущая
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">
                    {formatDate(version.uploadedAt)} • {version.uploadedBy}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {version.id !== currentVersionId && (
                  <button
                    onClick={() => onSetCurrent(version.id)}
                    className="
                      px-2 py-1 text-xs font-medium text-emerald-600
                      hover:bg-emerald-50 rounded transition-colors
                    "
                  >
                    Сделать текущей
                  </button>
                )}
                <button
                  onClick={() => onDownload(version)}
                  className="
                    p-1.5 hover:bg-stone-100 rounded transition-colors
                  "
                  title="Скачать эту версию"
                >
                  <FileText className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
