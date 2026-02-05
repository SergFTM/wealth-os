"use client";

import { useState, useMemo, use, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCollection, useAuditEvents } from '@/lib/hooks';
import { ObCaseDetail } from '@/modules/12-onboarding/ui/ObCaseDetail';
import { ObIntakeFormRenderer } from '@/modules/12-onboarding/ui/ObIntakeFormRenderer';
import { ObScreeningPanel } from '@/modules/12-onboarding/ui/ObScreeningPanel';
import { ObRiskPanel } from '@/modules/12-onboarding/ui/ObRiskPanel';
import { ObTasksQueue } from '@/modules/12-onboarding/ui/ObTasksQueue';
import { ObEvidencePanel } from '@/modules/12-onboarding/ui/ObEvidencePanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
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
  payloadJson?: Record<string, string>;
  sentAt: string | null;
  completedAt: string | null;
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

interface Approval {
  id: string;
  requestType: string;
  recordId: string;
  status: string;
  approvers: string[];
  approvedBy: string[];
  rejectedBy: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

const tabs = [
  { key: 'overview', label: 'Обзор' },
  { key: 'intake', label: 'Intake' },
  { key: 'owners', label: 'Бенефициары' },
  { key: 'docs', label: 'Документы' },
  { key: 'screening', label: 'Скрининг' },
  { key: 'risk', label: 'Риск' },
  { key: 'tasks', label: 'Задачи' },
  { key: 'approvals', label: 'Согласование' },
  { key: 'audit', label: 'Аудит' },
];

const stages = ['intake', 'docs', 'screening', 'risk', 'review'];

export default function OnboardingItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerPct, setNewOwnerPct] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [approvalComment, setApprovalComment] = useState('');

  const { items: cases, update: updateCase } = useCollection<OnboardingCase>('onboardingCases');
  const { items: intakes, update: updateIntake } = useCollection<IntakeForm>('intakeForms');
  const { items: owners, create: createOwner } = useCollection<BeneficialOwner>('beneficialOwners');
  const { items: screenings, create: createScreening, update: updateScreening } = useCollection<ScreeningCheck>('screeningChecks');
  const { items: risks, create: createRisk } = useCollection<RiskScore>('riskScores');
  const { items: tasks, create: createTask, update: updateTask } = useCollection<ComplianceTask>('complianceTasks');
  const { items: approvals, create: createApproval, update: updateApproval } = useCollection<Approval>('approvals');
  const { events: auditEvents } = useAuditEvents(id);

  const caseData = useMemo(() => cases.find(c => c.id === id), [cases, id]);
  const caseIntake = useMemo(() => intakes.find(i => i.caseId === id), [intakes, id]);
  const caseOwners = useMemo(() => owners.filter(o => o.caseId === id), [owners, id]);
  const caseScreenings = useMemo(() => screenings.filter(s => s.caseId === id), [screenings, id]);
  const caseRisk = useMemo(() => risks.find(r => r.caseId === id), [risks, id]);
  const caseTasks = useMemo(() => tasks.filter(t => t.caseId === id), [tasks, id]);
  const caseApprovals = useMemo(() => approvals.filter(a => a.recordId === id), [approvals, id]);

  if (!caseData) {
    return <div className="p-8 text-center text-stone-500">Кейс не найден</div>;
  }

  const handleMoveStage = async () => {
    const currentIdx = stages.indexOf(caseData.stage);
    if (currentIdx < stages.length - 1) {
      await updateCase(id, { stage: stages[currentIdx + 1] } as Partial<OnboardingCase>);
    }
  };

  const handleSaveIntake = async (data: Record<string, string>) => {
    if (caseIntake) {
      const totalFields = 24;
      const filled = Object.values(data).filter(v => v && v.trim()).length;
      const pct = Math.round((filled / totalFields) * 100);
      await updateIntake(caseIntake.id, {
        payloadJson: data,
        completionPct: pct,
      } as Partial<IntakeForm>);
    }
  };

  const handleSendIntake = async () => {
    if (caseIntake) {
      await updateIntake(caseIntake.id, {
        status: 'sent',
        sentAt: new Date().toISOString(),
      } as Partial<IntakeForm>);
    }
  };

  const handleMarkIntakeCompleted = async () => {
    if (caseIntake) {
      await updateIntake(caseIntake.id, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        completionPct: 100,
      } as Partial<IntakeForm>);
      await updateCase(id, { stage: 'docs' } as Partial<OnboardingCase>);
    }
  };

  const handleAddOwner = async () => {
    if (!newOwnerName.trim()) return;
    await createOwner({
      caseId: id,
      entityId: null,
      parentOwnerId: null,
      name: newOwnerName,
      ownerType: 'person',
      ownershipPct: parseInt(newOwnerPct) || 0,
      controlPerson: false,
      docStatus: 'missing',
      notes: null,
    } as Partial<BeneficialOwner>);
    setShowAddOwner(false);
    setNewOwnerName('');
    setNewOwnerPct('');
  };

  const handleMarkClear = async (checkId: string) => {
    await updateScreening(checkId, { status: 'clear' } as Partial<ScreeningCheck>);
  };

  const handleMarkMatch = async (checkId: string) => {
    await updateScreening(checkId, { status: 'match' } as Partial<ScreeningCheck>);
  };

  const handleNeedsInfo = async (checkId: string) => {
    await updateScreening(checkId, { status: 'needs_info' } as Partial<ScreeningCheck>);
  };

  const handleRecalcRisk = async () => {
    const baseScore = 30;
    const drivers: string[] = [];
    let score = baseScore;

    // Simple risk calculation
    const hasMatch = caseScreenings.some(s => s.status === 'match');
    if (hasMatch) {
      score += 30;
      drivers.push('Screening match found');
    }

    const highOwnership = caseOwners.some(o => o.ownershipPct > 25 && o.docStatus === 'missing');
    if (highOwnership) {
      score += 15;
      drivers.push('Missing docs for major owner');
    }

    if (caseData.caseType === 'trust') {
      score += 10;
      drivers.push('Complex structure (Trust)');
    }

    const tier = score < 40 ? 'low' : score < 70 ? 'medium' : 'high';

    if (caseRisk) {
      await createRisk({
        caseId: id,
        score,
        tier,
        drivers,
        lastCalculatedAt: new Date().toISOString(),
        notes: null,
      } as Partial<RiskScore>);
    } else {
      await createRisk({
        caseId: id,
        score,
        tier,
        drivers,
        lastCalculatedAt: new Date().toISOString(),
        notes: null,
      } as Partial<RiskScore>);
    }

    await updateCase(id, { riskTier: tier } as Partial<OnboardingCase>);
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    await createTask({
      caseId: id,
      title: newTaskTitle,
      dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: 'compliance@wealth.os',
      status: 'open',
      slaRisk: false,
      notes: null,
    } as Partial<ComplianceTask>);
    setShowCreateTask(false);
    setNewTaskTitle('');
  };

  const handleCompleteTask = async (taskId: string) => {
    await updateTask(taskId, { status: 'done' } as Partial<ComplianceTask>);
  };

  const handleSubmitApproval = async () => {
    await createApproval({
      requestType: 'onboarding_approval',
      recordId: id,
      status: 'pending',
      approvers: ['compliance@wealth.os', 'admin@wealth.os'],
      approvedBy: [],
      rejectedBy: null,
      comment: null,
    } as Partial<Approval>);
    await updateCase(id, { status: 'ready_for_approval' } as Partial<OnboardingCase>);
  };

  const handleApprove = async (approvalId: string) => {
    const approval = caseApprovals.find(a => a.id === approvalId);
    if (approval) {
      const newApprovedBy = [...(approval.approvedBy || []), 'admin@wealth.os'];
      const allApproved = approval.approvers?.every(a => newApprovedBy.includes(a));

      await updateApproval(approvalId, {
        approvedBy: newApprovedBy,
        status: allApproved ? 'approved' : 'pending',
      } as Partial<Approval>);

      if (allApproved) {
        await updateCase(id, { status: 'approved' } as Partial<OnboardingCase>);
      }
    }
  };

  const handleReject = async (approvalId: string) => {
    await updateApproval(approvalId, {
      status: 'rejected',
      rejectedBy: 'admin@wealth.os',
      comment: approvalComment,
    } as Partial<Approval>);
    await updateCase(id, { status: 'rejected' } as Partial<OnboardingCase>);
    setShowApprovalModal(false);
    setApprovalComment('');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Disclaimer */}
      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
        <p className="text-xs text-amber-700">
          Комплаенс функции информационные, не являются юридической консультацией.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <button onClick={() => router.push('/m/onboarding')} className="hover:text-emerald-600">
          Онбординг
        </button>
        <span>/</span>
        <button onClick={() => router.push('/m/onboarding/list')} className="hover:text-emerald-600">
          Список
        </button>
        <span>/</span>
        <span className="text-stone-800">{caseData.name}</span>
      </div>

      {/* Case Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <ObCaseDetail
          caseData={caseData}
          onMoveStage={handleMoveStage}
          onCreateTask={() => setShowCreateTask(true)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-emerald-600 border-emerald-600'
                : 'text-stone-500 border-transparent hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-stone-800">Обзор кейса</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-stone-500">ID:</span> {caseData.id}</div>
              <div><span className="text-stone-500">Тип:</span> {caseData.caseType}</div>
              <div><span className="text-stone-500">Этап:</span> {caseData.stage}</div>
              <div><span className="text-stone-500">Статус:</span> {caseData.status}</div>
              <div><span className="text-stone-500">Риск:</span> {caseData.riskTier || '—'}</div>
              <div><span className="text-stone-500">Ответственный:</span> {caseData.assignee}</div>
              <div><span className="text-stone-500">Создан:</span> {new Date(caseData.createdAt).toLocaleDateString('ru')}</div>
              <div><span className="text-stone-500">Обновлен:</span> {new Date(caseData.updatedAt).toLocaleDateString('ru')}</div>
            </div>
            {caseData.notes && (
              <div className="p-3 bg-stone-50 rounded-lg text-sm">
                <span className="text-stone-500">Заметки:</span> {caseData.notes}
              </div>
            )}
          </div>
        )}

        {activeTab === 'intake' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-800">Intake анкета</h3>
              <div className="flex gap-2">
                {caseIntake?.status === 'draft' && (
                  <button
                    onClick={handleSendIntake}
                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg"
                  >
                    Отправить клиенту
                  </button>
                )}
                {caseIntake?.status !== 'completed' && (
                  <button
                    onClick={handleMarkIntakeCompleted}
                    className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
                  >
                    Отметить завершённым
                  </button>
                )}
              </div>
            </div>
            {caseIntake ? (
              <ObIntakeFormRenderer
                payload={caseIntake.payloadJson || {}}
                onSave={handleSaveIntake}
                readOnly={caseIntake.status === 'completed'}
              />
            ) : (
              <div className="text-stone-400">Intake анкета не найдена</div>
            )}
          </div>
        )}

        {activeTab === 'owners' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-800">Beneficial Owners</h3>
              <button
                onClick={() => setShowAddOwner(true)}
                className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
              >
                + Добавить
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200/50">
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Имя</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Тип</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Доля %</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Контроль</th>
                  <th className="text-left py-2 px-3 font-medium text-stone-500">Документы</th>
                </tr>
              </thead>
              <tbody>
                {caseOwners.map((owner) => (
                  <tr key={owner.id} className="border-b border-stone-100">
                    <td className="py-2 px-3 font-medium text-stone-800">{owner.name}</td>
                    <td className="py-2 px-3 text-stone-600">{owner.ownerType}</td>
                    <td className="py-2 px-3">{owner.ownershipPct}%</td>
                    <td className="py-2 px-3">{owner.controlPerson && <span className="text-emerald-600">✓</span>}</td>
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
            {caseOwners.length === 0 && (
              <div className="text-center text-stone-400 py-6">Нет бенефициаров</div>
            )}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-stone-800">Документы и Evidence</h3>
            <ObEvidencePanel
              caseType={caseData.caseType}
              onUploadDoc={() => router.push('/m/documents')}
              onCreatePack={() => router.push('/m/documents?action=createPack')}
              onRequestDoc={() => {}}
            />
          </div>
        )}

        {activeTab === 'screening' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-800">Screening</h3>
              <button
                onClick={async () => {
                  await createScreening({
                    caseId: id,
                    subjectName: caseData.name,
                    checkType: 'sanctions',
                    provider: 'WorldCheck',
                    status: 'pending',
                    resultRef: null,
                    notes: null,
                  } as Partial<ScreeningCheck>);
                }}
                className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
              >
                + Добавить проверку
              </button>
            </div>
            <ObScreeningPanel
              checks={caseScreenings}
              onMarkClear={handleMarkClear}
              onMarkMatch={handleMarkMatch}
              onNeedsInfo={handleNeedsInfo}
            />
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-800">Risk Score</h3>
              <button
                onClick={handleRecalcRisk}
                className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
              >
                Пересчитать
              </button>
            </div>
            {caseRisk ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border ${
                    caseRisk.tier === 'low' ? 'bg-emerald-50 border-emerald-200' :
                    caseRisk.tier === 'medium' ? 'bg-amber-50 border-amber-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="text-xs text-stone-500">Score</div>
                    <div className="text-2xl font-bold">{caseRisk.score}</div>
                  </div>
                  <div className={`p-4 rounded-lg border ${
                    caseRisk.tier === 'low' ? 'bg-emerald-50 border-emerald-200' :
                    caseRisk.tier === 'medium' ? 'bg-amber-50 border-amber-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="text-xs text-stone-500">Tier</div>
                    <div className="text-2xl font-bold uppercase">{caseRisk.tier}</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-stone-50 border-stone-200">
                    <div className="text-xs text-stone-500">Рассчитано</div>
                    <div className="text-sm">{new Date(caseRisk.lastCalculatedAt).toLocaleDateString('ru')}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-stone-700 mb-2">Факторы риска:</div>
                  <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                    {caseRisk.drivers.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-stone-400 py-6">Риск не рассчитан</div>
            )}
            <p className="text-xs text-stone-400 italic">
              Риск оценка информационная, требует проверки человеком.
            </p>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-800">Задачи</h3>
              <button
                onClick={() => setShowCreateTask(true)}
                className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
              >
                + Создать задачу
              </button>
            </div>
            <ObTasksQueue
              tasks={caseTasks}
              onComplete={handleCompleteTask}
              onEscalate={(taskId) => console.log('Escalate', taskId)}
            />
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-800">Согласование</h3>
              {caseData.status === 'active' && caseData.stage === 'review' && (
                <button
                  onClick={handleSubmitApproval}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  Отправить на согласование
                </button>
              )}
            </div>
            {caseApprovals.length > 0 ? (
              <div className="space-y-3">
                {caseApprovals.map((approval) => (
                  <div key={approval.id} className="p-4 rounded-lg border border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-stone-800">Финальное согласование</span>
                      <StatusBadge status={approval.status === 'approved' ? 'success' : approval.status === 'rejected' ? 'critical' : 'pending'} label={approval.status} />
                    </div>
                    <div className="text-sm text-stone-500 mb-3">
                      Approvers: {approval.approvers?.join(', ')}
                    </div>
                    {approval.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(approval.id)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setShowApprovalModal(true)}
                          className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {approval.comment && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                        Комментарий: {approval.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-stone-400 py-6">Нет запросов на согласование</div>
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-stone-800">Audit Trail</h3>
            {auditEvents.length > 0 ? (
              <div className="space-y-2">
                {auditEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-stone-50">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      event.action === 'create' ? 'bg-emerald-500' :
                      event.action === 'update' ? 'bg-blue-500' :
                      event.action === 'approve' ? 'bg-emerald-500' :
                      event.action === 'reject' ? 'bg-red-500' :
                      'bg-stone-400'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm text-stone-800">{event.summary}</div>
                      <div className="text-xs text-stone-500">
                        {event.actorName} • {new Date(event.ts).toLocaleString('ru')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-stone-400 py-6">Нет событий аудита</div>
            )}
          </div>
        )}
      </div>

      {/* Add Owner Modal */}
      {showAddOwner && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowAddOwner(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-stone-800">Добавить бенефициара</h2>
                <button onClick={() => setShowAddOwner(false)} className="p-1 hover:bg-stone-100 rounded">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Имя</label>
                  <input
                    type="text"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Доля владения %</label>
                  <input
                    type="number"
                    value={newOwnerPct}
                    onChange={(e) => setNewOwnerPct(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={handleAddOwner} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">
                    Добавить
                  </button>
                  <button onClick={() => setShowAddOwner(false)} className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg">
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Task Modal */}
      {showCreateTask && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowCreateTask(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-stone-800">Создать задачу</h2>
                <button onClick={() => setShowCreateTask(false)} className="p-1 hover:bg-stone-100 rounded">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Название задачи</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Напр. Запросить паспорт"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={handleCreateTask} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">
                    Создать
                  </button>
                  <button onClick={() => setShowCreateTask(false)} className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg">
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reject Modal */}
      {showApprovalModal && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowApprovalModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-lg font-bold text-stone-800 mb-4">Отклонить кейс</h2>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Причина отклонения</label>
                <textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    const approval = caseApprovals.find(a => a.status === 'pending');
                    if (approval) handleReject(approval.id);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Отклонить
                </button>
                <button onClick={() => setShowApprovalModal(false)} className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
