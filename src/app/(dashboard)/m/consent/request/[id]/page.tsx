"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useRecord, useMutateRecord } from '@/lib/hooks';
import { CoRequestDetail } from '@/modules/54-consent/ui/CoRequestDetail';

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: request, isLoading } = useRecord('consentRequests', id) as { data: any; isLoading: boolean };
  const { mutate } = useMutateRecord('consentRequests', id);

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

  if (!request) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Запрос не найден</h2>
          <p className="text-stone-500 mb-4">Запрос с ID &quot;{id}&quot; не существует</p>
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

  const handleApprove = async () => {
    await mutate({
      statusKey: 'approved',
      decisionNotes: 'Approved',
      updatedAt: new Date().toISOString(),
    });
    router.refresh();
  };

  const handleReject = async () => {
    if (confirm('Отклонить запрос?')) {
      await mutate({
        statusKey: 'rejected',
        decisionNotes: 'Rejected',
        updatedAt: new Date().toISOString(),
      });
      router.refresh();
    }
  };

  const handleFulfill = async () => {
    await mutate({
      statusKey: 'fulfilled',
      fulfilledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    router.refresh();
  };

  return (
    <div className="p-6">
      <CoRequestDetail
        request={request}
        onBack={() => router.push('/m/consent')}
        onApprove={handleApprove}
        onReject={handleReject}
        onFulfill={handleFulfill}
        onShowAudit={() => router.push(`/m/consent/list?tab=audit&recordId=${id}`)}
      />
    </div>
  );
}
