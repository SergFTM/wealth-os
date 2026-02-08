'use client';

import React from 'react';
import { PORTAL_DISCLAIMERS } from '../config';

interface Props {
  asOfDate?: string;
  sources?: string[];
  locale?: 'ru' | 'en' | 'uk';
  showTaxDisclaimer?: boolean;
  showTrustDisclaimer?: boolean;
}

const asOfLabels = { ru: 'По состоянию на', en: 'As of', uk: 'Станом на' };
const sourceLabels = { ru: 'Источники', en: 'Sources', uk: 'Джерела' };

export function PoSourceFooter({ asOfDate, sources, locale = 'ru', showTaxDisclaimer, showTrustDisclaimer }: Props) {
  const fmt = (d: string) => new Date(d).toLocaleDateString(locale === 'uk' ? 'uk-UA' : locale === 'en' ? 'en-US' : 'ru-RU');

  return (
    <footer className="mt-6 pt-4 border-t border-stone-200/50 space-y-2">
      {asOfDate && (
        <p className="text-xs text-stone-400">
          {asOfLabels[locale]}: {fmt(asOfDate)}
        </p>
      )}
      {sources && sources.length > 0 && (
        <p className="text-xs text-stone-400">
          {sourceLabels[locale]}: {sources.join(', ')}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <p className="text-xs text-amber-600/80 bg-amber-50 px-2 py-0.5 rounded">
          {PORTAL_DISCLAIMERS.ai[locale]}
        </p>
        {showTaxDisclaimer && (
          <p className="text-xs text-amber-600/80 bg-amber-50 px-2 py-0.5 rounded">
            {PORTAL_DISCLAIMERS.tax[locale]}
          </p>
        )}
        {showTrustDisclaimer && (
          <p className="text-xs text-amber-600/80 bg-amber-50 px-2 py-0.5 rounded">
            {PORTAL_DISCLAIMERS.trust[locale]}
          </p>
        )}
      </div>
    </footer>
  );
}
