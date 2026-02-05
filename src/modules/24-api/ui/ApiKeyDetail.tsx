'use client';

import React from 'react';
import { ApiKey } from '../schema/apiKey';
import { ApiKeyScope } from '../schema/apiKeyScope';
import { ApiStatusPill } from './ApiStatusPill';
import { ApiKeyScopesPanel } from './ApiKeyScopesPanel';

interface ApiKeyDetailProps {
  apiKey: ApiKey;
  scopes: ApiKeyScope[];
  onRotate?: () => void;
  onRevoke?: () => void;
  onEdit?: () => void;
}

const modeLabels: Record<string, string> = {
  server: 'Серверный',
  advisor: 'Консультант',
  client: 'Клиентский',
};

export function ApiKeyDetail({ apiKey, scopes, onRotate, onRevoke, onEdit }: ApiKeyDetailProps) {
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

  const isExpiringSoon = () => {
    const days = (new Date(apiKey.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days < 30 && days > 0;
  };

  const isExpired = new Date(apiKey.expiresAt) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{apiKey.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <ApiStatusPill status={apiKey.status} />
            <span className="text-sm text-gray-500">
              Режим: <span className="font-medium">{modeLabels[apiKey.keyMode]}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {apiKey.status === 'active' && (
            <>
              <button
                onClick={onRotate}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Ротация
              </button>
              <button
                onClick={onRevoke}
                className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Отозвать
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expiry Warning */}
      {isExpiringSoon() && !isExpired && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">Ключ истекает {formatDate(apiKey.expiresAt)}</span>
          </div>
          <p className="mt-1 text-sm text-amber-600">
            Рекомендуется выполнить ротацию ключа до истечения срока действия.
          </p>
        </div>
      )}

      {isExpired && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Ключ истек</span>
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Prefix</div>
          <div className="mt-1 font-mono text-sm">{apiKey.keyPrefix}...</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Создан</div>
          <div className="mt-1 text-sm">{formatDate(apiKey.createdAt)}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Истекает</div>
          <div className={`mt-1 text-sm ${isExpiringSoon() ? 'text-amber-600 font-medium' : ''}`}>
            {formatDate(apiKey.expiresAt)}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Последнее использование</div>
          <div className="mt-1 text-sm">{formatDate(apiKey.lastUsedAt)}</div>
        </div>
      </div>

      {/* Notes */}
      {apiKey.notes && (
        <div className="p-4 border rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Заметки</div>
          <p className="text-sm text-gray-600">{apiKey.notes}</p>
        </div>
      )}

      {/* Scopes */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Scopes ({scopes.length})
        </h2>
        <ApiKeyScopesPanel scopes={scopes} />
      </div>
    </div>
  );
}
