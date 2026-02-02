"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { alerts, Alert, formatDateTime } from "@/lib/data";

export default function RiskPage() {
  const { t } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const critical = alerts.filter(a => a.severity === 'critical');
  const warning = alerts.filter(a => a.severity === 'warning');

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.risk}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Всего алертов" value={alerts.length} status="warning" />
        <KpiCard title="Критические" value={critical.length} status="critical" />
        <KpiCard title="Предупреждения" value={warning.length} status="warning" />
        <KpiCard title="Risk Score" value="7.2/10" status="warning" />
      </div>

      <DataTable
        data={alerts}
        columns={[
          { key: 'title', header: 'Алерт', render: (item) => <span className="font-medium">{item.title}</span> },
          { key: 'client', header: 'Клиент' },
          { key: 'category', header: 'Категория', render: (item) => <span className="capitalize">{item.category}</span> },
          { key: 'severity', header: 'Уровень', render: (item) => <StatusBadge status={item.severity} size="sm" /> },
          { key: 'timestamp', header: 'Время', render: (item) => formatDateTime(item.timestamp) },
        ]}
        onRowClick={(item) => setSelectedAlert(item)}
      />

      <Drawer open={!!selectedAlert} onClose={() => setSelectedAlert(null)} title="Детали алерта">
        {selectedAlert && (
          <div className="space-y-4">
            <div><label className="text-xs text-stone-500">Заголовок</label><p className="font-medium">{selectedAlert.title}</p></div>
            <div><label className="text-xs text-stone-500">Описание</label><p>{selectedAlert.description}</p></div>
            <div><label className="text-xs text-stone-500">Клиент</label><p>{selectedAlert.client}</p></div>
            <div><label className="text-xs text-stone-500">Категория</label><p className="capitalize">{selectedAlert.category}</p></div>
            <div><label className="text-xs text-stone-500">Уровень</label><div className="mt-1"><StatusBadge status={selectedAlert.severity} /></div></div>
            <div><label className="text-xs text-stone-500">Время</label><p>{formatDateTime(selectedAlert.timestamp)}</p></div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
