"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ModuleList } from '@/components/templates/ModuleList';
import { Modal } from '@/components/ui/Modal';
import { FormRenderer } from '@/components/ui/FormRenderer';
import { useRecord, useCollection } from '@/lib/hooks';
import { PlPolicyDetail } from '@/modules/44-policies/ui/PlPolicyDetail';

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showAckModal, setShowAckModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const { data: policy, isLoading, error } = useRecord<{
    id: string;
    title: string;
    categoryKey: string;
    status: string;
    currentVersionId?: string;
    currentVersionLabel?: string;
    ownerUserId?: string;
    ownerName?: string;
    bodyMdRu: string;
    bodyMdEn?: string;
    bodyMdUk?: string;
    clientSafePublished: boolean;
    tagsJson?: string[];
    linkedIpsId?: string;
    createdAt: string;
    updatedAt: string;
  }>('plPolicies', id);

  const { data: versions = [] } = useCollection<{
    id: string;
    docType: 'policy' | 'sop';
    docId: string;
    docTitle: string;
    versionLabel: string;
    status: string;
    createdByName?: string;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
  }>('plVersions');

  const { data: acknowledgements = [] } = useCollection<{
    id: string;
    docType: 'policy' | 'sop';
    docId: string;
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
    policyId?: string;
    policyTitle?: string;
    sopId?: string;
    sopTitle?: string;
    linkedType: 'case' | 'incident' | 'breach' | 'ips';
    linkedId: string;
    linkedTitle: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }>('plLinks');

  const policyVersions = versions.filter(v => v.docId === id && v.docType === 'policy');
  const policyAcks = acknowledgements.filter(a => a.docId === id && a.docType === 'policy');
  const policyLinks = links.filter(l => l.policyId === id);

  const versionFormFields = [
    { key: 'changeNotes', label: 'Примечания к изменениям', type: 'textarea' as const },
    { key: 'isMajor', label: 'Мажорная версия', type: 'select' as const, options: [
      { value: 'false', label: 'Минорное обновление (v1.0 → v1.1)' },
      { value: 'true', label: 'Мажорное обновление (v1.0 → v2.0)' },
    ]},
  ];

  const ackFormFields = [
    { key: 'subjectType', label: 'Тип получателя', type: 'select' as const, required: true, options: [
      { value: 'user', label: 'Пользователь' },
      { value: 'role', label: 'Роль' },
    ]},
    { key: 'subjectName', label: 'Имя/Роль', type: 'text' as const, required: true },
    { key: 'dueAt', label: 'Срок подтверждения', type: 'date' as const, required: true },
  ];

  const linkFormFields = [
    { key: 'linkedType', label: 'Тип связи', type: 'select' as const, required: true, options: [
      { value: 'case', label: 'Кейс' },
      { value: 'incident', label: 'Инцидент' },
      { value: 'breach', label: 'Нарушение' },
      { value: 'ips', label: 'IPS политика' },
    ]},
    { key: 'linkedId', label: 'ID объекта', type: 'text' as const, required: true },
    { key: 'linkedTitle', label: 'Название', type: 'text' as const, required: true },
    { key: 'notes', label: 'Примечания', type: 'textarea' as const },
  ];

  const handleCreateVersion = async (values: Record<string, unknown>) => {
    if (!policy) return;
    setCreating(true);

    const prevVersion = policyVersions.find(v => v.id === policy.currentVersionId);

    await fetch('/api/collections/plVersions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: 'c1',
        docType: 'policy',
        docId: policy.id,
        docTitle: policy.title,
        versionLabel: prevVersion ? `v${parseInt(prevVersion.versionLabel.slice(1)) + 1}.0` : 'v1.0',
        versionMajor: 1,
        versionMinor: 0,
        status: 'draft',
        snapshotMdRu: policy.bodyMdRu,
        changeNotes: values.changeNotes,
        previousVersionId: policy.currentVersionId,
        publishedInternal: false,
        publishedClientSafe: false,
        requiresApproval: false,
        createdByName: 'Admin',
      }),
    });

    setCreating(false);
    setShowVersionModal(false);
    router.refresh();
  };

  const handleRequestAck = async (values: Record<string, unknown>) => {
    if (!policy) return;
    setCreating(true);

    await fetch('/api/collections/plAcknowledgements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: 'c1',
        docType: 'policy',
        docId: policy.id,
        docTitle: policy.title,
        versionId: policy.currentVersionId || policy.id,
        versionLabel: policy.currentVersionLabel || 'v1.0',
        subjectType: values.subjectType,
        subjectId: `user-${Date.now()}`,
        subjectName: values.subjectName,
        status: 'requested',
        dueAt: new Date(values.dueAt as string).toISOString(),
        reminderCount: 0,
      }),
    });

    setCreating(false);
    setShowAckModal(false);
    router.refresh();
  };

  const handleAddLink = async (values: Record<string, unknown>) => {
    if (!policy) return;
    setCreating(true);

    await fetch('/api/collections/plLinks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: 'c1',
        policyId: policy.id,
        policyTitle: policy.title,
        linkedType: values.linkedType,
        linkedId: values.linkedId,
        linkedTitle: values.linkedTitle,
        notes: values.notes,
        createdByName: 'Admin',
      }),
    });

    setCreating(false);
    setShowLinkModal(false);
    router.refresh();
  };

  if (isLoading) {
    return (
      <ModuleList moduleSlug="policies" title="Загрузка..." backHref="/m/policies">
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      </ModuleList>
    );
  }

  if (error || !policy) {
    return (
      <ModuleList moduleSlug="policies" title="Ошибка" backHref="/m/policies">
        <div className="text-center py-12 text-stone-600">
          Политика не найдена
        </div>
      </ModuleList>
    );
  }

  return (
    <ModuleList moduleSlug="policies" title={policy.title} backHref="/m/policies/list">
      <PlPolicyDetail
        policy={policy as any}
        versions={policyVersions}
        acknowledgements={policyAcks}
        links={policyLinks}
        onCreateVersion={() => setShowVersionModal(true)}
        onRequestAck={() => setShowAckModal(true)}
        onAddLink={() => setShowLinkModal(true)}
      />

      {/* Create Version Modal */}
      <Modal
        open={showVersionModal}
        onClose={() => setShowVersionModal(false)}
        title="Создать версию"
        size="md"
      >
        <FormRenderer
          fields={versionFormFields}
          onSubmit={handleCreateVersion}
          onCancel={() => setShowVersionModal(false)}
          loading={creating}
        />
      </Modal>

      {/* Request Acknowledgement Modal */}
      <Modal
        open={showAckModal}
        onClose={() => setShowAckModal(false)}
        title="Запросить подтверждение"
        size="md"
      >
        <FormRenderer
          fields={ackFormFields}
          onSubmit={handleRequestAck}
          onCancel={() => setShowAckModal(false)}
          loading={creating}
        />
      </Modal>

      {/* Add Link Modal */}
      <Modal
        open={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title="Добавить связь"
        size="md"
      >
        <FormRenderer
          fields={linkFormFields}
          onSubmit={handleAddLink}
          onCancel={() => setShowLinkModal(false)}
          loading={creating}
        />
      </Modal>
    </ModuleList>
  );
}
