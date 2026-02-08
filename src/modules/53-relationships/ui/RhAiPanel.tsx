"use client";

import React, { useState } from 'react';

export interface AiSuggestion {
  type: 'summary' | 'draft' | 'next_action';
  content: string;
  confidence: 'high' | 'medium' | 'low';
  sources: string[];
  assumptions: string[];
  disclaimer: string;
}

interface RhAiPanelProps {
  householdName?: string;
  onSummarize?: () => Promise<AiSuggestion>;
  onDraftFollowUp?: () => Promise<AiSuggestion>;
  onSuggestNextAction?: () => Promise<AiSuggestion>;
  initialSuggestion?: AiSuggestion | null;
}

export function RhAiPanel({
  householdName,
  onSummarize,
  onDraftFollowUp,
  onSuggestNextAction,
  initialSuggestion,
}: RhAiPanelProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(initialSuggestion || null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAction = async (
    action: 'summarize' | 'draft' | 'next_action',
    handler?: () => Promise<AiSuggestion>
  ) => {
    if (!handler) return;

    setLoading(true);
    setActiveAction(action);
    try {
      const result = await handler();
      setSuggestion(result);
    } catch (error) {
      console.error('AI action failed:', error);
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const confidenceColors = {
    high: 'text-emerald-600 bg-emerald-50',
    medium: 'text-amber-600 bg-amber-50',
    low: 'text-red-600 bg-red-50',
  };

  const confidenceLabels = {
    high: 'Высокая',
    medium: 'Средняя',
    low: 'Низкая',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <h3 className="font-semibold text-gray-800">AI-помощник</h3>
          {householdName && (
            <span className="text-sm text-gray-500">• {householdName}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAction('summarize', onSummarize)}
            disabled={loading || !onSummarize}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-all
              ${activeAction === 'summarize'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}
              ${(!onSummarize || loading) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {activeAction === 'summarize' && loading ? '⏳' : '📊'}
            Сводка
          </button>

          <button
            onClick={() => handleAction('draft', onDraftFollowUp)}
            disabled={loading || !onDraftFollowUp}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-all
              ${activeAction === 'draft'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}
              ${(!onDraftFollowUp || loading) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {activeAction === 'draft' && loading ? '⏳' : '✉️'}
            Черновик письма
          </button>

          <button
            onClick={() => handleAction('next_action', onSuggestNextAction)}
            disabled={loading || !onSuggestNextAction}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-all
              ${activeAction === 'next_action'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}
              ${(!onSuggestNextAction || loading) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {activeAction === 'next_action' && loading ? '⏳' : '💡'}
            Следующий шаг
          </button>
        </div>
      </div>

      {/* Result */}
      {suggestion && (
        <div className="p-4">
          {/* Content */}
          <div className="prose prose-sm max-w-none mb-4">
            <div className="whitespace-pre-wrap text-gray-700">
              {suggestion.content}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Уверенность:</span>
              <span className={`px-2 py-0.5 rounded ${confidenceColors[suggestion.confidence]}`}>
                {confidenceLabels[suggestion.confidence]}
              </span>
            </div>

            {suggestion.sources.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 shrink-0">Источники:</span>
                <span className="text-gray-600">{suggestion.sources.join(', ')}</span>
              </div>
            )}

            {suggestion.assumptions.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 shrink-0">Допущения:</span>
                <span className="text-gray-600">{suggestion.assumptions.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
            <p className="text-xs text-amber-700 flex items-start gap-2">
              <span>⚠️</span>
              <span>{suggestion.disclaimer}</span>
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!suggestion && !loading && (
        <div className="p-6 text-center text-gray-500 text-sm">
          Выберите действие для получения AI-рекомендаций
        </div>
      )}

      {/* Loading state */}
      {loading && !suggestion && (
        <div className="p-6 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <span className="animate-spin">⏳</span>
            <span>Анализирую данные...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RhAiPanel;
