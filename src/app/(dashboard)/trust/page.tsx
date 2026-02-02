"use client";

import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";

const trustData = [
  { id: '1', name: 'Aurora Dynasty Trust', jurisdiction: 'Nevada', assets: 45000000, beneficiaries: 12, status: 'Active' },
  { id: '2', name: 'Limassol Charitable Trust', jurisdiction: 'Delaware', assets: 15000000, beneficiaries: 3, status: 'Active' },
  { id: '3', name: 'North Star GRAT', jurisdiction: 'South Dakota', assets: 8000000, beneficiaries: 4, status: 'Active' },
  { id: '4', name: 'Vega QPRT', jurisdiction: 'Nevada', assets: 5500000, beneficiaries: 2, status: 'Active' },
];

export default function TrustPage() {
  const { t } = useApp();
  const formatCurrency = (n: number) => n.toLocaleString('ru-RU', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.trust}</h1>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {t.disclaimers.trust}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Всего трастов" value={trustData.length} status="ok" />
        <KpiCard title="Активы в трастах" value={formatCurrency(73500000)} status="ok" />
        <KpiCard title="Бенефициаров" value="21" status="ok" />
        <KpiCard title="Юрисдикций" value="3" status="ok" />
      </div>

      <DataTable
        data={trustData}
        columns={[
          { key: 'name', header: 'Траст', render: (item) => <span className="font-medium">{item.name}</span> },
          { key: 'jurisdiction', header: 'Юрисдикция' },
          { key: 'assets', header: 'Активы', render: (item) => formatCurrency(item.assets) },
          { key: 'beneficiaries', header: 'Бенефициары' },
          { key: 'status', header: 'Статус' },
        ]}
        onRowClick={() => {}}
      />
    </div>
  );
}
