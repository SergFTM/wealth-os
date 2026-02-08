"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { VdScoreDisplay } from './VdScorecardsTable';

interface CriteriaScore {
  score: number;
  weight: number;
  computed: boolean;
  notes: string;
}

interface Scorecard {
  id: string;
  vendorId: string;
  vendorName?: string;
  periodStart: string;
  periodEnd: string;
  criteriaJson?: {
    responsiveness?: CriteriaScore;
    accuracy?: CriteriaScore;
    securityPosture?: CriteriaScore;
    costEfficiency?: CriteriaScore;
    partnership?: CriteriaScore;
  };
  overallScore: number;
  trend?: 'improving' | 'stable' | 'declining';
  notes?: string;
  recommendationsJson?: string[];
  createdBy?: string;
  approvedBy?: string;
  createdAt: string;
}

interface VdScorecardDetailProps {
  scorecard: Scorecard;
  onEdit?: () => void;
  onCreateIncident?: () => void;
  onDraftMemo?: () => void;
  onBack?: () => void;
}

const criteriaLabels: Record<string, string> = {
  responsiveness: 'Отзывчивость',
  accuracy: 'Точность',
  securityPosture: 'Безопасность',
  costEfficiency: 'Эффективность затрат',
  partnership: 'Партнерство',
};

const trendLabels: Record<string, { label: string; icon: string; color: string }> = {
  improving: { label: 'Улучшается', icon: '↑', color: 'text-emerald-600' },
  stable: { label: 'Стабильно', icon: '→', color: 'text-stone-500' },
  declining: { label: 'Ухудшается', icon: '↓', color: 'text-red-600' },
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getScoreBarColor(score: number): string {
  if (score >= 8) return 'bg-emerald-500';
  if (score >= 6) return 'bg-amber-500';
  if (score >= 4) return 'bg-orange-500';
  return 'bg-red-500';
}

export function VdScorecardDetail({
  scorecard,
  onEdit,
  onCreateIncident,
  onDraftMemo,
  onBack,
}: VdScorecardDetailProps) {
  const trendConfig = trendLabels[scorecard.trend || 'stable'];
  const criteria = scorecard.criteriaJson || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-stone-800">
                Scorecard: {scorecard.vendorName || scorecard.vendorId}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                <span>{formatDate(scorecard.periodStart)} — {formatDate(scorecard.periodEnd)}</span>
                <span>·</span>
                <span className={trendConfig.color}>
                  {trendConfig.icon} {trendConfig.label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <VdScoreDisplay score={scorecard.overallScore} size="lg" />
            <div className="flex flex-col gap-2">
              {onDraftMemo && (
                <Button variant="secondary" onClick={onDraftMemo}>
                  Memo продления
                </Button>
              )}
              {onCreateIncident && (
                <Button variant="secondary" onClick={onCreateIncident}>
                  Создать инцидент
                </Button>
              )}
              {onEdit && (
                <Button variant="ghost" onClick={onEdit}>
                  Редактировать
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Criteria */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Критерии оценки</h2>
        <div className="space-y-4">
          {Object.entries(criteria).map(([key, value]) => {
            if (!value) return null;
            return (
              <div key={key} className="flex items-center gap-4">
                <div className="w-40 text-sm text-stone-600">
                  {criteriaLabels[key] || key}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-stone-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getScoreBarColor(value.score)}`}
                        style={{ width: `${value.score * 10}%` }}
                      />
                    </div>
                    <div className="w-12 text-right font-medium text-stone-700">
                      {value.score.toFixed(1)}
                    </div>
                    <div className="w-16 text-xs text-stone-400">
                      (вес: {(value.weight * 100).toFixed(0)}%)
                    </div>
                  </div>
                  {value.notes && (
                    <div className="mt-1 text-xs text-stone-500">{value.notes}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {scorecard.recommendationsJson && scorecard.recommendationsJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Рекомендации</h2>
          <ul className="space-y-2">
            {scorecard.recommendationsJson.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                <span className="text-emerald-600 mt-0.5">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {scorecard.notes && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Заметки</h2>
          <p className="text-sm text-stone-600 whitespace-pre-wrap">{scorecard.notes}</p>
        </div>
      )}

      {/* Meta */}
      <div className="text-xs text-stone-400">
        {scorecard.createdBy && <span>Создан: {scorecard.createdBy}</span>}
        {scorecard.approvedBy && <span className="ml-4">Утвержден: {scorecard.approvedBy}</span>}
      </div>
    </div>
  );
}
