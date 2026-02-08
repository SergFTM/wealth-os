"use client";

import { useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { ModuleList } from '@/components/templates/ModuleList';
import { PhEntityDetail } from '@/modules/49-philanthropy/ui/PhEntityDetail';

export default function PhilanthropyEntityPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entity, loading } = useRecord('philEntities', params.id) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: grants = [] } = useCollection('philGrants') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payouts = [] } = useCollection('philPayouts') as { data: any[] };

  if (loading) {
    return (
      <ModuleList moduleSlug="philanthropy" title="Загрузка..." backHref="/m/philanthropy/list?tab=entities">
        <div className="p-8 text-center text-stone-500">Загрузка...</div>
      </ModuleList>
    );
  }

  if (!entity) {
    return (
      <ModuleList moduleSlug="philanthropy" title="Не найдено" backHref="/m/philanthropy/list?tab=entities">
        <div className="p-8 text-center text-stone-500">Структура не найдена</div>
      </ModuleList>
    );
  }

  const entityGrants = grants.filter((g) => g.entityId === params.id);
  const grantsCount = entityGrants.length;

  const entityPayouts = payouts.filter((p) =>
    entityGrants.some((g) => g.id === p.grantId) && p.statusKey === 'confirmed'
  );
  const totalGranted = entityPayouts.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <ModuleList
      moduleSlug="philanthropy"
      title={entity.name}
      backHref="/m/philanthropy/list?tab=entities"
    >
      <PhEntityDetail
        entity={entity}
        grantsCount={grantsCount}
        totalGranted={totalGranted}
        onEdit={() => {}}
        onViewGrants={() => router.push(`/m/philanthropy/list?tab=grants&entityId=${params.id}`)}
        onViewBudgets={() => router.push(`/m/philanthropy/list?tab=budgets&entityId=${params.id}`)}
      />
    </ModuleList>
  );
}
