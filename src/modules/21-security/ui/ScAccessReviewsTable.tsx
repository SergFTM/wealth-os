"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface AccessReview {
  id: string;
  name: string;
  scopeType: string;
  status: "draft" | "active" | "closed";
  dueAt: string;
  completionPct: number;
  createdAt: string;
}

interface ScAccessReviewsTableProps {
  reviews: AccessReview[];
  onStart?: (id: string) => void;
  onClose?: (id: string) => void;
}

export function ScAccessReviewsTable({ reviews, onStart, onClose }: ScAccessReviewsTableProps) {
  const { locale } = useApp();

  const statusLabels: Record<string, { ru: string; en: string }> = {
    draft: { ru: "Черновик", en: "Draft" },
    active: { ru: "Активно", en: "Active" },
    closed: { ru: "Закрыто", en: "Closed" },
  };

  const statusColors: Record<string, string> = {
    draft: "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300",
    active: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    closed: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  };

  const scopeLabels: Record<string, { ru: string; en: string }> = {
    global: { ru: "Глобальный", en: "Global" },
    role: { ru: "По роли", en: "By Role" },
    module: { ru: "По модулю", en: "By Module" },
    household: { ru: "По домохозяйству", en: "By Household" },
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50/80 dark:bg-stone-900/50 border-b border-stone-200/50 dark:border-stone-700/50">
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Название" : "Name"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Scope" : "Scope"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Статус" : "Status"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Срок" : "Due Date"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Прогресс" : "Progress"}
              </th>
              <th className="px-4 py-3 text-right font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Действия" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-700/30 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/m/security/item/${review.id}?type=review`} className="font-medium text-stone-800 dark:text-stone-200 hover:text-emerald-600 dark:hover:text-emerald-400">
                    {review.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs">
                  {scopeLabels[review.scopeType]?.[locale === "ru" ? "ru" : "en"] || review.scopeType}
                </td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusColors[review.status])}>
                    {statusLabels[review.status]?.[locale === "ru" ? "ru" : "en"] || review.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs">
                  {formatDate(review.dueAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full",
                          review.completionPct >= 100 ? "bg-emerald-500" : "bg-blue-500"
                        )}
                        style={{ width: `${Math.min(review.completionPct, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-stone-600 dark:text-stone-400">{review.completionPct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/m/security/item/${review.id}?type=review`}
                      className="p-1.5 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title={locale === "ru" ? "Открыть" : "Open"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    {onStart && review.status === "draft" && (
                      <button
                        onClick={() => onStart(review.id)}
                        className="p-1.5 text-stone-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title={locale === "ru" ? "Начать" : "Start"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    )}
                    {onClose && review.status === "active" && (
                      <button
                        onClick={() => onClose(review.id)}
                        className="p-1.5 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title={locale === "ru" ? "Закрыть" : "Close"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
