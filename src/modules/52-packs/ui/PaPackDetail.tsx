"use client";

import { useState } from 'react';
import { PaStatusPill, PaSensitivityPill, PaClientSafeBadge } from './PaStatusPill';
import { PaPackActionsBar } from './PaActionsBar';
import { PaItemsTable } from './PaItemsTable';

interface Pack {
  id: string;
  name: string;
  recipientJson: { type: string; org: string; contactEmail?: string; contactName?: string };
  purpose: string;
  periodJson: { start: string; end: string; label?: string };
  scopeJson: { scopeType: string; scopeId?: string; scopeName?: string };
  statusKey: string;
  clientSafe: boolean;
  sensitivityKey: 'low' | 'medium' | 'high';
  watermarkKey: 'on' | 'off';
  coverLetterMd?: string;
  itemsCount?: number;
  templateId?: string;
  createdByUserId?: string;
  approvedByUserId?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface PackItem {
  id: string;
  packId: string;
  itemTypeKey: string;
  title: string;
  description?: string;
  include: boolean;
  clientSafe: boolean;
  sensitivityKey: 'low' | 'medium' | 'high';
  orderIndex: number;
  fileSize?: number;
  fileType?: string;
}

interface PaPackDetailProps {
  pack: Pack;
  items: PackItem[];
  approvals?: Array<{ id: string; statusKey: string; requestedByName?: string; decisionByName?: string; createdAt: string }>;
  shares?: Array<{ id: string; statusKey: string; expiresAt: string; downloadCount: number; tokenPreview?: string }>;
  onEdit?: () => void;
  onRequestApproval?: () => void;
  onPublishShare?: () => void;
  onClose?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

const recipientLabels: Record<string, string> = {
  auditor: 'Аудитор',
  bank: 'Банк',
  tax: 'Налоговый консультант',
  legal: 'Юридический советник',
  committee: 'Инвестиционный комитет',
  investor: 'Со-инвестор',
  regulator: 'Регулятор',
  other: 'Другое',
};

const scopeLabels: Record<string, string> = {
  household: 'Household',
  entity: 'Юридическое лицо',
  portfolio: 'Портфель',
  global: 'Глобальный',
};

export function PaPackDetail({
  pack,
  items,
  approvals = [],
  shares = [],
  onEdit,
  onRequestApproval,
  onPublishShare,
  onClose,
  onDelete,
  onBack,
}: PaPackDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'approvals' | 'share' | 'audit'>('overview');

  const tabs = [
    { key: 'overview', label: 'Обзор' },
    { key: 'items', label: `Документы (${items.length})` },
    { key: 'approvals', label: `Согласования (${approvals.length})` },
    { key: 'share', label: `Ссылки (${shares.length})` },
    { key: 'audit', label: 'Аудит' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          {onBack && (
            <button onClick={onBack} className="text-sm text-stone-500 hover:text-stone-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад к списку
            </button>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-800">{pack.name}</h1>
            <PaStatusPill status={pack.statusKey} type="pack" />
            <PaClientSafeBadge isClientSafe={pack.clientSafe} />
          </div>
          <p className="text-stone-500 mt-1">{pack.purpose}</p>
        </div>
        <PaPackActionsBar
          packStatus={pack.statusKey}
          onEdit={onEdit}
          onRequestApproval={onRequestApproval}
          onPublishShare={onPublishShare}
          onClose={onClose}
          onDelete={onDelete}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab pack={pack} itemsCount={items.length} />
      )}

      {activeTab === 'items' && (
        <PaItemsTable items={items} editable={pack.statusKey === 'draft'} />
      )}

      {activeTab === 'approvals' && (
        <ApprovalsTab approvals={approvals} packStatus={pack.statusKey} onRequestApproval={onRequestApproval} />
      )}

      {activeTab === 'share' && (
        <SharesTab shares={shares} packStatus={pack.statusKey} onPublishShare={onPublishShare} />
      )}

      {activeTab === 'audit' && (
        <AuditTab packId={pack.id} />
      )}
    </div>
  );
}

function OverviewTab({ pack, itemsCount }: { pack: Pack; itemsCount: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recipient Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h3 className="font-medium text-stone-800 mb-4">Получатель</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Тип</span>
            <span className="text-stone-800">{recipientLabels[pack.recipientJson.type]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Организация</span>
            <span className="text-stone-800">{pack.recipientJson.org}</span>
          </div>
          {pack.recipientJson.contactName && (
            <div className="flex justify-between">
              <span className="text-stone-500">Контакт</span>
              <span className="text-stone-800">{pack.recipientJson.contactName}</span>
            </div>
          )}
          {pack.recipientJson.contactEmail && (
            <div className="flex justify-between">
              <span className="text-stone-500">Email</span>
              <span className="text-stone-800">{pack.recipientJson.contactEmail}</span>
            </div>
          )}
        </div>
      </div>

      {/* Scope Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h3 className="font-medium text-stone-800 mb-4">Охват и период</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Scope</span>
            <span className="text-stone-800">
              {pack.scopeJson.scopeName || scopeLabels[pack.scopeJson.scopeType]}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Период</span>
            <span className="text-stone-800">
              {pack.periodJson.label || `${formatDate(pack.periodJson.start)} — ${formatDate(pack.periodJson.end)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Документов</span>
            <span className="text-stone-800">{itemsCount}</span>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h3 className="font-medium text-stone-800 mb-4">Безопасность</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-stone-500">Client-safe</span>
            <span className={pack.clientSafe ? 'text-emerald-600' : 'text-stone-600'}>
              {pack.clientSafe ? 'Да' : 'Нет'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500">Чувствительность</span>
            <PaSensitivityPill level={pack.sensitivityKey} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500">Водяной знак</span>
            <span className={pack.watermarkKey === 'on' ? 'text-emerald-600' : 'text-stone-600'}>
              {pack.watermarkKey === 'on' ? 'Включён' : 'Выключен'}
            </span>
          </div>
        </div>
      </div>

      {/* Metadata Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h3 className="font-medium text-stone-800 mb-4">Информация</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Создан</span>
            <span className="text-stone-800">{formatDateTime(pack.createdAt)}</span>
          </div>
          {pack.approvedAt && (
            <div className="flex justify-between">
              <span className="text-stone-500">Одобрен</span>
              <span className="text-stone-800">{formatDateTime(pack.approvedAt)}</span>
            </div>
          )}
          {pack.templateId && (
            <div className="flex justify-between">
              <span className="text-stone-500">Шаблон</span>
              <span className="text-emerald-600 hover:underline cursor-pointer">
                Открыть шаблон
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cover Letter Preview */}
      {pack.coverLetterMd && (
        <div className="md:col-span-2 bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-medium text-stone-800 mb-4">Сопроводительное письмо</h3>
          <div className="prose prose-sm prose-stone max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-stone-600 bg-stone-50 p-4 rounded-lg">
              {pack.coverLetterMd}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function ApprovalsTab({
  approvals,
  packStatus,
  onRequestApproval,
}: {
  approvals: Array<{ id: string; statusKey: string; requestedByName?: string; decisionByName?: string; createdAt: string }>;
  packStatus: string;
  onRequestApproval?: () => void;
}) {
  return (
    <div className="space-y-4">
      {packStatus === 'draft' && onRequestApproval && (
        <button
          onClick={onRequestApproval}
          className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-sm font-medium"
        >
          Запросить согласование
        </button>
      )}

      {approvals.length === 0 ? (
        <div className="text-center py-8 text-stone-500">
          <p>Нет запросов на согласование</p>
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map((approval) => (
            <div key={approval.id} className="bg-white border border-stone-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-stone-600">Запрошено: {approval.requestedByName || 'Неизвестно'}</span>
                  {approval.decisionByName && (
                    <span className="text-sm text-stone-600 ml-4">Решение: {approval.decisionByName}</span>
                  )}
                </div>
                <PaStatusPill status={approval.statusKey} type="approval" />
              </div>
              <div className="text-xs text-stone-400 mt-2">{formatDateTime(approval.createdAt)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SharesTab({
  shares,
  packStatus,
  onPublishShare,
}: {
  shares: Array<{ id: string; statusKey: string; expiresAt: string; downloadCount: number; tokenPreview?: string }>;
  packStatus: string;
  onPublishShare?: () => void;
}) {
  const canPublish = packStatus === 'approved' || packStatus === 'shared';

  return (
    <div className="space-y-4">
      {canPublish && onPublishShare && (
        <button
          onClick={onPublishShare}
          className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-sm font-medium"
        >
          Создать новую ссылку
        </button>
      )}

      {shares.length === 0 ? (
        <div className="text-center py-8 text-stone-500">
          <p>Нет опубликованных ссылок</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shares.map((share) => (
            <div key={share.id} className="bg-white border border-stone-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm text-stone-600">{share.tokenPreview || share.id.slice(0, 8)}...</span>
                  <span className="text-sm text-stone-500 ml-4">Скачиваний: {share.downloadCount}</span>
                </div>
                <PaStatusPill status={share.statusKey} type="share" />
              </div>
              <div className="text-xs text-stone-400 mt-2">
                Истекает: {formatDateTime(share.expiresAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AuditTab({ packId }: { packId: string }) {
  return (
    <div className="text-center py-8 text-stone-500">
      <p>История аудита для пакета {packId}</p>
      <p className="text-sm mt-2">События загружаются из auditEvents</p>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ru-RU');
}
