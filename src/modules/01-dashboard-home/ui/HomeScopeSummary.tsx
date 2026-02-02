"use client";

import { useApp } from '@/lib/store';

interface ScopeData {
  level: 'household' | 'entity' | 'portfolio' | 'account';
  name: string;
  totalValue: number;
  currency: string;
}

interface HomeScopeSummaryProps {
  scope: ScopeData | null;
  onChangeScope: () => void;
}

export function HomeScopeSummary({ scope, onChangeScope }: HomeScopeSummaryProps) {
  const { locale } = useApp();

  const levelLabels: Record<string, { ru: string; en: string }> = {
    household: { ru: 'Household', en: 'Household' },
    entity: { ru: 'Юр. лицо', en: 'Entity' },
    portfolio: { ru: 'Портфель', en: 'Portfolio' },
    account: { ru: 'Счет', en: 'Account' },
  };

  if (!scope) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <p className="text-stone-500 text-sm">
          {locale === 'ru' ? 'Scope не выбран' : 'No scope selected'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-50/80 to-amber-50/50 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">
            {levelLabels[scope.level][locale as 'ru' | 'en'] || scope.level}
          </span>
          <h3 className="font-semibold text-stone-800">{scope.name}</h3>
          <p className="text-lg font-bold text-emerald-700">
            {scope.currency}{(scope.totalValue / 1000000).toFixed(2)}M
          </p>
        </div>
        <button
          onClick={onChangeScope}
          className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-white/50 rounded-lg transition-colors"
        >
          {locale === 'ru' ? 'Сменить scope' : 'Change scope'}
        </button>
      </div>
    </div>
  );
}
