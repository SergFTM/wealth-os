"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { DlPrivateDealDetail } from '@/modules/42-deals/ui/DlPrivateDealDetail';
import { Button } from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PrivateDealDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { record: deal, loading } = useRecord('dlPrivateDeals', id);
  const { items: checklists = [] } = useCollection('dlChecklists');
  const { items: approvals = [] } = useCollection('dlApprovals');
  const { items: docs = [] } = useCollection('dlDocs');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-stone-200 rounded w-1/3"></div>
            <div className="h-4 bg-stone-200 rounded w-1/2"></div>
            <div className="h-32 bg-stone-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-xl font-semibold text-stone-800 mb-2">Deal не найден</h1>
          <p className="text-stone-500 mb-4">ID: {id}</p>
          <Button variant="secondary" onClick={() => router.push('/m/deals/list?tab=deals')}>
            Назад к списку
          </Button>
        </div>
      </div>
    );
  }

  // Cast to proper types
  type ChecklistRecord = { id: string; name: string; linkedType: string; linkedId: string; itemsJson?: unknown[]; completionPct?: number };
  type ApprovalRecord = { id: string; linkedType: string; linkedId: string; linkedName?: string; approverRole: string; status: 'pending' | 'approved' | 'rejected'; dueAt?: string; requestedByName?: string };
  type DocRecord = { id: string; docName: string; docType?: string; linkedType: string; linkedId: string; status: 'missing' | 'requested' | 'received' | 'under_review' | 'approved' | 'rejected'; required?: boolean };

  // Get related data
  const dealChecklist = (checklists as unknown as ChecklistRecord[]).find(
    c => c.linkedType === 'deal' && c.linkedId === id
  );

  const dealApprovals = (approvals as unknown as ApprovalRecord[]).filter(
    a => a.linkedType === 'deal' && a.linkedId === id
  );

  const dealDocs = (docs as unknown as DocRecord[]).filter(
    d => d.linkedType === 'deal' && d.linkedId === id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      {/* Header */}
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push('/m/deals/list?tab=deals')}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-700 mb-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Private Deals
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <DlPrivateDealDetail
          deal={deal as unknown as {
            id: string;
            name: string;
            dealType: string;
            stage: 'draft' | 'in_review' | 'approved' | 'executed' | 'closed';
            amount?: number;
            currency?: string;
            targetEntityName?: string;
            closeDate?: string;
            termsJson?: Record<string, unknown>;
            taxFlag?: boolean;
            notes?: string;
          }}
          checklist={dealChecklist ? {
            name: dealChecklist.name,
            items: (dealChecklist.itemsJson || []) as Array<{ id: string; title: string; ownerRole: string; status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'na'; dueAt?: string; order: number }>,
            completionPct: dealChecklist.completionPct || 0,
          } : undefined}
          approvals={dealApprovals as Array<{ id: string; linkedName?: string; approverRole: string; status: 'pending' | 'approved' | 'rejected'; dueAt?: string; requestedByName?: string }>}
          documents={dealDocs as Array<{ id: string; docName: string; docType?: string; status: 'missing' | 'requested' | 'received' | 'under_review' | 'approved' | 'rejected'; required?: boolean }>}
          onStageChange={(stage) => console.log('Stage change:', stage)}
          onRequestApproval={() => console.log('Request approval')}
          onGenerateChecklist={() => console.log('Generate checklist')}
          onApprove={(a) => console.log('Approve:', a.id)}
          onReject={(a) => console.log('Reject:', a.id)}
          onEdit={() => console.log('Edit:', id)}
        />
      </div>
    </div>
  );
}
