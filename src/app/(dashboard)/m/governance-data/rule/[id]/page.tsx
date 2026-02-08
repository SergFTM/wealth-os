'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { DgRuleDetail } from '@/modules/51-data-governance/ui';
import { DataGovernanceRule } from '@/modules/51-data-governance/engine/types';

export default function RuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ruleId = params.id as string;

  const { data: rules = [] } = useCollection<DataGovernanceRule>('dataGovernanceRules');

  const rule = rules.find(r => r.id === ruleId);

  if (!rule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-stone-800">Правило не найдено</h1>
          <button
            onClick={() => router.push('/m/governance-data/list?tab=rules')}
            className="mt-4 text-sm text-emerald-600 hover:text-emerald-700"
          >
            ← Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const handleToggleEnabled = async () => {
    console.log('Toggle rule enabled:', ruleId, !rule.enabled);
    // Would call API
  };

  const handleEdit = () => {
    console.log('Edit rule:', ruleId);
    // Would open modal
  };

  const handleTestRun = () => {
    console.log('Test run rule:', ruleId);
    // Would run test
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/m/governance-data/list?tab=rules')}
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            ← Правила
          </button>
        </div>

        <DgRuleDetail
          rule={rule}
          onToggleEnabled={handleToggleEnabled}
          onEdit={handleEdit}
          onTestRun={handleTestRun}
        />
      </div>
    </div>
  );
}
