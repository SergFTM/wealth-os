'use client';

import type { ModuleConfig } from '@/modules/types';

interface NtKpiStripProps {
  kpis: {
    unreadCount: number;
    todayCount: number;
    escalationsActive: number;
    rulesFiring: number;
    deliveryRate: number;
    avgResponseTime: number;
    channelsActive: number;
    aiTriageRate: number;
  };
  config: ModuleConfig;
  locale: string;
}

export function NtKpiStrip({ kpis, config, locale }: NtKpiStripProps) {
  const formatValue = (key: string, value: number, format: string) => {
    switch (format) {
      case 'percent':
        return `${(value * 100).toFixed(0)}%`;
      case 'duration':
        if (value < 60) return `${value.toFixed(0)} мин`;
        return `${(value / 60).toFixed(1)} ч`;
      case 'number':
      default:
        return value.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US');
    }
  };

  const getKpiValue = (key: string): number => {
    return kpis[key as keyof typeof kpis] || 0;
  };

  if (!config.kpis) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {config.kpis.map((kpi) => {
        const value = getKpiValue(kpi.key);
        const isHighlight = kpi.key === 'unreadCount' && value > 0;
        const isWarning = kpi.key === 'escalationsActive' && value > 0;

        return (
          <div
            key={kpi.key}
            className={`
              p-4 rounded-xl border shadow-sm transition-all
              ${isWarning
                ? 'bg-amber-50 border-amber-200'
                : isHighlight
                  ? 'bg-gradient-to-br from-emerald-50 to-amber-50 border-emerald-200'
                  : 'bg-white/80 backdrop-blur-sm border-gray-200/50'
              }
            `}
          >
            <div className={`text-xs font-medium mb-1 ${isWarning ? 'text-amber-700' : 'text-gray-500'}`}>
              {kpi.title[locale as keyof typeof kpi.title] || kpi.title.en}
            </div>
            <div className={`text-xl font-bold ${isWarning ? 'text-amber-700' : isHighlight ? 'text-emerald-700' : 'text-gray-900'}`}>
              {formatValue(kpi.key, value, kpi.format || 'number')}
            </div>
          </div>
        );
      })}
    </div>
  );
}
