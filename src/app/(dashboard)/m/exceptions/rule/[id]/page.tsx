'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecord, useCollection, useMutateRecord } from '@/lib/hooks';
import { ExRuleDetail } from '@/modules/48-exceptions/ui/ExRuleDetail';
import { runRulesOnExceptions, ExceptionRule } from '@/modules/48-exceptions/engine/rulesEngine';

export default function RuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: rule, isLoading: loadingRule, error, refetch: refetchRule } = useRecord<ExceptionRule>('exceptionRules', id);
  const { data: exceptions = [], refetch: refetchExceptions } = useCollection<any>('exceptions');
  const { mutate } = useMutateRecord('exceptionRules', id);

  const handleToggle = async (enabled: boolean) => {
    await mutate({ enabled });
    refetchRule();
  };

  const handleRun = async () => {
    if (!rule) return;

    // Run this single rule on all open exceptions
    const openExceptions = exceptions.filter(e => e.status !== 'closed');
    const results = runRulesOnExceptions(openExceptions, [rule], 'current_user');

    // Apply updates to each matched exception
    for (const result of results) {
      if (Object.keys(result.updates).length > 0) {
        try {
          await fetch(`/api/collections/exceptions/${result.exceptionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result.updates)
          });
        } catch (err) {
          console.error('Failed to update exception:', result.exceptionId, err);
        }
      }
    }

    // Update rule stats
    await mutate({
      lastRunAt: new Date().toISOString(),
      lastMatchCount: results.length,
      matchCount: (rule.matchCount || 0) + results.length
    });

    refetchRule();
    refetchExceptions();
  };

  const handleEdit = () => {
    // Would open edit modal - for now just log
    console.log('Edit rule:', id);
  };

  if (loadingRule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !rule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800">Правило не найдено</h2>
            <p className="text-sm text-red-600 mt-2">ID: {id}</p>
            <Link
              href="/m/exceptions/list?tab=rules"
              className="inline-block mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
            >
              Вернуться к списку
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/m/exceptions/list?tab=rules"
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-stone-900">Правило</h1>
              <p className="text-xs text-stone-500 font-mono">{id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <ExRuleDetail
          rule={rule}
          onToggle={handleToggle}
          onRun={handleRun}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
