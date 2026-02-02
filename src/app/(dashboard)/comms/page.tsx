"use client";

import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";

const commsData = [
  { id: '1', type: 'Email', subject: 'Q4 Report готов к просмотру', recipient: 'Aurora Family', sentAt: '2026-01-28 10:00', status: 'delivered' },
  { id: '2', type: 'Notification', subject: 'Новый IPS breach обнаружен', recipient: 'CIO Team', sentAt: '2026-01-28 09:30', status: 'read' },
  { id: '3', type: 'Email', subject: 'Invoice #INV-2026-015', recipient: 'Limassol Holdings', sentAt: '2026-01-27 16:00', status: 'pending' },
  { id: '4', type: 'SMS', subject: 'Срочное одобрение требуется', recipient: '+7 999 ***', sentAt: '2026-01-27 14:00', status: 'delivered' },
];

export default function CommsPage() {
  const { t } = useApp();

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.comms}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Отправлено (месяц)" value="156" status="ok" />
        <KpiCard title="Email" value="89" status="ok" />
        <KpiCard title="Уведомления" value="52" status="ok" />
        <KpiCard title="SMS" value="15" status="ok" />
      </div>

      <DataTable
        data={commsData}
        columns={[
          { key: 'type', header: 'Тип' },
          { key: 'subject', header: 'Тема', render: (item) => <span className="font-medium">{item.subject}</span> },
          { key: 'recipient', header: 'Получатель' },
          { key: 'sentAt', header: 'Отправлено' },
          { key: 'status', header: 'Статус', render: (item) => <span className="capitalize">{item.status}</span> },
        ]}
        onRowClick={() => {}}
      />
    </div>
  );
}
