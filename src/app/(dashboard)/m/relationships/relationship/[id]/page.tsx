"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { RhRelationshipDetail } from '@/modules/53-relationships/ui/RhRelationshipDetail';
import type { RelationshipDetailData } from '@/modules/53-relationships/ui/RhRelationshipDetail';

export default function RelationshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rel, loading } = useRecord('relRelationships', id) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: people = [] } = useCollection('mdmPeople') as { data: any[] };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!rel) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Связь не найдена</p>
        <button onClick={() => router.back()} className="mt-4 text-emerald-600 hover:underline">Назад</button>
      </div>
    );
  }

  const fromRef = rel.fromRefJson || {};
  const toRef = rel.toRefJson || {};
  const fromPerson = people.find((p: any) => p.id === fromRef.id);
  const toPerson = people.find((p: any) => p.id === toRef.id);

  const relData: RelationshipDetailData = {
    id: rel.id,
    fromRef: {
      type: fromRef.type || 'person',
      id: fromRef.id,
      name: fromPerson?.name || fromRef.id,
    },
    toRef: {
      type: toRef.type || 'person',
      id: toRef.id,
      name: toPerson?.name || toRef.id,
    },
    relationshipTypeKey: rel.relationshipTypeKey,
    roleLabel: rel.roleLabel,
    effectiveFrom: rel.effectiveFrom,
    effectiveTo: rel.effectiveTo,
    evidenceDocs: (rel.evidenceDocIdsJson || []).map((docId: string) => ({
      id: docId,
      name: docId,
      type: 'document',
    })),
    sourceRef: rel.sourceRefJson,
    createdAt: rel.createdAt,
    updatedAt: rel.updatedAt,
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => router.push('/m/relationships/list?tab=relationships')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Связи
        </button>
      </div>

      <RhRelationshipDetail
        relationship={relData}
        onFromClick={() => {
          if (fromRef.type === 'person') router.push(`/m/relationships/person/${fromRef.id}`);
        }}
        onToClick={() => {
          if (toRef.type === 'person') router.push(`/m/relationships/person/${toRef.id}`);
        }}
        onAddEvidence={() => console.log('Add evidence')}
        onEdit={() => console.log('Edit relationship')}
      />
    </div>
  );
}
