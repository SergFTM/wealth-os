"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Version {
  id: string;
  version: number;
  generatedAt: string;
  generatedBy: string;
  changesSummary?: string;
}

interface ReportsVersionHistoryProps {
  versions: Version[];
  currentVersion: number;
  onOpen?: (versionId: string) => void;
  onCompare?: (v1: string, v2: string) => void;
}

export function ReportsVersionHistory({
  versions,
  currentVersion,
  onOpen,
  onCompare
}: ReportsVersionHistoryProps) {
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <h3 className="font-semibold text-stone-800">История версий</h3>
        <span className="text-sm text-stone-500">Текущая: v{currentVersion}</span>
      </div>
      
      <div className="divide-y divide-stone-100">
        {sortedVersions.map((version, index) => (
          <div
            key={version.id}
            className={cn(
              "p-4 flex items-center justify-between",
              version.version === currentVersion && "bg-emerald-50/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                version.version === currentVersion
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-stone-100 text-stone-600"
              )}>
                v{version.version}
              </div>
              <div>
                <p className="text-sm text-stone-800">
                  {new Date(version.generatedAt).toLocaleString('ru-RU')}
                  {version.version === currentVersion && (
                    <span className="ml-2 text-xs text-emerald-600">(текущая)</span>
                  )}
                </p>
                <p className="text-xs text-stone-500">
                  {version.generatedBy.split('@')[0]}
                  {version.changesSummary && ` — ${version.changesSummary}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onOpen?.(version.id)}>
                Открыть
              </Button>
              {index < sortedVersions.length - 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCompare?.(version.id, sortedVersions[index + 1].id)}
                >
                  Сравнить
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {versions.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет сохранённых версий
        </div>
      )}
    </div>
  );
}
