'use client';

import React, { useState, useEffect } from 'react';
import { ApiKpiStrip } from '@/modules/24-api/ui/ApiKpiStrip';
import { ApiKeysTable } from '@/modules/24-api/ui/ApiKeysTable';
import { ApiWebhooksTable } from '@/modules/24-api/ui/ApiWebhooksTable';
import { ApiEventsTable } from '@/modules/24-api/ui/ApiEventsTable';
import { ApiActionsBar } from '@/modules/24-api/ui/ApiActionsBar';

export default function ApiDashboardPage() {
  const [kpis, setKpis] = useState<Record<string, number>>({});
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [scopes, setScopes] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSecretModal, setShowSecretModal] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [kpisRes, keysRes, scopesRes, webhooksRes, deliveriesRes, eventsRes] = await Promise.all([
        fetch('/api/api/kpis'),
        fetch('/api/api/keys'),
        fetch('/api/collections/apiKeyScopes'),
        fetch('/api/api/webhooks'),
        fetch('/api/api/events'),
        fetch('/api/collections/webhookEvents'),
      ]);

      setKpis(await kpisRes.json());
      setApiKeys(await keysRes.json());
      const scopesRaw = await scopesRes.json();
      setScopes(scopesRaw.items ?? scopesRaw ?? []);
      setWebhooks(await webhooksRes.json());
      setDeliveries(await deliveriesRes.json());
      const eventsRaw = await eventsRes.json();
      setEvents(eventsRaw.items ?? eventsRaw ?? []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    const name = prompt('Название API ключа:');
    if (!name) return;

    const keyMode = prompt('Режим (server/advisor/client):', 'server');
    if (!keyMode) return;

    try {
      const res = await fetch('/api/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, keyMode }),
      });

      const data = await res.json();
      if (data.secret) {
        setShowSecretModal(data.secret);
      }
      loadData();
    } catch (error) {
      console.error('Error creating key:', error);
    }
  };

  const handleCreateWebhook = async () => {
    const name = prompt('Название webhook:');
    if (!name) return;

    const targetUrl = prompt('URL:', 'https://example.com/webhook');
    if (!targetUrl) return;

    try {
      await fetch('/api/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          targetUrl,
          eventTypes: ['invoice.paid', 'approval.approved'],
        }),
      });
      loadData();
    } catch (error) {
      console.error('Error creating webhook:', error);
    }
  };

  const handleEmitEvents = async () => {
    try {
      await fetch('/api/api/events/emit', { method: 'POST' });
      loadData();
    } catch (error) {
      console.error('Error emitting events:', error);
    }
  };

  const kpiItems = [
    { key: 'activeKeys', label: 'Активных ключей', value: kpis.activeKeys || 0, status: 'ok' as const, href: '/m/api/list?tab=keys&status=active' },
    { key: 'expiringKeys30d', label: 'Истекает 30д', value: kpis.expiringKeys30d || 0, status: kpis.expiringKeys30d ? 'warning' as const : 'ok' as const, href: '/m/api/list?tab=keys&filter=expiring' },
    { key: 'webhooksActive', label: 'Webhooks активно', value: kpis.webhooksActive || 0, status: 'ok' as const, href: '/m/api/list?tab=webhooks&status=active' },
    { key: 'deliveriesFailed7d', label: 'Ошибок 7д', value: kpis.deliveriesFailed7d || 0, status: kpis.deliveriesFailed7d ? 'critical' as const : 'ok' as const, href: '/m/api/list?tab=events&status=failed' },
    { key: 'retriesPending', label: 'Ожидает повтора', value: kpis.retriesPending || 0, status: kpis.retriesPending ? 'warning' as const : 'ok' as const, href: '/m/api/list?tab=events&filter=retrying' },
    { key: 'rateLimitHits24h', label: 'Лимит хитов 24ч', value: kpis.rateLimitHits24h || 0, status: kpis.rateLimitHits24h ? 'warning' as const : 'ok' as const, href: '/m/api/list?tab=ratelimits' },
    { key: 'apiCalls24h', label: 'Вызовов API 24ч', value: kpis.apiCalls24h || 0, status: 'ok' as const, href: '/m/api/list?tab=events' },
    { key: 'clientSafeKeys', label: 'Клиентских ключей', value: kpis.clientSafeKeys || 0, status: 'ok' as const, href: '/m/api/list?tab=keys&filter=client_safe' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API и Webhooks</h1>
        <p className="text-gray-500 mt-1">Управление API ключами, webhooks и интеграциями</p>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-medium text-amber-800">Демонстрационный режим</p>
            <p className="text-sm text-amber-700 mt-1">
              API и вебхуки в MVP демонстрационные. Для production требуются инфраструктура, секреты и безопасность.
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <ApiKpiStrip kpis={kpiItems} />

      {/* Actions */}
      <ApiActionsBar
        onCreateKey={handleCreateKey}
        onCreateWebhook={handleCreateWebhook}
        onEmitEvents={handleEmitEvents}
      />

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Keys */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Ключи</h2>
          <ApiKeysTable keys={apiKeys} scopes={scopes} mini />
        </div>

        {/* Webhooks */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhooks</h2>
          <ApiWebhooksTable webhooks={webhooks} mini />
        </div>
      </div>

      {/* Deliveries */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Последние доставки</h2>
        <ApiEventsTable deliveries={deliveries} webhooks={webhooks} events={events} mini />
      </div>

      {/* Secret Modal */}
      {showSecretModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API ключ создан</h3>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <p className="text-sm text-amber-800 mb-2">
                <strong>Важно:</strong> Сохраните этот ключ сейчас. Он больше не будет показан.
              </p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <code className="text-sm text-emerald-400 font-mono break-all">{showSecretModal}</code>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(showSecretModal);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Копировать
              </button>
              <button
                onClick={() => setShowSecretModal(null)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
