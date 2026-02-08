'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { DgOverrideDetail } from '@/modules/51-data-governance/ui';
import { DataOverride } from '@/modules/51-data-governance/engine/types';

export default function OverrideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const overrideId = params.id as string;

  const { data: overrides = [] } = useCollection<DataOverride>('dataOverrides');

  const override = overrides.find(o => o.id === overrideId);

  if (!override) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-stone-800">Override не найден</h1>
          <button
            onClick={() => router.push('/m/governance-data/list?tab=overrides')}
            className="mt-4 text-sm text-emerald-600 hover:text-emerald-700"
          >
            ← Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    console.log('Approve override:', overrideId);
    // Would call API
  };

  const handleReject = async (reason: string) => {
    console.log('Reject override:', overrideId, reason);
    // Would call API
  };

  const handleApply = async () => {
    console.log('Apply override:', overrideId);
    // Would call API
  };

  const handleSubmit = async () => {
    console.log('Submit override:', overrideId);
    // Would call API
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/m/governance-data/list?tab=overrides')}
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            ← Overrides
          </button>
        </div>

        <DgOverrideDetail
          override={override}
          onApprove={handleApprove}
          onReject={handleReject}
          onApply={handleApply}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
