"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GvStatusPill } from './GvStatusPill';
import { cn } from '@/lib/utils';

interface Policy {
  id: string;
  name: string;
  categoryKey: string;
  version: string;
  bodyMdRu?: string;
  bodyMdEn?: string;
  bodyMdUk?: string;
  status: 'draft' | 'active' | 'archived' | 'superseded';
  effectiveDate?: string;
  expiresAt?: string;
  linkedTrustId?: string;
  linkedIpsId?: string;
  clientSafePublished: boolean;
  acknowledgementRequired: boolean;
  acknowledgedByJson?: Array<{ userId: string; name: string; acknowledgedAt: string }>;
  createdAt?: string;
  updatedAt?: string;
}

interface GvPolicyDetailProps {
  policy: Policy;
  locale?: 'ru' | 'en' | 'uk';
  currentUserId?: string;
  onEdit?: () => void;
  onActivate?: () => void;
  onArchive?: () => void;
  onAcknowledge?: () => void;
  onOpenAudit?: () => void;
}

const categoryLabels: Record<string, string> = {
  family_charter: 'Семейный устав',
  investment_policy: 'Инвестиционная политика',
  distribution_policy: 'Политика распределений',
  spending_policy: 'Политика расходов',
  governance_rules: 'Правила governance',
  succession_plan: 'План преемственности',
  conflict_resolution: 'Разрешение конфликтов',
  philanthropy_policy: 'Филантропическая политика',
  communication_policy: 'Коммуникационная политика',
  other: 'Другое',
};

export function GvPolicyDetail({
  policy,
  locale = 'ru',
  currentUserId,
  onEdit,
  onActivate,
  onArchive,
  onAcknowledge,
  onOpenAudit,
}: GvPolicyDetailProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'acknowledgements' | 'history'>('content');

  const getBody = () => {
    switch (locale) {
      case 'en':
        return policy.bodyMdEn || policy.bodyMdRu || '';
      case 'uk':
        return policy.bodyMdUk || policy.bodyMdRu || '';
      default:
        return policy.bodyMdRu || '';
    }
  };

  const hasUserAcknowledged = () => {
    if (!currentUserId || !policy.acknowledgedByJson) return false;
    return policy.acknowledgedByJson.some(a => a.userId === currentUserId);
  };

  const canAcknowledge = policy.acknowledgementRequired &&
    policy.status === 'active' &&
    currentUserId &&
    !hasUserAcknowledged();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/m/governance/list?tab=policies">
              <Button variant="ghost" size="sm" className="gap-1 px-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-stone-800">{policy.name}</h1>
            <GvStatusPill status={policy.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <span>{categoryLabels[policy.categoryKey] || policy.categoryKey}</span>
            <span>|</span>
            <span>Версия {policy.version}</span>
            {policy.effectiveDate && (
              <>
                <span>|</span>
                <span>
                  Действует с {new Date(policy.effectiveDate).toLocaleDateString('ru-RU')}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {policy.status === 'draft' && onActivate && (
            <Button variant="primary" onClick={onActivate}>
              Активировать
            </Button>
          )}
          {policy.status === 'active' && onArchive && (
            <Button variant="secondary" onClick={onArchive}>
              Архивировать
            </Button>
          )}
          {canAcknowledge && onAcknowledge && (
            <Button variant="primary" onClick={onAcknowledge}>
              Подтвердить ознакомление
            </Button>
          )}
          {onEdit && policy.status === 'draft' && (
            <Button variant="ghost" onClick={onEdit}>
              Редактировать
            </Button>
          )}
          {onOpenAudit && (
            <Button variant="ghost" onClick={onOpenAudit}>
              Audit
            </Button>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-3">
        {policy.clientSafePublished && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Client-safe
          </div>
        )}
        {policy.acknowledgementRequired && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Требуется подтверждение
          </div>
        )}
        {policy.linkedTrustId && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Связано с Trust
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-4">
          {(['content', 'acknowledgements', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab
                  ? "border-emerald-500 text-emerald-700"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              )}
            >
              {tab === 'content' && 'Содержание'}
              {tab === 'acknowledgements' && `Подтверждения (${policy.acknowledgedByJson?.length || 0})`}
              {tab === 'history' && 'История'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'content' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <div className="prose prose-stone max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: getBody()
                      .replace(/\n/g, '<br/>')
                      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'acknowledgements' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
              <div className="px-4 py-3 border-b border-stone-200/50">
                <h3 className="font-semibold text-stone-800">Подтверждения ознакомления</h3>
              </div>
              {policy.acknowledgedByJson && policy.acknowledgedByJson.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {policy.acknowledgedByJson.map((ack, idx) => (
                    <div key={ack.userId || idx} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-stone-800">{ack.name || ack.userId}</p>
                      </div>
                      <span className="text-sm text-stone-500">
                        {new Date(ack.acknowledgedAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-stone-500">
                  <p className="text-sm">Пока никто не подтвердил ознакомление</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 text-center text-stone-500">
              <p className="text-sm">История версий будет доступна в Audit</p>
              {onOpenAudit && (
                <Button variant="secondary" onClick={onOpenAudit} className="mt-4">
                  Открыть Audit
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
              Метаданные
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">ID</span>
                <span className="text-stone-800 font-mono">{policy.id.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Версия</span>
                <span className="text-stone-800">{policy.version}</span>
              </div>
              {policy.effectiveDate && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Вступает в силу</span>
                  <span className="text-stone-800">
                    {new Date(policy.effectiveDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
              {policy.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Истекает</span>
                  <span className="text-stone-800">
                    {new Date(policy.expiresAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
              {policy.createdAt && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Создано</span>
                  <span className="text-stone-800">
                    {new Date(policy.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
              {policy.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Обновлено</span>
                  <span className="text-stone-800">
                    {new Date(policy.updatedAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {hasUserAcknowledged() && (
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Вы подтвердили ознакомление</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
