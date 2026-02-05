'use client';

import React from 'react';
import Link from 'next/link';
import { Webhook } from '../schema/webhook';
import { ApiStatusPill } from './ApiStatusPill';

interface ApiWebhooksTableProps {
  webhooks: Webhook[];
  mini?: boolean;
  onTest?: (webhookId: string) => void;
  onPause?: (webhookId: string) => void;
  onResume?: (webhookId: string) => void;
}

export function ApiWebhooksTable({
  webhooks,
  mini = false,
  onTest,
  onPause,
  onResume,
}: ApiWebhooksTableProps) {
  const displayWebhooks = mini ? webhooks.slice(0, 8) : webhooks;

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (webhooks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <p>Нет webhooks</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-3 font-medium">Название</th>
            <th className="pb-3 font-medium">URL</th>
            <th className="pb-3 font-medium">События</th>
            <th className="pb-3 font-medium">Статус</th>
            {!mini && <th className="pb-3 font-medium">Посл. доставка</th>}
            {!mini && <th className="pb-3 font-medium">Ошибки 7д</th>}
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {displayWebhooks.map((webhook) => (
            <tr key={webhook.id} className="hover:bg-gray-50/50">
              <td className="py-3">
                <Link
                  href={`/m/api/webhook/${webhook.id}`}
                  className="font-medium text-gray-900 hover:text-emerald-600"
                >
                  {webhook.name}
                </Link>
              </td>
              <td className="py-3">
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-600">
                  {webhook.targetUrlMasked}
                </code>
              </td>
              <td className="py-3">
                <div className="flex flex-wrap gap-1">
                  {webhook.eventTypes.slice(0, mini ? 2 : 4).map((et) => (
                    <span key={et} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                      {et.split('.')[0]}
                    </span>
                  ))}
                  {webhook.eventTypes.length > (mini ? 2 : 4) && (
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      +{webhook.eventTypes.length - (mini ? 2 : 4)}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3">
                <ApiStatusPill status={webhook.status} size="sm" />
              </td>
              {!mini && (
                <td className="py-3 text-gray-500">
                  {formatDate(webhook.lastDeliveryAt)}
                </td>
              )}
              {!mini && (
                <td className="py-3">
                  {webhook.failRate7d !== undefined && webhook.failRate7d > 0 ? (
                    <span className={webhook.failRate7d > 20 ? 'text-red-600 font-medium' : 'text-amber-600'}>
                      {webhook.failRate7d.toFixed(0)}%
                    </span>
                  ) : (
                    <span className="text-gray-400">0%</span>
                  )}
                </td>
              )}
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <Link
                    href={`/m/api/webhook/${webhook.id}`}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 rounded"
                    title="Открыть"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {!mini && webhook.status === 'active' && (
                    <>
                      <button
                        onClick={() => onTest?.(webhook.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                        title="Тестировать"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onPause?.(webhook.id)}
                        className="p-1.5 text-gray-400 hover:text-amber-600 rounded"
                        title="Приостановить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </>
                  )}
                  {!mini && webhook.status === 'paused' && (
                    <button
                      onClick={() => onResume?.(webhook.id)}
                      className="p-1.5 text-gray-400 hover:text-emerald-600 rounded"
                      title="Возобновить"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {mini && webhooks.length > 8 && (
        <div className="mt-3 text-center">
          <Link href="/m/api/list?tab=webhooks" className="text-sm text-emerald-600 hover:underline">
            Показать все {webhooks.length} webhooks →
          </Link>
        </div>
      )}
    </div>
  );
}
