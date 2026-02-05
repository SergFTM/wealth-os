'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import { calculateMetrics, calculateWeeklyTrends } from '../engine/caseReports';

interface Case {
  id: string;
  caseType: string;
  priority: string;
  status: string;
  assignedToUserId?: string | null;
  assignedToUserName?: string | null;
  slaBreached?: boolean;
  dueAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CsReportsPanelProps {
  cases: Case[];
  locale?: string;
  onGenerateReport?: () => void;
}

export function CsReportsPanel({ cases, locale = 'ru', onGenerateReport }: CsReportsPanelProps) {
  const t = useTranslation();

  const metrics = useMemo(() => calculateMetrics(cases), [cases]);
  const trends = useMemo(() => calculateWeeklyTrends(cases, 6), [cases]);

  const typeLabels: Record<string, string> = {
    request: locale === 'ru' ? 'Запросы' : locale === 'uk' ? 'Запити' : 'Requests',
    incident: locale === 'ru' ? 'Инциденты' : locale === 'uk' ? 'Інциденти' : 'Incidents',
    change: locale === 'ru' ? 'Изменения' : locale === 'uk' ? 'Зміни' : 'Changes',
    problem: locale === 'ru' ? 'Проблемы' : locale === 'uk' ? 'Проблеми' : 'Problems',
  };

  const priorityLabels: Record<string, string> = {
    low: locale === 'ru' ? 'Низкий' : locale === 'uk' ? 'Низький' : 'Low',
    medium: locale === 'ru' ? 'Средний' : locale === 'uk' ? 'Середній' : 'Medium',
    high: locale === 'ru' ? 'Высокий' : locale === 'uk' ? 'Високий' : 'High',
    critical: locale === 'ru' ? 'Критичный' : locale === 'uk' ? 'Критичний' : 'Critical',
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50">
          <div className="text-xs text-gray-500 mb-1">
            {t('totalCases', { ru: 'Всего кейсов', en: 'Total Cases', uk: 'Всього кейсів' })}
          </div>
          <div className="text-2xl font-bold text-emerald-700">{metrics.totalCases}</div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
          <div className="text-xs text-gray-500 mb-1">
            {t('resolvedCases', { ru: 'Решено', en: 'Resolved', uk: 'Вирішено' })}
          </div>
          <div className="text-2xl font-bold text-blue-700">{metrics.resolvedCases}</div>
        </div>

        <div className={`p-4 rounded-xl border ${
          metrics.slaComplianceRate >= 0.9
            ? 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50'
            : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/50'
        }`}>
          <div className="text-xs text-gray-500 mb-1">
            {t('slaCompliance', { ru: 'SLA соблюдение', en: 'SLA Compliance', uk: 'SLA дотримання' })}
          </div>
          <div className={`text-2xl font-bold ${
            metrics.slaComplianceRate >= 0.9 ? 'text-green-700' : 'text-red-700'
          }`}>
            {(metrics.slaComplianceRate * 100).toFixed(0)}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50">
          <div className="text-xs text-gray-500 mb-1">
            {t('avgResolution', { ru: 'Ср. время решения', en: 'Avg Resolution', uk: 'Сер. час рішення' })}
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {metrics.avgResolutionHours < 24
              ? `${metrics.avgResolutionHours.toFixed(0)}ч`
              : `${(metrics.avgResolutionHours / 24).toFixed(1)}д`
            }
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Type */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            {t('byType', { ru: 'По типу', en: 'By Type', uk: 'За типом' })}
          </h3>
          <div className="space-y-3">
            {Object.entries(metrics.byType).map(([type, count]) => {
              const percentage = metrics.totalCases > 0 ? (count / metrics.totalCases) * 100 : 0;
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{typeLabels[type] || type}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Priority */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            {t('byPriority', { ru: 'По приоритету', en: 'By Priority', uk: 'За пріоритетом' })}
          </h3>
          <div className="space-y-3">
            {['critical', 'high', 'medium', 'low'].map((priority) => {
              const count = metrics.byPriority[priority] || 0;
              const percentage = metrics.totalCases > 0 ? (count / metrics.totalCases) * 100 : 0;
              const colors: Record<string, string> = {
                critical: 'bg-red-500',
                high: 'bg-amber-500',
                medium: 'bg-blue-500',
                low: 'bg-gray-400',
              };
              return (
                <div key={priority}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{priorityLabels[priority] || priority}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${colors[priority]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          {t('weeklyTrend', { ru: 'Тренд по неделям', en: 'Weekly Trend', uk: 'Тренд по тижнях' })}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-xs text-gray-500">
                  {t('week', { ru: 'Неделя', en: 'Week', uk: 'Тиждень' })}
                </th>
                <th className="text-right py-2 text-xs text-gray-500">
                  {t('created', { ru: 'Создано', en: 'Created', uk: 'Створено' })}
                </th>
                <th className="text-right py-2 text-xs text-gray-500">
                  {t('resolved', { ru: 'Решено', en: 'Resolved', uk: 'Вирішено' })}
                </th>
                <th className="text-right py-2 text-xs text-gray-500">
                  {t('slaBreached', { ru: 'SLA нарушено', en: 'SLA Breached', uk: 'SLA порушено' })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {trends.map((week) => (
                <tr key={week.week}>
                  <td className="py-2 text-gray-600">
                    {new Date(week.week).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-2 text-right text-gray-900">{week.created}</td>
                  <td className="py-2 text-right text-emerald-600">{week.resolved}</td>
                  <td className="py-2 text-right text-red-600">{week.slaBreached}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Button */}
      {onGenerateReport && (
        <div className="flex justify-end">
          <button
            onClick={onGenerateReport}
            className="
              inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
              bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors
            "
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('generateReport', { ru: 'Сгенерировать отчет', en: 'Generate Report', uk: 'Згенерувати звіт' })}
          </button>
        </div>
      )}
    </div>
  );
}
