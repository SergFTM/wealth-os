'use client';

/**
 * Data Quality AI Insights Panel Component
 */

import { useI18n } from '@/lib/i18n';
import { DqInsight, Lang } from '../engine/dqNarratives';

interface DqAIInsightsPanelProps {
  insights: DqInsight[];
  summaryText: string;
  lang?: Lang;
  onInsightClick?: (insight: DqInsight) => void;
}

const PRIORITY_STYLES: Record<string, { bg: string; border: string; icon: string }> = {
  high: { bg: 'bg-red-50', border: 'border-red-200', icon: '🔴' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '🟡' },
  low: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '🔵' },
};

export function DqAIInsightsPanel({
  insights,
  summaryText,
  lang: propLang,
  onInsightClick,
}: DqAIInsightsPanelProps) {
  const { lang: ctxLang } = useI18n();
  const lang = (propLang || ctxLang) as Lang;

  const labels = {
    title: { ru: 'AI-анализ качества данных', en: 'AI Data Quality Analysis', uk: 'AI-аналіз якості даних' },
    topRisks: { ru: 'Приоритетные риски', en: 'Priority Risks', uk: 'Пріоритетні ризики' },
    disclaimer: {
      ru: 'Анализ основан на правилах и не заменяет экспертную оценку',
      en: 'Analysis is rules-based and does not replace expert evaluation',
      uk: 'Аналіз базується на правилах і не замінює експертну оцінку',
    },
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🤖</span>
        <h3 className="font-semibold text-gray-900">{labels.title[lang]}</h3>
      </div>

      {/* Summary */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">{summaryText}</p>
      </div>

      {/* Insights list */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {labels.topRisks[lang]}
          </h4>
          {insights.map((insight) => {
            const style = PRIORITY_STYLES[insight.priority];
            return (
              <div
                key={insight.id}
                onClick={() => onInsightClick?.(insight)}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${style.bg} ${style.border}`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-sm">{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 text-sm">
                      {insight.title[lang]}
                    </h5>
                    <p className="text-xs text-gray-600 mt-1">
                      {insight.description[lang]}
                    </p>
                    {insight.action && (
                      <button className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700">
                        {insight.action[lang]} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <p className="text-xs text-gray-400 italic">{labels.disclaimer[lang]}</p>
      </div>
    </div>
  );
}
