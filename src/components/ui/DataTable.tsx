"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = "Нет данных",
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={cn(
        "bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center",
        className
      )}>
        <div className="text-stone-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden",
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gradient-to-r from-stone-50 to-stone-100/80 border-b border-stone-200/50">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  "transition-colors hover:bg-stone-50/50",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col, i) => (
                  <td key={i} className="px-4 py-3 text-sm text-stone-700">
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
