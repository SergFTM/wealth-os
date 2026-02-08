"use client";

import { MdConfidencePill } from './MdConfidencePill';

interface SourceValue {
  sourceSystem: string;
  value: unknown;
  asOf: string;
}

interface MdFieldLineageCardProps {
  field: string;
  label: string;
  chosenValue: unknown;
  confidence: number;
  sources: SourceValue[];
  isOverridden?: boolean;
  onAcceptSource?: (sourceSystem: string) => void;
  onOverride?: () => void;
}

export function MdFieldLineageCard({
  field,
  label,
  chosenValue,
  confidence,
  sources,
  isOverridden,
  onAcceptSource,
  onOverride,
}: MdFieldLineageCardProps) {
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-stone-700">{label}</span>
          <MdConfidencePill value={confidence} size="sm" />
          {isOverridden && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 border border-purple-200">
              Override
            </span>
          )}
        </div>
        {onOverride && (
          <button
            onClick={onOverride}
            className="text-xs text-stone-500 hover:text-emerald-600 transition-colors"
          >
            Изменить
          </button>
        )}
      </div>

      {/* Chosen value */}
      <div className="mb-4">
        <div className="text-lg font-semibold text-stone-800 break-words">
          {formatValue(chosenValue)}
        </div>
        <div className="text-xs text-stone-500 mt-1">Выбранное значение (Golden Record)</div>
      </div>

      {/* Source values */}
      {sources.length > 0 && (
        <div className="border-t border-stone-100 pt-3">
          <div className="text-xs font-medium text-stone-500 mb-2">Источники</div>
          <div className="space-y-2">
            {sources.map((source, idx) => {
              const isChosen = formatValue(source.value) === formatValue(chosenValue);
              return (
                <div
                  key={`${source.sourceSystem}-${idx}`}
                  className={`
                    flex items-center justify-between p-2 rounded-lg text-sm
                    ${isChosen ? 'bg-emerald-50 border border-emerald-200' : 'bg-stone-50 border border-stone-100'}
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-700">{source.sourceSystem}</span>
                      {isChosen && (
                        <span className="text-xs text-emerald-600">выбран</span>
                      )}
                    </div>
                    <div className="text-stone-600 truncate">{formatValue(source.value)}</div>
                    <div className="text-xs text-stone-400">{formatDate(source.asOf)}</div>
                  </div>
                  {!isChosen && onAcceptSource && (
                    <button
                      onClick={() => onAcceptSource(source.sourceSystem)}
                      className="ml-2 px-2 py-1 text-xs bg-white border border-stone-200 rounded hover:bg-stone-50 transition-colors"
                    >
                      Принять
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
