'use client';

import React, { useState } from 'react';
import { ApiKey } from '../schema/apiKey';

interface ApiExplorerProps {
  apiKeys: ApiKey[];
}

interface Endpoint {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  params?: { key: string; label: string; required?: boolean }[];
}

const ENDPOINTS: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/public/networth',
    description: 'Получить данные о состоянии',
    params: [
      { key: 'scopeType', label: 'Тип скоупа' },
      { key: 'scopeId', label: 'ID скоупа' },
      { key: 'asOf', label: 'На дату (ISO)' },
    ],
  },
  {
    method: 'GET',
    path: '/api/public/performance',
    description: 'Получить данные о доходности',
    params: [
      { key: 'scopeType', label: 'Тип скоупа' },
      { key: 'scopeId', label: 'ID скоупа' },
      { key: 'periodStart', label: 'Начало периода' },
      { key: 'periodEnd', label: 'Конец периода' },
    ],
  },
  {
    method: 'GET',
    path: '/api/public/invoices',
    description: 'Получить список счетов',
    params: [
      { key: 'status', label: 'Статус' },
      { key: 'limit', label: 'Лимит' },
    ],
  },
  {
    method: 'GET',
    path: '/api/public/tasks',
    description: 'Получить список задач',
    params: [
      { key: 'status', label: 'Статус' },
      { key: 'assignee', label: 'Исполнитель' },
    ],
  },
  {
    method: 'GET',
    path: '/api/public/documents',
    description: 'Получить список документов (client-safe)',
    params: [
      { key: 'category', label: 'Категория' },
      { key: 'limit', label: 'Лимит' },
    ],
  },
  {
    method: 'POST',
    path: '/api/public/webhook/test',
    description: 'Тест webhook endpoint (демо)',
  },
];

export function ApiExplorer({ apiKeys }: ApiExplorerProps) {
  const [selectedKeyId, setSelectedKeyId] = useState<string>('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<{
    status: number;
    data: unknown;
    duration: number;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const activeKeys = apiKeys.filter((k) => k.status === 'active');

  const handleRun = async () => {
    if (!selectedKeyId) {
      setResponse({
        status: 401,
        data: null,
        duration: 0,
        error: 'Выберите API ключ',
      });
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      // Build query string
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
      });

      const url = `${selectedEndpoint.path}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const res = await fetch(url, {
        method: selectedEndpoint.method,
        headers: {
          'x-api-key': selectedKeyId,
          'Content-Type': 'application/json',
        },
      });

      const duration = Date.now() - startTime;
      const data = await res.json();

      setResponse({
        status: res.status,
        data,
        duration,
        error: res.ok ? undefined : data.error,
      });
    } catch (err) {
      setResponse({
        status: 0,
        data: null,
        duration: Date.now() - startTime,
        error: err instanceof Error ? err.message : 'Network error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Request Panel */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Запрос</h2>

        {/* API Key Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API ключ
          </label>
          <select
            value={selectedKeyId}
            onChange={(e) => setSelectedKeyId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Выберите ключ...</option>
            {activeKeys.map((key) => (
              <option key={key.id} value={key.id}>
                {key.name} ({key.keyMode})
              </option>
            ))}
          </select>
        </div>

        {/* Endpoint Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endpoint
          </label>
          <select
            value={selectedEndpoint.path}
            onChange={(e) => {
              const endpoint = ENDPOINTS.find((ep) => ep.path === e.target.value);
              if (endpoint) {
                setSelectedEndpoint(endpoint);
                setParams({});
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {ENDPOINTS.map((ep) => (
              <option key={ep.path} value={ep.path}>
                {ep.method} {ep.path}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">{selectedEndpoint.description}</p>
        </div>

        {/* Parameters */}
        {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Параметры
            </label>
            <div className="space-y-2">
              {selectedEndpoint.params.map((param) => (
                <div key={param.key} className="flex items-center gap-2">
                  <label className="w-32 text-sm text-gray-600">{param.label}</label>
                  <input
                    type="text"
                    value={params[param.key] || ''}
                    onChange={(e) => setParams({ ...params, [param.key]: e.target.value })}
                    placeholder={param.key}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Run Button */}
        <button
          onClick={handleRun}
          disabled={loading}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Выполняется...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run
            </>
          )}
        </button>

        {/* Request Preview */}
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">cURL</div>
          <pre className="text-sm text-emerald-400 font-mono overflow-x-auto">
{`curl -X ${selectedEndpoint.method} \\
  '${typeof window !== 'undefined' ? window.location.origin : ''}${selectedEndpoint.path}${
  Object.entries(params).filter(([, v]) => v).length > 0
    ? '?' + new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v))).toString()
    : ''
}' \\
  -H 'x-api-key: ${selectedKeyId || '<API_KEY>'}'`}
          </pre>
        </div>
      </div>

      {/* Response Panel */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Ответ</h2>

        {response ? (
          <>
            {/* Status Bar */}
            <div className={`p-3 rounded-lg flex items-center justify-between ${
              response.status >= 200 && response.status < 300
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold ${
                  response.status >= 200 && response.status < 300
                    ? 'text-emerald-700'
                    : 'text-red-700'
                }`}>
                  {response.status || 'ERR'}
                </span>
                <span className="text-sm text-gray-600">
                  {response.status === 200 ? 'OK' :
                   response.status === 401 ? 'Unauthorized' :
                   response.status === 403 ? 'Forbidden' :
                   response.status === 429 ? 'Too Many Requests' :
                   response.status === 500 ? 'Internal Server Error' : 'Error'}
                </span>
              </div>
              <span className="text-sm text-gray-500">{response.duration}ms</span>
            </div>

            {/* Error Message */}
            {response.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {response.error}
              </div>
            )}

            {/* Response Body */}
            <div className="p-4 bg-gray-900 rounded-lg max-h-96 overflow-auto">
              <pre className="text-sm text-amber-400 font-mono">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Нажмите Run для выполнения запроса</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
