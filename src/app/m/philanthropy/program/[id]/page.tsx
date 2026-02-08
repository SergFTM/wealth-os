"use client";

import { useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { ModuleList } from '@/components/templates/ModuleList';
import { PhProgramDetail } from '@/modules/49-philanthropy/ui/PhProgramDetail';

export default function PhilanthropyProgramPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: program, loading } = useRecord('philPrograms', params.id) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entities = [] } = useCollection('philEntities') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: grants = [] } = useCollection('philGrants') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payouts = [] } = useCollection('philPayouts') as { data: any[] };

  if (loading) {
    return (
      <ModuleList moduleSlug="philanthropy" title="Загрузка..." backHref="/m/philanthropy/list?tab=programs">
        <div className="p-8 text-center text-stone-500">Загрузка...</div>
      </ModuleList>
    );
  }

  if (!program) {
    return (
      <ModuleList moduleSlug="philanthropy" title="Не найдено" backHref="/m/philanthropy/list?tab=programs">
        <div className="p-8 text-center text-stone-500">Программа не найдена</div>
      </ModuleList>
    );
  }

  const entity = entities.find((e) => e.id === program.entityId);
  const programGrants = grants.filter((g) => g.programId === params.id);
  const activeGrantsCount = programGrants.filter((g) =>
    ['submitted', 'in_review', 'approved', 'paid'].includes(g.stageKey)
  ).length;

  const programPayouts = payouts.filter((p) =>
    programGrants.some((g) => g.id === p.grantId) && p.statusKey === 'confirmed'
  );
  const totalGranted = programPayouts.reduce((sum, p) => sum + (p.amount || 0), 0);

  const enrichedProgram = {
    ...program,
    entityName: entity?.name,
  };

  return (
    <ModuleList
      moduleSlug="philanthropy"
      title={program.name}
      backHref="/m/philanthropy/list?tab=programs"
    >
      <PhProgramDetail
        program={enrichedProgram}
        activeGrantsCount={activeGrantsCount}
        totalGranted={totalGranted}
        onEdit={() => {}}
        onViewGrants={() => router.push(`/m/philanthropy/list?tab=grants&programId=${params.id}`)}
      />
    </ModuleList>
  );
}
