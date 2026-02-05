'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';

interface AiSource {
  id: string;
  type: string;
  title: string;
}

interface AcAiPanelProps {
  onAsk: (question: string) => Promise<{
    answer: string;
    sources: AiSource[];
    confidence: 'high' | 'medium' | 'low';
    disclaimer?: string;
  }>;
}

export function AcAiPanel({ onAsk }: AcAiPanelProps) {
  const { locale } = useApp();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    answer: string;
    sources: AiSource[];
    confidence: 'high' | 'medium' | 'low';
    disclaimer?: string;
  } | null>(null);

  const labels = {
    title: { ru: 'AI Помощник', en: 'AI Assistant', uk: 'AI Помічник' },
    placeholder: { ru: 'Задайте вопрос по базе знаний...', en: 'Ask a question about the knowledge base...', uk: 'Задайте питання по базі знань...' },
    ask: { ru: 'Спросить', en: 'Ask', uk: 'Запитати' },
    sources: { ru: 'Источники', en: 'Sources', uk: 'Джерела' },
    confidence: { ru: 'Уверенность', en: 'Confidence', uk: 'Впевненість' },
    high: { ru: 'Высокая', en: 'High', uk: 'Висока' },
    medium: { ru: 'Средняя', en: 'Medium', uk: 'Середня' },
    low: { ru: 'Низкая', en: 'Low', uk: 'Низька' },
    noData: { ru: 'Недостаточно данных', en: 'Insufficient data', uk: 'Недостатньо даних' },
    examples: { ru: 'Примеры вопросов:', en: 'Example questions:', uk: 'Приклади питань:' },
  };

  const exampleQuestions = {
    ru: [
      'Как настроить двухфакторную аутентификацию?',
      'Что такое IPS?',
      'Как загрузить документ?',
    ],
    en: [
      'How to set up two-factor authentication?',
      'What is IPS?',
      'How to upload a document?',
    ],
    uk: [
      'Як налаштувати двофакторну автентифікацію?',
      'Що таке IPS?',
      'Як завантажити документ?',
    ],
  };

  const handleAsk = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    try {
      const response = await onAsk(question);
      setResult(response);
    } catch (error) {
      setResult({
        answer: labels.noData[locale],
        sources: [],
        confidence: 'low',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (q: string) => {
    setQuestion(q);
  };

  const confidenceColor = {
    high: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-purple-100 rounded-lg">
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="font-semibold text-stone-800">{labels.title[locale]}</h3>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder={labels.placeholder[locale]}
          className="flex-1 px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
        />
        <Button variant="primary" onClick={handleAsk} disabled={loading || !question.trim()}>
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            labels.ask[locale]
          )}
        </Button>
      </div>

      {/* Example questions */}
      {!result && (
        <div>
          <p className="text-xs text-stone-500 mb-2">{labels.examples[locale]}</p>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions[locale].map((q) => (
              <button
                key={q}
                onClick={() => handleExampleClick(q)}
                className="px-3 py-1.5 text-xs bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4 pt-4 border-t border-stone-200/50">
          {/* Disclaimer */}
          {result.disclaimer && (
            <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-700">{result.disclaimer}</p>
            </div>
          )}

          {/* Answer */}
          <div className="prose prose-sm prose-stone max-w-none">
            <div className="whitespace-pre-wrap text-sm text-stone-700">{result.answer}</div>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">{labels.confidence[locale]}:</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${confidenceColor[result.confidence]}`}>
              {labels[result.confidence][locale]}
            </span>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div>
              <p className="text-xs text-stone-500 mb-2">{labels.sources[locale]}:</p>
              <div className="space-y-1">
                {result.sources.map((source) => (
                  <a
                    key={source.id}
                    href={`/m/academy/${source.type}/${source.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-stone-50 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <span className="text-xs text-stone-400 uppercase">{source.type}</span>
                    <span className="text-stone-700">{source.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
