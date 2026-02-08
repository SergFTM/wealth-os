'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { DgKpiDetail } from '@/modules/51-data-governance/ui';
import {
  DataKpi,
  DataLineage,
  DataQualityScore,
  DataReconciliation,
  DataOverride,
} from '@/modules/51-data-governance/engine/types';
import { buildWhyThisNumber } from '@/modules/51-data-governance/engine/whyNumberEngine';

export default function KpiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const kpiId = params.id as string;

  const { data: kpis = [] } = useCollection<DataKpi>('dataKpis');
  const { data: lineages = [] } = useCollection<DataLineage>('dataLineage');
  const { data: qualityScores = [] } = useCollection<DataQualityScore>('dataQualityScores');
  const { data: recons = [] } = useCollection<DataReconciliation>('dataReconciliations');
  const { data: overrides = [] } = useCollection<DataOverride>('dataOverrides');

  const kpi = kpis.find(k => k.id === kpiId);
  const lineage = lineages.find(l => l.kpiId === kpiId);
  const qualityScore = qualityScores.find(q => q.scopeKey === 'kpi' && q.scopeId === kpiId);
  const kpiRecons = recons.filter(r => r.scopeJson?.entityId === kpi?.clientId);
  const kpiOverrides = overrides.filter(o => o.targetId === kpiId);

  const whyThisNumber = useMemo(() => {
    if (!kpi) return undefined;
    return buildWhyThisNumber({
      kpi,
      lineage,
      qualityScore,
    });
  }, [kpi, lineage, qualityScore]);

  if (!kpi) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-stone-800">KPI не найден</h1>
          <button
            onClick={() => router.push('/m/governance-data/list?tab=kpis')}
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
            onClick={() => router.push('/m/governance-data/list?tab=kpis')}
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            ← KPIs
          </button>
        </div>

        <DgKpiDetail
          kpi={kpi}
          lineage={lineage}
          qualityScore={qualityScore}
          recons={kpiRecons}
          overrides={kpiOverrides}
          whyThisNumber={whyThisNumber}
          onDefineLineage={() => console.log('Define lineage')}
          onRunQuality={() => console.log('Run quality')}
        />
      </div>
    </div>
  );
}
