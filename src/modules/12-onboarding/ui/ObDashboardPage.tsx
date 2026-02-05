"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { ObKpiStrip } from './ObKpiStrip';
import { ObCasesTable } from './ObCasesTable';
import { ObIntakeWizard } from './ObIntakeWizard';
import { ObScreeningPanel } from './ObScreeningPanel';
import { ObRiskPanel } from './ObRiskPanel';
import { ObTasksQueue } from './ObTasksQueue';
import { ObEvidencePanel } from './ObEvidencePanel';
import { ObActionsBar } from './ObActionsBar';
import { HelpPanel } from '@/components/ui/HelpPanel';
import { X } from 'lucide-react';

interface OnboardingCase {
  id: string;
  clientId: string;
  name: string;
  caseType: string;
  stage: string;
  status: string;
  assignee: string;
  slaDueAt: string | null;
  riskTier: string | null;
  linkedEntityId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface IntakeForm {
  id: string;
  caseId: string;
  formType: string;
  status: string;
  completionPct: number;
  createdAt: string;
  updatedAt: string;
}

interface ScreeningCheck {
  id: string;
  caseId: string;
  subjectName: string;
  checkType: string;
  provider: string;
  status: string;
  resultRef: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RiskScore {
  id: string;
  caseId: string;
  score: number;
  tier: string;
  drivers: string[];
  lastCalculatedAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ComplianceTask {
  id: string;
  caseId: string;
  title: string;
  dueAt: string;
  assignee: string;
  status: string;
  slaRisk: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export function ObDashboardPage() {
  const router = useRouter();
  const [showCreateCase, setShowCreateCase] = useState(false);
  const [newCaseType, setNewCaseType] = useState('household');
  const [newCaseName, setNewCaseName] = useState('');

  const { items: cases, create: createCase, refetch: refetchCases } = useCollection<OnboardingCase>('onboardingCases');
  const { items: intakes, create: createIntake } = useCollection<IntakeForm>('intakeForms');
  const { items: screenings, update: updateScreening } = useCollection<ScreeningCheck>('screeningChecks');
  const { items: risks } = useCollection<RiskScore>('riskScores');
  const { items: tasks, update: updateTask } = useCollection<ComplianceTask>('complianceTasks');

  const kpis = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const activeCases = cases.filter(c => c.status === 'active').length;
    const newIntakes = intakes.filter(i => new Date(i.createdAt) >= thirtyDaysAgo).length;
    const screeningPending = screenings.filter(s => s.status === 'pending').length;
    const highRisk = risks.filter(r => r.tier === 'high').length;
    const slaAtRisk = cases.filter(c => c.status === 'active' && c.slaDueAt && new Date(c.slaDueAt) <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)).length;
    const missingDocs = 0; // placeholder
    const pendingApproval = cases.filter(c => c.status === 'ready_for_approval').length;
    const onHold = cases.filter(c => c.status === 'on_hold' || c.status === 'rejected').length;

    return [
      { id: 'activeCases', label: 'Активные кейсы', value: activeCases, status: 'ok' as const, linkTo: '/m/onboarding/list?tab=cases&status=active' },
      { id: 'newIntakes30d', label: 'Новые intake 30д', value: newIntakes, status: 'ok' as const, linkTo: '/m/onboarding/list?tab=intakes&filter=created_30d' },
      { id: 'screeningPending', label: 'Скрининг ожидает', value: screeningPending, status: screeningPending > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/onboarding/list?tab=screening&status=pending' },
      { id: 'highRisk', label: 'Высокий риск', value: highRisk, status: highRisk > 0 ? 'critical' as const : 'ok' as const, linkTo: '/m/onboarding/list?tab=risk&tier=high' },
      { id: 'slaAtRisk', label: 'SLA под угрозой', value: slaAtRisk, status: slaAtRisk > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/onboarding/list?tab=cases&filter=sla_risk' },
      { id: 'missingDocs', label: 'Нет документов', value: missingDocs, status: 'ok' as const, linkTo: '/m/onboarding/list?tab=evidence&filter=missing_docs' },
      { id: 'pendingApproval', label: 'Ожидают согласования', value: pendingApproval, status: pendingApproval > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/onboarding/list?tab=cases&status=ready_for_approval' },
      { id: 'onHold', label: 'На удержании', value: onHold, status: onHold > 0 ? 'critical' as const : 'ok' as const, linkTo: '/m/onboarding/list?tab=cases&status=on_hold' },
    ];
  }, [cases, intakes, screenings, risks, tasks]);

  const recentCases = useMemo(() => {
    return [...cases]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
  }, [cases]);

  const pendingScreenings = useMemo(() => {
    return screenings.filter(s => s.status === 'pending').slice(0, 8);
  }, [screenings]);

  const openTasks = useMemo(() => {
    return tasks
      .filter(t => t.status !== 'done')
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
      .slice(0, 8);
  }, [tasks]);

  const handleCreateIntake = async (caseType: string) => {
    const name = `${caseType.charAt(0).toUpperCase() + caseType.slice(1)} Intake — ${new Date().toLocaleDateString('ru')}`;
    const newCase = await createCase({
      clientId: 'client-001',
      name,
      caseType,
      stage: 'intake',
      status: 'active',
      assignee: 'compliance@wealth.os',
      slaDueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      riskTier: null,
      linkedEntityId: null,
      notes: null,
    } as Partial<OnboardingCase>);

    if (newCase) {
      await createIntake({
        caseId: newCase.id,
        formType: caseType,
        status: 'draft',
        completionPct: 0,
        payloadJson: {},
        sentAt: null,
        completedAt: null,
      } as Partial<IntakeForm>);
      router.push(`/m/onboarding/item/${newCase.id}`);
    }
  };

  const handleCreateCaseSubmit = async () => {
    if (!newCaseName.trim()) return;
    const newCase = await createCase({
      clientId: 'client-001',
      name: newCaseName,
      caseType: newCaseType,
      stage: 'intake',
      status: 'active',
      assignee: 'compliance@wealth.os',
      slaDueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      riskTier: null,
      linkedEntityId: null,
      notes: null,
    } as Partial<OnboardingCase>);
    if (newCase) {
      setShowCreateCase(false);
      setNewCaseName('');
      router.push(`/m/onboarding/item/${newCase.id}`);
    }
  };

  const handleMarkClear = async (id: string) => {
    await updateScreening(id, { status: 'clear' } as Partial<ScreeningCheck>);
  };

  const handleMarkMatch = async (id: string) => {
    await updateScreening(id, { status: 'match' } as Partial<ScreeningCheck>);
  };

  const handleNeedsInfo = async (id: string) => {
    await updateScreening(id, { status: 'needs_info' } as Partial<ScreeningCheck>);
  };

  const handleCompleteTask = async (id: string) => {
    await updateTask(id, { status: 'done' } as Partial<ComplianceTask>);
  };

  const helpContent = {
    title: 'Онбординг и комплаенс',
    description: 'Intake, KYC/KYB, AML-скрининг, риск-оценка, кейс-менеджмент и финальное согласование.',
    features: [
      'Intake анкеты: Household, Entity, Trust, Advisor',
      'KYC/KYB сбор данных и документов',
      'Screening: санкции, PEP, adverse media',
      'Risk scoring и tiers (low/medium/high)',
      'SLA мониторинг и задачи комплаенса',
      'Evidence packs для аудита',
      'Финальное approval и audit trail',
    ],
    scenarios: [
      'Создать кейс household и отправить intake клиенту',
      'Загрузить документы и привязать к кейсу',
      'Выполнить screening и поставить статус',
      'Рассчитать риск и отправить на approval',
    ],
    dataSources: ['Ручной ввод', 'Клиентский портал', 'Screening провайдеры (MVP)'],
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Disclaimer */}
      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
        <p className="text-xs text-amber-700">
          Комплаенс функции информационные, не являются юридической консультацией.
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Онбординг и комплаенс</h1>
          <p className="text-stone-500 mt-1">KYC/KYB, AML-скрининг, risk scoring, case management</p>
        </div>
        <button
          onClick={() => router.push('/m/onboarding/list')}
          className="px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700"
        >
          Показать все →
        </button>
      </div>

      {/* KPI Strip */}
      <ObKpiStrip kpis={kpis} />

      {/* Actions Bar */}
      <ObActionsBar
        onCreateCase={() => setShowCreateCase(true)}
        onCreateIntake={() => handleCreateIntake('household')}
        onCreateScreening={() => router.push('/m/onboarding/list?tab=screening')}
        onCalcRisk={() => router.push('/m/onboarding/list?tab=risk')}
        onSubmitApproval={() => router.push('/m/onboarding/list?tab=cases&status=ready_for_approval')}
        onCreateEvidence={() => router.push('/m/onboarding/list?tab=evidence')}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Intake Wizard */}
          <ObIntakeWizard onCreateIntake={handleCreateIntake} />

          {/* Recent Cases */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 flex justify-between items-center">
              <h3 className="font-semibold text-stone-800">Последние кейсы</h3>
              <button
                onClick={() => router.push('/m/onboarding/list?tab=cases')}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Все →
              </button>
            </div>
            <ObCasesTable
              cases={recentCases}
              onOpen={(id) => router.push(`/m/onboarding/item/${id}`)}
              compact
            />
          </div>

          {/* Screening Queue */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-purple-50/50 to-amber-50/30 flex justify-between items-center">
              <h3 className="font-semibold text-stone-800">Скрининг очередь</h3>
              <button
                onClick={() => router.push('/m/onboarding/list?tab=screening')}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Все →
              </button>
            </div>
            <ObScreeningPanel
              checks={pendingScreenings}
              onMarkClear={handleMarkClear}
              onMarkMatch={handleMarkMatch}
              onNeedsInfo={handleNeedsInfo}
              compact
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Risk Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="font-semibold text-stone-800 mb-3">Risk Overview</h3>
            <ObRiskPanel scores={risks} compact />
          </div>

          {/* Tasks Queue */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-amber-50/50 to-emerald-50/30 flex justify-between items-center">
              <h3 className="font-semibold text-stone-800">Задачи комплаенса</h3>
              <button
                onClick={() => router.push('/m/onboarding/list?tab=tasks')}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Все →
              </button>
            </div>
            <ObTasksQueue
              tasks={openTasks}
              onComplete={handleCompleteTask}
              compact
            />
          </div>

          {/* Evidence */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="font-semibold text-stone-800 mb-3">Документы и Evidence</h3>
            <ObEvidencePanel
              compact
              onCreatePack={() => router.push('/m/onboarding/list?tab=evidence')}
              onRequestDoc={() => {}}
            />
          </div>

          {/* Help Panel */}
          <HelpPanel {...helpContent} />
        </div>
      </div>

      {/* Create Case Drawer */}
      {showCreateCase && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowCreateCase(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-stone-800">Создать кейс</h2>
                <button
                  onClick={() => setShowCreateCase(false)}
                  className="p-1 hover:bg-stone-100 rounded"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Название кейса</label>
                  <input
                    type="text"
                    value={newCaseName}
                    onChange={(e) => setNewCaseName(e.target.value)}
                    placeholder="Напр. Onboarding Smith Family"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Тип</label>
                  <select
                    value={newCaseType}
                    onChange={(e) => setNewCaseType(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="household">Household</option>
                    <option value="entity">Entity</option>
                    <option value="trust">Trust</option>
                    <option value="advisor">Advisor</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCreateCaseSubmit}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                  >
                    Создать
                  </button>
                  <button
                    onClick={() => setShowCreateCase(false)}
                    className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
