"use client";

import { useRouter } from 'next/navigation';
import { KpiCard } from '@/components/ui/KpiCard';

interface KpiItem {
  id: string;
  label: string;
  value: string | number;
  status: 'ok' | 'warning' | 'critical' | 'info';
  linkTo: string;
  subtitle?: string;
}

interface LqKpiStripProps {
  kpis: KpiItem[];
}

export function LqKpiStrip({ kpis }: LqKpiStripProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.id}
          title={kpi.label}
          value={kpi.value}
          subtitle={kpi.subtitle}
          status={kpi.status}
          onClick={() => router.push(kpi.linkTo)}
        />
      ))}
    </div>
  );
}
