'use client';

import React, { useState } from 'react';
import { PoClientSafeBadge } from './PoClientSafeBadge';

interface Props {
  locale: 'ru' | 'en' | 'uk';
  onLocaleChange: (l: 'ru' | 'en' | 'uk') => void;
  onAiOpen: () => void;
  userName?: string;
}

export function PoTopbar({ locale, onLocaleChange, onAiOpen, userName = 'Клиент' }: Props) {
  const [search, setSearch] = useState('');
  const [langOpen, setLangOpen] = useState(false);

  const searchLabels = { ru: 'Поиск по порталу...', en: 'Search portal...', uk: 'Пошук по порталу...' };
  const langLabels = { ru: 'RU', en: 'EN', uk: 'UK' };

  return (
    <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-stone-200/50 flex items-center px-6 gap-4 sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={searchLabels[locale]}
          className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200/50 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
        />
      </div>

      <PoClientSafeBadge locale={locale} />

      {/* Language */}
      <div className="relative">
        <button
          onClick={() => setLangOpen(!langOpen)}
          className="px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-50 rounded-lg hover:bg-stone-100 border border-stone-200/50"
        >
          {langLabels[locale]}
        </button>
        {langOpen && (
          <div className="absolute right-0 mt-1 bg-white rounded-xl shadow-lg border border-stone-200/50 py-1 z-50">
            {(['ru', 'en', 'uk'] as const).map(l => (
              <button
                key={l}
                onClick={() => { onLocaleChange(l); setLangOpen(false); }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-stone-50 ${l === locale ? 'text-emerald-600 font-medium' : 'text-stone-600'}`}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* AI Button */}
      <button
        onClick={onAiOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 border border-amber-200/50"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        AI
      </button>

      {/* Profile */}
      <div className="flex items-center gap-2 pl-4 border-l border-stone-200/50">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <span className="text-white text-xs font-semibold">{userName.charAt(0)}</span>
        </div>
        <span className="text-sm text-stone-700 font-medium hidden lg:block">{userName}</span>
      </div>
    </header>
  );
}
