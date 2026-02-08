"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { ModuleList } from '@/components/templates/ModuleList';
import { VdVendorDetail } from '@/modules/43-vendors/ui/VdVendorDetail';
import type { Vendor, Contract, Sla, Scorecard, Incident, Invoice } from '@/modules/43-vendors/types';

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const { data: vendorData, isLoading, error } = useRecord('vdVendors', vendorId);
  const { data: contractsData = [] } = useCollection('vdContracts');
  const { data: slasData = [] } = useCollection('vdSlas');
  const { data: scorecardsData = [] } = useCollection('vdScorecards');
  const { data: incidentsData = [] } = useCollection('vdIncidents');
  const { data: invoicesData = [] } = useCollection('vdInvoices');

  // Cast to proper types
  const vendor = vendorData as unknown as Vendor | null;
  const contracts = contractsData as unknown as Contract[];
  const slas = slasData as unknown as Sla[];
  const scorecards = scorecardsData as unknown as Scorecard[];
  const incidents = incidentsData as unknown as Incident[];
  const invoices = invoicesData as unknown as Invoice[];

  // Filter related data for this vendor
  const vendorContracts = contracts.filter(c => c.vendorId === vendorId);
  const vendorSlas = slas.filter(s => s.vendorId === vendorId);
  const vendorScorecards = scorecards.filter(s => s.vendorId === vendorId);
  const vendorIncidents = incidents.filter(i => i.vendorId === vendorId);
  const vendorInvoices = invoices.filter(i => i.vendorId === vendorId);

  const handleCreateContract = () => {
    router.push(`/m/vendors/list?tab=contracts&action=create&vendorId=${vendorId}`);
  };

  const handleCreateIncident = () => {
    router.push(`/m/vendors/list?tab=incidents&action=create&vendorId=${vendorId}`);
  };

  if (isLoading) {
    return (
      <ModuleList moduleSlug="vendors" title="Загрузка..." backHref="/m/vendors/list">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      </ModuleList>
    );
  }

  if (error || !vendor) {
    return (
      <ModuleList moduleSlug="vendors" title="Ошибка" backHref="/m/vendors/list">
        <div className="text-center py-12 text-stone-500">
          Провайдер не найден
        </div>
      </ModuleList>
    );
  }

  return (
    <ModuleList
      moduleSlug="vendors"
      title={vendor.name}
      backHref="/m/vendors/list"
    >
      <VdVendorDetail
        vendor={vendor}
        contracts={vendorContracts as unknown as Parameters<typeof VdVendorDetail>[0]['contracts']}
        slas={vendorSlas as unknown as Parameters<typeof VdVendorDetail>[0]['slas']}
        scorecards={vendorScorecards as unknown as Parameters<typeof VdVendorDetail>[0]['scorecards']}
        incidents={vendorIncidents as unknown as Parameters<typeof VdVendorDetail>[0]['incidents']}
        invoices={vendorInvoices as unknown as Parameters<typeof VdVendorDetail>[0]['invoices']}
        onCreateContract={handleCreateContract}
        onCreateIncident={handleCreateIncident}
        onBack={() => router.push('/m/vendors/list')}
      />
    </ModuleList>
  );
}
