"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ipsBreaches, formatDateTime, IpsBreach } from "@/lib/data";

export default function IpsPage() {
  const { t } = useApp();
  const [selectedBreach, setSelectedBreach] = useState<IpsBreach | null>(null);

  const critical = ipsBreaches.filter(b => b.severity === 'critical');
  const warning = ipsBreaches.filter(b => b.severity === 'warning');

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.ips}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Всего нарушений" value={ipsBreaches.length} status={ipsBreaches.length > 10 ? 'critical' : 'warning'} />
        <KpiCard title="Критические" value={critical.length} status="critical" />
        <KpiCard title="Предупреждения" value={warning.length} status="warning" />
        <KpiCard title="Compliance Score" value="94%" status="ok" />
      </div>

      <DataTable
        data={ipsBreaches}
        columns={[
          { key: 'rule', header: 'Правило', render: (item) => <span className="font-medium">{item.rule}</span> },
          { key: 'client', header: 'Клиент' },
          { key: 'current', header: 'Текущее' },
          { key: 'threshold', header: 'Лимит' },
          { key: 'severity', header: 'Уровень', render: (item) => <StatusBadge status={item.severity} size="sm" /> },
          { key: 'detectedAt', header: 'Обнаружено', render: (item) => formatDateTime(item.detectedAt) },
        ]}
        onRowClick={(item) => setSelectedBreach(item)}
      />

      <Drawer open={!!selectedBreach} onClose={() => setSelectedBreach(null)} title="Детали нарушения IPS">
        {selectedBreach && (
          <div className="space-y-4">
            <div><label className="text-xs text-stone-500">Правило</label><p className="font-medium">{selectedBreach.rule}</p></div>
            <div><label className="text-xs text-stone-500">Клиент</label><p>{selectedBreach.client}</p></div>
            <div className="flex gap-4">
              <div><label className="text-xs text-stone-500">Текущее значение</label><p className="text-lg font-bold text-rose-500">{selectedBreach.current}</p></div>
              <div><label className="text-xs text-stone-500">Лимит</label><p className="text-lg">{selectedBreach.threshold}</p></div>
            </div>
            <div><label className="text-xs text-stone-500">Уровень</label><div className="mt-1"><StatusBadge status={selectedBreach.severity} /></div></div>
            <div><label className="text-xs text-stone-500">Обнаружено</label><p>{formatDateTime(selectedBreach.detectedAt)}</p></div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
