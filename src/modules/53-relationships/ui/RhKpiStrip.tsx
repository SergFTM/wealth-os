"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export interface RhKpiData {
  vipHouseholds: number;
  openInitiatives: number;
  overdueFollowups: number;
  coverageGaps: number;
  interactions7d: number;
  topAdvisors: number;
  clientSafeCards: number;
  linkedCases: number;
}

interface RhKpiStripProps {
  kpis: RhKpiData;
}

interface KpiCardProps {
  title: string;
  value: number;
  status: 'ok' | 'warning' | 'critical' | 'info';
  href?: string;
}

function KpiCard({ title, value, status, href }: KpiCardProps) {
  const router = useRouter();

  const statusColors = {
    ok: 'from-emerald-50 to-emerald-100/50 border-emerald-200',
    warning: 'from-amber-50 to-amber-100/50 border-amber-200',
    critical: 'from-red-50 to-red-100/50 border-red-200',
    info: 'from-blue-50 to-blue-100/50 border-blue-200',
  };

  const valueColors = {
    ok: 'text-emerald-700',
    warning: 'text-amber-700',
    critical: 'text-red-700',
    info: 'text-blue-700',
  };

  const handleClick = () => {
    if (href) router.push(href);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative overflow-hidden rounded-xl border bg-gradient-to-br p-4
        backdrop-blur-sm transition-all duration-200
        ${statusColors[status]}
        ${href ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''}
      `}
    >
      <div className="absolute inset-0 bg-white/40" />
      <div className="relative">
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
          {title}
        </p>
        <p className={`text-2xl font-bold ${valueColors[status]}`}>
          {value.toLocaleString('ru-RU')}
        </p>
      </div>
    </div>
  );
}

export function RhKpiStrip({ kpis }: RhKpiStripProps) {
  const kpiCards = [
    {
      title: 'VIP домохозяйства',
      value: kpis.vipHouseholds,
      status: 'ok' as const,
      href: '/m/relationships/list?tab=vip',
    },
    {
      title: 'Открытые инициативы',
      value: kpis.openInitiatives,
      status: kpis.openInitiatives > 10 ? 'warning' as const : 'ok' as const,
      href: '/m/relationships/list?tab=initiatives&status=open',
    },
    {
      title: 'Просроченные follow-up',
      value: kpis.overdueFollowups,
      status: kpis.overdueFollowups > 0 ? 'critical' as const : 'ok' as const,
      href: '/m/relationships/list?tab=interactions&filter=followup_overdue',
    },
    {
      title: 'Gaps в покрытии',
      value: kpis.coverageGaps,
      status: kpis.coverageGaps > 0 ? 'warning' as const : 'ok' as const,
      href: '/m/relationships/list?tab=coverage&filter=gaps',
    },
    {
      title: 'Взаимодействия 7д',
      value: kpis.interactions7d,
      status: 'info' as const,
      href: '/m/relationships/list?tab=interactions&period=7d',
    },
    {
      title: 'Топ RM по активности',
      value: kpis.topAdvisors,
      status: 'info' as const,
      href: '/m/relationships/list?tab=analytics&metric=advisors',
    },
    {
      title: 'Client-safe карточки',
      value: kpis.clientSafeCards,
      status: 'ok' as const,
      href: '/m/relationships/list?tab=vip&filter=client_safe',
    },
    {
      title: 'Связанные кейсы',
      value: kpis.linkedCases,
      status: kpis.linkedCases > 5 ? 'warning' as const : 'info' as const,
      href: '/m/relationships/list?tab=initiatives&filter=linked_cases',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpiCards.map((card) => (
        <KpiCard key={card.title} {...card} />
      ))}
    </div>
  );
}

export default RhKpiStrip;
