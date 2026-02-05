"use client";

import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface AuditEvent {
  id: string;
  ts: string;
  actorRole: string;
  actorName: string;
  action: string;
  collection: string;
  recordId: string;
  summary: string;
  scope?: string;
  severity?: "info" | "warning" | "critical";
}

interface ScAuditLogTableProps {
  events: AuditEvent[];
  onExport?: () => void;
}

export function ScAuditLogTable({ events, onExport }: ScAuditLogTableProps) {
  const { locale } = useApp();

  const severityColors: Record<string, string> = {
    info: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    critical: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  };

  const actionLabels: Record<string, { ru: string; en: string }> = {
    create: { ru: "Создание", en: "Create" },
    update: { ru: "Обновление", en: "Update" },
    delete: { ru: "Удаление", en: "Delete" },
    approve: { ru: "Одобрение", en: "Approve" },
    reject: { ru: "Отклонение", en: "Reject" },
    view: { ru: "Просмотр", en: "View" },
    share: { ru: "Поделиться", en: "Share" },
    revoke: { ru: "Отзыв", en: "Revoke" },
    login: { ru: "Вход", en: "Login" },
    logout: { ru: "Выход", en: "Logout" },
    login_failed: { ru: "Неудачный вход", en: "Failed Login" },
    export: { ru: "Экспорт", en: "Export" },
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 flex items-center justify-between">
        <h3 className="font-medium text-stone-800 dark:text-stone-200">
          {locale === "ru" ? "Журнал аудита" : "Audit Log"}
        </h3>
        {onExport && (
          <button
            onClick={onExport}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {locale === "ru" ? "Экспорт CSV" : "Export CSV"}
          </button>
        )}
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0">
            <tr className="bg-stone-50/95 dark:bg-stone-900/95 border-b border-stone-200/50 dark:border-stone-700/50">
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Время" : "Time"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Актор" : "Actor"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Действие" : "Action"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Коллекция" : "Collection"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Описание" : "Summary"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Серьёзность" : "Severity"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-700/30 transition-colors">
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs font-mono whitespace-nowrap">
                  {formatDate(event.ts)}
                </td>
                <td className="px-4 py-3">
                  <div className="text-stone-800 dark:text-stone-200 text-xs">{event.actorName}</div>
                  <div className="text-stone-500 dark:text-stone-400 text-xs">{event.actorRole}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded text-xs">
                    {actionLabels[event.action]?.[locale === "ru" ? "ru" : "en"] || event.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs">
                  {event.collection}
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs max-w-xs truncate">
                  {event.summary}
                </td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded text-xs font-medium", severityColors[event.severity || "info"])}>
                    {event.severity || "info"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
