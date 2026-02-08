"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface AiAction {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface AiResult {
  content: string;
  confidence: number;
  assumptions: string[];
  sources: string[];
}

interface GvAiPanelProps {
  meetingId?: string;
  onSummarize?: () => Promise<AiResult>;
  onDraftMinutes?: () => Promise<AiResult>;
  onExtractActions?: () => Promise<AiResult>;
  className?: string;
}

export function GvAiPanel({
  meetingId,
  onSummarize,
  onDraftMinutes,
  onExtractActions,
  className,
}: GvAiPanelProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<AiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const actions: AiAction[] = [
    {
      key: 'summarize',
      label: 'Резюме заседания',
      description: 'Создать краткое резюме обсужденных вопросов',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: 'draftMinutes',
      label: 'Черновик протокола',
      description: 'Сгенерировать черновик протокола заседания',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      key: 'extractActions',
      label: 'Извлечь action items',
      description: 'Найти задачи и поручения из текста обсуждений',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  const handleAction = async (key: string) => {
    setLoading(key);
    setError(null);
    setResult(null);

    try {
      let res: AiResult | undefined;

      switch (key) {
        case 'summarize':
          res = await onSummarize?.();
          break;
        case 'draftMinutes':
          res = await onDraftMinutes?.();
          break;
        case 'extractActions':
          res = await onExtractActions?.();
          break;
      }

      if (res) {
        setResult(res);
      } else {
        // Demo response
        setResult({
          content: `## AI ${actions.find(a => a.key === key)?.label}\n\nЭто демо-результат. В продакшене здесь будет реальный AI-контент на основе данных заседания.\n\n### Основные выводы\n- Пункт 1\n- Пункт 2\n- Пункт 3`,
          confidence: 0.85,
          assumptions: ['Данные заседания полные', 'Все участники присутствовали'],
          sources: ['Повестка дня', 'Заметки участников', 'Результаты голосований'],
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка AI');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50", className)}>
      <div className="px-4 py-3 border-b border-stone-200/50">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="font-semibold text-stone-800">AI-ассистент</h3>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Автоматизируйте документирование заседаний
        </p>
      </div>

      <div className="p-4 space-y-3">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => handleAction(action.key)}
            disabled={loading !== null}
            className={cn(
              "w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
              loading === action.key
                ? "bg-purple-50 border-purple-200"
                : "bg-stone-50 border-stone-200 hover:bg-stone-100 hover:border-stone-300"
            )}
          >
            <span className={cn(
              "flex-shrink-0 p-2 rounded-lg",
              loading === action.key ? "bg-purple-100 text-purple-600" : "bg-white text-stone-600"
            )}>
              {loading === action.key ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                action.icon
              )}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-stone-800 text-sm">{action.label}</div>
              <div className="text-xs text-stone-500">{action.description}</div>
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="px-4 pb-4">
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        </div>
      )}

      {result && (
        <div className="px-4 pb-4 space-y-3">
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div className="prose prose-sm prose-stone max-w-none">
              <div dangerouslySetInnerHTML={{ __html: result.content.replace(/\n/g, '<br/>') }} />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Уверенность: {(result.confidence * 100).toFixed(0)}%</span>
            <span>{result.sources.length} источников</span>
          </div>

          {result.assumptions.length > 0 && (
            <details className="text-xs">
              <summary className="text-stone-500 cursor-pointer hover:text-stone-700">
                Допущения ({result.assumptions.length})
              </summary>
              <ul className="mt-2 pl-4 text-stone-600 list-disc space-y-1">
                {result.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </details>
          )}

          {result.sources.length > 0 && (
            <details className="text-xs">
              <summary className="text-stone-500 cursor-pointer hover:text-stone-700">
                Источники ({result.sources.length})
              </summary>
              <ul className="mt-2 pl-4 text-stone-600 list-disc space-y-1">
                {result.sources.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </details>
          )}

          <div className="flex gap-2">
            <Button variant="primary" size="sm" className="flex-1">
              Применить
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setResult(null)}>
              Закрыть
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
