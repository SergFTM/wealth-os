"use client";

import { useState } from 'react';
import { CrKpiStrip } from './CrKpiStrip';
import { CrActionsBar } from './CrActionsBar';
import { CrBanksTable } from './CrBanksTable';
import { CrFacilitiesTable } from './CrFacilitiesTable';
import { CrLoansTable } from './CrLoansTable';
import { CrCollateralTable } from './CrCollateralTable';
import { CrCovenantsTable } from './CrCovenantsTable';
import { CrPaymentsTable } from './CrPaymentsTable';
import { CrCalendarPanel } from './CrCalendarPanel';
import { CrAnalyticsPanel } from './CrAnalyticsPanel';
import { CrAiPanel } from './CrAiPanel';
import { CreditBank, CreditFacility, CreditLoan, CreditCollateral, CreditCovenant, CreditPayment } from '../engine/types';

interface KpiData {
  totalDebtOutstanding: number;
  paymentsDue30d: number;
  covenantsAtRisk: number;
  breachesOpen: number;
  ltvAboveTarget: number;
  facilitiesMaturing180d: number;
  interestCostYtd: number;
  missingDocs: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'payment' | 'covenant_test' | 'maturity' | 'refinancing';
  linkedId?: string;
  linkedType?: string;
}

type TabKey = 'banks' | 'facilities' | 'loans' | 'collateral' | 'covenants' | 'payments' | 'calendar' | 'analytics' | 'audit';

interface CrDashboardPageProps {
  kpis: KpiData;
  banks: CreditBank[];
  facilities: CreditFacility[];
  loans: CreditLoan[];
  collaterals: CreditCollateral[];
  covenants: CreditCovenant[];
  payments: CreditPayment[];
  calendarEvents: CalendarEvent[];
  facilityCounts?: Record<string, number>;
  bankExposures?: Record<string, number>;
  currency?: string;
  onCreateBank?: () => void;
  onCreateFacility?: () => void;
  onCreateLoan?: () => void;
  onAddCollateral?: () => void;
  onAddCovenant?: () => void;
  onSchedulePayment?: () => void;
  onGenerateDemo?: () => void;
  onOpenBank?: (id: string) => void;
  onOpenFacility?: (id: string) => void;
  onOpenLoan?: (id: string) => void;
  onOpenCollateral?: (id: string) => void;
  onOpenCovenant?: (id: string) => void;
  onOpenPayment?: (id: string) => void;
  onRecordPayment?: (id: string) => void;
  onTestCovenant?: (id: string) => void;
  onOpenCalendarEvent?: (id: string) => void;
}

export function CrDashboardPage({
  kpis,
  banks,
  facilities,
  loans,
  collaterals,
  covenants,
  payments,
  calendarEvents,
  facilityCounts = {},
  bankExposures = {},
  currency = 'USD',
  onCreateBank,
  onCreateFacility,
  onCreateLoan,
  onAddCollateral,
  onAddCovenant,
  onSchedulePayment,
  onGenerateDemo,
  onOpenBank,
  onOpenFacility,
  onOpenLoan,
  onOpenCollateral,
  onOpenCovenant,
  onOpenPayment,
  onRecordPayment,
  onTestCovenant,
  onOpenCalendarEvent,
}: CrDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('loans');

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'banks', label: 'Банки', count: banks.length },
    { key: 'facilities', label: 'Facilities', count: facilities.filter(f => f.statusKey === 'active').length },
    { key: 'loans', label: 'Займы', count: loans.filter(l => l.statusKey === 'active').length },
    { key: 'collateral', label: 'Залоги', count: collaterals.length },
    { key: 'covenants', label: 'Ковенанты', count: covenants.filter(c => c.statusKey !== 'ok').length || undefined },
    { key: 'payments', label: 'Платежи', count: payments.filter(p => p.statusKey === 'scheduled').length },
    { key: 'calendar', label: 'Календарь' },
    { key: 'analytics', label: 'Аналитика' },
    { key: 'audit', label: 'Аудит' },
  ];

  // Transform KPI data
  const kpiItems = [
    { id: 'totalDebt', label: 'Общий долг', value: formatCurrency(kpis.totalDebtOutstanding), status: 'ok' as const, linkTo: '/m/credit/list?tab=loans' },
    { id: 'payments30d', label: 'Платежи 30д', value: formatCurrency(kpis.paymentsDue30d), status: kpis.paymentsDue30d > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/credit/list?tab=payments' },
    { id: 'covenantsRisk', label: 'Ковенанты at risk', value: kpis.covenantsAtRisk, status: kpis.covenantsAtRisk > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/credit/list?tab=covenants&filter=at_risk' },
    { id: 'breaches', label: 'Нарушения', value: kpis.breachesOpen, status: kpis.breachesOpen > 0 ? 'critical' as const : 'ok' as const, linkTo: '/m/credit/list?tab=covenants&filter=breach' },
    { id: 'ltvHigh', label: 'LTV выше целевого', value: kpis.ltvAboveTarget, status: kpis.ltvAboveTarget > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/credit/list?tab=collateral&filter=ltv_high' },
    { id: 'maturing', label: 'Погашения 180д', value: kpis.facilitiesMaturing180d, status: kpis.facilitiesMaturing180d > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/credit/list?tab=facilities&filter=maturing' },
    { id: 'interestYtd', label: 'Проценты YTD', value: formatCurrency(kpis.interestCostYtd), status: 'info' as const, linkTo: '/m/credit/list?tab=analytics' },
    { id: 'missingDocs', label: 'Нет документов', value: kpis.missingDocs, status: kpis.missingDocs > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/credit/list?tab=loans&filter=missing_docs' },
  ];

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
        <span className="font-medium">Дисклеймер:</span> Не является финансовой рекомендацией.
        Условия кредитов требуют подтверждения банком и юристами.
      </div>

      {/* KPI Strip */}
      <CrKpiStrip kpis={kpiItems} />

      {/* Actions Bar */}
      <CrActionsBar
        onCreateBank={onCreateBank}
        onCreateFacility={onCreateFacility}
        onCreateLoan={onCreateLoan}
        onAddCollateral={onAddCollateral}
        onAddCovenant={onAddCovenant}
        onSchedulePayment={onSchedulePayment}
        onGenerateDemo={onGenerateDemo}
      />

      {/* Breach Alert */}
      {kpis.breachesOpen > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-red-800">
                {kpis.breachesOpen} ковенант{kpis.breachesOpen > 1 ? 'ов' : ''} нарушен{kpis.breachesOpen > 1 ? 'о' : ''}
              </div>
              <p className="text-sm text-red-700 mt-1">
                Требуется немедленное внимание. Уведомите банк и подготовьте запрос на waiver.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('covenants')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Показать
            </button>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tables and Tabs */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="border-b border-stone-200">
            <div className="flex gap-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-stone-500 hover:text-stone-700'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                        tab.key === 'covenants' && tab.count > 0
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            {activeTab === 'banks' && (
              <CrBanksTable
                banks={banks}
                facilityCounts={facilityCounts}
                exposures={bankExposures}
                onOpen={onOpenBank}
              />
            )}

            {activeTab === 'facilities' && (
              <CrFacilitiesTable
                facilities={facilities}
                banks={banks}
                onOpen={onOpenFacility}
              />
            )}

            {activeTab === 'loans' && (
              <CrLoansTable
                loans={loans}
                facilities={facilities}
                onOpen={onOpenLoan}
              />
            )}

            {activeTab === 'collateral' && (
              <CrCollateralTable
                collaterals={collaterals}
                loans={loans}
                facilities={facilities}
                onOpen={onOpenCollateral}
              />
            )}

            {activeTab === 'covenants' && (
              <CrCovenantsTable
                covenants={covenants}
                loans={loans}
                facilities={facilities}
                onOpen={onOpenCovenant}
                onTest={onTestCovenant}
              />
            )}

            {activeTab === 'payments' && (
              <CrPaymentsTable
                payments={payments}
                loans={loans}
                onOpen={onOpenPayment}
                onRecordPayment={onRecordPayment}
              />
            )}

            {activeTab === 'calendar' && (
              <div className="p-4">
                <CrCalendarPanel
                  events={calendarEvents}
                  onOpenEvent={onOpenCalendarEvent}
                />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="p-4">
                <CrAnalyticsPanel
                  loans={loans}
                  payments={payments}
                  collaterals={collaterals}
                  currency={currency}
                />
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="p-8 text-center text-stone-400">
                Audit trail будет отображён здесь
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Panel */}
        <div className="space-y-4">
          <CrAiPanel
            loans={loans}
            facilities={facilities}
            covenants={covenants}
            payments={payments}
            currency={currency}
          />
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-xs text-stone-400 py-4">
        Не является финансовой рекомендацией. Условия кредитов требуют подтверждения банком и юристами.
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}
