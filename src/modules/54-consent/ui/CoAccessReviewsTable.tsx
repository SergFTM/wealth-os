"use client";

import { MoreHorizontal, Eye } from 'lucide-react';
import { useState } from 'react';
import { CoStatusPill } from './CoStatusPill';

interface CoAccessReviewsTableProps {
  reviews: any[];
  onOpen: (id: string) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

export function CoAccessReviewsTable({ reviews, onOpen }: CoAccessReviewsTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (reviews.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        Нет проверок доступа
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200/50">
            <th className="px-4 py-3 font-medium">Название</th>
            <th className="px-4 py-3 font-medium">Scope</th>
            <th className="px-4 py-3 font-medium">Статус</th>
            <th className="px-4 py-3 font-medium">Срок</th>
            <th className="px-4 py-3 font-medium">Решений</th>
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {reviews.map((review) => (
            <tr
              key={review.id}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
              onClick={() => onOpen(review.id)}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800 truncate max-w-[220px]">
                  {review.name}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-stone-600 truncate max-w-[200px]">
                {review.scopeDescription || review.scope || '-'}
              </td>
              <td className="px-4 py-3">
                <CoStatusPill status={review.status} />
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {review.deadline ? formatDate(review.deadline) : '-'}
              </td>
              <td className="px-4 py-3 text-sm text-stone-700 font-mono">
                {review.decisionsCount ?? review.decisions ?? 0}
              </td>
              <td className="px-4 py-3">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === review.id ? null : review.id);
                    }}
                    className="p-1 hover:bg-stone-100 rounded"
                  >
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                  {menuOpen === review.id && (
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
                            onOpen(review.id);
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
