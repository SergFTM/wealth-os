'use client';

import React from 'react';
import { WebhookDelivery, RETRY_BACKOFF_MINUTES } from '../schema/webhookDelivery';
import { WebhookEvent } from '../schema/webhookEvent';
import { Webhook } from '../schema/webhook';
import { ApiStatusPill } from './ApiStatusPill';

interface ApiEventDetailProps {
  delivery: WebhookDelivery;
  event: WebhookEvent;
  webhook: Webhook;
  onRetry?: () => void;
  onMarkDead?: () => void;
}

export function ApiEventDetail({
  delivery,
  event,
  webhook,
  onRetry,
  onMarkDead,
}: ApiEventDetailProps) {
  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const canRetry = delivery.status === 'failed' || delivery.status === 'retrying';
  const canMarkDead = delivery.status !== 'dead' && delivery.status !== 'success';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Доставка {delivery.id.substring(0, 16)}...
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <ApiStatusPill status={delivery.status} />
            <span className="text-sm text-gray-500">
              Попытки: {delivery.attempts}/{delivery.maxAttempts}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Повторить сейчас
            </button>
          )}
          {canMarkDead && (
            <button
              onClick={onMarkDead}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Пометить Dead
            </button>
          )}
        </div>
      </div>

      {/* Status Info */}
      {delivery.status === 'retrying' && delivery.nextRetryAt && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Следующая попытка: {formatDate(delivery.nextRetryAt)}</span>
          </div>
        </div>
      )}

      {delivery.status === 'dead' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Доставка помечена как Dead Letter</span>
          </div>
          {delivery.errorMessage && (
            <p className="mt-2 text-sm text-red-600">{delivery.errorMessage}</p>
          )}
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Создана</div>
          <div className="mt-1 text-sm">{formatDate(delivery.createdAt)}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Посл. попытка</div>
          <div className="mt-1 text-sm">{formatDate(delivery.lastAttemptAt)}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Код ответа</div>
          <div className={`mt-1 text-lg font-mono font-bold ${
            delivery.responseCode && delivery.responseCode >= 200 && delivery.responseCode < 300
              ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {delivery.responseCode || '—'}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Время выполнения</div>
          <div className="mt-1 text-sm">
            {delivery.durationMs ? `${delivery.durationMs}ms` : '—'}
          </div>
        </div>
      </div>

      {/* Webhook Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Webhook</h2>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">{webhook.name}</div>
              <code className="text-sm text-gray-500 font-mono">{webhook.targetUrlMasked}</code>
            </div>
            <ApiStatusPill status={webhook.status} size="sm" />
          </div>
        </div>
      </div>

      {/* Event Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Событие</h2>
        <div className="p-4 border rounded-lg space-y-3">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-gray-500">Тип:</span>
              <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-sm">
                {event.eventType}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Модуль:</span>
              <span className="ml-2 font-mono text-sm">{event.sourceModule}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Создано:</span>
              <span className="ml-2 text-sm">{formatDate(event.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payload */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Payload</h2>
        <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
          <pre className="text-sm text-emerald-400 font-mono">
            {JSON.stringify(event.payload, null, 2)}
          </pre>
        </div>
      </div>

      {/* Response */}
      {delivery.responseBodySnippet && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Ответ</h2>
          <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
            <pre className="text-sm text-amber-400 font-mono">
              {delivery.responseBodySnippet}
            </pre>
          </div>
        </div>
      )}

      {/* Retry History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">История попыток</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 bg-gray-50 border-b">
                <th className="px-4 py-2 font-medium">Попытка</th>
                <th className="px-4 py-2 font-medium">Backoff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {RETRY_BACKOFF_MINUTES.map((minutes, index) => (
                <tr
                  key={index}
                  className={index < delivery.attempts ? 'bg-gray-50' : ''}
                >
                  <td className="px-4 py-2">
                    Попытка {index + 1}
                    {index < delivery.attempts && (
                      <span className="ml-2 text-red-500">✗</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    +{minutes} мин
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
