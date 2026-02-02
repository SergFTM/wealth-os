"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PerfExplainPanelProps {
  portfolioId?: string;
  viewId?: string;
  timeframe?: string;
  topContributors?: string[];
  topDetractors?: string[];
  onOpenCopilot?: () => void;
  onCreateReport?: () => void;
}

const mockExplanation = [
  "Рост портфеля YTD +14.9% превысил бенчмарк ACWI на +2.1%",
  "Основной вклад: сегмент Public Equity (+8.4% contribution) благодаря позициям в tech-секторе",
  "Негативное влияние: Fixed Income (-0.3% due to rate hikes) и комиссии (-0.8%)",
  "Cash drag снизился после реинвестирования в Q3",
  "Рекомендация: пересмотреть аллокацию в EM (низкий excess vs benchmark)"
];

export function PerfExplainPanel({
  portfolioId,
  viewId,
  timeframe = 'YTD',
  topContributors = [],
  topDetractors = [],
  onOpenCopilot,
  onCreateReport
}: PerfExplainPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-stone-800">AI Объяснение</h3>
            <p className="text-xs text-stone-500">Автоматический анализ изменений</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onOpenCopilot}>
            Copilot
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Свернуть' : 'Развернуть'}
          </Button>
        </div>
      </div>

      {/* Quick summary */}
      <div className="space-y-2 mb-3">
        {mockExplanation.slice(0, isExpanded ? undefined : 3).map((point, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-blue-500 mt-0.5">•</span>
            <span className="text-stone-700">{point}</span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100/50 rounded-lg px-3 py-2 mb-3">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Сгенерировано AI, требуется проверка аналитиком</span>
      </div>

      {/* Top contributors/detractors */}
      {isExpanded && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/50 rounded-lg p-3">
            <p className="text-xs font-medium text-stone-500 mb-2">Лучшие вклады</p>
            <div className="space-y-1">
              {(topContributors.length > 0 ? topContributors : ['Public Equity', 'Growth Strategy', 'US Market']).slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-500">↑</span>
                  <span className="text-stone-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <p className="text-xs font-medium text-stone-500 mb-2">Худшие вклады</p>
            <div className="space-y-1">
              {(topDetractors.length > 0 ? topDetractors : ['Fixed Income', 'EM Exposure', 'Management Fees']).slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-rose-500">↓</span>
                  <span className="text-stone-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={onCreateReport}>
          Создать отчётный пакет
        </Button>
      </div>
    </div>
  );
}
