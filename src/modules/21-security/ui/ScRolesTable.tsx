"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
  builtIn: boolean;
  description?: string;
  color?: string;
  permissionsCount?: number;
}

interface ScRolesTableProps {
  roles: Role[];
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function ScRolesTable({ roles, onEdit, onDuplicate }: ScRolesTableProps) {
  const { locale } = useApp();

  return (
    <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50/80 dark:bg-stone-900/50 border-b border-stone-200/50 dark:border-stone-700/50">
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Роль" : "Role"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Описание" : "Description"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Тип" : "Type"}
              </th>
              <th className="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Разрешения" : "Permissions"}
              </th>
              <th className="px-4 py-3 text-right font-medium text-stone-600 dark:text-stone-400">
                {locale === "ru" ? "Действия" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-700/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: role.color || "#6B7280" }}
                    />
                    <span className="font-medium text-stone-800 dark:text-stone-200">{role.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-400 text-xs max-w-xs truncate">
                  {role.description || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      role.builtIn
                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                        : "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                    )}
                  >
                    {role.builtIn
                      ? locale === "ru" ? "Встроенная" : "Built-in"
                      : locale === "ru" ? "Кастомная" : "Custom"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                    {role.permissionsCount ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/m/security/item/${role.id}?type=role`}
                      className="p-1.5 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title={locale === "ru" ? "Открыть" : "Open"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    {onEdit && !role.builtIn && (
                      <button
                        onClick={() => onEdit(role.id)}
                        className="p-1.5 text-stone-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title={locale === "ru" ? "Редактировать" : "Edit"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    {onDuplicate && (
                      <button
                        onClick={() => onDuplicate(role.id)}
                        className="p-1.5 text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                        title={locale === "ru" ? "Дублировать" : "Duplicate"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
