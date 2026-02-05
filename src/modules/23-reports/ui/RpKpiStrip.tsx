'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface DashboardKpis {
  draftPacks: number;
  lockedPacks: number;
  publishedPacks: number;
  exports7d: number;
  activeShares: number;
  missingSources: number;
  clientSafePacks: number;
  libraryItems: number;
}

interface RpKpiStripProps {
  kpis: DashboardKpis;
}

interface KpiCardProps {
  title: string;
  value: number | string;
  status?: 'ok' | 'warning' | 'critical';
  onClick?: () => void;
}

function KpiCard({ title, value, status = 'ok', onClick }: KpiCardProps) {
  const statusColors = {
    ok: 'text-emerald-600',
    warning: 'text-amber-600',
    critical: 'text-red-600',
  };

  const bgColors = {
    ok: 'hover:bg-emerald-50',
    warning: 'hover:bg-amber-50',
    critical: 'hover:bg-red-50',
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border border-gray-200 bg-white shadow-sm
        ${onClick ? `cursor-pointer ${bgColors[status]} hover:border-gray-300 transition-all` : ''}
      `}
    >
      <p className="text-xs text-gray-500 font-medium">{title}</p>
      <p className={`text-2xl font-semibold mt-1 ${statusColors[status]}`}>
        {value}
      </p>
    </div>
  );
}

export function RpKpiStrip({ kpis }: RpKpiStripProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
      <KpiCard
        title="Черновики"
        value={kpis.draftPacks}
        status={kpis.draftPacks > 0 ? 'warning' : 'ok'}
        onClick={() => router.push('/m/reports/list?status=draft')}
      />
      <KpiCard
        title="Заблокированы"
        value={kpis.lockedPacks}
        onClick={() => router.push('/m/reports/list?status=locked')}
      />
      <KpiCard
        title="Опубликованы"
        value={kpis.publishedPacks}
        onClick={() => router.push('/m/reports/list?status=published')}
      />
      <KpiCard
        title="Экспорты 7д"
        value={kpis.exports7d}
        onClick={() => router.push('/m/reports/list?tab=exports&period=7d')}
      />
      <KpiCard
        title="Активные ссылки"
        value={kpis.activeShares}
        onClick={() => router.push('/m/reports/list?tab=shares&status=active')}
      />
      <KpiCard
        title="Без источников"
        value={kpis.missingSources}
        status={kpis.missingSources > 0 ? 'critical' : 'ok'}
        onClick={() => router.push('/m/reports/list?filter=missing_sources')}
      />
      <KpiCard
        title="Клиентские"
        value={kpis.clientSafePacks}
        onClick={() => router.push('/m/reports/list?clientSafe=true')}
      />
      <KpiCard
        title="В библиотеке"
        value={kpis.libraryItems}
        onClick={() => router.push('/m/reports/list?tab=library')}
      />
    </div>
  );
}
