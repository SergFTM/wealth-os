'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { MbStatusPill } from './MbStatusPill';
import { getAvailableRoutes, getCacheStrategies, type OfflinePlan } from '../engine';

const labels = {
  title: { ru: 'Offline Cache', en: 'Offline Cache', uk: 'Offline Cache' },
  plans: { ru: 'Offline планы', en: 'Offline Plans', uk: 'Offline плани' },
  createPlan: { ru: 'Создать план', en: 'Create Plan', uk: 'Створити план' },
  syncSnapshot: { ru: 'Синхронизировать', en: 'Sync Snapshot', uk: 'Синхронізувати' },
  planName: { ru: 'Название', en: 'Name', uk: 'Назва' },
  audience: { ru: 'Аудитория', en: 'Audience', uk: 'Аудиторія' },
  routes: { ru: 'Маршруты', en: 'Routes', uk: 'Маршрути' },
  strategy: { ru: 'Стратегия', en: 'Strategy', uk: 'Стратегія' },
  lastSync: { ru: 'Последняя синхр.', en: 'Last Sync', uk: 'Остання синхр.' },
  status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
  never: { ru: 'Никогда', en: 'Never', uk: 'Ніколи' },
  portal: { ru: 'Портал', en: 'Portal', uk: 'Портал' },
  staff: { ru: 'Staff', en: 'Staff', uk: 'Staff' },
  noPlans: { ru: 'Нет offline планов', en: 'No offline plans', uk: 'Немає offline планів' },
  size: { ru: 'Размер', en: 'Size', uk: 'Розмір' },
  syncing: { ru: 'Синхронизация...', en: 'Syncing...', uk: 'Синхронізація...' },
  synced: { ru: 'Синхронизировано', en: 'Synced', uk: 'Синхронізовано' },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MbOfflinePanel() {
  const { locale } = useApp();
  const [plans, setPlans] = useState<OfflinePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/collections/offlineCachePlans')
      .then(r => r.json())
      .then(data => {
        setPlans(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSync = async (planId: string) => {
    setSyncing(planId);
    setSyncMessage(null);

    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update plan with new sync time
    const now = new Date().toISOString();
    setPlans(prev => prev.map(p => 
      p.id === planId ? { ...p, lastSyncedAt: now, status: 'active' as const } : p
    ));

    // Create audit event
    await fetch('/api/collections/auditEvents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'offline_sync',
        module: 'mobile',
        entityType: 'offlineCachePlan',
        entityId: planId,
        action: 'sync_snapshot',
        timestamp: now,
        userId: 'current-user',
        details: { syncedAt: now },
      }),
    }).catch(() => {});

    setSyncing(null);
    setSyncMessage(planId);
    setTimeout(() => setSyncMessage(null), 3000);
  };

  const availableRoutes = getAvailableRoutes();
  const strategies = getCacheStrategies();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plans List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">{labels.plans[locale]}</h3>
          <span className="text-sm text-stone-500">{plans.length} {locale === 'ru' ? 'планов' : 'plans'}</span>
        </div>
        
        {plans.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-sm">
            {labels.noPlans[locale]}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {plans.map((plan) => (
              <div key={plan.id} className="p-4 hover:bg-emerald-50/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-stone-800">{plan.planName}</span>
                      <MbStatusPill status={plan.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                      <span>{labels.audience[locale]}: {plan.audience === 'portal' ? labels.portal[locale] : labels.staff[locale]}</span>
                      <span>{labels.routes[locale]}: {plan.routesJson.length}</span>
                      <span>{labels.size[locale]}: {formatBytes(plan.payloadSizeBytes || 0)}</span>
                      <span>
                        {labels.lastSync[locale]}: {plan.lastSyncedAt 
                          ? new Date(plan.lastSyncedAt).toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US')
                          : labels.never[locale]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {plan.routesJson.slice(0, 3).map((route) => (
                        <span key={route} className="px-2 py-0.5 bg-stone-100 rounded text-xs text-stone-600">
                          {route}
                        </span>
                      ))}
                      {plan.routesJson.length > 3 && (
                        <span className="px-2 py-0.5 bg-stone-100 rounded text-xs text-stone-600">
                          +{plan.routesJson.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSync(plan.id)}
                    disabled={syncing === plan.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                  >
                    {syncing === plan.id ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {labels.syncing[locale]}
                      </>
                    ) : syncMessage === plan.id ? (
                      <>
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {labels.synced[locale]}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {labels.syncSnapshot[locale]}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Routes Reference */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">{labels.routes[locale]}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-stone-600 mb-2">{labels.portal[locale]}</h4>
            <div className="space-y-1">
              {availableRoutes.filter(r => r.audience === 'portal').map((route) => (
                <div key={route.path} className="flex items-center gap-2 text-sm">
                  <code className="px-2 py-0.5 bg-emerald-50 rounded text-emerald-700 text-xs">{route.path}</code>
                  <span className="text-stone-500">{route.label[locale]}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-stone-600 mb-2">{labels.staff[locale]}</h4>
            <div className="space-y-1">
              {availableRoutes.filter(r => r.audience === 'staff').map((route) => (
                <div key={route.path} className="flex items-center gap-2 text-sm">
                  <code className="px-2 py-0.5 bg-blue-50 rounded text-blue-700 text-xs">{route.path}</code>
                  <span className="text-stone-500">{route.label[locale]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
