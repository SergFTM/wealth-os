"use client";

import Link from 'next/link';
import { KpiCard } from '@/components/ui/KpiCard';

interface KpiItem {
  key: string;
  value: number;
  title: string;
  status: 'ok' | 'warning' | 'critical' | 'info';
  link?: string;
}

interface GvKpiStripProps {
  upcomingMeetings: number;
  pendingDecisions: number;
  openVotes: number;
  openActions: number;
  activePolicies: number;
  draftedMinutes: number;
  clientSafePublished: number;
  quorumIssues: number;
}

export function GvKpiStrip(props: GvKpiStripProps) {
  const kpis: KpiItem[] = [
    {
      key: 'upcomingMeetings',
      value: props.upcomingMeetings,
      title: 'Предстоящие заседания',
      status: props.upcomingMeetings > 0 ? 'ok' : 'info',
      link: '/m/governance/list?tab=meetings&filter=upcoming',
    },
    {
      key: 'pendingDecisions',
      value: props.pendingDecisions,
      title: 'Решения на голосовании',
      status: props.pendingDecisions > 3 ? 'warning' : 'ok',
      link: '/m/governance/list?tab=decisions&status=pending_vote',
    },
    {
      key: 'openVotes',
      value: props.openVotes,
      title: 'Открытые голосования',
      status: props.openVotes > 0 ? 'warning' : 'ok',
      link: '/m/governance/list?tab=votes&status=open',
    },
    {
      key: 'openActions',
      value: props.openActions,
      title: 'Открытые action items',
      status: props.openActions > 10 ? 'warning' : 'ok',
      link: '/m/governance/list?tab=actions&status=open',
    },
    {
      key: 'activePolicies',
      value: props.activePolicies,
      title: 'Активные политики',
      status: 'ok',
      link: '/m/governance/list?tab=policies&status=active',
    },
    {
      key: 'draftedMinutes',
      value: props.draftedMinutes,
      title: 'Протоколы (30д)',
      status: 'ok',
      link: '/m/governance/list?tab=minutes&period=30d',
    },
    {
      key: 'clientSafePublished',
      value: props.clientSafePublished,
      title: 'Опубликовано для клиента',
      status: 'ok',
      link: '/m/governance/list?tab=minutes&filter=client_safe',
    },
    {
      key: 'quorumIssues',
      value: props.quorumIssues,
      title: 'Проблемы кворума',
      status: props.quorumIssues > 0 ? 'critical' : 'ok',
      link: '/m/governance/list?tab=votes&filter=quorum_risk',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => (
        <Link key={kpi.key} href={kpi.link || '#'}>
          <KpiCard
            title={kpi.title}
            value={kpi.value}
            status={kpi.status}
            className="h-full cursor-pointer hover:scale-[1.02] transition-transform"
          />
        </Link>
      ))}
    </div>
  );
}
