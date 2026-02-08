"use client";

import { useRouter } from 'next/navigation';
import { ModuleDashboard } from '@/components/templates/ModuleDashboard';
import { useCollection } from '@/lib/hooks';
import { PhKpiStrip } from '@/modules/49-philanthropy/ui/PhKpiStrip';
import { PhActionsBar } from '@/modules/49-philanthropy/ui/PhActionsBar';
import { PhGrantsTable } from '@/modules/49-philanthropy/ui/PhGrantsTable';
import { PhAiPanel } from '@/modules/49-philanthropy/ui/PhAiPanel';

export default function PhilanthropyDashboardPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: grants = [] } = useCollection('philGrants') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payouts = [] } = useCollection('philPayouts') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: budgets = [] } = useCollection('philBudgets') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: complianceChecks = [] } = useCollection('philComplianceChecks') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: impactReports = [] } = useCollection('philImpactReports') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: programs = [] } = useCollection('philPrograms') as { data: any[] };

  // Calculate KPIs
  const grantsInReview = grants.filter((g) => g.stageKey === 'in_review').length;
  const approvalsPending = grants.filter((g) =>
    g.stageKey === 'in_review' || g.stageKey === 'submitted'
  ).length;

  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const payoutsScheduled = payouts
    .filter((p) => {
      if (p.statusKey !== 'scheduled') return false;
      const payoutDate = new Date(p.payoutDate);
      return payoutDate >= now && payoutDate <= thirtyDaysFromNow;
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const currentYear = now.getFullYear();
  const budgetRemaining = budgets
    .filter((b) => b.year === currentYear)
    .reduce((sum, b) => sum + (b.remainingAmount || 0), 0);

  const complianceOpen = complianceChecks.filter((c) => c.statusKey === 'open').length;
  const missingDocs = grants.filter((g) => g.docsStatusKey === 'incomplete').length;
  const impactDue = impactReports.filter((r) => r.statusKey === 'draft').length;
  const clientSafePublished = impactReports.filter((r) => r.clientSafePublished).length;

  // Recent grants with program names
  const recentGrants = [...grants]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10)
    .map((grant) => {
      const program = programs.find((p) => p.id === grant.programId);
      return {
        ...grant,
        programName: program?.name,
      };
    });

  const handleGrantClick = (grant: { id: string }) => {
    router.push(`/m/philanthropy/grant/${grant.id}`);
  };

  return (
    <ModuleDashboard
      moduleSlug="philanthropy"
      title="Philanthropy"
      subtitle="Благотворительные программы и гранты семьи"
    >
      <div className="space-y-6">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>
              Не является юридической или налоговой консультацией. Благотворительные решения требуют проверки специалистами.
            </p>
          </div>
        </div>

        {/* KPI Strip */}
        <PhKpiStrip
          grantsInReview={grantsInReview}
          approvalsPending={approvalsPending}
          payoutsScheduled={payoutsScheduled}
          budgetRemaining={budgetRemaining}
          complianceOpen={complianceOpen}
          missingDocs={missingDocs}
          impactDue={impactDue}
          clientSafePublished={clientSafePublished}
        />

        {/* Actions Bar */}
        <PhActionsBar
          onCreateEntity={() => router.push('/m/philanthropy/list?tab=entities&action=create')}
          onCreateProgram={() => router.push('/m/philanthropy/list?tab=programs&action=create')}
          onCreateGrant={() => router.push('/m/philanthropy/list?tab=grants&action=create')}
          onCreatePayout={() => router.push('/m/philanthropy/list?tab=payouts&action=create')}
          onCreateImpact={() => router.push('/m/philanthropy/list?tab=impact&action=create')}
          onGenerateDemo={() => {}}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Grants Table */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
            <div className="px-4 py-3 border-b border-stone-200/50">
              <h3 className="font-semibold text-stone-800">Недавние гранты</h3>
            </div>
            <PhGrantsTable
              grants={recentGrants}
              onRowClick={handleGrantClick}
              emptyMessage="Нет грантов"
            />
          </div>

          {/* AI Panel */}
          <div className="lg:col-span-1">
            <PhAiPanel />
          </div>
        </div>

        {/* Budget Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h3 className="font-semibold text-stone-800 mb-4">Бюджет {currentYear}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-stone-50 rounded-lg p-4">
              <div className="text-xs text-stone-500 uppercase tracking-wider">Общий бюджет</div>
              <div className="text-xl font-semibold text-stone-900 mt-1">
                {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
                  .format(budgets.filter(b => b.year === currentYear).reduce((sum, b) => sum + (b.budgetAmount || 0), 0))}
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="text-xs text-amber-600 uppercase tracking-wider">Committed</div>
              <div className="text-xl font-semibold text-amber-700 mt-1">
                {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
                  .format(budgets.filter(b => b.year === currentYear).reduce((sum, b) => sum + (b.committedAmount || 0), 0))}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-xs text-green-600 uppercase tracking-wider">Выплачено</div>
              <div className="text-xl font-semibold text-green-700 mt-1">
                {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
                  .format(budgets.filter(b => b.year === currentYear).reduce((sum, b) => sum + (b.paidAmount || 0), 0))}
              </div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="text-xs text-emerald-600 uppercase tracking-wider">Остаток</div>
              <div className="text-xl font-semibold text-emerald-700 mt-1">
                {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
                  .format(budgetRemaining)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleDashboard>
  );
}
