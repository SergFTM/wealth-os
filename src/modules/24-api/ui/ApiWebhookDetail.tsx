'use client';

import React from 'react';
import { Webhook, eventTypeLabels } from '../schema/webhook';
import { WebhookDelivery } from '../schema/webhookDelivery';
import { ApiStatusPill } from './ApiStatusPill';

interface ApiWebhookDetailProps {
  webhook: Webhook;
  recentDeliveries: WebhookDelivery[];
  onTest?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ApiWebhookDetail({
  webhook,
  recentDeliveries,
  onTest,
  onPause,
  onResume,
  onEdit,
  onDelete,
}: ApiWebhookDetailProps) {
  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const successCount = recentDeliveries.filter((d) => d.status === 'success').length;
  const failedCount = recentDeliveries.filter((d) => d.status === 'failed' || d.status === 'dead').length;
  const successRate = recentDeliveries.length > 0
    ? ((successCount / recentDeliveries.length) * 100).toFixed(0)
    : '—';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{webhook.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <ApiStatusPill status={webhook.status} />
            <code className="text-sm bg-gray-100 px-2 py-0.5 rounded font-mono">
              {webhook.targetUrlMasked}
            </code>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {webhook.status === 'active' && (
            <>
              <button
                onClick={onTest}
                className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Тестировать
              </button>
              <button
                onClick={onPause}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Приостановить
              </button>
            </>
          )}
          {webhook.status === 'paused' && (
            <button
              onClick={onResume}
              className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              Возобновить
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Создан</div>
          <div className="mt-1 text-sm">{formatDate(webhook.createdAt)}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Посл. доставка</div>
          <div className="mt-1 text-sm">{formatDate(webhook.lastDeliveryAt)}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Успешность (7д)</div>
          <div className={`mt-1 text-lg font-bold ${
            Number(successRate) >= 90 ? 'text-emerald-600' :
            Number(successRate) >= 70 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {successRate}%
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Доставок (7д)</div>
          <div className="mt-1 text-sm">
            <span className="text-emerald-600">{successCount}</span>
            {' / '}
            <span className="text-red-600">{failedCount}</span>
            {' / '}
            {recentDeliveries.length}
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Подписка на события</h2>
        <div className="flex flex-wrap gap-2">
          {webhook.eventTypes.map((eventType) => (
            <div
              key={eventType}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm"
            >
              {eventTypeLabels[eventType]?.ru || eventType}
            </div>
          ))}
        </div>
      </div>

      {/* Scope */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Область</h2>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-gray-500">Тип:</span>
              <span className="ml-2 font-medium">
                {webhook.scopeType === 'global' ? 'Глобальный' :
                 webhook.scopeType === 'household' ? 'Домохозяйство' :
                 webhook.scopeType === 'entity' ? 'Структура' : 'Портфель'}
              </span>
            </div>
            {webhook.scopeId && (
              <div>
                <span className="text-sm text-gray-500">ID:</span>
                <code className="ml-2 font-mono text-sm bg-white px-1.5 py-0.5 rounded">
                  {webhook.scopeId}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Deliveries */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Последние доставки ({recentDeliveries.length})
        </h2>
        {recentDeliveries.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border rounded-lg">
            <p>Нет доставок</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50 border-b">
                  <th className="px-4 py-2 font-medium">ID</th>
                  <th className="px-4 py-2 font-medium">Статус</th>
                  <th className="px-4 py-2 font-medium">Попытки</th>
                  <th className="px-4 py-2 font-medium">Код</th>
                  <th className="px-4 py-2 font-medium">Время</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentDeliveries.slice(0, 10).map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2 font-mono text-xs text-gray-600">
                      {delivery.id.substring(0, 12)}...
                    </td>
                    <td className="px-4 py-2">
                      <ApiStatusPill status={delivery.status} size="sm" />
                    </td>
                    <td className="px-4 py-2">
                      {delivery.attempts}/{delivery.maxAttempts}
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {delivery.responseCode || '—'}
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {formatDate(delivery.lastAttemptAt || delivery.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
