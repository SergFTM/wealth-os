"use client";

import { useRouter } from 'next/navigation';
import { PlStatusPill } from './PlStatusPill';
import { SopProcessLabels, SopProcessKey } from '../config';

interface Sop {
  id: string;
  title: string;
  processKey: SopProcessKey;
  status: string;
  currentVersionLabel?: string;
  ownerName?: string;
  clientSafePublished: boolean;
  stepsJson?: Array<{ orderIndex: number; title: string }>;
  updatedAt: string;
}

interface PlSopsTableProps {
  sops: Sop[];
  onSelect?: (sop: Sop) => void;
}

export function PlSopsTable({ sops, onSelect }: PlSopsTableProps) {
  const router = useRouter();

  const handleRowClick = (sop: Sop) => {
    if (onSelect) {
      onSelect(sop);
    } else {
      router.push(`/m/policies/sop/${sop.id}`);
    }
  };

  if (sops.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
        <div className="text-stone-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-stone-600 font-medium">Нет SOP</p>
        <p className="text-stone-500 text-sm mt-1">Создайте первую процедуру</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-stone-50/50 border-b border-stone-200/50">
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              SOP
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Процесс
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Статус
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Версия
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Шагов
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Владелец
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {sops.map((sop) => (
            <tr
              key={sop.id}
              onClick={() => handleRowClick(sop)}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">{sop.title}</div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs px-2 py-0.5">
                  {SopProcessLabels[sop.processKey]?.ru || sop.processKey}
                </span>
              </td>
              <td className="px-4 py-3">
                <PlStatusPill status={sop.status} />
              </td>
              <td className="px-4 py-3 text-stone-600 text-sm">
                {sop.currentVersionLabel || '—'}
              </td>
              <td className="px-4 py-3 text-stone-600 text-sm">
                {sop.stepsJson?.length || 0}
              </td>
              <td className="px-4 py-3 text-stone-600 text-sm">
                {sop.ownerName || <span className="text-amber-600">Не назначен</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
