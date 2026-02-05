"use client";

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { ObCasesTable } from '@/modules/12-onboarding/ui/ObCasesTable';
import { ObScreeningPanel } from '@/modules/12-onboarding/ui/ObScreeningPanel';
import { ObRiskPanel } from '@/modules/12-onboarding/ui/ObRiskPanel';
import { ObTasksQueue } from '@/modules/12-onboarding/ui/ObTasksQueue';
import { ObEvidencePanel } from '@/modules/12-onboarding/ui/ObEvidencePanel';
import { ObActionsBar } from '@/modules/12-onboarding/ui/ObActionsBar';
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

interface BeneficialOwner {
  id: string;
  caseId: string;
  entityId: string | null;
  parentOwnerId: string | null;
  name: string;
  ownerType: string;
  ownershipPct: number;
  controlPerson: boolean;
  docStatus: string;
  notes: string | null;
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

interface EvidencePack {
  id: string;
  clientId: string;
  name: string;
  scopeType: string;
  scopeId: string | null;
  status: string;
  documentIds: string[];
  createdAt: string;
  updatedAt: string;
}

const tabs = [
  { key: 'cases', label: 'Кейсы' },
  { key: 'intakes', label: 'Анкеты' },
  { key: 'owners', label: 'Бенефициары' },
  { key: 'screening', label: 'Скрининг' },
  { key: 'risk', label: 'Риск' },
  { key: 'tasks', label: 'Задачи' },
  { key: 'evidence', label: 'Evidence Packs' },
];

export default function OnboardingListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'cases';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || '');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [showCreateCase, setShowCreateCase] = useState(false);
  const [newCaseType, setNewCaseType] = useState('household');
  const [newCaseName, setNewCaseName] = useState('');

  const { items: cases, create: createCase, refetch: refetchCases } = useCollection<OnboardingCase>('onboardingCases');
  const { items: intakes, create: createIntake, update: updateIntake } = useCollection<IntakeForm>('intakeForms');
  const { items: owners } = useCollection<BeneficialOwner>('beneficialOwners');
  const { items: screenings, update: updateScreening } = useCollection<ScreeningCheck>('screeningChecks');
  const { items: risks, refetch: refetchRisks } = useCollection<RiskScore>('riskScores');
  const { items: tasks, update: updateTask } = useCollection<ComplianceTask>('complianceTasks');
  const { items: packs } = useCollection<EvidencePack>('evidencePacks');

  const filteredCases = useMemo(() => {
    let result = [...cases];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }
    if (statusFilter) {
      result = result.filter(c => c.status === statusFilter);
    }
    if (typeFilter) {
      result = result.filter(c => c.caseType === typeFilter);
    }
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [cases, searchQuery, statusFilter, typeFilter]);

  const filteredIntakes = useMemo(() => {
    let result = [...intakes];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => i.caseId.toLowerCase().includes(q));
    }
    if (statusFilter) {
      result = result.filter(i => i.status === statusFilter);
    }
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [intakes, searchQuery, statusFilter]);

  const filteredOwners = useMemo(() => {
    let result = [...owners];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => o.name.toLowerCase().includes(q) || o.caseId.toLowerCase().includes(q));
    }
    return result;
  }, [owners, searchQuery]);

  const filteredScreenings = useMemo(() => {
    let result = [...screenings];
    if (statusFilter) {
      result = result.filter(s => s.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.subjectName.toLowerCase().includes(q));
    }
    return result;
  }, [screenings, statusFilter, searchQuery]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (statusFilter) {
      result = result.filter(t => t.status === statusFilter);
    }
    return result.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  }, [tasks, statusFilter]);

  const handleCreateCase = async () => {
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
      await createIntake({
        caseId: newCase.id,
        formType: newCaseType,
        status: 'draft',
        completionPct: 0,
      } as Partial<IntakeForm>);
      setShowCreateCase(false);
      setNewCaseName('');
      router.push(`/m/onboarding/item/${newCase.id}`);
    }
  };

  const handleMarkClear = useCallback(async (id: string) => {
    await updateScreening(id, { status: 'clear' } as Partial<ScreeningCheck>);
  }, [updateScreening]);

  const handleMarkMatch = useCallback(async (id: string) => {
    await updateScreening(id, { status: 'match' } as Partial<ScreeningCheck>);
  }, [updateScreening]);

  const handleNeedsInfo = useCallback(async (id: string) => {
    await updateScreening(id, { status: 'needs_info' } as Partial<ScreeningCheck>);
  }, [updateScreening]);

  const handleCompleteTask = useCallback(async (id: string) => {
    await updateTask(id, { status: 'done' } as Partial<ComplianceTask>);
  }, [updateTask]);

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
          <h1 className="text-2xl font-bold text-stone-800">Онбординг — Список</h1>
          <p className="text-stone-500 mt-1">Кейсы, анкеты, скрининг, риск, задачи</p>
        </div>
        <button
          onClick={() => router.push('/m/onboarding')}
          className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800"
        >
          ← Dashboard
        </button>
      </div>

      {/* Actions Bar */}
      <ObActionsBar
        onCreateCase={() => setShowCreateCase(true)}
        onCreateIntake={() => setShowCreateCase(true)}
        onCreateScreening={() => setActiveTab('screening')}
        onCalcRisk={() => setActiveTab('risk')}
        onSubmitApproval={() => {}}
        onCreateEvidence={() => setActiveTab('evidence')}
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'text-emerald-600 border-emerald-600'
                : 'text-stone-500 border-transparent hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border border-stone-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Все статусы</option>
          <option value="active">Active</option>
          <option value="on_hold">On Hold</option>
          <option value="ready_for_approval">Ready for Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
          <option value="clear">Clear</option>
          <option value="match">Match</option>
          <option value="open">Open</option>
          <option value="done">Done</option>
        </select>
        {activeTab === 'cases' && (
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Все типы</option>
            <option value="household">Household</option>
            <option value="entity">Entity</option>
            <option value="trust">Trust</option>
            <option value="advisor">Advisor</option>
          </select>
        )}
        {(searchQuery || statusFilter || typeFilter) && (
          <button
            onClick={() => { setSearchQuery(''); setStatusFilter(''); setTypeFilter(''); }}
            className="px-3 py-2 text-xs text-stone-500 hover:text-stone-700"
          >
            Сбросить
          </button>
        )}
      </div>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        {activeTab === 'cases' && (
          <ObCasesTable
            cases={filteredCases}
            onOpen={(id) => router.push(`/m/onboarding/item/${id}`)}
          />
        )}

        {activeTab === 'intakes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200/50">
                  <th className="text-left py-2 px-3 font-medium text-stone-500">ID</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Кейс</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Тип</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Прогресс</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Статус</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Обновлен</th>
                </tr>
              </thead>
              <tbody>
                {filteredIntakes.map((intake) => (
                  <tr
                    key={intake.id}
                    onClick={() => {
                      const c = cases.find(x => x.id === intake.caseId);
                      if (c) router.push(`/m/onboarding/item/${c.id}?tab=intake`);
                    }}
                    className="border-b border-stone-100 hover:bg-emerald-50/30 cursor-pointer"
                  >
                    <td className="py-2 px-3 text-stone-500 text-xs">{intake.id}</td>
                    <td className="py-2 px-3 font-medium text-stone-800">{intake.caseId}</td>
                    <td className="py-2 px-3 text-stone-600">{intake.formType}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-stone-200 rounded-full">
                          <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${intake.completionPct}%` }} />
                        </div>
                        <span className="text-xs text-stone-500">{intake.completionPct}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                        intake.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        intake.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {intake.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-stone-400 text-xs">{new Date(intake.updatedAt).toLocaleDateString('ru')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredIntakes.length === 0 && (
              <div className="p-6 text-center text-stone-400 text-sm">Нет анкет</div>
            )}
          </div>
        )}

        {activeTab === 'owners' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200/50">
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Кейс</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Имя</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Тип</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Доля %</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Контроль</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Документы</th>
                </tr>
              </thead>
              <tbody>
                {filteredOwners.map((owner) => (
                  <tr key={owner.id} className="border-b border-stone-100 hover:bg-stone-50/50">
                    <td className="py-2 px-3 text-stone-500 text-xs">{owner.caseId}</td>
                    <td className="py-2 px-3 font-medium text-stone-800">{owner.name}</td>
                    <td className="py-2 px-3 text-stone-600">{owner.ownerType}</td>
                    <td className="py-2 px-3">{owner.ownershipPct}%</td>
                    <td className="py-2 px-3">
                      {owner.controlPerson && <span className="text-emerald-600">✓</span>}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                        owner.docStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                        owner.docStatus === 'uploaded' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {owner.docStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOwners.length === 0 && (
              <div className="p-6 text-center text-stone-400 text-sm">Нет бенефициаров</div>
            )}
          </div>
        )}

        {activeTab === 'screening' && (
          <ObScreeningPanel
            checks={filteredScreenings}
            onMarkClear={handleMarkClear}
            onMarkMatch={handleMarkMatch}
            onNeedsInfo={handleNeedsInfo}
          />
        )}

        {activeTab === 'risk' && (
          <div className="p-4">
            <ObRiskPanel
              scores={risks}
              onRecalc={(caseId) => console.log('Recalc', caseId)}
            />
          </div>
        )}

        {activeTab === 'tasks' && (
          <ObTasksQueue
            tasks={filteredTasks}
            onComplete={handleCompleteTask}
            onEscalate={(id) => console.log('Escalate', id)}
          />
        )}

        {activeTab === 'evidence' && (
          <div className="p-4">
            <div className="space-y-3">
              {packs.map((pack) => (
                <div key={pack.id} className="p-3 rounded-lg border border-stone-200 hover:bg-stone-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-stone-800">{pack.name}</div>
                      <div className="text-xs text-stone-500">
                        {pack.documentIds?.length || 0} документов | {pack.scopeType} | {pack.scopeId}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                      pack.status === 'locked' ? 'bg-emerald-100 text-emerald-700' :
                      pack.status === 'shared' ? 'bg-blue-100 text-blue-700' :
                      'bg-stone-100 text-stone-600'
                    }`}>
                      {pack.status}
                    </span>
                  </div>
                </div>
              ))}
              {packs.length === 0 && (
                <div className="text-center text-stone-400 text-sm py-6">Нет evidence packs</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Case Drawer */}
      {showCreateCase && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowCreateCase(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-stone-800">Создать кейс</h2>
                <button onClick={() => setShowCreateCase(false)} className="p-1 hover:bg-stone-100 rounded">
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
                    onClick={handleCreateCase}
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
