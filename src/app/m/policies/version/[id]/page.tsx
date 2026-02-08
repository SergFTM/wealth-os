"use client";

import { useParams, useRouter } from 'next/navigation';
import { ModuleList } from '@/components/templates/ModuleList';
import { useRecord, useCollection, useMutateRecord } from '@/lib/hooks';
import { PlVersionDetail } from '@/modules/44-policies/ui/PlVersionDetail';

export default function VersionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: version, isLoading, error } = useRecord<{
    id: string;
    docType: 'policy' | 'sop';
    docId: string;
    docTitle: string;
    versionLabel: string;
    versionMajor: number;
    versionMinor: number;
    status: string;
    snapshotMdRu: string;
    snapshotMdEn?: string;
    snapshotMdUk?: string;
    changeNotes?: string;
    previousVersionId?: string;
    publishedInternal: boolean;
    publishedClientSafe: boolean;
    requiresApproval: boolean;
    createdByUserId?: string;
    createdByName?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  }>('plVersions', id);

  const { data: allVersions = [] } = useCollection<{
    id: string;
    docType: 'policy' | 'sop';
    docId: string;
    docTitle: string;
    versionLabel: string;
    versionMajor: number;
    versionMinor: number;
    status: string;
    snapshotMdRu: string;
    changeNotes?: string;
    previousVersionId?: string;
    publishedInternal: boolean;
    publishedClientSafe: boolean;
    requiresApproval: boolean;
    createdByName?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  }>('plVersions');

  const { mutate } = useMutateRecord('plVersions', id);

  const previousVersion = version?.previousVersionId
    ? allVersions.find(v => v.id === version.previousVersionId)
    : undefined;

  const handlePublish = async (options: { internal: boolean; clientSafe: boolean }) => {
    await mutate({
      status: 'published',
      publishedInternal: options.internal,
      publishedClientSafe: options.clientSafe,
      publishedAt: new Date().toISOString(),
    });
    router.refresh();
  };

  const handleRetire = async () => {
    await mutate({ status: 'retired' });
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

  if (error || !version) {
    return (
      <ModuleList moduleSlug="policies" title="Ошибка" backHref="/m/policies">
        <div className="text-center py-12 text-stone-600">
          Версия не найдена
        </div>
      </ModuleList>
    );
  }

  return (
    <ModuleList
      moduleSlug="policies"
      title={`${version.docTitle} — ${version.versionLabel}`}
      backHref="/m/policies/list?tab=versions"
    >
      <PlVersionDetail
        version={version as any}
        previousVersion={previousVersion as any}
        onPublish={handlePublish}
        onRetire={handleRetire}
      />
    </ModuleList>
  );
}
