'use client';

import React from 'react';

export interface PTableColumn<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => React.ReactNode;
}

interface PTableProps<T> {
  columns: PTableColumn<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  loading?: boolean;
  compact?: boolean;
}

export function PTable<T extends { id?: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'Нет данных',
  loading = false,
  compact = false,
}: PTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-emerald-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
                  ${compact ? 'px-4 py-2' : 'px-6 py-3'}
                  text-left text-xs font-semibold text-slate-500 uppercase tracking-wider
                  ${col.align === 'center' ? 'text-center' : ''}
                  ${col.align === 'right' ? 'text-right' : ''}
                `}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50">
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              className={`
                ${onRowClick ? 'cursor-pointer hover:bg-emerald-50/50 transition-colors' : ''}
              `}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`
                    ${compact ? 'px-4 py-2' : 'px-6 py-4'}
                    text-sm text-slate-700
                    ${col.align === 'center' ? 'text-center' : ''}
                    ${col.align === 'right' ? 'text-right' : ''}
                  `}
                >
                  {col.render
                    ? col.render(item, index)
                    : (item as Record<string, unknown>)[col.key]?.toString() || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Simple list variant
interface PListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  gap?: string;
}

export function PList<T extends { id?: string }>({
  items,
  renderItem,
  emptyMessage = 'Нет данных',
  loading = false,
  gap = 'gap-3',
}: PListProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${gap}`}>
      {items.map((item, index) => (
        <div key={(item as { id?: string }).id || index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
