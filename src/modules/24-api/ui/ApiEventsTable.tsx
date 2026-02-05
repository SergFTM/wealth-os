'use client';

import React from 'react';
import Link from 'next/link';
import { WebhookDelivery } from '../schema/webhookDelivery';
import { Webhook } from '../schema/webhook';
import { WebhookEvent } from '../schema/webhookEvent';
import { ApiStatusPill } from './ApiStatusPill';

interface ApiEventsTableProps {
  deliveries: WebhookDelivery[];
  webhooks: Webhook[];
  events: WebhookEvent[];
  mini?: boolean;
  onRetry?: (deliveryId: string) => void;
  onMarkDead?: (deliveryId: string) => void;
}

export function ApiEventsTable({
  deliveries,
  webhooks,
  events,
  mini = false,
  onRetry,
  onMarkDead,
}: ApiEventsTableProps) {
  const displayDeliveries = mini ? deliveries.slice(0, 8) : deliveries;

  const getWebhookName = (webhookId: string) => {
    const webhook = webhooks.find((w) => w.id === webhookId);
    return webhook?.name || webhookId;
  };

  const getEventType = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    return event?.eventType || '—';
  };

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '—';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (deliveries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Нет доставок</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-3 font-medium">ID</th>
            <th className="pb-3 font-medium">Webhook</th>
            <th className="pb-3 font-medium">Событие</th>
            <th className="pb-3 font-medium">Статус</th>
            <th className="pb-3 font-medium">Попытки</th>
            {!mini && <th className="pb-3 font-medium">Время</th>}
            {!mini && <th className="pb-3 font-medium">След. повтор</th>}
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {displayDeliveries.map((delivery) => (
            <tr key={delivery.id} className="hover:bg-gray-50/50">
              <td className="py-3">
                <Link
                  href={`/m/api/event/${delivery.id}`}
                  className="font-mono text-xs text-gray-600 hover:text-emerald-600"
                >
                  {delivery.id.substring(0, 12)}...
                </Link>
              </td>
              <td className="py-3">
                <Link
                  href={`/m/api/webhook/${delivery.webhookId}`}
                  className="text-gray-900 hover:text-emerald-600"
                >
                  {getWebhookName(delivery.webhookId)}
                </Link>
              </td>
              <td className="py-3">
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                  {getEventType(delivery.eventId)}
                </span>
              </td>
              <td className="py-3">
                <ApiStatusPill status={delivery.status} size="sm" />
              </td>
              <td className="py-3">
                <span className={delivery.attempts >= delivery.maxAttempts ? 'text-red-600' : ''}>
                  {delivery.attempts}/{delivery.maxAttempts}
                </span>
              </td>
              {!mini && (
                <td className="py-3 text-gray-500">
                  {formatDuration(delivery.durationMs)}
                </td>
              )}
              {!mini && (
                <td className="py-3 text-gray-500">
                  {delivery.status === 'retrying' ? formatDate(delivery.nextRetryAt) : '—'}
                </td>
              )}
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <Link
                    href={`/m/api/event/${delivery.id}`}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 rounded"
                    title="Открыть"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {!mini && (delivery.status === 'failed' || delivery.status === 'retrying') && (
                    <>
                      <button
                        onClick={() => onRetry?.(delivery.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                        title="Повторить сейчас"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onMarkDead?.(delivery.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                        title="Пометить Dead"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {mini && deliveries.length > 8 && (
        <div className="mt-3 text-center">
          <Link href="/m/api/list?tab=events" className="text-sm text-emerald-600 hover:underline">
            Показать все {deliveries.length} доставок →
          </Link>
        </div>
      )}
    </div>
  );
}
