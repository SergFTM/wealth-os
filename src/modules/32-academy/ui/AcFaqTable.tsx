'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { AcTagChips } from './AcTagChips';
import { AcStatusPill } from './AcStatusPill';

interface FaqItem {
  id: string;
  questionRu: string;
  questionEn?: string;
  answerRu: string;
  answerEn?: string;
  tagsJson?: string[];
  audience: string;
  viewCount?: number;
}

interface AcFaqTableProps {
  items: FaqItem[];
}

export function AcFaqTable({ items }: AcFaqTableProps) {
  const { locale } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const labels = {
    question: { ru: 'Вопрос', en: 'Question', uk: 'Питання' },
    tags: { ru: 'Теги', en: 'Tags', uk: 'Теги' },
    audience: { ru: 'Аудитория', en: 'Audience', uk: 'Аудиторія' },
    views: { ru: 'Просмотры', en: 'Views', uk: 'Перегляди' },
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 divide-y divide-stone-100">
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        const question = locale === 'ru' ? item.questionRu : item.questionEn || item.questionRu;
        const answer = locale === 'ru' ? item.answerRu : item.answerEn || item.answerRu;

        return (
          <div key={item.id} className="p-4">
            <div
              className="flex items-start gap-3 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
            >
              <button className="flex-shrink-0 mt-1 p-1 rounded hover:bg-stone-100 transition-colors">
                <svg
                  className={`w-4 h-4 text-stone-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-stone-800">{question}</h4>
                {!isExpanded && (
                  <p className="text-sm text-stone-500 truncate mt-1">{answer}</p>
                )}
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                <AcStatusPill status={item.audience} size="sm" />
                <span className="text-xs text-stone-400">{item.viewCount || 0}</span>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-3 ml-8 space-y-3">
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <p className="text-sm text-stone-700 whitespace-pre-wrap">{answer}</p>
                </div>
                {item.tagsJson && item.tagsJson.length > 0 && (
                  <AcTagChips tags={item.tagsJson} maxVisible={5} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
