"use client";

import { useRecord, useCollection } from '@/lib/hooks';
import { ModuleList } from '@/components/templates/ModuleList';
import { PhImpactDetail } from '@/modules/49-philanthropy/ui/PhImpactDetail';

export default function PhilanthropyReportPage({
  params,
}: {
  params: { id: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: report, loading } = useRecord('philImpactReports', params.id) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: grants = [] } = useCollection('philGrants') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: programs = [] } = useCollection('philPrograms') as { data: any[] };

  if (loading) {
    return (
      <ModuleList moduleSlug="philanthropy" title="Загрузка..." backHref="/m/philanthropy/list?tab=impact">
        <div className="p-8 text-center text-stone-500">Загрузка...</div>
      </ModuleList>
    );
  }

  if (!report) {
    return (
      <ModuleList moduleSlug="philanthropy" title="Не найдено" backHref="/m/philanthropy/list?tab=impact">
        <div className="p-8 text-center text-stone-500">Отчет не найден</div>
      </ModuleList>
    );
  }

  const grant = grants.find((g) => g.id === report.grantId);
  const program = programs.find((p) => p.id === report.programId);

  const enrichedReport = {
    ...report,
    grantName: grant?.purpose?.slice(0, 50),
    granteeName: grant?.granteeJson?.name,
    programName: program?.name,
  };

  return (
    <ModuleList
      moduleSlug="philanthropy"
      title="Impact Report"
      backHref="/m/philanthropy/list?tab=impact"
    >
      <PhImpactDetail
        report={enrichedReport}
        onEdit={() => {}}
        onSubmit={() => {}}
        onPublish={() => {}}
      />
    </ModuleList>
  );
}
