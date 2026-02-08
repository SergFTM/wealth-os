"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ModuleList } from '@/components/templates/ModuleList';
import { Modal } from '@/components/ui/Modal';
import { FormRenderer } from '@/components/ui/FormRenderer';
import { useRecord, useCollection } from '@/lib/hooks';
import { PlSopDetail } from '@/modules/44-policies/ui/PlSopDetail';

export default function SopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const { data: sop, isLoading, error } = useRecord<{
    id: string;
    title: string;
    processKey: string;
    status: string;
    currentVersionId?: string;
    currentVersionLabel?: string;
    stepsJson?: Array<{
      orderIndex: number;
      title: string;
      description?: string;
      responsibleRole?: string;
      estimatedMinutes?: number;
    }>;
    bodyMdRu: string;
    bodyMdEn?: string;
    bodyMdUk?: string;
    clientSafePublished: boolean;
    ownerUserId?: string;
    ownerName?: string;
    linkedPolicyId?: string;
    createdAt: string;
    updatedAt: string;
  }>('plSops', id);

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

  const { data: checklists = [] } = useCollection<{
    id: string;
    name: string;
    linkedSopId?: string;
    linkedSopTitle?: string;
    stepsJson: Array<{ orderIndex: number; title: string }>;
    usageCount: number;
    lastUsedAt?: string;
    createdAt: string;
    updatedAt: string;
  }>('plChecklists');

  const sopVersions = versions.filter(v => v.docId === id && v.docType === 'sop');
  const sopChecklists = checklists.filter(c => c.linkedSopId === id);

  const versionFormFields = [
    { key: 'changeNotes', label: 'Примечания к изменениям', type: 'textarea' as const },
  ];

  const handleCreateVersion = async (values: Record<string, unknown>) => {
    if (!sop) return;
    setCreating(true);

    await fetch('/api/collections/plVersions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: 'c1',
        docType: 'sop',
        docId: sop.id,
        docTitle: sop.title,
        versionLabel: sop.currentVersionLabel ? `v${parseInt(sop.currentVersionLabel.slice(1)) + 1}.0` : 'v1.0',
        versionMajor: 1,
        versionMinor: 0,
        status: 'draft',
        snapshotMdRu: sop.bodyMdRu,
        changeNotes: values.changeNotes,
        previousVersionId: sop.currentVersionId,
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

  const handleGenerateChecklist = async (steps: Array<{ orderIndex: number; title: string }>) => {
    if (!sop) return;

    await fetch('/api/collections/plChecklists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: 'c1',
        name: `Чеклист: ${sop.title}`,
        linkedSopId: sop.id,
        linkedSopTitle: sop.title,
        stepsJson: steps,
        usageCount: 0,
        createdByName: 'AI Assistant',
      }),
    });

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

  if (error || !sop) {
    return (
      <ModuleList moduleSlug="policies" title="Ошибка" backHref="/m/policies">
        <div className="text-center py-12 text-stone-600">
          SOP не найден
        </div>
      </ModuleList>
    );
  }

  return (
    <ModuleList moduleSlug="policies" title={sop.title} backHref="/m/policies/list?tab=sops">
      <PlSopDetail
        sop={sop as any}
        versions={sopVersions}
        checklists={sopChecklists}
        onCreateVersion={() => setShowVersionModal(true)}
        onGenerateChecklist={handleGenerateChecklist}
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
    </ModuleList>
  );
}
