"use client";

import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { CrDashboardPage } from '@/modules/50-credit/ui';
import type { CreditBank, CreditFacility, CreditLoan, CreditCollateral, CreditCovenant, CreditPayment } from '@/modules/50-credit/engine/types';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'payment' | 'covenant_test' | 'maturity' | 'refinancing';
  linkedId?: string;
  linkedType?: string;
}

export default function CreditDashboardPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: banks = [] } = useCollection('creditBanks') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: facilities = [] } = useCollection('creditFacilities') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: loans = [] } = useCollection('creditLoans') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: collaterals = [] } = useCollection('creditCollateral') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: covenants = [] } = useCollection('creditCovenants') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payments = [] } = useCollection('creditPayments') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: calendarEventsRaw = [] } = useCollection('creditCalendar') as { data: any[] };

  // Cast to typed arrays
  const typedBanks = banks as CreditBank[];
  const typedFacilities = facilities as CreditFacility[];
  const typedLoans = loans as CreditLoan[];
  const typedCollaterals = collaterals as CreditCollateral[];
  const typedCovenants = covenants as CreditCovenant[];
  const typedPayments = payments as CreditPayment[];
  const calendarEvents = calendarEventsRaw as CalendarEvent[];

  // Calculate KPIs
  const activeLoans = typedLoans.filter(l => l.statusKey === 'active');
  const totalDebtOutstanding = activeLoans.reduce((sum, l) => sum + l.outstandingAmount, 0);

  const today = new Date();
  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);
  const in180Days = new Date(today);
  in180Days.setDate(in180Days.getDate() + 180);

  const paymentsDue30d = typedPayments
    .filter(p => {
      if (p.statusKey !== 'scheduled') return false;
      const dueDate = new Date(p.dueAt);
      return dueDate >= today && dueDate <= in30Days;
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const covenantsAtRisk = typedCovenants.filter(c => c.statusKey === 'at_risk').length;
  const breachesOpen = typedCovenants.filter(c => c.statusKey === 'breach').length;

  const ltvAboveTarget = typedCollaterals.filter(c => {
    const targetLtv = c.targetLtvPct || 75;
    return c.currentLtvPct > targetLtv;
  }).length;

  const facilitiesMaturing180d = typedFacilities.filter(f => {
    const maturityDate = new Date(f.maturityAt);
    return f.statusKey === 'active' && maturityDate <= in180Days;
  }).length;

  const yearStart = new Date(today.getFullYear(), 0, 1);
  const interestCostYtd = typedPayments
    .filter(p => {
      if (p.statusKey !== 'paid' || !p.paidAt) return false;
      return new Date(p.paidAt) >= yearStart;
    })
    .reduce((sum, p) => sum + (p.interestPart || 0), 0);

  const missingDocs = typedLoans.filter(l => {
    const docs = l.attachmentDocIdsJson || [];
    return l.statusKey === 'active' && docs.length === 0;
  }).length;

  const kpis = {
    totalDebtOutstanding,
    paymentsDue30d,
    covenantsAtRisk,
    breachesOpen,
    ltvAboveTarget,
    facilitiesMaturing180d,
    interestCostYtd,
    missingDocs,
  };

  // Calculate facility counts per bank
  const facilityCounts: Record<string, number> = {};
  for (const f of typedFacilities) {
    facilityCounts[f.bankId] = (facilityCounts[f.bankId] || 0) + 1;
  }

  // Calculate bank exposures
  const bankExposures: Record<string, number> = {};
  for (const loan of activeLoans) {
    const facility = typedFacilities.find(f => f.id === loan.facilityId);
    if (facility) {
      bankExposures[facility.bankId] = (bankExposures[facility.bankId] || 0) + loan.outstandingAmount;
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Кредиты и банковские отношения</h1>
        <p className="text-sm text-stone-500 mt-1">
          Управление кредитными линиями, займами, ковенантами и платежами
        </p>
      </div>

      <CrDashboardPage
        kpis={kpis}
        banks={typedBanks}
        facilities={typedFacilities}
        loans={typedLoans}
        collaterals={typedCollaterals}
        covenants={typedCovenants}
        payments={typedPayments}
        calendarEvents={calendarEvents}
        facilityCounts={facilityCounts}
        bankExposures={bankExposures}
        currency="USD"
        onCreateBank={() => router.push('/m/credit/bank/new')}
        onCreateFacility={() => router.push('/m/credit/facility/new')}
        onCreateLoan={() => router.push('/m/credit/loan/new')}
        onAddCollateral={() => router.push('/m/credit/collateral/new')}
        onAddCovenant={() => router.push('/m/credit/covenant/new')}
        onSchedulePayment={() => router.push('/m/credit/payment/new')}
        onGenerateDemo={() => console.log('Generate demo data')}
        onOpenBank={(id) => router.push(`/m/credit/bank/${id}`)}
        onOpenFacility={(id) => router.push(`/m/credit/facility/${id}`)}
        onOpenLoan={(id) => router.push(`/m/credit/loan/${id}`)}
        onOpenCollateral={(id) => router.push(`/m/credit/collateral/${id}`)}
        onOpenCovenant={(id) => router.push(`/m/credit/covenant/${id}`)}
        onOpenPayment={(id) => router.push(`/m/credit/payment/${id}`)}
        onRecordPayment={(id) => router.push(`/m/credit/payment/${id}?action=record`)}
        onTestCovenant={(id) => router.push(`/m/credit/covenant/${id}?action=test`)}
        onOpenCalendarEvent={(id) => console.log('Open calendar event:', id)}
      />
    </div>
  );
}
