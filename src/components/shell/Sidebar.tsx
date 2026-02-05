"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { getVisibleModules } from "@/modules";
import { moduleIcons } from "@/modules/icons";

export function Sidebar() {
  const pathname = usePathname();
  const { locale, clientSafe } = useApp();

  const modules = getVisibleModules(clientSafe);

  return (
    <aside className="w-64 h-screen bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-r border-stone-200/50 dark:border-stone-700/50 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-stone-200/50 dark:border-stone-700/50">
        <Link href="/m/dashboard-home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="font-semibold text-stone-800 dark:text-stone-200">Wealth OS</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {modules.map((module) => {
            const href = `/m/${module.slug}`;
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={module.id}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-900/30 dark:to-amber-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm"
                    : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-200"
                )}
              >
                <span className={cn(
                  "flex-shrink-0 transition-colors",
                  isActive ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400 dark:text-stone-500"
                )}>
                  {moduleIcons[module.icon]}
                </span>
                <span className="truncate">{module.title[locale]}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-stone-200/50 dark:border-stone-700/50">
        <div className="text-xs text-stone-400 dark:text-stone-500 text-center">
          Wealth OS v1.0 MVP
        </div>
      </div>
    </aside>
  );
}
