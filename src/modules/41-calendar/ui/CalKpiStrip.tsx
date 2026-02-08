"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CalKpiStripProps {
  kpis: {
    eventsToday: number;
    upcoming7d: number;
    clientMeetings30d: number;
    committeeMeetings: number;
    governanceMeetings: number;
    actionsDue7d: number;
    notesMissing: number;
    integrationsConfigured: number;
  };
  className?: string;
}

export function CalKpiStrip({ kpis, className }: CalKpiStripProps) {
  const items = [
    {
      key: 'eventsToday',
      label: 'События сегодня',
      value: kpis.eventsToday,
      href: '/m/calendar/list?tab=calendar&period=today',
      status: kpis.eventsToday > 0 ? 'ok' : 'neutral',
    },
    {
      key: 'upcoming7d',
      label: 'Ближайшие 7 дней',
      value: kpis.upcoming7d,
      href: '/m/calendar/list?tab=calendar&period=7d',
      status: 'ok',
    },
    {
      key: 'clientMeetings30d',
      label: 'Встречи с клиентами',
      value: kpis.clientMeetings30d,
      href: '/m/calendar/list?tab=meetings&filter=clients',
      status: 'ok',
    },
    {
      key: 'committeeMeetings',
      label: 'Committee meetings',
      value: kpis.committeeMeetings,
      href: '/m/calendar/list?tab=meetings&filter=committee',
      status: 'ok',
    },
    {
      key: 'governanceMeetings',
      label: 'Governance meetings',
      value: kpis.governanceMeetings,
      href: '/m/calendar/list?tab=meetings&filter=governance',
      status: 'ok',
    },
    {
      key: 'actionsDue7d',
      label: 'Actions due 7d',
      value: kpis.actionsDue7d,
      href: '/m/calendar/list?tab=actions&filter=due7d',
      status: kpis.actionsDue7d > 0 ? 'warning' : 'ok',
    },
    {
      key: 'notesMissing',
      label: 'Нет заметок',
      value: kpis.notesMissing,
      href: '/m/calendar/list?tab=meetings&filter=missing_notes',
      status: kpis.notesMissing > 0 ? 'warning' : 'ok',
    },
    {
      key: 'integrationsConfigured',
      label: 'Интеграции',
      value: kpis.integrationsConfigured,
      href: '/m/calendar/list?tab=integrations',
      status: kpis.integrationsConfigured > 0 ? 'ok' : 'neutral',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'text-emerald-600';
      case 'warning':
        return 'text-amber-600';
      case 'critical':
        return 'text-rose-600';
      default:
        return 'text-stone-600';
    }
  };

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3", className)}>
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-3 hover:shadow-md transition-shadow"
        >
          <p className="text-xs text-stone-500 truncate">{item.label}</p>
          <p className={cn("text-2xl font-bold mt-1", getStatusColor(item.status))}>
            {item.value}
          </p>
        </Link>
      ))}
    </div>
  );
}
