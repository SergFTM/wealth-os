"use client";

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { IpsPoliciesTable } from '@/modules/13-ips/ui/IpsPoliciesTable';
import { IpsConstraintsTable } from '@/modules/13-ips/ui/IpsConstraintsTable';
import { IpsBreachesTable } from '@/modules/13-ips/ui/IpsBreachesTable';
import { IpsWaiversTable } from '@/modules/13-ips/ui/IpsWaiversTable';
import { IpsActionsBar } from '@/modules/13-ips/ui/IpsActionsBar';
import { IpsDecisionDrawer } from '@/modules/13-ips/ui/IpsDecisionDrawer';
import { ArrowLeft, Search, X, Calendar, Users, Filter, Info } from 'lucide-react';

interface Policy {
  id: string;
  clientId: string;
  name: string;
  scopeType: 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  status: 'draft' | 'active' | 'archived';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon?: string;
  createdAt: string;
  updatedAt: string;
}

interface Constraint {
  id: string;
  policyId: string;
  versionId?: string;
  type: 'asset_limit' | 'concentration' | 'geo' | 'sector' | 'liquidity' | 'leverage' | 'esg';
  metric: 'weight' | 'value' | 'exposure';
  dimension?: string;
  segment?: string;
  limitMin?: number;
  limitMax?: number;
  unit: 'percent' | 'usd' | 'ratio';
  status: 'active' | 'suspended';
  currentValue?: number;
  isBreached?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Breach {
  id: string;
  policyId: string;
  constraintId: string;
  detectedAt: string;
  measuredValue: number;
  limitValue: number;
  severity: 'ok' | 'warning' | 'critical';
  status: 'open' | 'in_review' | 'resolved';
  sourceType: 'auto' | 'manual';
  owner?: string;
  constraintType?: string;
  constraintSegment?: string;
  createdAt: string;
  updatedAt: string;
}

interface Waiver {
  id: string;
  policyId: string;
  constraintId?: string;
  breachId?: string;
  reason: string;
  startDate: string;
  endDate: string;
  allowedDeviation?: string;
  status: 'pending' | 'active' | 'expired' | 'revoked';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  constraintType?: string;
  createdAt: string;
  updatedAt: string;
}

interface Meeting {
  id: string;
  clientId: string;
  date: string;
  status: 'draft' | 'held' | 'published';
  agendaItemIds: string[];
  minutesText?: string;
  createdAt: string;
  updatedAt: string;
}

interface Decision {
  id: string;
  meetingId: string;
  title: string;
  decisionType: 'approve_waiver' | 'revise_ips' | 'rebalance' | 'other';
  result: 'approved' | 'rejected' | 'deferred';
  voteYes?: number;
  voteNo?: number;
  voteAbstain?: number;
  createdAt: string;
  updatedAt: string;
}

const TABS = [
  { key: 'policies', label: 'IPS политики' },
  { key: 'constraints', label: 'Ограничения' },
  { key: 'breaches', label: 'Нарушения' },
  { key: 'waivers', label: 'Waivers' },
  { key: 'committee', label: 'Комитет' },
  { key: 'decisions', label: 'Решения' },
];

const POLICY_FILTERS = [
  { value: '', label: 'Все политики' },
  { value: 'draft', label: 'Черновики' },
  { value: 'active', label: 'Активные' },
  { value: 'archived', label: 'Архив' },
];

const CONSTRAINT_TYPES = [
  { value: '', label: 'Все типы' },
  { value: 'asset_limit', label: 'Класс активов' },
  { value: 'concentration', label: 'Концентрация' },
  { value: 'geo', label: 'География' },
  { value: 'sector', label: 'Сектор' },
  { value: 'liquidity', label: 'Ликвидность' },
  { value: 'leverage', label: 'Плечо' },
  { value: 'esg', label: 'ESG' },
];

const BREACH_FILTERS = [
  { value: '', label: 'Все нарушения' },
  { value: 'open', label: 'Открытые' },
  { value: 'critical', label: 'Критические' },
  { value: 'in_review', label: 'На рассмотрении' },
  { value: 'resolved', label: 'Решённые' },
];

const WAIVER_FILTERS = [
  { value: '', label: 'Все waivers' },
  { value: 'pending', label: 'Ожидают одобрения' },
  { value: 'active', label: 'Активные' },
  { value: 'expiring', label: 'Истекают < 14д' },
  { value: 'expired', label: 'Истёкшие' },
];

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const meetingStatusLabels: Record<string, string> = {
  draft: 'Черновик',
  held: 'Проведено',
  published: 'Опубликовано',
};

const meetingStatusColors: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-600',
  held: 'bg-amber-100 text-amber-700',
  published: 'bg-emerald-100 text-emerald-700',
};

export default function IpsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'policies';
  const initialFilter = searchParams.get('filter') || '';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [typeFilter, setTypeFilter] = useState('');
  const [showDecisionDrawer, setShowDecisionDrawer] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const { items: policies, refetch: refetchPolicies } = useCollection<Policy>('ipsPolicies');
  const { items: constraints, refetch: refetchConstraints } = useCollection<Constraint>('ipsConstraints');
  const { items: breaches, refetch: refetchBreaches } = useCollection<Breach>('ipsBreaches');
  const { items: waivers, refetch: refetchWaivers } = useCollection<Waiver>('ipsWaivers');
  const { items: meetings, refetch: refetchMeetings } = useCollection<Meeting>('committeeMeetings');
  const { items: decisions, refetch: refetchDecisions } = useCollection<Decision>('committeeDecisions');

  // Enrich constraints with breach status
  const enrichedConstraints = useMemo(() => {
    return constraints.map(c => ({
      ...c,
      isBreached: breaches.some(b => b.constraintId === c.id && b.status !== 'resolved'),
    }));
  }, [constraints, breaches]);

  // Enrich breaches with constraint info
  const enrichedBreaches = useMemo(() => {
    return breaches.map(b => {
      const constraint = constraints.find(c => c.id === b.constraintId);
      return {
        ...b,
        constraintType: constraint?.type,
        constraintSegment: constraint?.segment,
      };
    });
  }, [breaches, constraints]);

  // Enrich waivers with constraint info
  const enrichedWaivers = useMemo(() => {
    return waivers.map(w => {
      const constraint = constraints.find(c => c.id === w.constraintId);
      return {
        ...w,
        constraintType: constraint?.type,
      };
    });
  }, [waivers, constraints]);

  // Filtered policies
  const filteredPolicies = useMemo(() => {
    let result = policies;
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (statusFilter) {
      result = result.filter(p => p.status === statusFilter);
    }
    return result.map(p => ({
      ...p,
      constraintsCount: constraints.filter(c => c.policyId === p.id).length,
      breachesCount: breaches.filter(b => b.policyId === p.id && b.status !== 'resolved').length,
    }));
  }, [policies, constraints, breaches, searchTerm, statusFilter]);

  // Filtered constraints
  const filteredConstraints = useMemo(() => {
    let result = enrichedConstraints;
    if (typeFilter) {
      result = result.filter(c => c.type === typeFilter);
    }
    return result;
  }, [enrichedConstraints, typeFilter]);

  // Filtered breaches
  const filteredBreaches = useMemo(() => {
    let result = enrichedBreaches;
    if (statusFilter === 'open') result = result.filter(b => b.status === 'open');
    if (statusFilter === 'critical') result = result.filter(b => b.severity === 'critical' && b.status !== 'resolved');
    if (statusFilter === 'in_review') result = result.filter(b => b.status === 'in_review');
    if (statusFilter === 'resolved') result = result.filter(b => b.status === 'resolved');
    return result.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, ok: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [enrichedBreaches, statusFilter]);

  // Filtered waivers
  const filteredWaivers = useMemo(() => {
    let result = enrichedWaivers;
    const now = new Date();
    const fourteenDaysLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    if (statusFilter === 'pending') result = result.filter(w => w.approvalStatus === 'pending');
    if (statusFilter === 'active') result = result.filter(w => w.status === 'active');
    if (statusFilter === 'expiring') {
      result = result.filter(w => {
        if (w.status !== 'active') return false;
        const endDate = new Date(w.endDate);
        return endDate <= fourteenDaysLater && endDate >= now;
      });
    }
    if (statusFilter === 'expired') result = result.filter(w => w.status === 'expired');
    return result;
  }, [enrichedWaivers, statusFilter]);

  // Meetings with decision counts
  const meetingsWithDecisions = useMemo(() => {
    return meetings.map(m => ({
      ...m,
      decisionsCount: decisions.filter(d => d.meetingId === m.id).length,
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [meetings, decisions]);

  // Handlers
  const handleResolveBreak = async (id: string) => {
    await fetch(`/api/collections/ipsBreaches/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'resolved',
        resolvedAt: new Date().toISOString(),
        resolvedBy: 'admin@wealth.os',
      }),
    });
    refetchBreaches();
  };

  const handleApproveWaiver = async (id: string) => {
    await fetch(`/api/collections/ipsWaivers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approvalStatus: 'approved',
        status: 'active',
        approvedAt: new Date().toISOString(),
        approvedBy: 'admin@wealth.os',
      }),
    });
    refetchWaivers();
  };

  const handleRejectWaiver = async (id: string) => {
    await fetch(`/api/collections/ipsWaivers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalStatus: 'rejected' }),
    });
    refetchWaivers();
  };

  const handleRevokeWaiver = async (id: string) => {
    await fetch(`/api/collections/ipsWaivers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'revoked' }),
    });
    refetchWaivers();
  };

  const handleSaveDecision = async (decision: Partial<Decision>) => {
    if (!selectedMeetingId) return;
    await fetch('/api/collections/committeeDecisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...decision,
        meetingId: selectedMeetingId,
      }),
    });
    refetchDecisions();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Информация об IPS носит справочный характер и требует подтверждения инвестиционным комитетом.
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/m/ips')} className="p-2 hover:bg-stone-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-stone-800">IPS — Список</h1>
        </div>
      </div>

      {/* Actions Bar */}
      <IpsActionsBar
        onCreatePolicy={() => {}}
        onAddConstraint={() => {}}
        onCreateWaiver={() => {}}
        onScheduleMeeting={() => {}}
        onCheckConstraints={() => {}}
        onExport={() => {}}
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-1 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); resetFilters(); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters - Policies */}
      {activeTab === 'policies' && (
        <div className="flex flex-wrap gap-3 items-center bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-stone-800 text-sm"
              placeholder="Поиск по названию..."
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-stone-800 text-sm"
          >
            {POLICY_FILTERS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {(searchTerm || statusFilter) && (
            <button onClick={resetFilters} className="inline-flex items-center gap-1 px-3 py-2 text-sm text-stone-500 hover:text-stone-700">
              <X className="w-4 h-4" />
              Сбросить
            </button>
          )}
          <span className="text-sm text-stone-500 ml-auto">
            {filteredPolicies.length} политик
          </span>
        </div>
      )}

      {/* Filters - Constraints */}
      {activeTab === 'constraints' && (
        <div className="flex flex-wrap gap-3 items-center bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-stone-800 text-sm"
          >
            {CONSTRAINT_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {typeFilter && (
            <button onClick={resetFilters} className="inline-flex items-center gap-1 px-3 py-2 text-sm text-stone-500 hover:text-stone-700">
              <X className="w-4 h-4" />
              Сбросить
            </button>
          )}
          <span className="text-sm text-stone-500 ml-auto">
            {filteredConstraints.length} ограничений
          </span>
        </div>
      )}

      {/* Filters - Breaches */}
      {activeTab === 'breaches' && (
        <div className="flex flex-wrap gap-3 items-center bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-stone-800 text-sm"
          >
            {BREACH_FILTERS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {statusFilter && (
            <button onClick={resetFilters} className="inline-flex items-center gap-1 px-3 py-2 text-sm text-stone-500 hover:text-stone-700">
              <X className="w-4 h-4" />
              Сбросить
            </button>
          )}
          <span className="text-sm text-stone-500 ml-auto">
            {filteredBreaches.length} нарушений
          </span>
        </div>
      )}

      {/* Filters - Waivers */}
      {activeTab === 'waivers' && (
        <div className="flex flex-wrap gap-3 items-center bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-stone-800 text-sm"
          >
            {WAIVER_FILTERS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {statusFilter && (
            <button onClick={resetFilters} className="inline-flex items-center gap-1 px-3 py-2 text-sm text-stone-500 hover:text-stone-700">
              <X className="w-4 h-4" />
              Сбросить
            </button>
          )}
          <span className="text-sm text-stone-500 ml-auto">
            {filteredWaivers.length} waivers
          </span>
        </div>
      )}

      {/* Content - Policies */}
      {activeTab === 'policies' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <IpsPoliciesTable
            policies={filteredPolicies}
            onOpen={(id) => router.push(`/m/ips/item/${id}?type=policy`)}
            onEdit={(id) => router.push(`/m/ips/item/${id}?type=policy&edit=true`)}
            onDelete={async (id) => {
              await fetch(`/api/collections/ipsPolicies/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'archived' }),
              });
              refetchPolicies();
            }}
          />
        </div>
      )}

      {/* Content - Constraints */}
      {activeTab === 'constraints' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <IpsConstraintsTable
            constraints={filteredConstraints}
            onOpen={(id) => router.push(`/m/ips/item/${id}?type=constraint`)}
            onEdit={(id) => router.push(`/m/ips/item/${id}?type=constraint&edit=true`)}
            onDelete={async (id) => {
              await fetch(`/api/collections/ipsConstraints/${id}`, {
                method: 'DELETE',
              });
              refetchConstraints();
            }}
          />
        </div>
      )}

      {/* Content - Breaches */}
      {activeTab === 'breaches' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <IpsBreachesTable
            breaches={filteredBreaches}
            onOpen={(id) => router.push(`/m/ips/item/${id}?type=breach`)}
            onResolve={handleResolveBreak}
            onCreateWaiver={(id) => router.push(`/m/ips/list?tab=waivers&action=create&breachId=${id}`)}
          />
        </div>
      )}

      {/* Content - Waivers */}
      {activeTab === 'waivers' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <IpsWaiversTable
            waivers={filteredWaivers}
            onOpen={(id) => router.push(`/m/ips/item/${id}?type=waiver`)}
            onApprove={handleApproveWaiver}
            onReject={handleRejectWaiver}
            onRevoke={handleRevokeWaiver}
          />
        </div>
      )}

      {/* Content - Committee Meetings */}
      {activeTab === 'committee' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          {meetingsWithDecisions.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">Нет заседаний комитета</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200/50">
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Дата</th>
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Статус</th>
                    <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Повестка</th>
                    <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Решения</th>
                    <th className="text-right text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {meetingsWithDecisions.map(meeting => (
                    <tr
                      key={meeting.id}
                      onClick={() => router.push(`/m/ips/item/${meeting.id}?type=meeting`)}
                      className="hover:bg-emerald-50/30 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-stone-800">{formatDate(meeting.date)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${meetingStatusColors[meeting.status]}`}>
                          {meetingStatusLabels[meeting.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-stone-600">
                        {meeting.agendaItemIds?.length || 0} пунктов
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-stone-600">
                        {meeting.decisionsCount} решений
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMeetingId(meeting.id);
                            setShowDecisionDrawer(true);
                          }}
                          className="text-xs text-emerald-600 hover:text-emerald-700 px-2 py-1"
                        >
                          + Решение
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Content - Decisions */}
      {activeTab === 'decisions' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          {decisions.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">Нет решений комитета</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200/50">
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Решение</th>
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Тип</th>
                    <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">За/Против/Возд.</th>
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Результат</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {decisions.map(decision => (
                    <tr key={decision.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-stone-800">{decision.title}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-600">
                        {decision.decisionType === 'approve_waiver' && 'Утверждение waiver'}
                        {decision.decisionType === 'revise_ips' && 'Пересмотр IPS'}
                        {decision.decisionType === 'rebalance' && 'Ребалансировка'}
                        {decision.decisionType === 'other' && 'Прочее'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-mono">
                          <span className="text-emerald-600">{decision.voteYes || 0}</span>
                          {' / '}
                          <span className="text-red-600">{decision.voteNo || 0}</span>
                          {' / '}
                          <span className="text-stone-500">{decision.voteAbstain || 0}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          decision.result === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          decision.result === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {decision.result === 'approved' && 'Одобрено'}
                          {decision.result === 'rejected' && 'Отклонено'}
                          {decision.result === 'deferred' && 'Отложено'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Decision Drawer */}
      <IpsDecisionDrawer
        isOpen={showDecisionDrawer}
        onClose={() => { setShowDecisionDrawer(false); setSelectedMeetingId(null); }}
        onSave={handleSaveDecision}
        isNew
      />
    </div>
  );
}
