'use client';

/**
 * Planning KPI Strip Component
 * Dashboard header with key metrics
 */

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { PlStatusPill } from './PlStatusPill';

interface KpiItem {
  key: string;
  value: number | string;
  label: { ru: string; en: string; uk: string };
  status?: 'ok' | 'warning' | 'critical';
  format?: 'number' | 'currency' | 'pct' | 'years';
  linkTo?: string;
}

interface PlKpiStripProps {
  kpis: KpiItem[];
  lang?: 'ru' | 'en' | 'uk';
}

export function PlKpiStrip({ kpis, lang: propLang }: PlKpiStripProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const formatValue = (value: number | string, format?: string): string => {
    if (typeof value === 'string') return value;
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'pct':
        return `${value}%`;
      case 'years':
        return lang === 'ru' ? `${value} лет` : lang === 'uk' ? `${value} років` : `${value} yrs`;
      default:
        return value.toLocaleString();
    }
  };

  const statusColors = {
    ok: 'border-green-200 bg-green-50',
    warning: 'border-amber-200 bg-amber-50',
    critical: 'border-red-200 bg-red-50',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
      {kpis.map((kpi) => {
        const content = (
          <div
            className={`p-3 rounded-lg border ${
              kpi.status ? statusColors[kpi.status] : 'border-gray-200 bg-white'
            } hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="text-xl font-semibold text-gray-900">
                {formatValue(kpi.value, kpi.format)}
              </div>
              {kpi.status && kpi.status !== 'ok' && (
                <PlStatusPill status={kpi.status} type="run" size="sm" lang={lang} />
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">{kpi.label[lang]}</div>
          </div>
        );

        return kpi.linkTo ? (
          <Link key={kpi.key} href={kpi.linkTo}>
            {content}
          </Link>
        ) : (
          <div key={kpi.key}>{content}</div>
        );
      })}
    </div>
  );
}

// Helper to build KPIs from planning data
export interface PlanningKpiData {
  activeGoals: number;
  totalGoalsAmount: number;
  fundedPct: number;
  activeScenarios: number;
  horizonYears: number;
  netCashflowAnnual: number;
  planVsActualPct: number;
  upcomingEvents: number;
}

export function buildPlanningKpis(data: PlanningKpiData): KpiItem[] {
  return [
    {
      key: 'activeGoals',
      value: data.activeGoals,
      label: { ru: 'Активных целей', en: 'Active Goals', uk: 'Активних цілей' },
      format: 'number',
      linkTo: '/m/planning/list?tab=goals',
    },
    {
      key: 'totalGoalsAmount',
      value: data.totalGoalsAmount,
      label: { ru: 'Сумма целей', en: 'Goals Amount', uk: 'Сума цілей' },
      format: 'currency',
    },
    {
      key: 'fundedPct',
      value: data.fundedPct,
      label: { ru: 'Профинансировано', en: 'Funded', uk: 'Профінансовано' },
      format: 'pct',
      status: data.fundedPct >= 80 ? 'ok' : data.fundedPct >= 50 ? 'warning' : 'critical',
    },
    {
      key: 'activeScenarios',
      value: data.activeScenarios,
      label: { ru: 'Сценариев', en: 'Scenarios', uk: 'Сценаріїв' },
      format: 'number',
      linkTo: '/m/planning/list?tab=scenarios',
    },
    {
      key: 'horizonYears',
      value: data.horizonYears,
      label: { ru: 'Горизонт', en: 'Horizon', uk: 'Горизонт' },
      format: 'years',
    },
    {
      key: 'netCashflowAnnual',
      value: data.netCashflowAnnual,
      label: { ru: 'Чистый CF/год', en: 'Net CF/Year', uk: 'Чистий CF/рік' },
      format: 'currency',
      status: data.netCashflowAnnual >= 0 ? 'ok' : 'warning',
    },
    {
      key: 'planVsActualPct',
      value: data.planVsActualPct,
      label: { ru: 'План vs Факт', en: 'Plan vs Actual', uk: 'План vs Факт' },
      format: 'pct',
      status: Math.abs(data.planVsActualPct) <= 5 ? 'ok' : Math.abs(data.planVsActualPct) <= 15 ? 'warning' : 'critical',
      linkTo: '/m/planning/list?tab=planvsactual',
    },
    {
      key: 'upcomingEvents',
      value: data.upcomingEvents,
      label: { ru: 'Событий впереди', en: 'Upcoming Events', uk: 'Подій попереду' },
      format: 'number',
      linkTo: '/m/planning/list?tab=events',
    },
  ];
}
