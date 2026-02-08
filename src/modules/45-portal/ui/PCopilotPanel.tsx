'use client';

import React, { useState } from 'react';
import { Locale, portalI18n, NetWorthSummary, PerformanceSummary, LiquiditySummary } from '../types';
import { processCopilotQuery, getSuggestedQueries, CopilotResponse } from '../engine/portalCopilot';
import { PCard, PCardHeader, PCardBody } from './PCard';

interface PCopilotPanelProps {
  locale?: Locale;
  context?: {
    netWorth?: NetWorthSummary;
    performance?: PerformanceSummary;
    liquidity?: LiquiditySummary;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

export function PCopilotPanel({ locale = 'ru', context, isOpen = false, onClose }: PCopilotPanelProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ query: string; response: CopilotResponse }>>([]);

  const labels: Record<string, Record<Locale, string>> = {
    title: { ru: 'AI-ассистент', en: 'AI Assistant', uk: 'AI-асистент' },
    placeholder: { ru: 'Задайте вопрос о вашем капитале...', en: 'Ask a question about your wealth...', uk: 'Задайте питання про ваш капітал...' },
    send: { ru: 'Спросить', en: 'Ask', uk: 'Запитати' },
    suggestions: { ru: 'Популярные вопросы', en: 'Suggested Questions', uk: 'Популярні питання' },
    sources: { ru: 'Источники', en: 'Sources', uk: 'Джерела' },
    assumptions: { ru: 'Допущения', en: 'Assumptions', uk: 'Припущення' },
    confidence: { ru: 'Уверенность', en: 'Confidence', uk: 'Впевненість' },
    high: { ru: 'Высокая', en: 'High', uk: 'Висока' },
    medium: { ru: 'Средняя', en: 'Medium', uk: 'Середня' },
    low: { ru: 'Низкая', en: 'Low', uk: 'Низька' },
    thinking: { ru: 'Анализирую...', en: 'Analyzing...', uk: 'Аналізую...' },
    history: { ru: 'История', en: 'History', uk: 'Історія' },
    clearHistory: { ru: 'Очистить', en: 'Clear', uk: 'Очистити' },
  };

  const suggestedQueries = getSuggestedQueries(locale);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = processCopilotQuery({
      query: query.trim(),
      context,
      locale,
    });

    setResponse(result);
    setHistory(prev => [...prev, { query: query.trim(), response: result }]);
    setQuery('');
    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  const getConfidenceLabel = (confidence: 'high' | 'medium' | 'low') => {
    return labels[confidence][locale];
  };

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    if (confidence === 'high') return 'bg-emerald-100 text-emerald-700';
    if (confidence === 'medium') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg h-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-emerald-100 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-emerald-500 to-emerald-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-white">{labels.title[locale]}</h2>
              <p className="text-xs text-white/70">Wealth OS Copilot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Suggestions */}
          {!response && history.length === 0 && (
            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">{labels.suggestions[locale]}</p>
              <div className="space-y-2">
                {suggestedQueries.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl text-sm text-slate-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{labels.history[locale]}</p>
                <button
                  onClick={() => { setHistory([]); setResponse(null); }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  {labels.clearHistory[locale]}
                </button>
              </div>
              {history.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  {/* User Query */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] px-4 py-2 bg-emerald-500 text-white rounded-2xl rounded-br-md text-sm">
                      {item.query}
                    </div>
                  </div>
                  {/* AI Response */}
                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-2xl rounded-bl-md p-4">
                      <p className="text-sm text-slate-700 leading-relaxed">{item.response.answer}</p>
                    </div>
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-2 px-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getConfidenceColor(item.response.confidence)}`}>
                        {labels.confidence[locale]}: {getConfidenceLabel(item.response.confidence)}
                      </span>
                      {item.response.sources.length > 0 && (
                        <span className="text-xs text-slate-400">
                          {labels.sources[locale]}: {item.response.sources.map(s => s.label).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-sm text-slate-600">{labels.thinking[locale]}</p>
            </div>
          )}

          {/* Current Response */}
          {response && !isLoading && history.length === 0 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl p-5">
                <p className="text-slate-700 leading-relaxed">{response.answer}</p>
              </div>

              {/* Confidence & Sources */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getConfidenceColor(response.confidence)}`}>
                  {labels.confidence[locale]}: {getConfidenceLabel(response.confidence)}
                </span>
              </div>

              {response.sources.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs font-medium text-slate-500 mb-2">{labels.sources[locale]}</p>
                  <div className="flex flex-wrap gap-2">
                    {response.sources.map((source, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white rounded-lg text-xs text-slate-600 border border-slate-200">
                        {source.label}
                        {source.asOfDate && (
                          <span className="text-slate-400 ml-1">
                            ({new Date(source.asOfDate).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric' })})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {response.assumptions.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl">
                  <p className="text-xs font-medium text-amber-700 mb-2">{labels.assumptions[locale]}</p>
                  <ul className="space-y-1">
                    {response.assumptions.map((assumption, idx) => (
                      <li key={idx} className="text-xs text-amber-800 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        {assumption}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="flex-shrink-0 px-6 py-3 bg-amber-50/50 border-t border-amber-100">
          <p className="text-xs text-amber-700">
            {portalI18n.disclaimers.ai[locale]}
          </p>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-emerald-100 p-4 bg-white">
          <div className="flex items-end gap-3">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.placeholder[locale]}
              rows={2}
              className="flex-1 px-4 py-2.5 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={!query.trim() || isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {labels.send[locale]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating Copilot Button
interface PCopilotButtonProps {
  onClick: () => void;
  locale?: Locale;
}

export function PCopilotButton({ onClick, locale = 'ru' }: PCopilotButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
      title={locale === 'ru' ? 'Спросить AI' : locale === 'en' ? 'Ask AI' : 'Запитати AI'}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </button>
  );
}
