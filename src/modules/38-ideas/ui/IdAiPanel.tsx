'use client';

import { useState } from 'react';
import { generateAiResponse, type AiResponse } from '../engine/aiIdeaAssistant';

type Locale = 'ru' | 'en' | 'uk';

interface Idea {
  id: string;
  ideaNumber: string;
  title: string;
  assetClass: string;
  horizonKey: string;
  thesisText: string;
  catalystsJson?: Array<{ description: string; timing?: string }>;
  risksJson?: Array<{ description: string; severity?: string }>;
  riskLevel: string;
  status: string;
}

interface IdAiPanelProps {
  ideas: Idea[];
  selectedIds: string[];
  onSelectIdea: (id: string) => void;
  locale?: Locale;
}

export function IdAiPanel({
  ideas,
  selectedIds,
  onSelectIdea,
  locale = 'ru',
}: IdAiPanelProps) {
  const [action, setAction] = useState<'summarize' | 'compare' | 'draft_memo' | 'suggest'>('summarize');
  const [response, setResponse] = useState<AiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedIdeas = ideas.filter(i => selectedIds.includes(i.id));

  const handleGenerate = () => {
    setLoading(true);
    // Simulate async operation
    setTimeout(() => {
      const result = generateAiResponse(action, selectedIdeas);
      setResponse(result);
      setLoading(false);
    }, 500);
  };

  const canGenerate = () => {
    if (action === 'compare') return selectedIds.length >= 2;
    return selectedIds.length >= 1;
  };

  const labels = {
    ru: {
      title: 'AI Помощник',
      selectIdea: 'Выберите идею',
      selectTwo: 'Выберите две идеи',
      summarize: 'Резюме',
      compare: 'Сравнить',
      draftMemo: 'Проект мемо',
      suggest: 'Рекомендации',
      generate: 'Генерировать',
      confidence: 'Уверенность',
      sources: 'Источники',
      assumptions: 'Допущения',
      disclaimer: 'Дисклеймер',
    },
    en: {
      title: 'AI Assistant',
      selectIdea: 'Select an idea',
      selectTwo: 'Select two ideas',
      summarize: 'Summarize',
      compare: 'Compare',
      draftMemo: 'Draft Memo',
      suggest: 'Suggestions',
      generate: 'Generate',
      confidence: 'Confidence',
      sources: 'Sources',
      assumptions: 'Assumptions',
      disclaimer: 'Disclaimer',
    },
    uk: {
      title: 'AI Помічник',
      selectIdea: 'Виберіть ідею',
      selectTwo: 'Виберіть дві ідеї',
      summarize: 'Резюме',
      compare: 'Порівняти',
      draftMemo: 'Проект мемо',
      suggest: 'Рекомендації',
      generate: 'Генерувати',
      confidence: 'Впевненість',
      sources: 'Джерела',
      assumptions: 'Припущення',
      disclaimer: 'Дисклеймер',
    },
  };

  const t = labels[locale];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-purple-100 bg-white/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">{t.title}</h3>
        </div>
      </div>

      {/* Action Selector */}
      <div className="px-4 py-3 border-b border-purple-100">
        <div className="flex flex-wrap gap-2">
          {(['summarize', 'compare', 'draft_memo', 'suggest'] as const).map((act) => (
            <button
              key={act}
              onClick={() => setAction(act)}
              className={`
                px-3 py-1.5 text-sm rounded-lg font-medium transition-all
                ${action === act
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-purple-100'
                }
              `}
            >
              {t[act === 'draft_memo' ? 'draftMemo' : act]}
            </button>
          ))}
        </div>
      </div>

      {/* Idea Selector */}
      <div className="px-4 py-3 border-b border-purple-100">
        <div className="text-xs text-gray-500 mb-2">
          {action === 'compare' ? t.selectTwo : t.selectIdea}
        </div>
        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
          {ideas.slice(0, 10).map((idea) => (
            <button
              key={idea.id}
              onClick={() => onSelectIdea(idea.id)}
              className={`
                px-2 py-1 text-xs rounded-lg border transition-all
                ${selectedIds.includes(idea.id)
                  ? 'bg-purple-100 border-purple-300 text-purple-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
                }
              `}
            >
              {idea.ideaNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="px-4 py-3 border-b border-purple-100">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate() || loading}
          className={`
            w-full py-2 px-4 rounded-lg font-medium text-sm transition-all
            ${canGenerate() && !loading
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              ...
            </span>
          ) : (
            t.generate
          )}
        </button>
      </div>

      {/* Response */}
      {response && (
        <div className="px-4 py-3 space-y-3">
          {/* Content */}
          <div className="prose prose-sm max-w-none bg-white rounded-lg p-3 border border-purple-100 max-h-64 overflow-y-auto">
            <div className="whitespace-pre-wrap text-sm text-gray-700">
              {response.content}
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Confidence */}
            <div className="bg-white rounded-lg p-2 border border-purple-100">
              <div className="text-gray-500 mb-1">{t.confidence}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{ width: `${response.confidence}%` }}
                  />
                </div>
                <span className="font-medium text-purple-600">{response.confidence}%</span>
              </div>
            </div>

            {/* Sources */}
            <div className="bg-white rounded-lg p-2 border border-purple-100">
              <div className="text-gray-500 mb-1">{t.sources}</div>
              <div className="text-gray-700 line-clamp-2">
                {response.sources.join(', ')}
              </div>
            </div>
          </div>

          {/* Assumptions */}
          {response.assumptions.length > 0 && (
            <div className="bg-white rounded-lg p-2 border border-purple-100 text-xs">
              <div className="text-gray-500 mb-1">{t.assumptions}</div>
              <ul className="text-gray-600 space-y-0.5">
                {response.assumptions.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-50 rounded-lg p-2 border border-amber-200 text-xs text-amber-700">
            <div className="font-medium mb-0.5">{t.disclaimer}</div>
            {response.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
}

export default IdAiPanel;
