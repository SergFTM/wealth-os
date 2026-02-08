'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { summarizeException, AiAnalysisResult } from '../engine/aiExceptionAssistant';
import { Exception } from '../engine/exceptionRouter';

interface ExAiPanelProps {
  exception?: Exception | null;
  onApplyStep?: (step: string) => void;
  className?: string;
}

export function ExAiPanel({ exception, onApplyStep, className }: ExAiPanelProps) {
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
    if (!exception) return;

    setIsLoading(true);
    // Simulate async AI call
    setTimeout(() => {
      const result = summarizeException(exception);
      setAnalysis(result);
      setIsLoading(false);
    }, 800);
  };

  if (!exception) {
    return (
      <div className={cn('bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4', className)}>
        <div className="flex items-center gap-2 text-stone-500">
          <AiIcon />
          <span className="font-medium">AI-ассистент</span>
        </div>
        <div className="mt-3 text-sm text-stone-400 text-center py-4">
          Выберите исключение для анализа
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-stone-700">
          <AiIcon />
          <span className="font-medium">AI-ассистент</span>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className={cn(
            'px-3 py-1 text-sm rounded-lg font-medium transition-all',
            'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
            'hover:from-purple-600 hover:to-indigo-600',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isLoading ? 'Анализ...' : 'Анализировать'}
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      )}

      {analysis && !isLoading && (
        <div className="mt-4 space-y-4">
          {/* Summary */}
          <div>
            <div className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">
              Краткое описание
            </div>
            <div className="text-sm text-stone-700 bg-purple-50/50 rounded-lg p-3">
              {analysis.summary}
            </div>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Уверенность:</span>
            <span className={cn(
              'px-2 py-0.5 rounded text-xs font-medium',
              analysis.confidence === 'high' ? 'bg-emerald-100 text-emerald-700' :
              analysis.confidence === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-stone-100 text-stone-600'
            )}>
              {analysis.confidence === 'high' ? 'Высокая' :
               analysis.confidence === 'medium' ? 'Средняя' : 'Низкая'}
            </span>
          </div>

          {/* Proposed Steps */}
          <div>
            <div className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
              Предлагаемые шаги
            </div>
            <div className="space-y-2">
              {analysis.proposedSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm bg-stone-50 rounded-lg p-2"
                >
                  <span className="text-stone-400 font-mono text-xs mt-0.5">{index + 1}.</span>
                  <span className="flex-1 text-stone-700">{step}</span>
                  {onApplyStep && (
                    <button
                      onClick={() => onApplyStep(step)}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assumptions */}
          {analysis.assumptions.length > 0 && (
            <div>
              <div className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">
                Допущения
              </div>
              <ul className="text-xs text-stone-500 list-disc list-inside space-y-0.5">
                {analysis.assumptions.map((assumption, index) => (
                  <li key={index}>{assumption}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources */}
          <div className="text-xs text-stone-400">
            Источники: {analysis.sources.join(', ')}
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 flex items-start gap-2">
            <span>⚠️</span>
            <span>{analysis.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function AiIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

export default ExAiPanel;
