"use client";

import { useApp } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { NetWorthSourceBadge } from './NetWorthSourceBadge';

interface Valuation {
  id: string;
  value: number;
  currency: string;
  method: string;
  asOf: string;
  status: string;
  sourceType?: string;
  sourceRef?: string;
}

interface NetWorthValuationPanelProps {
  currentValuation?: Valuation;
  valuationHistory: Valuation[];
  loading?: boolean;
  onAddValuation: () => void;
  onCreateTask: () => void;
}

function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CHF: 'CHF ', RUB: '₽' };
  const symbol = symbols[currency] || currency + ' ';
  if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
  return `${symbol}${value.toLocaleString()}`;
}

function getStatusVariant(status: string): 'ok' | 'warning' | 'critical' | 'pending' {
  switch (status) {
    case 'priced': return 'ok';
    case 'estimated': return 'pending';
    case 'stale': return 'warning';
    case 'missing': return 'critical';
    default: return 'pending';
  }
}

export function NetWorthValuationPanel({ 
  currentValuation, 
  valuationHistory, 
  loading, 
  onAddValuation,
  onCreateTask 
}: NetWorthValuationPanelProps) {
  const { locale } = useApp();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-stone-100 rounded-lg animate-pulse" />
        <div className="h-48 bg-stone-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  const needsAttention = !currentValuation || currentValuation.status === 'stale' || currentValuation.status === 'missing';

  return (
    <div className="space-y-4">
      {/* Current Valuation */}
      <div className="bg-stone-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-stone-700">
            {locale === 'ru' ? 'Текущая оценка' : 'Current Valuation'}
          </h4>
          {currentValuation && (
            <StatusBadge status={getStatusVariant(currentValuation.status)} label={currentValuation.status} />
          )}
        </div>

        {currentValuation ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-stone-800">
                {formatCurrency(currentValuation.value, currentValuation.currency)}
              </span>
              <span className="text-sm text-stone-500">
                {new Date(currentValuation.asOf).toLocaleDateString('ru-RU')}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">{locale === 'ru' ? 'Метод:' : 'Method:'}</span>
              <span className="font-medium text-stone-700 capitalize">{currentValuation.method}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">{locale === 'ru' ? 'Источник:' : 'Source:'}</span>
              <NetWorthSourceBadge 
                sourceType={currentValuation.sourceType} 
                sourceRef={currentValuation.sourceRef}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-stone-400 mb-2">{locale === 'ru' ? 'Нет данных об оценке' : 'No valuation data'}</p>
          </div>
        )}
      </div>

      {/* Warning if needs attention */}
      {needsAttention && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-amber-800">
                {locale === 'ru' ? 'Требуется уточнение оценки' : 'Valuation needs attention'}
              </p>
              <p className="text-sm text-amber-600 mt-1">
                {locale === 'ru' 
                  ? 'Оценка отсутствует или устарела. Создайте задачу на обновление.'
                  : 'Valuation is missing or stale. Create a task to update it.'}
              </p>
              <div className="flex gap-2 mt-3">
                <Button variant="primary" size="sm" onClick={onCreateTask}>
                  {locale === 'ru' ? 'Создать задачу' : 'Create Task'}
                </Button>
                <Button variant="secondary" size="sm" onClick={onAddValuation}>
                  {locale === 'ru' ? 'Добавить оценку' : 'Add Valuation'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Valuation History */}
      {valuationHistory.length > 0 && (
        <div>
          <h4 className="font-semibold text-stone-700 mb-3">
            {locale === 'ru' ? 'История оценок' : 'Valuation History'}
          </h4>
          <div className="space-y-2">
            {valuationHistory.slice(0, 5).map((val) => (
              <div 
                key={val.id} 
                className="flex items-center justify-between py-2 px-3 bg-stone-50 rounded-lg text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-stone-800">
                    {formatCurrency(val.value, val.currency)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-stone-200 text-stone-600 capitalize">
                    {val.method}
                  </span>
                </div>
                <span className="text-stone-500">
                  {new Date(val.asOf).toLocaleDateString('ru-RU')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Valuation Button */}
      <Button variant="secondary" size="sm" onClick={onAddValuation} className="w-full">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {locale === 'ru' ? 'Добавить оценку' : 'Add Valuation'}
      </Button>
    </div>
  );
}
