'use client';

import React from 'react';

interface Props {
  locale?: 'ru' | 'en' | 'uk';
}

const labels = {
  ru: 'Client Safe',
  en: 'Client Safe',
  uk: 'Client Safe'
};

export function PoClientSafeBadge({ locale = 'ru' }: Props) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      {labels[locale]}
    </span>
  );
}
