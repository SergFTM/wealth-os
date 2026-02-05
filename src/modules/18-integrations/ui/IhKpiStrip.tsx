"use client";

import Link from 'next/link';
import {
  Plug,
  Calendar,
  XCircle,
  AlertTriangle,
  AlertOctagon,
  Link2Off,
  Scale,
  FileWarning
} from 'lucide-react';

interface KpiItem {
  id: string;
  label: string;
  value: string | number;
  color?: 'default' | 'amber' | 'red' | 'emerald';
  href?: string;
}

interface IhKpiStripProps {
  items?: KpiItem[];
}

const defaultKpis: KpiItem[] = [
  { id: 'connectorsActive', label: 'Активные коннекторы', value: '13', color: 'default', href: '/m/integrations/list?tab=connectors&status=active' },
  { id: 'jobsScheduled', label: 'Jobs запланировано', value: '19', color: 'default', href: '/m/integrations/list?tab=jobs&status=enabled' },
  { id: 'runsFailed7d', label: 'Ошибки 7д', value: '8', color: 'red', href: '/m/integrations/list?tab=runs&status=failed' },
  { id: 'qualityOpen', label: 'Открытые проблемы', value: '25', color: 'amber', href: '/m/integrations/list?tab=quality&status=open' },
  { id: 'criticalIssues', label: 'Критические', value: '10', color: 'red', href: '/m/integrations/list?tab=quality&severity=critical' },
  { id: 'mappingGaps', label: 'Пробелы маппинга', value: '12', color: 'amber', href: '/m/integrations/list?tab=mapping&filter=gaps' },
  { id: 'reconciliationBreaks', label: 'Расхождения', value: '6', color: 'amber', href: '/m/integrations/list?tab=reconciliation&status=break' },
  { id: 'errorsLast24h', label: 'Ошибки 24ч', value: '15', color: 'amber', href: '/m/integrations/list?tab=errors' },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  connectorsActive: Plug,
  jobsScheduled: Calendar,
  runsFailed7d: XCircle,
  qualityOpen: AlertTriangle,
  criticalIssues: AlertOctagon,
  mappingGaps: Link2Off,
  reconciliationBreaks: Scale,
  errorsLast24h: FileWarning,
};

export function IhKpiStrip({ items = defaultKpis }: IhKpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = iconMap[item.id] || Plug;

        const colorClasses = {
          default: 'bg-stone-50 border-stone-200',
          amber: 'bg-amber-50 border-amber-200',
          red: 'bg-red-50 border-red-200',
          emerald: 'bg-emerald-50 border-emerald-200',
        };

        const valueColors = {
          default: 'text-stone-800',
          amber: 'text-amber-700',
          red: 'text-red-700',
          emerald: 'text-emerald-700',
        };

        const iconColors = {
          default: 'text-stone-400',
          amber: 'text-amber-500',
          red: 'text-red-500',
          emerald: 'text-emerald-500',
        };

        const content = (
          <div
            className={`p-4 rounded-xl border ${colorClasses[item.color || 'default']} transition-all hover:shadow-md cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-2">
              <Icon className={`w-5 h-5 ${iconColors[item.color || 'default']}`} />
            </div>
            <div className={`text-2xl font-bold ${valueColors[item.color || 'default']} mb-1`}>
              {item.value}
            </div>
            <div className="text-xs text-stone-500">{item.label}</div>
          </div>
        );

        if (item.href) {
          return (
            <Link key={item.id} href={item.href}>
              {content}
            </Link>
          );
        }

        return <div key={item.id}>{content}</div>;
      })}
    </div>
  );
}
