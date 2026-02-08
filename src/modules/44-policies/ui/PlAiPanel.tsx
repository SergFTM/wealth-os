"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { summarizePolicy, generateSopChecklist, proposeUpdate } from '../engine/aiPolicyAssistant';

interface PlAiPanelProps {
  content: string;
  title: string;
  locale?: string;
  onChecklistGenerated?: (steps: Array<{ orderIndex: number; title: string }>) => void;
}

type AiMode = 'idle' | 'summarize' | 'checklist' | 'update';

export function PlAiPanel({ content, title, locale = 'ru', onChecklistGenerated }: PlAiPanelProps) {
  const [mode, setMode] = useState<AiMode>('idle');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: AiMode;
    content: string;
    details?: string[];
    confidence?: number;
    assumptions?: string[];
    disclaimer?: string;
    steps?: Array<{ orderIndex: number; title: string }>;
  } | null>(null);

  const handleSummarize = async () => {
    setLoading(true);
    setMode('summarize');
    try {
      const response = await summarizePolicy(content, title, locale);
      setResult({
        type: 'summarize',
        content: response.summary,
        details: response.keyPoints,
        confidence: response.confidence,
        assumptions: response.assumptions,
        disclaimer: response.disclaimer,
      });
    } catch (error) {
      setResult({
        type: 'summarize',
        content: 'Ошибка при генерации резюме',
        disclaimer: 'Попробуйте еще раз',
      });
    }
    setLoading(false);
  };

  const handleGenerateChecklist = async () => {
    setLoading(true);
    setMode('checklist');
    try {
      const response = await generateSopChecklist(content, title, locale);
      setResult({
        type: 'checklist',
        content: `Сгенерировано ${response.steps.length} шагов`,
        steps: response.steps,
        confidence: response.confidence,
        assumptions: response.assumptions,
        disclaimer: response.disclaimer,
      });
    } catch (error) {
      setResult({
        type: 'checklist',
        content: 'Ошибка при генерации чеклиста',
        disclaimer: 'Попробуйте еще раз',
      });
    }
    setLoading(false);
  };

  const handleProposeUpdate = async () => {
    setLoading(true);
    setMode('update');
    try {
      const response = await proposeUpdate(content, title, undefined, locale);
      setResult({
        type: 'update',
        content: response.proposedChanges,
        details: response.affectedSections.map(s => `Раздел: ${s}`),
        confidence: response.confidence,
        assumptions: response.assumptions,
        disclaimer: response.disclaimer,
      });
    } catch (error) {
      setResult({
        type: 'update',
        content: 'Ошибка при генерации предложений',
        disclaimer: 'Попробуйте еще раз',
      });
    }
    setLoading(false);
  };

  const handleUseChecklist = () => {
    if (result?.steps && onChecklistGenerated) {
      onChecklistGenerated(result.steps);
    }
  };

  const handleReset = () => {
    setMode('idle');
    setResult(null);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50/50 to-amber-50/30 backdrop-blur-sm rounded-xl border border-emerald-200/50 overflow-hidden">
      <div className="px-4 py-3 bg-emerald-50/50 border-b border-emerald-200/30">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="font-semibold text-emerald-800">AI Ассистент</span>
        </div>
      </div>

      <div className="p-4">
        {mode === 'idle' && (
          <div className="space-y-3">
            <p className="text-sm text-stone-600 mb-4">
              Выберите действие для AI-анализа документа:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={handleSummarize}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/80 border border-stone-200/50 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-stone-800">Резюмировать</div>
                  <div className="text-xs text-stone-500">Краткое содержание и ключевые пункты</div>
                </div>
              </button>

              <button
                onClick={handleGenerateChecklist}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/80 border border-stone-200/50 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-stone-800">Создать чеклист</div>
                  <div className="text-xs text-stone-500">Извлечь шаги из SOP</div>
                </div>
              </button>

              <button
                onClick={handleProposeUpdate}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/80 border border-stone-200/50 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-stone-800">Предложить изменения</div>
                  <div className="text-xs text-stone-500">AI-рекомендации по обновлению</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-stone-600 text-sm">AI обрабатывает документ...</p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-4">
            {/* Confidence */}
            {result.confidence && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Уверенность:</span>
                <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-stone-600">
                  {Math.round(result.confidence * 100)}%
                </span>
              </div>
            )}

            {/* Main content */}
            <div className="bg-white/80 rounded-lg p-4 border border-stone-200/50">
              {result.type === 'checklist' && result.steps ? (
                <div>
                  <p className="text-sm text-stone-700 mb-3">{result.content}</p>
                  <div className="space-y-2">
                    {result.steps.slice(0, 5).map((step) => (
                      <div key={step.orderIndex} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                          {step.orderIndex}
                        </span>
                        <span className="text-stone-700">{step.title}</span>
                      </div>
                    ))}
                    {result.steps.length > 5 && (
                      <p className="text-xs text-stone-500 pl-7">
                        ... и еще {result.steps.length - 5} шагов
                      </p>
                    )}
                  </div>
                  {onChecklistGenerated && (
                    <Button
                      variant="primary"
                      onClick={handleUseChecklist}
                      className="mt-4 w-full"
                    >
                      Создать чеклист
                    </Button>
                  )}
                </div>
              ) : (
                <div className="prose prose-sm prose-stone max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-stone-700">{result.content}</div>
                </div>
              )}
            </div>

            {/* Key points */}
            {result.details && result.details.length > 0 && (
              <div>
                <p className="text-xs font-medium text-stone-500 mb-2">Ключевые пункты:</p>
                <ul className="space-y-1">
                  {result.details.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Assumptions */}
            {result.assumptions && result.assumptions.length > 0 && (
              <div className="text-xs text-stone-500">
                <span className="font-medium">Допущения:</span>{' '}
                {result.assumptions.join('; ')}
              </div>
            )}

            {/* Disclaimer */}
            {result.disclaimer && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs text-amber-700">{result.disclaimer}</p>
              </div>
            )}

            <Button variant="ghost" onClick={handleReset} className="w-full">
              Начать заново
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
