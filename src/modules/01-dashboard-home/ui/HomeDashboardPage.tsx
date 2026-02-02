"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useCollection, useAuditEvents } from '@/lib/hooks';
import { createRecord } from '@/lib/apiClient';
import { BaseRecord } from '@/db/storage/storage.types';
import { HelpPanel } from '@/components/templates/HelpPanel';
import {
  HomeKpiStrip,
  HomeQueues,
  HomeInsights,
  HomeQuickCreate,
  HomeScopeSummary,
  HomeAuditWidget,
  HomeDetailDrawer,
  HomeCreateModal,
} from './index';
import schema from '@/modules/01-dashboard-home/schema.json';

const helpContent = `
# Executive Home Dashboard

## Что показывает
Центральная точка управления Multi-Family Office.

## Для кого
- **Owner / Admin**: полный доступ
- **CIO**: инвестиции, риски, IPS
- **CFO**: биллинг, платежи
- **Operations**: задачи, интеграции
- **Compliance**: IPS, audit trail
- **Client**: только Net Worth, документы, сообщения

## Как пользоваться
- KPI клики → детализация
- Queues → клик по строке открывает карточку
- Quick Create → быстрое создание
`;

interface DetailItem extends BaseRecord {
  title?: string;
  subject?: string;
  name?: string;
  status?: string;
  [key: string]: unknown;
}

interface AuditEventUI {
  id: string;
  ts: string;
  actorName: string;
  action: string;
  collection: string;
  summary: string;
}

export function HomeDashboardPage() {
  const router = useRouter();
  const { user, locale } = useApp();
  const clientSafe = user?.role === 'client';

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState<DetailItem | null>(null);
  const [drawerQueue, setDrawerQueue] = useState<string>('tasks');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('task');
  const [helpOpen, setHelpOpen] = useState(false);

  const { items: tasks, loading: tasksLoading } = useCollection<DetailItem>('tasks', { limit: 5 });
  const { items: approvals, loading: approvalsLoading } = useCollection<DetailItem>('approvals', { limit: 5 });
  const { items: alerts, loading: alertsLoading } = useCollection<DetailItem>('alerts', { limit: 5 });
  const { items: syncJobs, loading: syncJobsLoading } = useCollection<DetailItem>('syncJobs', { limit: 5 });
  const { items: threads, loading: threadsLoading } = useCollection<DetailItem>('threads', { limit: 5 });
  const { events: rawAuditEvents, loading: auditLoading } = useAuditEvents('all');

  const auditEvents: AuditEventUI[] = rawAuditEvents.map(e => ({
    ...e,
    collection: 'auditEvents'
  }));

  const loading = tasksLoading || approvalsLoading || alertsLoading || syncJobsLoading || threadsLoading;

  const kpiItems = [
    { key: 'netWorth', title: locale === 'ru' ? 'Единый капитал' : 'Net Worth', value: 125400000, status: 'ok' as const, link: '/m/net-worth', asOf: '28.01.2026' },
    { key: 'openTasks', title: locale === 'ru' ? 'Открытые задачи' : 'Open Tasks', value: tasks.length, status: tasks.length > 5 ? 'warning' as const : 'ok' as const, link: '/m/workflow/list?status=open', asOf: '28.01.2026' },
    { key: 'pendingApprovals', title: locale === 'ru' ? 'На согласовании' : 'Pending', value: approvals.length, status: approvals.length > 3 ? 'critical' as const : 'ok' as const, link: '/m/workflow/list?status=pending_approval', asOf: '28.01.2026' },
    { key: 'ipsBreaches', title: locale === 'ru' ? 'IPS нарушения' : 'IPS Breaches', value: 2, status: 'critical' as const, link: '/m/ips/list?status=breach', asOf: '28.01.2026' },
    { key: 'riskAlerts', title: locale === 'ru' ? 'Риск алерты' : 'Risk Alerts', value: alerts.length, status: alerts.length > 0 ? 'warning' as const : 'ok' as const, link: '/m/risk/list?severity=critical', asOf: '28.01.2026' },
    { key: 'overdueInvoices', title: locale === 'ru' ? 'Просрочено' : 'Overdue', value: 1, status: 'warning' as const, link: '/m/fee-billing/list?status=overdue', asOf: '28.01.2026' },
    { key: 'dataIssues', title: locale === 'ru' ? 'Проблемы данных' : 'Data Issues', value: syncJobs.filter(s => s.status === 'error').length, status: 'ok' as const, link: '/m/integrations/list?tab=data_quality', asOf: '28.01.2026' },
    { key: 'unreadMessages', title: locale === 'ru' ? 'Сообщения' : 'Messages', value: threads.length, status: threads.length > 0 ? 'warning' as const : 'ok' as const, link: '/m/communications/list?filter=unread', asOf: '28.01.2026' },
  ];

  const queueTabs = [
    { key: 'tasks', title: locale === 'ru' ? 'Задачи' : 'Tasks', items: tasks, columns: schema.queues.tasks.columns },
    { key: 'approvals', title: locale === 'ru' ? 'Согласования' : 'Approvals', items: approvals, columns: schema.queues.approvals.columns },
    { key: 'riskAlerts', title: locale === 'ru' ? 'Алерты рисков' : 'Risk Alerts', items: alerts, columns: schema.queues.riskAlerts.columns },
    { key: 'dataQuality', title: locale === 'ru' ? 'Проблемы интеграций' : 'Data Quality', items: syncJobs, columns: schema.queues.dataQuality.columns },
    { key: 'messages', title: locale === 'ru' ? 'Сообщения клиентов' : 'Messages', items: threads, columns: schema.queues.messages.columns },
  ];

  const insights = [
    { id: '1', title: 'Новый IPS breach', description: 'Portfolio ABC превысил лимит на equity', sourceType: 'breach', sourceId: 'b1', sourceLink: '/m/ips/item/b1' },
    { id: '2', title: 'Задача просрочена', description: 'Подготовить квартальный отчет', sourceType: 'task', sourceId: 't1', sourceLink: '/m/workflow/item/t1' },
    { id: '3', title: 'Новое сообщение от клиента', description: 'Вопрос по комиссии Q4', sourceType: 'message', sourceId: 'm1', sourceLink: '/m/communications/item/m1' },
    { id: '4', title: 'Синхронизация завершена', description: 'Bloomberg обновлен', sourceType: 'sync', sourceId: 's1', sourceLink: '/m/integrations/item/s1' },
    { id: '5', title: 'Счет оплачен', description: 'Invoice #2024-012 от Family Smith', sourceType: 'invoice', sourceId: 'i1', sourceLink: '/m/fee-billing/item/i1' },
    { id: '6', title: 'Capital call выполнен', description: 'PE Fund Alpha - $500K', sourceType: 'capital_call', sourceId: 'c1', sourceLink: '/m/private-capital/item/c1' },
  ];

  const quickActions = [
    { key: 'createTask', title: locale === 'ru' ? 'Создать задачу' : 'Create Task', icon: 'task' },
    { key: 'createRequest', title: locale === 'ru' ? 'Создать запрос' : 'Create Request', icon: 'request' },
    { key: 'createReport', title: locale === 'ru' ? 'Отчетный пакет' : 'Report Package', icon: 'report' },
    { key: 'createInvoice', title: locale === 'ru' ? 'Создать счет' : 'Create Invoice', icon: 'invoice' },
    { key: 'addDocument', title: locale === 'ru' ? 'Добавить документ' : 'Add Document', icon: 'document' },
  ];

  const handleRowClick = useCallback((item: { id: string; [key: string]: unknown }, queueKey: string) => {
    setDrawerItem(item as unknown as DetailItem);
    setDrawerQueue(queueKey);
    setDrawerOpen(true);
  }, []);

  const handleOpenSource = useCallback((insight: { sourceLink: string }) => {
    router.push(insight.sourceLink);
  }, [router]);

  const handleCreateTaskFromInsight = useCallback(async (insight: { title: string; description: string }) => {
    await createRecord('tasks', {
      title: `Задача: ${insight.title}`,
      description: insight.description,
      status: 'open',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    alert(locale === 'ru' ? 'Задача создана' : 'Task created');
  }, [locale]);

  const handleQuickAction = useCallback((actionKey: string) => {
    setModalType(actionKey.replace('create', '').replace('add', '').toLowerCase());
    setModalOpen(true);
  }, []);

  return (
    <div className="flex min-h-full">
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              {locale === 'ru' ? 'Домой' : 'Home'}
            </h1>
            <p className="text-stone-500 text-sm">
              Executive Dashboard
            </p>
          </div>
          <button
            onClick={() => setHelpOpen(!helpOpen)}
            className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        <HomeScopeSummary
          scope={{ level: 'household', name: 'Family Office Demo', totalValue: 125400000, currency: '$' }}
          onChangeScope={() => {}}
        />

        <HomeKpiStrip items={kpiItems} loading={loading} clientSafe={clientSafe} />

        {!clientSafe && (
          <HomeQueues
            tabs={queueTabs}
            loading={loading}
            clientSafe={clientSafe}
            onRowClick={handleRowClick}
          />
        )}

        <HomeInsights
          insights={insights}
          loading={false}
          onOpenSource={handleOpenSource}
          onCreateTask={handleCreateTaskFromInsight}
        />

        {!clientSafe && (
          <HomeQuickCreate
            actions={quickActions}
            onAction={handleQuickAction}
          />
        )}

        <HomeAuditWidget
          events={auditEvents}
          loading={auditLoading}
        />
      </div>

      {helpOpen && (
        <div className="w-80 border-l border-stone-200 bg-white/80 backdrop-blur-sm p-6">
          <HelpPanel 
            content={helpContent}
            onClose={() => setHelpOpen(false)}
          />
        </div>
      )}

      <HomeDetailDrawer
        open={drawerOpen}
        item={drawerItem}
        queueKey={drawerQueue}
        onClose={() => setDrawerOpen(false)}
      />

      <HomeCreateModal
        open={modalOpen}
        type={modalType}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
