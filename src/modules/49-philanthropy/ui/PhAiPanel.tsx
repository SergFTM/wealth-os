"use client";

import { useState } from 'react';

type AiAction = 'summary' | 'ddChecklist' | 'impactNarrative';

interface PhAiPanelProps {
  onGenerate?: (action: AiAction) => void;
  isLoading?: boolean;
  result?: {
    content: string;
    sources: string[];
    confidence: 'high' | 'medium' | 'low';
    assumptions: string[];
    disclaimer: string;
  };
}

export function PhAiPanel({ onGenerate, isLoading = false, result }: PhAiPanelProps) {
  const [activeAction, setActiveAction] = useState<AiAction | null>(null);

  const handleGenerate = (action: AiAction) => {
    setActiveAction(action);
    onGenerate?.(action);
  };

  const actions = [
    {
      key: 'summary' as AiAction,
      label: 'Краткое описание гранта',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: 'ddChecklist' as AiAction,
      label: 'Чеклист Due Diligence',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      key: 'impactNarrative' as AiAction,
      label: 'Нарратив Impact Report',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50/80 to-amber-50/50 backdrop-blur-sm rounded-xl border border-emerald-200/50">
      <div className="px-4 py-3 border-b border-emerald-200/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-stone-800">AI Ассистент</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.key}
              onClick={() => handleGenerate(action.key)}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isLoading && activeAction === action.key
                  ? 'bg-emerald-100 text-emerald-700 animate-pulse'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-emerald-300'
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Генерация...
          </div>
        )}

        {/* Result */}
        {result && !isLoading && (
          <div className="space-y-3">
            <div className="bg-white rounded-lg border border-stone-200 p-4">
              <div className="prose prose-sm max-w-none text-stone-700">
                <div className="whitespace-pre-wrap">{result.content}</div>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-xs text-stone-500">
              <div className="flex items-center gap-1">
                <span>Уверенность:</span>
                <span className={`font-medium ${
                  result.confidence === 'high' ? 'text-green-600' :
                  result.confidence === 'medium' ? 'text-amber-600' :
                  'text-red-600'
                }`}>
                  {result.confidence === 'high' ? 'Высокая' :
                   result.confidence === 'medium' ? 'Средняя' : 'Низкая'}
                </span>
              </div>
              {result.sources.length > 0 && (
                <div className="flex items-center gap-1">
                  <span>Источники:</span>
                  <span className="font-medium">{result.sources.join(', ')}</span>
                </div>
              )}
            </div>

            {result.assumptions.length > 0 && (
              <div className="text-xs text-stone-500">
                <span className="font-medium">Допущения:</span> {result.assumptions.join('; ')}
              </div>
            )}

            {/* Disclaimer */}
            <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
              ⚠️ {result.disclaimer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
