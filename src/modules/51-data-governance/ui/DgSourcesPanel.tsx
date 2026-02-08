'use client';

import React from 'react';

interface Source {
  name: string;
  type: string;
  collection?: string;
  lastSync?: string;
  status?: 'ok' | 'warning' | 'error';
}

interface DgSourcesPanelProps {
  sources: Source[];
  locale?: 'ru' | 'en' | 'uk';
}

export function DgSourcesPanel({ sources, locale = 'ru' }: DgSourcesPanelProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusIcons = {
    ok: (
      <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  };

  const typeColors: Record<string, string> = {
    collection: 'bg-blue-100 text-blue-700',
    api: 'bg-purple-100 text-purple-700',
    custodian: 'bg-emerald-100 text-emerald-700',
    bank: 'bg-amber-100 text-amber-700',
    manual: 'bg-stone-100 text-stone-600',
  };

  return (
    <div className="rounded-xl border border-stone-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-200/50 bg-stone-50/50">
        <h4 className="text-sm font-semibold text-stone-700">
          {locale === 'ru' ? 'Источники данных' : 'Data Sources'}
        </h4>
      </div>
      <div className="divide-y divide-stone-100">
        {sources.map((source, idx) => (
          <div key={idx} className="px-4 py-3 flex items-center gap-3 hover:bg-stone-50/50 transition-colors">
            {statusIcons[source.status || 'ok']}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-stone-900 truncate">{source.name}</div>
              {source.collection && (
                <div className="text-xs text-stone-500">
                  {locale === 'ru' ? 'Коллекция:' : 'Collection:'} {source.collection}
                </div>
              )}
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${typeColors[source.type] || typeColors.manual}`}>
              {source.type}
            </span>
            <div className="text-xs text-stone-400 text-right">
              <div>{locale === 'ru' ? 'Синхр.' : 'Sync'}</div>
              <div>{formatDate(source.lastSync)}</div>
            </div>
          </div>
        ))}
        {sources.length === 0 && (
          <div className="px-4 py-6 text-center text-stone-500 text-sm">
            {locale === 'ru' ? 'Источники не определены' : 'No sources defined'}
          </div>
        )}
      </div>
    </div>
  );
}
