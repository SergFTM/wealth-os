"use client";

import { useRouter } from 'next/navigation';
import { PlStatusPill } from './PlStatusPill';
import { PlTagChips } from './PlTagChips';
import { PolicyCategoryLabels, PolicyCategoryKey } from '../config';

interface Policy {
  id: string;
  title: string;
  categoryKey: PolicyCategoryKey;
  status: string;
  currentVersionLabel?: string;
  ownerName?: string;
  clientSafePublished: boolean;
  tagsJson?: string[];
  updatedAt: string;
}

interface PlPoliciesTableProps {
  policies: Policy[];
  onSelect?: (policy: Policy) => void;
}

export function PlPoliciesTable({ policies, onSelect }: PlPoliciesTableProps) {
  const router = useRouter();

  const handleRowClick = (policy: Policy) => {
    if (onSelect) {
      onSelect(policy);
    } else {
      router.push(`/m/policies/policy/${policy.id}`);
    }
  };

  if (policies.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
        <div className="text-stone-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-stone-600 font-medium">Нет политик</p>
        <p className="text-stone-500 text-sm mt-1">Создайте первую политику</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-stone-50/50 border-b border-stone-200/50">
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Название
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Категория
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Статус
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Версия
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Владелец
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Client-safe
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {policies.map((policy) => (
            <tr
              key={policy.id}
              onClick={() => handleRowClick(policy)}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">{policy.title}</div>
                {policy.tagsJson && policy.tagsJson.length > 0 && (
                  <div className="mt-1">
                    <PlTagChips tags={policy.tagsJson} maxVisible={2} />
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs px-2 py-0.5">
                  {PolicyCategoryLabels[policy.categoryKey]?.ru || policy.categoryKey}
                </span>
              </td>
              <td className="px-4 py-3">
                <PlStatusPill status={policy.status} />
              </td>
              <td className="px-4 py-3 text-stone-600 text-sm">
                {policy.currentVersionLabel || '—'}
              </td>
              <td className="px-4 py-3 text-stone-600 text-sm">
                {policy.ownerName || <span className="text-amber-600">Не назначен</span>}
              </td>
              <td className="px-4 py-3">
                {policy.clientSafePublished ? (
                  <span className="inline-flex items-center text-emerald-600">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Да
                  </span>
                ) : (
                  <span className="text-stone-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
