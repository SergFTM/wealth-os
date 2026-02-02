"use client";

import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';

interface QuickAction {
  key: string;
  title: string;
  icon: string;
}

interface HomeQuickCreateProps {
  actions: QuickAction[];
  onAction: (actionKey: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  task: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  request: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  report: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  invoice: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>
  ),
  document: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
};

export function HomeQuickCreate({ actions, onAction }: HomeQuickCreateProps) {
  const { locale } = useApp();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <h2 className="text-lg font-semibold text-stone-800 mb-4">
        {locale === 'ru' ? 'Быстрые действия' : 'Quick Actions'}
      </h2>

      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => onAction(action.key)}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-50 to-amber-50/50 hover:from-emerald-100 hover:to-amber-100/50 rounded-lg border border-stone-200/50 text-stone-700 font-medium text-sm transition-all hover:shadow-md"
          >
            <span className="text-emerald-600">
              {iconMap[action.icon] || iconMap.task}
            </span>
            {action.title}
          </button>
        ))}
      </div>
    </div>
  );
}
