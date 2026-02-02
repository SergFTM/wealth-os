"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { tasks, formatDate, Task, getPendingApprovals, approvals } from "@/lib/data";

export default function WorkflowPage() {
  const { t } = useApp();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const openTasks = tasks.filter(t => t.status !== 'completed');
  const highPriority = tasks.filter(t => t.priority === 'high' || t.priority === 'critical');

  return (
    <div>
      <ScopeBar />
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.nav.workflow}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Открытые задачи" value={openTasks.length} status={openTasks.length > 20 ? 'warning' : 'ok'} />
        <KpiCard title="Высокий приоритет" value={highPriority.length} status={highPriority.length > 10 ? 'critical' : 'warning'} />
        <KpiCard title="Ожидают одобрения" value={getPendingApprovals().length} status="warning" />
        <KpiCard title="Завершено (неделя)" value={tasks.filter(t => t.status === 'completed').length} status="ok" />
      </div>

      <h2 className="text-lg font-semibold text-stone-800 mb-4">Все задачи</h2>
      <DataTable
        data={tasks}
        columns={[
          { key: 'title', header: 'Задача', render: (item) => <span className="font-medium">{item.title}</span> },
          { key: 'client', header: 'Клиент' },
          { key: 'assignee', header: 'Исполнитель' },
          { key: 'priority', header: 'Приоритет', render: (item) => <StatusBadge status={item.priority === 'critical' ? 'critical' : item.priority === 'high' ? 'warning' : 'info'} label={item.priority} size="sm" /> },
          { key: 'status', header: 'Статус', render: (item) => <StatusBadge status={item.status} size="sm" /> },
          { key: 'dueDate', header: 'Срок', render: (item) => formatDate(item.dueDate) },
        ]}
        onRowClick={(item) => setSelectedTask(item)}
      />

      <Drawer open={!!selectedTask} onClose={() => setSelectedTask(null)} title="Детали задачи">
        {selectedTask && (
          <div className="space-y-4">
            <div><label className="text-xs text-stone-500">Название</label><p className="font-medium">{selectedTask.title}</p></div>
            <div><label className="text-xs text-stone-500">Клиент</label><p>{selectedTask.client}</p></div>
            <div><label className="text-xs text-stone-500">Исполнитель</label><p>{selectedTask.assignee}</p></div>
            <div><label className="text-xs text-stone-500">Тип</label><p className="capitalize">{selectedTask.type}</p></div>
            <div className="flex gap-4">
              <div><label className="text-xs text-stone-500">Приоритет</label><div className="mt-1"><StatusBadge status={selectedTask.priority === 'critical' ? 'critical' : 'warning'} label={selectedTask.priority} /></div></div>
              <div><label className="text-xs text-stone-500">Статус</label><div className="mt-1"><StatusBadge status={selectedTask.status} /></div></div>
            </div>
            <div><label className="text-xs text-stone-500">Срок</label><p>{formatDate(selectedTask.dueDate)}</p></div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
