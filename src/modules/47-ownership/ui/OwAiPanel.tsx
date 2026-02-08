"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface AiSuggestion {
  id: string;
  type: 'explain' | 'warning' | 'optimization' | 'question';
  title: string;
  description: string;
  confidence: number;
}

interface OwAiPanelProps {
  onExplainStructure: () => void;
  onFindConcentrations: () => void;
  onCheckOrphans: () => void;
  suggestions?: AiSuggestion[];
  isLoading?: boolean;
}

const typeStyles: Record<string, { icon: string; color: string }> = {
  explain: { icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-blue-600 bg-blue-50' },
  warning: { icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-amber-600 bg-amber-50' },
  optimization: { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', color: 'text-emerald-600 bg-emerald-50' },
  question: { icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-purple-600 bg-purple-50' },
};

export function OwAiPanel({
  onExplainStructure,
  onFindConcentrations,
  onCheckOrphans,
  suggestions = [],
  isLoading = false,
}: OwAiPanelProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="font-semibold text-stone-800">AI Ассистент</span>
      </div>

      {/* Quick actions */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-left text-sm gap-2"
          onClick={onExplainStructure}
          disabled={isLoading}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Объясни структуру
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left text-sm gap-2"
          onClick={onFindConcentrations}
          disabled={isLoading}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Найди концентрации рисков
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left text-sm gap-2"
          onClick={onCheckOrphans}
          disabled={isLoading}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Проверь несвязанные узлы
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <div className="animate-spin w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full" />
          Анализ...
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-200">
          <div className="text-xs font-medium text-stone-500 uppercase">Рекомендации</div>
          {suggestions.map((suggestion) => {
            const style = typeStyles[suggestion.type] || typeStyles.explain;
            const isExpanded = expanded === suggestion.id;

            return (
              <div
                key={suggestion.id}
                className={`p-3 rounded-lg ${style.color.split(' ')[1]} cursor-pointer transition-all`}
                onClick={() => setExpanded(isExpanded ? null : suggestion.id)}
              >
                <div className="flex items-start gap-2">
                  <svg className={`w-4 h-4 mt-0.5 ${style.color.split(' ')[0]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style.icon} />
                  </svg>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${style.color.split(' ')[0]}`}>
                      {suggestion.title}
                    </div>
                    {isExpanded && (
                      <div className="mt-2 text-sm text-stone-600">
                        {suggestion.description}
                        <div className="mt-1 text-xs text-stone-400">
                          Уверенность: {suggestion.confidence}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-stone-400 pt-2 border-t border-stone-100">
        AI рекомендации носят информационный характер. Источники и допущения отображаются для каждой рекомендации.
      </div>
    </div>
  );
}

export default OwAiPanel;
