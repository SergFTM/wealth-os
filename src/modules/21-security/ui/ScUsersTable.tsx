"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended";
  mfaEnabled: boolean;
  lastLoginAt: string;
  department?: string;
  jobTitle?: string;
  roleBindingsCount?: number;
}

interface ScUsersTableProps {
  users: User[];
  mini?: boolean;
  onBindRole?: (userId: string) => void;
  onRevokeSession?: (userId: string) => void;
  onSuspend?: (userId: string) => void;
}

export function ScUsersTable({ users, mini, onBindRole, onRevokeSession, onSuspend }: ScUsersTableProps) {
  const { locale } = useApp();

  const displayUsers = mini ? users.slice(0, 8) : users;

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
              {!mini && (
                <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                  {locale === "ru" ? "Должность" : "Job Title"}
                </th>
              )}
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Роли" : "Roles"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">MFA</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Последний вход" : "Last Login"}
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
            {displayUsers.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-700/30 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/m/security/item/${user.id}`} className="hover:text-emerald-600 dark:hover:text-emerald-400">
                    <div className="font-medium text-stone-800 dark:text-stone-200">{user.name}</div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">{user.email}</div>
                  </Link>
                </td>
                {!mini && (
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">{user.jobTitle || "—"}</td>
                )}
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded text-xs">
                    {user.roleBindingsCount ?? 1}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      user.mfaEnabled
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    )}
                  >
                    {user.mfaEnabled ? "✓" : "✗"}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs">
                  {formatDate(user.lastLoginAt)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      user.status === "active"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    )}
                  >
                    {user.status === "active"
                      ? locale === "ru" ? "Активен" : "Active"
                      : locale === "ru" ? "Приостановлен" : "Suspended"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/m/security/item/${user.id}`}
                      className="p-1.5 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title={locale === "ru" ? "Открыть" : "Open"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    {onBindRole && (
                      <button
                        onClick={() => onBindRole(user.id)}
                        className="p-1.5 text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                        title={locale === "ru" ? "Привязать роль" : "Bind Role"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </button>
                    )}
                    {onRevokeSession && (
                      <button
                        onClick={() => onRevokeSession(user.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title={locale === "ru" ? "Отозвать сессии" : "Revoke Sessions"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
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
      {mini && users.length > 8 && (
        <div className="px-4 py-3 border-t border-stone-200/50 dark:border-stone-700/50 bg-stone-50/50 dark:bg-stone-900/30">
          <Link href="/m/security/list?tab=users" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
            {locale === "ru" ? `Показать все ${users.length} →` : `View all ${users.length} →`}
          </Link>
        </div>
      )}
    </div>
  );
}
