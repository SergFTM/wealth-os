"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { ModuleList } from '@/components/templates/ModuleList';
import { VdContractDetail } from '@/modules/43-vendors/ui/VdContractDetail';
import { analyzeContract } from '@/modules/43-vendors/engine/contractAnalyzer';
import type { Contract, Vendor, Invoice } from '@/modules/43-vendors/types';

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;

  const { data: contractData, isLoading, error } = useRecord('vdContracts', contractId);
  const { data: vendorsData = [] } = useCollection('vdVendors');
  const { data: invoicesData = [] } = useCollection('vdInvoices');

  // Cast to proper types
  const contract = contractData as unknown as Contract | null;
  const vendors = vendorsData as unknown as Vendor[];
  const invoices = invoicesData as unknown as Invoice[];

  // Get vendor name
  const vendor = contract ? vendors.find(v => v.id === contract.vendorId) : null;

  // Get linked invoices
  const linkedInvoices = invoices
    .filter(i => i.linkedContractId === contractId)
    .map(i => ({
      id: i.id,
      invoiceRef: i.invoiceRef,
      amount: i.amount,
    }));

  // Analyze contract
  const analysis = contract ? analyzeContract(contract as Parameters<typeof analyzeContract>[0]) : undefined;

  const handleEdit = () => {
    router.push(`/m/vendors/contract/${contractId}?action=edit`);
  };

  const handleRenew = () => {
    router.push(`/m/vendors/contract/${contractId}?action=renew`);
  };

  if (isLoading) {
    return (
      <ModuleList moduleSlug="vendors" title="Загрузка..." backHref="/m/vendors/list?tab=contracts">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      </ModuleList>
    );
  }

  if (error || !contract) {
    return (
      <ModuleList moduleSlug="vendors" title="Ошибка" backHref="/m/vendors/list?tab=contracts">
        <div className="text-center py-12 text-stone-500">
          Контракт не найден
        </div>
      </ModuleList>
    );
  }

  const enrichedContract = {
    ...contract,
    vendorName: vendor?.name,
  };

  return (
    <ModuleList
      moduleSlug="vendors"
      title={contract.name}
      backHref="/m/vendors/list?tab=contracts"
    >
      <VdContractDetail
        contract={enrichedContract}
        analysis={analysis}
        linkedInvoices={linkedInvoices}
        linkedDocuments={[]}
        onEdit={handleEdit}
        onRenew={handleRenew}
        onBack={() => router.push('/m/vendors/list?tab=contracts')}
      />
    </ModuleList>
  );
}
