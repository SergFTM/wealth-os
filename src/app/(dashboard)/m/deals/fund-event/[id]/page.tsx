"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { DlFundEventDetail } from '@/modules/42-deals/ui/DlFundEventDetail';
import { Button } from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FundEventDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { record: event, loading } = useRecord('dlFundEvents', id);
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

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-xl font-semibold text-stone-800 mb-2">Fund event не найдено</h1>
          <p className="text-stone-500 mb-4">ID: {id}</p>
          <Button variant="secondary" onClick={() => router.push('/m/deals/list?tab=fund_events')}>
            Назад к списку
          </Button>
        </div>
      </div>
    );
  }

  const eventDocs = (docs as unknown as Array<{ id: string; docName: string; linkedType: string; linkedId: string; status: 'missing' | 'requested' | 'received' | 'under_review' | 'approved' | 'rejected' }>).filter(
    d => d.linkedType === 'fund_event' && d.linkedId === id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      {/* Header */}
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push('/m/deals/list?tab=fund_events')}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-700 mb-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Fund Events
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <DlFundEventDetail
          event={event as unknown as {
            id: string;
            fundId: string;
            fundName: string;
            eventType: string;
            eventDate: string;
            dueDate?: string;
            amount: number;
            currency?: string;
            status: 'planned' | 'announced' | 'recorded' | 'paid' | 'cancelled';
            navDetailsJson?: Record<string, unknown>;
            callDetailsJson?: Record<string, unknown>;
            distributionDetailsJson?: Record<string, unknown>;
            linkedCashFlowId?: string;
            notes?: string;
          }}
          documents={eventDocs}
          onMarkRecorded={() => console.log('Mark recorded:', id)}
          onMarkPaid={() => console.log('Mark paid:', id)}
          onViewFund={() => router.push(`/m/private-capital`)}
          onViewCashFlow={() => router.push(`/m/liquidity`)}
          onEdit={() => console.log('Edit:', id)}
        />
      </div>
    </div>
  );
}
