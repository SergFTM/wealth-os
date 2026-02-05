'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { CsPriorityPill } from './CsPriorityPill';
import { CsStatusPill } from './CsStatusPill';
import { formatTimeRemaining } from '../engine/slaEngine';

export interface MyCaseRow {
  id: string;
  caseNumber: string;
  title: string;
  caseType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'awaiting_client' | 'resolved' | 'closed';
  dueAt?: string | null;
  slaBreached?: boolean;
  reporterName?: string | null;
  clientVisible?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CsMyCasesTableProps {
  cases: MyCaseRow[];
  locale?: string;
  onOpenCase?: (id: string) => void;
}

const typeLabels: Record<string, Record<string, string>> = {
  request: { ru: 'Запрос', en: 'Request', uk: 'Запит' },
  incident: { ru: 'Инцидент', en: 'Incident', uk: 'Інцидент' },
  change: { ru: 'Изменение', en: 'Change', uk: 'Зміна' },
  problem: { ru: 'Проблема', en: 'Problem', uk: 'Проблема' },
};

export function CsMyCasesTable({ cases, locale = 'ru', onOpenCase }: CsMyCasesTableProps) {
  const t = useTranslation();

  if (cases.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {t('noMyCases', { ru: 'У вас нет назначенных кейсов', en: 'You have no assigned cases', uk: 'У вас немає призначених кейсів' })}
      </div>
    );
  }

  // Sort by priority (critical first) then by due date
  const sortedCases = [...cases].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const pA = priorityOrder[a.priority] ?? 2;
    const pB = priorityOrder[b.priority] ?? 2;
    if (pA !== pB) return pA - pB;

    if (a.dueAt && b.dueAt) {
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    }
    return 0;
  });

  return (
    <div className="space-y-3">
      {sortedCases.map((caseItem) => (
        <div
          key={caseItem.id}
          className={`
            p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer
            ${caseItem.slaBreached
              ? 'bg-red-50/50 border-red-200 hover:border-red-300'
              : 'bg-white/80 border-gray-200 hover:border-emerald-300'
            }
          `}
          onClick={() => onOpenCase?.(caseItem.id)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/m/cases/case/${caseItem.id}`}
                  className="text-sm font-mono text-emerald-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {caseItem.caseNumber}
                </Link>
                <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">
                  {typeLabels[caseItem.caseType]?.[locale] || caseItem.caseType}
                </span>
              </div>

              <Link
                href={`/m/cases/case/${caseItem.id}`}
                className="text-sm font-medium text-gray-900 hover:text-emerald-600 line-clamp-1"
                onClick={(e) => e.stopPropagation()}
              >
                {caseItem.title}
              </Link>

              {caseItem.reporterName && (
                <div className="text-xs text-gray-500 mt-1">
                  {t('from', { ru: 'От', en: 'From', uk: 'Від' })}: {caseItem.reporterName}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <CsPriorityPill priority={caseItem.priority} locale={locale} />
                <CsStatusPill status={caseItem.status} locale={locale} />
              </div>

              {caseItem.dueAt && (
                <div className={`text-xs ${caseItem.slaBreached ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                  {caseItem.slaBreached && (
                    <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  SLA: {formatTimeRemaining(caseItem.dueAt)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
