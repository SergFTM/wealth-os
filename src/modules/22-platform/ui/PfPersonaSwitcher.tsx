"use client";

import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/data";

interface PfPersonaSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const personas: { role: UserRole; title: { ru: string; en: string }; description: { ru: string; en: string }; color: string }[] = [
  {
    role: "admin",
    title: { ru: "Owner/Admin", en: "Owner/Admin" },
    description: { ru: "Полный доступ ко всем модулям", en: "Full access to all modules" },
    color: "from-violet-500 to-purple-600",
  },
  {
    role: "cio",
    title: { ru: "CIO", en: "CIO" },
    description: { ru: "Инвестиции, IPS, performance", en: "Investments, IPS, performance" },
    color: "from-blue-500 to-indigo-600",
  },
  {
    role: "cfo",
    title: { ru: "CFO", en: "CFO" },
    description: { ru: "Финансы, billing, reconciliation", en: "Finance, billing, reconciliation" },
    color: "from-emerald-500 to-teal-600",
  },
  {
    role: "operations",
    title: { ru: "Operations", en: "Operations" },
    description: { ru: "Операции, workflow, integrations", en: "Operations, workflow, integrations" },
    color: "from-amber-500 to-orange-600",
  },
  {
    role: "compliance",
    title: { ru: "Compliance", en: "Compliance" },
    description: { ru: "Комплаенс, риски, аудит", en: "Compliance, risk, audit" },
    color: "from-rose-500 to-pink-600",
  },
  {
    role: "rm",
    title: { ru: "RM", en: "RM" },
    description: { ru: "Отношения с клиентами", en: "Client relationships" },
    color: "from-cyan-500 to-sky-600",
  },
  {
    role: "advisor",
    title: { ru: "Advisor", en: "Advisor" },
    description: { ru: "Внешний советник, read-only", en: "External advisor, read-only" },
    color: "from-slate-500 to-gray-600",
  },
  {
    role: "client",
    title: { ru: "Client", en: "Client" },
    description: { ru: "Клиентский портал", en: "Client portal" },
    color: "from-stone-400 to-stone-500",
  },
];

export function PfPersonaSwitcher({ currentRole, onRoleChange }: PfPersonaSwitcherProps) {
  const { locale } = useApp();

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">
        {locale === "ru" ? "Переключение персоны" : "Persona Switcher"}
      </h3>
      <p className="text-sm text-stone-500 mb-4">
        {locale === "ru"
          ? "Переключите роль для демонстрации RBAC-ограничений"
          : "Switch role to demonstrate RBAC restrictions"}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {personas.map((persona) => (
          <button
            key={persona.role}
            onClick={() => onRoleChange(persona.role)}
            className={cn(
              "p-4 rounded-xl border-2 text-left transition-all",
              currentRole === persona.role
                ? "border-emerald-500 bg-emerald-50 shadow-md"
                : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg mb-2 bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm",
                persona.color
              )}
            >
              {persona.title.en.charAt(0)}
            </div>
            <div className="font-medium text-stone-800 text-sm">
              {persona.title[locale === "ru" ? "ru" : "en"]}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {persona.description[locale === "ru" ? "ru" : "en"]}
            </div>
            {currentRole === persona.role && (
              <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {locale === "ru" ? "Активен" : "Active"}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
