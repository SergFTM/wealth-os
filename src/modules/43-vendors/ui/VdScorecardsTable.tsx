"use client";

import React from 'react';

interface Scorecard {
  id: string;
  vendorId: string;
  vendorName?: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  trend?: 'improving' | 'stable' | 'declining';
  notes?: string;
}

interface VdScorecardsTableProps {
  scorecards: Scorecard[];
  onRowClick?: (scorecard: Scorecard) => void;
  emptyMessage?: string;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-600';
  if (score >= 6) return 'text-amber-600';
  if (score >= 4) return 'text-orange-600';
  return 'text-red-600';
}

function getScoreBg(score: number): string {
  if (score >= 8) return 'bg-emerald-50';
  if (score >= 6) return 'bg-amber-50';
  if (score >= 4) return 'bg-orange-50';
  return 'bg-red-50';
}

const trendIcons: Record<string, { icon: string; color: string }> = {
  improving: { icon: '↑', color: 'text-emerald-600' },
  stable: { icon: '→', color: 'text-stone-500' },
  declining: { icon: '↓', color: 'text-red-600' },
};

export function VdScorecardsTable({ scorecards, onRowClick, emptyMessage = 'Нет scorecards' }: VdScorecardsTableProps) {
  if (scorecards.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200/50 text-left">
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Провайдер</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Период</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Оценка</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Тренд</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Заметки</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {scorecards.map((scorecard) => {
            const trendConfig = trendIcons[scorecard.trend || 'stable'];

            return (
              <tr
                key={scorecard.id}
                onClick={() => onRowClick?.(scorecard)}
                className="hover:bg-stone-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800">
                    {scorecard.vendorName || scorecard.vendorId}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-stone-600">
                    {formatDate(scorecard.periodStart)} — {formatDate(scorecard.periodEnd)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`
                      inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-lg
                      ${getScoreBg(scorecard.overallScore)} ${getScoreColor(scorecard.overallScore)}
                    `}>
                      {scorecard.overallScore.toFixed(1)}
                    </span>
                    <div className="text-xs text-stone-400">/ 10</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-lg font-medium ${trendConfig.color}`}>
                    {trendConfig.icon}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-stone-500 line-clamp-1">
                    {scorecard.notes || '—'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Score display component for use in other places
export function VdScoreDisplay({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <div className={`
      inline-flex items-center justify-center rounded-lg font-bold
      ${getScoreBg(score)} ${getScoreColor(score)} ${sizeClasses[size]}
    `}>
      {score.toFixed(1)}
    </div>
  );
}
