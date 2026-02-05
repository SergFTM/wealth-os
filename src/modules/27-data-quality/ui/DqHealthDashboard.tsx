'use client';

/**
 * Data Quality Health Dashboard Component
 */

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { DqMetric, getScoreColor, getScoreLabel } from '../schema/dqMetric';
import { DQ_DOMAINS, DqDomain } from '../config';
import { DqScoreBadge } from './DqScoreBadge';

interface DqHealthDashboardProps {
  metrics: DqMetric[];
  lang?: 'ru' | 'en' | 'uk';
  onDomainClick?: (domain: DqDomain) => void;
}

const DOMAIN_BG_COLORS: Record<string, string> = {
  emerald: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200',
  amber: 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200',
  orange: 'bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200',
  red: 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200',
};

export function DqHealthDashboard({ metrics, lang: propLang, onDomainClick }: DqHealthDashboardProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const domains = Object.keys(DQ_DOMAINS) as DqDomain[];

  const labels = {
    topIssues: { ru: 'Основные проблемы', en: 'Top Issues', uk: 'Основні проблеми' },
    lastRun: { ru: 'Обновлено', en: 'Updated', uk: 'Оновлено' },
    noIssues: { ru: 'Нет проблем', en: 'No issues', uk: 'Немає проблем' },
    exceptions: { ru: 'исключений', en: 'exceptions', uk: 'винятків' },
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {domains.map((domain) => {
        const metric = metrics.find((m) => m.domain === domain);
        const domainConfig = DQ_DOMAINS[domain];
        const score = metric?.score ?? 100;
        const color = getScoreColor(score);

        return (
          <div
            key={domain}
            onClick={() => onDomainClick?.(domain)}
            className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${DOMAIN_BG_COLORS[color]}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{domainConfig.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {domainConfig.label[lang]}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {metric?.openExceptionsCount || 0} {labels.exceptions[lang]}
                  </p>
                </div>
              </div>
              <DqScoreBadge score={score} trend={metric?.trend} size="sm" lang={lang} />
            </div>

            {metric?.topIssues && metric.topIssues.length > 0 ? (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">{labels.topIssues[lang]}:</p>
                {metric.topIssues.slice(0, 3).map((issue, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="truncate text-gray-700">{issue.title}</span>
                    <span className={`ml-2 px-1.5 py-0.5 rounded-full ${
                      issue.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      issue.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {issue.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">{labels.noIssues[lang]}</p>
            )}

            <div className="mt-3 pt-2 border-t border-gray-200/50 text-xs text-gray-400">
              {labels.lastRun[lang]}: {formatDate(metric?.lastComputedAt)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
