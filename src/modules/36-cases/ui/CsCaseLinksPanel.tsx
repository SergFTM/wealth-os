'use client';

import Link from 'next/link';
import { useCollection } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';

interface CaseLink {
  id: string;
  caseId: string;
  linkedType: string;
  linkedId: string;
  linkedName?: string | null;
  linkedUrl?: string | null;
  linkReason?: string | null;
  createdByUserName?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CsCaseLinksPanelProps {
  caseId: string;
  locale?: string;
  onLinkObject?: () => void;
}

const linkTypeLabels: Record<string, Record<string, string>> = {
  invoice: { ru: 'Счет', en: 'Invoice', uk: 'Рахунок' },
  document: { ru: 'Документ', en: 'Document', uk: 'Документ' },
  portfolio: { ru: 'Портфель', en: 'Portfolio', uk: 'Портфель' },
  exception: { ru: 'Исключение DQ', en: 'DQ Exception', uk: 'Виняток DQ' },
  syncjob: { ru: 'Sync Job', en: 'Sync Job', uk: 'Sync Job' },
  report: { ru: 'Отчет', en: 'Report', uk: 'Звіт' },
  task: { ru: 'Задача', en: 'Task', uk: 'Задача' },
  thread: { ru: 'Тред', en: 'Thread', uk: 'Тред' },
  entity: { ru: 'Entity', en: 'Entity', uk: 'Entity' },
  account: { ru: 'Счет', en: 'Account', uk: 'Рахунок' },
};

const linkTypeIcons: Record<string, string> = {
  invoice: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  portfolio: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  exception: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  syncjob: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  report: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  task: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  thread: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  entity: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  account: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
};

const linkTypeUrls: Record<string, (id: string) => string> = {
  invoice: (id) => `/m/billing/invoice/${id}`,
  document: (id) => `/m/documents/item/${id}`,
  portfolio: (id) => `/m/portfolios/${id}`,
  exception: (id) => `/m/data-quality/exception/${id}`,
  syncjob: (id) => `/m/integrations/job/${id}`,
  report: (id) => `/m/reports/item/${id}`,
  task: (id) => `/m/workflow/task/${id}`,
  thread: (id) => `/m/comms/thread/${id}`,
  entity: (id) => `/m/entities/${id}`,
  account: (id) => `/m/accounts/${id}`,
};

export function CsCaseLinksPanel({ caseId, locale = 'ru', onLinkObject }: CsCaseLinksPanelProps) {
  const t = useTranslation();

  const { items: allLinks = [], loading } = useCollection<CaseLink>('caseLinks');

  const links = allLinks
    .filter(l => l.caseId === caseId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        {t('loading', { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Link Button */}
      {onLinkObject && (
        <div className="flex justify-end">
          <button
            onClick={onLinkObject}
            className="
              inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
              text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors
            "
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {t('linkObject', { ru: 'Связать объект', en: 'Link Object', uk: 'Пов\'язати об\'єкт' })}
          </button>
        </div>
      )}

      {/* Links List */}
      {links.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          {t('noLinks', { ru: 'Нет связанных объектов', en: 'No linked objects', uk: 'Немає пов\'язаних об\'єктів' })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {links.map((link) => {
            const typeLabel = linkTypeLabels[link.linkedType]?.[locale] || link.linkedType;
            const icon = linkTypeIcons[link.linkedType] || linkTypeIcons.document;
            const url = link.linkedUrl || linkTypeUrls[link.linkedType]?.(link.linkedId) || '#';

            return (
              <Link
                key={link.id}
                href={url}
                className="
                  flex items-start gap-3 p-3 rounded-lg border border-gray-200
                  bg-white hover:bg-gray-50 hover:border-emerald-300 transition-all
                "
              >
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {typeLabel}
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {link.linkedName || link.linkedId}
                  </div>
                  {link.linkReason && (
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {link.linkReason}
                    </div>
                  )}
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
