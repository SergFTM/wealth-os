'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { DgReconDetail } from '@/modules/51-data-governance/ui';
import { DataReconciliation } from '@/modules/51-data-governance/engine/types';
import { proposeReconCauses } from '@/modules/51-data-governance/engine/aiDataGovAssistant';

export default function ReconDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reconId = params.id as string;

  const { data: recons = [] } = useCollection<DataReconciliation>('dataReconciliations');

  const recon = recons.find(r => r.id === reconId);

  const aiCauses = useMemo(() => {
    if (!recon || recon.statusKey !== 'break') return undefined;
    return proposeReconCauses(recon, 'ru').causes;
  }, [recon]);

  if (!recon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-stone-800">Сверка не найдена</h1>
          <button
            onClick={() => router.push('/m/governance-data/list?tab=recons')}
            className="mt-4 text-sm text-emerald-600 hover:text-emerald-700"
          >
            ← Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/m/governance-data/list?tab=recons')}
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            ← Сверки
          </button>
        </div>

        <DgReconDetail
          recon={recon}
          aiCauses={aiCauses}
          onCreateException={() => console.log('Create exception')}
          onCreateOverride={() => console.log('Create override')}
        />
      </div>
    </div>
  );
}
