"use client";

import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Permission {
  id: string;
  roleId: string;
  moduleKey: string;
  actionKey: string;
  scopeType: string;
  allow: boolean;
  clientSafeAllow: boolean;
}

interface ScPermissionsMatrixProps {
  permissions: Permission[];
  roleId: string;
  onToggle?: (moduleKey: string, actionKey: string, allow: boolean) => void;
  onToggleClientSafe?: (moduleKey: string, actionKey: string, allow: boolean) => void;
  readOnly?: boolean;
}

const MODULES = [
  { key: "networth", label: { ru: "Net Worth", en: "Net Worth" } },
  { key: "gl", label: { ru: "GL", en: "GL" } },
  { key: "portfolio", label: { ru: "Портфель", en: "Portfolio" } },
  { key: "performance", label: { ru: "Доходность", en: "Performance" } },
  { key: "private-capital", label: { ru: "Private Capital", en: "Private Capital" } },
  { key: "liquidity", label: { ru: "Ликвидность", en: "Liquidity" } },
  { key: "documents", label: { ru: "Документы", en: "Documents" } },
  { key: "billing", label: { ru: "Биллинг", en: "Billing" } },
  { key: "workflow", label: { ru: "Workflow", en: "Workflow" } },
  { key: "onboarding", label: { ru: "Onboarding", en: "Onboarding" } },
  { key: "ips", label: { ru: "IPS", en: "IPS" } },
  { key: "risk", label: { ru: "Риски", en: "Risk" } },
  { key: "tax", label: { ru: "Налоги", en: "Tax" } },
  { key: "trusts", label: { ru: "Трасты", en: "Trusts" } },
  { key: "fees", label: { ru: "Комиссии", en: "Fees" } },
  { key: "integrations", label: { ru: "Интеграции", en: "Integrations" } },
  { key: "comms", label: { ru: "Коммуникации", en: "Comms" } },
  { key: "ai", label: { ru: "AI", en: "AI" } },
  { key: "security", label: { ru: "Безопасность", en: "Security" } },
];

const ACTIONS = [
  { key: "view", label: { ru: "Просмотр", en: "View" } },
  { key: "create", label: { ru: "Создание", en: "Create" } },
  { key: "edit", label: { ru: "Редакт.", en: "Edit" } },
  { key: "approve", label: { ru: "Одобр.", en: "Approve" } },
  { key: "export", label: { ru: "Экспорт", en: "Export" } },
];

export function ScPermissionsMatrix({
  permissions,
  roleId,
  onToggle,
  onToggleClientSafe,
  readOnly = false,
}: ScPermissionsMatrixProps) {
  const { locale } = useApp();
  const [showClientSafe, setShowClientSafe] = useState(false);

  const getPermission = (moduleKey: string, actionKey: string) => {
    return permissions.find(
      (p) => p.roleId === roleId && p.moduleKey === moduleKey && p.actionKey === actionKey
    );
  };

  const isAllowed = (moduleKey: string, actionKey: string) => {
    const perm = getPermission(moduleKey, actionKey);
    return showClientSafe ? perm?.clientSafeAllow : perm?.allow;
  };

  const handleToggle = (moduleKey: string, actionKey: string) => {
    if (readOnly) return;
    const current = isAllowed(moduleKey, actionKey);
    if (showClientSafe && onToggleClientSafe) {
      onToggleClientSafe(moduleKey, actionKey, !current);
    } else if (!showClientSafe && onToggle) {
      onToggle(moduleKey, actionKey, !current);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-200/50 dark:border-stone-700/50 flex items-center justify-between">
        <h3 className="font-medium text-stone-800 dark:text-stone-200">
          {locale === "ru" ? "Матрица разрешений" : "Permissions Matrix"}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowClientSafe(false)}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              !showClientSafe
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                : "text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
            )}
          >
            {locale === "ru" ? "Стандарт" : "Standard"}
          </button>
          <button
            onClick={() => setShowClientSafe(true)}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              showClientSafe
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                : "text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
            )}
          >
            {locale === "ru" ? "Client-safe" : "Client-safe"}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-stone-50/80 dark:bg-stone-900/50">
              <th className="px-3 py-2 text-left font-medium text-stone-600 dark:text-stone-400 sticky left-0 bg-stone-50/80 dark:bg-stone-900/50">
                {locale === "ru" ? "Модуль" : "Module"}
              </th>
              {ACTIONS.map((action) => (
                <th key={action.key} className="px-3 py-2 text-center font-medium text-stone-600 dark:text-stone-400">
                  {action.label[locale === "ru" ? "ru" : "en"]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-700/50">
            {MODULES.map((module) => (
              <tr key={module.key} className="hover:bg-stone-50/50 dark:hover:bg-stone-700/30">
                <td className="px-3 py-2 font-medium text-stone-700 dark:text-stone-300 sticky left-0 bg-white/70 dark:bg-stone-800/70">
                  {module.label[locale === "ru" ? "ru" : "en"]}
                </td>
                {ACTIONS.map((action) => (
                  <td key={action.key} className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleToggle(module.key, action.key)}
                      disabled={readOnly}
                      className={cn(
                        "w-6 h-6 rounded flex items-center justify-center transition-colors",
                        isAllowed(module.key, action.key)
                          ? showClientSafe
                            ? "bg-blue-500 text-white"
                            : "bg-emerald-500 text-white"
                          : "bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500",
                        !readOnly && "hover:opacity-80 cursor-pointer"
                      )}
                    >
                      {isAllowed(module.key, action.key) ? "✓" : ""}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-stone-200/50 dark:border-stone-700/50 bg-stone-50/50 dark:bg-stone-900/30">
        <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-emerald-500 rounded" />
            <span>{locale === "ru" ? "Разрешено" : "Allowed"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span>{locale === "ru" ? "Client-safe" : "Client-safe"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-stone-200 dark:bg-stone-700 rounded" />
            <span>{locale === "ru" ? "Запрещено" : "Denied"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
