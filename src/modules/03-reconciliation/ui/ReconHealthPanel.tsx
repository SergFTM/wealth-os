"use client";

import { cn } from '@/lib/utils';

interface FeedHealth {
  id: string;
  providerName: string;
  type: 'custodian' | 'bank' | 'advisor' | 'manual';
  coverage: string[];
  status: 'ok' | 'stale' | 'error';
  lastSyncAt: string;
  authStatus?: string;
}

interface ReconHealthPanelProps {
  feeds: FeedHealth[];
  loading?: boolean;
  onRunSync?: (feedId: string) => void;
  clientSafe?: boolean;
}

const typeColors: Record<string, string> = {
  custodian: 'bg-blue-100 text-blue-700',
  bank: 'bg-emerald-100 text-emerald-700',
  advisor: 'bg-purple-100 text-purple-700',
  manual: 'bg-stone-100 text-stone-700'
};

const statusIcons: Record<string, { color: string; icon: string }> = {
  ok: { color: 'text-emerald-500', icon: '✓' },
  stale: { color: 'text-amber-500', icon: '⚠' },
  error: { color: 'text-rose-500', icon: '✕' }
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Только что';
  if (diffHours < 24) return `${diffHours}ч назад`;
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays}д назад`;
  return date.toLocaleDateString('ru-RU');
}

export function ReconHealthPanel({ feeds, loading, onRunSync, clientSafe }: ReconHealthPanelProps) {
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Источники данных</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-stone-50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-stone-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-stone-800">Источники данных</h3>
        <div className="flex items-center gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> OK
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Устаревший
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Ошибка
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className={cn(
              "rounded-lg border p-4 transition-all hover:shadow-md",
              feed.status === 'ok' && "bg-emerald-50/50 border-emerald-200",
              feed.status === 'stale' && "bg-amber-50/50 border-amber-200",
              feed.status === 'error' && "bg-rose-50/50 border-rose-200"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-stone-800 truncate">{feed.providerName}</h4>
                <span className={cn("text-xs px-1.5 py-0.5 rounded", typeColors[feed.type])}>
                  {feed.type}
                </span>
              </div>
              <span className={cn("text-lg", statusIcons[feed.status].color)}>
                {statusIcons[feed.status].icon}
              </span>
            </div>
            
            <div className="space-y-1 text-xs text-stone-500 mt-3">
              <div className="flex items-center justify-between">
                <span>Последняя синхр.:</span>
                <span className="font-medium text-stone-700">{formatRelativeTime(feed.lastSyncAt)}</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {feed.coverage.map(cov => (
                  <span key={cov} className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                    {cov}
                  </span>
                ))}
              </div>
            </div>

            {!clientSafe && onRunSync && (
              <button
                onClick={() => onRunSync(feed.id)}
                className="mt-3 w-full py-1.5 px-3 text-xs font-medium rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Запустить sync
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
