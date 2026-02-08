'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { DgLineageDetail } from '@/modules/51-data-governance/ui';
import { DataKpi, DataLineage } from '@/modules/51-data-governance/engine/types';

export default function LineageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lineageId = params.id as string;

  const { data: lineages = [] } = useCollection<DataLineage>('dataLineage');
  const { data: kpis = [] } = useCollection<DataKpi>('dataKpis');

  const lineage = lineages.find(l => l.id === lineageId);
  const kpi = lineage ? kpis.find(k => k.id === lineage.kpiId) : undefined;

  if (!lineage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-stone-800">Lineage не найден</h1>
          <button
            onClick={() => router.push('/m/governance-data/list?tab=lineage')}
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
            onClick={() => router.push('/m/governance-data/list?tab=lineage')}
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            ← Lineage
          </button>
        </div>

        <DgLineageDetail
          lineage={lineage}
          kpi={kpi}
          onEdit={() => console.log('Edit lineage')}
        />
      </div>
    </div>
  );
}
