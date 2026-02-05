"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface SavedView {
  id: string;
  name: string;
  moduleKey: string;
  route: string;
  isPinned: boolean;
  createdAt: string;
}

interface PfSavedViewsTableProps {
  views: SavedView[];
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PfSavedViewsTable({ views, onTogglePin, onDelete }: PfSavedViewsTableProps) {
  const { locale } = useApp();

  const t = {
    name: locale === "ru" ? "Название" : "Name",
    module: locale === "ru" ? "Модуль" : "Module",
    pinned: locale === "ru" ? "Закреплено" : "Pinned",
    created: locale === "ru" ? "Создано" : "Created",
    actions: locale === "ru" ? "Действия" : "Actions",
    apply: locale === "ru" ? "Применить" : "Apply",
    pin: locale === "ru" ? "Закрепить" : "Pin",
    unpin: locale === "ru" ? "Открепить" : "Unpin",
    delete: locale === "ru" ? "Удалить" : "Delete",
    empty: locale === "ru" ? "Нет сохраненных представлений" : "No saved views",
  };

  if (views.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center text-stone-500">
        {t.empty}
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200/50 bg-stone-50/50">
            <th className="px-4 py-3 text-left font-medium text-stone-600">{t.name}</th>
            <th className="px-4 py-3 text-left font-medium text-stone-600">{t.module}</th>
            <th className="px-4 py-3 text-left font-medium text-stone-600">{t.pinned}</th>
            <th className="px-4 py-3 text-left font-medium text-stone-600">{t.created}</th>
            <th className="px-4 py-3 text-right font-medium text-stone-600">{t.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {views.map((view) => (
            <tr key={view.id} className="hover:bg-stone-50/50 transition-colors">
              <td className="px-4 py-3 font-medium text-stone-800">{view.name}</td>
              <td className="px-4 py-3 text-stone-600">{view.moduleKey}</td>
              <td className="px-4 py-3">
                {view.isPinned ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {t.pinned}
                  </span>
                ) : (
                  <span className="text-stone-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-stone-500 text-xs">
                {new Date(view.createdAt).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US")}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={view.route}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
                  >
                    {t.apply}
                  </Link>
                  <button
                    onClick={() => onTogglePin(view.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      view.isPinned
                        ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    )}
                  >
                    {view.isPinned ? t.unpin : t.pin}
                  </button>
                  <button
                    onClick={() => onDelete(view.id)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors"
                  >
                    {t.delete}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
