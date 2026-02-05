"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  userId: string;
  userName?: string;
  device: string;
  browser?: string;
  ipMasked: string;
  locationText: string;
  mfaVerified: boolean;
  suspicious: boolean;
  status: "active" | "revoked";
  lastActiveAt: string;
}

interface ScSessionsTableProps {
  sessions: Session[];
  mini?: boolean;
  onRevoke?: (id: string) => void;
  onMarkSuspicious?: (id: string) => void;
}

export function ScSessionsTable({ sessions, mini, onRevoke, onMarkSuspicious }: ScSessionsTableProps) {
  const { locale } = useApp();

  const displaySessions = mini ? sessions.slice(0, 8) : sessions;

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
                {locale === "ru" ? "Пользователь" : "User"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Устройство" : "Device"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">IP</th>
              {!mini && (
                <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                  {locale === "ru" ? "Локация" : "Location"}
                </th>
              )}
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">MFA</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Активность" : "Last Active"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Статус" : "Status"}
              </th>
              <th className="px-4 py-3 text-right font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Действия" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
            {displaySessions.map((session) => (
              <tr
                key={session.id}
                className={cn(
                  "hover:bg-stone-50/50 dark:hover:bg-stone-700/30 transition-colors",
                  session.suspicious && "bg-red-50/50 dark:bg-red-900/10"
                )}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800 dark:text-stone-200">{session.userName || session.userId}</div>
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                  <div className="text-xs">
                    {session.device}
                    {session.browser && <span className="text-stone-400 dark:text-stone-500"> · {session.browser}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-stone-600 dark:text-stone-400">
                  {session.ipMasked}
                </td>
                {!mini && (
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs">
                    {session.locationText}
                  </td>
                )}
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      session.mfaVerified
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    )}
                  >
                    {session.mfaVerified ? "✓" : "✗"}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs">
                  {formatDate(session.lastActiveAt)}
                </td>
                <td className="px-4 py-3">
                  {session.suspicious ? (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                      {locale === "ru" ? "Подозрит." : "Suspicious"}
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        session.status === "active"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                      )}
                    >
                      {session.status === "active"
                        ? locale === "ru" ? "Активна" : "Active"
                        : locale === "ru" ? "Отозвана" : "Revoked"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onRevoke && session.status === "active" && (
                      <button
                        onClick={() => onRevoke(session.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title={locale === "ru" ? "Отозвать" : "Revoke"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                    )}
                    {onMarkSuspicious && !session.suspicious && session.status === "active" && (
                      <button
                        onClick={() => onMarkSuspicious(session.id)}
                        className="p-1.5 text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        title={locale === "ru" ? "Пометить подозрительной" : "Mark Suspicious"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
      {mini && sessions.length > 8 && (
        <div className="px-4 py-3 border-t border-stone-200/50 dark:border-stone-700/50 bg-stone-50/50 dark:bg-stone-900/30">
          <Link href="/m/security/list?tab=sessions" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
            {locale === "ru" ? `Показать все ${sessions.length} →` : `View all ${sessions.length} →`}
          </Link>
        </div>
      )}
    </div>
  );
}
