'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { MbStatusPill } from './MbStatusPill';

interface QuickAction {
  id: string;
  clientId: string;
  audience: 'staff' | 'client';
  actionType: string;
  title: string;
  description?: string;
  icon: string;
  deepLink: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceType: string;
  sourceId: string;
  priority: number;
  status: 'active' | 'completed';
  createdAt: string;
}

const labels = {
  title: { ru: 'Быстрые действия', en: 'Quick Actions', uk: 'Швидкі дії' },
  generate: { ru: 'Сгенерировать', en: 'Generate', uk: 'Згенерувати' },
  noActions: { ru: 'Нет быстрых действий', en: 'No quick actions', uk: 'Немає швидких дій' },
  active: { ru: 'Активные', en: 'Active', uk: 'Активні' },
  all: { ru: 'Все', en: 'All', uk: 'Всі' },
  staff: { ru: 'Staff', en: 'Staff', uk: 'Staff' },
  client: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' },
  preview: { ru: 'Превью мобильного', en: 'Mobile Preview', uk: 'Превью мобільного' },
  generating: { ru: 'Генерация...', en: 'Generating...', uk: 'Генерація...' },
  generated: { ru: 'Сгенерировано!', en: 'Generated!', uk: 'Згенеровано!' },
};

const actionTypeLabels: Record<string, { ru: string; en: string; uk: string }> = {
  approve_item: { ru: 'Согласовать', en: 'Approve', uk: 'Погодити' },
  view_risk_alert: { ru: 'Риск-алерт', en: 'Risk Alert', uk: 'Ризик-алерт' },
  open_report: { ru: 'Открыть отчет', en: 'Open Report', uk: 'Відкрити звіт' },
  open_task: { ru: 'Открыть задачу', en: 'Open Task', uk: 'Відкрити задачу' },
  open_thread: { ru: 'Сообщение', en: 'Message', uk: 'Повідомлення' },
  view_document: { ru: 'Документ', en: 'Document', uk: 'Документ' },
  pay_invoice: { ru: 'Оплатить счет', en: 'Pay Invoice', uk: 'Оплатити рахунок' },
};

export function MbQuickActionsPanel() {
  const { locale } = useApp();
  const [actions, setActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active'>('active');
  const [audienceFilter, setAudienceFilter] = useState<'all' | 'staff' | 'client'>('all');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    fetch('/api/collections/quickActions')
      .then(r => r.json())
      .then(data => {
        const sorted = (data || []).sort((a: QuickAction, b: QuickAction) => b.priority - a.priority);
        setActions(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(false);

    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const now = new Date().toISOString();
    
    // Audit
    await fetch('/api/collections/auditEvents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'quick_actions_generated',
        module: 'mobile',
        entityType: 'quickActions',
        action: 'generate',
        timestamp: now,
        userId: 'current-user',
        details: { count: actions.filter(a => a.status === 'active').length },
      }),
    }).catch(() => {});

    setGenerating(false);
    setGenerated(true);
    setTimeout(() => setGenerated(false), 3000);
  };

  const filteredActions = actions
    .filter(a => filter === 'all' || a.status === 'active')
    .filter(a => audienceFilter === 'all' || a.audience === audienceFilter);

  const activeCount = actions.filter(a => a.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-60"
        >
          {generating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {labels.generating[locale]}
            </>
          ) : generated ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {labels.generated[locale]}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {labels.generate[locale]}
            </>
          )}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-white/80 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {labels.active[locale]} ({activeCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-emerald-100 text-emerald-700' : 'bg-white/80 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {labels.all[locale]} ({actions.length})
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setAudienceFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              audienceFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-white/80 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {labels.all[locale]}
          </button>
          <button
            onClick={() => setAudienceFilter('staff')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              audienceFilter === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-white/80 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {labels.staff[locale]}
          </button>
          <button
            onClick={() => setAudienceFilter('client')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              audienceFilter === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-white/80 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {labels.client[locale]}
          </button>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActions.length === 0 ? (
          <div className="col-span-full p-8 text-center text-stone-500 text-sm bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50">
            {labels.noActions[locale]}
          </div>
        ) : (
          filteredActions.slice(0, 12).map((action) => (
            <Link
              key={action.id}
              href={action.deepLink}
              className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-4 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  action.severity === 'critical' ? 'bg-red-100 text-red-600' :
                  action.severity === 'high' ? 'bg-amber-100 text-amber-600' :
                  action.severity === 'medium' ? 'bg-blue-100 text-blue-600' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-stone-800 group-hover:text-emerald-700 transition-colors">
                    {action.title}
                  </div>
                  {action.description && (
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{action.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-stone-100 rounded text-xs text-stone-600">
                      {actionTypeLabels[action.actionType]?.[locale] || action.actionType}
                    </span>
                    <MbStatusPill status={action.severity} />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Mobile Preview */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">{labels.preview[locale]}</h3>
        <div className="max-w-xs mx-auto">
          <div className="bg-stone-900 rounded-3xl p-3 shadow-xl">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="h-6 bg-gradient-to-r from-emerald-500 to-amber-500 flex items-center justify-center">
                <div className="w-16 h-1 bg-white/30 rounded-full"></div>
              </div>
              <div className="p-4 space-y-2">
                {filteredActions.slice(0, 3).map((action) => (
                  <div key={action.id} className="flex items-center gap-3 p-2 bg-stone-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      action.severity === 'critical' ? 'bg-red-100 text-red-600' :
                      action.severity === 'high' ? 'bg-amber-100 text-amber-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-stone-800 truncate">{action.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
