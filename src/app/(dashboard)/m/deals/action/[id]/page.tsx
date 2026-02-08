"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { DlCorporateActionDetail } from '@/modules/42-deals/ui/DlCorporateActionDetail';
import { Button } from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CorporateActionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { record: action, loading } = useRecord('dlCorporateActions', id);
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

  if (!action) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-xl font-semibold text-stone-800 mb-2">Corporate action не найдено</h1>
          <p className="text-stone-500 mb-4">ID: {id}</p>
          <Button variant="secondary" onClick={() => router.push('/m/deals/list?tab=actions')}>
            Назад к списку
          </Button>
        </div>
      </div>
    );
  }

  const actionDocs = (docs as unknown as Array<{ id: string; docName: string; linkedType: string; linkedId: string; status: 'missing' | 'requested' | 'received' | 'under_review' | 'approved' | 'rejected' }>).filter(
    d => d.linkedType === 'action' && d.linkedId === id
  );

  const handleMarkProcessed = () => {
    console.log('Mark processed:', id);
    // In production: call API to update status
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      {/* Header */}
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push('/m/deals/list?tab=actions')}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-700 mb-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Corporate Actions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <DlCorporateActionDetail
          action={action as unknown as {
            id: string;
            ticker: string;
            securityName?: string;
            actionType: string;
            effectiveDate: string;
            recordDate?: string;
            exDate?: string;
            paymentDate?: string;
            status: 'planned' | 'announced' | 'processed' | 'cancelled';
            detailsJson?: Record<string, unknown>;
            impactJson?: Record<string, unknown>;
            notes?: string;
            processedAt?: string;
            processedBy?: string;
          }}
          documents={actionDocs}
          onMarkProcessed={handleMarkProcessed}
          onEdit={() => console.log('Edit:', id)}
        />
      </div>
    </div>
  );
}
