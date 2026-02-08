"use client";

import { useRouter } from 'next/navigation';

interface Checklist {
  id: string;
  name: string;
  linkedSopId?: string;
  linkedSopTitle?: string;
  stepsJson: Array<{ orderIndex: number; title: string }>;
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
}

interface PlChecklistsTableProps {
  checklists: Checklist[];
  onSelect?: (checklist: Checklist) => void;
}

export function PlChecklistsTable({ checklists, onSelect }: PlChecklistsTableProps) {
  const router = useRouter();

  const handleRowClick = (checklist: Checklist) => {
    if (onSelect) {
      onSelect(checklist);
    } else {
      router.push(`/m/policies/checklist/${checklist.id}`);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (checklists.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
        <div className="text-stone-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <p className="text-stone-600 font-medium">Нет чеклистов</p>
        <p className="text-stone-500 text-sm mt-1">Сгенерируйте чеклист из SOP</p>
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
              Связанный SOP
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Шагов
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Использований
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Последнее исп.
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {checklists.map((checklist) => (
            <tr
              key={checklist.id}
              onClick={() => handleRowClick(checklist)}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">{checklist.name}</div>
              </td>
              <td className="px-4 py-3 text-stone-600 text-sm">
                {checklist.linkedSopTitle || '—'}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-medium text-sm">
                  {checklist.stepsJson.length}
                </span>
              </td>
              <td className="px-4 py-3 text-stone-600 text-sm">
                {checklist.usageCount}
              </td>
              <td className="px-4 py-3 text-stone-600 text-sm">
                {checklist.lastUsedAt ? formatDate(checklist.lastUsedAt) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
