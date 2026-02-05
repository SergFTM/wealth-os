"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { FeInvoiceDetail } from '@/modules/17-fees/ui/FeInvoiceDetail';
import { FeContractDetail } from '@/modules/17-fees/ui/FeContractDetail';
import { FeFeeRunDetail } from '@/modules/17-fees/ui/FeFeeRunDetail';

interface FeeContract {
  id: string;
  clientId: string;
  householdId: string;
  name: string;
  scheduleId: string;
  billingFrequency: 'monthly' | 'quarterly';
  startDate: string;
  endDate: string | null;
  status: 'active' | 'inactive';
  nextBillingDate: string;
  docIds: string[];
}

interface FeeSchedule {
  id: string;
  clientId: string;
  name: string;
  type: 'aum' | 'fixed' | 'performance';
  ratePct: number | null;
  fixedAmount: number | null;
  tiersJson: string | null;
  minFee: number | null;
  currency: string;
  status: 'active' | 'inactive';
}

interface FeeRun {
  id: string;
  periodStart: string;
  periodEnd: string;
  scopeType: string;
  scopeId: string | null;
  contractsCount: number;
  totalAum: number;
  totalFees: number;
  currency: string;
  status: 'draft' | 'locked' | 'invoiced';
  createdAt: string;
  lockedAt: string | null;
  lockedBy: string | null;
}

interface FeeInvoice {
  id: string;
  runId: string;
  contractId: string;
  clientId: string;
  invoiceNumber: string;
  periodStart: string;
  periodEnd: string;
  issueDate: string;
  dueDate: string;
  grossAmount: number;
  adjustments: number;
  netAmount: number;
  currency: string;
  status: 'draft' | 'pending_approval' | 'sent' | 'paid' | 'overdue' | 'void';
  paidAmount: number;
  paidDate: string | null;
  sentAt: string | null;
  lineItemsJson: string;
  glPostingRef: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  notes: string;
}

interface Client {
  id: string;
  name: string;
}

export default function FeesItemPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const type = searchParams.get('type') || 'invoice';

  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState<FeeInvoice | null>(null);
  const [contract, setContract] = useState<FeeContract | null>(null);
  const [run, setRun] = useState<FeeRun | null>(null);
  const [schedule, setSchedule] = useState<FeeSchedule | null>(null);
  const [clientName, setClientName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === 'invoice') {
          const [invoiceRes, clientsRes] = await Promise.all([
            fetch(`/api/collections/feeInvoices/${id}`),
            fetch('/api/collections/clients'),
          ]);
          const invoiceData = await invoiceRes.json();
          const clientsData = await clientsRes.json();

          setInvoice(invoiceData.item || invoiceData);
          const clients = clientsData.items || [];
          const client = clients.find((c: Client) => c.id === (invoiceData.item || invoiceData)?.clientId);
          setClientName(client?.name || '');
        } else if (type === 'contract') {
          const [contractRes, schedulesRes, clientsRes] = await Promise.all([
            fetch(`/api/collections/feeContracts/${id}`),
            fetch('/api/collections/feeSchedules'),
            fetch('/api/collections/clients'),
          ]);
          const contractData = await contractRes.json();
          const schedulesData = await schedulesRes.json();
          const clientsData = await clientsRes.json();

          const contractItem = contractData.item || contractData;
          setContract(contractItem);

          const schedules = schedulesData.items || [];
          const foundSchedule = schedules.find((s: FeeSchedule) => s.id === contractItem?.scheduleId);
          setSchedule(foundSchedule || null);

          const clients = clientsData.items || [];
          const client = clients.find((c: Client) => c.id === contractItem?.clientId);
          setClientName(client?.name || '');
        } else if (type === 'run') {
          const runRes = await fetch(`/api/collections/feeRuns/${id}`);
          const runData = await runRes.json();
          setRun(runData.item || runData);
        }
      } catch (error) {
        console.error('Failed to fetch item data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, type]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-stone-200 rounded-lg" />
            <div className="h-8 bg-stone-200 rounded w-1/4" />
          </div>
          <div className="h-48 bg-stone-200 rounded-xl" />
          <div className="h-64 bg-stone-200 rounded-xl" />
        </div>
      </div>
    );
  }

  const getTitle = () => {
    if (type === 'invoice' && invoice) return `Счёт ${invoice.invoiceNumber}`;
    if (type === 'contract' && contract) return contract.name;
    if (type === 'run' && run) return 'Расчёт комиссий';
    return 'Детали';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-stone-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-stone-800">{getTitle()}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {type === 'invoice' && 'Детали счёта'}
            {type === 'contract' && 'Детали договора'}
            {type === 'run' && 'Детали расчёта'}
          </p>
        </div>
      </div>

      {/* Content */}
      {type === 'invoice' && invoice && (
        <FeInvoiceDetail
          invoice={invoice}
          clientName={clientName}
          onApprove={() => console.log('Approve')}
          onSend={() => console.log('Send')}
          onRecordPayment={() => console.log('Record payment')}
          onVoid={() => console.log('Void')}
          onPostToGL={() => console.log('Post to GL')}
          onPrint={() => console.log('Print')}
        />
      )}

      {type === 'contract' && contract && (
        <FeContractDetail
          contract={contract}
          schedule={schedule || undefined}
          clientName={clientName}
          onRunFees={() => console.log('Run fees')}
          onEditSchedule={() => console.log('Edit schedule')}
          onDeactivate={() => console.log('Deactivate')}
          onViewDocument={(docId) => router.push(`/m/documents/item/${docId}`)}
        />
      )}

      {type === 'run' && run && (
        <FeFeeRunDetail
          run={run}
          lineItems={[]}
          onLock={() => console.log('Lock')}
          onUnlock={() => console.log('Unlock')}
          onGenerateInvoices={() => console.log('Generate invoices')}
          onRecalculate={() => console.log('Recalculate')}
          onExport={() => console.log('Export')}
        />
      )}

      {/* Not found state */}
      {!invoice && !contract && !run && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
          <p className="text-stone-500">Элемент не найден</p>
        </div>
      )}
    </div>
  );
}
