"use client";

import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";

const onboardingData = [
  { id: '1', name: 'New Client - Johnson Family', stage: 'Documentation', progress: 75, dueDate: '2026-02-15', status: 'in_progress' },
  { id: '2', name: 'New Entity - Cyprus LLC', stage: 'KYC Review', progress: 45, dueDate: '2026-02-20', status: 'in_progress' },
  { id: '3', name: 'Account Transfer - Schwab', stage: 'ACAT Initiated', progress: 30, dueDate: '2026-03-01', status: 'pending' },
  { id: '4', name: 'Trust Formation - GRAT', stage: 'Legal Review', progress: 60, dueDate: '2026-02-28', status: 'in_progress' },
];

export default function OnboardingPage() {
  const { t } = useApp();

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.onboarding}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Активные онбординги" value={onboardingData.length} status="ok" />
        <KpiCard title="Ожидают документы" value="2" status="warning" />
        <KpiCard title="KYC в процессе" value="1" status="info" />
        <KpiCard title="Завершено (месяц)" value="5" status="ok" />
      </div>

      <DataTable
        data={onboardingData}
        columns={[
          { key: 'name', header: 'Название', render: (item) => <span className="font-medium">{item.name}</span> },
          { key: 'stage', header: 'Этап' },
          { key: 'progress', header: 'Прогресс', render: (item) => (
            <div className="w-24 bg-stone-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${item.progress}%` }} />
            </div>
          )},
          { key: 'status', header: 'Статус', render: (item) => <StatusBadge status={item.status as 'pending' | 'in_progress'} size="sm" /> },
          { key: 'dueDate', header: 'Срок' },
        ]}
        onRowClick={() => {}}
      />
    </div>
  );
}
