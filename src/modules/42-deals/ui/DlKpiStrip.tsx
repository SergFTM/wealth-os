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

interface DlKpiStripProps {
  upcomingActions: number;
  dealsInReview: number;
  approvalsPending: number;
  checklistsIncomplete: number;
  fundEventsNext30d: number;
  docsMissing: number;
  glPostingsPending: number;
  taxImpactFlagged: number;
}

export function DlKpiStrip(props: DlKpiStripProps) {
  const kpis: KpiItem[] = [
    {
      key: 'upcomingActions',
      value: props.upcomingActions,
      title: 'Corporate actions',
      status: props.upcomingActions > 0 ? 'warning' : 'ok',
      link: '/m/deals/list?tab=actions&filter=upcoming',
    },
    {
      key: 'dealsInReview',
      value: props.dealsInReview,
      title: 'Deals на рассмотрении',
      status: props.dealsInReview > 5 ? 'warning' : 'ok',
      link: '/m/deals/list?tab=deals&status=in_review',
    },
    {
      key: 'approvalsPending',
      value: props.approvalsPending,
      title: 'Согласования ожидают',
      status: props.approvalsPending > 3 ? 'warning' : 'ok',
      link: '/m/deals/list?tab=approvals&status=pending',
    },
    {
      key: 'checklistsIncomplete',
      value: props.checklistsIncomplete,
      title: 'Checklists незавершены',
      status: props.checklistsIncomplete > 5 ? 'warning' : 'ok',
      link: '/m/deals/list?tab=checklists&filter=incomplete',
    },
    {
      key: 'fundEventsNext30d',
      value: props.fundEventsNext30d,
      title: 'Fund events 30д',
      status: props.fundEventsNext30d > 0 ? 'info' : 'ok',
      link: '/m/deals/list?tab=fund_events&period=30d',
    },
    {
      key: 'docsMissing',
      value: props.docsMissing,
      title: 'Документы отсутствуют',
      status: props.docsMissing > 0 ? 'critical' : 'ok',
      link: '/m/deals/list?tab=documents&filter=missing',
    },
    {
      key: 'glPostingsPending',
      value: props.glPostingsPending,
      title: 'GL проводки ожидают',
      status: props.glPostingsPending > 0 ? 'warning' : 'ok',
      link: '/m/deals/list?tab=approvals&filter=gl_pending',
    },
    {
      key: 'taxImpactFlagged',
      value: props.taxImpactFlagged,
      title: 'Tax impact',
      status: props.taxImpactFlagged > 0 ? 'critical' : 'ok',
      link: '/m/deals/list?tab=deals&filter=tax_flag',
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

export default DlKpiStrip;
