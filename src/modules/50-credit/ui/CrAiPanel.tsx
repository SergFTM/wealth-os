"use client";

import { useState } from 'react';
import { CreditLoan, CreditFacility, CreditCovenant, CreditPayment } from '../engine/types';
import {
  explainInterestCost,
  generateCovenantRiskMemo,
  generateRefinancingChecklist,
} from '../engine/aiCreditAssistant';

interface CrAiPanelProps {
  loans: CreditLoan[];
  facilities: CreditFacility[];
  covenants: CreditCovenant[];
  payments: CreditPayment[];
  currency?: string;
}

type AiAction = 'interest' | 'covenant' | 'refinancing';

export function CrAiPanel({
  loans,
  facilities,
  covenants,
  payments,
  currency = 'USD',
}: CrAiPanelProps) {
  const [selectedAction, setSelectedAction] = useState<AiAction | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    content: string;
    sources: string[];
    confidence: string;
    assumptions: string[];
    disclaimer: string;
  } | null>(null);

  const handleRunAction = async () => {
    setIsLoading(true);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      switch (selectedAction) {
        case 'interest':
          setResult(explainInterestCost(loans, payments, currency));
          break;
        case 'covenant':
          setResult(generateCovenantRiskMemo(covenants, facilities));
          break;
        case 'refinancing':
          if (selectedFacilityId) {
            const facility = facilities.find((f) => f.id === selectedFacilityId);
            if (facility) {
              const facilityLoans = loans.filter((l) => l.facilityId === facility.id);
              setResult(generateRefinancingChecklist(facility, facilityLoans));
            }
          }
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const actions = [
    {
      key: 'interest' as AiAction,
      label: 'Анализ процентных расходов',
      description: 'Объяснение текущих расходов на проценты YTD',
    },
    {
      key: 'covenant' as AiAction,
      label: 'Оценка ковенантных рисков',
      description: 'Memo о состоянии ковенантов и рекомендации',
    },
    {
      key: 'refinancing' as AiAction,
      label: 'План рефинансирования',
      description: 'Чек-лист подготовки к рефинансированию',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Action Selection */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <h3 className="font-semibold text-stone-800 mb-3">AI Credit Assistant</h3>
        <div className="space-y-2">
          {actions.map((action) => (
            <button
              key={action.key}
              onClick={() => {
                setSelectedAction(action.key);
                setResult(null);
              }}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedAction === action.key
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <div className="font-medium text-stone-800">{action.label}</div>
              <div className="text-xs text-stone-500 mt-0.5">{action.description}</div>
            </button>
          ))}
        </div>

        {/* Facility Selection for Refinancing */}
        {selectedAction === 'refinancing' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Выберите facility для анализа
            </label>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Выберите...</option>
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({new Date(f.maturityAt).toLocaleDateString('ru-RU')})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Run Button */}
        <button
          onClick={handleRunAction}
          disabled={
            !selectedAction ||
            isLoading ||
            (selectedAction === 'refinancing' && !selectedFacilityId)
          }
          className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Анализ...' : 'Запустить анализ'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {/* Content */}
          <div className="p-4 prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-stone-700">{result.content}</div>
          </div>

          {/* Meta */}
          <div className="border-t border-stone-100 p-4 bg-stone-50 space-y-3">
            {/* Confidence */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Уверенность:</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  result.confidence === 'high'
                    ? 'bg-emerald-100 text-emerald-700'
                    : result.confidence === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                }`}
              >
                {result.confidence === 'high' ? 'Высокая' : result.confidence === 'medium' ? 'Средняя' : 'Низкая'}
              </span>
            </div>

            {/* Sources */}
            <div>
              <div className="text-xs text-stone-500 mb-1">Источники:</div>
              <div className="flex flex-wrap gap-1">
                {result.sources.map((source, i) => (
                  <span key={i} className="text-xs bg-stone-200 text-stone-600 px-2 py-0.5 rounded">
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {/* Assumptions */}
            {result.assumptions.length > 0 && (
              <div>
                <div className="text-xs text-stone-500 mb-1">Допущения:</div>
                <ul className="text-xs text-stone-600 list-disc list-inside space-y-0.5">
                  {result.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="text-xs text-stone-400 italic pt-2 border-t border-stone-200">
              {result.disclaimer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
