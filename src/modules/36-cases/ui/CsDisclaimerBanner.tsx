'use client';

import { useTranslation } from '@/lib/i18n';

export function CsDisclaimerBanner() {
  const t = useTranslation();

  return (
    <div className="
      p-4 rounded-xl border border-amber-200
      bg-gradient-to-r from-amber-50 to-yellow-50
      flex items-start gap-3
    ">
      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600 flex-shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <div className="text-sm font-medium text-amber-800">
          {t('disclaimer', {
            ru: 'Service Desk в MVP демонстрационный',
            en: 'Service Desk is demo in MVP',
            uk: 'Service Desk в MVP демонстраційний'
          })}
        </div>
        <div className="text-xs text-amber-700 mt-0.5">
          {t('disclaimerDetails', {
            ru: 'Для production требуется настройка SLA и организационных процессов.',
            en: 'Production requires SLA and organizational process configuration.',
            uk: 'Для production потрібно налаштування SLA та організаційних процесів.'
          })}
        </div>
      </div>
    </div>
  );
}
