"use client";

import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { invoices, formatCurrency } from "@/lib/data";

const billingData = [
  { id: '1', client: 'Aurora Family', aum: 125000000, fee: 312500, feePercent: '0.25%', lastBilled: '2026-01-01', status: 'paid' },
  { id: '2', client: 'Limassol Holdings', aum: 85000000, fee: 212500, feePercent: '0.25%', lastBilled: '2026-01-01', status: 'paid' },
  { id: '3', client: 'North Star Trust', aum: 45000000, fee: 135000, feePercent: '0.30%', lastBilled: '2026-01-01', status: 'pending' },
  { id: '4', client: 'Vega Partners', aum: 67000000, fee: 167500, feePercent: '0.25%', lastBilled: '2026-01-01', status: 'paid' },
];

export default function BillingPage() {
  const { t } = useApp();
  const totalAUM = billingData.reduce((s, b) => s + b.aum, 0);
  const totalFees = billingData.reduce((s, b) => s + b.fee, 0);

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.billing}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="AUM" value={formatCurrency(totalAUM)} status="ok" />
        <KpiCard title="Fees (квартал)" value={formatCurrency(totalFees)} status="ok" />
        <KpiCard title="Средняя ставка" value="0.26%" status="ok" />
        <KpiCard title="Клиентов" value={billingData.length} status="ok" />
      </div>

      <DataTable
        data={billingData}
        columns={[
          { key: 'client', header: 'Клиент', render: (item) => <span className="font-medium">{item.client}</span> },
          { key: 'aum', header: 'AUM', render: (item) => formatCurrency(item.aum) },
          { key: 'fee', header: 'Fee', render: (item) => formatCurrency(item.fee) },
          { key: 'feePercent', header: 'Ставка' },
          { key: 'status', header: 'Статус', render: (item) => <StatusBadge status={item.status as 'paid' | 'pending'} size="sm" /> },
        ]}
        onRowClick={() => {}}
      />
    </div>
  );
}
