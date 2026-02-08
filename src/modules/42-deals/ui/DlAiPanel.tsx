"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface AiResult {
  content: string;
  confidence: 'high' | 'medium' | 'low';
  assumptions: string[];
  sources: string[];
  generatedAt: string;
  disclaimer: string;
}

interface DlAiPanelProps {
  onSummarizeDealPack?: () => Promise<AiResult>;
  onGenerateChecklist?: () => Promise<AiResult>;
  onDraftApprovalMemo?: () => Promise<AiResult>;
}

const CONFIDENCE_COLORS = {
  high: 'text-emerald-600 bg-emerald-50',
  medium: 'text-amber-600 bg-amber-50',
  low: 'text-red-600 bg-red-50',
};

const CONFIDENCE_LABELS = {
  high: 'Высокая',
  medium: 'Средняя',
  low: 'Низкая',
};

export function DlAiPanel({ onSummarizeDealPack, onGenerateChecklist, onDraftApprovalMemo }: DlAiPanelProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<AiResult | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleAction = async (action: string, handler?: () => Promise<AiResult>) => {
    if (!handler) return;

    setLoading(action);
    setResult(null);

    try {
      const res = await handler();
      setResult(res);
      setExpanded(true);
    } catch (error) {
      console.error('AI action failed:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl border border-emerald-200/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-emerald-200/50">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="font-semibold text-stone-800">AI-ассистент</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={loading !== null}
            onClick={() => handleAction('summarize', onSummarizeDealPack)}
          >
            {loading === 'summarize' ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin">◌</span> Анализ...
              </span>
            ) : (
              'Резюме deal pack'
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            disabled={loading !== null}
            onClick={() => handleAction('checklist', onGenerateChecklist)}
          >
            {loading === 'checklist' ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin">◌</span> Генерация...
              </span>
            ) : (
              'Сгенерировать checklist'
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            disabled={loading !== null}
            onClick={() => handleAction('memo', onDraftApprovalMemo)}
          >
            {loading === 'memo' ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin">◌</span> Создание...
              </span>
            ) : (
              'Draft approval memo'
            )}
          </Button>
        </div>

        {result && (
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            <div className="px-3 py-2 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${CONFIDENCE_COLORS[result.confidence]}`}>
                  Уверенность: {CONFIDENCE_LABELS[result.confidence]}
                </span>
                <span className="text-xs text-stone-500">
                  {new Date(result.generatedAt).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-stone-500 hover:text-stone-700"
              >
                {expanded ? '▼' : '▶'}
              </button>
            </div>

            {expanded && (
              <div className="p-3 space-y-3">
                <div className="prose prose-sm max-w-none prose-stone prose-headings:text-stone-800">
                  <div
                    className="text-sm text-stone-700 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: result.content
                        .replace(/^## /gm, '<h4 class="font-semibold mt-3 mb-1">')
                        .replace(/^### /gm, '<h5 class="font-medium mt-2">')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>'),
                    }}
                  />
                </div>

                {result.assumptions.length > 0 && (
                  <div className="bg-amber-50 rounded-lg p-2">
                    <h5 className="text-xs font-medium text-amber-700 mb-1">Допущения:</h5>
                    <ul className="text-xs text-amber-600 space-y-0.5">
                      {result.assumptions.map((a, i) => (
                        <li key={i}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.sources.length > 0 && (
                  <div className="bg-stone-50 rounded-lg p-2">
                    <h5 className="text-xs font-medium text-stone-600 mb-1">Источники:</h5>
                    <ul className="text-xs text-stone-500 space-y-0.5">
                      {result.sources.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-red-50 rounded-lg p-2">
                  <p className="text-xs text-red-600">
                    <strong>Дисклеймер:</strong> {result.disclaimer}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {!result && (
          <p className="text-xs text-stone-500 text-center">
            Выберите действие для AI-анализа. Результаты на русском языке.
          </p>
        )}
      </div>
    </div>
  );
}

export default DlAiPanel;
