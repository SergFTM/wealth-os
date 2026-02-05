"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";

interface Group {
  id: string;
  name: string;
  description?: string;
  memberIds: string[];
  defaultRoleId?: string;
  defaultRoleName?: string;
}

interface ScGroupsTableProps {
  groups: Group[];
  onAddMember?: (id: string) => void;
  onBindRole?: (id: string) => void;
}

export function ScGroupsTable({ groups, onAddMember, onBindRole }: ScGroupsTableProps) {
  const { locale } = useApp();

  return (
    <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50/80 dark:bg-stone-900/50 border-b border-stone-200/50 dark:border-stone-700/50">
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Группа" : "Group"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Описание" : "Description"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Участники" : "Members"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Роль по умолчанию" : "Default Role"}
              </th>
              <th className="px-4 py-3 text-right font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Действия" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
            {groups.map((group) => (
              <tr key={group.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-700/30 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/m/security/item/${group.id}?type=group`} className="font-medium text-stone-800 dark:text-stone-200 hover:text-emerald-600 dark:hover:text-emerald-400">
                    {group.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs max-w-xs truncate">
                  {group.description || "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded text-xs">
                    {group.memberIds?.length || 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs">
                  {group.defaultRoleName || "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/m/security/item/${group.id}?type=group`}
                      className="p-1.5 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title={locale === "ru" ? "Открыть" : "Open"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    {onAddMember && (
                      <button
                        onClick={() => onAddMember(group.id)}
                        className="p-1.5 text-stone-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title={locale === "ru" ? "Добавить участника" : "Add Member"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </button>
                    )}
                    {onBindRole && (
                      <button
                        onClick={() => onBindRole(group.id)}
                        className="p-1.5 text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                        title={locale === "ru" ? "Привязать роль" : "Bind Role"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
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
