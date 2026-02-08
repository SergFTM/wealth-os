"use client";

import { useRouter } from 'next/navigation';
import { PlStatusPill } from './PlStatusPill';

interface PolicyVersion {
  id: string;
  docType: 'policy' | 'sop';
  docTitle: string;
  versionLabel: string;
  status: string;
  createdByName?: string;
  publishedAt?: string;
  createdAt: string;
}

interface PlVersionsTableProps {
  versions: PolicyVersion[];
  onSelect?: (version: PolicyVersion) => void;
}

export function PlVersionsTable({ versions, onSelect }: PlVersionsTableProps) {
  const router = useRouter();

  const handleRowClick = (version: PolicyVersion) => {
    if (onSelect) {
      onSelect(version);
    } else {
      router.push(`/m/policies/version/${version.id}`);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (versions.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
        <div className="text-stone-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-stone-600 font-medium">Нет версий</p>
        <p className="text-stone-500 text-sm mt-1">Создайте первую версию документа</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-stone-50/50 border-b border-stone-200/50">
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Документ
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Тип
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Версия
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Статус
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Автор
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Дата
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {versions.map((version) => (
            <tr
              key={version.id}
              onClick={() => handleRowClick(version)}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">{version.docTitle}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded-full text-xs px-2 py-0.5 border ${
                  version.docType === 'policy'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {version.docType === 'policy' ? 'Политика' : 'SOP'}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-sm text-stone-700">{version.versionLabel}</span>
              </td>
              <td className="px-4 py-3">
                <PlStatusPill status={version.status} />
              </td>
              <td className="px-4 py-3 text-stone-600 text-sm">
                {version.createdByName || '—'}
              </td>
              <td className="px-4 py-3 text-stone-600 text-sm">
                {version.publishedAt ? formatDate(version.publishedAt) : formatDate(version.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
