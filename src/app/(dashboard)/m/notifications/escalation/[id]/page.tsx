'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRecord } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';

interface Escalation {
  id: string;
  clientId: string;
  notificationId: string;
  notificationTitle: string;
  ruleId?: string | null;
  level: number;
  escalatedFromUserId: string;
  escalatedFromName: string;
  escalatedToUserId: string;
  escalatedToName: string;
  escalatedToRole?: string | null;
  reason: 'no_response' | 'sla_breach' | 'manual' | 'threshold' | 'critical';
  reasonDetail: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'expired';
  acknowledgedAt?: string | null;
  acknowledgedByUserId?: string | null;
  acknowledgedByName?: string | null;
  resolvedAt?: string | null;
  resolvedByUserId?: string | null;
  resolvedByName?: string | null;
  resolutionNotes?: string | null;
  slaDeadline?: string | null;
  slaBreach: boolean;
  nextEscalationAt?: string | null;
  maxLevel: number;
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  active: 'bg-red-100 text-red-700',
  acknowledged: 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  expired: 'bg-gray-100 text-gray-600',
};

const reasonLabels: Record<string, Record<string, string>> = {
  no_response: { ru: 'Нет ответа', en: 'No response', uk: 'Немає відповіді' },
  sla_breach: { ru: 'Нарушение SLA', en: 'SLA breach', uk: 'Порушення SLA' },
  manual: { ru: 'Ручная эскалация', en: 'Manual escalation', uk: 'Ручна ескалація' },
  threshold: { ru: 'Превышение порога', en: 'Threshold exceeded', uk: 'Перевищення порогу' },
  critical: { ru: 'Критическое событие', en: 'Critical event', uk: 'Критична подія' },
};

export default function EscalationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslation();
  const { record: escalation, loading } = useRecord<Escalation>('escalations', id);
  const [updating, setUpdating] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const refetch = () => window.location.reload();

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAcknowledge = async () => {
    setUpdating(true);
    try {
      await fetch(`/api/collections/escalations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'acknowledged',
          acknowledgedAt: new Date().toISOString(),
          acknowledgedByUserId: 'user-001',
          acknowledgedByName: 'Current User',
        }),
      });
      refetch();
    } catch (error) {
      console.error('Failed to acknowledge:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleResolve = async () => {
    setUpdating(true);
    try {
      await fetch(`/api/collections/escalations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
          resolvedByUserId: 'user-001',
          resolvedByName: 'Current User',
          resolutionNotes,
        }),
      });
      refetch();
    } catch (error) {
      console.error('Failed to resolve:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        {t('loading', { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' })}
      </div>
    );
  }

  if (!escalation) {
    return (
      <div className="p-8 text-center text-gray-500">
        {t('escalationNotFound', { ru: 'Эскалация не найдена', en: 'Escalation not found', uk: 'Ескалацію не знайдено' })}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/m/notifications/list?tab=escalations"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToEscalations', { ru: 'К эскалациям', en: 'Back to Escalations', uk: 'До ескалацій' })}
        </Link>
      </div>

      {/* Alert Banner for Active Escalations */}
      {escalation.status === 'active' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <span className="text-red-500 text-xl">🔺</span>
          <div>
            <h3 className="font-medium text-red-800">
              {t('activeEscalation', { ru: 'Активная эскалация', en: 'Active Escalation', uk: 'Активна ескалація' })}
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {t('requiresAttention', { ru: 'Требуется немедленное внимание', en: 'Requires immediate attention', uk: 'Потребує негайної уваги' })}
            </p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
        {/* Title Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{escalation.notificationTitle}</h1>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[escalation.status]}`}>
                  {escalation.status}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                  {t('level', { ru: 'Уровень', en: 'Level', uk: 'Рівень' })} {escalation.level} / {escalation.maxLevel}
                </span>
                {escalation.slaBreach && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                    ⚠️ SLA {t('breached', { ru: 'нарушен', en: 'breached', uk: 'порушено' })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Escalation Chain */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            {t('escalationChain', { ru: 'Цепочка эскалации', en: 'Escalation Chain', uk: 'Ланцюг ескалації' })}
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">{escalation.escalatedFromName}</div>
              <div className="text-xs text-gray-500">{t('original', { ru: 'Исходный', en: 'Original', uk: 'Початковий' })}</div>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">{escalation.escalatedToName}</div>
              <div className="text-xs text-gray-500">
                {escalation.escalatedToRole || t('escalatedTo', { ru: 'Эскалировано', en: 'Escalated to', uk: 'Ескальовано до' })}
              </div>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            {t('reason', { ru: 'Причина', en: 'Reason', uk: 'Причина' })}
          </h3>
          <div className="font-medium text-gray-900">
            {reasonLabels[escalation.reason]?.ru || escalation.reason}
          </div>
          {escalation.reasonDetail && (
            <p className="text-sm text-gray-600 mt-1">{escalation.reasonDetail}</p>
          )}
        </div>

        {/* Timeline */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            {t('timeline', { ru: 'Хронология', en: 'Timeline', uk: 'Хронологія' })}
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">{t('created', { ru: 'Создано', en: 'Created', uk: 'Створено' })}</dt>
              <dd className="font-medium text-gray-900">{formatDate(escalation.createdAt)}</dd>
            </div>
            {escalation.acknowledgedAt && (
              <div className="flex justify-between">
                <dt className="text-gray-500">{t('acknowledged', { ru: 'Подтверждено', en: 'Acknowledged', uk: 'Підтверджено' })}</dt>
                <dd className="font-medium text-gray-900">
                  {formatDate(escalation.acknowledgedAt)} ({escalation.acknowledgedByName})
                </dd>
              </div>
            )}
            {escalation.resolvedAt && (
              <div className="flex justify-between">
                <dt className="text-gray-500">{t('resolved', { ru: 'Разрешено', en: 'Resolved', uk: 'Вирішено' })}</dt>
                <dd className="font-medium text-gray-900">
                  {formatDate(escalation.resolvedAt)} ({escalation.resolvedByName})
                </dd>
              </div>
            )}
            {escalation.slaDeadline && (
              <div className="flex justify-between">
                <dt className="text-gray-500">SLA {t('deadline', { ru: 'Дедлайн', en: 'Deadline', uk: 'Дедлайн' })}</dt>
                <dd className={`font-medium ${escalation.slaBreach ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDate(escalation.slaDeadline)}
                </dd>
              </div>
            )}
            {escalation.nextEscalationAt && escalation.status === 'active' && (
              <div className="flex justify-between">
                <dt className="text-gray-500">{t('nextEscalation', { ru: 'Следующая эскалация', en: 'Next escalation', uk: 'Наступна ескалація' })}</dt>
                <dd className="font-medium text-amber-600">{formatDate(escalation.nextEscalationAt)}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Resolution Notes */}
        {escalation.resolutionNotes && (
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {t('resolutionNotes', { ru: 'Заметки о решении', en: 'Resolution Notes', uk: 'Примітки про вирішення' })}
            </h3>
            <p className="text-gray-700">{escalation.resolutionNotes}</p>
          </div>
        )}

        {/* Actions */}
        {(escalation.status === 'active' || escalation.status === 'acknowledged') && (
          <div className="p-6 bg-gray-50">
            {escalation.status === 'active' && (
              <button
                onClick={handleAcknowledge}
                disabled={updating}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {t('acknowledgeEscalation', { ru: 'Подтвердить эскалацию', en: 'Acknowledge Escalation', uk: 'Підтвердити ескалацію' })}
              </button>
            )}

            {escalation.status === 'acknowledged' && (
              <div className="space-y-3">
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder={t('resolutionNotesPlaceholder', {
                    ru: 'Опишите, как была решена проблема...',
                    en: 'Describe how the issue was resolved...',
                    uk: 'Опишіть, як була вирішена проблема...'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
                  rows={3}
                />
                <button
                  onClick={handleResolve}
                  disabled={updating || !resolutionNotes.trim()}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  {t('resolveEscalation', { ru: 'Разрешить эскалацию', en: 'Resolve Escalation', uk: 'Вирішити ескалацію' })}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
