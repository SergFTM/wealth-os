"use client";

import { FileText, ExternalLink, Download, Edit3 } from 'lucide-react';
import { AiConfidenceBadge } from './AiConfidenceBadge';

interface Narrative {
  id: string;
  clientId: string;
  scopeType: string;
  scopeId: string;
  category: string;
  periodStart: string;
  periodEnd: string;
  title: string;
  narrativeText: string;
  confidencePct: number;
  createdAt: string;
}

interface AiNarrativesTableProps {
  narratives: Narrative[];
  onRowClick?: (narrative: Narrative) => void;
  onExport?: (narrative: Narrative) => void;
  onConvertToDraft?: (narrative: Narrative) => void;
  compact?: boolean;
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  net_worth: { label: 'Net Worth', color: 'text-emerald-600 bg-emerald-50' },
  performance: { label: 'Performance', color: 'text-blue-600 bg-blue-50' },
  risk: { label: 'Risk', color: 'text-red-600 bg-red-50' },
  liquidity: { label: 'Liquidity', color: 'text-amber-600 bg-amber-50' },
  compliance: { label: 'Compliance', color: 'text-purple-600 bg-purple-50' },
  tax: { label: 'Tax', color: 'text-indigo-600 bg-indigo-50' },
  fees: { label: 'Fees', color: 'text-green-600 bg-green-50' },
};

const scopeLabels: Record<string, string> = {
  household: 'Домохозяйство',
  entity: 'Юр. лицо',
  portfolio: 'Портфель',
  account: 'Счет',
  global: 'Глобально',
};

export function AiNarrativesTable({
  narratives,
  onRowClick,
  onExport,
  onConvertToDraft,
  compact = false,
}: AiNarrativesTableProps) {
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const formatPeriod = (start: string, end: string): string => {
    return `${formatDate(start)} — ${formatDate(end)}`;
  };

  const displayNarratives = compact ? narratives.slice(0, 6) : narratives;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                Тема
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                Категория
              </th>
              {!compact && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                  Scope
                </th>
              )}
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Период
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Уверенность
              </th>
              {!compact && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                  Действия
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayNarratives.map((narrative) => {
              const category = categoryLabels[narrative.category] || {
                label: narrative.category,
                color: 'text-stone-600 bg-stone-100',
              };

              return (
                <tr
                  key={narrative.id}
                  onClick={() => onRowClick?.(narrative)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      <span className="text-stone-800 font-medium truncate max-w-xs">
                        {narrative.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${category.color}`}
                    >
                      {category.label}
                    </span>
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-stone-600">
                      <span className="capitalize">
                        {scopeLabels[narrative.scopeType] || narrative.scopeType}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-center text-stone-600 text-xs">
                    {formatPeriod(narrative.periodStart, narrative.periodEnd)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <AiConfidenceBadge confidence={narrative.confidencePct} />
                  </td>
                  {!compact && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onExport?.(narrative);
                          }}
                          className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Экспорт"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onConvertToDraft?.(narrative);
                          }}
                          className="p-1.5 text-stone-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                          title="Конвертировать в draft"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {narratives.length === 0 && (
        <div className="p-8 text-center text-stone-500">Нет narratives для отображения</div>
      )}
    </div>
  );
}
