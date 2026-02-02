"use client";

import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";

const securityData = [
  { id: '1', event: 'Login success', user: 'Алексей П.', ip: '192.168.1.***', timestamp: '2026-01-28 10:15', status: 'success' },
  { id: '2', event: 'Password change', user: 'Мария К.', ip: '10.0.0.***', timestamp: '2026-01-28 09:30', status: 'success' },
  { id: '3', event: 'Failed login attempt', user: 'Unknown', ip: '45.67.89.***', timestamp: '2026-01-27 23:45', status: 'warning' },
  { id: '4', event: 'API key rotation', user: 'System', ip: 'Internal', timestamp: '2026-01-27 00:00', status: 'success' },
  { id: '5', event: 'Role changed', user: 'Иван С.', ip: '192.168.1.***', timestamp: '2026-01-26 16:00', status: 'info' },
];

export default function SecurityPage() {
  const { t } = useApp();

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.security}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Активные сессии" value="12" status="ok" />
        <KpiCard title="Failed logins (24h)" value="3" status={3 > 5 ? 'critical' : 'warning'} />
        <KpiCard title="MFA Enabled" value="100%" status="ok" />
        <KpiCard title="Last Audit" value="5 дней" status="ok" />
      </div>

      <h2 className="text-lg font-semibold text-stone-800 mb-4">Audit Log</h2>
      <DataTable
        data={securityData}
        columns={[
          { key: 'event', header: 'Событие', render: (item) => <span className="font-medium">{item.event}</span> },
          { key: 'user', header: 'Пользователь' },
          { key: 'ip', header: 'IP' },
          { key: 'timestamp', header: 'Время' },
          { key: 'status', header: 'Статус', render: (item) => <StatusBadge status={item.status as 'success' | 'warning' | 'info'} size="sm" /> },
        ]}
        onRowClick={() => {}}
      />
    </div>
  );
}
