'use client';

import { useState } from 'react';
import { useTranslation, useI18n } from '@/lib/i18n';
import { notificationsConfig } from '../config';

export function NtDisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);
  const t = useTranslation();
  const { lang: locale } = useI18n();

  const disclaimer = notificationsConfig.disclaimer;

  if (dismissed || !disclaimer) return null;

  return (
    <div className="relative bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/50 rounded-xl p-4 pr-10">
      <div className="flex items-start gap-3">
        <div className="text-amber-500 flex-shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-700">
          {disclaimer[locale as keyof typeof disclaimer] || disclaimer.ru}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
