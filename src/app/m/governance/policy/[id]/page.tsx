"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useRecord, useMutateRecord } from '@/lib/hooks';
import { GvPolicyDetail } from '@/modules/40-governance/ui/GvPolicyDetail';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';

export default function PolicyDetailPage() {
  const params = useParams();
  const { user, locale } = useApp();
  const policyId = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: policy, isLoading, error } = useRecord('gvPolicies', policyId) as { data: any; isLoading: boolean; error: unknown };
  const { mutate: updatePolicy } = useMutateRecord('gvPolicies', policyId);

  const handleEdit = () => {
    // Open edit modal or navigate to edit page
  };

  const handleActivate = async () => {
    await updatePolicy({
      status: 'active',
      effectiveDate: new Date().toISOString()
    });
  };

  const handleArchive = async () => {
    await updatePolicy({ status: 'archived' });
  };

  const handleAcknowledge = async () => {
    if (!user || !policy) return;

    const currentAcknowledgements = policy.acknowledgedByJson || [];
    const newAcknowledgement = {
      name: user.name,
      acknowledgedAt: new Date().toISOString(),
    };

    await updatePolicy({
      acknowledgedByJson: [...currentAcknowledgements, newAcknowledgement]
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">Политика не найдена</p>
          <Link href="/m/governance/list?tab=policies">
            <Button variant="secondary">К списку</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/m/governance/list?tab=policies">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-stone-800">{policy.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <GvPolicyDetail
          policy={policy}
          locale={locale as 'ru' | 'en' | 'uk'}
          currentUserId={user?.name}
          onEdit={policy.status === 'draft' ? handleEdit : undefined}
          onActivate={policy.status === 'draft' ? handleActivate : undefined}
          onArchive={policy.status === 'active' ? handleArchive : undefined}
          onAcknowledge={handleAcknowledge}
        />
      </div>
    </div>
  );
}
