"use client";

import { useState } from 'react';

interface AiSuggestion {
  id: string;
  title: string;
  description: string;
  confidence: number;
  type: string;
}

interface MdAiPanelProps {
  suggestions?: AiSuggestion[];
  onSuggestDuplicates?: () => void;
  onSuggestMerge?: () => void;
  onNormalizeAddress?: () => void;
  isLoading?: boolean;
}

export function MdAiPanel({
  suggestions = [],
  onSuggestDuplicates,
  onSuggestMerge,
  onNormalizeAddress,
  isLoading,
}: MdAiPanelProps) {
  const [query, setQuery] = useState('');

  const quickActions = [
    { label: 'Найди вероятные дубли', onClick: onSuggestDuplicates },
    { label: 'Предложи merge план', onClick: onSuggestMerge },
    { label: 'Нормализуй адрес', onClick: onNormalizeAddress },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl border border-indigo-200/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-stone-800">AI Assistant</h3>
          <p className="text-xs text-stone-500">Помощь в управлении данными</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs bg-white/80 border border-indigo-200 rounded-full text-indigo-700 hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Custom query input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Задайте вопрос..."
          className="w-full px-4 py-2 pr-10 bg-white/80 border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-indigo-500 hover:text-indigo-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-indigo-600 mb-4">
          <div className="animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
          <span>Анализирую данные...</span>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-3 bg-white/80 rounded-lg border border-indigo-100"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-stone-800">{suggestion.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  {suggestion.confidence}%
                </span>
              </div>
              <p className="text-xs text-stone-600">{suggestion.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 p-2 bg-amber-50/80 rounded-lg border border-amber-200/50">
        <p className="text-xs text-amber-700 flex items-start gap-1">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          MDM рекомендации носят информационный характер. Слияние записей требует подтверждения ответственным лицом.
        </p>
      </div>
    </div>
  );
}
