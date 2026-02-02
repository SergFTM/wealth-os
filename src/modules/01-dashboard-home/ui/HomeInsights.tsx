"use client";

import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';

interface Insight {
  id: string;
  title: string;
  description: string;
  sourceType: string;
  sourceId: string;
  sourceLink: string;
}

interface HomeInsightsProps {
  insights: Insight[];
  loading?: boolean;
  onOpenSource: (insight: Insight) => void;
  onCreateTask: (insight: Insight) => void;
}

export function HomeInsights({ insights, loading, onOpenSource, onCreateTask }: HomeInsightsProps) {
  const { locale } = useApp();

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="h-5 bg-stone-200 rounded w-48 mb-4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-stone-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <h2 className="text-lg font-semibold text-stone-800 mb-4">
        {locale === 'ru' ? 'Сегодня, что изменилось' : 'Today, what changed'}
      </h2>

      {insights.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <p>{locale === 'ru' ? 'Нет новых событий' : 'No new events'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.slice(0, 6).map((insight) => (
            <div
              key={insight.id}
              className="bg-gradient-to-br from-stone-50 to-amber-50/30 rounded-lg border border-stone-200/50 p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                  {insight.sourceType}
                </span>
              </div>
              
              <h3 className="font-medium text-stone-800 mb-1 line-clamp-2">
                {insight.title}
              </h3>
              
              <p className="text-sm text-stone-500 mb-3 line-clamp-2">
                {insight.description}
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onOpenSource(insight)}
                >
                  {locale === 'ru' ? 'Открыть' : 'Open'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCreateTask(insight)}
                >
                  {locale === 'ru' ? 'Создать задачу' : 'Create task'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
