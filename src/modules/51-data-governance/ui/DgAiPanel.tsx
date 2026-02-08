'use client';

import React, { useState } from 'react';
import { AiExplanation, AiReconCause, AiQualityRisk } from '../engine/types';

interface DgAiPanelProps {
  mode: 'lineage' | 'recon' | 'quality';
  explanation?: AiExplanation;
  reconCauses?: AiReconCause[];
  qualityRisks?: AiQualityRisk[];
  qualitySummary?: string;
  onRefresh?: () => void;
  loading?: boolean;
  locale?: 'ru' | 'en' | 'uk';
}

const DISCLAIMER = {
  ru: 'Пояснения носят информационный характер. Финальные выводы требуют проверки бухгалтером и ответственными лицами.',
  en: 'Explanations are informational. Final conclusions require verification by an accountant and responsible persons.',
  uk: 'Пояснення носять інформаційний характер. Фінальні висновки потребують перевірки бухгалтером та відповідальними особами.',
};

export function DgAiPanel({
  mode,
  explanation,
  reconCauses,
  qualityRisks,
  qualitySummary,
  onRefresh,
  loading = false,
  locale = 'ru',
}: DgAiPanelProps) {
  const [expanded, setExpanded] = useState(true);

  const titles = {
    lineage: { ru: 'AI: Объяснение Lineage', en: 'AI: Lineage Explanation', uk: 'AI: Пояснення Lineage' },
    recon: { ru: 'AI: Причины расхождения', en: 'AI: Break Causes', uk: 'AI: Причини розбіжності' },
    quality: { ru: 'AI: Риски качества', en: 'AI: Quality Risks', uk: 'AI: Ризики якості' },
  };

  const likelihoodColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-stone-100 text-stone-600',
  };

  const severityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="rounded-xl border border-stone-200/50 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-100/50 to-purple-100/50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
          <span className="font-medium text-stone-800">{titles[mode][locale]}</span>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              disabled={loading}
              className="p-1.5 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-50"
            >
              <svg className={`w-4 h-4 text-stone-600 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <svg
            className={`w-5 h-5 text-stone-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="px-4 py-4 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && mode === 'lineage' && explanation && (
            <div className="space-y-3">
              <div className="prose prose-sm prose-stone max-w-none">
                <div className="whitespace-pre-wrap text-stone-700">{explanation.text}</div>
              </div>
              {explanation.sources.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-stone-500">{locale === 'ru' ? 'Источники:' : 'Sources:'}</span>
                  {explanation.sources.map((s, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">{locale === 'ru' ? 'Уверенность:' : 'Confidence:'}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                  explanation.confidence === 'high'
                    ? 'bg-emerald-100 text-emerald-700'
                    : explanation.confidence === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                }`}>
                  {explanation.confidence}
                </span>
              </div>
            </div>
          )}

          {!loading && mode === 'recon' && reconCauses && reconCauses.length > 0 && (
            <div className="space-y-2">
              {reconCauses.map((cause, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white/50 border border-stone-200/50">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-stone-800">{cause.cause}</span>
                    <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs ${likelihoodColors[cause.likelihood]}`}>
                      {cause.likelihood}
                    </span>
                  </div>
                  {cause.suggestedAction && (
                    <p className="text-xs text-stone-500 mt-1">
                      → {cause.suggestedAction}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && mode === 'quality' && (
            <>
              {qualitySummary && (
                <p className="text-sm text-stone-700">{qualitySummary}</p>
              )}
              {qualityRisks && qualityRisks.length > 0 && (
                <div className="space-y-2">
                  {qualityRisks.map((risk, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white/50 border border-stone-200/50">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm text-stone-800">{risk.risk}</span>
                        <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs ${severityColors[risk.severity]}`}>
                          {risk.severity}
                        </span>
                      </div>
                      {risk.mitigation && (
                        <p className="text-xs text-stone-500 mt-1">
                          → {risk.mitigation}
                        </p>
                      )}
                      {risk.affectedKpis && risk.affectedKpis.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {risk.affectedKpis.slice(0, 3).map((kpi, i) => (
                            <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                              {kpi}
                            </span>
                          ))}
                          {risk.affectedKpis.length > 3 && (
                            <span className="text-xs text-stone-400">+{risk.affectedKpis.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Disclaimer */}
          <div className="pt-3 border-t border-stone-200/50">
            <p className="text-xs text-stone-400 italic">
              {DISCLAIMER[locale]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
