"use client";

import { useEffect, useState } from 'react';
import { FeDashboardPage } from '@/modules/17-fees/ui';

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

interface FeeSchedule {
  id: string;
  name: string;
}

interface Client {
  id: string;
  name: string;
}

export default function FeesDashboardPage() {
  const [contracts, setContracts] = useState<FeeContract[]>([]);
  const [runs, setRuns] = useState<FeeRun[]>([]);
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [schedules, setSchedules] = useState<FeeSchedule[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractsRes, runsRes, invoicesRes, schedulesRes, clientsRes] = await Promise.all([
          fetch('/api/collections/feeContracts'),
          fetch('/api/collections/feeRuns'),
          fetch('/api/collections/feeInvoices'),
          fetch('/api/collections/feeSchedules'),
          fetch('/api/collections/clients'),
        ]);

        const [contractsData, runsData, invoicesData, schedulesData, clientsData] = await Promise.all([
          contractsRes.json(),
          runsRes.json(),
          invoicesRes.json(),
          schedulesRes.json(),
          clientsRes.json(),
        ]);

        setContracts(contractsData.items || []);
        setRuns(runsData.items || []);
        setInvoices(invoicesData.items || []);
        setSchedules(schedulesData.items || []);
        setClients(clientsData.items || []);
      } catch (error) {
        console.error('Failed to fetch fees data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const clientNames = clients.reduce((acc, c) => {
    acc[c.id] = c.name;
    return acc;
  }, {} as Record<string, string>);

  const scheduleNames = schedules.reduce((acc, s) => {
    acc[s.id] = s.name;
    return acc;
  }, {} as Record<string, string>);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-1/4" />
          <div className="h-4 bg-stone-200 rounded w-1/3" />
          <div className="h-16 bg-amber-100 rounded-xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-stone-200 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-64 bg-stone-200 rounded-xl" />
            <div className="h-64 bg-stone-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <FeDashboardPage
        contracts={contracts}
        runs={runs}
        invoices={invoices}
        clientNames={clientNames}
        scheduleNames={scheduleNames}
      />
    </div>
  );
}
