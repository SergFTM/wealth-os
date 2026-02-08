'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface KpiItem {
  key: string;
  value: number | string;
  title: string;
  status: 'ok' | 'warning' | 'critical' | 'info';
  link?: string;
  subtitle?: string;
}

interface ExKpiStripProps {
  openExceptions: number;
  criticalToday: number;
  slaAtRisk: number;
  overdueAssigned: number;
  autoClosed7d: number;
  topModuleSource: string;
  activeClusters: number;
  enabledRules: number;
}

const statusColors = {
  ok: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  critical: 'bg-red-50 border-red-200 text-red-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700'
};

export function ExKpiStrip({
  openExceptions,
  criticalToday,
  slaAtRisk,
  overdueAssigned,
  autoClosed7d,
  topModuleSource,
  activeClusters,
  enabledRules
}: ExKpiStripProps) {
  const kpis: KpiItem[] = [
    {
      key: 'open',
      value: openExceptions,
      title: 'Открытые',
      status: openExceptions > 50 ? 'warning' : 'info',
      link: '/m/exceptions/list?tab=queue&status=open'
    },
    {
      key: 'critical',
      value: criticalToday,
      title: 'Критичные сегодня',
      status: criticalToday > 0 ? 'critical' : 'ok',
      link: '/m/exceptions/list?tab=queue&severity=critical'
    },
    {
      key: 'slaRisk',
      value: slaAtRisk,
      title: 'SLA под риском',
      status: slaAtRisk > 0 ? 'warning' : 'ok',
      link: '/m/exceptions/list?tab=queue&filter=sla_risk'
    },
    {
      key: 'overdue',
      value: overdueAssigned,
      title: 'Просрочено',
      status: overdueAssigned > 0 ? 'critical' : 'ok',
      link: '/m/exceptions/list?tab=queue&filter=overdue'
    },
    {
      key: 'autoclosed',
      value: autoClosed7d,
      title: 'Авто-закрыто 7д',
      status: 'ok',
      link: '/m/exceptions/list?tab=analytics&metric=autoclosed'
    },
    {
      key: 'topSource',
      value: topModuleSource,
      title: 'Топ источник',
      status: 'info',
      link: '/m/exceptions/list?tab=analytics&metric=top_source'
    },
    {
      key: 'clusters',
      value: activeClusters,
      title: 'Активные кластеры',
      status: 'info',
      link: '/m/exceptions/list?tab=clusters&status=active'
    },
    {
      key: 'rules',
      value: enabledRules,
      title: 'Активные правила',
      status: 'ok',
      link: '/m/exceptions/list?tab=rules&enabled=true'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.key} kpi={kpi} />
      ))}
    </div>
  );
}

function KpiCard({ kpi }: { kpi: KpiItem }) {
  const content = (
    <div
      className={cn(
        'rounded-xl border p-3 backdrop-blur-sm transition-all hover:shadow-md',
        statusColors[kpi.status]
      )}
    >
      <div className="text-2xl font-bold">{kpi.value}</div>
      <div className="text-xs font-medium opacity-80 mt-1">{kpi.title}</div>
      {kpi.subtitle && (
        <div className="text-xs opacity-60 mt-0.5">{kpi.subtitle}</div>
      )}
    </div>
  );

  if (kpi.link) {
    return (
      <Link href={kpi.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export default ExKpiStrip;
