'use client';

/**
 * Data Quality KPI Strip Component
 */

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface KpiCard {
  label: { ru: string; en: string; uk: string };
  value: number | string;
  trend?: 'up' | 'down' | 'stable';
  color: 'emerald' | 'amber' | 'red' | 'blue' | 'gray';
  href: string;
  icon?: string;
}

interface DqKpiStripProps {
  healthScore: number;
  openExceptions: number;
  criticalExceptions: number;
  unresolvedConflicts: number;
  failedJobs24h: number;
  reconBreaks: number;
  staleRules: number;
  tasksFromDq: number;
  lang?: 'ru' | 'en' | 'uk';
}

const COLOR_CLASSES: Record<string, string> = {
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  amber: 'bg-amber-50 border-amber-200 text-amber-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  gray: 'bg-gray-50 border-gray-200 text-gray-700',
};

const VALUE_COLOR_CLASSES: Record<string, string> = {
  emerald: 'text-emerald-900',
  amber: 'text-amber-900',
  red: 'text-red-900',
  blue: 'text-blue-900',
  gray: 'text-gray-900',
};

export function DqKpiStrip(props: DqKpiStripProps) {
  const { lang: ctxLang } = useI18n();
  const lang = props.lang || ctxLang;

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'emerald';
    if (score >= 50) return 'amber';
    return 'red';
  };

  const kpis: KpiCard[] = [
    {
      label: { ru: 'Health Score', en: 'Health Score', uk: 'Health Score' },
      value: `${props.healthScore}/100`,
      color: getHealthColor(props.healthScore),
      href: '/m/data-quality/list?tab=health',
      icon: '❤️',
    },
    {
      label: { ru: 'Открытых', en: 'Open', uk: 'Відкритих' },
      value: props.openExceptions,
      color: props.openExceptions > 10 ? 'amber' : 'gray',
      href: '/m/data-quality/list?tab=exceptions&status=open',
      icon: '📋',
    },
    {
      label: { ru: 'Критичных', en: 'Critical', uk: 'Критичних' },
      value: props.criticalExceptions,
      color: props.criticalExceptions > 0 ? 'red' : 'emerald',
      href: '/m/data-quality/list?tab=exceptions&severity=critical',
      icon: '🔴',
    },
    {
      label: { ru: 'Конфликтов', en: 'Conflicts', uk: 'Конфліктів' },
      value: props.unresolvedConflicts,
      color: props.unresolvedConflicts > 5 ? 'amber' : 'gray',
      href: '/m/data-quality/list?tab=conflicts&status=open',
      icon: '⚡',
    },
    {
      label: { ru: 'Ошибки 24ч', en: 'Failed 24h', uk: 'Помилки 24г' },
      value: props.failedJobs24h,
      color: props.failedJobs24h > 0 ? 'red' : 'emerald',
      href: '/m/data-quality/list?tab=jobs&status=failed',
      icon: '🔄',
    },
    {
      label: { ru: 'Сверки', en: 'Recon Breaks', uk: 'Звірки' },
      value: props.reconBreaks,
      color: props.reconBreaks > 0 ? 'red' : 'emerald',
      href: '/m/data-quality/list?tab=recon&status=break',
      icon: '⚖️',
    },
    {
      label: { ru: 'Устарело', en: 'Stale', uk: 'Застаріло' },
      value: props.staleRules,
      color: props.staleRules > 3 ? 'amber' : 'gray',
      href: '/m/data-quality/list?tab=rules&filter=stale',
      icon: '⏰',
    },
    {
      label: { ru: 'Задач DQ', en: 'DQ Tasks', uk: 'Завдань DQ' },
      value: props.tasksFromDq,
      color: 'blue',
      href: '/m/data-quality/list?tab=exceptions&filter=tasks',
      icon: '✓',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi, idx) => (
        <Link
          key={idx}
          href={kpi.href}
          className={`p-3 rounded-xl border transition-all hover:shadow-md ${COLOR_CLASSES[kpi.color]}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{kpi.icon}</span>
            <span className="text-xs font-medium truncate">{kpi.label[lang]}</span>
          </div>
          <div className={`text-xl font-bold ${VALUE_COLOR_CLASSES[kpi.color]}`}>
            {kpi.value}
          </div>
        </Link>
      ))}
    </div>
  );
}
