'use client';

import React from 'react';
import { DataQualityScore } from '../engine/types';
import { KPI_DOMAINS } from '../config';

interface DgQualityScoresTableProps {
  scores: DataQualityScore[];
  onRowClick?: (id: string) => void;
  locale?: 'ru' | 'en' | 'uk';
}

export function DgQualityScoresTable({ scores, onRowClick, locale = 'ru' }: DgQualityScoresTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderScoreBar = (score: number, label: string) => (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-stone-600 w-8">{score}%</span>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200/50 bg-white/80 backdrop-blur-sm">
      <table className="min-w-full divide-y divide-stone-200/50">
        <thead className="bg-stone-50/80">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Домен' : 'Domain'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Тип объекта' : 'Object Type'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Общий Score' : 'Total Score'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Полнота' : 'Completeness'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Свежесть' : 'Freshness'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Консистентность' : 'Consistency'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Покрытие' : 'Coverage'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
              {locale === 'ru' ? 'Расчет' : 'Computed'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {scores.map((score) => (
            <tr
              key={score.id}
              onClick={() => onRowClick?.(score.id)}
              className="hover:bg-stone-50/50 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3">
                <span className="font-medium text-stone-900">
                  {KPI_DOMAINS[score.domainKey as keyof typeof KPI_DOMAINS]?.[locale] || score.domainKey}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {score.objectTypeKey}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className={`
                    inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold
                    ${score.scoreTotal >= 80
                      ? 'bg-emerald-100 text-emerald-700'
                      : score.scoreTotal >= 60
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'}
                  `}>
                    {score.scoreTotal}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                {renderScoreBar(score.completenessScore, 'Completeness')}
              </td>
              <td className="px-4 py-3">
                {renderScoreBar(score.freshnessScore, 'Freshness')}
              </td>
              <td className="px-4 py-3">
                {renderScoreBar(score.consistencyScore, 'Consistency')}
              </td>
              <td className="px-4 py-3">
                {renderScoreBar(score.coverageScore, 'Coverage')}
              </td>
              <td className="px-4 py-3 text-xs text-stone-500">
                {formatDate(score.computedAt)}
              </td>
            </tr>
          ))}
          {scores.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-stone-500">
                {locale === 'ru' ? 'Нет данных о качестве' : 'No quality data'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
