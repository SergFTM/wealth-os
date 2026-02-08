"use client";

import { DiffResult, DiffLine } from '../engine/diffEngine';

interface PlDiffViewerProps {
  diff: DiffResult;
  title?: string;
}

function DiffLineComponent({ line }: { line: DiffLine }) {
  const bgColor = line.type === 'added'
    ? 'bg-emerald-50'
    : line.type === 'removed'
      ? 'bg-red-50'
      : 'bg-white';

  const textColor = line.type === 'added'
    ? 'text-emerald-700'
    : line.type === 'removed'
      ? 'text-red-700'
      : 'text-stone-700';

  const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';
  const prefixColor = line.type === 'added'
    ? 'text-emerald-500'
    : line.type === 'removed'
      ? 'text-red-500'
      : 'text-stone-300';

  return (
    <div className={`flex ${bgColor} hover:opacity-90`}>
      <span className="w-12 flex-shrink-0 text-right pr-2 text-stone-400 text-xs py-0.5 select-none border-r border-stone-200">
        {line.lineNumber}
      </span>
      <span className={`w-6 flex-shrink-0 text-center font-mono ${prefixColor} py-0.5 select-none`}>
        {prefix}
      </span>
      <span className={`flex-1 font-mono text-sm ${textColor} py-0.5 px-2 whitespace-pre-wrap break-all`}>
        {line.content || '\u00A0'}
      </span>
    </div>
  );
}

export function PlDiffViewer({ diff, title }: PlDiffViewerProps) {
  const { lines, addedCount, removedCount } = diff;

  return (
    <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
      {title && (
        <div className="px-4 py-2 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <span className="font-medium text-stone-700">{title}</span>
          <div className="flex items-center gap-3 text-sm">
            {addedCount > 0 && (
              <span className="text-emerald-600">+{addedCount} добавлено</span>
            )}
            {removedCount > 0 && (
              <span className="text-red-600">-{removedCount} удалено</span>
            )}
            {addedCount === 0 && removedCount === 0 && (
              <span className="text-stone-500">Без изменений</span>
            )}
          </div>
        </div>
      )}

      <div className="max-h-96 overflow-auto">
        {lines.length === 0 ? (
          <div className="p-4 text-center text-stone-500">
            Нет различий для отображения
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {lines.map((line, index) => (
              <DiffLineComponent key={`${line.lineNumber}-${index}`} line={line} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
