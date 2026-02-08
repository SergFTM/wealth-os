"use client";

import { useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { ModuleList } from '@/components/templates/ModuleList';
import { PhPayoutDetail } from '@/modules/49-philanthropy/ui/PhPayoutDetail';

export default function PhilanthropyPayoutPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payout, loading } = useRecord('philPayouts', params.id) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: grants = [] } = useCollection('philGrants') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entities = [] } = useCollection('philEntities') as { data: any[] };

  if (loading) {
    return (
      <ModuleList moduleSlug="philanthropy" title="Загрузка..." backHref="/m/philanthropy/list?tab=payouts">
        <div className="p-8 text-center text-stone-500">Загрузка...</div>
      </ModuleList>
    );
  }

  if (!payout) {
    return (
      <ModuleList moduleSlug="philanthropy" title="Не найдено" backHref="/m/philanthropy/list?tab=payouts">
        <div className="p-8 text-center text-stone-500">Выплата не найдена</div>
      </ModuleList>
    );
  }

  const grant = grants.find((g) => g.id === payout.grantId);
  const entity = entities.find((e) => e.id === payout.entityId);

  const enrichedPayout = {
    ...payout,
    grantName: grant?.purpose?.slice(0, 50),
    granteeName: grant?.granteeJson?.name,
    entityName: entity?.name,
  };

  const amount = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: payout.currency || 'USD',
    minimumFractionDigits: 0,
  }).format(payout.amount);

  return (
    <ModuleList
      moduleSlug="philanthropy"
      title={`Выплата ${amount}`}
      backHref="/m/philanthropy/list?tab=payouts"
    >
      <PhPayoutDetail
        payout={enrichedPayout}
        onMarkSent={() => {}}
        onMarkConfirmed={() => {}}
        onEdit={() => {}}
        onViewPayment={() => {
          if (payout.linkedPaymentId) {
            router.push(`/m/billpay-checks/payment/${payout.linkedPaymentId}`);
          }
        }}
      />
    </ModuleList>
  );
}
