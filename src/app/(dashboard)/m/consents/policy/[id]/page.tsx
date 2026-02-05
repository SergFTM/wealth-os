"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord } from '@/lib/hooks';
import { CsPolicyDetail } from '@/modules/34-consents/ui/CsPolicyDetail';

interface PolicyRule {
  id: string;
  matchRole?: string[];
  matchDocTags?: string[];
  matchScopeType?: string[];
  allowActions?: string[];
  denyActions?: string[];
  enforceWatermark?: boolean;
  enforceClientSafe?: boolean;
}

interface SharingPolicy {
  id: string;
  name: string;
  description?: string;
  appliesTo: string;
  status: string;
  priority: number;
  rules: PolicyRule[];
  createdAt: string;
  updatedAt: string;
}

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { record: policy, loading } = useRecord<SharingPolicy>('sharingPolicies', id);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-stone-500">Загрузка...</div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-stone-500">Политика не найдена</div>
      </div>
    );
  }

  const handleActivate = async () => {
    await fetch(`/api/collections/sharingPolicies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active' }),
    });
    router.refresh();
  };

  const handlePause = async () => {
    await fetch(`/api/collections/sharingPolicies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paused' }),
    });
    router.refresh();
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <CsPolicyDetail
        policy={policy}
        onBack={() => router.push('/m/consents/list?tab=policies')}
        onActivate={handleActivate}
        onPause={handlePause}
      />
    </div>
  );
}
