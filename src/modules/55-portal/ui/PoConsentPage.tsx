'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useCollection } from '@/lib/hooks';

interface Consent {
  id: string;
  grantor: string;
  grantee: string;
  purpose: string;
  effectiveFrom: string;
  effectiveTo: string;
  status: string;
}

const DEMO_CONSENTS: Consent[] = [
  {
    id: 'con-001',
    grantor: 'Александр Петров',
    grantee: 'Внешний аудитор (PwC)',
    purpose: 'audit',
    effectiveFrom: '2025-01-01',
    effectiveTo: '2025-12-31',
    status: 'active',
  },
  {
    id: 'con-002',
    grantor: 'Александр Петров',
    grantee: 'Налоговый консультант (Deloitte)',
    purpose: 'tax',
    effectiveFrom: '2025-03-01',
    effectiveTo: '2026-02-28',
    status: 'active',
  },
  {
    id: 'con-003',
    grantor: 'Елена Петрова',
    grantee: 'Юридический консультант (Baker McKenzie)',
    purpose: 'legal',
    effectiveFrom: '2025-06-01',
    effectiveTo: '2026-05-31',
    status: 'active',
  },
  {
    id: 'con-004',
    grantor: 'Александр Петров',
    grantee: 'Инвестиционный советник (Aurora Advisors)',
    purpose: 'advisor',
    effectiveFrom: '2024-09-01',
    effectiveTo: '2026-08-31',
    status: 'expiring',
  },
  {
    id: 'con-005',
    grantor: 'Aurora Family Trust',
    grantee: 'Банк (UBS)',
    purpose: 'banking',
    effectiveFrom: '2025-01-01',
    effectiveTo: '2027-12-31',
    status: 'active',
  },
];

const purposeConfig: Record<string, { label: string; color: string }> = {
  audit: { label: 'Аудит', color: 'bg-blue-50 text-blue-600' },
  tax: { label: 'Налоговые цели', color: 'bg-amber-50 text-amber-600' },
  legal: { label: 'Юридические цели', color: 'bg-purple-50 text-purple-600' },
  advisor: { label: 'Доступ советника', color: 'bg-emerald-50 text-emerald-600' },
  banking: { label: 'Банковские цели', color: 'bg-stone-100 text-stone-600' },
};

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: 'Активен', color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  expiring: { label: 'Истекает', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  expired: { label: 'Истёк', color: 'bg-stone-100 text-stone-500', dot: 'bg-stone-400' },
  revoked: { label: 'Отозван', color: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
};

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function PoConsentPage() {
  const collection = useCollection<any>('consents');

  const consents: Consent[] =
    collection.items.length > 0 ? (collection.items as any[]) : DEMO_CONSENTS;

  return (
    <div className="space-y-6 font-[Inter]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Управление согласиями</h1>
        <p className="text-stone-500 mt-1">
          Активные согласия и разрешения на доступ к вашим данным
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Активных',
            value: consents.filter((c) => c.status === 'active').length,
            color: 'text-emerald-600',
          },
          {
            label: 'Истекающих',
            value: consents.filter((c) => c.status === 'expiring').length,
            color: 'text-amber-600',
          },
          {
            label: 'Всего согласий',
            value: consents.length,
            color: 'text-stone-700',
          },
          {
            label: 'Получателей',
            value: new Set(consents.map((c) => c.grantee)).size,
            color: 'text-blue-600',
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5"
          >
            <p className="text-sm text-stone-500">{kpi.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Consents list */}
      <div className="space-y-4">
        {consents.map((consent) => {
          const purpose = purposeConfig[consent.purpose] || {
            label: consent.purpose,
            color: 'bg-stone-100 text-stone-600',
          };
          const status = statusConfig[consent.status] || statusConfig.active;

          return (
            <div
              key={consent.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Grantor -> Grantee */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-stone-800">{consent.grantor}</span>
                    <svg className="w-4 h-4 text-stone-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-sm text-stone-600 truncate">{consent.grantee}</span>
                  </div>

                  {/* Purpose badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${purpose.color}`}>
                      {purpose.label}
                    </span>
                  </div>

                  {/* Effective dates */}
                  <div className="flex items-center gap-4 text-xs text-stone-400">
                    <span>С: {formatDate(consent.effectiveFrom)}</span>
                    <span>До: {formatDate(consent.effectiveTo)}</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-3">
                  {/* Status badge */}
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>

                  {/* Request change button */}
                  <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                    Запросить изменение
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {consents.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-stone-400">Нет активных согласий</p>
        </div>
      )}
    </div>
  );
}
