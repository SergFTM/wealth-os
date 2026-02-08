"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleDashboard } from '@/components/templates/ModuleDashboard';
import { HelpPanel } from '@/components/ui/HelpPanel';
import { Modal } from '@/components/ui/Modal';
import { FormRenderer } from '@/components/ui/FormRenderer';
import { useCollection } from '@/lib/hooks';
import { PlKpiStrip } from '@/modules/44-policies/ui/PlKpiStrip';
import { PlActionsBar } from '@/modules/44-policies/ui/PlActionsBar';
import { PlPoliciesTable } from '@/modules/44-policies/ui/PlPoliciesTable';
import { PlAcknowledgementsTable } from '@/modules/44-policies/ui/PlAcknowledgementsTable';
import { PlAiPanel } from '@/modules/44-policies/ui/PlAiPanel';

const DISCLAIMER = 'Политики и SOP демонстрационные. Юридически значимые документы требуют утверждения.';

export default function PoliciesDashboardPage() {
  const router = useRouter();
  const [showCreatePolicy, setShowCreatePolicy] = useState(false);
  const [showCreateSop, setShowCreateSop] = useState(false);
  const [creating, setCreating] = useState(false);

  const { data: policies = [], create: createPolicy, refetch: refetchPolicies } = useCollection<{
    id: string;
    clientId?: string;
    title: string;
    categoryKey: string;
    status: string;
    currentVersionLabel?: string;
    ownerName?: string;
    clientSafePublished: boolean;
    tagsJson?: string[];
    bodyMdRu?: string;
    createdAt: string;
    updatedAt: string;
  }>('plPolicies');

  const { data: sops = [] } = useCollection<{
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>('plSops');

  const { data: versions = [] } = useCollection<{
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>('plVersions');

  const { data: acknowledgements = [], refetch: refetchAcks } = useCollection<{
    id: string;
    docType: 'policy' | 'sop';
    docTitle: string;
    versionLabel: string;
    subjectName: string;
    status: string;
    dueAt: string;
    acknowledgedAt?: string;
    createdAt: string;
    updatedAt: string;
  }>('plAcknowledgements');

  const { data: links = [] } = useCollection<{
    id: string;
    linkedType: string;
    createdAt: string;
    updatedAt: string;
  }>('plLinks');

  const { data: checklists = [] } = useCollection<{
    id: string;
    lastUsedAt?: string;
    createdAt: string;
    updatedAt: string;
  }>('plChecklists');

  // Calculate KPIs
  const policiesActive = policies.filter(p => p.status === 'active').length;
  const sopsActive = sops.filter(s => s.status === 'active').length;
  const versionsDraft = versions.filter(v => v.status === 'draft').length;
  const acksOverdue = acknowledgements.filter(a => a.status === 'overdue').length;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const checklistsUsed30d = checklists.filter(c => c.lastUsedAt && c.lastUsedAt > thirtyDaysAgo).length;
  const linkedBreaches = links.filter(l => l.linkedType === 'breach').length;
  const clientSafePublished = policies.filter(p => p.clientSafePublished).length;
  const missingOwner = policies.filter(p => !p.ownerName).length;

  const kpis = [
    { key: 'policiesActive', label: 'Активные политики', value: policiesActive, status: 'ok' as const, href: '/m/policies/list?tab=policies&status=active' },
    { key: 'sopsActive', label: 'Активные SOP', value: sopsActive, status: 'ok' as const, href: '/m/policies/list?tab=sops&status=active' },
    { key: 'versionsDraft', label: 'Черновики', value: versionsDraft, status: versionsDraft > 0 ? 'warning' as const : 'ok' as const, href: '/m/policies/list?tab=versions&status=draft' },
    { key: 'acksOverdue', label: 'Просроченные подтв.', value: acksOverdue, status: acksOverdue > 0 ? 'critical' as const : 'ok' as const, href: '/m/policies/list?tab=acknowledgements&filter=overdue' },
    { key: 'checklistsUsed', label: 'Чеклисты 30д', value: checklistsUsed30d, status: 'ok' as const, href: '/m/policies/list?tab=checklists' },
    { key: 'linkedBreaches', label: 'Связи breach', value: linkedBreaches, status: linkedBreaches > 0 ? 'warning' as const : 'ok' as const, href: '/m/policies/list?tab=links&filter=breaches' },
    { key: 'clientSafe', label: 'Client-safe', value: clientSafePublished, status: 'ok' as const, href: '/m/policies/list?tab=policies&filter=client_safe' },
    { key: 'missingOwner', label: 'Без владельца', value: missingOwner, status: missingOwner > 0 ? 'warning' as const : 'ok' as const, href: '/m/policies/list?tab=policies&filter=missing_owner' },
  ];

  const recentPolicies = [...policies]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const pendingAcks = acknowledgements
    .filter(a => a.status !== 'acknowledged')
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 5);

  const policyFormFields = [
    { key: 'title', label: 'Название', type: 'text' as const, required: true },
    { key: 'categoryKey', label: 'Категория', type: 'select' as const, required: true, options: [
      { value: 'investment', label: 'Инвестиционная' },
      { value: 'compliance', label: 'Комплаенс' },
      { value: 'security', label: 'Безопасность' },
      { value: 'operations', label: 'Операционная' },
      { value: 'vendor', label: 'Вендорская' },
    ]},
    { key: 'ownerName', label: 'Владелец', type: 'text' as const },
    { key: 'bodyMdRu', label: 'Содержание (RU)', type: 'textarea' as const },
  ];

  const sopFormFields = [
    { key: 'title', label: 'Название', type: 'text' as const, required: true },
    { key: 'processKey', label: 'Процесс', type: 'select' as const, required: true, options: [
      { value: 'bill_pay', label: 'Оплата счетов' },
      { value: 'onboarding', label: 'Онбординг' },
      { value: 'approvals', label: 'Согласования' },
      { value: 'incident_response', label: 'Реагирование на инциденты' },
      { value: 'data_backup', label: 'Резервное копирование' },
      { value: 'client_reporting', label: 'Клиентская отчетность' },
      { value: 'vendor_review', label: 'Обзор вендоров' },
      { value: 'reconciliation', label: 'Сверка' },
    ]},
    { key: 'ownerName', label: 'Владелец', type: 'text' as const },
    { key: 'bodyMdRu', label: 'Содержание (RU)', type: 'textarea' as const },
  ];

  const handleCreatePolicy = async (values: Record<string, unknown>) => {
    setCreating(true);
    await createPolicy({
      ...values,
      clientId: 'c1',
      status: 'active',
      clientSafePublished: false,
      tagsJson: [],
    });
    setCreating(false);
    setShowCreatePolicy(false);
    refetchPolicies();
  };

  const handleCreateSop = async (values: Record<string, unknown>) => {
    setCreating(true);
    await fetch('/api/collections/plSops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        clientId: 'c1',
        status: 'active',
        clientSafePublished: false,
        stepsJson: [],
      }),
    });
    setCreating(false);
    setShowCreateSop(false);
    router.refresh();
  };

  return (
    <ModuleDashboard moduleSlug="policies" title="Политики и SOP">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-700 flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {DISCLAIMER}
        </p>
      </div>

      {/* KPI Strip */}
      <PlKpiStrip kpis={kpis} />

      {/* Actions Bar */}
      <div className="mt-6">
        <PlActionsBar
          onCreatePolicy={() => setShowCreatePolicy(true)}
          onCreateSop={() => setShowCreateSop(true)}
          onAudit={() => router.push('/m/policies/list?tab=audit')}
        />
      </div>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Policies */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-stone-800">Недавние политики</h2>
              <button
                onClick={() => router.push('/m/policies/list?tab=policies')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Все политики →
              </button>
            </div>
            <PlPoliciesTable policies={recentPolicies as any} />
          </div>

          {/* Pending Acknowledgements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-stone-800">Ожидают подтверждения</h2>
              <button
                onClick={() => router.push('/m/policies/list?tab=acknowledgements')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Все подтверждения →
              </button>
            </div>
            <PlAcknowledgementsTable acknowledgements={pendingAcks} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Panel */}
          <PlAiPanel
            content={recentPolicies[0]?.bodyMdRu || ''}
            title={recentPolicies[0]?.title || 'Политика'}
            locale="ru"
          />

          {/* Help Panel */}
          <HelpPanel
            title="Политики и SOP"
            description="Единый репозиторий политик, процедур и SOP с контролем версий и подтверждениями"
            features={[
              'Версионирование документов',
              'Client-safe публикация',
              'Подтверждения ознакомления',
              'Генерация чеклистов',
              'AI ассистент',
            ]}
            scenarios={[
              'Обновление комплаенс политики',
              'Создание SOP для нового процесса',
              'Запрос подтверждения от команды',
            ]}
            dataSources={['Ручной ввод', 'Импорт документов']}
          />
        </div>
      </div>

      {/* Create Policy Modal */}
      <Modal
        open={showCreatePolicy}
        onClose={() => setShowCreatePolicy(false)}
        title="Создать политику"
        size="md"
      >
        <FormRenderer
          fields={policyFormFields}
          onSubmit={handleCreatePolicy}
          onCancel={() => setShowCreatePolicy(false)}
          loading={creating}
        />
      </Modal>

      {/* Create SOP Modal */}
      <Modal
        open={showCreateSop}
        onClose={() => setShowCreateSop(false)}
        title="Создать SOP"
        size="md"
      >
        <FormRenderer
          fields={sopFormFields}
          onSubmit={handleCreateSop}
          onCancel={() => setShowCreateSop(false)}
          loading={creating}
        />
      </Modal>
    </ModuleDashboard>
  );
}
