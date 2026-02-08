"use client";

import { useState } from 'react';

interface AiAction {
  key: string;
  label: string;
  description: string;
  icon: string;
}

interface AiResult {
  action: string;
  result: unknown;
  sources: string[];
  confidence: number;
  assumptions: string[];
  requiresHumanReview: boolean;
}

interface PaAiPanelProps {
  onProposeContents?: () => Promise<AiResult>;
  onDraftCoverLetter?: () => Promise<AiResult>;
  onCheckMissingDocs?: () => Promise<AiResult>;
  isLoading?: boolean;
  lastResult?: AiResult | null;
}

const AI_ACTIONS: AiAction[] = [
  {
    key: 'propose_contents',
    label: 'Предложить состав',
    description: 'AI подберёт документы для пакета',
    icon: '📋',
  },
  {
    key: 'draft_cover_letter',
    label: 'Cover Letter',
    description: 'Сформировать сопроводительное письмо',
    icon: '✉️',
  },
  {
    key: 'check_missing_docs',
    label: 'Проверить полноту',
    description: 'Найти недостающие документы',
    icon: '🔍',
  },
];

export function PaAiPanel({
  onProposeContents,
  onDraftCoverLetter,
  onCheckMissingDocs,
  isLoading = false,
  lastResult,
}: PaAiPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const handleAction = async (key: string) => {
    switch (key) {
      case 'propose_contents':
        await onProposeContents?.();
        break;
      case 'draft_cover_letter':
        await onDraftCoverLetter?.();
        break;
      case 'check_missing_docs':
        await onCheckMissingDocs?.();
        break;
    }
  };

  return (
    <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl border border-violet-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-violet-100/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="font-medium text-stone-800">AI-ассистент</span>
          <span className="text-xs px-2 py-0.5 bg-violet-200 text-violet-700 rounded-full">Beta</span>
        </div>
        <svg
          className={`w-5 h-5 text-stone-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {AI_ACTIONS.map((action) => (
              <button
                key={action.key}
                onClick={() => handleAction(action.key)}
                disabled={isLoading}
                className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                  isLoading
                    ? 'bg-stone-100 border-stone-200 opacity-50 cursor-not-allowed'
                    : 'bg-white border-violet-200 hover:border-violet-400 hover:shadow-sm'
                }`}
              >
                <span className="text-xl">{action.icon}</span>
                <div>
                  <div className="text-sm font-medium text-stone-800">{action.label}</div>
                  <div className="text-xs text-stone-500">{action.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-violet-600">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm">Анализирую...</span>
              </div>
            </div>
          )}

          {/* Result */}
          {lastResult && !isLoading && (
            <AiResultDisplay result={lastResult} />
          )}

          {/* Disclaimer */}
          <div className="text-xs text-stone-500 bg-stone-100 p-2 rounded">
            ⚠️ AI-предложения требуют проверки человеком. Рекомендации основаны на типовых требованиях.
          </div>
        </div>
      )}
    </div>
  );
}

function AiResultDisplay({ result }: { result: AiResult }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-violet-200 p-4 space-y-3">
      {/* Confidence */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-stone-600">Уверенность</span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                result.confidence >= 0.8 ? 'bg-emerald-500' :
                result.confidence >= 0.6 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium">{Math.round(result.confidence * 100)}%</span>
        </div>
      </div>

      {/* Human Review Warning */}
      {result.requiresHumanReview && (
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-2 rounded text-sm">
          <span>⚠️</span>
          <span>Требуется проверка человеком</span>
        </div>
      )}

      {/* Sources */}
      {result.sources.length > 0 && (
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-violet-600 hover:text-violet-700"
          >
            {showDetails ? 'Скрыть детали ▲' : 'Показать детали ▼'}
          </button>
          {showDetails && (
            <div className="mt-2 space-y-2">
              <div>
                <div className="text-xs font-medium text-stone-500 mb-1">Источники:</div>
                <ul className="text-xs text-stone-600 list-disc list-inside">
                  {result.sources.map((source, idx) => (
                    <li key={idx}>{source}</li>
                  ))}
                </ul>
              </div>
              {result.assumptions.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-stone-500 mb-1">Допущения:</div>
                  <ul className="text-xs text-stone-600 list-disc list-inside">
                    {result.assumptions.map((assumption, idx) => (
                      <li key={idx}>{assumption}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PaAiCompact({
  onAction,
  isLoading,
}: {
  onAction: (action: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-stone-500 text-sm">AI:</span>
      {AI_ACTIONS.map((action) => (
        <button
          key={action.key}
          onClick={() => onAction(action.key)}
          disabled={isLoading}
          className="px-2 py-1 text-xs bg-violet-50 text-violet-700 rounded hover:bg-violet-100 disabled:opacity-50"
          title={action.description}
        >
          {action.icon} {action.label}
        </button>
      ))}
    </div>
  );
}
