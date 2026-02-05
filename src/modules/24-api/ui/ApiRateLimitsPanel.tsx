'use client';

import React from 'react';
import { RateLimit, windowKeyLabels } from '../schema/rateLimit';
import { ApiKey } from '../schema/apiKey';

interface ApiRateLimitsPanelProps {
  rateLimits: RateLimit[];
  apiKeys: ApiKey[];
  onEdit?: (rateLimitId: string) => void;
  onReset?: (apiKeyId: string) => void;
}

export function ApiRateLimitsPanel({
  rateLimits,
  apiKeys,
  onEdit,
  onReset,
}: ApiRateLimitsPanelProps) {
  const getKeyName = (apiKeyId: string) => {
    const key = apiKeys.find((k) => k.id === apiKeyId);
    return key?.name || apiKeyId.substring(0, 12);
  };

  const getUsagePercentage = (rl: RateLimit) => {
    if (rl.limit === 0) return 100;
    return Math.min(100, (rl.used / rl.limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  if (rateLimits.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p>Нет данных о лимитах</p>
      </div>
    );
  }

  // Group by API key
  const groupedByKey = rateLimits.reduce((acc, rl) => {
    if (!acc[rl.apiKeyId]) {
      acc[rl.apiKeyId] = [];
    }
    acc[rl.apiKeyId].push(rl);
    return acc;
  }, {} as Record<string, RateLimit[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedByKey).map(([apiKeyId, limits]) => {
        const totalHits = limits.reduce((sum, rl) => sum + rl.hits, 0);

        return (
          <div key={apiKeyId} className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{getKeyName(apiKeyId)}</span>
                {totalHits > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                    {totalHits} hits
                  </span>
                )}
              </div>
              {onReset && (
                <button
                  onClick={() => onReset(apiKeyId)}
                  className="text-sm text-gray-500 hover:text-emerald-600"
                >
                  Сбросить счетчики
                </button>
              )}
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {limits.map((rl) => {
                  const percentage = getUsagePercentage(rl);

                  return (
                    <div
                      key={rl.id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {windowKeyLabels[rl.windowKey]?.ru || rl.windowKey}
                        </span>
                        <span className="text-sm text-gray-500">
                          {rl.used} / {rl.limit}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getUsageColor(percentage)} transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {rl.hits > 0 && (
                        <div className="mt-2 text-xs text-red-600">
                          Превышений: {rl.hits}
                        </div>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(rl.id)}
                          className="mt-2 text-xs text-emerald-600 hover:underline"
                        >
                          Изменить лимит
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-lg border border-emerald-200">
        <h3 className="font-medium text-gray-900 mb-2">Сводка</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Всего ключей:</span>
            <span className="ml-2 font-medium">{Object.keys(groupedByKey).length}</span>
          </div>
          <div>
            <span className="text-gray-500">Всего hits:</span>
            <span className="ml-2 font-medium text-red-600">
              {rateLimits.reduce((sum, rl) => sum + rl.hits, 0)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Макс. использование:</span>
            <span className="ml-2 font-medium">
              {Math.max(...rateLimits.map(getUsagePercentage)).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
