'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiKeysTable } from '@/modules/24-api/ui/ApiKeysTable';
import { ApiWebhooksTable } from '@/modules/24-api/ui/ApiWebhooksTable';
import { ApiEventsTable } from '@/modules/24-api/ui/ApiEventsTable';
import { ApiRateLimitsPanel } from '@/modules/24-api/ui/ApiRateLimitsPanel';
import { ApiExplorer } from '@/modules/24-api/ui/ApiExplorer';
import { ApiDocsView } from '@/modules/24-api/ui/ApiDocsView';

const TABS = [
  { key: 'keys', label: 'Ключи' },
  { key: 'webhooks', label: 'Webhooks' },
  { key: 'events', label: 'Доставки' },
  { key: 'ratelimits', label: 'Лимиты' },
  { key: 'explorer', label: 'Explorer' },
  { key: 'docs', label: 'Документация' },
];

export default function ApiListPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'keys';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [scopes, setScopes] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [rateLimits, setRateLimits] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [keysRes, scopesRes, webhooksRes, deliveriesRes, eventsRes, limitsRes, docsRes] = await Promise.all([
        fetch('/api/api/keys'),
        fetch('/api/collections/apiKeyScopes'),
        fetch('/api/api/webhooks'),
        fetch('/api/api/events'),
        fetch('/api/collections/webhookEvents'),
        fetch('/api/collections/rateLimits'),
        fetch('/api/collections/apiDocs'),
      ]);

      setApiKeys(await keysRes.json());
      setScopes(await scopesRes.json());
      setWebhooks(await webhooksRes.json());
      setDeliveries(await deliveriesRes.json());
      setEvents(await eventsRes.json());
      setRateLimits(await limitsRes.json());
      setDocs(await docsRes.json());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRotateKey = async (keyId: string) => {
    if (!confirm('Ротировать ключ? Старый ключ истечет через 24 часа.')) return;

    try {
      const res = await fetch(`/api/api/keys/${keyId}/rotate`, { method: 'POST' });
      const data = await res.json();
      if (data.secret) {
        alert(`Новый ключ: ${data.secret}\n\nСохраните его сейчас!`);
      }
      loadData();
    } catch (error) {
      console.error('Error rotating key:', error);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Отозвать ключ? Это действие необратимо.')) return;

    try {
      await fetch(`/api/api/keys/${keyId}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error revoking key:', error);
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    try {
      const res = await fetch(`/api/api/webhooks/${webhookId}/test`, { method: 'POST' });
      const data = await res.json();
      alert(`Тест завершен: ${data.result.success ? 'Успешно' : 'Ошибка'} (${data.result.statusCode})`);
      loadData();
    } catch (error) {
      console.error('Error testing webhook:', error);
    }
  };

  const handlePauseWebhook = async (webhookId: string) => {
    try {
      await fetch(`/api/api/webhooks/${webhookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paused' }),
      });
      loadData();
    } catch (error) {
      console.error('Error pausing webhook:', error);
    }
  };

  const handleResumeWebhook = async (webhookId: string) => {
    try {
      await fetch(`/api/api/webhooks/${webhookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      loadData();
    } catch (error) {
      console.error('Error resuming webhook:', error);
    }
  };

  const handleRetryDelivery = async (deliveryId: string) => {
    try {
      const res = await fetch(`/api/api/deliveries/${deliveryId}/retry`, { method: 'POST' });
      const data = await res.json();
      alert(`Повтор: ${data.result.success ? 'Успешно' : 'Ошибка'}`);
      loadData();
    } catch (error) {
      console.error('Error retrying delivery:', error);
    }
  };

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
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                pb-3 px-1 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
        {activeTab === 'keys' && (
          <ApiKeysTable
            keys={apiKeys}
            scopes={scopes}
            onRotate={handleRotateKey}
            onRevoke={handleRevokeKey}
          />
        )}

        {activeTab === 'webhooks' && (
          <ApiWebhooksTable
            webhooks={webhooks}
            onTest={handleTestWebhook}
            onPause={handlePauseWebhook}
            onResume={handleResumeWebhook}
          />
        )}

        {activeTab === 'events' && (
          <ApiEventsTable
            deliveries={deliveries}
            webhooks={webhooks}
            events={events}
            onRetry={handleRetryDelivery}
          />
        )}

        {activeTab === 'ratelimits' && (
          <ApiRateLimitsPanel
            rateLimits={rateLimits}
            apiKeys={apiKeys}
          />
        )}

        {activeTab === 'explorer' && (
          <ApiExplorer apiKeys={apiKeys} />
        )}

        {activeTab === 'docs' && (
          <ApiDocsView docs={docs} />
        )}
      </div>
    </div>
  );
}
