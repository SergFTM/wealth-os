"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Landmark, ChevronRight } from 'lucide-react';
import { TrKpiStrip } from './TrKpiStrip';
import { TrTrustsTable } from './TrTrustsTable';
import { TrDistributionsTable } from './TrDistributionsTable';
import { TrCalendarPanel } from './TrCalendarPanel';
import { TrActionsBar } from './TrActionsBar';

interface Trust {
  id: string;
  clientId: string;
  name: string;
  jurisdiction: string;
  trustType: 'revocable' | 'irrevocable';
  settlor: string;
  status: 'active' | 'inactive' | 'terminated';
  primaryTrusteeId: string;
  protectorId: string | null;
  fundingDate: string;
  purpose: string;
  governingLaw: string;
  totalAssets: number;
  currency: string;
  notes: string | null;
}

interface Distribution {
  id: string;
  trustId: string;
  beneficiaryId: string;
  date: string;
  amount: number;
  currency: string;
  purpose: string;
  status: 'draft' | 'pending' | 'approved' | 'paid';
  approvalStatus: 'not_submitted' | 'pending_approval' | 'approved' | 'rejected';
  requestedBy: string;
  approvedBy: string | null;
  paidAt: string | null;
  notes: string | null;
}

interface CalendarTrigger {
  id: string;
  trustId: string;
  name: string;
  triggerDate: string;
  triggerType: 'review' | 'expiration' | 'reminder';
  status: 'upcoming' | 'done' | 'overdue';
  reminderDays: number[];
  notes: string | null;
}

interface TrDashboardPageProps {
  trusts: Trust[];
  distributions: Distribution[];
  calendarTriggers: CalendarTrigger[];
  beneficiaryNames?: Record<string, string>;
}

export function TrDashboardPage({
  trusts,
  distributions,
  calendarTriggers,
  beneficiaryNames = {},
}: TrDashboardPageProps) {
  const router = useRouter();
  const [activeTab] = useState<'overview' | 'calendar'>('overview');

  const trustNames = trusts.reduce((acc, t) => {
    acc[t.id] = t.name;
    return acc;
  }, {} as Record<string, string>);

  const activeTrusts = trusts.filter(t => t.status === 'active');
  const pendingDistributions = distributions.filter(
    d => d.approvalStatus === 'pending_approval'
  );
  const upcomingTriggers = calendarTriggers.filter(
    t => t.status === 'upcoming'
  ).slice(0, 5);

  const handleTrustClick = (trust: Trust) => {
    router.push(`/m/trusts/item/${trust.id}`);
  };

  const handleDistributionClick = (dist: Distribution) => {
    router.push(`/m/trusts/item/${dist.id}?type=distribution`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-lime-100 flex items-center justify-center">
              <Landmark className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800">Трасты и наследование</h1>
              <p className="text-stone-600">Управление трастами, бенефициарами и распределениями</p>
            </div>
          </div>
        </div>
        <TrActionsBar
          onCreateTrust={() => console.log('Create trust')}
          onAddBeneficiary={() => console.log('Add beneficiary')}
          onCreateEvent={() => console.log('Create event')}
          onCreateDistribution={() => console.log('Create distribution')}
          onAttachDocuments={() => console.log('Attach documents')}
        />
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>Не является юридической консультацией. Консультируйтесь с квалифицированными специалистами.</span>
      </div>

      {/* KPI Strip */}
      <TrKpiStrip />

      {/* Main Content Grid */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trusts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Trusts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-stone-800">
                  Активные трасты ({activeTrusts.length})
                </h2>
                <button
                  onClick={() => router.push('/m/trusts/list')}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  Все трасты
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <TrTrustsTable
                trusts={activeTrusts.slice(0, 5)}
                onRowClick={handleTrustClick}
              />
            </div>

            {/* Pending Approvals */}
            {pendingDistributions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-stone-800">
                    Ожидают одобрения ({pendingDistributions.length})
                  </h2>
                  <button
                    onClick={() => router.push('/m/trusts/list?tab=distributions')}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Все распределения
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <TrDistributionsTable
                  distributions={pendingDistributions}
                  showTrustColumn
                  trustNames={trustNames}
                  beneficiaryNames={beneficiaryNames}
                  onRowClick={handleDistributionClick}
                />
              </div>
            )}
          </div>

          {/* Right Column - Calendar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-stone-800">Календарь</h2>
              <button
                onClick={() => router.push('/m/trusts/list?tab=calendar')}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                Полный календарь
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <TrCalendarPanel
              triggers={upcomingTriggers}
              trustNames={trustNames}
              showOnlyUpcoming
            />
          </div>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-stone-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-stone-800">{trusts.length}</div>
          <div className="text-sm text-stone-500">Всего трастов</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">{pendingDistributions.length}</div>
          <div className="text-sm text-stone-500">Ожидают одобрения</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {distributions.filter(d => d.status === 'paid').length}
          </div>
          <div className="text-sm text-stone-500">Выплачено</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">{upcomingTriggers.length}</div>
          <div className="text-sm text-stone-500">Событий впереди</div>
        </div>
      </div>
    </div>
  );
}
