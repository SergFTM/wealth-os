"use client";

import { useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { ModuleList } from '@/components/templates/ModuleList';
import { PhGrantDetail } from '@/modules/49-philanthropy/ui/PhGrantDetail';

export default function PhilanthropyGrantPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: grant, loading } = useRecord('philGrants', params.id) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entities = [] } = useCollection('philEntities') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: programs = [] } = useCollection('philPrograms') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: complianceChecks = [] } = useCollection('philComplianceChecks') as { data: any[] };

  if (loading) {
    return (
      <ModuleList moduleSlug="philanthropy" title="Загрузка..." backHref="/m/philanthropy/list?tab=grants">
        <div className="p-8 text-center text-stone-500">Загрузка...</div>
      </ModuleList>
    );
  }

  if (!grant) {
    return (
      <ModuleList moduleSlug="philanthropy" title="Не найдено" backHref="/m/philanthropy/list?tab=grants">
        <div className="p-8 text-center text-stone-500">Грант не найден</div>
      </ModuleList>
    );
  }

  const entity = entities.find((e) => e.id === grant.entityId);
  const program = programs.find((p) => p.id === grant.programId);
  const grantComplianceChecks = complianceChecks.filter((c) => c.grantId === params.id);

  const enrichedGrant = {
    ...grant,
    entityName: entity?.name,
    programName: program?.name,
  };

  const title = grant.granteeJson?.name || `Грант ${params.id}`;

  return (
    <ModuleList
      moduleSlug="philanthropy"
      title={title}
      backHref="/m/philanthropy/list?tab=grants"
    >
      <PhGrantDetail
        grant={enrichedGrant}
        complianceChecks={grantComplianceChecks}
        onEdit={() => {}}
        onSubmit={() => {}}
        onApprove={() => {}}
        onReject={() => {}}
        onSchedulePayout={() => router.push(`/m/philanthropy/list?tab=payouts&action=create&grantId=${params.id}`)}
      />
    </ModuleList>
  );
}
