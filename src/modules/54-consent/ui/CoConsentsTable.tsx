"use client";

import { MoreHorizontal, Eye } from 'lucide-react';
import { useState } from 'react';
import { CoStatusPill } from './CoStatusPill';
import { CoPurposeBadge } from './CoPurposeBadge';
import { CoScopeBadge } from './CoScopeBadge';

interface CoConsentsTableProps {
  consents: any[];
  onOpen: (id: string) => void;
  compact?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

export function CoConsentsTable({ consents, onOpen, compact = false }: CoConsentsTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (consents.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        Нет согласий
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200/50">
            <th className="px-4 py-3 font-medium">Грантор</th>
            <th className="px-4 py-3 font-medium">Получатель</th>
            <th className="px-4 py-3 font-medium">Цель</th>
            {!compact && <th className="px-4 py-3 font-medium">Scope</th>}
            <th className="px-4 py-3 font-medium">С</th>
            <th className="px-4 py-3 font-medium">До</th>
            <th className="px-4 py-3 font-medium">Статус</th>
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {consents.map((consent) => (
            <tr
              key={consent.id}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
              onClick={() => onOpen(consent.id)}
            >
              <td className="px-4 py-3 text-sm text-stone-800 font-medium truncate max-w-[160px]">
                {consent.grantorName || consent.grantor}
              </td>
              <td className="px-4 py-3 text-sm text-stone-600 truncate max-w-[160px]">
                {consent.recipientName || consent.recipient}
              </td>
              <td className="px-4 py-3">
                <CoPurposeBadge purpose={consent.purpose} />
              </td>
              {!compact && (
                <td className="px-4 py-3">
                  <CoScopeBadge
                    scopeType="modules"
                    count={consent.scopeModules?.length ?? consent.scopeCount ?? 0}
                  />
                </td>
              )}
              <td className="px-4 py-3 text-sm text-stone-600">
                {consent.validFrom ? formatDate(consent.validFrom) : '-'}
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {consent.validUntil ? formatDate(consent.validUntil) : '-'}
              </td>
              <td className="px-4 py-3">
                <CoStatusPill status={consent.status} />
              </td>
              <td className="px-4 py-3">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === consent.id ? null : consent.id);
                    }}
                    className="p-1 hover:bg-stone-100 rounded"
                  >
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                  {menuOpen === consent.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(null);
                        }}
                      />
                      <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-20 py-1 min-w-[160px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(consent.id);
                            setMenuOpen(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Подробнее
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
