"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { IpsKpiStrip } from './IpsKpiStrip';
import { IpsPoliciesTable } from './IpsPoliciesTable';
import { IpsBreachesTable } from './IpsBreachesTable';
import { IpsCommitteePanel } from './IpsCommitteePanel';
import { IpsActionsBar } from './IpsActionsBar';
import { IpsPolicyForm } from './IpsPolicyForm';
import { IpsConstraintForm } from './IpsConstraintForm';
import { IpsBreachForm } from './IpsBreachForm';
import { IpsWaiverForm } from './IpsWaiverForm';
import { IpsMeetingForm } from './IpsMeetingForm';
import { IpsCheckConstraintsButton } from './IpsCheckConstraintsButton';
import { IpsCheckResultsModal } from './IpsCheckResultsModal';
import { HelpPanel } from '@/components/ui/HelpPanel';
import { AlertTriangle, Info, Download } from 'lucide-react';

interface Policy {
  id: string;
  clientId: string;
  name: string;
  scopeType: 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  status: 'draft' | 'active' | 'archived';
  currentVersionId?: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon?: string;
  createdAt: string;
  updatedAt: string;
}

interface Constraint {
  id: string;
  policyId: string;
  type: string;
  status: 'active' | 'suspended';
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
  createdAt: string;
  updatedAt: string;
}

interface Waiver {
  id: string;
  policyId: string;
  status: 'pending' | 'active' | 'expired' | 'revoked';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Meeting {
  id: string;
  clientId: string;
  date: string;
  status: 'draft' | 'held' | 'published';
  agendaItemIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface Decision {
  id: string;
  meetingId: string;
  createdAt: string;
  updatedAt: string;
}

interface CheckResult {
  constraintId: string;
  segment: string;
  limit: number;
  measured: number;
  breached: boolean;
  severity: 'ok' | 'warning' | 'critical';
}

export function IpsDashboardPage() {
  const router = useRouter();

  // Form state
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [showConstraintForm, setShowConstraintForm] = useState(false);
  const [showBreachForm, setShowBreachForm] = useState(false);
  const [showWaiverForm, setShowWaiverForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showCheckResults, setShowCheckResults] = useState(false);
  const [checkResults, setCheckResults] = useState<CheckResult[]>([]);

  const { items: policies, refetch: refetchPolicies } = useCollection<Policy>('ipsPolicies');
  const { items: constraints, refetch: refetchConstraints } = useCollection<Constraint>('ipsConstraints');
  const { items: breaches, refetch: refetchBreaches } = useCollection<Breach>('ipsBreaches');
  const { items: waivers, refetch: refetchWaivers } = useCollection<Waiver>('ipsWaivers');
  const { items: meetings, refetch: refetchMeetings } = useCollection<Meeting>('committeeMeetings');
  const { items: decisions } = useCollection<Decision>('committeeDecisions');

  const kpis = useMemo(() => {
    const activePolicies = policies.filter(p => p.status === 'active').length;
    const draftPolicies = policies.filter(p => p.status === 'draft').length;
    const totalConstraints = constraints.filter(c => c.status === 'active').length;
    const openBreaches = breaches.filter(b => b.status === 'open').length;
    const criticalBreaches = breaches.filter(b => b.severity === 'critical' && b.status !== 'resolved').length;
    const activeWaivers = waivers.filter(w => w.status === 'active').length;
    const pendingWaivers = waivers.filter(w => w.approvalStatus === 'pending').length;

    const now = new Date();
    const fourteenDaysLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const expiringWaivers = waivers.filter(w => {
      if (w.status !== 'active') return false;
      const endDate = new Date(w.endDate);
      return endDate <= fourteenDaysLater && endDate >= now;
    }).length;

    return [
      { id: 'activePolicies', label: 'Активные IPS', value: activePolicies, status: 'ok' as const, linkTo: '/m/ips/list?tab=policies&filter=active' },
      { id: 'draftPolicies', label: 'Черновики IPS', value: draftPolicies, status: draftPolicies > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/ips/list?tab=policies&filter=draft' },
      { id: 'constraints', label: 'Ограничения', value: totalConstraints, status: 'ok' as const, linkTo: '/m/ips/list?tab=constraints' },
      { id: 'openBreaches', label: 'Открытые нарушения', value: openBreaches, status: openBreaches > 0 ? 'critical' as const : 'ok' as const, linkTo: '/m/ips/list?tab=breaches&filter=open' },
      { id: 'criticalBreaches', label: 'Критические', value: criticalBreaches, status: criticalBreaches > 0 ? 'critical' as const : 'ok' as const, linkTo: '/m/ips/list?tab=breaches&filter=critical' },
      { id: 'activeWaivers', label: 'Активные waivers', value: activeWaivers, status: 'ok' as const, linkTo: '/m/ips/list?tab=waivers&filter=active' },
      { id: 'pendingWaivers', label: 'Ожидают одобрения', value: pendingWaivers, status: pendingWaivers > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/ips/list?tab=waivers&filter=pending' },
      { id: 'expiringWaivers', label: 'Истекают < 14д', value: expiringWaivers, status: expiringWaivers > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/ips/list?tab=waivers&filter=expiring' },
    ];
  }, [policies, constraints, breaches, waivers]);

  const recentPolicies = useMemo(() => {
    const policiesWithCounts = policies.map(p => ({
      ...p,
      constraintsCount: constraints.filter(c => c.policyId === p.id).length,
      breachesCount: breaches.filter(b => b.policyId === p.id && b.status !== 'resolved').length,
    }));
    return policiesWithCounts
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [policies, constraints, breaches]);

  const openBreachesList = useMemo(() => {
    return breaches
      .filter(b => b.status !== 'resolved')
      .sort((a, b) => {
        const severityOrder = { critical: 0, warning: 1, ok: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      })
      .slice(0, 10);
  }, [breaches]);

  const meetingsWithCounts = useMemo(() => {
    return meetings.map(m => ({
      ...m,
      agendaCount: m.agendaItemIds?.length || 0,
      decisionsCount: decisions.filter(d => d.meetingId === m.id).length,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [meetings, decisions]);

  // Handlers
  const handleCreatePolicy = async (data: any) => {
    await fetch('/api/collections/ipsPolicies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        clientId: 'client-001',
        status: 'draft',
        objectivesJson: JSON.stringify(data.objectives || {}),
      }),
    });
    setShowPolicyForm(false);
    refetchPolicies();
  };

  const handleCreateConstraint = async (data: any) => {
    await fetch('/api/collections/ipsConstraints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        status: 'active',
        asOf: new Date().toISOString(),
      }),
    });
    setShowConstraintForm(false);
    refetchConstraints();
  };

  const handleCreateBreach = async (data: any) => {
    await fetch('/api/collections/ipsBreaches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        status: 'open',
        detectedAt: new Date().toISOString(),
      }),
    });
    setShowBreachForm(false);
    refetchBreaches();
  };

  const handleCreateWaiver = async (data: any) => {
    await fetch('/api/collections/ipsWaivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        status: 'pending',
        approvalStatus: 'pending',
      }),
    });
    setShowWaiverForm(false);
    refetchWaivers();
  };

  const handleCreateMeeting = async (data: any) => {
    await fetch('/api/collections/committeeMeetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        status: 'draft',
      }),
    });
    setShowMeetingForm(false);
    refetchMeetings();
  };

  const handleCheckComplete = (results: CheckResult[], breachesCreated: number) => {
    setCheckResults(results);
    if (results.some(r => r.breached)) {
      setShowCheckResults(true);
    }
    refetchBreaches();
  };

  const handleCreateBreachFromCheck = async (result: CheckResult) => {
    await fetch('/api/collections/ipsBreaches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        policyId: 'ips-policy-001',
        constraintId: result.constraintId,
        measuredValue: result.measured,
        limitValue: result.limit,
        severity: result.severity,
        status: 'open',
        sourceType: 'auto',
        detectedAt: new Date().toISOString(),
        explanation: `Автоматически обнаружено: ${result.segment} превышает лимит`,
      }),
    });
    refetchBreaches();
  };

  const handleExportCommitteePack = () => {
    const packData = {
      generatedAt: new Date().toISOString(),
      policies: policies.filter(p => p.status === 'active').length,
      openBreaches: breaches.filter(b => b.status !== 'resolved'),
      pendingWaivers: waivers.filter(w => w.approvalStatus === 'pending'),
      recentMeetings: meetings.slice(0, 3),
    };

    const blob = new Blob([JSON.stringify(packData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `committee-pack-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const helpContent = {
    title: 'IPS и ограничения',
    description: 'Управление инвестиционными политиками, ограничениями, нарушениями и решениями комитета.',
    features: [
      'IPS документы с версионированием для Household, Entity, Portfolio',
      'Ограничения по классам активов, географии, секторам, концентрации',
      'Мониторинг нарушений с severity levels (OK/Warning/Critical)',
      'Waivers — исключения с workflow согласования',
      'Протоколы заседаний инвестиционного комитета',
      'Автоматическая проверка ограничений',
      'Интеграция с Risk и Portfolio модулями',
      'RBAC и audit-ready',
    ],
    scenarios: [
      'Создать IPS для нового клиента',
      'Добавить ограничение по ESG',
      'Запросить waiver на нарушение',
      'Провести заседание комитета',
      'Сформировать committee pack',
    ],
    dataSources: ['Ручной ввод', 'Risk модуль', 'Portfolio модуль'],
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Информация об IPS носит справочный характер и требует подтверждения инвестиционным комитетом.
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">IPS и ограничения</h1>
          <p className="text-stone-500 mt-1">Инвестиционные политики, constraints и compliance</p>
        </div>
        <button
          onClick={() => router.push('/m/ips/list')}
          className="px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700"
        >
          Показать все →
        </button>
      </div>

      {/* KPI Strip */}
      <IpsKpiStrip kpis={kpis} />

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <IpsActionsBar
          onCreatePolicy={() => setShowPolicyForm(true)}
          onAddConstraint={() => setShowConstraintForm(true)}
          onCreateWaiver={() => setShowWaiverForm(true)}
          onScheduleMeeting={() => setShowMeetingForm(true)}
          onCheckConstraints={() => {}}
          onExport={handleExportCommitteePack}
        />
        <IpsCheckConstraintsButton onCheckComplete={handleCheckComplete} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Policies & Breaches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Critical Breaches Alert */}
          {openBreachesList.filter(b => b.severity === 'critical').length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  {openBreachesList.filter(b => b.severity === 'critical').length} критических нарушений требуют внимания
                </p>
                <button
                  onClick={() => router.push('/m/ips/list?tab=breaches&filter=critical')}
                  className="text-xs text-red-600 hover:text-red-700 mt-1"
                >
                  Просмотреть →
                </button>
              </div>
            </div>
          )}

          {/* Recent Policies */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 flex justify-between items-center">
              <h3 className="font-semibold text-stone-800">Инвестиционные политики</h3>
              <button
                onClick={() => router.push('/m/ips/list?tab=policies')}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Все →
              </button>
            </div>
            <IpsPoliciesTable
              policies={recentPolicies}
              onOpen={(id) => router.push(`/m/ips/item/${id}?type=policy`)}
            />
          </div>

          {/* Open Breaches */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 flex justify-between items-center">
              <h3 className="font-semibold text-stone-800">Открытые нарушения</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBreachForm(true)}
                  className="text-xs text-amber-600 hover:text-amber-700 px-2 py-1 bg-amber-50 rounded"
                >
                  + Зафиксировать
                </button>
                <button
                  onClick={() => router.push('/m/ips/list?tab=breaches')}
                  className="text-xs text-emerald-600 hover:text-emerald-700"
                >
                  Все →
                </button>
              </div>
            </div>
            <IpsBreachesTable
              breaches={openBreachesList}
              onOpen={(id) => router.push(`/m/ips/item/${id}?type=breach`)}
              onCreateWaiver={() => setShowWaiverForm(true)}
            />
          </div>
        </div>

        {/* Right Column - Committee & Help */}
        <div className="space-y-6">
          {/* Committee Panel */}
          <IpsCommitteePanel
            meetings={meetingsWithCounts}
            onOpenMeeting={(id) => router.push(`/m/ips/item/${id}?type=meeting`)}
            onCreateMeeting={() => setShowMeetingForm(true)}
            onViewAll={() => router.push('/m/ips/list?tab=committee')}
          />

          {/* Export Committee Pack */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="font-semibold text-stone-800 mb-3">Committee Pack</h3>
            <p className="text-sm text-stone-500 mb-3">
              Сформировать пакет документов для заседания комитета
            </p>
            <button
              onClick={handleExportCommitteePack}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Экспорт Committee Pack
            </button>
          </div>

          {/* Help Panel */}
          <HelpPanel {...helpContent} />
        </div>
      </div>

      {/* Forms */}
      <IpsPolicyForm
        isOpen={showPolicyForm}
        onClose={() => setShowPolicyForm(false)}
        onSave={handleCreatePolicy}
      />

      <IpsConstraintForm
        isOpen={showConstraintForm}
        onClose={() => setShowConstraintForm(false)}
        onSave={handleCreateConstraint}
      />

      <IpsBreachForm
        isOpen={showBreachForm}
        onClose={() => setShowBreachForm(false)}
        onSave={handleCreateBreach}
      />

      <IpsWaiverForm
        isOpen={showWaiverForm}
        onClose={() => setShowWaiverForm(false)}
        onSave={handleCreateWaiver}
      />

      <IpsMeetingForm
        isOpen={showMeetingForm}
        onClose={() => setShowMeetingForm(false)}
        onSave={handleCreateMeeting}
      />

      <IpsCheckResultsModal
        isOpen={showCheckResults}
        onClose={() => setShowCheckResults(false)}
        results={checkResults}
        onCreateBreach={handleCreateBreachFromCheck}
      />
    </div>
  );
}
