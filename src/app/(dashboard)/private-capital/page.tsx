"use client";

import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";

const privateCapitalData = [
  { id: '1', name: 'Tech Growth Fund III', type: 'VC', vintage: '2023', commitment: 5000000, called: 3500000, nav: 4200000 },
  { id: '2', name: 'Real Estate Partners IV', type: 'RE', vintage: '2022', commitment: 10000000, called: 8000000, nav: 9500000 },
  { id: '3', name: 'Buyout Fund VII', type: 'PE', vintage: '2024', commitment: 7500000, called: 2000000, nav: 2100000 },
  { id: '4', name: 'Infrastructure Fund II', type: 'Infra', vintage: '2023', commitment: 3000000, called: 1500000, nav: 1650000 },
];

export default function PrivateCapitalPage() {
  const { t } = useApp();
  const formatCurrency = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.privateCapital}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Всего обязательств" value={formatCurrency(25500000)} status="ok" />
        <KpiCard title="Внесено" value={formatCurrency(15000000)} status="ok" />
        <KpiCard title="NAV" value={formatCurrency(17450000)} status="ok" />
        <KpiCard title="TVPI" value="1.16x" status="ok" />
      </div>

      <DataTable
        data={privateCapitalData}
        columns={[
          { key: 'name', header: 'Фонд', render: (item) => <span className="font-medium">{item.name}</span> },
          { key: 'type', header: 'Тип' },
          { key: 'vintage', header: 'Год' },
          { key: 'commitment', header: 'Обязательство', render: (item) => formatCurrency(item.commitment) },
          { key: 'called', header: 'Внесено', render: (item) => formatCurrency(item.called) },
          { key: 'nav', header: 'NAV', render: (item) => formatCurrency(item.nav) },
        ]}
        onRowClick={() => {}}
      />
    </div>
  );
}
