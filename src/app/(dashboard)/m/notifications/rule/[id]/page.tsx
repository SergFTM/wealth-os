'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRecord } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';

interface NotificationRule {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  triggerType: 'event' | 'schedule' | 'condition' | 'threshold' | 'manual';
  triggerEvent?: string;
  triggerSchedule?: string;
  conditions: Array<{ field: string; operator: string; value: unknown }>;
  targetRoles?: string[];
  targetUsers?: string[];
  channels: string[];
  templateId?: string;
  priority: string;
  category?: string;
  status: 'active' | 'paused' | 'disabled';
  escalateAfterMinutes?: number | null;
  escalateTo?: string | null;
  bundleInDigest?: boolean;
  digestFrequency?: string | null;
  cooldownMinutes?: number | null;
  maxPerDay?: number | null;
  firedCount: number;
  lastFiredAt?: string | null;
  createdByUserId: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-amber-100 text-amber-700',
  disabled: 'bg-gray-100 text-gray-600',
};

export default function RuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslation();
  const { record: rule, loading } = useRecord<NotificationRule>('notificationRules', id);
  const [updating, setUpdating] = useState(false);

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

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await fetch(`/api/collections/notificationRules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      refetch();
    } catch (error) {
      console.error('Failed to update rule:', error);
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

  if (!rule) {
    return (
      <div className="p-8 text-center text-gray-500">
        {t('ruleNotFound', { ru: 'Правило не найдено', en: 'Rule not found', uk: 'Правило не знайдено' })}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/m/notifications/list?tab=rules"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToRules', { ru: 'К правилам', en: 'Back to Rules', uk: 'До правил' })}
        </Link>

        <div className="flex items-center gap-2">
          {rule.status !== 'active' && (
            <button
              onClick={() => handleStatusChange('active')}
              disabled={updating}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50"
            >
              {t('activate', { ru: 'Активировать', en: 'Activate', uk: 'Активувати' })}
            </button>
          )}
          {rule.status === 'active' && (
            <button
              onClick={() => handleStatusChange('paused')}
              disabled={updating}
              className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {t('pause', { ru: 'Приостановить', en: 'Pause', uk: 'Призупинити' })}
            </button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
        {/* Title Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{rule.name}</h1>
              {rule.description && (
                <p className="text-gray-500 mt-1">{rule.description}</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[rule.status]}`}>
                  {rule.status}
                </span>
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  {rule.triggerType}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{rule.firedCount}</div>
              <div className="text-xs text-gray-500">
                {t('timesFired', { ru: 'раз сработало', en: 'times fired', uk: 'разів спрацювало' })}
              </div>
            </div>
          </div>
        </div>

        {/* Trigger Configuration */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            {t('triggerConfiguration', { ru: 'Настройка триггера', en: 'Trigger Configuration', uk: 'Налаштування тригера' })}
          </h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">{t('triggerType', { ru: 'Тип триггера', en: 'Trigger Type', uk: 'Тип тригера' })}</dt>
              <dd className="font-medium text-gray-900 capitalize">{rule.triggerType}</dd>
            </div>
            {rule.triggerEvent && (
              <div>
                <dt className="text-gray-500">{t('event', { ru: 'Событие', en: 'Event', uk: 'Подія' })}</dt>
                <dd className="font-medium text-gray-900">{rule.triggerEvent}</dd>
              </div>
            )}
            {rule.triggerSchedule && (
              <div>
                <dt className="text-gray-500">{t('schedule', { ru: 'Расписание', en: 'Schedule', uk: 'Розклад' })}</dt>
                <dd className="font-medium text-gray-900 font-mono">{rule.triggerSchedule}</dd>
              </div>
            )}
            <div>
              <dt className="text-gray-500">{t('priority', { ru: 'Приоритет', en: 'Priority', uk: 'Пріоритет' })}</dt>
              <dd className="font-medium text-gray-900 capitalize">{rule.priority}</dd>
            </div>
          </dl>
        </div>

        {/* Conditions */}
        {rule.conditions && rule.conditions.length > 0 && (
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              {t('conditions', { ru: 'Условия', en: 'Conditions', uk: 'Умови' })}
            </h3>
            <div className="space-y-2">
              {rule.conditions.map((cond, i) => (
                <div key={i} className="p-2 bg-gray-50 rounded-lg text-sm font-mono">
                  {cond.field} <span className="text-blue-600">{cond.operator}</span> {JSON.stringify(cond.value)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Settings */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            {t('deliverySettings', { ru: 'Настройки доставки', en: 'Delivery Settings', uk: 'Налаштування доставки' })}
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-500 text-sm">{t('channels', { ru: 'Каналы', en: 'Channels', uk: 'Канали' })}:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {rule.channels.map((ch, i) => (
                  <span key={i} className="px-2 py-1 text-sm bg-blue-50 text-blue-700 rounded">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
            {rule.targetRoles && rule.targetRoles.length > 0 && (
              <div>
                <span className="text-gray-500 text-sm">{t('targetRoles', { ru: 'Целевые роли', en: 'Target Roles', uk: 'Цільові ролі' })}:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {rule.targetRoles.map((role, i) => (
                    <span key={i} className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Escalation Settings */}
        {(rule.escalateAfterMinutes || rule.escalateTo) && (
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              {t('escalationSettings', { ru: 'Настройки эскалации', en: 'Escalation Settings', uk: 'Налаштування ескалації' })}
            </h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {rule.escalateAfterMinutes && (
                <div>
                  <dt className="text-gray-500">{t('escalateAfter', { ru: 'Эскалировать через', en: 'Escalate after', uk: 'Ескалювати через' })}</dt>
                  <dd className="font-medium text-gray-900">{rule.escalateAfterMinutes} {t('minutes', { ru: 'минут', en: 'minutes', uk: 'хвилин' })}</dd>
                </div>
              )}
              {rule.escalateTo && (
                <div>
                  <dt className="text-gray-500">{t('escalateTo', { ru: 'Эскалировать к', en: 'Escalate to', uk: 'Ескалювати до' })}</dt>
                  <dd className="font-medium text-gray-900">{rule.escalateTo}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Metadata */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            {t('metadata', { ru: 'Метаданные', en: 'Metadata', uk: 'Метадані' })}
          </h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">{t('createdBy', { ru: 'Создано', en: 'Created by', uk: 'Створено' })}</dt>
              <dd className="font-medium text-gray-900">{rule.createdByName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t('createdAt', { ru: 'Дата создания', en: 'Created at', uk: 'Дата створення' })}</dt>
              <dd className="font-medium text-gray-900">{formatDate(rule.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t('lastFired', { ru: 'Последнее срабатывание', en: 'Last fired', uk: 'Останнє спрацювання' })}</dt>
              <dd className="font-medium text-gray-900">{formatDate(rule.lastFiredAt)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t('updatedAt', { ru: 'Обновлено', en: 'Updated at', uk: 'Оновлено' })}</dt>
              <dd className="font-medium text-gray-900">{formatDate(rule.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
