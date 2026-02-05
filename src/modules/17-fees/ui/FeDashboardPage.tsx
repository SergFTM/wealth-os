"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Receipt,
  ArrowRight,
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { FeKpiStrip } from './FeKpiStrip';
import { FeContractsTable } from './FeContractsTable';
import { FeFeeRunsTable } from './FeFeeRunsTable';
import { FeInvoicesTable } from './FeInvoicesTable';
import { FeActionsBar } from './FeActionsBar';

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

interface FeDashboardPageProps {
  contracts: FeeContract[];
  runs: FeeRun[];
  invoices: FeeInvoice[];
  clientNames?: Record<string, string>;
  scheduleNames?: Record<string, string>;
}

export function FeDashboardPage({
  contracts,
  runs,
  invoices,
  clientNames = {},
  scheduleNames = {},
}: FeDashboardPageProps) {
  // Calculate KPIs
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const recentRuns = runs.filter(r => {
    const runDate = new Date(r.createdAt);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return runDate >= threeMonthsAgo;
  }).length;

  const draftInvoices = invoices.filter(i => i.status === 'draft').length;
  const pendingApprovalInvoices = invoices.filter(i => i.status === 'pending_approval').length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;

  const outstandingAR = invoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + (i.netAmount - i.paidAmount), 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const paymentsReceived30d = invoices
    .filter(i => i.paidDate && new Date(i.paidDate) >= thirtyDaysAgo)
    .reduce((sum, i) => sum + i.paidAmount, 0);

  const pendingGLPosting = invoices.filter(i =>
    i.status !== 'draft' && i.status !== 'void'
  ).length; // Simplified - would check glPostingRef in real impl

  const kpiItems = [
    { id: 'contractsActive', label: 'Активные договоры', value: String(activeContracts), color: 'default' as const },
    { id: 'feeRunsQuarter', label: 'Расчётов за квартал', value: String(recentRuns), color: 'default' as const },
    { id: 'invoicesDraft', label: 'Черновики счетов', value: String(draftInvoices), color: draftInvoices > 0 ? 'amber' as const : 'default' as const },
    { id: 'invoicesPendingApproval', label: 'Ожидают одобрения', value: String(pendingApprovalInvoices), color: pendingApprovalInvoices > 0 ? 'amber' as const : 'default' as const },
    { id: 'arOutstanding', label: 'Неоплаченная AR', value: `$${Math.round(outstandingAR / 1000)}K`, color: outstandingAR > 0 ? 'amber' as const : 'default' as const },
    { id: 'invoicesOverdue', label: 'Просроченных счетов', value: String(overdueInvoices), color: overdueInvoices > 0 ? 'red' as const : 'default' as const },
    { id: 'paymentsReceived30d', label: 'Получено 30д', value: `$${Math.round(paymentsReceived30d / 1000)}K`, color: 'emerald' as const },
    { id: 'glPostingPending', label: 'GL не проведено', value: String(pendingGLPosting), color: pendingGLPosting > 0 ? 'amber' as const : 'default' as const },
  ];

  // Get recent/relevant data for tables
  const upcomingContracts = contracts
    .filter(c => c.status === 'active')
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 8);

  const recentFeeRuns = runs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const actionableInvoices = invoices
    .filter(i => i.status === 'pending_approval' || i.status === 'overdue' || i.status === 'sent')
    .sort((a, b) => {
      // Overdue first, then pending approval, then sent
      const priority: Record<string, number> = { overdue: 0, pending_approval: 1, sent: 2 };
      return (priority[a.status] ?? 3) - (priority[b.status] ?? 3);
    })
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Выставление комиссий</h1>
          <p className="text-stone-500 mt-1">Управление договорами, расчётами и счетами</p>
        </div>
        <FeActionsBar
          context="dashboard"
          onNewRun={() => {}}
          onNewContract={() => {}}
        />
      </div>

      {/* KPI Strip */}
      <FeKpiStrip items={kpiItems} />

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Расчёты комиссий являются расчетными и требуют проверки бухгалтерией
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Billing */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-stone-400" />
              <h2 className="font-semibold text-stone-800">Ближайший биллинг</h2>
            </div>
            <Link
              href="/m/fees/list?tab=contracts"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Все договоры <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <FeContractsTable
            contracts={upcomingContracts}
            clientNames={clientNames}
            scheduleNames={scheduleNames}
            compact
          />
        </div>

        {/* Recent Fee Runs */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-stone-400" />
              <h2 className="font-semibold text-stone-800">Последние расчёты</h2>
            </div>
            <Link
              href="/m/fees/list?tab=runs"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Все расчёты <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <FeFeeRunsTable
            runs={recentFeeRuns}
            compact
          />
        </div>
      </div>

      {/* Actionable Invoices */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-stone-400" />
            <h2 className="font-semibold text-stone-800">Требуют внимания</h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
              {actionableInvoices.length}
            </span>
          </div>
          <Link
            href="/m/fees/list?tab=invoices"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Все счета <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <FeInvoicesTable
          invoices={actionableInvoices}
          clientNames={clientNames}
          compact
        />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-sm opacity-90">Выставлено за месяц</div>
          </div>
          <div className="text-3xl font-bold">
            ${Math.round(invoices
              .filter(i => {
                const issued = new Date(i.issueDate);
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return issued >= monthAgo;
              })
              .reduce((sum, i) => sum + i.netAmount, 0) / 1000)}K
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="text-sm opacity-90">Собрано за месяц</div>
          </div>
          <div className="text-3xl font-bold">
            ${Math.round(paymentsReceived30d / 1000)}K
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-sm opacity-90">Просрочено</div>
          </div>
          <div className="text-3xl font-bold">
            ${Math.round(invoices
              .filter(i => i.status === 'overdue')
              .reduce((sum, i) => sum + (i.netAmount - i.paidAmount), 0) / 1000)}K
          </div>
        </div>
      </div>
    </div>
  );
}
