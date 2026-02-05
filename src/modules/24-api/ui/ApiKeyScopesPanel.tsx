'use client';

import React from 'react';
import { ApiKeyScope } from '../schema/apiKeyScope';
import { ApiScopeBadge } from './ApiScopeBadge';

interface ApiKeyScopesPanelProps {
  scopes: ApiKeyScope[];
  editable?: boolean;
  onRemove?: (scopeId: string) => void;
  onAdd?: () => void;
}

const actionLabels: Record<string, string> = {
  view: 'Просмотр',
  create: 'Создание',
  edit: 'Редактирование',
  approve: 'Утверждение',
  export: 'Экспорт',
};

const scopeTypeLabels: Record<string, string> = {
  global: 'Глобальный',
  household: 'Домохозяйство',
  entity: 'Структура',
  portfolio: 'Портфель',
};

export function ApiKeyScopesPanel({ scopes, editable, onRemove, onAdd }: ApiKeyScopesPanelProps) {
  // Group scopes by module
  const scopesByModule = scopes.reduce((acc, scope) => {
    if (!acc[scope.moduleKey]) {
      acc[scope.moduleKey] = [];
    }
    acc[scope.moduleKey].push(scope);
    return acc;
  }, {} as Record<string, ApiKeyScope[]>);

  if (scopes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border rounded-lg">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p>Нет scopes</p>
        {editable && onAdd && (
          <button
            onClick={onAdd}
            className="mt-2 text-sm text-emerald-600 hover:underline"
          >
            Добавить scope
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(scopesByModule).map(([moduleKey, moduleScopes]) => (
        <div key={moduleKey} className="border rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b">
            <span className="font-mono font-medium text-gray-700">{moduleKey}</span>
            <span className="ml-2 text-xs text-gray-500">({moduleScopes.length})</span>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {moduleScopes.map((scope) => (
                <div
                  key={scope.id}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm"
                >
                  <span className="font-medium">{actionLabels[scope.actionKey]}</span>
                  <span className="text-gray-400">•</span>
                  <ApiScopeBadge scopeType={scope.scopeType} compact />
                  {scope.scopeId && (
                    <span className="text-xs text-gray-500 font-mono">
                      :{scope.scopeId.substring(0, 8)}
                    </span>
                  )}
                  {scope.clientSafe && (
                    <span className="px-1 bg-emerald-100 text-emerald-700 text-xs rounded">
                      safe
                    </span>
                  )}
                  {editable && onRemove && (
                    <button
                      onClick={() => onRemove(scope.id)}
                      className="ml-1 text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {editable && onAdd && (
        <button
          onClick={onAdd}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить scope
        </button>
      )}
    </div>
  );
}
