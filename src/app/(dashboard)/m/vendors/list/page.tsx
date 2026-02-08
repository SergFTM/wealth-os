"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModuleList } from '@/components/templates/ModuleList';
import { useCollection } from '@/lib/hooks';
import { VdVendorsTable } from '@/modules/43-vendors/ui/VdVendorsTable';
import { VdContractsTable } from '@/modules/43-vendors/ui/VdContractsTable';
import { VdSlasTable } from '@/modules/43-vendors/ui/VdSlasTable';
import { VdScorecardsTable } from '@/modules/43-vendors/ui/VdScorecardsTable';
import { VdIncidentsTable } from '@/modules/43-vendors/ui/VdIncidentsTable';
import { VdInvoicesTable } from '@/modules/43-vendors/ui/VdInvoicesTable';
import { VdAccessPanel } from '@/modules/43-vendors/ui/VdAccessPanel';
import { VdAiPanel } from '@/modules/43-vendors/ui/VdAiPanel';
import { cn } from '@/lib/utils';
import type { Vendor, Contract, Sla, Scorecard, Incident, Invoice, AccessGrant } from '@/modules/43-vendors/types';

type TabKey = 'vendors' | 'contracts' | 'slas' | 'scorecards' | 'incidents' | 'invoices' | 'access' | 'ai';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'vendors', label: 'Провайдеры' },
  { key: 'contracts', label: 'Контракты' },
  { key: 'slas', label: 'SLA' },
  { key: 'scorecards', label: 'Scorecards' },
  { key: 'incidents', label: 'Инциденты' },
  { key: 'invoices', label: 'Счета' },
  { key: 'access', label: 'Доступы' },
  { key: 'ai', label: 'AI Ассистент' },
];

function VendorsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('vendors');

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

  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey;
    if (tab && tabs.some(t => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/m/vendors/list?tab=${tab}`);
  };

  // Create vendor name lookup
  const vendorNameMap = new Map(vendors.map(v => [v.id, v.name]));

  // Enrich data with related info
  const enrichedVendors = vendors.map(v => {
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

  const enrichedContracts = contracts.map(c => ({
    ...c,
    vendorName: vendorNameMap.get(c.vendorId) || c.vendorId,
  }));

  const enrichedSlas = slas.map(s => ({
    ...s,
    vendorName: vendorNameMap.get(s.vendorId) || s.vendorId,
  }));

  const enrichedScorecards = scorecards.map(s => ({
    ...s,
    vendorName: vendorNameMap.get(s.vendorId) || s.vendorId,
  }));

  const enrichedIncidents = incidents.map(i => ({
    ...i,
    vendorName: vendorNameMap.get(i.vendorId) || i.vendorId,
  }));

  const enrichedInvoices = invoices.map(i => {
    const contract = contracts.find(c => c.id === i.linkedContractId);
    return {
      ...i,
      vendorName: vendorNameMap.get(i.vendorId) || i.vendorId,
      contractName: contract?.name,
    };
  });

  // Extract access grants from vendors
  const accessGrants: AccessGrant[] = vendors.flatMap(v => {
    const grants = v.onboardingJson?.accessGrantsJson || [];
    return grants.map(g => ({
      ...g,
      vendorId: v.id,
      vendorName: v.name,
    }));
  });

  return (
    <ModuleList
      moduleSlug="vendors"
      title="Провайдеры"
      backHref="/m/vendors"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-stone-200">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  "pb-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.key
                    ? "border-emerald-500 text-emerald-700"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'vendors' && (
          <VdVendorsTable
            vendors={enrichedVendors}
            onRowClick={(v) => router.push(`/m/vendors/vendor/${v.id}`)}
            emptyMessage="Нет провайдеров"
          />
        )}

        {activeTab === 'contracts' && (
          <VdContractsTable
            contracts={enrichedContracts}
            onRowClick={(c) => router.push(`/m/vendors/contract/${c.id}`)}
            emptyMessage="Нет контрактов"
          />
        )}

        {activeTab === 'slas' && (
          <VdSlasTable
            slas={enrichedSlas}
            onRowClick={(s) => router.push(`/m/vendors/vendor/${s.vendorId}?tab=slas`)}
            emptyMessage="Нет SLA"
          />
        )}

        {activeTab === 'scorecards' && (
          <VdScorecardsTable
            scorecards={enrichedScorecards}
            onRowClick={(s) => router.push(`/m/vendors/scorecard/${s.id}`)}
            emptyMessage="Нет scorecards"
          />
        )}

        {activeTab === 'incidents' && (
          <VdIncidentsTable
            incidents={enrichedIncidents}
            onRowClick={(i) => router.push(`/m/vendors/incident/${i.id}`)}
            emptyMessage="Нет инцидентов"
          />
        )}

        {activeTab === 'invoices' && (
          <VdInvoicesTable
            invoices={enrichedInvoices as Parameters<typeof VdInvoicesTable>[0]['invoices']}
            onRowClick={(i) => router.push(`/m/vendors/vendor/${i.vendorId}?tab=invoices`)}
            emptyMessage="Нет счетов"
          />
        )}

        {activeTab === 'access' && (
          <VdAccessPanel
            grants={accessGrants}
            onRevoke={(grantId: string) => {
              console.log('Revoke grant:', grantId);
            }}
          />
        )}

        {activeTab === 'ai' && (
          <VdAiPanel />
        )}
      </div>
    </ModuleList>
  );
}

export default function VendorsListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    }>
      <VendorsListContent />
    </Suspense>
  );
}
