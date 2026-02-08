"use client";

import Link from 'next/link';
import { KpiCard } from '@/components/ui/KpiCard';

interface KpiItem {
  key: string;
  value: number;
  title: string;
  status: 'ok' | 'warning' | 'critical' | 'info';
  link?: string;
  format?: 'number' | 'currency';
}

interface PhKpiStripProps {
  grantsInReview: number;
  approvalsPending: number;
  payoutsScheduled: number;
  budgetRemaining: number;
  complianceOpen: number;
  missingDocs: number;
  impactDue: number;
  clientSafePublished: number;
}

export function PhKpiStrip(props: PhKpiStripProps) {
  const kpis: KpiItem[] = [
    {
      key: 'grantsInReview',
      value: props.grantsInReview,
      title: 'Гранты на рассмотрении',
      status: props.grantsInReview > 5 ? 'warning' : 'ok',
      link: '/m/philanthropy/list?tab=grants&status=in_review',
    },
    {
      key: 'approvalsPending',
      value: props.approvalsPending,
      title: 'Ожидают согласования',
      status: props.approvalsPending > 3 ? 'warning' : 'ok',
      link: '/m/philanthropy/list?tab=grants&filter=approval_pending',
    },
    {
      key: 'payoutsScheduled',
      value: props.payoutsScheduled,
      title: 'Выплаты 30д',
      status: 'ok',
      link: '/m/philanthropy/list?tab=payouts&period=30d',
      format: 'currency',
    },
    {
      key: 'budgetRemaining',
      value: props.budgetRemaining,
      title: 'Бюджет YTD',
      status: props.budgetRemaining < 100000 ? 'warning' : 'ok',
      link: '/m/philanthropy/list?tab=budgets&metric=remaining',
      format: 'currency',
    },
    {
      key: 'complianceOpen',
      value: props.complianceOpen,
      title: 'Комплаенс проверки',
      status: props.complianceOpen > 10 ? 'warning' : 'ok',
      link: '/m/philanthropy/list?tab=compliance&status=open',
    },
    {
      key: 'missingDocs',
      value: props.missingDocs,
      title: 'Нет документов',
      status: props.missingDocs > 0 ? 'critical' : 'ok',
      link: '/m/philanthropy/list?tab=grants&filter=missing_docs',
    },
    {
      key: 'impactDue',
      value: props.impactDue,
      title: 'Impact reports due',
      status: props.impactDue > 5 ? 'warning' : 'ok',
      link: '/m/philanthropy/list?tab=impact&filter=due',
    },
    {
      key: 'clientSafePublished',
      value: props.clientSafePublished,
      title: 'Опубликовано',
      status: 'ok',
      link: '/m/philanthropy/list?tab=impact&filter=client_safe',
    },
  ];

  const formatValue = (value: number, format?: 'number' | 'currency'): string | number => {
    if (format === 'currency') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => (
        <Link key={kpi.key} href={kpi.link || '#'}>
          <KpiCard
            title={kpi.title}
            value={formatValue(kpi.value, kpi.format)}
            status={kpi.status}
            className="h-full cursor-pointer hover:scale-[1.02] transition-transform"
          />
        </Link>
      ))}
    </div>
  );
}
