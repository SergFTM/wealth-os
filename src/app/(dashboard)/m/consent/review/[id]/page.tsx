"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useRecord, useMutateRecord } from '@/lib/hooks';
import { CoReviewDetail } from '@/modules/54-consent/ui/CoReviewDetail';

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: review, isLoading } = useRecord('accessReviews', id) as { data: any; isLoading: boolean };
  const { mutate } = useMutateRecord('accessReviews', id);

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

  if (!review) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Проверка не найдена</h2>
          <p className="text-stone-500 mb-4">Проверка доступа с ID &quot;{id}&quot; не существует</p>
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

  const handleDecide = async (granteeId: string, action: string, notes?: string) => {
    const decisions = [...(review.decisionsJson || [])];
    const existing = decisions.findIndex((d: { granteeId: string }) => d.granteeId === granteeId);
    const decision = { granteeId, action, notes };

    if (existing >= 0) {
      decisions[existing] = decision;
    } else {
      decisions.push(decision);
    }

    await mutate({ decisionsJson: decisions });
    router.refresh();
  };

  const handleClose = async () => {
    if (confirm('Закрыть проверку доступа?')) {
      await mutate({
        statusKey: 'closed',
        closedAt: new Date().toISOString(),
      });
      router.refresh();
    }
  };

  return (
    <div className="p-6">
      <CoReviewDetail
        review={review}
        onBack={() => router.push('/m/consent')}
        onDecide={handleDecide}
        onClose={handleClose}
        onShowAudit={() => router.push(`/m/consent/list?tab=audit&recordId=${id}`)}
      />
    </div>
  );
}
