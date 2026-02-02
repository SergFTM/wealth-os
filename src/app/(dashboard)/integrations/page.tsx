"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { syncJobs, formatDateTime, SyncJob, getSyncHealthPercentage } from "@/lib/data";

export default function IntegrationsPage() {
  const { t } = useApp();
  const [selectedJob, setSelectedJob] = useState<SyncJob | null>(null);

  const errors = syncJobs.filter(s => s.status === 'error').length;
  const warnings = syncJobs.filter(s => s.status === 'warning').length;

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.integrations}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Интеграций" value={syncJobs.length} status="ok" />
        <KpiCard title="Sync Health" value={`${getSyncHealthPercentage()}%`} status={getSyncHealthPercentage() > 90 ? 'ok' : 'warning'} />
        <KpiCard title="Ошибки" value={errors} status={errors > 0 ? 'critical' : 'ok'} />
        <KpiCard title="Предупреждения" value={warnings} status={warnings > 0 ? 'warning' : 'ok'} />
      </div>

      <DataTable
        data={syncJobs}
        columns={[
          { key: 'provider', header: 'Провайдер', render: (item) => <span className="font-medium">{item.provider}</span> },
          { key: 'client', header: 'Клиент' },
          { key: 'status', header: 'Статус', render: (item) => <StatusBadge status={item.status} size="sm" /> },
          { key: 'recordsProcessed', header: 'Записей' },
          { key: 'errors', header: 'Ошибок' },
          { key: 'lastSync', header: 'Последняя синхронизация', render: (item) => formatDateTime(item.lastSync) },
        ]}
        onRowClick={(item) => setSelectedJob(item)}
      />

      <Drawer open={!!selectedJob} onClose={() => setSelectedJob(null)} title="Детали синхронизации">
        {selectedJob && (
          <div className="space-y-4">
            <div><label className="text-xs text-stone-500">Провайдер</label><p className="font-medium">{selectedJob.provider}</p></div>
            <div><label className="text-xs text-stone-500">Клиент</label><p>{selectedJob.client}</p></div>
            <div><label className="text-xs text-stone-500">Статус</label><div className="mt-1"><StatusBadge status={selectedJob.status} /></div></div>
            <div className="flex gap-4">
              <div><label className="text-xs text-stone-500">Записей обработано</label><p>{selectedJob.recordsProcessed}</p></div>
              <div><label className="text-xs text-stone-500">Ошибок</label><p className={selectedJob.errors > 0 ? 'text-rose-500 font-medium' : ''}>{selectedJob.errors}</p></div>
            </div>
            <div><label className="text-xs text-stone-500">Последняя синхронизация</label><p>{formatDateTime(selectedJob.lastSync)}</p></div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
