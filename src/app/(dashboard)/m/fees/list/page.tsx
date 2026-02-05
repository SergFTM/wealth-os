"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FileText,
  Calculator,
  Receipt,
  CreditCard,
  BarChart3,
  Percent,
  ArrowLeft
} from 'lucide-react';
import { FeContractsTable } from '@/modules/17-fees/ui/FeContractsTable';
import { FeSchedulesTable } from '@/modules/17-fees/ui/FeSchedulesTable';
import { FeFeeRunsTable } from '@/modules/17-fees/ui/FeFeeRunsTable';
import { FeInvoicesTable } from '@/modules/17-fees/ui/FeInvoicesTable';
import { FeArTable } from '@/modules/17-fees/ui/FeArTable';
import { FeActionsBar } from '@/modules/17-fees/ui/FeActionsBar';

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
  contractsCount: number;
  totalFees: number;
  currency: string;
  status: 'draft' | 'locked' | 'invoiced';
  createdAt: string;
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
}

interface ArPayment {
  id: string;
  clientId: string;
  invoiceId: string;
  paymentDate: string;
  method: 'wire' | 'ach' | 'check' | 'card';
  paidAmount: number;
  currency: string;
  cashAccountId: string;
  cashMovementId: string | null;
  status: 'recorded' | 'reconciled' | 'disputed';
  notes: string;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
}

const tabs = [
  { id: 'contracts', label: 'Договоры', icon: FileText },
  { id: 'schedules', label: 'Тарифы', icon: Percent },
  { id: 'runs', label: 'Расчёты', icon: Calculator },
  { id: 'invoices', label: 'Счета', icon: Receipt },
  { id: 'ar', label: 'AR Платежи', icon: CreditCard },
  { id: 'reports', label: 'Отчёты', icon: BarChart3 },
];

export default function FeesListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'contracts';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);

  const [contracts, setContracts] = useState<FeeContract[]>([]);
  const [schedules, setSchedules] = useState<FeeSchedule[]>([]);
  const [runs, setRuns] = useState<FeeRun[]>([]);
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [payments, setPayments] = useState<ArPayment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          contractsRes,
          schedulesRes,
          runsRes,
          invoicesRes,
          paymentsRes,
          clientsRes,
        ] = await Promise.all([
          fetch('/api/collections/feeContracts'),
          fetch('/api/collections/feeSchedules'),
          fetch('/api/collections/feeRuns'),
          fetch('/api/collections/feeInvoices'),
          fetch('/api/collections/arPayments'),
          fetch('/api/collections/clients'),
        ]);

        const [
          contractsData,
          schedulesData,
          runsData,
          invoicesData,
          paymentsData,
          clientsData,
        ] = await Promise.all([
          contractsRes.json(),
          schedulesRes.json(),
          runsRes.json(),
          invoicesRes.json(),
          paymentsRes.json(),
          clientsRes.json(),
        ]);

        setContracts(contractsData.items || []);
        setSchedules(schedulesData.items || []);
        setRuns(runsData.items || []);
        setInvoices(invoicesData.items || []);
        setPayments(paymentsData.items || []);
        setClients(clientsData.items || []);
      } catch (error) {
        console.error('Failed to fetch fees data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/m/fees/list?tab=${tabId}`, { scroll: false });
  };

  const clientNames = clients.reduce((acc, c) => {
    acc[c.id] = c.name;
    return acc;
  }, {} as Record<string, string>);

  const scheduleNames = schedules.reduce((acc, s) => {
    acc[s.id] = s.name;
    return acc;
  }, {} as Record<string, string>);

  const invoiceNumbers = invoices.reduce((acc, inv) => {
    acc[inv.id] = inv.invoiceNumber;
    return acc;
  }, {} as Record<string, string>);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-1/4" />
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 w-28 bg-stone-200 rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-stone-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/m/fees')}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Данные по комиссиям</h1>
            <p className="text-sm text-stone-500 mt-1">Детальный просмотр информации о комиссиях и счетах</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Actions Bar */}
      <FeActionsBar
        context={activeTab as 'contracts' | 'schedules' | 'runs' | 'invoices' | 'ar'}
        onNewContract={() => console.log('New contract')}
        onNewSchedule={() => console.log('New schedule')}
        onNewRun={() => console.log('New run')}
        onBulkLock={() => console.log('Bulk lock')}
        onBulkSend={() => console.log('Bulk send')}
        onExport={() => console.log('Export')}
        onRecalculate={() => console.log('Recalculate')}
      />

      {/* Content */}
      {activeTab === 'contracts' && (
        <FeContractsTable
          contracts={contracts}
          clientNames={clientNames}
          scheduleNames={scheduleNames}
          onRowClick={(contract) => router.push(`/m/fees/item/${contract.id}?type=contract`)}
          onRunFees={(contract) => console.log('Run fees for:', contract.id)}
        />
      )}

      {activeTab === 'schedules' && (
        <FeSchedulesTable
          schedules={schedules}
          clientNames={clientNames}
          onRowClick={(schedule) => router.push(`/m/fees/item/${schedule.id}?type=schedule`)}
        />
      )}

      {activeTab === 'runs' && (
        <FeFeeRunsTable
          runs={runs}
          onRowClick={(run) => router.push(`/m/fees/item/${run.id}?type=run`)}
          onLock={(run) => console.log('Lock run:', run.id)}
          onGenerateInvoices={(run) => console.log('Generate invoices for:', run.id)}
        />
      )}

      {activeTab === 'invoices' && (
        <FeInvoicesTable
          invoices={invoices}
          clientNames={clientNames}
          onRowClick={(invoice) => router.push(`/m/fees/item/${invoice.id}?type=invoice`)}
          onSend={(invoice) => console.log('Send invoice:', invoice.id)}
          onRecordPayment={(invoice) => console.log('Record payment for:', invoice.id)}
        />
      )}

      {activeTab === 'ar' && (
        <FeArTable
          payments={payments}
          clientNames={clientNames}
          invoiceNumbers={invoiceNumbers}
          onRowClick={(payment) => router.push(`/m/fees/item/${payment.id}?type=payment`)}
          onReconcile={(payment) => console.log('Reconcile payment:', payment.id)}
        />
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
          <BarChart3 className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-stone-800 mb-2">Отчёты по комиссиям</h3>
          <p className="text-stone-500 mb-6">
            Доступные отчёты: AR Aging, Fee Revenue, Collection Rate, Fee by Client
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { name: 'AR Aging', desc: 'Анализ дебиторки по срокам' },
              { name: 'Fee Revenue', desc: 'Доход от комиссий по периодам' },
              { name: 'Collection Rate', desc: 'Процент сбора платежей' },
              { name: 'Fee by Client', desc: 'Комиссии в разрезе клиентов' },
            ].map((report) => (
              <button
                key={report.name}
                className="p-4 bg-stone-50 hover:bg-stone-100 rounded-xl text-left transition-colors"
              >
                <div className="font-medium text-stone-800 mb-1">{report.name}</div>
                <div className="text-xs text-stone-500">{report.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
