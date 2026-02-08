"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useRecord, useMutateRecord, useCollection } from '@/lib/hooks';
import { CoConsentDetail } from '@/modules/54-consent/ui/CoConsentDetail';

export default function ConsentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: consent, isLoading } = useRecord('consents', id) as { data: any; isLoading: boolean };
  const { mutate } = useMutateRecord('consents', id);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-1/3"></div>
          <div className="h-4 bg-stone-200 rounded w-1/4"></div>
          <div className="h-64 bg-stone-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!consent) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Согласие не найдено</h2>
          <p className="text-stone-500 mb-4">Согласие с ID &quot;{id}&quot; не существует</p>
          <button
            onClick={() => router.push('/m/consent')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Вернуться к дашборду
          </button>
        </div>
      </div>
    );
  }

  const handleRevoke = async () => {
    if (confirm('Вы уверены, что хотите отозвать это согласие?')) {
      await mutate({
        statusKey: 'revoked',
        revokedByUserId: 'user-1',
        revokedAt: new Date().toISOString(),
      });
      router.refresh();
    }
  };

  return (
    <div className="p-6">
      <CoConsentDetail
        consent={consent}
        onBack={() => router.push('/m/consent')}
        onRevoke={handleRevoke}
        onShowAudit={() => router.push(`/m/consent/list?tab=audit&recordId=${id}`)}
      />
    </div>
  );
}
