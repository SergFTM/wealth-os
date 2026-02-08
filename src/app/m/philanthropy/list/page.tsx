"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModuleList } from '@/components/templates/ModuleList';
import { useCollection } from '@/lib/hooks';
import { PhEntitiesTable } from '@/modules/49-philanthropy/ui/PhEntitiesTable';
import { PhProgramsTable } from '@/modules/49-philanthropy/ui/PhProgramsTable';
import { PhGrantsTable } from '@/modules/49-philanthropy/ui/PhGrantsTable';
import { PhPayoutsTable } from '@/modules/49-philanthropy/ui/PhPayoutsTable';
import { PhBudgetsTable } from '@/modules/49-philanthropy/ui/PhBudgetsTable';
import { PhImpactTable } from '@/modules/49-philanthropy/ui/PhImpactTable';
import { PhCompliancePanel } from '@/modules/49-philanthropy/ui/PhCompliancePanel';

type TabKey = 'entities' | 'programs' | 'grants' | 'payouts' | 'budgets' | 'impact' | 'compliance' | 'audit';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'entities', label: 'Структуры' },
  { key: 'programs', label: 'Программы' },
  { key: 'grants', label: 'Гранты' },
  { key: 'payouts', label: 'Выплаты' },
  { key: 'budgets', label: 'Бюджеты' },
  { key: 'impact', label: 'Impact' },
  { key: 'compliance', label: 'Комплаенс' },
  { key: 'audit', label: 'Audit' },
];

function PhilanthropyListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('grants');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entities = [] } = useCollection('philEntities') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: programs = [] } = useCollection('philPrograms') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: grants = [] } = useCollection('philGrants') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payouts = [] } = useCollection('philPayouts') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: budgets = [] } = useCollection('philBudgets') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: impactReports = [] } = useCollection('philImpactReports') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: complianceChecks = [] } = useCollection('philComplianceChecks') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: auditEvents = [] } = useCollection('auditEvents') as { data: any[] };

  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey;
    if (tab && tabs.some(t => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/m/philanthropy/list?tab=${tab}`);
  };

  // Enrich data with related names
  const enrichedGrants = grants.map((grant) => {
    const program = programs.find((p) => p.id === grant.programId);
    return { ...grant, programName: program?.name };
  });

  const enrichedPayouts = payouts.map((payout) => {
    const grant = grants.find((g) => g.id === payout.grantId);
    return {
      ...payout,
      grantName: grant?.purpose?.slice(0, 50),
      granteeName: grant?.granteeJson?.name,
    };
  });

  const enrichedBudgets = budgets.map((budget) => {
    const entity = entities.find((e) => e.id === budget.entityId);
    return { ...budget, entityName: entity?.name };
  });

  const enrichedImpact = impactReports.map((report) => {
    const grant = grants.find((g) => g.id === report.grantId);
    return {
      ...report,
      grantName: grant?.purpose?.slice(0, 50),
      granteeName: grant?.granteeJson?.name,
    };
  });

  const enrichedPrograms = programs.map((program) => {
    const programGrants = grants.filter((g) => g.programId === program.id);
    return { ...program, grantsCount: programGrants.length };
  });

  // Filter audit events for philanthropy
  const philAuditEvents = auditEvents.filter((e) =>
    e.collection?.startsWith('phil') ||
    ['philEntities', 'philPrograms', 'philGrants', 'philPayouts', 'philBudgets', 'philImpactReports', 'philComplianceChecks'].includes(e.collection)
  );

  return (
    <ModuleList
      moduleSlug="philanthropy"
      title="Philanthropy"
      backHref="/m/philanthropy"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-stone-200">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
          {activeTab === 'entities' && (
            <PhEntitiesTable
              entities={entities}
              onRowClick={(e) => router.push(`/m/philanthropy/entity/${e.id}`)}
            />
          )}

          {activeTab === 'programs' && (
            <PhProgramsTable
              programs={enrichedPrograms}
              onRowClick={(p) => router.push(`/m/philanthropy/program/${p.id}`)}
            />
          )}

          {activeTab === 'grants' && (
            <PhGrantsTable
              grants={enrichedGrants}
              onRowClick={(g) => router.push(`/m/philanthropy/grant/${g.id}`)}
            />
          )}

          {activeTab === 'payouts' && (
            <PhPayoutsTable
              payouts={enrichedPayouts}
              onRowClick={(p) => router.push(`/m/philanthropy/payout/${p.id}`)}
            />
          )}

          {activeTab === 'budgets' && (
            <PhBudgetsTable
              budgets={enrichedBudgets}
            />
          )}

          {activeTab === 'impact' && (
            <PhImpactTable
              reports={enrichedImpact}
              onRowClick={(r) => router.push(`/m/philanthropy/report/${r.id}`)}
            />
          )}

          {activeTab === 'compliance' && (
            <div className="p-4">
              <PhCompliancePanel
                checks={complianceChecks}
                showActions={false}
              />
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="p-4">
              {philAuditEvents.length === 0 ? (
                <div className="text-center text-stone-500 py-8">
                  Нет событий аудита
                </div>
              ) : (
                <div className="space-y-2">
                  {philAuditEvents.slice(0, 50).map((event) => (
                    <div key={event.id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                      <div>
                        <div className="text-sm text-stone-900">{event.summary}</div>
                        <div className="text-xs text-stone-500">{event.actorName} · {event.collection}</div>
                      </div>
                      <div className="text-xs text-stone-400">
                        {new Date(event.ts).toLocaleString('ru-RU')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ModuleList>
  );
}

export default function PhilanthropyListPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Загрузка...</div>}>
      <PhilanthropyListContent />
    </Suspense>
  );
}
