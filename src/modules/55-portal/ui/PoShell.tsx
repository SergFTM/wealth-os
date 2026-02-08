'use client';

import React, { useState } from 'react';
import { PoSidebar } from './PoSidebar';
import { PoTopbar } from './PoTopbar';
import { PoAiPanel } from './PoAiPanel';

interface Props {
  children: React.ReactNode;
}

export function PoShell({ children }: Props) {
  const [locale, setLocale] = useState<'ru' | 'en' | 'uk'>('ru');
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/20 to-amber-50/10">
      <PoSidebar locale={locale} />
      <div className="flex-1 flex flex-col">
        <PoTopbar
          locale={locale}
          onLocaleChange={setLocale}
          onAiOpen={() => setAiOpen(true)}
          userName="Александр Петров"
        />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
      <PoAiPanel
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        locale={locale}
      />
    </div>
  );
}
