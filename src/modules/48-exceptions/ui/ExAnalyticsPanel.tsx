'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Exception {
  id: string;
  typeKey: string;
  severity: string;
  status: string;
  sourceModuleKey: string;
  createdAt: string;
  closedAt?: string;
}

interface ExAnalyticsPanelProps {
  exceptions: Exception[];
  className?: string;
}

const typeLabels: Record<string, string> = {
  sync: 'Синхронизация',
  recon: 'Сверка',
  missing_doc: 'Документы',
  stale_price: 'Цены',
  approval: 'Согласования',
  vendor_sla: 'SLA вендоров',
  security: 'Безопасность'
};

const moduleLabels: Record<string, string> = {
  '14': 'Интеграции',
  '2': 'GL',
  '39': 'Ликвидность',
  '42': 'Сделки',
  '5': 'Документы',
  '16': 'Цены',
  '7': 'Согласования',
  '43': 'Вендоры',
  '17': 'Безопасность'
};

export function ExAnalyticsPanel({ exceptions, className }: ExAnalyticsPanelProps) {
  const stats = useMemo(() => {
    const open = exceptions.filter(e => e.status !== 'closed');
    const closed = exceptions.filter(e => e.status === 'closed');

    // By severity
    const bySeverity = {
      critical: open.filter(e => e.severity === 'critical').length,
      warning: open.filter(e => e.severity === 'warning').length,
      ok: open.filter(e => e.severity === 'ok').length
    };

    // By type
    const byType = new Map<string, number>();
    for (const e of open) {
      byType.set(e.typeKey, (byType.get(e.typeKey) || 0) + 1);
    }

    // By source module
    const byModule = new Map<string, number>();
    for (const e of open) {
      byModule.set(e.sourceModuleKey, (byModule.get(e.sourceModuleKey) || 0) + 1);
    }

    // Average time to close (in hours)
    let avgTimeToClose = 0;
    if (closed.length > 0) {
      const times = closed
        .filter(e => e.closedAt)
        .map(e => {
          const created = new Date(e.createdAt).getTime();
          const closedAt = new Date(e.closedAt!).getTime();
          return (closedAt - created) / (1000 * 60 * 60);
        });
      avgTimeToClose = times.reduce((a, b) => a + b, 0) / times.length;
    }

    return {
      total: exceptions.length,
      open: open.length,
      closed: closed.length,
      bySeverity,
      byType: Array.from(byType.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      byModule: Array.from(byModule.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      avgTimeToClose: Math.round(avgTimeToClose)
    };
  }, [exceptions]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Всего" value={stats.total} />
        <SummaryCard label="Открытых" value={stats.open} status="warning" />
        <SummaryCard label="Закрытых" value={stats.closed} status="ok" />
        <SummaryCard
          label="Ср. время закрытия"
          value={`${stats.avgTimeToClose}ч`}
          status="info"
        />
      </div>

      {/* By Severity */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
        <h3 className="text-sm font-medium text-stone-700 mb-3">По важности (открытые)</h3>
        <div className="space-y-2">
          <BarItem
            label="Критичные"
            value={stats.bySeverity.critical}
            max={stats.open}
            color="bg-red-500"
          />
          <BarItem
            label="Предупреждения"
            value={stats.bySeverity.warning}
            max={stats.open}
            color="bg-amber-500"
          />
          <BarItem
            label="Норма"
            value={stats.bySeverity.ok}
            max={stats.open}
            color="bg-emerald-500"
          />
        </div>
      </div>

      {/* By Type */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
        <h3 className="text-sm font-medium text-stone-700 mb-3">По типу (топ 5)</h3>
        <div className="space-y-2">
          {stats.byType.map(([type, count]) => (
            <BarItem
              key={type}
              label={typeLabels[type] || type}
              value={count}
              max={stats.open}
              color="bg-blue-500"
            />
          ))}
          {stats.byType.length === 0 && (
            <div className="text-sm text-stone-400 text-center py-2">Нет данных</div>
          )}
        </div>
      </div>

      {/* By Module */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
        <h3 className="text-sm font-medium text-stone-700 mb-3">По источнику (топ 5)</h3>
        <div className="space-y-2">
          {stats.byModule.map(([module, count]) => (
            <BarItem
              key={module}
              label={moduleLabels[module] || `Модуль ${module}`}
              value={count}
              max={stats.open}
              color="bg-indigo-500"
            />
          ))}
          {stats.byModule.length === 0 && (
            <div className="text-sm text-stone-400 text-center py-2">Нет данных</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  status
}: {
  label: string;
  value: number | string;
  status?: 'ok' | 'warning' | 'critical' | 'info';
}) {
  const statusColors = {
    ok: 'bg-emerald-50 border-emerald-200',
    warning: 'bg-amber-50 border-amber-200',
    critical: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={cn(
      'rounded-xl border p-4',
      status ? statusColors[status] : 'bg-white/60 border-stone-200'
    )}>
      <div className="text-2xl font-bold text-stone-900">{value}</div>
      <div className="text-xs text-stone-500 mt-1">{label}</div>
    </div>
  );
}

function BarItem({
  label,
  value,
  max,
  color
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-sm text-stone-600 truncate">{label}</div>
      <div className="flex-1 h-4 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="w-10 text-sm text-stone-700 text-right font-medium">{value}</div>
    </div>
  );
}

export default ExAnalyticsPanel;
