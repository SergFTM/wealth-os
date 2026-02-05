"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Incident {
  id: string;
  incidentType: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "dismissed";
  userId?: string;
  userName?: string;
  title: string;
  createdAt: string;
}

interface ScIncidentsTableProps {
  incidents: Incident[];
  mini?: boolean;
  onResolve?: (id: string) => void;
  onCreateTask?: (id: string) => void;
}

export function ScIncidentsTable({ incidents, mini, onResolve, onCreateTask }: ScIncidentsTableProps) {
  const { locale } = useApp();

  const displayIncidents = mini ? incidents.slice(0, 8) : incidents;

  const severityLabels: Record<string, { ru: string; en: string }> = {
    low: { ru: "Низкий", en: "Low" },
    medium: { ru: "Средний", en: "Medium" },
    high: { ru: "Высокий", en: "High" },
    critical: { ru: "Критический", en: "Critical" },
  };

  const statusLabels: Record<string, { ru: string; en: string }> = {
    open: { ru: "Открыт", en: "Open" },
    investigating: { ru: "Расследуется", en: "Investigating" },
    resolved: { ru: "Решён", en: "Resolved" },
    dismissed: { ru: "Отклонён", en: "Dismissed" },
  };

  const typeLabels: Record<string, { ru: string; en: string }> = {
    suspicious_login: { ru: "Подозрительный вход", en: "Suspicious Login" },
    policy_violation: { ru: "Нарушение политики", en: "Policy Violation" },
    mfa_bypass: { ru: "Обход MFA", en: "MFA Bypass" },
    data_export: { ru: "Экспорт данных", en: "Data Export" },
    role_change: { ru: "Изменение роли", en: "Role Change" },
    failed_auth: { ru: "Неудачная авторизация", en: "Failed Auth" },
    session_anomaly: { ru: "Аномалия сессии", en: "Session Anomaly" },
  };

  const severityColors: Record<string, string> = {
    low: "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300",
    medium: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    high: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
    critical: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  };

  const statusColors: Record<string, string> = {
    open: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    investigating: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    resolved: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    dismissed: "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300",
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50/80 dark:bg-stone-900/50 border-b border-stone-200/50 dark:border-stone-700/50">
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Серьёзность" : "Severity"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Тип" : "Type"}
              </th>
              {!mini && (
                <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                  {locale === "ru" ? "Заголовок" : "Title"}
                </th>
              )}
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Пользователь" : "User"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Статус" : "Status"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Создан" : "Created"}
              </th>
              <th className="px-4 py-3 text-right font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Действия" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
            {displayIncidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-700/30 transition-colors">
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded text-xs font-medium", severityColors[incident.severity])}>
                    {severityLabels[incident.severity]?.[locale === "ru" ? "ru" : "en"] || incident.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs">
                  {typeLabels[incident.incidentType]?.[locale === "ru" ? "ru" : "en"] || incident.incidentType}
                </td>
                {!mini && (
                  <td className="px-4 py-3">
                    <Link href={`/m/security/item/${incident.id}?type=incident`} className="text-stone-800 dark:text-stone-200 hover:text-emerald-600 dark:hover:text-emerald-400">
                      {incident.title}
                    </Link>
                  </td>
                )}
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                  {incident.userName || "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusColors[incident.status])}>
                    {statusLabels[incident.status]?.[locale === "ru" ? "ru" : "en"] || incident.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs">
                  {formatDate(incident.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/m/security/item/${incident.id}?type=incident`}
                      className="p-1.5 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title={locale === "ru" ? "Открыть" : "Open"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    {onResolve && incident.status !== "resolved" && incident.status !== "dismissed" && (
                      <button
                        onClick={() => onResolve(incident.id)}
                        className="p-1.5 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title={locale === "ru" ? "Решить" : "Resolve"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    {onCreateTask && (
                      <button
                        onClick={() => onCreateTask(incident.id)}
                        className="p-1.5 text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                        title={locale === "ru" ? "Создать задачу" : "Create Task"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
      {mini && incidents.length > 8 && (
        <div className="px-4 py-3 border-t border-stone-200/50 dark:border-stone-700/50 bg-stone-50/50 dark:bg-stone-900/30">
          <Link href="/m/security/list?tab=incidents" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
            {locale === "ru" ? `Показать все ${incidents.length} →` : `View all ${incidents.length} →`}
          </Link>
        </div>
      )}
    </div>
  );
}
