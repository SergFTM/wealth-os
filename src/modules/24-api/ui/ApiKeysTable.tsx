'use client';

import React from 'react';
import Link from 'next/link';
import { ApiKey } from '../schema/apiKey';
import { ApiKeyScope } from '../schema/apiKeyScope';
import { ApiStatusPill } from './ApiStatusPill';
import { ApiScopeBadge } from './ApiScopeBadge';

interface ApiKeysTableProps {
  keys: ApiKey[];
  scopes: ApiKeyScope[];
  mini?: boolean;
  onRotate?: (keyId: string) => void;
  onRevoke?: (keyId: string) => void;
}

const modeLabels: Record<string, string> = {
  server: 'Серверный',
  advisor: 'Консультант',
  client: 'Клиентский',
};

const modeColors: Record<string, string> = {
  server: 'bg-purple-100 text-purple-700',
  advisor: 'bg-blue-100 text-blue-700',
  client: 'bg-emerald-100 text-emerald-700',
};

export function ApiKeysTable({ keys, scopes, mini = false, onRotate, onRevoke }: ApiKeysTableProps) {
  const displayKeys = mini ? keys.slice(0, 8) : keys;

  const getScopesCount = (keyId: string) => scopes.filter((s) => s.apiKeyId === keyId).length;

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: mini ? undefined : '2-digit',
    });
  };

  const isExpiringSoon = (expiresAt: string) => {
    const days = (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days < 30 && days > 0;
  };

  if (keys.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        <p>Нет API ключей</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-3 font-medium">Название</th>
            <th className="pb-3 font-medium">Режим</th>
            {!mini && <th className="pb-3 font-medium">Prefix</th>}
            <th className="pb-3 font-medium">Scopes</th>
            <th className="pb-3 font-medium">Истекает</th>
            <th className="pb-3 font-medium">Статус</th>
            {!mini && <th className="pb-3 font-medium">Посл. использование</th>}
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {displayKeys.map((key) => (
            <tr key={key.id} className="hover:bg-gray-50/50">
              <td className="py-3">
                <Link
                  href={`/m/api/key/${key.id}`}
                  className="font-medium text-gray-900 hover:text-emerald-600"
                >
                  {key.name}
                </Link>
              </td>
              <td className="py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${modeColors[key.keyMode]}`}>
                  {modeLabels[key.keyMode]}
                </span>
              </td>
              {!mini && (
                <td className="py-3">
                  <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                    {key.keyPrefix}...
                  </code>
                </td>
              )}
              <td className="py-3">
                <span className="text-gray-600">{getScopesCount(key.id)}</span>
              </td>
              <td className="py-3">
                <span className={isExpiringSoon(key.expiresAt) ? 'text-amber-600 font-medium' : ''}>
                  {formatDate(key.expiresAt)}
                </span>
              </td>
              <td className="py-3">
                <ApiStatusPill status={key.status} size="sm" />
              </td>
              {!mini && (
                <td className="py-3 text-gray-500">
                  {formatDate(key.lastUsedAt)}
                </td>
              )}
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <Link
                    href={`/m/api/key/${key.id}`}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 rounded"
                    title="Открыть"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  {!mini && key.status === 'active' && (
                    <>
                      <button
                        onClick={() => onRotate?.(key.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                        title="Ротация"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onRevoke?.(key.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                        title="Отозвать"
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
      {mini && keys.length > 8 && (
        <div className="mt-3 text-center">
          <Link href="/m/api/list?tab=keys" className="text-sm text-emerald-600 hover:underline">
            Показать все {keys.length} ключей →
          </Link>
        </div>
      )}
    </div>
  );
}
