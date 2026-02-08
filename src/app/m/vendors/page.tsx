"use client";

import { useRouter } from 'next/navigation';
import { ModuleDashboard } from '@/components/templates/ModuleDashboard';
import { useCollection } from '@/lib/hooks';
import { VdKpiStrip } from '@/modules/43-vendors/ui/VdKpiStrip';
import { VdActionsBar } from '@/modules/43-vendors/ui/VdActionsBar';
import { VdVendorsTable } from '@/modules/43-vendors/ui/VdVendorsTable';
import type { Vendor, Contract, Sla, Scorecard, Incident, Invoice } from '@/modules/43-vendors/types';

export default function VendorsDashboardPage() {
  const router = useRouter();
  const { data: vendorsData = [] } = useCollection('vdVendors');
  const { data: contractsData = [] } = useCollection('vdContracts');
  const { data: slasData = [] } = useCollection('vdSlas');
  const { data: scorecardsData = [] } = useCollection('vdScorecards');
  const { data: incidentsData = [] } = useCollection('vdIncidents');
  const { data: invoicesData = [] } = useCollection('vdInvoices');

  // Cast to proper types
  const vendors = vendorsData as unknown as Vendor[];
  const contracts = contractsData as unknown as Contract[];
  const slas = slasData as unknown as Sla[];
  const scorecards = scorecardsData as unknown as Scorecard[];
  const incidents = incidentsData as unknown as Incident[];
  const invoices = invoicesData as unknown as Invoice[];

  // Calculate KPIs
  const activeVendors = vendors.filter(v => v.status === 'active').length;

  const now = new Date();
  const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const contractsRenew90d = contracts.filter(c =>
    c.status === 'active' && c.endDate && new Date(c.endDate) <= in90Days
  ).length;

  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const slaBreaches30d = slas.filter(s => s.status === 'breached').length;

  const incidentsOpen = incidents.filter(i =>
    i.status === 'open' || i.status === 'in_progress'
  ).length;

  // High spend vendors (calculate YTD spend)
  const vendorSpend = new Map<string, number>();
  invoices.forEach(inv => {
    if (inv.status === 'paid' || inv.status === 'pending') {
      vendorSpend.set(inv.vendorId, (vendorSpend.get(inv.vendorId) || 0) + inv.amount);
    }
  });
  const highSpendVendors = Array.from(vendorSpend.entries())
    .filter(([, spend]) => spend > 100000).length;

  const feeAnomalies = 0; // Would need anomalyFlag in Invoice type

  const accessActive = vendors.filter(v =>
    v.onboardingJson?.accessGrantsJson && v.onboardingJson.accessGrantsJson.length > 0
  ).length;

  const scorecardsLow = scorecards.filter(s => s.overallScore < 6).length;

  const kpis = {
    activeVendors,
    contractsRenew90d,
    slaBreaches30d,
    incidentsOpen,
    highSpendVendors,
    feeAnomalies,
    accessActive,
    scorecardsLow,
  };

  // Recent vendors for table
  const recentVendors = [...vendors]
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10)
    .map(v => {
      const vendorContracts = contracts.filter(c => c.vendorId === v.id);
      const vendorInvoices = invoices.filter(i =>
        i.vendorId === v.id && (i.status === 'paid' || i.status === 'pending')
      );
      const spendYtd = vendorInvoices.reduce((sum, i) => sum + i.amount, 0);
      return {
        ...v,
        contractsCount: vendorContracts.length,
        spendYtd,
      };
    });

  const handleVendorClick = (vendor: { id: string }) => {
    router.push(`/m/vendors/vendor/${vendor.id}`);
  };

  return (
    <ModuleDashboard
      moduleSlug="vendors"
      title="Провайдеры"
      subtitle="Управление поставщиками и сервис-провайдерами"
    >
      <div className="space-y-6">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>
              Информация о провайдерах демонстрационная. Контракты требуют юридической проверки.
            </p>
          </div>
        </div>

        {/* KPI Strip */}
        <VdKpiStrip kpis={kpis} />

        {/* Actions Bar */}
        <VdActionsBar
          onCreateVendor={() => router.push('/m/vendors/list?tab=vendors&action=create')}
          onCreateContract={() => router.push('/m/vendors/list?tab=contracts&action=create')}
          onCreateIncident={() => router.push('/m/vendors/list?tab=incidents&action=create')}
          onViewAll={() => router.push('/m/vendors/list')}
        />

        {/* Recent Vendors Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
          <div className="px-4 py-3 border-b border-stone-200/50">
            <h3 className="font-semibold text-stone-800">Недавние провайдеры</h3>
          </div>
          <VdVendorsTable
            vendors={recentVendors}
            onRowClick={handleVendorClick}
            emptyMessage="Нет провайдеров"
          />
        </div>
      </div>
    </ModuleDashboard>
  );
}
