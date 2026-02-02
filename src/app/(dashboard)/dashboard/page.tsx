"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { ScopeBar } from "@/components/shell/ScopeBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { Drawer } from "@/components/ui/Drawer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  getTotalNetWorth,
  getOpenTasks,
  getPendingApprovals,
  ipsBreaches,
  getOverdueInvoices,
  getSyncHealthPercentage,
  tasks,
  alerts,
  getRecentDocuments,
  formatCurrency,
  formatDate,
  Task,
  Alert,
  Document,
} from "@/lib/data";

export default function DashboardPage() {
  const { t } = useApp();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const openTasks = getOpenTasks().slice(0, 5);
  const recentAlerts = alerts.slice(0, 5);
  const recentDocs = getRecentDocuments(5);

  return (
    <div>
      <ScopeBar />
      
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{t.dashboard.title}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <KpiCard
          title={t.dashboard.netWorth}
          value={formatCurrency(getTotalNetWorth())}
          trend={{ value: 2.4, positive: true }}
          status="ok"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          title={t.dashboard.openTasks}
          value={getOpenTasks().length}
          status={getOpenTasks().length > 20 ? 'warning' : 'ok'}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <KpiCard
          title={t.dashboard.pendingApprovals}
          value={getPendingApprovals().length}
          status={getPendingApprovals().length > 10 ? 'warning' : 'ok'}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          title={t.dashboard.ipsBreaches}
          value={ipsBreaches.length}
          status={ipsBreaches.length > 10 ? 'critical' : 'warning'}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <KpiCard
          title={t.dashboard.overdueInvoices}
          value={getOverdueInvoices().length}
          status={getOverdueInvoices().length > 5 ? 'critical' : 'warning'}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          }
        />
        <KpiCard
          title={t.dashboard.syncHealth}
          value={`${getSyncHealthPercentage()}%`}
          status={getSyncHealthPercentage() > 90 ? 'ok' : getSyncHealthPercentage() > 70 ? 'warning' : 'critical'}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-stone-800">{t.dashboard.myTasks}</h2>
            <a href="/workflow" className="text-xs text-emerald-600 hover:text-emerald-700">{t.dashboard.viewAll} →</a>
          </div>
          <DataTable
            data={openTasks}
            columns={[
              { key: 'title', header: 'Задача', render: (item) => <span className="font-medium">{item.title}</span> },
              { key: 'priority', header: 'Приоритет', width: '80px', render: (item) => (
                <StatusBadge status={item.priority === 'critical' ? 'critical' : item.priority === 'high' ? 'warning' : 'info'} label={item.priority} size="sm" />
              )},
            ]}
            onRowClick={(item) => setSelectedTask(item)}
          />
        </div>

        {/* Alerts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-stone-800">{t.dashboard.alerts}</h2>
            <a href="/risk" className="text-xs text-emerald-600 hover:text-emerald-700">{t.dashboard.viewAll} →</a>
          </div>
          <DataTable
            data={recentAlerts}
            columns={[
              { key: 'title', header: 'Алерт', render: (item) => <span className="font-medium">{item.title}</span> },
              { key: 'severity', header: 'Уровень', width: '80px', render: (item) => (
                <StatusBadge status={item.severity} size="sm" />
              )},
            ]}
            onRowClick={(item) => setSelectedAlert(item)}
          />
        </div>

        {/* Recent Documents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-stone-800">{t.dashboard.recentDocuments}</h2>
            <a href="/documents" className="text-xs text-emerald-600 hover:text-emerald-700">{t.dashboard.viewAll} →</a>
          </div>
          <DataTable
            data={recentDocs}
            columns={[
              { key: 'name', header: 'Документ', render: (item) => <span className="font-medium truncate max-w-[180px] block">{item.name}</span> },
              { key: 'uploadedAt', header: 'Дата', width: '90px', render: (item) => <span className="text-xs">{formatDate(item.uploadedAt)}</span> },
            ]}
            onRowClick={(item) => setSelectedDoc(item)}
          />
        </div>
      </div>

      {/* Task Drawer */}
      <Drawer open={!!selectedTask} onClose={() => setSelectedTask(null)} title="Детали задачи">
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-stone-500">Название</label>
              <p className="font-medium text-stone-800">{selectedTask.title}</p>
            </div>
            <div>
              <label className="text-xs text-stone-500">Клиент</label>
              <p className="text-stone-700">{selectedTask.client}</p>
            </div>
            <div>
              <label className="text-xs text-stone-500">Исполнитель</label>
              <p className="text-stone-700">{selectedTask.assignee}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="text-xs text-stone-500">Приоритет</label>
                <div className="mt-1">
                  <StatusBadge status={selectedTask.priority === 'critical' ? 'critical' : selectedTask.priority === 'high' ? 'warning' : 'info'} label={selectedTask.priority} />
                </div>
              </div>
              <div>
                <label className="text-xs text-stone-500">Статус</label>
                <div className="mt-1">
                  <StatusBadge status={selectedTask.status} />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-stone-500">Срок</label>
              <p className="text-stone-700">{formatDate(selectedTask.dueDate)}</p>
            </div>
            <hr className="my-4" />
            <button className="text-sm text-emerald-600 hover:text-emerald-700">
              View audit trail →
            </button>
          </div>
        )}
      </Drawer>

      {/* Alert Drawer */}
      <Drawer open={!!selectedAlert} onClose={() => setSelectedAlert(null)} title="Детали алерта">
        {selectedAlert && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-stone-500">Заголовок</label>
              <p className="font-medium text-stone-800">{selectedAlert.title}</p>
            </div>
            <div>
              <label className="text-xs text-stone-500">Описание</label>
              <p className="text-stone-700">{selectedAlert.description}</p>
            </div>
            <div>
              <label className="text-xs text-stone-500">Клиент</label>
              <p className="text-stone-700">{selectedAlert.client}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="text-xs text-stone-500">Категория</label>
                <p className="text-stone-700 capitalize">{selectedAlert.category}</p>
              </div>
              <div>
                <label className="text-xs text-stone-500">Уровень</label>
                <div className="mt-1">
                  <StatusBadge status={selectedAlert.severity} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Document Drawer */}
      <Drawer open={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="Детали документа">
        {selectedDoc && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-stone-500">Название</label>
              <p className="font-medium text-stone-800">{selectedDoc.name}</p>
            </div>
            <div>
              <label className="text-xs text-stone-500">Клиент</label>
              <p className="text-stone-700">{selectedDoc.client}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="text-xs text-stone-500">Тип</label>
                <p className="text-stone-700 capitalize">{selectedDoc.type}</p>
              </div>
              <div>
                <label className="text-xs text-stone-500">Размер</label>
                <p className="text-stone-700">{selectedDoc.size}</p>
              </div>
            </div>
            <div>
              <label className="text-xs text-stone-500">Статус</label>
              <div className="mt-1">
                <StatusBadge status={selectedDoc.status as 'active' | 'pending' | 'draft'} label={selectedDoc.status} />
              </div>
            </div>
            <div>
              <label className="text-xs text-stone-500">Загружен</label>
              <p className="text-stone-700">{formatDate(selectedDoc.uploadedAt)}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
