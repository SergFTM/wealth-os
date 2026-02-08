"use client";

import { useState } from 'react';
import { PhStatusPill } from './PhStatusPill';
import { PhMoneyPill } from './PhMoneyPill';
import { PhCompliancePanel } from './PhCompliancePanel';
import { GRANT_STAGE_KEYS } from '../config';

interface DDChecklistItem {
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'na';
  ownerRole?: string;
  dueAt?: string;
  notes?: string;
}

interface Grantee {
  name?: string;
  country?: string;
  regNo?: string;
  einTaxId?: string;
  address?: string;
  contacts?: { name: string; role: string; email?: string; phone?: string }[];
}

interface PhilGrant {
  id: string;
  clientId: string;
  entityId: string;
  entityName?: string;
  programId: string;
  programName?: string;
  granteeJson?: Grantee;
  requestedAmount?: number;
  approvedAmount?: number;
  currency?: string;
  stageKey: keyof typeof GRANT_STAGE_KEYS;
  purpose?: string;
  purposeMarkdown?: string;
  timelineJson?: {
    startDate?: string;
    endDate?: string;
    milestones?: { title: string; dueDate: string; completed: boolean }[];
  };
  ddChecklistJson?: DDChecklistItem[];
  complianceStatusKey?: string;
  docsStatusKey?: string;
  threadId?: string;
  attachmentDocIdsJson?: string[];
  approvalsIdsJson?: string[];
  submittedAt?: string;
  approvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ComplianceCheck {
  id: string;
  grantId: string;
  checkTypeKey: 'sanctions' | 'kyc' | 'conflict' | 'board';
  statusKey: 'open' | 'cleared' | 'flagged';
  notes?: string;
}

type Tab = 'proposal' | 'dd' | 'approvals' | 'payouts' | 'reporting' | 'docs' | 'comms' | 'audit';

interface PhGrantDetailProps {
  grant: PhilGrant;
  complianceChecks?: ComplianceCheck[];
  onEdit?: () => void;
  onSubmit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onSchedulePayout?: () => void;
}

export function PhGrantDetail({
  grant,
  complianceChecks = [],
  onEdit,
  onSubmit,
  onApprove,
  onReject,
  onSchedulePayout,
}: PhGrantDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('proposal');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'proposal', label: 'Заявка' },
    { key: 'dd', label: 'Due Diligence' },
    { key: 'approvals', label: 'Согласования' },
    { key: 'payouts', label: 'Выплаты' },
    { key: 'reporting', label: 'Отчетность' },
    { key: 'docs', label: 'Документы' },
    { key: 'comms', label: 'Коммуникации' },
    { key: 'audit', label: 'Audit' },
  ];

  const stageConfig = GRANT_STAGE_KEYS[grant.stageKey];

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <PhStatusPill status={grant.stageKey} type="grant" size="md" />
              {grant.complianceStatusKey && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  grant.complianceStatusKey === 'cleared' ? 'bg-green-100 text-green-700' :
                  grant.complianceStatusKey === 'flagged' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {grant.complianceStatusKey === 'cleared' ? '✓ Комплаенс' :
                   grant.complianceStatusKey === 'flagged' ? '⚠ Комплаенс' : '... Комплаенс'}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              {grant.granteeJson?.name || 'Грант'}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
              {grant.programName && <span>Программа: {grant.programName}</span>}
              {grant.entityName && <span>Структура: {grant.entityName}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {grant.stageKey === 'draft' && onSubmit && (
              <button
                onClick={onSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Подать заявку
              </button>
            )}
            {grant.stageKey === 'in_review' && onApprove && (
              <>
                <button
                  onClick={onApprove}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  Одобрить
                </button>
                <button
                  onClick={onReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Отклонить
                </button>
              </>
            )}
            {grant.stageKey === 'approved' && onSchedulePayout && (
              <button
                onClick={onSchedulePayout}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                Запланировать выплату
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium"
              >
                Редактировать
              </button>
            )}
          </div>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="text-xs text-stone-500 uppercase tracking-wider">Запрошено</div>
            <div className="text-xl font-semibold text-stone-900 mt-1">
              {grant.requestedAmount ? formatCurrency(grant.requestedAmount, grant.currency) : '—'}
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="text-xs text-emerald-600 uppercase tracking-wider">Одобрено</div>
            <div className="text-xl font-semibold text-emerald-700 mt-1">
              {grant.approvedAmount ? formatCurrency(grant.approvedAmount, grant.currency) : '—'}
            </div>
          </div>
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="text-xs text-stone-500 uppercase tracking-wider">Подано</div>
            <div className="text-lg font-medium text-stone-700 mt-1">{formatDate(grant.submittedAt)}</div>
          </div>
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="text-xs text-stone-500 uppercase tracking-wider">Одобрено</div>
            <div className="text-lg font-medium text-stone-700 mt-1">{formatDate(grant.approvedAt)}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'proposal' && (
        <div className="space-y-6">
          {/* Grantee info */}
          {grant.granteeJson && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h2 className="font-semibold text-stone-800 mb-4">Информация о получателе</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-stone-500 uppercase">Организация</div>
                  <div className="font-medium text-stone-900">{grant.granteeJson.name}</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase">Страна</div>
                  <div className="font-medium text-stone-900">{grant.granteeJson.country || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase">Рег. номер</div>
                  <div className="font-medium text-stone-900">{grant.granteeJson.regNo || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase">EIN/Tax ID</div>
                  <div className="font-medium text-stone-900">{grant.granteeJson.einTaxId || '—'}</div>
                </div>
              </div>
              {grant.granteeJson.contacts && grant.granteeJson.contacts.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs text-stone-500 uppercase mb-2">Контакты</div>
                  <div className="space-y-2">
                    {grant.granteeJson.contacts.map((contact, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                        <div>
                          <div className="font-medium text-stone-900">{contact.name}</div>
                          <div className="text-sm text-stone-500">{contact.role}</div>
                        </div>
                        <div className="text-sm text-stone-600">
                          {contact.email && <a href={`mailto:${contact.email}`} className="text-emerald-600 hover:underline">{contact.email}</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Purpose */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <h2 className="font-semibold text-stone-800 mb-4">Цель гранта</h2>
            <div className="prose prose-sm max-w-none text-stone-700">
              {grant.purposeMarkdown || grant.purpose || 'Не указано'}
            </div>
          </div>

          {/* Timeline */}
          {grant.timelineJson && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h2 className="font-semibold text-stone-800 mb-4">Timeline проекта</h2>
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <div className="text-xs text-stone-500">Начало</div>
                  <div className="font-medium">{formatDate(grant.timelineJson.startDate)}</div>
                </div>
                <div className="flex-1 h-px bg-stone-200" />
                <div>
                  <div className="text-xs text-stone-500">Окончание</div>
                  <div className="font-medium">{formatDate(grant.timelineJson.endDate)}</div>
                </div>
              </div>
              {grant.timelineJson.milestones && grant.timelineJson.milestones.length > 0 && (
                <div className="space-y-2">
                  {grant.timelineJson.milestones.map((ms, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        ms.completed ? 'bg-green-100 text-green-600' : 'bg-stone-100 text-stone-400'
                      }`}>
                        {ms.completed ? '✓' : idx + 1}
                      </span>
                      <span className={ms.completed ? 'line-through text-stone-400' : 'text-stone-700'}>
                        {ms.title}
                      </span>
                      <span className="text-xs text-stone-400">{formatDate(ms.dueDate)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'dd' && (
        <div className="space-y-6">
          <PhCompliancePanel
            checks={complianceChecks}
            grantId={grant.id}
            showActions={grant.stageKey === 'in_review' || grant.stageKey === 'submitted'}
          />

          {/* DD Checklist */}
          {grant.ddChecklistJson && grant.ddChecklistJson.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h2 className="font-semibold text-stone-800 mb-4">Чеклист Due Diligence</h2>
              <div className="space-y-2">
                {grant.ddChecklistJson.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        item.status === 'completed' ? 'bg-green-100 text-green-600' :
                        item.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                        item.status === 'na' ? 'bg-stone-100 text-stone-400' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {item.status === 'completed' ? '✓' :
                         item.status === 'in_progress' ? '...' :
                         item.status === 'na' ? 'N/A' : '○'}
                      </span>
                      <span className="text-stone-700">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      {item.ownerRole && <span className="bg-stone-100 px-2 py-0.5 rounded">{item.ownerRole}</span>}
                      {item.dueAt && <span>{formatDate(item.dueAt)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Согласования</h2>
          {grant.approvalsIdsJson && grant.approvalsIdsJson.length > 0 ? (
            <div className="text-stone-600">
              {grant.approvalsIdsJson.length} согласований связано
            </div>
          ) : (
            <div className="text-stone-500 text-center py-4">
              Нет согласований
            </div>
          )}
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Выплаты</h2>
          <div className="text-stone-500 text-center py-4">
            Используйте вкладку Payouts для просмотра выплат
          </div>
        </div>
      )}

      {activeTab === 'reporting' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Impact Reports</h2>
          <div className="text-stone-500 text-center py-4">
            Используйте вкладку Impact для просмотра отчетов
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Документы</h2>
          {grant.attachmentDocIdsJson && grant.attachmentDocIdsJson.length > 0 ? (
            <div className="text-stone-600">
              {grant.attachmentDocIdsJson.length} документов прикреплено
            </div>
          ) : (
            <div className="text-stone-500 text-center py-4">
              Нет документов
            </div>
          )}
        </div>
      )}

      {activeTab === 'comms' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Коммуникации</h2>
          {grant.threadId ? (
            <a
              href={`/m/communications/thread/${grant.threadId}`}
              className="text-emerald-600 hover:underline"
            >
              Открыть тред #{grant.threadId}
            </a>
          ) : (
            <div className="text-stone-500 text-center py-4">
              Нет связанных тредов
            </div>
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Audit Log</h2>
          <div className="text-stone-500 text-center py-4">
            История изменений будет отображена здесь
          </div>
        </div>
      )}
    </div>
  );
}
