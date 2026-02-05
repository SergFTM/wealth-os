'use client';

import Link from 'next/link';
import { casesConfig } from '../config';

interface KpiValues {
  openInQueue: number;
  myOpenCases: number;
  breachedSla: number;
  dueSoon24h: number;
  incidents7d: number;
  changesPending: number;
  clientCasesOpen: number;
  caseTemplates: number;
}

interface CsKpiStripProps {
  kpis: KpiValues;
  locale: string;
}

const kpiLinks: Record<string, string> = {
  openInQueue: '/m/cases/list?tab=queue&status=open',
  myOpenCases: '/m/cases/list?tab=my&status=open',
  breachedSla: '/m/cases/list?tab=queue&filter=sla_breached',
  dueSoon24h: '/m/cases/list?tab=queue&filter=due_24h',
  incidents7d: '/m/cases/list?tab=queue&type=incident&period=7d',
  changesPending: '/m/cases/list?tab=queue&type=change&status=pending',
  clientCasesOpen: '/m/cases/list?tab=queue&filter=client_visible',
  caseTemplates: '/m/cases/list?tab=templates',
};

export function CsKpiStrip({ kpis, locale }: CsKpiStripProps) {
  const config = casesConfig;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {config.kpis?.map((kpi) => {
        const value = kpis[kpi.key as keyof KpiValues] ?? 0;
        const link = kpiLinks[kpi.key];

        const statusColors = {
          ok: 'text-emerald-600',
          warning: 'text-amber-600',
          critical: 'text-red-600',
          info: 'text-blue-600',
        };

        const bgColors = {
          ok: 'from-emerald-50 to-emerald-100/50 border-emerald-200/50',
          warning: 'from-amber-50 to-amber-100/50 border-amber-200/50',
          critical: 'from-red-50 to-red-100/50 border-red-200/50',
          info: 'from-blue-50 to-blue-100/50 border-blue-200/50',
        };

        const status = value > 0 && kpi.key === 'breachedSla' ? 'critical' :
          value > 0 && kpi.key === 'dueSoon24h' ? 'warning' :
            kpi.status || 'ok';

        const content = (
          <div
            className={`
              p-4 rounded-xl border bg-gradient-to-br backdrop-blur-sm
              ${bgColors[status]}
              transition-all hover:shadow-md hover:scale-[1.02]
            `}
          >
            <div className="text-xs font-medium text-gray-500 truncate">
              {kpi.title[locale as keyof typeof kpi.title] || kpi.title.ru}
            </div>
            <div className={`text-2xl font-bold mt-1 ${statusColors[status]}`}>
              {kpi.format === 'percent'
                ? `${(value * 100).toFixed(0)}%`
                : value.toLocaleString()
              }
            </div>
          </div>
        );

        return link ? (
          <Link key={kpi.key} href={link}>
            {content}
          </Link>
        ) : (
          <div key={kpi.key}>{content}</div>
        );
      })}
    </div>
  );
}
