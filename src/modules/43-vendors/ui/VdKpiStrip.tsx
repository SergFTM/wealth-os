"use client";

import Link from 'next/link';
import { KpiCard } from '@/components/ui/KpiCard';

interface KpiValues {
  activeVendors: number;
  contractsRenew90d: number;
  slaBreaches30d: number;
  incidentsOpen: number;
  highSpendVendors: number;
  feeAnomalies: number;
  accessActive: number;
  scorecardsLow: number;
}

type VdKpiStripProps = KpiValues | { kpis: KpiValues };

interface KpiItem {
  key: string;
  value: number;
  title: string;
  status: 'ok' | 'warning' | 'critical' | 'info';
  link: string;
}

export function VdKpiStrip(props: VdKpiStripProps) {
  // Handle both direct props and kpis object format
  const v: KpiValues = 'kpis' in props ? props.kpis : props;

  const kpis: KpiItem[] = [
    {
      key: 'activeVendors',
      value: v.activeVendors,
      title: 'Активные провайдеры',
      status: v.activeVendors > 0 ? 'ok' : 'info',
      link: '/m/vendors/list?tab=vendors&status=active',
    },
    {
      key: 'contractsRenew90d',
      value: v.contractsRenew90d,
      title: 'Продление 90д',
      status: v.contractsRenew90d > 5 ? 'warning' : v.contractsRenew90d > 0 ? 'info' : 'ok',
      link: '/m/vendors/list?tab=contracts&filter=renew_90d',
    },
    {
      key: 'slaBreaches30d',
      value: v.slaBreaches30d,
      title: 'SLA нарушения 30д',
      status: v.slaBreaches30d > 0 ? 'critical' : 'ok',
      link: '/m/vendors/list?tab=slas&filter=breaches_30d',
    },
    {
      key: 'incidentsOpen',
      value: v.incidentsOpen,
      title: 'Открытые инциденты',
      status: v.incidentsOpen > 5 ? 'critical' : v.incidentsOpen > 0 ? 'warning' : 'ok',
      link: '/m/vendors/list?tab=incidents&status=open',
    },
    {
      key: 'highSpendVendors',
      value: v.highSpendVendors,
      title: 'Топ по расходам',
      status: 'ok',
      link: '/m/vendors/list?tab=invoices&filter=high_spend',
    },
    {
      key: 'feeAnomalies',
      value: v.feeAnomalies,
      title: 'Fee аномалии',
      status: v.feeAnomalies > 3 ? 'critical' : v.feeAnomalies > 0 ? 'warning' : 'ok',
      link: '/m/vendors/list?tab=invoices&filter=anomalies',
    },
    {
      key: 'accessActive',
      value: v.accessActive,
      title: 'Доступы активны',
      status: 'ok',
      link: '/m/vendors/list?tab=access&status=active',
    },
    {
      key: 'scorecardsLow',
      value: v.scorecardsLow,
      title: 'Низкие scorecards',
      status: v.scorecardsLow > 0 ? 'critical' : 'ok',
      link: '/m/vendors/list?tab=scorecards&filter=low',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => (
        <Link key={kpi.key} href={kpi.link}>
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
