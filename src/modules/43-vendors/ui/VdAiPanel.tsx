"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface AiResult {
  type: string;
  content: string;
  confidence: number;
  assumptions: string[];
  sources: string[];
  generatedAt: string;
}

interface VdAiPanelProps {
  vendorId?: string;
  contractId?: string;
  onSummarizeContract?: () => Promise<AiResult>;
  onDetectAnomalies?: () => Promise<AiResult>;
  onDraftRenewalMemo?: () => Promise<AiResult>;
}

export function VdAiPanel({
  onSummarizeContract,
  onDetectAnomalies,
  onDraftRenewalMemo,
}: VdAiPanelProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<AiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: string, fn?: () => Promise<AiResult>) => {
    if (!fn) return;

    setLoading(action);
    setError(null);
    setResult(null);

    try {
      const res = await fn();
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка выполнения');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="font-semibold text-stone-800">AI Ассистент</h3>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="secondary"
          onClick={() => handleAction('summarize', onSummarizeContract)}
          disabled={!!loading || !onSummarizeContract}
        >
          {loading === 'summarize' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Анализ...
            </span>
          ) : (
            'Резюме контракта'
          )}
        </Button>

        <Button
          variant="secondary"
          onClick={() => handleAction('anomalies', onDetectAnomalies)}
          disabled={!!loading || !onDetectAnomalies}
        >
          {loading === 'anomalies' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Анализ...
            </span>
          ) : (
            'Анализ аномалий'
          )}
        </Button>

        <Button
          variant="secondary"
          onClick={() => handleAction('renewal', onDraftRenewalMemo)}
          disabled={!!loading || !onDraftRenewalMemo}
        >
          {loading === 'renewal' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Генерация...
            </span>
          ) : (
            'Меморандум продления'
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="border border-stone-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-stone-50 px-4 py-2 border-b border-stone-200 flex items-center justify-between">
            <span className="text-sm font-medium text-stone-700">Результат</span>
            <div className="flex items-center gap-3 text-xs text-stone-500">
              <span>Уверенность: {result.confidence}%</span>
              <button
                onClick={() => setResult(null)}
                className="hover:text-stone-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="prose prose-sm prose-stone max-w-none">
              <pre className="whitespace-pre-wrap text-sm font-sans text-stone-700">
                {result.content}
              </pre>
            </div>
          </div>

          {/* Footer */}
          {(result.assumptions.length > 0 || result.sources.length > 0) && (
            <div className="bg-stone-50 px-4 py-3 border-t border-stone-200 text-xs">
              {result.assumptions.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium text-stone-600">Допущения: </span>
                  <span className="text-stone-500">{result.assumptions.join('; ')}</span>
                </div>
              )}
              {result.sources.length > 0 && (
                <div>
                  <span className="font-medium text-stone-600">Источники: </span>
                  <span className="text-stone-500">{result.sources.join('; ')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 text-xs text-stone-400">
        AI-результаты требуют проверки. Не является юридической консультацией.
      </div>
    </div>
  );
}
